'use strict';
// Reuse the source-bound browser transport. Fixtures never enter shipped code.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const source=path.resolve(process.argv[2]||'index.html'),out=path.resolve(process.argv[3]||'validation-evidence/visual-audit');
let driver=fs.readFileSync(path.join(__dirname,'prism-acceptance.cjs'),'utf8');
function one(a,b){assert.equal(driver.split(a).length,2);driver=driver.replace(a,()=>b);}
if(process.argv.includes('--mutate-lab-heading'))one("source=fs.readFileSync(sourcePath,'utf8');","source=fs.readFileSync(sourcePath,'utf8').replace('height:auto;padding:12px;margin-bottom:8px;','height:64px;padding:12px;margin-bottom:8px;');");
one('breakdown:ascendPrismBreakdown,keys:function(){return [SAVE_KEY,RECOVERY_SAVE_KEY];}',String.raw`
 visualSeed:function(){var s=freshState();s.maxDepthEver=350;s.depth=81;s.lumen=1e12;s.shards=1e10;s.motes=5000;s.prisms=10000;s.comets=20;s.ascendCount=80;s.tutorialDone=true;s.questDay=todayStr();s.lastSeen=Date.now();SPIRITS.forEach(function(sp){s.spirits[sp.id]=50;s.empowerQueue[sp.id]=false;});s.activeParty=SPIRITS.slice(0,3).map(function(sp){return sp.id;});return s;},
 visualSet:function(s,tab){state=acceptPersistedState(s);selectedStudySlot=-1;expandedStudySpeedSlot=-1;state.questDay='';ensureDaily();spawnEnemy(false);renderAll();activateTab(tab);document.querySelectorAll('.rift-milestone').forEach(function(e){e.remove();});},
 visualDaily:function(){showDailyOverlay({streak:7,reward:{comets:25,prisms:5}});},
 visualScenes:function(){return RIFT_ZONES.map(function(z,i){return {name:'zone-'+i,depth:i*RIFT_ZONE_SPAN+1,theme:'default'};}).concat(RIFT_THEMES.map(function(t){return {name:'theme-'+t.id,depth:81,theme:t.id};}),[10,20,30].map(function(d){return {name:'boss-'+d,depth:d,theme:'default'};}),[{name:'luminous',depth:81,theme:'default',luminous:true}]);},
 visualScene:function(scene){var s=prismQa.visualSeed();s.depth=scene.depth;s.riftTheme=scene.theme;RIFT_THEMES.forEach(function(t){if(t.unlockAchievement)s.achieved[t.unlockAchievement]=true;});prismQa.visualSet(s,'battle');state.enemyIsLuminous=!!scene.luminous;updateBattleFast();},
 breakdown:ascendPrismBreakdown,keys:function(){return [SAVE_KEY,RECOVERY_SAVE_KEY];}`);
one('for(const width of [320,390,430])for(const scale of [1,2])for(const motion of [\'no-preference\',\'reduce\']){',process.env.VISUAL_QUICK?'for(const width of [390])for(const scale of [1])for(const motion of [\'reduce\']){':'for(const width of [320,390,430,768])for(const scale of [1,2])for(const motion of [\'no-preference\',\'reduce\']){');
const start=driver.indexOf('  const samples=[];'),end=driver.indexOf("  await send('Target.disposeBrowserContext'",start);
assert(start>0&&end>start);
driver=driver.slice(0,start)+String.raw`
  const samples=[];
  for(const screen of ['battle','spirits','forge','research','ascend','deeds']){
   await ev('prismQa.visualSet(prismQa.visualSeed(),'+JSON.stringify(screen)+');document.querySelector("main").scrollTop=0');await pause(300);
   const measured=await ev('('+function(screen){
    const root=document.getElementById('tab-'+screen),bad=[];
    root.querySelectorAll('button,select,.name,.desc,h2,h3,.effect-note,.earned-effect,.ab-col,.chapter-copy').forEach(e=>{if(!e.getClientRects().length)return;const r=e.getBoundingClientRect(),banner=e.closest('.chapter-head'),b=banner&&banner.getBoundingClientRect();if(r.width>0&&(r.left<-.5||r.right>innerWidth+1||e.scrollWidth>e.clientWidth+2||b&&(r.top<b.top||r.bottom>b.bottom)))bad.push({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,80),left:r.left,right:r.right,scroll:e.scrollWidth,client:e.clientWidth});});
    return {bad,bodyWidth:document.body.scrollWidth,inner:innerWidth};
   }.toString()+')('+JSON.stringify(screen)+')');
   ok(measured.bodyWidth<=measured.inner+1,'page fits viewport '+screen);
   ok(measured.bad.length===0,'unclipped content '+JSON.stringify({width,scale,screen,bad:measured.bad}));
   samples.push({screen,...measured});
   if(width===390&&scale===1||width===320&&scale===2){
    await shot(screen+'-'+width+'-'+scale+'-'+motion);
    if(screen!=='battle'){await ev('document.querySelector("main").scrollTop=600');await shot(screen+'-middle-'+width+'-'+scale+'-'+motion);}
   }
  }
  await ev('prismQa.visualSet(prismQa.visualSeed(),"research")');await pause(300);await tap('[data-study-slot]');
  const catalogue=await ev('('+function(){const head=document.querySelector('.study-catalogue-heading'),title=document.getElementById('study-choices'),group=document.querySelector('[data-study-group]'),h=head.getBoundingClientRect(),t=title.getBoundingClientRect(),g=group.getBoundingClientRect();return {head:h.toJSON(),title:t.toJSON(),group:g.toJSON(),width:head.clientWidth,scroll:head.scrollWidth};}.toString()+')()');
  ok(catalogue.group.top>=catalogue.head.bottom-1,'first research group below sticky heading '+JSON.stringify({width,scale,catalogue}));
  ok(catalogue.scroll<=catalogue.width+1&&catalogue.title.right<=catalogue.head.right+1,'catalogue heading fits');
  samples.push({screen:'catalogue',bad:[],catalogue});
  if(width===390&&scale===1&&motion==='reduce'||width===320&&scale===2&&motion==='reduce'){
   await shot('lab-catalogue-'+width+'-'+scale);
   await ev('prismQa.ready()');
   for(const [screen,selector] of [['ascend','#node-list'],['deeds','#shop-list'],['deeds','#theme-list']]){
    await ev('prismQa.visualSet(prismQa.visualSeed(),'+JSON.stringify(screen)+');document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"start"})');await pause(300);await shot(selector.slice(1));
   }
   await ev('prismQa.visualSet(prismQa.visualSeed(),"battle")');await tap('#settings-btn');await shot('settings');await tap('#encyclopedia-btn');await shot('encyclopedia');await tap('#settings-close');
   await tap('#rift-farm-btn');await shot('farm-picker');await tap('#farm-picker-close');
   await ev('prismQa.visualDaily()');await shot('daily-reward');await tap('#daily-claim');
   await ev('prismQa.visualSet(prismQa.visualSeed(),"research")');await tap('[data-study-slot]');await shot('lab-catalogue');
   await ev('prismQa.ready()');
   if(width===390&&scale===1){for(const scene of await ev('prismQa.visualScenes()')){await ev('prismQa.visualScene('+JSON.stringify(scene)+')');await pause(300);await shot(scene.name);}}
   for(const family of ['creature','wisp']){
    await send('Emulation.setDeviceMetricsOverride',{width:768,height:1400,deviceScaleFactor:1,mobile:true});
    const count=await ev('('+function(family){
     const old=document.getElementById('qa-art-atlas');if(old)old.remove();
     const box=document.createElement('div');box.id='qa-art-atlas';box.style.cssText='position:fixed;inset:0;z-index:9999;background:#101a2e;padding:20px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;align-content:start;overflow:auto;--creature-color:#746282;--creature-rim:#c5b3e6;--creature-eye:#fbe6a1;';
     const symbols=[...document.querySelectorAll('symbol[id^="'+family+'-"]')];
     box.innerHTML=symbols.map(s=>'<div style="text-align:center;border:1px solid #40516e;border-radius:12px;padding:8px;background:linear-gradient(#22314a,#101a2e)"><svg viewBox="'+s.getAttribute('viewBox')+'" style="display:block;width:100%;height:150px"><use href="#'+s.id+'"/></svg><span style="font:12px system-ui;color:#d5ddec">'+s.id+'</span></div>').join('');document.body.append(box);return symbols.length;
    }.toString()+')('+JSON.stringify(family)+')');
    await shot(family+'-atlas');samples.push({screen:family+'-atlas',count,bad:[]});await ev('document.getElementById("qa-art-atlas").remove()');
   }
  }
  ok((await ev('window.__prismErrors')).length===0,'no runtime errors');records.push({width,scale,motion,samples});
`+driver.slice(end);
const temp=path.join(__dirname,'.visual-audit-'+process.pid+'.cjs');
try{fs.writeFileSync(temp,driver);const r=spawnSync(process.execPath,[temp,source,out],{encoding:'utf8',timeout:360000,maxBuffer:8388608});if(r.error)throw r.error;const receipt=JSON.parse(fs.readFileSync(path.join(out,'receipt.json')));console.log(JSON.stringify({status:receipt.status,checks:receipt.checks,profiles:receipt.profiles.length,findings:receipt.profiles.flatMap(p=>p.samples.filter(s=>s.bad.length).map(s=>({width:p.width,scale:p.scale,motion:p.motion,...s}))),error:receipt.error}));process.exitCode=r.status;}finally{fs.rmSync(temp,{force:true});}
