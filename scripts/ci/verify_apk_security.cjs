'use strict';
// Artifact checks are not a malware scan or a Google Play Protect verdict.
const fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const {verifyZip}=require('../lib/zip.cjs');
const allowedPermissions=new Set(['android.permission.INTERNET','android.permission.REQUEST_INSTALL_PACKAGES','com.lumenfall.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION']);
function parseManifest(text) {
  const nodes=[],stack=[];
  for(const line of text.split(/\r?\n/)) {
    const e=/^(\s*)E: ([\w-]+)/.exec(line);
    if(e){const depth=e[1].length;while(stack.length&&stack.at(-1).depth>=depth)stack.pop();const node={name:e[2],depth,attributes:{},parent:stack.at(-1)?.name||null};nodes.push(node);stack.push(node);continue;}
    const a=/^\s*A: ([\w:.-]+)(?:\([^)]*\))?=(.*)$/.exec(line);
    if(a&&stack.length){const value=a[2],quoted=/^"([^"]*)"/.exec(value),number=/^\(type 0x[\da-f]+\)0x([\da-f]+)$/i.exec(value);stack.at(-1).attributes[a[1]]=quoted?quoted[1]:number?parseInt(number[1],16):value;}
  }
  assert(nodes.some(n=>n.name==='manifest'),'Missing binary manifest root');
  return nodes;
}
function inspect(nodes,config,entryNames,channel='sideload') {
  assert(['sideload','play'].includes(channel),'Unknown Android distribution channel');
  const problems=[],check=(condition,message)=>{if(!condition)problems.push(message);};
  const root=nodes.find(n=>n.name==='manifest'),app=nodes.filter(n=>n.name==='application');
  check(root?.attributes.package==='com.lumenfall.app','Unexpected package');
  check(app.length===1,'Exactly one application required');
  const attrs=app[0]?.attributes||{};
  check(!attrs['android:debuggable'],'Production APK is debuggable');
  check(!attrs['android:testOnly'],'Production APK is testOnly');
  check(!attrs['android:usesCleartextTraffic'],'Cleartext network traffic enabled');
  check(!nodes.some(n=>n.name==='instrumentation'),'Test instrumentation packaged in production');
  const permissions=nodes.filter(n=>/^uses-permission(?:-sdk-?\d+)?$/.test(n.name)).map(n=>n.attributes['android:name']);
  check(permissions.length>0,'Permissions could not be read');
  for(const permission of permissions)check(allowedPermissions.has(permission),'Unexpected permission: '+permission);
  if(channel==='play') {
    check(!permissions.includes('android.permission.REQUEST_INSTALL_PACKAGES'),'Play must not request APK installation');
    check(!nodes.some(n=>/UpdateFileProvider|\.updates$/.test(n.attributes['android:name']||'')||/\.updates$/.test(n.attributes['android:authorities']||'')),'APK updater provider in Play build');
    const sdk=nodes.find(n=>n.name==='uses-sdk')?.attributes||{};
    check(Number(sdk['android:targetSdkVersion'])>=36,'Play target SDK must be at least36');
  }
  for(const node of nodes.filter(n=>['provider','service','receiver','activity','activity-alias'].includes(n.name))) {
    check(Object.hasOwn(node.attributes,'android:exported'),'Component export state must be explicit: '+node.attributes['android:name']);
    if(!node.attributes['android:exported'])continue;
    const name=node.attributes['android:name'];
    check(node.name==='activity'&&name==='com.lumenfall.app.MainActivity'||node.name==='receiver'&&name==='androidx.profileinstaller.ProfileInstallReceiver'&&node.attributes['android:permission']==='android.permission.DUMP','Unexpected exported component: '+name);
  }
  check(config.appId==='com.lumenfall.app','Unexpected Capacitor app ID');
  check(!config.server?.url,'Remote WebView origin configured');
  check(!config.server?.cleartext,'Cleartext WebView enabled');
  check(!config.server?.allowNavigation?.length,'Remote navigation allowlist configured');
  check(config.android?.webContentsDebuggingEnabled===false,'WebView debugging must be explicitly disabled');
  check(!config.android?.allowMixedContent,'Mixed content enabled');
  check(!entryNames.some(n=>/\.(?:apk|keystore|jks)$/i.test(n)),'Nested APK or signing key packaged');
  check(!entryNames.some(n=>/ReleaseProbe|(?:^|\/)androidTest\//.test(n)),'Native QA source packaged');
  return {status:problems.length?'FAIL':'PASS',problems,permissions:permissions.sort(),debuggable:!!attrs['android:debuggable'],googlePlayProtect:'NOT_TESTED',scope:'Static artifact configuration checks only; not a malware verdict'};
}
function verify(apk,aapt,channel='sideload') {
  const bytes=fs.readFileSync(apk),rows=verifyZip(bytes);
  const entries=rows.filter(r=>r.name==='assets/capacitor.config.json');assert.equal(entries.length,1,'Exactly one Capacitor config required');
  const row=entries[0],start=row.offset+30+bytes.readUInt16LE(row.offset+26)+bytes.readUInt16LE(row.offset+28),raw=bytes.subarray(start,start+row.compressed);
  const config=JSON.parse((row.method===8?zlib.inflateRawSync(raw):raw).toString());
  const manifest=cp.execFileSync(aapt,['dump','xmltree',apk,'AndroidManifest.xml'],{encoding:'utf8',timeout:30000,maxBuffer:4*1024*1024});
  const result=inspect(parseManifest(manifest),config,rows.map(r=>r.name),channel);
  if(channel==='play')for(const row of rows.filter(r=>/^classes\d*\.dex$/.test(r.name))) {
    const start=row.offset+30+bytes.readUInt16LE(row.offset+26)+bytes.readUInt16LE(row.offset+28),raw=bytes.subarray(start,start+row.compressed);
    const dex=row.method===8?zlib.inflateRawSync(raw):raw;
    if(/AppUpdaterPlugin|UpdateFileProvider|REQUEST_INSTALL_PACKAGES/.test(dex.toString('latin1')))result.problems.push('APK installer code in Play DEX');
  }
  result.status=result.problems.length?'FAIL':'PASS';
  return {...result,channel,apkSha256:crypto.createHash('sha256').update(bytes).digest('hex')};
}
module.exports={parseManifest,inspect,verify};
if(require.main===module){assert(process.argv.length<=5,'Usage: verify_apk_security.cjs APK AAPT [sideload|play]');const result=verify(process.argv[2],process.argv[3],process.argv[4]);console.log(JSON.stringify(result,null,2));if(result.status!=='PASS')process.exitCode=1;}
