'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone,P,R}=require('./lab-expansion-harness.cjs');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8'),T=2000000000000,DAY=86400;
function verify(html){
 let checks=0;const ok=(v,m)=>{checks++;assert(v,m);},eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);};
 const near=(a,b,m)=>ok(Math.abs(a-b)<1e-4,m+': '+a+' vs '+b),x=app(html),q=x.q;
 const subjects=['wispascend','guardmastery','shardstudy','lumenstudy','motestudy','wispdamage','wispcritchance','wispcritdamage','measuredinquiry','bossledger'];
 function ready(rank){const s=q.fresh();Object.assign(s,{maxDepthEver:rank?300:150,ascendCount:rank?100:25,lastSeen:T,questDay:q.day(),lumen:1e12,shards:1e12,motes:1e8,activeParty:[]});s.longStudyLevels.labcapacity=rank;
  subjects.slice(0,rank?10:6).forEach(id=>s.longStudyLevels[id]=rank?15:10);
  if(rank){s.longStudyLevels.measuredinquiry=10;s.longStudyLevels.wispascend=20;}return s;
 }
 function install(s){x.clock(T);q.set(s);}
 const records=[];
 for(const rank of [0,1]){
  const base=ready(rank),goals=rank?[300,100,150,10]:[150,25,60,6],work=rank?8640000:1296000;
  const bad=[['depth',s=>s.maxDepthEver--],['ascends',s=>s.ascendCount--],['levels',s=>s.longStudyLevels.wispascend--],['subjects',s=>{const id=subjects[rank?9:5];s.longStudyLevels.wispascend+=s.longStudyLevels[id];s.longStudyLevels[id]=0;}]];
  for(const [key,edit]of bad){
   const s=clone(base);edit(s);s.studyQueue.labcapacity=true;install(s);const before=clone(q.get()),saved=[x.storage.get(P),x.storage.get(R)],plan=q.plan('labcapacity');
   eq(plan.reason,'requirements','each expansion milestone required '+rank+'/'+key);eq(plan.challenge.requirements.map(r=>r.target),goals,'independent goals '+rank);ok(!plan.challenge.requirements.find(r=>r.key===key).met,'specific incomplete goal '+key);
   eq(q.get(),before,'quoting goals is pure');ok(!q.start('labcapacity'),'rich wallet cannot bypass '+key);eq(q.get(),before,'blocked start spends and changes nothing');eq([x.storage.get(P),x.storage.get(R)],saved,'blocked start writes nothing');
   eq(q.queue().studiesStarted,0,'research queue respects '+key);q.studyOnly(2*3600,T,q.summary(0));eq(q.get().longStudyLevels.labcapacity,rank,'two hours cannot bypass challenge '+key);eq(q.get().lumen,base.lumen,'waiting queue cannot prepay '+key);
  }
  // Paid but incomplete research cannot satisfy completed-level/breadth goals.
  for(const kind of ['levels','subjects']){
   const s=clone(base);if(kind==='levels')s.longStudyLevels.wispascend--;else{const id=subjects[rank?9:5];s.longStudyLevels.wispascend+=s.longStudyLevels[id];s.longStudyLevels[id]=0;}
   const id=kind==='levels'?'wispascend':subjects[rank?9:5];s.activeStudies=[{id,remainingSec:100,totalDurationSec:200,speedMult:1}];install(s);eq(q.plan('labcapacity').reason,'requirements','active work is not earned '+kind);
  }
  install(base);const quote=q.plan('labcapacity');ok(quote.affordable&&quote.challenge.met,'exact milestones permit a funded start');eq(quote.challenge.requirements.map(r=>r.current),goals,'exact milestone counters');eq(quote.duration,work,'new expansion nominal work');eq(quote.cost,{lumen:rank?40000:20000,shard:rank?4000:2000},'original expansion price retained');
  const wallet=q.get().lumen,shards=q.get().shards;q.get().studyQueue.labcapacity=true;
  ok(q.startAt('labcapacity',0),'real expansion starts');eq(q.slots(),3+rank,'start grants no early slot');eq(q.get().lumen,wallet-quote.cost.lumen,'one exact Lumen charge');eq(q.get().shards,shards-quote.cost.shard,'one exact Shard charge');
  ok(q.boost('labcapacity',8,24),'paid8x starts');ok(q.boostPreference('labcapacity',8,24,true),'actual boost renewals consent');const sum=q.summary(0),seconds=work/8;
  q.studyOnly(2*3600,T,sum);eq(q.get().longStudyLevels.labcapacity,rank,'two boosted hours cannot finish expansion');eq(q.slots(),3+rank,'no slot within two hours');
  q.studyOnly(seconds-2*3600-1,T+2*3600000,sum);eq(q.get().longStudyLevels.labcapacity,rank,'final boosted second still pending');q.save();const paid=clone(q.get().activeStudies);q.load();eq(q.get().activeStudies,paid,'long paid expansion cold reload');
  q.studyOnly(2,T+(seconds-1)*1000,sum);eq(q.get().longStudyLevels.labcapacity,rank+1,'completion earns exactly one expansion');eq(q.slots(),4+rank,'completion unlocks next slot');eq(q.get().lumen,wallet-quote.cost.lumen,'no next-rank debit while locked/maxed');eq(q.get().activeStudies.length,0,'next unpaid rank waits for its own goals');ok(sum.studySpeedPurchases>0,'long research actually renews paid boost');
  q.save();q.load();eq(q.slots(),4+rank,'earned slot survives reload');eq(q.accept(q.decode(q.export())).longStudyLevels.labcapacity,rank+1,'earned slot survives backup');
  // Even all pre-earned reductions leave days of real time at maximum speed.
  const fast=clone(base);for(const d of q.expansion())fast.longStudyLevels[d.id]=d.levelCap;fast.longStudyLevels.labcapacity=rank;install(fast);
  const reduced=q.duration('labcapacity',rank);ok(reduced/8>=(rank?7*DAY:25.2*3600),'maximum reductions cannot trivialize expansion '+rank);
  near(reduced,work*(rank?.595:.63),'unused-slot and Curriculum discounts retained');records.push({rank:rank+1,goals,nominalDays:work/DAY,fastestDays8x:reduced/(8*DAY)});
 }
 // A genuinely earned milestone opens a waiting queue at its exact timestamp.
 const transition=ready(0);transition.longStudyLevels.wispascend=9;transition.studyQueue.labcapacity=true;
 transition.depth=transition.enemyDepth=149;transition.enemyHp=transition.enemyMaxHp=1e30;
 transition.activeStudies=[{id:'wispascend',remainingSec:1,totalDurationSec:100,speedMult:1}];
 function replay(kind,parts){install(transition);let now=T,started=0;for(const dt of parts){started+=q.advance(dt,{kind,clockStartMs:now}).studiesStarted;now+=dt*1000;}return {state:clone(q.get()),started};}
 const whole=replay('live',[2]),split=replay('live',[1,1]),offline=replay('offline',[2]);
 eq(whole.started,1,'earned completion starts queued expansion once');eq(whole.state.activeStudies[0].id,'labcapacity','newly eligible expansion uses released slot');near(whole.state.activeStudies[0].remainingSec,1295999,'remaining second applies after the actual milestone');
 eq(whole.state.lumen,transition.lumen-20000,'no combat income conceals expansion payment');eq(whole.state.shards,transition.shards-2000,'one exact expansion Shard payment');
 for(const other of [split,offline])for(const key of ['activeStudies','longStudyLevels','studySlotProjects','lumen','shards','motes'])eq(other.state[key],whole.state[key],'whole/split/offline milestone parity '+key);
 // Already-claimed Deeds cannot be an accidental batching boundary for a new
 // Ascend gate. Exercise accelerated repeat cycles and actual queued payment.
 for(const rank of [0,1]){
  const s=ready(rank);Object.assign(s,{depth:15,enemyDepth:15,ascendCount:1000,lumen:1000000,shards:1000000,activeParty:['ember'],autoAscendEnabled:true,autoAscendTargetDepth:16});
  s.owned.autoascend=true;s.spirits.ember=100;s.heroRarity.ember=5;s.research.masterwork=500;s.nodes.lumenmemory=20;s.studyQueue.labcapacity=true;s.longStudyLevels.wispascend=500;s.longStudyLevels.lumenstudy=10000;
  install(s);q.achievements();const input=clone(q.get());input.ascendCount=0;
  function cycles(kind,parts){install(input);let now=T;for(const dt of parts){q.advance(dt,{kind,clockStartMs:now});now+=dt*1000;}return clone(q.get());}
  const a=cycles('live',[60]),b=cycles('live',Array(60).fill(1)),c=cycles('offline',[60]);
  ok(a.ascendCount>100&&a.activeStudies[0]?.id==='labcapacity','repeat cycles cross expansion Ascend milestone '+rank);
  for(const v of [b,c]){eq(v.ascendCount,a.ascendCount,'caller splits and policy retain Ascend count');near(v.activeStudies[0].remainingSec,a.activeStudies[0].remainingSec,'caller splits preserve expansion unlock timestamp');eq(v.longStudyLevels.labcapacity,rank,'newly started expansion grants no early slot');}
 }
 // Purchased ranks retain their slots even below every new milestone.
 for(const level of [0,1,2,9])for(const depth of [1,14,15,39,40,59,60,300]){
  const s=q.fresh();s.maxDepthEver=depth;s.longStudyLevels.labcapacity=level;install(s);const count=Math.min(5,(depth<15?1:depth<60?2:3)+Math.min(2,level));eq(q.slots(),count,'all previously earned slots retained');q.save();q.load();eq(q.slots(),count,'legacy slots persist');
 }
 // Old paid active/paused work bypasses new start goals, preserving its exact receipt.
 const legacy=q.fresh();Object.assign(legacy,{maxDepthEver:40,lastSeen:T,questDay:q.day(),lumen:10000,shards:5000,motes:100,depth:21,enemyDepth:21});
 legacy.activeStudies=[{id:'labcapacity',remainingSec:8,totalDurationSec:1800,speedMult:8}];legacy.studyQueue.labcapacity=true;install(legacy);q.save();const old=clone(q.get());q.load();eq(q.get(),old,'legacy active expansion preserved exactly');q.studyOnly(2,T,q.summary(0));eq(q.get().longStudyLevels.labcapacity,1,'old paid work still finishes');eq(q.slots(),3,'old paid slot retained');eq(q.get().activeStudies.length,0,'old queue cannot buy second expansion without new goals');eq(q.get().lumen,legacy.lumen,'legacy completion cannot debit next rank');
 const paused=clone(legacy);paused.activeStudies=[];paused.pausedStudies=[{id:'labcapacity',remainingSec:45,totalDurationSec:1800,speedMult:4}];install(paused);const money=[q.get().lumen,q.get().shards,q.get().motes];ok(q.plan('labcapacity').paused&&!q.plan('labcapacity').challenge.met,'paused work retains exemption');ok(q.startAt('labcapacity',0),'old paused work resumes without new challenges');eq([q.get().lumen,q.get().shards,q.get().motes],money,'paid resume never pays twice');eq(q.get().activeStudies[0],{id:'labcapacity',slot:0,remainingSec:45,totalDurationSec:1800,speedMult:4},'old paid timer and speed unchanged');
 q.save();const held=clone(q.get());x.storage.set(P,'broken primary');q.load();eq(q.get(),held,'recovery keeps legacy expansion');q.ascend();eq(q.get().activeStudies,held.activeStudies,'Ascend keeps paid expansion');
 const capable=ready(0);install(capable);x.fail(true,false);const before=clone(q.get());ok(!q.start('labcapacity'),'failed save rejects new expansion');eq(q.get(),before,'failed expansion transaction rolls back');x.fail(false,false);
 return {checks,records};
}
const controls=[
 ['gate-bypass',"!paused && challenge && !challenge.met ? 'requirements' : ''","false ? 'requirements' : ''"],
 ['short-work','if(node.rankWorkSec)work=','if(false && node.rankWorkSec)work='],
 ['paid-resume-blocked','!paused && challenge && !challenge.met','challenge && !challenge.met'],
 ['unearned-goals','var paid=longStudyLevel(node.id);','var paid=longStudyLevel(node.id)+(findActiveStudy(node.id)?1:0);'],
 ['skipped-ascend-goal','if(capacityLimit!==null)count=Amount.min(count,capacityLimit);','if(false)count=Amount.min(count,capacityLimit);']
];
let result;try{result={status:'pass',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),...verify(source),controls:[]};if(process.argv.includes('--negative'))for(const [name,from,to]of controls){assert.equal(source.split(from).length,2,'unique control '+name);let caught;try{verify(source.replace(from,to));}catch(e){caught=e.message;}assert(caught,'detected '+name);result.controls.push({name,detected:caught});}}
catch(e){result={status:'fail',error:e.stack};process.exitCode=1;}console.log(JSON.stringify(result));
