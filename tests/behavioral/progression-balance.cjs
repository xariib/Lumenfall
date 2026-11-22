'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const {app, CLOCK} = require('./forge-expansion-harness.cjs');
const Amount = require('../../scripts/lib/game-amount.cjs');

const [file = 'index.html', mode] = process.argv.slice(2);
const historical = mode === '--baseline';
const source = fs.readFileSync(file, 'utf8');
const marker = "if(document.readyState==='loading'){";
assert.equal(source.split(marker).length, 2);
const instrumented = source.replace(marker, `window.endlessQa={
  farm:enterFarmMode,push:enterPushMode,mastery:getWispMasteryPlan,buyMastery:buyWispMastery,
  cost:studyCost,duration:studyDuration,startStudy:startStudy,
  studyOnly:advanceStudyOnlyTime,summary:simulationSummary
};` + marker);
const hour = 3600;

function openGame() {
  return app(instrumented, undefined, {clockDate: true, retainWrites: false});
}

function roster(q, depth, level, masterwork, lab) {
  const save = q.fresh();
  Object.assign(save, {depth, maxDepthEver: depth, totalKills: 20000, ascendCount: 60});
  save.activeParty = ['ember', 'tide', 'gale', 'thorn', 'void'];
  for (const id of save.activeParty) {
    save.spirits[id] = level;
    save.heroRarity[id] = 5;
    save.wispModules[id] = 20;
    save.empowerQueue[id] = false;
  }
  Object.assign(save.research, {masterwork, cauterize: 12, conduction: 15, arcanecal: 12,
    battletempering: 120, arcanetempering: 120, charge: 10});
  Object.assign(save.longStudyLevels, {wispascend: lab, guardmastery: 40, wispdamage: 35,
    wispcritchance: 25, wispcritdamage: 20, lumenstudy: 60, shardstudy: 60});
  Object.assign(save.astralUpgrades, {astralcore: 4, astralecho: 3, astralconvergence: 3});
  Object.assign(save.nodes, {swift: 15, echo: 6, bonds: 10, starlight: 10, steady: 10});
  save.lumen = save.shards = save.prisms = save.sigils = 0;
  return save;
}

function firstMastery() {
  const {q, clock} = openGame();
  const save = roster(q, 1, 200, 15, 115);
  save.maxDepthEver = 199;
  save.ascendRewardedDepth = 198;
  q.set(save);
  q.restoreEnemy();
  q.achievements();
  const elapsed = 600;
  const combat = q.advance(elapsed, {kind: 'live', clockStartMs: CLOCK, visual: false});
  clock(CLOCK + elapsed * 1000);
  const before = {record: q.get().maxDepthEver, sigils: q.get().sigils, prisms: q.get().prisms};
  assert(Amount.gt(combat.sigilsGained, 0), 'boss combat earns Sigils');
  const ultimate = q.ultimate('ember');
  assert.equal(ultimate, !historical, 'an earned wallet funds Ultimate at the developed fixture');
  assert(q.ascend(), 'a new clear earns a manual Ascend');
  const sp = q.sp('ember'), plan = q.endless.mastery(sp);
  const available = {prisms: q.get().prisms, sigils: q.get().sigils};
  assert.equal(q.endless.buyMastery(sp), !historical, 'first Mastery uses only the earned wallets');
  if (!historical) {
    assert.equal(q.get().wispMastery.ember, 1);
    assert.equal(q.get().prisms, Amount.exactSub(available.prisms, plan.cost.prism));
    assert.equal(q.get().sigils, Amount.exactSub(available.sigils, plan.cost.sigil));
    q.load();
    assert.equal(q.get().wispMastery.ember, 1, 'earned rank survives a reload');
  }
  return {before, ultimate, available, firstRank: q.get().wispMastery.ember};
}

function farmAndPush(depth, level, masterwork, lab, hours, kind = 'live') {
  const {q, clock} = openGame();
  const save = roster(q, depth, level, masterwork, lab);
  for (const id of save.activeParty) {
    save.wispUltimate[id] = true;
    save.wispMastery[id] = Math.min(90, Math.floor((depth - 200) / 25));
  }
  q.set(save);
  q.restoreEnemy();
  q.achievements();
  assert(q.endless.farm());
  const income = q.advance(hours * hour, {kind: 'offline', clockStartMs: CLOCK,
    offlineWindowStartMs: CLOCK, visual: false});
  assert.equal(income.elapsedSec, hours * hour);
  assert.equal(q.get().depth, depth - 1);
  assert(Amount.gt(income.lumenGained, 0) && Amount.gt(income.shardGained, 0));

  const returnedAt = CLOCK + hours * hour * 1000;
  clock(returnedAt);
  const purchases = {};
  for (const id of ['masterwork', 'cauterize', 'arcanetempering', 'battletempering', 'conduction', 'arcanecal']) {
    const plan = q.plan(id, 'max');
    if (plan.affordable) {
      assert(q.buy(id, 'max'), `buy funded Forge ranks for ${id}`);
      purchases[id] = q.get().research[id];
    }
  }
  for (const id of save.activeParty) {
    let count = 0;
    while (count < 50 && q.empower(id)) count++;
    if (count) purchases[id] = count;
  }
  assert(q.endless.push());
  const push = q.advance(900, {kind, clockStartMs: returnedAt, offlineWindowStartMs: returnedAt, visual: false});
  return {hours, kind, farmKills: income.kills, lumen: income.lumenGained, shards: income.shardGained,
    purchases, pushKills: push.kills, record: q.get().maxDepthEver};
}

function compareBosses() {
  return [[1500, 260, 80, 115, 8], [2500, 275, 175, 118, 4]].map(([depth, level, masterwork, lab, clearHours]) => {
    const oneHour = farmAndPush(depth, level, masterwork, lab, 1);
    assert.equal(oneHour.record > depth, historical, `one-hour comparison at Rift ${depth}`);
    const longer = farmAndPush(depth, level, masterwork, lab, clearHours);
    assert(longer.record > depth, `a longer farm and reinvestment clears Rift ${depth}`);
    if (historical) return {depth, oneHour, longer};
    const offline = farmAndPush(depth, level, masterwork, lab, clearHours, 'offline');
    assert.equal(offline.record, longer.record, `offline and live clear the same Rift range at ${depth}`);
    assert.equal(offline.pushKills, longer.pushKills);
    return {depth, oneHour, longer, offline};
  });
}

function studyTail() {
  const {q, clock} = openGame();
  const node = q.projects().find(project => project.id === 'motestudy');
  const save = q.fresh();
  save.maxDepthEver = 10001;
  save.longStudyLevels.motestudy = 499;
  q.set(save);
  const previous = q.endless.cost(node, 100);
  const next = q.endless.cost(node, 101);
  const ratio = historical ? 1.35 : 1.025;
  for (const currency of ['lumen', 'shard']) {
    const base = currency === 'lumen' ? node.lumenBase : node.shardBase;
    const original = base * 1.6 ** 30 * 1.35 ** 70;
    assert(Math.abs(Amount.ratio(previous[currency], original) - 1) < 1e-12);
    assert(Math.abs(Amount.ratio(next[currency], previous[currency]) - ratio) < 1e-12);
  }
  const last = q.endless.cost(node, 499);
  const work = q.endless.duration(node, 499);
  assert.equal(work, 864000, 'the full ten-day base work is retained');
  if (historical) return {last, work};
  q.get().lumen = last.lumen;
  q.get().shards = last.shard;
  assert(q.endless.startStudy(node), 'the displayed high-rank costs fund the actual study');
  assert.equal(q.get().lumen, 0);
  assert.equal(q.get().shards, 0);
  q.load();
  assert.equal(q.get().activeStudies[0].remainingSec, work);
  assert.equal(q.get().longStudyLevels.motestudy, 499);
  const start = CLOCK + (work - hour) * 1000;
  clock(start);
  q.endless.studyOnly(work - hour, CLOCK, q.endless.summary(work - hour));
  assert.equal(q.get().longStudyLevels.motestudy, 499, 'completion waits for all paid work');
  q.endless.studyOnly(hour, start, q.endless.summary(hour));
  assert.equal(q.get().longStudyLevels.motestudy, 500, 'the paid study reaches the existing cap');
  return {last, work};
}

const result = {status: 'PASS', sourceSha256: crypto.createHash('sha256').update(source).digest('hex'),
  firstMastery: firstMastery(), lab: studyTail(), bosses: compareBosses()};
console.log(JSON.stringify(result, null, 2));
