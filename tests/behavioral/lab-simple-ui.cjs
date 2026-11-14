'use strict';
module.exports=async function({send,ev,pause,check,records,args}){
 const fs=require('node:fs'),path=require('node:path'),fresh=await ev('uiRegression.fresh()');
 const out=args.indexOf('--evidence')>=0?args[args.indexOf('--evidence')+1]:null;
 const seed=()=>({...JSON.parse(JSON.stringify(fresh)),maxDepthEver:250,questDay:new Date().toISOString().slice(0,10),lumen:1e12,shards:1e12,motes:100000});
 async function key(key){await send('Input.dispatchKeyEvent',{type:'keyDown',key,code:key,windowsVirtualKeyCode:{Enter:13,Escape:27,Tab:9}[key],...(key==='Enter'?{text:'\r'}:{})});await send('Input.dispatchKeyEvent',{type:'keyUp',key,code:key,windowsVirtualKeyCode:{Enter:13,Escape:27,Tab:9}[key]});}
 async function touch(sel){await ev('document.querySelector('+JSON.stringify(sel)+').scrollIntoView({block:"center"})');await pause(30);const p=await ev('(()=>{var r=document.querySelector('+JSON.stringify(sel)+').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()');await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
 async function install(s){await ev('uiRegression.set('+JSON.stringify(s)+');document.querySelector("[data-tab=research]").click();clarityQA.select(-1)');await ev('Promise.all(document.getElementById("tab-research").getAnimations().map(a=>a.finished)).then(()=>true)');}
 async function shot(name){if(out){fs.mkdirSync(out,{recursive:true});const r=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(r.data,'base64'));}}
 for(const width of [320,390,430])for(const scale of [100,150,200])for(const motion of ['reduce','no-preference']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});await ev('document.documentElement.style.fontSize="'+scale+'%"');
  await install(seed());await touch('[data-study-slot="0"]');
  check(await ev('!Array.from(document.querySelectorAll("#study-list button")).some(b=>b.textContent.trim()==="Select research")'),'no separate Select research button');
  check(await ev('(()=>{var c=document.querySelector("[data-study-card=guardmastery]"),b=c.querySelector("[data-study]"),r=c.getBoundingClientRect(),br=b.getBoundingClientRect();return b.tagName==="BUTTON"&&br.width>=r.width-2&&br.height>=r.height-2&&b.getAttribute("aria-label").includes("Guard")})()'),'whole research card is a named native button');
  await touch('[data-study-card=guardmastery] .study-title');
  check(await ev('uiRegression.get().activeStudies.some(a=>a.id==="guardmastery"&&a.slot===0)&&!document.querySelector("#study-start-confirmation")'),'touching research title starts directly in empty slot');
  check(await ev('document.activeElement===document.querySelector("[data-study-speed-open=\\"0\\"]")'),'new research returns focus to its timer action');
  const state=seed();state.activeStudies=[{id:'guardmastery',slot:0,remainingSec:70,totalDurationSec:150,speedMult:1}];state.studyQueue.guardmastery=true;const now=Date.now();state.studyBoosts.slot0={mult:2,startedAtMs:now,expiresAtMs:now+28800000};await install(state);
  check(await ev('(()=>{var c=document.querySelector("[data-running-study=guardmastery]"),b=c.querySelector(".study-bar-track").getBoundingClientRect();return ["[data-study-queue]","[data-study-speed-open]"].every(s=>{var r=c.querySelector(s).getBoundingClientRect();return r.left>=b.left&&r.right<=b.right&&r.top>=b.top&&r.bottom<=b.bottom&&r.height>=44&&r.width>=44})})()'),'timer contains both 44px action targets');
  if(width===390&&motion==='reduce'){await ev('document.querySelector("[data-lab-slot=\\"0\\"]").scrollIntoView({block:"start"})');await shot('timer-'+scale);}
  await touch('[data-study-slot="0"]');await ev('window.originalWork=JSON.stringify(uiRegression.get());window.originalSaves=JSON.stringify(uiRegression.saves())');await touch('[data-study=wispascend]');
  check(await ev('!!document.querySelector("#study-start-confirmation [role=dialog]")&&document.querySelector("#study-start-confirmation").contains(document.activeElement)&&document.querySelector(".shell").inert'),'replacement opens focused named modal and isolates background');
  check(await ev('JSON.stringify(uiRegression.get())===originalWork&&JSON.stringify(uiRegression.saves())===originalSaves'),'asking confirmation never spends or replaces work');
  check(await ev('(()=>{var d=document.querySelector("#study-start-confirmation .modal"),r=d.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight+1&&d.scrollWidth<=d.clientWidth+1;})()'),'confirmation fits viewport and enlarged text');
  await key('Escape');check(await ev('!document.querySelector("#study-start-confirmation")&&JSON.stringify(uiRegression.get())===originalWork&&document.activeElement===document.querySelector("[data-study=wispascend]")&&!document.querySelector(".shell").inert'),'Escape cancels without spending and restores card focus');
  await touch('[data-study=wispascend]');await touch('[data-study-confirm-cancel]');check(await ev('JSON.stringify(uiRegression.get())===originalWork&&!document.querySelector("#study-start-confirmation")'),'Cancel retains wallet and paid work');
  await ev('document.querySelector("[data-study=wispascend]").focus()');await key('Enter');check(await ev('!!document.querySelector("#study-start-confirmation")'),'keyboard Enter on card asks before replacement');
  await ev('uiRegression.wallet(0,0)');check(await ev('document.querySelector("[data-study-confirm-start]").disabled&&Array.from(document.querySelectorAll("[data-study-confirm-price] [data-price-currency]")).every(e=>e.style.color==="var(--danger)")'),'live shortfall disables confirmation and marks both resource amounts red');
  await ev('document.querySelector("[data-study-confirm-start]").click()');check(await ev('uiRegression.get().activeStudies[0].id==="guardmastery"'),'disabled confirmation cannot replace work');
  await ev('uiRegression.wallet(1e12,1e12)');check(await ev('!document.querySelector("[data-study-confirm-start]").disabled'),'live funding enables confirmation');
  if(width===390&&scale===100&&motion==='reduce')await shot('confirmation');
  await touch('[data-study-confirm-start]');check(await ev('uiRegression.get().activeStudies[0].id==="wispascend"&&uiRegression.get().pausedStudies.some(a=>a.id==="guardmastery"&&a.remainingSec===70)&&uiRegression.get().studyBoosts.slot0.mult===2&&!document.querySelector("#study-start-confirmation")'),'confirmed switch preserves exact paid work and slot boost');
  const paid=await ev('JSON.stringify(uiRegression.get().studyBoosts)');await ev('uiRegression.save();uiRegression.load()');await touch('[data-study-slot="0"]');await touch('[data-study=guardmastery]');
  check(await ev('document.querySelector("[data-study-confirm-price]").textContent.includes("no additional cost")'),'saved research confirmation explains free resume');
  await ev('window.resumeWallet=JSON.stringify([uiRegression.get().lumen,uiRegression.get().shards,uiRegression.get().motes])');await touch('[data-study-confirm-start]');
  check(await ev('uiRegression.get().activeStudies[0].remainingSec===70&&JSON.stringify([uiRegression.get().lumen,uiRegression.get().shards,uiRegression.get().motes])===resumeWallet'),'resume after reload preserves timer and wallet');check(await ev('JSON.stringify(uiRegression.get().studyBoosts)')===paid,'resume retains paid boost receipt');
  check(await ev('document.documentElement.scrollWidth<=innerWidth+1'),'Lab fits mobile viewport');records.push({width,scale,motion,status:'pass'});
 }
};
