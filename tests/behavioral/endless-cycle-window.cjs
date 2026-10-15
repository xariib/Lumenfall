'use strict';
// Earned-save complete-engine workload. No balance/currency/upgrades are given.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict'),build=require('./endless-cycle-source.cjs'),{app,CLOCK}=require('./forge-expansion-harness.cjs');
const seconds=Number(process.argv[2]||1);assert(Number.isFinite(seconds)&&seconds>0&&seconds<=43200);
const source=build(fs.readFileSync('index.html','utf8')),savePath='docs/qa/endless-progression-001/candidate-ak-mature-snapshot.json.endpoint.json',bytes=fs.readFileSync(savePath),seed=JSON.parse(bytes),start=CLOCK+180*86400000;
const sourceHash=crypto.createHash('sha256').update(source).digest('hex'),sourceArtifact='validation-evidence/endless-cycle-'+sourceHash+'.html';fs.writeFileSync(sourceArtifact,source);
seed.depth=seed.enemyDepth=16;seed.riftMode='push';seed.autoAscendEnabled=true;seed.autoAscendTargetDepth=16;
const x=app(source);x.clock(start);x.q.set(seed);x.q.restoreEnemy();const t=performance.now(),s=x.q.advance(seconds,{kind:'offline',clockStartMs:start});
console.log(JSON.stringify({status:'MEASURED',sourceSha256:sourceHash,sourceArtifact,saveSha256:crypto.createHash('sha256').update(bytes).digest('hex'),seconds,wallMs:performance.now()-t,summary:s,state:x.q.get(),limits:'Workload measurement only; state/reward/clock acceptance is recorded separately.'}));
