'use strict';
const fs=require('node:fs'),path=require('node:path');
const {tracks,singles}=require('./deeds-progressive.cjs');
module.exports=async function({send,ev,pause,check,records,args}){
 const fresh=await ev('uiRegression.fresh()'),keys=Object.keys(tracks).concat(singles);
 async function install(s){await ev('uiRegression.set('+JSON.stringify(s)+');document.querySelector("[data-tab=deeds]").click()');await ev('Promise.all(document.getElementById("tab-deeds").getAnimations().map(a=>a.finished)).then(()=>true)');}
 function seed(){return {...JSON.parse(JSON.stringify(fresh)),questDay:new Date().toISOString().slice(0,10)};}
 async function exactCards(){check(await ev('Array.from(document.querySelectorAll("[data-deed-series]")).map(e=>e.dataset.deedSeries).sort().join(",")')===keys.slice().sort().join(','),'each distinct Deed series has exactly one card');check(await ev('document.querySelectorAll("#ach-list [role=progressbar]").length===17&&!document.querySelector("#ach-list .dot")'),'every Deed has one progress bar instead of a checkbox marker');}
 const rift=seed();rift.maxDepthEver=9;await install(rift);
 check(await ev('document.querySelector("[data-deed-bar=rift]").getAttribute("aria-valuenow")==="9"&&document.querySelector("[data-deed-bar=rift]").getAttribute("aria-valuemax")==="10"'),'Rift bar starts with the existing9/10 goal');
 rift.maxDepthEver=10;await install(rift);await ev('clarityQA.check();clarityQA.render()');await exactCards();
 check(await ev('(()=>{var c=document.querySelector("[data-deed-series=rift]"),b=c.querySelector("[data-deed-bar]");return c.dataset.deed==="d25"&&b.getAttribute("aria-valuenow")==="10"&&b.getAttribute("aria-valuemax")==="25"&&b.firstElementChild.style.width==="40%"&&c.querySelector(".reward").textContent.trim().startsWith("+10")&&uiRegression.get().comets===5;})()'),'Rift10 earns5 Comets and rolls the same series to10/25 for10 Comets');
 if(args.includes('--evidence')){
  const dir=path.resolve(args[args.indexOf('--evidence')+1]);fs.mkdirSync(dir,{recursive:true});await ev('document.querySelector("[data-deed-series=rift]").scrollIntoView({block:"start"})');const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(dir,'rift10-next25.png'),Buffer.from(shot.data,'base64'));
 }
 // The real foreground scheduler updates the existing bar between milestones.
 const live=seed();live.totalTaps=50;live.achieved.autotap=true;await install(live);
 await ev('window.deedLiveCard=document.querySelector("[data-deed-series=strikes]");window.uiRegressionPaused=false');await pause(1400);
 const liveResult=await ev('(()=>{var c=document.querySelector("[data-deed-series=strikes]"),b=c.querySelector("[data-deed-bar]");return {same:c===window.deedLiveCard,total:uiRegression.get().totalTaps,current:Number(b.getAttribute("aria-valuenow")),target:Number(b.getAttribute("aria-valuemax"))};})()');await ev('window.uiRegressionPaused=true');
 check(liveResult.same&&liveResult.total>50&&liveResult.current===liveResult.total&&liveResult.target===100,'normal live ticks advance the same strike bar before its milestone');
 // Earn the exact target through production eligibility, then keep the total
 // and show the existing next goal/reward in the same card position.
 const rollover=seed();rollover.totalTaps=99;await install(rollover);
 check(await ev('document.querySelector("[data-deed-bar=strikes]").getAttribute("aria-valuenow")==="99"'),'strike bar approaches100');
 rollover.totalTaps=100;await install(rollover);await ev('clarityQA.check();clarityQA.render()');await exactCards();
 check(await ev('(()=>{var c=document.querySelector("[data-deed-series=strikes]"),b=c.querySelector("[data-deed-bar]");return c.dataset.deed==="tap1000"&&b.getAttribute("aria-valuenow")==="100"&&b.getAttribute("aria-valuemax")==="1000"&&b.firstElementChild.style.width==="10%"&&c.querySelector(".reward").textContent.trim().startsWith("+8");})()'),'100/100 rolls to100/1000 with a larger reward and retained cumulative total');
 // Every existing milestone, including long-tail goals, advances in that card.
 for(const [key,ids]of Object.entries(tracks))for(let n=0;n<=ids.length;n++){
  const s=seed();ids.slice(0,n).forEach(id=>s.achieved[id]=true);await install(s);await exactCards();
  const selector=JSON.stringify('[data-deed-series="'+key+'"]');
  const result=await ev('(()=>{var c=document.querySelector('+selector+');return {id:c.dataset.deed,state:c.dataset.state,history:Array.from(c.querySelectorAll("[data-deed-history]")).map(e=>e.dataset.deedHistory),progress:c.querySelectorAll(".info > [data-deed-progress]").length,reward:c.querySelector(".reward").textContent}})()');
  const next=ids[Math.min(n,ids.length-1)];check(result.id===next&&result.state===(n===ids.length?'completed':'available'),'next target and completion for '+key+'/'+n);
  check(result.progress===1,'one primary progress counter for '+key+'/'+n);
  check(await ev('(()=>{var c=document.querySelector('+selector+'),p=c.querySelector(".info > [data-deed-progress]"),b=c.querySelector("[data-deed-bar]");return c.querySelectorAll("[data-deed-bar]").length===1&&Number(b.getAttribute("aria-valuenow"))>=0&&Number(b.getAttribute("aria-valuenow"))<=Number(b.getAttribute("aria-valuemax"))&&b.clientWidth>0&&b.clientHeight>=6;})()'),'one valid visible bar at every '+key+' milestone');
  check(result.history.join(',')===ids.slice(0,n).filter(id=>id!==next).join(','),'earned milestones share the same card history '+key+'/'+n);
  const reward=await ev('clarityQA.deeds().find(a=>a.id==='+JSON.stringify(next)+').reward');check(result.reward.trim().startsWith('+'+reward),'reward follows active milestone '+key+'/'+n);
 }
 // The shared paid-level counter keeps its explanation and native disclosure
 // identity when the next Forge goal replaces the original60-level milestone.
 const forge=seed();await install(forge);
 await ev('document.querySelector("[data-card-details=deed-labqueue]").open=true;document.querySelector("[data-card-details-summary=deed-labqueue]").focus({preventScroll:true})');
 forge.achieved.labqueue=true;await install(forge);
 check(await ev('document.querySelector("[data-deed-series=forge]").dataset.deed==="endless_forge_100"&&document.querySelector("[data-card-details=deed-labqueue]").textContent.includes("all current and historical Forge upgrades")'),'next Forge milestone retains paid-level counting scope');
 check(await ev('document.activeElement===document.querySelector("[data-card-details-summary=deed-labqueue]")&&document.activeElement.parentElement.open'),'advancing Forge goal preserves open Details and keyboard focus');
 for(const width of [320,390,430])for(const scale of [100,150,200])for(const motion of ['reduce','no-preference']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});await ev('document.documentElement.style.fontSize="'+scale+'%"');
  const s=seed();s.maxDepthEver=55;['d10','d25','d50'].forEach(id=>s.achieved[id]=true);s.totalTaps=4286;s.achieved.tap100=s.achieved.tap1000=true;await install(s);await exactCards();
  check(await ev('document.querySelector("[data-deed-series=rift]").dataset.deed==="d100"&&document.querySelector("[data-deed-series=strikes] [data-deed-progress=tap10000]").textContent==="4,286 / 10,000 strikes"'),'next Rift and exact next strike target fit same cards');
  check(await ev('(()=>{var b=document.querySelector("[data-deed-bar=strikes]");return b.getAttribute("aria-valuenow")==="4286"&&b.getAttribute("aria-valuemax")==="10000"&&Math.abs(parseFloat(b.firstElementChild.style.width)-42.86)<0.001;})()'),'strike bar uses retained total over the next existing target');
  const summary='[data-card-details-summary="deed-history-rift"]';
  await ev('document.querySelector('+JSON.stringify(summary)+').parentElement.open=false;document.querySelector('+JSON.stringify(summary)+').scrollIntoView({block:"center"});document.querySelector('+JSON.stringify(summary)+').focus({preventScroll:true})');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',windowsVirtualKeyCode:13});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  check(await ev('document.querySelector('+JSON.stringify(summary)+').parentElement.open'),'native keyboard opens completed history');
  const before=await ev('JSON.stringify({state:uiRegression.get(),saves:uiRegression.saves()})');await ev('clarityQA.render();clarityQA.render()');
  check(await ev('document.activeElement===document.querySelector('+JSON.stringify(summary)+')&&document.activeElement.parentElement.open'),'history focus and disclosure survive pure refresh');check(await ev('JSON.stringify({state:uiRegression.get(),saves:uiRegression.saves()})')===before,'rendering preserves full state and both save slots');
  check(await ev('document.querySelector("[data-deed-history=d25]").textContent.includes("Lab: Procurement")&&document.querySelector("[data-deed-history=d50]").textContent.includes("Collection: Ember Veil")'),'earned unlocks remain readable inside history');
  check(await ev('document.documentElement.scrollWidth<=innerWidth+1&&Array.from(document.querySelectorAll("#ach-list .ach-card,#ach-list .reward,#ach-list [data-deed-history],#ach-list summary")).filter(e=>e.getClientRects().length).every(e=>{var r=e.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1})'),'cards, rewards and open history stay within mobile viewport');
  check(await ev('Array.from(document.querySelectorAll("#ach-list summary")).every(e=>e.getBoundingClientRect().height>=44)'),'disclosure retains practical touch target');
  // Advancing an earned milestone while its history is focused keeps the same
  // series disclosure. Receipt/eligibility checks run through production code.
  await ev('(()=>{var s=uiRegression.get();s.maxDepthEver=1000;uiRegression.set(s);document.querySelector('+JSON.stringify(summary)+').focus({preventScroll:true});clarityQA.check();clarityQA.render()})()');
  check(await ev('document.querySelector("[data-deed-series=rift]").dataset.deed==="endless_rift_2500"&&document.activeElement===document.querySelector('+JSON.stringify(summary)+')&&document.activeElement.parentElement.open'),'catch-up advances multiple targets while preserving history focus');
  await ev('uiRegression.save();uiRegression.load()');check(await ev('document.querySelector("[data-deed-series=rift]").dataset.deed==="endless_rift_2500"'),'reload keeps advancing card');
  if(width===320&&scale===200&&motion==='reduce'&&args.includes('--evidence')){
   const dir=path.resolve(args[args.indexOf('--evidence')+1]);fs.mkdirSync(dir,{recursive:true});await ev('document.querySelector("main").scrollTop=0');await pause(30);const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(dir,'deeds-320-200.png'),Buffer.from(shot.data,'base64'));
  }
  records.push({deeds:true,width,scale,motion,status:'pass'});
 }
 // At an inexactly creditable wallet the old reward remains visibly due even
 // though the main card has moved to its next milestone.
 const pending=seed();pending.comets=1e100;pending.achieved.d10=true;pending.cometClaims.deeds.d10=true;await install(pending);
 check(await ev('document.querySelector("[data-deed-series=rift]").dataset.deed==="d25"&&document.querySelector("[data-deed-series=rift] [data-deed-credit-state=due]").textContent.includes("5 Comets preserved")&&document.querySelector("[data-deed-history=d10]").textContent.includes("Reward pending")'),'earlier pending credit remains visible beside the next milestone');
 const composite=seed();composite.ascendCount=100;await install(composite);
 check(await ev('document.querySelector("[data-deed-bar=autotap]").getAttribute("aria-valuenow")==="0"'),'multi-condition Deed bar cannot appear complete while other required counters are unmet');
};
