'use strict';
// Complete production game, real paid research and authoritative combat.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app:lab,seed,clone,P}=require('./lab-expansion-harness.cjs');
const {app:combat,CLOCK}=require('./forge-expansion-harness.cjs');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8'),DAY=86400;
function verify(html){
 let checks=0;const records=[];
 const ok=(x,m)=>{checks++;assert(x,m);},eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);};
 const near=(a,b,m)=>ok(Math.abs(a-b)<=Math.max(1e-6,Math.max(Math.abs(a),Math.abs(b))*1e-11),m+': '+a+' / '+b);
 const world=lab(html),q=world.q,node=q.projects().find(n=>n.id==='supportduration');
 ok(node,'named stable research identity');eq(node.levelCap,10,'ten duration levels');
 function funded(){const s=seed(q);s.maxDepthEver=500;s.lumen=s.shards=1e15;s.motes=1e12;s.activeParty=['tide','aurora'];
  for(const id of s.activeParty){s.spirits[id]=100;s.heroRarity[id]=5;s.wispUltimate[id]=true;}
  s.research.charge=10;s.longStudyLevels.wispdamage=50;s.longStudyLevels.ultimateanalysis=5;return s;}
 function best(){const s=funded();for(const d of q.expansion())s.longStudyLevels[d.id]=d.levelCap;s.longStudyLevels.supportduration=0;return s;}
 // No free ownership, automatic spending consent or new retroactive work.
 const old=funded();for(const field of ['longStudyLevels','studyQueue','studyUseMotes','studySpeedTargets','studyBoostHours'])delete old[field].supportduration;
 old.activeStudies=[{id:'wispascend',slot:0,remainingSec:123.5,totalDurationSec:180,speedMult:4}];
 old.pausedStudies=[{id:'guardmastery',remainingSec:37.5,totalDurationSec:150,speedMult:2}];
 q.set(old);eq(q.get().longStudyLevels.supportduration,0,'old saves get no free duration');eq(q.get().studyQueue.supportduration,false,'research queue OFF');eq(q.get().studyUseMotes.supportduration,false,'speed queue OFF');
 eq(q.get().activeStudies,old.activeStudies,'old active paid work unchanged');eq(q.get().pausedStudies,old.pausedStudies,'old paused paid work unchanged');
 // Each access operand independently gates manual and automated first starts.
 for(const change of [s=>s.maxDepthEver=499,s=>s.longStudyLevels.wispdamage=49,s=>s.longStudyLevels.ultimateanalysis=4]){
  const s=funded();change(s);s.studyQueue.supportduration=true;q.set(s);const before=clone(q.get());
  ok(!q.plan('supportduration').affordable,'missing access rejects plan');q.start('supportduration');eq(q.get(),before,'manual locked start is pure');q.queue();eq(q.get(),before,'queued locked start is pure');
 }
 q.set(funded());const plan=q.plan('supportduration');ok(plan.affordable,'earned first start opens');eq(plan.cost,{lumen:5000000000,shard:200000000},'visible initial currencies');
 const paid=clone(q.get());ok(q.start('supportduration'),'real paid duration start');
 eq(q.get().lumen,paid.lumen-5000000000,'real exact Lumen debit');eq(q.get().shards,paid.shards-200000000,'real exact Shard debit');
 eq(q.get().longStudyLevels.supportduration,0,'no duration before earned completion');
 const work=clone(q.get().activeStudies);q.save();q.load();eq(q.get().activeStudies,work,'new long work survives reload');
 const backup=q.export();eq(q.decode(backup),q.get(),'backup round trip retains every new field');
 world.storage.set(P,'broken');q.load();eq(q.get().activeStudies,work,'recovery retains long paid work');
 q.ascend();eq(q.get().activeStudies,work,'Ascend retains paid duration work');
 // Existing buff snapshots keep their own strength and expiry at completion.
 let s=best();s.supportBuffs={version:1,sources:{tide:{until:CLOCK+8000.375,mult:1.5}}};
 s.supportRecastUntil={tide:CLOCK+5000.125,aurora:CLOCK+6000.25};
 s.activeStudies=[{id:'supportduration',slot:0,remainingSec:1,totalDurationSec:55542858,speedMult:1}];q.set(s);q.finish(1);
 eq(q.get().longStudyLevels.supportduration,1,'actual completion earns one level');eq(q.get().supportBuffs,s.supportBuffs,'completion never refreshes or strengthens saved casts');eq(q.get().supportRecastUntil,s.supportRecastUntil,'completion never rewrites existing paid recast snapshots');
 // Independent fastest-case arithmetic and the real continuously paid queue.
 s=best();s.studyQueue.supportduration=true;q.set(s);const durations=Array.from({length:10},(_,i)=>q.duration('supportduration',i));
 durations.forEach((d,i)=>{eq(d,31104000,'45-day minimum work after maximum reductions '+i);ok(d/8>=45*DAY,'each level at least45 days at8x');});
 const twoLevelSeconds=(durations[0]+durations[1])/8,firstUptimeSeconds=durations.slice(0,8).reduce((a,b)=>a+b,0)/8;
 ok(firstUptimeSeconds>=360*DAY,'first sustained milestone cannot arrive before360 dedicated days');
 ok(firstUptimeSeconds<360*DAY+1,'first sustained milestone is approximately360 fastest days');
 world.clock(CLOCK);ok(q.startAt('supportduration',0),'real best-case start');ok(q.boost('supportduration',8,24),'real paid8x');ok(q.boostPreference('supportduration',8,24,true),'explicit renewal consent');
 const summary=q.summary(0),motes=q.get().motes;
 q.studyOnly(twoLevelSeconds-1,CLOCK,summary);eq(q.get().longStudyLevels.supportduration,1,'one second before milestone still only level1');
 ok(summary.studySpeedPurchases>=89,'cannot skip daily paid boost renewals');eq(q.get().motes,motes-summary.studyMotesSpent+summary.motesGained,'paid renewal Motes conserved');
 q.studyOnly(2,CLOCK+(twoLevelSeconds-1)*1000,summary);eq(q.get().longStudyLevels.supportduration,2,'existing first two levels still complete after90 days');
 q.studyOnly(firstUptimeSeconds-twoLevelSeconds-2,CLOCK+(twoLevelSeconds+1)*1000,summary);eq(q.get().longStudyLevels.supportduration,7,'one second before sustained milestone still only level7');
 q.studyOnly(2,CLOCK+(firstUptimeSeconds-1)*1000,summary);eq(q.get().longStudyLevels.supportduration,8,'sustained milestone actually completes after360 days');
 ok(summary.studySpeedPurchases>=359,'360-day target retains every daily paid boost renewal');eq(q.get().motes,motes-summary.studyMotesSpent+summary.motesGained,'all360-day Mote payments conserved');
 records.push({firstUptimeDays8x:firstUptimeSeconds/DAY,fullTrackDays8x:durations.reduce((a,b)=>a+b,0)/(8*DAY),paidRenewals:summary.studySpeedPurchases});
 // Strength and other outputs are unchanged at every duration rank; cap is
 // effective only, preserving raw legacy ownership and already-cast records.
 for(const rank of [0,1,2,7,10,11,1000000])for(const ultimate of [false,true]){
  s=funded();s.longStudyLevels.supportduration=rank;s.wispUltimate.tide=s.wispUltimate.aurora=ultimate;q.set(s);
  eq(q.support(q.sp('tide')),{strength:ultimate?1.5:1.25,durationMs:3000+300*Math.min(rank,10)},'independent duration/strength oracle');
  eq(q.get().longStudyLevels.supportduration,rank,'raw paid ownership retained');
 }
 // Integrate each independent source's actual deadline over 20 natural cycles.
 // Through rank7 downtime exceeds active time; rank8 needs enough Charge Rate.
 for(const rank of [0,1,2,3,4,5,6,7,8,9,10])for(const charge of [0,1,2,5,10])for(const kind of ['live','offline']){
  const w=combat(html),b=w.q;s=funded();s.depth=s.enemyDepth=99;s.enemyHp=s.enemyMaxHp=1e100;s.research.charge=charge;s.longStudyLevels.supportduration=rank;
  s.heroResource.tide=s.heroResource.aurora=100;b.set(s);
  const cycle=Math.max(6/(1+.08*charge),[13,12.8,12.6,12.4,12.2,12,11.8,11.6,4.8,4.8,4.8][rank]),duration=3+.3*rank,castStarts={tide:[],aurora:[]};
  if(rank<8){ok(cycle-duration>duration,'inactive time exceeds active time through rank7');ok(2*duration/cycle<1,'even perfect two-source staggering cannot sustain early coverage');}
  if(rank===8){eq(duration>=cycle,charge>=2,'actual first sustained milestone still requires sufficient natural Charge');}
  let at=CLOCK;
  for(let i=0;i<20;i++){
   w.clock(at);b.abilities(kind,at);
   for(const id of ['tide','aurora']){
    eq(b.get().supportBuffs.sources[id].until,at+duration*1000,'actual future cast deadline');castStarts[id].push(at);
    // A fully charged support cannot recast early, even if the buff still lasts.
    b.get().heroResource[id]=100;const held=clone(b.get());b.cast(id,kind,at+10);eq(b.get(),held,'independent recast limit survives duration research');
   }
   const beforeNext=at+cycle*1000-1;
   const expected=duration>=cycle?2:1;near(b.buff(beforeNext),expected,'actual full-strength uptime threshold');
   at=b.get().supportRecastUntil.tide;
  }
  const expectedMult=1+Math.min(1,duration/cycle);near(b.averageBuff(99),expectedMult,'HUD time average at duration milestone');
  ok(b.supportDescription('tide').includes('for '+Number(duration.toFixed(1))+'s'),'Wisp description shows researched duration');
  ok(b.ultimateDescription('aurora').includes('for '+Number(duration.toFixed(1))+'s'),'Ultimate description shows researched duration');
  // The number on Rift is passive power, distinct from own Power and burst.
  near(b.chip('tide'),b.power('tide')*(1+50*.02)*1.2*2,'Rift chip includes passive research, ten owned Rarity tiers and both current Support buffs');
  records.push({rank,charge,kind,duration,cycle,continuous:duration>=cycle});
 }
 // Authoritative simulation parity through overlapping casts and expiries.
 for(const rank of [1,2,7,8,10]){
  s=funded();s.depth=s.enemyDepth=99;s.enemyHp=s.enemyMaxHp=1e100;s.longStudyLevels.supportduration=rank;
  function run(kind,steps){const w=combat(html);w.q.set(s);let now=CLOCK;for(const dt of steps){w.q.advance(dt,{kind,visual:false,clockStartMs:now,offlineWindowStartMs:CLOCK});now+=dt*1000;}return clone(w.q.get());}
  const whole=run('live',[60]),offline=run('offline',[60]),split=run('live',Array(60).fill(1));
  for(const field of ['supportBuffs','supportRecastUntil','heroResource']){
   const compare=(a,b,path)=>{if(typeof a==='number')near(a,b,path);else if(a&&typeof a==='object'){eq(Object.keys(a),Object.keys(b),path+' keys');for(const k of Object.keys(a))compare(a[k],b[k],path+'.'+k);}else eq(a,b,path);};
   compare(whole[field],offline[field],'live/offline '+field);compare(whole[field],split[field],'whole/split '+field);
  }
 }
 return {checks,records};
}
const controls=[
 ['free-uptime',"durationMs:3000+300*labExpansionLevel('supportduration')",'durationMs:6000'],
 ['early-sustained-rank','rank<8 ? 13-0.2*rank : 4.8','rank<2 ? 12-0.2*rank : 4.8'],
 ['rejected-three-second-gap','return Math.max(abilityCycleSeconds(),rank<8 ? 13-0.2*rank : 4.8);',"return Math.max(abilityCycleSeconds(),6-1.2*Math.min(2,labExpansionLevel('supportduration')));"],
 ['short-work','rankWorkSec:[55542858]','rankWorkSec:[86400]'],
 ['early-access','supportduration:{depth:500,studies:{wispdamage:50,ultimateanalysis:5}}','supportduration:{depth:1,studies:{}}'],
 ['no-duration',"durationMs:3000+300*labExpansionLevel('supportduration')",'durationMs:3000']
];
function run(html,negative){const result={status:'PASS',sourceSha256:crypto.createHash('sha256').update(html).digest('hex'),...verify(html),controls:[]};
 if(negative)for(const [name,a,b]of controls){assert.equal(html.split(a).length,2,'unique control '+name);let caught;try{verify(html.replace(a,b));}catch(e){caught=e.message;}assert(caught,'actual assertion catches '+name);result.controls.push({name,caught});}
 return result;
}
module.exports={run};
if(require.main===module)try{console.log(JSON.stringify(run(source,process.argv.includes('--negative'))));}
catch(e){console.log(JSON.stringify({status:'FAIL',error:e.stack}));process.exitCode=1;}
