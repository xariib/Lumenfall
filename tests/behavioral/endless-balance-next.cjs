'use strict';
// Isolated calibration only. Never write a new model over the product source.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const input=process.argv[2]||'index.html',output=process.argv[3]||'docs/qa/endless-progression-001/candidate-p.html';
assert.notEqual(require('node:path').resolve(input),require('node:path').resolve(output));
const original=fs.readFileSync(input,'utf8');let source=original;
const moteGrowth=Number(process.argv[4]||0);
assert(moteGrowth===0||moteGrowth>=1&&moteGrowth<=3,'supported calibration range');
const maxWorkSec=Number(process.argv[5]||777600);
assert(Number.isSafeInteger(maxWorkSec)&&maxWorkSec>=86400&&maxWorkSec<=7776000,'bounded calibration work');
function replace(from,to){assert.equal(source.split(from).length,2,'one calibration anchor '+from);source=source.replace(from,to);}
replace('hpBase:60,curveStart:100,curveWidth:40','masterworkPowerGrowth:1.25,tailStart:1000,tailSlope:.03,hpBase:60,curveStart:100,curveWidth:40');
if(maxWorkSec!==777600)replace('maxStudyWorkSec:777600','maxStudyWorkSec:'+maxWorkSec);
replace('unlockDepth:120,lumenBase:50000000,lumenGrowth:1.35,shardBase:500000','unlockDepth:70,lumenBase:1000000,lumenGrowth:1.35,shardBase:25000');
replace('return Amount.mul(Amount.mul(spiritPower(sp,level),RARITY_MULT[tier]),wispMasteryFactor(sp.id));',"return Amount.mul(Amount.mul(Amount.mul(spiritPower(sp,level),RARITY_MULT[tier]),wispMasteryFactor(sp.id)),Amount.pow(ENDLESS_PROGRESSION.masterworkPowerGrowth,researchLevel('masterwork')));");
replace("function forgeBossPolicyActive(){","function forgeBossPolicyActive(){if(researchLevel('masterwork')>0)return true;");
replace('function endlessCurveDepth(depth){return depth<=ENDLESS_PROGRESSION.curveStart?depth:ENDLESS_PROGRESSION.curveStart+ENDLESS_PROGRESSION.curveWidth*Math.log1p((depth-ENDLESS_PROGRESSION.curveStart)/ENDLESS_PROGRESSION.curveWidth);}',`function endlessCurveDepth(depth){
 var g=ENDLESS_PROGRESSION;if(depth>1e9)return endlessCurveDepth(1e9)+g.curveWidth*Math.log(depth/1e9);
 if(depth>g.tailStart)return endlessCurveDepth(g.tailStart)+(depth-g.tailStart)*g.tailSlope;
 return depth<=g.curveStart?depth:g.curveStart+g.curveWidth*Math.log1p((depth-g.curveStart)/g.curveWidth);
}`);
replace("longStudyLevel('wispascend'),g.lab[tier]","longStudyLevel('wispascend'),g.lab[tier]+Math.floor(SPIRITS.indexOf(sp)*tier/2)");
replace("longStudyLevel('wispascend'),g.lab)","longStudyLevel('wispascend'),g.lab+2*SPIRITS.indexOf(sp))");
// Price adjustment applies to future uncapped starts only; paid work remains.
replace('return Amount.pow(growth,level);','return Amount.pow(node.levelCap===undefined?1.6:growth,level);');
replace('return Amount.mul(Amount.pow(growth,ENDLESS_PROGRESSION.lateStudyCostStart),','return Amount.mul(Amount.pow(1.6,ENDLESS_PROGRESSION.lateStudyCostStart),');
replace('ember:15000,tide:18750,stone:22500,gale:30000,thorn:37500,void:45000,aurora:60000,titan:75000','ember:500000,tide:750000,stone:1000000,gale:1500000,thorn:2000000,void:3000000,aurora:4000000,titan:6000000');
replace('sigilBase:5000,sigilStep:500','sigilBase:500000,sigilStep:50000');
if(moteGrowth){
 replace('speedMoteGrowth:1,','speedMoteGrowth:'+moteGrowth+',');
}
fs.writeFileSync(output,source);fs.writeFileSync(output.replace(/\.html$/,'.json'),JSON.stringify({status:'EXPERIMENT',baseSourceSha256:crypto.createHash('sha256').update(original).digest('hex'),sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),moteGrowth,maxWorkSec,changes:['Masterwork opens five ranks and compounds all own Wisp Power by25%/level, including abilities but no Support buff change','Masterwork unlock70, costs1m Lumen/25k Shards, growth1.35','effective depth linear .03 per Rift after1000, logarithmic again above1e9 for representable exponents','future uncapped Lab base growth1.6 through30, then1.35; original capped prices/paid work/speed untouched','later Wisps require up to14 more completed Wisp Ascendancy levels for Mythic/Ultimate','Ultimate500k–6m Sigils, Mastery500k+50kr Sigils','optional future uncapped speed Mote prices scale by completed project level; existing speed values/paid work unchanged'],limits:'Calibration proposal; not applied or accepted. Contextual speed UI prices still require implementation before accepting the scaled model.'},null,2));
