'use strict';
// Execute the complete production game. Only presentation, clock and storage
// failures are controlled by the existing harness. All actions are real.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone,CLOCK,P,R}=require('./forge-expansion-harness.cjs');
const user=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/team-progression-user-save.json')));
const marker="if(document.readyState==='loading'){";
function world(html){
 assert.equal(html.split(marker).length,2);
 const w=app(html.replace(marker,`window.endlessQa={
   eligible:ascendEligible,next:nextAscendClearedRift,base:wispBaseDps,
   cycle:supportCycleSeconds,shop:function(){return SHOP;},plan:getCometBuyPlan,
   auto:checkAutoAscend,toggle:toggleAutoAscend,target:setAutoAscendClearedTarget,
   automatic:function(){return doAscend(true);},autoReady:autoAscendReady,
   rawEnable:function(){state.autoAscendEnabled=true;},idle:idleDps,
   field:toggleActive,
   globals:passiveGlobalPowerMult,normalize:normalizeCurrentSave
 };`+marker));
 w.t=w.q.endless;return w;
}
function verify(html){
 let checks=0;const records=[];
 const ok=(v,m)=>{checks++;assert(v,m);},eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);};
 const near=(a,b,m)=>ok(Math.abs(a-b)<=Math.max(1e-6,Math.max(Math.abs(a),Math.abs(b))*1e-11),m+': '+a+' / '+b);
 // Real supplied state, including paid clocks, four concurrent studies and two
 // paused studies. Retiring a paid unlock never consumes any other progression.
 const w=world(html),q=w.q,t=w.t;w.clock(user.lastSeen);q.set(user);
 eq(q.get().comets,120,'supplied save receives exactly100 retired Comets');
 eq(q.get().autoAscendRefund,{policy:'autoascend-retired-v1',total:100,paid:true},'durable owner refund receipt');
 for(const key of ['lumen','shards','prisms','motes','sigils','depth','maxDepthEver','farmDepth','farmReturnDepth','spirits','heroRarity','heroResource','wispModules','wispUltimate','wispMastery','recruitmentEntitlements','empowerQueue','activeParty','formationPresets','nodes','research','researchQueue','activeStudies','pausedStudies','studyBoosts','studyBoostQueue','studySlotProjects','supportBuffs','supportRecastUntil','ascendRewardedDepth','ascendCount','totalKills','totalTaps','dailyStats','questIds','questClaimed','lastSeen','offlineClockHighWaterMs','feedbackMigration','refundCredits','owned'])
   eq(q.get()[key],key==='prisms'?user.prisms+120:user[key],'supplied save preserves '+key+' with original sixth-slot refund');
 for(const key of ['longStudyLevels','studyQueue','studySpeedTargets','studyBoostHours'])for(const id of Object.keys(user[key]))eq(q.get()[key][id],user[key][id],'supplied study preference '+key+'/'+id);
 const accepted=clone(q.get());q.save();q.load();eq(q.get(),accepted,'cold owner reload never refunds twice');
 eq(q.decode(q.export()),accepted,'every migrated field survives backup round trip');
 w.storage.set(P,'broken');q.load();eq(q.get(),accepted,'recovery repairs owner save without duplicate refund');eq(w.storage.get(P),w.storage.get(R),'repaired slots equal');
 for(let i=0;i<5;i++){q.set(q.get());q.save();q.load();eq(q.get(),accepted,'repeated normalization/reload is idempotent '+i);}
 for(const receipt of [null,{policy:'wrong',total:100,paid:true},{policy:'autoascend-retired-v1',total:99,paid:false},{policy:'autoascend-retired-v1',total:100,paid:1}]){
  const bad=clone(accepted);bad.autoAscendRefund=receipt;checks++;assert.throws(()=>q.accept(bad),{code:'invalid-autoascend-refund'},'invalid receipts require recovery');
 }
 const fresh=q.accept(q.fresh());eq(fresh.comets,0,'new save no free Comets');eq(fresh.autoAscendRefund.total,0,'new save no refund entitlement');
 const wide=clone(user);wide.comets='1e400';q.set(wide);eq(q.get().comets,require('../../scripts/lib/game-amount.cjs').exactAdd('1e400',100),'wide owner balance receives exact Comets');q.save();q.load();eq(q.get().autoAscendRefund.paid,true,'wide owner receipt retained');
 q.set(user);eq(t.shop().map(n=>n.id),['astralcore','astralecho','astralconvergence'],'only permanent Astral investments remain');eq(t.plan('autoascend').available,false,'retired purchase unavailable');
 const before=clone(q.get());eq(t.toggle(),false,'retired toggle unavailable');eq(t.target('15'),false,'retired target unavailable');eq(t.automatic(),false,'direct automatic Ascend rejected');eq(q.get(),before,'retired actions are pure');
 // Forward-only eligibility, exact preview, Farm return depth and actual paid
 // reset. Old lifetime Ascend count never imposes an impossible migration gate.
 eq(t.next(),280,'user next rewarded clear is280, not9046 or record reset');eq(t.eligible(),false,'Farm return280 represents clear279');eq(q.prismPreview().gain,0,'user previously rewarded clear grantszero');
 for(const benchmark of [0,15,279,1000])for(const clear of [0,14,15,16,279,280,1001])for(const farm of [false,true]){
  const s=q.fresh();s.maxDepthEver=Math.max(clear,benchmark)+2;s.ascendRewardedDepth=benchmark;s.ascendCount=benchmark?9045:0;s.prisms=1000;s.lastSeen=CLOCK;s.questDay=q.day();
  s.depth=farm?1:clear+1;s.riftMode=farm?'farm':'push';s.farmDepth=farm?1:0;s.farmReturnDepth=farm?clear+1:0;s.enemyDepth=s.depth;s.enemyHp=s.enemyMaxHp=1e100;
  s.activeStudies=[{id:'wispascend',slot:0,remainingSec:123,totalDurationSec:1000,speedMult:1}];
  q.set(s);const allowed=clear>=Math.max(15,benchmark+1),initial=clone(q.get()),gain=q.prismPreview().gain;
  eq(t.eligible(),allowed,'independent eligibility '+benchmark+'/'+clear+'/'+farm);eq(gain>0,allowed,'independent preview gate');
  const success=q.ascend();eq(success,allowed,'actual manual gate');
  if(allowed){eq(q.get().prisms,1000+gain,'exact quoted manual credit');eq(q.get().ascendRewardedDepth,clear,'benchmark advances to actual clear');eq(q.get().ascendCount,initial.ascendCount+1,'one manual reset');eq(q.get().activeStudies,initial.activeStudies,'manual reset preserves paid work');}
  else eq(q.get(),initial,'rejected reset preserves every field');
 }
 for(const record of [Math.pow(2,53),1e30]){
  const s=q.fresh();s.depth=record+1;s.maxDepthEver=record*2;s.ascendRewardedDepth=record;q.set(s);const initial=clone(q.get());
  ok(t.next()>record,'legacy-wide record shows a strictly higher representable next Rift');eq(t.eligible(),false,'legacy-wide repeated clear cannot reset');eq(q.prismPreview().gain,0,'legacy-wide repeated clear haszero reward');eq(q.ascend(),false,'actual wide repeat is rejected');eq(q.get(),initial,'wide denial preserves all progress');
 }
 // Hostile imported ON state, plus hostile in-memory toggle, cannot create
 // online/offline resets or Prism rewards at a once-farmable tiny target.
 for(const kind of ['live','offline']){
  const x=world(html),s=x.q.fresh();s.lastSeen=CLOCK;s.questDay=x.q.day();s.owned.autoascend=true;s.autoAscendEnabled=true;s.autoAscendTargetDepth=16;s.spirits.ember=290;s.nodes.riftstep=5;
  s.maxDepthEver=280;s.depth=s.enemyDepth=16;s.enemyHp=s.enemyMaxHp=1;s.ascendRewardedDepth=15;
  x.q.set(s);eq(x.q.get().autoAscendEnabled,false,'imported ON is retired '+kind);x.t.rawEnable();eq(x.t.autoReady(),false,'runtime ON cannot revive reset');
  const wallet=x.q.get().prisms,count=x.q.get().ascendCount,result=x.q.advance(20,{kind,visual:false,clockStartMs:CLOCK});
  eq(result.ascends,0,'no scheduled reset '+kind);eq(x.q.get().ascendCount,count,'no lifetime reset increment '+kind);eq(x.q.get().prisms,wallet,'no automatic Prisms '+kind);ok(result.kills>0,'combat still progresses '+kind);
 }
 // Independent shared-growth oracle and useful marginal Empower for all roles.
 const weights={ember:1,tide:.8,stone:1.1,gale:.9,thorn:.9,void:1.15,aurora:.9,titan:1.25};
 const rarity=[1,1.5,2.25,3.5,5.5,9],shares=[],legalPartyShares=[];
 for(const level of [1,25,70,71,100,200,300,1000,9999]){
  const s=q.fresh();s.maxDepthEver=1000;s.depth=s.enemyDepth=101;s.enemyHp=s.enemyMaxHp=1e100;s.nodes.formationseat=1;s.activeParty=Object.keys(weights).slice(0,6);
  for(const id of Object.keys(weights)){s.spirits[id]=level;s.heroRarity[id]=3;}
  q.set(s);
  let total=0;const powers={};for(const id of Object.keys(weights)){
   const base=Math.min(26,q.sp(id).basePower),expected=(base*level*(1+.01*(level-1))+352*Math.max(0,level-70)**2*weights[id])*rarity[3];
   near(q.power(id),expected,'independent shared power '+id+'/'+level);ok(q.power(id,level+1)>q.power(id),'every Empower increases own Power '+id+'/'+level);powers[id]=q.power(id);total+=powers[id];
   if(id==='gale'||id==='thorn')near(q.resourcePower(id),q.sp(id).basePower*level*(1+.01*(level-1))*rarity[3],'independent original utility-resource curve '+id+'/'+level);
  }
  if(level>=100){for(const id of ['tide','gale','aurora'])ok(powers[id]/total>.08,'Support and utility retain material direct damage '+id+'/'+level);ok(powers.titan/total<.2,'Titan cannot dominate equal development');shares.push({level,shares:Object.fromEntries(Object.keys(powers).map(id=>[id,powers[id]/total]))});}
  if(level>=100)for(const ids of [['ember','tide','stone','gale','titan'],['ember','tide','stone','void','titan']]){
   const team=clone(q.get());// Preserve the original paid-node/refund receipt while testing legal five-Wisp teams.
   team.activeParty=ids;q.set(team);eq(q.get().activeParty,ids,'actual legal formation capacity '+ids.length);
   const sum=ids.reduce((n,id)=>n+q.chip(id),0),titanShare=q.chip('titan')/sum;near(sum,t.idle(),'legal formation DPS equals actual passive combat');
   ok(titanShare<(ids.length===5?.3:.25),'Titan cannot take over an equally developed legal party '+ids.length+'/'+level);
   for(const id of ids.filter(id=>['tide','gale'].includes(id)))ok(q.chip(id)/sum>.1,'Support/utility remain material in legal party '+id+'/'+ids.length+'/'+level);
   legalPartyShares.push({level,members:ids,titanShare});
  }
 }
 const recruitWorld=world(html),future=clone(user);future.longStudyLevels.wispascend=47;future.lumen=1e15;future.activeStudies=[];future.pausedStudies=[];for(const id of Object.keys(future.studyQueue))future.studyQueue[id]=false;
 recruitWorld.q.set(future);const recruitmentBefore=clone(recruitWorld.q.get()),recruitPrice=recruitWorld.q.empowerCost('titan');
 ok(recruitWorld.q.empower('titan'),'actual future Titan recruitment pays its original quote');eq(recruitWorld.q.get().lumen,recruitmentBefore.lumen-recruitPrice,'future recruitment debits Lumen exactly');if(!recruitWorld.q.get().activeParty.includes('titan'))ok(recruitWorld.t.field('titan'),'new recruit fields through actual handler');ok(recruitWorld.q.get().activeParty.includes('titan'),'new recruit is actually active');
 const recruitedTotal=recruitWorld.q.get().activeParty.reduce((n,id)=>n+recruitWorld.q.chip(id),0),recruitShare=recruitWorld.q.chip('titan')/recruitedTotal;
 ok(recruitShare>0&&recruitShare<.01,'active new Titan cannot take over the supplied developed roster');for(const id of user.activeParty)eq(recruitWorld.q.get().spirits[id],user.spirits[id],'recruitment preserves developed investment '+id);
 q.set(user);q.get().supportBuffs=null;const rows=user.activeParty.map(id=>({id,power:q.power(id),dps:q.chip(id)}));
 const total=rows.reduce((n,row)=>n+row.dps,0);near(total,t.idle(),'individual displayed DPS adds to actual passive combat');
 ok(rows.find(n=>n.id==='ember').power>Math.max(...rows.filter(n=>n.id!=='ember').map(n=>n.power)),'user Ember remains strongest');
 ok(rows.find(n=>n.id==='tide').dps/total>.1,'user Tide direct damage exceeds10%');ok(rows.find(n=>n.id==='gale').dps/total>.05,'user Gale direct damage exceeds5%');
 for(const depth of [176,180]){
  q.get().depth=depth;q.get().supportBuffs=null;const base=user.activeParty.map(id=>q.chip(id)),burst=user.activeParty.map(id=>q.abilityDamage(id));
  q.get().supportBuffs={version:1,sources:{tide:{until:user.lastSeen+10000,mult:1.3}}};
  user.activeParty.forEach((id,i)=>{near(q.chip(id),base[i]*1.3,'DPS includes contextual Bonds and current Support '+id+'/'+depth);near(q.chip(id),t.base(q.sp(id))*1.3,'base and current DPS reconcile');eq(q.abilityDamage(id),burst[i],'Support does not secretly multiply ability damage');});
  near(user.activeParty.reduce((sum,id)=>sum+q.chip(id),0),t.idle(),'display sums actual DPS in current Rift '+depth);
 }
 const contextual=q.fresh();contextual.maxDepthEver=1000;contextual.nodes.formationseat=1;contextual.longStudyLevels.wispascend=100;
 contextual.activeParty=['ember','void','stone','titan','gale','thorn'];for(const id of contextual.activeParty)contextual.spirits[id]=200;
 q.set(contextual);for(const depth of [176,180]){q.get().depth=depth;near(q.get().activeParty.reduce((sum,id)=>sum+q.chip(id),0),t.idle(),'all contextual Bond DPS reconciles '+depth);}
 // Actual cast limits with unlimited charge and both Support sources. Work
 // commitment is checked by the existing paid45/90/360-day Endurance regression.
 for(const rank of [0,1,2,7,8,10])for(const charge of [0,1,2,5,10]){
  const x=world(html),s=x.q.fresh();s.depth=s.enemyDepth=99;s.enemyHp=s.enemyMaxHp=1e100;s.maxDepthEver=1000;s.longStudyLevels.supportduration=rank;s.research.charge=charge;s.activeParty=['tide','aurora'];
  s.spirits.tide=s.spirits.aurora=100;s.heroResource.tide=s.heroResource.aurora=100;x.q.set(s);
  const cycle=Math.max(6/(1+.08*charge),[13,13,13,13,13,13,13,13,4.8,4.8,4.8][rank]),duration=3+.3*rank;near(x.t.cycle(),cycle,'independent Support recast floor');
  let now=CLOCK;
  for(let i=0;i<12;i++){
   x.clock(now);x.q.get().heroResource.tide=x.q.get().heroResource.aurora=100;x.q.abilities('offline',now);
   eq(x.q.get().supportRecastUntil.tide,now+cycle*1000,'actual Support deadline');eq(x.q.get().supportBuffs.sources.tide.until,now+duration*1000,'actual Support expiry');
   x.q.get().heroResource.tide=x.q.get().heroResource.aurora=100;const held=clone(x.q.get());x.q.cast('tide','offline',now+cycle*1000-1);eq(x.q.get(),held,'unlimited grants cannot bypass1ms before floor');
   now=x.q.get().supportRecastUntil.tide;
  }
  if(rank===0){eq(cycle,13,'unresearched Support always thirteen seconds');near(duration/cycle,3/13,'unresearched source follows independent3/13 uptime');}
  if(rank<8)ok(cycle-duration>duration,'downtime exceeds active duration before earned sustained milestone');
  if(rank===1)ok(duration<cycle,'one45-day level still cannot sustain');
  if(rank===2)ok(duration<cycle,'90-day investment no longer grants sustained uptime');
  if(rank===8)eq(duration>=cycle,charge>=2,'360-day milestone plus sufficient Charge opens sustained source');
 }
 // Save failure cannot commit a manual reset, resources or the new benchmark.
 q.set(user);q.get().riftMode='push';q.get().depth=281;q.get().enemyDepth=281;q.get().maxDepthEver=281;const initial=clone(q.get());
 w.fail(true,false);eq(q.ascend(),false,'failed primary rejects manual reset');eq(q.get(),initial,'primary failure fully rolls back');w.fail(false,false);
 const quoted=q.prismPreview().gain;
 w.fail(false,true);eq(q.ascend(),true,'primary commit owns reset when recovery write fails');eq(q.get().prisms,initial.prisms+quoted,'committed primary pays once');eq(q.get().ascendRewardedDepth,280,'committed primary owns new benchmark');w.fail(false,false);
 q.save();const committed=clone(q.get());q.load();eq(q.get(),committed,'recovery repair cannot duplicate committed reward');eq(w.storage.get(P),w.storage.get(R),'retry repairs both committed slots');
 records.push({userRoster:rows.map(row=>({...row,share:row.dps/total})),equalDevelopment:shares,legalPartyShares,newRecruit:{level:recruitWorld.q.get().spirits.titan,share:recruitShare}});
 return {checks,records};
}
const mutations=[
 ['early-uptime','return Math.max(abilityCycleSeconds(),rank<8 ? 13 : 4.8);','return abilityCycleSeconds();'],
 ['repeat-reset','return clearedProgressionRift()>=nextAscendClearedRift();','return clearedProgressionRift()>=15;'],
 ['repeat-preview','if(full<=0 || cleared<=benchmark){','if(full<=0){'],
 ['auto-reset','return false; // Automatic Ascension is retired, including imported ON states.','return true;'],
 ['duplicate-refund','retired.paid=true;','retired.paid=false;'],
 ['titan-monopoly','Math.min(26,sp.basePower)','sp.basePower'],
 ['missing-context','var shareMult = Amount.mul(passiveGlobalPowerMult(),formationContextDamageMult(state.depth));','var shareMult = Amount.mul(passiveGlobalPowerMult(),formationGeneralDamageMult());']
];
function run(html,negative){const result={status:'PASS',sourceSha256:crypto.createHash('sha256').update(html).digest('hex'),...verify(html),controls:[]};
 if(negative)for(const [name,a,b] of mutations){assert.equal(html.split(a).length,2,'unique mutation '+name);let caught;try{verify(html.replace(a,b));}catch(e){caught=e.message;}assert(caught,'actual assertion catches '+name);result.controls.push({name,caught});}
 return result;
}
module.exports={run,world};
if(require.main===module)try{console.log(JSON.stringify(run(fs.readFileSync(process.argv[2]||'index.html','utf8'),process.argv.includes('--negative'))));}catch(e){console.error(e);process.exitCode=1;}
