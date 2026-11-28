'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const F=require('./forge-expansion-harness.cjs'),L=require('./lab-expansion-harness.cjs'),A=require('../../scripts/lib/game-amount.cjs');
let original=fs.readFileSync(process.argv[2]||'index.html','utf8');
const mutants={
 cheap:['return lab>1 ? Math.max(sp.baseCost,Math.round(800*Math.pow(1.6,lab))) : sp.baseCost;','return sp.baseCost;'],
 sixth:['function treeFormationCapacity(snapshot){return 5;}','function treeFormationCapacity(snapshot){return 6;}'],
 repeatRefund:['if(!out.formationSeatRefund.paid){','if(true){'],
 abilityGate:["var requirements=rule.lab ? [wispRequirement('depth'","var requirements=false ? [wispRequirement('depth'"],
 finalAbilityRarity:['if(rarity)requirements.push(', 'if(false)requirements.push('],
 finalAbilityPrice:['*Math.pow(2,finalLevels);', ';'],
 repeatDeed:['if(!state.achieved[a.id] && a.check(state)){','if(a.check(state)){'],
 earnedAccess:['function applyAchievementChecks(){\n  synchronizeRecruitmentEntitlements(state);','function applyAchievementChecks(){']
};
if(process.env.WISP_GAMEPLAY_MUTANT){const pair=mutants[process.env.WISP_GAMEPLAY_MUTANT];assert(pair);assert.equal(original.split(pair[0]).length,2);original=original.replace(pair[0],pair[1]);}
const marker="if(document.readyState==='loading'){";
const source=original.replace(marker,`window.endlessQa={recruit:wispRecruitmentUnlocked,capacity:treeFormationCapacity,
 modulePlan:getWispModulePlan,module:buyModule,rarityPlan:getWispRarityPlan,rarity:buyRarity,
 rarityCost:rarityCost,moduleCost:moduleCost,base:wispInvestmentBase,tree:getNodeBuyPlan,
 field:toggleActive,deeds:function(){return ACHIEVEMENTS;},series:deedSeries,check:applyAchievementChecks,
 progress:deedProgress,bar:deedBarProgress,summary:wispAbilitySummary};`+marker);
let checks=0;const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);},ok=(v,m)=>{checks++;assert(v,m);};
const x=F.app(source),q=x.q,b=q.endless;
const anchors={ember:10,tide:60,stone:360,gale:2361183,thorn:39614081,void:664613998,aurora:6968982875,titan:3138550867693};
const gates={ember:[1,0,0],tide:[5,0,25],stone:[10,1,100],gale:[15,17,0],thorn:[35,23,0],void:[55,29,0],aurora:[75,34,0],titan:[100,47,0]};
eq(q.fresh().activeParty,['ember'],'one starting Wisp');eq(Object.values(q.fresh().spirits).reduce((a,b)=>a+b),1,'exactly Ember level1');
{
 const s=q.fresh();s.maxDepthEver=5;s.totalKills=24;q.set(s);b.check();eq(q.get().recruitmentEntitlements.tide,false,'one defeat below earned access');
 q.get().totalKills=25;b.check();eq(q.get().recruitmentEntitlements.tide,true,'earned access is recorded at the authoritative reward check');
 ok(q.save(),'earned access saves');q.load();eq(q.get().recruitmentEntitlements.tide,true,'earned access survives cold load');
}
for(const [id,[depth,lab,kills]]of Object.entries(gates)){
 const sp=q.sp(id),s=q.fresh();s.maxDepthEver=depth;s.longStudyLevels.wispascend=lab;s.totalKills=kills;s.lumen=anchors[id];q.set(s);
 eq(b.recruit(sp),true,'earned access '+id);eq(b.base(sp),anchors[id],'independent unlock-economy anchor '+id);
 if(id!=='ember'){
  eq(q.empowerCost(id),anchors[id],'exact recruitment cost '+id);ok(q.empower(id),'actual paid recruit '+id);eq(q.get().lumen,0,'exact recruit debit '+id);
  for(const key of ['maxDepthEver','totalKills','longStudyLevels']){
   if(key==='maxDepthEver'&&depth===1||key==='totalKills'&&!kills||key==='longStudyLevels'&&!lab)continue;
   const below=F.clone(s);if(key==='longStudyLevels')below[key].wispascend--;else below[key]--;q.set(below);const before=F.clone(q.get());
   eq(b.recruit(sp),false,'one missing gate '+id+'/'+key);eq(q.empower(id),false,'cannot bypass '+id+'/'+key);eq(q.get(),before,'rejection is pure');
  }
 }
 // All costs grow from fixed anchors and remain independent of the wallet.
 for(let level=0;level<20;level++){
  const pacing=1.18**Math.max(0,level-4)*2**Math.max(0,level-14),cost=b.moduleCost(sp,level);
  eq(cost,{lumen:Math.round(anchors[id]*4*1.35**level*pacing),shard:Math.round(anchors[id]*.4*1.35**level*pacing)},'independent ability price '+id+'/'+level);
 }
 const funded=q.fresh();funded.spirits[id]=200;funded.heroRarity[id]=5;funded.maxDepthEver=depth;funded.longStudyLevels.wispascend=lab;funded.ascendCount=100;funded.research.arcanecal=10;funded.lumen=funded.shards='1e100';
 q.set(funded);
 if(lab){
  for(let stage=0;stage<5;stage++){
   q.get().wispModules[id]=stage*4;const p=b.modulePlan(sp);eq(p.eligible,stage===0,'unlock alone cannot max ability '+id+'/'+stage);
   q.get().maxDepthEver=depth+5*stage;q.get().longStudyLevels.wispascend=lab+2*stage;
   ok(b.modulePlan(sp).affordable,'later research/Rift opens band '+id+'/'+stage);
   q.get().maxDepthEver=depth;q.get().longStudyLevels.wispascend=lab;
  }
  q.get().wispModules[id]=4;const before=F.clone(q.get());eq(b.module(sp),false,'unlimited wallet cannot bypass ability development');eq(q.get(),before,'locked ability does not mutate');
  q.get().heroRarity[id]=0;
  eq(b.rarityPlan(sp).eligible,false,'unlock alone cannot immediately raise rarity '+id);
 }
 // Give the Wisp plenty of progress for its old gates, then isolate its new rarity gate.
 const staged=q.fresh();staged.spirits[id]=200;staged.maxDepthEver=1000;staged.longStudyLevels.wispascend=200;
 staged.wispModules[id]=14;q.set(staged);
 const level15=b.moduleCost(sp,14);q.get().lumen=level15.lumen;q.get().shards=level15.shard;
 ok(b.module(sp),'level 15 is available at Common with existing gates met '+id);
 for(const [rank,rarity] of [[16,3],[17,3],[18,4],[19,4],[20,5]]){
  const current=q.get(),cost=b.moduleCost(sp,rank-1);
  current.heroRarity[id]=rarity-1;current.lumen=cost.lumen;current.shards=cost.shard;
  const before=F.clone(current),slots=Array.from(x.storage);
  eq(b.modulePlan(sp).reason,'requirements','final ability rarity gate '+id+'/'+rank);
  eq(b.module(sp),false,'price alone cannot bypass rarity '+id+'/'+rank);
  eq(q.get(),before,'rarity rejection does not change the state '+id+'/'+rank);
  eq(Array.from(x.storage),slots,'rarity rejection does not change either save '+id+'/'+rank);
  current.heroRarity[id]=rarity;
  current.lumen=A.exactSub(cost.lumen,1);
  eq(b.modulePlan(sp).reason,'funds','final ability Lumen one short '+id+'/'+rank);
  current.lumen=cost.lumen;current.shards=A.exactSub(cost.shard,1);
  eq(b.modulePlan(sp).reason,'funds','final ability Shards one short '+id+'/'+rank);
  current.shards=cost.shard;
  ok(b.module(sp),'exact price buys final ability rank '+id+'/'+rank);
  eq([q.get().wispModules[id],q.get().lumen,q.get().shards],[rank,0,0],'all of both quoted amounts debited '+id+'/'+rank);
 }
 eq(b.modulePlan(sp).reason,'maxed','cap stays at 20 '+id);
 const capped=F.clone(q.get());q.load();eq(q.get(),capped,'maxed rank persists through cold load '+id);
 const legacy=F.clone(staged);legacy.heroRarity[id]=0;legacy.wispModules[id]=19;q.set(legacy);
 ok(q.save(),'old rank can be resaved below the new rarity requirement '+id);q.load();
 eq(q.get().wispModules[id],19,'older paid rank survives cold load '+id);
 const paid=q.fresh();paid.spirits[id]=99;paid.heroRarity[id]=5;paid.wispModules[id]=20;paid.wispUltimate[id]=true;paid.wispMastery[id]=4;paid.recruitmentEntitlements[id]=true;
 q.set(paid);for(const key of ['spirits','heroRarity','wispModules','wispUltimate','wispMastery'])eq(q.get()[key][id],paid[key][id],'preserve paid '+id+'/'+key);
 eq(b.recruit(sp),true,'preserve old access '+id);
}
// Actual module/rarity payment, rollback and save endpoint for the reported Thorn case.
{
 const s=q.fresh();s.maxDepthEver=1000;s.longStudyLevels.wispascend=300;s.ascendCount=100;s.research.arcanecal=10;s.spirits.thorn=200;s.lumen=s.shards=1e15;q.set(s);
 for(const key of ['module','rarity']){
  const p=b[key+'Plan'](q.sp('thorn')),before=F.clone(q.get()),disk=Array.from(x.storage);x.fail(true,true);
  eq(b[key](q.sp('thorn')),false,'failed primary write rolls back '+key);eq(q.get(),before,'failed purchase preserves every field '+key);eq(Array.from(x.storage),disk,'failed purchase preserves both slots '+key);x.fail(false,false);
  ok(b[key](q.sp('thorn')),'real Thorn purchase '+key);eq(q.get().lumen,before.lumen-p.cost.lumen,'exact Thorn Lumen '+key);eq(q.get().shards,before.shards-p.cost.shard,'exact Thorn Shards '+key);const endpoint=F.clone(q.get());q.load();eq(q.get(),endpoint,'cold paid endpoint '+key);
 }
}
// Five-slot migration benches the sixth member; paid progression survives.
{
 const s=q.fresh();s.nodes.formationseat=1;s.prisms=9;s.activeParty=['ember','tide','stone','gale','thorn','void'];Object.keys(s.formationPresets).forEach(k=>s.formationPresets[k]=s.activeParty.slice());s.activeParty.forEach(id=>{s.spirits[id]=100;s.wispModules[id]=15;});
 q.set(s);eq(b.capacity(),5,'paid sixth slot cannot lift cap');eq(q.get().activeParty,s.activeParty.slice(0,5),'first five stay Active');eq(q.get().spirits.void,100,'sixth Wisp remains owned');eq(q.get().wispModules.void,15,'sixth Wisp upgrades kept');eq(q.get().prisms,129,'original120Prisms returned once');
 Object.values(q.get().formationPresets).forEach(ids=>eq(ids,s.activeParty.slice(0,5),'preset bounded atfive'));
 const expected=F.clone(q.get());ok(q.save(),'save five-slot migration');q.load();eq(q.get(),expected,'idempotent refund/reload');eq(b.field('void'),false,'cannot field sixth');
 const receipt=F.clone(expected);receipt.formationSeatRefund.total=121;checks++;assert.throws(()=>q.accept(receipt),{code:'invalid-formation-refund'});
 const wide=F.clone(s);wide.prisms='1e400';q.set(wide);eq(q.get().prisms,A.exactAdd('1e400',120),'wide wallet preserves full refund');
}
// Continued goals retain old identities; exact powers of two advance at boundary.
const z=L.app(original),d=z.q;
for(const [key,base,reward,field]of [['strikes',10000,20,'totalTaps'],['rift',1000000,140,'maxDepthEver']]){
 for(const stage of [1,2,3,10,40]){
  const s=d.fresh();const target=base*2**stage;s[field]=key==='strikes'?A.exactSub(target,1):target-Math.max(1,target*Number.EPSILON);d.set(s);d.achievements();
  let row=d.deedSeries(d.get()).find(r=>r.key===key);eq(row.next.id,'continuing_'+key+'_'+stage,'just below doubling milestone '+key+'/'+stage);
  eq(row.next.reward,reward+5*stage,'reward rises with stage');const before=d.get().comets;d.get()[field]=target;d.achievements();eq(d.get().comets,before+reward+5*stage,'exact boundary pays once');
  row=d.deedSeries(d.get()).find(r=>r.key===key);eq(row.next.id,'continuing_'+key+'_'+(stage+1),'always has a further target');ok(A.gt(row.next.target,target),'next target increases');
  const endpoint=F.clone(d.get());d.achievements();eq(d.get(),endpoint,'continued grant idempotent');ok(d.save(),'continuous receipt saves');const loaded=L.app(original,z.storage).q;loaded.achievements();eq(loaded.get(),endpoint,'cold continuing reward never repeats');
  const lower=F.clone(endpoint);lower[field]=key==='rift'?1:0;d.set(lower);d.achievements();
  eq(d.get().comets,endpoint.comets,'lower counter preserves paid continuing receipts');
  eq(d.deedSeries(d.get()).find(r=>r.key===key).next.id,'continuing_'+key+'_'+(stage+1),'cached catalog retains the next goal after a lower counter');
  ok(d.save(),'lower-counter receipts save');const lowerCold=L.app(original,z.storage).q;lowerCold.achievements();
  eq(lowerCold.deedSeries(lowerCold.get()).find(r=>r.key===key).next.id,'continuing_'+key+'_'+(stage+1),'cold catalog restores receipt frontier independently of its counter');
 }
}
const rows=d.deedSeries(d.fresh());for(const key of ['roster','abilities','rarities','ultimates'])ok(rows.some(r=>r.key===key),'new Deed series '+key);
// Current-price automation and continuing Deeds share one chronological owner.
// Compare actual offline catch-up with120 one-second foreground segments.
{
 const whole=F.app(original),parts=F.app(original),s=whole.q.fresh();s.lastSeen=F.CLOCK;s.questDay=whole.q.day();
 s.maxDepthEver=100;s.depth=s.enemyDepth=s.farmDepth=39;s.farmReturnDepth=100;s.riftMode='farm';s.nodes.echo=6;
 s.lumen=100000000;s.shards=100000;s.spirits.ember=80;s.totalTaps=19990;s.achieved.autotap=s.achieved.labmaster=true;
 s.longStudyLevels.wispascend=23;s.recruitmentEntitlements.thorn=true;s.nodes.recruitreserve=5;
 s.formationPresets.push=['ember','thorn'];s.formationRebuild={members:['ember','thorn'],preset:'push'};
 s.activeStudies=[{id:'guardmastery',slot:0,remainingSec:200,totalDurationSec:200,speedMult:1}];
 whole.q.set(s);parts.q.set(s);whole.q.restoreEnemy();parts.q.restoreEnemy();
 whole.q.advance(120,{kind:'offline',clockStartMs:F.CLOCK,offlineWindowStartMs:F.CLOCK});
 for(let i=0;i<120;i++)parts.q.advance(1,{kind:'live',clockStartMs:F.CLOCK+i*1000,offlineWindowStartMs:F.CLOCK});
 for(const key of ['spirits','lumen','shards','sigils','comets','achieved','cometClaims','activeParty','formationPresets','wispModules','heroRarity','wispUltimate','activeStudies','pausedStudies','studyBoosts','nodes','research','totalTaps','totalKills'])eq(whole.q.get()[key],parts.q.get()[key],'new-price offline/foreground endpoint '+key);
 ok(whole.q.get().spirits.thorn>0,'funded current-price automation really recruits Thorn');ok(whole.q.get().lumen<s.lumen,'actual automation spends paid Lumen');
 eq(whole.q.get().achieved.continuing_strikes_1,true,'offline Strikes crosses continuing milestone once');
}
const controls=[];
if(process.argv.includes('--negative'))for(const name of Object.keys(mutants)){
 const result=require('node:child_process').spawnSync(process.execPath,[__filename,process.argv[2]||'index.html'],{encoding:'utf8',env:{...process.env,WISP_GAMEPLAY_MUTANT:name}});
 assert.equal(result.status,1,'causal control fails '+name);assert.match(result.stderr,/AssertionError/,'control reaches real assertion '+name);controls.push({name,status:'caught'});
}
console.log(JSON.stringify({status:'PASS',checks,controls,sourceSha256:crypto.createHash('sha256').update(original).digest('hex'),anchors,gates}));
