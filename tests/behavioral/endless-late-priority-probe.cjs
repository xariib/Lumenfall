'use strict';
// A separate player-policy continuation from a sourced earned checkpoint.
// Never overwrite/rebase the primary campaign or grant resources/upgrades.
const fs=require('node:fs'),zlib=require('node:zlib'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {app,CLOCK}=require('./forge-expansion-harness.cjs'),A=require('../../scripts/lib/game-amount.cjs');
const [file,checkpoint,daysText,out]=process.argv.slice(2),days=Number(daysText||7);
const burstPrisms=process.argv.includes('--burst-prisms');
assert(file&&checkpoint&&out&&Number.isInteger(days)&&days>0&&days<=30);
const raw=fs.readFileSync(checkpoint),c=JSON.parse(checkpoint.endsWith('.gz')?zlib.gunzipSync(raw):raw),source=fs.readFileSync(file,'utf8'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const policySha256=hash(Buffer.concat([fs.readFileSync(__filename),fs.readFileSync(require.resolve('./forge-expansion-harness.cjs')),fs.readFileSync(require.resolve('../../scripts/lib/game-amount.cjs')),Buffer.from(JSON.stringify({burstPrisms}))]));
assert.equal(hash(source),c.sourceSha256,'same accepted game source');
assert(c.milestones.fullRosterDevelopment!==undefined,'post-roster earned starting state');
const marker="if(document.readyState==='loading'){",bridge="window.endlessQa={push:enterPushMode,best:fieldBestNowFormation,eligible:ascendEligible,mastery:buyWispMastery,masteryPlan:getWispMasteryPlan,wisps:function(){return SPIRITS;},autoFarm:function(on){setAutoAscendClearedTarget('15');state.autoAscendEnabled=on;},queues:function(){SPIRITS.forEach(function(sp){state.empowerQueue[sp.id]=true;});state.studyQueue.wispascend=false;state.autoAscendEnabled=false;}};";
assert.equal(source.split(marker).length,2);
const x=app(source.replace(marker,bridge+marker),undefined,{clockDate:true,retainWrites:false}),q=x.q;
let elapsed=c.elapsed;const began=performance.now(),actions=[],history=[],windows=[];
x.clock(CLOCK+elapsed*1000);q.set(c.state);const b=q.endless,origin=JSON.parse(JSON.stringify(q.get()));
function advance(seconds,kind){
 const start=CLOCK+elapsed*1000;x.clock(start);const cursor=q.advance(seconds,{kind,clockStartMs:start,offlineWindowStartMs:start,resumable:true});let step;do{step=cursor.next();}while(!step.done);
 assert.equal(step.value.elapsedSec,seconds);elapsed+=seconds;x.clock(CLOCK+elapsed*1000);if(kind==='offline'){q.get().totalOfflineSeconds=A.add(q.get().totalOfflineSeconds,seconds);q.achievements();}windows.push({at:elapsed,kind,summary:step.value});
}
function record(){const s=q.get();return{elapsed,day:elapsed/86400,rift:s.maxDepthEver,ascends:s.ascendCount,lab:s.longStudyLevels.wispascend,forge:s.research.masterwork,mastery:{...s.wispMastery},lumen:s.lumen,prisms:s.prisms,sigils:s.sigils};}
for(let day=0;day<days;day++){
 for(let visit=0;visit<2;visit++){
  b.queues();b.push();b.best();
  const forge=q.plan('masterwork',1);
  if(forge.buyCount===1&&A.le(forge.cost.lumen,A.mul(q.get().lumen,.75))){const before={lumen:q.get().lumen,shards:q.get().shards};assert(q.buy('masterwork',1));assert.equal(A.cmp(A.exactSub(before.lumen,q.get().lumen),forge.cost.lumen),0);assert.equal(A.cmp(A.exactSub(before.shards,q.get().shards),forge.cost.shard),0);actions.push({at:elapsed,kind:'forge',cost:forge.cost});}
  for(const sp of b.wisps()){const plan=b.masteryPlan(sp);if(plan.affordable){const rank=q.get().wispMastery[sp.id];assert(b.mastery(sp));assert.equal(q.get().wispMastery[sp.id],rank+1);actions.push({at:elapsed,kind:'mastery',id:sp.id,cost:plan.cost});}}
  let activeRemaining=600;
  const eligible=b.wisps().map(sp=>b.masteryPlan(sp)).filter(plan=>plan.eligible),needed=eligible.length?eligible.reduce((least,plan)=>A.min(least,plan.cost.prism),eligible[0].cost.prism):0;
  if(burstPrisms&&A.lt(q.get().prisms,needed)){
   if(b.eligible())q.ascend();b.queues();b.autoFarm(true);const before={ascends:q.get().ascendCount,prisms:q.get().prisms};
   advance(60,'live');b.autoFarm(false);b.push();advance(10,'live');activeRemaining-=70;
   actions.push({at:elapsed,kind:'prism-farm',clearedTarget:15,activeSeconds:60,ascends:A.exactSub(q.get().ascendCount,before.ascends),prisms:A.exactSub(q.get().prisms,before.prisms)});
   for(const sp of b.wisps()){const plan=b.masteryPlan(sp);if(plan.affordable){const rank=q.get().wispMastery[sp.id];assert(b.mastery(sp));assert.equal(q.get().wispMastery[sp.id],rank+1);actions.push({at:elapsed,kind:'mastery',id:sp.id,cost:plan.cost});}}
  }
  // The same two ten-minute visits as the regular free policy.
  const first=Math.min(300,activeRemaining);advance(first,'live');b.best();advance(activeRemaining-first,'live');
  advance(42600,'offline');
 }
 // Invest the run before one explicit daily Prism-farming Ascend.
 if(!burstPrisms&&b.eligible()){const before=q.get().ascendCount;q.ascend();assert(A.gt(q.get().ascendCount,before));b.queues();actions.push({at:elapsed,kind:'ascend'});}
 history.push(record());
 fs.writeFileSync(out,JSON.stringify({status:'MEASURED_PARTIAL',sourceSha256:c.sourceSha256,originSha256:hash(raw),originPolicySha256:c.policySha256,policySha256,burstPrisms,startingDay:c.history.length,days:history.length,history,actions,windows,state:q.get()}));
}
const s=q.get();assert(history.some(r=>r.rift>origin.maxDepthEver),'ordinary post-roster choices must resume pushing');
for(const id of Object.keys(origin.wispMastery)){assert(s.wispMastery[id]>=origin.wispMastery[id]);assert.equal(s.heroRarity[id],origin.heroRarity[id]);assert.equal(s.wispModules[id],origin.wispModules[id]);assert.equal(s.wispUltimate[id],origin.wispUltimate[id]);}
const result={status:'MEASURED',sourceSha256:c.sourceSha256,originSha256:hash(raw),originPolicySha256:c.policySha256,policySha256,burstPrisms,startingDay:c.history.length,days,visitsPerDay:2,activeSecondsPerVisit:600,wallMs:performance.now()-began,originRecord:origin.maxDepthEver,history,actions,windows,state:s,limits:'Separate seven-day player-policy continuation. Existing queues/Push/Formation/Forge/Mastery/Ascend only; no grants, new balance, timer changes or primary-run rebase. Future Wisp Lab starts disabled after its current gates are already met; running projects are never cancelled.'};
fs.writeFileSync(out,JSON.stringify(result));console.log(JSON.stringify({status:result.status,startingDay:result.startingDay,days,originRecord:origin.maxDepthEver,record:s.maxDepthEver,forge:s.research.masterwork,mastery:s.wispMastery,wallMs:result.wallMs}));
