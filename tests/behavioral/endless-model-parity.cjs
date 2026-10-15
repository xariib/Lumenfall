'use strict';
// Bind measured model evidence to final product bytes using earned save states.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone,CLOCK}=require('./forge-expansion-harness.cjs');
const [modelPath,productPath,checkpointPath]=process.argv.slice(2);
assert(modelPath&&productPath&&checkpointPath,'model, product and earned checkpoint required');
const model=fs.readFileSync(modelPath,'utf8'),product=fs.readFileSync(productPath,'utf8'),checkpointBytes=fs.readFileSync(checkpointPath),checkpoint=JSON.parse(checkpointBytes);
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
assert.equal(checkpoint.sourceSha256,hash(model),'seed was measured on the exact model');
const at=CLOCK+checkpoint.elapsed*1000,rows=[];
function boot(source,push){
 const marker="if(document.readyState==='loading'){";assert.equal(source.split(marker).length,2);
 const x=app(source.replace(marker,'window.endlessQa={push:enterPushMode};'+marker),undefined,{clockDate:true});
 x.q.set(clone(checkpoint.state));x.clock(at);
 if(push){assert(x.q.get().owned.autoascend,'earned Auto-Ascend required');x.q.endless.push();x.q.get().autoAscendEnabled=true;x.q.get().autoAscendTargetDepth=Math.max(15,x.q.get().depth-1);}
 else x.q.restoreEnemy();
 return x;
}
for(const push of [false,true]){
 const a=boot(model,push),b=boot(product,push),started=performance.now();
 const left=a.q.advance(28800,{kind:'offline',clockStartMs:at,offlineWindowStartMs:at});
 const right=b.q.advance(28800,{kind:'offline',clockStartMs:at,offlineWindowStartMs:at});
 // No tolerance: both use the same earned state, clocks and economic model.
 assert.deepEqual(b.q.get(),a.q.get(),'entire earned eight-hour endpoint agrees');
 assert.deepEqual(right,left,'entire chronological summary agrees');
 if(push)assert(right.ascends>=1,'configured window must actually exercise Auto-Ascend');
 rows.push({mode:push?'already-cleared target Auto-Ascend':'earned endpoint mode',seconds:28800,kills:right.kills,ascends:right.ascends,wallMs:performance.now()-started});
}
console.log(JSON.stringify({status:'PASS',modelSha256:hash(model),productSha256:hash(product),checkpointSha256:hash(checkpointBytes),rows,limits:'Exact paired continuations of one earned snapshot, including one explicit player Push/Auto-Ascend configuration; not independent balance calibration or device acceptance.'},null,2));
