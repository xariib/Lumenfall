'use strict';
// Diagnosis only: compare the existing arena assertion on pinned main and PR
// source at identical animation frames. This does not replace any CI gate.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {serve}=require('../../scripts/lib/static-server.cjs');
const {findChrome}=require('../../scripts/lib/browser.cjs');
const {instrumentHtml,loadFixtures}=require('./run.cjs');
const baseline='8dabca95c379af3e87ff1a03c0f8c615ebf36735',candidate='42390366c03c98a3e7fe7803d3dc748975662f70';
const root=path.resolve(__dirname,'../..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-cast-diagnostic-'));
const out=path.resolve(process.argv[2]||'cast-baseline-diagnostic');fs.mkdirSync(out,{recursive:true});
let browser,server,session,seq=0,buffer='',stderr='',closed=false;const pending=new Map();
function rejectAll(error){for(const p of pending.values()){clearTimeout(p.timer);p.reject(error);}pending.clear();}
function send(method,params={},sid=session){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout '+method));},20000);pending.set(id,{resolve,reject,timer});browser.stdio[3].write(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})})+'\0');});}
async function evaluate(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
async function main(){
 const report={purpose:'Diagnosis, not product acceptance',baseline,candidate,variants:[]};
 for(const [name,ref] of [['baseline',baseline],['candidate',candidate]]){
  const source=cp.execFileSync('git',['show',ref+':index.html'],{cwd:root,encoding:'utf8',maxBuffer:5e6});
  const stage=path.join(temp,name);fs.mkdirSync(stage);fs.writeFileSync(path.join(stage,'index.html'),instrumentHtml(source,loadFixtures()));
  for(const asset of ['fonts','branding'])fs.cpSync(path.join(root,asset),path.join(stage,asset),{recursive:true});
  report.variants.push({name,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),profiles:[]});
 }
 server=await serve(temp);browser=cp.spawn(findChrome(),['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-debugging-pipe','--user-data-dir='+path.join(temp,'profile'),'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
 const completion=new Promise(resolve=>{browser.once('error',e=>{closed=true;rejectAll(e);resolve({error:e.message});});browser.once('close',(code,signal)=>{closed=true;rejectAll(Error('Browser closed'));resolve({code,signal});});});
 browser.stderr.on('data',b=>{stderr=(stderr+b).slice(-2000);});
 for(const stream of [browser.stdio[3],browser.stdio[4]])stream.on('error',rejectAll);
 browser.stdio[4].on('data',b=>{buffer+=b;let end;while((end=buffer.indexOf('\0'))>=0){const raw=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!raw)continue;const m=JSON.parse(raw),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}});
 try{
  for(const variant of report.variants)for(const [width,height,inset] of [[360,640,0],[360,640,24],[390,844,24]]){
   const context=await send('Target.createBrowserContext',{},null),tab=await send('Target.createTarget',{url:'about:blank',browserContextId:context.browserContextId},null);
   session=(await send('Target.attachToTarget',{targetId:tab.targetId,flatten:true},null)).sessionId;
   await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});await send('Page.enable');await send('Runtime.enable');
   await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/'+variant.name+'/index.html?qaScenario=rift-status-stacking-mobile&qaFixture=fresh'});
   let ready=false;for(let i=0;i<200&&!ready;i++){ready=await evaluate('!!window.__forgeUiReady');if(!ready)await new Promise(r=>setTimeout(r,20));}assert(ready,'existing Rift fixture ready');
   await evaluate('document.fonts.ready');await evaluate('__qaForgeStartup.promise');await evaluate('__lumenfallQaBridge.uiMeasurementPause(true);__lumenfallQaBridge.resetFeedback()');
   const profile={width,height,inset,samples:[]};variant.profiles.push(profile);
   for(const kind of ['dense','boss']){
    await evaluate('riftStatusMobile.setup('+inset+','+JSON.stringify(kind)+')');
    const sample=await evaluate(`(()=>{
     const b=__lumenfallQaBridge,stage=document.querySelector('#enemy-stage'),glyph=document.querySelector('#enemy-glyph');
     b.resetFeedback();const before=JSON.stringify(b.getState());
     const saves=JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]));
     document.getAnimations().forEach(a=>{a.pause();a.currentTime=0;});
     const glyphAnimations=document.getAnimations().filter(a=>a.effect&&a.effect.target===glyph);
     const records=[];let worst=null;
     for(const glyphMs of [0,250,500,750,1000,1500,2000,2500]){
      glyphAnimations.forEach(a=>a.currentTime=glyphMs);b.resetFeedback();b.riftStatus.emit('void');
      const fx=stage.querySelector('.cast-void');if(!fx)throw Error('real Void effect missing');
      const animations=document.getAnimations().filter(a=>a.effect&&a.effect.target===fx);if(!animations.length)throw Error('real Void animation missing');
      animations.forEach(a=>a.pause());
      for(let castMs=0;castMs<=850;castMs+=10){
       animations.forEach(a=>a.currentTime=castMs);
       const frame={glyphMs,castMs,scroll:[stage.scrollWidth,stage.scrollHeight],client:[stage.clientWidth,stage.clientHeight]};
       if(!worst||frame.scroll[1]-frame.client[1]>worst.scroll[1]-worst.client[1])worst=frame;
       if(frame.scroll[0]>frame.client[0]||frame.scroll[1]>frame.client[1]+1)records.push(frame);
      }
     }
     b.resetFeedback();glyphAnimations.forEach(a=>a.currentTime=worst.glyphMs);b.riftStatus.emit('void');
     const fx=stage.querySelector('.cast-void');document.getAnimations().filter(a=>a.effect&&a.effect.target===fx).forEach(a=>{a.pause();a.currentTime=worst.castMs;});
     let originalAssertion=null;try{riftStatusMobile.measure();}catch(e){originalAssertion=e.message;}
     const afterSaves=JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]));
     return {worst,overflowFrames:records,originalAssertion,stateUnchanged:before===JSON.stringify(b.getState()),savesUnchanged:saves===afterSaves};
    })()`);
    assert(sample.stateUnchanged&&sample.savesUnchanged,'diagnostic preserves game state and all saved bytes');profile.samples.push({kind,...sample});
    if(sample.overflowFrames.length){const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,variant.name+'-'+width+'-safe'+inset+'-'+kind+'.png'),Buffer.from(shot.data,'base64'));}
   }
   await send('Target.disposeBrowserContext',{browserContextId:context.browserContextId},null);
  }
  assert.notEqual(report.variants[0].sourceSha256,report.variants[1].sourceSha256);
  assert.deepEqual(report.variants[0].profiles,report.variants[1].profiles,'baseline and candidate have identical deterministic arena/animation outcomes');
  assert(report.variants[0].profiles.some(p=>p.samples.some(s=>s.overflowFrames.length&&s.originalAssertion?.startsWith('#enemy-stage text/content unclipped'))),'original baseline arena assertion reproduced');
  report.result='PRE_EXISTING_FAILURE_REPRODUCED_IDENTICALLY';
 }catch(e){report.result='DIAGNOSIS_INCOMPLETE';report.error=e.stack;process.exitCode=1;}
 finally{
  if(!closed)await send('Browser.close',{},null).catch(()=>{});
  const result=await Promise.race([completion,new Promise(r=>setTimeout(()=>r({timeout:true}),5000))]);report.teardown=result;
  if(result.code!==0){process.exitCode=1;if(!closed)browser.kill('SIGKILL');}
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({result:report.result,error:report.error,profiles:report.variants.map(v=>({name:v.name,sourceSha256:v.sourceSha256,overflows:v.profiles.flatMap(p=>p.samples.map(s=>({width:p.width,inset:p.inset,kind:s.kind,frames:s.overflowFrames.length,worst:s.worst})))}))}));
 }
}
main().catch(e=>{console.error(e.stack,stderr);process.exitCode=1;}).finally(async()=>{if(browser&&!closed)browser.kill('SIGKILL');if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}fs.rmSync(temp,{recursive:true,force:true});});
