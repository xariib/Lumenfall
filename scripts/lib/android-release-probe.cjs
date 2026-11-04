'use strict';
const cp = require('node:child_process'), fs = require('node:fs'), assert = require('node:assert/strict');
const pkg = 'com.lumenfall.app';
const adb = (...args) => cp.execFileSync('adb', args, {encoding: 'utf8', timeout: 120000});
const processes = [];
function launchForInspection() {
  assert.match(adb('get-serialno').trim(), /^emulator-/, 'Instrumentation is restricted to disposable CI emulators');
  const flags = adb('shell', 'dumpsys', 'package', pkg);
  if (/\bDEBUGGABLE\b/.test(flags)) {
    adb('shell', 'am', 'start', '-W', '-n', pkg + '/.MainActivity');
    return;
  }
  assert(fs.existsSync('release-probe.apk'), 'Separately signed CI instrumentation APK is required');
  assert.match(adb('install', '-r', '-t', 'release-probe.apk'), /Success/);
  adb('shell', 'am', 'force-stop', pkg);
  const log = fs.openSync('release-evidence/release-probe.log', 'a');
  const child = cp.spawn('adb', ['shell', 'am', 'instrument', '-w',
    pkg + '.test/com.lumenfall.qa.ReleaseProbe'], {stdio: ['ignore', log, log]});
  fs.closeSync(log);
  child.on('error', error => console.error('Release instrumentation: ' + error.message));
  processes.push(child);
}
function close() { for (const child of processes) child.kill(); }
module.exports = {launchForInspection, close};
