'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
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
  let visibleGame=false,ui='';
  const deadline=Date.now()+120000;
  while(Date.now()<deadline){
    await new Promise(resolve=>setTimeout(resolve,2000));
    try{
      adb('shell','uiautomator','dump','/sdcard/lumenfall-production.xml');
      ui=adb('shell','cat','/sdcard/lumenfall-production.xml');
      visibleGame=ui.includes('package="'+pkg+'"') &&
        /(?:text|content-desc)="[^"]*(?:Rift|Wisps|Settings)/.test(ui) &&
        !/Preparing your Rift|Skip intro/.test(ui);
      if(visibleGame)break;
    }catch(error){console.log('Waiting for normal launch accessibility: '+error.message.split('\n')[0]);}
  }
  fs.writeFileSync('release-evidence/production-normal-launch.xml',ui);
  fs.writeFileSync('release-evidence/production-normal-launch.png',cp.execFileSync('adb',['exec-out','screencap','-p'],{maxBuffer:16*1024*1024,timeout:30000}));
  assert(visibleGame,'Normal launch must reach visible game controls beyond the loading cover/intro');
  const pid=adb('shell','pidof',pkg).trim();assert(/^\d+$/.test(pid),'Normal production process stays running');
  const sockets=adb('shell','cat','/proc/net/unix');
  assert(!sockets.includes('webview_devtools_remote_'+pid),'Normal production WebView exposes no debugger socket');
  const runAs=cp.spawnSync('adb',['shell','run-as',pkg,'id'],{encoding:'utf8',timeout:30000});
  assert.notEqual(runAs.status,0,'Production private app data rejects run-as');
  const installed=adb('shell','pm','path',pkg).trim().replace(/^package:/,'');
  const bytes=cp.execFileSync('adb',['exec-out','cat',installed],{maxBuffer:64*1024*1024,timeout:30000});
  const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
  assert.equal(hash(bytes),hash(fs.readFileSync('Lumenfall.apk')),'Installed base APK equals final production artifact');
  fs.writeFileSync('release-evidence/production-runtime.json',JSON.stringify({status:'PASS',apkSha256:hash(bytes),device:adb('shell','getprop','ro.build.fingerprint').trim(),systemBuildType:'user',debuggable:false,webViewDebuggerExposed:false,runAsRejected:true,testInstrumentationAbsent:true,normalLaunch:true,visibleGameControls:true,googlePlayProtect:'NOT_TESTED',physicalDevice:false},null,2)+'\n');
  console.log('PASS exact production APK normal launch, no debugger socket, private storage protected, no CI instrumentation');
}
// Diagnostic only: a failed candidate still fails this gate. Compare a pinned
// released APK on this same disposable retail image before changing acceptance.
async function compareReleasedBaseline(candidateError){
  assert.match(adb('get-serialno').trim(),/^emulator-/,'Disposable CI emulator only');
  const dir='release-evidence/retail-comparison';fs.mkdirSync(dir,{recursive:true});
  const original=fs.readFileSync('Lumenfall.apk'),names=['production-normal-launch.png','production-normal-launch.xml','production-runtime.json'];
  for(const name of names)if(fs.existsSync('release-evidence/'+name))fs.copyFileSync('release-evidence/'+name,dir+'/candidate-'+name);
  try{fs.writeFileSync(dir+'/candidate-logcat.txt.gz',require('node:zlib').gzipSync(adb('logcat','-d')));}catch(error){fs.writeFileSync(dir+'/logcat-error.txt',error.message);}
  const result={candidate:{status:'FAIL',error:candidateError.stack,apkSha256:crypto.createHash('sha256').update(original).digest('hex')},baseline:{tag:'android-1000111',sha256:'6bcef5120e943da897c246ceb0608a3e87bb296cd0a28379de56dff71405afac'}};
  try{
    const response=await fetch('https://github.com/xariib/Lumenfall/releases/download/android-1000111/Lumenfall.apk',{signal:AbortSignal.timeout(120000)});assert.equal(response.status,200);
    const baseline=Buffer.from(await response.arrayBuffer());assert.equal(crypto.createHash('sha256').update(baseline).digest('hex'),result.baseline.sha256);
    adb('shell','am','force-stop',pkg);assert.match(adb('uninstall',pkg),/Success/,'Only disposable emulator fixture is removed');
    fs.writeFileSync('Lumenfall.apk',baseline);console.log('Diagnostic: running unchanged retail launch assertions against pinned Android 0.2.111');
    await main();result.baseline.status='PASS';
  }catch(error){result.baseline.status='FAIL';result.baseline.error=error.stack;}
  finally{
    for(const name of names)if(fs.existsSync('release-evidence/'+name))fs.copyFileSync('release-evidence/'+name,dir+'/baseline-'+name);
    fs.writeFileSync('Lumenfall.apk',original);
    fs.writeFileSync(dir+'/result.json',JSON.stringify(result,null,2)+'\n');
  }
  console.log('Retail comparison: '+JSON.stringify(result));
}
main().catch(async error=>{console.error(error);try{await compareReleasedBaseline(error);}catch(diagnosticError){console.error('Baseline diagnostic failed: '+diagnosticError.stack);}process.exitCode=1;});
