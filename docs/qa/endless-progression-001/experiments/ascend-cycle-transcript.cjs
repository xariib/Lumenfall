'use strict';
// Observe real, earned gameplay. No replacement combat/rewards or progress grants.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,CLOCK,clone}=require('../../../../tests/behavioral/forge-expansion-harness.cjs');
const original=fs.readFileSync('index.html','utf8'),path='docs/qa/endless-progression-001/candidate-ak-mature-snapshot.json.endpoint.json',save=fs.readFileSync(path,'utf8');
const checkpoint=fs.readFileSync('docs/qa/endless-progression-001/candidate-ak-mature-snapshot.json.checkpoint.json','utf8'),startMs=CLOCK+JSON.parse(checkpoint).elapsed*1000;
const hook=`window.endlessQa=(function(){
 var enabled=false,rows=[],ops=[],seconds=0,last=null;
 var passive=simulationApplyPushPassive,kill=simulationDefeatEnemy,reward=forgeAbilityRewards,ascend=applyAscendMutation;
 function snapshot(){return clonePersistedValue(state);}
 simulationApplyPushPassive=function(dt,dps,policy,summary){
   if(enabled){
     if(last!==state.ascendCount){
       if(last!==null)rows.push({seconds:seconds,ops:ops,state:snapshot()});
       if(rows.length>=50)throw Error('TRANSCRIPT COMPLETE');
       last=state.ascendCount;seconds=0;ops=[];
     }
     ops.push({kind:'interval',depth:state.depth,seconds:dt,dps:dps});seconds+=dt;
   }
   return passive.apply(this,arguments);
 };
 simulationDefeatEnemy=function(policy,summary){
   if(enabled)ops.push({kind:'kill',depth:state.depth,luminous:state.enemyIsLuminous,scale:simulationRewardScale(policy)});
   return kill.apply(this,arguments);
 };
 forgeAbilityRewards=function(sp,level,hit,hp){var value=reward.apply(this,arguments);if(enabled)ops.push({kind:'ability',id:sp.id,depth:state.depth,level:level,rewards:value});return value;};
 applyAscendMutation=function(){if(enabled)ops.push({kind:'ascend',before:state.lumen});return ascend.apply(this,arguments);};
 return {enable:function(){enabled=true;},rows:function(){return rows;}};
})();if(document.readyState==='loading'){
`;
assert.equal(original.split("if(document.readyState==='loading'){").length,2);
const page=app(original.replace("if(document.readyState==='loading'){",hook)),q=page.q,s=JSON.parse(save);
page.clock(startMs);s.depth=s.enemyDepth=16;s.riftMode='push';s.autoAscendEnabled=true;s.autoAscendTargetDepth=16;q.set(s);q.restoreEnemy();q.endless.enable();
assert.throws(()=>q.advance(.001,{kind:'offline',clockStartMs:startMs}),/TRANSCRIPT COMPLETE/);
const rows=q.endless.rows(),keys=rows.map(r=>JSON.stringify([r.state.spirits,r.state.activeParty,r.state.heroResource,r.state.supportBuffs,r.state.supportRecastUntil])),matches=[];
for(let i=0;i<keys.length;i++)for(let j=0;j<i;j++)if(keys[i]===keys[j]){matches.push({before:j,after:i,period:i-j});break;}
const out={status:'OBSERVED; no engine acceleration',sourceSha256:crypto.createHash('sha256').update(original).digest('hex'),saveSha256:crypto.createHash('sha256').update(save).digest('hex'),checkpointSha256:crypto.createHash('sha256').update(checkpoint).digest('hex'),configured:{clockStartMs:startMs,depth:16,riftMode:'push',target:16,enabled:true},matches,rows};
fs.writeFileSync('validation-evidence/ascend-cycle-transcript.json',JSON.stringify(out,null,2));
console.log(JSON.stringify({status:out.status,rows:rows.length,matches:matches.slice(0,8),sample:rows.slice(5,10).map(r=>({seconds:r.seconds,casts:r.ops.filter(o=>o.kind==='ability'),kills:r.ops.filter(o=>o.kind==='kill').length,lumen:r.state.lumen,resource:r.state.heroResource})),queues:{research:rows[0].state.researchQueue,studies:rows[0].state.studyQueue}}));
