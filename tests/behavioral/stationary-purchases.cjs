'use strict';
// Actual product DOM and native input; only clocks and starting wallets are fixtures.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {spawn,spawnSync}=require('node:child_process'),{serve}=require('../../scripts/lib/static-server.cjs'),{findChrome}=require('../../scripts/lib/browser.cjs');
const root=path.resolve(__dirname,'../..'),file=path.resolve(process.argv[2]||'index.html'),out=path.resolve(process.argv[3]||'validation-evidence/stationary-purchases');
let source=fs.readFileSync(file,'utf8');const marker="if(document.readyState==='loading'){";
const mutation=process.argv.includes('--mutate-forge')?'forge':process.argv.includes('--mutate-fallback')?'fallback':null;
if(mutation){
 const from=mutation==='forge'?'main.getBoundingClientRect();main.scrollTop=scrollTop;':'if(!snapshot.keys.length || !snapshot.keys.every';
 const to=mutation==='forge'?from+"target.scrollIntoView({block:'nearest'});":'if(false && (!snapshot.keys.length) || false && !snapshot.keys.every';
 assert.equal(source.split(from).length,2);source=source.replace(from,to);
}
assert.equal(source.split(marker).length,2);
const hook=`window.scrollQa={ready:function(){return !!els.toast;},
 setup:function(kind){
  document.querySelectorAll('.overlay').forEach(function(e){e.style.display='none';});document.querySelector('.shell').inert=false;isNewGame=false;
  var s=freshState();s.maxDepthEver=5000;s.depth=101;s.questDay=todayStr();s.lastSeen=Date.now();s.lumen=s.shards=s.prisms=s.comets=1e10;
  SPIRITS.forEach(function(sp){s.spirits[sp.id]=100;s.empowerQueue[sp.id]=false;});
  Object.keys(s.researchQueue).forEach(function(id){s.researchQueue[id]=false;});Object.keys(s.studyQueue).forEach(function(id){s.studyQueue[id]=false;});
  state=acceptPersistedState(s);labMultiplier=1;selectedStudySlot=-1;expandedStudySpeedSlot=-1;
  var selector,tab,read;
  if(kind==='forge'||kind==='forge-cap'){
   var n=RESEARCH.find(function(n){return n.id==='relay';});if(kind==='forge-cap')state.research[n.id]=n.levelCap-1;
   var p=getResearchBuyPlan(n,1);state.lumen=p.cost.lumen;state.shards=p.cost.shard;selector='[data-research="'+n.id+'"]';tab='forge';read=function(){return state.research[n.id];};
  }else if(kind==='tree'){
   var n=NODES.find(function(n){return !n.retired&&!n.retiredTo&&n.id==='swift';});var p=getNodeBuyPlan(n,true);state.prisms=p.cost;selector='[data-node="'+n.id+'"]';tab='ascend';read=function(){return state.nodes[n.id];};
  }else if(kind==='wisp'){
   var sp=SPIRITS[3];state.lumen=getSpiritBuyPlan(sp).cost;selector='[data-empower="'+sp.id+'"]';tab='spirits';read=function(){return state.spirits[sp.id];};
  }else if(kind==='shop'){
   var n=SHOP.find(function(n){return getCometBuyPlan(n).available;});if(!n)throw Error('shop fixture');state.comets=getCometBuyPlan(n).cost;selector='[data-shop="'+n.id+'"]';tab='deeds';read=function(){return state.owned[n.id]?1:0;};
  }else if(kind==='astral'){
   var n=SHOP.find(function(n){return n.id==='astralcore';});state.comets=getCometBuyPlan(n).cost;selector='[data-shop="'+n.id+'"]';tab='deeds';read=function(){return state.astralUpgrades[n.id];};
  }else if(kind==='quest'){
   var n=QUEST_POOL[0];state.questIds=[n.id];state.questClaimed={};state.dailyStats[n.metric]=n.goal;selector='[data-quest-claim="'+n.id+'"]';tab='deeds';read=function(){return state.questClaimed[n.id]?1:0;};
  }else if(kind==='lab'){
   state.activeStudies=[{id:'guardmastery',slot:0,remainingSec:10000,totalDurationSec:10000,speedMult:1}];state.studySlotProjects[0]='guardmastery';
   state.motes=getStudyBoostPlan('guardmastery',1.5,8).cost;selector='[data-speed-study="guardmastery"]';tab='research';read=function(){return state.studyBoosts.slot0?1:0;};
  }
  renderAll();renderDaily(true);activateTab(tab);if(kind==='lab'){document.querySelector('main').scrollTop=100;openStudySpeedMenu(0);}this.read=read;return {selector:selector,value:read()};
 },refresh:function(){renderAll();},get:function(){return JSON.parse(JSON.stringify(state));}};`;
const prelude='<script>window.scrollErrors=[];addEventListener("error",e=>scrollErrors.push(e.message));addEventListener("unhandledrejection",e=>scrollErrors.push(String(e.reason)));window.setInterval=function(){return 0;};Object.defineProperty(performance,"now",{configurable:true,value:function(){return 0;}});</script>';
let browser,server,stage,profile,session,seq=0,buffer='',closed=false,completion,stderr='',checks=0;const pending=new Map(),records=[];
function ok(v,m){checks++;assert(v,m);}
function send(method,params={},sid=session){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP deadline '+method+' '+stderr));},15000);pending.set(id,{resolve,reject,timer});browser.stdio[3].write(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})})+'\0');});}
async function ev(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function until(expression){for(let i=0;i<300;i++){if(await ev(expression))return;await pause(25);}throw Error('Not ready: '+expression);}
async function key(){await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});}
async function measure(){return ev(`({scroll:document.querySelector('main').scrollTop,value:scrollQa.read(),focus:document.activeElement.outerHTML.slice(0,250),errors:scrollErrors})`);}
async function run(){
 fs.mkdirSync(out,{recursive:true});stage=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-scroll-'));
 fs.writeFileSync(path.join(stage,'index.html'),source.replace('<head>','<head>'+prelude).replace(marker,hook+marker));
 for(const dir of ['fonts','branding'])fs.cpSync(path.join(root,dir),path.join(stage,dir),{recursive:true});
 server=await serve(stage);profile=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-scroll-browser-'));
 browser=spawn(findChrome(),['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
 completion=new Promise(resolve=>browser.once('close',(code,signal)=>{closed=true;resolve({code,signal});}));
 browser.stderr.on('data',b=>stderr=(stderr+b).slice(-2000));
 browser.on('close',()=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('browser closed'));}pending.clear();});
 browser.on('error',e=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(e);}pending.clear();});
 for(const i of [3,4])browser.stdio[i].on('error',()=>{});
 browser.stdio[4].on('data',b=>{buffer+=b;let end;while((end=buffer.indexOf('\0'))>=0){const raw=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!raw)continue;const m=JSON.parse(raw),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}});
 const version=await send('Browser.getVersion',{},null),target=await send('Target.createTarget',{url:'about:blank'},null);session=(await send('Target.attachToTarget',{targetId:target.targetId,flatten:true},null)).sessionId;
 await send('Page.enable');await send('Runtime.enable');await send('DOM.enable');await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});
 await until('!!window.scrollQa && scrollQa.ready()');await ev('document.getElementById("startup-skip").click()');await until('!document.documentElement.classList.contains("startup-pending")');await pause(500);await ev('document.fonts.ready');
 for(const [width,height]of (mutation?[[320,568]]:[[320,568],[390,844],[430,932]]))for(const scale of (mutation?[1]:[1,2]))for(const input of (mutation?['touch']:['touch','keyboard']))for(const kind of (mutation?[mutation==='forge'?'forge':'tree']:['forge','tree','wisp','shop','astral','forge-cap','quest','lab'])){
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});await send('Emulation.setTouchEmulationEnabled',{enabled:true});
  await ev(`document.documentElement.style.fontSize='${scale*100}%'`);const setup=await ev('scrollQa.setup('+JSON.stringify(kind)+')');await pause(300);
  // Place the purchase at the lower edge: its Queue fallback may be below the fold.
  const point=await ev(`(()=>{var e=document.querySelector(${JSON.stringify(setup.selector)});if(!e||e.disabled)throw Error('unavailable fixture '+${JSON.stringify(kind)});var m=document.querySelector('main');e.scrollIntoView({block:'end'});var r=e.getBoundingClientRect(),v=m.getBoundingClientRect();m.scrollTop+=r.bottom-(v.bottom-4);e.focus({preventScroll:true});r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,hit:e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))};})()`);
  ok(point.hit,'native input target visible '+kind);await pause(100);const before=await measure();
  if(input==='keyboard')await key();else{await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:point.x,y:point.y}]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
  await pause(120);const after=await measure();const record={width,height,scale,input,kind,before,after};records.push(record);
  ok(after.value===before.value+1,'one real purchase '+kind);ok(Math.abs(after.scroll-before.scroll)<=1,'purchase must preserve scroll '+JSON.stringify(record));
  await ev('scrollQa.refresh()');await pause(100);const refreshed=await measure();ok(Math.abs(refreshed.scroll-after.scroll)<=1,'refresh must preserve scroll '+kind);ok(refreshed.errors.length===0,'no runtime errors');
 }
 return version;
}
(async()=>{const result={status:'fail',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),node:process.version,records};
 try{result.browser=await run();result.status='pass';}catch(e){result.error=e.stack;}
 try{if(browser&&!closed)await send('Browser.close',{},null);if(completion){const exit=await completion;assert.equal(exit.code,0);result.exit=exit;}}catch(e){result.teardown=e.message;result.status='fail';}
 if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}for(const dir of [profile,stage])if(dir)fs.rmSync(dir,{recursive:true,force:true,maxRetries:3,retryDelay:100});
 if(process.argv.includes('--negative')&&result.status==='pass'){
  result.controls=[];
  for(const name of ['forge','fallback']){
   const destination=path.join(out,'negative-'+name),r=spawnSync(process.execPath,[__filename,file,destination,'--mutate-'+name],{encoding:'utf8',timeout:60000});
   const receipt=fs.existsSync(path.join(destination,'receipt.json'))?JSON.parse(fs.readFileSync(path.join(destination,'receipt.json'))):null;
   const detected=r.status===1&&receipt&&receipt.error.includes('purchase must preserve scroll')&&receipt.sourceSha256!==result.sourceSha256&&receipt.exit.code===0;
   result.controls.push({name,detected,error:receipt&&receipt.error});if(!detected){result.status='fail';result.error='Scroll defect control not detected: '+name;}
  }
 }
 result.checks=checks;fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:result.status,checks,records:records.length,error:result.error,controls:result.controls}));if(result.status!=='pass')process.exitCode=1;
})();
