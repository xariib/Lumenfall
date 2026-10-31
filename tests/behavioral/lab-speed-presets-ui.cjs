'use strict';
module.exports=async function({send,ev,pause,check,records,args}){
 const fs=require('node:fs'),path=require('node:path');
 const evidence=args.includes('--evidence')?path.resolve(args[args.indexOf('--evidence')+1]):null;
 async function touch(selector){await ev('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center"})');const p=await ev('(()=>{const r=document.querySelector('+JSON.stringify(selector)+').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()');await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(15);}
 async function key(key){const code={Enter:13,Escape:27,Tab:9}[key];await send('Input.dispatchKeyEvent',{type:'keyDown',key,code:key,windowsVirtualKeyCode:code,...(key==='Enter'?{text:'\r'}:{})});await send('Input.dispatchKeyEvent',{type:'keyUp',key,code:key,windowsVirtualKeyCode:code});}
 for(const width of [320,390,430])for(const scale of [100,150,200])for(const motion of ['reduce','no-preference']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});
  await ev('(()=>{if(document.querySelector(".study-speed-editor:not([hidden])"))document.querySelector("[data-study-speed-close]").click();const s=uiRegression.fresh();s.maxDepthEver=250;s.motes=100000;s.questDay=new Date().toISOString().slice(0,10);s.activeStudies=[{id:"guardmastery",slot:0,remainingSec:1e9,totalDurationSec:1e9,speedMult:1}];uiRegression.set(s);document.querySelector("[data-tab=research]").click();})()');
  await ev('document.documentElement.style.fontSize="'+scale+'%";Promise.all(document.getElementById("tab-research").getAnimations().map(a=>a.finished)).then(()=>true)');
  await touch('[data-study-speed-open="0"]');
  await ev('document.querySelector(".study-slider-controls").open=false');
  check(await ev('!document.querySelector(".study-slider-controls").open&&!document.querySelector("[data-study-speed-target]").getClientRects().length'),'default menu uses presets; slider available in disclosure');
  check(await ev('document.querySelectorAll("[data-study-duration-preset]").length===3&&document.querySelectorAll("[data-study-mult-preset]").length===8'),'all existing durations and eight tiers exposed directly');
  check(await ev('(()=>{const b=Array.from(document.querySelectorAll("[data-study-mult-preset]")),r=b.map(e=>e.getBoundingClientRect());return r[0].top===r[3].top&&r[4].top===r[7].top&&r[4].top>r[0].top;})()'),'multipliers form two rows of four');
  check(await ev('Array.from(document.querySelectorAll(".study-speed-menu button,.study-speed-menu summary")).every(e=>{const r=e.getBoundingClientRect();return r.width>=44&&r.height>=44&&e.scrollWidth<=e.clientWidth+1;})'),'named preset controls fit and retain44px targets');
  for(const hours of [8,12,24]){
   await touch('[data-study-duration-preset="'+hours+'"]');
   for(const mult of [1.5,2,3,4,5,6,7,8]){
    await touch('[data-study-mult-preset="'+mult+'"]');
    check(await ev('document.querySelector("[data-study-next-summary]").textContent==="'+mult+'x · '+hours+'h"&&document.querySelector("[data-study-mult-preset=\\"'+mult+'\\"]").getAttribute("aria-pressed")==="true"&&document.querySelector("[data-study-duration-preset=\\"'+hours+'\\"]").getAttribute("aria-pressed")==="true"&&document.querySelectorAll(".study-mult-presets [aria-pressed=true]").length===1&&document.querySelectorAll(".study-duration-presets [aria-pressed=true]").length===1&&uiRegression.get().motes===100000&&!uiRegression.get().studyBoosts.slot0'),'touch selects exact plan without spending '+mult+'x/'+hours+'h');
   }
  }
  await touch('[data-study-mult-preset="3"]');
  await ev('window.preset=document.activeElement;uiRegression.render();uiRegression.render()');
  check(await ev('document.activeElement===preset&&preset.isConnected&&preset.getAttribute("aria-pressed")==="true"&&!document.querySelector(".study-slider-controls").open'),'preset focus, selected state and disclosure survive passive render');
  await ev('document.querySelector("[data-study-duration-preset=\\"12\\"]").focus()');await key('Enter');
  check(await ev('document.querySelector("[data-study-next-summary]").textContent==="3x · 12h"&&uiRegression.get().motes===100000'),'keyboard Enter selects duration without spending');
  await touch('[data-study-duration-preset="24"]');
  if(evidence&&width===390&&scale===100&&motion==='reduce'){
   fs.mkdirSync(evidence,{recursive:true});await ev('document.querySelector(".study-speed-menu").scrollTop=0');const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(evidence,'speed-up.png'),Buffer.from(shot.data,'base64'));
  }
  const quote=await ev('Number(document.querySelector("[data-study-next-price] [data-price-currency]").dataset.priceAmount)');
  await ev('uiRegression.fund('+(quote-1)+')');
  check(await ev('document.querySelector("[data-speed-study]").disabled&&document.querySelector("[data-study-next-price] [data-price-currency]").style.color==="var(--danger)"'),'insufficient quote red and purchase disabled');
  await ev('uiRegression.fund('+quote+')');await touch('[data-speed-study]');
  check(await ev('uiRegression.get().motes===0&&uiRegression.get().studyBoosts.slot0.mult===3&&!document.querySelector(".study-speed-editor:not([hidden])")'),'touch purchase charges exact selected quote once and closes dialog');
  await touch('[data-study-speed-open="0"]');await ev('window.paid=JSON.stringify(uiRegression.get().studyBoosts);window.work=JSON.stringify(uiRegression.get().activeStudies)');
  await touch('[data-study-mult-preset="7"]');await touch('[data-study-duration-preset="12"]');await touch('[data-study-boost-queue]');
  check(await ev('JSON.stringify(uiRegression.get().studyBoosts)===paid&&JSON.stringify(uiRegression.get().activeStudies)===work&&uiRegression.get().studyBoostQueue.slot0.mult===7&&uiRegression.get().studyBoostQueue.slot0.hours===12&&uiRegression.get().studyBoostQueue.slot0.enabled&&uiRegression.get().motes===0'),'active paid receipt/work unchanged while next presets and queue remain editable');
  await touch('.study-slider-controls summary');
  check(await ev('document.querySelector(".study-slider-controls").open&&document.querySelector("[data-study-speed-target]").getClientRects().length>0'),'native slider remains available on request');
  await ev('document.querySelector(".study-slider-controls summary").focus()');await key('Tab');
  check(await ev('document.activeElement.hasAttribute("data-study-boost-hours")'),'keyboard can leave disclosure for its native duration control');
  check(await ev('(()=>{const d=document.querySelector(".study-speed-menu"),r=d.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight+1&&d.scrollWidth<=d.clientWidth+1;})()'),'dialog scrolls within viewport at enlarged text');
  await key('Escape');check(await ev('document.activeElement===document.querySelector("[data-study-speed-open=\\"0\\"]")'),'Escape restores Lab opener focus');
  records.push({width,scale,motion,status:'pass'});
 }
};
