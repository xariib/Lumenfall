'use strict';
const fs=require('node:fs'),path=require('node:path');
const {capacityReady}=require('./lab-longtail-reference.cjs');
module.exports=async function({send,ev,pause,check,records,args}){
 await send('Runtime.enable');await send('DOM.enable');
 const fresh=await ev('uiRegression.fresh()'),ei=args.indexOf('--evidence'),out=ei>=0?path.resolve(args[ei+1]):null;if(out)fs.mkdirSync(out,{recursive:true});
 function seed(){return {...JSON.parse(JSON.stringify(fresh)),maxDepthEver:40,questDay:new Date().toISOString().slice(0,10),lumen:1000000,shards:1000000,motes:100000};}
 async function install(s,open=true){await ev('uiRegression.set('+JSON.stringify(s)+');document.querySelector("[data-tab=research]").click();clarityQA.select('+(open?0:-1)+')');await ev('Promise.all(document.getElementById("tab-research").getAnimations().map(a=>a.finished)).then(()=>true)');}
 async function touch(selector){await ev('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center"})');await pause(25);const p=await ev('(()=>{var r=document.querySelector('+JSON.stringify(selector)+').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()');await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
 async function fit(){check(await ev('(()=>{var root=document.getElementById("study-list");return document.documentElement.scrollWidth<=innerWidth+1&&Array.from(root.querySelectorAll("[data-study-card=labcapacity],.study-challenges,.study-challenges li,[data-lab-slot] .lock-note")).every(e=>!e.getClientRects().length||e.scrollWidth<=e.clientWidth+1)})()'),'challenge cards and locked hints fit viewport');}
 for(const width of [320,390,430])for(const scale of [100,200])for(const motion of ['reduce','no-preference']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});await ev('document.documentElement.style.fontSize="'+scale+'%"');
  const locked=seed();await install(locked,false);
  check(await ev('uiRegression.slots()===2&&document.querySelector("[data-lab-slot=\\"2\\"] .lock-note").textContent==="Reach Rift 60"'),'early slots retain Rift milestones');
  check(await ev('document.querySelector("[data-lab-slot=\\"3\\"] .lock-note").textContent.includes("150")&&document.querySelector("[data-lab-slot=\\"4\\"] .lock-note").textContent.includes("300")'),'later slots explain different expansion goals');await fit();
  await touch('[data-study-slot="0"]');
  check(await ev('document.querySelectorAll("[data-study-capacity-challenges] li").length===4&&document.querySelector("[data-study=labcapacity]").disabled'),'four explicit goals block rich wallet');
  check(await ev('document.querySelector("[data-study-capacity-challenges]").textContent.includes("Different studies 0 / 6")'),'breadth goal clearly counts different studies');
  const before=await ev('JSON.stringify({state:uiRegression.get(),saves:uiRegression.saves()})');await touch('[data-study=labcapacity]');check(await ev('JSON.stringify({state:uiRegression.get(),saves:uiRegression.saves()})')===before,'native disabled purchase cannot change progress or money');await fit();
  if(out&&width===390&&scale===100&&motion==='reduce'){
   await ev('document.querySelector("[data-study-card=labcapacity]").scrollIntoView({block:"center"})');await pause(50);const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,'expansion-challenges-390.png'),Buffer.from(shot.data,'base64'));
  }
  const ready=capacityReady(seed(),0),almost=JSON.parse(JSON.stringify(ready));almost.maxDepthEver=149;almost.ascendCount=24;almost.longStudyLevels.wispascend--;
  await install(almost);await ev('window.expansionButton=document.querySelector("[data-study=labcapacity]");window.expansionFocus=document.querySelector("[data-study-close]");expansionFocus.focus({preventScroll:true});');
  await ev('slotChallengeQA.progress('+JSON.stringify(ready)+')');
  check(await ev('document.querySelectorAll("[data-study-capacity-challenges] [data-met=true]").length===4&&!expansionButton.disabled'),'earned goals refresh in place');
  check(await ev('document.querySelector("[data-study=labcapacity]")===expansionButton&&document.activeElement===expansionFocus'),'goal refresh keeps controls and focus');
  await ev('uiRegression.wallet(19999,2000)');check(await ev('expansionButton.disabled&&document.querySelector("#study-price-labcapacity [data-price-currency=lumen]").style.color==="var(--danger)"'),'milestones do not bypass missing Lumen');
  await ev('uiRegression.wallet(20000,1999)');check(await ev('expansionButton.disabled&&document.querySelector("#study-price-labcapacity [data-price-currency=shard]").style.color==="var(--danger)"'),'milestones do not bypass missing Shards');
  await ev('uiRegression.wallet(20000,2000)');check(await ev('!expansionButton.disabled&&expansionButton.getBoundingClientRect().height>=44'),'funded completed challenge has44px action');
  await touch('[data-study=labcapacity]');let state=await ev('uiRegression.get()');check(state.lumen===0&&state.shards===0&&state.longStudyLevels.labcapacity===0,'first expansion pays once without early reward');check(state.activeStudies.some(a=>a.id==='labcapacity'&&a.totalDurationSec===1296000),'first expansion starts fifteen-day work');check(await ev('uiRegression.slots()===3'),'first research start does not unlock fourth slot');
  await ev('uiRegression.finish();uiRegression.queue()');check(await ev('uiRegression.slots()===4&&uiRegression.get().longStudyLevels.labcapacity===1&&!uiRegression.get().activeStudies.length'),'completed first expansion earns fourth slot; next queue waits');
  const second=capacityReady(seed(),1);second.longStudyLevels.labcapacity=1;await install(second);
  check(await ev('uiRegression.plan("labcapacity").affordable&&document.querySelector("[data-study-capacity-challenges]").textContent.includes("150 / 150")'),'second expansion shows its harder completed goals');
  await touch('[data-study=labcapacity]');check(await ev('uiRegression.get().activeStudies[0].totalDurationSec===8640000&&uiRegression.slots()===4'),'second expansion starts hundred-day work without early slot');
  await ev('uiRegression.finish()');check(await ev('uiRegression.slots()===5&&uiRegression.get().longStudyLevels.labcapacity===2'),'second completion earns fifth slot');
  const legacy=seed();legacy.maxDepthEver=60;legacy.longStudyLevels.labcapacity=2;await install(legacy);
  check(await ev('uiRegression.slots()===5&&document.querySelector("[data-study-card=labcapacity]").dataset.state==="maxed"&&!document.querySelector("[data-study=labcapacity]")'),'older earned slots remain despite unmet new goals');
  const busy=capacityReady(seed(),0);busy.activeStudies=['wispascend','guardmastery','lumenstudy'].map((id,slot)=>({id,slot,remainingSec:100,totalDurationSec:200,speedMult:1}));await install(busy);
  await ev('uiRegression.wallet(1000000,1000000)');check(await ev('!document.querySelector("[data-study=labcapacity]").disabled'),'live refresh permits selected-slot replacement when all three Labs are busy');
  await touch('[data-study=labcapacity]');check(await ev('uiRegression.get().activeStudies.length===3&&uiRegression.get().activeStudies.some(a=>a.id==="labcapacity"&&a.slot===0)&&uiRegression.get().pausedStudies.some(a=>a.id==="wispascend"&&a.remainingSec===100&&a.totalDurationSec===200)'),'starting expansion in a busy Lab preserves the replaced paid work');
  await fit();const ax=await send('Accessibility.getFullAXTree');check(ax.nodes.some(n=>!n.ignored&&n.name&&/Expanded Apparatus/.test(n.name.value)),'expansion remains in accessibility tree');records.push({width,scale,motion,status:'pass'});
 }
};
