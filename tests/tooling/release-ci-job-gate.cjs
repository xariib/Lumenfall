'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const script=fs.readFileSync('scripts/ci/release-ci-gate.cjs','utf8'),sha='1'.repeat(40);
const jobs=[{name:'Lumenfall pre-merge validation',conclusion:'success'},{name:'Lumenfall isolated offline catch-up',conclusion:'success'}];
function run(rows,runOverride={},workflowRuns={}){
 vm.runInNewContext(script,{process:{env:{GITHUB_REPOSITORY:'xariib/Lumenfall',GITHUB_SHA:sha,GITHUB_REF:'refs/heads/main'}},console:{log(){}},require(name){
  if(name==='node:assert/strict')return assert;
  assert.equal(name,'node:child_process');
  return {execFileSync(command,args){
   assert.equal(command,'gh');assert.equal(args[0],'api');
   if(args[1].includes('/jobs?'))return JSON.stringify({jobs:rows});
   const workflow=args[1].match(/\/workflows\/([^/]+)\/runs\?/)[1];
   const success={id:100,head_sha:sha,event:'workflow_dispatch',conclusion:'success',html_url:'https://example.invalid/run',...runOverride};
   return JSON.stringify({workflow_runs:workflowRuns[workflow]??[success]});
  }};
 }});
}
run(jobs);let controls=0;
for(const rows of [[],jobs.slice(0,1),jobs.slice(1),[jobs[0],{...jobs[1],conclusion:'failure'}],[jobs[0],{...jobs[1],conclusion:'cancelled'}],[jobs[0],{...jobs[1],conclusion:null}],[{...jobs[0],conclusion:'skipped'},jobs[1]]]){assert.throws(()=>run(rows));controls++;}
for(const change of [{conclusion:'failure'},{conclusion:null},{head_sha:'2'.repeat(40)},{event:'pull_request'}]){assert.throws(()=>run(jobs,change));controls++;}
for(const file of ['migration-focused-validation.yml','permanent-progression-validation.yml','wisp-scroll-validation.yml']){
 const green={id:100,head_sha:sha,event:'workflow_dispatch',conclusion:'success'};
 for(const runs of [[],[green,{...green,id:101,conclusion:'failure'}],[{...green,head_sha:'2'.repeat(40)}]]){
  assert.throws(()=>run(jobs,{},{[file]:runs}),error=>error.message.includes(file));controls++;
 }
}
console.log(JSON.stringify({status:'PASS',negativeControls:controls,bothFullWorkflowJobsMandatory:true,exactManualCommitMandatory:true}));
