'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {plan,verify,select}=require('../../scripts/ci/behavioral-plan.cjs');
const {SCENARIOS}=require('../behavioral/scenarios.json');
const groups=plan(SCENARIOS),copy=x=>JSON.parse(JSON.stringify(x));
assert.equal(groups.main.length+groups.offline.length,Object.keys(SCENARIOS).length);
for(const group of Object.keys(groups))for(const [name,fixture]of Object.entries(select(SCENARIOS,group)))assert.equal(fixture,SCENARIOS[name]);
let controls=0;
for(const mutate of [g=>g.main.pop(),g=>g.main.push(g.offline[0]),g=>g.main.push('unknown'),g=>g.offline.pop(),g=>g.offline=['save-backup-ui']]){
 const broken=copy(groups);mutate(broken);assert.throws(()=>verify(SCENARIOS,broken));controls++;
}
assert.throws(()=>select(SCENARIOS,'skip'));controls++;
const added={...SCENARIOS,'future-required-case':'fresh'};
assert(select(added,'main')['future-required-case']==='fresh','new default cases automatically remain required');
assert.throws(()=>plan(Object.fromEntries(Object.entries(SCENARIOS).filter(([name])=>name!=='offline-catchup-core'))));controls++;
const workflow=fs.readFileSync('.github/workflows/pre-merge-validation.yml','utf8');
for(const group of ['main','offline'])assert.equal(workflow.split('--ci-group '+group+' ').length,2,'workflow executes required group '+group+' exactly once');
assert(workflow.includes('name: Lumenfall isolated offline catch-up'));
const publisher=fs.readFileSync('scripts/ci/release-ci-gate.cjs','utf8');
assert(publisher.includes('Lumenfall isolated offline catch-up'),'publisher requires isolated job success too');
(async()=>{
 const runner=require('../behavioral/run.cjs');let observedDeadline;
 const passed=await runner.runScenario('unused-browser','http://example.invalid','offline-catchup-core','offline-catchup-device',null,{log(){},execute:async(command,options)=>{observedDeadline=options.timeout;return {stdout:JSON.stringify({status:'pass'}),stderr:'',exitcode:0,timed_out:false};}});
 assert(passed);assert.equal(observedDeadline,300000,'original enforced child deadline');
 await assert.rejects(runner.main(['--ci-group','main','--scenario','offline-catchup-core']),/either one scenario/);controls++;
 console.log(JSON.stringify({status:'PASS',defaultCases:Object.keys(SCENARIOS).length,main:groups.main.length,offline:groups.offline.length,negativeControls:controls,completeCoverage:true,originalOfflineDeadlineMs:observedDeadline}));
})().catch(error=>{console.error(error);process.exitCode=1;});
