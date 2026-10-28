'use strict';
// Execute the actual native harness's pre-document seed, then feed its exact
// bytes to complete production save/offline functions. No Android mocks claim
// native acceptance; the installed APK gate remains mandatory.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const F=require('./forge-expansion-harness.cjs');
const product=fs.readFileSync(process.argv[2]||'index.html','utf8');
const native=fs.readFileSync('scripts/ci/android-upgrade.cjs','utf8');
let checks=0;
function eq(a,b,message){checks++;assert.deepEqual(a,b,message);}
function seed(){
 const x=F.app(product,undefined,{clockDate:true}),q=x.q,s=q.fresh();
 Object.assign(s,{questDay:q.day(),lastSeen:F.CLOCK,depth:9,riftMode:'farm',farmDepth:9,farmReturnDepth:20,maxDepthEver:100});
 s.spirits.tide=10000;s.activeParty=['tide'];s.nodes.echo=6;
 for(const group of ['empowerQueue','researchQueue','studyQueue'])for(const id of Object.keys(s[group]))s[group][id]=false;
 s.activeStudies=[{id:'guardmastery',slot:0,remainingSec:7200,totalDurationSec:7200,speedMult:1}];
 q.set(s);q.restoreEnemy();q.save();return F.clone(q.get());
}
async function nativeSeed(code,retained){
 const begin=code.indexOf('async function prepareOfflineRecap('),end=code.indexOf('\nasync function verifyInstalledMidgameFarmHint(',begin);
 assert(begin>=0&&end>begin,'exact native recap function found');
 const storage=new Map(),captured={};
 class FixedDate extends Date{constructor(value){super(arguments.length?value:F.CLOCK);}static now(){return F.CLOCK;}}
 const context={Date:FixedDate,localStorage:{setItem:(key,value)=>storage.set(key,String(value)),removeItem:key=>storage.delete(key)}};
 const page={command:async(method,params)=>{
   assert.equal(method,'Page.addScriptToEvaluateOnNewDocument');
   vm.runInNewContext(params.source,context);throw captured;
 }};
 const prepare=new Function('primary','recovery','Date',code.slice(begin,end)+';return prepareOfflineRecap;')(F.P,F.R,FixedDate);
 try{await prepare(page,retained);assert.fail('seed capture must stop before Android operations');}catch(error){if(error!==captured)throw error;}
 return storage;
}
async function run(code){
 const retained=seed(),before=F.clone(retained),storage=await nativeSeed(code,retained);
 eq(retained,before,'native fixture cannot mutate the already-verified upgraded save');
 eq(storage.get(F.P),storage.get(F.R),'both disposable fixture slots contain the same endpoint');
 const x=F.app(product,storage,{clockDate:true}),q=x.q;
 q.offline();x.drain();
 eq(q.get().totalOfflineSeconds,retained.totalOfflineSeconds+60,'native fixture credits exactly the intended absent minute');
 eq(q.get().activeStudies[0].remainingSec,7140,'native absence advances actual paid work by one minute');
 q.save();q.load();eq(q.offline(),null,'native fixture minute cannot be credited twice after reload');
 x.clock(F.CLOCK+60000);q.offline();x.drain();
 eq(q.get().totalOfflineSeconds,retained.totalOfflineSeconds+120,'new minute after the fixture remains available');
 eq(q.get().activeStudies[0].remainingSec,7080,'two distinct minutes retain chronological paid work');
 // An ordinary rollback is different from constructing a disposable fixture.
 // Preserve its credited frontier and prove that production still rejects it.
 const rollback=F.clone(retained);rollback.lastSeen-=60000;
 const y=F.app(product,[[F.P,JSON.stringify(rollback)],[F.R,JSON.stringify(rollback)]],{clockDate:true});
 eq(y.q.offline(),null,'ordinary lastSeen rollback cannot reopen the consumed minute');
 eq(y.q.get().totalOfflineSeconds,retained.totalOfflineSeconds,'replay rejection does not award offline time');
 eq(y.q.get().activeStudies[0].remainingSec,7200,'replay rejection does not award paid work');
}
(async()=>{
 await run(native);const positiveChecks=checks;
 if(process.argv.includes('--negative')){
   const line='   seed.offlineClockHighWaterMs=seed.lastSeen;';assert.equal(native.split(line).length,2);
   await assert.rejects(run(native.replace(line,'')),/native fixture credits exactly the intended absent minute/);
 }
 console.log(JSON.stringify({status:'PASS',checks:positiveChecks,negativeControl:process.argv.includes('--negative'),sourceSha256:require('node:crypto').createHash('sha256').update(product).digest('hex')}));
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
