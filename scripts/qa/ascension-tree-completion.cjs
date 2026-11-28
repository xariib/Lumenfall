'use strict';

const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {readFileSync} = require('node:fs');
const {app, CLOCK} = require('../../tests/behavioral/tree-expansion-harness.cjs');

const source = readFileSync(process.argv[2] || 'index.html', 'utf8');
const firstClear = 15;

function simulate(gap, clarity, priority) {
  const fixture = app(source);
  const {q} = fixture;
  const initial = q.fresh();
  initial.questDay = q.day();
  initial.lastSeen = CLOCK;
  initial.longStudyLevels.prismstudy = clarity;
  q.set(initial);

  const active = q.defs().filter(node => !node.retired && !node.retiredTo);
  const ranks = Object.fromEntries(active.map(node => [node.id, {cap:node.levelCap, spent:0, purchases:0}]));
  const row = id => ranks[id];
  const ownedRank = node => q.get().nodes[node.id] / (node.rankStep || 1);
  const maxed = node => ownedRank(node) >= node.levelCap;
  const charter = q.node('swiftcharter');
  const swift = q.node('swift');
  const frontier = q.node('frontier');
  const other = active.filter(node => ![charter.id, swift.id, frontier.id].includes(node.id));
  let earned = 0;
  let lastClear = 0;

  function buyAvailable(node, clear, ascends, until = node.levelCap) {
    while (ownedRank(node) < until) {
      const quote = q.plan(node.id);
      if (!quote.affordable) return;
      const wallet = q.get().prisms;
      assert(q.buy(node.id), `paid ${node.id} at clear ${clear}`);
      assert.equal(wallet - q.get().prisms, quote.cost, `${node.id} exact Prism debit`);
      row(node.id).spent += quote.cost;
      row(node.id).purchases++;
      if (maxed(node)) Object.assign(row(node.id), {maxedAtAscend:ascends, maxedAtClear:clear});
      fixture.writes.length = 0;
    }
  }

  for (let ascends = 1; ascends <= 10000; ascends++) {
    const clear = firstClear + (ascends - 1) * gap;
    const current = q.get();
    current.depth = current.enemyDepth = clear + 1;
    current.maxDepthEver = clear + 1;
    current.enemyHp = current.enemyMaxHp = q.enemyHp(clear + 1);
    assert.equal(current.ascendRewardedDepth, lastClear, 'previous Ascension record retained');
    const quote = q.prismPreview(clear + 1).gain;
    const wallet = current.prisms;
    assert(quote > 0 && q.ascend(), `eligible manual Ascend at Rift ${clear}`);
    assert.equal(q.get().prisms - wallet, quote, 'actual payout matches preview');
    lastClear = clear;
    earned += quote;
    fixture.writes.length = 0;

    const beforeCharter = charter.requiresSwift / (swift.rankStep || 1);
    buyAvailable(swift, clear, ascends, beforeCharter);
    buyAvailable(charter, clear, ascends);
    if (!maxed(charter)) continue;

    buyAvailable(frontier, clear, ascends);
    if (priority === 'swift-first') buyAvailable(swift, clear, ascends);
    for (const node of other) buyAvailable(node, clear, ascends);
    if (priority === 'restart-first') buyAvailable(swift, clear, ascends);

    const spent = Object.values(ranks).reduce((total, item) => total + item.spent, 0);
    assert.equal(earned, spent + q.get().prisms, 'all modeled Prism income is accounted for');
    if (active.every(maxed)) {
      return {gap, clarity, priority, ascends, finalClearedRift:clear, earned, spent,
        unspent:q.get().prisms, purchases:Object.values(ranks).reduce((sum, item) => sum + item.purchases, 0), ranks};
    }
  }
  throw Error(`Tree did not max within 10,000 Ascensions with a ${gap}-Rift gap`);
}

const rows = [1, 5, 10, 25, 50].map(gap => simulate(gap, 0, 'swift-first'));
rows.push(simulate(10, 0, 'restart-first'), simulate(10, 20, 'swift-first'));
console.log(JSON.stringify({
  sourceSha256:createHash('sha256').update(source).digest('hex'),
  firstClear,
  method:'Fresh Tree and 0 starting Prisms. Preset cleared Rift milestones. Actual manual Ascensions, previews, unlocks and purchases. All Prisms go to the Tree. Combat, time to clear, and other Prism spending are outside the model.',
  rows
}, null, 2));
