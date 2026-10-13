#!/usr/bin/env node
'use strict';
// Focused complete-product Chromium regression. Reuse the original Prism CDP
// transport; observe native frames, fonts, input and original action owners.
// CSS root-font emulation is not installed Android textZoom or TalkBack.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const crypto=require('node:crypto'),assert=require('node:assert/strict'),vm=require('node:vm');
const {spawnSync}=require('node:child_process');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const json=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const body=fn=>fn.toString().slice(fn.toString().indexOf('{')+1,fn.toString().lastIndexOf('}'));
const WISPS=[
 ['ember','Ember Wisp','Starcaller · Burst'],
 ['tide','Tide Sprite','Dawnpriest · Amplifier'],
 ['stone','Stoneheart Golem','Duskguard · Breaker'],
 ['gale','Gale Dancer','Windrunner · Shard Utility'],
 ['thorn','Thornback','Thornshaper · Lumen Utility'],
 ['void','Voidling','Starcaller · Burst'],
 ['aurora','Aurora Seer','Dawnpriest · Amplifier'],
 ['titan','Starforged Titan','Duskguard · Breaker']
];
const REVERSIONS=[
 {id:'brand-spacing',code:'brand-glyph-intersects-settings',
  from:'  @media(max-width:360px){.hud .brand{letter-spacing:.04em;}}\n',to:''},
 {id:'wisp-header',code:'wisp-glyph-intersects-toggle',
  from:'  #tab-spirits .hero-top{margin-bottom:6px;flex-wrap:wrap;}\n  #tab-spirits .hero-id{min-width:min-content;}\n',
  to:'  #tab-spirits .hero-top{margin-bottom:6px;}\n'},
 {id:'toast-leading',code:'toast-adjacent-glyph-lines-intersect',
  from:'    line-height:1.4;border-radius:12px;\n',
  to:'    line-height:16px;border-radius:12px;\n'}
];

function sharedBridge(){
 window.prismQa={
  initialized:function(){return !!els['toast'];},
  get:function(){return JSON.parse(JSON.stringify(state));},
  keys:function(){return [SAVE_KEY,RECOVERY_SAVE_KEY];},
  sharedStatus:function(){
   return {initialized:!!els['toast'],newGame:isNewGame,startup:startupIntroPlaying,
    hasStartupFinish:!!startupIntroFinish,resume:resumeFlowBusy,offline:!!offlineCatchup,
    offlinePending:offlinePending,reload:reloadInProgress,reset:resetInProgress,
    blocked:persistenceBlocked,hidden:document.hidden,
    inert:!!document.querySelector('.shell').inert,
    overlays:Array.from(document.querySelectorAll('.overlay,#startup-intro')).filter(function(e){
     return getComputedStyle(e).display!=='none'&&e.getClientRects().length;
    }).map(function(e){return e.id;}),
    milestones:document.querySelectorAll('.rift-milestone').length,
    toastShown:!!els['toast']&&els['toast'].classList.contains('show'),
    errors:window.__prismErrors.slice()};
  },
  sharedSeed:function(single){
   var s=freshState(),party=single?['ember']:['ember','tide','stone','gale','thorn'];
   s.depth=s.enemyDepth=101;s.maxDepthEver=250;s.enemyMaxHp=enemyHpFor(101);
   s.enemyHp=s.enemyMaxHp;s.enemyIsLuminous=false;s.questDay=todayStr();
   s.questIds=['q_tap_small','q_empower','q_boss'];s.lastSeen=Date.now();
   s.lumen=100000;s.shards=1000;s.motes=321;s.prisms=1000;s.comets=47;s.sigils=7;
   s.nodes.starlight=7;s.nodes.steady=9;s.nodes.momentum=11;s.nodes.swift=10;
   s.research.focus=3;s.research.sense=4;s.research.formation=5;s.research.resolve=6;
   s.longStudyLevels.guardmastery=2;s.longStudyLevels.prismstudy=3;s.longStudyLevels.labcapacity=1;
   s.activeStudies=[{id:'wispascend',remainingSec:90,totalDurationSec:180,speedMult:1.5},
    {id:'shardstudy',remainingSec:100,totalDurationSec:200,speedMult:2}];
   s.owned.autoascend=true;s.autoAscendEnabled=false;s.autoAscendTargetDepth=200;
   SPIRITS.forEach(function(sp){s.spirits[sp.id]=20;s.empowerQueue[sp.id]=false;});
   Object.keys(s.researchQueue).forEach(function(id){s.researchQueue[id]=false;});
   Object.keys(s.studyQueue).forEach(function(id){s.studyQueue[id]=false;});
   s.activeParty=party.slice();s.activeFormationPreset='push';
   s.formationPresets={push:party.slice(),farm:party.slice(),boss:party.slice()};
   s.formationRebuild={members:party.slice(),preset:'push'};
   return s;
  },
  sharedInstall:function(single,tab){
   state=acceptPersistedState(this.sharedSeed(single),'shared-layout-fixture');
   if(saveState()!==true)throw Error('original fixture saveState did not commit');
   renderAll();activateTab(tab||'battle');
   return {state:this.get(),chosen:chosenFormationMembers(),capacity:treeFormationCapacity(),
    slots:this.keys().map(function(key){return {key:key,raw:localStorage.getItem(key)};})};
  }
 };
}

function sharedPrelude(){
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
}

// No DOM/style/focus/scroll writes. A Range reports typographic glyph boxes,
// not a raster ink mask; retain the original PNGs alongside these measurements.
function sharedDOM(kind,selector){
 function rect(r){return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};}
 function element(e){
  if(!e)throw Error('missing observed DOM element');
  var r=e.getBoundingClientRect(),s=getComputedStyle(e);
  return {tag:e.tagName,id:e.id||null,className:typeof e.className==='string'?e.className:null,
   text:e.textContent.trim(),rect:rect(r),clientWidth:e.clientWidth,scrollWidth:e.scrollWidth,
   clientHeight:e.clientHeight,scrollHeight:e.scrollHeight,font:s.font,fontSize:s.fontSize,
   lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,textTransform:s.textTransform,
   display:s.display,visibility:s.visibility,opacity:s.opacity,overflowX:s.overflowX,overflowY:s.overflowY,
   disabled:!!e.disabled,label:e.getAttribute('aria-label'),pressed:e.getAttribute('aria-pressed'),
   transform:s.transform,connected:e.isConnected};
 }
 function text(e){
  var result=element(e),walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),n;
  result.glyphs=[];result.lines=[];
  while((n=walker.nextNode())){
   var offset=0;
   for(var ch of Array.from(n.nodeValue)){
    var end=offset+ch.length;
    if(ch.trim()){
     var range=document.createRange();range.setStart(n,offset);range.setEnd(n,end);
     Array.from(range.getClientRects()).forEach(function(r){
      if(r.width>0&&r.height>0)result.glyphs.push({text:ch,rect:rect(r)});
     });
    }
    offset=end;
   }
  }
  result.glyphs.forEach(function(g){
   var r=g.rect,line=result.lines.find(function(l){return Math.abs(l.top-r.top)<.25&&Math.abs(l.bottom-r.bottom)<.25;});
   if(!line){line={left:r.left,right:r.right,top:r.top,bottom:r.bottom,text:''};result.lines.push(line);}
   line.left=Math.min(line.left,r.left);line.right=Math.max(line.right,r.right);line.text+=g.text;
  });
  result.lines.sort(function(a,b){return a.top-b.top||a.left-b.left;});
  return result;
 }
 function context(){
  var main=document.querySelector('main'),nav=document.querySelector('nav.tabbar'),a=document.activeElement;
  var selected=['.hud','.hud-title-row','#rift-guidance-slot','main','#tab-battle .stage','#enemy-stage','nav.tabbar'];
  var layout={};selected.forEach(function(sel){var e=document.querySelector(sel);layout[sel]=rect(e.getBoundingClientRect());});
  return {width:innerWidth,height:innerHeight,rootFont:getComputedStyle(document.documentElement).fontSize,
   bodyWidth:document.body.scrollWidth,documentWidth:document.documentElement.scrollWidth,
   main:rect(main.getBoundingClientRect()),mainScroll:main.scrollTop,mainScrollHeight:main.scrollHeight,
   mainClientHeight:main.clientHeight,nav:rect(nav.getBoundingClientRect()),layout:layout,
   focus:a?{id:a.id||null,toggle:a.getAttribute('data-toggle'),tab:a.getAttribute('data-tab')}:null,
   sameGear:document.getElementById('settings-btn')===window.__sharedRefs.gear,
   focusSameGear:a===window.__sharedRefs.gear,
   sameRefusal:a===window.__sharedRefs.refusal,
   fontStatus:document.fonts.status,
   fonts:{cinzel:document.fonts.check('700 32px Cinzel'),manrope:document.fonts.check('600 24px Manrope')},
   rafNative:Function.prototype.toString.call(window.requestAnimationFrame).indexOf('[native code]')!==-1};
 }
 var out={context:context()};
 if(kind==='brand'){
  out.brand=text(document.querySelector('.hud .brand'));out.logo=element(document.querySelector('.brand-sigil'));
  out.logo.loaded=document.querySelector('.brand-sigil').complete&&document.querySelector('.brand-sigil').naturalWidth>0;
  out.gear=element(document.getElementById('settings-btn'));
 }else if(kind==='wisp'){
  var card=document.querySelector('[data-wisp-card="'+selector+'"]');
  out.card=element(card);out.header=element(card.querySelector('.hero-top'));
  out.identity=element(card.querySelector('.hero-id'));out.name=text(card.querySelector('.hero-id .name'));
  out.classTag=text(card.querySelector('.hero-id .class-tag'));
  out.portrait=element(card.querySelector('.hero-top .wisp-portrait'));
  out.button=text(card.querySelector('[data-toggle="'+selector+'"]'));
 }else if(kind==='toast'){
  out.toast=text(document.getElementById('toast'));out.toast.shown=document.getElementById('toast').classList.contains('show');
  out.toast.role=document.getElementById('toast').getAttribute('role');
  out.toast.live=document.getElementById('toast').getAttribute('aria-live');
  out.toast.atomic=document.getElementById('toast').getAttribute('aria-atomic');
 }else if(kind==='control'){
  var e=document.querySelector(selector),r=e.getBoundingClientRect(),x=(r.left+r.right)/2,y=(r.top+r.bottom)/2,h=document.elementFromPoint(x,y);
  out.control=element(e);out.control.hit=!!h&&(h===e||e.contains(h));out.control.x=x;out.control.y=y;
 }else if(kind==='settings'){
  out.overlay=element(document.getElementById('settings-overlay'));out.close=element(document.getElementById('settings-close'));
  out.shellInert=!!document.querySelector('.shell').inert;
 }else if(kind!=='context')throw Error('unknown DOM observation '+kind);
 return out;
}

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

async function sharedScenario(){
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
}

function buildDriver(identity){
 let driver=fs.readFileSync(path.join(__dirname,'prism-acceptance.cjs'),'utf8');
 function one(from,to){assert.equal(driver.split(from).length,2,'one unchanged transport seam: '+from.slice(0,80));driver=driver.replace(from,()=>to);}
 one('window.requestAnimationFrame=function(){return 0;};','');
 const bridgeStart=driver.indexOf('const bridge='),preludeStart=driver.indexOf('const prelude=',bridgeStart);
 assert(bridgeStart>0&&preludeStart>bridgeStart,'original complete-IIFE bridge seam');
 const bridge=body(sharedBridge)+'\nwindow.__sharedMeasure='+sharedDOM.toString()+';\n';
 new vm.Script(bridge,{filename:'shared-layout-browser-bridge.js'});
 driver=driver.slice(0,bridgeStart)+'const bridge='+JSON.stringify(bridge)+';\n'+driver.slice(preludeStart);
 one('window.__prismInput=[];','window.__prismInput=[];('+sharedPrelude.toString()+')();');
 one('let checks=0;','let checks=0;const sharedDiagnostics={readiness:[],profiles:[],geometryFailure:null};let sharedActiveProfile=null,sharedBrowserVersion=null;const WISPS='+JSON.stringify(WISPS)+';');
 one('m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);','if(m.error){const e=Error(JSON.stringify(m.error));e.cdpMethod=p.method;e.cdpError=m.error;p.reject(e);}else p.resolve(m.result);');
 one('async function ev(expression){','async function ev(expression){new (require("node:vm").Script)(expression,{filename:"shared-layout-evaluate.js"});');
 one("async function ready(){const deadline=Date.now()+10000;while(Date.now()<deadline){if(await ev('!!window.prismQa&&prismQa.initialized()')){await ev('prismQa.ready()');return;}await pause(30);}throw Error('Game initialization deadline');}",ready.toString());
 one(" for(const width of [320,390,430])"," sharedBrowserVersion=await send('Browser.getVersion',{},null);\n for(const width of [320,390,430])");
 one("  const context=await send('Target.createBrowserContext'","  sharedActiveProfile={width,scale,motion};\n  const context=await send('Target.createBrowserContext'");
 one("await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});await ready();","await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});await ready('initial-navigation');");
 one("await pause(500);await ready();await ev('document.fonts.ready.then(()=>true)');","await ready('startup-confirmed');");
 const start=driver.indexOf('  const samples=[];'),end=driver.indexOf("  await send('Target.disposeBrowserContext'",start);
 assert(start>0&&end>start,'one original scenario body');driver=driver.slice(0,start)+'  await ('+sharedScenario.toString()+')();\n'+driver.slice(end);
 one("const result={status:'fail',sourceSha256:","const result={status:'fail',scope:'Shared UI real Chromium; no native Android acceptance',identity:"+JSON.stringify(identity)+",diagnostics:sharedDiagnostics,sourceSha256:");
 one("try{await run();result.status='pass';}","try{await run();ok(records.length===12,'all twelve actual Shared UI profiles');result.status='pass';}");
 one("result.error=e.stack;","result.error=e.stack;result.geometryCode=e.geometryCode||null;");
 one("await shot('failure');result.input=await ev('window.__prismInput');","await shot('failure');result.input=await ev('window.__prismInput');result.failure=await ev('(function(){return {state:window.prismQa?prismQa.get():null,slots:window.prismQa?prismQa.keys().map(function(key){return {key:key,raw:localStorage.getItem(key)};}):[],status:window.prismQa?prismQa.sharedStatus():null,input:window.__sharedInput||[]};})()');fs.writeFileSync(path.join(evidence,'failure-dom.html'),await ev('document.documentElement.outerHTML'));");
 one('result.checks=checks;result.stderr=stderr;','result.checks=checks;result.browserVersion=sharedBrowserVersion;result.instrumentedHtmlSha256=crypto.createHash("sha256").update(html).digest("hex");result.stderr=stderr;');
 new vm.Script(driver,{filename:'shared-layout-generated.cjs'});
 new vm.Script('('+sharedPrelude.toString()+')();',{filename:'shared-layout-prelude.js'});
 for(const expression of [
  'window.prismQa&&prismQa.initialized()?prismQa.sharedStatus():null',
  'new Promise(function(resolve){requestAnimationFrame(function(){requestAnimationFrame(function(){resolve(true);});});})'
 ])new vm.Script(expression,{filename:'shared-layout-static-evaluate.js'});
 return driver;
}

function filesUnder(root){
 const result=[];function scan(rel){for(const name of fs.readdirSync(path.join(root,rel)).sort()){
  const p=path.join(rel,name),full=path.join(root,p),s=fs.lstatSync(full);
  assert(!s.isSymbolicLink(),'regular source asset '+p);
  if(s.isDirectory())scan(p);else{assert(s.isFile());const b=fs.readFileSync(full);result.push({path:p.replaceAll(path.sep,'/'),bytes:b.length,sha256:hash(b)});}
 }}scan('');return result;
}
function main(){
 assert(Number(process.versions.node.split('.')[0])>=20,'Node20+ required');
 const args=process.argv.slice(2),flags=args.filter(a=>a.startsWith('--')),pos=args.filter(a=>!a.startsWith('--'));
 assert(flags.every(a=>['--negative','--prepare-only'].includes(a))&&new Set(flags).size===flags.length&&pos.length<=2,'usage: shared-layout-ui.cjs SOURCE EVIDENCE [--negative] [--prepare-only]');
 const sourcePath=path.resolve(pos[0]||'index.html'),evidence=path.resolve(pos[1]||'shared-layout-evidence');
 assert(!fs.existsSync(evidence),'fresh evidence directory required; no overwrite or automatic retry');
 fs.mkdirSync(evidence,{recursive:true});
 const source=fs.readFileSync(sourcePath,'utf8'),transport=fs.readFileSync(path.join(__dirname,'prism-acceptance.cjs'));
 const identity={testSha256:hash(fs.readFileSync(__filename)),transportSha256:hash(transport),
  referenceSha256:hash(fs.readFileSync(path.join(__dirname,'prism-earning-reference.cjs'))),sourceSha256:hash(source)};
 const driver=buildDriver(identity),driverHash=hash(driver),assetRoot=path.dirname(sourcePath);
 const assets=['fonts','branding'].flatMap(dir=>filesUnder(path.join(assetRoot,dir)).map(f=>({...f,path:dir+'/'+f.path})));
 const variants=[{id:'normal',source,expectedGeometryCode:null}];
 for(const p of REVERSIONS){
  assert.equal(source.split(p.from).length,2,'unique exact CSS inverse '+p.id);
  const changed=source.replace(p.from,()=>p.to);
  if(p.to)assert(changed.replace(p.to,()=>p.from)===source,'full inverse source restoration '+p.id);
  else assert(changed.slice(0,source.indexOf(p.from))+p.from+changed.slice(source.indexOf(p.from))===source,'full removed-line restoration '+p.id);
  variants.push({id:p.id,source:changed,expectedGeometryCode:p.code,patch:{from:p.from,to:p.to}});
 }
 const prepared={status:'PREPARED_BROWSER_NOT_EXECUTED',identity,driverSha256:driverHash,node:process.version,
  versions:process.versions,assets,profiles:12,negativeControls:3,
  syntax:{generatedDriver:true,completeBridge:true,prelude:true,staticExpressions:2,allDynamicExpressionsParsedBeforeSend:true},
  variants:variants.map(v=>({id:v.id,sourceSha256:hash(v.source),expectedGeometryCode:v.expectedGeometryCode,patch:v.patch||null})),
  limits:'Only ambient setInterval is paused. Native RAF/startup/fonts/input/handlers stay active. Range boxes are not raster ink masks. Android/WebView60 CSS/textZoom/TalkBack untested.'};
 json(path.join(evidence,'preparation.json'),prepared);fs.writeFileSync(path.join(evidence,'instrumented-driver.cjs'),driver);
 fs.writeFileSync(path.join(evidence,'candidate-source.html'),source);
 for(const v of variants.slice(1))json(path.join(evidence,v.id+'-inverse.json'),{sourceSha256:identity.sourceSha256,mutantSha256:hash(v.source),...v.patch});
 if(flags.includes('--prepare-only')){console.log(JSON.stringify(prepared));return;}
 const generated=path.join(__dirname,'.shared-layout-'+process.pid+'.cjs'),results=[];
 fs.writeFileSync(generated,driver);
 try{
  for(const v of variants.filter((_,i)=>i===0||flags.includes('--negative'))){
   const output=path.join(evidence,v.id),stage=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-shared-layout-'));
   fs.mkdirSync(output);
   try{
    fs.writeFileSync(path.join(stage,'index.html'),v.source);fs.writeFileSync(path.join(output,'source.html'),v.source);
    for(const dir of ['fonts','branding'])fs.cpSync(path.join(assetRoot,dir),path.join(stage,dir),{recursive:true});
    for(const f of assets){const b=fs.readFileSync(path.join(stage,f.path));assert(b.length===f.bytes&&hash(b)===f.sha256,'copied original asset '+f.path);}
    const command=[process.execPath,generated,path.join(stage,'index.html'),output];
    const r=spawnSync(command[0],command.slice(1),{cwd:path.resolve(__dirname,'../..'),encoding:'utf8',timeout:600000,maxBuffer:64*1024*1024});
    fs.writeFileSync(path.join(output,'stdout.log'),r.stdout||'');fs.writeFileSync(path.join(output,'stderr.log'),r.stderr||'');
    const processReceipt={command,status:r.status,signal:r.signal,error:r.error?{name:r.error.name,message:r.error.message,code:r.error.code}:null,
     sourceSha256:hash(v.source),driverSha256:driverHash,stdout:{bytes:Buffer.byteLength(r.stdout||''),sha256:hash(r.stdout||'')},
     stderr:{bytes:Buffer.byteLength(r.stderr||''),sha256:hash(r.stderr||'')}};
    json(path.join(output,'process.json'),processReceipt);
    const receiptPath=path.join(output,'receipt.json');assert(fs.existsSync(receiptPath),'actual browser receipt required '+v.id);
    const raw=fs.readFileSync(receiptPath,'utf8'),report=JSON.parse(raw);
    assert.equal(r.stdout,JSON.stringify(report)+'\n','original raw stdout must equal receipt '+v.id);
    assert.equal(report.sourceSha256,hash(v.source),'actual source identity '+v.id);
    assert.deepEqual(report.identity,identity,'original driver inputs '+v.id);
    const healthy=!r.error&&!r.signal&&!report.teardown&&report.exit&&report.exit.code===0&&report.exit.signal===null;
    let accepted;
    if(v.expectedGeometryCode){
     accepted=healthy&&r.status===1&&report.status==='fail'&&report.geometryCode===v.expectedGeometryCode&&
      report.diagnostics.geometryFailure&&report.diagnostics.geometryFailure.code===v.expectedGeometryCode&&
      report.failure&&report.failure.status&&report.failure.status.errors.length===0&&
      report.diagnostics.readiness.every(x=>x.status==='ready');
    }else{
     accepted=healthy&&r.status===0&&report.status==='pass'&&report.profiles.length===12&&
      report.profiles.every(p=>p.wisps.length===8&&p.refusals.length===2)&&!report.diagnostics.geometryFailure;
    }
    const summary={id:v.id,accepted,exitCode:r.status,sourceSha256:hash(v.source),driverSha256:driverHash,
     checks:report.checks,profiles:report.profiles.length,expectedGeometryCode:v.expectedGeometryCode,
     actualGeometryCode:report.geometryCode||null,error:report.error||null,receipt:path.relative(evidence,receiptPath),
     receiptSha256:hash(raw),browserVersion:report.browserVersion};
    results.push(summary);console.log(JSON.stringify(summary));
    assert(accepted,'Shared UI browser acceptance '+v.id);
   }finally{fs.rmSync(stage,{recursive:true,force:true});}
  }
 }finally{
  fs.rmSync(generated,{force:true});
  json(path.join(evidence,'summary.json'),{status:results.length===(flags.includes('--negative')?4:1)&&results.every(r=>r.accepted)?'PASS':'FAIL',
   identity,driverSha256:driverHash,results,expectedProfiles:12,expectedNegativeControls:flags.includes('--negative')?3:0,nativeAndroid:'untested'});
 }
}
if(require.main===module){try{main();}catch(e){console.error(e.stack||String(e));process.exitCode=1;}}
module.exports={buildDriver,WISPS,REVERSIONS};
