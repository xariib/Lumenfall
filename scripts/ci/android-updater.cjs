'use strict';
// Real official download/Android installer, exclusively on a disposable emulator.
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict');
const pkg='com.lumenfall.app',adb=(...args)=>cp.execFileSync('adb',args,{encoding:'utf8',timeout:120000});
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const foreground=()=>adb('shell','dumpsys','activity','activities').split('\n').filter(line=>/mResumedActivity|topResumedActivity/.test(line)).join('\n');
let socket,seq=0;const pending=new Map();
async function until(fn,label,seconds=90){for(let i=0;i<seconds*2;i++){try{const value=await fn();if(value)return value;}catch{}await pause(500);}throw Error('Timed out: '+label);}
async function connect(){
  return until(async()=>{
    const pid=adb('shell','pidof',pkg).trim();adb('forward','tcp:9223','localabstract:webview_devtools_remote_'+pid);
    const pages=await (await fetch('http://127.0.0.1:9223/json')).json(),page=pages.find(p=>p.type==='page'&&p.url.startsWith('https://localhost'));
    if(!page)return false;
    const url=new URL(page.webSocketDebuggerUrl);url.hostname='127.0.0.1';url.port='9223';
    socket=new WebSocket(url);await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
    socket.addEventListener('message',event=>{const m=JSON.parse(event.data),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}});
    return true;
  },'native WebView connection');
}
async function evaluate(expression){
  const id=++seq;
  const result=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(id);reject(Error('Native evaluation deadline'));},30000);pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method:'Runtime.evaluate',params:{expression,awaitPromise:true,returnByValue:true}}));});
  assert(!result.exceptionDetails,JSON.stringify(result.exceptionDetails));return result.result.value;
}
async function click(){await evaluate("document.getElementById('app-update-action').click()");}
async function ready(){return until(()=>evaluate("document.getElementById('app-update-action').textContent==='Install update'&&!document.getElementById('app-update-action').disabled"),'verified install retry');}
async function main(){
  assert.match(adb('get-serialno').trim(),/^emulator-/,'Never operate on a player device');
  const official=await (await fetch('https://api.github.com/repos/xariib/Lumenfall/releases/latest')).json();
  assert.match(official.tag_name,/^android-\d+$/);const expected=Number(official.tag_name.substring(8));
  assert.match(adb('install','-r','-d','updater-probe.apk'),/Success/);
  adb('shell','appops','set',pkg,'REQUEST_INSTALL_PACKAGES','deny');
  adb('shell','am','start','-n',pkg+'/.MainActivity');await connect();
  await until(()=>evaluate("document.getElementById('app-update-action')&&document.getElementById('app-update-action').textContent==='Download & install'&&!document.getElementById('app-update-action').disabled"),'automatic official release discovery');
  await evaluate("localStorage.setItem('native-updater-sentinel','retain-both-saves')");
  await click();await evaluate("document.getElementById('app-update-cancel').click()");
  await until(()=>evaluate("!document.getElementById('app-update-action').disabled&&document.getElementById('app-update-status').textContent.includes('cancelled')"),'download cancellation');
  await click();
  await until(()=>/ManageExternalSources|ExternalSourcesDetails/.test(foreground()),'Android install-source permission',120);
  adb('shell','input','keyevent','KEYCODE_BACK');await ready();
  assert(await evaluate("document.getElementById('app-update-status').textContent.includes('not allowed')"),'Permission refusal is explained');
  socket.close();adb('shell','am','force-stop',pkg);adb('shell','am','start','-n',pkg+'/.MainActivity');await connect();await ready();
  // Corrupt an already verified private download: installation must reverify it.
  const tampered=cp.execFileSync('adb',['exec-out','run-as',pkg,'cat','cache/updates/update.apk']);
  tampered[tampered.length-1]^=1;fs.writeFileSync('release-evidence/updater-tampered.apk',tampered);
  adb('push','release-evidence/updater-tampered.apk','/data/local/tmp/lumenfall-tampered.apk');
  adb('shell','run-as',pkg,'cp','/data/local/tmp/lumenfall-tampered.apk','cache/updates/update.apk');
  fs.unlinkSync('release-evidence/updater-tampered.apk');
  await click();
  await until(()=>evaluate("!document.getElementById('app-update-action').disabled&&document.getElementById('app-update-action').textContent==='Download & install'&&document.getElementById('app-update-status').textContent.includes('checksum')"),'tampered APK rejected at installation');
  await click();
  await until(()=>/ManageExternalSources|ExternalSourcesDetails/.test(foreground()),'permission retry after fresh download',120);
  adb('shell','input','keyevent','KEYCODE_BACK');await ready();
  adb('shell','appops','set',pkg,'REQUEST_INSTALL_PACKAGES','allow');
  await click();
  await until(()=>/packageinstaller/.test(foreground()),'Android installer');
  adb('shell','input','keyevent','KEYCODE_BACK');await ready();
  assert(await evaluate("document.getElementById('app-update-status').textContent.includes('cancelled')"),'Installer cancellation keeps verified retry');
  await click();
  const button=await until(()=>{
    adb('shell','uiautomator','dump','/sdcard/lumenfall-update.xml');
    const xml=adb('shell','cat','/sdcard/lumenfall-update.xml');
    return [...xml.matchAll(/<node\b[^>]*>/g)].map(m=>m[0]).find(node=>/text="(?:Update|Install)"/.test(node)&&/enabled="true"/.test(node)&&/clickable="true"/.test(node));
  },'system Update confirmation');
  const bounds=/bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/.exec(button);assert(bounds);
  adb('shell','input','tap',String(Math.round((+bounds[1]+ +bounds[3])/2)),String(Math.round((+bounds[2]+ +bounds[4])/2)));
  await until(()=>new RegExp('versionCode='+expected+'\\b').test(adb('shell','dumpsys','package',pkg)),'official APK installed');
  socket.close();adb('shell','am','start','-n',pkg+'/.MainActivity');await connect();
  const retained=await evaluate("({sentinel:localStorage.getItem('native-updater-sentinel'),primary:!!localStorage.getItem('lumenfall_save_v2'),recovery:!!localStorage.getItem('lumenfall_save_recovery_v1'),origin:location.origin})");
  assert.equal(retained.sentinel,'retain-both-saves');assert(retained.primary&&retained.recovery);assert.equal(retained.origin,'https://localhost');
  socket.close();assert.match(adb('install','-r','Lumenfall.apk'),/Success/,'Restore final candidate on emulator');
  fs.writeFileSync('release-evidence/in-app-updater.json',JSON.stringify({status:'PASS',commit:process.env.GITHUB_SHA,candidateApkSha256:require('node:crypto').createHash('sha256').update(fs.readFileSync('Lumenfall.apk')).digest('hex'),officialVersionCode:expected,downloadCancelled:true,permissionRefusal:true,verifiedDownloadSurvivesRestart:true,tamperedDownloadRejected:true,installerCancellation:true,systemApprovedInstall:true,retained,physicalDevice:false},null,2)+'\n');
  console.log('PASS actual in-app official download, permission refusal, restart, installer cancellation and approved installation; both saves/origin retained');
}
const deadline=setTimeout(()=>{console.error('Native updater deadline');process.exit(1);},300000);
main().catch(error=>{console.error(error.stack);process.exitCode=1;try{fs.writeFileSync('release-evidence/updater-failure-logcat.txt',adb('logcat','-d','-t','1000'));fs.writeFileSync('release-evidence/updater-failure-activity.txt',adb('shell','dumpsys','activity','activities'));}catch{}}).finally(()=>{clearTimeout(deadline);if(socket)socket.close();});
