'use strict';
const fs=require('node:fs'),path=require('node:path'),{rules,ready}=require('./lab-access-reference.cjs');
module.exports=async function({send,ev,pause,check,records,args}){
 await send('Runtime.enable');await send('DOM.enable');
 const fresh=await ev('uiRegression.fresh()'),i=args.indexOf('--evidence'),evidence=i<0?null:path.resolve(args[i+1]);
 if(evidence)fs.mkdirSync(evidence,{recursive:true});
 async function install(s){await ev('uiRegression.set('+JSON.stringify(s)+');document.querySelector("[data-tab=research]").click();clarityQA.select(0)');await ev('Promise.all(document.getElementById("tab-research").getAnimations().map(a=>a.finished)).then(()=>true)');}
 for(const width of [320,390,430])for(const scale of [100,200])for(const motion of ['reduce','no-preference']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});await ev('document.documentElement.style.fontSize="'+scale+'%"');
  for(const [id,rule]of Object.entries(rules)){
   const s=ready(JSON.parse(JSON.stringify(fresh)),id);s.maxDepthEver=rule.depth;s.lumen=s.shards='1e100';s.questDay=new Date().toISOString().slice(0,10);
   for(const missing of ['depth',...Object.keys(rule.studies)]){
    const blocked=JSON.parse(JSON.stringify(s));if(missing==='depth')blocked.maxDepthEver--;else blocked.longStudyLevels[missing]--;
    await install(blocked);
    const seen=await ev('(()=>{var c=document.querySelector("[data-study-card='+id+']");return {text:c.textContent,state:c.dataset.state,buttons:c.querySelectorAll("button").length,overflow:c.scrollWidth>c.clientWidth+1,aria:c.getAttribute("aria-disabled")};})()');
    check(seen.state==='locked'&&seen.buttons===0&&seen.aria==='true','locked card cannot start '+id+'/'+missing);
    check(seen.text.includes('Rift '+blocked.maxDepthEver+' / '+rule.depth),'new Rift requirement visible '+id);
    for(const [key,target]of Object.entries(rule.studies)){const def=await ev('uiRegression.defs().find(n=>n.id==='+JSON.stringify(key)+').name');check(seen.text.includes(def+' Lv. '+blocked.longStudyLevels[key]+' / '+target),'prerequisite progress visible '+id+'/'+key);}
    check(!seen.overflow,'locked requirements fit '+width+'/'+scale+'/'+id);
   }
   await install(s);check(await ev('!document.querySelector("[data-study='+id+']").disabled'),'all earned requirements enable '+id);
   // The actual purchase handler is exercised by trusted touch, one card per
   // profile; other projects are checked through the same production plan.
   if(id==='wispdamage'){
    const selector='[data-study='+id+']';await ev('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center"})');await pause(30);
    const p=await ev('(()=>{var r=document.querySelector('+JSON.stringify(selector)+').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()');
    await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    check(await ev('uiRegression.get().activeStudies.some(n=>n.id==="wispdamage")'),'native touch starts earned research');
   }
  }
  const s=JSON.parse(JSON.stringify(fresh));s.maxDepthEver=25;s.lumen=s.shards=0;s.longStudyLevels.wispascend=4;await install(s);
  if(evidence&&width===390&&scale===100&&motion==='reduce'){
   await ev('document.querySelector("[data-study-card=wispdamage]").scrollIntoView({block:"center"})');await pause(30);const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(evidence,'lab-earned-access-390.png'),Buffer.from(shot.data,'base64'));
  }
  check(await ev('document.documentElement.scrollWidth<=window.innerWidth+1'),'page fits viewport');records.push({width,scale,motion,projects:Object.keys(rules).length,status:'pass'});
 }
};
