'use strict';
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto');
const {app,CLOCK}=require('../tests/behavioral/forge-expansion-harness.cjs'),A=require('../scripts/lib/game-amount.cjs');
const source=fs.readFileSync('index.html','utf8'),sourceSha256=crypto.createHash('sha256').update(source).digest('hex'),marker="if(document.readyState==='loading'){";
const bridge="window.endlessQa={push:enterPushMode,best:fieldBestNowFormation,queues:function(){SPIRITS.forEach(function(sp){state.empowerQueue[sp.id]=true;});}};";
const instrumented=source.replace(marker,bridge+marker),prefix='focus-f-aware-regular_two',out='validation-evidence/late-push-probe';
const raw=fs.readFileSync(out+'/'+prefix+'.origin.json'),c=JSON.parse(raw);assert.equal(c.sourceSha256,sourceSha256);
const records=[];
for(const forge of [false,true]){
 const x=app(instrumented,undefined,{clockDate:true,retainWrites:false}),q=x.q,start=CLOCK+c.elapsed*1000;x.clock(start);q.set(c.state);const b=q.endless;
 const plan=q.plan('masterwork',1),before=JSON.parse(JSON.stringify(q.get()));
 if(forge){assert.equal(plan.buyCount,1,'the real next Forge purchase is affordable');assert(q.buy('masterwork',1));assert.equal(q.get().research.masterwork,before.research.masterwork+1);assert.equal(A.cmp(A.exactSub(before.lumen,q.get().lumen),plan.cost.lumen),0);assert.equal(A.cmp(A.exactSub(before.shards,q.get().shards),plan.cost.shard),0);}
 b.push();b.best();b.queues();
 const cursor=q.advance(43200,{kind:'offline',clockStartMs:start,resumable:true});let step,yields=0;const began=performance.now();do{step=cursor.next();if(!step.done)yields++;}while(!step.done);
 const after=q.get();assert.equal(step.value.elapsedSec,43200);const result={prefix,startingDay:c.history.length,sourceSha256,originSha256:crypto.createHash('sha256').update(raw).digest('hex'),forgePurchase:forge,forgeCost:forge?plan.cost:null,requestedSec:43200,wallMs:performance.now()-began,yields,before:{record:before.maxDepthEver,lab:before.longStudyLevels.wispascend,forge:before.research.masterwork,levels:before.spirits,lumen:before.lumen},after:{record:after.maxDepthEver,depth:after.depth,lab:after.longStudyLevels.wispascend,forge:after.research.masterwork,levels:after.spirits,lumen:after.lumen},summary:step.value,state:after};
 fs.writeFileSync(out+'/'+prefix+'-overnight-'+(forge?'forge':'empower')+'.json',JSON.stringify(result));records.push({forge,recordBefore:before.maxDepthEver,recordAfter:after.maxDepthEver,labBefore:before.longStudyLevels.wispascend,labAfter:after.longStudyLevels.wispascend,wallMs:result.wallMs});console.log(JSON.stringify(records.at(-1)));
}
fs.writeFileSync(out+'/overnight-summary.json',JSON.stringify({status:'MEASURED',sourceSha256,startingDay:c.history.length,records,limits:'Existing player controls and exact real Forge debit from an earned checkpoint; no resource grant, source balance change or primary-campaign rebase.'},null,2));
