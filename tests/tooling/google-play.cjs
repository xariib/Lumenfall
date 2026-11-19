'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {configure}=require('../../scripts/ci/configure_android_play.cjs');
const {parseManifest,inspect,verify:verifySecurity}=require('../../scripts/ci/verify_apk_security.cjs');
const {verify:verifyAssets}=require('../../scripts/ci/verify_apk_assets.cjs');
const {crc32}=require('../../scripts/lib/zip.cjs');
function zip(files){
  const local=[],central=[];let offset=0;
  for(const [name,value] of Object.entries(files)){
    const n=Buffer.from(name),data=Buffer.from(value),head=Buffer.alloc(30),dir=Buffer.alloc(46);
    head.writeUInt32LE(0x04034b50);head.writeUInt32LE(crc32(data),14);head.writeUInt32LE(data.length,18);head.writeUInt32LE(data.length,22);head.writeUInt16LE(n.length,26);
    dir.writeUInt32LE(0x02014b50);dir.writeUInt32LE(crc32(data),16);dir.writeUInt32LE(data.length,20);dir.writeUInt32LE(data.length,24);dir.writeUInt16LE(n.length,28);dir.writeUInt32LE(offset,42);
    local.push(head,n,data);central.push(dir,n);offset+=head.length+n.length+data.length;
  }
  const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(central.length/2,8);end.writeUInt16LE(central.length/2,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
  return Buffer.concat([...local,directory,end]);
}
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-play-'));
try {
  const fixture={
    'app/build.gradle':'android {\n applicationId "com.lumenfall.app"\n release {\n minifyEnabled false\n }\n}',
    'variables.gradle':'minSdkVersion = 22\ncompileSdkVersion = 34\ntargetSdkVersion = 34\n',
    'build.gradle':"classpath 'com.android.tools.build:gradle:8.2.1'",
    'gradle/wrapper/gradle-wrapper.properties':'distributionUrl=https\\://services.gradle.org/distributions/gradle-8.2.1-all.zip',
    'app/src/main/AndroidManifest.xml':'<manifest><application /></manifest>',
    'app/src/main/java/com/lumenfall/app/MainActivity.java':'public class MainActivity extends BridgeActivity {}'
  };
  function reset(){for(const [file,text] of Object.entries(fixture)){fs.mkdirSync(path.dirname(path.join(temp,file)),{recursive:true});fs.writeFileSync(path.join(temp,file),text);}}
  reset();configure(temp);
  assert(fs.readFileSync(path.join(temp,'variables.gradle'),'utf8').includes('minSdkVersion = 22\ncompileSdkVersion = 36\ntargetSdkVersion = 36'));
  assert(fs.readFileSync(path.join(temp,'app/build.gradle'),'utf8').includes('debuggable false'));
  assert.throws(()=>configure(temp),/Fresh unsigned/);
  for(const [file,change,error] of [
    ['app/src/main/AndroidManifest.xml',text=>text.replace('<application','<uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" /><application'),/APK installer/],
    ['app/src/main/java/com/lumenfall/app/MainActivity.java',text=>text.replace('{}','{ registerPlugin(AppUpdaterPlugin.class); }'),/fresh project/],
    ['variables.gradle',text=>text.replace('targetSdkVersion = 34','targetSdkVersion = 33'),/exactly one/],
    ['app/build.gradle',text=>text.replace('com.lumenfall.app','com.other.app'),/package identity/]
  ]){reset();fs.writeFileSync(path.join(temp,file),change(fixture[file]));assert.throws(()=>configure(temp),error);assert.equal(fs.readFileSync(path.join(temp,'build.gradle'),'utf8'),fixture['build.gradle'],'Failure must leave build files untouched');}
  const config={appId:'com.lumenfall.app',android:{webContentsDebuggingEnabled:false}};
  const xml=`E: manifest\n  A: package="com.lumenfall.app"\n  E: uses-sdk\n    A: android:targetSdkVersion=(type 0x10)0x24\n  E: uses-permission\n    A: android:name="android.permission.INTERNET"\n  E: application\n    A: android:debuggable=(type 0x12)0x0\n`;
  const check=(text,channel='play')=>inspect(parseManifest(text),config,['classes.dex'],channel);
  assert.equal(check(xml).status,'PASS');
  const installer=xml.replace('android.permission.INTERNET','android.permission.REQUEST_INSTALL_PACKAGES');
  assert.equal(check(installer).status,'FAIL');assert.equal(check(installer,'sideload').status,'PASS','Existing APK updater permission remains permitted in its own channel');
  assert.equal(check(xml.replace('0x24','0x22')).status,'FAIL');
  assert.equal(check(xml.replace(/  E: uses-sdk\n[^\n]*\n/, '')).status,'FAIL');
  assert.equal(check(xml+'    E: provider\n      A: android:name="com.lumenfall.app.UpdateFileProvider"\n      A: android:exported=(type 0x12)0x0\n').status,'FAIL');
  assert.throws(()=>check(xml,'typo'),/Unknown Android/);
  const artifact=path.join(temp,'fixture.zip'),cp=require('node:child_process'),exec=cp.execFileSync;
  try {
    cp.execFileSync=(command,args)=>{assert.equal(command,'fixture-aapt');assert.deepEqual(args,['dump','xmltree',artifact,'AndroidManifest.xml']);return xml;};
    for(const installerCode of ['AppUpdaterPlugin','UpdateFileProvider','REQUEST_INSTALL_PACKAGES']){
      fs.writeFileSync(artifact,zip({'assets/capacitor.config.json':JSON.stringify(config),'classes.dex':installerCode}));
      assert.equal(verifySecurity(artifact,'fixture-aapt','play').status,'FAIL','Compiled installer must be rejected');
      assert.equal(verifySecurity(artifact,'fixture-aapt').status,'PASS','Legacy APK check retains existing semantics');
    }
    fs.writeFileSync(artifact,zip({'assets/capacitor.config.json':JSON.stringify(config),'classes.dex':'ordinary game classes'}));
    assert.equal(verifySecurity(artifact,'fixture-aapt','play').status,'PASS');
  } finally {cp.execFileSync=exec;}
  const source=path.join(temp,'source');fs.mkdirSync(path.join(source,'fonts'),{recursive:true});fs.mkdirSync(path.join(source,'branding'));
  const payload={'index.html':'<main>game</main>','fonts/font.woff2':'font','branding/mark.svg':'<svg/>'};
  for(const [name,value] of Object.entries(payload))fs.writeFileSync(path.join(source,name),value);
  for(const prefix of ['assets/','base/assets/']){
    const content=Object.fromEntries(Object.entries(payload).map(([name,value])=>[prefix+'public/'+name,value]));
    content[prefix+'capacitor.config.json']=JSON.stringify(config);
    fs.writeFileSync(artifact,zip(content));assert.equal(verifyAssets(artifact,source,prefix).status,'PASS');
    fs.writeFileSync(artifact,zip({...content,[prefix+'public/index.html']:'changed'}));assert.throws(()=>verifyAssets(artifact,source,prefix),/Packaged bytes differ/);
    fs.writeFileSync(artifact,zip({...content,[prefix+'public/runner.js']:'test code'}));assert.throws(()=>verifyAssets(artifact,source,prefix),/No test assets/);
    delete content[prefix+'public/fonts/font.woff2'];fs.writeFileSync(artifact,zip(content));assert.throws(()=>verifyAssets(artifact,source,prefix),/Exactly one packaged/);
  }
  console.log('PASS Play channel: fresh-project isolation, atomic rejection, package/minSDK preservation, API36 and installer permission/provider controls');
  console.log('PASS artifact controls: compiled installer rejection, unchanged sideload policy, exact APK/AAB asset bytes, missing assets and packaged QA code');
} finally {fs.rmSync(temp,{recursive:true,force:true});}
