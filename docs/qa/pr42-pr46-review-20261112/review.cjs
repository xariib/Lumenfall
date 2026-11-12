'use strict';
// Read-only review: exact Git snapshots, original focused suites, production
// simulation and manual Ascend owner. Never writes the live product or saves.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../..');
const output = path.resolve(root, process.argv[2] || 'validation-evidence/pr-review-probes');
assert(output.startsWith(root + path.sep), 'output stays in this isolated checkout');
fs.mkdirSync(output, {recursive: true});
const refs = {
  main: '34c7fafe045d539d2a3a41c093b072cf8b03d629',
  pr42: '819c681dd4895552813d459d85649013b608a0ab',
  pr46: '8ec33df776a5dff17762e7440b3ce323d740ca72'
};
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const git = args => cp.execFileSync('git', args, {cwd: root, maxBuffer: 32 * 1024 * 1024});
const snapshots = {};
for (const [name, ref] of Object.entries(refs)) {
  const folder = path.join(output, name);
  const files = ['index.html', 'tests/behavioral/forge-expansion-harness.cjs',
    'tests/behavioral/lab-expansion-harness.cjs', 'scripts/lib/game-amount.cjs'];
  if (name === 'pr42') files.push('tests/behavioral/endless-forge-lab-pacing.cjs', 'tests/behavioral/lab-access-reference.cjs');
  if (name === 'pr46') files.push('tests/behavioral/repeat-auto-ascend-pacing.cjs');
  const identities = [];
  for (const file of files) {
    const bytes = git(['show', ref + ':' + file]);
    fs.mkdirSync(path.dirname(path.join(folder, file)), {recursive: true});
    fs.writeFileSync(path.join(folder, file), bytes);
    identities.push({file, sha256: hash(bytes)});
  }
  snapshots[name] = {ref, folder, identities};
}
const focused = [];
for (const [name, test] of [['pr42', 'endless-forge-lab-pacing'], ['pr46', 'repeat-auto-ascend-pacing']]) {
  const args = ['tests/behavioral/' + test + '.cjs', 'index.html', '--negative'];
  const began = Date.now();
  const result = cp.spawnSync(process.execPath, args, {cwd: snapshots[name].folder, timeout: 180000, maxBuffer: 8 * 1024 * 1024});
  fs.writeFileSync(path.join(output, name + '-focused.stdout.txt'), result.stdout || '');
  fs.writeFileSync(path.join(output, name + '-focused.stderr.txt'), result.stderr || '');
  const entry = {name, args, exitCode: result.status, signal: result.signal, elapsedMs: Date.now() - began,
    error: result.error ? result.error.message : null};
  try { entry.result = JSON.parse(result.stdout); } catch (_) {}
  focused.push(entry);
  console.log(JSON.stringify({phase: 'focused', ...entry}));
}
function measure(name, mode, seconds, target) {
  const folder = snapshots[name].folder;
  const {app, CLOCK} = require(path.join(folder, 'tests/behavioral/forge-expansion-harness.cjs'));
  const html = fs.readFileSync(path.join(folder, 'index.html'), 'utf8');
  const game = app(html, undefined, {clockDate: true, retainWrites: false});
  const q = game.q, save = q.fresh();
  Object.assign(save, {depth: target + 1, maxDepthEver: 250, ascendRewardedDepth: 249,
    lastSeen: CLOCK, questDay: q.day(), riftMode: 'push',
    autoAscendEnabled: mode !== 'manual', autoAscendTargetDepth: target + 1});
  save.owned.autoascend = true;
  Object.assign(save.nodes, {swift: 139, swiftcharter: 1, echo: 6, stardust: 5,
    riftstep: 5, rosterrecall: 4, veteranrecruits: 5});
  save.activeParty = ['ember', 'tide', 'stone'];
  for (const id of save.activeParty) save.spirits[id] = 300;
  save.research.masterwork = 20;
  save.longStudyLevels.wispascend = 100;
  save.wispMastery.ember = 34;
  save.heroRarity.ember = 5;
  save.wispModules.ember = 20;
  save.wispUltimate.ember = true;
  q.set(save);
  q.restoreEnemy();
  let attempts = 0, manualResets = 0, automaticResets = 0;
  if (mode === 'manual') { attempts++; manualResets += q.ascend() ? 1 : 0; }
  for (let elapsed = 0; elapsed < seconds; elapsed++) {
    const result = q.advance(1, {kind: mode === 'offline' ? 'offline' : 'live',
      clockStartMs: CLOCK + elapsed * 1000, offlineWindowStartMs: CLOCK});
    automaticResets += result.ascends;
    game.clock(CLOCK + (elapsed + 1) * 1000);
    if (mode === 'manual' && q.get().depth >= target + 1) {
      attempts++;
      manualResets += q.ascend() ? 1 : 0;
    }
  }
  const state = q.get();
  assert.equal(state.ascendCount, manualResets + automaticResets, 'all resets accounted');
  const restored = app(html, game.storage, {clockDate: true}).q;
  if (mode === 'manual') assert.equal(restored.get().prisms, state.prisms, 'manual rewards persisted');
  return {source: name, mode, target, seconds, attempts, manualResets, automaticResets,
    ascends: state.ascendCount, prisms: state.prisms, motes: state.motes,
    sigils: state.sigils, finalDepth: state.depth, repeatDeadline: state.autoAscendRepeatAtMs || null};
}
const comparison = [];
for (const name of ['main', 'pr46']) for (const mode of ['offline', 'live', 'manual']) {
  const result = measure(name, mode, 120, 29);
  comparison.push(result);
  console.log(JSON.stringify({phase: 'comparison', ...result}));
}
const report = {node: process.version, platform: process.platform, snapshots, focused, comparison,
  assumptions: 'Synthetic mature Rift29 save copied from PR46 focused suite. Two minutes; manual policy attempts at most one real Ascend per second after reaching target, plus the seeded ready reset at time zero. No reinvestment, player save, UI gesture, or human retention test. Production combat and reset code is unchanged.'};
fs.writeFileSync(path.join(output, 'review.json'), JSON.stringify(report, null, 2) + '\n');
assert(focused.every(x => x.exitCode === 0), 'original focused suites must pass');
