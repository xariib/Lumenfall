'use strict';
// Synthetic emulator only. Never run against a connected player's installation.
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {transformFromProbes,nativePoint,requireCenteredPointer}=require('../lib/android-touch.cjs');
const packageId='com.lumenfall.app',primary='lumenfall_save_v2',recovery='lumenfall_save_recovery_v1';
const sockets=new Set();
let nativeLogcat;
const adb=(...args)=>cp.execFileSync('adb',args,{encoding:'utf8',timeout:120000});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function connect(){
 for(let i=0;i<90;i++){
  try{
   const pid=adb('shell','pidof',packageId).trim();if(!pid)throw Error('App not started');
   adb('forward','tcp:9222','localabstract:webview_devtools_remote_'+pid);
   const pages=await (await fetch('http://127.0.0.1:9222/json')).json(),page=pages.find(p=>p.type==='page'&&/^https:\/\/localhost(?:\/|$)/.test(p.url)&&p.webSocketDebuggerUrl);
   if(!page)throw Error('WebView not ready');
   const endpoint=new URL(page.webSocketDebuggerUrl);assert.equal(endpoint.protocol,'ws:');endpoint.hostname='127.0.0.1';endpoint.port='9222';console.log('Android upgrade QA: WebView endpoint '+endpoint.href);
   const socket=new WebSocket(endpoint.href);sockets.add(socket);socket.addEventListener('close',()=>sockets.delete(socket));await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{socket.close();reject(Error('DevTools handshake deadline'));},30000);socket.addEventListener('open',()=>{clearTimeout(timer);resolve();},{once:true});socket.addEventListener('error',()=>{clearTimeout(timer);socket.close();reject(Error('DevTools handshake failed'));},{once:true});});
   let seq=0;const pending=new Map();
   function rejectPending(message){for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error(message));}pending.clear();}
   socket.addEventListener('close',event=>rejectPending('DevTools closed: '+event.code+' '+event.reason));socket.addEventListener('error',()=>rejectPending('DevTools socket error'));
   socket.addEventListener('message',event=>{const m=JSON.parse(event.data),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}});
   const send=(method,params)=>new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);socket.close();reject(Error('DevTools command deadline: '+method));},30000);pending.set(id,{resolve,reject,timer});try{socket.send(JSON.stringify({id,method,params}));}catch(e){pending.delete(id);clearTimeout(timer);reject(e);}});
   const client={close:()=>socket.close(),command:send,evaluate:async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});assert(!r.exceptionDetails,JSON.stringify(r.exceptionDetails));return r.result.value;}};
   await send('Page.enable',{});await send('Runtime.enable',{});
   for(let n=0;n<90;n++){if(await client.evaluate("location.origin==='https://localhost'&&document.readyState==='complete'&&!!document.querySelector('#settings-btn')"))return client;await pause(200);}
   socket.close();throw Error('WebView app document readiness deadline');
  }catch(e){if(i===89)throw e;await pause(1000);}
 }
}
async function verifyInstalledWispCard(page,report){
 const size=adb('shell','wm','size').match(/(\d+)x(\d+)/);
 assert(size,'Android display dimensions available');
 const viewport=await page.evaluate('({width:innerWidth,height:innerHeight})');
 const scale=Number(size[1])/viewport.width;
 assert(Number.isFinite(scale)&&scale>0,'Android touch scale');
 await page.evaluate(`(()=>{window.nativeRecapEvents=[];['pointerdown','pointerup','touchstart','touchend','click'].forEach(type=>document.addEventListener(type,e=>nativeRecapEvents.push({type,trusted:e.isTrusted,target:e.target.id,x:e.clientX,y:e.clientY,time:performance.now(),interactive:!!e.target.closest('button,input,select,textarea,a,[role="button"]'),prevented:e.defaultPrevented}),true));return true;})()`);
 const points=await page.evaluate(`(()=>{const r=document.getElementById('welcome-text').getBoundingClientRect();return [{x:r.x+r.width/2-24,y:r.y+r.height/2-12},{x:r.x+r.width/2+24,y:r.y+r.height/2+12}];})()`);
 const probes=[];
 for(const point of points){
   const native={x:Math.round(point.x*scale),y:Math.round(point.y*scale)};
   adb('shell','input','tap',String(native.x),String(native.y));
   let event;
   for(let i=0;i<50;i++){
     event=await page.evaluate(`nativeRecapEvents.filter(e=>e.type==='pointerdown')[${probes.length}]||null`);
     if(event)break;await pause(100);
   }
   assert(event,'Native calibration pointer delivered');
   probes.push({native,event});
 }
 fs.writeFileSync('release-evidence/native-touch-calibration.json',JSON.stringify({viewport,scale,probes},null,2)+'\n');
 const transform=transformFromProbes(probes,scale);
 const tap=(x,y)=>{const p=nativePoint(transform,{x,y});return adb('shell','input','tap',String(p.x),String(p.y));};
 report.androidTouch={display:[Number(size[1]),Number(size[2])],viewport,scale,transform,probes};
 assert(await page.evaluate(`getComputedStyle(document.getElementById('welcome-overlay')).display!=='none'`),'Inert calibration leaves recap open');
 // The cold upgrade can show the ordinary offline recap. Dismiss it with a
 // trusted touch before measuring the shipped Wisp tab behind the overlay.
 const welcome=await page.evaluate(`(()=>{
   const button=Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='Continue'&&b.getBoundingClientRect().height>0);
   if(!button)return null;
   const r=button.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
   return {x,y,hit:document.elementFromPoint(x,y)?.closest('button')===button};
 })()`);
 if(welcome){
   assert(welcome.hit,'Offline recap Continue is reachable by native touch');
   await page.evaluate('nativeRecapEvents.length=0');
   const before=await page.command('Page.captureScreenshot',{format:'png'});
   fs.writeFileSync('release-evidence/offline-recap-before.png',Buffer.from(before.data,'base64'));
   fs.writeFileSync('release-evidence/offline-recap-window.txt',adb('shell','dumpsys','window','windows'));
   tap(welcome.x,welcome.y);
   await pause(350);
   const stillOpen=await page.evaluate(`Array.from(document.querySelectorAll('button')).some(b=>b.textContent.trim()==='Continue'&&b.getBoundingClientRect().height>0&&document.elementFromPoint(b.getBoundingClientRect().left+b.getBoundingClientRect().width/2,b.getBoundingClientRect().top+b.getBoundingClientRect().height/2)?.closest('button')===b)`);
   const diagnostic=await page.evaluate(`({events:nativeRecapEvents,open:getComputedStyle(document.getElementById('welcome-overlay')).display,ready:!document.documentElement.classList.contains('startup-pending'),height:innerHeight,width:innerWidth,ratio:devicePixelRatio})`);
   fs.writeFileSync('release-evidence/offline-recap-input.json',JSON.stringify({welcome,stillOpen,...diagnostic},null,2)+'\n');
   const after=await page.command('Page.captureScreenshot',{format:'png'});
   fs.writeFileSync('release-evidence/offline-recap-after.png',Buffer.from(after.data,'base64'));
   requireCenteredPointer(diagnostic.events,welcome,'welcome-claim');
   assert.equal(diagnostic.open,'none','Actual recap overlay closed after centered native click');
   assert(!stillOpen,'Offline recap closed before Wisp inspection');
 }
 assert(welcome,'Mandatory synthetic offline recap must be shown before Wisp inspection');
 report.offlineRecapDismissed=!!welcome;
 // Inspect the shipped UI inside the installed APK's actual Android WebView.
 const ui=await page.evaluate(`(async()=>{
   const tab=document.querySelector('[data-tab="spirits"]');
   if(!tab)return {error:'Wisp tab missing'};
   tab.click();
   await new Promise(resolve=>setTimeout(resolve,500));
   const panel=document.getElementById('tab-spirits');
   const cards=panel&&Array.from(panel.querySelectorAll('[data-wisp-card]'));
   if(!cards||!cards.length)return {error:'Wisp cards missing after tab activation'};
   const visible=e=>!!e&&e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0;
   const installedSave=JSON.parse(localStorage.getItem('lumenfall_save_v2'));
   const observations=cards.map(card=>{
     const id=card.getAttribute('data-wisp-card'),name=card.querySelector('.hero-id .name')?.textContent||'';
     const actions=Array.from(card.querySelectorAll('[data-empower],[data-rarity],[data-module],[data-ultimate],[data-mastery]'));
     const primary=Array.from(card.querySelectorAll('.wisp-action-primary'));
     const progression=card.querySelector('[data-wisp-progression]');
     const module=card.querySelector('[data-module]');
     const rarityMaxed=installedSave.heroRarity[id]>=5;
     const rarityComplete=rarityMaxed&&visible(card.querySelector('.wisp-rarity-section[data-state="maxed"]'))&&!card.querySelector('[data-rarity]');
     const boundary=card.getBoundingClientRect();
     const overflow=Array.from(card.querySelectorAll('*')).filter(e=>{
       const r=e.getBoundingClientRect();return r.width>0&&(r.right>boundary.right+1||e.scrollWidth>e.clientWidth+1);
     }).slice(0,16).map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {tag:e.tagName,cls:String(e.className).slice(0,90),text:e.textContent.slice(0,65),
       right:Math.round(r.right),scroll:e.scrollWidth,client:e.clientWidth,minWidth:s.minWidth,whiteSpace:s.whiteSpace};});
     return {id,name,visible:visible(card),fits:overflow.length===0&&boundary.left>=-1&&boundary.right<=innerWidth+1,
       width:{client:card.clientWidth,scroll:card.scrollWidth,right:Math.round(boundary.right)},overflow,
       identity:card.textContent.includes('Wisp Power')&&!!card.querySelector('.rarity-badge')&&!!card.querySelector('[data-wisp-role]'),
       unfinished:!!module&&!!progression&&progression.tagName!=='DETAILS'&&!progression.querySelector('summary'),
       upgradeVisible:visible(progression)&&progression.tagName!=='DETAILS'&&(
         (rarityMaxed?rarityComplete:visible(card.querySelector('[data-rarity]')))&&visible(card.querySelector('[data-module]'))&&
         (visible(card.querySelector('[data-ultimate]'))||visible(card.querySelector('.ultimate-badge')))),
       rarityMaxed,rarityComplete,
       eligible:actions.some(button=>!button.disabled),
       primary:primary.map(button=>({disabled:button.disabled,cue:button.querySelector('.wisp-next-label')?.textContent||'',
         name:button.getAttribute('aria-label')||''})),
       modulePrices:module?.querySelectorAll('.cost-icon').length||0,
       currentEffect:!!card.querySelector('[data-ability-current]'),
       nextEffect:!!card.querySelector('[data-ability-next]')};
   });
   cards[0].scrollIntoView({block:'start',behavior:'instant'});
   return {viewport:innerWidth,viewportFit:document.documentElement.scrollWidth<=innerWidth+1,tabVisible:visible(panel),count:cards.length,observations};
 })()`);
 fs.mkdirSync('release-evidence',{recursive:true});
 fs.writeFileSync('release-evidence/installed-wisp-diagnostic.json',JSON.stringify(ui,null,2)+'\n');
 const screenshot=await page.command('Page.captureScreenshot',{format:'png'});
 assert(screenshot.data,'Installed Wisp screenshot captured');
 fs.writeFileSync('release-evidence/installed-wisp-card.png',Buffer.from(screenshot.data,'base64'));
 assert(!ui.error,ui.error);
 assert(ui.viewport>=320&&ui.viewport<=500,'Expected mobile Android WebView width: '+ui.viewport);
 assert(ui.tabVisible&&ui.viewportFit,'Wisp tab visible without horizontal page scroll in installed WebView');
 assert.equal(ui.count,8,'All eight Wisps render in installed WebView');
 for(const card of ui.observations){
   assert(card.visible&&card.fits&&card.identity,'Wisp identity/geometry: '+JSON.stringify(card));
   assert(card.upgradeVisible&&card.currentEffect&&card.nextEffect,'Unfinished Wisp upgrades/effects: '+JSON.stringify(card));
   assert.equal(card.primary.length,card.eligible?1:0,'One original enabled next action, or none: '+card.id);
   for(const action of card.primary)assert(!action.disabled&&action.cue==='Next ·'&&action.name.includes('Next ·')&&action.name.includes(card.name),'Live visible and accessible action: '+card.id);
 }
 const ember=ui.observations.find(card=>card.id==='ember');
 assert(ember&&ember.unfinished&&ember.modulePrices===2,'Installed Ember keeps both Ability prices and unfinished progress');
 assert(ember.rarityMaxed&&ember.rarityComplete,'Installed maxed Ember Rarity stays gold without a completed purchase button');
 // Unfinished upgrades are directly available. Preserve the actual Android
 // touch purchase below; there is no disclosure activation in the new UI.
 assert(await page.evaluate(`(()=>{const p=document.querySelector('[data-wisp-progression="ember"]');return p&&p.tagName!=='DETAILS'&&!p.querySelector('summary')&&p.getClientRects().length>0;})()`),'Installed Wisp upgrades stay directly visible');
 const target=await page.evaluate(`(()=>{
   const button=document.querySelector('[data-wisp-card="ember"] .wisp-action-primary[data-module="ember"]');
   if(!button)return {error:'Funded Ember Ability is not the highlighted original action'};
   button.scrollIntoView({block:'center',behavior:'instant'});
   const r=button.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
   return {x,y,hit:document.elementFromPoint(x,y)?.closest('button')===button,
     before:JSON.parse(localStorage.getItem('lumenfall_save_v2')).wispModules.ember};
 })()`);
 assert(!target.error,target.error);assert(target.hit,'Native touch reaches highlighted Ability');
 tap(target.x,target.y);
 let purchase;
 for(let i=0;i<30;i++){
   purchase=await page.evaluate(`(()=>{
     const save=JSON.parse(localStorage.getItem('lumenfall_save_v2'));
     const button=document.querySelector('[data-wisp-card="ember"] [data-module="ember"]');
     return {level:save.wispModules.ember,priceCount:button?.querySelectorAll('.cost-icon').length||0,
       focused:document.activeElement===button,
       name:button?.getAttribute('aria-label')||''};
   })()`);
   if(purchase.level===target.before+1)break;
   await pause(100);
 }
 assert.equal(purchase.level,target.before+1,'Trusted Android WebView touch buys exactly one Ability level');
 assert.equal(purchase.priceCount,2,'Next Ability price remains visible after native purchase');
 assert(purchase.focused&&purchase.name.includes('Next ·')&&purchase.name.includes('Ember Wisp'),'Native purchase restores focus with fresh accessible action');
 report.installedWispTouch={status:'PASS',fromLevel:target.before,toLevel:purchase.level,focusedName:purchase.name};
 report.installedWispCard={status:'PASS',...ui,screenshot:'release-evidence/installed-wisp-card.png'};
 console.log('Android installed Wisp UI acceptance: '+JSON.stringify(report.installedWispCard));
}
async function prepareOfflineRecap(page,retainedSave){
 // Save/paid-work preservation has already passed. Exercise a real one-minute
 // offline return only in this disposable emulator, without product test hooks.
 const fixture=JSON.parse(JSON.stringify(retainedSave));
 fixture.tutorialDone=true;
 const marker='native-offline-recap-'+Date.now();
 // This synthetic absence is created only after both untouched upgrade saves
 // passed preservation checks. Seed both endpoints of the uncredited minute;
 // changing lastSeen alone correctly exercises the game's replay rejection.
 const source=`(()=>{const seed=${JSON.stringify(fixture)};seed.lastSeen=Date.now()-60000;
   seed.offlineClockHighWaterMs=seed.lastSeen;
   const d=new Date();seed.questDay=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
   const raw=JSON.stringify(seed);localStorage.setItem(${JSON.stringify(primary)},raw);
   localStorage.setItem(${JSON.stringify(recovery)},raw);
   localStorage.setItem('native-offline-recap-fixture',${JSON.stringify(marker)});
   localStorage.removeItem('lumenfall_startup_intro_last');})()`;
 const injected=await page.command('Page.addScriptToEvaluateOnNewDocument',{source});
 assert(injected.identifier,'Recap fixture registered');
 let sameSession=true,applied=false;
 try{await page.command('Page.reload',{ignoreCache:true});}
 catch(e){if(!/^DevTools closed:/.test(e.message))throw e;page.close();page=await connect();sameSession=false;}
 // Page.reload acknowledges navigation before the new document runs. Closing
 // its CDP session immediately can remove the fixture before it ever executes.
 for(let n=0;n<120;n++){
   try{applied=await page.evaluate(`localStorage.getItem('native-offline-recap-fixture')===${JSON.stringify(marker)}`);}
   catch(e){if(!/^DevTools closed:/.test(e.message))throw e;page.close();page=await connect();sameSession=false;}
   if(applied)break;await pause(250);
 }
 assert(applied,'Pre-document offline fixture actually executed');
 if(sameSession)await page.command('Page.removeScriptToEvaluateOnNewDocument',{identifier:injected.identifier});
 let shown=false;
 for(let n=0;n<120;n++){
   shown=await page.evaluate(`document.readyState==='complete'&&!!document.getElementById('welcome-overlay')&&!document.documentElement.classList.contains('startup-pending')&&getComputedStyle(document.getElementById('welcome-overlay')).display!=='none'`);
   if(shown)break;await pause(250);
 }
 const diagnostic=await page.evaluate(`({fixture:localStorage.getItem('native-offline-recap-fixture'),ready:!document.documentElement.classList.contains('startup-pending'),recap:getComputedStyle(document.getElementById('welcome-overlay')).display,text:document.getElementById('welcome-text').textContent,save:JSON.parse(localStorage.getItem(${JSON.stringify(primary)}))})`);
 fs.writeFileSync('release-evidence/offline-recap-startup.json',JSON.stringify(diagnostic,null,2)+'\n');
 assert(diagnostic.save.totalOfflineSeconds>=fixture.totalOfflineSeconds+60,'Synthetic absent minute is actually credited before recap acceptance');
 const shot=await page.command('Page.captureScreenshot',{format:'png'});
 fs.writeFileSync('release-evidence/offline-recap-startup.png',Buffer.from(shot.data,'base64'));
 assert(shown,'Real offline recap appears after intro and catch-up');
 return page;
}
async function verifyInstalledMidgameFarmHint(page,report,retainedSave){
 // All original save and entitlement checks have passed. Seed only this
 // disposable emulator; production state is private to the app's IIFE.
 const fixture=JSON.parse(JSON.stringify(retainedSave));
 Object.assign(fixture,{ascendCount:1,maxDepthEver:30,depth:26,enemyDepth:26,
   riftMode:'farm',farmDepth:20,farmReturnDepth:26,lumen:800,shards:80,
   activeStudies:[],autoAscendEnabled:false,lastSeen:Date.now()});
 fixture.longStudyLevels.wispascend=0;
 const marker='midgame-farm-installed-accept-001';
 const seedScript=`(()=>{const s=${JSON.stringify(JSON.stringify(fixture))};
   localStorage.setItem(${JSON.stringify(primary)},s);
   localStorage.setItem(${JSON.stringify(recovery)},s);
   localStorage.setItem('midgame-farm-fixture',${JSON.stringify(marker)});})()`;
 const injected=await page.command('Page.addScriptToEvaluateOnNewDocument',{source:seedScript});
 assert(injected.identifier,'Disposable Farm fixture registered before document startup');
 try{await page.command('Page.reload',{ignoreCache:true});}
 catch(e){if(!/^DevTools closed:/.test(e.message))throw e;}
 await pause(1500);page.close();
 page=await connect();
 const applied=await page.evaluate(`({origin:location.origin,marker:localStorage.getItem('midgame-farm-fixture'),
   save:JSON.parse(localStorage.getItem('lumenfall_save_v2'))})`);
 assert.equal(applied.origin,'https://localhost');
 assert.equal(applied.marker,marker,'Disposable Farm fixture loaded in installed WebView');
 assert.equal(applied.save.riftMode,'farm','Installed app retained Farm mode');
 assert.equal(applied.save.ascendCount,1,'Installed app retained first Ascend fixture');
 const size=adb('shell','wm','size').match(/(\d+)x(\d+)/),viewport=await page.evaluate('({width:innerWidth,height:innerHeight})');
 assert(size&&viewport.width,'Native touch dimensions for Farm guidance');
 assert.deepEqual(viewport,report.androidTouch.viewport,'Native viewport unchanged after Farm reload');
 assert.deepEqual([Number(size[1]),Number(size[2])],report.androidTouch.display,'Native display unchanged');
 const tap=(point)=>{const p=nativePoint(report.androidTouch.transform,point);adb('shell','input','tap',String(p.x),String(p.y));};
 const hint=await page.evaluate(`(()=>{
   document.querySelector('[data-tab="battle"]').click();
   const e=document.querySelector('#rift-objective'),r=e.getBoundingClientRect(),v=document.querySelector('#rift-objective-row').getBoundingClientRect();
   const x=r.left+r.width/2,y=(Math.max(r.top,v.top)+Math.min(r.bottom,v.bottom))/2;
   return {kind:e.querySelector('.objective-kind')?.textContent,title:e.querySelector('strong')?.textContent,
     detail:e.querySelector('small')?.textContent,name:e.getAttribute('aria-label'),
     target:e.getAttribute('data-target-tab'),selector:e.getAttribute('data-target-selector'),
     x,y,hit:document.elementFromPoint(x,y)?.closest('#rift-objective')===e,
     fit:document.documentElement.scrollWidth<=innerWidth+1};
 })()`);
 fs.writeFileSync('release-evidence/installed-midgame-farm-diagnostic.json',JSON.stringify(hint,null,2)+'\n');
 assert.equal(hint.kind,'POWER OPTION');
 assert.equal(hint.title,'Lab hint');
 assert.equal(hint.detail,'+15% passive Wisp damage after study · 800 Lumen + 80 Shards');
 assert(hint.name==='Read Lab hint — Power option: Wisp Ascendancy 1 — '+hint.detail&&hint.target==='research'&&hint.selector.includes('wispascend'),'Installed accessible hint retains full current Lab quote');
 assert(hint.hit&&hint.fit,'Installed Farm hint fits and receives native touch');
 tap(hint);
 let details;
 for(let i=0;i<50;i++){
   details=await page.evaluate(`(()=>{const o=document.querySelector('#rift-hint-overlay'),b=document.querySelector('#rift-hint-open-lab'),r=b.getBoundingClientRect();return {
     open:getComputedStyle(o).display!=='none',title:document.querySelector('#rift-hint-title').textContent,
     detail:document.querySelector('#rift-hint-detail').textContent,x:r.x+r.width/2,y:r.y+r.height/2,
     fit:o.querySelector('.modal').scrollWidth<=o.querySelector('.modal').clientWidth+1,
     hit:b.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))};})()`);
   if(details.open)break;
   await pause(100);
 }
 assert(details.open&&details.title==='Power option: Wisp Ascendancy 1'&&details.detail===hint.detail,'Native touch opens full current Lab advice');
 assert(details.fit&&details.hit,'Installed details wrap and Lab action receives touch');
 const shot=await page.command('Page.captureScreenshot',{format:'png'});
 assert(shot.data,'Installed Farm screenshot captured');
 fs.writeFileSync('release-evidence/installed-midgame-farm.png',Buffer.from(shot.data,'base64'));
 tap(details);
 await pause(350);
 const destination=await page.evaluate(`(()=>{const card=document.querySelector('[data-study-card="wispascend"]');return {
   lab:document.querySelector('#tab-research').classList.contains('active'),
   card:!!card&&card.getBoundingClientRect().width>0,focused:document.activeElement===card};})()`);
 assert(destination.lab&&destination.card&&destination.focused,'Native touch navigates to and focuses Wisp Ascendancy');
 report.installedMidgameFarmHint={status:'PASS',hint,details,destination,screenshot:'release-evidence/installed-midgame-farm.png',syntheticFixture:true};
 console.log('Android installed Farm guidance acceptance: '+JSON.stringify(report.installedMidgameFarmHint));
 return page;
}
async function verifyInstalledRiftNavigation(page,report){
 await page.evaluate(`document.querySelector('[data-tab="battle"]').click()`);
 const snapshot=()=>page.evaluate(`JSON.parse(localStorage.getItem(${JSON.stringify(primary)}))`);
 const before=await snapshot(),steps=[];
 assert.equal(before.riftMode,'farm','Navigation uses the existing disposable Farm fixture');
 assert.equal(before.farmDepth,25,'Existing boss-excluding fixture farms Rift25');
 const returning=before.farmReturnDepth;
 async function tap(selector){
   const point=await page.evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)}),r=e.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;return {x,y,width:r.width,height:r.height,disabled:e.disabled,hit:e.contains(document.elementFromPoint(x,y))};})()`);
   assert(point.width>=44&&point.height>=44&&point.hit&&!point.disabled,'Installed navigation receives touch: '+selector);
   const p=nativePoint(report.androidTouch.transform,point);
   adb('shell','input','tap',String(p.x),String(p.y));await pause(200);
 }
 for(const [selector,depth]of [['#rift-back-one',24],['#rift-back-ten',14],['#rift-forward-one',15],['#rift-back-one',14],['#rift-back-ten',4],['#rift-back-ten',1]]){
   await tap(selector);const s=await snapshot();
   assert.equal(s.riftMode,'farm','Native navigation preserves manual Farm');
   assert.equal(s.farmDepth,depth,'Native navigation reaches the expected Rift');
   assert.equal(s.farmReturnDepth,returning,'Native navigation preserves saved Push');
   assert.equal(s.farmAutoResume,false,'Native navigation cancels automatic retry');
   steps.push({selector,depth});
 }
 assert(await page.evaluate(`!document.getElementById('farm-picker-overlay')&&document.getElementById('rift-back-one').disabled&&document.getElementById('rift-back-ten').disabled`),'No picker and backward controls stop at Rift1');
 const shot=await page.command('Page.captureScreenshot',{format:'png'});
 fs.writeFileSync('release-evidence/installed-rift-navigation.png',Buffer.from(shot.data,'base64'));
 await tap('#rift-push-btn');const resumed=await snapshot();
 assert.equal(resumed.riftMode,'push','Native Push resumes progression');
 assert(resumed.depth>=returning,'Native Push retains the saved frontier while combat continues');
 report.installedRiftNavigation={status:'PASS',steps,returning,resumedDepth:resumed.depth,screenshot:'release-evidence/installed-rift-navigation.png',syntheticFixture:true};
 console.log('Android installed Rift navigation acceptance: '+JSON.stringify(report.installedRiftNavigation));
}
async function main(){
 assert(!fs.existsSync('release-evidence/emulator-upgrade.json'),'Fresh emulator upgrade output required');
 console.log('Android upgrade QA: starting disposable emulator check');
 assert.match(adb('get-serialno').trim(),/^emulator-/,'Only a disposable emulator is accepted');
 fs.mkdirSync('release-evidence',{recursive:true});
 const log=fs.openSync('release-evidence/native-logcat.txt','w');
 nativeLogcat=cp.spawn('adb',['logcat','-v','threadtime'],{stdio:['ignore',log,log]});fs.closeSync(log);
 nativeLogcat.on('error',e=>console.error('Live native diagnostic: '+e.message));
 const baseline=process.argv[2],candidate=process.argv[3];assert(baseline&&candidate);
 const report={baseline,candidate,package:packageId,commit:process.env.GITHUB_SHA,apkSha256:require('node:crypto').createHash('sha256').update(fs.readFileSync(candidate)).digest('hex'),device:adb('shell','getprop','ro.build.fingerprint').trim(),webview:adb('shell','dumpsys','webviewupdate').slice(0,2000)};
 assert.match(adb('install',baseline),/Success/);adb('shell','am','start','-n',packageId+'/.MainActivity');
 console.log('Android upgrade QA: old APK installed; connecting to WebView');let page=await connect(),saved;
 for(let i=0;i<90;i++){saved=await page.evaluate(`localStorage.getItem(${JSON.stringify(primary)})`);if(saved)break;await pause(1000);}assert(saved,'Old APK must create a real save');
 console.log('Android upgrade QA: real old save obtained; preparing pre-document fixture');
 const seed=JSON.parse(saved);Object.assign(seed,{lumen:1e12,shards:1e12,prisms:777,comets:222,motes:88,sigils:345,ascendCount:12,maxDepthEver:1000,lastSeen:Date.now(),autoAscendEnabled:false,autoEmpower:false});
 seed.spirits.ember=33;seed.spirits.stone=22;seed.heroRarity.ember=5;seed.wispModules.ember=10;seed.wispUltimate.ember=true;seed.nodes.swift=3;seed.research.arcanecal=4;
 // These are all four actual purchases in the archived158 SHOP. Meteor/Call
 // were introduced later; the old app correctly discards those unknown flags.
 const legacyPurchases=['comettrials','rifttrail','starfallcrest'];
 seed.owned.autoascend=true;for(const id of legacyPurchases)seed.owned[id]=true;
 seed.cometCosmetics={trail:true,crest:true};seed.cometTrialMarks={quiet:true,single:true};
 for(const obj of ['empowerQueue','researchQueue','studyQueue'])for(const k of Object.keys(seed[obj]||{}))seed[obj][k]=false;
 const study=Object.keys(seed.longStudyLevels)[0];seed.longStudyLevels[study]=3;seed.activeStudies=[{id:study,remainingSec:3500,totalDurationSec:3600,speedMult:2}];
 seed.studyUseMotes[study]=false;seed.studySpeedTargets[study]=2;
 const sentinel='repository-migration-001-synthetic';
 report.beforeOrigin=await page.evaluate('location.origin');assert.equal(report.beforeOrigin,'https://localhost');
 const seedScript=`(()=>{const s=${JSON.stringify(JSON.stringify(seed))};localStorage.setItem(${JSON.stringify(primary)},s);localStorage.setItem(${JSON.stringify(recovery)},s);localStorage.setItem('migration-upgrade-probe',${JSON.stringify(sentinel)});window.__migrationSeedApplied=true;})()`;
 // Load the synthetic legacy save before the old game initializes. Writing only
 // storage while its previous in-memory state runs would let autosave overwrite
 // the fixture. The injection is removed before the cold baseline and upgrade.
 const injected=await page.command('Page.addScriptToEvaluateOnNewDocument',{source:seedScript});
 assert(injected.identifier,'Pre-document fixture registered');
 console.log('Android upgrade QA: fixture registered; reloading old WebView');
 try{await page.command('Page.reload',{ignoreCache:true});}catch(e){if(!/^DevTools closed:/.test(e.message))throw e;console.log('Android upgrade QA: reload replaced DevTools target; cold restart will verify fixture');}
 // WebView commits DOM storage asynchronously. Establish a durable old-app
 // fixture through an actual cold restart before testing package replacement.
 // Force-stop destroys this process and its transient CDP pre-document scripts.
 // Do not issue another command to a target the native reload may have replaced.
 await pause(8000);
 page.close();page=await connect();
 const liveFixture=await page.evaluate(`({origin:location.origin,sentinel:localStorage.getItem('migration-upgrade-probe'),save:JSON.parse(localStorage.getItem(${JSON.stringify(primary)})),recovery:JSON.parse(localStorage.getItem(${JSON.stringify(recovery)}))})`);
 fs.writeFileSync('release-evidence/old-fixture-live.json',JSON.stringify(liveFixture,null,2)+'\n');
 assert.equal(liveFixture.sentinel,sentinel,'Reload injection must actually write the old fixture before cold restart');
 assert.equal(liveFixture.save.spirits.ember,33,'Old live fixture progression accepted');assert.equal(liveFixture.recovery.spirits.ember,33,'Old live recovery progression accepted');
 await pause(6000);
 console.log('Android upgrade QA: stopping seeded old process; restarting without injection');
 page.close();adb('shell','am','force-stop',packageId);
 adb('shell','am','start','-n',packageId+'/.MainActivity');page=await connect();await pause(3000);
 const oldCold=await page.evaluate(`({origin:location.origin,sentinel:localStorage.getItem('migration-upgrade-probe'),save:JSON.parse(localStorage.getItem(${JSON.stringify(primary)})),recovery:JSON.parse(localStorage.getItem(${JSON.stringify(recovery)}))})`);
 assert.equal(oldCold.origin,report.beforeOrigin);assert.equal(oldCold.sentinel,sentinel,'Old APK fixture must survive its own cold restart before upgrade');assert(oldCold.save&&oldCold.recovery,'Old APK retains both baseline slots');assert.equal(oldCold.save.spirits.ember,33,'Old APK accepted the synthetic progression');assert.equal(oldCold.save.heroRarity.ember,5,'Old APK accepted the synthetic paid rarity');
 for(const slot of [oldCold.save,oldCold.recovery]){for(const id of ['autoascend',...legacyPurchases])assert.equal(slot.owned[id],true,'Actual old purchase present before update: '+id);assert.deepEqual(slot.cometCosmetics,seed.cometCosmetics);assert.deepEqual(slot.cometTrialMarks,seed.cometTrialMarks);}
 report.baselineColdRestartVerified=true;
 await pause(6000);page.close();adb('shell','am','force-stop',packageId);
 console.log('Android upgrade QA: synthetic old save verified after actual old-APK cold restart');
 const beforePackage=adb('shell','dumpsys','package',packageId),beforeUid=beforePackage.match(/userId=(\d+)/)[1];report.baselineVersionCode=Number(beforePackage.match(/versionCode=(\d+)/)[1]);
 assert.match(adb('install','-r',candidate),/Success/,'Actual in-place package replacement');
 const afterPackage=adb('shell','dumpsys','package',packageId),afterUid=afterPackage.match(/userId=(\d+)/)[1];assert.equal(afterUid,beforeUid,'Android UID retained');report.candidateVersionCode=Number(afterPackage.match(/versionCode=(\d+)/)[1]);assert(report.candidateVersionCode>report.baselineVersionCode,'Actual installed Android version increases');report.beforeUid=beforeUid;report.afterUid=afterUid;
 adb('shell','am','start','-n',packageId+'/.MainActivity');page=await connect();
 const currentSchema=Number(fs.readFileSync('index.html','utf8').match(/var SAVE_SCHEMA_VERSION = (\d+);/)[1]);let persisted=false;
 for(let i=0;i<90;i++){persisted=await page.evaluate(`(()=>{try{return [${JSON.stringify(primary)},${JSON.stringify(recovery)}].every(k=>JSON.parse(localStorage.getItem(k)).schemaVersion===${currentSchema});}catch(e){return false;}})()`);if(persisted)break;await pause(1000);}assert(persisted,'Actual new app must persist both migrated slots');
 await pause(3000);
 const observed=await page.evaluate(`({origin:location.origin,sentinel:localStorage.getItem('migration-upgrade-probe'),save:JSON.parse(localStorage.getItem(${JSON.stringify(primary)})),recovery:JSON.parse(localStorage.getItem(${JSON.stringify(recovery)}))})`);fs.writeFileSync('release-evidence/new-upgrade-state.json',JSON.stringify(observed,null,2)+'\n');
 assert.equal(observed.origin,report.beforeOrigin);assert.equal(observed.sentinel,sentinel);assert(observed.save&&observed.recovery,'Both save slots retained');
 for(const [slot,s] of Object.entries({primary:observed.save,recovery:observed.recovery})){
 for(const field of ['lumen','shards','prisms','comets','motes','sigils'])assert(s[field]>=seed[field],slot+': '+field+' retained');
 for(const [field,id] of [['spirits','ember'],['spirits','stone'],['heroRarity','ember'],['wispModules','ember'],['wispUltimate','ember'],['nodes','swift'],['research','arcanecal'],['longStudyLevels',study]])assert.equal(s[field][id],seed[field][id],field+'.'+id+' retained');
 const running=s.activeStudies.find(x=>x.id===study);assert(running,'Paid Study retained');assert.equal(running.speedMult,2);assert.equal(running.totalDurationSec,3600);assert(running.remainingSec>0&&running.remainingSec<=3500);
 assert.equal(s.owned.autoascend,true,'Actual paid Auto-Ascend retained');
 for(const id of legacyPurchases)assert.equal(s.cometClaims.retired[id],'settled','Actual paid legacy entitlement/credit retained: '+id);
 assert(s.comets>=oldCold.save.comets+350,'Independent140+50+160 legacy purchase credits retained');
 assert.deepEqual(s.cometCosmetics,seed.cometCosmetics,'Paid equipped cosmetics retained');assert.deepEqual(s.cometTrialMarks,seed.cometTrialMarks,'Earned paid Trial marks retained');
 assert.equal(s.autoAscendEnabled,false,'Saved Auto-Ascend choice retained');assert.equal(s.autoAscendTargetDepth,seed.autoAscendTargetDepth,'Saved target retained');
 for(const group of ['empowerQueue','researchQueue','studyQueue'])for(const id of Object.keys(seed[group]||{}))assert.equal(s[group][id],false,'Saved queue choice retained: '+group+'/'+id);
 }
 assert(observed.save.recruitmentEntitlements.ember&&observed.save.recruitmentEntitlements.stone,'Legacy recruits retain entitlement');
 page=await prepareOfflineRecap(page,observed.save);
 await verifyInstalledWispCard(page,report);
 page=await verifyInstalledMidgameFarmHint(page,report,observed.save);
 await verifyInstalledRiftNavigation(page,report);page.close();
 report.status='PASS';report.uidRetained=true;report.origin=observed.origin;report.bothSaveSlotsRetained=true;report.progressAndPaidStudyRetained=true;report.legacyCometEntitlementsRetained=true;report.legacyPurchaseCredit=350;report.physicalDevice=false;
 fs.mkdirSync('release-evidence',{recursive:true});fs.writeFileSync('release-evidence/emulator-upgrade.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}
const watchdog=setTimeout(()=>{console.error('Android upgrade QA overall deadline');process.exit(1);},600000);
main().catch(e=>{console.error(e.stack);try{fs.mkdirSync('release-evidence',{recursive:true});fs.writeFileSync('release-evidence/upgrade-failure-logcat.txt',adb('logcat','-d','-t','1500'));}catch(diagnostic){console.error('Native diagnostic failed: '+diagnostic.message);}process.exitCode=1;}).finally(()=>{clearTimeout(watchdog);if(nativeLogcat)nativeLogcat.kill();for(const socket of sockets)socket.close();});
