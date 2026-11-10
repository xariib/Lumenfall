'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const {app, CLOCK} = require('./forge-expansion-harness.cjs');

const source = fs.readFileSync(process.argv[2] || 'index.html', 'utf8');
let checks = 0;
function equal(actual, expected, message) {
  assert.deepEqual(actual, expected, message);
  checks++;
}

function ready(input, target, mature = false) {
  const game = app(input, undefined, {clockDate: true});
  const {q} = game;
  const save = q.fresh();
  Object.assign(save, {
    depth: target + 1, maxDepthEver: 250, ascendRewardedDepth: 249,
    lastSeen: CLOCK, questDay: q.day(), riftMode: 'push',
    autoAscendEnabled: true, autoAscendTargetDepth: target + 1
  });
  save.owned.autoascend = true;
  Object.assign(save.nodes, {swift: 139, swiftcharter: 1, echo: 6, stardust: 5});
  if (mature) {
    Object.assign(save.nodes, {riftstep: 5, rosterrecall: 4, veteranrecruits: 5});
    save.activeParty = ['ember', 'tide', 'stone'];
    for (const id of save.activeParty) save.spirits[id] = 300;
    save.research.masterwork = 20;
    save.longStudyLevels.wispascend = 100;
    save.wispMastery.ember = 34;
    save.heroRarity.ember = 5;
    save.wispModules.ember = 20;
    save.wispUltimate.ember = true;
  }
  q.set(save);
  q.restoreEnemy();
  return game;
}

function advance(q, seconds, kind, fromMs = CLOCK) {
  return q.advance(seconds, {kind, clockStartMs: fromMs, offlineWindowStartMs: CLOCK});
}

function deadlineChecks(input) {
  for (const kind of ['live', 'offline']) {
    const {q} = ready(input, 29);
    equal(q.get().autoAscendRepeatAtMs, undefined, 'older saves start without a wait');
    equal(advance(q, 0, kind).ascends, 1, 'first eligible reset is immediately available');
    equal(q.get().prisms, 62, 'paid repeat keeps the full purchased Prism bonus');
    equal(q.get().autoAscendRepeatAtMs, CLOCK + 60000, 'reset persists the next automatic repeat time');
    q.set({...q.get(), depth: 30});
    q.restoreEnemy();
    equal(advance(q, 59.999, kind).ascends, 0, 'automatic repeat waits below the deadline');
    equal(advance(q, 0.001, kind, CLOCK + 59999).ascends, 1, 'automatic repeat fires at the deadline without another kill');
    equal(q.get().ascendCount, 2, 'exactly one reset at the boundary');
    equal(q.get().prisms, 124, 'Prisms are awarded once per reset');
  }
}

deadlineChecks(source);

{
  const {q} = ready(source, 28);
  const save = q.get();
  q.set({...save, lumen: 1000, achieved: {...save.achieved, autotap: true, labmaster: true},
    empowerQueue: {...save.empowerQueue, ember: true}, autoAscendRepeatAtMs: CLOCK + 1000});
  q.restoreEnemy();
  q.get().enemyHp = 12;
  const result = q.advance(1, {kind: 'offline', clockStartMs: CLOCK, captureTimeline: true});
  equal(result.kills, 1, 'the deadline tap clears a Rift');
  equal(result.timeline.filter(event => ['autoTap', 'autoEmpower', 'autoAscend'].includes(event.type)).map(event => event.type),
    ['autoTap', 'autoEmpower', 'autoAscend'], 'work due at the repeat deadline resolves in the ending run');
}

for (const [benchmark, nextRift] of [[0, 30], [29, 31]]) {
  const {q} = ready(source, 29);
  q.set({...q.get(), depth: nextRift, ascendRewardedDepth: benchmark, autoAscendRepeatAtMs: CLOCK + 60000});
  q.restoreEnemy();
  equal(advance(q, 0, 'offline').ascends, 1, 'first and new-record rewards bypass the repeat wait');
  equal(q.get().ascendRewardedDepth, nextRift - 1, 'new record is credited');
}

{
  const x = ready(source, 29);
  const {q} = x;
  q.set({...q.get(), autoAscendRepeatAtMs: CLOCK + 60000});
  q.restoreEnemy();
  const before = q.get().prisms;
  x.clock(CLOCK + 5000);
  x.fail(true, false);
  equal(q.ascend(), false, 'failed primary write rejects the manual reset');
  equal(q.get().autoAscendRepeatAtMs, CLOCK + 60000, 'failed reset keeps the prior deadline');
  equal(q.get().prisms, before, 'failed reset rolls back the wallet');
  x.fail(false, false);
  equal(q.ascend(), true, 'manual Ascend is available during the automatic wait');
  equal(q.get().autoAscendRepeatAtMs, CLOCK + 65000, 'manual reset restarts the automatic wait');
  const restored = app(source, x.storage, {clockDate: true}).q;
  equal(restored.get().autoAscendRepeatAtMs, CLOCK + 65000, 'deadline survives cold reload');
  equal(restored.get().prisms, q.get().prisms, 'cold reload keeps the paid reward');
}

function measure(target, seconds, kind, split = false) {
  const {q} = ready(source, target, true);
  let ascends = 0;
  let sigils = 0;
  let motes = 0;
  const parts = split ? Array.from({length: seconds}, () => 1) : [seconds];
  let startMs = CLOCK;
  for (const part of parts) {
    const result = advance(q, part, kind, startMs);
    ascends += result.ascends;
    sigils += result.sigilsGained;
    motes += result.motesGained;
    startMs += part * 1000;
  }
  equal(q.get().ascendCount, ascends, 'recap counts every committed reset once');
  equal(q.get().sigils, sigils, 'recap and Sigil wallet agree');
  equal(q.get().motes, motes, 'recap and Mote wallet agree');
  return {target, seconds, ascends, prisms: q.get().prisms, sigils, motes};
}

const reported = measure(29, 35, 'offline');
equal(reported.ascends, 1, 'reproduced 35-second Rift 29 farm is paced');
equal(measure(29, 35, 'live'), reported, 'Rift 29 agrees in live and offline play');
equal(measure(29, 120, 'offline', true), measure(29, 120, 'offline'), 'one-second offline splits retain reward and timing parity');
const hourly = [15, 29, 50].map(target => measure(target, 3600, 'offline'));
for (const row of hourly) {
  equal(row.ascends, 61, 'one ready reset plus sixty elapsed intervals in a closed one-hour window');
  assert(row.prisms < 10221, 'one hour cannot buy the combined non-Swift catalogue');
  assert(row.sigils < 2000 && row.motes < 2000, 'short loops no longer multiply linked rewards at the old rate');
  checks += 2;
}

if (process.argv.includes('--negative')) {
  const guard = 'if(!autoAscendReady(nowMs,clock)) return false;';
  assert.equal(source.split(guard).length, 2, 'unique repeat readiness guard');
  assert.throws(() => deadlineChecks(source.replace(guard, 'if(!autoAscendTargetReached()) return false;')),
    /automatic repeat waits below the deadline/);
  checks++;
}

console.log(JSON.stringify({
  status: 'PASS', checks, reported, hourly,
  sourceSha256: crypto.createHash('sha256').update(source).digest('hex')
}));
