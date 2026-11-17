'use strict';
// Read-only current-product audit. Deliberately not a calendar pacing claim.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const F=require('../../tests/behavioral/forge-expansion-harness.cjs');
const A=require('../lib/game-amount.cjs');
const file=process.argv[2]||'index.html',html=fs.readFileSync(file,'utf8');
const catalogue=F.app(html).q.defs().filter(n=>!n.retiredTo).map(n=>({
 id:n.id,name:n.name,group:n.forgeGroup||'Foundations',unlock:n.unlockDepth||1,
 cap:n.endless?'endless':n.levelCap,effectPerLevel:n.effectPerLevel,
 lumenBase:n.lumenBase,shardBase:n.shardBase,lumenGrowth:n.lumenGrowth,shardGrowth:n.shardGrowth
}));
const farms=[];
for(const depth of [32,101,501,1001,2501]){
 const x=F.app(html),q=x.q,s=F.seed(q);
 s.lumen=s.shards=0;s.depth=s.enemyDepth=s.farmDepth=depth;
 s.farmReturnDepth=depth+9;s.maxDepthEver=10000;s.riftMode='farm';
 s.nodes.echo=6;s.activeParty=['ember','gale','thorn'];
 for(const id of s.activeParty)s.spirits[id]=10000;
 Object.assign(s.research,{masterwork:500,formation:250,focus:250,sense:250,
  conduction:20,dualchannel:5,overflowconduit:5,battletempering:300,
  arcanetempering:300,harvesttempering:300});
 Object.assign(s.longStudyLevels,{wispascend:500,lumenstudy:500,shardstudy:500});
 s.enemyHp=s.enemyMaxHp=q.enemyHp(depth);
 q.set(s);q.restoreEnemy();
 const summary=q.advance(60,{kind:'offline',clockStartMs:F.CLOCK});
 const day={lumen:A.mul(summary.lumenGained,1440),shards:A.mul(summary.shardGained,1440)};
 const budgets=[];
 for(const days of [7,14,365,730,1095]){
  const wallet={lumen:A.mul(day.lumen,days),shards:A.mul(day.shards,days)},tracks=[];
  for(const node of catalogue){
   const buyer=F.seed(q);buyer.maxDepthEver=10000;
   buyer.lumen=wallet.lumen;buyer.shards=wallet.shards;q.set(buyer);
   const plan=q.plan(node.id,'max');
   tracks.push({id:node.id,levels:plan.buyCount,cap:node.cap,
    fullTrackAffordable:node.cap==='endless'?false:plan.buyCount===node.cap,
    cost:plan.cost});
  }
  // A shared wallet pays all finite paths in unlock/catalogue order.
  const buyer=F.seed(q);buyer.maxDepthEver=10000;
  buyer.lumen=wallet.lumen;buyer.shards=wallet.shards;q.set(buyer);
  const shared=[];
  for(const node of catalogue.filter(n=>n.cap!=='endless')){
   const plan=q.plan(node.id,'max');
   if(plan.buyCount){
    assert.equal(q.buy(node.id,'max'),true,'real shared-wallet purchase '+node.id);
    assert.equal(q.get().research[node.id],plan.buyCount,'quoted ranks granted '+node.id);
   }
   shared.push({id:node.id,levels:q.get().research[node.id],cap:node.cap});
  }
  budgets.push({days,wallet,independentTrackBudgets:tracks,sharedFiniteWallet:{
   tracks:shared,completed:shared.filter(n=>n.levels>=n.cap).length,
   total:shared.length,remainingLumen:q.get().lumen,remainingShards:q.get().shards}});
 }
 const finiteCosts=catalogue.filter(n=>n.cap!=='endless').map(n=>{
  const cost=q.cost(n.id,0,n.cap);
  return {id:n.id,cap:n.cap,cost,fixedIncomeDays:Math.max(
   Number(A.div(cost.lumen,day.lumen)),Number(A.div(cost.shard,day.shards)))};
 });
 farms.push({rift:depth,measuredSeconds:60,kills:summary.kills,per24Hours:day,finiteCosts,budgets});
}
console.log(JSON.stringify({status:'measured',source:path.resolve(file),
 sourceSha256:crypto.createHash('sha256').update(html).digest('hex'),
 assumptions:[
  'Synthetic mature account: Wisp levels 10000, Masterwork 500, legacy economy 250, resource Labs 500 and Tempering 300 granted before earning.',
  'Record Rift 10000 granted to isolate currency affordability, including all 500 Masterwork levels; unlock reachability is not modeled.',
  'One actual authoritative offline minute per fixed depth, extrapolated to 24 productive hours/day with no reinvestment or deeper records.',
  'Independent tracks each receive the whole budget. Shared wallet buys finite tracks in catalogue order, not an optimized play policy.',
  'These are diagnostic affordability forecasts, not elapsed-account completion times, a maximum economy bound or human pacing acceptance.'
 ],catalogue,farms},null,2));
