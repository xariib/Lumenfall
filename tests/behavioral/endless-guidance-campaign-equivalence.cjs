'use strict';
// Exact code inverse plus interval bounds: G4's added Forge recommendation
// differs from measured G2 only when a Mastery Rift gate is unmet. Confirm
// that branch was unreachable throughout each measured campaign day.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const [measuredFile,currentFile,...campaignFiles]=process.argv.slice(2),before=fs.readFileSync(measuredFile,'utf8'),after=fs.readFileSync(currentFile,'utf8'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');let inverse=after,checks=0;
for(const[a,b]of [['powerText=formatRiftNumber(chipEffectivePower(id))','powerText=formatNum(chipEffectivePower(id))'],['formatRiftNumber(wispPower(sp,1))','formatNum(wispPower(sp,1))'],["formatRiftNumber(power) + ' Wisp Power","formatNum(power) + ' Wisp Power"],["next.plan.ready&&next.plan.requirements.every(function(r){return r.met||r.key==='depth';})&&forgePlan.buyCount===1","next.plan.eligible&&forgePlan.buyCount===1"]]){assert.equal(inverse.split(a).length,2);checks++;inverse=inverse.replace(a,b);}
const newTip="'Repeat cleared Rift '+(MIN_AUTO_ASCEND_RIFT-1)+' toward '+formatRiftNumber(eligible.plan.cost.prism)+' Prisms. Use Auto-Ascend if owned. When funded, stop, rebuild and Push.'",oldTip="'Ascend toward '+formatRiftNumber(eligible.plan.cost.prism)+' Prisms. Rebuild afterwards; stop Auto-Ascend when funded and return to Push.'";
assert.equal(inverse.split(newTip).length,2,'one text-only farming clarification');inverse=inverse.replace(newTip,oldTip);checks++;
assert(before.includes('var MIN_AUTO_ASCEND_RIFT = 16;')&&after.includes('var MIN_AUTO_ASCEND_RIFT = 16;'),'existing minimum is unchanged');checks++;
assert.equal(inverse,before,'only three label formatters, depth-wall Forge predicate and farming tip differ');checks++;
const records=[];
for(const file of campaignFiles){const raw=fs.readFileSync(file),r=JSON.parse(raw);assert.equal(r.status,'MEASURED');assert.equal(r.sourceSha256,hash(before));let lower=r.originRecord;for(const day of r.history){const upperRank=Math.max(...Object.values(day.mastery));assert(lower>=200+25*upperRank,'whole-day lower Rift bound meets every possible intervening rank requirement');assert(day.rift>=lower);lower=day.rift;checks+=2;}records.push({file,inputSha256:hash(raw),days:r.days,allInterveningDepthGatesMet:true});}
assert.notEqual(inverse.replace('hpBase:60','hpBase:61'),before,'control detects gameplay drift');checks++;
console.log(JSON.stringify({status:'PASS',checks,measuredSourceSha256:hash(before),currentSourceSha256:hash(after),records,limits:'Uses exact source inverse and monotonic record/rank interval bounds backed by campaign ledger audits. Preserves measured hashes; no campaign rebase, new simulation or device acceptance is claimed.'}));
