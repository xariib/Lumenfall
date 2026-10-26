'use strict';
// Native input on the complete game. Prices/selection must never spend until
// activation; each profile covers both an unaffordable and an exact quote.
module.exports=async function({send,ev,pause,check,records,args}){
 const fs=require('node:fs'),path=require('node:path');
 const fresh=await ev('uiRegression.fresh()');
 const tiers=[1.5,2,3,4,5,6,7,8],prices=[800,1500,3500,6500,10000,15000,20500,27500];
 const seed=(motes=100000)=>({...JSON.parse(JSON.stringify(fresh)),maxDepthEver:250,questDay:new Date().toISOString().slice(0,10),motes,lumen:1e12,shards:1e12,activeStudies:[{id:'guardmastery',remainingSec:150,totalDurationSec:150,speedMult:1}]});
 async function install(s){await ev('uiRegression.set('+JSON.stringify(s)+');document.querySelector("[data-tab=research]").click()');await ev('Promise.all(document.getElementById("tab-research").getAnimations().map(a=>a.finished)).then(()=>true)');}
 const q=attr=>'document.querySelector('+JSON.stringify('['+attr+'=guardmastery]')+')';
 const range=q('data-study-speed-target'),buy=q('data-speed-study'),hours=q('data-study-boost-hours'),status=q('data-study-boost-status');
 async function choose(tier,duration=8){await ev(range+'.focus({preventScroll:true});'+range+'.value="'+tiers.indexOf(tier)+'";'+range+'.dispatchEvent(new Event("input",{bubbles:true}));'+range+'.dispatchEvent(new Event("change",{bubbles:true}));'+hours+'.value="'+duration+'";'+hours+'.dispatchEvent(new Event("change",{bubbles:true}))');}
 async function key(name){const code={Space:32,ArrowRight:39,ArrowLeft:37,Home:36,End:35,Enter:13}[name];await send('Input.dispatchKeyEvent',{type:name==='Enter'?'keyDown':'rawKeyDown',key:name==='Space'?' ':name,code:name,windowsVirtualKeyCode:code,...(name==='Enter'?{text:'\r'}:{})});await send('Input.dispatchKeyEvent',{type:'keyUp',key:name==='Space'?' ':name,code:name,windowsVirtualKeyCode:code});}
 async function touch(expression){await ev(expression+'.scrollIntoView({block:"center"})');await pause(30);const p=await ev('(()=>{var r='+expression+'.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()');await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
 await send('Runtime.enable');await send('DOM.enable');
 for(const width of [320,390,430])for(const scale of [100,200])for(const motion of ['reduce','no-preference']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});await ev('document.documentElement.style.fontSize="'+scale+'%"');
  // Idle choices are useful without a disabled activation box. Levels always
  // identify earned progress, including zero and the level currently running.
  for(const level of [0,5]){
   const idle=seed();idle.activeStudies=[];idle.longStudyLevels.guardmastery=level;await install(idle);
   check(await ev('document.querySelector(".study-catalogue").hidden&&!'+range),'idle slot hides catalogue and speed controls');
   await touch('document.querySelector("[data-study-slot]")');
   check(await ev('document.querySelector("[data-study-card=guardmastery] .study-level").textContent==="Lv. '+level+'"'),'catalogue badge shows earned level');
   await ev('document.querySelector("[data-study=guardmastery]").focus()');await key('Enter');
   check(await ev('uiRegression.get().activeStudies[0].slot===0&&uiRegression.get().motes===100000&&'+range+'.getClientRects().length>0'),'slot research reveals speed without spending Motes');
   await choose(2,12);await ev(range+'.focus();window.idleRange='+range+';uiRegression.render();uiRegression.render()');
   check(await ev(range+'===idleRange&&document.activeElement===idleRange&&'+hours+'.value==="12"&&uiRegression.get().motes===100000'),'slot speed choices/focus survive refresh without spending');
   await ev('uiRegression.finish()');
   check(await ev('!'+buy+'&&document.activeElement===document.querySelector("[data-study-slot]")&&uiRegression.get().longStudyLevels.guardmastery==='+ (level+1)),'completion returns focus to empty slot and preserves earned level');
  }
  await install(seed());
  check(await ev(range+'.getClientRects().length>0 && '+hours+'.getClientRects().length>0 && !document.querySelector("[data-study-use-motes],[data-study-details]")'),'direct controls, no old panel/recurring toggle');
  check(await ev('(()=>{var r=document.querySelector("[data-running-study=guardmastery]"),bad=[];r.querySelectorAll("button,input,select,.effect-note").forEach(e=>{var b=e.getBoundingClientRect();if(b.left<0||b.right>innerWidth+1||e.scrollWidth>e.clientWidth+1)bad.push(e.outerHTML);if(e.matches("button,input,select")&&(b.width<44||b.height<44))bad.push(e.outerHTML)});return !bad.length&&document.documentElement.scrollWidth<=innerWidth+1;})()'),'fit and44px targets '+JSON.stringify({width,scale,motion}));
  check(await ev(range+'.type==="range"&&'+range+'.min==="0"&&'+range+'.max==="7"&&'+range+'.step==="1"'),'exact eight speed steps');
  check(await ev('(()=>{var c=document.querySelector("[data-running-study=guardmastery]"),t=c.querySelector(".study-title"),b=c.querySelector(".study-level");return t.textContent==="Guardian\'s Mastery"&&b.textContent==="Lv. 0"&&b.getBoundingClientRect().top>=t.getBoundingClientRect().bottom&&!/Next completion|Paid speed|Buy now|per level|Speed queue/i.test(c.textContent)&&c.textContent.includes("Current: +0%")&&c.textContent.includes("Next: +20%");})()'),'name, current badge and concise effects; obsolete copy absent');
  await ev(range+'.focus();window.originalRange='+range+';window.beforePreview=JSON.stringify(uiRegression.get());window.beforeSaves=JSON.stringify(uiRegression.saves())');
  for(const index of [1,2,3,4,5,6,7]){
   await ev(range+'.value='+index+';'+range+'.dispatchEvent(new Event("input",{bubbles:true}));uiRegression.render();uiRegression.render()');
   check(await ev('JSON.stringify(uiRegression.get())===beforePreview&&JSON.stringify(uiRegression.saves())===beforeSaves&&'+range+'===originalRange&&Number('+range+'.value)==='+index+'&&'+range+'.getAttribute("aria-valuetext")==="'+tiers[index]+'x"'),'drag preview pure/attached across refresh '+index);
  }
  await ev(range+'.dispatchEvent(new Event("change",{bubbles:true}));uiRegression.speeds();uiRegression.speeds()');
  check(await ev('uiRegression.get().studySpeedTargets.guardmastery===8&&uiRegression.get().motes===100000&&!uiRegression.get().studyBoosts.slot0'),'selection/old scheduler cannot activate or spend');
  check(JSON.stringify(await ev('uiRegression.prices()'))===JSON.stringify(prices),'all package base prices');
  for(let i=0;i<tiers.length;i++){
   const tier=tiers[i],cost=prices[i];
   await install(seed(cost-1));await choose(tier);
   check(await ev(buy+'.disabled && '+buy+'.querySelector("[data-price-currency]").dataset.priceAmount==="'+cost+'" && '+buy+'.querySelector("[data-price-currency]").style.color==="var(--danger)"'),'one-short disabled/red quote '+tier);
   await ev('uiRegression.fund('+cost+')');
   check(await ev('!'+buy+'.disabled&&'+buy+'.querySelector("[data-price-currency]").style.color==="var(--ink)"'),'funding refreshes action/red amount');
   await ev(range+'.focus({preventScroll:true});window.originalRange='+range+';'+range+'.scrollIntoView({block:"center"});window.beforeScroll=document.querySelector("main").scrollTop;uiRegression.render();uiRegression.render();window.beforeControlY=document.querySelector("[data-study-speed-target=guardmastery]").getBoundingClientRect().y');
   check(await ev(range+'===originalRange&&document.activeElement===originalRange&&Math.abs(document.querySelector("main").scrollTop-beforeScroll)<=1'),'native focus/scroll retained');
   await ev(buy+'.focus({preventScroll:true});window.oldBuy='+buy+';oldBuy.click();oldBuy.click();oldBuy.click()');
   check(await ev('uiRegression.get().motes===0&&uiRegression.get().studyBoosts.slot0.mult==='+tier+'&&uiRegression.get().activeStudies[0].speedMult===1&&uiRegression.get().activeStudies[0].remainingSec===150'),'single exact debit/work preserved '+tier);
   check(await ev('document.activeElement==='+status+'&&'+range+'.disabled&&'+hours+'.disabled&&!'+buy),'active timer replaces activation, no double spend');
   const viewport=await ev('(()=>{var m=document.querySelector("main"),control=document.querySelector("[data-study-speed-target=guardmastery]");return {actualY:control.getBoundingClientRect().y,beforeY:beforeControlY,actualScroll:m.scrollTop,beforeScroll:beforeScroll};})()');
   check(Math.abs(viewport.actualY-viewport.beforeY)<=1,'activation anchors the selected Study when slot status grows '+JSON.stringify(viewport));
   await ev('window.originalStatus='+status+';uiRegression.render();uiRegression.render()');
   check(await ev(status+'===originalStatus&&document.activeElement===originalStatus'),'countdown native focus remains attached');
  }
  await install(seed());await choose(1.5,12);
  check(await ev('uiRegression.get().studyBoostHours.guardmastery===12&&uiRegression.get().motes===100000&&'+buy+'.querySelector("[data-price-currency]").dataset.priceAmount==="1140"'),'12h choice quoted, no spend');
  await choose(1.5,24);check(await ev(buy+'.querySelector("[data-price-currency]").dataset.priceAmount==="2160"'),'24h quote includes10% discount');
  await install(seed());await ev(range+'.scrollIntoView({block:"center"});'+range+'.focus()');await key('ArrowRight');
  check(await ev(range+'.value==="1"&&uiRegression.get().studySpeedTargets.guardmastery===2&&uiRegression.get().motes===100000'),'native keyboard choice saves only target');
  await ev(buy+'.focus()');await key('Enter');
  check(await ev('uiRegression.get().studyBoosts.slot0.mult===2&&uiRegression.get().motes===98500'),'native Enter activates once');await key('Enter');
  check(await ev('uiRegression.get().motes===98500'),'repeat Enter on timer cannot spend');
  await install(seed());await choose(3,12);await touch(buy);
  check(await ev('uiRegression.get().studyBoosts.slot0.mult===3&&uiRegression.get().motes===95012'),'native touch activates selected package');
  await ev('uiRegression.save();uiRegression.load()');
  check(await ev('uiRegression.get().studyBoostHours.guardmastery===12&&uiRegression.get().studyBoosts.slot0.mult===3&&'+status+'.textContent.includes("3x")'),'actual save/reload retains timer');
  await ev(status+'.focus();uiRegression.finish()');
  check(await ev('!uiRegression.get().activeStudies.length&&document.activeElement===document.querySelector("[data-study-slot]")&&!'+status+'&&!'+buy+'&&uiRegression.get().studyBoosts.slot0.mult===3&&document.querySelector("[data-slot-boost]").textContent.includes("3x")'),'completion returns focus to idle Study and retains slot timer without renewing');
  await touch('document.querySelector("[data-study-slot]")');await ev('document.querySelector("[data-study=guardmastery]").focus();document.querySelector("[data-study=guardmastery]").click()');
  check(await ev('uiRegression.get().activeStudies[0].id==="guardmastery"&&document.activeElement==='+status),'new level uses remaining timer and focus');
  await ev('document.querySelector("[data-study-queue=guardmastery]").focus()');await key('Space');
  check(await ev('!uiRegression.get().studyQueue.guardmastery&&!uiRegression.get().activeStudies.length&&uiRegression.get().motes===95012'),'Study Queue independently toggles without debit');
  // Actual drag and held keys preview until release, never buy intermediate tiers.
  await install(seed());await ev(range+'.scrollIntoView({block:"center"})');
  const drag=await ev('(()=>{var r='+range+'.getBoundingClientRect();return {x:r.x+12,y:r.y+r.height/2,width:r.width-24};})()');
  await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:drag.x,y:drag.y}]});
  for(const f of [2/7,4/7,1]){await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:drag.x+drag.width*f,y:drag.y}]});check(await ev('uiRegression.get().studySpeedTargets.guardmastery===1.5&&uiRegression.get().motes===100000'),'native drag previews without save/spend');}
  await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  check(await ev('uiRegression.get().studySpeedTargets.guardmastery===8&&'+range+'.value==="7"&&document.activeElement==='+range+'&&uiRegression.get().motes===100000'),'release commits final target only');
  await key('Home');for(let i=0;i<3;i++)await send('Input.dispatchKeyEvent',{type:'rawKeyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39,autoRepeat:i>0});
  check(await ev('uiRegression.get().studySpeedTargets.guardmastery===1.5&&'+range+'.value==="3"'),'held keyboard preview');
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
  check(await ev('uiRegression.get().studySpeedTargets.guardmastery===4&&uiRegression.get().motes===100000'),'keyup commits without spending');
  const sorted=seed();sorted.activeStudies.push({id:'wispascend',remainingSec:80,totalDurationSec:150,speedMult:1});await install(sorted);await choose(8);await ev(range+'.scrollIntoView({block:"center"});window.beforeY='+range+'.getBoundingClientRect().y;'+buy+'.focus({preventScroll:true});'+buy+'.click()');
  check(await ev('document.querySelector("[data-running-study]").dataset.runningStudy==="guardmastery"&&document.activeElement==='+status+'&&Math.abs('+range+'.getBoundingClientRect().y-beforeY)<=1'),'boost reorder anchors same project');
  const discount=seed();discount.longStudyLevels.catalysis=10;await install(discount);await choose(3);check(await ev(buy+'.querySelector("[data-price-currency]").dataset.priceAmount==="2800"'),'Catalysis visibly discounted');await ev(buy+'.click()');check(await ev('uiRegression.get().motes===97200'),'discount quote equals debit');
  await ev(status+'.scrollIntoView({block:"center"})');
  if(process.env.LUMENFALL_QA_EVIDENCE_DIR){fs.mkdirSync(process.env.LUMENFALL_QA_EVIDENCE_DIR,{recursive:true});const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(process.env.LUMENFALL_QA_EVIDENCE_DIR,'lab-'+width+'-'+scale+'-'+motion+'.png'),Buffer.from(shot.data,'base64'));}
  records.push({width,scale,motion});
 }
 // Real interval callbacks, resource refresh and expiry while focused.
 await install(seed(799));await ev(range+'.focus();window.originalRange='+range+';window.liveStart=JSON.stringify(uiRegression.get().activeStudies);window.uiRegressionPaused=false');await pause(1100);
 check(await ev(range+'===originalRange&&document.activeElement===originalRange&&'+buy+'.disabled'),'live intervals retain focus/disabled quote');
 await ev('uiRegression.fund(800)');check(await ev('!'+buy+'.disabled'),'live affordability turns on');await ev(buy+'.focus();'+buy+'.click();'+status+'.focus();window.originalStatus='+status);await pause(1100);
 check(await ev(status+'===originalStatus&&document.activeElement===originalStatus'),'live timer ticks keep native focus');
 await ev('window.uiRegressionPaused=true;uiRegression.expire();');
 check(await ev('!'+status+'&&'+buy+'&& !'+range+'.disabled&&document.activeElement==='+range),'expiry restores choice/focus without spending');
};
