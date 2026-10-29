'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {spawn}=require('node:child_process');
const {serve}=require('../../scripts/lib/static-server.cjs');
const {findChrome}=require('../../scripts/lib/browser.cjs');
const root=path.resolve(__dirname,'../..'),args=process.argv.slice(2),sourcePath=path.resolve(args[0]||'index.html');
let source=fs.readFileSync(sourcePath,'utf8');
const mutation=args.includes('--mutate-attention')?'capacity-only':args.includes('--mutate-refresh')?'stale-wallet':null;
if(mutation){const anchor=mutation==='capacity-only'?'badge.hidden=!canStart;':'lastAffordabilityAt = now;\n  renderLabCapacityBadge();';assert.equal(source.split(anchor).length,2);source=source.replace(anchor,mutation==='capacity-only'?'badge.hidden=free===0;':'lastAffordabilityAt = now;');}
const sourceSha256=crypto.createHash('sha256').update(source).digest('hex');
let html=source.replace('<head>','<head><script>window.uiRegressionErrors=[];addEventListener("error",e=>uiRegressionErrors.push(e.message));addEventListener("unhandledrejection",e=>uiRegressionErrors.push(String(e.reason)));const normalInterval=window.setInterval;window.setInterval=(fn,ms)=>normalInterval(()=>{},ms);</script>');
const marker="if(document.readyState==='loading'){";assert.equal(html.split(marker).length,2,'unique production bridge anchor');
html=html.replace(marker,`window.uiRegression={ready:()=>!!els.toast,fresh:freshState,defs:()=>LONG_STUDIES,slots:studySlotCount,plan:id=>getStudyStartPlan(LONG_STUDIES.find(n=>n.id===id)),set:function(s){state=acceptPersistedState(s);renderAll();},get:()=>JSON.parse(JSON.stringify(state)),badge:renderLabCapacityBadge,wallet:function(lumen,shards){state.lumen=lumen;state.shards=shards;lastAffordabilityAt=0;checkAffordability();},queue:function(){simulationStartQueuedStudies(simulationSummary(0));updateBattleFast();},start:id=>startStudy(LONG_STUDIES.find(n=>n.id===id)),finish:function(){advanceActiveStudies(1e9);renderAll();},saves:()=>[localStorage.getItem(SAVE_KEY),localStorage.getItem(RECOVERY_SAVE_KEY)]};`+marker);
html=require('./fixture-live-clock.cjs')(html,null,true);
let browser,server,profile,stage,session,seq=0,buffer='',closed=false,checks=0;const pending=new Map(),records=[];
function check(value,message){checks++;assert(value,message);}
function send(method,params={},sid=session){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP deadline '+method));},15000);pending.set(id,{resolve,reject,timer});browser.stdio[3].write(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})})+'\0');});}
async function ev(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function run(){
 stage=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-ui-regressions-'));fs.writeFileSync(path.join(stage,'index.html'),html);for(const dir of ['fonts','branding'])fs.cpSync(path.join(root,dir),path.join(stage,dir),{recursive:true});server=await serve(stage);
 profile=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-ui-regression-browser-'));browser=spawn(findChrome(),['--headless=new','--no-sandbox','--disable-gpu','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
 browser.stderr.on('data',()=>{});browser.on('close',()=>{closed=true;for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('browser closed'));}pending.clear();});browser.on('error',e=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(e);}pending.clear();});
 browser.stdio[4].on('data',b=>{buffer+=b;let end;while((end=buffer.indexOf('\0'))>=0){const raw=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!raw)continue;const m=JSON.parse(raw),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}});for(const n of [3,4])browser.stdio[n].on('error',()=>{});
 const version=await send('Browser.getVersion',{},null);const target=await send('Target.createTarget',{url:'about:blank'},null);session=(await send('Target.attachToTarget',{targetId:target.targetId,flatten:true},null)).sessionId;await send('Page.enable');await send('Emulation.setTouchEmulationEnabled',{enabled:true});await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});
 let ready=false;for(let i=0;i<200;i++){try{ready=await ev('!!window.uiRegression && uiRegression.ready()');}catch{}if(ready)break;await pause(25);}check(ready,'actual application ready');await ev('document.fonts.ready');await ev('if(window.startupIntroFinish)startupIntroFinish()');await ev('document.getElementById("startup-skip").click()');await pause(500);

 const defs=await ev('uiRegression.defs()'),fresh=await ev('uiRegression.fresh()');
 const seed=()=>({...JSON.parse(JSON.stringify(fresh)),maxDepthEver:250,questDay:new Date().toISOString().slice(0,10),lastSeen:Date.now(),lumen:0,shards:0});
 async function badge(expected,label){
  const before=await ev('({state:uiRegression.get(),saves:uiRegression.saves()})');
  const result=await ev('({badges:["lab-capacity-badge","workshop-lab-badge"].map(id=>({hidden:document.getElementById(id).hidden,text:document.getElementById(id).textContent})),free:Math.max(0,uiRegression.slots()-uiRegression.get().activeStudies.length),focus:document.activeElement.id})');
  for(const b of result.badges){check(b.hidden===!expected,label+' notification');check(b.text===String(result.free),label+' exact capacity');}
  await ev('uiRegression.badge();uiRegression.badge()');
  assert.deepEqual(await ev('({state:uiRegression.get(),saves:uiRegression.saves()})'),before,label+' observational purity');
  records.push({label,expected,...result});
 }
 async function install(s){await ev('uiRegression.set('+JSON.stringify(s)+')');}
 for(const width of [320,430]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});
  await install(seed());await badge(false,'no money '+width);
  let s=seed();s.maxDepthEver=15;await install(s);
  await ev('uiRegression.wallet(599,40)');await badge(false,'Lumen one short');
  await ev('uiRegression.wallet(600,39)');await badge(false,'Shards one short');
  await ev('uiRegression.wallet(600,40)');await badge(true,'exact cheapest price');
  await ev('document.getElementById("nav-workshop").focus();uiRegression.wallet(0,0)');await badge(false,'money lost on affordability refresh');check(await ev('document.activeElement.id==="nav-workshop"'),'refresh preserves focus');
  await ev('uiRegression.wallet(600,40)');await badge(true,'money restored');
  check(await ev('uiRegression.start("guardmastery")'),'real start succeeds');await badge(false,'paid start spends exact money');
  await ev('uiRegression.wallet(600,40)');await badge(false,'active project cannot start twice');
  await ev('uiRegression.wallet(800,80)');check(await ev('uiRegression.start("wispascend")'),'second start fills slots');await ev('uiRegression.wallet(1000000,1000000)');await badge(false,'all slots full');
  await ev('uiRegression.finish()');await badge(true,'completion opens capacity');
  s=seed();s.maxDepthEver=1;s.lumen=1e9;s.shards=1e9;s.longStudyLevels.wispascend=500;s.longStudyLevels.guardmastery=500;await install(s);await badge(true,'new basic damage remains available after old foundations max');
  s.longStudyLevels.wispdamage=100;await install(s);check(await ev('uiRegression.plan("labcapacity").reason==="locked"'),'locked project start denied');await badge(false,'rich wallet only locked projects affordable');
  s=seed();s.lumen=1e9;s.shards=1e9;for(const d of defs)s.longStudyLevels[d.id]=d.levelCap===undefined?100:d.levelCap;await install(s);check(await ev('uiRegression.plan("labcapacity").reason==="maxed"'),'capped project start denied');await badge(false,'capped catalog and unaffordable legacy');
  s=seed();s.lumen=1e9;s.shards=1e9;await install(s);const slots=await ev('uiRegression.slots()');
  s.activeStudies=defs.filter(d=>!d.retiredTo&&d.id!=='labcapacity').slice(0,slots).map(d=>({id:d.id,remainingSec:100,totalDurationSec:100,speedMult:1}));await install(s);await badge(false,'full base capacity');
  s.longStudyLevels.labcapacity=1;await install(s);await badge(true,'earned capacity increases');s.longStudyLevels.labcapacity=0;await install(s);await badge(false,'capacity decreases');
  s=seed();s.maxDepthEver=1;s.studyQueue.guardmastery=true;await install(s);await badge(false,'unaffordable queued work');
  await ev('uiRegression.wallet(600,40)');await badge(true,'affordable queued work before scheduler');
  await ev('uiRegression.queue()');check(await ev('uiRegression.get().activeStudies[0].id==="guardmastery"&&uiRegression.get().lumen===0&&uiRegression.get().shards===0'),'scheduler starts queued project once at existing price');await badge(false,'queue consumes capacity');
  s=seed();s.maxDepthEver=1;s.studyQueue.guardmastery=true;s.lumen=600;s.shards=40;s.longStudyLevels.labcapacity=1;await install(s);await ev('uiRegression.queue()');await badge(false,'queue leaves empty slots but no affordable project');
 }
 check((await ev('uiRegressionErrors')).length===0,'no actual browser runtime errors');
 return {status:'pass',sourceSha256,mutation,checks,profiles:records,version};
}
(async()=>{let result;try{result=await run();}catch(e){result={status:'fail',sourceSha256,mutation,checks,profiles:records,error:e.stack};process.exitCode=1;}finally{
 try{if(browser&&!closed){const completion=new Promise(r=>browser.once('close',(code,signal)=>r({code,signal})));await send('Browser.close',{},null).catch(()=>{});let timer;const exit=await Promise.race([completion,new Promise(r=>{timer=setTimeout(()=>r(null),5000);})]).finally(()=>clearTimeout(timer));if(!exit){browser.kill();await completion;throw Error('Browser close deadline');}assert.equal(exit.code,0);}if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}for(const dir of [profile,stage])if(dir)await fs.promises.rm(dir,{recursive:true,force:true,maxRetries:3,retryDelay:100});}catch(e){result.status='fail';result.teardown=e.stack;process.exitCode=1;}}
 console.log(JSON.stringify(result));})();
