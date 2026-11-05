'use strict';
// Bind the existing frozen vectors only after an independent paired replay.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process'),{Worker,isMainThread,workerData,parentPort}=require('node:worker_threads');
const root=path.resolve(__dirname,'../../..');
const {app,clone}=require(path.join(root,'tests/behavioral/comet-expansion-harness.cjs'));
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const base='a75763d360894a69b2a12cd37a379f1e4f940e33',golden='tests/behavioral/offline-swift-current-golden.json';
const read=(ref,file)=>execFileSync('git',['show',ref+':'+file],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024});
function replay({source,seed,label}){
 const x=app(source),q=x.q,s=clone(seed),states=[],phases=[];let end=Date.UTC(2035,0,15,12);
 s.lastSeen=end-28800000;x.clock(end);q.set(s);
 for(let phase=0;phase<4;phase++){
  if(phase)end+=28800000;x.clock(end);q.ensureDaily();const start=end-28800000,prisms=q.get().prisms;let kills=0,ascends=0;
  for(let sec=0;sec<28800;sec++){
   const result=q.advance(1,{kind:'offline',visual:false,clockStartMs:start+sec*1000,offlineWindowStartMs:start});kills+=result.kills;ascends+=result.ascends;
  }
  assert(q.save(end),'one canonical endpoint save');const state=clone(q.get());states.push(state);
  const result={kills,ascends,prisms:q.get().prisms-prisms,stateSha256:hash(JSON.stringify(state))};phases.push(result);
  process.stderr.write(label+' phase '+phase+' '+JSON.stringify(result)+'\n');
 }
 return {states,phases};
}
if(!isMainThread){parentPort.postMessage(replay(workerData));}
else(async()=>{
 const accepted=JSON.parse(read(base,golden)),baseline=read(base,'index.html'),candidate=read('HEAD','index.html');
 assert.equal(hash(baseline),accepted.sourceSha256,'released baseline binding');
 const seed=JSON.parse(read(base,'docs/qa/offline-autoascend-2026-10-07/device_backup.json'));
 const run=(source,label)=>new Promise((resolve,reject)=>{
  const worker=new Worker(__filename,{workerData:{source,seed,label}});worker.once('message',resolve);worker.once('error',reject);
  worker.once('exit',code=>{if(code!==0)reject(Error(label+' replay exited '+code));});
 });
 const [b,c]=await Promise.all([run(baseline,'baseline'),run(candidate,'candidate')]);
 assert.deepEqual(c.states,b.states,'every field of all four endpoints is unchanged');
 for(const [i,p]of accepted.phases.entries())assert.deepEqual([c.phases[i].kills,c.phases[i].ascends,c.phases[i].prisms],[p.kills,p.ascends,p.prisms],'original reward triple '+i);
 const receipt={status:'pass',base,baselineSourceSha256:hash(baseline),candidateSourceSha256:hash(candidate),node:process.version,platform:process.platform,oneSecondCallsPerSource:115200,baseline:b.phases,candidate:c.phases,allEndpointStatesEqual:true,canonicalHashesMatch:b.phases.every((p,i)=>p.stateSha256===accepted.phases[i].stateSha256)};
 fs.writeFileSync(path.join(__dirname,'independent-replay.json'),JSON.stringify(receipt,null,2)+'\n');
 // The paired replay preserves canonical historical hashes on all hosts;
 // on Windows the complete paired states can match while cross-host hashes differ.
 if(process.argv.includes('--write'))fs.writeFileSync(path.join(root,golden),JSON.stringify({...accepted,sourceSha256:hash(candidate)},null,2)+'\n');
 console.log(JSON.stringify(receipt));
})().catch(error=>{console.error(error);process.exitCode=1;});
