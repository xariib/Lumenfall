'use strict';
// Actual earned day3 input that exposed the stale zero-phase deadline. Only
// recruitment/rarity/Ultimate gates differ in the root table; none are purchased
// inside this captured absence. No balances or player decisions are granted.
const fs=require('node:fs'),z=require('node:zlib'),assert=require('node:assert/strict'),crypto=require('node:crypto'),build=require('./endless-cycle-source.cjs'),{app,CLOCK}=require('./forge-expansion-harness.cjs');
let source=process.argv[2]?fs.readFileSync(process.argv[2],'utf8'):build(fs.readFileSync('index.html','utf8'));
const baseSourceSha256=crypto.createHash('sha256').update(source).digest('hex');
if(process.env.LUMENFALL_CYCLE_MUTATION==='frameOwner'){
 for(const anchor of ["    invalidateCanonicalAutomation('_autoTapAccum');","    invalidateCanonicalAutomation('_autoEmpowerAccum');",'    canonicalAutomationAnchors={};state.canonicalAutomationClock={};']){assert.equal(source.split(anchor).length,2,anchor);source=source.replace(anchor,'/* intentional stale timer ownership */');}
}
const marker="if(document.readyState==='loading'){";assert.equal(source.split(marker).length,2);
const observed=`var observedEmpower=simulationProcessAutoEmpower,observedEmptyTicks=0;
simulationProcessAutoEmpower=function(summary){var before=summary.empowers,count=observedEmpower(summary);if(count&&before===summary.empowers)observedEmptyTicks+=count;return count;};
window.endlessQa={emptyTicks:function(){return observedEmptyTicks;}};`;
const bytes=z.gunzipSync(fs.readFileSync('docs/qa/endless-progression-001/experiments/canonical-farm-transition-input.json.gz')),input=JSON.parse(bytes),start=CLOCK+input.elapsed*1000;let current='automation reset and no-purchase ticks';
// Keep the current balance path AND the captured historical high-rate input.
// The latter is needed to retain the exact stale-owner causal reproduction;
// it never supplies a pricing/pacing expectation for the actual game.
const farmCap="return state.riftMode==='farm' ? Amount.min(dps,Amount.mul(state.enemyMaxHp||enemyHpFor(state.depth),ENDLESS_PROGRESSION.farmPassiveKillsPerSecond)) : dps;";
assert.equal(source.split(farmCap).length,2,'one explicit historical Farm-rate input');
const variants=[['current balance',source],['captured historical rates',require('./frozen-cycle-power.cjs')(source).replace(farmCap,'return dps;')]],records=[];
try{
 for(const [variant,code]of variants){
 const x=app(code.replace(marker,observed+marker),undefined,{clockDate:true,retainWrites:false});x.clock(start);x.q.set(input.state);
 const began=performance.now(),summary=x.q.advance(input.seconds,{kind:input.kind,clockStartMs:start,offlineWindowStartMs:start});
 assert.equal(summary.elapsedSec,input.seconds,'whole captured absence completes');assert(x.q.endless.emptyTicks()>0,'fixture exercises actual ticks that buy no Wisp upgrade');
 assert(summary.empowers>0,'the same earned absence also funds real automatic upgrades');
 records.push({variant,checks:3,seconds:input.seconds,wallMs:performance.now()-began,emptyTicks:x.q.endless.emptyTicks(),empowers:summary.empowers,endMode:x.q.get().riftMode,retreats:summary.retreats,sourceSha256:crypto.createHash('sha256').update(code).digest('hex')});
 }
 console.log(JSON.stringify({status:'PASS',checks:6,current,records,baseSourceSha256,sourceSha256:baseSourceSha256,inputSha256:crypto.createHash('sha256').update(bytes).digest('hex'),originalSourceSha256:input.sourceSha256,limits:'Current balance plus explicit historical rate input; no historical pacing claim for the public game.'}));
}catch(error){console.log(JSON.stringify({status:'FAIL',current,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),error:error.stack}));process.exitCode=1;}
