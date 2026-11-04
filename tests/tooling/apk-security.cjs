'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {parseManifest,inspect}=require('../../scripts/ci/verify_apk_security.cjs');
const xml=`N: android=http://schemas.android.com/apk/res/android
  E: manifest (line=2)
    A: package="com.lumenfall.app" (Raw: "com.lumenfall.app")
    E: uses-permission (line=10)
      A: android:name(0x01010003)="android.permission.INTERNET"
    E: application (line=12)
      A: android:debuggable(0x0101000f)=(type 0x12)0x0
      E: activity (line=13)
        A: android:name(0x01010003)="com.lumenfall.app.MainActivity"
        A: android:exported(0x01010010)=(type 0x12)0xffffffff
`;
const config={appId:'com.lumenfall.app'},names=['classes.dex','assets/capacitor.config.json'];
assert.equal(inspect(parseManifest(xml),config,names).status,'PASS');
const bad=(text=xml,c=config,n=names)=>assert.equal(inspect(parseManifest(text),c,n).status,'FAIL');
bad(xml.replace('0x0\n','0xffffffff\n'));
bad(xml.replace('android:debuggable','android:testOnly').replace('0x0\n','0xffffffff\n'));
bad(xml.replace('android:debuggable','android:usesCleartextTraffic').replace('0x0\n','0xffffffff\n'));
bad(xml.replace('android.permission.INTERNET','android.permission.READ_SMS'));
bad(xml.replace('E: uses-permission','E: uses-permission-sdk-23').replace('android.permission.INTERNET','android.permission.READ_CONTACTS'));
bad(xml.replace('com.lumenfall.app.MainActivity','com.attacker.Exported'));
bad(xml+'    E: instrumentation (line=20)\n');
bad(xml,{...config,server:{url:'https://example.com'}});
bad(xml,{...config,server:{allowNavigation:['*']}});
bad(xml,{...config,android:{webContentsDebuggingEnabled:true}});
bad(xml,{...config,android:{allowMixedContent:true}});
bad(xml,config,[...names,'assets/key.keystore']);
bad(xml,config,[...names,'assets/other.apk']);
assert.throws(()=>parseManifest('not an aapt manifest'),/Missing/);
const lock=JSON.parse(fs.readFileSync('mobile/package-lock.json','utf8'));
assert.equal(lock.packages['node_modules/@capacitor/android'].version,'6.2.2','Known critical proxy vulnerability must remain patched');
const workflow=fs.readFileSync('.github/workflows/build-android.yml','utf8');
assert(workflow.includes('./gradlew assembleRelease assembleReleaseAndroidTest'));
assert(workflow.includes('outputs/apk/release/app-release.apk Lumenfall.apk'));
assert(workflow.includes('verify_apk_security.cjs Lumenfall.apk'));
assert(!/path:\s*\|[^]*?release-probe\.apk/.test(workflow),'CI-only instrumentation must not be uploaded');
console.log('PASS: production config, negative permission/debug/export/origin cases, patched dependency and release wiring');
