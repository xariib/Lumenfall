'use strict';
// Real DOM, production CSS, native browser timers and committed live ticks.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {spawn}=require('node:child_process'),{serve}=require('../../scripts/lib/static-server.cjs'),{findChrome}=require('../../scripts/lib/browser.cjs');
const root=path.resolve(__dirname,'../..'),out=path.resolve(process.argv[2]||'/tmp/auto-ascend-feedback-mobile');
const source=fs.readFileSync(path.join(root,'index.html'),'utf8'),sourceSha256=crypto.createHash('sha256').update(source).digest('hex');
const marker="if(document.readyState==='loading'){";assert.equal(source.split(marker).length,2);
const bridge=`
window.ascendUiQa={show:showAscendFlash,present:presentLiveAscendResult,clear:clearAscendFeedback,
 ready:function(){return !!els.toast;},saved:function(){return JSON.stringify(state);},
 receipt:function(){return ascendFeedback && {gain:ascendFeedback.gain,count:ascendFeedback.count};},
 actualTick:function(){
  var s=freshState();s.lastSeen=Date.now();s.questDay=todayStr();s.depth=32;s.maxDepthEver=1000;
  s.owned.autoascend=true;s.autoAscendEnabled=true;s.autoAscendTargetDepth=31;s.nodes.echo=6;
  s.research.masterwork=500;s.research.formation=250;s.longStudyLevels.wispascend=500;
  s.heroRarity.ember=5;s.wispModules.ember=20;s.wispUltimate.ember=true;s.wispMastery.ember=250;
  state=acceptPersistedState(s);restoreEnemyOrSpawn();renderAll();
  var beforePrisms=state.prisms,beforeCount=state.ascendCount;tick();
  return {gain:Amount.exactSub(state.prisms,beforePrisms),count:Amount.exactSub(state.ascendCount,beforeCount),receipt:this.receipt()};
 }
};`;
const prelude='<script>window.ascendUiErrors=[];addEventListener("error",e=>ascendUiErrors.push(e.message));addEventListener("unhandledrejection",e=>ascendUiErrors.push(String(e.reason)));window.setInterval=function(){return 0;};</script>';
let browser,server,profile,stage,session,seq=0,buffer='',closed=false,stderr='',checks=0;
const pending=new Map(),records=[];
function ok(value,message){checks++;assert(value,message);}
function send(method,params={},sid=session){return new Promise((resolve,reject)=>{
 const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP deadline '+method));},15000);pending.set(id,{resolve,reject,timer});
 browser.stdio[3].write(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})})+'\0');
});}
async function ev(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function until(expression){for(let i=0;i<300;i++){if(await ev(expression))return;await pause(25);}throw Error('Not ready: '+expression);}
async function run(){
 fs.mkdirSync(out,{recursive:true});stage=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-ascend-ui-'));
 fs.writeFileSync(path.join(stage,'index.html'),source.replace('<head>','<head>'+prelude).replace(marker,bridge+marker));
 for(const dir of ['fonts','branding'])fs.cpSync(path.join(root,dir),path.join(stage,dir),{recursive:true});
 server=await serve(stage);profile=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-ascend-browser-'));
 browser=spawn(findChrome(),['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
 browser.stderr.on('data',b=>stderr=(stderr+b).slice(-2500));
 browser.on('close',()=>{closed=true;for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('browser closed'));}pending.clear();});
 browser.on('error',e=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(e);}pending.clear();});
 for(const i of [3,4])browser.stdio[i].on('error',()=>{});
 browser.stdio[4].on('data',b=>{buffer+=b;let end;while((end=buffer.indexOf('\0'))>=0){const raw=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!raw)continue;const m=JSON.parse(raw),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}});
 const version=await send('Browser.getVersion',{},null),target=await send('Target.createTarget',{url:'about:blank'},null);
 session=(await send('Target.attachToTarget',{targetId:target.targetId,flatten:true},null)).sessionId;
 await send('Page.enable');await send('Runtime.enable');await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});
 await until('!!window.ascendUiQa && ascendUiQa.ready()');
 await until('!document.documentElement.classList.contains("startup-pending") || typeof startupIntroFinish==="function" || typeof document.getElementById("startup-skip").onclick==="function"');
 await ev('document.getElementById("startup-skip").click()');
 await until('!document.documentElement.classList.contains("startup-pending")');await pause(500);await ev('document.fonts.ready');
 for(const width of [320,390,430])for(const scale of [1,2])for(const motion of ['no-preference','reduce']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});
  const before=await ev('ascendUiQa.saved()');
  await ev(`document.documentElement.style.fontSize='${16*scale}px';ascendUiQa.clear();ascendUiQa.show(11,true);window.firstAscendNode=document.querySelector('.ascend-flash');for(var i=0;i<50;i++)ascendUiQa.show(7,true,2);`);
  const stable=await ev(`(()=>{var e=document.querySelector('.ascend-flash'),c=getComputedStyle(e),r=e.getBoundingClientRect(),n=document.querySelector('nav.tabbar').getBoundingClientRect();return {same:e===firstAscendNode,nodes:document.querySelectorAll('.ascend-flash').length,opacity:c.opacity,filter:c.filter,animation:c.animationName,left:r.left,right:r.right,bottom:r.bottom,navTop:n.top,pointer:c.pointerEvents,scroll:document.documentElement.scrollWidth,width:innerWidth};})()`);
  ok(stable.same&&stable.nodes===1,'rapid real DOM updates retain one node');
  ok(stable.opacity==='1'&&stable.filter==='none'&&stable.animation==='none','auto reward is immediately readable without animated blur');
  ok(stable.left>=0&&stable.right<=width+1&&stable.bottom<=stable.navTop&&stable.scroll<=stable.width,'compact summary fits above navigation');
  ok(stable.pointer==='none','summary does not intercept purchases or navigation');
  await pause(1100);
  ok(await ev('document.querySelector(".ascend-flash strong").textContent==="+361 PRISMS" && document.querySelector(".ascend-flash small").textContent==="101 ascensions"'),'complete coalesced actual DOM text');
  assert.equal(await ev('ascendUiQa.saved()'),before,'mobile notification retains every save field');
  await ev('ascendUiQa.clear();ascendUiQa.show("1e400",true,"1e350")');
  const fit=await ev('(()=>{var e=document.querySelector(".ascend-flash");return e.scrollWidth<=e.clientWidth&&e.getBoundingClientRect().left>=0;})()');ok(fit,'wide amounts fit with enlarged text');
  if(width===390){const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,'auto-'+scale+'-'+motion+'.png'),Buffer.from(shot.data,'base64'));}
  await ev('ascendUiQa.clear();ascendUiQa.show(23,false);window.manualAscendNode=document.querySelector(".ascend-flash");ascendUiQa.show(7,true,2)');
  ok(await ev('document.querySelector(".ascend-flash")===manualAscendNode && manualAscendNode.querySelector("strong").textContent==="+23 PRISMS"'),'automatic receipts do not replace manual text');
  if(motion==='reduce')ok(await ev('getComputedStyle(manualAscendNode).animationName==="none"'),'manual reduced motion respected');
  records.push({width,scale,motion});
 }
 await ev('ascendUiQa.clear();ascendUiQa.show(23,false);ascendUiQa.show(7,true,2)');await pause(3100);
 ok(await ev('document.querySelector(".auto-ascend-summary strong").textContent==="+7 PRISMS"'),'real timer presents queued receipts after manual reading');
 await ev('ascendUiQa.clear()');const actual=await ev('ascendUiQa.actualTick()');
 ok(actual.count>1,'actual live tick commits multiple Ascensions');assert.deepEqual(actual.receipt,{gain:actual.gain,count:actual.count},'actual tick presents complete exact committed receipt');
 await ev('Object.defineProperty(document,"hidden",{configurable:true,value:true});document.dispatchEvent(new Event("visibilitychange"))');
 ok(await ev('!document.querySelector(".ascend-flash") && ascendUiQa.receipt()===null'),'real background handler clears live feedback');
 ok((await ev('ascendUiErrors')).length===0,'no browser runtime errors');
 return {status:'PASS',sourceSha256,checks,profiles:records,version,actual};
}
(async()=>{let result;try{result=await run();}catch(e){result={status:'FAIL',sourceSha256,checks,profiles:records,error:e.stack,stderr};process.exitCode=1;}finally{
 try{if(browser&&!closed){const done=new Promise(r=>browser.once('close',(code,signal)=>r({code,signal})));await send('Browser.close',{},null).catch(()=>{});let timer;const end=await Promise.race([done,new Promise(r=>{timer=setTimeout(()=>r(null),5000);})]).finally(()=>clearTimeout(timer));if(!end){browser.kill('SIGKILL');await done;throw Error('Browser close deadline');}assert.equal(end.code,0);}
 if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}for(const dir of [profile,stage])if(dir)await fs.promises.rm(dir,{recursive:true,force:true,maxRetries:3,retryDelay:100});
 }catch(e){result.status='FAIL';result.teardown=e.stack;process.exitCode=1;}
 fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));}})();
