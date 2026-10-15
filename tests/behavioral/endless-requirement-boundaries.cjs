'use strict';
// Independent calibrated D tables: every Wisp, rarity tier and development gate.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const A=require('../../scripts/lib/game-amount.cjs'),{app,clone}=require('./forge-expansion-harness.cjs');
const source=fs.readFileSync(process.argv[2],'utf8'),x=app(source.replace("if(document.readyState==='loading'){",'window.endlessQa={rarity:getWispRarityPlan,buyRarity:buyRarity,ultimate:getWispUltimatePlan,mastery:getWispMasteryPlan,buyMastery:buyWispMastery};if(document.readyState===\x27loading\x27){')),q=x.q,b=q.endless;
const ids=['ember','tide','stone','gale','thorn','void','aurora','titan'],levels=[8,25,50,90,140],depths=[5,15,35,70,100],ascends=[0,1,5,15,40],labs=[0,5,15,40,78],forges=[0,1,3,6,10],lumenBase=[10,60,360,2100,12000,70000,400000,2200000],rarityMult=[8,50,1000,50000,2500000],shards=[15,1500,150000,5000000,250000000],ultimates=[40000000,50000000,65000000,85000000,110000000,140000000,180000000,240000000];
let checks=0;function eq(a,c,m){checks++;assert.deepEqual(a,c,m);}function ok(a,m){checks++;assert(a,m);}
function seed(id){const s=q.fresh();s.lumen=s.shards=s.prisms=s.sigils='1e400';s.spirits[id]=140;s.heroRarity[id]=5;s.wispModules[id]=20;s.wispUltimate[id]=true;return s;}
function setGate(s,id,key,value,mastery){if(key==='level')s.spirits[id]=value;else if(key==='rarity')s.heroRarity[id]=value;else if(key==='module')s.wispModules[id]=value;else if(key==='depth')s.maxDepthEver=value;else if(key==='ascends')s.ascendCount=value;else if(key==='lab')s.longStudyLevels.wispascend=value;else if(key==='forge')s.research[mastery?'masterwork':'arcanecal']=value;else if(key==='tree')s.nodes.swift=value;else throw Error(key);}
function boundaries(s,id,requirements,plan,buy,mastery){
 for(const [key,target]of Object.entries(requirements))setGate(s,id,key,target,mastery);q.set(s);
 eq(Object.fromEntries(plan().requirements.map(r=>[r.key,r.target])),requirements,id+' independent requirements');ok(plan().affordable,id+' exact requirement boundary');
 for(const [key,target]of Object.entries(requirements)){if(!target)continue;const missing=clone(s);setGate(missing,id,key,target-1,mastery);q.set(missing);const before=clone(q.get());eq(plan().affordable,false,id+' below '+key);eq(buy(),false,id+' purchase rejects missing '+key);eq(q.get(),before,id+' missing '+key+' is atomic');}q.set(s);
}
for(const [index,id]of ids.entries()){
 const sp=q.sp(id);
 for(let tier=0;tier<5;tier++){
  const s=seed(id);s.heroRarity[id]=tier;s.wispUltimate[id]=false;
  boundaries(s,id,{level:levels[tier],depth:depths[tier],ascends:ascends[tier],lab:labs[tier]+Math.floor(index*tier/2),forge:forges[tier]},()=>b.rarity(sp),()=>b.buyRarity(sp),false);
  const cost={lumen:lumenBase[index]*rarityMult[tier],shard:shards[tier]};eq(b.rarity(sp).cost,cost,id+' independent rarity price');ok(b.buyRarity(sp),id+' real rarity purchase');eq(q.get().heroRarity[id],tier+1,id+' exactly one rarity');eq(q.get().lumen,A.exactSub('1e400',cost.lumen),id+' exact rarity Lumen');eq(q.get().shards,A.exactSub('1e400',cost.shard),id+' exact rarity Shards');
 }
 {
  const s=seed(id);s.wispUltimate[id]=false;
  boundaries(s,id,{rarity:5,module:15,depth:120,ascends:50,lab:84+12*index,forge:10},()=>b.ultimate(sp),()=>q.ultimate(id),false);
  eq(b.ultimate(sp).cost,ultimates[index],id+' independent Ultimate price');ok(q.ultimate(id),id+' real Ultimate purchase');eq(q.get().sigils,A.exactSub('1e400',ultimates[index]),id+' exact Ultimate debit');
 }
 for(const rank of [0,4,5,9,10,99,10000]){
  const s=seed(id);s.wispMastery[id]=rank;
  boundaries(s,id,{depth:200+25*rank,lab:84+Math.floor(rank/5),forge:Math.ceil((rank+1)/5),tree:10+Math.floor(rank/10)},()=>b.mastery(sp),()=>b.buyMastery(sp),true);
  for(const [key,value]of [['rarity',4],['module',19],['ultimate',false]]){const missing=clone(s);if(key==='ultimate')missing.wispUltimate[id]=value;else setGate(missing,id,key,value,true);if(rank>0){const before=clone(q.get());assert.throws(()=>q.accept(missing),/Incomplete Wisp Mastery prerequisites/,'existing ranks cannot load incomplete prerequisites');checks++;eq(q.get(),before,id+' rejected invalid save retains current state');continue;}q.set(missing);const before=clone(q.get());eq(b.mastery(sp).affordable,false,id+' Mastery needs '+key);eq(b.buyMastery(sp),false,id+' incomplete Wisp cannot buy Mastery');eq(q.get(),before,id+' ready gate is atomic');}
  q.set(s);const power=q.power(id),support=q.supportProfile(id);eq(b.mastery(sp).cost,{prism:20000+1000*rank,sigil:500000+50000*rank},id+' independent Mastery price');ok(b.buyMastery(sp),id+' real Mastery purchase');eq(q.get().wispMastery[id],rank+1,id+' exactly one rank');eq(q.get().prisms,A.exactSub('1e400',20000+1000*rank),id+' exact Prism debit');eq(q.get().sigils,A.exactSub('1e400',500000+50000*rank),id+' exact Sigil debit');ok(Math.abs(A.ratio(q.power(id),power)-1.1)<1e-12,id+' own Power compounds10%');eq(q.supportProfile(id),support,id+' ability timing/effect contract retained');
 }
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),wisps:8,rarityCases:40,ultimateCases:8,masteryCases:56,limits:'Independent D requirement and exact price boundaries. Campaign pacing, UI and device acceptance are separate.'}));
