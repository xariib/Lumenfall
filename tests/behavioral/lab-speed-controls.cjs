'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {spawn}=require('node:child_process');
const {serve}=require('../../scripts/lib/static-server.cjs');
const {findChrome}=require('../../scripts/lib/browser.cjs');
const root=path.resolve(__dirname,'../..'),args=process.argv.slice(2),sourcePath=path.resolve(args[0]||'index.html');
let source=fs.readFileSync(sourcePath,'utf8');
const mutation=args.includes('--mutate-selection')?'selection-pays':args.includes('--mutate-select')?'detached-select':null;
if(mutation){const anchor=mutation==='selection-pays'?"      state.studySpeedTargets[select.getAttribute('data-study-speed-target')]=target;":"  replaceStudyMarkup(html);";assert.equal(source.split(anchor).length,2);source=source.replace(anchor,mutation==='selection-pays'?anchor+"applySpeedTier(select.getAttribute('data-study-speed-target'),target);":"  replaceControlMarkup(els['study-list'],html);");}
const sourceSha256=crypto.createHash('sha256').update(source).digest('hex');
let html=source.replace('<head>','<head><script>window.uiRegressionErrors=[];addEventListener("error",e=>uiRegressionErrors.push(e.message));addEventListener("unhandledrejection",e=>uiRegressionErrors.push(String(e.reason)));const normalInterval=window.setInterval;window.setInterval=(fn,ms)=>normalInterval(()=>{},ms);</script>');
const marker="if(document.readyState==='loading'){";assert.equal(html.split(marker).length,2,'unique production bridge anchor');
html=html.replace(marker,`window.uiRegression={ready:()=>!!els.toast,fresh:freshState,defs:()=>LONG_STUDIES,slots:studySlotCount,plan:id=>getStudyStartPlan(LONG_STUDIES.find(n=>n.id===id)),set:function(s){state=acceptPersistedState(s);renderAll();},get:()=>JSON.parse(JSON.stringify(state)),badge:renderLabCapacityBadge,wallet:function(lumen,shards){state.lumen=lumen;state.shards=shards;lastAffordabilityAt=0;checkAffordability();},queue:function(){simulationStartQueuedStudies(simulationSummary(0));updateBattleFast();},start:id=>startStudy(LONG_STUDIES.find(n=>n.id===id)),finish:function(){advanceActiveStudies(1e9);renderAll();},saves:()=>[localStorage.getItem(SAVE_KEY),localStorage.getItem(RECOVERY_SAVE_KEY)],render:renderLongStudies,speed:applySpeedTier,prices:()=>LAB_SPEED_TIERS.map(speedTierCost),speeds:function(){simulationBuyStudySpeeds(simulationSummary(0),0);renderLongStudies();},save:saveState,load:function(){state=loadState();renderAll();}};`+marker);
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


 await ev("(()=>{var s=uiRegression.fresh();s.maxDepthEver=250;s.motes=1000;s.questDay=new Date().toISOString().slice(0,10);s.activeStudies=[{id:'guardmastery',remainingSec:150,totalDurationSec:150,speedMult:1}];uiRegression.set(s);document.querySelector('[data-tab=research]').click();})()");
 if(args.includes('--baseline')){
 const o=await ev("({hidden:document.querySelector('[data-study-inspection=guardmastery]').hidden,queueVisible:!!document.querySelector('[data-study-use-motes=guardmastery]').getClientRects().length})");
 check(o.hidden&&!o.queueVisible,'baseline hides direct speed and queue choice behind disclosure');records.push(o);
 }else{
 const fresh=await ev('uiRegression.fresh()');
 const seed=(motes=1000)=>({...JSON.parse(JSON.stringify(fresh)),maxDepthEver:250,questDay:new Date().toISOString().slice(0,10),motes,lumen:1e9,shards:1e9,activeStudies:[{id:'guardmastery',remainingSec:150,totalDurationSec:150,speedMult:1}]});
 async function install(s){await ev('uiRegression.set('+JSON.stringify(s)+');document.querySelector("[data-tab=research]").click()');await ev('Promise.all(document.getElementById("tab-research").getAnimations().map(a=>a.finished)).then(()=>true)');}
 const q=(attr)=>'document.querySelector('+JSON.stringify('['+attr+'=guardmastery]')+')';
 const select=q('data-study-speed-target'),buy=q('data-speed-study'),toggle=q('data-study-use-motes');
 async function choose(tier){await ev(select+'.value="'+tier+'";'+select+'.dispatchEvent(new Event("change",{bubbles:true}))');}
 async function key(name){const code=name==='Space'?32:name==='ArrowDown'?40:13;await send('Input.dispatchKeyEvent',{type:name==='Enter'?'keyDown':'rawKeyDown',key:name==='Space'?' ':name,code:name,windowsVirtualKeyCode:code,...(name==='Enter'?{text:'\r'}:{})});await send('Input.dispatchKeyEvent',{type:'keyUp',key:name==='Space'?' ':name,code:name,windowsVirtualKeyCode:code});}
 async function touch(expression){await ev(expression+'.scrollIntoView({block:"center"})');await pause(30);const p=await ev('(()=>{var r='+expression+'.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()');await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
 await send('Runtime.enable');await send('DOM.enable');
 for(const width of [320,390,430])for(const scale of [100,200])for(const motion of ['reduce','no-preference']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});await ev('document.documentElement.style.fontSize="'+scale+'%"');
  await install(seed());
  check(await ev(select+'.getClientRects().length>0 && '+toggle+'.getClientRects().length>0 && !document.querySelector("[data-study-details]")'),'inline speed and queue visible without disclosure');
  check(await ev('(()=>{var r=document.querySelector("[data-running-study=guardmastery]"),bad=[];r.querySelectorAll("button,select,.effect-note").forEach(e=>{var b=e.getBoundingClientRect();if(b.left<0||b.right>innerWidth+1||e.scrollWidth>e.clientWidth+1)bad.push(e.outerHTML);if(e.matches("button,select")&&(b.width<44||b.height<44))bad.push(e.outerHTML)});return !bad.length&&document.documentElement.scrollWidth<=innerWidth+1;})()'),'fit and 44px targets '+JSON.stringify({width,scale,motion}));
  const prices=[1.5,2,3,4,5,6,7,8].map(t=>Math.round(6*Math.pow(t,2.1)));
  const actualPrices=await ev('uiRegression.prices()');
  check(JSON.stringify(actualPrices)===JSON.stringify(prices),'all original tier prices');
  for(const tier of [1.5,2,3,4,5,6,7,8]){
   const cost=actualPrices[[1.5,2,3,4,5,6,7,8].indexOf(tier)];
   await install(seed(cost-1));await choose(tier);check(await ev(buy+'.disabled && '+buy+'.textContent.includes("'+cost+'")'),'one-short disabled and priced '+tier);
   await install(seed(cost));await ev(select+'.focus({preventScroll:true});window.originalSelect='+select);await choose(tier);
   check(await ev('uiRegression.get().motes==='+cost+'&&uiRegression.get().activeStudies[0].speedMult===1'),'selection does not buy '+tier);
   check(await ev(select+'===originalSelect&&document.activeElement===originalSelect'),'native select attached through selection render');
   await ev(select+'.scrollIntoView({block:"center"});window.beforeScroll=document.querySelector("main").scrollTop;uiRegression.render();uiRegression.render()');
   check(await ev(select+'===originalSelect&&document.activeElement===originalSelect&&Math.abs(document.querySelector("main").scrollTop-beforeScroll)<=1'),'select and scroll survive refresh');
   await ev(buy+'.focus({preventScroll:true});window.oldBuy='+buy+';oldBuy.click();oldBuy.click();'+buy+'.click()');
   check(await ev('uiRegression.get().motes===0&&uiRegression.get().activeStudies[0].speedMult==='+tier+'&&uiRegression.get().activeStudies[0].remainingSec===150'),'single exact payment, unchanged work and no double spend '+tier);
   check(await ev('document.activeElement==='+select+'&&'+buy+'.disabled'),'same-card usable focus after purchase');
   check(await ev('Math.abs(document.querySelector("main").scrollTop-beforeScroll)<=1'),'purchase keeps scroll');
  }
  await install(seed(1000));await choose(3);await ev('window.repeatBuy='+buy+';repeatBuy.click();repeatBuy.click();'+buy+'.click()');check(await ev('uiRegression.get().motes===940&&uiRegression.get().activeStudies[0].speedMult===3'),'rich repeated input cannot double charge');
  await install(seed(1000));await ev(select+'.scrollIntoView({block:"center"});'+select+'.focus()');await key('ArrowDown');check(await ev(select+'.value==="2"&&uiRegression.get().studySpeedTargets.guardmastery===2&&uiRegression.get().motes===1000'),'native keyboard selector saves without buying');
  await ev(buy+'.focus()');await key('Enter');check(await ev('uiRegression.get().activeStudies[0].speedMult===2&&uiRegression.get().motes===974'),'native Enter explicit purchase');
  await choose(3);await touch(buy);check(await ev('uiRegression.get().activeStudies[0].speedMult===3&&uiRegression.get().motes===914'),'native touch purchase');
  await ev(toggle+'.focus()');await key('Space');check(await ev('uiRegression.get().studyUseMotes.guardmastery&&'+toggle+'.getAttribute("aria-pressed")==="true"&&!uiRegression.get().studyQueue.guardmastery'),'native speed queue independent of Study Queue');
  await ev(toggle+'.focus()');await key('Space');await choose(2);check(await ev('!uiRegression.get().studyUseMotes.guardmastery&&uiRegression.get().activeStudies[0].speedMult===3'),'OFF and lower target preserve paid speed');
  await install(seed(0));await choose(3);await touch(toggle);await ev('uiRegression.speeds()');check(await ev('uiRegression.get().motes===0&&uiRegression.get().activeStudies[0].speedMult===1'),'queued unaffordable waits');
  await ev('var funded=uiRegression.get();funded.motes=60;uiRegression.set(funded);'+select+'.focus();uiRegression.speeds();uiRegression.speeds()');check(await ev('uiRegression.get().motes===0&&uiRegression.get().activeStudies[0].speedMult===3&&document.activeElement==='+select),'queue purchases once and retains select focus');
  await ev('uiRegression.save();uiRegression.load()');check(await ev('uiRegression.get().studyUseMotes.guardmastery&&uiRegression.get().studySpeedTargets.guardmastery===3&&uiRegression.get().activeStudies[0].speedMult===3'),'actual save/load queued intent and paid speed');
  await ev(select+'.focus();uiRegression.finish()');check(await ev('!uiRegression.get().activeStudies.length&&document.activeElement==='+select+'&&'+buy+'.disabled'),'completion restores same Study selector and prevents idle purchase');
  const s=seed();s.activeStudies=[];await install(s);await ev('document.querySelector("[data-study=guardmastery]").focus();document.querySelector("[data-study=guardmastery]").click()');check(await ev('uiRegression.get().activeStudies[0].id==="guardmastery"&&document.activeElement==='+select),'begin restores same-card speed focus');
  await ev(select+'.focus();window.originalSelect='+select+';document.querySelector("[data-study-queue=guardmastery]").click();uiRegression.render();uiRegression.render();'+toggle+'.click()');check(await ev('uiRegression.get().studyQueue.guardmastery&&uiRegression.get().studyUseMotes.guardmastery'),'retained row handlers toggle only once');
  await install(seed(1000));await choose(3);await ev(toggle+'.click();'+select+'.focus()');await choose(4);await ev('uiRegression.speeds()');check(await ev('uiRegression.get().activeStudies[0].speedMult===4&&uiRegression.get().motes===890'),'ON target change buys exact new full price');
  const discounted=seed(1000);discounted.longStudyLevels.catalysis=10;await install(discounted);await choose(3);check(await ev(buy+'.textContent.includes("48")&&'+select+'.selectedOptions[0].textContent.includes("48")'),'earned Catalysis discount visible in action and selected option');await ev(buy+'.click()');check(await ev('uiRegression.get().motes===952&&uiRegression.get().activeStudies[0].speedMult===3'),'earned discount charged unchanged');
  await ev(select+'.scrollIntoView({block:"center"})');
  if(process.env.LUMENFALL_QA_EVIDENCE_DIR){fs.mkdirSync(process.env.LUMENFALL_QA_EVIDENCE_DIR,{recursive:true});const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(process.env.LUMENFALL_QA_EVIDENCE_DIR,'lab-'+width+'-'+scale+'-'+motion+'.png'),Buffer.from(shot.data,'base64'));}
  records.push({width,scale,motion});
 }
}
 check((await ev('uiRegressionErrors')).length===0,'no actual browser runtime errors');
 return {status:'pass',sourceSha256,mutation,checks,profiles:records,version};
}
(async()=>{let result;try{result=await run();}catch(e){result={status:'fail',sourceSha256,mutation,checks,profiles:records,error:e.stack};process.exitCode=1;}finally{
 try{if(browser&&!closed){const completion=new Promise(r=>browser.once('close',(code,signal)=>r({code,signal})));await send('Browser.close',{},null).catch(()=>{});let timer;const exit=await Promise.race([completion,new Promise(r=>{timer=setTimeout(()=>r(null),5000);})]).finally(()=>clearTimeout(timer));if(!exit){browser.kill();await completion;throw Error('Browser close deadline');}assert.equal(exit.code,0);}if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}for(const dir of [profile,stage])if(dir)await fs.promises.rm(dir,{recursive:true,force:true,maxRetries:3,retryDelay:100});}catch(e){result.status='fail';result.teardown=e.stack;process.exitCode=1;}}
 console.log(JSON.stringify(result));})();
