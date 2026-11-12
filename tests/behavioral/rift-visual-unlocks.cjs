'use strict';
// Exercise production rendering, saves and native input through the existing CDP transport.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const source=path.resolve(process.argv[2]||'index.html'),out=path.resolve(process.argv[3]||'validation-evidence/rift-visual-unlocks');
let driver=fs.readFileSync(path.join(__dirname,'prism-acceptance.cjs'),'utf8');
function one(a,b){assert.equal(driver.split(a).length,2,a);driver=driver.replace(a,()=>b);}
one("throw Error('input below44px')","throw Error('input below44px '+JSON.stringify({selector:e.outerHTML,width:r.width,height:r.height}))");
// Windows may take longer to release Chromium's profile after Browser.close.
one("j(Error('browser teardown deadline'));},5000)","j(Error('browser teardown deadline'));},30000)");
one('maxRetries:3,retryDelay:100','maxRetries:30,retryDelay:100');
one('breakdown:ascendPrismBreakdown,keys:function(){return [SAVE_KEY,RECOVERY_SAVE_KEY];}',String.raw`
 evaluate:function(code){return eval(code);},
 fixture:function(unlock){state=freshState();state.depth=30;state.maxDepthEver=250;state.tutorialDone=true;state.questDay=todayStr();state.lastSeen=Date.now();
 SPIRITS.forEach(function(sp){state.spirits[sp.id]=25;state.empowerQueue[sp.id]=false;});state.activeParty=['ember','void','tide'];
 if(unlock)RIFT_THEMES.forEach(function(a){if(a.unlockAchievement)state.achieved[a.unlockAchievement]=true;});spawnEnemy(false);state=acceptPersistedState(state);renderAll();activateTab('battle');},
 breakdown:ascendPrismBreakdown,keys:function(){return [SAVE_KEY,RECOVERY_SAVE_KEY];}`);
if(process.argv.includes('--quick'))one("for(const width of [320,390,430])for(const scale of [1,2])for(const motion of ['no-preference','reduce']){","for(const width of [390])for(const scale of [1])for(const motion of ['no-preference']){");
if(process.argv.includes('--mutate-fit'))one("source=fs.readFileSync(sourcePath,'utf8');","source=fs.readFileSync(sourcePath,'utf8').replace('width:62%;height:62%;max-width:none;max-height:none;','width:95%;height:95%;max-width:none;max-height:none;');");
if(process.argv.includes('--mutate-dot'))one("source=fs.readFileSync(sourcePath,'utf8');","source=fs.readFileSync(sourcePath,'utf8').replace('[data-tab=\"battle\"].active::after{background:#f0c567;}','[data-tab=\"battle\"].active::after{display:none;}');");
const start=driver.indexOf('  const samples=[];'),end=driver.indexOf("  await send('Target.disposeBrowserContext'",start);assert(start>0&&end>start);
driver=driver.slice(0,start)+String.raw`
  const samples=[],run=code=>ev('prismQa.evaluate('+JSON.stringify(code)+')');
  await ev('prismQa.fixture(false)');
  ok(await run("(function(){var old=freshState();delete old.riftLook;return JSON.stringify(acceptPersistedState(old).riftLook)===JSON.stringify(freshState().riftLook);})()"),'old saves default to original looks');
  ok(await run("(function(){var old=freshState();old.riftLook={backdrop:'unknown',wisp:42,enemy:'bad',motion:false};return JSON.stringify(acceptPersistedState(old).riftLook)===JSON.stringify({backdrop:'default',wisp:'default',enemy:'default',motion:false});})()"),'invalid preferences normalize safely');
  ok(await ev('document.querySelectorAll("[data-look-slot],[data-look-motion]").length')===0,'retired pack and Live/Still controls are absent');
  const guide=await run("(function(){renderEncyclopedia();return Array.from(document.querySelectorAll('#encyclopedia-content .ency-card')).find(function(e){return e.querySelector('.ency-name').textContent==='Collection & Journal';}).textContent;})()");
  ok(guide.includes('Choose a Rift theme in Collection')&&guide.includes('shared Rift landscape'),'rendered guide explains the main theme selector and shared scene');
  ok(!/Live backgrounds|set to Still|Wisp designs|enemy families|Select each separately/.test(guide),'rendered guide does not advertise retired appearance controls');
  ok(await run("(function(){var before=JSON.stringify(state);selectRiftTheme('ember');selectRiftTheme('unknown');return before===JSON.stringify(state)&&activeRiftTheme().id==='default';})()"),'locked and invalid themes cannot be equipped');
  ok(await run("(function(){state.maxDepthEver=50;tick();return state.achieved.d50&&!!document.querySelector('[data-theme-select=ember]')&&activeRiftTheme().id==='default';})()"),'earned Deed immediately unlocks main theme without equipping it');
  await ev('prismQa.fixture(true)');
  // Every historic preference remains round-trippable but cannot replace the original art.
  const legacy=await run("Object.keys(RIFT_LOOKS).flatMap(function(slot){return RIFT_LOOKS[slot].map(function(item){return {slot:slot,id:item.id};});})");
  for(const item of legacy){
   ok(await run('(function(){state.riftLook['+JSON.stringify(item.slot)+']='+JSON.stringify(item.id)+';state.riftLook.motion=false;var before=JSON.stringify(state);renderAll();var same=before===JSON.stringify(state);saveState();var loaded=loadState();return same&&loaded.riftLook['+JSON.stringify(item.slot)+']==='+JSON.stringify(item.id)+'&&loaded.riftLook.motion===false&&decodeSaveBackup(encodeSaveBackup(state)).riftLook['+JSON.stringify(item.slot)+']==='+JSON.stringify(item.id)+'&&[SAVE_KEY,RECOVERY_SAVE_KEY].every(function(k){return JSON.parse(localStorage.getItem(k)).riftLook['+JSON.stringify(item.slot)+']==='+JSON.stringify(item.id)+';});})()'),'retired preference survives read-only render, saves, reload and backup '+JSON.stringify(item));
   ok(await run("(function(){return document.querySelector('.rift-backdrop').dataset.scene==='rift'&&document.querySelector('#enemy-glyph .creature-art use').getAttribute('href')==='#creature-'+ENEMY_NOUN[Amount.mod(Amount.mul(state.depth,7),ENEMY_NOUN.length)].toLowerCase()&&Array.from(document.querySelectorAll('#rift-party .wisp-portrait')).every(function(e){return e.dataset.wispDesign==='default';});})()"),'retired preference cannot equip background or character pack '+JSON.stringify(item));
  }
  const look=await run('JSON.stringify(state.riftLook)');
  if(width===390&&scale===1&&motion==='no-preference'){
   await send('Page.reload');await pause(700);await ready();
   ok(await run('JSON.stringify(state.riftLook)')===look,'actual page reload retains historic preferences safely');
  }
  ok(await run("(function(){var look=JSON.stringify(state.riftLook);applyAscendMutation();return JSON.stringify(state.riftLook)===look;})()"),'Ascend retains legacy preference data');
  await ev('prismQa.fixture(true)');
  // Compare real pseudo-elements after actual tab presses.
  const dots=[];
  for(const tabName of ['spirits','workshop','ascend','deeds','battle']){
   const sel='nav.tabbar [data-tab="'+tabName+'"]';await tap(sel);await pause(500);
   const dot=await ev('(function(){var e=document.querySelector('+JSON.stringify(sel)+'),s=getComputedStyle(e,"::after"),r=e.getBoundingClientRect();return {tab:'+JSON.stringify(tabName)+',content:s.content,display:s.display,opacity:s.opacity,width:s.width,height:s.height,bottom:s.bottom,left:s.left,buttonWidth:r.width,color:s.backgroundColor,icon:getComputedStyle(e.querySelector(".nav-art")).color};})()');
   ok(dot.content!=='none'&&dot.display!=='none'&&Number(dot.opacity)>0,'active dot visible '+tabName);ok(dot.width==='4px'&&dot.height==='4px'&&dot.bottom==='7px','shared dot geometry '+JSON.stringify(dot));ok(Math.abs(parseFloat(dot.left)+2-dot.buttonWidth/2)<1,'centered dot '+tabName);dots.push(dot);
  }
  ok(dots[4].color===dots[4].icon&&dots[4].color==='rgb(240, 197, 103)','Rift dot matches gold logo');samples.push({dots});
  await ev('prismQa.fixture(true)');
  const themeIds=await run('RIFT_THEMES.map(function(t){return t.id;})');
  for(const id of themeIds){
   await run('activateTab("deeds")');await pause(350);await tap('[data-theme-select="'+id+'"]');
   ok(await run('[SAVE_KEY,RECOVERY_SAVE_KEY].every(function(k){return JSON.parse(localStorage.getItem(k)).riftTheme==='+JSON.stringify(id)+';})'),'trusted theme touch saves both slots '+id);
   const overflow=await ev('(function(){return Array.from(document.querySelectorAll(".theme-card,.theme-info,.theme-active-tag")).filter(e=>e.scrollWidth>e.clientWidth+2||e.getBoundingClientRect().right>innerWidth+1).map(e=>e.outerHTML.slice(0,180));})()');ok(!overflow.length,'Collection fits enlarged text '+JSON.stringify(overflow));
   if(width===390&&scale===1&&id==='default')await shot('collection-'+motion);
   await run('activateTab("battle")');await pause(350);
   const geometry=await ev('(function(){var q=s=>document.querySelector(s),box=s=>q(s).getBoundingClientRect().toJSON(),bg=q(".rift-backdrop");return {stage:box("#tab-battle .stage"),background:box(".rift-backdrop"),party:box("#rift-party"),boss:box("#boss-combat"),nav:box("nav.tabbar"),enemy:box("#enemy-stage"),inert:getComputedStyle(bg).pointerEvents,hidden:bg.hidden,width:document.body.scrollWidth,inner:innerWidth};})()');
   ok(geometry.boss.top>=geometry.party.bottom-1,'boss panel below attacks '+id);ok(geometry.boss.bottom<=geometry.nav.top+1,'boss panel above navigation '+id);ok(geometry.width<=geometry.inner+1,'no page overflow '+id);
   ok(Math.abs(geometry.stage.width-geometry.background.width)<=2&&Math.abs(geometry.stage.height-geometry.background.height)<=2,'single scene covers whole stage '+id);ok(geometry.inert==='none'&&!geometry.hidden,'scene visible and pointer inert '+id);
   const framing=await run('(function(){var samples=[],failures=[];for(var d=1;d<=230;d++){state.depth=d;spawnEnemy(false);state.enemyIsLuminous=d%3===0;updateBattleFast();var aura=document.querySelector(".rift-cosmetic-aura"),box=aura.getBoundingClientRect(),cx=box.left+box.width/2,cy=box.top+box.height/2,r=Math.min(box.width,box.height)*132/320;var art=document.querySelector(".creature-art use"),m=art.getScreenCTM(),b=art.getBBox();var corners=[[b.x,b.y-2],[b.x+b.width,b.y-2],[b.x,b.y+b.height+1],[b.x+b.width,b.y+b.height+1]];var furthest=Math.max.apply(Math,corners.map(function(p){var x=m.a*p[0]+m.c*p[1]+m.e-cx,y=m.b*p[0]+m.d*p[1]+m.f-cy;return Math.sqrt(x*x+y*y); }));var room=r-furthest;if(room<2)failures.push({depth:d,kind:document.getElementById("enemy-glyph").dataset.creature,r:r,furthest:furthest});samples.push({depth:d,room:room});}return {failures:failures,samples:samples};})()');
   ok(!framing.failures.length,'every enemy and boss fits circular theme '+id+' '+JSON.stringify(framing.failures));
   ok(await ev('Array.from(document.querySelectorAll(".rift-cosmetic-aura .cosmetic-pattern")).filter(e=>getComputedStyle(e).display!=="none").length')===1,'one visible ring including Starlight '+id);
   if(motion==='reduce')ok(await ev('Array.from(document.querySelectorAll(".cosmetic-pattern,.creature-art>use")).every(e=>getComputedStyle(e).animationName==="none")'),'reduced-motion themes and enemies are still');
   samples.push({theme:id,geometry,minimumRoom:Math.min(...framing.samples.map(s=>s.room)),encounters:framing.samples.length});
   await ev('prismQa.fixture(true)');await run('selectRiftTheme('+JSON.stringify(id)+')');
   if(width===390&&scale===1&&motion==='no-preference')await shot('theme-'+id);
  }
  // Theme selection, like the retired options, must never change the economy.
  ok(await run("(function(){var before=JSON.parse(JSON.stringify(state));selectRiftTheme('ember');var after=JSON.parse(JSON.stringify(state));[before,after].forEach(function(s){delete s.riftTheme;delete s.lastSeen;delete s.offlineClockHighWaterMs;});return JSON.stringify(before)===JSON.stringify(after);})()"),'theme selection preserves every gameplay field');
  await ev('prismQa.fixture(true)');
  await run('emitCombatVfx("shot",SPIRITS[0].color,"ember");emitCombatVfx("ability",SPIRITS[1].color,"void")');
  if(motion==='reduce')ok(await ev('document.querySelectorAll(".combat-vfx").length')===0,'reduced motion suppresses moving attacks');
  else{
   const shotStyle=await ev('(function(){var e=document.querySelector(".rift-projectile-layer .vfx-shot"),s=getComputedStyle(e),p=e.parentNode.getBoundingClientRect(),w=document.querySelector("[data-rift-wisp=ember] .wisp-portrait").getBoundingClientRect();return {width:parseFloat(s.width),z:parseFloat(getComputedStyle(e.parentNode).zIndex),origin:parseFloat(s.getPropertyValue("--from-y"))+p.top,target:w.top+w.height/2-5,pointer:getComputedStyle(e.parentNode).pointerEvents};})()');
   ok(shotStyle.width>=13&&shotStyle.z>=5,'bright projectile above combat artwork');ok(Math.abs(shotStyle.origin-shotStyle.target)<1,'projectile starts at Wisp portrait');ok(shotStyle.pointer==='none','attack layer cannot intercept taps');
   for(const time of [100,200,350]){await pause(time);ok(await ev('(function(){var e=document.getElementById("enemy-stage");return e.scrollWidth<=e.clientWidth+1&&e.scrollHeight<=e.clientHeight+1;})()'),'impact animation remains bounded '+time);}
   await run('emitCombatVfx("shot",SPIRITS[0].color,"ember")');await pause(250);if(width===390&&scale===1)await shot('visible-attack');
  }
  ok((await ev('window.__prismErrors')).length===0,'no runtime errors');records.push({width,scale,motion,samples});
`+driver.slice(end);
const temp=path.join(__dirname,'.rift-visual-unlocks-'+process.pid+'.cjs');
try{
 fs.writeFileSync(temp,driver);
 const result=spawnSync(process.execPath,[temp,source,out],{encoding:'utf8',timeout:600000,maxBuffer:8388608});
 if(result.error)throw result.error;
 const receipt=JSON.parse(fs.readFileSync(path.join(out,'receipt.json')));
 console.log(JSON.stringify({status:receipt.status,checks:receipt.checks,profiles:receipt.profiles.length,error:receipt.error,teardown:receipt.teardown}));
 process.exitCode=result.status;
 // The existing CI entrypoint always runs the new containment defect control.
 if(result.status===0&&!process.argv.includes('--quick')){
  const controlOut=out+'-fit-control';
  const control=spawnSync(process.execPath,[__filename,source,controlOut,'--quick','--mutate-fit'],{encoding:'utf8',timeout:120000,maxBuffer:8388608});
  if(control.error)throw control.error;
  const bad=JSON.parse(fs.readFileSync(path.join(controlOut,'receipt.json')));
  assert.equal(control.status,1);assert.equal(bad.status,'fail');
  assert(bad.error.includes('every enemy and boss fits circular theme'));
  assert.notEqual(bad.sourceSha256,receipt.sourceSha256);assert.equal(bad.exit.code,0);
  console.log('Oversized-enemy causal control rejected as expected.');
 }
}finally{fs.rmSync(temp,{force:true});}
