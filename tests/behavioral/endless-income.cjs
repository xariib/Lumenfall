'use strict';
// Independent reward and Ultimate accounting oracles. BigInt stays in Node QA.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone,P,R}=require('./forge-expansion-harness.cjs');
const amount=require('../../scripts/lib/game-amount.cjs');
const original=fs.readFileSync(process.argv[2]||'index.html','utf8');
const source=original.replace("if(document.readyState==='loading'){",'window.endlessQa={ultimateCost:ultimateSigilCost,ultimatePlan:getWispUltimatePlan};if(document.readyState===\'loading\'){');
let checks=0;function equal(a,b,label){checks++;assert.deepEqual(a,b,label);}function ok(a,label){checks++;assert(a,label);}
function integer(value){if(typeof value==='number')return BigInt(value);const [d,e]=value.split('e');return Number(e)>=0?BigInt(d)*10n**BigInt(e):BigInt(d)/10n**BigInt(-Number(e));}
{
 const {q}=app(source);
 for(let cartography=0;cartography<=5;cartography++){
  q.get().longStudyLevels.sigilcartography=cartography;
  for(let depth=1;depth<=6000;depth++)equal(q.sigils(depth),Math.max(1,Math.floor(depth/10))+cartography,'Cartography retains flat added Sigils');
  for(let depth=6010;depth<=1000000;depth+=10){
   const extra=BigInt(depth-6000),base=BigInt(Math.floor(depth/10));
   const expected=base*(10000n+extra*extra)/10000n+BigInt(cartography);
   equal(integer(q.sigils(depth)),expected,'independent late Sigil amount');
  }
 }
 for(const depth of [6001,6005,6040,6100,6500,7000,8000]){
  const extra=BigInt(depth-6000),base=BigInt(Math.floor(depth/10));
  equal(integer(q.sigils(depth)),base*(10000n+extra*extra)/10000n+5n,'boundary floor happens once before flat Cartography');
 }
 for(const depth of [1e110,1e200,Number.MAX_VALUE]){const reward=q.sigils(depth);ok(amount.valid(reward)&&amount.wide(reward)&&amount.gt(reward,0),'Sigil rewards survive native overflow');}
 for(const [depth,wallet]of [[6000,'1e400'],[7000,Number.MAX_VALUE]]){
  const s=q.fresh();s.depth=s.enemyDepth=s.maxDepthEver=depth;s.sigils=wallet;s.longStudyLevels.sigilcartography=5;
  q.set(s);q.restoreEnemy();const before=integer(q.get().sigils),reward=BigInt(depth===6000?605:70705),summary=q.kill('offline');
  equal(integer(q.get().sigils),before+reward,'actual boss payout exactly credits every earned Sigil');equal(integer(summary.sigilsGained),reward,'actual boss payout summary');
 }
}
const prices={ember:40000000,tide:50000000,stone:65000000,gale:85000000,thorn:110000000,void:140000000,aurora:180000000,titan:240000000};
for(const [id,base]of Object.entries(prices))for(const analysis of [0,1,10]){
 const x=app(source),q=x.q,b=q.endless,s=q.fresh();
 s.spirits[id]=140;s.heroRarity[id]=5;s.wispModules[id]=20;s.maxDepthEver=200;s.depth=100;s.ascendCount=50;
 s.longStudyLevels.wispascend=process.argv.includes('--prior-ak')?46:84+12*Object.keys(prices).indexOf(id);s.longStudyLevels.ultimateanalysis=analysis;s.research.arcanecal=10;s.sigils='1e400';
 s.activeStudies=[{id:'guardmastery',remainingSec:15,totalDurationSec:20,speedMult:3}];q.set(s);
 const cost=base*(100-2*analysis)/100;
 equal(b.ultimateCost(q.sp(id)),cost,'independent Ultimate price '+id);ok(b.ultimatePlan(q.sp(id)).affordable,'developed Wisp can buy Ultimate '+id);
 const before=clone(q.get()),slots=[x.storage.get(P),x.storage.get(R)];x.fail(true,false);
 equal(q.ultimate(id),false,'failed primary Ultimate returns false '+id);equal(q.get(),before,'failed Ultimate retains wallet, rank and paid work '+id);equal([x.storage.get(P),x.storage.get(R)],slots,'failed Ultimate leaves saved slots unchanged '+id);
 x.fail(false,false);ok(q.ultimate(id),'real Ultimate purchase '+id);equal(integer(q.get().sigils),10n**400n-BigInt(cost),'wide Ultimate debit '+id);equal(q.get().wispUltimate[id],true,'Ultimate granted once '+id);
 const endpoint=clone(q.get());q.load();equal(q.get(),endpoint,'Ultimate cold normalization '+id);
 const short=clone(before);short.sigils=cost-1;q.set(short);const rejected=clone(q.get());equal(q.ultimate(id),false,'one Sigil short rejects '+id);equal(q.get(),rejected,'rejected Ultimate changes nothing '+id);
 short.sigils=cost;q.set(short);ok(q.ultimate(id),'exactly funded Ultimate '+id);equal(q.get().sigils,0,'exactly funded debit empties wallet '+id);
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(original).digest('hex'),limits:'Integer reward oracle through Rift1000000; larger generated rewards use the defined floating curve with a wide representation. All eight Ultimate prices, discounts, debits, rollback and boundaries are exact.'}));
