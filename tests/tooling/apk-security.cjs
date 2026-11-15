'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {parseManifest,inspect}=require('../../scripts/ci/verify_apk_security.cjs');
const {hasVisibleGameControls}=require('../../scripts/lib/android-live-ui.cjs');
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
const config={appId:'com.lumenfall.app',android:{webContentsDebuggingEnabled:false}},names=['classes.dex','assets/capacitor.config.json'];
assert.equal(inspect(parseManifest(xml),config,names).status,'PASS');
const bad=(text=xml,c=config,n=names)=>assert.equal(inspect(parseManifest(text),c,n).status,'FAIL');
bad(xml.replace('0x0\n','0xffffffff\n'));
bad(xml.replace('android:debuggable','android:testOnly').replace('0x0\n','0xffffffff\n'));
bad(xml.replace('android:debuggable','android:usesCleartextTraffic').replace('0x0\n','0xffffffff\n'));
bad(xml.replace('android.permission.INTERNET','android.permission.READ_SMS'));
bad(xml.replace('E: uses-permission','E: uses-permission-sdk-23').replace('android.permission.INTERNET','android.permission.READ_CONTACTS'));
bad(xml.replace('com.lumenfall.app.MainActivity','com.attacker.Exported'));
bad(xml.replace(/        A: android:exported[^\n]+\n/,''));
bad(xml+'    E: instrumentation (line=20)\n');
bad(xml,{...config,server:{url:'https://example.com'}});
bad(xml,{...config,server:{allowNavigation:['*']}});
bad(xml,{...config,android:{webContentsDebuggingEnabled:true}});
bad(xml,{appId:'com.lumenfall.app'});
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
assert(workflow.includes('target: google_apis_playstore'),'Normal launch must be checked on a retail OS image');
assert.equal(JSON.parse(fs.readFileSync('mobile/capacitor.config.json')).android.webContentsDebuggingEnabled,false);
assert(!/path:\s*\|[^]*?release-probe\.apk/.test(workflow),'CI-only instrumentation must not be uploaded');
// A stale/loading tree, another app, or merely named/noninteractive text cannot
// prove that the normal production launch has reached usable game controls.
const node=label=>'<node package="com.lumenfall.app" text="'+label+'" clickable="true" enabled="true" bounds="[0,580][60,640]" />';
const live='<hierarchy>'+node('Wisps')+node('Rift')+'</hierarchy>';
assert(hasVisibleGameControls(live,320,640));
assert(hasVisibleGameControls(live.replaceAll('text=','content-desc='),320,640));
for(const invalid of [
  '<hierarchy><node package="com.lumenfall.app" text="Welcome gift — +5 Comets" /></hierarchy>',
  live.replace(node('Rift'),''),live.replace(node('Wisps'),''),
  live.replaceAll('com.lumenfall.app','com.example.other'),
  live.replaceAll('clickable="true"','clickable="false"'),
  live.replaceAll('enabled="true"','enabled="false"'),
  live.replaceAll('[0,580][60,640]','[0,640][60,700]'),
  live.replaceAll('[0,580][60,640]','[0,580][0,640]'),
  live.replace('</hierarchy>','<node text="Preparing your Rift…" /></hierarchy>'),
  live.replace('</hierarchy>','<node text="Skip intro" /></hierarchy>')
])assert(!hasVisibleGameControls(invalid,320,640),'Normal launch rejects incomplete/hidden/loading accessibility evidence');
console.log('PASS: production config, negative permission/debug/export/origin cases, patched dependency and release wiring');
