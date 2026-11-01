'use strict';
// Disposable emulator fixture: same signed app/source, deliberately older version.
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict');
const file='mobile/android/app/build.gradle',original=fs.readFileSync(file,'utf8');
assert(/versionCode \d+/.test(original));assert(/versionName "[^"]+"/.test(original));
try {
  fs.writeFileSync(file,original.replace(/versionCode \d+/,'versionCode 1000001').replace(/versionName "[^"]+"/,'versionName "0.2.1"'));
  cp.execFileSync('./gradlew',['assembleDebug','--no-daemon',
    '-Pandroid.injected.signing.store.file='+process.env.RUNNER_TEMP+'/lumenfall-signing/Lumenfall-debug.keystore',
    '-Pandroid.injected.signing.store.password=android','-Pandroid.injected.signing.key.alias=androiddebugkey','-Pandroid.injected.signing.key.password=android'],
    {cwd:'mobile/android',stdio:'inherit'});
  fs.copyFileSync('mobile/android/app/build/outputs/apk/debug/app-debug.apk','updater-probe.apk');
} finally {fs.writeFileSync(file,original);}
