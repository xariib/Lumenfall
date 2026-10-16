'use strict';
// Synthetic emulator only. Never run against a connected player's installation.
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict');
const packageId='com.lumenfall.app',primary='lumenfall_save_v2',recovery='lumenfall_save_recovery_v1';
const sockets=new Set();
const adb=(...args)=>cp.execFileSync('adb',args,{encoding:'utf8',timeout:120000});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function connect(){
 for(let i=0;i<90;i++){
  try{
   const pid=adb('shell','pidof',packageId).trim();if(!pid)throw Error('App not started');
   adb('forward','tcp:9222','localabstract:webview_devtools_remote_'+pid);
   const pages=await (await fetch('http://127.0.0.1:9222/json')).json(),page=pages.find(p=>p.type==='page'&&/^https:\/\/localhost(?:\/|$)/.test(p.url)&&p.webSocketDebuggerUrl);
   if(!page)throw Error('WebView not ready');
   const endpoint=new URL(page.webSocketDebuggerUrl);assert.equal(endpoint.protocol,'ws:');endpoint.hostname='127.0.0.1';endpoint.port='9222';console.log('Android upgrade QA: WebView endpoint '+endpoint.href);
   const socket=new WebSocket(endpoint.href);sockets.add(socket);socket.addEventListener('close',()=>sockets.delete(socket));await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{socket.close();reject(Error('DevTools handshake deadline'));},30000);socket.addEventListener('open',()=>{clearTimeout(timer);resolve();},{once:true});socket.addEventListener('error',()=>{clearTimeout(timer);socket.close();reject(Error('DevTools handshake failed'));},{once:true});});
   let seq=0;const pending=new Map();
   function rejectPending(message){for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error(message));}pending.clear();}
   socket.addEventListener('close',event=>rejectPending('DevTools closed: '+event.code+' '+event.reason));socket.addEventListener('error',()=>rejectPending('DevTools socket error'));
   socket.addEventListener('message',event=>{const m=JSON.parse(event.data),p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}});
   const send=(method,params)=>new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);socket.close();reject(Error('DevTools command deadline: '+method));},30000);pending.set(id,{resolve,reject,timer});try{socket.send(JSON.stringify({id,method,params}));}catch(e){pending.delete(id);clearTimeout(timer);reject(e);}});
   const client={close:()=>socket.close(),command:send,evaluate:async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});assert(!r.exceptionDetails,JSON.stringify(r.exceptionDetails));return r.result.value;}};
   for(let n=0;n<90;n++){if(await client.evaluate("location.origin==='https://localhost'&&document.readyState==='complete'&&!!document.querySelector('#settings-btn')"))return client;await pause(200);}
   socket.close();throw Error('WebView app document readiness deadline');
  }catch(e){if(i===89)throw e;await pause(1000);}
 }
}
async function main(){
 assert(!fs.existsSync('release-evidence/emulator-upgrade.json'),'Fresh emulator upgrade output required');
 console.log('Android upgrade QA: starting disposable emulator check');
 assert.match(adb('get-serialno').trim(),/^emulator-/,'Only a disposable emulator is accepted');
 const baseline=process.argv[2],candidate=process.argv[3];assert(baseline&&candidate);
 const report={baseline,candidate,package:packageId,commit:process.env.GITHUB_SHA,apkSha256:require('node:crypto').createHash('sha256').update(fs.readFileSync(candidate)).digest('hex'),device:adb('shell','getprop','ro.build.fingerprint').trim(),webview:adb('shell','dumpsys','webviewupdate').slice(0,2000)};
 assert.match(adb('install',baseline),/Success/);adb('shell','am','start','-n',packageId+'/.MainActivity');
 console.log('Android upgrade QA: old APK installed; connecting to WebView');let page=await connect(),saved;
 for(let i=0;i<90;i++){saved=await page.evaluate(`localStorage.getItem(${JSON.stringify(primary)})`);if(saved)break;await pause(1000);}assert(saved,'Old APK must create a real save');
 console.log('Android upgrade QA: real old save obtained; preparing pre-document fixture');
 const seed=JSON.parse(saved);Object.assign(seed,{lumen:1234567,shards:4321,prisms:777,comets:222,motes:88,sigils:345,ascendCount:12,maxDepthEver:1000,lastSeen:Date.now(),autoAscendEnabled:false,autoEmpower:false});
 seed.spirits.ember=33;seed.spirits.stone=22;seed.heroRarity.ember=5;seed.wispModules.ember=10;seed.wispUltimate.ember=true;seed.nodes.swift=3;seed.research.arcanecal=4;
 seed.owned.autoascend=true;seed.owned.meteor=true;seed.owned.starcall=true;
 for(const obj of ['empowerQueue','researchQueue','studyQueue'])for(const k of Object.keys(seed[obj]||{}))seed[obj][k]=false;
 const study=Object.keys(seed.longStudyLevels)[0];seed.longStudyLevels[study]=3;seed.activeStudies=[{id:study,remainingSec:3500,totalDurationSec:3600,speedMult:2}];
 seed.studyUseMotes[study]=false;seed.studySpeedTargets[study]=2;
 const sentinel='repository-migration-001-synthetic';
 report.beforeOrigin=await page.evaluate('location.origin');assert.equal(report.beforeOrigin,'https://localhost');
 const seedScript=`(()=>{const s=${JSON.stringify(JSON.stringify(seed))};localStorage.setItem(${JSON.stringify(primary)},s);localStorage.setItem(${JSON.stringify(recovery)},s);localStorage.setItem('migration-upgrade-probe',${JSON.stringify(sentinel)});})()`;
 // Load the synthetic legacy save before the old game initializes. Writing only
 // storage while its previous in-memory state runs would let autosave overwrite
 // the fixture. The injection is removed before the cold baseline and upgrade.
 const injected=await page.command('Page.addScriptToEvaluateOnNewDocument',{source:seedScript});
 assert(injected.identifier,'Pre-document fixture registered');
 console.log('Android upgrade QA: fixture registered; reloading old WebView');
 try{await page.command('Page.reload',{ignoreCache:true});}catch(e){if(!/^DevTools closed:/.test(e.message))throw e;console.log('Android upgrade QA: reload replaced DevTools target; cold restart will verify fixture');}
 // WebView commits DOM storage asynchronously. Establish a durable old-app
 // fixture through an actual cold restart before testing package replacement.
 // Force-stop destroys this process and its transient CDP pre-document scripts.
 // Do not issue another command to a target the native reload may have replaced.
 await pause(8000);
 console.log('Android upgrade QA: stopping seeded old process; restarting without injection');
 page.close();adb('shell','am','force-stop',packageId);
 adb('shell','am','start','-n',packageId+'/.MainActivity');page=await connect();await pause(3000);
 const oldCold=await page.evaluate(`({origin:location.origin,sentinel:localStorage.getItem('migration-upgrade-probe'),save:JSON.parse(localStorage.getItem(${JSON.stringify(primary)})),recovery:JSON.parse(localStorage.getItem(${JSON.stringify(recovery)}))})`);
 assert.equal(oldCold.origin,report.beforeOrigin);assert.equal(oldCold.sentinel,sentinel,'Old APK fixture must survive its own cold restart before upgrade');assert(oldCold.save&&oldCold.recovery,'Old APK retains both baseline slots');assert.equal(oldCold.save.spirits.ember,33,'Old APK accepted the synthetic progression');assert.equal(oldCold.save.heroRarity.ember,5,'Old APK accepted the synthetic paid rarity');
 report.baselineColdRestartVerified=true;
 await pause(6000);page.close();adb('shell','am','force-stop',packageId);
 console.log('Android upgrade QA: synthetic old save verified after actual old-APK cold restart');
 const beforePackage=adb('shell','dumpsys','package',packageId),beforeUid=beforePackage.match(/userId=(\d+)/)[1];report.baselineVersionCode=Number(beforePackage.match(/versionCode=(\d+)/)[1]);
 assert.match(adb('install','-r',candidate),/Success/,'Actual in-place package replacement');
 const afterPackage=adb('shell','dumpsys','package',packageId),afterUid=afterPackage.match(/userId=(\d+)/)[1];assert.equal(afterUid,beforeUid,'Android UID retained');report.candidateVersionCode=Number(afterPackage.match(/versionCode=(\d+)/)[1]);assert(report.candidateVersionCode>report.baselineVersionCode,'Actual installed Android version increases');report.beforeUid=beforeUid;report.afterUid=afterUid;
 adb('shell','am','start','-n',packageId+'/.MainActivity');page=await connect();
 for(let i=0;i<90;i++){const ready=await page.evaluate("!!document.querySelector('#settings-btn')");if(ready)break;await pause(1000);}
 await pause(3000);
 const observed=await page.evaluate(`({origin:location.origin,sentinel:localStorage.getItem('migration-upgrade-probe'),save:JSON.parse(localStorage.getItem(${JSON.stringify(primary)})),recovery:JSON.parse(localStorage.getItem(${JSON.stringify(recovery)}))})`);page.close();
 assert.equal(observed.origin,report.beforeOrigin);assert.equal(observed.sentinel,sentinel);assert(observed.save&&observed.recovery,'Both save slots retained');
 const s=observed.save;for(const field of ['lumen','shards','prisms','comets','motes','sigils'])assert(s[field]>=seed[field],field+' retained');
 for(const [field,id] of [['spirits','ember'],['spirits','stone'],['heroRarity','ember'],['wispModules','ember'],['wispUltimate','ember'],['nodes','swift'],['research','arcanecal'],['longStudyLevels',study]])assert.equal(s[field][id],seed[field][id],field+'.'+id+' retained');
 const running=s.activeStudies.find(x=>x.id===study);assert(running,'Paid Study retained');assert.equal(running.speedMult,2);assert.equal(running.totalDurationSec,3600);assert(running.remainingSec>0&&running.remainingSec<=3500);
 assert(s.recruitmentEntitlements.ember&&s.recruitmentEntitlements.stone,'Legacy recruits retain entitlement');
 for(const id of ['autoascend','meteor','starcall'])assert.equal(s.owned[id],true,'Paid unlock retained: '+id);
 assert.equal(s.autoAscendEnabled,false,'Saved Auto-Ascend choice retained');assert.equal(s.autoAscendTargetDepth,seed.autoAscendTargetDepth,'Saved target retained');
 for(const group of ['empowerQueue','researchQueue','studyQueue'])for(const id of Object.keys(seed[group]||{}))assert.equal(s[group][id],false,'Saved queue choice retained: '+group+'/'+id);
 report.status='PASS';report.uidRetained=true;report.origin=observed.origin;report.bothSaveSlotsRetained=true;report.progressAndPaidStudyRetained=true;report.physicalDevice=false;
 fs.mkdirSync('release-evidence',{recursive:true});fs.writeFileSync('release-evidence/emulator-upgrade.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}
const watchdog=setTimeout(()=>{console.error('Android upgrade QA overall deadline');process.exit(1);},600000);
main().catch(e=>{console.error(e.stack);try{fs.mkdirSync('release-evidence',{recursive:true});fs.writeFileSync('release-evidence/upgrade-failure-logcat.txt',adb('logcat','-d','-t','1500'));}catch(diagnostic){console.error('Native diagnostic failed: '+diagnostic.message);}process.exitCode=1;}).finally(()=>{clearTimeout(watchdog);for(const socket of sockets)socket.close();});
