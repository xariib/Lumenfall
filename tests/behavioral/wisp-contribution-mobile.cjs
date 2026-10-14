'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {spawn,execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..'),file=path.resolve(process.argv[2]||'index.html'),out=path.resolve(process.argv[3]||'/tmp/wisp-contribution-mobile');
let source=fs.readFileSync(file,'utf8');const sourceSha256=crypto.createHash('sha256').update(source).digest('hex');
const marker="if(document.readyState==='loading'){";assert.equal(source.split(marker).length,2);
source=source.replace('<head>',`<head><script>window.roleErrors=[];addEventListener('error',e=>roleErrors.push(e.message));addEventListener('unhandledrejection',e=>roleErrors.push(String(e.reason)));var roleInterval=setInterval;window.setInterval=function(fn,ms){return roleInterval(function(){if(window.roleRunIntervals)fn();},ms);};</script>`).replace(marker,`
window.roleQa={fresh:freshState,get:function(){return JSON.parse(JSON.stringify(state));},set:function(s){state=acceptPersistedState(s);restoreEnemyOrSpawn();},render:renderAll,readout:renderWispRoles,compare:wispRoleComparison};
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
 profile=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-roles-'));browser=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
 browser.stderr.on('data',b=>stderr=(stderr+b).slice(-4000));browser.on('error',e=>{for(const p of pending.values())p.reject(e);});
 browser.on('close',()=>{closed=true;for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('browser closed'));}pending.clear();});
 browser.stdio[4].on('data',b=>{buffer+=b;let end;while((end=buffer.indexOf('\0'))>=0){const raw=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!raw)continue;const m=JSON.parse(raw),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}});
 identity.version=await send('Browser.getVersion',{},null);
 const tab=await send('Target.createTarget',{url:'about:blank'},null);sid=(await send('Target.attachToTarget',{targetId:tab.targetId,flatten:true},null)).sessionId;await send('Page.enable');await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});
 let ready=false;for(let i=0;i<200;i++){if(await ev('!!window.roleQa && !!document.querySelector("[data-wisp-role=ember]")')){ready=true;break;}await pause(20);}ok(ready,'actual complete app readiness');await ev('document.fonts.ready');
 for(const width of [320,390,430])for(const fontPercent of [100,200])for(const motion of ['no-preference','reduce']){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});
  await ev(`(()=>{var q=roleQa,s=q.fresh();s.questDay=new Date().toISOString().slice(0,10);s.maxDepthEver=250;s.depth=101;s.activeParty=['ember','tide','gale','thorn','aurora'];Object.keys(s.spirits).forEach(function(id){s.spirits[id]=100;s.heroRarity[id]=5;s.wispModules[id]=20;s.wispUltimate[id]=true;});s.research.tapconduit=5;s.research.relay=5;s.research.dualchannel=5;s.research.amplifiertrim=5;s.achieved.autotap=true;s.lumen=s.shards=1e20;q.set(s);q.render();document.documentElement.style.fontSize='${fontPercent}%';document.querySelector('[data-tab=spirits]').click();document.querySelector('.formation-help').open=true;})()`);
  await ev('Promise.all(document.getElementById("tab-spirits").getAnimations().map(a=>a.finished)).then(()=>true)');await pause(40);
  const observed=await ev(`(()=>{var q=roleQa,p=document.getElementById('tab-spirits'),before=JSON.stringify(q.get()),tide=p.querySelector('[data-wisp-role=tide]'),gale=p.querySelector('[data-wisp-role=gale]'),summary=document.getElementById('bond-card');var started=performance.now();q.readout();var elapsed=performance.now()-started;
  var fit=Array.from(p.querySelectorAll('.wisp-role-line,.wisp-role-note')).every(function(e){var r=e.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1&&e.scrollWidth<=e.clientWidth+1;});
  var targets=Array.from(p.querySelectorAll('button,summary')).filter(function(e){return !e.disabled&&e.getBoundingClientRect().height>0;}).map(function(e){var r=e.getBoundingClientRect();return [r.width,r.height,e.outerHTML.slice(0,200)];});
  var field=p.querySelector('[data-toggle=tide]');field.focus({preventScroll:true});var top=field.getBoundingClientRect().top;q.readout();var style=getComputedStyle(tide.querySelector('.wisp-role-note'));
  return {fit:fit,targets:targets,pure:JSON.stringify(q.get())===before,focus:document.activeElement===field,viewport:Math.abs(field.getBoundingClientRect().top-top),summary:summary.textContent,removed:!document.getElementById('wisp-role-summary'),previewsRemoved:Array.from(p.querySelectorAll('[data-wisp-card]')).every(function(e){return !e.textContent.includes('Raw damage')&&!e.textContent.includes('Party preview');}),tide:tide.textContent,gale:gale.textContent,titan:p.querySelector('[data-wisp-role=titan]').textContent,color:style.color,animation:style.animationName,transition:style.transitionDuration,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,elapsedMs:elapsed,errors:roleErrors};})()`);
  fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'last-observation.json'),JSON.stringify({width,fontPercent,motion,observed},null,2));
  ok(observed.fit,'readouts fit '+width+'/'+fontPercent);ok(observed.targets.every(r=>r[0]>=44&&r[1]>=44),'all visible Wisp controls44px '+JSON.stringify(observed.targets.filter(r=>r[0]<44||r[1]<44)));ok(observed.pure&&observed.focus&&observed.viewport<1,'pure refresh preserves focus/viewport');
  ok(observed.removed&&['Formation Bonds','Kindling','Pathfinder'].every(t=>observed.summary.includes(t)),'Contribution removed and existing Bond guidance retained');
  ok(observed.previewsRemoved,'raw damage and party preview removed from every Wisp card');
  ok(observed.tide.includes('Support added to party')&&observed.tide.includes('Motes from Module'),'Support/Motes visibility');ok(observed.gale.includes('Shards per cast')&&observed.gale.includes('Lumen per cast'),'current Dual Channel rewards visible');ok(observed.titan.includes('Benched'),'bench zero forecast');
  const rgb=observed.color.match(/[\d.]+/g).slice(0,3).map(Number),lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0),contrast=(lum(rgb)+.05)/(lum([29,41,64])+.05);
  ok(contrast>=4.5,'readout contrast');ok(observed.animation==='none'&&observed.transition.split(',').every(v=>parseFloat(v)===0),'no readout animation');if(motion==='reduce')ok(observed.reduced,'actual reduced preference');ok(observed.errors.length===0,'no real browser runtime errors');
  await ev('document.querySelector("[data-toggle=tide]").scrollIntoView({block:"center"})');await pause(50);let rect=await ev('(()=>{var r=document.querySelector("[data-toggle=tide]").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()');
  await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[rect]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});ok(await ev('!roleQa.get().activeParty.includes("tide") && document.querySelector("[data-wisp-role=tide]").textContent.includes("Benched")'),'real touch bench refresh');
  await ev('document.querySelector("[data-toggle=tide]").focus()');await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',windowsVirtualKeyCode:13});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});ok(await ev('roleQa.get().activeParty.includes("tide") && document.querySelector("[data-wisp-role=tide]").textContent.includes("Support added")'),'real keyboard field refresh');
  records.push({width,fontPercent,motion,contrast,elapsedMs:observed.elapsedMs,fit:true,realTouch:true,realKeyboard:true});
  if(width===390&&motion==='reduce'){await ev('document.querySelector(".formation-help").scrollIntoView({block:"start"})');const shot=await send('Page.captureScreenshot',{format:'png'});fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'roles-390-'+fontPercent+'.png'),Buffer.from(shot.data,'base64'));}
 }
 fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({status:'PASS',checks,sourceSha256,browser:identity,profiles:records,scope:'Modern browser DOM/CSS/native input only; not Android textZoom/exact WebView60/physical/TalkBack'},null,2));console.log(JSON.stringify({status:'PASS',checks,profiles:records.length,sourceSha256,browser:identity}));
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
