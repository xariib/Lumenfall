'use strict';
module.exports=async function({send,ev,pause,check,records,args}){
 const fs=require('node:fs'),path=require('node:path');
 const seed=await ev('uiRegression.fresh()');seed.maxDepthEver=1000000;seed.lumen=seed.shards=1e12;seed.motes=100000;seed.prisms=10000;seed.questDay=new Date().toISOString().slice(0,10);seed.longStudyLevels.labcapacity=2;
 seed.activeStudies=['wispascend','wispdamage','lumenstudy','guardmastery','critstudy'].map((id,slot)=>({id,slot,remainingSec:120000,totalDurationSec:240000,speedMult:1.5}));
 async function tab(name){await ev('document.querySelector('+JSON.stringify('[data-tab="'+name+'"]')+').click()');await ev('Promise.all(document.querySelector(".tab-panel.active").getAnimations().map(a=>a.finished)).then(()=>true)');}
 async function shot(name){if(args.includes('--evidence')){const out=path.resolve(args[args.indexOf('--evidence')+1]);fs.mkdirSync(out,{recursive:true});const r=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(r.data,'base64'));}}
 for(const width of [320,390,430])for(const scale of [100,200])for(const motion of ['reduce','no-preference']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});await ev('document.documentElement.style.fontSize="'+scale+'%";uiRegression.set('+JSON.stringify(seed)+')');
  await tab('battle');check(await ev('["bond-summary","rift-cosmetic-name"].every(id=>{var e=document.getElementById(id);return !e||!e.getClientRects().length})'),'Rift omits theme text and Formation Bond names');
  for(const name of ['spirits','forge','research','ascend','deeds']){
   await tab(name);
   check(await ev('Array.from(document.querySelectorAll(".hud .lbl")).every(e=>{var s=getComputedStyle(e),r=e.getBoundingClientRect();return s.position!=="absolute"&&s.visibility!=="hidden"&&r.width>1&&e.scrollWidth<=e.clientWidth+1})'),'visible unclipped currency names on '+name);
   if(name==='deeds')check(await ev('!document.querySelector("#ach-list [data-card-details^=deed-history],#ach-list [data-deed-history]")&&document.querySelectorAll("#ach-list [data-deed-bar]").length===17'),'one advancing Deed bar without milestone dropdown');
   if(name==='research'){
    const layout=await ev('Array.from(document.querySelectorAll(".study-running")).map(c=>{var q=c.querySelector("[data-study-queue]"),b=c.querySelector(".study-bar-track"),s=c.querySelector("[data-study-speed-open]");if(!q||!s)return {skip:true};var qr=q.getBoundingClientRect(),br=b.getBoundingClientRect(),sr=s.getBoundingClientRect(),t=b.querySelector(".study-time");return {q:qr.toJSON(),b:br.toJSON(),s:sr.toJSON(),timer:[t.scrollWidth,t.clientWidth],bar:[b.scrollWidth,b.clientWidth],named:q.getAttribute("aria-pressed")!==null&&s.getAttribute("aria-label").includes("Speed Up")}})');
    check(layout.every(({skip,q,b,s,timer,bar,named})=>skip||q.width>=44&&q.height>=44&&s.width>=44&&s.height>=44&&q.right<=b.left+1&&b.right<=s.left+1&&b.height<96&&Math.abs(q.top-s.top)<2&&timer[0]<=timer[1]+1&&bar[0]<=bar[1]+1&&named),'compact Lab Queue / timer / Speed Up row with named44px targets '+JSON.stringify({width,scale,layout}));
    if(width===390&&motion==='reduce'){await ev('document.querySelector("main").scrollTop=0');await shot('compact-lab-'+scale);}
   }
   const scroll=await ev('(()=>{var m=document.querySelector("main");m.scrollTop=147;return {top:m.scrollTop,max:m.scrollHeight-m.clientHeight}})()');check(scroll.max>0,'scrollable fixture for '+name);
   await tab('battle');await tab(name);
   check(await ev('Math.abs(document.querySelector("main").scrollTop-'+scroll.top+')<=1'),'return restores independent offset for '+name);
   await ev('var m=document.querySelector("main");m.scrollTop=m.scrollHeight');await tab('battle');await tab(name);
   check(await ev('(()=>{var m=document.querySelector("main");return Math.abs(m.scrollHeight-m.clientHeight-m.scrollTop)<=2})()'),'return restores bottom for '+name);
  }
  // Forge and Lab keep separate positions through the shared Workshop button.
  await tab('forge');await ev('document.querySelector("main").scrollTop=document.querySelector("main").scrollHeight');await tab('battle');
  await ev('var e=document.createElement("div");e.id="menu-growth-fixture";e.style.height="180px";document.getElementById("tab-forge").appendChild(e)');await tab('forge');
  check(await ev('(()=>{var m=document.querySelector("main");return Math.abs(m.scrollHeight-m.clientHeight-m.scrollTop)<=2})()'),'remembered bottom follows content growth while away');await ev('document.getElementById("menu-growth-fixture").remove()');
  await tab('forge');await ev('document.querySelector("main").scrollTop=71;window.forgeMenuTop=document.querySelector("main").scrollTop');await tab('research');await ev('document.querySelector("main").scrollTop=125;window.labMenuTop=document.querySelector("main").scrollTop');await tab('forge');check(await ev('document.querySelector("main").scrollTop===forgeMenuTop'),'Forge subsection keeps its own offset');await tab('battle');await tab('workshop');check(await ev('document.getElementById("tab-forge").classList.contains("active")&&document.querySelector("main").scrollTop===forgeMenuTop'),'Workshop returns to last subsection and its scroll');await tab('research');check(await ev('document.querySelector("main").scrollTop===labMenuTop'),'Lab subsection keeps its own offset');
  const before=await ev('JSON.stringify({state:uiRegression.get(),saves:uiRegression.saves()})');await tab('battle');await tab('research');await ev('uiRegression.render();uiRegression.render()');check(await ev('document.querySelector("main").scrollTop===labMenuTop'),'passive Lab refresh retains restored offset');check(await ev('JSON.stringify({state:uiRegression.get(),saves:uiRegression.saves()})')===before,'navigation and refresh preserve game and both saves');
  check(await ev('document.documentElement.scrollWidth<=innerWidth+1'),'menu chrome fits viewport');records.push({menus:true,width,scale,motion,status:'pass'});
 }
};
