#!/usr/bin/env node
'use strict';
// Reuse the real Chromium transport; all state injection is test-only.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const sourcePath=path.resolve(process.argv[2]||'index.html'),evidence=path.resolve(process.argv[3]||'validation-evidence/upgrade-affordability');
const source=fs.readFileSync(sourcePath,'utf8'),baseline=process.argv.includes('--expect-baseline-failure');
let driver=fs.readFileSync(path.join(__dirname,'prism-acceptance.cjs'),'utf8');
const marker='breakdown:ascendPrismBreakdown,keys:function(){return [SAVE_KEY,RECOVERY_SAVE_KEY];}';
assert.equal(driver.split(marker).length,2);
driver=driver.replace(marker,`upgradeIds:SPIRITS.map(function(sp){return sp.id;}),
 upgradeSeed:function(id,action){var s=freshState();s.maxDepthEver=250;s.ascendCount=100;s.longStudyLevels.wispascend=250;s.research.arcanecal=10;s.questDay=todayStr();s.lastSeen=Date.now();s.activeParty=[id];
 SPIRITS.forEach(function(sp){s.spirits[sp.id]=100;s.heroRarity[sp.id]=5;s.wispModules[sp.id]=20;s.wispUltimate[sp.id]=true;s.empowerQueue[sp.id]=false;s.heroResource[sp.id]=0;});
 s.lumen=0;s.shards=0;s.sigils=0;s.sigilResonanceUses=0;
 if(action==='rarity')s.heroRarity[id]=0;if(action==='module')s.wispModules[id]=0;if(action==='ultimate')s.wispUltimate[id]=false;return s;},
 upgradePrices:function(id,action){var sp=SPIRITS.find(function(sp){return sp.id===id;});
 if(action==='empower')return {lumen:getSpiritBuyPlan(sp).cost};if(action==='rarity')return rarityCost(sp,state.heroRarity[id]);
 if(action==='module')return moduleCost(sp,moduleLevel(id));return {sigil:action==='ultimate'?ultimateSigilCost(sp):sigilResonanceCost()};},
 upgradeWallet:function(values){Object.keys(values).forEach(function(k){state[k]=values[k];});},
 upgradeRefresh:function(){lastAffordabilityAt=0;checkAffordability();},upgradeRender:renderSpirits,
 `+marker);
const start=driver.indexOf('  const samples=[];'),end=driver.indexOf("  await send('Target.disposeBrowserContext'",start);assert(start>0&&end>start);
driver=driver.slice(0,start)+String.raw`
  const samples=[],walletKeys={lumen:'lumen',shard:'shards',sigil:'sigils'};
  for(const id of await ev('prismQa.upgradeIds'))for(const action of ['empower','rarity','module','ultimate','sigil-resonate']){
   await ev('prismQa.set(prismQa.upgradeSeed('+JSON.stringify(id)+','+JSON.stringify(action)+'));prismQa.ready();prismQa.tab("spirits")');
   await ev('Promise.all(document.getElementById("tab-spirits").getAnimations().map(function(a){return a.finished;})).then(function(){return true;})');
   const selector='[data-'+action+'="'+id+'"]',prices=await ev('prismQa.upgradePrices('+JSON.stringify(id)+','+JSON.stringify(action)+')');
   const enough={};for(const [kind,amount] of Object.entries(prices))enough[walletKeys[kind]]=amount;
   async function observe(values,label,initial=false){
    if(!initial)await ev('prismQa.upgradeWallet('+JSON.stringify(values)+')');
    const state=await ev('JSON.stringify(prismQa.get())'),slots=await ev('JSON.stringify(prismQa.keys().map(k=>localStorage.getItem(k)))');
    if(!initial)await ev('prismQa.upgradeRefresh()');
    ok(await ev('JSON.stringify(prismQa.get())')===state,'refresh preserves complete state');
    ok(await ev('JSON.stringify(prismQa.keys().map(k=>localStorage.getItem(k)))')===slots,'refresh does not write saves');
    const got=await ev('('+function(selector){
     var b=document.querySelector(selector);if(!b)throw Error('missing upgrade '+selector);
     var probe=document.createElement('span');document.body.appendChild(probe);probe.style.color='var(--danger)';var red=getComputedStyle(probe).color;probe.style.color='var(--ink)';var ink=getComputedStyle(probe).color;probe.remove();
     var prices=Array.from(b.querySelectorAll('[data-price-currency]')).map(function(e){return {kind:e.dataset.priceCurrency,amount:Number(e.dataset.priceAmount),color:getComputedStyle(e).color};});
     // Observe old uninstrumented prices too, so the baseline fails on actual
     // color rather than merely on missing presentation attributes.
     if(!prices.length)prices=Array.from(b.querySelectorAll('.cost-icon')).map(function(icon){return {kind:{Lumen:'lumen',Shards:'shard',Sigils:'sigil'}[icon.getAttribute('aria-label')],color:getComputedStyle(icon.parentElement).color};});
     // The card's clipped decorative pseudo-element deliberately overflows.
     // Measure the changed control and its price text instead.
     var card=b.closest('[data-wisp-card]'),r=card.getBoundingClientRect(),br=b.getBoundingClientRect();return {disabled:b.disabled,red:red,ink:ink,prices:prices,overflow:br.right>r.right+1||br.left<r.left-1||b.scrollWidth>b.clientWidth+1};
    }.toString()+')('+JSON.stringify(selector)+')');
    const context=id+' '+action+' '+label+' '+width+'/'+scale+'/'+motion;
    ok(got.prices.length===Object.keys(prices).length,'all upgrade prices instrumented '+context);
    for(const [kind,amount] of Object.entries(prices)){
     const p=got.prices.find(p=>p.kind===kind);
     ok(p&&p.color===(values[walletKeys[kind]]<amount?got.red:got.ink),'wallet color '+context+' '+kind);
     ok(p.amount===amount,'exact displayed upgrade price '+context);
    }
    const funded=Object.entries(prices).every(([kind,amount])=>values[walletKeys[kind]]>=amount);
    ok(got.disabled===!funded,'native disabled affordability '+context);ok(!got.overflow,'card fits '+context+' '+JSON.stringify(got));
    if(!funded){await ev('document.querySelector('+JSON.stringify(selector)+').click()');ok(await ev('JSON.stringify(prismQa.get())')===state,'disabled click cannot spend '+context);}
    samples.push({id,action,label,prices:got.prices,disabled:got.disabled});
   }
   const zero={};Object.keys(enough).forEach(k=>zero[k]=0);
   await observe(zero,'initial render',true);await observe(enough,'funded');
   await ev('document.querySelector('+JSON.stringify(selector)+').focus({preventScroll:true});window.__upgradeFocus=document.activeElement;prismQa.upgradeRefresh()');
   ok(await ev('document.activeElement===window.__upgradeFocus'),'funded refresh keeps focus');
   for(const [kind,amount] of Object.entries(prices))await observe({...enough,[walletKeys[kind]]:amount-1},'only '+kind+' missing');
   await observe(enough,'funded again');await observe(zero,'wallet lost');
   await ev('prismQa.upgradeRender()');await observe(zero,'rerender',true);
   if(id==='ember'&&['rarity','module','ultimate'].includes(action)&&motion==='no-preference'){
    await point(selector);await shot('unaffordable-'+action+'-'+width+'-'+scale);
   }
  }
  // Prerequisites and caps remain distinct from affordability.
  await ev('prismQa.set(prismQa.upgradeSeed("ember","rarity"));prismQa.upgradeWallet({lumen:1e12,shards:1e12,sigils:1e6});var s=prismQa.get();s.spirits.ember=1;prismQa.set(s);prismQa.tab("spirits");prismQa.upgradeRefresh()');
  ok(await ev('document.querySelector("[data-rarity=ember]").disabled'),'funded rarity still requires Wisp level');
  ok(await ev('document.querySelectorAll("[data-rarity=ember] [data-price-currency]").length===2'),'level-locked rarity still discloses both upgrade prices');
  await ev('var s=prismQa.get();s.wispModules.ember=20;s.heroRarity.ember=5;prismQa.set(s);prismQa.upgradeRefresh()');
  ok(await ev('!document.querySelector("[data-module=ember]")'),'capped ability cannot be repurchased');
  ok(await ev('document.querySelector("[data-rarity=ember]").disabled'),'capped rarity remains disabled');
  ok((await ev('window.__prismErrors')).length===0,'no runtime errors');records.push({width,scale,motion,samples});
`+driver.slice(end);
fs.mkdirSync(evidence,{recursive:true});
const generated=path.join(__dirname,'.upgrade-affordability-generated-'+process.pid+'.cjs');
fs.writeFileSync(generated,driver);
const results=[];
function execute(file,dir,expectedFailure){
 fs.mkdirSync(dir,{recursive:true});
 const result=spawnSync(process.execPath,[generated,file,dir],{encoding:'utf8',timeout:240000,maxBuffer:16*1024*1024});
 fs.writeFileSync(path.join(dir,'stdout.log'),result.stdout||'');fs.writeFileSync(path.join(dir,'stderr.log'),result.stderr||'');
 const receipt=JSON.parse(fs.readFileSync(path.join(dir,'receipt.json'),'utf8'));
 const accepted=expectedFailure?result.status===1&&receipt.status==='fail'&&expectedFailure.test(receipt.error||''):result.status===0&&receipt.status==='pass'&&receipt.profiles.length===12;
 const summary={accepted,expectedFailure:!!expectedFailure,status:receipt.status,checks:receipt.checks,profiles:receipt.profiles.length,sourceSha256:receipt.sourceSha256,browser:receipt.browser,error:receipt.error};
 results.push(summary);fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary));assert(accepted,'upgrade affordability browser acceptance');
}
try{
 if(!process.argv.includes('--controls-only'))execute(sourcePath,evidence,baseline?/all upgrade prices instrumented|wallet color|native disabled affordability/:null);
 if(process.argv.includes('--negative')||process.argv.includes('--controls-only')){
  const controls=[['all-white',"Amount.valid(amount) && missing ? 'var(--danger)' : 'var(--ink)'","Amount.valid(amount) && false ? 'var(--danger)' : 'var(--ink)'",/wallet color/],
   ['stale-resonate',"    btn.disabled=!canSigilResonate(sp);","    /* defect control: omit live Resonate eligibility */",/native disabled affordability.*sigil-resonate funded/]];
  for(const [name,from,to,error] of controls){
   assert.equal(source.split(from).length,2,'unique control '+name);
   const mutant=path.join(path.dirname(sourcePath),'.upgrade-affordability-control-'+process.pid+'.html');
   try{fs.writeFileSync(mutant,source.replace(from,to));execute(mutant,path.join(evidence,name),error);}finally{fs.unlinkSync(mutant);}
  }
 }
 fs.writeFileSync(path.join(evidence,'results.json'),JSON.stringify({sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),results},null,2)+'\n');
}finally{fs.unlinkSync(generated);}
