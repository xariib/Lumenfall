'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,seed,clone,P,R}=require('./lab-expansion-harness.cjs');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8'),T=2000000000000,H=3600;
function run(html){
 let checks=0;const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);},ok=(v,m)=>{checks++;assert(v,m);};
 const near=(a,b,m)=>ok(Math.abs(a-b)<1e-5,m+': '+a+' vs '+b);
 function fresh(){const x=app(html),s=seed(x.q);s.depth=s.enemyDepth=s.farmDepth=251;s.riftMode='farm';s.enemyHp=s.enemyMaxHp=1e100;s.lumen=s.shards=s.motes=0;return {x,q:x.q,s};}
 function replay(x,hours){x.clock(T+hours*H*1000);let result,error;x.q.offline((r,e)=>{result=r;error=e;});x.drain();assert.ifError(error);return result;}
 function paid(s,work=30*H){s.activeStudies=[{id:'guardmastery',slot:0,remainingSec:work,totalDurationSec:work,speedMult:1}];return s;}
 // Real entry point must use the whole absence for Lab, with no extra combat.
 {
  const {x,q,s}=fresh();q.set(paid(s));const r=replay(x,24);
  near(q.get().activeStudies[0].remainingSec,6*H,'paid research continues beyond12h');
  eq([r.effectiveSec,q.get().totalOfflineSeconds],[12*H,12*H],'combat cap and Deed time stay12h');
  eq([r.kills,r.ascends,r.earned,r.shardEarned],[0,0,0,0],'Lab tail generates no combat rewards');
  eq(q.get().lastSeen,T+24*H*1000,'whole endpoint consumed');
  eq(JSON.parse(x.storage.get(P)),q.get(),'primary includes full Lab progress');eq(JSON.parse(x.storage.get(R)),q.get(),'recovery includes full Lab progress');
  const saved=clone(q.get());eq(q.offline(),null,'duplicate return does nothing');eq(q.get(),saved,'duplicate cannot replay research');
  q.load();eq(q.get(),saved,'reload retains full absence');
 }
 // Paid work completes with an empty wallet; Queue OFF stays empty.
 {
  const {x,q,s}=fresh();q.set(paid(s,13*H));const r=replay(x,24);
  eq(q.get().longStudyLevels.guardmastery,1,'empty wallet does not stop already-paid work');
  eq(q.get().activeStudies,[],'Queue OFF starts nothing');eq(r.completedStudies.length,1,'recap includes beyond-cap completion');
 }
 // One funded next level starts, consumes its real price, and finishes before
 // the queue waits for funds. An unpaid level is never created.
 for(const missing of ['none','lumen','shards']){
  const {x,q,s}=fresh();const cost=q.cost('guardmastery',1);paid(s,13*H);s.studyQueue.guardmastery=true;s.studySlotProjects[0]='guardmastery';
  s.lumen=cost.lumen-(missing==='lumen'?1:0);s.shards=cost.shard-(missing==='shards'?1:0);q.set(s);
  const r=replay(x,72),funded=missing==='none';
  eq(q.get().longStudyLevels.guardmastery,funded?2:1,'queue obeys both resources: '+missing);
  eq(q.get().activeStudies,[],'funded work finishes, then waits: '+missing);
  eq([q.get().lumen,q.get().shards],funded?[0,0]:[s.lumen,s.shards],'precise queue debit: '+missing);
  eq(q.get().studyQueue.guardmastery,true,'waiting preserves consent');eq(r.completedStudies.length,funded?2:1,'complete Lab receipt');
 }
 // Real timers expire after12h; auto-renew uses Motes only with prior consent.
 for(const renew of [false,true]){
  const {x,q,s}=fresh();paid(s,1e8);s.motes=1e6;s.studyBoosts.slot0={mult:2,startedAtMs:T-8*H*1000,expiresAtMs:T+16*H*1000};
  s.studyBoostQueue={slot0:{enabled:renew,mult:3,hours:8}};q.set(s);const cost=q.boostCost(3,8),r=replay(x,24);
  // At the return boundary an enabled queue pays for its next8h, as live play does.
  near(q.get().activeStudies[0].remainingSec,1e8-(renew?56:40)*H,'historical expiry splits work at16h');
  eq(r.studySpeedPurchases,renew?2:0,'renewal at16h and24h requires consent');eq(r.studyMotesSpent,renew?2*cost:0,'each renewal charged once');
  eq(q.get().motes,1e6-r.studyMotesSpent,'Mote wallet conservation');
 }
 // Canonical paid work agrees across a return at12h and one at24h.
 {
  const a=fresh(),b=fresh();paid(a.s);a.s.studyBoosts.slot0={mult:1.5,startedAtMs:T-8*H*1000,expiresAtMs:T+16*H*1000};b.s=clone(a.s);a.q.set(a.s);b.q.set(b.s);
  replay(a.x,24);replay(b.x,12);replay(b.x,24);
  eq(a.q.get().activeStudies,b.q.get().activeStudies,'split return preserves work and boost expiry');
 }
 // Failure in the tail is part of the same transaction; retry cannot pay twice.
 {
  const {x,q,s}=fresh();q.set(paid(s));q.save();const before=clone(q.get());x.fail(true,false);x.clock(T+24*H*1000);let error;
  q.offline((r,e)=>{error=e;});x.drain();ok(error,'failed canonical write reported');eq(q.get(),before,'failure restores all research and endpoint');
  x.fail(false,false);replay(x,24);near(q.get().activeStudies[0].remainingSec,6*H,'retry applies full work once');
 }
 // The unlock check, visible counter and earned ownership agree at boundaries.
 for(const [id,field,target]of [['autotap','ascendCount',100],['labmaster','research',200]]){
  const {x,q,s}=fresh();for(const n of [target-1,target]){
   const v=clone(s);if(field==='research')v.research.focus=n;else v[field]=n;q.set(v);
   eq(q.deed(id),n===target,'harder Deed boundary '+id+'/'+n);
   eq(q.deedProgress(q.deeds().find(d=>d.id===id),q.get()).target,target,'visible target '+id);
   q.achievements();eq(!!q.get().achieved[id],n===target,'new ownership boundary '+id);
  }
  const old=clone(s);old.achieved[id]=true;q.set(old);q.achievements();q.save();q.load();eq(q.get().achieved[id],true,'earned unlock retained '+id);
  x.storage.set(P,'invalid');q.load();eq(q.get().achieved[id],true,'recovery retains earned unlock '+id);
 }
 return checks;
}
const result={status:'PASS',checks:run(source),sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),controls:[]};
if(process.argv.includes('--negative'))for(const [name,a,b]of [
 ['capped-Lab','if(elapsedSec>effectiveSec){','if(false && elapsedSec>effectiveSec){'],
 ['combat-tail','yield* advanceStudyOnlyTime(elapsedSec-effectiveSec,lastSeen+effectiveSec*1000,sim,true);',"yield* advanceAuthoritativeTime(elapsedSec-effectiveSec,{kind:'offline',clockStartMs:lastSeen+effectiveSec*1000,resumable:true});"],
 ['easy-Vigil','s.ascendCount>=100;','s.ascendCount>=12;'],
 ['easy-Forge','legacyResearchLevels(s)>=200;','legacyResearchLevels(s)>=20;']
]){
 assert.equal(source.split(a).length,2,'unique control '+name);let error;try{run(source.replace(a,b));}catch(e){error=e;}assert(error instanceof assert.AssertionError,'control must be caught '+name);result.controls.push({name,caught:error.message.split('\n')[0]});
}
console.log(JSON.stringify(result));
