'use strict';
// Node20+ design-only ledger model and independent exact dyadic oracle.
// It does not edit the game, migrate a save or claim a future handler is tested.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const {dyadic, compare, subtract, bits, fromBits} = require('./exact-oracle.cjs');
const sourcePath = process.argv[2], auditedAt = process.argv[3];
assert(sourcePath && /^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d UTC$/.test(auditedAt || ''));
const sourceBytes = fs.readFileSync(sourcePath), source = sourceBytes.toString('utf8');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
assert.equal(sha(sourceBytes), 'ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3');
function span(first, last) {const a = source.indexOf(first), b = source.indexOf(last, a + 1); assert(a >= 0 && b > a); return source.slice(a, b);}
const achievementSource = span('var ACHIEVEMENTS = [', 'function deedProgress(');
const shopSource = span('var SHOP = [', 'var COMET_TRIALS = [');
const f26Source = span('function settleOffline12hRefund(', 'function offline12hRefundPending(');
const actualAchievements = JSON.parse(JSON.stringify(vm.runInNewContext(achievementSource + ';ACHIEVEMENTS.map(function(a){return [a.id,a.reward];});')));
const actualShop = JSON.parse(JSON.stringify(vm.runInNewContext(shopSource + ';SHOP.map(function(a){return [a.id,a.cost];});')));
// Frozen proposed policy amounts: independent literals, not an oracle derived
// from production reward values. Source extraction is checked against them.
const oldDeeds = [
  ['d10',5], ['d25',10], ['d50',20], ['d100',50], ['d250',100],
  ['tap100',3], ['tap1000',8], ['tap10000',20], ['fullparty',12],
  ['asc1',10], ['asc5',25], ['asc10',50], ['all',30], ['mythic',40],
  ['idle8',15], ['autotap',25], ['labmaster',30], ['study1',15], ['study25',50],
  ['allstudies',35], ['labqueue',40], ['firstultimate',45], ['modulemax',45]
];
const newDeeds = [['comet_first_command',5], ['comet_first_recharge',10], ['comet_boss_strike',15], ['comet_called_kill',20]];
const retired = [['comettrials',140], ['rifttrail',50], ['starfallcrest',160]];
assert.deepEqual(actualAchievements, oldDeeds);
assert.deepEqual(actualShop, [['autoascend',100], ...retired]);
const claims = [...retired.map(([id,a]) => ['retirement:' + id,a]), ...oldDeeds.map(([id,a]) => ['deed:' + id,a]), ...newDeeds.map(([id,a]) => ['deed:' + id,a])];
const amounts = new Map(claims);
assert.equal(claims.length, 30); assert.equal(claims.reduce((sum, row) => sum + row[1], 0), 1083);
assert.equal(oldDeeds.reduce((sum, row) => sum + row[1], 0), 683);
assert.equal(newDeeds.reduce((sum, row) => sum + row[1], 0), 50);
const clone = x => JSON.parse(JSON.stringify(x));
const sumDue = state => state.pending.reduce((sum, id) => sum + amounts.get(id), 0);
const integral = x => Number.isInteger(x) ? BigInt(x).toString() : {numerator: dyadic(x).n.toString(), exponent2: dyadic(x).e};
const observation = state => ({wallet: state.wallet, walletExact: integral(state.wallet), pending: state.pending.slice(), knownDue: sumDue(state), earned: state.earned.slice()});
function credit(wallet, amount) {
  const next = wallet + amount;
  return Number.isFinite(next) && next - wallet === amount && next - amount === wallet ? next : null;
}
function debit(wallet, amount) {
  if (!Number.isFinite(wallet) || !Number.isFinite(amount) || wallet < amount || amount < 0) return null;
  const next = wallet - amount;
  return Number.isFinite(next) && next >= 0 && wallet - next === amount && next + amount === wallet ? next : null;
}
function add(a, b) {const e = Math.min(a.e, b.e); return {n: (a.n << BigInt(a.e-e)) + (b.n << BigInt(b.e-e)), e};}
function exactCredit(wallet, amount) {
  const target = add(dyadic(wallet), dyadic(amount)), next = wallet + amount;
  return Number.isFinite(next) && compare(dyadic(next), target) === 0 ? next : null;
}
function exactDebit(wallet, amount) {
  if (wallet < amount) return null;
  const target = subtract(dyadic(wallet), dyadic(amount)), next = wallet - amount;
  return compare(dyadic(next), target) === 0 ? next : null;
}
let checks = 6, creditVectors = 0, debitVectors = 0, settlementPasses = 0;
function check(condition, message) {assert(condition, message); checks++;}
function equal(a,b,message) {assert.deepEqual(a,b,message); checks++;}
function canonicalPass(original) {
  const state = clone(original), events = [];
  const beforeConservation = add(dyadic(state.wallet), dyadic(sumDue(state)));
  for (const [id, amount] of claims) {
    if (!state.pending.includes(id)) continue;
    const before = state.wallet, next = credit(before, amount);
    if (next !== null) {state.wallet = next; state.pending.splice(state.pending.indexOf(id), 1);}
    events.push({id, amount, before, beforeExact: integral(before), after: state.wallet, afterExact: integral(state.wallet), credited: next !== null});
  }
  const afterConservation = add(dyadic(state.wallet), dyadic(sumDue(state)));
  equal(compare(beforeConservation, afterConservation), 0, 'each one-pass conserves exact wallet+known due');
  equal(state.earned, original.earned, 'settlement never clears earned/unlocked flags');
  check(new Set(state.pending).size === state.pending.length && state.pending.every(id => amounts.has(id)), 'known unique pending IDs');
  for (const event of events) {
    equal(event.credited ? event.after : null, exactCredit(event.before, event.amount), 'each whole claim exactly representable iff paid');
  }
  settlementPasses++;
  return {state, events};
}
function state(wallet, pending) {return {wallet, pending: pending.slice(), earned: pending.filter(id => id.startsWith('deed:')).map(id => id.slice(5))};}

const wallets = [0, Number.MIN_VALUE, 0.1, 0.125, 0.5, 1, 1.5, 24.5, 25, 49.5, 50, 100, 350, 1083, 1e16, 1e30, Number.MAX_VALUE];
for (let e = 0; e < 2047; e++) {
  for (const frac of [1n, 0xfffffffffffffn]) wallets.push(fromBits((BigInt(e) << 52n) | frac));
}
for (const center of [2**51, 2**52, 2**53, 2**54, 2**55, 2**56]) {
  for (let offset = -200; offset <= 200; offset++) wallets.push(center + offset);
}
const uniqueWallets = [...new Set(wallets)];
const uniqueAmounts = [...new Set(claims.map(x => x[1]))];
const prices = [25,45,60,75,80,100,120,140,180,220];
for (const wallet of uniqueWallets) {
  for (const amount of uniqueAmounts) {equal(credit(wallet, amount), exactCredit(wallet, amount), 'credit oracle'); creditVectors++;}
  for (const price of prices) {equal(debit(wallet, price), exactDebit(wallet, price), 'debit oracle'); debitVectors++;}
}

const allRetired = retired.map(([id]) => 'retirement:' + id);
const examples = [];
for (const [label, wallet] of [['ordinary',0], ['2^54',2**54], ['2^55',2**55], ['huge',1e30]]) {
  const initial = state(wallet, allRetired), first = canonicalPass(initial), second = canonicalPass(first.state);
  const paid = first.events.filter(x=>x.credited).reduce((sum,x)=>sum+x.amount,0);
  examples.push({label, initial: observation(initial), first: {state: observation(first.state), events: first.events, credited: paid}, second: {state: observation(second.state), events: second.events}});
}
equal(examples.map(x=>[x.first.credited,x.first.state.knownDue]), [[350,0],[300,50],[160,190],[0,350]], 'fixed retirement examples');

const nonIdempotent = state(2**54 - 10, allRetired);
const first = canonicalPass(nonIdempotent), second = canonicalPass(first.state), third = canonicalPass(second.state);
equal(first.events.map(x=>x.credited), [false,true,true], 'single-pass initial order');
equal(first.state.pending, ['retirement:comettrials']);
equal(second.events.map(x=>[x.id,x.credited]), [['retirement:comettrials',true]]);
equal(third.state, second.state, 'a settled claim cannot pay again');
check(first.state.wallet !== second.state.wallet, 'first and second canonical endpoints can legitimately differ');

const spendExamples = [];
for (const price of [60,100]) {
  const initial = state(2**54, ['retirement:rifttrail']);
  const pre = canonicalPass(initial);
  equal(pre.state, initial, 'Trail remains due before spend');
  const paidWallet = debit(pre.state.wallet, price);
  check(paidWallet !== null, 'planned spend is exact');
  equal(pre.state.wallet - paidWallet, price, 'staged price debit independent of later credits');
  const working = clone(pre.state); working.wallet = paidWallet;
  const post = canonicalPass(working);
  equal(post.state.pending, [], 'known claim settles only after representable spending');
  equal(compare(dyadic(post.state.wallet), add(subtract(dyadic(initial.wallet),dyadic(price)),dyadic(50))),0, 'final wallet=before-price+credit exactly');
  equal(initial.wallet - post.state.wallet, price - 50, 'net delta includes legitimate 50C claim');
  // Primary/recovery outcomes are a proposed endpoint model, not product tests.
  const primaryFailure = clone(initial), recoveryOnlyFailure = clone(post.state);
  equal(primaryFailure, initial, 'primary failure keeps complete previous endpoint');
  const retry = canonicalPass(Object.assign(clone(primaryFailure), {wallet: debit(primaryFailure.wallet, price)}));
  equal(retry.state, post.state, 'one later successful retry consumes one price and one claim');
  equal(canonicalPass(recoveryOnlyFailure).state, recoveryOnlyFailure, 'post-primary recovery failure must not replay payment');
  spendExamples.push({price, initial: observation(initial), stagedWallet: paidWallet, stagedWalletExact: integral(paidWallet), canonical: observation(post.state), canonicalEvents: post.events, netWalletDecrease: initial.wallet-post.state.wallet, endpointModel: {primaryFailure: observation(primaryFailure), successfulRetry: observation(retry.state), recoveryOnlyFailure: observation(recoveryOnlyFailure)}});
}

// Every known claim present: no amount can disappear across bounded repeat
// passes; full settlement is not promised at an unspendable huge wallet.
const fullFamily = [];
for (const wallet of [0,0.125,0.1,2**53,2**54-10,2**54,2**55,1e16,1e30,Number.MAX_VALUE]) {
  let current = state(wallet, claims.map(x=>x[0]));
  const paidIDs = new Set(), passTrace = [];
  for (let pass = 0; pass < 31; pass++) {
    const next = canonicalPass(current);
    for (const event of next.events.filter(x=>x.credited)) {check(!paidIDs.has(event.id), 'known ID consumed once'); paidIDs.add(event.id);}
    passTrace.push({number: pass+1, credited: next.events.filter(x=>x.credited).map(x=>x.id), wallet: next.state.wallet, walletExact: integral(next.state.wallet), remainingDue: sumDue(next.state)});
    const unchanged = JSON.stringify(current) === JSON.stringify(next.state); current = next.state;
    if (unchanged) break;
  }
  check(current.pending.length + paidIDs.size === 30, 'no claim disappears or multiplies');
  fullFamily.push({initialWallet: wallet, initialWalletExact: integral(wallet), passTrace, final: observation(current), paidIDs: [...paidIDs]});
}

// Existing Deeds credit immediately. Preserve that timing for a genuinely new
// earned flag: try ONLY this newly added identity, without an old-pending sweep
// or nested save. The surrounding real mutation remains the persistence owner.
function awardOne(original, deedId) {
  const claimId = 'deed:' + deedId;
  check(amounts.has(claimId), 'new award ID is known');
  const out = clone(original);
  if (out.earned.includes(deedId)) return {state:out, event:{id:claimId,alreadyEarned:true,attempted:false}};
  const amount = amounts.get(claimId);
  const beforeTotal = add(dyadic(out.wallet),dyadic(sumDue(out)));
  const oldPending = out.pending.slice();
  out.earned.push(deedId); out.pending.push(claimId);
  const before = out.wallet, next = credit(before,amount);
  if (next !== null) {out.wallet=next;out.pending.splice(out.pending.indexOf(claimId),1);}
  const afterTotal = add(dyadic(out.wallet),dyadic(sumDue(out)));
  equal(compare(afterTotal,add(beforeTotal,dyadic(amount))),0,'new earned claim adds its exact fixed value');
  equal(out.pending.filter(id=>id!==claimId),oldPending,'new event does not sweep any old pending identity');
  equal(next,exactCredit(before,amount),'new claim uses the same exact mathematical credit rule');
  return {state:out,event:{id:claimId,amount,alreadyEarned:false,attempted:true,credited:next!==null,before,after:out.wallet}};
}
const newAwardExamples = [];
for (const [label,wallet,pending,deedId] of [
  ['ordinary-immediate',0,[],'d10'],
  ['rounded-three-kept-due',1e16,[],'tap100'],
  ['huge-unlock-kept-immediate',1e30,[],'autotap'],
  ['no-sweep-of-old-payable-deed',0,['deed:tap100'],'d10'],
  ['new-deed-makes-retirement-payable-later',2**54-10,['retirement:comettrials'],'d100']
]) {
  const initial = state(wallet,pending), awarded = awardOne(initial,deedId), repeat = awardOne(awarded.state,deedId);
  equal(repeat.state,awarded.state,'already earned event neither re-awards nor retries');
  check(awarded.state.earned.includes(deedId),'unlock is immediate even with deferred credit');
  const nextCanonical = canonicalPass(awarded.state);
  newAwardExamples.push({label,initial:observation(initial),award:awarded.event,afterAward:observation(awarded.state),repeat:repeat.event,nextCanonical:{state:observation(nextCanonical.state),events:nextCanonical.events}});
}
equal(newAwardExamples[0].afterAward.wallet,5,'ordinary reward needs no extra save delay');
equal(newAwardExamples[1].afterAward.pending,['deed:tap100'],'rounded credit remains exactly three due');
equal(newAwardExamples[2].afterAward.pending,['deed:autotap'],'unlock and twenty-five due both retained');
equal(newAwardExamples[3].afterAward.wallet,5,'new five pays alone, old three is not swept');
equal(newAwardExamples[3].afterAward.pending,['deed:tap100']);
equal(newAwardExamples[3].nextCanonical.state.wallet,8,'old three waits for the documented canonical pass');
equal(newAwardExamples[4].afterAward.pending,['retirement:comettrials']);
equal(newAwardExamples[4].nextCanonical.state.pending,[],'later canonical pass settles the newly representable earlier claim');

// Actual existing F26 function, unchanged, called exactly once before each new
// family pass. This independently exposes cross-family later representability.
const f26 = vm.runInNewContext(f26Source + ';settleOffline12hRefund;');
let mixed = {comets: 2**54-10, prisms: 0, offline12hRefund: {offline24:true,offline48:false,cometsPaid:[false,true],prismPrices:[],prismsPaid:[]}};
let newFamily = state(mixed.comets, ['retirement:rifttrail']);
const f26Trace = [];
for (let pass = 0; pass < 3; pass++) {
  const before = clone(mixed); f26(mixed);
  newFamily.wallet = mixed.comets;
  const family = canonicalPass(newFamily);
  newFamily = family.state; mixed.comets = newFamily.wallet;
  f26Trace.push({number:pass+1, before, afterF26Wallet: family.events.length ? family.events[0].before : mixed.comets, f26Paid: mixed.offline12hRefund.cometsPaid.slice(), familyEvents:family.events, after: clone(mixed), knownDue:sumDue(newFamily)});
}
equal(f26Trace[0].f26Paid, [false,true]);
equal(f26Trace[1].f26Paid, [true,true]);
equal(f26Trace[2].after, f26Trace[1].after, 'F26 remains separately paid, no reconstruction/replay');

const indivisible = state(2**54, ['retirement:rifttrail','deed:comet_first_recharge']);
const intact = canonicalPass(indivisible);
equal(intact.state, indivisible, '50 and 10 each remain original pending claims');
equal(credit(2**54, 60), 2**54+60, 'an aggregated sixty would fit but is explicitly not the policy');
equal(credit(1e16,3), null, '3C cannot be rounded into 4C');
equal((1e16+3)-1e16,4, 'original unsafe credit witness discriminates');
equal(credit(1e30,140),null); equal(debit(1e30,100),null);
equal(debit(2**54,45),null); equal(debit(1e16,100),1e16-100);
equal(credit(2**55,140),null); check(debit(2**55,140)!==null, 'deposit/debit may differ across an exponent boundary');

const result = {
  status:'PASS_DESIGN_MODEL_ORACLE',auditedAt,runtime:process.version,
  scope:'Bounded known-ID proposal, exact arithmetic and model endpoints; actual unchanged F26 helper only. No new ledger implementation/handler/save acceptance.',
  input:{path:sourcePath,bytes:sourceBytes.length,sha256:sha(sourceBytes)},
  sources:[['ACHIEVEMENTS',achievementSource],['SHOP',shopSource],['settleOffline12hRefund',f26Source]].map(([name,text])=>({name,bytes:Buffer.byteLength(text),sha256:sha(text)})),
  dependencies:['prove-ledger.cjs','exact-oracle.cjs'].map(name=>{const b=fs.readFileSync(path.join(__dirname,name));return {name,bytes:b.length,sha256:sha(b)};}),
  counts:{checks,walletVectors:uniqueWallets.length,creditVectors,debitVectors,settlementPasses,claims:30,oldDeeds:23,newDeeds:4,retirementClaims:3,oldDeedComets:683,newDeedComets:50,retirementComets:350,maximumKnownDue:1083},
  orderedClaims:claims.map(([id,amount])=>({id,amount})),examples,
  nonIdempotentSinglePass:{initial:observation(nonIdempotent),first:{state:observation(first.state),events:first.events},second:{state:observation(second.state),events:second.events},third:{state:observation(third.state),events:third.events}},
  spendExamples,fullFamily,newAwardExamples,
  f26CrossFamily:{actualHelperSha256:sha(f26Source),trace:f26Trace,note:'Existing F26 single pass stays first and separate. A later new-family credit can make an earlier F26 claim payable on another canonicalization.'},
  indivisibleCounterexample:{initial:observation(indivisible),after:observation(intact.state),events:intact.events,forbiddenCombinedCredit:60,combinedWouldFit:credit(2**54,60)},
  limitations:['The 1083C bound excludes unchanged F26 claims and all daily/login/quest income.', 'Existing earned Deeds are historically settled at migration by convention; no unseen historical loss can be reconstructed.', 'One pass is not a numerical fixed point. Settled IDs cannot pay twice; due IDs keep original amounts.', 'Primary/recovery checks above are design model endpoint checks, not new product fault tests.', 'A huge or unsuitable fractional wallet may retain all due claims indefinitely; no wallet rounding or partial settlement is permitted.']
};
process.stdout.write(JSON.stringify(result,null,2)+'\n');
