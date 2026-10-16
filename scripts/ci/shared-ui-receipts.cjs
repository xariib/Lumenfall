#!/usr/bin/env node
'use strict';
// Preserve standalone gate output that can be absent from the large Full job log.
// Original commands and tests remain unchanged; this helper only records execution.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');
const out = path.resolve(root, process.argv[2] || 'shared-ui-validation/standalone');
assert(Number(process.versions.node.split('.')[0]) >= 20, 'Node20+ required');
assert(out.startsWith(root + path.sep) && !fs.existsSync(out), 'Use a new output directory inside this checkout');
fs.mkdirSync(out, {recursive: true});
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const git = args => cp.execFileSync('git', args, {cwd: root, maxBuffer: 128 * 1024 * 1024});
const write = (name, value) => fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2) + '\n');
const head = git(['rev-parse', 'HEAD']).toString().trim();
const tree = git(['rev-parse', 'HEAD^{tree}']).toString().trim();
const commit = git(['cat-file', 'commit', head]);
fs.writeFileSync(path.join(out, 'commit-object.txt'), commit);
fs.writeFileSync(path.join(out, 'git-tree.txt'), git(['ls-tree', '-r', head]));
const rows = git(['ls-tree', '-rz', head]).toString().split('\0').filter(Boolean).map(line => {
  const match = /^(100644|100755) blob ([a-f0-9]{40})\t(.+)$/.exec(line);
  assert(match, 'Expected one regular tracked file per path: ' + line);
  return {path: match[3], mode: match[1], gitBlob: match[2]};
});
const identities = [];
let baseline;
function identity(label) {
  const files = rows.map(row => {
    const file = path.join(root, row.path), stat = fs.lstatSync(file), bytes = fs.readFileSync(file);
    assert(stat.isFile() && !stat.isSymbolicLink(), 'Regular input: ' + row.path);
    assert.equal(stat.mode & 0o111 ? '100755' : '100644', row.mode, 'Input mode: ' + row.path);
    assert.equal(crypto.createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex'), row.gitBlob, 'Input differs from Git: ' + row.path);
    return {...row, bytes: bytes.length, sha256: hash(bytes)};
  });
  const digest = hash(Buffer.from(JSON.stringify(files)));
  if (baseline) assert.equal(digest, baseline.sha256, 'Tracked input drift: ' + label);
  const record = {label, utc: new Date().toISOString(), head, tree, files: files.length, bytes: files.reduce((n, row) => n + row.bytes, 0), sha256: digest};
  identities.push(record);
  write('identities.json', identities);
  if (!baseline) { baseline = record; write('tracked-inputs.json', files); }
  return record;
}
const runtime = {node: process.version, versions: process.versions, platform: process.platform, arch: process.arch,
  binary: fs.realpathSync(process.execPath), binarySha256: hash(fs.readFileSync(process.execPath))};
write('runtime.json', runtime);
const commands = [
  {id: 'source', args: ['scripts/ci/validate_source.cjs'], timeout: 60000},
  {id: 'shared-context', args: ['scripts/codex/check_context.cjs', '--task', 'docs/tasks/SHARED_UI_001.md'], timeout: 60000},
  {id: 'apk-identity-self-test', args: ['scripts/verify_apk_identity.cjs', '--self-test'], timeout: 120000},
  {id: 'tooling', args: ['tests/tooling/run.cjs'], timeout: 120000},
  {id: 'rift-cosmetics', args: ['tests/behavioral/rift-cosmetics.cjs', '--source', 'mobile/www/index.html', '--negative'], timeout: 480000},
  {id: 'prism-earning', args: ['tests/behavioral/prism-earning.cjs', '--source', 'mobile/www/index.html'], timeout: 120000},
  {id: 'prism-context', args: ['scripts/codex/check_context.cjs', '--task', 'docs/tasks/PRISM_EARNING_001.md'], timeout: 120000},
  {id: 'progression-context', args: ['scripts/codex/check_context.cjs', '--task', 'docs/tasks/PROGRESSION_EXPANSION_001.md'], timeout: 120000}
];
const results = [];
// Same bounded context/recovery selection as the accepted Comet QA6 wrapper.
const contextFiles = new Set(['docs/PROJECT_STATE.md', 'docs/CHAT_OWNERSHIP.md', 'docs/CONTEXT_INDEX.md', 'docs/HANDOFF_TEMPLATE.md', 'docs/recovery/2026-10-07/SOURCE_INDEX.txt', 'docs/handoffs/01_06/2026-10-07/SOURCE_INDEX.md', 'docs/handoffs/02_08/2026-10-07/START_HER.txt', 'docs/handoffs/02_08/2026-10-07/Source_Index.txt', 'docs/handoffs/02_08/2026-10-07/SUMMARY/identity.json', 'docs/handoffs/02_08/2026-10-07/SOURCE_SNAPSHOT_MANIFEST.json', 'docs/qa/offline-autoascend-2026-10-07/Source_Index.txt', 'docs/qa/offline-autoascend-2026-10-07/reproduce.cjs']);
function isActive(p) {
  return /^(?:index\.html|AGENTS\.md|README\.md|PROJECT_BOOTSTRAP\.txt|PROJECT_INSTRUCTIONS\.txt)$/.test(p) ||
    /^(?:tests\/|scripts\/|fonts\/|branding\/|\.github\/workflows\/|docs\/(?:tasks|project|agents|decisions)\/|docs\/qa\/shared-ui-001\/)/.test(p) || contextFiles.has(p);
}
function includeToolingFixtures() {
  const base = 'docs/handoffs/02_08/2026-10-07/', manifest = base + 'SOURCE_SNAPSHOT_MANIFEST.json';
  const coveragePath = 'docs/recovery/2026-10-07/ARCHIVE_COVERAGE.json';
  const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
  contextFiles.add(manifest); contextFiles.add(coveragePath);
  for (const row of read(manifest).source) contextFiles.add(path.posix.join(base, row.snapshot_path));
  const matches = read(coveragePath).filter(row => row.payloads.length === 66);
  assert.equal(matches.length, 1, 'Original tooling fixture archive is unique');
  for (const row of matches[0].payloads) {
    const p = row.repository_path === 'scripts/recovery/restore_package.py' ? 'docs/recovery/2026-10-07/publication_originals/' + row.repository_path : row.repository_path;
    const absolute = path.join(root, p);
    if (fs.existsSync(absolute) && fs.statSync(absolute).isFile()) contextFiles.add(p);
    else {
      const parts = p + '.parts/PARTS.json'; contextFiles.add(parts);
      for (const part of read(parts).parts) contextFiles.add(part.path);
    }
  }
  const tracked = new Set(rows.map(row => row.path));
  for (const p of contextFiles) assert(tracked.has(p), 'Archived context/tooling input is tracked: ' + p);
}
try {
  identity('before-staging');
  assert.equal(hash(fs.readFileSync(path.join(root, 'tests/behavioral/fixtures-pre-endless.json'))), 'ab43604db1b5bce8b9990506f989676dfb0009cdcf2e514a8ccee9da166c8753', 'Frozen original fixture identity');
  assert.equal(hash(fs.readFileSync(path.join(root, 'tests/behavioral/fixtures.json'))), '3f7ca9f5c74034cd42ac242385f62d94776feb5e26e98be7f7059baadaeae8f2', 'Accepted endless-progression fixture identity');
  includeToolingFixtures();
  const archivePaths = rows.filter(row => isActive(row.path)).map(row => row.path);
  const archive = git(['archive', '--format=tar', head, '--', ...archivePaths]);
  fs.writeFileSync(path.join(out, 'source.tar'), archive);
  write('source-archive.json', {head, tree, paths: archivePaths, bytes: archive.length, sha256: hash(archive)});
  const stage = path.join(root, 'mobile/www');
  assert(!fs.existsSync(stage), 'Fresh checkout must not already contain staged web assets');
  fs.mkdirSync(stage, {recursive: true});
  fs.copyFileSync(path.join(root, 'index.html'), path.join(stage, 'index.html'));
  for (const dir of ['fonts', 'branding']) fs.cpSync(path.join(root, dir), path.join(stage, dir), {recursive: true});
  const staged = rows.filter(row => row.path === 'index.html' || /^(fonts|branding)\//.test(row.path)).map(row => {
    const actual = fs.readFileSync(path.join(stage, row.path)), original = fs.readFileSync(path.join(root, row.path));
    assert(actual.equals(original), 'Exact staged asset: ' + row.path);
    return {path: row.path, bytes: actual.length, sha256: hash(actual), gitBlob: row.gitBlob};
  });
  write('staged-inputs.json', staged);
  const env = {...process.env};
  delete env.NODE_OPTIONS; delete env.NODE_PATH;
  assert(!fs.existsSync('/tmp/lumenfall-rift-cosmetics'), 'Fresh original cosmetics output required');
  for (const command of commands) {
    identity('before-' + command.id);
    const startedUtc = new Date().toISOString(), started = process.hrtime.bigint();
    const result = cp.spawnSync(process.execPath, command.args, {cwd: root, env, timeout: command.timeout, killSignal: 'SIGKILL', maxBuffer: 64 * 1024 * 1024});
    const stdout = result.stdout || Buffer.alloc(0), stderr = result.stderr || Buffer.alloc(0);
    fs.writeFileSync(path.join(out, command.id + '.stdout.log'), stdout);
    fs.writeFileSync(path.join(out, command.id + '.stderr.log'), stderr);
    const receipt = {id: command.id, command: [process.execPath, ...command.args], cwd: root, timeoutMs: command.timeout,
      startedUtc, completedUtc: new Date().toISOString(), elapsedMs: Number(process.hrtime.bigint() - started) / 1e6,
      exitCode: result.status, signal: result.signal, error: result.error ? {message: result.error.message, code: result.error.code} : null,
      stdout: {path: command.id + '.stdout.log', bytes: stdout.length, sha256: hash(stdout)},
      stderr: {path: command.id + '.stderr.log', bytes: stderr.length, sha256: hash(stderr)}};
    write(command.id + '.result.json', receipt);
    results.push(receipt);
    identity('after-' + command.id);
    if (command.id === 'rift-cosmetics' && fs.existsSync('/tmp/lumenfall-rift-cosmetics')) {
      fs.cpSync('/tmp/lumenfall-rift-cosmetics', path.join(out, 'rift-cosmetics'), {recursive: true, errorOnExist: true, force: false});
    }
    console.log(JSON.stringify({id: command.id, exitCode: result.status, signal: result.signal, stdoutBytes: stdout.length, stderrBytes: stderr.length}));
  }
  identity('after-all-commands');
  const passed = results.every(row => row.exitCode === 0 && !row.signal && !row.error);
  write('summary.json', {status: passed ? 'PASS' : 'FAIL', head, tree, sourceSha256: hash(fs.readFileSync(path.join(root, 'index.html'))), runtime,
    commandsRun: results.length, identities: identities.length, originalStandaloneCommands: 6, results, apkBuild: false, nativeAndroid: 'not tested'});
  if (!passed) process.exitCode = 1;
} catch (error) {
  write('preparation-or-identity-failure.json', {status: 'FAIL', head, tree, message: error.message, stack: error.stack, results});
  console.error(error.stack);
  process.exitCode = 1;
}
function inventory(directory, prefix = '') {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const relative = prefix ? prefix + '/' + entry.name : entry.name;
    assert(entry.isFile() || entry.isDirectory(), 'Regular evidence body: ' + relative);
    return entry.isDirectory() ? inventory(path.join(directory, entry.name), relative) : [relative];
  }).sort();
}
write('manifest.json', {status: process.exitCode ? 'FAIL' : 'PASS', head, tree, clockSource: 'GitHub Actions runner wall clock',
  closedUtc: new Date().toISOString(), files: inventory(out).map(p => {
    const bytes = fs.readFileSync(path.join(out, p));
    return {path: p, bytes: bytes.length, sha256: hash(bytes)};
  })});
