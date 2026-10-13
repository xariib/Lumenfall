'use strict';
// New Node-only capture runner. Original thirteen commands are in the pinned plan.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
assert.equal(process.argv.length,5,'Usage: node run-integrated-group-004.cjs VERIFIED_CONFIG GROUP NEW_OUTPUT');
const [configPath,group,outputArg]=process.argv.slice(2);
const configBytes=fs.readFileSync(configPath);
const cfg=JSON.parse(configBytes);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.equal(cfg.status,'ACTUAL_MERGE_VERIFIED');
assert.equal(cfg.candidateHead,'bfed924be57a3b25e06c2f6e4ba3a38e9fc940b6');
assert.equal(cfg.baseHead,'684bfc52bb2ca523124fe63981188b9a8004d747');
assert.equal(cfg.expectedTree,'381a7951d3b45a1a0a64e49b7dd13ed11d6022c6');
assert(/^[0-9a-f]{40}$/.test(cfg.mergeSha));
assert.deepEqual(cfg.orderedParents,[cfg.baseHead,cfg.candidateHead]);
assert.equal(hash(fs.readFileSync(__filename)),cfg.runnerSha256);
const planBytes=fs.readFileSync(cfg.planPath);
assert.equal(hash(planBytes),cfg.planSha256);
const plan=JSON.parse(planBytes);
assert.equal(plan.schema,'lumenfall.guidance-integrated-plan/v4');
assert.equal(plan.status,'READ_ONLY_PLAN_NOT_EXECUTED_NOT_AN_ACCEPTED_MERGE_CONFIGURATION');
assert.equal(plan.candidate.head,cfg.candidateHead);
assert.equal(plan.candidate.base,cfg.baseHead);
assert.equal(plan.candidate.tree,cfg.expectedTree);
assert.equal(plan.commands.length,13);
const commands=plan.commands.filter(x=>x.group===group);
assert.equal(commands.length,{'lab-forge':5,tree:4,comet:4}[group]);
const cwd=fs.realpathSync(cfg.integratedWorktree);
assert.equal(cwd,path.resolve(cfg.integratedWorktree));
const output=path.resolve(outputArg);
assert(output!==cwd&&!output.startsWith(cwd+path.sep),'Evidence output must be outside integrated worktree');
assert(!fs.existsSync(output),'Never overwrite or repeat an existing execution scope');
fs.mkdirSync(output,{recursive:true});
const env={...process.env,GIT_OPTIONAL_LOCKS:'0'};
delete env.NODE_OPTIONS; delete env.NODE_PATH;
const captures=[];
const validations=[];
function write(name,data){fs.writeFileSync(path.join(output,name),data,{flag:'wx'});}
function json(name,data){write(name,JSON.stringify(data,null,2)+'\n');}
function pin(file){const s=fs.lstatSync(file);assert(s.isFile()&&!s.isSymbolicLink(),file);const b=fs.readFileSync(file);return {bytes:b.length,sha256:hash(b),mode:'0'+(s.mode&0o777).toString(8)};}
function git(args,records){const r=cp.spawnSync('git',args,{cwd,env,maxBuffer:64*1024*1024});records.push({args,exit:r.status,signal:r.signal,error:r.error?String(r.error):null,stdout:r.stdout.toString(),stderr:r.stderr.toString()});assert.ifError(r.error);assert.equal(r.status,0,r.stderr.toString());assert.equal(r.signal,null);return r.stdout.toString().trim();}
function verify(label){
  const row={label,hostUtc:new Date().toISOString(),git:[],files:[],runtimes:[]};
  validations.push(row);
  assert.equal(hash(fs.readFileSync(configPath)),hash(configBytes),'Config changed');
  assert.equal(hash(fs.readFileSync(cfg.planPath)),cfg.planSha256,'Plan changed');
  assert.equal(hash(fs.readFileSync(__filename)),cfg.runnerSha256,'Runner changed');
  assert.equal(git(['rev-parse','HEAD'],row.git),cfg.mergeSha);
  assert.equal(git(['rev-parse','HEAD^{tree}'],row.git),cfg.expectedTree);
  assert.deepEqual(git(['show','-s','--format=%P','HEAD'],row.git).split(' '),cfg.orderedParents);
  assert.equal(git(['status','--porcelain=v1','--untracked-files=all'],row.git),'','Integrated worktree must be clean');
  assert.equal(git(['diff','--no-ext-diff','--binary','HEAD','--'],row.git),'','Integrated index/working tree changed');
  const inputs=[plan.candidate.source,...plan.commands.map(c=>c.input),...plan.dependencies,...plan.workflows,...plan.documents];
  const seen=new Set();
  for(const expected of inputs){
    if(seen.has(expected.path))continue;seen.add(expected.path);
    const observed=pin(path.join(cwd,expected.path));
    for(const key of ['bytes','sha256','mode'])assert.equal(observed[key],expected[key],expected.path+':'+key);
    const entry=git(['ls-tree','HEAD','--',expected.path],row.git);
    if(expected.gitEntry)assert.equal(entry,expected.gitEntry,expected.path+':gitEntry');
    row.files.push({path:expected.path,...observed,gitEntry:entry});
  }
  for(const expected of plan.runtimes){const observed=pin(expected.path);for(const key of ['bytes','sha256','mode'])assert.equal(observed[key],expected[key],expected.kind+':'+key);row.runtimes.push({kind:expected.kind,path:expected.path,...observed});}
  row.status='PASS_INPUT_IDENTITY';
  json('identity-'+String(validations.length).padStart(2,'0')+'-'+label+'.json',row);
}
let status='FAIL';
let failure=null;
write('verified-config.original.json',configBytes);
write('plan.original.json',planBytes);
write('runner.original.cjs',fs.readFileSync(__filename));
try {
  verify('before');
  for(let i=0;i<commands.length;i++){
    const command=commands[i];
    assert.deepEqual(command.cleanEnvironment,['NODE_OPTIONS','NODE_PATH']);
    const runtime=plan.runtimes.find(x=>x.kind===command.runtime);
    assert(runtime&&runtime.path===command.executable);
    const id=String(i+1).padStart(2,'0')+'-'+command.id;
    const stdoutName=id+'.stdout.log',stderrName=id+'.stderr.log';
    const stdout=fs.openSync(path.join(output,stdoutName),'wx');
    const stderr=fs.openSync(path.join(output,stderrName),'wx');
    const startedHostUtc=new Date().toISOString();
    const startNs=process.hrtime.bigint();
    let result;
    try { result=cp.spawnSync(command.executable,command.args,{cwd,env,stdio:['ignore',stdout,stderr]}); }
    finally {fs.closeSync(stdout);fs.closeSync(stderr);}
    const record={group,id:command.id,executable:command.executable,args:command.args,cwd,cleanEnvironment:command.cleanEnvironment,startedHostUtc,endedHostUtc:new Date().toISOString(),elapsedNanoseconds:(process.hrtime.bigint()-startNs).toString(),exit:result.status,signal:result.signal,error:result.error?{name:result.error.name,message:result.error.message,code:result.error.code||null}:null,stdout:{path:stdoutName,...pin(path.join(output,stdoutName))},stderr:{path:stderrName,...pin(path.join(output,stderrName))},historicalExpected:command.historicalExpected};
    captures.push(record);
    json(id+'.process.json',record);
    console.log(JSON.stringify({group,id:command.id,exit:record.exit,signal:record.signal,stdout:record.stdout,stderr:record.stderr}));
    assert.ifError(result.error);assert.equal(result.status,0,'Original command failed; retained without retry');assert.equal(result.signal,null);
    verify('after-'+id);
  }
  assert.equal(captures.length,commands.length);
  status='ALL_COMMANDS_EXIT_ZERO_REQUIRES_SEMANTIC_REVIEW';
}catch(error){failure={name:error.name,message:error.message,stack:error.stack};process.exitCode=1;}
finally{
  json('summary.json',{schema:'lumenfall.guidance-integrated-capture/v4',status,group,mergeSha:cfg.mergeSha,tree:cfg.expectedTree,orderedParents:cfg.orderedParents,configSha256:hash(configBytes),planSha256:cfg.planSha256,runnerSha256:cfg.runnerSha256,hostTimeNote:'Raw process-host timestamps are unchanged; external trusted UTC anchors are recorded separately.',commands:captures,validations:validations.length,failure,limitations:['Exit status alone is not semantic acceptance.','No game/browser/CI process was retried by this wrapper.','Native Android/WebView/textZoom/TalkBack acceptance and APK publication are outside this execution.']});
  console.log(JSON.stringify({status,group,commands:captures.length,failure}));
}
