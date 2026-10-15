'use strict';
// The exact timer basis must survive real storage/recovery/import unchanged;
// a cold continuation must behave like the same already-saved warm game.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),build=require('./endless-cycle-source.cjs'),{app,CLOCK,clone,P}=require('./forge-expansion-harness.cjs');
const source=build(fs.readFileSync('index.html','utf8')),start=CLOCK+180*86400000,seed=JSON.parse(fs.readFileSync('docs/qa/endless-progression-001/candidate-ak-mature-snapshot.json.endpoint.json'));
seed.depth=seed.enemyDepth=16;seed.riftMode='push';seed.autoAscendEnabled=true;seed.autoAscendTargetDepth=16;seed.research.masterwork=10;seed.longStudyLevels.wispascend=0;seed.nodes.chargememory=2;Object.keys(seed.wispMastery).forEach(id=>seed.wispMastery[id]=0);
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}function ok(a,m){checks++;assert(a,m);}
function page(saved){const x=app(source,saved,{clockDate:true});x.clock(start);if(!saved){x.q.set(clone(seed));x.q.restoreEnemy();}return x;}
const x=page();x.q.advance(.125,{kind:'offline',clockStartMs:start});x.clock(start+125);ok(x.q.save(),'ordinary primary/recovery commit succeeds');const saved=clone(x.q.get()),basis=saved.canonicalAutomationClock;
eq(Object.keys(basis).sort(),['_autoEmpowerAccum','_autoTapAccum'],'both earned timers own an exact basis');
const cold=page([...x.storage]),recovery=page([...x.storage].filter(([key])=>key!==P));eq(cold.q.get(),saved,'cold primary retains all fields exactly');eq(recovery.q.get(),saved,'recovery retains all fields exactly');
const backup=x.q.export(),decoded=x.q.decode(backup);eq(decoded.canonicalAutomationClock,basis,'backup decoding retains every exact elapsed digit');const imported=page();imported.clock(start+125);imported.area.value=backup;imported.q.restore();const importedCold=page([...imported.storage]);eq(importedCold.q.get().canonicalAutomationClock,basis,'real import transaction retains the exact basis');
for(let i=0;i<4;i++)eq(cold.q.accept(clone(saved)),saved,'repeated normalization/migration is idempotent');
for(const a of [x,cold]){a.clock(start+125);a.q.advance(.125,{kind:'offline',clockStartMs:start+125});}
eq(cold.q.get(),x.q.get(),'cold cache reconstruction preserves the whole continued endpoint');
for(const [primary,recover]of [[true,false],[false,true]]){
 const p=page([...x.storage]),before=clone(p.q.get().canonicalAutomationClock);p.fail(primary,recover);p.clock(start+125);eq(p.q.save(),false,'injected storage failure is reported');eq(p.q.get().canonicalAutomationClock,before,'failed save cannot discard or truncate timer progress');
}
for(const [field,value]of [['base',1001],['elapsed','1e-400'],['elapsed',-1],['elapsed',3],['last',Infinity]]){
 const bad=clone(saved);bad.canonicalAutomationClock._autoTapAccum[field]=value;assert.throws(()=>cold.q.accept(bad),/Automation clock needs recovery/,'malformed clock uses recovery');checks++;
}
const inconsistent=clone(saved);inconsistent.canonicalAutomationClock._autoTapAccum.base+=.1;assert.throws(()=>cold.q.accept(inconsistent),/Automation clock needs recovery/,'self-inconsistent basis is rejected');checks++;
const stale=clone(saved);stale._autoTapAccum=0;const normalized=cold.q.accept(stale);eq(normalized._autoTapAccum,0,'a real tick/reset phase remains authoritative');eq(normalized.canonicalAutomationClock._autoTapAccum,undefined,'a basis for the old phase is dropped');
const legacy=clone(saved);delete legacy.canonicalAutomationClock;eq(cold.q.accept(legacy).canonicalAutomationClock,{},'older saves migrate without creating timer progress');
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),limits:'Exact timer storage, malformed input and finite continuation. Broader campaigns, long windows and device acceptance remain separate.'}));
