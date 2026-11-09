'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {app} = require('./forge-expansion-harness.cjs');

const html = fs.readFileSync(process.argv[2] || 'index.html', 'utf8');
const boot = "if(document.readyState==='loading'){";
assert.equal(html.split(boot).length, 2);
const {q} = app(html.replace(boot,
  'window.endlessQa={exponent:endlessCurveDepth,amount:Amount};' + boot));
const {exponent, amount} = q.endless;
const close = (actual, expected, message) => assert.ok(
  Math.abs(actual - expected) < 1e-9, `${message}: ${actual} versus ${expected}`);
const priorExponent = depth => depth <= 100 ? depth : 100 + 40 * Math.log1p((depth - 100) / 40);
q.set(q.fresh());

for (const [start, end] of [[1, 100], [100, 150], [150, 250], [250, 500], [500, 1000], [1000, 2000]]) {
  const startValue = priorExponent(start);
  const endValue = end <= 1000 ? priorExponent(end) : priorExponent(1000) + 30;
  const step = (endValue - startValue) / (end - start);
  let previous = exponent(start);
  close(previous, startValue, 'band starts at the existing calibration');
  for (let depth = start + 1; depth <= end; depth++) {
    const current = exponent(depth);
    close(current - previous, step, `fixed exponential rate at Rift ${depth}`);
    previous = current;
  }
  close(previous, endValue, 'band ends at the existing calibration');
}

for (const depth of [1, 39, 100, 120, 150, 191, 250, 369, 500, 711, 1000, 1800]) {
  const boss = depth % 10 === 0;
  const exp = exponent(depth);
  assert.equal(q.enemyHp(depth), Math.round(60 * Math.pow(1.145, exp) * (boss ? 6 : 1)), 'enemy HP');
  assert.equal(q.lumen(depth), Math.round(5 * Math.pow(1.11, exp) * (boss ? 8 : 1)), 'Lumen drop');
  assert.equal(q.shards(depth), Math.round(Math.pow(1.09, exp) * (boss ? 5 : 1)), 'Shard drop');
}
for (const [reward, growth] of [[q.enemyHp, 1.145], [q.lumen, 1.11], [q.shards, 1.09]]) {
  const first = reward(350001), next = reward(350002);
  assert.ok(amount.valid(first) && amount.wide(first), 'deep Rift keeps a valid wide amount');
  close(amount.log10(next) - amount.log10(first), Math.log10(growth) * 0.03, 'wide amounts retain their growth rate');
}

for (const depth of [120, 121]) {
  const save = q.fresh();
  save.depth = save.maxDepthEver = save.enemyDepth = depth;
  save.enemyMaxHp = Math.round(60 * Math.pow(1.145, priorExponent(depth)) * (depth % 10 === 0 ? 6 : 1));
  save.enemyHp = save.enemyMaxHp * 0.625;
  save.lumen = 456;
  save.luminousAccum = 0.7;
  save.enemyIsLuminous = depth % 10 !== 0;
  q.set(save);
  q.restoreEnemy();
  const restored = q.get();
  assert.notEqual(restored.enemyMaxHp, save.enemyMaxHp, 'old encounter adopts the new curve');
  assert.equal(restored.enemyMaxHp, q.enemyHp(depth));
  close(restored.enemyHp / restored.enemyMaxHp, 0.625, 'old encounter retains damage dealt');
  assert.equal(restored.enemyIsLuminous, save.enemyIsLuminous);
  assert.equal(restored.luminousAccum, save.luminousAccum);
  assert.equal(restored.lumen, save.lumen);
  assert.equal(restored.maxDepthEver, depth);
}
console.log('PASS: exponential Rift bands, combat and reward formulas, wide amounts, and saved enemy migration');
