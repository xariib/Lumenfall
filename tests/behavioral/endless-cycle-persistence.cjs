'use strict';
// Complete-engine transaction ownership around resumable cycle preparation.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const build=require('./endless-cycle-source.cjs'),{app,CLOCK,clone,P,R}=require('./forge-expansion-harness.cjs');
const raw=require('./frozen-cycle-power.cjs')(build(fs.readFileSync('index.html','utf8'))),marker="if(document.readyState==='loading'){",source=raw.replace(marker,`window.endlessQa={cancel:cancelOfflineCatchup,cache:function(){return endlessPityCache&&endlessPityCache.orbit.stats();}};`+marker);
const seed=JSON.parse(fs.readFileSync('docs/qa/endless-progression-001/candidate-ak-mature-snapshot.json.endpoint.json')),start=CLOCK+180*86400000;
seed.depth=seed.enemyDepth=16;seed.riftMode='push';seed.autoAscendEnabled=true;seed.autoAscendTargetDepth=16;seed.lastSeen=start;
let checks=0;const timings=[];function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}function ok(a,m){checks++;assert(a,m);}
function page(){const x=app(source);x.clock(start);x.q.set(clone(seed));x.q.restoreEnemy();return x;}
{
 const a=page(),b=page(),cursor=a.q.advance(.01,{kind:'offline',clockStartMs:start,resumable:true});let step,preparations=0;
 do{const t=performance.now();step=cursor.next();timings.push(performance.now()-t);if(!step.done&&step.value.preparingCycles)preparations++;}while(!step.done);
 const literalFacade=b.q.advance(.01,{kind:'offline',clockStartMs:start});
 ok(preparations>10,'orbit indexing yields while preparing without waiting for thousands of regions');eq(a.q.get(),b.q.get(),'resumable and synchronous facades have identical saved endpoint');eq(step.value,literalFacade,'resuming does not duplicate rewards or summary receipts');
}
{
 const x=page(),base=clone(x.q.get());let callback;
 x.clock(start+5000);x.q.offline((result,error)=>{callback={result,error};});
 eq(x.q.get(),base,'yielded offline work is private until its whole transaction commits');ok(x.q.endless.cache(),'first offline pump reaches private orbit preparation');ok(!x.q.endless.cache().compiled,'cancellation fixture interrupts before the orbit is fully indexed');
 x.q.endless.cancel();ok(callback&&callback.error&&/cancelled/.test(callback.error.message),'cancellation reports its established error');eq(x.q.get(),base,'cancellation retains every pre-catchup saved field');eq(x.writes.length,0,'cancelled catchup writes no partial save');x.drain();eq(x.q.get(),base,'cancelled callbacks cannot publish the private working state');
 // Reuse a partially indexed cache after a cancelled transaction. Its logical
 // count must be checked against the restored save before it can be credited.
 callback=null;x.q.offline((result,error)=>{callback={result,error};});x.drain();ok(callback&&!callback.error,'cancelled catchup can be retried');ok(callback.result.ascends>1e12,'retry actually completes the unrestricted mature cycles');
 const saved=clone(x.q.get());ok(x.storage.has(P)&&x.storage.has(R),'completed window owns primary and recovery saves');
 const reload=app(source,[...x.storage]);eq(reload.q.get(),saved,'primary reload retains exact bulk endpoint');
 const recovery=app(source,[...x.storage].filter(([key])=>key!==P));eq(recovery.q.get(),saved,'recovery reload retains exact bulk endpoint');
 const backup=x.q.export(),decoded=x.q.decode(backup);ok(decoded,'exact bulk endpoint exports and decodes');
 const imported=page();imported.clock(start+5000);imported.area.value=backup;imported.q.restore();ok(imported.storage.has(P),'backup import persists the exact endpoint through its normal transaction');const importedReload=app(source,[...imported.storage]);eq(importedReload.q.get(),saved,'backup import reload retains every bulk field');
}
for(const [primary,recovery]of [[true,false],[false,true]]){
 const x=page(),base=clone(x.q.get());x.clock(start+5000);x.fail(primary,recovery);let callback;x.q.offline((result,error)=>{callback={result,error};});x.drain();
 if(primary){ok(callback&&callback.error,'failed primary save rejects catchup');eq(x.q.get(),base,'failed primary save rolls back all exact rewards and counters');eq(x.storage.has(P),false,'failed primary did not publish a partial endpoint');}
 else{ok(callback&&!callback.error,'recovery failure retains successful primary ownership');ok(x.storage.has(P),'primary keeps committed endpoint after recovery failure');ok(x.q.get().ascendCount!==base.ascendCount,'successful primary keeps all exact earned cycles');}
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(raw).digest('hex'),preparationMaxMs:Math.max(...timings),yields:timings.length,limits:'Focused transaction and resumability checks; full overnight/general configurations and device acceptance remain separate.'}));
