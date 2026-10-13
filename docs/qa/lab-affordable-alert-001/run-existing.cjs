'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {spawn}=require('node:child_process');
const {serve}=require('../../../scripts/lib/static-server.cjs');
const {findChrome}=require('../../../scripts/lib/browser.cjs');
const root=path.resolve(__dirname,'../../..'),args=process.argv.slice(2),sourcePath=path.resolve(args[0]||'index.html');
const source=fs.readFileSync(sourcePath,'utf8'),sourceSha256=crypto.createHash('sha256').update(source).digest('hex'),mutation=null;
const scenario=args[1],{instrumentHtml,loadFixtures}=require('../../../tests/behavioral/run.cjs');const html=instrumentHtml(source,loadFixtures());
let browser,server,profile,stage,session,seq=0,buffer='',closed=false,checks=0;const pending=new Map(),records=[];
function check(value,message){checks++;assert(value,message);}
function send(method,params={},sid=session){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP deadline '+method));},15000);pending.set(id,{resolve,reject,timer});browser.stdio[3].write(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})})+'\0');});}
async function ev(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function run(){
 stage=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-ui-regressions-'));fs.writeFileSync(path.join(stage,'index.html'),html);for(const dir of ['fonts','branding'])fs.cpSync(path.join(root,dir),path.join(stage,dir),{recursive:true});server=await serve(stage);
 profile=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-ui-regression-browser-'));browser=spawn(findChrome(),['--headless=new','--no-sandbox','--disable-gpu','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
 browser.stderr.on('data',()=>{});browser.on('close',()=>{closed=true;for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('browser closed'));}pending.clear();});browser.on('error',e=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(e);}pending.clear();});
 browser.stdio[4].on('data',b=>{buffer+=b;let end;while((end=buffer.indexOf('\0'))>=0){const raw=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!raw)continue;const m=JSON.parse(raw),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}});for(const n of [3,4])browser.stdio[n].on('error',()=>{});
 const version=await send('Browser.getVersion',{},null);const target=await send('Target.createTarget',{url:'about:blank'},null);session=(await send('Target.attachToTarget',{targetId:target.targetId,flatten:true},null)).sessionId;await send('Page.enable');await send('Emulation.setTouchEmulationEnabled',{enabled:true});await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html?qaScenario='+encodeURIComponent(scenario)+'&qaFixture=fresh'});
 const deadline=Date.now()+25000;let result;
 while(Date.now()<deadline){try{result=await ev('document.getElementById("qa-result")?.textContent');}catch(e){if(!/navigated|context/.test(e.message))throw e;}if(result)break;await pause(25);}
 check(!!result,'unchanged 25-second completion deadline');const payload=JSON.parse(result);check(payload.status==='pass',JSON.stringify(payload));records.push(payload);
 return {status:'PASS',sourceSha256,mutation,checks,profiles:records,version};
}
(async()=>{let result;try{result=await run();}catch(e){result={status:'FAIL',sourceSha256,mutation,checks,profiles:records,error:e.stack};process.exitCode=1;}finally{
 try{if(browser&&!closed){const completion=new Promise(r=>browser.once('close',(code,signal)=>r({code,signal})));await send('Browser.close',{},null).catch(()=>{});let timer;const exit=await Promise.race([completion,new Promise(r=>{timer=setTimeout(()=>r(null),5000);})]).finally(()=>clearTimeout(timer));if(!exit){browser.kill();await completion;throw Error('Browser close deadline');}assert.equal(exit.code,0);}if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}for(const dir of [profile,stage])if(dir)await fs.promises.rm(dir,{recursive:true,force:true,maxRetries:3,retryDelay:100});}catch(e){result.status='FAIL';result.teardown=e.stack;process.exitCode=1;}}
 console.log(JSON.stringify(result));})();
