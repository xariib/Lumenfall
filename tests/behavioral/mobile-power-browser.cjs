'use strict';
// Real foreground timers and CPU counters. Visibility is injected to exercise
// the production lifecycle deterministically; this is not a phone power meter.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {spawn,spawnSync}=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {findChrome}=require('../../scripts/lib/browser.cjs');
const file=path.resolve(process.argv[2]||'index.html'),out=path.resolve(process.argv[3]||'validation-evidence/mobile-power');
const baseline=process.argv.includes('--baseline'),mutant=process.argv.includes('--mutate-hidden-loop');
let source=fs.readFileSync(file,'utf8');
if(mutant){const stop='if(liveTickTimer!==null)clearInterval(liveTickTimer);';assert.equal(source.split(stop).length,2);source=source.replace(stop,'/* injected missing suspension */');}
const bridge=String.raw`
window.powerQa={
 evaluate:function(code){return eval(code);},
 seed:function(tab){
  if(startupIntroFinish)startupIntroFinish();
  document.querySelectorAll('.overlay,#startup-intro').forEach(function(el){el.style.display='none';});
  overlayFocus=null;setOverlayInert(null);isNewGame=false;pendingDailyReward=null;pendingDailyRewardQueue=[];
  state=freshState();state.questDay=todayStr();state.tutorialDone=true;
  state.depth=21;state.farmDepth=21;state.maxDepthEver=250;state.riftMode='farm';state.farmReturnDepth=251;state.farmAutoResume=false;
  state.activeParty=['ember','void','tide'];state.lumen=0;
  SPIRITS.forEach(function(sp){state.spirits[sp.id]=25;state.empowerQueue[sp.id]=false;});
  state.activeStudies=[{id:'guardmastery',slot:0,remainingSec:1000,totalDurationSec:1000,speedMult:1}];
  state.lastSeen=Date.now();spawnEnemy(false);renderAll();activateTab(tab);resetLiveClock();
 },
 watch:function(){
  window.powerCalls={};
  ['tick','updateBattleFast','renderSpirits','renderResearch','renderLongStudies','renderDaily','renderAscendSummary','checkAffordability'].forEach(function(name){
   var original=eval(name);eval(name+'=function(){window.powerCalls["'+name+'"]=(window.powerCalls["'+name+'"]||0)+1;return original.apply(this,arguments);};');
  });
  window.powerMutations=0;new MutationObserver(function(records){window.powerMutations+=records.length;}).observe(document.querySelector('.shell'),{childList:true,subtree:true,attributes:true,characterData:true});
 },
 reset:function(){window.powerCalls={};window.powerMutations=0;window.powerStarDraws=0;window.powerTimerWakes=0;},
 sample:function(){return {calls:window.powerCalls,mutations:window.powerMutations,starDraws:window.powerStarDraws,timerWakes:window.powerTimerWakes,overlay:overlayFocus&&overlayFocus.el.id,depth:state.depth,kills:state.totalKills,remaining:state.activeStudies[0].remainingSec,errors:window.powerErrors};},
 hidden:function(value){Object.defineProperty(document,'hidden',{configurable:true,value:value});document.dispatchEvent(new Event('visibilitychange'));}
};`;
const prelude=String.raw`<script>
window.powerErrors=[];window.powerStarDraws=0;
window.powerTimerWakes=0;var nativeInterval=window.setInterval;window.setInterval=function(callback,ms){return nativeInterval(function(){powerTimerWakes++;callback();},ms);};
addEventListener('error',function(e){powerErrors.push(e.message);});addEventListener('unhandledrejection',function(e){powerErrors.push(String(e.reason));});
var oldClear=CanvasRenderingContext2D.prototype.clearRect;CanvasRenderingContext2D.prototype.clearRect=function(){if(this.canvas.id==='stars')powerStarDraws++;return oldClear.apply(this,arguments);};
localStorage.setItem('lumenfall_startup_intro_last',String(Date.now()));
</script>`;
const marker="if(document.readyState==='loading'){";assert.equal(source.split(marker).length,2);
const html=source.replace('<head>','<head>'+prelude).replace(marker,bridge+marker);
let browser,session,seq=0,buffer='',closed=false,completion;const pending=new Map(),records=[];
let checks=0;function ok(value,message){checks++;assert(value,message);}
function send(method,params={},sid=session){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout '+method));},30000);pending.set(id,{resolve,reject,timer});browser.stdio[3].write(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})})+'\0');});}
async function ev(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function metrics(){const r=await send('Performance.getMetrics');return Object.fromEntries(r.metrics.map(m=>[m.name,m.value]));}
const server=http.createServer((req,res)=>{const name=new URL(req.url,'http://localhost').pathname;if(name==='/'||name==='/index.html'){res.setHeader('Content-Type','text/html');res.end(html);return;}const target=path.resolve(path.dirname(file),'.'+name);if(!target.startsWith(path.dirname(file)+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',target.endsWith('.css')?'text/css':target.endsWith('.woff2')?'font/woff2':'image/svg+xml');fs.createReadStream(target).pipe(res);});
async function main(){
 fs.mkdirSync(out,{recursive:true});const profile=fs.mkdtempSync(path.join(out,'owned-browser-'));
 fs.writeFileSync(path.join(profile,'task-owner.json'),JSON.stringify({task:'MOBILE_POWER_001',disposable:true,profile}));
 let report;
 try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=spawn(findChrome(),['--headless=new','--enable-automation','--no-sandbox','--disable-dev-shm-usage','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
  completion=new Promise(resolve=>{browser.once('error',e=>resolve({error:e.message}));browser.once('close',()=>{closed=true;resolve();});});browser.stderr.resume();
  browser.stdio[4].on('data',b=>{buffer+=b;let i;while((i=buffer.indexOf('\0'))>=0){const raw=buffer.slice(0,i);buffer=buffer.slice(i+1);if(!raw)continue;const m=JSON.parse(raw),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}});
  const tab=await send('Target.createTarget',{url:'about:blank'},null);session=(await send('Target.attachToTarget',{targetId:tab.targetId,flatten:true},null)).sessionId;
  await send('Page.enable');await send('Performance.enable');await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:2,mobile:true});
  await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/'});
  const deadline=Date.now()+20000;while(!(await ev('!!window.powerQa && powerQa.evaluate("!!els.toast && !startupIntroPlaying && !resumeFlowBusy")'))){assert(Date.now()<deadline,'startup timeout');await pause(100);}
  await ev('powerQa.watch()');
  for(const tabName of ['battle','spirits','research','deeds']){
   await ev('powerQa.seed('+JSON.stringify(tabName)+')');await pause(500);await ev('powerQa.reset()');const before=await metrics();
   await pause(5000);const after=await metrics(),sample=await ev('powerQa.sample()');
   ok(sample.errors.length===0,'no runtime errors '+tabName);ok(sample.remaining<995,'real timed study advances '+tabName);ok(!sample.overlay,'benchmark is unobstructed gameplay '+tabName);
   if(tabName==='battle')ok(sample.calls.updateBattleFast>=40,'visible combat is rendered throughout measurement');
   if(!baseline){ok(sample.starDraws===0,'ambient stars do not repaint continuously');if(tabName!=='battle')ok(!sample.calls.updateBattleFast,'hidden Rift receives no recurring full renders '+tabName);if(tabName!=='spirits')ok(!sample.calls.renderSpirits,'hidden roster receives no recurring rebuilds '+tabName);}
   records.push({tab:tabName,...sample,taskMs:(after.TaskDuration-before.TaskDuration)*1000,scriptMs:(after.ScriptDuration-before.ScriptDuration)*1000,layoutCount:after.LayoutCount-before.LayoutCount,layoutMs:(after.LayoutDuration-before.LayoutDuration)*1000,measuredMs:(after.Timestamp-before.Timestamp)*1000});
  }
  // Visible prices and state must be fresh when entering every panel.
  for(const tabName of ['battle','spirits','forge','research','ascend','deeds']){
   await ev('powerQa.evaluate("activateTab(\\"'+tabName+'\\")")');
   ok(await ev('document.querySelector("#tab-'+tabName+'").classList.contains("active")'),'navigation '+tabName);
   if(!baseline)ok(await ev('powerQa.evaluate('+JSON.stringify(`(function(){var panel=document.getElementById('tab-${tabName}');function prices(){return Array.from(panel.querySelectorAll('button,[data-price-currency]')).map(function(el){return [el.getAttribute('data-price-currency'),el.getAttribute('data-price-amount'),el.style.color,el.disabled,el.getAttribute('data-state'),el.getAttribute('aria-disabled'),el.className];});}var before=JSON.stringify(prices());renderAll();return before===JSON.stringify(prices());})()`)+')'),'navigation has current prices and purchase states '+tabName);
  }
  if(!baseline){
   await ev('powerQa.evaluate("activateTab(\\"battle\\");openSettings();");powerQa.reset()');await pause(500);
   ok(!(await ev('powerQa.sample()')).calls.updateBattleFast,'covered Rift has no recurring renders');
   ok(await ev('getComputedStyle(document.querySelector(".creature-art")).animationPlayState')==='paused','covered battle animation paused');
   await ev('powerQa.evaluate("closeSettings();")');
   await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
   ok(await ev('powerQa.evaluate('+JSON.stringify(`(function(){renderAll();var hp=document.getElementById('hp-fill'),hpRatio=Amount.ratio(state.enemyHp,state.enemyMaxHp),bar=hp.parentElement;return Math.abs(hp.getBoundingClientRect().width/bar.clientWidth-hpRatio)<.01 && getComputedStyle(hp).transitionProperty.indexOf('width')===-1;})()`)+')'),'HP visual fraction matches authoritative HP without layout animation');
  }
  await ev('powerQa.seed("battle");powerQa.hidden(true);powerQa.reset()');const hiddenBefore=await ev('powerQa.sample()');await pause(1300);const hiddenAfter=await ev('powerQa.sample()');
  ok(hiddenAfter.remaining===hiddenBefore.remaining,'hidden time is reserved for offline catch-up');
  if(!baseline){ok(hiddenAfter.timerWakes===0,'no hidden timer wakes');ok(hiddenAfter.starDraws===0,'no hidden canvas paints');}
  await ev('powerQa.hidden(false)');await pause(1600);
  ok(await ev('powerQa.evaluate("!offlinePending && !offlineCatchup && !resumeFlowBusy")'),'return transaction finishes');
  ok(await ev('powerQa.sample().remaining')<hiddenAfter.remaining-1,'offline interval recovered');
  for(let i=0;i<3;i++){await ev('powerQa.hidden(true)');await pause(40);await ev('powerQa.hidden(false)');}
  await ev('powerQa.reset()');await pause(1100);const resumed=await ev('powerQa.sample()');
  if(!baseline)ok(resumed.timerWakes>=8&&resumed.timerWakes<=14,'one tick loop after repeated resumes');
  ok(resumed.errors.length===0,'lifecycle has no runtime errors');
  const screenshot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,'rift.png'),Buffer.from(screenshot.data,'base64'));
  report={status:'pass',baseline,mutant,checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),browser:await send('Browser.getVersion',{},null),records,hidden:hiddenAfter,resumed};
 }catch(error){report={status:'fail',baseline,mutant,checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),error:error.stack,records};process.exitCode=1;}
 finally{
  if(browser&&!closed){try{await send('Browser.close',{},null);}catch{}await Promise.race([completion,pause(15000)]);}
  await new Promise(resolve=>server.close(resolve));
  // Exact owned profile only; inspect provenance, resolved containment and links
  // before native Windows cleanup. Never recursively remove the evidence root.
  if(closed){
   const owner=JSON.parse(fs.readFileSync(path.join(profile,'task-owner.json')));assert.equal(owner.profile,profile);assert.equal(owner.task,'MOBILE_POWER_001');assert(profile.startsWith(out+path.sep));
   if(process.platform==='win32'){
    const quote=s=>"'"+s.replace(/'/g,"''")+"'";
    const cleanup=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',"$p="+quote(profile)+"; if ((Resolve-Path -LiteralPath $p).Path -ne $p) { throw 'Path mismatch' }; if (Get-ChildItem -LiteralPath $p -Recurse -Force | Where-Object { $_.Attributes -band [IO.FileAttributes]::ReparsePoint }) { throw 'Link in owned profile' }; if (Test-Path -LiteralPath (Join-Path $p '.git')) { throw 'Worktree in profile' }; Remove-Item -LiteralPath $p -Recurse -Force"],{encoding:'utf8'});
    if(cleanup.status!==0){report.cleanup={remaining:profile,error:cleanup.stderr};process.exitCode=1;}
   }else fs.rmSync(profile,{recursive:true});
  }else{report.cleanup={remaining:profile,error:'Browser did not exit; profile kept'};process.exitCode=1;}
 }
 fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
