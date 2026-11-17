'use strict';
// Runs in the existing Comet native-input profiles and real production page.
module.exports=retired;
module.exports.historical=historical; // Explicit historical callers only.
async function retired({evaluate,send,assert,screenshot,touch,width,textScale,motion}){
  await evaluate(`(()=>{const b=window.__lumenfallQaBridge;b.uiMeasurementPause(true);b.resetFeedback();b.autoTarget.nativeInput(true);const s=b.freshStateSnapshot();s.maxDepthEver=16;s.depth=s.enemyDepth=16;s.enemyHp=s.enemyMaxHp=1e100;s.comets=99;s.lastSeen=b.clockNow();s.owned.autoascend=true;s.autoAscendEnabled=true;delete s.autoAscendRefund;s.activeStudies=[{id:'guardmastery',remainingSec:123,totalDurationSec:150,speedMult:2}];b.setState(s);b.comet.render();b.comet.tab('deeds');document.documentElement.style.fontSize='${16*textScale}px';})()`);
  try{
    assert(await evaluate('!document.querySelector("[data-comet-card=autoascend],[data-shop=autoascend],[data-autoascend-challenge],[data-autoascend-open],[data-autoascend-unlock],[data-autoascend-target],[data-autoascend-toggle]")'),'retired Ritual purchase, challenges and shortcuts stay absent');
    const refund=await evaluate('(()=>{const b=window.__lumenfallQaBridge,s=b.getState();return {comets:s.comets,owned:s.owned.autoascend,on:s.autoAscendEnabled,receipt:s.autoAscendRefund,studies:s.activeStudies};})()');
    assert(refund.comets===199&&refund.owned&&!refund.on&&refund.receipt.policy==='autoascend-retired-v1'&&refund.receipt.total===100&&refund.receipt.paid,'legacy ON owner receives exact100Comet refund and stays OFF');
    await evaluate('(()=>{const b=window.__lumenfallQaBridge;b.save();b.setState(JSON.parse(b.rawSave()));b.comet.render();b.comet.tab("ascend");})()');
    assert(await evaluate('window.__lumenfallQaBridge.getState().comets===199'),'actual saved receipt prevents duplicate refund');
    await evaluate('Promise.all(document.getAnimations().filter(a=>Number.isFinite(a.effect.getTiming().iterations)).map(a=>a.finished.catch(()=>{})))');
    await evaluate('document.getElementById("ascend-btn").scrollIntoView({block:"center"});document.getElementById("ascend-btn").focus({preventScroll:true})');
    const geometry=await evaluate('(()=>{const e=document.getElementById("ascend-btn"),r=e.getBoundingClientRect(),s=getComputedStyle(e);return {width:r.width,height:r.height,left:r.left,right:r.right,fit:document.documentElement.scrollWidth<=innerWidth,enabled:!e.disabled,focus:document.activeElement===e,outline:parseFloat(s.outlineWidth)};})()');
    assert(geometry.fit&&geometry.width>=44&&geometry.height>=44&&geometry.left>=0&&geometry.right<=width&&geometry.enabled&&geometry.focus&&geometry.outline>=2,'manual first-clear control fits and keeps keyboard focus at enlarged text '+JSON.stringify(geometry));
    const first=await evaluate('(()=>{const b=window.__lumenfallQaBridge;return {state:JSON.parse(JSON.stringify(b.getState())),gain:b.ascendBreakdown().gain};})()');
    await touch('#ascend-btn');
    assert(await evaluate('(()=>{const b=window.__lumenfallQaBridge,s=b.getState();return s.ascendCount===1&&s.ascendRewardedDepth===15&&s.prisms==='+JSON.stringify(first.state.prisms+first.gain)+'&&JSON.stringify(s.activeStudies)==='+JSON.stringify(JSON.stringify(first.state.activeStudies))+'&&b.rawSave()===b.rawRecovery();})()'),'native touch pays first clear15 exactly and preserves paid work in both slots');
    await evaluate('(()=>{const b=window.__lumenfallQaBridge,s=b.getState();s.depth=s.enemyDepth=16;s.maxDepthEver=16;s.enemyHp=s.enemyMaxHp=1e100;b.setState(s);b.comet.render();b.save();})()');
    assert(await evaluate('document.getElementById("ascend-btn").disabled&&window.__lumenfallQaBridge.ascendBreakdown().gain===0'),'same rewarded clear disables reset and previews zero');
    const denied=await evaluate('(()=>{const b=window.__lumenfallQaBridge;return JSON.stringify([b.getState(),b.rawSave(),b.rawRecovery()]);})()');
    await touch('#ascend-btn');
    assert(await evaluate('(()=>{const b=window.__lumenfallQaBridge;return JSON.stringify([b.getState(),b.rawSave(),b.rawRecovery()]);})()')===denied,'disabled native touch preserves every field and both slots');
    await evaluate('(()=>{const b=window.__lumenfallQaBridge,s=b.getState();s.depth=s.enemyDepth=17;s.maxDepthEver=17;s.enemyHp=s.enemyMaxHp=1e100;b.setState(s);b.comet.render();document.getElementById("ascend-btn").scrollIntoView({block:"center"});document.getElementById("ascend-btn").focus({preventScroll:true});})()');
    const next=await evaluate('(()=>{const b=window.__lumenfallQaBridge;return {count:b.getState().ascendCount,prisms:b.getState().prisms,gain:b.ascendBreakdown().gain,enabled:!document.getElementById("ascend-btn").disabled};})()');
    assert(next.enabled&&next.gain>0,'strictly higher clear16 enables next manual reward');
    await send('Input.dispatchKeyEvent',{type:'rawKeyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});await send('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});
    assert(await evaluate('(()=>{const b=window.__lumenfallQaBridge,s=b.getState();return s.ascendCount===2&&s.ascendRewardedDepth===16&&s.prisms==='+JSON.stringify(next.prisms+next.gain)+'&&s.autoAscendRefund.total===100&&s.autoAscendRefund.paid&&!s.autoAscendEnabled&&!b.ascendEligibility().autoReady&&b.rawSave()===b.rawRecovery();})()'),'native Space commits only the new record and keeps retirement receipt');
    await screenshot('manual-ascend-retirement-'+width+'-'+textScale+'-'+motion);
    return {policy:'retired Ritual; manual higher-record touch and keyboard',refund,geometry,firstReward:first.gain,nextReward:next.gain};
  }finally{await evaluate('window.__lumenfallQaBridge.autoTarget.nativeInput(false)');}
}
async function historical({evaluate,send,assert,screenshot,touch,width,textScale,motion}){
  const root='[data-comet-card="autoascend"]',buy=root+' [data-shop="autoascend"]';
  await evaluate(`(()=>{const b=window.__lumenfallQaBridge;b.uiMeasurementPause(true);b.resetFeedback();const s=b.freshStateSnapshot();s.maxDepthEver=149;s.ascendCount=24;s.depth=s.enemyDepth=16;s.enemyHp=s.enemyMaxHp=1e100;s.comets=1000000;s.lastSeen=b.clockNow();['wispascend','guardmastery','shardstudy','lumenstudy','motestudy'].forEach((id,i)=>s.longStudyLevels[id]=[9,9,8,8,15][i]);b.setState(s);b.comet.render();b.comet.tab('deeds');window.ritualButton=document.querySelector('[data-shop="autoascend"]');})()`);
  await new Promise(r=>setTimeout(r,550));
  // The existing 200% profile already scales card copy/buttons; scale the new
  // list explicitly too, since its rem declaration does not inherit that copy.
  if(textScale===2)await evaluate(`(()=>{const el=document.querySelector('.auto-ascend-challenges'),style=document.createElement('style');style.textContent='.auto-ascend-challenges{font-size:'+(parseFloat(getComputedStyle(el).fontSize)*2)+'px!important;}';document.head.appendChild(style);})()`);
  const initial=await evaluate(`(()=>{const card=document.querySelector('${root}');return {rows:Array.from(card.querySelectorAll('[data-autoascend-challenge]')).map(e=>({key:e.dataset.autoascendChallenge,met:e.dataset.met,text:e.textContent})),disabled:ritualButton.disabled,price:ritualButton.textContent};})()`);
  assert(initial.rows.length===4&&initial.rows.every(r=>r.met==='false')&&initial.disabled,'four separate challenges block rich wallet');
  assert(initial.rows.map(r=>r.text).join('|')==='Ascensions: 24 / 25|Highest Rift: 149 / 150|Completed Lab levels: 49 / 50|Different Lab subjects: 5 / 6','exact live challenge labels/progress');
  assert(initial.price.includes('100'),'locked Ritual keeps visible100Comet price');
  await touch(buy);
  assert(await evaluate('!window.__lumenfallQaBridge.getState().owned.autoascend&&window.__lumenfallQaBridge.getState().comets===1000000'),'disabled native touch cannot buy');
  async function fit(){
    const bounds=await evaluate(`(()=>{const card=document.querySelector('${root}'),r=card.getBoundingClientRect(),button=card.querySelector('button').getBoundingClientRect();return {left:r.left,right:r.right,width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,button:{w:button.width,h:button.height},children:Array.from(card.querySelectorAll('li,.desc,button')).map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,clipped:e.scrollWidth>e.clientWidth+1};})};})()`);
    assert(!bounds.overflow&&bounds.left>=0&&bounds.right<=width&&bounds.button.w>=44&&bounds.button.h>=44&&bounds.children.every(r=>r.left>=0&&r.right<=width&&!r.clipped),'Ritual challenges and price fit '+width+' scale'+textScale+' '+JSON.stringify(bounds));return bounds;
  }
  const bounds=await fit();
  await screenshot('auto-ascend-challenges-'+width+'-'+textScale+'-'+motion);
  if(width===320&&textScale===2){
    await evaluate(`document.querySelector('${root}').scrollIntoView({block:'start',behavior:'instant'})`);
    await screenshot('auto-ascend-challenges-top-'+width+'-'+textScale+'-'+motion);
  }
  await evaluate(`(()=>{const b=window.__lumenfallQaBridge,s=b.getState();s.ascendCount=25;s.maxDepthEver=150;s.longStudyLevels.measuredinquiry=1;s.comets=99;b.setState(s);window.ritualFocus=document.querySelector('${root}');ritualFocus.focus({preventScroll:true});b.refreshAffordability();})()`);
  assert(await evaluate(`document.querySelectorAll('${root} [data-met="true"]').length===4&&ritualButton.disabled`),'earned goals refresh without rerender');
  assert(await evaluate(`document.querySelector('${buy}')===ritualButton&&document.activeElement===ritualFocus`),'progress refresh preserves control and focus');
  assert(await evaluate(`document.querySelector('${buy} [data-price-currency="comet"]').style.color==='var(--danger)'`),'missing Comet amount red');
  await evaluate(`(()=>{const b=window.__lumenfallQaBridge,s=b.getState();s.comets=100;b.setState(s);b.refreshAffordability();b.autoTarget.nativeInput(true);})()`);
  assert(await evaluate('!ritualButton.disabled'),'all goals and exact funds enable native purchase');
  try{await touch(buy);}finally{await evaluate('window.__lumenfallQaBridge.autoTarget.nativeInput(false)');}
  const paid=await evaluate(`(()=>{const b=window.__lumenfallQaBridge,s=b.getState();return {owned:s.owned.autoascend,comets:s.comets,on:s.autoAscendEnabled,target:s.autoAscendTargetDepth,primary:JSON.parse(b.rawSave()).owned.autoascend,recovery:JSON.parse(b.rawRecovery()).owned.autoascend,open:!!document.querySelector('${root} [data-autoascend-open]'),hidden:document.querySelector('${root} [data-autoascend-challenges]').hidden};})()`);
  assert(paid.owned&&paid.comets===0&&paid.on&&paid.target===150&&paid.primary&&paid.recovery&&paid.open&&paid.hidden,'native paid purchase persists and opens existing controls '+JSON.stringify(paid));
  await fit();
  // Ascend's locked shortcut must reach the requirements even with a disabled
  // purchase, so keyboard users retain a meaningful focus destination.
  await evaluate(`(()=>{const b=window.__lumenfallQaBridge,s=b.freshStateSnapshot();b.setState(s);b.comet.render();b.comet.tab('ascend');})()`);
  await new Promise(r=>setTimeout(r,550));await touch('[data-autoascend-unlock]');
  assert(await evaluate(`document.activeElement===document.querySelector('${root}')&&document.querySelector('#tab-deeds').classList.contains('active')`),'locked Ascend shortcut focuses challenge card');
  return {initial,bounds,paid};
};
