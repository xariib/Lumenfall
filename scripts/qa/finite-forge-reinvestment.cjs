'use strict';
// Deterministic purchasing forecast, not a years-long account simulation.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const F=require('../../tests/behavioral/forge-expansion-harness.cjs'),A=require('../lib/game-amount.cjs');
const html=fs.readFileSync(process.argv[2]||'index.html','utf8');
const rows=[];
for(const [name,depth,resourceLab]of [['reference',1001,500],['less-research',1001,100],['lower-farm',501,500],['growing-labs-and-farm',501,100]]){
 const x=F.app(html),q=x.q,s=F.seed(q);s.lumen=s.shards=0;
 s.maxDepthEver=10000;s.depth=s.enemyDepth=s.farmDepth=depth;s.farmReturnDepth=depth+9;s.riftMode='farm';s.nodes.echo=6;
 s.activeParty=['ember','gale','thorn'];for(const id of s.activeParty)s.spirits[id]=10000;
 Object.assign(s.research,{formation:250,focus:250,sense:250});
 Object.assign(s.longStudyLevels,{wispascend:500,lumenstudy:resourceLab,shardstudy:resourceLab});
 s.enemyHp=s.enemyMaxHp=q.enemyHp(depth);
 q.set(s);q.restoreEnemy();
 const active=q.defs().filter(n=>!n.retiredTo),milestones=[];let completedDay=null;
 for(let day=1;day<=1200;day++){
  if(name==='growing-labs-and-farm'){
   const progress=Math.min(1,(day-1)/365),lab=100+Math.floor(400*progress);
   let farm=501+Math.floor(500*progress);if(farm%10===0)farm--;
   q.get().longStudyLevels.lumenstudy=q.get().longStudyLevels.shardstudy=lab;
   if(q.get().depth!==farm){q.get().depth=q.get().farmDepth=farm;q.get().enemyDepth=0;q.restoreEnemy();}
  }
  // Sample production combat at the actual newly purchased Forge ranks, then
  // extrapolate this fixed day's income. Research/depth/other upgrades stay fixed.
  const before={lumen:q.get().lumen,shards:q.get().shards};
  const summary=q.advance(60,{kind:'offline',clockStartMs:F.CLOCK+(day-1)*60000});
  q.get().lumen=A.exactAdd(before.lumen,A.mul(summary.lumenGained,1440));
  q.get().shards=A.exactAdd(before.shards,A.mul(summary.shardGained,1440));
  // Max plans use real production prices/payments. Each successive day
  // prioritizes a different long path to avoid permanent catalogue-order bias.
  const ordered=active.slice(),shift=day%ordered.length;ordered.push(...ordered.splice(0,shift));
  for(const node of ordered)if(q.plan(node.id,'max').affordable)assert(q.buy(node.id,'max'));
  const levels=Object.fromEntries(active.map(n=>[n.id,q.get().research[n.id]])),complete=active.filter(n=>levels[n.id]>=n.levelCap).length;
  if([7,14,90,180,365,730,1095,1200].includes(day)||complete===active.length)milestones.push({day,complete,total:active.length,levels,lumen:q.get().lumen,shards:q.get().shards});
  if(complete===active.length){completedDay=day;break;}
 }
 rows.push({name,rift:depth,resourceLab,completedDay,milestones});
}
if(process.argv.includes('--check')){
 const reference=rows.find(r=>r.name==='reference');
 assert(reference.completedDay>=730&&reference.completedDay<=1095,'mature reference completes between two and three productive years');
 for(const row of rows)assert(row.milestones.find(m=>m.day===14).complete<24,'a generous fortnight cannot finish the Forge '+row.name);
 assert(rows.find(r=>r.name==='less-research').completedDay===null,'less economy research leaves later goals after1200days');
}
console.log(JSON.stringify({status:'measured',sourceSha256:crypto.createHash('sha256').update(html).digest('hex'),
 assumptions:'Mature benchmarks grant record10000, Wisp10000, legacy economy250 and stated completed Labs at start. All active Forge starts0. Each day samples60 actual authoritative offline seconds, extrapolates to24 productive hours and reinvests using real Max purchases. Growing case grants linear farm501→1001 and economy Labs100→500 over365days; other cases hold them fixed. Unlock reachability, research work/funding, Empowers, Ascends and human play are not simulated; this cannot establish a fresh-account completion date.',rows},null,2));
