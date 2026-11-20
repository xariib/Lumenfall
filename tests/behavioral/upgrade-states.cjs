'use strict';
// Real DOM, computed colors, native disabled actions and source-bound evidence.
// Test-only fixtures/bridge; production save and purchase functions stay intact.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http');
const {spawn}=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {findChrome}=require('../../scripts/lib/browser.cjs');
const file=path.resolve(process.argv[2]||'index.html'),out=path.resolve(process.argv[3]||'validation-evidence/upgrade-states');
let source=fs.readFileSync(file,'utf8');
if(process.argv.includes('--mutate-gold'))source=source.replace('#tab-ascend .node-card[data-state="maxed"]','[data-never-gold]');
if(process.argv.includes('--mutate-lock'))source=source.replace('if(!plan.eligible)return wispUpgradeUnlockText(sp,plan);','if(false)return wispUpgradeUnlockText(sp,plan);');
if(process.argv.includes('--mutate-red'))source=source.replace("Amount.valid(amount) && missing ? 'var(--danger)'", "Amount.valid(amount) && false ? 'var(--danger)'");
const bridge=String.raw`
window.upgradeQa={
 seed:function(){var s=freshState();s.totalKills=100;s.maxDepthEver=100000;s.ascendCount=10000;s.questDay=todayStr();s.lastSeen=Date.now();s.activeParty=['ember'];
  SPIRITS.forEach(function(n){s.spirits[n.id]=1000;s.heroRarity[n.id]=5;s.wispModules[n.id]=20;s.wispUltimate[n.id]=true;s.empowerQueue[n.id]=false;});
  LONG_STUDIES.forEach(function(n){s.longStudyLevels[n.id]=n.levelCap||250;});RESEARCH.forEach(function(n){s.research[n.id]=n.levelCap||300;});NODES.forEach(function(n){s.nodes[n.id]=n.levelCap||100;});return s;},
 set:function(s,tab){state=acceptPersistedState(s);selectedStudySlot=0;renderAll();activateTab(tab);},
 open:function(id){if(managedWispId!==id)openWispManagement(id);},
 patch:function(s){Object.keys(s).forEach(function(k){state[k]=s[k];});lastAffordabilityAt=0;checkAffordability();},
 get:function(){return JSON.stringify(state);},saves:function(){return JSON.stringify([localStorage.getItem(SAVE_KEY),localStorage.getItem(RECOVERY_SAVE_KEY)]);},
 ready:function(){if(startupIntroFinish)startupIntroFinish();document.querySelectorAll('.overlay,#startup-intro').forEach(function(e){e.style.display='none';});document.querySelector('.shell').inert=false;},
 wisps:SPIRITS.map(function(n){return n.id;}),forge:RESEARCH.filter(function(n){return !n.retiredTo;}),lab:LONG_STUDIES.filter(function(n){return !n.retiredTo;}),tree:NODES.filter(function(n){return !n.retired&&!n.retiredTo;}),shop:SHOP,
 plans:function(id,key){var sp=SPIRITS.find(function(n){return n.id===id;});return ({empower:getSpiritBuyPlan,rarity:getWispRarityPlan,module:getWispModulePlan,ultimate:getWispUltimatePlan,mastery:getWispMasteryPlan})[key](sp);}
};`;
const marker='\n})();\n</script>\n<script>\nif(window.Capacitor';assert.equal(source.split(marker).length,2);
const prelude='<script>window.__upgradeErrors=[];window.onerror=function(m){__upgradeErrors.push(m);};window.setInterval=function(){};window.requestAnimationFrame=function(){};Object.defineProperty(performance,"now",{value:function(){return 0;}});</script>';
const html=source.replace('<head>','<head>'+prelude).replace(marker,'\n'+bridge+marker);
let browser,server,ws,session,profile,exitPromise,seq=0,checks=0;const pending=new Map(),records=[];
const pause=ms=>new Promise(r=>setTimeout(r,ms));
function ok(v,m){checks++;assert(v,m);}
function send(method,params={},sid=session){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP deadline '+method));},30000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})}));});}
async function ev(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
async function install(s,tab){await ev('upgradeQa.set('+JSON.stringify(s)+','+JSON.stringify(tab)+');upgradeQa.ready()');await ev('Promise.all(document.getElementById("tab-'+tab+'").getAnimations().map(a=>a.finished)).then(()=>true)');}
async function observe(selector){return ev('('+function(selector){
 var e=document.querySelector(selector);if(!e)throw Error('Missing upgrade '+selector);var card=e.closest('[data-wisp-card]');if(card){upgradeQa.open(card.dataset.wispCard);e=document.querySelector(selector);}const css=getComputedStyle(e);
 const probe=document.createElement('span');probe.style.color='var(--danger)';document.body.appendChild(probe);const red=getComputedStyle(probe).color;probe.remove();
 const rect=e.getBoundingClientRect();
 return {text:e.textContent,disabled:e.disabled,state:e.dataset.state,width:rect.width,height:rect.height,direction:css.flexDirection,wrap:css.flexWrap,border:css.borderTopWidth+' '+css.borderTopColor,prices:Array.from(e.querySelectorAll('[data-price-currency]')).map(p=>({kind:p.dataset.priceCurrency,amount:Number(p.dataset.priceAmount),red:getComputedStyle(p).color===red})),gold:css.borderTopColor==='rgb(217, 180, 94)'&&parseFloat(css.borderTopWidth)>=2,overflow:e.scrollWidth>e.clientWidth+1};
}.toString()+')('+JSON.stringify(selector)+')');}
async function unchanged(expression,label){
 // Compare within the operation's JS turn; unrelated real visibility events
 // between CDP requests may legitimately save the current state.
 const result=await ev('(function(){var before=upgradeQa.get(),saves=upgradeQa.saves();'+expression+';return {state:before===upgradeQa.get(),saves:saves===upgradeQa.saves()};})()');
 ok(result.state,label+' preserves complete state');ok(result.saves,label+' preserves both saves');
}
async function walletCheck(selector,cost,priceSelector=selector){
 const keys={lumen:'lumen',shard:'shards',prism:'prisms',comet:'comets',sigil:'sigils',mote:'motes'},funded={};
 for(const kind of Object.keys(cost))funded[keys[kind]]=cost[kind];
 for(const missing of Object.keys(cost).filter(k=>cost[k]>0).concat([null])){
  const wallets={...funded};if(missing)wallets[keys[missing]]=0;
  await ev('upgradeQa.patch('+JSON.stringify(wallets)+')');const r=await observe(priceSelector),button=await observe(selector);
  ok(r.prices.length===Object.keys(cost).length,'all exact prices visible '+selector);
  for(const p of r.prices){ok(p.amount===cost[p.kind],'exact amount '+selector);ok(p.red===(missing===p.kind&&cost[p.kind]>0),'individual missing currency red '+selector+' '+p.kind);}
  ok(button.disabled===!!missing,'native affordability '+selector);ok(!r.overflow,'price fits '+selector+' '+JSON.stringify(r));
  if(selector.startsWith('[data-empower='))ok(button.width>=44&&button.height>=44&&button.direction==='row'&&button.wrap==='nowrap','Empower keeps its44px horizontal row while long prices fit');
  if(missing)await unchanged('document.querySelector('+JSON.stringify(selector)+').click()','disabled purchase');
 }
}
async function run(){
 fs.mkdirSync(out,{recursive:true});profile=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-upgrade-states-'));
 server=http.createServer((req,res)=>{const name=new URL(req.url,'http://localhost').pathname;if(name==='/'){res.setHeader('Content-Type','text/html');return res.end(html);}const p=path.resolve(path.dirname(file),'.'+decodeURIComponent(name));if(!p.startsWith(path.dirname(file)+path.sep)||!fs.existsSync(p)||!fs.statSync(p).isFile()){res.statusCode=404;return res.end();}res.setHeader('Content-Type',p.endsWith('.css')?'text/css':p.endsWith('.woff2')?'font/woff2':'image/svg+xml');res.end(fs.readFileSync(p));});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 browser=spawn(findChrome(),['--headless=new','--no-sandbox','--disable-gpu','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{stdio:'ignore'});
 exitPromise=new Promise((r,j)=>{browser.once('error',j);browser.once('exit',(code,signal)=>r({code,signal}));});
 const portFile=path.join(profile,'DevToolsActivePort'),deadline=Date.now()+20000;let endpoint;
 while(!endpoint){assert(Date.now()<deadline,'browser startup');try{const lines=fs.readFileSync(portFile,'utf8').trim().split(/\r?\n/);if(lines.length===2&&lines[1].startsWith('/devtools/'))endpoint=lines;}catch(e){if(!['ENOENT','EBUSY','EPERM'].includes(e.code))throw e;}if(!endpoint)await pause(50);}
 const [port,socket]=endpoint;ws=new WebSocket('ws://127.0.0.1:'+port+socket);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
 ws.onmessage=e=>{const m=JSON.parse(e.data),p=pending.get(m.id);if(p){clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}};
 for(const width of [320,390,430])for(const scale of [1,2]){
  const context=await send('Target.createBrowserContext',{},null),target=await send('Target.createTarget',{url:'about:blank',browserContextId:context.browserContextId},null);session=(await send('Target.attachToTarget',{targetId:target.targetId,flatten:true},null)).sessionId;
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Page.enable');
  await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port});const readyAt=Date.now()+15000;while(!await ev('!!window.upgradeQa')){assert(Date.now()<readyAt);await pause(40);}await pause(500);
  await ev('upgradeQa.ready();document.documentElement.style.fontSize="'+16*scale+'px"');await ev('document.fonts.ready.then(()=>true)');
  const seed=await ev('upgradeQa.seed()'),copy=()=>JSON.parse(JSON.stringify(seed));
  for(const id of await ev('upgradeQa.wisps'))for(const key of ['empower','rarity','module','ultimate','mastery']){
   const s=copy();s.refundCredits.prisms=[];if(key==='rarity')s.heroRarity[id]=0;if(key==='module')s.wispModules[id]=0;if(key==='ultimate')s.wispUltimate[id]=false;
   await install(s,'spirits');const selector='[data-'+key+'="'+id+'"]',plan=await ev('upgradeQa.plans('+JSON.stringify(id)+','+JSON.stringify(key)+')');
   const cost=key==='empower'?{lumen:plan.cost}:key==='ultimate'?{sigil:plan.cost}:plan.cost;await walletCheck(selector,cost);
   if(key!=='empower' && !(key==='module'&&id==='ember')){
    const locked=copy();if(key==='rarity'){locked.heroRarity[id]=0;locked.spirits[id]=1;}if(key==='module'){locked.wispModules[id]=0;locked.spirits[id]=0;}if(key==='ultimate'){locked.wispUltimate[id]=false;locked.heroRarity[id]=0;}if(key==='mastery')locked.research.masterwork=0;
    await install(locked,'spirits');const r=await observe(selector);ok(r.disabled&&!r.prices.length&&/Requires|Recruit/.test(r.text),'locked action explains unlock without prices '+selector+' '+JSON.stringify(r));
    if(key==='module')ok((r.text.match(/Recruit/g)||[]).length===1,'locked ability has one clear recruitment instruction');
    await ev('upgradeQa.patch('+JSON.stringify({spirits:s.spirits,heroRarity:s.heroRarity,research:s.research})+')');ok((await observe(selector)).prices.length>0,'live prerequisites reveal price '+selector);
   }
  }
  const capped=copy();capped.spirits.ember=10000;capped.wispUltimate.ember=false;await install(capped,'spirits');
  for(const selector of ['[data-wisp-card=ember] .wisp-level','[data-wisp-card=ember] .module-row','[data-wisp-card=ember] .wisp-rarity-section'])ok((await observe(selector)).gold,'independent Wisp cap gold '+selector);
  capped.wispUltimate.ember=true;capped.wispMastery.ember=2000;await install(capped,'spirits');for(const selector of ['[data-wisp-card=ember] .ultimate-badge','[data-wisp-card=ember] .wisp-mastery-section'])ok((await observe(selector)).gold,'Ultimate/Mastery gold');
  await ev('document.querySelector("[data-wisp-card=ember] .module-row").scrollIntoView({block:"center"})');
  const wispShot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,'wisp-gold-'+width+'-'+scale+'.png'),Buffer.from(wispShot.data,'base64'));
  for(const id of await ev('upgradeQa.wisps'))capped.wispMastery[id]=2000;await install(capped,'spirits');ok((await ev('__upgradeErrors')).length===0,'all capped Mastery renders without guidance crash');
  for(const [family,tab,field,attr] of [['forge','forge','research','forge-card'],['lab','research','longStudyLevels','study-card'],['tree','ascend','nodes','tree-node'],['shop','deeds','astralUpgrades','comet-card']]){
   for(const node of await ev('upgradeQa.'+family)){
    const s=copy();s[field][node.id]=0;if(family==='tree')s.nodes.swift=100;await install(s,tab);const card='[data-'+attr+'="'+node.id+'"]';
    const control=family==='forge'?'research':family==='lab'?'study':family==='tree'?'node':'shop';
    if(family!=='lab'||(await observe(card)).prices.length){
     const quoted=await observe(card),cost={};for(const p of quoted.prices)cost[p.kind]=p.amount;
     if(Object.keys(cost).length)await walletCheck('[data-'+control+'="'+node.id+'"]',cost,family==='lab'?card:undefined);
    }
    if(node.levelCap!==undefined||node.cap!==undefined){s[field][node.id]=node.levelCap===undefined?node.cap:node.levelCap;await install(s,tab);const r=await observe(card);ok(r.gold,'maxed gold '+family+' '+node.id+' '+JSON.stringify(r));ok(!r.prices.length,'maxed hides price '+family+' '+node.id);}
   }
  }
  const challenge=copy();challenge.longStudyLevels.labcapacity=0;challenge.ascendCount=0;await install(challenge,'research');const lockedExpansion=await observe('[data-study-card=labcapacity]');ok(!lockedExpansion.prices.length&&lockedExpansion.text.includes('Requires'),'Lab expansion hides price before challenges');
  await ev('upgradeQa.patch({ascendCount:10000})');ok((await observe('[data-study-card=labcapacity]')).prices.length===2,'Lab challenge unlock refreshes price');
  const locked=copy();locked.maxDepthEver=1;locked.ascendCount=0;for(const key of ['research','longStudyLevels','nodes'])for(const id of Object.keys(locked[key]))locked[key][id]=0;
  for(const tab of ['forge','research','ascend','deeds']){
   await install(locked,tab);const cards=await ev('Array.from(document.querySelectorAll("#tab-'+tab+' [data-state=locked]")).map(e=>e.closest(".card")||e).map(e=>({text:e.textContent,prices:e.querySelectorAll("[data-price-currency]").length}))');
   ok(cards.length>0,'locked catalogue covered '+tab);for(const card of cards)ok(!card.prices&&/Rift|Requires|Unlock/.test(card.text),'locked catalogue shows unlock without price '+tab);
  }
  const paid=copy();paid.activeStudies=[{id:'bossledger',slot:0,remainingSec:60,totalDurationSec:120,speedMult:1}];await install(paid,'research');
  ok((await observe('[data-running-study=bossledger]')).gold,'capped running paid Lab work stays gold');
  paid.activeStudies=[];paid.pausedStudies=[{id:'bossledger',remainingSec:60,totalDurationSec:120,speedMult:1}];await install(paid,'research');
  const resumed=await observe('[data-study-card=bossledger]');ok(resumed.gold&&!resumed.prices.length&&resumed.text.includes('No additional cost'),'capped saved Lab work stays gold and resumes free');
  await install(challenge,'research');
  await unchanged('upgradeQa.patch({})','passive refresh');ok((await ev('__upgradeErrors')).length===0,'no runtime errors');
  const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,'upgrades-'+width+'-'+scale+'.png'),Buffer.from(shot.data,'base64'));
  records.push({width,scale,checks});await send('Target.disposeBrowserContext',{browserContextId:context.browserContextId},null);
 }
}
(async()=>{const result={status:'fail',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),node:process.version,records};try{await run();result.status='pass';}catch(e){result.error=e.stack;try{const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,'failure.png'),Buffer.from(shot.data,'base64'));}catch{}}
 try{if(ws){await send('Browser.close',{},null).catch(()=>{});ws.close();}if(exitPromise){let timer;const done=await Promise.race([exitPromise,new Promise((_,j)=>{timer=setTimeout(()=>j(Error('browser exit deadline')),5000);})]).finally(()=>clearTimeout(timer));assert.equal(done.code,0);}if(profile)fs.rmSync(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});}catch(e){result.status='fail';result.teardown=e.message;result.process={pid:browser&&browser.pid,exitCode:browser&&browser.exitCode,signalCode:browser&&browser.signalCode};if(browser)browser.kill();}
 if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}result.checks=checks;fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));if(result.status!=='pass')process.exitCode=1;
})();
