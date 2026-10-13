'use strict';
// Active Node.js replacement for the archived six-check Python capture runner.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
assert.equal(process.argv.length,4,'Usage: node run-local.cjs REPOSITORY NEW_OUTPUT_DIR');
assert(Number(process.versions.node.split('.')[0])>=20,'Node.js 20+ required');
const root=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);
assert(!fs.existsSync(out),'Output must be new; original receipts are never overwritten');fs.mkdirSync(out,{recursive:true});
const env={...process.env};delete env.NODE_OPTIONS;delete env.NODE_PATH;
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const pin=file=>{const bytes=fs.readFileSync(file);return {bytes:bytes.length,sha256:hash(bytes)};};
const write=(name,value)=>fs.writeFileSync(path.join(out,name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const paths=['index.html','tests/behavioral/rift-guidance.cjs','tests/behavioral/fixtures.json','tests/behavioral/scenarios.json','scripts/ci/guidance-readability.cjs','scripts/ci/guidance-baseline-assets.cjs','tests/behavioral/guidance-baseline-assets.test.cjs','tests/behavioral/rift-guidance-inverses.cjs','tests/behavioral/rift-guidance-inverses.test.cjs','docs/qa/guidance-readability-001/ci-review-006/run-local.cjs'];
const inputs=()=>Object.fromEntries(paths.map(file=>[file,pin(path.join(root,file))]));
function execute(id,command){
 const startedUtc=new Date().toISOString(),stdout=fs.openSync(path.join(out,id+'.stdout.log'),'wx'),stderr=fs.openSync(path.join(out,id+'.stderr.log'),'wx');
 let result;try{result=cp.spawnSync(command[0],command.slice(1),{cwd:root,env,stdio:['ignore',stdout,stderr],timeout:300000,killSignal:'SIGKILL'});}finally{fs.closeSync(stdout);fs.closeSync(stderr);}
 const record={id,command,cwd:root,startedUtc,completedUtc:new Date().toISOString(),exitCode:result.status,signal:result.signal,error:result.error?{code:result.error.code,message:result.error.message}:null,stdout:pin(path.join(out,id+'.stdout.log')),stderr:pin(path.join(out,id+'.stderr.log'))};write(id+'.process.json',record);return record;
}
const records=[],before=inputs();let failure=null;
try{
 const baseline=execute('baseline-source',['git','show','684bfc52bb2ca523124fe63981188b9a8004d747:index.html']);
 assert.equal(baseline.exitCode,0);assert.equal(baseline.signal,null);assert.equal(baseline.error,null);
 assert.equal(baseline.stdout.sha256,'38eebcb93e4cdc2fbb1f9f67800f8cfb433005904389c0815641d26bbae00b6f');
 const commands=[['syntax-helper',['--check','scripts/ci/guidance-readability.cjs']],['syntax-mutators',['--check','tests/behavioral/rift-guidance-inverses.cjs']],['syntax-unit',['--check','tests/behavioral/rift-guidance-inverses.test.cjs']],['inverse-unit',['tests/behavioral/rift-guidance-inverses.test.cjs','index.html',path.join(out,'baseline-source.stdout.log')]],['syntax-assets',['--check','scripts/ci/guidance-baseline-assets.cjs']],['syntax-assets-unit',['--check','tests/behavioral/guidance-baseline-assets.test.cjs']],['baseline-assets-unit',['tests/behavioral/guidance-baseline-assets.test.cjs']],['syntax-runner',['--check','docs/qa/guidance-readability-001/ci-review-006/run-local.cjs']],['source',['scripts/ci/validate_source.cjs']],['context',['scripts/codex/check_context.cjs','--task','docs/tasks/GUIDANCE_READABILITY_001.md']]];
 for(const [id,args]of commands){const record=execute(id,[process.execPath,...args]);records.push(record);assert.equal(record.exitCode,0,id);assert.equal(record.signal,null,id);assert.equal(record.error,null,id);}
 assert.deepEqual(inputs(),before,'All source, test and runner inputs remain unchanged');
}catch(error){failure={message:error.message,stack:error.stack};process.exitCode=1;}
const summary={status:failure?'FAIL_OR_INCOMPLETE':'PASS',scope:'Pure inverse/asset units, syntax, source and task context; no game/browser',runtime:{node:process.version,versions:process.versions,binary:pin(fs.realpathSync(process.execPath))},inputs:before,commands:records,error:failure};write('summary.json',summary);console.log(JSON.stringify({status:summary.status,commands:records.length,out}));
