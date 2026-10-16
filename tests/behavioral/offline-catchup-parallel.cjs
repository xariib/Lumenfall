'use strict';
// Execute every byte of the original regression in independent virtual-app
// groups. The caller's original 300s deadline covers ALL workers together.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),os=require('node:os'),Module=require('node:module');
const {Worker,isMainThread,parentPort,workerData}=require('node:worker_threads');
const originalFile=path.join(__dirname,'offline-catchup.cjs');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const ids=['long-windows','short-boundaries','rollback-recovery','processing-time','wall-clock'];
const counts=[8,2,4,2,2];
function plan(text){
 const markers=[
  '// Fails on the unchanged product through the reported production entry.',
  '// Preserve old numerical policy against the unchanged scheduler for short windows',
  '// Cancellation, restart and primary/recovery failures never partially consume.',
  '// Real cooperative work can outlast the captured return clock. It must not',
  'for(const jump of [-7*86400000,7*86400000]){',
  "console.log(JSON.stringify({status:'pass',scenario:'offline-catchup-core',"
 ];
 const positions=markers.map(m=>{assert.equal(text.split(m).length,2,'unique original boundary '+m);return text.indexOf(m);});
 positions.forEach((at,i)=>{if(i)assert(at>positions[i-1],'original source order');});
 const prefix=text.slice(0,positions[0]),suffix=text.slice(positions[5]);
 const groups=ids.map((id,i)=>({id,body:text.slice(positions[i],positions[i+1]),records:counts[i]}));
 assert.equal(prefix+groups.map(g=>g.body).join('')+suffix,text,'all original source retained exactly');
 for(const line of ['const clear20=copy(original);clear20.autoAscendTargetDepth=21;','const off=copy(original);off.autoAscendEnabled=false;','const oldRewardSource=legacyPrismPolicy(source,baseline);','const on=runAsync(original,28800);'])assert.equal(text.split(line).length,2,'original setup remains explicit');
 return {prefix,suffix,groups,originalTestSha256:hash(text)};
}
function combine(p,rows,sourceSha256,wallMs){
 assert.equal(rows.length,ids.length,'all groups completed');
 assert.equal(new Set(rows.map(r=>r.id)).size,ids.length,'no duplicate workers');
 const ordered=ids.map(id=>{const row=rows.find(r=>r.id===id);assert(row,'missing '+id);return row;});
 for(const [i,row]of ordered.entries()){
  assert.equal(row.exitcode,0,row.error||'worker exited unsuccessfully');assert(!row.error,row.error);
  assert(row.result&&row.result.report,'completed original report required');
  assert.equal(row.result.originalTestSha256,p.originalTestSha256,'same complete original test');
  assert.equal(row.result.bodySha256,hash(p.groups[i].body),'same original group body');
  assert.equal(row.result.report.status,'pass');assert.equal(row.result.report.sourceSha256,sourceSha256);
  assert.equal(row.result.report.records.length,counts[i],'all original report cases');
 }
 const first=ordered[0].result.baselineSha256,rollback=ordered[2].result.baselineSha256;
 assert(/^[a-f0-9]{64}$/.test(first));assert.equal(rollback,first,'independent repeated baseline matches literal-oracle-checked baseline');
 return {status:'pass',scenario:'offline-catchup-core',sourceSha256,originalTestSha256:p.originalTestSha256,wallMs,
  execution:'All original source/18 records; five independent groups, at most four workers; original overall deadline unchanged',
  records:ordered.flatMap(r=>r.result.report.records),groups:ordered.map(r=>({id:r.id,wallMs:r.result.report.wallMs,records:r.result.report.records.length,extraSetupRecords:r.result.extraSetupRecords}))};
}
function work(){
 const p=plan(fs.readFileSync(originalFile,'utf8')),group=p.groups.find(g=>g.id===workerData.id);assert(group);
 let setup='';
 if(group.id==='short-boundaries')setup='const clear20=copy(original);clear20.autoAscendTargetDepth=21;\nconst off=copy(original);off.autoAscendEnabled=false;\nconst oldRewardSource=legacyPrismPolicy(source,baseline);\n';
 if(group.id==='rollback-recovery')setup='const on=runAsync(original,28800);\nconst extraSetupRecords=records.splice(0);\n';
 const logs=[],prior=console.log;console.log=(...args)=>logs.push(args.join(' '));
 const m=new Module(originalFile,module);m.filename=originalFile;m.paths=Module._nodeModulePaths(__dirname);
 try{m._compile(p.prefix+setup+group.body+p.suffix+"\nmodule.exports.baselineSha256=typeof on!=='undefined'?require('node:crypto').createHash('sha256').update(JSON.stringify(on.committed)).digest('hex'):null;module.exports.extraSetupRecords=typeof extraSetupRecords!=='undefined'?extraSetupRecords:[];",originalFile);}finally{console.log=prior;}
 assert.equal(logs.length,1,'one completed original report');
 parentPort.postMessage({report:JSON.parse(logs[0]),baselineSha256:m.exports.baselineSha256,extraSetupRecords:m.exports.extraSetupRecords,originalTestSha256:p.originalTestSha256,bodySha256:hash(group.body)});
}
function startWorker(id,sourcePath){
 return new Promise(resolve=>{
  let result,error;
  const worker=new Worker(__filename,{workerData:{id},argv:['--source',sourcePath]});
  worker.on('message',value=>{if(result)error='duplicate result';else result=value;});
  worker.on('error',value=>{error=value.stack||value.message;});
  worker.once('exit',exitcode=>resolve({id,exitcode,result,error}));
 });
}
async function main(args=process.argv.slice(2)){
 const {parseArgs}=require('../../scripts/lib/cli.cjs'),options=parseArgs(args,['--source']);assert.equal(options.positional.length,0);
 const sourcePath=path.resolve(options.source||path.join(__dirname,'../../index.html')),sourceSha256=hash(fs.readFileSync(sourcePath));
 const p=plan(fs.readFileSync(originalFile,'utf8')),rows=[],start=performance.now();let next=0;
 const width=Math.max(1,Math.min(4,os.availableParallelism?os.availableParallelism():os.cpus().length));
 async function pool(){while(next<p.groups.length){const group=p.groups[next++];rows.push(await startWorker(group.id,sourcePath));}}
 await Promise.all(Array.from({length:width},pool));
 console.log(JSON.stringify(combine(p,rows,sourceSha256,performance.now()-start)));
}
module.exports={plan,combine};
if(!isMainThread)work();
else if(require.main===module)main().catch(error=>{console.error(error.stack);console.log(JSON.stringify({status:'fail',scenario:'offline-catchup-core',message:error.message}));process.exitCode=1;});
