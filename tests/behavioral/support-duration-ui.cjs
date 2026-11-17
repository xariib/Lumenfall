'use strict';
const fs=require('node:fs'),path=require('node:path');
module.exports=async function({send,ev,pause,check,records,args}){
 await send('Runtime.enable');await send('DOM.enable');
 const fresh=await ev('uiRegression.fresh()'),at=args.indexOf('--evidence'),evidence=at<0?null:path.resolve(args[at+1]);
 if(evidence)fs.mkdirSync(evidence,{recursive:true});
 async function install(s){await ev('uiRegression.set('+JSON.stringify(s)+');document.querySelector("[data-tab=research]").click();clarityQA.select(0)');await ev('Promise.all(document.getElementById("tab-research").getAnimations().map(a=>a.finished)).then(()=>true)');}
 async function touch(selector){
  await ev('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center"});new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
  // The whole research card is the action; enlarged text can make it taller
  // than the viewport. Require a44px visible intersection around a real hit.
  const frame=await send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});
  const hit=await ev('(()=>{var e=document.querySelector('+JSON.stringify(selector)+'),r=e.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2,h=document.elementFromPoint(x,y);return{x,y,width:r.width,height:r.height,visible:Math.min(r.right,innerWidth)-Math.max(r.left,0)>=44&&Math.min(r.bottom,innerHeight)-Math.max(r.top,0)>=44&&x>=0&&x<innerWidth&&y>=0&&y<innerHeight,hit:!!h&&(h===e||e.contains(h))}})()');
  if(evidence){fs.writeFileSync(path.join(evidence,'last-native-target.json'),JSON.stringify({selector,hit},null,2));fs.writeFileSync(path.join(evidence,'last-native-target.png'),Buffer.from(frame.data,'base64'));}
  check(hit.visible&&hit.hit&&hit.width>=44&&hit.height>=44,'presented Support purchase target is visible, hittable and44px '+JSON.stringify(hit));
  await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:hit.x,y:hit.y}]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(20);
 }
 for(const width of [320,390,430])for(const scale of [100,200])for(const motion of ['reduce','no-preference']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});await ev('document.documentElement.style.fontSize="'+scale+'%"');
  const s=JSON.parse(JSON.stringify(fresh));s.maxDepthEver=500;s.longStudyLevels.wispdamage=50;s.longStudyLevels.ultimateanalysis=5;s.questDay=new Date().toISOString().slice(0,10);
  s.lumen=s.shards=0;await install(s);
  const inspect=await ev('(()=>{var c=document.querySelector("[data-study-card=supportduration]"),b=c.querySelector("[data-study]"),p=c.querySelector(".study-meta");return {text:c.textContent,disabled:b.disabled,red:Array.from(p.querySelectorAll("[data-price-currency]")).filter(e=>e.style.color==="var(--danger)").length,overflow:c.scrollWidth>c.clientWidth+1,height:b.getBoundingClientRect().height};})()');
  check(inspect.disabled&&inspect.red===2,'both missing prices red and purchase disabled');check(!inspect.overflow,'Support research fits mobile and large text');check(inspect.height>=44,'Support start has44px target');
  check(inspect.text.includes('45 days')&&inspect.text.includes('level 8')&&inspect.text.includes('360')&&inspect.text.includes('13s')&&inspect.text.includes('6s'),'duration growth and minimum-time tradeoff visible');
  if(evidence&&width===390&&scale===100&&motion==='reduce'){await ev('document.querySelector("[data-study-card=supportduration]").scrollIntoView({block:"center"})');await pause(50);const image=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(evidence,'support-endurance-390.png'),Buffer.from(image.data,'base64'));}
  await ev('uiRegression.wallet(100000000000,100000000000)');check(await ev('!document.querySelector("[data-study=supportduration]").disabled'),'funding refreshes real purchase');
  const before=await ev('uiRegression.get()');await touch('[data-study=supportduration]');const after=await ev('uiRegression.get()');
  check(after.activeStudies.some(a=>a.id==='supportduration'&&a.totalDurationSec===55542858),'real native touch starts long paid work');
  check(after.lumen===before.lumen-5000000000&&after.shards===before.shards-200000000,'exact actual research payment');check(after.longStudyLevels.supportduration===0,'no early duration from purchase');
  const paid=after.activeStudies;await ev('uiRegression.save();uiRegression.load()');check(JSON.stringify((await ev('uiRegression.get()')).activeStudies)===JSON.stringify(paid),'reload retains actual paid work');
  for(const level of [0,1,2,7,8,10]){
   const state=JSON.parse(JSON.stringify(s));state.longStudyLevels.supportduration=level;state.research.charge=10;state.spirits.tide=state.spirits.aurora=100;state.activeParty=['tide','aurora'];state.wispUltimate.tide=state.wispUltimate.aurora=true;state.heroRarity.tide=state.heroRarity.aurora=5;
   await ev('uiRegression.set('+JSON.stringify(state)+');document.querySelector("[data-tab=spirits]").click()');await ev('Promise.all(document.getElementById("tab-spirits").getAnimations().map(a=>a.finished)).then(()=>true)');
   const duration=3+.3*level;
   for(const id of ['tide','aurora'])check(await ev('document.querySelector("[data-wisp-card='+id+'] .ability-desc").textContent.includes("for '+duration+'s")'),'real Wisp description follows earned duration '+id+'/'+level);
   if(evidence&&width===390&&scale===100&&motion==='reduce'&&level===8){await ev('document.querySelector("[data-wisp-card=tide]").scrollIntoView({block:"center"})');await pause(50);const image=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(evidence,'tide-earned-duration-390.png'),Buffer.from(image.data,'base64'));}
  }
  records.push({width,scale,motion,inspect});
 }
};
