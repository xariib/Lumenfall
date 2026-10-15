'use strict';
// Bounded diagnostic: report incomplete work honestly rather than hanging QA.
const fs=require('node:fs'),crypto=require('node:crypto'),{app,CLOCK}=require('./forge-expansion-harness.cjs');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8');
const savePath=process.argv[3]||'docs/qa/endless-progression-001/candidate-aa-mature-snapshot.json.endpoint.json';
const save=fs.readFileSync(savePath),state=JSON.parse(save),q=app(source).q;
// Use the actual earned mature campaign endpoint; change only the player's
// available Auto-Ascend setting and choose Push at its ready threshold.
state.depth=state.enemyDepth=16;state.riftMode='push';state.autoAscendEnabled=true;state.autoAscendTargetDepth=15;
q.set(state);q.restoreEnemy();
const initial=q.get().ascendCount,started=performance.now(),requestedSec=.001;
const cursor=q.advance(requestedSec,{kind:'offline',clockStartMs:CLOCK,resumable:true});
let batch,batches=0;do{batch=cursor.next();batches++;}while(!batch.done&&batches<10);
cursor.return();
const report={status:batch.done?'PASS':'INCOMPLETE',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),saveSha256:crypto.createHash('sha256').update(save).digest('hex'),requestedSec,processedSec:batch.value.elapsedSec,batches,ascends:q.get().ascendCount-initial,wallMs:performance.now()-started,limit:'Existing unrestricted target15; no new cooldown, target restriction or changed rewards. Failure to finish this tiny window blocks extended automation acceptance.'};
console.log(JSON.stringify(report,null,2));if(!batch.done)process.exitCode=2;
