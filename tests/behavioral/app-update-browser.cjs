'use strict';
// Production game/CSS with only the native boundary replaced by a test double.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {serve}=require('../../scripts/lib/static-server.cjs'),{findChrome}=require('../../scripts/lib/browser.cjs');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-updater-browser-')),out=path.resolve(process.argv[2]||'validation-evidence/app-update-browser');
let browser,server,socket,session,seq=0;const pending=new Map(),records=[];
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(fn){for(let i=0;i<200;i++){try{const result=await fn();if(result)return result;}catch{}await pause(50);}throw Error('Browser condition timed out');}
function send(method,params={},sid=session){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP deadline: '+method));},15000);pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})}));});}
async function evaluate(expression){const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});assert(!r.exceptionDetails,JSON.stringify(r.exceptionDetails));return r.result.value;}
function prelude(save){
  const now=Date.now(),today=new Date().toLocaleDateString('en-CA');
  const materialize=v=>v==='__NOW__'?now:v==='__TODAY__'?today:Array.isArray(v)?v.map(materialize):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,materialize(x)])):v;
  return `localStorage.setItem('lumenfall_save_v2',${JSON.stringify(JSON.stringify(materialize(save)))});localStorage.setItem('lumenfall_startup_intro_last','${now}');
    window.updateTestErrors=[];addEventListener('error',e=>updateTestErrors.push(e.message));addEventListener('unhandledrejection',e=>updateTestErrors.push(String(e.reason)));
    window.setInterval=function(){return 1;};
    window.updateTestInfo={currentVersion:'0.2.69',version:'0.2.70',available:true,ready:false,bytes:7340032};window.updateTestInstallCalls=0;
    window.updateTestPlugin={getState:()=>Promise.resolve({...updateTestInfo}),check:()=>Promise.resolve({...updateTestInfo}),
      addListener:(name,fn)=>{window.updateTestProgress=fn;return {remove:()=>{}};},
      download:()=>new Promise(resolve=>{window.updateTestFinish=()=>{updateTestInfo.ready=true;resolve({...updateTestInfo});};}),
      cancel:()=>Promise.resolve(),install:()=>{updateTestInstallCalls++;return Promise.resolve({status:'cancelled'});}};
    window.Capacitor={isNativePlatform:()=>true,isPluginAvailable:()=>true,Plugins:{AppUpdater:updateTestPlugin}};`;
}
async function main(){
  fs.mkdirSync(out,{recursive:true});server=await serve(process.cwd());
  browser=cp.spawn(findChrome(),['--headless=new','--no-sandbox','--disable-gpu','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{stdio:'ignore'});
  browser.on('error',error=>{throw error;});
  const port=await until(()=>{const f=path.join(profile,'DevToolsActivePort');return fs.existsSync(f)&&fs.readFileSync(f,'utf8').split('\n')[0];});
  const version=await (await fetch('http://127.0.0.1:'+port+'/json/version')).json();
  socket=new WebSocket(version.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
  socket.addEventListener('message',event=>{const m=JSON.parse(event.data),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}});
  const fixtures=JSON.parse(fs.readFileSync('tests/behavioral/fixtures.json','utf8'));
  for(const [width,height,scale] of [[320,568,1],[320,568,2],[390,844,1]]){
    const context=await send('Target.createBrowserContext',{},null),target=await send('Target.createTarget',{url:'about:blank',browserContextId:context.browserContextId},null);
    session=(await send('Target.attachToTarget',{targetId:target.targetId,flatten:true},null)).sessionId;
    await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});
    await send('Page.addScriptToEvaluateOnNewDocument',{source:prelude(fixtures['mid-game'].save)});
    await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});
    await until(()=>evaluate("document.getElementById('app-update-action')?.textContent==='Download & install'&&!document.getElementById('app-update-action').disabled"));
    await evaluate(`document.documentElement.style.fontSize='${16*scale}px';document.getElementById('settings-btn').click();document.getElementById('app-update-action').scrollIntoView({block:'center'});`);
    const layout=await evaluate(`['app-update-action','app-update-check'].map(id=>{const e=document.getElementById(id),r=e.getBoundingClientRect();return {id,width:r.width,height:r.height,overflow:e.scrollWidth>e.clientWidth+1,inside:r.left>=0&&r.right<=innerWidth};})`);
    for(const row of layout){assert(row.height>=44&&row.width>=44,row.id+' touch target');assert(!row.overflow&&row.inside,row.id+' label/viewport fit');}
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    await evaluate("document.getElementById('app-update-action').click()");
    await until(()=>evaluate("getComputedStyle(document.getElementById('app-update-cancel')).display!=='none'"));
    await evaluate('updateTestProgress({received:50,total:100})');assert.equal(await evaluate("document.getElementById('app-update-progress').value"),50);
    await evaluate('updateTestFinish()');await until(()=>evaluate("!document.getElementById('app-update-action').disabled"));
    assert((await evaluate("document.getElementById('app-update-status').textContent")).includes('cancelled'));
    assert.equal(await evaluate('updateTestInstallCalls'),1);
    await evaluate("updateTestInfo.ready=false;document.getElementById('app-update-check').click()");
    await until(()=>evaluate("document.getElementById('app-update-action').textContent==='Download & install'&&!document.getElementById('app-update-action').disabled"));
    await evaluate("document.getElementById('app-update-action').click();document.getElementById('app-update-cancel').click();updateTestFinish()");
    await until(()=>evaluate("!document.getElementById('app-update-action').disabled"));
    assert.equal(await evaluate('updateTestInstallCalls'),1,'Late successful download completion must honor Cancel');
    assert((await evaluate("document.getElementById('app-update-status').textContent")).includes('cancelled'));
    assert.deepEqual(await evaluate('updateTestErrors'),[],'No production runtime errors');
    await evaluate("document.getElementById('app-update-action').scrollIntoView({block:'center'})");
    const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,width+'-'+scale+'x.png'),Buffer.from(shot.data,'base64'));
    records.push({width,height,scale,layout,progress:true,installerRetry:true,lateCancelPreventsInstaller:true});
    await send('Target.disposeBrowserContext',{browserContextId:context.browserContextId},null);session=null;
  }
  fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify({status:'PASS',sourceSha256:require('node:crypto').createHash('sha256').update(fs.readFileSync('index.html')).digest('hex'),browser:version.Browser,nativeBoundary:'test double',records},null,2)+'\n');
  console.log('PASS production updater browser: 320px/200% text, 390px, progress, save/install and cancellation retry');
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{if(socket)await send('Browser.close',{},null).catch(()=>{});if(socket)socket.close();if(browser)await new Promise(resolve=>browser.exitCode!==null?resolve():browser.once('exit',resolve));if(server)await new Promise(resolve=>server.close(resolve));fs.rmSync(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});});
