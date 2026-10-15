'use strict';
// Repeat an already recorded earned12h workload as8h, real storage/reload,4h.
// The source is the identical hash-checked diagnostic artifact, not a new model.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const A=require('../../scripts/lib/game-amount.cjs'),{app,CLOCK,clone}=require('./forge-expansion-harness.cjs');
const whole=JSON.parse(fs.readFileSync(process.argv[2])),source=fs.readFileSync(whole.sourceArtifact,'utf8'),start=CLOCK+180*86400000;
assert.equal(whole.seconds,43200);assert.equal(whole.status,'MEASURED');assert.equal(crypto.createHash('sha256').update(source).digest('hex'),whole.sourceSha256);
const seed=JSON.parse(fs.readFileSync('docs/qa/endless-progression-001/candidate-ak-mature-snapshot.json.endpoint.json'));
seed.depth=seed.enemyDepth=16;seed.riftMode='push';seed.autoAscendEnabled=true;seed.autoAscendTargetDepth=16;
let x=app(source,undefined,{clockDate:true,retainWrites:false}),checks=0;const summaries=[],began=performance.now();x.clock(start);x.q.set(seed);x.q.restoreEnemy();
function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
function compare(a,b,path){
 if(/^saved\.canonicalAutomationClock\.[^.]+\.elapsed$/.test(path)){checks++;assert(A.valid(a)&&A.valid(b)&&Math.abs(A.ratio(a,1)-A.ratio(b,1))<=1e-9,path);return;}
 if(typeof a==='number'&&typeof b==='number'){checks++;assert(Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=1e-9*Math.max(1,Math.abs(a),Math.abs(b)),path+': '+a+' vs '+b);return;}
 if(a&&b&&typeof a==='object'&&typeof b==='object'){eq(Object.keys(a),Object.keys(b),path+' keys');for(const k of Object.keys(a))compare(a[k],b[k],path+'.'+k);}else eq(a,b,path);
}
try{
 let elapsed=0,last=performance.now();
 for(const seconds of [28800,14400]){
  x.clock(start+elapsed*1000);const cursor=x.q.advance(seconds,{kind:'offline',clockStartMs:start+elapsed*1000,resumable:true});let step;
  do{step=cursor.next();if(performance.now()-last>30000){process.stderr.write(JSON.stringify({segmentSeconds:seconds,elapsedSec:step.value&&step.value.elapsedSec,wallSeconds:(performance.now()-began)/1000})+'\n');last=performance.now();}}while(!step.done);
  summaries.push(step.value);elapsed+=seconds;x.clock(start+elapsed*1000);assert(x.q.save(),'segment save commits');checks++;
  const saved=clone(x.q.get()),cold=app(source,[...x.storage],{clockDate:true,retainWrites:false});eq(cold.q.get(),saved,'cold segment endpoint retains every saved bit');x=cold;
 }
 const expected=app(source,undefined,{clockDate:true,retainWrites:false});expected.clock(start+43200000);expected.q.set(whole.state);assert(expected.q.save());expected.q.load();
 const left=expected.q.get(),right=x.q.get();
 for(const key of ['lumen','shards','prisms','motes','sigils','ascendCount','totalKills','totalTaps','dailyStats'])eq(left[key],right[key],'overnight exact '+key);
 compare(left,right,'saved');eq(A.exactAdd(summaries[0].ascends,summaries[1].ascends),whole.summary.ascends,'split exact Ascend receipts');
 console.log(JSON.stringify({status:'PASS',checks,sourceSha256:whole.sourceSha256,seconds:43200,segments:[28800,14400],wallMs:performance.now()-began,limits:'Exact money/counters and strict physical parity across an earned8h+4h cold boundary. Human/device and full campaign acceptance remain separate.'}));
}catch(error){console.log(JSON.stringify({status:'FAIL',checks,sourceSha256:whole.sourceSha256,error:error.stack}));process.exitCode=1;}
