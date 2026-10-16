'use strict';
// Synthetic emulator only. Never run against a connected player's installation.
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict');
const packageId='com.lumenfall.app',primary='lumenfall_save_v2',recovery='lumenfall_save_recovery_v1';
const adb=(...args)=>cp.execFileSync('adb',args,{encoding:'utf8',timeout:120000});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function connect(){
 for(let i=0;i<90;i++){
  try{
   const pid=adb('shell','pidof',packageId).trim();if(!pid)throw Error('App not started');
   adb('forward','tcp:9222','localabstract:webview_devtools_remote_'+pid);
   const pages=await (await fetch('http://127.0.0.1:9222/json')).json(),page=pages.find(p=>p.type==='page'&&p.webSocketDebuggerUrl);
   if(!page)throw Error('WebView not ready');
   const socket=new WebSocket(page.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
   let seq=0;const pending=new Map();socket.addEventListener('message',event=>{const m=JSON.parse(event.data),p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}});
   const send=(method,params)=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});
   return {close:()=>socket.close(),evaluate:async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});assert(!r.exceptionDetails,JSON.stringify(r.exceptionDetails));return r.result.value;}};
  }catch(e){if(i===89)throw e;await pause(1000);}
 }
}
async function main(){
 assert.match(adb('get-serialno').trim(),/^emulator-/,'Only a disposable emulator is accepted');
 const baseline=process.argv[2],candidate=process.argv[3];assert(baseline&&candidate);
 const report={baseline,candidate,device:adb('shell','getprop','ro.build.fingerprint').trim(),webview:adb('shell','dumpsys','webviewupdate').slice(0,2000)};
 assert.match(adb('install',baseline),/Success/);adb('shell','am','start','-n',packageId+'/.MainActivity');
 let page=await connect(),saved;
 for(let i=0;i<90;i++){saved=await page.evaluate(`localStorage.getItem(${JSON.stringify(primary)})`);if(saved)break;await pause(1000);}assert(saved,'Old APK must create a real save');
 const seed=JSON.parse(saved);Object.assign(seed,{lumen:1234567,shards:4321,prisms:777,comets:222,motes:88,sigils:345,ascendCount:12,maxDepthEver:1000,lastSeen:Date.now(),autoAscendEnabled:false,autoEmpower:false});
 seed.spirits.ember=33;seed.spirits.stone=22;seed.heroRarity.ember=5;seed.wispModules.ember=10;seed.wispUltimate.ember=true;seed.nodes.swift=3;seed.research.arcanecal=4;
 for(const obj of ['empowerQueue','researchQueue','studyQueue'])for(const k of Object.keys(seed[obj]||{}))seed[obj][k]=false;
 const study=Object.keys(seed.longStudyLevels)[0];seed.longStudyLevels[study]=3;seed.activeStudies=[{id:study,remainingSec:3500,totalDurationSec:3600,speedMult:2}];
 seed.studyUseMotes[study]=false;seed.studySpeedTargets[study]=2;
 const sentinel='repository-migration-001-synthetic';
 report.beforeOrigin=await page.evaluate('location.origin');assert.equal(report.beforeOrigin,'https://localhost');
 await page.evaluate(`(()=>{const s=${JSON.stringify(JSON.stringify(seed))};localStorage.setItem(${JSON.stringify(primary)},s);localStorage.setItem(${JSON.stringify(recovery)},s);localStorage.setItem('migration-upgrade-probe',${JSON.stringify(sentinel)});return true;})()`);
 page.close();adb('shell','am','force-stop',packageId);
 const beforeUid=adb('shell','dumpsys','package',packageId).match(/userId=(\d+)/)[1];
 assert.match(adb('install','-r',candidate),/Success/,'Actual in-place package replacement');
 const afterUid=adb('shell','dumpsys','package',packageId).match(/userId=(\d+)/)[1];assert.equal(afterUid,beforeUid,'Android UID retained');
 adb('shell','am','start','-n',packageId+'/.MainActivity');page=await connect();
 for(let i=0;i<90;i++){const ready=await page.evaluate("!!document.querySelector('#settings-btn')");if(ready)break;await pause(1000);}
 await pause(3000);
 const observed=await page.evaluate(`({origin:location.origin,sentinel:localStorage.getItem('migration-upgrade-probe'),save:JSON.parse(localStorage.getItem(${JSON.stringify(primary)})),recovery:JSON.parse(localStorage.getItem(${JSON.stringify(recovery)}))})`);page.close();
 assert.equal(observed.origin,report.beforeOrigin);assert.equal(observed.sentinel,sentinel);assert(observed.save&&observed.recovery,'Both save slots retained');
 const s=observed.save;for(const field of ['prisms','comets','motes','sigils'])assert(s[field]>=seed[field],field+' retained');
 for(const [field,id] of [['spirits','ember'],['spirits','stone'],['heroRarity','ember'],['wispModules','ember'],['wispUltimate','ember'],['nodes','swift'],['research','arcanecal'],['longStudyLevels',study]])assert.equal(s[field][id],seed[field][id],field+'.'+id+' retained');
 const running=s.activeStudies.find(x=>x.id===study);assert(running,'Paid Study retained');assert.equal(running.speedMult,2);assert.equal(running.totalDurationSec,3600);assert(running.remainingSec>0&&running.remainingSec<=3500);
 assert(s.recruitmentEntitlements.ember&&s.recruitmentEntitlements.stone,'Legacy recruits retain entitlement');
 report.status='PASS';report.uidRetained=true;report.origin=observed.origin;report.bothSaveSlotsRetained=true;report.progressAndPaidStudyRetained=true;report.physicalDevice=false;
 fs.mkdirSync('release-evidence',{recursive:true});fs.writeFileSync('release-evidence/emulator-upgrade.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}
main().catch(e=>{console.error(e.stack);process.exitCode=1;});
