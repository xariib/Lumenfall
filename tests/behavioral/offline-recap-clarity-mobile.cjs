'use strict';
// Production DOM/CSS and return handlers; only receipt data and clocks are fixed.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {spawn}=require('node:child_process'),{serve}=require('../../scripts/lib/static-server.cjs'),{findChrome}=require('../../scripts/lib/browser.cjs');
const root=path.resolve(__dirname,'../..'),out=path.resolve(process.argv[2]||'validation-evidence/offline-recap-clarity/mobile');
const source=fs.readFileSync(path.join(root,'index.html'),'utf8'),sourceSha256=crypto.createHash('sha256').update(source).digest('hex');
const marker="if(document.readyState==='loading'){";assert.equal(source.split(marker).length,2);
const hook=`window.recapQa={ready:function(){return !!els.toast;},saved:function(){return JSON.stringify({state:state,primary:localStorage.getItem(SAVE_KEY),recovery:localStorage.getItem(RECOVERY_SAVE_KEY)});},
 present:function(receipt,daily){document.querySelectorAll('.overlay').forEach(function(el){closeOverlay(el);});pendingDailyReward=daily?{streak:3,reward:{comets:9}}:null;pendingDailyRewardQueue=[];showReturnFlow(receipt,false);}};`;
const prelude='<script>window.recapErrors=[];addEventListener("error",e=>recapErrors.push(e.message));addEventListener("unhandledrejection",e=>recapErrors.push(String(e.reason)));window.setInterval=function(){return 0;};Object.defineProperty(performance,"now",{configurable:true,value:function(){return 0;}});</script>';
const short={elapsedSec:17,earned:558.6,shardEarned:106.4,sigilsEarned:0,motesEarned:0,ascends:0,completedStudies:[],closedStudies:[]};
const long={...short,elapsedSec:72000,earned:'1e400',sigilsEarned:321,motesEarned:42,ascends:4114,retreated:true,endDepth:91,pushDepth:101,
 completedStudies:[...Array(120).fill('Measured Inquiry'),...Array(4).fill('Wisp Ascension'),...Array.from({length:20},(_,i)=>'Research track '+i)],closedStudies:['Measured Inquiry','Measured Inquiry']};
let browser,server,stage,profile,session,seq=0,buffer='',closed=false,stderr='',checks=0;const pending=new Map(),records=[];
function ok(v,m){checks++;assert(v,m);}
function send(method,params={},sid=session){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP deadline '+method+' '+stderr));},15000);pending.set(id,{resolve,reject,timer});browser.stdio[3].write(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})})+'\0');});}
async function ev(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function until(expression){for(let i=0;i<300;i++){if(await ev(expression))return;await pause(25);}throw Error('Not ready: '+expression);}
async function key(key,code=key,modifiers=0){const vk={Tab:9,Enter:13,Escape:27,' ':32}[key];await send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:vk,modifiers,text:key==='Enter'?'\r':key===' '?' ':undefined});await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:vk,modifiers});}
async function touch(selector){const r=await ev(`(()=>{var e=document.querySelector(${JSON.stringify(selector)}),r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[r]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
async function geometry(){return ev(`(()=>{var m=document.querySelector('#welcome-overlay .modal'),t=document.getElementById('welcome-text'),b=document.getElementById('welcome-claim'),r=m.getBoundingClientRect(),c=b.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,buttonTop:c.top,buttonBottom:c.bottom,buttonHeight:c.height,hit:document.elementFromPoint(c.x+c.width/2,c.y+c.height/2)===b,bodyScroll:t.scrollHeight>t.clientHeight,overflow:t.scrollWidth-t.clientWidth,pageOverflow:document.documentElement.scrollWidth-innerWidth,bodyMax:getComputedStyle(m).maxHeight};})()`);}
async function shot(name){const r=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(r.data,'base64'));}
async function run(){
 fs.mkdirSync(out,{recursive:true});stage=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-recap-'));
 fs.writeFileSync(path.join(stage,'index.html'),source.replace('<head>','<head>'+prelude).replace(marker,hook+marker));
 for(const dir of ['fonts','branding'])fs.cpSync(path.join(root,dir),path.join(stage,dir),{recursive:true});
 server=await serve(stage);profile=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-recap-browser-'));
 browser=spawn(findChrome(),['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
 browser.stderr.on('data',b=>stderr=(stderr+b).slice(-2000));
 browser.on('close',()=>{closed=true;for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('browser closed'));}pending.clear();});
 browser.on('error',e=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(e);}pending.clear();});
 for(const i of [3,4])browser.stdio[i].on('error',()=>{});
 browser.stdio[4].on('data',b=>{buffer+=b;let end;while((end=buffer.indexOf('\0'))>=0){const raw=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!raw)continue;const m=JSON.parse(raw),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}});
 const version=await send('Browser.getVersion',{},null),target=await send('Target.createTarget',{url:'about:blank'},null);
 session=(await send('Target.attachToTarget',{targetId:target.targetId,flatten:true},null)).sessionId;
 await send('Page.enable');await send('Runtime.enable');await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});
 await until('!!window.recapQa && recapQa.ready()');await ev('document.getElementById("startup-skip").click()');
 await until('!document.documentElement.classList.contains("startup-pending")');await pause(500);await ev('document.fonts.ready');
 for(const [width,height] of [[320,568],[390,844],[430,932],[844,390]])for(const scale of [1,2]){
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:scale===2?'reduce':'no-preference'}]});
  await ev(`document.documentElement.style.fontSize='${scale*100}%'`);
  // Exercise the explicit vh fallback with dynamic viewport units removed.
  if(width===844)await ev(`for(var sheet of document.styleSheets)for(var rule of sheet.cssRules)if(rule.selectorText==='#welcome-overlay .modal')rule.style.maxHeight='calc(100vh - var(--safe-top) - var(--safe-bottom) - 48px)'`);
  const saved=await ev('recapQa.saved()');
  await ev('recapQa.present('+JSON.stringify(short)+',false)');
  await touch('#welcome-title');ok(await ev('getComputedStyle(document.getElementById("welcome-text")).outlineStyle==="none"'),'touch leaves no containing-card focus highlight');
  let g=await geometry();ok(g.hit&&g.buttonHeight>=44&&g.buttonBottom<=height&&g.top>=0&&g.bottom<=height,'short recap Continue visible');
  ok(await ev('document.querySelectorAll(".welcome-reward").length===2 && !document.querySelector(".welcome-lab")'),'short recap remains compact');
  if(width===390&&scale===1)await shot('short-390');
  await ev('recapQa.present('+JSON.stringify(long)+',false)');
  ok(await ev('document.querySelectorAll(".welcome-lab").length===2 && !document.querySelector(".welcome-lab[open]") && document.querySelector(".welcome-lab summary").textContent==="Lab: 144 levels completed"'),'all outcomes in collapsed Lab totals');
  if(width===390&&scale===1)await shot('long-collapsed-390');
  // Native keyboard expands details through the existing modal focus trap.
  await key('Tab');ok(await ev('document.activeElement.matches(".welcome-lab summary")'),'Tab reaches Lab details');
  await key('Enter');ok(await ev('document.querySelector(".welcome-lab").open'),'Enter expands full Lab results');
  ok(await ev('document.querySelectorAll(".welcome-lab:first-of-type li").length===22'),'repeated studies grouped without losing other names');
  await ev('document.querySelectorAll(".welcome-lab").forEach(e=>e.open=true)');g=await geometry();
  ok(g.left>=0&&g.right<=width+1&&g.top>=0&&g.bottom<=height&&g.overflow<=1&&g.pageOverflow<=1,'expanded recap fits mobile viewport');
  ok(g.bodyScroll&&g.hit&&g.buttonBottom<=height,'only body scrolls; Continue remains visible and hittable');
  if(width===320||width===390)await shot('expanded-'+width+'-'+scale);
  await ev('document.getElementById("welcome-text").scrollTop=100000');
  await ev('document.getElementById("welcome-claim").focus()');await key('Tab');
  ok(await ev('document.activeElement.id==="welcome-text"'),'Tab wraps within the modal');
  await key('Tab','Tab',8);ok(await ev('document.activeElement.id==="welcome-claim"'),'Shift Tab wraps back to Continue');
  await touch('#welcome-claim');ok(await ev('document.getElementById("welcome-overlay").style.display==="none"'),'trusted touch dismisses expanded recap');
  assert.equal(await ev('recapQa.saved()'),saved,'presentation and Continue preserve both saves and gameplay');checks++;
  await ev('recapQa.present('+JSON.stringify(short)+',true)');
  ok(await ev('document.getElementById("welcome-text").scrollTop===0 && !document.querySelector(".welcome-lab[open]")'),'next return resets scroll and details');
  await key('Escape');ok(await ev('document.getElementById("daily-overlay").style.display!=="none" && document.getElementById("daily-title").textContent==="Day 3 streak"'),'Escape continues to the queued daily reward');
  await key('Escape');ok(await ev('document.getElementById("daily-overlay").style.display==="none"'),'daily dismisses once');
  records.push({width,height,scale,expanded:g});
 }
 ok((await ev('recapErrors')).length===0,'no browser runtime errors');
 return {status:'PASS',sourceSha256,checks,profiles:records,version};
}
(async()=>{let result;try{result=await run();}catch(e){result={status:'FAIL',sourceSha256,checks,profiles:records,error:e.stack,stderr};process.exitCode=1;}finally{
 try{if(browser&&!closed){const done=new Promise(r=>browser.once('close',(code,signal)=>r({code,signal})));await send('Browser.close',{},null).catch(()=>{});let timer;const end=await Promise.race([done,new Promise(r=>{timer=setTimeout(()=>r(null),5000);})]).finally(()=>clearTimeout(timer));if(!end){browser.kill('SIGKILL');await done;throw Error('Browser close deadline');}assert.equal(end.code,0);}
 if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}for(const dir of [profile,stage])if(dir)await fs.promises.rm(dir,{recursive:true,force:true,maxRetries:3,retryDelay:100});
 }catch(e){result.status='FAIL';result.teardown=e.stack;process.exitCode=1;}
 fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));}})();
