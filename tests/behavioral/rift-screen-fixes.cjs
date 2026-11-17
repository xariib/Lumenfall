'use strict';
// Use the established native CDP transport and production rendering/save code.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const source=path.resolve(process.argv[2]||'index.html'),out=path.resolve(process.argv[3]||'validation-evidence/rift-screen');
let driver=fs.readFileSync(path.join(__dirname,'prism-acceptance.cjs'),'utf8');
function one(a,b){assert.equal(driver.split(a).length,2,a);driver=driver.replace(a,()=>b);}
one('breakdown:ascendPrismBreakdown,keys:function(){return [SAVE_KEY,RECOVERY_SAVE_KEY];}',String.raw`
 evaluate:function(code){return eval(code);},
 fixture:function(){state=freshState();state.depth=288;state.maxDepthEver=300;state.tutorialDone=true;state.questDay=todayStr();state.lastSeen=Date.now();
 SPIRITS.forEach(function(sp){state.spirits[sp.id]=25;state.empowerQueue[sp.id]=false;});state.activeParty=['ember','tide','stone','gale'];
 RIFT_THEMES.forEach(function(t){if(t.unlockAchievement)state.achieved[t.unlockAchievement]=true;});spawnEnemy(false);state=acceptPersistedState(state);renderAll();activateTab('battle');},
 breakdown:ascendPrismBreakdown,keys:function(){return [SAVE_KEY,RECOVERY_SAVE_KEY];}`);
one("j(Error('browser teardown deadline'));},5000)","j(Error('browser teardown deadline'));},30000)");
one('maxRetries:3,retryDelay:100','maxRetries:30,retryDelay:100');
one('width,height:844,deviceScaleFactor:1','width,height:width===320?640:844,deviceScaleFactor:1');
const mutation=process.argv.find(x=>x.startsWith('--mutate-'));
if(mutation){
 const changes={
  '--mutate-hints':['    <nav class="tabbar"','    <div id="rift-guidance-slot"><button id="rift-hints-toggle">Show hints</button></div><nav class="tabbar"'],
  '--mutate-order':['          <button class="rift-mode-btn" id="rift-farm-btn">Farm</button>\n          <button class="rift-mode-btn active" id="rift-push-btn">Push</button>','          <button class="rift-mode-btn active" id="rift-push-btn">Push</button>\n          <button class="rift-mode-btn" id="rift-farm-btn">Farm</button>'],
  '--mutate-layer':['.enemy-stage .enemy-glyph{position:relative;z-index:2;}','.enemy-stage .enemy-glyph{position:relative;z-index:0;}'],
  '--mutate-field':['<circle class="rift-enemy-field" cx="160" cy="160" r="132" fill="#0a1225"/>','<circle class="rift-enemy-field" cx="160" cy="160" r="132" fill="#0a1225" opacity="0"/>'],
  '--mutate-trail':['.rift-arena-field{z-index:-1;}','.rift-arena-field{z-index:0;}']
 };
 assert(changes[mutation],'known mutation');const [a,b]=changes[mutation];
 one("source=fs.readFileSync(sourcePath,'utf8');","source=fs.readFileSync(sourcePath,'utf8').replaceAll('\\r\\n','\\n').replace("+JSON.stringify(a)+','+JSON.stringify(b)+');');
}
one("for(const width of [320,390,430])for(const scale of [1,2])for(const motion of ['no-preference','reduce']){",process.argv.includes('--quick')?"for(const width of [390])for(const scale of [1])for(const motion of ['no-preference']){":"for(const width of [320,390,430])for(const scale of [1,1.5,2])for(const motion of ['no-preference','reduce']){");
const start=driver.indexOf('  const samples=[];'),end=driver.indexOf("  await send('Target.disposeBrowserContext'",start);assert(start>0&&end>start);
driver=driver.slice(0,start)+String.raw`
  const run=code=>ev('prismQa.evaluate('+JSON.stringify(code)+')');
  await ev('prismQa.fixture()');
  await ev("document.querySelectorAll('.rift-milestone').forEach(e=>e.remove())");
  ok(await ev("!document.querySelector('#rift-guidance-slot,#rift-hints-toggle,#rift-objective-row,#rift-objective,#rift-guidance-toggle,#rift-hint-overlay')"),'Rift hint bar, dialog and Settings toggle removed');
  const geometry=await ev("(()=>{const box=s=>document.querySelector(s).getBoundingClientRect().toJSON(),main=document.querySelector('main');return {farm:box('#rift-farm-btn'),push:box('#rift-push-btn'),enemy:box('#enemy-stage'),hud:box('.hud'),main:box('main'),stage:box('#tab-battle .stage'),nav:box('nav.tabbar'),order:Array.from(document.querySelectorAll('.rift-mode-row button')).map(e=>e.id),scroll:[main.scrollTop,main.scrollHeight,main.clientHeight],overflow:document.documentElement.scrollWidth>innerWidth+1}})()");
  ok(geometry.farm.left<geometry.push.left&&geometry.order.join(',')==='rift-farm-btn,rift-push-btn','Farm left and Push right with matching DOM order');
  ok(geometry.farm.width>=44&&geometry.farm.height>=44&&geometry.push.width>=44&&geometry.push.height>=44,'mode controls retain touch targets');
  ok(geometry.main.top-geometry.hud.bottom<=10,'no reserved hint-bar gap');
  ok(!geometry.overflow&&geometry.scroll[0]===0&&geometry.scroll[1]<=geometry.scroll[2]+1&&geometry.enemy.height>=120&&geometry.stage.bottom<=geometry.nav.top,'Rift fits viewport and attack target remains usable');
  await tap('#rift-farm-btn');ok(await run('state.riftMode==="farm"'),'left Farm touch selects farming');
  await ev("document.getElementById('rift-farm-btn').focus({preventScroll:true})");await key('Tab','Tab',9);ok(await ev('document.activeElement.id==="rift-push-btn"'),'Tab from Farm reaches Push');
  await key('Enter','Enter',13);ok(await run('state.riftMode==="push"'),'right Push keyboard resumes pushing');
  ok(await run('[SAVE_KEY,RECOVERY_SAVE_KEY].every(k=>JSON.parse(localStorage.getItem(k)).riftMode==="push")'),'mode actions persist in both save slots');
  const samples=[];
  await run('state.cometClaims.retired.rifttrail="settled";state.cometClaims.retired.starfallcrest="settled";state.cometCosmetics.trail=true;state.cometCosmetics.crest=true;applyRiftTheme()');
  for(const id of await run('RIFT_THEMES.map(t=>t.id)')){
   await run('selectRiftTheme('+JSON.stringify(id)+')');
   const layers=await ev("(()=>{const q=s=>document.querySelector(s),style=s=>getComputedStyle(q(s));return {enemyZ:Number(style('#enemy-glyph').zIndex),auraZ:Number(style('.rift-cosmetic-aura').zIndex),fieldZ:Number(style('.rift-arena-field').zIndex),trailZ:parseInt(style('.comet-trail').zIndex,10)||0,trailVisible:style('.comet-trail').display!=='none',isolated:style('.enemy-visuals').isolation,field:!!q('.rift-arena-field .rift-enemy-field')&&!q('.rift-cosmetic-aura .rift-enemy-field')&&Number(style('.rift-enemy-field').opacity)===1&&style('.rift-enemy-field').fill==='rgb(10, 18, 37)',inert:style('.enemy-visuals').pointerEvents==='none'}})()");
   ok(layers.enemyZ>layers.auraZ&&layers.isolated==='isolate'&&layers.inert,'enemy stays above theme fill in isolated inert artwork layer '+id);
   ok(layers.field&&layers.fieldZ<layers.auraZ,'opaque arena center blocks landscape silhouettes below the ring '+id);
   ok(layers.trailVisible&&layers.fieldZ<layers.trailZ&&layers.trailZ<=layers.auraZ,'legacy Comet Trail remains above the opaque field '+id);
   const framing=await run('(function(){var failures=[],encounters=0;for(var d=1;d<=230;d++){state.depth=d;spawnEnemy(false);state.enemyIsLuminous=d%3===0;updateBattleFast();var aura=document.querySelector(".rift-cosmetic-aura"),box=aura.getBoundingClientRect(),cx=box.left+box.width/2,cy=box.top+box.height/2,r=Math.min(box.width,box.height)*132/320,art=document.querySelector(".creature-art use"),m=art.getScreenCTM(),b=art.getBBox(),corners=[[b.x,b.y-2],[b.x+b.width,b.y-2],[b.x,b.y+b.height+1],[b.x+b.width,b.y+b.height+1]],furthest=Math.max.apply(Math,corners.map(function(p){var x=m.a*p[0]+m.c*p[1]+m.e-cx,y=m.b*p[0]+m.d*p[1]+m.f-cy;return Math.sqrt(x*x+y*y);}));if(r-furthest<2)failures.push({d:d,room:r-furthest});encounters++;}return {failures:failures,encounters:encounters};})()');
   ok(!framing.failures.length,'every species, boss and Luminous enemy fits '+id+' '+JSON.stringify(framing.failures));
   if(width===390&&scale===1&&motion==='no-preference'){
    for(const depth of [286,287,288]){
     await run('state.depth='+depth+';spawnEnemy(false);updateBattleFast()');
     await shot(id+'-rift-'+depth);
    }
   }
   samples.push({theme:id,layers,encounters:framing.encounters});
  }
  await ev('prismQa.fixture()');
  // The previous device preference must never recreate the removed UI.
  await ev("localStorage.setItem('lumenfall_rift_guidance_hidden_v1','0');window.__riftReloadToken=true");await send('Page.reload');
  let reloaded=false;for(let i=0;i<150&&!reloaded;i++){try{reloaded=await ev('!window.__riftReloadToken&&!!window.prismQa&&prismQa.initialized()');}catch(_){}if(!reloaded)await pause(30);}
  ok(reloaded,'reload reaches a newly initialized document');await ready();await ev('prismQa.fixture()');
  ok(await ev("!document.querySelector('#rift-guidance-slot,#rift-guidance-toggle')"),'legacy shown preference cannot restore hints on reload');
  ok(await run('!!document.getElementById("late-power-guide")&&typeof openPowerAdvice==="function"'),'Workshop power advice retained');
  ok((await ev('window.__prismErrors')).length===0,'no runtime errors');
  records.push({width,scale,motion,geometry,samples});
`+driver.slice(end);
const temp=path.join(__dirname,'.rift-screen-fixes-'+process.pid+'.cjs');
try{fs.writeFileSync(temp,driver);const result=spawnSync(process.execPath,[temp,source,out],{encoding:'utf8',timeout:600000,maxBuffer:8388608});
 if(result.error)throw result.error;process.stdout.write(result.stdout);process.stderr.write(result.stderr);process.exitCode=result.status;
 if(result.status===0&&process.argv.includes('--negative'))for(const [flag,message] of [['hints','Rift hint bar'],['order','Farm left'],['layer','enemy stays above'],['field','opaque arena center'],['trail','legacy Comet Trail']]){
  const dir=out+'-negative-'+flag,control=spawnSync(process.execPath,[__filename,source,dir,'--quick','--mutate-'+flag],{encoding:'utf8',timeout:180000,maxBuffer:8388608});
  assert(!control.error,control.error?.message);const receipt=JSON.parse(fs.readFileSync(path.join(dir,'receipt.json')));
  assert.equal(control.status,1,'negative control must fail '+flag);assert(receipt.error?.includes(message),'intended assertion '+flag+': '+receipt.error);assert.equal(receipt.exit?.code,0,'clean browser teardown '+flag);
  console.log(JSON.stringify({negative:flag,status:'rejected',sourceSha256:receipt.sourceSha256}));
 }
}finally{fs.rmSync(temp,{force:true});}
