'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const script=fs.readFileSync('scripts/ci/release-ci-gate.cjs','utf8'),sha='1'.repeat(40);
const jobs=[{name:'Lumenfall pre-merge validation',conclusion:'success'},{name:'Lumenfall isolated offline catch-up',conclusion:'success'}];
function run(rows,runOverride={}){
 vm.runInNewContext(script,{process:{env:{GITHUB_REPOSITORY:'xariib/Lumenfall',GITHUB_SHA:sha,GITHUB_REF:'refs/heads/main'}},console:{log(){}},require(name){
  if(name==='node:assert/strict')return assert;
  assert.equal(name,'node:child_process');
  return {execFileSync(command,args){
   assert.equal(command,'gh');assert.equal(args[0],'api');
   return JSON.stringify(args[1].includes('/jobs?')?{jobs:rows}:{workflow_runs:[{id:100,head_sha:sha,event:'workflow_dispatch',conclusion:'success',html_url:'https://example.invalid/run',...runOverride}]});
  }};
 }});
}
run(jobs);let controls=0;
for(const rows of [[],jobs.slice(0,1),jobs.slice(1),[jobs[0],{...jobs[1],conclusion:'failure'}],[jobs[0],{...jobs[1],conclusion:'cancelled'}],[jobs[0],{...jobs[1],conclusion:null}],[{...jobs[0],conclusion:'skipped'},jobs[1]]]){assert.throws(()=>run(rows));controls++;}
for(const change of [{conclusion:'failure'},{conclusion:null},{head_sha:'2'.repeat(40)},{event:'pull_request'}]){assert.throws(()=>run(jobs,change));controls++;}
console.log(JSON.stringify({status:'PASS',negativeControls:controls,bothFullWorkflowJobsMandatory:true,exactManualCommitMandatory:true}));
