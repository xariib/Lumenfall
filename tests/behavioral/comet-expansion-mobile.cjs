#!/usr/bin/env node
'use strict';
// Complete-product Chromium, trusted input and real persistence. This is not
// installed Android/WebView, OS text scaling, TalkBack or native acceptance.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const sourcePath=path.resolve(process.argv[2]||'index.html');
const evidence=path.resolve(process.argv[3]||'comet-mobile-evidence');
const transportPath=path.join(__dirname,'prism-acceptance.cjs');
const helperPath=path.join(__dirname,'comet-expansion-mobile-helper.cjs');
const numericalPath=path.join(__dirname,'comet-expansion-numerical.cjs');
const helper=require(helperPath),digest=value=>crypto.createHash('sha256').update(value).digest('hex');
let driver=fs.readFileSync(transportPath,'utf8');
const identity={testSha256:digest(fs.readFileSync(__filename)),helperSha256:digest(fs.readFileSync(helperPath)),transportSha256:digest(driver),numericalSha256:digest(fs.readFileSync(numericalPath))};
function one(from,to){assert.equal(driver.split(from).length,2,'one Comet transport extension: '+from.slice(0,80));driver=driver.replace(from,()=>to);}
// Native frames remain active. Only the transport's ambient interval scheduler
// is paused; actual production simulation and every action owner remain intact.
one('window.requestAnimationFrame=function(){return 0;};','');
one("'--headless=new','--enable-automation'","'--headless=new','--enable-automation','--window-size=430,1000'");
one("await send('Runtime.enable');await send('DOM.enable');","await send('Runtime.enable');await send('DOM.enable');await send('Page.bringToFront');");
one("const {reward}=require('./prism-earning-reference.cjs');", "const {reward}=require('./prism-earning-reference.cjs');const {oracle}=require('./comet-expansion-numerical.cjs');const COMET_SPECS="+JSON.stringify(helper.specs)+";");
one('let checks=0;', 'let checks=0;const cometDiagnostics={readiness:[],migration:[],purchases:[],commands:[],refresh:[],preservation:[],negatives:[],images:[]};let cometActiveProfile=null;let cometBrowserVersion=null;');
one('m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);', 'if(m.error){const error=Error(JSON.stringify(m.error));error.cdpMethod=p.method;error.cdpError=m.error;p.reject(error);}else p.resolve(m.result);');
const readyAnchor="async function ready(){const deadline=Date.now()+10000;while(Date.now()<deadline){if(await ev('!!window.prismQa&&prismQa.initialized()')){await ev('prismQa.ready()');return;}await pause(30);}throw Error('Game initialization deadline');}";
one(readyAnchor,helper.ready.toString());
one('window.__prismInput=[];',helper.prelude);
const hook='breakdown:ascendPrismBreakdown,keys:function(){return [SAVE_KEY,RECOVERY_SAVE_KEY];}';
one(hook,hook+',\n'+helper.bridge);
one("  const context=await send('Target.createBrowserContext'", "  cometActiveProfile={width,scale,motion};\n  const context=await send('Target.createBrowserContext'");
one("await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});await ready();", "await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});await ready('initial-navigation');");
one('await pause(500);await ready();',"await pause(500);await ready('intro-completion');");
one(" for(const width of [320,390,430])", " cometBrowserVersion=await send('Browser.getVersion',{},null);\n for(const width of [320,390,430])");
const start=driver.indexOf('  const samples=[];'),end=driver.indexOf("  await send('Target.disposeBrowserContext'",start);
assert(start>0&&end>start,'one original profile body');
driver=driver.slice(0,start)+'  await ('+helper.profile.toString()+')();\n'+driver.slice(end);
one("const result={status:'fail',sourceSha256:", "const result={status:'fail',scope:'actual Chromium browser emulation; native Android untested',cometIdentity:"+JSON.stringify(identity)+",diagnostics:cometDiagnostics,sourceSha256:");
one("await shot('failure');result.input=await ev('window.__prismInput');", "await shot('failure');result.input=await ev('window.__prismInput');result.failure={state:await ev('window.prismQa?prismQa.get():null'),slots:await ev(\"['lumenfall_save_v2','lumenfall_save_recovery_v1'].map(function(key){return {key:key,raw:localStorage.getItem(key)};})\"),bootstrap:await ev('window.__cometBootstrap||null'),beforeReady:await ev('window.__cometBeforeReady||[]'),runtimeErrors:await ev('window.__prismErrors')};fs.writeFileSync(path.join(evidence,'failure-dom.html'),await ev('document.documentElement.outerHTML'));result.failure.dom='failure-dom.html';");
one("try{await run();result.status='pass';}","try{await run();ok(records.length===12,'all twelve actual browser profiles complete');ok(cometDiagnostics.negatives.length===10&&cometDiagnostics.negatives.every(function(x){return x.status==='pass';}),'five causal pairs at both text scales');result.status='pass';}");
one('result.checks=checks;result.stderr=stderr;', 'result.checks=checks;result.browserVersion=cometBrowserVersion;result.instrumentedHtmlSha256=crypto.createHash("sha256").update(html).digest("hex");result.stderr=stderr;');
fs.mkdirSync(evidence,{recursive:true});
const generated=path.join(__dirname,'.comet-mobile-'+process.pid+'.cjs');
const prepared={...identity,sourcePath,sourceSha256:digest(fs.readFileSync(sourcePath)),generatedDriverSha256:digest(driver),command:[process.execPath,generated,sourcePath,evidence],node:process.version,versions:process.versions,nativeAndroid:'untested'};
fs.writeFileSync(path.join(evidence,'driver-identity.json'),JSON.stringify(prepared,null,2)+'\n');
fs.writeFileSync(path.join(evidence,'instrumented-driver.cjs'),driver);
let child;
try{
 fs.writeFileSync(generated,driver);
 child=spawnSync(process.execPath,[generated,sourcePath,evidence],{cwd:path.resolve(__dirname,'../..'),encoding:'utf8',timeout:1200000,maxBuffer:128*1024*1024});
 fs.writeFileSync(path.join(evidence,'command.stdout.txt'),child.stdout||'');
 fs.writeFileSync(path.join(evidence,'command.stderr.txt'),child.stderr||'');
 fs.writeFileSync(path.join(evidence,'process.json'),JSON.stringify({command:prepared.command,status:child.status,signal:child.signal,error:child.error?{name:child.error.name,message:child.error.message,code:child.error.code}:null},null,2)+'\n');
 // The complete original child JSON is retained byte-for-byte above. Keep the
 // workflow log concise; its summary is not a replacement for the raw receipt.
 try{const result=JSON.parse(child.stdout);console.log(JSON.stringify({status:result.status,sourceSha256:result.sourceSha256,cometIdentity:result.cometIdentity,checks:result.checks,profiles:result.profiles.length,negativeControls:result.diagnostics.negatives.map(x=>({kind:x.kind,profile:x.profile,status:x.status})),browserVersion:result.browserVersion,instrumentedHtmlSha256:result.instrumentedHtmlSha256,error:result.error||null,receipt:path.join(evidence,'receipt.json'),rawStdoutSha256:digest(child.stdout),rawStdoutBytes:Buffer.byteLength(child.stdout),nativeAndroid:'untested'}));}catch(_){process.stdout.write(child.stdout||'');}
 process.stderr.write(child.stderr||'');
 if(child.error)process.stderr.write(child.error.stack+'\n');
 process.exitCode=child.status===0&&!child.error?0:1;
}finally{fs.rmSync(generated,{force:true});}
