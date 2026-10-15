'use strict';
// Bounded diagnosis of a captured, earned policy input. Partial runs do not
// publish a campaign checkpoint and cannot count as campaign acceptance.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict'),{app,CLOCK}=require('./forge-expansion-harness.cjs');
const [sourcePath,inputPath,out]=process.argv.slice(2),source=fs.readFileSync(sourcePath,'utf8'),bytes=fs.readFileSync(inputPath),input=JSON.parse(bytes),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const transition=process.env.LUMENFALL_PROBE_ENGINE_TRANSITION==='1',seconds=Number(process.env.LUMENFALL_PROBE_SECONDS||input.seconds);
if(!transition)assert.equal(hash(source),input.sourceSha256,'exact captured source');assert(seconds>0&&seconds<=input.seconds,'bounded captured duration');
const x=app(source,undefined,{clockDate:true,retainWrites:false}),start=CLOCK+input.elapsed*1000;x.clock(start);x.q.set(input.state);
const began=performance.now(),limit=Number(process.env.LUMENFALL_PROBE_MS||30000),cursor=x.q.advance(seconds,{kind:input.kind||'offline',clockStartMs:start,offlineWindowStartMs:start,resumable:true});let step,yields=0,last;
do{step=cursor.next();if(!step.done){yields++;last=step.value;}}while(!step.done&&performance.now()-began<limit);
const elapsed=performance.now()-began;if(!step.done)cursor.return();
fs.writeFileSync(out,JSON.stringify({status:step.done?'MEASURED_WINDOW':'PARTIAL_DIAGNOSIS',sourceSha256:hash(source),parentSourceSha256:input.sourceSha256,engineTransition:transition,seconds,inputSha256:hash(bytes),wallMs:elapsed,yields,last,summary:step.done?step.value:null,state:x.q.get(),limits:'Captured earned input workload only; not completed campaign or device acceptance.'}));
console.log(JSON.stringify({status:step.done?'MEASURED_WINDOW':'PARTIAL_DIAGNOSIS',wallMs:elapsed,yields,last}));
