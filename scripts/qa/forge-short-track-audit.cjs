'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const {app, CLOCK, clone} = require('../../tests/behavioral/forge-expansion-harness.cjs');
const fixtures = require('../../tests/behavioral/fixtures.json');

const source = fs.readFileSync(process.argv[2] || 'index.html', 'utf8');
const {q: catalog} = app(source);
const tracks = catalog.defs().filter(node => !node.retiredTo && node.levelCap <= 20);
const pricedTracks = tracks.map(node => {
  const prices = Array.from({length: node.levelCap}, (_, rank) => catalog.cost(node.id, rank, 1));
  return {
    id: node.id,
    name: node.name,
    cap: node.levelCap,
    unlockRift: node.unlockDepth || 1,
    first: prices[0],
    last: prices.at(-1),
    total: prices.reduce((cost, price) => ({lumen: cost.lumen + price.lumen, shard: cost.shard + price.shard}), {lumen: 0, shard: 0}),
  };
});

function measureFarm(fixture, rift, hours) {
  const {q} = app(source, undefined, {retainWrites: false, clockDate: true});
  const save = clone(fixtures[fixture].save);
  Object.assign(save, {
    lumen: 0, shards: 0, lastSeen: CLOCK, questDay: q.day(),
    depth: rift, farmDepth: rift, farmReturnDepth: save.maxDepthEver,
    farmAutoResume: false, enemyDepth: 0, riftMode: 'farm', autoAscendEnabled: false,
  });
  for (const node of tracks) {
    save.research[node.id] = 0;
  }
  for (const key of ['empowerQueue', 'researchQueue', 'studyQueue', 'studyUseMotes']) {
    save[key] = {};
  }
  q.set(save);
  q.restoreEnemy();
  const seconds = hours * 3600;
  const summary = q.advance(seconds, {kind: 'offline', clockStartMs: CLOCK});
  const afterFarm = clone(q.get());
  assert.equal(afterFarm.depth, rift, 'farm stays at its assigned Rift');
  const budgets = [1, 2].map(windows => {
    const wallet = {lumen: Math.floor(summary.lumenGained * windows), shards: Math.floor(summary.shardGained * windows)};
    assert(Object.values(wallet).every(Number.isSafeInteger), 'exact shared budget');
    q.set({...afterFarm, ...wallet});
    const purchases = [];
    for (const node of tracks) {
      let spentLumen = 0;
      let spentShards = 0;
      while (q.plan(node.id, 1).affordable) {
        const before = q.get();
        const rank = before.research[node.id], lumen = before.lumen, shards = before.shards;
        const {cost} = q.plan(node.id, 1);
        assert.equal(q.buy(node.id, 1), true, 'production one-rank purchase');
        const after = q.get();
        assert.equal(after.research[node.id], rank + 1);
        assert.equal(lumen - after.lumen, cost.lumen);
        assert.equal(shards - after.shards, cost.shard);
        spentLumen += cost.lumen;
        spentShards += cost.shard;
      }
      purchases.push({id: node.id, levels: q.get().research[node.id], cap: node.levelCap, spentLumen, spentShards});
    }
    return {hours: hours * windows, wallet, purchases, maxed: purchases.filter(row => row.levels === row.cap).map(row => row.id)};
  });
  return {
    fixture, rift, record: afterFarm.maxDepthEver, sampleHours: hours, kills: summary.kills,
    earned: {lumen: summary.lumenGained, shards: summary.shardGained}, budgets,
  };
}

const farms = [
  measureFarm('mid-game', 16, 1),
  measureFarm('mature-high-power', 51, 8),
  measureFarm('mature-high-power', 95, 0.5),
  measureFarm('mature-high-power', 95, 8),
  measureFarm('mature-high-power', 119, 8),
];
console.log(JSON.stringify({
  sourceSha256: crypto.createHash('sha256').update(source).digest('hex'),
  methodology: 'Existing synthetic account snapshots, with short Forge ranks, queues and Lumen/Shard wallets cleared before fixed-Rift offline combat. Pay one rank at a time in catalog order from a shared wallet. The larger budget repeats the sampled income at the same rate, with no reinvestment. This audit measures affordability after an established account snapshot. It does not reproduce a fresh account, the reported save, or time spent attaining the record.',
  pricedTracks, farms,
}, null, 2));
