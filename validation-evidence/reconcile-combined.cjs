'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const re=/^<<<<<<< HEAD\r?\n([\s\S]*?)^=======\r?\n([\s\S]*?)^>>>>>>> local\/full-debug\r?\n/gm;
function resolve(file,expected,pick){let n=0;const s=fs.readFileSync(file,'utf8'),out=s.replace(re,(_,a,b)=>pick(n++,a,b));assert.equal(n,expected,file);assert(!out.includes('<<<<<<<'));fs.writeFileSync(file,out);}
resolve('index.html',25,(i,a,b)=>{
 if(i===1)return a.replace('studySpeedTargets = {};','studySpeedTargets = {}, studyBoostHours = {};');
 if(i===6)return a;
 if(i===8)return b.slice(0,b.indexOf('    var ultimateHtml ='))+a.slice(a.indexOf('    var ultimateHtml ='));
 if(i===9){const from=`</strong><span class="mono">' + costIcon('lumen') + formatNum(cost) + '</span></button>`;assert(a.includes(from));return a.replace(from,`</strong>' + purchasePriceMarkup('lumen',cost,'mono') + '</button>`);}
 if(i===17)return b.replace('active.remainingSec -= studyWorkBetween(active,elapsedSec,nowMs);','active.remainingSec=Amount.sub(active.remainingSec,studyWorkBetween(active,elapsedSec,nowMs));');
 if(i===19)return b.replace('summary.motesGained += moteGain;','summary.motesGained=Amount.add(summary.motesGained,moteGain);');
 if(i===20)return b.replace('if(luminousKills>0)','if(Amount.gt(luminousKills,0))').replace('summary.motesGained += moteGain;','summary.motesGained=Amount.add(summary.motesGained,moteGain);').replace('summary.luminousKills += luminousKills;','summary.luminousKills=Amount.add(summary.luminousKills,luminousKills);');
 if(i===21)return a.replace('  var clockStartWholeSec','  policy.nowMs=clockStartMs;\n  var clockStartWholeSec');
 if(i===22)return a.replace('simulationNextStudySeconds()','simulationNextStudySeconds(nowMs)').replace('simulationAdvanceStudyProgress(next);','simulationAdvanceStudyProgress(next,nowMs);');
 return b;
});
resolve('docs/PROJECT_STATE.md',1,(_,a,b)=>a+'\n'+b);
resolve('tests/behavioral/bridge.js',1,(_,a,b)=>a+b);
resolve('tests/behavioral/prelude.js',1,(_,a,b)=>b.replace('if(forgeTransactionScenario','if(scenario.startsWith(\'lifecycle-\') || forgeTransactionScenario'));
resolve('tests/behavioral/forge-lab-caps.cjs',2,(i,a,b)=>i===0?a.replace('379,\'existing discounted speed price\'','22000,\'discount applies to new timed speed price\''):a.replace('eq(oldFields(f.get()),oldFields(cf.get()),',`const expectedOld=oldFields(cf.get());expectedOld.studyBoosts={};expectedOld.studyBoostHours=l.fresh().studyBoostHours;expectedOld.moteNextAtMs=0;Object.keys(expectedOld.studyUseMotes).forEach(id=>expectedOld.studyUseMotes[id]=false);eq(oldFields(f.get()),expectedOld,`));
resolve('tests/behavioral/farm-conservation.js',2,(i,a,b)=>i===0?'    return t.withHp(f.s.enemyMaxHp,function(){\n'+b:b.replace("    near(r.summary.lumenGained",'    var depth=f.s.depth<=100?f.s.depth:100+40*Math.log1p((f.s.depth-100)/40);\n    near(r.summary.lumenGained').replaceAll('Math.pow(1.11,f.s.depth)','Math.pow(1.11,depth)').replaceAll('Math.pow(1.09,f.s.depth)','Math.pow(1.09,depth)').replace('var main=fixture(1,.73,false,.975,1);','var main=t.withHp(11,function(){return fixture(1,.73,false,.975,1);});'));
resolve('tests/behavioral/farm-numerical.js',2,(i,a,b)=>i===0?a.replace('motes+=lk','motes=Math.min(1,motes+lk)'):a.slice(0,a.indexOf('    var buys='))+b.slice(b.indexOf('    ok(r.summary.studySpeedPurchases')));
resolve('tests/behavioral/lab-motes.js',2,(i,a,b)=>i===1?b.replace('schemaVersion===4','schemaVersion===5'):b);
for(const file of ['lab-ui.js','measured-inquiry.js'])resolve('tests/behavioral/'+file,1,(_,a,b)=>{const first=b.split('\n')[0],wrapped=first.replace("q('[data-speed-study", "b.labMotes.input(function(){q('[data-speed-study").replace('.click();','.click();});');return wrapped+'\n'+b.slice(first.length+1);});
resolve('tests/behavioral/resonate-clarity.cjs',1,(_,a,b)=>b);
console.log('Resolved explicit combined Lab/UI conflicts; numeric and behavioral validation still required.');
