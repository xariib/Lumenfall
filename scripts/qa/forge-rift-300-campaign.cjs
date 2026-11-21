'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const {app, CLOCK, clone} = require('../../tests/behavioral/forge-expansion-harness.cjs');
const amount = require('../lib/game-amount.cjs');

const [file = 'index.html', maxHours = '720', output, strategy = 'forge'] = process.argv.slice(2);
assert(['forge', 'boss', 'developed'].includes(strategy));
const developed = strategy === 'developed';
const bossFocus = strategy !== 'forge';
const deadline = Number(maxHours) * 3600;
assert(Number.isFinite(deadline) && deadline > 0);
const source = fs.readFileSync(file, 'utf8');
const marker = "if(document.readyState==='loading'){";
assert.equal(source.split(marker).length, 2);
const observation = `
  window.endlessQa={wisps:function(){return SPIRITS;},nodes:function(){return NODES;},
    wispPlan:getSpiritBuyPlan,rarityPlan:getWispRarityPlan,modulePlan:getWispModulePlan,
    rarity:buyRarity,module:buyModule,treePlan:getNodeBuyPlan,treeBuy:buyNode,
    boost:activateStudyBoost,boostCost:studyBoostCost,eligible:ascendEligible,
    push:enterPushMode,farm:enterFarmMode,selectFarm:selectFarmDepth,progressionDepth:progressionDepth,
    field:fieldBestNowFormation,partyPlan:bestNowFormationPlan,
    day:ensureDaily,claim:function(){(state.questIds||[]).forEach(function(id){claimQuest(id);});},
    observeDepth:function(fn){window.qaObserveDepth=fn;}};
  var qaSimulationKill=simulationDefeatEnemy,qaManualKill=defeatEnemy;
  simulationDefeatEnemy=function(policy,summary){qaSimulationKill(policy,summary);window.qaObserveDepth(state,policy.nowMs);};
  defeatEnemy=function(){qaManualKill();window.qaObserveDepth(state,Date.now());};
`;
const x = app(source.replace(marker, observation + marker), undefined, {clockDate: true, retainWrites: false});
const q = x.q, b = q.endless;
// Set the test clock before initializing the game's own dates and enemy.
const fresh = q.fresh();
assert.deepEqual(fresh.activeParty, ['ember']);
assert(Object.values(fresh.research).every(rank => rank === 0));
if (developed) {
  // An explicitly seeded developed account for the late push sensitivity run.
  // It receives no wallet or Forge ranks. This is not a fresh campaign.
  Object.assign(fresh, {depth: 180, maxDepthEver: 180, ascendCount: 50, totalKills: 20000, totalTaps: 10000});
  Object.assign(fresh.longStudyLevels, {wispascend: 100, guardmastery: 60, wispdamage: 40,
    wispcritchance: 20, lumenstudy: 50, shardstudy: 50});
  fresh.activeParty = ['ember', 'stone', 'tide', 'void', 'titan'];
  for (const id of fresh.activeParty) {
    fresh.spirits[id] = 230;
    fresh.heroRarity[id] = 5;
    fresh.wispModules[id] = 15;
  }
}
q.set(fresh);
q.restoreEnemy();
if (developed) q.achievements();

const tracks = q.defs().filter(node => !node.retiredTo);
const short = tracks.filter(node => node.levelCap <= 20);
const long = tracks.filter(node => node.levelCap > 20);
const thresholds = [16, 25, 50, 75, 100, 120, 150, 175, 200, 225, 250, 275, 300, 301];
const milestones = {}, capped = {}, resets = [];
let elapsed = 0, lastReset = -Infinity, lastProgress = 0, lastDepth = 1, lastRecord = 1, lastRecordAt = 0;
let farmUntil = 0, nextCheck = 3600, manualTaps = 0, farmSeconds = 0;
let lastField = '', paidForge = 0;
const started = {depth: q.get().depth, record: q.get().maxDepthEver, levels: clone(q.get().spirits),
  forge: clone(q.get().research), labs: clone(q.get().longStudyLevels), ascends: q.get().ascendCount,
  lumen: q.get().lumen, shards: q.get().shards};

function snapshot(state, at) {
  const levels = Object.fromEntries(tracks.map(node => [node.id, state.research[node.id]]));
  return {
    hours: at / 3600, depth: state.depth, record: state.maxDepthEver,
    ascends: state.ascendCount, defeats: state.totalKills,
    shortMaxed: short.filter(node => levels[node.id] >= node.levelCap).map(node => node.id),
    longLevels: Object.fromEntries(long.map(node => [node.id, levels[node.id]])),
    levels, lumen: state.lumen, shards: state.shards,
    party: state.activeParty.slice(), wisps: clone(state.spirits),
    labs: clone(state.longStudyLevels), rarity: clone(state.heroRarity),
    modules: clone(state.wispModules), prisms: state.prisms, motes: state.motes,
  };
}

b.observeDepth((state, now) => {
  if (state.riftMode !== 'push') return;
  if (state.maxDepthEver > lastRecord) {
    lastRecord = state.maxDepthEver;
    lastRecordAt = (now - CLOCK) / 1000;
  }
  if (thresholds.includes(state.depth) && !milestones[state.depth]) {
    milestones[state.depth] = snapshot(state, (now - CLOCK) / 1000);
    process.stderr.write(`Reached Rift ${state.depth}, ${milestones[state.depth].hours.toFixed(2)}h, ${milestones[state.depth].shortMaxed.length}/20 short Forge tracks maxed\n`);
  }
});

function fits(cost, fraction) {
  return amount.le(cost.lumen, amount.mul(q.get().lumen, fraction)) &&
    amount.le(cost.shard, amount.mul(q.get().shards, fraction));
}

function buyForge(nodes, budget, maxBuys) {
  for (let count = 0; count < maxBuys; count++) {
    const options = nodes.map(node => ({node, plan: q.plan(node.id, 1)}))
      .filter(({plan}) => plan.affordable && fits(plan.cost, budget));
    if (!options.length) break;
    options.sort((a, c) => amount.cmp(amount.add(a.plan.cost.lumen, a.plan.cost.shard),
      amount.add(c.plan.cost.lumen, c.plan.cost.shard)));
    const {node, plan} = options[0];
    const rank = q.get().research[node.id];
    assert(q.buy(node.id, 1), `pay for ${node.id}`);
    assert.equal(q.get().research[node.id], rank + 1);
    paidForge++;
    if (rank + 1 === node.levelCap) {
      capped[node.id] = {hours: elapsed / 3600, rift: b.progressionDepth(), record: q.get().maxDepthEver, price: plan.cost};
    }
  }
}

function act() {
  const state = q.get();
  b.day();
  b.claim();
  if (state.riftMode === 'farm' && elapsed >= farmUntil) {
    b.push();
    lastProgress = elapsed;
  }
  const depth = b.progressionDepth();
  if (depth > lastDepth) lastProgress = elapsed;
  lastDepth = depth;
  const waiting = elapsed - lastProgress;
  const ascendFirst = state.ascendCount === 0;
  const ascendForDevelopment = state.ascendCount < (bossFocus ? 15 : 5) && elapsed - lastReset >= 900 && waiting >= 120;
  const longWall = bossFocus ? elapsed - Math.max(lastReset, lastRecordAt) >= 3600 : waiting >= 3600;
  if (!developed && b.eligible() && (ascendFirst || ascendForDevelopment || longWall)) {
    assert(q.ascend());
    resets.push({hours: elapsed / 3600, cleared: depth - 1, prisms: q.get().prisms});
    lastReset = lastProgress = elapsed;
    lastDepth = 1;
  } else if (q.get().riftMode === 'push' && waiting >= 120 && depth > 1) {
    assert(b.farm());
    farmUntil = elapsed + Math.min(1800, 180 + 150 * Math.floor(elapsed / 3600));
    lastProgress = elapsed;
  }

  const tree = ['starlight', 'steady', 'echo', 'bonds', 'swift', 'reserves', 'lumenmemory', 'veteranrecruits'];
  const treeOptions = b.nodes().filter(node => tree.includes(node.id) && b.treePlan(node).affordable);
  treeOptions.sort((a, c) => amount.cmp(b.treePlan(a).cost, b.treePlan(c).cost));
  if (treeOptions.length) b.treeBuy(treeOptions[0]);

  const subjects = ['wispascend', 'wispdamage', 'guardmastery', 'lumenstudy', 'shardstudy', 'formationstudy', 'measuredinquiry'];
  if (bossFocus) subjects.splice(2, 0, 'wispcritchance', 'wispcritdamage');
  for (const id of subjects) {
    q.startStudy(id);
  }
  const growth = q.get().activeStudies.find(study => study.id === 'wispascend');
  if (bossFocus && growth && growth.speedMult === 1) {
    const tier = [8, 5, 3, 2, 1.5].find(speed => amount.le(b.boostCost(speed, 8), amount.mul(q.get().motes, 0.75)));
    if (tier) b.boost('wispascend', tier, 8);
  }

  buyForge(short, bossFocus ? 0.3 : 0.75, 24);
  buyForge(long, bossFocus ? 0.35 : 0.18, 8);

  for (const sp of b.wisps()) {
    const rank = q.get().spirits[sp.id];
    const plan = b.wispPlan(sp);
    if (!rank && plan.affordable && amount.le(plan.cost, amount.mul(q.get().lumen, 0.8))) q.empower(sp.id);
    if (!q.get().spirits[sp.id]) continue;
    const rarity = b.rarityPlan(sp), ability = b.modulePlan(sp);
    if (rarity.affordable && fits(rarity.cost, 0.5)) b.rarity(sp);
    if (ability.affordable && fits(ability.cost, 0.25)) b.module(sp);
  }
  for (let count = 0; count < 16; count++) {
    const roster = b.wisps().filter(sp => q.get().spirits[sp.id] > 0)
      .map(sp => ({sp, plan: b.wispPlan(sp)}))
      .filter(({plan}) => plan.affordable && amount.le(plan.cost, amount.mul(q.get().lumen, 0.35)));
    if (!roster.length) break;
    roster.sort((a, c) => amount.cmp(a.plan.cost, c.plan.cost));
    if (!q.empower(roster[0].sp.id)) break;
  }
  const key = JSON.stringify([q.get().riftMode, b.progressionDepth(), q.get().spirits, q.get().heroRarity]);
  if (lastField !== key && b.wisps().filter(sp => q.get().spirits[sp.id] > 0).length > 1) {
    if (b.partyPlan().available) b.field();
    lastField = key;
  }
}

// Each interval is advanced by the actual game engine. The observer snapshots
// the first encounter at each checkpoint before any further rewards or buys.
while (elapsed < deadline && !milestones[301]) {
  act();
  const farming = q.get().riftMode === 'farm';
  const seconds = Math.min(deadline - elapsed, farming ? 60 : 10);
  for (let t = 0; t < seconds && !milestones[301];) {
    const tap = !q.get().achieved.autotap || (bossFocus && !farming && q.get().depth % 10 === 0);
    const step = tap ? 1 : seconds - t;
    x.clock(CLOCK + elapsed * 1000);
    if (tap) { q.manualTap(); manualTaps++; }
    if (milestones[301]) break;
    const result = q.advance(step, {kind: 'live', clockStartMs: CLOCK + elapsed * 1000, visual: false});
    assert.equal(result.elapsedSec, step, 'complete engine interval');
    elapsed += step;
    t += step;
    if (farming) farmSeconds += step;
  }
  x.clock(CLOCK + elapsed * 1000);
  x.drain();
  if (elapsed >= nextCheck) {
    process.stderr.write(`${(elapsed / 3600).toFixed(1)}h, record ${q.get().maxDepthEver}, ${Object.keys(capped).length}/24 Forge tracks maxed\n`);
    nextCheck += 3600;
  }
}

const result = {
  status: milestones[301] ? 'CLEARED_RIFT_300' : 'TIME_LIMIT',
  sourceSha256: crypto.createHash('sha256').update(source).digest('hex'),
  strategy,
  policy: (developed ? 'Seeded developed account at Rift 180 with five level-230 Mythic Wisps, ability 15, 50 Ascends and completed Labs. Zero starting Lumen, Shards and Forge ranks. No further Ascends.' : 'Fresh account with only Ember and no granted resources or unlocks.') +
    ' Continuous active play, one manual tap per second until earned Auto-Tap. Purchases every ten seconds in Push and every sixty seconds while farming. Spend on short Forge ranks first, then long ranks and Wisp development, with budget caps per purchase. Paid Labs, earned Tree and daily quests. Farm after a two-minute wall.' +
    (bossFocus ? ' Boss strategy also taps after Auto-Tap during boss fights, sets stricter short-rank budgets and larger long-rank budgets, buys paid eight-hour boosts when affordable, and prioritizes critical Labs.' : ' Forge strategy does not buy Lab boosts.'),
  started,
  elapsed, manualTaps, farmSeconds, paidForge, resets, thresholds, milestones, capped,
  caps: Object.fromEntries(tracks.map(node => [node.id, node.levelCap])),
  endpoint: snapshot(q.get(), elapsed),
};
if (developed && milestones[301]) {
  // Separate affordability comparison. Reuse the account that actually
  // cleared 300 and spend a single eight-hour farm window on the Forge.
  const masterwork = q.plan('masterwork', 1);
  assert.equal(masterwork.limit, 25);
  result.availableRankLimits = Object.fromEntries(tracks.map(node => [node.id, q.plan(node.id, 1).limit]));
  assert.equal(tracks.filter(node => result.availableRankLimits[node.id] >= node.levelCap).length, 23);
  assert(b.selectFarm(299));
  const start = CLOCK + elapsed * 1000;
  const seconds = 8 * 3600;
  const farm = q.advance(seconds, {kind: 'offline', clockStartMs: start, offlineWindowStartMs: start});
  assert.equal(farm.elapsedSec, seconds);
  assert.equal(q.get().depth, 299);
  x.clock(start + seconds * 1000);
  const fundedWallet = {lumen: q.get().lumen, shards: q.get().shards};
  for (const node of long) {
    while (q.plan(node.id, 1).affordable) {
      const rank = q.get().research[node.id];
      assert(q.buy(node.id, 1), `pay for ${node.id} from the farm wallet`);
      assert.equal(q.get().research[node.id], rank + 1);
    }
  }
  const nextMasterwork = q.plan('masterwork', 1);
  assert.equal(nextMasterwork.requiredDepth, 320);
  result.farmAfterClear = {rift: 299, seconds, kills: farm.kills,
    earned: {lumen: farm.lumenGained, shards: farm.shardGained}, fundedWallet,
    after: snapshot(q.get(), elapsed + seconds), nextMasterworkRift: nextMasterwork.requiredDepth};
}
if (output) fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({status: result.status, strategy, hours: elapsed / 3600, record: result.endpoint.record,
  at300: milestones[300]?.longLevels, cleared300: milestones[301]?.longLevels,
  farmAfterClear: result.farmAfterClear?.after.longLevels, maxed: Object.keys(capped).length}));
