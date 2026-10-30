'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {app,clone,P,R}=require('./lab-expansion-harness.cjs');
const sourcePath=process.argv[2]||'index.html',source=fs.readFileSync(sourcePath,'utf8'),T=2000000000000;
function verify(html){
 let checks=0;const ok=(v,m)=>{checks++;assert(v,m);},eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);},near=(a,b,m)=>ok(Math.abs(a-b)<=Math.max(1,Math.abs(b))*1e-9,m+': '+a+' vs '+b);
 const x=app(html),q=x.q,tiers=[1.5,2,3,4,5,6,7,8],hours=[8,12,24],bases=[800,1500,3500,6500,10000,15000,20500,27500];
 function seed(motes=1e7){const s=q.fresh();s.maxDepthEver=250;s.questDay=q.day();s.lumen=s.shards=1e12;s.motes=motes;s.lastSeen=T;s.activeParty=[];s.activeStudies=[{id:'guardmastery',remainingSec:1e7,totalDurationSec:1e7,speedMult:1}];return s;}
 function install(s){x.clock(T);q.set(s);}
 const round=(v,p)=>Number((BigInt(v)*BigInt(100-p)+99n)/100n);
 for(let i=0;i<tiers.length;i++)for(let h=0;h<hours.length;h++)for(const catalysis of [0,1,5,10]){
  const mult=tiers[i],dur=hours[h],full=Number((BigInt(bases[i])*BigInt(dur)*BigInt([100,95,90][h])+799n)/800n),cost=round(full,2*catalysis);
  let s=seed(cost-1);s.longStudyLevels.catalysis=catalysis;install(s);
  eq(q.boostCost(mult,dur),cost,'exact rational package/Catalysis quote');
  let before=clone(q.get()),save=[x.storage.get(P),x.storage.get(R)];ok(!q.boost('guardmastery',mult,dur),'one-short cannot activate');eq(q.get(),before,'rejection preserves entire state');eq([x.storage.get(P),x.storage.get(R)],save,'rejection does not save');
  s.motes=cost;install(s);ok(q.boost('guardmastery',mult,dur),'exact funds activate');eq(q.get().motes,0,'single exact debit');eq(q.get().activeStudies,s.activeStudies.map((a,i)=>({...a,slot:i})),'paid floor and work snapshot unchanged, stable slot assigned');eq(q.get().studyBoosts.slot0,{mult,startedAtMs:T,expiresAtMs:T+dur*3600000},'exact saved deadline');
  q.get().motes=cost*10;before=q.get().motes;ok(!q.boost('guardmastery',mult,dur),'rich duplicate activation rejected');ok(!q.boost('guardmastery',8,24),'cannot overwrite/stack paid time');eq(q.get().motes,before,'no double spending');
  q.save();const paid=clone(q.get().studyBoosts);q.load();eq(q.get().studyBoosts,paid,'normal save/reload keeps paid boost');eq(q.get().studyBoostHours.guardmastery,dur,'duration persists');eq(q.get().studySpeedTargets.guardmastery,mult,'multiplier persists');
 }
 for(const invalid of [[1,8],[9,8],[3,0],[3,7],[3,48],['3',8],[3,'8']]){install(seed());ok(!q.boost('guardmastery',invalid[0],invalid[1]),'invalid tier/duration rejected');}
 install(seed());for(const id of ['unknown','measuredinquiry'])ok(!q.boost(id,3,8),'inactive/unknown cannot activate');let s=seed();s.longStudyLevels.measuredinquiry=10;s.activeStudies=[{id:'measuredinquiry',remainingSec:1e7,totalDurationSec:1e7,speedMult:1}];install(s);ok(!q.boost('measuredinquiry',3,8),'capped paid record cannot spend');
 s=seed();s.maxDepthEver=1;s.activeStudies=[{id:'catalysis',remainingSec:100,totalDurationSec:100,speedMult:1}];install(s);ok(!q.boost('catalysis',3,8),'locked cannot activate');
 install(seed());x.fail(true,false);const before=clone(q.get());ok(!q.boost('guardmastery',1.5,8),'primary failure rejects activation');eq(q.get(),before,'failed paid transaction rolls back');x.fail(false,false);
 // Work integration and preserved pre-timer purchases.
 s=seed();s.activeStudies[0].remainingSec=s.activeStudies[0].totalDurationSec=300;install(s);q.boost('guardmastery',3,8);q.advance(.0173,{kind:'live',clockStartMs:T});q.advance(.8827,{kind:'live',clockStartMs:T+17.3});near(q.get().activeStudies[0].remainingSec,297.3,'fractional contiguous calls do not amplify epoch rounding');
 s=seed();s.activeStudies[0].remainingSec=1e6;s.studyBoosts.guardmastery={mult:3,startedAtMs:T,expiresAtMs:T+28800000};install(s);near(q.eta(q.get().activeStudies[0]),942400,'long research ETA accounts for expiry');near(q.eta(q.get().activeStudies[0],T+28800000),1e6,'expired ETA uses paid floor');
 for(const floor of [1,2,4,8])for(const mult of tiers){
  s=seed();s.activeStudies[0].speedMult=floor;s.studyBoosts.guardmastery={mult,startedAtMs:T,expiresAtMs:T+8*3600000};install(s);
  q.advance(8*3600+10,{kind:'live',clockStartMs:T});near(q.get().activeStudies[0].remainingSec,1e7-Math.max(floor,mult)*8*3600-floor*10,'expiry integrates exact paid floor');eq(q.get().activeStudies[0].speedMult,floor,'legacy speed never rewritten');
 }
 s=seed();s.studyBoosts.guardmastery={mult:3,startedAtMs:T+2000,expiresAtMs:T+2000+8*3600000};install(s);q.advance(4,{kind:'live',clockStartMs:T});near(q.get().activeStudies[0].remainingSec,1e7-8,'future start/clock rollback cannot backdate speed');
 s=seed();s.activeStudies[0].remainingSec=s.activeStudies[0].totalDurationSec=100;s.studyQueue.guardmastery=true;install(s);ok(q.boost('guardmastery',1.5,8),'start carry fixture');const wallet=q.get().motes;let r=q.advance(100,{kind:'live',clockStartMs:T});eq(q.get().longStudyLevels.guardmastery,1,'completes actual work once');near(q.get().activeStudies[0].remainingSec,q.duration('guardmastery',1)-50,'same paid timer carries to next level');eq(q.get().motes,wallet,'no second level debit');eq(r.studySpeedPurchases,0,'simulation never renews');
 s=seed();s.activeStudies[0].remainingSec=s.activeStudies[0].totalDurationSec=8*3600*1.5;s.studyQueue.guardmastery=true;install(s);q.boost('guardmastery',1.5,8);q.advance(8*3600+1,{kind:'live',clockStartMs:T});near(q.get().activeStudies[0].remainingSec,q.duration('guardmastery',1)-1,'expiry/completion collision starts unboosted next level');
 s=seed();s.studyUseMotes.guardmastery=true;s.studySpeedTargets.guardmastery=8;s.activeStudies[0].speedMult=4;install(s);eq(q.get().studyUseMotes.guardmastery,false,'legacy recurring consent does not become new spending');eq(q.get().activeStudies[0].speedMult,4,'legacy paid floor preserved');const cash=q.get().motes;q.speeds();eq(q.get().motes,cash,'old automatic purchase path retired');
 // Normalization is pure; expired records must survive until offline replay.
 s=seed();s.studyBoosts={unknown:{mult:3,startedAtMs:T,expiresAtMs:T+28800000},guardmastery:{mult:3,startedAtMs:T-28800000,expiresAtMs:T}};const raw=clone(s);q.accept(s);eq(s,raw,'normalization does not mutate input');install(s);ok(!!q.get().studyBoosts.slot0,'expired history retained for replay');ok(!q.get().studyBoosts.unknown,'unknown boost discarded');
 for(const bad of [null,{}, {mult:9,startedAtMs:T,expiresAtMs:T+28800000},{mult:3,startedAtMs:'2000000000000',expiresAtMs:T+28800000},{mult:3,startedAtMs:T,expiresAtMs:T+1}]){s=seed();s.studyBoosts.guardmastery=bad;install(s);ok(!q.get().studyBoosts.slot0,'malformed paid record rejected without speed grant');}
 s=seed();s.moteNextAtMs=Infinity;install(s);eq(q.get().moteNextAtMs,0,'invalid payout clock defaults safely');
 // Global payout eligibility and exact purchased rewards.
 s=seed(0);s.depth=s.enemyDepth=79;s.activeStudies=[];install(s);const reward=q.motes(79);eq(q.motePayout(T),reward,'qualifying fixed depth reward');eq(q.motePayout(T+59999),0,'cooldown rejects early reward');eq(q.motePayout(T+60000),reward,'exact boundary qualifies');q.get().depth=1;eq(q.motePayout(T+60001),0,'Rift change cannot bypass');q.save();q.load();eq(q.motePayout(T+60001),0,'reload cannot bypass');
 s=seed(123);s.depth=s.enemyDepth=79;s.longStudyLevels.motestudy=5;s.spirits.tide=s.spirits.aurora=1;s.activeParty=['tide','aurora'];s.wispModules.tide=s.wispModules.aurora=20;install(s);eq(q.motePayout(T),Math.round(q.motes(79)*3),'Sense, Dawnpriest and both Amplifier bonuses retained');
 // Current fixtures, canonical HP, live/offline/split composition.
 const fixtures=JSON.parse(fs.readFileSync('tests/behavioral/fixtures.json','utf8'));
 function farm(){const v=clone(fixtures['mid-game'].save);Object.assign(v,{riftMode:'farm',farmDepth:v.depth,farmReturnDepth:v.depth+1,autoAscendEnabled:false,activeStudies:[],studyQueue:{},studyUseMotes:{},empowerQueue:{},motes:0,moteNextAtMs:0,questDay:q.day()});Object.keys(q.fresh().spirits).forEach(id=>v.empowerQueue[id]=false);install(v);q.batch(1);Object.assign(q.get(),{motes:0,moteNextAtMs:0,luminousAccum:0,enemyIsLuminous:false});return clone(q.get());}
 const farmSeed=farm();function runFarm(kind,parts){install(farmSeed);let now=T,sum=0;for(const dt of parts){sum+=q.advance(dt,{kind,clockStartMs:now}).motesGained;now+=dt*1000;}return {sum,state:clone(q.get())};}
 const whole=runFarm('live',[600]),split=runFarm('live',Array(600).fill(1)),offline=runFarm('offline',[600]);eq(split.sum,whole.sum,'split/live Mote parity');eq(offline.sum,whole.sum,'offline/live Mote parity');eq(whole.sum<=30,true,'at most ten3-Mote payouts in600s');near(split.state.moteNextAtMs,whole.state.moteNextAtMs,'split payout endpoint');eq(split.state.totalKills,whole.state.totalKills,'cooldown does not change kills');eq(split.state.lumen,whole.state.lumen,'split Lumen preserved');near(offline.state.lumen-farmSeed.lumen,(whole.state.lumen-farmSeed.lumen)*.7,'existing offline Lumen policy retained');
 // Offline wall-clock expiry: retain historical boost then replay before expiry.
 s=seed();s.activeStudies[0].remainingSec=s.activeStudies[0].totalDurationSec=1e9;s.studyBoosts.guardmastery={mult:3,startedAtMs:T-28800000+2000,expiresAtMs:T+2000};install(s);q.save();x.clock(T+10000);q.load();q.offline();x.drain();near(q.get().activeStudies[0].remainingSec,1e9-14,'cold load applies expired boost only over valid historical2s');
 s=seed();s.activeStudies[0].remainingSec=s.activeStudies[0].totalDurationSec=1e9;install(s);q.boost('guardmastery',1.5,8);x.clock(T+43203000);q.offline();x.drain();near(q.get().activeStudies[0].remainingSec,1e9-57603,'full12h3s research;8h boost then4h3s base');eq(q.get().studyBoosts.slot0.expiresAtMs,T+28800000,'absence never extends timer');
 // Real recovery/backup/Ascend paths must retain time and the global cooldown.
 s=seed();s.depth=s.enemyDepth=79;s.moteNextAtMs=T+30000;install(s);q.boost('guardmastery',3,12);q.save();const paid=clone(q.get());
 x.storage.set(P,'broken primary');q.load();eq(q.get().studyBoosts,paid.studyBoosts,'recovery retains paid deadline');eq(q.get().moteNextAtMs,paid.moteNextAtMs,'recovery cannot reset payout clock');
 x.area.value=q.export();q.set(q.fresh());q.restore();x.drain();const restored=app(html,x.storage).q;eq(restored.get().studyBoosts,paid.studyBoosts,'backup restore retains timer after actual reload path');eq(restored.get().moteNextAtMs,paid.moteNextAtMs,'backup clock retained');
 restored.set(paid);restored.ascend();eq(restored.get().studyBoosts,paid.studyBoosts,'Ascend preserves project timers');eq(restored.get().moteNextAtMs,paid.moteNextAtMs,'Ascend cannot bypass cooldown');eq(restored.get().activeStudies,paid.activeStudies,'Ascend preserves paid work');
 for(const failure of ['primary','recovery']){
  const y=app(html),r=y.q,v=clone(farmSeed);v.activeStudies=[{id:'guardmastery',remainingSec:1e7,totalDurationSec:1e7,speedMult:1}];v.studyBoosts.guardmastery={mult:3,startedAtMs:T-28800000+2000,expiresAtMs:T+2000};v.lastSeen=T;r.set(v);r.save();const before=clone(r.get());y.clock(T+600000);y.fail(failure==='primary',failure==='recovery');let error,result;
  r.offline((a,b)=>{result=a;error=b;});ok(!r.boost('guardmastery',8,24),'cannot spend during yielded catchup');y.drain();
  if(failure==='primary'){ok(error,'offline persistence error reported');eq(r.get(),before,'offline failure rolls back clock, Motes and timed work');y.fail(false,false);r.offline((a,b)=>{result=a;error=b;});y.drain();}
  checks++;assert.ifError(error);near(r.get().activeStudies[0].remainingSec,1e7-604,'retry applies exactly2s boosted plus598s normal');eq(result.motesEarned,whole.sum,'yield/retry retains exact eligible income');const accepted=clone(r.get());eq(r.offline(),null,'consumed window cannot replay');eq(r.get(),accepted,'no double work/reward after retry');
 }
 return {checks,prices:bases,midgame600secMotes:whole.sum,liveOfflineSplit:true};
}
const moteGate=source.includes('if(clock&&clock.binary?clock.binary.compareMs(state.moteNextAtMs)>0:nowMs<state.moteNextAtMs)return 0;')?'if(clock&&clock.binary?clock.binary.compareMs(state.moteNextAtMs)>0:nowMs<state.moteNextAtMs)return 0;':'if(nowMs<state.moteNextAtMs)return 0;';
let result;try{result={status:'pass',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),...verify(source),controls:[]};if(process.argv.includes('--negative'))for(const [name,a,b] of [
 ['free-after-expiry','now<b.expiresAtMs','now<b.expiresAtMs+86400000'],
 ['unlimited-motes',moteGate,'if(false)return 0;'],
 ['double-charge','&& !held && mult>active.speedMult','&& mult>active.speedMult']]){assert(source.includes(a),'mutation anchor '+name);let caught=null;try{verify(source.replace(a,b));}catch(e){caught=e.message;}assert(caught,'causal control '+name+' must fail');result.controls.push({name,detected:caught});}}
catch(e){result={status:'fail',error:e.stack};process.exitCode=1;}console.log(JSON.stringify(result));
