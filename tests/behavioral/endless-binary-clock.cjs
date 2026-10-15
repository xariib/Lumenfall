'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),build=require('./endless-binary-clock-source.cjs');
const {app,CLOCK,clone}=require('./forge-expansion-harness.cjs'),original=fs.readFileSync('index.html','utf8'),source=build(original),seed=JSON.parse(fs.readFileSync('docs/qa/endless-progression-001/candidate-ak-mature-snapshot.json.endpoint.json','utf8'));
const start=CLOCK+180*86400000;seed.depth=seed.enemyDepth=16;seed.riftMode='push';seed.autoAscendEnabled=true;seed.autoAscendTargetDepth=16;
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}function ok(a,m){checks++;assert(a,m);}
const results=[];
for(const elapsed of [1e-22,1e-20,1e-19,1e-18,1e-17]){
 const page=app(source),q=page.q;page.clock(start);q.set(clone(seed));q.restoreEnemy();const s=q.advance(elapsed,{kind:'offline',clockStartMs:start});
 eq(s.elapsedSec,elapsed,'requested tiny interval remains exact');ok(s.iterations<10000,'finite literal tiny reference completes');ok(q.get().enemyHp>0,'tiny endpoint has a living enemy');if(elapsed>=1e-18)ok(s.ascends>=Math.floor(elapsed/2e-19),'material whole cycles cannot disappear when the countdown rounds unchanged');results.push({elapsed,iterations:s.iterations,kills:s.kills,ascends:s.ascends,enemyHp:q.get().enemyHp});
}
const old=app(original);old.clock(start);old.q.set(clone(seed));old.q.restoreEnemy();const mutant=old.q.advance(1e-17,{kind:'offline',clockStartMs:start});assert.throws(()=>assert(mutant.ascends>=50,'material whole cycles cannot disappear'),/material whole cycles cannot disappear/);checks++;
{
 for(const elapsed of [5e-18,2e-17]){const page=app(source),q=page.q,s=clone(seed);page.clock(0);s.supportBuffs={version:1,sources:{tide:{until:1e-14,mult:1.55}}};q.set(s);q.restoreEnemy();
 q.advance(elapsed,{kind:'offline',clockStartMs:0});eq(!!q.get().supportBuffs.sources.tide,elapsed<1e-17,'Support expires at its stored deadline, preserving both sides');}
}
console.log(JSON.stringify({status:'PASS',checks,results,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),limits:'Experimental exact clock backend, no cycle batching or product edit. Whole regression and full catch-up remain pending.'}));
