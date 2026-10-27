/* Native CDP touch/keyboard at mobile widths; production page remains unmodified. */
const {spawn}=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const [chrome,url,scenario]=process.argv.slice(2),profile=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-lab-motes-'));
const browser=spawn(process.env.LUMENFALL_QA_CDP_CHROME||chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
let seq=0,buffer='',stderr='',session,closed=false;const pending=new Map(),records=[];
function rejectPending(message){for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error(message+' '+p.method));}pending.clear();}
const completion=new Promise(resolve=>{browser.once('error',e=>{rejectPending(e.message);resolve({error:e.message});});browser.once('exit',(code,signal)=>{closed=true;for(const n of [3,4])browser.stdio[n].destroy();rejectPending('browser closed');resolve({code,signal});});});
browser.stderr.on('data',b=>{stderr=(stderr+b).slice(-4000);});
for(const stream of [browser.stdio[3],browser.stdio[4]])stream.on('error',e=>rejectPending(e.message));
browser.stdio[4].on('data',b=>{buffer+=b;let end;while((end=buffer.indexOf('\0'))!==-1){const raw=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!raw)continue;const m=JSON.parse(raw);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}});
function send(method,params={},sid=session){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout '+method+' '+stderr));},15000);pending.set(id,{resolve,reject,timer,method});browser.stdio[3].write(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})})+'\0');});}
async function evaluate(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
function assert(v,m){if(!v)throw Error(m);}
async function key(key){const spec=key==='Space'?{key:' ',code:'Space',windowsVirtualKeyCode:32}:{key,code:key,windowsVirtualKeyCode:{ArrowDown:40,ArrowUp:38,ArrowRight:39,ArrowLeft:37,Tab:9,Enter:13,Escape:27}[key]};await send('Input.dispatchKeyEvent',{type:key==='Enter'?'keyDown':'rawKeyDown',...(key==='Enter'?{text:'\r',unmodifiedText:'\r'}:{}),...spec});await send('Input.dispatchKeyEvent',{type:'keyUp',...spec});}
async function snapshot(){return evaluate(`(()=>{const b=window.__lumenfallQaBridge,s=document.querySelector('[data-study-speed-target="guardmastery"]'),a=b.getState(),r=s.getBoundingClientRect();return {state:a,primary:b.rawSave(),recovery:b.rawRecovery(),events:b.lifecycleTrace(),value:s.value,focused:Object.assign({},document.activeElement?.dataset),speed:b.labMotes.effective(a.activeStudies.find(e=>e.id==='guardmastery')),rect:{x:r.x,y:r.y,width:r.width,height:r.height},scroll:document.querySelector('main').scrollTop,fit:document.documentElement.scrollWidth<=innerWidth&&document.querySelector('#study-list').scrollWidth<=document.querySelector('#study-list').clientWidth+1,errors:window.__lumenfallQaContext.errors};})()`);}
async function run(){
 const motion=scenario.includes('reduced')?'reduce':'no-preference';
 for(const width of [320,390,430]) for(const textScale of [1,2]){
  const context=await send('Target.createBrowserContext',{},null),tab=await send('Target.createTarget',{url:'about:blank',browserContextId:context.browserContextId},null);session=(await send('Target.attachToTarget',{targetId:tab.targetId,flatten:true},null)).sessionId;
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setTouchEmulationEnabled',{enabled:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});await send('Page.enable');await send('Runtime.enable');await send('DOM.enable');await send('Page.navigate',{url});
  for(let i=0;i<150&&!await evaluate('!!window.__labMotesNativeReady');i++)await new Promise(r=>setTimeout(r,20));
  assert(await evaluate('!!window.__labMotesNativeReady'),'native Lab page ready');await evaluate('window.__qaForgeStartup.promise');await evaluate('document.fonts.ready.then(()=>true)');
  await evaluate(`document.documentElement.style.fontSize='${textScale*16}px';window.__lumenfallQaBridge.uiMeasurementPause(true)`);
  await evaluate(`(()=>{const b=window.__lumenfallQaBridge,s=labMotesSeed(b,window.__lumenfallQaContext);s.activeStudies=[];b.setState(s);b.renderLayout();document.querySelector('[data-tab="research"]').click();document.querySelector('[data-study-slot]').click();document.querySelector('[data-study="guardmastery"]').focus();})()`);
  await key('Enter');
  assert(await evaluate(`document.activeElement.dataset.studySpeedSummary==='guardmastery'&&document.activeElement.getClientRects().length>0&&!document.querySelector('[data-study-inspection="guardmastery"]').hidden&&window.__lumenfallQaBridge.getState().activeStudies.some(a=>a.id==='guardmastery')`),'real keyboard Begin retains visible same-Study focus with inline controls');
  const labUi=await evaluate('runLabUiQa(window.__lumenfallQaBridge,window.__lumenfallQaContext,function(v,m){if(!v)throw Error(m);})');
  await evaluate('window.selectLabSpeed("guardmastery",1.5)');
  const collapsedAx=await send('Accessibility.getFullAXTree');
  assert(collapsedAx.nodes.some(n=>!n.ignored&&/Speed target/.test(n.name?.value||'')),'inline selector present in accessibility tree');
  await evaluate('document.querySelector("[data-running-study=guardmastery]").scrollIntoView({block:"start"})');
  await new Promise(r=>setTimeout(r,250));
  if(process.env.LUMENFALL_QA_EVIDENCE_DIR){const shot=await send('Page.captureScreenshot',{format:'png'});fs.mkdirSync(process.env.LUMENFALL_QA_EVIDENCE_DIR,{recursive:true});fs.writeFileSync(path.join(process.env.LUMENFALL_QA_EVIDENCE_DIR,'lab-ui-card-'+width+'-'+motion+'-text'+textScale+'.png'),Buffer.from(shot.data,'base64'));}
  await evaluate(`(()=>{const b=window.__lumenfallQaBridge;b.uiMeasurementPause(true);b.resetFeedback();const s=labMotesSeed(b,window.__lumenfallQaContext);s.motes=0;s.studySpeedTargets.guardmastery=2;s.studyQueue.guardmastery=true;s.activeStudies=[{id:'guardmastery',remainingSec:150,totalDurationSec:150,speedMult:1}];s.enemyHp=s.enemyMaxHp=1e9;b.setState(s);b.save();b.renderLayout();document.querySelector('[data-tab="research"]').click();var open=document.querySelector('[data-study-speed-open]');if(open.getAttribute('aria-expanded')==='true')open.click();document.querySelector('[data-study-speed-open]').focus();})()`);
  await key('Enter');await key('Tab');assert(await evaluate('document.activeElement.dataset.studyBoostHours')==='guardmastery','Tab reaches duration before range');
  await key('ArrowDown');
  assert(await evaluate('window.__lumenfallQaBridge.getState().studyBoostHours.guardmastery===12'),'native duration choice saves12h');
  await key('Tab');assert(await evaluate('document.activeElement.dataset.studySpeedTarget')==='guardmastery','Tab reaches native speed range');
  await key('ArrowRight');
  assert(await evaluate('window.__lumenfallQaBridge.getState().studySpeedTargets.guardmastery===3&&window.__lumenfallQaBridge.getState().motes===0'),'native range selects3x without paying');
  const ax=await send('Accessibility.getFullAXTree');
  assert(ax.nodes.some(n=>!n.ignored&&n.role?.value==='slider'&&/Guardian.*Speed target/.test(n.name?.value||'')),'named speed slider in AX');
  assert(!ax.nodes.some(n=>!n.ignored&&n.role?.value==='progressbar'&&/Guardian/.test(n.name?.value||'')),'modal isolates background progress from AX');
  await key('Escape');const backgroundAx=await send('Accessibility.getFullAXTree');
  assert(backgroundAx.nodes.some(n=>!n.ignored&&n.role?.value==='progressbar'&&/Guardian/.test(n.name?.value||'')),'progress is accessible after closing menu');
  await evaluate('document.querySelector(".study-speed-open").click();document.querySelector("[data-study-speed-target=guardmastery]").focus()');
  assert(ax.nodes.some(n=>!n.ignored&&/Guardian.*Boost duration/.test(n.name?.value||'')),'named duration in AX');
  await evaluate('document.querySelector("[data-study-speed-target=guardmastery]").scrollIntoView({block:"center"});window.nativeRange=document.activeElement');
  await new Promise(r=>setTimeout(r,350));let before=await snapshot();assert(before.fit&&before.rect.height>=44,'mobile range fits');
  await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:before.rect.x+12+(before.rect.width-24)*2/7,y:before.rect.y+before.rect.height/2}]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  let selected=await snapshot();assert(selected.focused.studySpeedTarget==='guardmastery'&&selected.value==='2'&&selected.state.motes===0,'native touch selects3x, no spending');
  await evaluate('window.__lumenfallQaBridge.uiMeasurementPause(false)');await new Promise(r=>setTimeout(r,450));await evaluate('window.__lumenfallQaBridge.uiMeasurementPause(true)');let waiting=await snapshot();
  assert(waiting.state.activeStudies[0].remainingSec<selected.state.activeStudies[0].remainingSec&&waiting.speed===1&&waiting.state.motes===0,'live ticks keep unfunded Study1x');
  await evaluate(`(()=>{const b=window.__lumenfallQaBridge,s=b.getState();s.motes=4988;b.setState(s);b.renderLayout();document.querySelector('[data-study-speed-target="guardmastery"]').focus({preventScroll:true});})()`);
  before=await snapshot();await evaluate('window.__lumenfallQaBridge.renderLayout();window.__lumenfallQaBridge.refreshAffordability()');let rendered=await snapshot();
  assert(JSON.stringify([rendered.state,rendered.primary,rendered.recovery,rendered.events])===JSON.stringify([before.state,before.primary,before.recovery,before.events]),'render/affordability cannot pay or save');
  assert(await evaluate('!document.querySelector("[data-speed-study=guardmastery]").disabled'),'funded exact package actionable');
  await key('Tab');assert(await evaluate('document.activeElement.dataset.speedStudy')==='guardmastery','Tab reaches funded action');await key('Enter');let firstBought=await snapshot();assert(firstBought.focused.studySpeedSummary==='guardmastery'&&firstBought.state.motes===0,'first Enter returns to slot after exact debit');await key('Enter');assert(await evaluate('window.__lumenfallQaBridge.getState().motes===0&&document.querySelector(".study-speed-menu").contains(document.activeElement)'),'repeat Enter reopens paid timer without spending');await key('Escape');let bought=await snapshot();
  assert(bought.speed===3&&bought.state.motes===0&&bought.focused.studySpeedSummary==='guardmastery'&&bought.state.studyBoosts.slot0.expiresAtMs-bought.state.studyBoosts.slot0.startedAtMs===43200000,'native Enter pays4988 once for3x12h, timer focused');
  assert(JSON.parse(bought.primary).studyBoosts.slot0.mult===3&&bought.primary===bought.recovery,'paid timer persisted both slots');
  await evaluate('window.__lumenfallQaBridge.uiMeasurementPause(false)');await new Promise(r=>setTimeout(r,1100));await evaluate('window.__lumenfallQaBridge.uiMeasurementPause(true)');let ticking=await snapshot();
  assert(ticking.focused.studySpeedSummary==='guardmastery'&&ticking.state.motes===0&&ticking.speed===3,'actual timer ticks preserve focus and no recurring charge');
  const controls=await evaluate(`Array.from(document.querySelectorAll('[data-study-boost-hours],[data-study-speed-target]')).filter(e=>e.getClientRects().length).map(e=>{const r=e.getBoundingClientRect();return {w:r.width,h:r.height,label:e.getAttribute('aria-label')};})`);assert(controls.every(r=>r.w>=44&&r.h>=44&&r.label),'44px named controls');assert(ticking.fit&&!ticking.errors.length,'no overflow/runtime errors');
  await evaluate('document.querySelector("[data-running-study=guardmastery]").scrollIntoView({block:"start"});document.activeElement.blur()');
  if(process.env.LUMENFALL_QA_EVIDENCE_DIR){const shot=await send('Page.captureScreenshot',{format:'png'});fs.mkdirSync(process.env.LUMENFALL_QA_EVIDENCE_DIR,{recursive:true});fs.writeFileSync(path.join(process.env.LUMENFALL_QA_EVIDENCE_DIR,'lab-motes-'+width+'-'+motion+'-text'+textScale+'.png'),Buffer.from(shot.data,'base64'));}
  await evaluate('document.querySelector("[data-study-queue=guardmastery]").focus({preventScroll:true})');await key('Space');
  const queued=await evaluate(`(()=>{const b=window.__lumenfallQaBridge;return {state:b.getState(),primary:b.rawSave(),recovery:b.rawRecovery(),empty:!!document.querySelector('[data-lab-slot="0"] [data-study-slot]')};})()`);
  assert(queued.empty&&!queued.state.studyQueue.guardmastery&&queued.state.activeStudies.length===1&&queued.state.motes===0,'native Queue OFF keeps the active level without spending');
  assert(!queued.state.pausedStudies.length&&queued.state.activeStudies[0].id==='guardmastery'&&queued.state.activeStudies[0].remainingSec===ticking.state.activeStudies[0].remainingSec&&JSON.stringify(queued.state.studyBoosts)===JSON.stringify(ticking.state.studyBoosts),'queue toggle keeps exact running paid work and the timed slot boost');
  assert(queued.primary===queued.recovery&&JSON.parse(queued.primary).activeStudies[0].remainingSec===queued.state.activeStudies[0].remainingSec,'running work and boost persist in both save slots');
  records.push({width,motion,textScale,labUi,selected,waiting,bought,queued,controls});await send('Target.disposeBrowserContext',{browserContextId:context.browserContextId},null);

 }
 return {status:'pass',scenario,records};
}
(async()=>{let result;try{result=await run();}catch(error){result={status:'fail',scenario,message:error.message,records};}
 try{assert(pending.size===0,'all CDP operations settled');if(!closed)await send('Browser.close',{},null).catch(()=>{});let timer;const done=await Promise.race([completion,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('browser close timeout')),5000);})]).finally(()=>clearTimeout(timer));assert(closed&&done.code===0&&!done.error,'graceful browser termination');await fs.promises.rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});result.teardown={browser:done,pending:pending.size,profileRemoved:!fs.existsSync(profile)};}catch(error){browser.kill('SIGKILL');result.status='fail';result.teardown={message:error.message,stderr};}
 process.stdout.write(JSON.stringify(result)+'\n');process.exitCode=result.status==='pass'?0:1;
})();
