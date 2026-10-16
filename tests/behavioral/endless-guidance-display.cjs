'use strict';
// The G2 measured candidate and G3 differ only in three display formatters.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const before=fs.readFileSync(process.argv[2],'utf8'),after=fs.readFileSync(process.argv[3],'utf8'),hash=s=>crypto.createHash('sha256').update(s).digest('hex');let inverse=after;
for(const [a,b]of [['powerText=formatRiftNumber(chipEffectivePower(id))','powerText=formatNum(chipEffectivePower(id))'],['formatRiftNumber(wispPower(sp,1))','formatNum(wispPower(sp,1))'],["formatRiftNumber(power) + ' Wisp Power","formatNum(power) + ' Wisp Power"]]){assert.equal(inverse.split(a).length,2);inverse=inverse.replace(a,b);}
assert.equal(inverse,before,'all gameplay AND advice bytes unchanged outside three display expressions');
assert.notEqual(inverse.replace('return b.plan.rank-a.plan.rank','return a.plan.rank-b.plan.rank'),before,'causal control detects an altered recommendation policy');
console.log(JSON.stringify({status:'PASS',checks:2,measuredSourceSha256:hash(before),displaySourceSha256:hash(after),limits:'Campaign receipts retain their measured G2 source hash. This proves exact unchanged decision/game logic, not a rebased campaign or Android acceptance.'}));
