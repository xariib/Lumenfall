'use strict';
const fs=require('node:fs'),path=require('node:path');
module.exports=async function({send,ev,pause,check,records,args}){
 await send('Runtime.enable');await send('DOM.enable');
 const fresh=await ev('uiRegression.fresh()'),ids=['wispdamage','wispcritchance','wispcritdamage'];
 const evidenceIndex=args.indexOf('--evidence'),evidence=evidenceIndex>=0?path.resolve(args[evidenceIndex+1]):null;
 if(evidence)fs.mkdirSync(evidence,{recursive:true});
 async function install(s){await ev('uiRegression.set('+JSON.stringify(s)+');document.querySelector("[data-tab=research]").click();clarityQA.select(0)');await ev('Promise.all(document.getElementById("tab-research").getAnimations().map(a=>a.finished)).then(()=>true)');}
 async function touch(selector){await ev('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center"})');await pause(25);const p=await ev('(()=>{var r=document.querySelector('+JSON.stringify(selector)+').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()');await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
 for(const width of [320,390,430])for(const scale of [100,200])for(const motion of ['reduce','no-preference']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});await ev('document.documentElement.style.fontSize="'+scale+'%"');
  const s=JSON.parse(JSON.stringify(fresh));Object.assign(s,{maxDepthEver:250,questDay:new Date().toISOString().slice(0,10),lumen:0,shards:0,motes:100000});await install(s);
  for(const id of ids){
   const result=await ev('(()=>{var c=document.querySelector("[data-study-card='+id+']"),b=c.querySelector("[data-study]"),p=c.querySelector(".study-meta");return {text:c.textContent,disabled:b.disabled,red:Array.from(p.querySelectorAll("[data-price-currency]")).filter(e=>e.style.color==="var(--danger)").length,overflow:c.scrollWidth>c.clientWidth+1,rect:b.getBoundingClientRect().height}})()');
   check(result.text.includes('/ 100'),'100-level basic research '+id);check(result.disabled,'unfunded basic research disabled '+id);check(!result.overflow,'card fits viewport '+id);check(result.rect>=44,'touch target44px '+id);
   check(result.red===2,'both missing currencies red '+id);
  }
  check(await ev('document.querySelector("[data-study-card=wispcritchance]").textContent.includes("averaged")&&document.querySelector("[data-study-card=wispcritdamage]").textContent.includes("needs Critical Chance")'),'critical scope and prerequisite visible');
  await ev('uiRegression.wallet(1000000,1000000)');check(await ev('!document.querySelector("[data-study=wispdamage]").disabled'),'live funding enables damage research');
  const before=await ev('uiRegression.get()');await touch('[data-study=wispdamage]');const after=await ev('uiRegression.get()');
  check(after.activeStudies.some(a=>a.id==='wispdamage'&&a.totalDurationSec===240),'native touch starts first damage level with short work');check(after.lumen===before.lumen-1000&&after.shards===before.shards-80,'single exact purchase');check(after.longStudyLevels.wispdamage===0,'purchase does not give early damage');
  s.lumen=s.shards='1e400';s.longStudyLevels.wispdamage=99;await install(s);
  check(await ev('uiRegression.plan("wispdamage").duration>86400*100'),'late research displays substantial work');
  check(await ev('document.querySelector("[data-study-card=wispdamage]").textContent.includes("99 / 100")'),'late progress readable');
  if(evidence&&width===390&&scale===100&&motion==='reduce'){
   await ev('document.querySelector("[data-study-card=wispdamage]").scrollIntoView({block:"center"})');await pause(50);const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(evidence,'wisp-research-390.png'),Buffer.from(shot.data,'base64'));
  }
  s.longStudyLevels.wispdamage=100;s.longStudyLevels.wispcritchance=100;s.longStudyLevels.wispcritdamage=100;await install(s);
  for(const id of ids)check(await ev('(()=>{var c=document.querySelector("[data-study-card='+id+']");return c.dataset.state==="maxed"&&!c.querySelector("button")&&!c.querySelector(".study-meta")&&c.textContent.includes("Current:")})()'),'maxed basic research keeps earned effect only '+id);
  const ax=await send('Accessibility.getFullAXTree');check(ax.nodes.some(n=>!n.ignored&&n.name&&/Wisp Critical Chance/.test(n.name.value)),'basic research in accessibility tree');
  check(await ev('document.documentElement.scrollWidth<=window.innerWidth+1'),'page fits viewport');records.push({width,scale,motion,status:'pass'});
 }
};
