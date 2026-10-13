#!/usr/bin/env node
'use strict';
// Actual Chromium layout/input. Freeze timers, not purchase/payout functions.
// Browser evidence is not Android/WebView/TalkBack acceptance.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http');
const {spawn,spawnSync}=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),sourcePath=path.resolve(process.argv[2]||path.join(root,'index.html'));
const evidence=path.resolve(process.argv[3]||'prism-acceptance-evidence'),source=fs.readFileSync(sourcePath,'utf8');
const chrome=process.env.LUMENFALL_QA_CDP_CHROME||['google-chrome','google-chrome-stable','chromium','chromium-browser'].find(x=>spawnSync('which',[x]).status===0);
const {reward}=require('./prism-earning-reference.cjs');
assert(source.includes("Each Ascend earns Prisms. Repeat runs keep 20% of the base reward plus the full earned upgrade bonus. Clearing beyond your best rewarded Rift adds a new-depth bonus. The current run resets; permanent progression stays."),'intro must explain full earned bonus');
assert(!source.includes("Your first Ascend sets a Prism reward benchmark. Repeating at the same depth earns a 20% reserve reward; pushing beyond the benchmark adds the newly earned depth bonus. Ascending still resets the current run while permanent progression stays."),'obsolete full-reward penalty text must not remain');
const bridge="\n window.prismQa={\n  initialized:function(){return !!els['toast'];},\n  get:function(){return JSON.parse(JSON.stringify(state));},\n  keys:function(){return [SAVE_KEY,RECOVERY_SAVE_KEY];},\n  sharedStatus:function(){\n   return {initialized:!!els['toast'],newGame:isNewGame,startup:startupIntroPlaying,\n    hasStartupFinish:!!startupIntroFinish,resume:resumeFlowBusy,offline:!!offlineCatchup,\n    offlinePending:offlinePending,reload:reloadInProgress,reset:resetInProgress,\n    blocked:persistenceBlocked,hidden:document.hidden,\n    inert:!!document.querySelector('.shell').inert,\n    overlays:Array.from(document.querySelectorAll('.overlay,#startup-intro')).filter(function(e){\n     return getComputedStyle(e).display!=='none'&&e.getClientRects().length;\n    }).map(function(e){return e.id;}),\n    milestones:document.querySelectorAll('.rift-milestone').length,\n    toastShown:!!els['toast']&&els['toast'].classList.contains('show'),\n    errors:window.__prismErrors.slice()};\n  },\n  sharedSeed:function(single){\n   var s=freshState(),party=single?['ember']:['ember','tide','stone','gale','thorn'];\n   s.depth=s.enemyDepth=101;s.maxDepthEver=250;s.enemyMaxHp=enemyHpFor(101);\n   s.enemyHp=s.enemyMaxHp;s.enemyIsLuminous=false;s.questDay=todayStr();\n   s.questIds=['q_tap_small','q_empower','q_boss'];s.lastSeen=Date.now();\n   s.lumen=100000;s.shards=1000;s.motes=321;s.prisms=1000;s.comets=47;s.sigils=7;\n   s.nodes.starlight=7;s.nodes.steady=9;s.nodes.momentum=11;s.nodes.swift=10;\n   s.research.focus=3;s.research.sense=4;s.research.formation=5;s.research.resolve=6;\n   s.longStudyLevels.guardmastery=2;s.longStudyLevels.prismstudy=3;s.longStudyLevels.labcapacity=1;\n   s.activeStudies=[{id:'wispascend',remainingSec:90,totalDurationSec:180,speedMult:1.5},\n    {id:'shardstudy',remainingSec:100,totalDurationSec:200,speedMult:2}];\n   s.owned.autoascend=true;s.autoAscendEnabled=false;s.autoAscendTargetDepth=200;\n   SPIRITS.forEach(function(sp){s.spirits[sp.id]=20;s.empowerQueue[sp.id]=false;});\n   Object.keys(s.researchQueue).forEach(function(id){s.researchQueue[id]=false;});\n   Object.keys(s.studyQueue).forEach(function(id){s.studyQueue[id]=false;});\n   s.activeParty=party.slice();s.activeFormationPreset='push';\n   s.formationPresets={push:party.slice(),farm:party.slice(),boss:party.slice()};\n   s.formationRebuild={members:party.slice(),preset:'push'};\n   return s;\n  },\n  sharedInstall:function(single,tab){\n   state=acceptPersistedState(this.sharedSeed(single),'shared-layout-fixture');\n   if(saveState()!==true)throw Error('original fixture saveState did not commit');\n   renderAll();activateTab(tab||'battle');\n   return {state:this.get(),chosen:chosenFormationMembers(),capacity:treeFormationCapacity(),\n    slots:this.keys().map(function(key){return {key:key,raw:localStorage.getItem(key)};})};\n  }\n };\n\nwindow.__sharedMeasure=function sharedDOM(kind,selector){\n function rect(r){return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};}\n function element(e){\n  if(!e)throw Error('missing observed DOM element');\n  var r=e.getBoundingClientRect(),s=getComputedStyle(e);\n  return {tag:e.tagName,id:e.id||null,className:typeof e.className==='string'?e.className:null,\n   text:e.textContent.trim(),rect:rect(r),clientWidth:e.clientWidth,scrollWidth:e.scrollWidth,\n   clientHeight:e.clientHeight,scrollHeight:e.scrollHeight,font:s.font,fontSize:s.fontSize,\n   lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,textTransform:s.textTransform,\n   display:s.display,visibility:s.visibility,opacity:s.opacity,overflowX:s.overflowX,overflowY:s.overflowY,\n   disabled:!!e.disabled,label:e.getAttribute('aria-label'),pressed:e.getAttribute('aria-pressed'),\n   transform:s.transform,connected:e.isConnected};\n }\n function text(e){\n  var result=element(e),walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),n;\n  result.glyphs=[];result.lines=[];\n  while((n=walker.nextNode())){\n   var offset=0;\n   for(var ch of Array.from(n.nodeValue)){\n    var end=offset+ch.length;\n    if(ch.trim()){\n     var range=document.createRange();range.setStart(n,offset);range.setEnd(n,end);\n     Array.from(range.getClientRects()).forEach(function(r){\n      if(r.width>0&&r.height>0)result.glyphs.push({text:ch,rect:rect(r)});\n     });\n    }\n    offset=end;\n   }\n  }\n  result.glyphs.forEach(function(g){\n   var r=g.rect,line=result.lines.find(function(l){return Math.abs(l.top-r.top)<.25&&Math.abs(l.bottom-r.bottom)<.25;});\n   if(!line){line={left:r.left,right:r.right,top:r.top,bottom:r.bottom,text:''};result.lines.push(line);}\n   line.left=Math.min(line.left,r.left);line.right=Math.max(line.right,r.right);line.text+=g.text;\n  });\n  result.lines.sort(function(a,b){return a.top-b.top||a.left-b.left;});\n  return result;\n }\n function context(){\n  var main=document.querySelector('main'),nav=document.querySelector('nav.tabbar'),a=document.activeElement;\n  var selected=['.hud','.hud-title-row','#rift-guidance-slot','main','#tab-battle .stage','#enemy-stage','nav.tabbar'];\n  var layout={};selected.forEach(function(sel){var e=document.querySelector(sel);layout[sel]=rect(e.getBoundingClientRect());});\n  return {width:innerWidth,height:innerHeight,rootFont:getComputedStyle(document.documentElement).fontSize,\n   bodyWidth:document.body.scrollWidth,documentWidth:document.documentElement.scrollWidth,\n   main:rect(main.getBoundingClientRect()),mainScroll:main.scrollTop,mainScrollHeight:main.scrollHeight,\n   mainClientHeight:main.clientHeight,nav:rect(nav.getBoundingClientRect()),layout:layout,\n   focus:a?{id:a.id||null,toggle:a.getAttribute('data-toggle'),tab:a.getAttribute('data-tab')}:null,\n   sameGear:document.getElementById('settings-btn')===window.__sharedRefs.gear,\n   focusSameGear:a===window.__sharedRefs.gear,\n   sameRefusal:a===window.__sharedRefs.refusal,\n   fontStatus:document.fonts.status,\n   fonts:{cinzel:document.fonts.check('700 32px Cinzel'),manrope:document.fonts.check('600 24px Manrope')},\n   rafNative:Function.prototype.toString.call(window.requestAnimationFrame).indexOf('[native code]')!==-1};\n }\n var out={context:context()};\n if(kind==='brand'){\n  out.brand=text(document.querySelector('.hud .brand'));out.logo=element(document.querySelector('.brand-sigil'));\n  out.logo.loaded=document.querySelector('.brand-sigil').complete&&document.querySelector('.brand-sigil').naturalWidth>0;\n  out.gear=element(document.getElementById('settings-btn'));\n }else if(kind==='wisp'){\n  var card=document.querySelector('[data-wisp-card=\"'+selector+'\"]');\n  out.card=element(card);out.header=element(card.querySelector('.hero-top'));\n  out.identity=element(card.querySelector('.hero-id'));out.name=text(card.querySelector('.hero-id .name'));\n  out.classTag=text(card.querySelector('.hero-id .class-tag'));\n  out.portrait=element(card.querySelector('.hero-top .wisp-portrait'));\n  out.button=text(card.querySelector('[data-toggle=\"'+selector+'\"]'));\n }else if(kind==='toast'){\n  out.toast=text(document.getElementById('toast'));out.toast.shown=document.getElementById('toast').classList.contains('show');\n  out.toast.role=document.getElementById('toast').getAttribute('role');\n  out.toast.live=document.getElementById('toast').getAttribute('aria-live');\n  out.toast.atomic=document.getElementById('toast').getAttribute('aria-atomic');\n }else if(kind==='control'){\n  var e=document.querySelector(selector),r=e.getBoundingClientRect(),x=(r.left+r.right)/2,y=(r.top+r.bottom)/2,h=document.elementFromPoint(x,y);\n  out.control=element(e);out.control.hit=!!h&&(h===e||e.contains(h));out.control.x=x;out.control.y=y;\n }else if(kind==='settings'){\n  out.overlay=element(document.getElementById('settings-overlay'));out.close=element(document.getElementById('settings-close'));\n  out.shellInert=!!document.querySelector('.shell').inert;\n }else if(kind!=='context')throw Error('unknown DOM observation '+kind);\n return out;\n};\n";
const prelude=`<script>window.__prismErrors=[];window.__prismInput=[];(function sharedPrelude(){
 window.__sharedInput=[];window.__sharedWrites=[];window.__sharedRefs={};
 ['pointerdown','pointerup','touchstart','touchend','keydown','keyup','click','focusin'].forEach(function(type){
  document.addEventListener(type,function(e){
   var t=e.target,c=t.closest&&t.closest('button'),p=e.changedTouches&&e.changedTouches[0]||e;
   window.__sharedInput.push({type:type,trusted:e.isTrusted,key:e.key||null,
    id:t.id||null,control:c?{id:c.id||null,toggle:c.getAttribute('data-toggle'),tab:c.getAttribute('data-tab')}:null,
    x:Number.isFinite(p.clientX)?p.clientX:null,y:Number.isFinite(p.clientY)?p.clientY:null});
  },{capture:true,passive:true});
 });
 var original=Storage.prototype.setItem;
 Storage.prototype.setItem=function(k,v){
  var saved=k==='lumenfall_save_v2'||k==='lumenfall_save_recovery_v1';
  var row=saved?{key:k,raw:String(v),ok:false}:null;if(row)window.__sharedWrites.push(row);
  try{var result=original.call(this,k,v);if(row)row.ok=true;return result;}
  catch(e){if(row)row.error=e.message;throw e;}
 };
})();['keydown','keyup','click'].forEach(function(type){document.addEventListener(type,function(e){__prismInput.push({type:type,key:e.key,target:e.target.outerHTML&&e.target.outerHTML.slice(0,200),trusted:e.isTrusted});},true);});window.addEventListener('error',function(e){__prismErrors.push(e.message);});window.addEventListener('unhandledrejection',function(e){__prismErrors.push(String(e.reason));});window.setInterval=function(){return 0;};localStorage.setItem('lumenfall_startup_intro_last',String(Date.now()));</script>`;
const marker='\n})();\n</script>\n<script>\nif(window.Capacitor';assert.equal(source.split(marker).length,2);
const html=source.replace('<head>','<head>'+prelude).replace(marker,'\n'+bridge+marker);
const server=http.createServer((req,res)=>{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(name==='/'||name==='/index.html'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);return;}
 const f=path.resolve(path.dirname(sourcePath),'.'+name);if(!f.startsWith(path.dirname(sourcePath)+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.statusCode=404;res.end();return;}
 res.setHeader('Content-Type',f.endsWith('.css')?'text/css':f.endsWith('.woff2')?'font/woff2':f.endsWith('.svg')?'image/svg+xml':'application/octet-stream');fs.createReadStream(f).pipe(res);
});
let browser,session,buffer='',seq=0,closed=false,stderr='',profile,completion;const pending=new Map(),records=[];let checks=0;const sharedDiagnostics={readiness:[],profiles:[],geometryFailure:null};let sharedActiveProfile=null,sharedBrowserVersion=null;const WISPS=[["ember","Ember Wisp","Starcaller · Burst"],["tide","Tide Sprite","Dawnpriest · Amplifier"],["stone","Stoneheart Golem","Duskguard · Breaker"],["gale","Gale Dancer","Windrunner · Shard Utility"],["thorn","Thornback","Thornshaper · Lumen Utility"],["void","Voidling","Starcaller · Burst"],["aurora","Aurora Seer","Dawnpriest · Amplifier"],["titan","Starforged Titan","Duskguard · Breaker"]];
function ok(v,m){checks++;assert(v,m);}
function rejectAll(message){for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error(message+' '+p.method));}pending.clear();}
function send(method,params={},sid=session){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP deadline '+method));},30000);pending.set(id,{resolve,reject,timer,method});browser.stdio[3].write(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})})+'\0');});}
async function ev(expression){new (require("node:vm").Script)(expression,{filename:"shared-layout-evaluate.js"});const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(phase){
 const started=Date.now(),deadline=started+10000;
 const trace={profile:sharedActiveProfile,phase:phase||'startup',limitMs:10000,probes:[],status:'waiting'};
 sharedDiagnostics.readiness.push(trace);
 const expression='window.prismQa&&prismQa.initialized()?prismQa.sharedStatus():null';
 try{
  while(Date.now()<deadline){
   const probe={elapsedMs:Date.now()-started,status:'pending'};trace.probes.push(probe);
   let timer,result;
   try{
    result=await Promise.race([ev(expression),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Game initialization deadline')),Math.max(1,deadline-Date.now()));})]);
    probe.value=result;probe.status='observed';
   }catch(error){
    probe.error={message:error.message,method:error.cdpMethod||null,protocol:error.cdpError||null};
    if(error.cdpMethod==='Runtime.evaluate'&&error.cdpError&&error.cdpError.code===-32000&&error.cdpError.message==='Inspected target navigated or closed')probe.status='navigation-interrupted';
    else throw error;
   }finally{clearTimeout(timer);}
   if(result){
    if(result.errors.length)throw Error('runtime error during real startup: '+result.errors.join('; '));
    if(result.blocked||result.reload||result.reset)throw Error('unexpected fixture startup persistence/lifecycle guard');
    if(!result.newGame&&!result.startup&&!result.hasStartupFinish&&!result.resume&&!result.offline&&!result.offlinePending&&
     !result.hidden&&!result.inert&&!result.overlays.length&&!result.milestones&&!result.toastShown){
     trace.status='ready';return;
    }
   }
   if(Date.now()<deadline)await pause(Math.min(30,deadline-Date.now()));
  }
  throw Error('Game initialization deadline');
 }catch(error){trace.status='failed';trace.error=error.stack;throw error;}
 finally{trace.elapsedMs=Date.now()-started;}
}
async function point(selector){return ev(`(function(){var e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('missing input');e.scrollIntoView({block:'center'});var r=e.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,h=document.elementFromPoint(x,y);if(!h||!(h===e||e.contains(h)))throw Error('input obscured: '+e.outerHTML);if(r.width<44||r.height<44)throw Error('input below44px');return {x:x,y:y};})()`);}
async function tap(selector){const p=await point(selector);await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:p.x,y:p.y}]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(50);}
async function key(key,code,n){
 // Enter must include its text/keypress event; rawKeyDown is for non-text keys.
 await send('Input.dispatchKeyEvent',{type:key==='Enter'?'keyDown':'rawKeyDown',key,code,windowsVirtualKeyCode:n,...(key==='Enter'?{text:'\r',unmodifiedText:'\r'}:{})});
 await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n});
}
async function shot(name){const s=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(evidence,name+'.png'),Buffer.from(s.data,'base64'));}
async function run(){
 assert(chrome,'supported Chromium required');fs.mkdirSync(evidence,{recursive:true});
 await new Promise((r,j)=>{server.once('error',j);server.listen(0,'127.0.0.1',r);});
 profile=fs.mkdtempSync(path.join(os.tmpdir(),'prism-acceptance-'));
 browser=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
 completion=new Promise(r=>{browser.once('error',e=>{rejectAll(e.message);r({error:e.message});});browser.once('close',(code,signal)=>{closed=true;rejectAll('browser closed');r({code,signal});});});
 browser.stderr.on('data',b=>stderr=(stderr+b).slice(-8000));for(const s of [browser.stdio[3],browser.stdio[4]])s.on('error',e=>rejectAll(e.message));
 browser.stdio[4].on('data',b=>{buffer+=b;let end;while((end=buffer.indexOf('\0'))>=0){const raw=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!raw)continue;const m=JSON.parse(raw),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);if(m.error){const e=Error(JSON.stringify(m.error));e.cdpMethod=p.method;e.cdpError=m.error;p.reject(e);}else p.resolve(m.result);}}});
 sharedBrowserVersion=await send('Browser.getVersion',{},null);
 for(const width of [320,390,430])for(const scale of [1,2])for(const motion of ['no-preference','reduce']){
  sharedActiveProfile={width,scale,motion};
  const context=await send('Target.createBrowserContext',{},null),tab=await send('Target.createTarget',{url:'about:blank',browserContextId:context.browserContextId},null);
  session=(await send('Target.attachToTarget',{targetId:tab.targetId,flatten:true},null)).sessionId;
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setTouchEmulationEnabled',{enabled:true});
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});await send('Page.enable');
  await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});await ready('initial-navigation');
  // Wait for the real 430ms intro completion before replacing the test fixture.
  await ready('startup-confirmed');
  await ev(`document.documentElement.style.fontSize=${JSON.stringify(16*scale+'px')}`);
  await (async function sharedScenario(){
 const {width,scale,motion}=sharedActiveProfile,id=width+'-'+scale+'-'+motion;
 const log={width,scale,motion,rootFont:16*scale,fixture:null,brand:[],wisps:[],inputs:[],refusals:[],images:[]};
 sharedDiagnostics.profiles.push(log);
 const same=(a,b,message)=>ok(JSON.stringify(a)===JSON.stringify(b),message);
 const intersect=(a,b)=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>.5&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>.5;
 const contains=(outer,inner)=>inner.left>=outer.left-.5&&inner.right<=outer.right+.5&&inner.top>=outer.top-.5&&inner.bottom<=outer.bottom+.5;
 function geometry(pass,code,detail){
  if(!pass)sharedDiagnostics.geometryFailure={code,profile:sharedActiveProfile,detail};
  try{ok(pass,code);}catch(error){error.geometryCode=code;throw error;}
 }
 async function page(fn,...args){
  return ev('('+fn.toString()+')('+args.map(x=>JSON.stringify(x)).join(',')+')');
 }
 async function bounded(expression,label,ms=10000){
  let timer;try{return await Promise.race([ev(expression),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(label+' deadline')),ms);})]);}
  finally{clearTimeout(timer);}
 }
 async function frames(){
  return bounded('new Promise(function(resolve){requestAnimationFrame(function(){requestAnimationFrame(function(){resolve(true);});});})','native animation frames');
 }
 async function settle(){
  const fn=function(){
   var nodes=[document.querySelector('.tab-panel.active'),document.getElementById('toast')].filter(Boolean);
   var animations=[];nodes.forEach(function(e){e.getAnimations().forEach(function(a){
    if(a.effect&&a.effect.getTiming().iterations!==Infinity)animations.push(a.finished);
   });});
   return Promise.all([document.fonts.ready].concat(animations)).then(function(){return true;});
  };
  await bounded('('+fn.toString()+')()','actual fonts/finite animations');
  await frames();
 }
 async function dom(kind,selector){return page(function(k,s){return window.__sharedMeasure(k,s);},kind,selector||null);}
 async function snapshot(selector){
  return page(function(sel){
   return {state:prismQa.get(),slots:prismQa.keys().map(function(key){return {key,raw:localStorage.getItem(key)};}),
    writes:window.__sharedWrites.length,inputIndex:window.__sharedInput.length,
    status:prismQa.sharedStatus(),control:window.__sharedMeasure('control',sel),
    toast:window.__sharedMeasure('toast'),settings:window.__sharedMeasure('settings')};
  },selector);
 }
 function fontFacts(d){
  ok(d.context.width===width&&d.context.rootFont===16*scale+'px','actual viewport and root font');
  ok(d.context.fontStatus==='loaded'&&d.context.fonts.cinzel&&d.context.fonts.manrope,'actual bundled fonts loaded');
  ok(d.context.rafNative,'native requestAnimationFrame remains installed');
  ok(d.context.bodyWidth<=width+1&&d.context.documentWidth<=width+1,'no document horizontal overflow');
 }
 function target(d,label){
  var c=d.control,r=c.rect;
  ok(r.width>=44&&r.height>=44,'44px target '+label);
  ok(c.connected&&!c.disabled&&c.hit&&r.left>=-.5&&r.right<=width+.5&&r.top>=-.5&&r.bottom<=844+.5,'actual visible hit target '+label);
 }
 function pure(before,after,label){
  same(after.state,before.state,label+' preserves complete live state');
  same(after.slots,before.slots,label+' preserves exact raw slots');
  ok(after.writes===before.writes,label+' does not write either save slot');
  ok(!after.status.errors.length&&!after.status.blocked&&!after.status.reload&&!after.status.reset,'healthy original lifecycle '+label);
 }
 function position(before,after,label){
  var a=before.control.control.rect,b=after.control.control.rect;
  ok(Math.abs(a.top-b.top)<=1&&Math.abs(a.left-b.left)<=1&&Math.abs(a.width-b.width)<=1&&Math.abs(a.height-b.height)<=1,'unchanged control viewport '+label);
  ok(Math.abs(before.control.context.mainScroll-after.control.context.mainScroll)<=1,'unchanged native scroll '+label);
 }
 async function capture(name){
  const file='shared-'+id+'-'+name+'.png';await shot(file.slice(0,-4));log.images.push(file);
 }
 async function input(selector,kind,label){
  await point(selector);
  if(kind!=='touch')await page(function(sel){document.querySelector(sel).focus({preventScroll:true});},selector);
  await frames();
  const before=await snapshot(selector);target(before.control,label);
  const row={label,selector,kind,before};log.inputs.push(row);
  if(kind==='touch'){
   await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:before.control.control.x,y:before.control.control.y}]});
   try{row.held=await dom('control',selector);}
   finally{await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
  }else if(kind==='Escape')await key('Escape','Escape',27);
  else await key('Enter','Enter',13);
  row.immediate=await snapshot(selector);
  await settle();row.settled=await snapshot(selector);
  row.events=await page(function(index){return window.__sharedInput.slice(index);},before.inputIndex);
  const expected=await page(function(sel){var e=document.querySelector(sel);return {id:e.id||null,toggle:e.getAttribute('data-toggle'),tab:e.getAttribute('data-tab')};},selector);
  if(kind==='Escape')ok(row.events.some(e=>e.type==='keydown'&&e.key==='Escape'&&e.trusted),'trusted native Escape '+label);
  else ok(row.events.some(e=>e.type==='click'&&e.trusted&&JSON.stringify(e.control)===JSON.stringify(expected)),'trusted native click '+label);
  pure(before,row.immediate,label+' immediate');pure(before,row.settled,label+' settled');
  return row;
 }
 function brand(d){
  fontFacts(d);ok(d.logo.loaded,'original brand SVG loaded');
  ok(d.brand.text==='Lumenfall'&&d.brand.glyphs.length===9,'complete original brand text');
  ok(parseFloat(d.brand.fontSize)===16*scale,'brand font size preserved');
  ok(d.logo.rect.width===30&&d.logo.rect.height===30,'brand sigil size preserved');
  ok(d.gear.rect.width>=44&&d.gear.rect.height>=44&&d.gear.label==='Open settings','Settings dimensions and name');
  geometry(!d.brand.glyphs.some(g=>intersect(g.rect,d.gear.rect)),'brand-glyph-intersects-settings',d);
  geometry(!d.brand.glyphs.some(g=>intersect(g.rect,d.logo.rect)),'brand-glyph-intersects-sigil',d);
  geometry(d.brand.glyphs.every(g=>g.rect.left>=-.5&&g.rect.right<=width+.5&&contains(d.context.layout['.hud-title-row'],g.rect)),'brand-glyph-outside-header',d);
 }
 function wisp(d,spec){
  fontFacts(d);ok(d.name.text===spec[1]&&d.classTag.text===spec[2],'original complete Wisp identity '+spec[0]);
  ok(d.name.glyphs.length>0&&d.classTag.glyphs.length>0,'nonempty actual Wisp glyphs '+spec[0]);
  ok(d.button.text===(WISPS.findIndex(x=>x[0]===spec[0])<5?'Bench':'Field'),'original Field/Bench label '+spec[0]);
  ok(d.button.rect.width>=44&&d.button.rect.height>=44,'Wisp native 44px control '+spec[0]);
  const glyphs=d.name.glyphs.concat(d.classTag.glyphs);
  geometry(!glyphs.some(g=>intersect(g.rect,d.button.rect)),'wisp-glyph-intersects-toggle',{id:spec[0],measurement:d});
  geometry(glyphs.every(g=>contains(d.identity.rect,g.rect)),'wisp-glyph-outside-identity',{id:spec[0],measurement:d});
  geometry(glyphs.every(g=>contains(d.header.rect,g.rect)&&g.rect.left>=-.5&&g.rect.right<=width+.5),'wisp-glyph-outside-header',{id:spec[0],measurement:d});
  geometry(!d.name.glyphs.some(a=>d.classTag.glyphs.some(b=>intersect(a.rect,b.rect))),'wisp-name-class-glyphs-intersect',{id:spec[0],measurement:d});
  geometry(!glyphs.some(g=>intersect(g.rect,d.portrait.rect)),'wisp-glyph-intersects-portrait',{id:spec[0],measurement:d});
  ok(d.header.rect.top>=d.context.main.top-.5&&d.header.rect.bottom<=Math.min(d.context.main.bottom,d.context.nav.top)+.5,'observed Wisp header visible '+spec[0]);
 }
 function toast(d,settled,label){
  const t=d.toast;ok(t.text==='You need at least one chosen Wisp.'&&t.shown,'actual last-Wisp refusal toast '+label);
  ok(t.role==='status'&&t.live==='polite'&&t.atomic==='true','original live-region semantics '+label);
  ok(t.glyphs.length>0&&t.lines.length>0,'actual toast glyphs '+label);
  if(scale===2)ok(t.lines.length>=2,'enlarged original refusal actually spans multiple lines');
  for(let i=1;i<t.lines.length;i++)geometry(t.lines[i].top>=t.lines[i-1].bottom-.5,'toast-adjacent-glyph-lines-intersect',{label,index:i,measurement:d});
  geometry(t.glyphs.every(g=>contains(t.rect,g.rect)),'toast-glyph-outside-container',{label,measurement:d});
  geometry(t.rect.left>=-.5&&t.rect.right<=width+.5&&t.rect.top>=-.5&&t.rect.bottom<=d.context.nav.top+.5,'toast-container-outside-visible-area',{label,measurement:d});
  if(settled)ok(parseFloat(t.opacity)===1&&t.visibility==='visible'&&t.display!=='none','settled toast is actually visible '+label);
 }

 log.fixture=await page(function(){return prismQa.sharedInstall(false,'battle');});
 await settle();
 same(log.fixture.chosen,WISPS.slice(0,5).map(x=>x[0]),'canonical saved five-Wisp formation');
 for(const [wispId] of WISPS)ok(log.fixture.state.spirits[wispId]===20,'all eight Wisps actually recruited '+wispId);
 ok(log.fixture.slots.every(s=>s.raw===JSON.stringify(log.fixture.state)),'both raw fixture slots equal canonical live endpoint');
 await page(function(){window.__sharedRefs.gear=document.getElementById('settings-btn');});
 let observed=await dom('brand');log.brand.push({phase:'initial',measurement:observed});brand(observed);await capture('brand-rift');
 const open=await input('#settings-btn','touch','open Settings by touch');
 ok(open.immediate.settings.overlay.display==='flex'&&open.settled.settings.overlay.display==='flex','actual Settings modal opened');
 ok(open.immediate.settings.shellInert&&open.settled.settings.shellInert,'original modal inert scope');
 ok(open.immediate.control.context.focus.id==='settings-close'&&open.settled.control.context.focus.id==='settings-close','original initial Settings focus');
 await capture('settings');
 // Escape acts on the already focused real modal close control; no focus repair.
 const closeBefore=await snapshot('#settings-btn'),escape={label:'native Escape closes Settings',before:closeBefore};log.inputs.push(escape);
 await key('Escape','Escape',27);escape.immediate=await snapshot('#settings-btn');await settle();escape.settled=await snapshot('#settings-btn');
 escape.events=await page(function(i){return window.__sharedInput.slice(i);},closeBefore.inputIndex);
 ok(escape.events.some(e=>e.type==='keydown'&&e.key==='Escape'&&e.trusted),'actual trusted Escape closes modal');
 for(const [phase,after] of [['immediate',escape.immediate],['settled',escape.settled]]){
  ok(after.control.context.sameGear&&after.control.context.focusSameGear&&after.settings.overlay.display==='none'&&!after.settings.shellInert,'Escape returns exact same gear '+phase);
  pure(closeBefore,after,'Settings Escape '+phase);position(open.before,after,'Settings Escape '+phase);
  same(after.control.context.layout,open.before.control.context.layout,'Rift geometry unchanged after Settings Escape '+phase);
 }
 const keyboardOpen=await input('#settings-btn','Enter','open Settings by Enter');
 ok(keyboardOpen.settled.control.context.focus.id==='settings-close','keyboard opens actual Settings focus owner');
 const closed=await input('#settings-close','touch','Close Settings by touch');
 for(const [phase,after] of [['immediate',closed.immediate],['settled',closed.settled]]){
  ok(after.control.context.sameGear&&after.control.context.focusSameGear&&after.settings.overlay.display==='none'&&!after.settings.shellInert,'Close returns exact same gear '+phase);
 }
 observed=await dom('brand');log.brand.push({phase:'settings-return',measurement:observed});brand(observed);
 same(observed.context.layout,open.before.control.context.layout,'Rift geometry remains stable after both Settings paths');
 await input('nav.tabbar [data-tab="spirits"]','touch','navigate to Wisps');
 ok(await page(function(){return document.getElementById('tab-spirits').classList.contains('active');}),'actual Wisp tab selected');
 const rosterBefore=await snapshot('#settings-btn');
 for(const spec of WISPS){
  const selector='[data-wisp-card="'+spec[0]+'"] [data-toggle="'+spec[0]+'"]';
  await point(selector);
  const row={id:spec[0],immediate:await dom('wisp',spec[0])};log.wisps.push(row);wisp(row.immediate,spec);
  await frames();row.settled=await dom('wisp',spec[0]);wisp(row.settled,spec);
  if(['ember','gale','titan'].includes(spec[0]))await capture('wisp-'+spec[0]);
 }
 pure(rosterBefore,await snapshot('#settings-btn'),'all eight Wisp geometry observations');
 log.refusalFixture=await page(function(){return prismQa.sharedInstall(true,'spirits');});await settle();
 same(log.refusalFixture.chosen,['ember'],'actual canonical last chosen Wisp');
 same(log.refusalFixture.state.activeParty,['ember'],'last-Wisp active projection');
 for(const key of ['push','farm','boss'])same(log.refusalFixture.state.formationPresets[key],['ember'],'last-Wisp saved '+key+' owner');
 ok(log.refusalFixture.state.activeFormationPreset==='push'&&log.refusalFixture.state.formationRebuild===null,'completed canonical rebuild has no competing intent');
 for(const [wispId] of WISPS)ok(log.refusalFixture.state.spirits[wispId]===20,'refusal fixture retains every paid Wisp level');
 ok(log.refusalFixture.slots.every(s=>s.raw===JSON.stringify(log.refusalFixture.state)),'refusal baseline has both exact canonical saves');
 await page(function(){window.__sharedRefs.refusal=document.querySelector('[data-toggle="ember"]');});
 for(const method of ['touch','Enter']){
  const row=await input('[data-toggle="ember"]',method,'last-Wisp refusal '+method);log.refusals.push(row);
  position(row.before,row.immediate,'refusal '+method+' immediate');position(row.before,row.settled,'refusal '+method+' settled');
  ok(row.immediate.control.context.sameRefusal&&row.settled.control.context.sameRefusal,'refused action keeps actual same button focus '+method);
  toast(row.immediate.toast,false,method+' immediate');toast(row.settled.toast,true,method+' settled');
  if(method==='touch')await capture('last-wisp-toast');
 }
 ok(log.wisps.length===8&&log.refusals.length===2,'all Wisp and native refusal cases completed');
 ok((await page(function(){return window.__prismErrors;})).length===0,'no game runtime errors');
 records.push(log);
})();
  await send('Target.disposeBrowserContext',{browserContextId:context.browserContextId},null);
 }
}
(async()=>{const result={status:'fail',scope:'Shared UI real Chromium; no native Android acceptance',identity:{"testSha256":"da1b05466ec74394402f93733b9f665276b42ed87ff5fa1067554804b548f609","transportSha256":"8009b22eb4d4551f4aef2c3f0db82507e595d8f434db000327cb95805291d6dd","referenceSha256":"46d0ce1b498f6a7f37d87d6e5954e717292a6db86f39e2093853164435b51be2","sourceSha256":"38eebcb93e4cdc2fbb1f9f67800f8cfb433005904389c0815641d26bbae00b6f"},diagnostics:sharedDiagnostics,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),node:process.version,browser:chrome,profiles:records};
 try{await run();ok(records.length===12,'all twelve actual Shared UI profiles');result.status='pass';}catch(e){result.error=e.stack;result.geometryCode=e.geometryCode||null;try{if(session){await shot('failure');result.input=await ev('window.__prismInput');result.failure=await ev('(function(){return {state:window.prismQa?prismQa.get():null,slots:window.prismQa?prismQa.keys().map(function(key){return {key:key,raw:localStorage.getItem(key)};}):[],status:window.prismQa?prismQa.sharedStatus():null,input:window.__sharedInput||[]};})()');fs.writeFileSync(path.join(evidence,'failure-dom.html'),await ev('document.documentElement.outerHTML'));}}catch(_){} }
 try{if(browser){if(!closed)await send('Browser.close',{},null);let timer;const exit=await Promise.race([completion,new Promise((_,j)=>{timer=setTimeout(()=>{browser.kill('SIGKILL');j(Error('browser teardown deadline'));},5000);})]).finally(()=>clearTimeout(timer));assert.equal(exit.code,0);result.exit=exit;fs.rmSync(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});}}catch(e){result.status='fail';result.teardown=e.message;}
 server.closeAllConnections();await new Promise(r=>server.close(r));result.checks=checks;result.browserVersion=sharedBrowserVersion;result.instrumentedHtmlSha256=crypto.createHash("sha256").update(html).digest("hex");result.stderr=stderr;fs.mkdirSync(evidence,{recursive:true});fs.writeFileSync(path.join(evidence,'receipt.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));if(result.status!=='pass')process.exitCode=1;
})();
