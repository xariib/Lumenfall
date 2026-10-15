'use strict';
// Earned-save complete-engine workload. No balance/currency/upgrades are given.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict'),build=require('./endless-cycle-source.cjs'),{app,CLOCK}=require('./forge-expansion-harness.cjs');
const seconds=Number(process.argv[2]||1);assert(Number.isFinite(seconds)&&seconds>0&&seconds<=43200);
let source=build(fs.readFileSync('index.html','utf8'));
if(process.env.LUMENFALL_CYCLE_DIAGNOSTICS==='1')source=source.replace("if(document.readyState==='loading'){",`var moteLog=[],dustLog=[],oldPayout=luminousMotePayout,oldAscend=applyAscendMutation;
luminousMotePayout=function(now,clock){var depth=state.depth,bonus=supportMoteBonus(),base=motesDropFor(depth),reward=oldPayout.apply(this,arguments);if(Amount.gt(reward,0))moteLog.push({now:now,depth:depth,bonus:bonus,base:base,reward:reward});return reward;};
applyAscendMutation=function(){var before=state.motes,result=oldAscend.apply(this,arguments),dust=Amount.exactSub(state.motes,before);if(Amount.cmp(dust,50)!==0)dustLog.push(dust);return result;};
window.endlessQa={moteLog:moteLog,dustLog:dustLog};if(document.readyState==='loading'){`);
const savePath='docs/qa/endless-progression-001/candidate-ak-mature-snapshot.json.endpoint.json',bytes=fs.readFileSync(savePath),seed=JSON.parse(bytes),start=CLOCK+180*86400000;
const sourceHash=crypto.createHash('sha256').update(source).digest('hex'),sourceArtifact='validation-evidence/endless-cycle-'+sourceHash+'.html';fs.writeFileSync(sourceArtifact,source);
seed.depth=seed.enemyDepth=16;seed.riftMode='push';seed.autoAscendEnabled=true;seed.autoAscendTargetDepth=16;
const x=app(source);x.clock(start);x.q.set(seed);x.q.restoreEnemy();const t=performance.now(),resumable=process.env.LUMENFALL_CYCLE_RESUMABLE==='1';let s,maxSliceMs=0,yields=0;
if(resumable){const cursor=x.q.advance(seconds,{kind:'offline',clockStartMs:start,resumable:true});let step,last=t,logical=0;do{const before=performance.now();step=cursor.next();maxSliceMs=Math.max(maxSliceMs,performance.now()-before);if(!step.done){yields++;if(step.value.elapsedSec!==undefined)logical=step.value.elapsedSec;if(performance.now()-last>30000){process.stderr.write(JSON.stringify({elapsedSec:logical,wallSeconds:(performance.now()-t)/1000,yields})+'\n');last=performance.now();}}}while(!step.done);s=step.value;}
else s=x.q.advance(seconds,{kind:'offline',clockStartMs:start});
console.log(JSON.stringify({status:'MEASURED',sourceSha256:sourceHash,sourceArtifact,saveSha256:crypto.createHash('sha256').update(bytes).digest('hex'),seconds,wallMs:performance.now()-t,resumable,maxSliceMs,yields,summary:s,state:x.q.get(),diagnostics:x.q.endless,limits:'Workload measurement only; state/reward/clock acceptance is recorded separately.'}));
