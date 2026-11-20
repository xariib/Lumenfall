'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const F=require('./forge-expansion-harness.cjs'),L=require('./lab-expansion-harness.cjs'),A=require('../../scripts/lib/game-amount.cjs');
const original=fs.readFileSync(process.argv[2]||'index.html','utf8'),marker="if(document.readyState==='loading'){";
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
 for(const level of [0,4,10,19]){
  const pacing=1.18**Math.max(0,level-4),cost=b.moduleCost(sp,level);
  eq(cost,{lumen:Math.round(anchors[id]*4*1.35**level*pacing),shard:Math.round(anchors[id]*.4*1.35**level*pacing)},'independent ability price '+id+'/'+level);
 }
 const funded=q.fresh();funded.spirits[id]=200;funded.maxDepthEver=depth;funded.longStudyLevels.wispascend=lab;funded.ascendCount=100;funded.research.arcanecal=10;funded.lumen=funded.shards='1e100';
 q.set(funded);
 if(lab){
  for(let stage=0;stage<5;stage++){
   q.get().wispModules[id]=stage*4;const p=b.modulePlan(sp);eq(p.eligible,stage===0,'unlock alone cannot max ability '+id+'/'+stage);
   q.get().maxDepthEver=depth+5*stage;q.get().longStudyLevels.wispascend=lab+2*stage;
   ok(b.modulePlan(sp).affordable,'later research/Rift opens band '+id+'/'+stage);
   q.get().maxDepthEver=depth;q.get().longStudyLevels.wispascend=lab;
  }
  q.get().wispModules[id]=4;const before=F.clone(q.get());eq(b.module(sp),false,'unlimited wallet cannot bypass ability development');eq(q.get(),before,'locked ability does not mutate');
  eq(b.rarityPlan(sp).eligible,false,'unlock alone cannot immediately raise rarity '+id);
 }
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
 }
}
const rows=d.deedSeries(d.fresh());for(const key of ['roster','abilities','rarities','ultimates'])ok(rows.some(r=>r.key===key),'new Deed series '+key);
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(original).digest('hex'),anchors,gates}));
