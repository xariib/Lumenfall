#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const repo='/workspace/scratch/0848c4e4f365/Lumenfall-tree';
const out=__dirname;
const expected='ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const file=p=>{const b=fs.readFileSync(p);return {path:p,bytes:b.length,sha256:sha(b)};};
const git=(...args)=>cp.execFileSync('git',args,{cwd:repo});
const versions=bin=>JSON.parse(cp.execFileSync(bin,['-p','JSON.stringify({node:process.version,v8:process.versions.v8,execPath:process.execPath})'],{encoding:'utf8'}));
const source=file(path.join(repo,'index.html'));
if(source.sha256!==expected)throw Error('Unexpected source before authorized checks: '+source.sha256);
const published=git('show','HEAD:index.html'),prior=git('show',':index.html');
fs.writeFileSync(path.join(out,'published-to-current.patch'),git('diff','HEAD','--','index.html'));
fs.writeFileSync(path.join(out,'prior-diagnostic-to-current.patch'),git('diff','--','index.html'));
const identity={head:git('rev-parse','HEAD').toString().trim(),tree:git('rev-parse','HEAD^{tree}').toString().trim(),source,published:{bytes:published.length,sha256:sha(published)},priorDiagnostic:{bytes:prior.length,sha256:sha(prior)},fixture:file(path.join(repo,'tests/behavioral/fixtures.json')),harness:file(path.join(repo,'tests/behavioral/tree-expansion-harness.cjs')),prismReference:file(path.join(repo,'tests/behavioral/prism-earning-reference.cjs'))};
const specs=[{id:'core',binary:process.execPath,args:['tests/behavioral/tree-expansion-core.cjs','index.html','--negative'],expectedChecks:5267,expectedNegatives:28},{id:'v8',binary:'/tmp/lumenfall-node830/bin/node',args:['tests/behavioral/tree-expansion-v8.cjs','index.html'],expectedChecks:2862}];
async function run(spec){
  const stdout=path.join(out,spec.id+'.stdout.json'),stderr=path.join(out,spec.id+'.stderr.txt');
  const startedAt=new Date().toISOString(),runtime=versions(spec.binary),test=file(path.join(repo,spec.args[0]));
  const result=await new Promise(resolve=>cp.execFile(spec.binary,spec.args,{cwd:repo,encoding:null,maxBuffer:16*1024*1024},(error,output,errors)=>resolve({error,output,errors})));
  fs.writeFileSync(stdout,result.output||Buffer.alloc(0));fs.writeFileSync(stderr,result.errors||Buffer.alloc(0));
  let raw;try{raw=JSON.parse((result.output||Buffer.alloc(0)).toString());}catch(error){raw={parseFailure:error.message};}
  const testAfter=file(test.path),record={id:spec.id,command:[spec.binary,...spec.args].join(' '),binary:spec.binary,argv:spec.args,cwd:repo,startedAt,finishedAt:new Date().toISOString(),exitCode:result.error?(typeof result.error.code==='number'?result.error.code:null):0,signal:result.error?result.error.signal||null:null,error:result.error?String(result.error.message):null,runtime,test,testAfter,testUnchanged:test.sha256===testAfter.sha256,stdout:file(stdout),stderr:file(stderr),reported:raw};
  record.accepted=record.exitCode===0&&record.testUnchanged&&String(raw.status).toLowerCase()==='pass'&&raw.sourceSha256===source.sha256&&raw.testSha256===test.sha256&&raw.checks===spec.expectedChecks&&(spec.expectedNegatives===undefined||raw.negativeCount===spec.expectedNegatives)&&(spec.id!=='v8'||(raw.node==='v8.3.0'&&/^6\.0\./.test(raw.v8)&&raw.bigIntAvailable===false));
  fs.writeFileSync(path.join(out,spec.id+'.execution.json'),JSON.stringify(record,null,2)+'\n');
  return record;
}
async function main(){
  const records=await Promise.all(specs.map(run));
  const sourceAfter=file(source.path),harnessAfter=file(identity.harness.path),fixtureAfter=file(identity.fixture.path);
  const unchanged=sourceAfter.sha256===source.sha256&&harnessAfter.sha256===identity.harness.sha256&&fixtureAfter.sha256===identity.fixture.sha256;
  const receipt={status:unchanged&&records.every(r=>r.accepted)?'PASS':'FAIL',scope:'Two authorized Node-only checks and read-only product viewport review. No browser layout pass claimed; no repository or remote mutations.',clockToolStartedUTC:'2026-10-10 21:21:25 UTC',identity,after:{source:sourceAfter,harness:harnessAfter,fixture:fixtureAfter},sourceDependenciesUnchanged:unchanged,results:records.map(r=>({id:r.id,accepted:r.accepted,command:r.command,exitCode:r.exitCode,checks:r.reported.checks,negativeCount:r.reported.negativeCount,runtime:r.runtime,execution:path.join(out,r.id+'.execution.json'),stdout:r.stdout,stderr:r.stderr,test:r.test}))};
  fs.writeFileSync(path.join(out,'acceptance.json'),JSON.stringify(receipt,null,2)+'\n');
  console.log(JSON.stringify(receipt,null,2));
  if(receipt.status!=='PASS')process.exitCode=1;
}
main().catch(error=>{console.error(error.stack);process.exitCode=1;});
