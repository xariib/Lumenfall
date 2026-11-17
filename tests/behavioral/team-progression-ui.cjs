'use strict';
// Runs in the mandatory existing real-browser contribution lane, preserving
// its original assertions. No new workflow permission or gate is required.
const fs=require('node:fs'),path=require('node:path');
module.exports=async function({send,ev,ok,pause,out,suppressTouch=false}){
 const user=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/team-progression-user-save.json'))),profiles=[],nativeTouches=[];
 async function tab(name){await ev('document.querySelector("[data-tab='+name+']").click()');await ev('Promise.all(document.getElementById("tab-'+(name==='rift'?'battle':name)+'").getAnimations().map(a=>a.finished)).then(()=>true)');}
 async function touch(selector){
  await ev('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center"})');await pause(40);
  // Sample the target after Chrome has presented the scrolled surface. A CDP
  // input acknowledgement alone does not establish the next painted UI state.
  const surface=await send('Page.captureScreenshot',{format:'png'});fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'team-native-last-surface.png'),Buffer.from(surface.data,'base64'));
  const r=await ev('(()=>{var e=document.querySelector('+JSON.stringify(selector)+'),r=e.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2,hit=document.elementFromPoint(x,y);return {x,y,width:r.width,height:r.height,visible:x>=0&&x<innerWidth&&y>=0&&y<innerHeight,hit:!!hit&&(hit===e||e.contains(hit))};})()');
  ok(r.visible&&r.hit,'native touch point is visible and hits its intended control '+selector);ok(r.width>=44&&r.height>=44,'native touch target retains44px '+selector);
  if(!suppressTouch){await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:r.x,y:r.y}]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
  await ev('new Promise(function(resolve){requestAnimationFrame(function(){resolve(true);});})');
  nativeTouches.push({selector,point:r,suppressed:suppressTouch,detailsOpen:await ev('!!document.querySelector("[data-wisp-damage=ember] details")&&document.querySelector("[data-wisp-damage=ember] details").open')});
  fs.writeFileSync(path.join(out,'team-native-inputs.json'),JSON.stringify(nativeTouches,null,2));
 }
 async function shot(name){const image=await send('Page.captureScreenshot',{format:'png'});fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(image.data,'base64'));}
 for(const width of [320,390,430])for(const scale of [100,200])for(const motion of ['reduce','no-preference']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});
  const s=JSON.parse(JSON.stringify(user));s.lastSeen=Date.now();s.offlineClockHighWaterMs=s.lastSeen;s.supportBuffs=null;s.supportRecastUntil={tide:0,aurora:0};
  await ev('roleQa.set('+JSON.stringify(s)+');roleQa.render();document.documentElement.style.fontSize="'+scale+'%"');await tab('spirits');
  const base=await ev('roleQa.damage("ember")');await ev('roleQa.rift();roleQa.readout()');
  ok(await ev('document.querySelector("[data-wisp-current-dps=ember]").textContent.replace(" DPS","")===document.querySelector("[data-rift-wisp=ember] .rift-wisp-power").textContent.replace("/s","")'),'same visible damage before Support '+width+'/'+scale);
  await ev('roleQa.cast("tide");roleQa.rift();roleQa.readout()');const boosted=await ev('roleQa.damage("ember")');
  ok(Math.abs(boosted.current/base.current-1.3)<1e-10,'actual Tide adds displayed30%');ok(boosted.base===base.base,'base DPS stays stable');ok(boosted.ability===base.ability,'ability hit stays separate');
  ok(await ev('document.querySelector("[data-wisp-current-dps=ember]").textContent.replace(" DPS","")===document.querySelector("[data-rift-wisp=ember] .rift-wisp-power").textContent.replace("/s","")'),'same visible damage during Support');
  const summary='[data-wisp-damage=ember] summary';await touch(summary);ok(await ev('document.querySelector("[data-wisp-damage=ember] details").open'),'real touch opens damage details');
  const inspection=await ev('(()=>{var root=document.querySelector("[data-wisp-damage=ember]"),before=JSON.stringify(roleQa.get()),summary=root.querySelector("summary");summary.focus({preventScroll:true});var top=summary.getBoundingClientRect().top;roleQa.readout();return {fit:Array.from(root.querySelectorAll("p,dt,dd,summary")).every(function(n){var r=n.getBoundingClientRect();return n.scrollWidth<=n.clientWidth+1&&r.left>=-1&&r.right<=innerWidth+1;}),focus:document.activeElement===summary,top:Math.abs(summary.getBoundingClientRect().top-top),pure:before===JSON.stringify(roleQa.get()),text:root.textContent,rect:summary.getBoundingClientRect().height,errors:roleErrors};})()');
  ok(inspection.fit,'damage details fit mobile/large text '+JSON.stringify({width,scale,inspection}));ok(inspection.focus&&inspection.top<1&&inspection.pure,'live damage updates retain nodes/focus/scroll and are read-only');ok(inspection.rect>=44,'damage disclosure is44px target');
  for(const label of ['Base','Wisp Power','Passive upgrades','Rift damage Bonds','Current Support','Ability per cast','Next Empower'])ok(inspection.text.includes(label),'visible damage label '+label);
  const refresh=await ev('(()=>{var summary=document.querySelector("[data-damage-details=ember]"),top=summary.getBoundingClientRect().top;roleQa.render();var next=document.querySelector("[data-damage-details=ember]");return {open:next.parentNode.open,focus:document.activeElement===next,shift:Math.abs(next.getBoundingClientRect().top-top)};})()');
  ok(refresh.open&&refresh.focus&&refresh.shift<1,'full combat/purchase refresh preserves damage disclosure, keyboard focus and scroll');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',windowsVirtualKeyCode:13});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});ok(await ev('!document.querySelector("[data-wisp-damage=ember] details").open'),'keyboard closes damage details');
  if(width===390&&scale===100&&motion==='reduce'){await ev('document.querySelector("[data-wisp-card=ember]").scrollIntoView({block:"start"})');await shot('team-ember-390');}
  await tab('battle');await ev('roleQa.rift()');
  const riftFit=await ev('Array.from(document.querySelectorAll(".rift-wisp-power")).every(function(n){var r=n.getBoundingClientRect();return n.scrollWidth<=n.clientWidth+1&&r.left>=-1&&r.right<=innerWidth+1;})');ok(riftFit,'Rift DPS fits supplied formation '+width+'/'+scale);
  // Six developed Wisps expose width problems hidden by a four-member save.
  await ev('(()=>{var s=roleQa.get();s.longStudyLevels.wispascend=100;s.maxDepthEver=1000;s.activeParty=["ember","tide","stone","gale","aurora","titan"];s.spirits.aurora=s.spirits.titan=300;s.recruitmentEntitlements.aurora=s.recruitmentEntitlements.titan=true;roleQa.set(s);roleQa.render();})()');
  ok(await ev('Array.from(document.querySelectorAll(".rift-wisp-power")).every(function(n){return n.scrollWidth<=n.clientWidth+1;})'),'six-Wisp Rift damage fits '+width+'/'+scale);
  if(width===390&&scale===100&&motion==='reduce')await shot('team-rift-390');
  await tab('ascend');ok(await ev('document.querySelector("[data-autoascend-target],[data-autoascend-toggle],[data-autoascend-unlock]")===null'),'automatic controls removed');
  const blocked=await ev('({disabled:document.getElementById("ascend-btn").disabled,note:document.getElementById("ascend-note").textContent,reward:document.getElementById("prism-preview").textContent})');ok(blocked.disabled&&blocked.note.includes('280')&&blocked.reward.includes('+0'),'supplied benchmark explains next required clear');
  if(width===390&&scale===100&&motion==='reduce')await shot('team-ascend-390');
  await ev('roleQa.save();roleQa.load()');ok((await ev('roleQa.get().comets'))===120,'browser reload does not duplicate100-Comet refund');
  await tab('deeds');ok(await ev('!document.querySelector("[data-shop=autoascend]")'),'retired shop purchase removed');
  ok(inspection.errors.length===0,'no browser runtime errors');profiles.push({width,scale,motion,matchingDps:true,detailsInput:true,sixWispFit:true,forwardGate:true});
 }
 // Real native click through first reward, new-record lock, then next reward.
 const first=await ev('roleQa.fresh()');first.maxDepthEver=16;first.depth=first.enemyDepth=16;first.enemyHp=first.enemyMaxHp=1e100;
 await ev('document.documentElement.style.fontSize="100%";roleQa.set('+JSON.stringify(first)+');roleQa.render()');await tab('ascend');ok(await ev('!document.getElementById("ascend-btn").disabled'),'first clear15 permits manual reset');
 const preview=await ev('roleQa.evaluate("ascendPrismGain()")');await touch('#ascend-btn');ok(await ev('roleQa.get().ascendCount===1&&roleQa.get().ascendRewardedDepth===15&&roleQa.get().prisms==='+preview),'real touch pays exactly one first reward');
 await ev('roleQa.evaluate("state.depth=16;state.maxDepthEver=16;state.enemyDepth=16;renderAscendSummary();")');ok(await ev('document.getElementById("ascend-btn").disabled&&document.getElementById("ascend-note").textContent.includes("16")'),'same clear cannot reset again');
 await ev('roleQa.evaluate("state.depth=17;state.maxDepthEver=17;state.enemyDepth=17;renderAscendSummary();")');ok(await ev('!document.getElementById("ascend-btn").disabled'),'next new clear enables manual reset');
 return {profiles,manualNativeInput:true,nativeTouches};
};
