#!/usr/bin/env node
'use strict';
// Reuse the existing Chromium transport/deadlines; exercise actual UI and buys.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),cp=require('node:child_process');
const source=path.resolve(process.argv[2]||'index.html'),out=path.resolve(process.argv[3]||'validation-evidence/wisp-card-redesign'),quick=process.argv.includes('--quick');
let driver=fs.readFileSync(path.join(__dirname,'prism-acceptance.cjs'),'utf8');
if(process.argv.includes('--mutate-navigation-input')){
 const input="if(wispDisclosureInputPending){liveSpiritsDirty=true;return;}";assert.equal(fs.readFileSync(source,'utf8').split(input).length,2);
 const read="source=fs.readFileSync(sourcePath,'utf8');";assert.equal(driver.split(read).length,2);
 driver=driver.replace(read,"source=fs.readFileSync(sourcePath,'utf8').replace("+JSON.stringify(input)+",'/* navigation guard removed */');");
}
const marker='breakdown:ascendPrismBreakdown,keys:function(){return [SAVE_KEY,RECOVERY_SAVE_KEY];}';assert.equal(driver.split(marker).length,2);
driver=driver.replace(marker,`wispIds:SPIRITS.map(function(sp){return sp.id;}),wispRender:renderSpirits,
 wispAdvice:function(id,action){openPowerAdvice({tab:'spirits',selector:'[data-'+action+'="'+id+'"]'});},
 wispFormationAdvice:function(){openPowerAdvice({tab:'spirits',selector:'#formation-best-now-btn'});},
 wispSeed:function(){var s=freshState();s.maxDepthEver=250;s.totalKills=10000;s.longStudyLevels.wispascend=300;s.ascendCount=100;s.research.arcanecal=30;s.research.masterwork=10;s.questDay=todayStr();s.lastSeen=Date.now();s.lumen=s.shards=s.sigils=1e20;s.prisms=1e8;s.motes=99;s.activeParty=SPIRITS.slice(0,5).map(function(sp){return sp.id;});SPIRITS.forEach(function(sp){s.spirits[sp.id]=80;s.empowerQueue[sp.id]=false;});return s;},
 ${marker}`);
const start=driver.indexOf(' for(const width of [320,390,430])'),end=driver.indexOf('\n}\n(async()=>{',start);assert(start>0&&end>start);
const body=String.raw`
 for(const width of WIDTHS)for(const scale of SCALES)for(const motion of MOTIONS){
  const context=await send('Target.createBrowserContext',{},null),tab=await send('Target.createTarget',{url:'about:blank',browserContextId:context.browserContextId},null);
  session=(await send('Target.attachToTarget',{targetId:tab.targetId,flatten:true},null)).sessionId;
  await send('Emulation.setDeviceMetricsOverride',{width,height:688,deviceScaleFactor:1,mobile:true});await send('Emulation.setTouchEmulationEnabled',{enabled:true});
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});await send('Page.enable');await send('Runtime.enable');await send('DOM.enable');
  await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});await ready();await pause(500);await ready();await ev('document.fonts.ready.then(()=>true)');
  await ev('document.documentElement.style.fontSize='+JSON.stringify(16*scale+'px'));
  await ev('prismQa.set(prismQa.wispSeed());prismQa.tab("spirits")');await pause(500);
  const before=await ev('JSON.stringify(prismQa.get())'),slots=await ev('JSON.stringify(prismQa.keys().map(function(k){return localStorage.getItem(k);}));');
  const roster=await ev('('+function(){var cards=Array.from(document.querySelectorAll('[data-wisp-card]'));return {cards:cards.map(function(c){var r=c.getBoundingClientRect();return {id:c.dataset.wispCard,height:r.height,managementHidden:c.querySelector('.wisp-management').hidden,details:c.querySelectorAll('details,summary').length,portrait:c.querySelector('.wisp-portrait').getBoundingClientRect().width};}),fits:document.documentElement.scrollWidth<=innerWidth+1};}.toString()+')()');
  await point('[data-wisp-details="ember"]');if(motion==='no-preference')await shot('roster-'+width+'-'+scale);
  ok(roster.fits,'roster fits '+width+'/'+scale);ok(roster.cards.length===8,'all eight identities');
  ok(await ev('document.querySelectorAll("#tab-spirits details,#tab-spirits summary").length')===0,'no expanding menus in Wisp tab');
  ok(await ev('document.querySelector("[data-wisp-details=ember]").getAttribute("aria-label")')==='Manage Ember Wisp','Manage names its Wisp for accessibility');
  for(const c of roster.cards){ok(c.managementHidden&&c.details===0,'no card accordions or exposed upgrade wall '+c.id);ok(c.portrait>=60,'character portrait leads '+c.id);if(scale===1)ok(c.height<=210,'materially shorter default card '+c.id+' '+c.height);}
  await point('[data-wisp-details="ember"]');if(motion==='no-preference')await shot('roster-'+width+'-'+scale);
  for(const id of (QUICK?['ember']:await ev('prismQa.wispIds'))){
   await point('[data-wisp-details="'+id+'"]');const rosterTop=await ev('document.querySelector("main").scrollTop');await tap('[data-wisp-details="'+id+'"]');
   ok(await ev('!document.querySelector("[data-wisp-card='+id+'] .wisp-management").hidden'), 'touch opens focused management '+id);
   ok(await ev('Array.from(document.querySelectorAll("[data-wisp-card]")).filter(function(c){return !c.hidden;}).length')===1,'only selected Wisp visible');
   const shape=await ev('('+function(wispId){var c=document.querySelector('[data-wisp-card="'+wispId+'"]');return {details:c.querySelectorAll('details,summary').length,fit:c.scrollWidth<=c.clientWidth+1&&document.documentElement.scrollWidth<=innerWidth+1,widths:[c.scrollWidth,c.clientWidth,document.documentElement.scrollWidth,innerWidth],overflow:Array.from(c.querySelectorAll('*')).filter(function(e){var r=e.getBoundingClientRect();return r.height>0&&(e.scrollWidth>e.clientWidth+1||r.right>innerWidth+1);}).slice(0,8).map(function(e){return {cls:e.className,text:e.textContent.slice(0,100),scroll:e.scrollWidth,client:e.clientWidth};}),buttons:Array.from(c.querySelectorAll('button')).map(function(b){var r=b.getBoundingClientRect();return {width:r.width,height:r.height};}).filter(function(r){return r.height>0;})};}.toString()+')('+JSON.stringify(id)+')');
   ok(shape.details===0&&shape.fit&&shape.overflow.length===0,'flat management fits '+id+'/'+width+'/'+scale+' '+JSON.stringify(shape));ok(shape.buttons.every(b=>b.width>=44&&b.height>=44),'all44px targets '+id);
   await ev('prismQa.wispRender()');ok(await ev('JSON.stringify(prismQa.get())')===before,'navigation/render preserves entire state '+id);
   if(id==='ember'&&motion==='no-preference')await shot('manage-'+width+'-'+scale);
   await tap('[data-wisp-back]');
   ok(await ev('Array.from(document.querySelectorAll("[data-wisp-card]")).filter(function(c){return !c.hidden;}).length')===8,'back restores roster '+id);
   ok(Math.abs((await ev('document.querySelector("main").scrollTop'))-rosterTop)<=1,'back preserves exact roster offset '+id);
  }
  ok(await ev('JSON.stringify(prismQa.keys().map(function(k){return localStorage.getItem(k);}));')===slots,'navigation never writes either save slot');
  await ev('prismQa.wispAdvice("tide","module")');ok(await ev('document.querySelector("[data-module=tide]").getBoundingClientRect().height>=44'),'hint reveals hidden upgrade in focused view');
  await ev('prismQa.wispAdvice("ember","empower")');ok(await ev('document.querySelector("[data-empower=ember]").getBoundingClientRect().height>=44'),'hint switches away from another managed Wisp');
  await ev('prismQa.wispFormationAdvice()');ok(await ev('!document.getElementById("tab-spirits").classList.contains("wisp-manager-open")&&document.activeElement===document.getElementById("formation-best-now-btn")&&document.activeElement.getBoundingClientRect().height>=44'),'hint returns from management to visible Formation action');
  ok(await ev('JSON.stringify(prismQa.get())')===before,'hint navigation preserves full game state');
  ok(await ev('JSON.stringify(prismQa.keys().map(function(k){return localStorage.getItem(k);}));')===slots,'all hint routes preserve both save slots');
  for(const input of ['touch','Space']){
   const p=await point('[data-wisp-details="ember"]');
   if(input==='touch')await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});
   else{await ev('document.querySelector("[data-wisp-details=ember]").focus({preventScroll:true})');await send('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',text:' ',unmodifiedText:' ',windowsVirtualKeyCode:32});}
   await ev('prismQa.wispRender()');
   if(input==='touch')await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   else await send('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});
   await pause(50);ok(await ev('document.getElementById("tab-spirits").classList.contains("wisp-manager-open")'),'native navigation survives input-time refresh '+input);
   await tap('[data-wisp-back]');
  }
  // Both native input types perform one original40Lumen/4Shard Ember upgrade.
  for(const input of ['keyboard','touch']){
   await ev('(()=>{var s=prismQa.wispSeed();s.lumen=40;s.shards=4;prismQa.set(s);prismQa.tab("spirits");})()');
   await tap('[data-wisp-details="ember"]');await point('[data-module="ember"]');
   await ev('document.querySelector("[data-module=ember]").focus({preventScroll:true});window.__redesignTop=document.querySelector("main").scrollTop;');
   if(input==='keyboard')await key('Enter','Enter',13);else await tap('[data-module="ember"]');
   const paid=await ev('prismQa.get()');ok(paid.wispModules.ember===1&&paid.lumen===0&&paid.shards===0,'one exact real ability purchase '+input);
   ok(await ev('!document.querySelector("[data-wisp-card=ember] .wisp-management").hidden&&!!document.activeElement.closest("[data-wisp-card=ember]")'),'purchase retains focused Wisp view '+input);
   ok(await ev('Math.abs(document.querySelector("main").scrollTop-window.__redesignTop)<=1'),'purchase preserves exact scroll '+input);
   await key('Escape','Escape',27);ok(await ev('!document.getElementById("tab-spirits").classList.contains("wisp-manager-open")'),'Escape returns to roster');
  }
  await ev('(()=>{var s=prismQa.wispSeed();s.wispModules.ember=20;s.heroRarity.ember=5;s.wispUltimate.ember=true;prismQa.set(s);})()');await tap('[data-wisp-details="ember"]');
  ok(await ev('(()=>{var e=document.querySelector("[data-wisp-card=ember] .module-row");return e.classList.contains("upgrade-maxed")&&!e.querySelector("[data-ability-next],.wisp-effect-arrow,[data-module]")&&!/Maxed/i.test(e.textContent);})()'),'completed ability is gold without arrow/Maxed');
  ok((await ev('window.__prismErrors')).length===0,'no runtime errors');records.push({width,scale,motion,roster,nativePurchases:2});
  await send('Target.disposeBrowserContext',{browserContextId:context.browserContextId},null);
 }
`;
driver=driver.slice(0,start)+body.replace('WIDTHS',quick?'[320]':'[320,390,430]').replace('SCALES',quick?'[1]':'[1,2]').replace('MOTIONS',quick?'["no-preference"]':'["no-preference","reduce"]').replace('QUICK',String(quick))+driver.slice(end);
const generated=path.join(__dirname,'.wisp-redesign-'+process.pid+'.cjs');assert(!fs.existsSync(generated));fs.mkdirSync(out,{recursive:true});fs.writeFileSync(generated,driver);
try{const r=cp.spawnSync(process.execPath,[generated,source,out],{encoding:'utf8',maxBuffer:32*1024*1024});fs.writeFileSync(out+'/stdout.log',r.stdout);fs.writeFileSync(out+'/stderr.log',r.stderr);const receipt=fs.existsSync(out+'/receipt.json')?JSON.parse(fs.readFileSync(out+'/receipt.json')):null;console.log(JSON.stringify({status:receipt&&receipt.status,checks:receipt&&receipt.checks,profiles:receipt&&receipt.profiles.length,error:receipt&&receipt.error,processError:r.error&&String(r.error),exit:r.status}));if(r.status!==0)process.exitCode=1;}finally{fs.unlinkSync(generated);}
