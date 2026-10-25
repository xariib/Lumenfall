'use strict';
// Native browser regression for the 25 October phone feedback. Built-ins only.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os');
const {spawn}=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {findChrome}=require('../../scripts/lib/browser.cjs');
const root=path.resolve(__dirname,'../..'),out=path.resolve(process.argv[2]||'/tmp/mobile-feedback');
const source=fs.readFileSync(path.join(root,'index.html'),'utf8'),hash=crypto.createHash('sha256').update(source).digest('hex');
const marker="if(document.readyState==='loading'){";assert.equal(source.split(marker).length,2);
let mode='return',gateResponse,releaseGate=false;
function page(){
 const bridge=`
window.feedbackQa={events:[],release:null};
window.setInterval=function(){return 0;};
localStorage.clear();
if(${JSON.stringify(mode)}!=='fresh'){
 var seed=freshState();seed.lastSeen=Date.now()-60000;seed.questDay=todayStr();seed.tutorialDone=true;
 localStorage.setItem(SAVE_KEY,JSON.stringify(seed));
}
if(${JSON.stringify(mode)}==='cooldown')localStorage.setItem(STARTUP_INTRO_KEY,String(Date.now()));
var originalApply=applyOfflineProgress;
applyOfflineProgress=function(done){
 feedbackQa.events.push({event:'offline-start',intro:startupIntroPlaying});
 offlinePending=true;
 feedbackQa.release=function(){
  if(${JSON.stringify(mode)}==='failure'){offlinePending=true;done(null,new Error('QA simulated failure'));return;}
  originalApply(function(result,error){feedbackQa.events.push({event:'offline-end',error:!!error});done(result,error);});
 };
};
var originalReturn=showReturnFlow;
showReturnFlow=function(){feedbackQa.events.push({event:'return',intro:startupIntroPlaying});return originalReturn.apply(this,arguments);};
`;
 return source.replace('<script>\n(function(){','<script src="/gate.js"></script><script>\n(function(){').replace(marker,bridge+marker);
}
const server=http.createServer((req,res)=>{
 const name=new URL(req.url,'http://localhost').pathname;
 if(name==='/gate.js'){if(releaseGate)res.end('');else gateResponse=res;return;}
 if(name==='/'){res.setHeader('Content-Type','text/html');res.end(page());return;}
 const file=path.resolve(root,'.'+decodeURIComponent(name));
 if(file.startsWith(root+path.sep)&&fs.existsSync(file)&&fs.statSync(file).isFile())res.end(fs.readFileSync(file));else{res.statusCode=404;res.end();}
});
let browser,profile,session,seq=0,buffer='',stderr='',closed=false;const pending=new Map(),records=[];
function send(method,params={},sid=session){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP deadline '+method));},20000);pending.set(id,{resolve,reject,timer});browser.stdio[3].write(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})})+'\0');});}
async function ev(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
async function until(expression){const end=Date.now()+15000;while(Date.now()<end){if(await ev(expression))return;await new Promise(r=>setTimeout(r,25));}throw Error('Timed out: '+expression);}
async function touch(selector){const r=await ev(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[r]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
async function shot(name){const r=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(r.data,'base64'));}
async function run(){
 fs.mkdirSync(out,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 profile=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-feedback-'));
 browser=spawn(findChrome(),['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
 browser.stderr.on('data',b=>stderr=(stderr+b).slice(-3000));browser.on('error',e=>{for(const p of pending.values())p.reject(e);});browser.on('close',()=>{closed=true;for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('browser closed'));}pending.clear();});
 for(const stream of [browser.stdio[3],browser.stdio[4]])stream.on('error',()=>{});
 browser.stdio[4].on('data',b=>{buffer+=b;let i;while((i=buffer.indexOf('\0'))>=0){const raw=buffer.slice(0,i);buffer=buffer.slice(i+1);if(!raw)continue;const m=JSON.parse(raw),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}});
 const identity=await send('Browser.getVersion',{},null),tab=await send('Target.createTarget',{url:'about:blank'},null);session=(await send('Target.attachToTarget',{targetId:tab.targetId,flatten:true},null)).sessionId;
 await send('Page.enable');await send('Runtime.enable');await send('DOM.enable');
 await send('Page.addScriptToEvaluateOnNewDocument',{source:"window.feedbackErrors=[];addEventListener('error',e=>feedbackErrors.push(e.message));addEventListener('unhandledrejection',e=>feedbackErrors.push(String(e.reason)));"});
 for(const width of [320,390,430])for(const motion of ['no-preference','reduce'])for(mode of ['fresh','return','cooldown','failure']){
  gateResponse=null;releaseGate=false;
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setTouchEmulationEnabled',{enabled:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});
  await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/?case='+records.length});
  await until('!!document.querySelector(".shell")');
  assert(await ev('getComputedStyle(document.querySelector(".shell")).visibility==="hidden" && getComputedStyle(document.querySelector(".startup-loading")).display==="flex"'),'first paint covers Rift before JS');
  if(width===390&&mode==='return')await shot('boot-'+motion);
  releaseGate=true;if(gateResponse)gateResponse.end('');
  await until('!!window.feedbackQa && (typeof document.getElementById("startup-skip").onclick==="function" || !!feedbackQa.release)');
  if(mode!=='cooldown'){
   assert(await ev('getComputedStyle(document.getElementById("startup-intro")).display==="flex"'),'intro is visible');
   if(mode!=='fresh')assert(await ev('feedbackQa.events[0].intro===true'),'intro begins before offline work');
   await touch('#startup-skip');
   await until('getComputedStyle(document.getElementById("startup-intro")).display==="none"');
  }
  if(mode!=='fresh'){
   assert(await ev('getComputedStyle(document.querySelector(".shell")).visibility==="hidden"'),'skip/cooldown keeps busy game covered');
   assert(await ev('feedbackQa.events.every(e=>e.event!=="return")'),'return waits for offline completion');
   await ev('feedbackQa.release()');
  }
  await until('!document.documentElement.classList.contains("startup-pending")');
  assert(await ev('getComputedStyle(document.querySelector(".shell")).visibility==="visible"'),'ready or recovery UI revealed');
  if(mode==='return'||mode==='cooldown'){
   assert(await ev('feedbackQa.events.filter(e=>e.event==="return").length===1 && feedbackQa.events.filter(e=>e.event==="return").every(e=>!e.intro)'),'one return flow after intro and offline');
   await until('getComputedStyle(document.getElementById("welcome-overlay")).display!=="none"');
   await touch('#welcome-claim');
   assert(await ev('getComputedStyle(document.activeElement).outlineStyle==="none"'),'claim has no pointer focus highlight');
  }
  if(mode==='failure')assert(await ev('feedbackQa.events.every(e=>e.event!=="return")'),'failure never presents successful rewards');
  // Dismiss any daily prompt with its real existing action before navigation.
  if(await ev('getComputedStyle(document.getElementById("daily-overlay")).display!=="none"'))await touch('#daily-claim');
  if(mode!=='failure'){
   await touch('#rift-hints-toggle');assert(await ev('getComputedStyle(document.getElementById("rift-hints-toggle")).outlineStyle==="none"'),'touch hint has no focus highlight');
   await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
   await ev('document.getElementById("rift-hints-toggle").focus()');assert(await ev('getComputedStyle(document.activeElement).outlineStyle!=="none"'),'keyboard focus remains visible');
  }
  assert.deepEqual(await ev('feedbackErrors'),[],'no runtime errors');records.push({width,motion,mode,pass:true});
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({status:'PASS',sourceSha256:hash,browser:identity,records},null,2));console.log(JSON.stringify({status:'PASS',profiles:records.length,sourceSha256:hash}));
}
(async()=>{try{await run();}catch(e){fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'failure.json'),JSON.stringify({error:e.stack,stderr,mode,records},null,2));console.error(e);process.exitCode=1;}finally{
 if(gateResponse&&!gateResponse.writableEnded)gateResponse.end('');
 if(browser&&!closed){const done=new Promise(r=>browser.once('close',r));await send('Browser.close',{},null).catch(()=>{});await done;}
 server.closeAllConnections();await new Promise(r=>server.close(r));if(profile)fs.rmSync(profile,{recursive:true,force:true});
}})();
