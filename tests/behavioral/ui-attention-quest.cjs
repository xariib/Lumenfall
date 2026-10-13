'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {spawn}=require('node:child_process');
const {serve}=require('../../scripts/lib/static-server.cjs');
const {findChrome}=require('../../scripts/lib/browser.cjs');
const root=path.resolve(__dirname,'../..'),args=process.argv.slice(2),sourcePath=path.resolve(args[0]||'index.html');
const selected=args.includes('--quest-only')?'quest':args.includes('--ascend-only')?'ascend':'both';
let source=fs.readFileSync(sourcePath,'utf8');
const mutation=args.includes('--mutate-attention')?'attention':args.includes('--mutate-quest-focus')?'quest-focus':null;
if(mutation){
 const anchor=mutation==='attention' ? "ascendTab.classList.toggle('has-attention',eligible && !ascendAttentionAcknowledged)" : "var claimSlot=previousQuest && (document.activeElement.hasAttribute('data-quest-claim') || document.activeElement.classList.contains('quest-name')) ? Number(previousQuest.getAttribute('data-quest-slot')) : -1;";
 const replacement=mutation==='attention' ? "ascendTab.classList.toggle('has-attention',eligible)" : 'var claimSlot=-1;';
 assert.equal(source.split(anchor).length,2,'one actual causal mutation anchor');source=source.replace(anchor,replacement);
}
const sourceSha256=crypto.createHash('sha256').update(source).digest('hex');
let html=source.replace('<head>','<head><script>window.uiRegressionErrors=[];addEventListener("error",e=>uiRegressionErrors.push(e.message));addEventListener("unhandledrejection",e=>uiRegressionErrors.push(String(e.reason)));const normalInterval=window.setInterval;window.setInterval=(fn,ms)=>normalInterval(()=>{},ms);</script>');
const marker="if(document.readyState==='loading'){";assert.equal(html.split(marker).length,2,'unique production bridge anchor');
html=html.replace(marker,`window.uiRegression={ready:()=>!!els.toast,setup:function(restStop){var s=freshState();s.questDay=todayStr();s.lastSeen=Date.now();s.depth=33;s.maxDepthEver=250;s.questIds=QUEST_POOL.slice(0,3).map(q=>q.id);s.dailyStats={};QUEST_POOL.slice(0,3).forEach(q=>s.dailyStats[q.metric]=q.goal);if(restStop){s.owned.autoascend=true;s.legacyCometPurchases={offline24:true,offline48:true,rememberbulk:true};}state=acceptPersistedState(s);restoreEnemyOrSpawn();renderAll();return {ids:state.questIds,rewards:QUEST_POOL.slice(0,3).map(q=>q.reward)};},get:()=>JSON.parse(JSON.stringify(state)),daily:()=>renderDaily(true),summary:renderAscendSummary,setDepth:function(depth){state.depth=depth;state.enemyDepth=depth;restoreEnemyOrSpawn();renderAscendSummary();}};`+marker);
let browser,server,profile,stage,session,seq=0,buffer='',closed=false,checks=0;const pending=new Map(),records=[];
function check(value,message){checks++;assert(value,message);}
function send(method,params={},sid=session){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP deadline '+method));},15000);pending.set(id,{resolve,reject,timer});browser.stdio[3].write(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})})+'\0');});}
async function ev(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function tap(selector){const r=await ev(`(()=>{var e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center'});var r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[r]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(60);}
async function key(){await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',windowsVirtualKeyCode:13});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await pause(30);}
async function run(){
 stage=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-ui-regressions-'));fs.writeFileSync(path.join(stage,'index.html'),html);for(const dir of ['fonts','branding'])fs.cpSync(path.join(root,dir),path.join(stage,dir),{recursive:true});server=await serve(stage);
 profile=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-ui-regression-browser-'));browser=spawn(findChrome(),['--headless=new','--no-sandbox','--disable-gpu','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
 browser.stderr.on('data',()=>{});browser.on('close',()=>{closed=true;for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('browser closed'));}pending.clear();});browser.on('error',e=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(e);}pending.clear();});
 browser.stdio[4].on('data',b=>{buffer+=b;let end;while((end=buffer.indexOf('\0'))>=0){const raw=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!raw)continue;const m=JSON.parse(raw),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}});for(const n of [3,4])browser.stdio[n].on('error',()=>{});
 const version=await send('Browser.getVersion',{},null);const target=await send('Target.createTarget',{url:'about:blank'},null);session=(await send('Target.attachToTarget',{targetId:target.targetId,flatten:true},null)).sessionId;await send('Page.enable');await send('Emulation.setTouchEmulationEnabled',{enabled:true});await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});
 let ready=false;for(let i=0;i<200;i++){try{ready=await ev('!!window.uiRegression && uiRegression.ready()');}catch{}if(ready)break;await pause(25);}check(ready,'actual application ready');await ev('document.fonts.ready');await ev('if(window.startupIntroFinish)startupIntroFinish()');await ev('document.getElementById("startup-skip").click()');await pause(500);
 for(const width of [320,390,430])for(const scale of [1,2])for(const motion of ['no-preference','reduce']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});await ev(`document.documentElement.style.fontSize='${16*scale}px';uiRegression.setDepth(1);uiRegression.setup();`);
  if(selected!=='quest'){
   await tap('[data-tab="battle"]');await ev('uiRegression.summary()');check(await ev('document.querySelector("[data-tab=ascend]").classList.contains("has-attention")'),'unread eligible Ascend notifies');
   const before=await ev('uiRegression.get()');await tap('[data-tab="ascend"]');check(await ev('!document.querySelector("[data-tab=ascend]").classList.contains("has-attention")'),'entering Ascend clears notification');await ev('uiRegression.summary()');check(await ev('!document.querySelector("[data-tab=ascend]").classList.contains("has-attention")'),'periodic Ascend render retains acknowledgement');await tap('[data-tab="battle"]');await ev('uiRegression.summary()');check(await ev('!document.querySelector("[data-tab=ascend]").classList.contains("has-attention")'),'leaving Ascend does not restore read notification');assert.deepEqual(await ev('uiRegression.get()'),before,'notification acknowledgement preserves complete save');
   await ev('uiRegression.setDepth(1);uiRegression.setDepth(33)');check(await ev('document.querySelector("[data-tab=ascend]").classList.contains("has-attention")'),'new eligibility after reset notifies again');
  }
  if(selected!=='ascend')for(const restStop of [false,true])for(const input of ['touch','keyboard']){
   const config=await ev('uiRegression.setup('+restStop+')');await tap('[data-tab="deeds"]');await pause(240);
   for(let slot=0;slot<3;slot++){
    const sel='[data-quest-slot="'+slot+'"] [data-quest-claim]';await ev(`(()=>{var e=document.querySelector(${JSON.stringify(sel)});e.scrollIntoView({block:'center'});e.focus({preventScroll:true});})()`);await pause(40);
    const before=await ev('({scroll:document.querySelector("main").scrollTop,state:uiRegression.get()})');
    if(input==='touch'){const rect=await ev(`(()=>{var r=document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[rect]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(60);}else await key();
    const after=await ev('({scroll:document.querySelector("main").scrollTop,state:uiRegression.get(),slot:document.activeElement.closest("[data-quest-slot]")?.dataset.questSlot,claimed:document.activeElement.closest("[data-quest-slot]")?.querySelector("[data-quest-claim]").disabled})');
    check(Math.abs(after.scroll-before.scroll)<=1,'claim keeps exact scroll position '+width+'/'+scale+'/'+input+'/'+slot);check(after.slot===String(slot),'claim keeps focus in original quest row');check(after.claimed,'claimed control remains disabled');check(after.state.comets===before.state.comets+(config.rewards[slot].comets||0),'one exact Comet quest award');check(after.state.prisms===before.state.prisms+(config.rewards[slot].prisms||0),'one exact Prism quest award');
    const {questClaimed:oldClaims,comets:oldComets,prisms:oldPrisms,...protectedBefore}=before.state;
    const {questClaimed:newClaims,comets:newComets,prisms:newPrisms,...protectedAfter}=after.state;
    assert.deepEqual(protectedAfter,protectedBefore,'quest claim preserves all other save/paid-value fields');
    assert.deepEqual(newClaims,{...oldClaims,[config.ids[slot]]:true},'only the requested quest becomes claimed');
    await key();await ev('uiRegression.daily()');const repeat=await ev('({scroll:document.querySelector("main").scrollTop,state:uiRegression.get(),slot:document.activeElement.closest("[data-quest-slot]")?.dataset.questSlot})');check(repeat.slot===String(slot),'periodic quest rendering retains same-row focus');check(Math.abs(repeat.scroll-after.scroll)<=1,'periodic quest rendering keeps scroll position');assert.deepEqual(repeat.state,after.state,'repeated Enter never claims next quest');
   }
  }
  check((await ev('uiRegressionErrors')).length===0,'no actual browser runtime errors');records.push({width,scale,motion});
 }
 return {status:'PASS',sourceSha256,mutation,checks,profiles:records,version};
}
(async()=>{let result;try{result=await run();}catch(e){result={status:'FAIL',sourceSha256,mutation,checks,profiles:records,error:e.stack};process.exitCode=1;}finally{
 try{if(browser&&!closed){const completion=new Promise(r=>browser.once('close',(code,signal)=>r({code,signal})));await send('Browser.close',{},null).catch(()=>{});let timer;const exit=await Promise.race([completion,new Promise(r=>{timer=setTimeout(()=>r(null),5000);})]).finally(()=>clearTimeout(timer));if(!exit){browser.kill();await completion;throw Error('Browser close deadline');}assert.equal(exit.code,0);}if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}for(const dir of [profile,stage])if(dir)await fs.promises.rm(dir,{recursive:true,force:true,maxRetries:3,retryDelay:100});}catch(e){result.status='FAIL';result.teardown=e.stack;process.exitCode=1;}}
 console.log(JSON.stringify(result));})();
