'use strict';
const expectSaveClock=require('./save-clock-contract.cjs');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {spawn,execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..'),file=path.resolve(process.argv[2]||'index.html'),out=path.resolve(process.argv[3]||'/tmp/wisp-contribution-mobile');
const baseline=process.argv.includes('--baseline');
let source=baseline?execFileSync('git',['show','bf36593:index.html'],{cwd:root,encoding:'utf8'}):fs.readFileSync(file,'utf8');
const sourceSha256=crypto.createHash('sha256').update(source).digest('hex');
const marker="if(document.readyState==='loading'){";assert.equal(source.split(marker).length,2);
source=source.replace('<head>',`<head><script>window.roleErrors=[];addEventListener('error',e=>roleErrors.push(e.message));addEventListener('unhandledrejection',e=>roleErrors.push(String(e.reason)));var roleInterval=setInterval;window.setInterval=function(fn,ms){return roleInterval(function(){if(window.roleRunIntervals)fn();},ms);};</script>`).replace(marker,`
window.roleQa={today:todayStr,fresh:freshState,get:function(){return JSON.parse(JSON.stringify(state));},set:function(s){state=acceptPersistedState(s);restoreEnemyOrSpawn();},render:renderAll,readout:renderWispRoles,compare:wispRoleComparison,field:typeof fieldBestNowFormation==='function'?fieldBestNowFormation:null,plan:typeof bestNowFormationPlan==='function'?bestNowFormationPlan:null,lastRender:function(){return wispRoleLastRenderMs;},load:loadState,saved:function(){return localStorage.getItem(SAVE_KEY);}};
if(!localStorage.getItem(SAVE_KEY)){var qaSeed=freshState();qaSeed.questDay=todayStr();localStorage.setItem(SAVE_KEY,JSON.stringify(qaSeed));}
localStorage.setItem(STARTUP_INTRO_KEY,String(Date.now()));
`+marker);
source=require('./fixture-live-clock.cjs')(source,'roleRunIntervals',true);
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
 profile=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-best-now-'));browser=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
 browser.stderr.on('data',b=>stderr=(stderr+b).slice(-4000));browser.on('error',e=>{for(const p of pending.values())p.reject(e);});
 browser.on('close',()=>{closed=true;for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('browser closed'));}pending.clear();});
 browser.stdio[4].on('data',b=>{buffer+=b;let end;while((end=buffer.indexOf('\0'))>=0){const raw=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!raw)continue;const m=JSON.parse(raw),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}});
 identity.version=await send('Browser.getVersion',{},null);
 const tab=await send('Target.createTarget',{url:'about:blank'},null);sid=(await send('Target.attachToTarget',{targetId:tab.targetId,flatten:true},null)).sessionId;await send('Page.enable');await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});
 let ready=false;for(let i=0;i<200;i++){if(await ev('!!window.roleQa && !!document.querySelector("[data-wisp-role=ember]")')){ready=true;break;}await pause(20);}ok(ready,'actual complete app readiness');await ev('document.fonts.ready');


 if(baseline){await ev('document.querySelector("[data-tab=spirits]").click();document.querySelector(".formation-help").open=true');ok(await ev('!document.getElementById("formation-best-now-btn")&&document.getElementById("bond-card").textContent.includes("Best now")'),'exact baseline marks Best now but has no field action');records.push({baseline:true});}
 else{
 await send('Runtime.enable');await send('DOM.enable');
 for(const width of [320,390,430])for(const fontPercent of [100,200])for(const motion of ['no-preference','reduce']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});
  await ev(`document.documentElement.style.fontSize='${fontPercent}%';document.querySelector('[data-tab=spirits]').click();document.querySelector('.formation-help').open=true;`);
  await ev('Promise.all(document.getElementById("tab-spirits").getAnimations().map(a=>a.finished)).then(()=>true)');
  for(const mode of ['Push','Farm','Boss'])for(const input of ['Enter','Space','touch']){
   await ev(`(()=>{var q=roleQa,s=q.fresh();s.questDay=q.today();s.maxDepthEver=250;s.depth=s.enemyDepth=${mode==='Boss'?100:101};s.enemyHp=s.enemyMaxHp=1e12;s.activeParty=['titan'];s.activeFormationPreset='push';s.formationPresets={push:['titan'],farm:['ember'],boss:['stone']};Object.keys(s.spirits).forEach(function(id){s.spirits[id]=40;});if('${mode}'==='Farm'){s.riftMode='farm';s.farmReturnDepth=102;s.farmDepth=101;}q.set(s);q.render();window.originalBest=document.getElementById('formation-best-now-btn');})()`);
   await ev('Promise.all(originalBest.getAnimations().map(a=>a.finished)).then(()=>true)');
   const observe=()=>ev(`(()=>{var b=document.getElementById('formation-best-now-btn'),r=b.getBoundingClientRect();return {label:b.textContent,denied:b.getAttribute('aria-disabled'),same:b===originalBest,focus:document.activeElement===b,team:document.getElementById('formation-best-now-team').textContent,status:document.getElementById('formation-best-now-status').textContent,rect:{x:r.x,y:r.y,w:r.width,h:r.height,scroll:b.scrollWidth,client:b.clientWidth},fit:r.left>=-1&&r.right<=innerWidth+1&&b.scrollWidth<=b.clientWidth+1,target:r.width>=44&&r.height>=44,open:document.querySelector('.formation-help').open,errors:roleErrors};})()`);
   const key=async()=>{await send('Input.dispatchKeyEvent',{type:input==='Enter'?'keyDown':'rawKeyDown',key:input==='Space'?' ':input,code:input,windowsVirtualKeyCode:input==='Space'?32:13,...(input==='Enter'?{text:'\r'}:{})});await send('Input.dispatchKeyEvent',{type:'keyUp',key:input==='Space'?' ':input,code:input,windowsVirtualKeyCode:input==='Space'?32:13});};
   const activate=async()=>{await ev('originalBest.scrollIntoView({block:"center"});originalBest.focus({preventScroll:true})');if(input==='touch'){const point=await ev('(()=>{var r=originalBest.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()');await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}else await key();};
   let o=await observe();ok(o.label.includes(mode)&&o.denied==='false','context action available');ok(o.fit&&o.target,'mobile/text button fit and44px '+JSON.stringify({width,fontPercent,motion,mode,input,o}));ok(o.status.includes('saves it to Push')&&o.status.includes('No currencies spent'),'save destination/cost visible');
   const plan=await ev('roleQa.plan()'),before=await ev('roleQa.get()');await activate();const after=await ev('roleQa.get()');
   const expected=JSON.parse(JSON.stringify(before));expected.activeParty=plan.members;expected.formationPresets.push=plan.members;expected.formationRebuild=null;expectSaveClock(expected,after);assert.deepEqual(after,expected,'only chosen formation/save timestamp change');checks++;
   o=await observe();ok(o.same&&o.focus&&o.open&&o.denied==='true'&&o.status.includes('already fielded'),'same focused action after native '+input);ok(await ev('roleQa.plan().focus.bonds.every(id=>roleQa.compare().steady.bonds.some(b=>b.id===id))'),'all recommended Bonds active');
   await activate();assert.deepEqual(await ev('roleQa.get()'),after,'repeat input does nothing');checks++;
   await ev('roleQa.render();roleQa.readout()');o=await observe();ok(o.same&&o.focus&&o.denied==='true','refresh retains action focus/availability');
   // Remove a required recruit and exercise the real button, then direct handler
   // for stale availability. Both must refuse without touching state or storage.
   await ev('(()=>{var s=roleQa.get();s.activeParty=["titan"];s.formationPresets.push=["titan"];s.spirits[roleQa.plan().required[0]]=0;roleQa.set(s);roleQa.render();})()');
   const blocked=await ev('({state:roleQa.get(),saved:roleQa.saved()})');o=await observe();ok(o.denied==='true'&&o.status.includes('Recruit first:'),'missing roster clearly blocks');await activate();ok(await ev('roleQa.field()')===false,'handler rechecks missing recruit');assert.deepEqual(await ev('({state:roleQa.get(),saved:roleQa.saved()})'),blocked,'blocked action does not change progress or saved bytes');checks++;
   ok((await observe()).errors.length===0,'no runtime errors');
   records.push({width,fontPercent,motion,mode,input});
  }
  if(width===390&&motion==='reduce'){
   await ev('originalBest.scrollIntoView({block:"center"})');fs.mkdirSync(out,{recursive:true});const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,'missing-'+fontPercent+'.png'),Buffer.from(shot.data,'base64'));
   await ev('(()=>{var s=roleQa.get();Object.keys(s.spirits).forEach(id=>s.spirits[id]=40);s.activeParty=["tide"];s.formationPresets.push=["tide"];roleQa.set(s);roleQa.render();originalBest.focus();})()');const ready=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,'ready-'+fontPercent+'.png'),Buffer.from(ready.data,'base64'));
  }
 }
 // Actual reload and passive timers in a fully recruited profile.
 const savedParty=await ev('roleQa.field();roleQa.get().activeParty');
 await send('Page.reload');await pause(150);for(let i=0;i<200;i++){try{if(await ev('!!window.roleQa&&!!document.querySelector("[data-wisp-role=ember]")'))break;}catch(e){if(!/context|navigated/.test(e.message))throw e;}await pause(20);}
 assert.deepEqual(await ev('roleQa.get().activeParty'),savedParty,'real reload keeps fielded team');checks++;
 await ev('document.querySelector("[data-tab=spirits]").click();document.querySelector(".formation-help").open=true;document.getElementById("formation-best-now-btn").focus();window.roleRunIntervals=true');await pause(1200);await ev('window.roleRunIntervals=false');ok(await ev('document.activeElement===document.getElementById("formation-best-now-btn")&&document.getElementById("formation-best-now-btn").getAttribute("aria-disabled")==="true"'),'live interval keeps same disabled action focus');
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
