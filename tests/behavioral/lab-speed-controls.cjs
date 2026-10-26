'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {spawn}=require('node:child_process');
const {serve}=require('../../scripts/lib/static-server.cjs');
const {findChrome}=require('../../scripts/lib/browser.cjs');
const root=path.resolve(__dirname,'../..'),args=process.argv.slice(2),sourcePath=path.resolve(args[0]||'index.html');
let source=fs.readFileSync(sourcePath,'utf8');
const mutation=args.includes('--mutate-selection')?'selection-pays':args.includes('--mutate-select')?'detached-slider':null;
if(mutation){const anchor=mutation==='selection-pays'?"state.studySpeedTargets[id]=LAB_SPEED_TIERS[index];":"  replaceStudyMarkup(html);";assert.equal(source.split(anchor).length,2);source=source.replace(anchor,mutation==='selection-pays'?anchor+"applySpeedTier(id,LAB_SPEED_TIERS[index]);":"  replaceControlMarkup(els['study-list'],html);");}
const sourceSha256=crypto.createHash('sha256').update(source).digest('hex');
let html=source.replace('<head>','<head><script>window.uiRegressionErrors=[];addEventListener("error",e=>uiRegressionErrors.push(e.message));addEventListener("unhandledrejection",e=>uiRegressionErrors.push(String(e.reason)));window.uiRegressionPaused=true;const normalInterval=window.setInterval;window.setInterval=(fn,ms)=>normalInterval(()=>{if(!window.uiRegressionPaused)fn();},ms);</script>');
const marker="if(document.readyState==='loading'){";assert.equal(html.split(marker).length,2,'unique production bridge anchor');
html=html.replace(marker,`window.uiRegression={ready:()=>!!els.toast,fresh:freshState,defs:()=>LONG_STUDIES,slots:studySlotCount,plan:id=>getStudyStartPlan(LONG_STUDIES.find(n=>n.id===id)),set:function(s){state=acceptPersistedState(s);renderAll();},get:()=>JSON.parse(JSON.stringify(state)),badge:renderLabCapacityBadge,wallet:function(lumen,shards){state.lumen=lumen;state.shards=shards;lastAffordabilityAt=0;checkAffordability();},queue:function(){simulationStartQueuedStudies(simulationSummary(0));updateBattleFast();},start:id=>startStudy(LONG_STUDIES.find(n=>n.id===id)),finish:function(){advanceActiveStudies(1e9);renderAll();},saves:()=>[localStorage.getItem(SAVE_KEY),localStorage.getItem(RECOVERY_SAVE_KEY)],render:renderLongStudies,fund:function(n){state.motes=n;lastAffordabilityAt=0;checkAffordability();},expire:function(){var b=state.studyBoosts.slot0;b.startedAtMs=Date.now()-28800001;b.expiresAtMs=b.startedAtMs+28800000;els['study-list'].querySelectorAll('[data-study-boost-status=guardmastery]').forEach(function(e){e.setAttribute('data-study-boost-time',b.expiresAtMs);});updateStudyProgress();},speed:applySpeedTier,prices:()=>LAB_SPEED_TIERS.map(speedTierCost),speeds:function(){simulationBuyStudySpeeds(simulationSummary(0),0);renderLongStudies();},save:saveState,load:function(){state=loadState();renderAll();}};`+marker);
let browser,server,profile,stage,session,seq=0,buffer='',closed=false,checks=0;const pending=new Map(),records=[];
function check(value,message){checks++;assert(value,message);}
function send(method,params={},sid=session){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP deadline '+method));},15000);pending.set(id,{resolve,reject,timer});browser.stdio[3].write(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})})+'\0');});}
async function ev(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function run(){
 stage=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-ui-regressions-'));fs.writeFileSync(path.join(stage,'index.html'),html);for(const dir of ['fonts','branding'])fs.cpSync(path.join(root,dir),path.join(stage,dir),{recursive:true});server=await serve(stage);
 profile=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-ui-regression-browser-'));browser=spawn(findChrome(),['--headless=new','--no-sandbox','--disable-gpu','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
 browser.stderr.on('data',()=>{});browser.on('exit',()=>{closed=true;for(const n of [3,4])browser.stdio[n].destroy();for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('browser closed'));}pending.clear();});browser.on('error',e=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(e);}pending.clear();});
 browser.stdio[4].on('data',b=>{buffer+=b;let end;while((end=buffer.indexOf('\0'))>=0){const raw=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!raw)continue;const m=JSON.parse(raw),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}});for(const n of [3,4])browser.stdio[n].on('error',()=>{});
 const version=await send('Browser.getVersion',{},null);const target=await send('Target.createTarget',{url:'about:blank'},null);session=(await send('Target.attachToTarget',{targetId:target.targetId,flatten:true},null)).sessionId;await send('Page.enable');await send('Emulation.setTouchEmulationEnabled',{enabled:true});await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});
 let ready=false;for(let i=0;i<200;i++){try{ready=await ev('!!window.uiRegression && uiRegression.ready()');}catch{}if(ready)break;await pause(25);}check(ready,'actual application ready');await ev('document.fonts.ready');await ev('if(window.startupIntroFinish)startupIntroFinish()');await ev('document.getElementById("startup-skip").click()');await pause(500);


 await ev("(()=>{var s=uiRegression.fresh();s.maxDepthEver=250;s.motes=1000;s.questDay=new Date().toISOString().slice(0,10);s.activeStudies=[{id:'guardmastery',remainingSec:150,totalDurationSec:150,speedMult:1}];uiRegression.set(s);document.querySelector('[data-tab=research]').click();})()");
 if(args.includes('--baseline')){
 const o=await ev("({hidden:document.querySelector('[data-study-inspection=guardmastery]').hidden,queueVisible:!!document.querySelector('[data-study-use-motes=guardmastery]').getClientRects().length})");
 check(o.hidden&&!o.queueVisible,'baseline hides direct speed and queue choice behind disclosure');records.push(o);
 }else{
 await require('./lab-timed-ui.cjs')({send,ev,pause,check,records,args});
}
 check((await ev('uiRegressionErrors')).length===0,'no actual browser runtime errors');
 return {status:'pass',sourceSha256,mutation,checks,profiles:records,version};
}
(async()=>{let result;try{result=await run();}catch(e){result={status:'fail',sourceSha256,mutation,checks,profiles:records,error:e.stack};process.exitCode=1;}finally{
 try{if(browser&&!closed){const completion=new Promise(r=>browser.once('exit',(code,signal)=>r({code,signal})));await send('Browser.close',{},null).catch(()=>{});let timer;const exit=await Promise.race([completion,new Promise(r=>{timer=setTimeout(()=>r(null),5000);})]).finally(()=>clearTimeout(timer));if(!exit){browser.kill();throw Error('Browser close deadline');}assert.equal(exit.code,0);}if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}for(const dir of [profile,stage])if(dir)await fs.promises.rm(dir,{recursive:true,force:true,maxRetries:3,retryDelay:100});}catch(e){result.status='fail';result.teardown=e.stack;process.exitCode=1;}}
 console.log(JSON.stringify(result));})();
