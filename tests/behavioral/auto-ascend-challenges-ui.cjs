'use strict';
// Runs in the existing Comet native-input profiles and real production page.
module.exports=async function({evaluate,send,assert,screenshot,touch,width,textScale,motion}){
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
