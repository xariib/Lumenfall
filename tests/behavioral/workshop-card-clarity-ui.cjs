'use strict';
module.exports=async function({send,ev,pause,check,records}){
 await send('Runtime.enable');await send('DOM.enable');
 const fresh=await ev('uiRegression.fresh()');
 const seed=()=>({...JSON.parse(JSON.stringify(fresh)),maxDepthEver:250,questDay:new Date().toISOString().slice(0,10),lumen:1e12,shards:1e12,motes:100000,comets:1000,prisms:1000000});
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
  if(!(await ev('document.querySelector(".study-speed-open").getAttribute("aria-expanded")=="true"')))await touch('[data-study-speed-open="1"]');
  await ev('document.querySelector("[data-study-speed-target=guardmastery]").value=1;document.querySelector("[data-study-speed-target=guardmastery]").dispatchEvent(new Event("change",{bubbles:true}));window.rangeBefore=document.querySelector("[data-study-speed-target=guardmastery]");rangeBefore.focus();uiRegression.render();');
  check(await ev('rangeBefore===document.querySelector("[data-study-speed-target=guardmastery]")&&document.activeElement===rangeBefore'),'active slider stays attached and focused');
  await touch('[data-speed-study=guardmastery]');await ev('window.boostBefore=JSON.stringify(uiRegression.get().studyBoosts.slot1)');
  await touch('[data-study-slot="1"]');await touch('[data-study="wispascend"]');
  check(await ev('uiRegression.get().activeStudies[0].id==="wispascend"&&uiRegression.get().activeStudies[0].slot===1&&JSON.stringify(uiRegression.get().studyBoosts.slot1)===boostBefore'),'native replacement retains slot speed');
  await touch('[data-study-queue=wispascend]');
  check(await ev('uiRegression.get().activeStudies.length===1&&!uiRegression.get().studyQueue.wispascend&&document.querySelector("[data-lab-slot=\\"1\\"] [data-study-slot]")&&JSON.stringify(uiRegression.get().studyBoosts.slot1)===boostBefore'),'Queue OFF keeps the active research and slot boost');
  check(await ev('document.documentElement.scrollWidth<=innerWidth+1&&Array.from(document.querySelectorAll(".study-slots button")).filter(e=>e.getClientRects().length).every(e=>{var r=e.getBoundingClientRect();return r.width>=44&&r.height>=44&&r.right<=innerWidth+1})'),'slot layout and 44px controls fit');
  const legacy=seed();legacy.activeStudies=[{id:'guardmastery',slot:1,remainingSec:70,totalDurationSec:150,speedMult:2}];legacy.studyQueue.guardmastery=false;
  await install(legacy);
  check(await ev('document.querySelector("[data-study-queue=guardmastery]").getAttribute("aria-pressed")==="false"'),'old running Queue OFF save has its repeat state exposed');
  await touch('[data-study-queue=guardmastery]');
  check(await ev('uiRegression.get().activeStudies.length===1&&uiRegression.get().studyQueue.guardmastery&&uiRegression.get().activeStudies[0].remainingSec===70&&uiRegression.get().lumen===1e12&&uiRegression.get().shards===1e12'),'legacy Queue OFF toggles repeat ON without changing paid work or wallets');
  const waiting=seed();waiting.lumen=waiting.shards=0;waiting.longStudyLevels.guardmastery=1;waiting.studyQueue.guardmastery=true;waiting.studySlotProjects[1]='guardmastery';await install(waiting);
  const waitingSlot='document.querySelector('+JSON.stringify('[data-lab-slot="1"]')+')';
  check(await ev(waitingSlot+'.textContent.includes("Queued for next level")&&document.querySelector("[data-study-queue=guardmastery]")'),'waiting research stays visible with Queue OFF available');
  await touch('[data-study-queue=guardmastery]');
  check(await ev('!uiRegression.get().studyQueue.guardmastery&&uiRegression.get().studySlotProjects[1]===null&&'+waitingSlot+'.textContent.includes("Select research")&&uiRegression.get().lumen===0&&uiRegression.get().shards===0'),'native Queue OFF clears waiting intent without spending');
  const comet=seed();comet.schemaVersion=5;comet.owned.meteor=true;comet.owned.starcall=true;comet.cometCharges=1;await ev('uiRegression.set('+JSON.stringify(comet)+');document.querySelector("[data-tab=battle]").click()');
  check(await ev('!document.querySelector("#tab-battle #comet-commands")&&!document.querySelector("main").classList.contains("comet-command-scroll")&&getComputedStyle(document.querySelector("main")).overflowY!=="auto"'),'Comet ownership cannot make Rift scroll');
  await ev('document.querySelector("[data-tab=deeds]").click()');check(await ev('document.querySelector("#tab-deeds #comet-commands")&&document.getElementById("comet-commands").hidden&&!document.querySelector("[data-comet-command]")'),'retired commands have no player UI');
  check(await ev('clarityQA.deeds().length===76&&document.querySelectorAll("[data-deed]").length===72'),'all76 historical identities remain;72 active Deeds render');
  for(const [tab,id] of [['research','lab-help'],['ascend','tree-bonds'],['forge','forge-arcanecal'],['deeds','comet-autoascend']]){
   await ev('document.querySelector('+JSON.stringify('[data-tab="'+tab+'"]')+').click()');
   await ev('Promise.all(document.getElementById('+JSON.stringify('tab-'+tab)+').getAnimations().map(a=>a.finished)).then(()=>true)');
   const summary='[data-card-details-summary="'+id+'"]';
   if(!(await ev('!!document.querySelector('+JSON.stringify(summary)+')'))){
    const selector=id==='tree-bonds'?'[data-tree-node="bonds"]':id==='forge-arcanecal'?'[data-forge-card="arcanecal"]':'[data-comet-card="autoascend"]';
    check(await ev('document.querySelector('+JSON.stringify(selector)+').textContent.trim().length>0'),'direct current effects replace redundant disclosure '+id);
    const button=selector+' button';await ev('document.querySelector('+JSON.stringify(button)+').focus({preventScroll:true})');
    const before=await ev('JSON.stringify({state:uiRegression.get(),saves:uiRegression.saves()})');await ev('clarityQA.render();clarityQA.render()');
    check(await ev('document.activeElement===document.querySelector('+JSON.stringify(button)+')'),'direct action focus survives refresh '+id);
    check(await ev('JSON.stringify({state:uiRegression.get(),saves:uiRegression.saves()})')===before,'direct readout refresh preserves both saves '+id);continue;
   }
   await ev('var e=document.querySelector('+JSON.stringify(summary)+');e.parentElement.open=false;e.scrollIntoView({block:"center"});e.focus({preventScroll:true})');
   await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',windowsVirtualKeyCode:13});
   await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
   check(await ev('document.querySelector('+JSON.stringify(summary)+').parentElement.open'),'native keyboard opens '+id);
   const before=await ev('JSON.stringify({state:uiRegression.get(),saves:uiRegression.saves()})');
   await ev('clarityQA.render();clarityQA.render()');
   check(await ev('document.activeElement===document.querySelector('+JSON.stringify(summary)+')&&document.activeElement.parentElement.open'),'passive refresh keeps open help and keyboard focus '+id);
   check(await ev('JSON.stringify({state:uiRegression.get(),saves:uiRegression.saves()})')===before,'help refresh preserves state and both saves '+id);
  }
  records.push({width,scale,motion,status:'pass'});
 }
};
