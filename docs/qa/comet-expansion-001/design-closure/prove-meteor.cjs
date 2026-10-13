'use strict';
// Execute with Node20+: node prove-meteor.cjs /absolute/index.html <trusted UTC>
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const candidate = require('./meteor-candidate.cjs');
const oracle = require('./exact-oracle.cjs');
const sourcePath = process.argv[2], auditedAt = process.argv[3];
assert(sourcePath && /^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d UTC$/.test(auditedAt || ''), 'absolute source and trusted UTC required');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sourceBytes = fs.readFileSync(sourcePath), source = sourceBytes.toString('utf8');
assert.equal(sha(sourceBytes), 'ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3');
const candidateText = fs.readFileSync(path.join(__dirname, 'meteor-candidate.cjs'), 'utf8');
const candidateCtx = {module: {exports: {}}, BigInt: undefined};
vm.runInNewContext(candidateText, candidateCtx, {timeout: 1000});
const isolated = candidateCtx.module.exports;
assert.equal(isolated.meteorBudget(1000, 50, 0), 200, 'candidate runs without BigInt capability');
let checks = 1, budgets = 0, hpPlans = 0;
let prng = 0x43da01b9;
function random32() { prng ^= prng << 13; prng ^= prng >>> 17; prng ^= prng << 5; return prng >>> 0; }
function randomFinite() {
  const exponent = BigInt(random32() % 2047);
  const fraction = (BigInt(random32() & 0xfffff) << 32n) | BigInt(random32());
  return oracle.fromBits((exponent << 52n) | fraction);
}
const vectorHash = crypto.createHash('sha256');
function assertBudget(H, P, rank) {
  const expected = oracle.exactBudget(H, P, rank);
  const actual = isolated.meteorBudget(H, P, rank);
  assert.equal(actual, expected.budget, 'budget ' + JSON.stringify({H, P, rank, expected: expected.integer.toString()})); checks++;
  assert(Number.isFinite(actual) && Number.isInteger(actual) && actual >= 0); checks++;
  assert(BigInt(actual) <= expected.integer); checks++;
  if (expected.integer <= BigInt(Number.MAX_SAFE_INTEGER)) { assert.equal(BigInt(actual), expected.integer); checks++; }
  if (actual > 0) {
    const next = oracle.fromBits(oracle.bits(actual) + 1n);
    if (Number.isInteger(next)) { assert(BigInt(next) > expected.integer); checks++; }
  }
  budgets++;
  vectorHash.update(JSON.stringify([oracle.bits(H).toString(16), oracle.bits(P).toString(16), rank, oracle.bits(actual).toString(16)]) + '\n');
  return expected;
}
function assertPlan(H, h, P, rank) {
  const expected = oracle.plan(H, h, P, rank);
  const actual = JSON.parse(JSON.stringify(isolated.meteorPlan(H, h, P, rank)));
  assert.deepEqual(actual, expected, 'HP plan ' + JSON.stringify({H, h, P, rank})); checks++;
  if (actual.available) {
    assert(actual.hpAfter >= 0 && actual.hpAfter < h && actual.damage > 0 && actual.damage <= actual.budget); checks++;
    assert.equal(oracle.compare(oracle.subtract(oracle.dyadic(h), oracle.dyadic(actual.hpAfter)), oracle.dyadic(actual.damage)), 0); checks++;
    assert.equal(h - actual.damage, actual.hpAfter); checks++;
    if (actual.lethal) { assert.equal(actual.hpAfter, 0); assert(h <= actual.budget); checks += 2; }
    else { assert(actual.hpAfter > 0); checks++; }
  }
  hpPlans++;
  vectorHash.update(JSON.stringify([H, h, P, rank, actual]) + '\n');
  return actual;
}

// Every finite binary64 exponent, all five ranks, three significand patterns.
// The first branch fixes an overflowing 12P with finite HP-bound outcome;
// the other branches put the power cap in range or far from the HP cap.
for (let exp = 0; exp < 2047; exp++) {
  for (let rank = 0; rank <= 4; rank++) {
    for (let pattern = 0; pattern < 3; pattern++) {
      const fraction = pattern === 0 ? 1n : pattern === 1 ? 0xfffffffffffffn : ((BigInt(random32() & 0xfffff) << 32n) | BigInt(random32()));
      const H = oracle.fromBits((BigInt(exp) << 52n) | fraction);
      const P = pattern === 0 ? Number.MAX_VALUE : pattern === 1 ? H / 37 : randomFinite();
      assertBudget(H, P, rank);
      if ((exp + rank * 7 + pattern) % 19 === 0) assertPlan(H, pattern === 1 ? H / 2 : H, P, rank);
    }
  }
}

// Floors at neighbouring integer/power-of-two boundaries and fractional power.
for (const base of [1, 5, 10, 20, 25, 100, 1e6, 2 ** 26, 2 ** 51, 2 ** 52, 2 ** 53, 2 ** 54, 2 ** 55, 2 ** 56, 2 ** 100, 2 ** 500, Number.MAX_VALUE]) {
  const raw = oracle.bits(base);
  for (const delta of [-2n, -1n, 0n, 1n, 2n]) {
    if (raw + delta <= 0n || raw + delta > 0x7fefffffffffffffn) continue;
    const H = oracle.fromBits(raw + delta);
    for (let rank = 0; rank <= 4; rank++) {
      for (const P of [0, 1 / 12, oracle.fromBits(oracle.bits(1 / 12) + 1n), 0.25, H / 48, H, Number.MAX_VALUE]) {
        assertBudget(H, P, rank);
        assertPlan(H, H, P, rank);
      }
    }
  }
}
for (let i = 0; i < 1500; i++) {
  const H = randomFinite(), P = randomFinite(), rank = i % 5;
  const h = i % 3 === 0 ? H : i % 3 === 1 ? H * 0.65 : H / 128;
  assertBudget(H, P, rank); assertPlan(H, h, P, rank);
}

const exampleInputs = [
  ['ordinary-base', 1000, 1000, 50, 0],
  ['ordinary-core4-lethal', 1000, 350, 50, 4],
  ['power-bound-core4', 10000, 10000, 100, 4],
  ['fractional-power-below-one', 5, 5, 1 / 12, 0],
  ['fractional-power-above-one', 5, 5, oracle.fromBits(oracle.bits(1 / 12) + 1n), 0],
  ['fractional-current-hp-lethal', 5, 0.125, 1, 0],
  ['unsafe-unrepresentable-integer-budget', 2 ** 56, 2 ** 56, Number.MAX_VALUE, 0],
  ['rounded-subtraction-overdebit', 2 ** 54, 2 ** 54, 0.25, 0],
  ['stalled-current-hp', 2 ** 54, 2 ** 54, 0.1, 0],
  ['nonlethal-positive-epsilon-remainder', 5, 1 + 5e-10, 1, 0],
  ['overflowing-power-finite-hp-cap', 1000, 1000, Number.MAX_VALUE, 0],
  ['both-naive-products-overflow', Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, 4],
  ['finite-maxhp-small-no-effect', Number.MAX_VALUE, Number.MAX_VALUE, 1, 4],
  ['subnormal-inputs', Number.MIN_VALUE, Number.MIN_VALUE, Number.MAX_VALUE, 0],
  ['subnormal-current-hp-lethal', 5, Number.MIN_VALUE, 1, 0]
];
const examples = exampleInputs.map(([id, H, h, P, rank]) => {
  const exact = oracle.exactBudget(H, P, rank), actual = assertPlan(H, h, P, rank);
  return {id, H, h, P, rank, bits: {H: oracle.bits(H).toString(16), h: oracle.bits(h).toString(16), P: oracle.bits(P).toString(16)}, exact: {hp: exact.hp.toString(), power: exact.power.toString(), damageFloor: exact.integer.toString()}, plan: actual};
});
const invalids = [
  [NaN, 1, 1, 0], [Infinity, 1, 1, 0], [1, Infinity, 1, 0], [1, 1, Infinity, 0],
  [-1, 1, 1, 0], [1, -1, 1, 0], [1, 2, 1, 0], [0, 0, 1, 0],
  [1, 1, -1, 0], [1, 1, 1, NaN], [1, 1, 1, 0.5], [1, 1, 1, -1], [1, 1, 1, 5]
];
for (const args of invalids) assertPlan(...args);

const counterexamples = [];
function counterexample(id, args, incorrect) {
  const [H, P, rank] = args, exact = oracle.exactBudget(H, P, rank);
  const actual = incorrect(H, P, rank);
  assert.notEqual(actual, exact.budget, id + ' must discriminate'); checks++;
  counterexamples.push({id, H, P, rank, incorrect: Number.isFinite(actual) ? actual : String(actual), correct: exact.budget, exactInteger: exact.integer.toString()});
}
counterexample('naive-double-overflow', [Number.MAX_VALUE, Number.MAX_VALUE, 4], (H, P, r) => Math.min(Math.floor(H * (20 + 5 * r) / 100), Math.floor(12 * P)));
counterexample('naive-rounded-power-crosses-floor', [5, 1 / 12, 0], (H, P, r) => Math.min(Math.floor(H * (20 + 5 * r) / 100), Math.floor(12 * P)));
counterexample('nearest-Number-conversion-overpays', [2 ** 56, Number.MAX_VALUE, 0], (H, P, r) => Number(oracle.exactBudget(H, P, r).integer));
let reorder = null, multiply = null;
for (let offset = 0; offset < 10000 && (!reorder || !multiply); offset++) {
  const H = Number.MAX_SAFE_INTEGER - offset;
  for (let rank = 0; rank <= 4; rank++) {
    const expected = oracle.exactBudget(H, Number.MAX_VALUE, rank).budget;
    if (!reorder && Math.floor((H / 20) * (4 + rank)) !== expected) reorder = [H, Number.MAX_VALUE, rank];
    if (!multiply && Math.floor((H * (4 + rank)) / 20) !== expected) multiply = [H, Number.MAX_VALUE, rank];
  }
}
assert(reorder && multiply, 'safe integer counterexamples exist'); checks++;
counterexample('division-first-is-not-exact-floor', reorder, (H, P, r) => Math.floor((H / 20) * (4 + r)));
counterexample('multiply-first-loses-safe-floor', multiply, (H, P, r) => Math.floor((H * (4 + r)) / 20));
const over = examples.find(x => x.id === 'rounded-subtraction-overdebit');
assert.equal(over.h - (over.h - over.plan.budget), 4);
assert.equal(over.plan.budget, 3); assert.equal(over.plan.damage, 2); checks += 3;
counterexamples.push({id: 'omit-HP-roundup-removes-four-with-budget-three', H: over.H, h: over.h, P: over.P, rank: 0, budget: 3, incorrectActualHpLoss: 4, correctActualHpLoss: 2});

// Source-bound, isolated ORIGINAL helper invocation. Only its death callback
// is an observer; this does not pretend to run real rewards or a future Comet.
const start = source.indexOf('function simulationDealDiscreteDamage(');
const end = source.indexOf('function simulationTriggerAbility(', start);
assert(start > 0 && end > start);
const discreteSource = source.slice(start, end);
const epsilonMatch = source.match(/var SIM_EPS = ([^;]+);/);
assert(epsilonMatch); checks += 2;
const epsilon = Number(epsilonMatch[1]);
let observedDefeats = 0;
const primitiveState = {enemyHp: 1 + 5e-10, depth: 1};
const context = {
  state: primitiveState, SIM_EPS: epsilon, ascendRunToken: {},
  forgeSpillDamage() { throw Error('Spillway must be disabled'); },
  simulationDefeatEnemy() { observedDefeats++; },
  isBoss() { throw Error('No post-death spill check expected'); }
};
vm.runInNewContext(discreteSource + '\nthis.call = simulationDealDiscreteDamage;', context);
const returned = context.call(1, {}, {}, false);
assert.equal(returned, true); assert.equal(observedDefeats, 1); assert(primitiveState.enemyHp > 0 && primitiveState.enemyHp <= epsilon); checks += 3;
const proposed = candidate.meteorPlan(5, 1 + 5e-10, 1, 0);
assert.equal(proposed.lethal, false); assert.equal(proposed.hpAfter, primitiveState.enemyHp); checks += 2;

const result = {
  status: 'PASS_DESIGN_PROTOTYPE_ORACLE', auditedAt, runtime: process.version,
  scope: 'Pure Meteor budget/HP proposal plus one isolated source-helper branch observation; no Comet implementation or gameplay acceptance.',
  input: {path: sourcePath, bytes: sourceBytes.length, sha256: sha(sourceBytes)},
  dependencies: ['meteor-candidate.cjs', 'exact-oracle.cjs', 'prove-meteor.cjs'].map(name => {const b = fs.readFileSync(path.join(__dirname, name)); return {name, bytes: b.length, sha256: sha(b)};}),
  counts: {checks, budgetVectors: budgets, hpPlanVectors: hpPlans, explicitExamples: examples.length, invalidInputs: invalids.length, discriminatingCounterexamples: counterexamples.length},
  generator: {kind: 'all finite exponent fields, all ranks, fixed significands and xorshift32', initialSeed: '0x43da01b9', vectorSha256: vectorHash.digest('hex')},
  examples, counterexamples,
  sharedEpsilonWitness: {helperSha256: sha(discreteSource), helperBytes: Buffer.byteLength(discreteSource), epsilon, beforeHp: 1 + 5e-10, amount: 1, afterHp: primitiveState.enemyHp, returned, observedDefeats, callbackMode: 'observation stub, not canonical reward execution', proposed},
  limitations: ['No actual Node8 execution in this Node20+ design task; candidate is ES2017 and was run in a BigInt-disabled VM.', 'No product/source/test/repository changes.', 'Budget operands are the exact binary64 input values, not an assumed decimal intention.', 'Persistence, command lifecycle, canonical rewards and UI still require implementation and actual regression tests.']
};
process.stdout.write(JSON.stringify(result, null, 2) + '\n');
