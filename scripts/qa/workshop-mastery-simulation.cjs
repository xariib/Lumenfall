'use strict';

// Forecast Workshop spending from real combat income, then exercise the
// record gates, Mastery purchase and combat paths in the production engine.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const {app, CLOCK, clone} = require('../../tests/behavioral/forge-expansion-harness.cjs');
const Amount = require('../lib/game-amount.cjs');

const [scenario = 'all', output] = process.argv.slice(2);
const source = fs.readFileSync('index.html', 'utf8');
const marker = "if(document.readyState==='loading'){";
assert.equal(source.split(marker).length, 2);
const hooks = `window.endlessQa={
  trees:function(){return NODES;}, studyOnly:advanceStudyOnlyTime, summary:simulationSummary,
  studyCost:studyCost, studyDuration:studyDuration, boostCost:studyBoostCost,
  mastery:getWispMasteryPlan, buyMastery:buyWispMastery,
  astrals:function(){return ASTRAL_UPGRADES;}
};`;
const daySeconds = 86400;
const sampleSeconds = 60;
const party = ['ember', 'tide', 'gale', 'thorn', 'aurora'];
const otherParty = ['ember', 'void', 'gale', 'thorn', 'titan'];
const checkpointDays = new Set([7, 30, 180, 365, 730, 1095, 1825, 3650]);

function world() {
  const game = app(source.replace(marker, hooks + marker), undefined, {clockDate: true, retainWrites: false});
  const {q} = game;
  return {...game, api: q.endless, forge: q.defs().filter(node => !node.retiredTo),
    lab: q.projects().filter(node => !node.retiredTo)};
}

function develop(s, formation, level) {
  s.activeParty = formation.slice();
  s.activeFormationPreset = '';
  for (const id of Object.keys(s.spirits)) {
    s.spirits[id] = level;
    s.heroRarity[id] = 5;
    s.wispModules[id] = 20;
    s.wispUltimate[id] = true;
    s.empowerQueue[id] = false;
  }
  s.ascendCount = 100;
  s.totalKills = 10000;
  return s;
}

function place(s, depth, record, farm = false) {
  s.depth = depth;
  s.maxDepthEver = record;
  s.enemyDepth = 0;
  s.riftMode = farm ? 'farm' : 'push';
  s.farmDepth = farm ? depth : 0;
  s.farmReturnDepth = farm ? record : 0;
}

function cappedFixture(w, depth, formation, mastery = 0) {
  const s = develop(w.q.fresh(), formation, 10000);
  place(s, depth, depth);
  for (const node of w.forge) s.research[node.id] = node.levelCap;
  for (const node of w.lab) s.longStudyLevels[node.id] = node.levelCap;
  for (const node of w.api.trees()) if (!node.retiredTo) s.nodes[node.id] = node.levelCap;
  for (const node of w.api.astrals()) s.astralUpgrades[node.id] = node.cap;
  s.wispMastery.ember = mastery;
  s.ascendRewardedDepth = depth - 1;
  s.lumen = s.shards = s.prisms = s.sigils = 0;
  return s;
}

function catalogAndLabFloor() {
  const w = world();
  const s = cappedFixture(w, 5020, party);
  s.research.masterwork = w.forge.find(node => node.id === 'masterwork').levelCap - 1;
  w.q.set(s);
  const finalMasterwork = w.q.plan('masterwork', 1);
  const fullCap = w.forge.map(node => {
    const previous = w.q.get().research[node.id];
    w.q.get().research[node.id] = node.levelCap - 1;
    const plan = w.q.plan(node.id, 1);
    w.q.get().research[node.id] = previous;
    return {id: node.id, name: node.name, cap: node.levelCap, lastRankRift: plan.requiredDepth};
  });
  const work = w.lab.map(node => {
    let seconds = 0;
    for (let level = 0; level < node.levelCap; level++) seconds += w.api.studyDuration(node, level);
    return {id: node.id, name: node.name, cap: node.levelCap, minimumDays1x: seconds / daySeconds,
      minimumDays8x: seconds / daySeconds / 8, lastRankCost: w.api.studyCost(node, node.levelCap - 1)};
  });
  const slots = w.q.slots();
  const totalDays = work.reduce((sum, row) => sum + row.minimumDays1x, 0);
  const longest = work.reduce((max, row) => row.minimumDays1x > max.minimumDays1x ? row : max);
  const days = Math.max(longest.minimumDays1x, totalDays / slots);
  return {forge: fullCap, lastMasterworkRift: finalMasterwork.requiredDepth, lab: work,
    labFloor: {slots, totalSlotDays1x: totalDays, longest, days1x: days, days8x: days / 8,
      dailyMotesFiveSlots8x: slots * w.api.boostCost(8, 24)}};
}

function fundedLabSchedule(boost) {
  const w = world();
  const {q, api, lab} = w;
  const s = q.fresh();
  s.maxDepthEver = 5020;
  s.ascendCount = 100;
  s.lumen = s.shards = s.motes = '1e90';
  for (const node of lab) s.studyQueue[node.id] = true;
  s.studyBoostQueue = {};
  if (boost) for (let slot = 0; slot < 5; slot++) s.studyBoostQueue['slot' + slot] = {enabled: true, mult: 8, hours: 24};
  q.set(s);
  const dates = {};
  let motesSpent = 0;
  for (let day = 1; day <= 16000; day++) {
    const start = CLOCK + (day - 1) * daySeconds * 1000;
    const summary = api.summary(daySeconds);
    api.studyOnly(daySeconds, start, summary);
    motesSpent = Amount.exactAdd(motesSpent, summary.studyMotesSpent);
    for (const node of lab) if (q.get().longStudyLevels[node.id] >= node.levelCap && !dates[node.id]) dates[node.id] = day;
    if (Object.keys(dates).length === lab.length) return {days: day, dates, motesSpent, boost};
  }
  throw Error('Funded Lab schedule did not finish within its time budget');
}

function farmSensitivity() {
  return [1001, 2501, 10001, 25001, 40001, 50001, 60001].map(depth => {
    const w = world();
    const s = cappedFixture(w, depth, party, 4000);
    place(s, depth, 100000, true);
    w.q.set(s);
    w.q.restoreEnemy();
    w.q.achievements();
    return {depth, per24Hours: collectDailyIncome(w, CLOCK, 24)};
  });
}

function collectDailyIncome(w, now, productiveHours) {
  const {q} = w;
  const s = q.get();
  const old = {lumen: s.lumen, shards: s.shards, motes: s.motes};
  const lab = {activeStudies: s.activeStudies, studyQueue: s.studyQueue,
    studyBoosts: s.studyBoosts, studyBoostQueue: s.studyBoostQueue};
  // Only the sample's combat income is extrapolated. The real Lab timeline
  // advances separately so the same sixty seconds of work are never counted twice.
  s.activeStudies = [];
  s.studyQueue = {};
  s.studyBoosts = {};
  s.studyBoostQueue = {};
  w.clock(now);
  const sample = q.advance(sampleSeconds, {kind: 'offline', clockStartMs: now});
  const scale = productiveHours * 3600 / sampleSeconds;
  const income = {lumen: Amount.mul(sample.lumenGained, scale),
    shards: Amount.mul(sample.shardGained, scale), motes: Amount.mul(sample.motesGained, scale)};
  assert.equal(sample.elapsedSec, sampleSeconds);
  assert(sample.kills > 0, 'the mature benchmark can farm at its chosen Rift');
  Object.assign(q.get(), lab, {lumen: Amount.exactAdd(old.lumen, income.lumen),
    shards: Amount.exactAdd(old.shards, income.shards), motes: Amount.exactAdd(old.motes, income.motes)});
  return income;
}

function workshopForecast(productiveHours, boost, horizon, lateFarm = false) {
  const w = world();
  const {q, api, forge, lab} = w;
  const s = develop(q.fresh(), party, 10000);
  place(s, lateFarm ? 60001 : 1001, lateFarm ? 60001 : 10000, true);
  s.nodes.echo = 6;
  s.research.arcanecal = 10;
  s.longStudyLevels.wispascend = 176;
  if (lateFarm) {
    // Existing paid prerequisites for the assumed late-game Ember rank.
    s.wispMastery.ember = 2490;
    s.research.masterwork = 498;
    s.nodes.swift = 250;
    s.longStudyLevels.wispascend = 500;
  }
  s.lumen = s.shards = s.motes = 0;
  for (const node of lab) s.studyQueue[node.id] = true;
  s.studyBoostQueue = {};
  if (boost) for (let slot = 0; slot < 5; slot++) s.studyBoostQueue['slot' + slot] = {enabled: true, mult: 8, hours: 24};
  q.set(s);
  q.restoreEnemy();
  q.achievements();
  const initial = {forge: clone(q.get().research), lab: clone(q.get().longStudyLevels),
    activeParty: q.get().activeParty.slice(), wisps: clone(q.get().spirits), mastery: clone(q.get().wispMastery), rift: q.get().depth,
    record: q.get().maxDepthEver, ascends: q.get().ascendCount};
  const daysAtCap = {forge: {}, lab: {}};
  for (const [key, rows] of [['forge', forge], ['lab', lab]]) {
    for (const node of rows) if (initial[key][node.id] >= node.levelCap) daysAtCap[key][node.id] = 0;
  }
  const milestones = [];
  let motesSpent = 0, forgeDay = null, labDay = null;
  for (let day = 1; day <= horizon; day++) {
    const start = CLOCK + (day - 1) * daySeconds * 1000;
    const income = collectDailyIncome(w, start, productiveHours);
    // Let queued studies claim today's deposit before reinvesting in Forge.
    const studySummary = api.summary(daySeconds);
    api.studyOnly(daySeconds, start, studySummary);
    motesSpent = Amount.exactAdd(motesSpent, studySummary.studyMotesSpent);
    w.clock(start + daySeconds * 1000);
    const rotation = day % forge.length;
    for (const node of forge.slice(rotation).concat(forge.slice(0, rotation))) {
      if (q.plan(node.id, 'max').affordable) assert(q.buy(node.id, 'max'), node.name);
    }
    for (const [key, rows, levels] of [['forge', forge, q.get().research], ['lab', lab, q.get().longStudyLevels]]) {
      for (const node of rows) {
        if (levels[node.id] >= node.levelCap && !Object.hasOwn(daysAtCap[key], node.id)) daysAtCap[key][node.id] = day;
      }
    }
    const forgeCount = Object.keys(daysAtCap.forge).length;
    const labCount = Object.keys(daysAtCap.lab).length;
    const newlyFinished = (forgeCount === forge.length && !forgeDay) || (labCount === lab.length && !labDay);
    if (forgeCount === forge.length && !forgeDay) forgeDay = day;
    if (labCount === lab.length && !labDay) labDay = day;
    if (checkpointDays.has(day) || newlyFinished || day === horizon) {
      milestones.push({day, forgeCount, labCount, slots: q.slots(), income,
        forge: clone(q.get().research), lab: clone(q.get().longStudyLevels), motes: q.get().motes});
    }
    if (forgeDay && labDay) break;
  }
  return {productiveHours, wantPaid8x: boost, horizon, initial, forgeDay, labDay,
    bothDay: forgeDay && labDay ? Math.max(forgeDay, labDay) : null, motesSpent, daysAtCap, milestones};
}

function masteryReplay() {
  const w = world();
  const {q, api} = w;
  const optimistic = cappedFixture(w, 1001, otherParty);
  q.set(optimistic);
  q.restoreEnemy();
  q.achievements();
  const zeroMastery = q.advance(1800, {kind: 'live', clockStartMs: CLOCK});
  const endDepth = q.get().depth;
  const masterworkGate = 5020;
  const atGate = cappedFixture(w, masterworkGate, otherParty);
  q.set(atGate);
  q.restoreEnemy();
  q.achievements();
  const damageToRegen = Amount.ratio(q.sustained(masterworkGate), Amount.mul(q.enemyHp(masterworkGate), q.regen(masterworkGate)));
  const gate = q.advance(120, {kind: 'live', clockStartMs: CLOCK});

  const start = 50180;
  const tail = cappedFixture(w, start, otherParty, 2000);
  q.set(tail);
  q.restoreEnemy();
  q.achievements();
  const earned = q.advance(120, {kind: 'live', clockStartMs: CLOCK});
  w.clock(CLOCK + 120000);
  const record = q.get().maxDepthEver;
  const beforeAscend = {sigils: q.get().sigils, prisms: q.get().prisms, quote: q.prismPreview().gain};
  assert(q.ascend(), 'a new clear can fund Mastery through real Ascension');
  const afterAscend = {sigils: q.get().sigils, prisms: q.get().prisms, depth: q.get().depth};
  const sp = q.sp('ember');
  const purchased = [];
  for (let i = 0; i < 100; i++) {
    const plan = api.mastery(sp);
    if (!plan.affordable) break;
    assert(api.buyMastery(sp), 'actual paid Mastery purchase');
    purchased.push({rank: q.get().wispMastery.ember, cost: plan.cost});
  }
  const blocked = api.mastery(sp);
  const wallets = {prisms: q.get().prisms, sigils: q.get().sigils};
  const earnedRank = q.get().wispMastery.ember;
  const purseShortfall = Amount.max(0, Amount.sub(blocked.cost.prism, wallets.prisms));
  let comparisonRank = earnedRank;
  if (blocked.reason === 'funds' && Amount.ge(wallets.sigils, blocked.cost.sigil) && Amount.gt(purseShortfall, 0)) {
    q.get().prisms = Amount.exactAdd(wallets.prisms, purseShortfall);
    assert(api.buyMastery(sp), 'a pre-existing Prism reserve pays the affordable tail price');
    comparisonRank = q.get().wispMastery.ember;
  }
  // The battle-only comparison returns to the same developed roster and Rift.
  // It isolates bought Power from the time needed to rebuild after Ascension.
  function compare(rank) {
    q.set(cappedFixture(w, 50200, otherParty, rank));
    q.restoreEnemy();
    q.achievements();
    const advanced = q.advance(120, {kind: 'live', clockStartMs: CLOCK});
    return {rank, kills: advanced.kills, record: q.get().maxDepthEver};
  }
  const comparisons = [compare(2000), compare(comparisonRank)];
  const oneRiftQuotes = [];
  for (let depth = 50201; depth <= 50220; depth++) {
    const state = q.get();
    state.ascendRewardedDepth = depth - 2;
    oneRiftQuotes.push(q.prismPreview(depth).gain);
  }
  return {zeroMastery: {startsAt: 1001, seconds: zeroMastery.elapsedSec, kills: zeroMastery.kills, endDepth},
    masterworkGate: {rift: masterworkGate, seconds: gate.elapsedSec, kills: gate.kills, damageToRegen},
    tail: {start, startingRank: 2000, seconds: earned.elapsedSec, kills: earned.kills, record, beforeAscend,
      afterAscend, purchased, wallets, next: {reason: blocked.reason, cost: blocked.cost, requirements: blocked.requirements},
      prismShortfall: purseShortfall, oneRiftAscendsTotalPrisms: oneRiftQuotes.reduce((sum, gain) => sum + gain, 0),
      comparison: comparisons,
      hpGrowthPer20: Amount.ratio(q.enemyHp(50220), q.enemyHp(50200))}};
}

const cases = {continuous: [24, true, 2400], halfday: [12, true, 4000], unboosted: [24, false, 5500],
  deep: [12, true, 2400, true]};
const result = {version: '0.2.153', sourceSha256: crypto.createHash('sha256').update(source).digest('hex'),
  node: process.version};
if (scenario === 'all' || scenario === 'catalog') result.catalog = catalogAndLabFloor();
if (scenario === 'all' || scenario === 'mastery') result.mastery = masteryReplay();
if (scenario === 'all' || scenario === 'funded-lab') result.fundedLab = [fundedLabSchedule(true), fundedLabSchedule(false)];
if (scenario === 'all' || scenario === 'farm') result.farm = farmSensitivity();
for (const [key, settings] of Object.entries(cases)) {
  if (scenario === 'all' || scenario === key) result[key] = workshopForecast(...settings);
}
assert(Object.keys(result).length > 3, `unknown scenario ${scenario}`);
const json = JSON.stringify(result, null, 2) + '\n';
if (output) fs.writeFileSync(output, json);
else process.stdout.write(json);
