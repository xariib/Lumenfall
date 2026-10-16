'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {spawn}=require('node:child_process');
const {serve}=require('../../scripts/lib/static-server.cjs');
const {findChrome}=require('../../scripts/lib/browser.cjs');
const root=path.resolve(__dirname,'../..'),file=path.resolve(process.argv[2]||'index.html'),out=path.resolve(process.argv[3]||'docs/qa/endless-progression-001/mobile');
const calibrated=!process.argv.includes('--initial-proposal'),dailyCalibration=calibrated&&!process.argv.includes('--prior-ak'),prismPrice=calibrated?20000:200,sigilPrice=calibrated?500000:5000,labBase=dailyCalibration?(process.argv.includes('--focus-f')?92:84):calibrated?32:30;
assert(!dailyCalibration||calibrated,'daily calibration uses the measured investment table');
const source=fs.readFileSync(file,'utf8'),marker="if(document.readyState==='loading'){";
const bridge=`window.endlessUi={
 fresh:freshState,get:function(){return JSON.parse(JSON.stringify(state));},
 set:function(s){state=acceptPersistedState(s);restoreEnemyOrSpawn();renderAll();activateTab('spirits');},
 ready:function(){return !!state&&!!els['spirit-list'];},
 prepare:function(){if(startupIntroFinish)startupIntroFinish();document.querySelectorAll('.overlay,#startup-intro').forEach(function(el){el.style.display='none';});setOverlayInert(null);overlayFocus=null;isNewGame=false;activateTab('spirits');},
 render:function(){renderSpirits(true);},refresh:function(){lastAffordabilityAt=0;checkAffordability();},
 mastery:function(id){return getWispMasteryPlan(SPIRITS.find(function(sp){return sp.id===id;}));},
 rarity:function(id){return getWispRarityPlan(SPIRITS.find(function(sp){return sp.id===id;}));},
 slots:function(){return [localStorage.getItem(SAVE_KEY),localStorage.getItem(RECOVERY_SAVE_KEY)];},
 freeze:function(){window.setInterval=function(){return 0;};}
};`;
assert.equal(source.split(marker).length,2);
const page=source.replace('<head>','<head><script>window.setInterval=function(){return 0;};window.endlessErrors=[];window.addEventListener("error",function(e){endlessErrors.push(e.message);});window.addEventListener("unhandledrejection",function(e){endlessErrors.push(String(e.reason));});</script>').replace(marker,bridge+marker);
let browser,server,profile,stage,session,seq=0,buffer='',closed=false;const pending=new Map(),records=[];let checks=0;
function check(x,m){checks++;assert(x,m);}
function send(method,params={},sid=session){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout '+method));},20000);pending.set(id,{resolve,reject,timer});browser.stdio[3].write(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})})+'\0');});}
async function ev(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function key(){await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',windowsVirtualKeyCode:13});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});}
async function run(){
 fs.mkdirSync(out,{recursive:true});stage=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-endless-mobile-'));fs.writeFileSync(path.join(stage,'index.html'),page);
 for(const dir of ['fonts','branding'])fs.cpSync(path.join(root,dir),path.join(stage,dir),{recursive:true});server=await serve(stage);
 profile=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-endless-browser-'));
 browser=spawn(findChrome(),['--headless=new','--no-sandbox','--disable-gpu','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe'],windowsHide:true});
 browser.stderr.on('data',()=>{});browser.on('close',()=>{closed=true;for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('browser closed'));}pending.clear();});browser.on('error',e=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(e);}pending.clear();});
 browser.stdio[4].on('data',b=>{buffer+=b;let end;while((end=buffer.indexOf('\0'))>=0){const raw=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!raw)continue;const m=JSON.parse(raw),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}});
 for(const n of [3,4])browser.stdio[n].on('error',()=>{});
 const version=await send('Browser.getVersion',{},null),target=await send('Target.createTarget',{url:'about:blank'},null);session=(await send('Target.attachToTarget',{targetId:target.targetId,flatten:true},null)).sessionId;
 await send('Page.enable');await send('Runtime.enable');await send('Emulation.setTouchEmulationEnabled',{enabled:true});
 await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});
 let ready=false;for(let i=0;i<200;i++){try{ready=await ev('!!window.endlessUi&&endlessUi.ready()');}catch{}if(ready)break;await pause(25);}check(ready,'real game initializes');await ev('document.fonts.ready');await ev('endlessUi.prepare()');await pause(500);
 for(const width of [320,390,430])for(const scale of [1,2])for(const motion of ['no-preference','reduce']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});await ev('document.documentElement.style.fontSize='+16*scale+'+"px"');
  for(const mode of ['early','gates','mastery','huge','guide']){
   await ev(`(()=>{var s=endlessUi.fresh();s.depth=20;s.maxDepthEver=32;s.lumen=1e12;s.shards=1e12;s.prisms=${calibrated?100000:1000};s.sigils=${calibrated?100000000:50000};
    if('${mode}'!=='early'){s.spirits.ember=140;s.heroRarity.ember=4;s.wispModules.ember=20;s.maxDepthEver=200;s.ascendCount=50;s.longStudyLevels.wispascend=${labBase};s.research.arcanecal=10;s.research.masterwork=1;s.nodes.swift=10;}
    if('${mode}'==='mastery'||'${mode}'==='huge'){s.heroRarity.ember=5;s.wispUltimate.ember=true;}
    if('${mode}'==='huge'){s.wispMastery.ember=10000;s.maxDepthEver=250200;s.longStudyLevels.wispascend=${2000+labBase};s.research.masterwork=2001;s.nodes.swift=1010;s.lumen='1e400';s.shards='1e400';s.prisms='1e400';s.sigils='1e400';}
    if('${mode}'==='guide'){Object.keys(s.spirits).forEach(id=>{s.spirits[id]=140;s.heroRarity[id]=5;s.wispModules[id]=20;s.wispUltimate[id]=true;});s.maxDepthEver=10000;s.longStudyLevels.wispascend=200;s.research.masterwork=200;s.nodes.swift=100;s.prisms=1e6;s.sigils=1e8;}
    endlessUi.set(s);document.querySelector('[data-wisp-card=ember]').scrollIntoView({block:'start'});})()`);
   await pause(80);
   // Measure the settled target, after the existing panelIn scale animation.
   await ev('Promise.all(document.getAnimations().filter(a=>Number.isFinite(a.effect.getTiming().iterations)).map(a=>a.finished.catch(()=>{})))');
   // The established card has a clipped ::after circle at right:-44px; its
   // scrollWidth is not a content-fit measurement. Check actual text/controls.
   const geometry=await ev(`(()=>{var card=document.querySelector('[data-wisp-card=ember]'),clipped=Array.from(card.querySelectorAll('div,span,strong,h3,p,button,summary')).filter(e=>{var r=e.getBoundingClientRect();return r.width&&r.height&&(e.scrollWidth>e.clientWidth+1||r.left< -1||r.right>innerWidth+1);}).map(e=>e.outerHTML.slice(0,200));return {overflow:document.documentElement.scrollWidth>innerWidth,cardOverflow:clipped.length>0,clipped:clipped,requirements:card.querySelector('.rarity-level-requirement')?.textContent,ultimate:card.querySelector('.ultimate-requirements')?.textContent,mastery:card.querySelector('.wisp-mastery-section')?.textContent,controls:Array.from(card.querySelectorAll('button')).filter(e=>e.getBoundingClientRect().height>0).map(e=>{var r=e.getBoundingClientRect();return {w:r.width,h:r.height,id:e.getAttribute('data-mastery')};}),errors:endlessErrors};})()`);
   records.push({width,scale,motion,mode,geometry});
   check(!geometry.overflow&&!geometry.cardOverflow,'fits '+width+'/'+scale+'/'+mode);check(geometry.errors.length===0,'no runtime errors');for(const c of geometry.controls)check(c.w>=44&&c.h>=44,'44px visible controls '+mode);
   if(mode==='early'){check(await ev('document.querySelector("[data-wisp-card=titan]").textContent.includes("Wisp Ascendancy")'),'locked recruit explains Lab requirement');check(await ev('document.querySelector("[data-rarity-current]").textContent.includes("Power ×1")&&document.querySelector("[data-rarity-next]").textContent.includes("Power ×1.5")'),'rarity Current/Next effects shown');}
   if(mode==='gates'){check(geometry.requirements.includes('Ascends')&&geometry.requirements.includes('Arcane Calibration'),'all rarity development requirements shown');check(geometry.ultimate.includes('Mythic rarity')&&geometry.ultimate.includes('Ability Lv. 15'),'Ultimate requirements clear');
    check(await ev('document.querySelector("[data-ultimate-current]").textContent.includes("Ability damage ×1")&&document.querySelector("[data-ultimate-next]").textContent.includes("×2")'),'Ultimate Current/Next effects shown');
   }
   if(mode==='mastery'){
    check(geometry.mastery.includes('Rank 0')&&geometry.mastery.includes('Next: Own Power ×1.10'),'Mastery current/next clear');
    const eligible=await ev('endlessUi.get()');
    await ev('(()=>{var s=endlessUi.get();s.longStudyLevels.wispascend='+(labBase-1)+';endlessUi.set(s);})()');
    check(await ev('document.querySelector("[data-mastery=ember]").disabled'),'one Lab short disables native Mastery control');
    const blockedBefore=await ev('endlessUi.get()');await ev('document.querySelector("[data-mastery=ember]").click()');
    const blockedAfter=await ev('endlessUi.get()');check(blockedAfter.wispMastery.ember===0&&blockedAfter.prisms===blockedBefore.prisms&&blockedAfter.sigils===blockedBefore.sigils,'disabled Mastery preserves rank and both currencies');
    await ev('endlessUi.set('+JSON.stringify(eligible)+')');
    await ev('Promise.all(document.getAnimations().filter(a=>Number.isFinite(a.effect.getTiming().iterations)).map(a=>a.finished.catch(()=>{})))');
    const before=await ev('endlessUi.get()');await ev('var b=document.querySelector("[data-mastery=ember]");b.scrollIntoView({block:"center"});b.focus({preventScroll:true})');await key();await pause(80);
    const after=await ev('({s:endlessUi.get(),card:document.activeElement.closest("[data-wisp-card]")?.dataset.wispCard})');check(after.s.wispMastery.ember===1,'native keyboard buys a rank');check(after.s.prisms===before.prisms-prismPrice&&after.s.sigils===before.sigils-sigilPrice,'native keyboard exact spend');check(after.card==='ember','stable purchase focus');
   }
   if(mode==='huge'){check(!geometry.mastery.includes('Infinity')&&!geometry.mastery.includes('NaN'),'wide growth displays compactly');}
   if(mode==='guide'){
    const before=await ev('JSON.stringify({s:endlessUi.get(),slots:endlessUi.slots()})');
    const guide=await ev(`(()=>{var root=document.getElementById('late-power-guide');root.scrollIntoView({block:'start'});return {hidden:root.hidden,text:root.textContent,clipped:Array.from(root.querySelectorAll('h3,p,button')).some(e=>e.scrollWidth>e.clientWidth+1),w:root.querySelector('button').getBoundingClientRect().width,h:root.querySelector('button').getBoundingClientRect().height};})()`);
    check(!guide.hidden&&guide.text.includes('Lab gate met')&&guide.text.includes('×1.10'),'next upgrade and Lab saving guidance visible');check(!guide.clipped&&guide.w>=44&&guide.h>=44,'guide wraps and touch target fits');
    await ev('document.getElementById("late-power-open").focus({preventScroll:true})');await key();
    check(await ev('document.activeElement.getAttribute("data-mastery")==="ember"'),'keyboard guide locates actual purchase control');
    check(await ev('JSON.stringify({s:endlessUi.get(),slots:endlessUi.slots()})')===before,'guide navigation never buys or changes save');
    if(width===320&&motion==='no-preference'){await ev('document.getElementById("late-power-guide").scrollIntoView({block:"start"})');const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,'guide-'+scale+'.png'),Buffer.from(shot.data,'base64'));}
   }
   const purity=await ev('JSON.stringify({s:endlessUi.get(),slots:endlessUi.slots()})');await ev('endlessUi.render();endlessUi.refresh()');check(await ev('JSON.stringify({s:endlessUi.get(),slots:endlessUi.slots()})')===purity,'render/refresh does not mutate save');
   if(width===320&&motion==='no-preference'&&['gates','mastery'].includes(mode)){
    await ev('document.querySelectorAll(".toast").forEach(e=>e.style.visibility="hidden");document.querySelector("'+(mode==='mastery'?'.wisp-mastery-section':'[data-wisp-card=ember]')+'").scrollIntoView({block:"start"})');const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,mode+'-'+scale+'.png'),Buffer.from(shot.data,'base64'));
    if(mode==='mastery'){await ev('document.querySelector("[data-mastery=ember]").scrollIntoView({block:"end"})');const controls=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,mode+'-controls-'+scale+'.png'),Buffer.from(controls.data,'base64'));}
    await ev('document.querySelectorAll(".toast").forEach(e=>e.style.visibility="")');
   }
  }
 }
 return {status:'PASS',checks,profiles:12,cases:records.length,browser:version,records,sourceSha256:crypto.createHash('sha256').update(source).digest('hex')};
}
(async()=>{let result;try{result=await run();}catch(e){result={status:'FAIL',checks,error:e.stack,records};
 if(session&&browser&&!closed){try{result.overflow=await ev('Array.from(document.querySelectorAll("body *")).filter(e=>e.getBoundingClientRect().width>0&&e.scrollWidth>e.clientWidth+2).map(e=>({tag:e.tagName,cls:e.className,w:e.clientWidth,scroll:e.scrollWidth,text:e.textContent.slice(0,180)})).slice(0,30)');const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,'failure.png'),Buffer.from(shot.data,'base64'));}catch{}}
 }
 try{if(browser&&!closed){await send('Browser.close',{},null).catch(()=>{});for(let i=0;i<100&&!closed;i++)await pause(50);if(!closed){browser.kill('SIGKILL');throw Error('browser cleanup timeout');}}if(server)await new Promise(r=>server.close(r));for(const p of [profile,stage])if(p)await fs.promises.rm(p,{recursive:true,force:true,maxRetries:3,retryDelay:100});}catch(e){result.status='FAIL';result.teardown=e.message;}
 fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({status:result.status,checks:result.checks,error:result.error,teardown:result.teardown}));if(result.status!=='PASS')process.exitCode=1;
})();
