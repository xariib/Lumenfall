'use strict';
module.exports=async function({send,ev,pause,check,records}){
 await send('Runtime.enable');await send('DOM.enable');
 const fresh=await ev('uiRegression.fresh()');
 const seed=()=>({...JSON.parse(JSON.stringify(fresh)),maxDepthEver:250,questDay:new Date().toISOString().slice(0,10),lumen:1e12,shards:1e12,motes:100000,comets:1000});
 async function install(s){await ev('uiRegression.set('+JSON.stringify(s)+');document.querySelector("[data-tab=research]").click()');await ev('Promise.all(document.getElementById("tab-research").getAnimations().map(a=>a.finished)).then(()=>true)');}
 async function touch(selector){await ev('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center"})');await pause(25);const p=await ev('(()=>{var r=document.querySelector('+JSON.stringify(selector)+').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()');await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
 for(const width of [320,390,430])for(const scale of [100,150,200])for(const motion of ['reduce','no-preference']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});await ev('document.documentElement.style.fontSize="'+scale+'%"');
  const s=seed();await install(s);await ev('clarityQA.select(-1)');
  check(await ev('document.querySelectorAll("[data-lab-slot]").length===5&&document.querySelector(".study-catalogue").hidden'),'five visible slots; catalogue closed');
  check(await ev('Array.from(document.querySelectorAll("[data-lab-slot]")).every(e=>e.getClientRects().length)&&document.querySelectorAll("[data-study-slot]").length===3'),'three unlocked and two visibly locked slots');
  await touch('[data-study-slot="1"]');
  check(await ev('!document.querySelector(".study-catalogue").hidden&&document.getElementById("study-choices").textContent.includes("2")'),'touch selects slot two and opens catalogue');
  await touch('[data-study="guardmastery"]');
  check(await ev('uiRegression.get().activeStudies.some(a=>a.id==="guardmastery"&&a.slot===1)&&document.querySelector(".study-catalogue").hidden'),'choose research starts in selected slot and closes catalogue');
  check(await ev('Array.from(document.querySelectorAll("[data-lab-slot]")).map(e=>e.dataset.labSlot).join(",")==="0,1,2,3,4"'),'visual and assistive reading order keep all five slot numbers stable');
  check(await ev('!document.querySelector("[data-study-pause]")&&!/Speed target/.test(document.querySelector("[data-running-study]").textContent)'),'no pause action or redundant speed target heading');
  await ev('document.querySelector("[data-study-speed-target=guardmastery]").value=1;document.querySelector("[data-study-speed-target=guardmastery]").dispatchEvent(new Event("change",{bubbles:true}));window.rangeBefore=document.querySelector("[data-study-speed-target=guardmastery]");rangeBefore.focus();uiRegression.render();');
  check(await ev('rangeBefore===document.querySelector("[data-study-speed-target=guardmastery]")&&document.activeElement===rangeBefore'),'active slider stays attached and focused');
  await touch('[data-speed-study=guardmastery]');await ev('window.boostBefore=JSON.stringify(uiRegression.get().studyBoosts.slot1)');
  await touch('[data-study-slot="1"]');await touch('[data-study="wispascend"]');
  check(await ev('uiRegression.get().activeStudies[0].id==="wispascend"&&uiRegression.get().activeStudies[0].slot===1&&JSON.stringify(uiRegression.get().studyBoosts.slot1)===boostBefore'),'native replacement retains slot speed');
  await touch('[data-study-queue=wispascend]');
  check(await ev('uiRegression.get().activeStudies.length===0&&document.querySelector("[data-lab-slot=\\"1\\"] [data-study-slot]")&&JSON.stringify(uiRegression.get().studyBoosts.slot1)===boostBefore'),'Queue OFF leaves slot empty and boosted');
  check(await ev('document.documentElement.scrollWidth<=innerWidth+1&&Array.from(document.querySelectorAll(".study-slots button")).every(e=>{var r=e.getBoundingClientRect();return r.width>=44&&r.height>=44&&r.right<=innerWidth+1})'),'slot layout and 44px controls fit');
  const legacy=seed();legacy.activeStudies=[{id:'guardmastery',slot:1,remainingSec:70,totalDurationSec:150,speedMult:2}];legacy.studyQueue.guardmastery=false;
  await install(legacy);
  check(await ev('document.querySelector("[data-study-queue=guardmastery]").textContent==="Clear slot"'),'old running Queue OFF save has an explicit clear action');
  await touch('[data-study-queue=guardmastery]');
  check(await ev('!uiRegression.get().activeStudies.length&&!uiRegression.get().studyQueue.guardmastery&&uiRegression.get().pausedStudies[0].remainingSec===70&&uiRegression.get().lumen===1e12&&uiRegression.get().shards===1e12'),'legacy clear preserves paid work and wallets without enabling automation');
  const comet=seed();comet.owned.meteor=true;comet.owned.starcall=true;comet.cometCharges=1;await ev('uiRegression.set('+JSON.stringify(comet)+');document.querySelector("[data-tab=battle]").click()');
  check(await ev('!document.querySelector("#tab-battle #comet-commands")&&!document.querySelector("main").classList.contains("comet-command-scroll")&&getComputedStyle(document.querySelector("main")).overflowY!=="auto"'),'Comet ownership cannot make Rift scroll');
  await ev('document.querySelector("[data-tab=deeds]").click()');check(await ev('document.querySelector("#tab-deeds #comet-commands")&&!document.getElementById("comet-commands").hidden'),'existing commands remain available in Deeds');
  check(await ev('clarityQA.deeds().length===76&&document.querySelectorAll("[data-deed]").length===76'),'all original and 49 new Deeds render');
  records.push({width,scale,motion,status:'pass'});
 }
};
