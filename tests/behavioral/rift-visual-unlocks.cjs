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
 if(unlock)Object.keys(RIFT_LOOKS).forEach(function(slot){RIFT_LOOKS[slot].forEach(function(a){if(a.unlockAchievement)state.achieved[a.unlockAchievement]=true;});});spawnEnemy(false);state=acceptPersistedState(state);renderAll();activateTab('battle');},
 breakdown:ascendPrismBreakdown,keys:function(){return [SAVE_KEY,RECOVERY_SAVE_KEY];}`);
if(process.argv.includes('--quick'))one("for(const width of [320,390,430])for(const scale of [1,2])for(const motion of ['no-preference','reduce']){","for(const width of [390])for(const scale of [1])for(const motion of ['no-preference']){");
if(process.argv.includes('--mutate-dot'))one("source=fs.readFileSync(sourcePath,'utf8');","source=fs.readFileSync(sourcePath,'utf8').replace('[data-tab=\"battle\"].active::after{background:#f0c567;}','[data-tab=\"battle\"].active::after{display:none;}');");
const start=driver.indexOf('  const samples=[];'),end=driver.indexOf("  await send('Target.disposeBrowserContext'",start);assert(start>0&&end>start);
driver=driver.slice(0,start)+String.raw`
  const samples=[],run=code=>ev('prismQa.evaluate('+JSON.stringify(code)+')');
  await ev('prismQa.fixture(false)');
  ok(await run("(function(){var old=freshState();delete old.riftLook;return JSON.stringify(acceptPersistedState(old).riftLook)===JSON.stringify(freshState().riftLook);})()"),'old saves default to original looks');
  ok(await run("(function(){var old=freshState();old.riftLook={backdrop:'unknown',wisp:42,enemy:'bad',motion:false};return JSON.stringify(acceptPersistedState(old).riftLook)===JSON.stringify({backdrop:'default',wisp:'default',enemy:'default',motion:false});})()"),'invalid preferences normalize safely');
  ok(await run("(function(){var before=JSON.stringify(state);selectRiftLook('backdrop','grove');selectRiftLook('__proto__','bad');selectRiftLook('wisp','unknown');return before===JSON.stringify(state);})()"),'locked and invalid choices have no effect');
  ok(await run("(function(){state.riftLook.wisp='astral';renderCosmetics();return state.riftLook.wisp==='astral'&&activeRiftLook('wisp').id==='default';})()"),'known locked preference retained without granting access');
  ok(await run("(function(){state.maxDepthEver=25;checkAchievements();return themeUnlocked(RIFT_LOOKS.backdrop[2])&&state.riftLook.backdrop==='default'&&!document.querySelector('[data-look-id=grove]').disabled;})()"),'earned Deed immediately unlocks scene without equipping it');
  ok(await run("(function(){state.maxDepthEver=50;tick();return state.achieved.d50&&!document.querySelector('[data-look-id=crystal]').disabled&&state.riftLook.wisp==='astral'&&activeRiftLook('wisp').id==='default';})()"),'normal live tick refreshes new design unlock without granting locked selection');
  await ev('prismQa.fixture(true)');
  const ids=await run("Object.keys(RIFT_LOOKS).flatMap(function(slot){return RIFT_LOOKS[slot].map(function(item){return {slot:slot,id:item.id};});})");
  for(const item of ids){
   const check=await run('(function(){var before=JSON.parse(JSON.stringify(state));selectRiftLook('+JSON.stringify(item.slot)+','+JSON.stringify(item.id)+');var after=JSON.parse(JSON.stringify(state));[before,after].forEach(function(s){delete s.riftLook;delete s.lastSeen;delete s.offlineClockHighWaterMs;});return {same:JSON.stringify(before)===JSON.stringify(after),saved:[SAVE_KEY,RECOVERY_SAVE_KEY].every(function(k){return JSON.parse(localStorage.getItem(k)).riftLook['+JSON.stringify(item.slot)+']==='+JSON.stringify(item.id)+';}),backup:decodeSaveBackup(encodeSaveBackup(state)).riftLook['+JSON.stringify(item.slot)+']==='+JSON.stringify(item.id)+'};})()');
   ok(check.same,'appearance selection preserves all gameplay '+JSON.stringify(item));ok(check.saved&&check.backup,'both saves and backup retain choice '+JSON.stringify(item));
  }
  ok(await run("(function(){var before=JSON.stringify(state);renderCosmetics();return before===JSON.stringify(state);})()"),'render is read-only');
  ok(await run("(function(){var look=JSON.stringify(state.riftLook);state=loadState();return JSON.stringify(state.riftLook)===look;})()"),'load restores appearance');
  if(width===390&&scale===1&&motion==='no-preference'){
   const look=await run('JSON.stringify(state.riftLook)');await send('Page.reload');await pause(700);await ready();
   ok(await run('JSON.stringify(state.riftLook)')===look,'actual page reload restores selected backgrounds, Wisps and enemy family');
  }
  ok(await run("(function(){var look=JSON.stringify(state.riftLook);applyAscendMutation();return JSON.stringify(state.riftLook)===look;})()"),'Ascend retains all appearances');
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
  const sceneIds=await run('RIFT_LOOKS.backdrop.map(function(s){return s.id;})');
  for(const id of sceneIds){
   await run('selectRiftLook("backdrop",'+JSON.stringify(id)+')');
   const geometry=await ev('(function(){var q=s=>document.querySelector(s),box=s=>q(s).getBoundingClientRect().toJSON(),bg=q(".rift-backdrop"),anim=Array.from(bg.querySelectorAll(".scene-weather,.scene-ribbons")).map(e=>getComputedStyle(e).animationName);return {stage:box("#tab-battle .stage"),background:box(".rift-backdrop"),party:box("#rift-party"),boss:box("#boss-combat"),nav:box("nav.tabbar"),enemy:box("#enemy-stage"),inert:getComputedStyle(bg).pointerEvents,hidden:bg.hidden,anim:anim,width:document.body.scrollWidth,inner:innerWidth};})()');
   ok(geometry.boss.top>=geometry.party.bottom-1,'boss panel below attacks '+id);ok(geometry.boss.bottom<=geometry.nav.top+1,'boss panel above navigation '+id);ok(geometry.width<=geometry.inner+1,'no page overflow '+id);
   if(id!=='default'){ok(Math.abs(geometry.stage.width-geometry.background.width)<=2&&Math.abs(geometry.stage.height-geometry.background.height)<=2,'scene covers whole stage '+id);ok(geometry.inert==='none'&&!geometry.hidden,'scene is pointer inert '+id);}
   if(motion==='reduce')ok(geometry.anim.every(n=>n==='none'),'reduced motion is still '+id);
   if(width===390&&scale===1&&motion==='no-preference'){await pause(80);await shot('scene-'+id);}
   samples.push({scene:id,geometry});
  }
  await run('selectRiftLook("backdrop","aurora");activateTab("deeds")');await pause(350);await tap('[data-look-motion]');
  ok(await run("state.riftLook.motion===false&&JSON.parse(localStorage.getItem(SAVE_KEY)).riftLook.motion===false"),'native Still toggle saves');
  ok(await ev('getComputedStyle(document.querySelector(".rift-backdrop .scene-ribbons")).animationName')==='none','Still freezes live scene');
  await tap('[data-look-motion]');ok(await run('state.riftLook.motion===true'),'native Live toggle');
  await tap('[data-look-slot="backdrop"][data-look-id="grove"]');ok(await run('state.riftLook.backdrop==="grove"'),'native scene selection');
  const overflow=await ev('(function(){return Array.from(document.querySelectorAll(".look-card,.look-copy,.look-motion")).filter(e=>e.scrollWidth>e.clientWidth+2||e.getBoundingClientRect().right>innerWidth+1).map(e=>e.outerHTML.slice(0,180));})()');ok(!overflow.length,'Collection fits at enlarged text '+JSON.stringify(overflow));
  if(width===390&&scale===1){await ev('document.querySelector(".look-motion").scrollIntoView({block:"start"})');await shot('collection-'+motion);}
  await run('activateTab("battle")');
  const forms=await run('RIFT_LOOKS.enemy.slice(1).flatMap(function(e){return e.forms.map(function(f,i){return {family:e.id,form:f,index:i};});})');
  for(const form of forms){await run('selectRiftLook("enemy",'+JSON.stringify(form.family)+');state.depth='+(300+form.index)+';spawnEnemy(false);updateBattleFast()');ok(await ev('document.querySelector("#enemy-glyph .creature-art use").getAttribute("href")')==='#creature-'+form.form,'correct enemy form '+form.form);ok(await ev('!!document.getElementById('+JSON.stringify('creature-'+form.form)+')'),'enemy artwork exists');if(width===390&&scale===1&&motion==='no-preference')await shot('enemy-'+form.form);}
  for(const id of ['default','crystal','wild','astral']){await run('selectRiftLook("wisp",'+JSON.stringify(id)+')');ok(await ev('Array.from(document.querySelectorAll("#rift-party .wisp-portrait")).every(e=>e.dataset.wispDesign==='+JSON.stringify(id)+')'),'party uses selected Wisp design '+id);}
  // Inspect all eight elemental variants and all six creature silhouettes together.
  if(width===390&&scale===1&&motion==='no-preference'){
   await run("(function(){var e=document.createElement('div');e.id='look-atlas';e.style.cssText='position:fixed;inset:0;overflow:auto;z-index:9999;background:#101b30;padding:15px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;align-content:start';e.innerHTML=['default','crystal','wild','astral'].map(function(d){return SPIRITS.map(function(sp){return '<div style=\"text-align:center;color:#dce9ef;font-size:10px\">'+wispPortrait(sp,d)+'<br>'+sp.shortName+' · '+d+'</div>';}).join('');}).join('');document.body.appendChild(e);})()");await shot('wisp-designs');await ev('document.getElementById("look-atlas").remove()');
  }
  await ev('prismQa.fixture(true)');await run('selectRiftLook("backdrop","cinder")');
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
try{fs.writeFileSync(temp,driver);const result=spawnSync(process.execPath,[temp,source,out],{encoding:'utf8',timeout:600000,maxBuffer:8388608});if(result.error)throw result.error;const receipt=JSON.parse(fs.readFileSync(path.join(out,'receipt.json')));console.log(JSON.stringify({status:receipt.status,checks:receipt.checks,profiles:receipt.profiles.length,error:receipt.error,teardown:receipt.teardown}));process.exitCode=result.status;}finally{fs.rmSync(temp,{force:true});}
