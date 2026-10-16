'use strict';
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto');
const {app,CLOCK}=require('../tests/behavioral/forge-expansion-harness.cjs');
const A=require('../scripts/lib/game-amount.cjs');
const source=fs.readFileSync('index.html','utf8'),sourceSha256=crypto.createHash('sha256').update(source).digest('hex');
const bridge="window.endlessQa={push:enterPushMode,best:fieldBestNowFormation,study:function(id){return getStudyStartPlan(LONG_STUDIES.find(function(n){return n.id===id;}));},powerMult:longStudyPowerMult,queues:function(enabled){SPIRITS.forEach(function(sp){state.empowerQueue[sp.id]=enabled;});}};";
const marker="if(document.readyState==='loading'){";assert.equal(source.split(marker).length,2);
const instrumented=source.replace(marker,bridge+marker),out='validation-evidence/late-push-probe';fs.mkdirSync(out,{recursive:true});
const records=[];
for(const prefix of ['focus-f-focused-regular','focus-f-aware-regular_two']){
 const raw=fs.readFileSync('validation-evidence/'+prefix+'-snapshot.json.checkpoint.json'),c=JSON.parse(raw);
 assert.equal(c.sourceSha256,sourceSha256);
 fs.writeFileSync(out+'/'+prefix+'.origin.json',raw);
 for(const empower of [false,true]){
  const x=app(instrumented,undefined,{clockDate:true,retainWrites:false}),q=x.q,start=CLOCK+c.elapsed*1000;
  x.clock(start);q.set(c.state);
  // Expose only existing UI choices; never grant resources or alter upgrades.
  const b=q.endless;
  const plan=b.study('wispascend'),forge=q.plan('masterwork',1),heroCost=q.empowerCost('ember'),before=q.get();
  const initial={record:before.maxDepthEver,levels:{...before.spirits},lumen:before.lumen,shards:before.shards,lab:before.longStudyLevels.wispascend,forge:before.research.masterwork};
  b.push();b.best();if(empower)b.queues(true);
  const cursor=q.advance(3600,{kind:'offline',clockStartMs:start,resumable:true});let step,yields=0;const began=performance.now();
  do{step=cursor.next();if(!step.done)yields++;}while(!step.done);
  const after=q.get(),result={prefix,startingDay:c.history.length,sourceSha256,originSha256:crypto.createHash('sha256').update(raw).digest('hex'),originPolicySha256:c.policySha256,empower,requestedSec:3600,wallMs:performance.now()-began,yields,initial,prices:{nextLab:plan.cost,nextMasterwork:forge.cost,nextEmberLevel:heroCost},outcome:{record:after.maxDepthEver,depth:after.depth,levels:after.spirits,lumen:after.lumen,shards:after.shards,lab:after.longStudyLevels.wispascend,forge:after.research.masterwork},summary:step.value,state:after};
  assert.equal(step.value.elapsedSec,3600);assert(A.ge(after.maxDepthEver,initial.record));
  fs.writeFileSync(out+'/'+prefix+'-'+(empower?'empower':'hold')+'.json',JSON.stringify(result));
  records.push({prefix,startingDay:c.history.length,empower,recordBefore:initial.record,recordAfter:after.maxDepthEver,emberBefore:initial.levels.ember,emberAfter:after.spirits.ember,labBefore:initial.lab,labAfter:after.longStudyLevels.wispascend,wallMs:result.wallMs});
  console.log(JSON.stringify(records.at(-1)));
 }
}
fs.writeFileSync(out+'/summary.json',JSON.stringify({status:'MEASURED',sourceSha256,records,limits:'One-hour player-choice probe from sourced earned checkpoints; no grants, new balance or timer rules. Separate from the unchanged primary campaigns.'},null,2));
