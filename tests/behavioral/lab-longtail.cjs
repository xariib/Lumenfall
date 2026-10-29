'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,seed,clone,P,R}=require('./lab-expansion-harness.cjs');
const {days}=require('./lab-longtail-reference.cjs');
const file=process.argv[2]||'index.html',source=fs.readFileSync(file,'utf8'),T=2000000000000,DAY=86400;
function verify(html){
 let checks=0;const ok=(v,m)=>{checks++;assert(v,m);},eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);};
 const near=(a,b,m)=>ok(Math.abs(a-b)<=Math.max(1,Math.abs(b))*1e-10,m+': '+a+' vs '+b);
 const x=app(html),q=x.q,defs=q.projects(),records=[];
 function rich(){const s=seed(q);s.lumen=s.shards='1e400';s.motes=1e12;s.activeParty=[];s.longStudyLevels.measuredinquiry=10;for(const d of q.expansion())s.longStudyLevels[d.id]=d.levelCap;return s;}
 // Optimistic lower bound: all work reductions, five slots with only one busy,
 // unlimited funding and a continuously renewed real8x paid slot boost.
 for(const [id,minimumDays]of Object.entries(days)){
  const d=defs.find(n=>n.id===id);ok(d&&!d.retiredTo,'available pacing track '+id);
  const s=rich();s.longStudyLevels[id]=0;s.studyQueue[id]=true;q.set(s);x.clock(T);
  const durations=Array.from({length:d.levelCap},(_,l)=>q.duration(id,l));
  ok(durations.every((v,i)=>Number.isSafeInteger(v)&&v>0&&(!i||v>=durations[i-1])),'finite monotonic work '+id);
  const fastest=durations.reduce((a,b)=>a+b,0)/8;
  ok(fastest>=minimumDays*DAY,'full track minimum at8x with all reductions '+id);
  ok(fastest<minimumDays*DAY+DAY,'no accidental multi-year tail on specialist '+id);
  const factor=id==='focusprotocol'?0.7:id==='curriculum'?0.8:0.56;
  for(const l of [0,1])near(durations[l],Math.round(Math.round(d.baseDurationSec*Math.pow(d.durationGrowth,l))*factor),'accessible first two levels '+id+'/'+l);
  ok(q.startAt(id,0),'actual funded queue starts '+id);ok(q.boost(id,8,24),'actual8x paid boost '+id);
  ok(q.boostPreference(id,8,24,true),'continuous boost consent '+id);
  const wallet=q.get().motes,summary=q.summary(0);
  q.studyOnly(fastest-1,T,summary);
  ok(q.get().longStudyLevels[id]<d.levelCap,'cannot max before full work at8x '+id);
  ok(summary.studySpeedPurchases>0,'long queue crosses paid boost renewals '+id);
  eq(q.get().motes,wallet-summary.studyMotesSpent+summary.motesGained,'renewals and Notes conserve Motes '+id);
  q.save();const held=clone(q.get().activeStudies);q.load();eq(q.get().activeStudies,held,'long paid work survives reload '+id);
  q.studyOnly(2,T+(fastest-1)*1000,summary);
  eq(q.get().longStudyLevels[id],d.levelCap,'whole track eventually maxes '+id);
  ok(!q.get().activeStudies.some(a=>a.id===id),'maxed queue closes '+id);
  records.push({id,levels:d.levelCap,fastestDays8x:fastest/DAY,lastLevelDays8x:durations.at(-1)/(8*DAY),renewals:summary.studySpeedPurchases});
 }
 for(const id of ['wispascend','guardmastery','shardstudy','lumenstudy','motestudy']){
  q.set(rich());const d=defs.find(n=>n.id===id),total=Array.from({length:d.levelCap},(_,l)=>q.duration(id,l)).reduce((a,b)=>a+b,0)/(8*DAY);
  ok(total>=270,'existing500-level foundation remains a months-long track '+id);records.push({id,levels:d.levelCap,fastestDays8x:total});
 }
 // New expansion work is substantial; already-paid work is grandfathered below.
 q.set(seed(q));eq(q.duration('labcapacity',0),1296000,'first expansion uses15days nominal work');eq(q.duration('labcapacity',1),8640000,'second expansion uses100days nominal work');
 const old=seed(q);old.longStudyLevels.bossledger=15;old.longStudyLevels.procurement=4;
 old.activeStudies=[{id:'bossledger',slot:0,remainingSec:720,totalDurationSec:1000,speedMult:3}];
 old.pausedStudies=[{id:'procurement',remainingSec:300,totalDurationSec:500,speedMult:4}];
 old.studyBoosts.slot0={mult:8,startedAtMs:T,expiresAtMs:T+DAY*1000};q.set(old);q.save();
 const paid=clone(q.get());q.load();eq(q.get(),paid,'whole old save survives unchanged after canonical defaults');
 q.ascend();eq(q.get().activeStudies,paid.activeStudies,'Ascend preserves old active work');eq(q.get().pausedStudies,paid.pausedStudies,'Ascend preserves old paused work');eq(q.get().longStudyLevels,paid.longStudyLevels,'Ascend preserves all earned research');
 ok(q.startAt('procurement',1),'resume old paid short work');eq(q.get().activeStudies.find(a=>a.id==='procurement').remainingSec,300,'resume does not apply new long work');
 eq(q.get().activeStudies.find(a=>a.id==='procurement').speedMult,4,'resume retains paid floor');
 // Additive saves: no free levels, spending consent, boost or damage in old saves.
 const legacy=seed(q);for(const id of ['wispdamage','wispcritchance','wispcritdamage'])for(const field of ['longStudyLevels','studyQueue','studyUseMotes','studySpeedTargets','studyBoostHours'])delete legacy[field][id];
 q.set(legacy);for(const id of ['wispdamage','wispcritchance','wispcritdamage']){eq(q.get().longStudyLevels[id],0,'new track starts unpurchased '+id);eq(q.get().studyQueue[id],false,'new research defaults OFF '+id);}
 // Damage reaches passive and every damaging ability, never own Power or rewards.
 const combat=seed(q);combat.spirits.ember=50;combat.spirits.tide=50;combat.spirits.gale=50;combat.spirits.thorn=50;combat.activeParty=['ember','tide','gale','thorn'];q.set(combat);
 const snapshot=()=>({passive:q.power(),tap:q.tap(),own:q.ownPower(q.sp('ember'),50),support:q.support(q.sp('tide')),burst:['ember','stone','gale','thorn','void','titan'].map(id=>q.burst(q.sp(id),50)),rewards:['gale','thorn'].map(id=>q.ability(q.sp(id),50))});
 const before=snapshot();
 for(const [damage,chance,critical]of [[1,0,0],[0,1,0],[0,0,1],[20,40,50],[100,100,100],[101,101,101]]){
  const s=clone(combat);Object.assign(s.longStudyLevels,{wispdamage:damage,wispcritchance:chance,wispcritdamage:critical});q.set(s);
  const factor=(1+Math.min(damage,100)*.02)*(1+Math.min(chance,100)*.005*(1+Math.min(critical,100)*.02)),after=snapshot();
  near(after.passive,before.passive*factor,'passive damage factor');near(after.tap,(5+before.passive*.02*factor)*before.tap/(5+before.passive*.02),'Wisp part of tap only');
  eq(after.own,before.own,'damage research leaves own Power unchanged');eq(after.support,before.support,'damage research leaves Support unchanged');
  after.burst.forEach((v,i)=>near(v,before.burst[i]*factor,'damage ability factor '+i));eq(after.rewards,before.rewards,'critical research never multiplies currency payouts');
 }
 q.set(combat);const unpaid=q.power();ok(q.start('wispdamage'),'actual damage research payment');eq(q.power(),unpaid,'no damage before completion');q.finish(240);near(q.power(),unpaid*1.02,'completed damage applies immediately');
 const earned=clone(q.get());q.save();x.storage.set(P,'broken');q.load();eq(q.get(),earned,'recovery retains earned damage');
 // Full authoritative simulator agrees on new damage over identical time windows.
 const parity=clone(combat);parity.depth=parity.enemyDepth=parity.farmDepth=39;parity.riftMode='farm';parity.farmReturnDepth=40;parity.longStudyLevels.wispdamage=10;parity.longStudyLevels.wispcritchance=20;parity.longStudyLevels.wispcritdamage=10;
 function simulate(kind,parts){q.set(parity);let clock=T;for(const dt of parts){q.advance(dt,{kind,clockStartMs:clock});clock+=dt*1000;}return clone(q.get());}
 const whole=simulate('live',[60]),split=simulate('live',Array(60).fill(1)),offline=simulate('offline',[60]);
 for(const key of ['totalKills','enemyHp','heroResource','luminousAccum']){if(typeof whole[key]==='number')near(split[key],whole[key],'split critical combat '+key);else eq(split[key],whole[key],'split critical combat '+key);eq(offline[key],whole[key],'offline critical combat '+key);}
 return {checks,records};
}
const controls=[
 ['short-tail',"if(node.tailWorkSec && level>1)","if(false && node.tailWorkSec && level>1)"],
 ['missing-passive','longStudyPowerMult() * wispStudyDamageMult()','longStudyPowerMult()'],
 ['missing-ability',"researchFactor('arcanecal')*astralFactor('astralecho')*wispStudyDamageMult()","researchFactor('arcanecal')*astralFactor('astralecho')"],
 ['ignored-critical','1+chance*(critical-1)','1+chance*0']
];
let result;try{result={status:'pass',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),...verify(source),controls:[]};if(process.argv.includes('--negative'))for(const [name,from,to]of controls){assert.equal(source.split(from).length,2,'unique control '+name);let caught;try{verify(source.replace(from,to));}catch(e){caught=e.message;}assert(caught,'control detected '+name);result.controls.push({name,detected:caught});}}
catch(e){result={status:'fail',error:e.stack};process.exitCode=1;}console.log(JSON.stringify(result));
