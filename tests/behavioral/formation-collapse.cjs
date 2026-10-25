'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {spawn,execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..'),file=path.resolve(process.argv[2]||'index.html'),out=path.resolve(process.argv[3]||'/tmp/wisp-contribution-mobile');
const baseline=process.argv.includes('--baseline');
let source=fs.readFileSync(file,'utf8');
if(process.argv.includes('--mutate-choice')){const anchor='var roleView=captureWispActionView();';assert.equal(source.split(anchor).length,2);source=source.replace(anchor,anchor+"document.querySelector('.formation-help').open=false;");}
const sourceSha256=crypto.createHash('sha256').update(source).digest('hex');
const marker="if(document.readyState==='loading'){";assert.equal(source.split(marker).length,2);
source=source.replace('<head>',`<head><script>window.roleErrors=[];addEventListener('error',e=>roleErrors.push(e.message));addEventListener('unhandledrejection',e=>roleErrors.push(String(e.reason)));var roleInterval=setInterval;window.setInterval=function(fn,ms){return roleInterval(function(){if(window.roleRunIntervals)fn();},ms);};</script>`).replace(marker,`
window.roleQa={today:todayStr,fresh:freshState,get:function(){return JSON.parse(JSON.stringify(state));},set:function(s){state=acceptPersistedState(s);restoreEnemyOrSpawn();},render:renderAll,readout:renderWispRoles,compare:wispRoleComparison,lastRender:function(){return wispRoleLastRenderMs;}};
if(!localStorage.getItem(SAVE_KEY)){var qaSeed=freshState();qaSeed.questDay=todayStr();localStorage.setItem(SAVE_KEY,JSON.stringify(qaSeed));}
localStorage.setItem(STARTUP_INTRO_KEY,String(Date.now()));
`+marker);
const server=http.createServer((req,res)=>{if(req.url==='/index.html'){res.setHeader('Content-Type','text/html');res.end(source);return;}
 const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.statusCode=404;res.end();return;}
 const types={'.svg':'image/svg+xml','.css':'text/css','.woff2':'font/woff2'};res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
let browser,profile,sid,seq=0,buffer='',stderr='',checks=0,closed=false;const pending=new Map(),records=[];
function send(method,params={},session=sid){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout '+method));},15000);pending.set(id,{resolve,reject,timer});browser.stdio[3].write(JSON.stringify({id,method,params,...(session?{sessionId:session}:{})})+'\0');});}
async function ev(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
function ok(v,m){checks++;assert(v,m);}const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function run(){
 await new Promise((r,j)=>{server.once('error',j);server.listen(0,'127.0.0.1',r);});
 const chrome=process.env.LUMENFALL_QA_CDP_CHROME||['google-chrome','google-chrome-stable','chromium','chromium-browser'].find(c=>{try{execFileSync('which',[c],{stdio:'pipe'});return true;}catch{return false;}});assert(chrome,'actual Chromium required');
 const executable=require('../../scripts/lib/browser.cjs').resolveBrowser(chrome),identity={executable:fs.realpathSync(executable)};
 profile=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-formation-collapse-'));browser=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
 browser.stderr.on('data',b=>stderr=(stderr+b).slice(-4000));browser.on('error',e=>{for(const p of pending.values())p.reject(e);});
 browser.on('close',()=>{closed=true;for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('browser closed'));}pending.clear();});
 browser.stdio[4].on('data',b=>{buffer+=b;let end;while((end=buffer.indexOf('\0'))>=0){const raw=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!raw)continue;const m=JSON.parse(raw),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}});
 identity.version=await send('Browser.getVersion',{},null);
 const tab=await send('Target.createTarget',{url:'about:blank'},null);sid=(await send('Target.attachToTarget',{targetId:tab.targetId,flatten:true},null)).sessionId;await send('Page.enable');await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});
 let ready=false;for(let i=0;i<200;i++){if(await ev('!!window.roleQa && !!document.querySelector("[data-wisp-role=ember]")')){ready=true;break;}await pause(20);}ok(ready,'actual complete app readiness');await ev('document.fonts.ready');

 if(baseline){
  await ev('document.querySelector("[data-tab=spirits]").click()');
  const observed=await ev('({contribution:!!document.getElementById("wisp-role-summary"),helpCard:document.querySelector(".formation-help").classList.contains("card"),helpText:document.querySelector(".formation-help summary").textContent})');
  ok(observed.contribution&&!observed.helpCard,'baseline reproduces unwanted contribution panel and unboxed Bonds guidance');records.push(observed);
 }else{
 for(const width of [320,390,430])for(const fontPercent of [100,200])for(const motion of ['no-preference','reduce']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Runtime.enable');await send('DOM.enable');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});
  await send('Page.reload');await pause(150);for(let i=0;i<200;i++){try{if(await ev('!!window.roleQa&&!!document.querySelector("[data-wisp-role=ember]")'))break;}catch(e){if(!/context|navigated/.test(e.message))throw e;}await pause(20);}
  await ev('document.fonts.ready');
  await ev(`(()=>{var q=roleQa,s=q.fresh();s.questDay=q.today();s.maxDepthEver=250;s.depth=101;s.activeParty=['ember','tide','gale','thorn','aurora'];Object.keys(s.spirits).forEach(function(id){s.spirits[id]=100;s.heroRarity[id]=5;s.wispModules[id]=20;s.wispUltimate[id]=true;});q.set(s);q.render();document.documentElement.style.fontSize='${fontPercent}%';document.querySelector('[data-tab=spirits]').click();window.originalToggle=document.querySelector('.formation-help>summary');})()`);
  await ev('Promise.all(document.getElementById("tab-spirits").getAnimations().map(a=>a.finished)).then(()=>true)');
  const observe=()=>ev(`(()=>{var p=document.querySelector('.formation-help'),b=p.querySelector('summary'),r=b.getBoundingClientRect(),content=document.getElementById('bond-card');return {expanded:String(p.open),hidden:!p.open,visible:content.checkVisibility(),focus:document.activeElement===b,same:b===originalToggle,label:b.innerText,fit:r.left>=0&&r.right<=innerWidth+1&&b.scrollWidth<=b.clientWidth+1,target:r.width>=44&&r.height>=44,text:content.innerHTML,removed:!document.getElementById('wisp-role-summary')&&!document.getElementById('formation-contribution-toggle')&&!document.getElementById('formation-contribution-panel'),boxed:p.classList.contains('card'),errors:roleErrors};})()`);
  let o=await observe();ok(o.expanded==='false'&&o.hidden&&!o.visible,'Bonds collapsed by default after load');ok(o.removed&&o.boxed,'Contribution removed and Bonds boxed');
  const key=async(name)=>{await send('Input.dispatchKeyEvent',{type:name==='Enter'?'keyDown':'rawKeyDown',key:name==='Space'?' ':name,code:name,windowsVirtualKeyCode:name==='Space'?32:13,...(name==='Enter'?{text:'\r'}:{})});await send('Input.dispatchKeyEvent',{type:'keyUp',key:name==='Space'?' ':name,code:name,windowsVirtualKeyCode:name==='Space'?32:13});};
  const touch=async()=>{await ev('originalToggle.scrollIntoView({block:"center"});originalToggle.blur()');await pause(50);const r=await ev('(()=>{var r=originalToggle.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()');await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[r]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(30);};
  for(const input of ['Enter','Space','touch']){
   const saveBefore=await ev('JSON.stringify(roleQa.get())');
   if(input==='touch')await touch();else{await ev('originalToggle.focus()');await key(input);}
   ok(await ev('JSON.stringify(roleQa.get())')===saveBefore,'disclosure preserves exact save state');
   o=await observe();ok(o.expanded==='true'&&!o.hidden&&o.visible&&o.label.includes('Collapse'),'native '+input+' expands');
   const before=await ev('JSON.stringify(roleQa.get())');
   await ev('originalToggle.focus();roleQa.readout();roleQa.render();roleQa.readout()');
   o=await observe();ok(o.same&&o.focus&&o.expanded==='true'&&o.visible,'expanded/focus retained through role and full renders');ok(await ev('JSON.stringify(roleQa.get())')===before,'render/disclosure leaves complete save state unchanged');
   ok(o.text.includes('Formation Bonds')&&o.text.includes('Kindling')&&o.text.includes('Pathfinder'),'existing Bond guidance retained');ok(o.fit&&o.target,'toggle fits and has 44px touch target '+JSON.stringify({width,fontPercent,motion,o}));
   const previousSummary=o.text;
   await ev('document.querySelector("[data-toggle=tide]").click();originalToggle.focus();roleQa.readout()');
   o=await observe();ok(o.expanded==='true'&&o.same&&o.focus,'formation change keeps expanded control');ok(o.text!==previousSummary,'formation change updates Bond guidance');ok(await ev('!roleQa.get().activeParty.includes("tide") && document.querySelector("[data-toggle=tide]").getAttribute("aria-pressed")==="false" && document.querySelector("[data-wisp-role=tide]").textContent.trim()===""'),'formation change updates Field state without a duplicate bench readout');
   await ev('document.querySelector("[data-tab=battle]").click();document.querySelector("[data-tab=spirits]").click();originalToggle.focus()');await ev('Promise.all(document.getElementById("tab-spirits").getAnimations().map(a=>a.finished)).then(()=>true)');ok((await observe()).expanded==='true','tab return keeps expanded choice');
   if(input==='touch')await touch();else await key(input);
   o=await observe();ok(o.expanded==='false'&&o.hidden&&!o.visible&&o.label.includes('Expand'),'native '+input+' collapses');
   await ev('document.querySelector("[data-toggle=tide]").click();originalToggle.focus();roleQa.render();roleQa.readout()');
   o=await observe();ok(o.expanded==='false'&&o.hidden&&o.same&&o.focus,'collapsed choice/focus retained through formation and renders');ok(o.errors.length===0,'no browser runtime errors');
  }
  await ev('originalToggle.scrollIntoView({block:"start"})');
  if(width===390&&motion==='reduce'){const shot=await send('Page.captureScreenshot',{format:'png'});fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'collapsed-'+fontPercent+'.png'),Buffer.from(shot.data,'base64'));await ev('originalToggle.click();originalToggle.scrollIntoView({block:"start"})');const expanded=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,'expanded-'+fontPercent+'.png'),Buffer.from(expanded.data,'base64'));}
  for(const expanded of [false,true]){await ev('if(document.querySelector(".formation-help").open!=='+expanded+')originalToggle.click();originalToggle.focus();window.roleRunIntervals=true');const start=await ev('roleQa.lastRender()');await pause(1200);await ev('window.roleRunIntervals=false');const observed=await observe();ok(await ev('roleQa.lastRender()')>start,'actual periodic role render ran');ok(observed.expanded===String(expanded)&&observed.hidden===!expanded&&observed.same&&observed.focus,'live interval preserves choice and focus');}
  records.push({width,fontPercent,motion,nativeInputs:['Enter','Space','touch']});
 }
 }
 fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({status:'pass',checks,sourceSha256,browser:identity,profiles:records,scope:'Modern browser DOM/CSS/native input only; not Android textZoom/exact WebView60/physical/TalkBack'},null,2));console.log(JSON.stringify({status:'pass',checks,profiles:records.length,sourceSha256,browser:identity}));
}
function reportFailure(e){fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'failure.json'),JSON.stringify({status:'FAIL',checks,sourceSha256,error:String(e.stack),stderr},null,2));console.error(e);process.exitCode=1;}
run().catch(reportFailure).finally(async()=>{
 if(browser&&!closed){
  const completion=new Promise(resolve=>browser.once('close',(code,signal)=>resolve({code,signal})));
  await send('Browser.close',{},null).catch(()=>{});
  let timer;const exit=await Promise.race([completion,new Promise(resolve=>{timer=setTimeout(()=>resolve(null),5000);})]).finally(()=>clearTimeout(timer));
  if(!exit){browser.kill();await completion;throw Error('Browser teardown deadline');}
  assert.equal(exit.code,0,'browser exits cleanly before profile removal');
 }
 for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('cleanup'));}pending.clear();
 server.closeAllConnections();await new Promise(resolve=>server.close(resolve));
 if(profile)await fs.promises.rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});
}).catch(reportFailure);
