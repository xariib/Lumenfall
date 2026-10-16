'use strict';
const assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const required=['pre-merge-validation.yml','comet-expansion-validation.yml','forge-expansion-validation.yml','lab-expansion-validation.yml','shared-ui-validation.yml','tree-focused-qa.yml'];
const repo=process.env.GITHUB_REPOSITORY,sha=process.env.GITHUB_SHA;
assert.equal(repo,'xariib/Lumenfall');assert.equal(process.env.GITHUB_REF,'refs/heads/main','Only integrated main may publish');
for(const file of required){
 const data=JSON.parse(execFileSync('gh',['api',`repos/${repo}/actions/workflows/${file}/runs?head_sha=${sha}&per_page=100`],{encoding:'utf8'}));
 const runs=data.workflow_runs.filter(r=>r.head_sha===sha&&r.event==='workflow_dispatch').sort((a,b)=>b.id-a.id);
 assert(runs.length&&runs[0].conclusion==='success',`${file}: latest integrated-commit validation must succeed`);
 if(file==='pre-merge-validation.yml'){
  const jobs=JSON.parse(execFileSync('gh',['api',`repos/${repo}/actions/runs/${runs[0].id}/jobs?filter=latest&per_page=100`],{encoding:'utf8'})).jobs;
  for(const name of ['Lumenfall pre-merge validation','Lumenfall isolated offline catch-up'])assert(jobs.some(job=>job.name===name&&job.conclusion==='success'),name+': required complete behavioral coverage must succeed');
 }
 console.log(file+': PASS '+runs[0].html_url);
}
