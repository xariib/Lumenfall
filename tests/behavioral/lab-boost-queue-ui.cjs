'use strict';
const fs=require('node:fs'),path=require('node:path');
module.exports=async function({send,ev,pause,check,records,args}){
 const evidence=args.includes('--evidence')?path.resolve(args[args.indexOf('--evidence')+1]):null;
 async function touch(selector){const r=await ev('(()=>{const e=document.querySelector('+JSON.stringify(selector)+');e.scrollIntoView({block:"center"});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()');await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[r]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(20);}
 async function key(value){await send('Input.dispatchKeyEvent',{type:'keyDown',key:value,code:value});await send('Input.dispatchKeyEvent',{type:'keyUp',key:value,code:value});}
 for(const width of [320,390,430])for(const scale of [100,150,200])for(const motion of ['reduce','no-preference']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});await ev('document.documentElement.style.fontSize="'+scale+'%"');
  await ev('(()=>{if(document.querySelector(".study-speed-editor:not([hidden])"))document.querySelector("[data-study-speed-close]").click();const s=uiRegression.fresh(),now=Date.now();s.maxDepthEver=250;s.lumen=s.shards=1e12;s.motes=10000;s.questDay=new Date().toISOString().slice(0,10);s.activeStudies=[{id:"guardmastery",slot:0,remainingSec:1e9,totalDurationSec:1e9,speedMult:1}];s.studyQueue.guardmastery=true;s.studyBoosts.slot0={mult:1.5,startedAtMs:now,expiresAtMs:now+28800000};s.studySpeedTargets.guardmastery=1.5;s.studyBoostHours.guardmastery=8;uiRegression.set(s);document.querySelector("[data-tab=research]").click();window.originalPaid=JSON.stringify(uiRegression.get().studyBoosts);window.originalWork=JSON.stringify(uiRegression.get().activeStudies);})()');
  await touch('[data-study-speed-open="0"]');
  check(await ev('!document.querySelector("[data-study-speed-target]").disabled&&!document.querySelector("[data-study-boost-hours]").disabled'),'active paid boost leaves next settings editable');
  check(await ev('document.querySelector("[data-study-boost-status]").textContent.includes("Active: 1.5x")&&document.querySelector("[data-study-boost-queue]").getAttribute("aria-checked")==="false"'),'active1.5x and boost Queue OFF are explicit');
  await ev('document.querySelector("[data-study-speed-target]").focus()');await key('ArrowRight');await key('ArrowRight');
  check(await ev('document.querySelector("[data-study-next-summary]").textContent==="3x · 8h"&&document.querySelector("[data-study-speed-target]").value==="2"'),'next3x selection remains visible during1.5x boost');
  await ev('(()=>{const e=document.querySelector("[data-study-boost-hours]");e.value="12";e.dispatchEvent(new Event("change",{bubbles:true}));})()');
  check(await ev('document.querySelector("[data-study-next-summary]").textContent==="3x · 12h"'),'future duration updates without changing current receipt');
  check(await ev('JSON.stringify(uiRegression.get().studyBoosts)===originalPaid&&JSON.stringify(uiRegression.get().activeStudies)===originalWork&&uiRegression.get().motes===10000'),'editing next plan preserves exact current receipt/work/wallet');
  await touch('[data-study-boost-queue]');
  check(await ev('uiRegression.get().studyBoostQueue.slot0.enabled&&uiRegression.get().studyQueue.guardmastery&&document.querySelector("[data-study-boost-queue]").getAttribute("aria-checked")==="true"'),'native touch enables boost queue independently of research repeat');
  await ev('window.queueButton=document.querySelector("[data-study-boost-queue]");queueButton.focus();uiRegression.render();uiRegression.render();');
  check(await ev('document.activeElement===queueButton&&document.querySelector("[data-study-boost-queue]")===queueButton'),'passive refresh preserves queue button and keyboard focus');
  await ev('(()=>{const e=document.querySelector("[data-study-boost-hours]");e.value="8";e.dispatchEvent(new Event("change",{bubbles:true}));uiRegression.fund(3499);})()');
  check(await ev('document.querySelector("[data-study-next-price] [data-price-currency]").style.color==="var(--danger)"&&!document.querySelector("[data-study-speed-target]").disabled&&!document.querySelector("[data-study-boost-queue]").disabled'),'unaffordable future price is red while settings/OFF remain usable');
  await touch('[data-study-boost-queue]');check(await ev('!uiRegression.get().studyBoostQueue.slot0.enabled&&JSON.stringify(uiRegression.get().studyBoosts)===originalPaid'),'OFF stops only future boosts');
  await ev('uiRegression.save();uiRegression.load()');check(await ev('uiRegression.get().studyBoostQueue.slot0.mult===3&&uiRegression.get().studyBoostQueue.slot0.hours===8&&!uiRegression.get().studyBoostQueue.slot0.enabled'),'actual save/load retains next plan and OFF');
  if(!await ev('!!document.querySelector(".study-speed-editor:not([hidden])")'))await touch('[data-study-speed-open="0"]');await touch('[data-study-boost-queue]');await ev('uiRegression.fund(3500)');
  check(await ev('document.querySelector("[data-study-next-price] [data-price-currency]").style.color==="var(--ink)"'),'funding refreshes future price');
  check(await ev('(()=>{const d=document.querySelector(".study-speed-menu"),r=d.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight+1&&d.scrollWidth<=d.clientWidth+1;})()'),'menu fits viewport including enlarged text');
  check(await ev('Array.from(document.querySelectorAll(".study-speed-editor:not([hidden]) button,.study-speed-editor:not([hidden]) input,.study-speed-editor:not([hidden]) select")).every(e=>{const r=e.getBoundingClientRect();return r.width>=44&&r.height>=44;})'),'44px controls including queue during active boost');
  if(evidence&&width===390&&motion==='reduce'){fs.mkdirSync(evidence,{recursive:true});await ev('document.querySelector(".study-speed-menu").scrollTop=0');const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(evidence,'active-next-'+scale+'.png'),Buffer.from(shot.data,'base64'));}
  await ev('uiRegression.expire();uiRegression.speeds();uiRegression.speeds();');
  check(await ev('uiRegression.get().studyBoosts.slot0.mult===3&&uiRegression.get().motes===0&&document.querySelector("[data-study-boost-status]").textContent.includes("Active: 3x")'),'expiry starts chosen3x once and refreshes current summary');
  await key('Escape');check(await ev('!document.querySelector(".study-speed-editor:not([hidden])")&&document.activeElement===document.querySelector("[data-study-speed-open=\\"0\\"]")'),'Escape closes and returns to slot opener');
  records.push({width,scale,motion,status:'pass'});
 }
};
