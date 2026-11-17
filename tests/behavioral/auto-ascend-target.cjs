/* Native input regression driver using Chrome's pipe protocol and Node built-ins.
 * No browser library/test dependency; run.cjs registers this in the default suite.
 */
const {spawn}=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const [chrome,url,scenario]=process.argv.slice(2),profile=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-auto-target-'));
const browser=spawn(process.env.LUMENFALL_QA_CDP_CHROME||chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
let seq=0,buffer='',stderr='',session,records=[];const pending=new Map(),listeners=[],shutdownEvents=[];
let browserClosed=false;
function rejectPending(message){for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error(message+' '+p.method));}pending.clear();}
const browserCompletion=new Promise(resolve=>{
 browser.once('error',error=>{rejectPending(error.message);resolve({error:error.message});});
 browser.once('close',(code,signal)=>{browserClosed=true;shutdownEvents.push({event:'browser-close',code,signal,pending:pending.size});rejectPending('browser closed');resolve({code,signal});});
});
for(const stream of [browser.stdio[3],browser.stdio[4]])stream.on('error',error=>rejectPending('CDP pipe '+error.message));
async function boundedCompletion(ms){let timer;try{return await Promise.race([browserCompletion,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('browser close timeout '+ms+'ms')),ms);})]);}finally{clearTimeout(timer);}}
async function teardown(){
 const diagnostic={pendingBeforeClose:pending.size,events:shutdownEvents};
 assert(pending.size===0,'all prior protocol requests settled before browser close');
 // Browser.close may close the pipe before replying; the process close event is
 // authoritative. Await it before deleting a profile Chrome may still write.
 if(!browserClosed){await send('Browser.close',{},null).catch(error=>{diagnostic.closeRequest=error.message;});}
 try{diagnostic.browser=await boundedCompletion(5000);}catch(error){
  diagnostic.forced=error.message;browser.kill('SIGTERM');
  try{diagnostic.browser=await boundedCompletion(2000);}catch(_){browser.kill('SIGKILL');diagnostic.browser=await boundedCompletion(2000);}
 }
 diagnostic.pendingAfterClose=pending.size;
 assert(browserClosed,'browser exited before profile removal');
 await fs.promises.rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});
 diagnostic.profileRemoved=!fs.existsSync(profile);shutdownEvents.push({event:'profile-removed',browserClosed});
 assert(!diagnostic.forced&&!diagnostic.browser.error&&diagnostic.browser.code===0,'graceful browser termination: '+JSON.stringify(diagnostic));
 return diagnostic;
}
browser.stderr.on('data',b=>{stderr=(stderr+b).slice(-4000);});
browser.stdio[4].on('data',b=>{buffer+=b;let end;while((end=buffer.indexOf('\0'))!==-1){const raw=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!raw)continue;const m=JSON.parse(raw);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}else listeners.slice().forEach(f=>f(m));}});
function send(method,params={},sid=session){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout '+method+' '+stderr));},15000);pending.set(id,{resolve,reject,timer,method});browser.stdio[3].write(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})})+'\0');});}
async function evaluate(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
function assert(v,m){if(!v)throw Error(m);}
// Pause only simulation during the immediate before/input/after measurement.
// CSS/frames keep running. Then allow ordinary production intervals, measure
// again without any intervening focus/scroll correction, and pause for capture.
async function advance(ms=350){await evaluate('window.__lumenfallQaBridge.uiMeasurementPause(false)');await new Promise(r=>setTimeout(r,ms));await evaluate('window.__lumenfallQaBridge.uiMeasurementPause(true)');}

async function key(key){const spec=key==='Space'?{key:' ',code:'Space',windowsVirtualKeyCode:32}:{key,code:key,windowsVirtualKeyCode:{ArrowDown:40,ArrowUp:38,Home:36,End:35,Tab:9,Enter:13,Escape:27}[key]};await send('Input.dispatchKeyEvent',{type:'rawKeyDown',...spec});await send('Input.dispatchKeyEvent',{type:'keyUp',...spec});}
async function snapshot(){return evaluate(`(()=>{const b=window.__lumenfallQaBridge,s=document.querySelector('[data-autoascend-target]'),r=s.getBoundingClientRect();return {observation:autoTargetObservation(b),value:s.value,count:(s.options||s.parentNode.querySelector('datalist').options).length,identity:s===window.nativeTargetSelect,focused:document.activeElement===s,scroll:document.querySelector('main').scrollTop,rect:{x:r.x,y:r.y,width:r.width,height:r.height},fit:(s.tagName==='INPUT'||s.scrollWidth<=s.clientWidth)&&r.left>=0&&r.right<=innerWidth&&document.documentElement.scrollWidth<=innerWidth,textScroll:s.scrollLeft,runtimeErrors:window.__lumenfallQaContext.errors};})()`);}
async function run(){
 const motion=scenario.includes('reduced')?'reduce':'no-preference';
 for(const [width,textScale] of [[320,1],[360,1],[390,1],[430,1],[320,1.6],[390,1.6],[430,1.6],[320,2],[390,2],[430,2]]){
  const ctx=await send('Target.createBrowserContext',{},null),target=await send('Target.createTarget',{url:'about:blank',browserContextId:ctx.browserContextId},null);
  session=(await send('Target.attachToTarget',{targetId:target.targetId,flatten:true},null)).sessionId;
  await send('Emulation.setDeviceMetricsOverride',{width,height:width===360?640:844,deviceScaleFactor:1,mobile:true});
  await send('Emulation.setTouchEmulationEnabled',{enabled:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});
  await send('Page.enable');await send('Page.navigate',{url});
  for(let i=0;i<150&&!await evaluate('!!window.__autoAscendTargetReady');i++)await new Promise(r=>setTimeout(r,20));
  assert(await evaluate('!!window.__autoAscendTargetReady'),'target page ready');await evaluate('document.fonts.ready.then(()=>true)');await evaluate('window.__qaForgeStartup.promise');
  await send('Runtime.enable');await send('DOM.enable');
  await evaluate('(()=>{const b=window.__lumenfallQaBridge;b.uiMeasurementPause(true);b.resetFeedback();b.autoTarget.nativeInput(true);const s=autoTargetSeed(b,43,true);s.depth=s.enemyDepth=45;s.ascendRewardedDepth=43;s.maxDepthEver=220;s.autoAscendTargetDepth=16;s.comets=37;s.enemyHp=s.enemyMaxHp=b.enemyHpFor(45);s.activeStudies=[{id:"guardmastery",remainingSec:123,totalDurationSec:150,speedMult:2}];b.setState(s);b.save();b.renderLayout();document.documentElement.style.fontSize="'+16*textScale+'px";document.querySelector("[data-tab=ascend]").click();document.getElementById("ascend-btn").scrollIntoView({block:"center"});})()');
  await evaluate('Promise.all(document.getAnimations().filter(a=>Number.isFinite(a.effect.getTiming().iterations)).map(a=>a.finished.catch(()=>{})))');
  assert(await evaluate('!document.querySelector("[data-autoascend-target],[data-autoascend-toggle],[data-autoascend-open],[data-shop=autoascend]")'),'retired controls absent');
  const geometry=await evaluate('(()=>{var e=document.getElementById("ascend-btn"),r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom,fit:document.documentElement.scrollWidth<=innerWidth};})()');
  assert(geometry.fit&&geometry.width>=44&&geometry.height>=44&&geometry.x>=0&&geometry.right<=width,'manual control fits and has44px touch target');
  const before=await evaluate('autoTargetObservation(window.__lumenfallQaBridge)'),gain=await evaluate('window.__lumenfallQaBridge.ascendBreakdown().gain');
  assert(before.state.comets===137&&before.state.autoAscendRefund.paid,'owner compensated exactly once');
  await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:geometry.x+geometry.width/2,y:geometry.y+geometry.height/2}]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  const touched=await evaluate('autoTargetObservation(window.__lumenfallQaBridge)');
  assert(touched.state.ascendCount===before.state.ascendCount+1&&touched.state.prisms===before.state.prisms+gain&&touched.state.ascendRewardedDepth===44,'trusted touch commits one exact manual record');
  assert(touched.primary===touched.recovery,'manual transaction commits both slots');
  assert(touched.state.autoAscendTargetDepth===16&&!touched.state.autoAscendEnabled,'manual choice preserves legacy target and retired flag');
  assert(JSON.stringify(touched.state.activeStudies)===JSON.stringify(before.state.activeStudies),'touch reset retains paid work');
  await evaluate('(()=>{var b=window.__lumenfallQaBridge,s=b.getState();s.depth=s.enemyDepth=45;s.enemyHp=s.enemyMaxHp=b.enemyHpFor(45);b.setState(s);b.renderLayout();})()');
  const denied=await evaluate('autoTargetObservation(window.__lumenfallQaBridge)');
  assert(await evaluate('document.getElementById("ascend-btn").disabled'),'same rewarded clear is disabled');
  await evaluate('document.getElementById("ascend-btn").focus({preventScroll:true})');await key('Enter');
  assert(JSON.stringify(await evaluate('autoTargetObservation(window.__lumenfallQaBridge)'))===JSON.stringify(denied),'native input cannot bypass disabled record gate');
  await evaluate('(()=>{var b=window.__lumenfallQaBridge,s=b.getState();s.depth=s.enemyDepth=46;s.enemyHp=s.enemyMaxHp=b.enemyHpFor(46);b.setState(s);b.renderLayout();document.getElementById("ascend-btn").scrollIntoView({block:"center"});document.getElementById("ascend-btn").focus({preventScroll:true});})()');
  const next=await evaluate('autoTargetObservation(window.__lumenfallQaBridge)'),nextGain=await evaluate('window.__lumenfallQaBridge.ascendBreakdown().gain');await key('Space');
  const chosen=await evaluate('autoTargetObservation(window.__lumenfallQaBridge)');assert(chosen.state.ascendCount===next.state.ascendCount+1&&chosen.state.prisms===next.state.prisms+nextGain&&chosen.state.ascendRewardedDepth===45,'trusted keyboard commits next manual record');
  await evaluate('window.__lumenfallQaBridge.renderLayout();window.__lumenfallQaBridge.refreshAffordability()');
  assert(JSON.stringify(await evaluate('autoTargetObservation(window.__lumenfallQaBridge)'))===JSON.stringify(chosen),'render/affordability preserve every save field and slot');
  assert((await evaluate('window.__lumenfallQaContext.errors')).length===0,'no browser runtime errors');
  records.push({width,textScale,motion,geometry,touched,chosen,policy:'manual higher-record touch and keyboard; retired controls absent'});
  await send('Target.disposeBrowserContext',{browserContextId:ctx.browserContextId},null);
 }
 return {status:'pass',scenario,records};
}
(async()=>{let result;try{result=await run();}catch(error){result={status:'fail',scenario,message:error.message,records};}
try{result.teardown=await teardown();}catch(error){result.status='fail';result.teardown={message:error.message,events:shutdownEvents,pending:pending.size,stderr};process.stderr.write(error.stack+'\n');}
console.log(JSON.stringify(result));if(result.status!=='pass')process.exitCode=1;
})().catch(error=>{process.stderr.write(error.stack+'\n');process.exitCode=1;});
