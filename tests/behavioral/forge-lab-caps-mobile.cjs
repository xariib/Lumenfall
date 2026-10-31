'use strict';
// Reuse existing source-bound CDP transport; actual touch/Enter purchases.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const source=path.resolve(process.argv[2]||'index.html'),out=path.resolve(process.argv[3]||'forge-lab-caps-mobile-evidence');
let driver=fs.readFileSync(path.join(__dirname,'prism-acceptance.cjs'),'utf8');
function one(a,b){assert.equal(driver.split(a).length,2,'one transport extension');driver=driver.replace(a,()=>b);}
one('window.requestAnimationFrame=function(){return 0;};','');
// Page.navigate/reload can replace its execution context while ready() polls.
// Retry only that protocol transition inside the original 10-second deadline;
// game errors, closed browsers and every purchase/reload assertion still fail.
one("async function ready(){const deadline=Date.now()+10000;while(Date.now()<deadline){if(await ev('!!window.prismQa&&prismQa.initialized()')){await ev('prismQa.ready()');return;}await pause(30);}throw Error('Game initialization deadline');}",
    "async function ready(){const deadline=Date.now()+10000;while(Date.now()<deadline){try{if(await ev('!!window.prismQa&&prismQa.initialized()')){await ev('prismQa.ready()');return;}}catch(e){if(!/Inspected target navigated or closed|Execution context was destroyed|Cannot find context with specified id/.test(e.message))throw e;}await pause(30);}throw Error('Game initialization deadline');}");
one('breakdown:ascendPrismBreakdown,keys:function(){return [SAVE_KEY,RECOVERY_SAVE_KEY];}',String.raw`
 capSeed:function(){var s=freshState();s.maxDepthEver=250;s.lumen=s.shards=1e12;s.motes=10000;s.questDay=todayStr();s.lastSeen=Date.now();s.autoAscendEnabled=false;return s;},
 capSet:function(s,tab){state=acceptPersistedState(s);renderAll();activateTab(tab);},
 capForgePlan:function(id){return getResearchBuyPlan(RESEARCH.find(function(n){return n.id===id;}),1);},
 capLabPlan:function(id){return getStudyStartPlan(LONG_STUDIES.find(function(n){return n.id===id;}));},
 capDue:function(id){findActiveStudy(id).remainingSec=0;var sum=simulationSummary(0);simulationCompleteDueStudies(sum);renderAll();saveState();},
 breakdown:ascendPrismBreakdown,keys:function(){return [SAVE_KEY,RECOVERY_SAVE_KEY];}`);
const start=driver.indexOf('  const samples=[];'),end=driver.indexOf("  await send('Target.disposeBrowserContext'",start);
assert(start>=0&&end>start,'scoped UI cases inside existing profile loop');
driver=driver.slice(0,start)+String.raw`
  const samples=[];
  const seed=await ev('prismQa.capSeed()');
  async function install(s,tab){await ev('prismQa.capSet('+JSON.stringify(s)+','+JSON.stringify(tab)+')');await ev('Promise.all(document.getElementById("tab-"+'+JSON.stringify(tab)+').getAnimations().map(a=>a.finished)).then(()=>true)');}
  async function fit(selector){const measured=await ev('('+function(selector){
    const root=document.querySelector(selector),bad=[];
    root.querySelectorAll('.name,.lvl,.desc,.effect-note,.earned-effect,[data-price-currency]').forEach(e=>{if(!e.getClientRects().length)return;const r=e.getBoundingClientRect();if(r.left<-.5||r.right>innerWidth+1||e.scrollWidth>e.clientWidth+1)bad.push({text:e.textContent.slice(0,80),left:r.left,right:r.right,scroll:e.scrollWidth,client:e.clientWidth});});
    return {bad,overflow:root.scrollWidth>root.clientWidth+1,text:root.textContent};
  }.toString()+')('+JSON.stringify(selector)+')');ok(!measured.bad.length&&!measured.overflow,'full large-text price/effect fit '+JSON.stringify({width,scale,selector,measured}));return measured.text;}
  for(const [id,tab,field] of [['arcanecal','forge','research'],['conduction','forge','research'],['bossledger','research','longStudyLevels'],['luminousdistill','research','longStudyLevels']]){
    const s=JSON.parse(JSON.stringify(seed));s[field][id]=19;await install(s,tab);
    if(tab==='forge')await ev("document.querySelector('[data-mult=\"1\"]').click()");
    else await ev('document.querySelector("[data-study-slot]").click()');
    const card=tab==='forge'?'[data-forge-card="'+id+'"]':'[data-study-card="'+id+'"]',button=tab==='forge'?'[data-research="'+id+'"]':'[data-study="'+id+'"]';
    const text=await fit(card);ok(text.includes(tab==='forge'?'Level 19 / 20':'Lv. 19 / 20'),'chosen cap visible '+id);
    const plan=await ev(tab==='forge'?'prismQa.capForgePlan('+JSON.stringify(id)+')':'prismQa.capLabPlan('+JSON.stringify(id)+')'),before=await ev('prismQa.get()');
    ok(plan.affordable,'level20 is purchasable '+id);await point(button);
    if(id==='conduction'||id==='luminousdistill'){await ev('document.querySelector('+JSON.stringify(button)+').focus()');await key('Enter','Enter',13);}else await tap(button);
    const paid=await ev('prismQa.get()');ok(paid.lumen===before.lumen-plan.cost.lumen&&paid.shards===before.shards-plan.cost.shard,'native input debits exact displayed quote '+id);
    if(tab==='forge')ok(paid.research[id]===20,'actual final Forge level');else{
      ok(paid.longStudyLevels[id]===19&&paid.activeStudies.length===1,'Lab paid start retains pending level');
      ok(paid.activeStudies[0].totalDurationSec===plan.duration,'existing final-level work snapshot');
      await fit('[data-running-study="'+id+'"]');
      await ev('prismQa.capDue('+JSON.stringify(id)+')');ok(await ev('prismQa.get().longStudyLevels['+JSON.stringify(id)+']')===20,'authoritative completion earns cap once');
      await ev('document.querySelector("[data-study-slot]").click()');
    }
    await point(card);const maxText=await fit(card);ok(tab==='forge'?maxText.includes('Level 20 / 20'):maxText.includes('Lv. 20 / 20'),'final cap visible '+id);
    ok(await ev('('+function(sel){const card=document.querySelector(sel);return card.dataset.state==='maxed'&&getComputedStyle(card).borderTopColor==='rgb(217, 180, 94)'&&!card.querySelector('button,[data-price-currency]')&&card.textContent.includes('Current:')&&!/Next:|Purchase impact:|Queue /.test(card.textContent);}.toString()+')('+JSON.stringify(card)+')'),'full gold bonus-only cap card '+id);
    ok(await ev('prismQa.keys().every(k=>JSON.parse(localStorage.getItem(k))['+JSON.stringify(field)+']['+JSON.stringify(id)+']===20)'),'both save slots retain cap20 '+id);
    if(width===320&&scale===2&&motion==='no-preference'||width===390&&scale===1&&motion==='no-preference')await shot(id+'-'+width+'-text'+scale);
    samples.push({id,cap:20,input:id==='conduction'||id==='luminousdistill'?'Enter':'touch',price:plan.cost,work:plan.duration||null});
  }
  const input=await ev('window.__prismInput');ok(input.some(e=>e.trusted&&e.type==='click'),'trusted native purchase click');ok(input.some(e=>e.trusted&&e.type==='keydown'&&e.key==='Enter'),'trusted native purchase Enter');
  await ev('window.prismQa=null');await send('Page.reload');await ready();
  ok(await ev('prismQa.get().longStudyLevels.luminousdistill')===20,'real browser reload keeps new level');
  ok((await ev('window.__prismErrors')).length===0,'no runtime errors');
  records.push({width,scale,motion,samples,reload:true,input});
`+driver.slice(end);
const temp=path.join(__dirname,'.forge-lab-caps-mobile-'+process.pid+'.cjs');
try{
  fs.writeFileSync(temp,driver);const result=spawnSync(process.execPath,[temp,source,out],{encoding:'utf8',timeout:240000,maxBuffer:8388608});
  if(result.error)throw result.error;
  const receipt=JSON.parse(fs.readFileSync(path.join(out,'receipt.json'),'utf8'));
  if(result.status!==0)process.stderr.write(receipt.error||result.stderr);
  assert.equal(result.status,0,'cap20 mobile browser acceptance');
  console.log(JSON.stringify({status:receipt.status,checks:receipt.checks,profiles:receipt.profiles.length,sourceSha256:receipt.sourceSha256,exit:receipt.exit}));
}finally{fs.rmSync(temp,{force:true});}
