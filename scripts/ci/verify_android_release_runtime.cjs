'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {hasVisibleGameControls,buildShellSnapshot}=require('../lib/android-live-ui.cjs');
const pkg='com.lumenfall.app';
const adb=(...args)=>cp.execFileSync('adb',args,{encoding:'utf8',timeout:30000});
async function main(){
  assert.match(adb('get-serialno').trim(),/^emulator-/,'Disposable CI emulator only');
  assert.equal(adb('shell','getprop','ro.build.type').trim(),'user','Retail system image required: userdebug WebView forces debugging on');
  assert.equal(adb('shell','getprop','ro.debuggable').trim(),'0','Retail OS debugging must be disabled');
  adb('shell','am','force-stop',pkg);
  if(adb('shell','pm','list','packages',pkg+'.test').includes('package:'+pkg+'.test'))
    assert.match(adb('uninstall',pkg+'.test'),/Success/,'Remove CI instrumentation before normal production launch');
  assert.match(adb('install','-r','Lumenfall.apk'),/Success/);
  const flags=adb('shell','dumpsys','package',pkg);
  assert(!/\bDEBUGGABLE\b/.test(flags),'Installed production app is not debuggable');
  adb('shell','am','start','-W','-n',pkg+'/.MainActivity');
  // Inspect through Android accessibility, without enabling WebView debugging.
  // A live PID or the loading cover alone does not establish a settled launch.
  // Android's stock dump waits for global idle, which live combat may never reach.
  // This shell-only observer uses the same accessibility bridge/dumper directly;
  // it is not APK instrumentation and does not touch the game's WebView or state.
  const size=adb('shell','wm','size').match(/(?:Physical|Override) size: (\d+)x(\d+)/g)?.at(-1).match(/(\d+)x(\d+)/);
  assert(size,'Retail display dimensions required');
  const width=Number(size[1]),height=Number(size[2]);
  const snapshot=buildShellSnapshot('validation-evidence/retail-live-ui');
  adb('push',snapshot,'/data/local/tmp/lumenfall-live-ui.jar');
  let visibleGame=false,ui='',captureErrors=[];
  const deadline=Date.now()+120000;
  while(Date.now()<deadline){
    await new Promise(resolve=>setTimeout(resolve,2000));
    try{
      adb('shell','rm','-f','/sdcard/lumenfall-production.xml');
      adb('shell','CLASSPATH=/data/local/tmp/lumenfall-live-ui.jar:/system/framework/uiautomator.jar','app_process','/system/bin','com.lumenfall.qa.LiveUiSnapshot','/sdcard/lumenfall-production.xml',String(width),String(height));
      ui=adb('shell','cat','/sdcard/lumenfall-production.xml');
      visibleGame=hasVisibleGameControls(ui,width,height);
      if(visibleGame)break;
    }catch(error){
      const diagnostic=String(error.stderr||error.message);
      captureErrors.push(diagnostic);
      fs.writeFileSync('release-evidence/production-live-ui-errors.txt',captureErrors.join('\n'));
      console.log('Waiting for normal launch accessibility: '+diagnostic);
    }
  }
  fs.writeFileSync('release-evidence/production-normal-launch.xml',ui);
  fs.writeFileSync('release-evidence/production-normal-launch.png',cp.execFileSync('adb',['exec-out','screencap','-p'],{maxBuffer:16*1024*1024,timeout:30000}));
  // Retain a second real frame for visual review of the fresh-launch ring.
  await new Promise(resolve=>setTimeout(resolve,2000));
  fs.writeFileSync('release-evidence/production-normal-launch-settled.png',cp.execFileSync('adb',['exec-out','screencap','-p'],{maxBuffer:16*1024*1024,timeout:30000}));
  assert(visibleGame,'Normal launch must reach visible game controls beyond the loading cover/intro');
  adb('shell','rm','-f','/data/local/tmp/lumenfall-live-ui.jar');
  const pid=adb('shell','pidof',pkg).trim();assert(/^\d+$/.test(pid),'Normal production process stays running');
  const sockets=adb('shell','cat','/proc/net/unix');
  assert(!sockets.includes('webview_devtools_remote_'+pid),'Normal production WebView exposes no debugger socket');
  const runAs=cp.spawnSync('adb',['shell','run-as',pkg,'id'],{encoding:'utf8',timeout:30000});
  assert.notEqual(runAs.status,0,'Production private app data rejects run-as');
  const installed=adb('shell','pm','path',pkg).trim().replace(/^package:/,'');
  const bytes=cp.execFileSync('adb',['exec-out','cat',installed],{maxBuffer:64*1024*1024,timeout:30000});
  const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
  assert.equal(hash(bytes),hash(fs.readFileSync('Lumenfall.apk')),'Installed base APK equals final production artifact');
  fs.writeFileSync('release-evidence/production-runtime.json',JSON.stringify({status:'PASS',apkSha256:hash(bytes),device:adb('shell','getprop','ro.build.fingerprint').trim(),systemBuildType:'user',debuggable:false,webViewDebuggerExposed:false,runAsRejected:true,testInstrumentationAbsent:true,normalLaunch:true,visibleGameControls:true,accessibilityCapture:'live-shell',display:{width,height},googlePlayProtect:'NOT_TESTED',physicalDevice:false},null,2)+'\n');
  console.log('PASS exact production APK normal launch, no debugger socket, private storage protected, no CI instrumentation');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
