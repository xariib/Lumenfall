'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const F=require('./forge-expansion-harness.cjs'),A=require('../../scripts/lib/game-amount.cjs');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8');
const specs=[['battletempering',375,300,10000000,250000,1100,1002],['arcanetempering',325,300,25000000,625000,1100,1002],['harvesttempering',315,300,40000000,1000000,1100,1002],['masterwork',500,50,1000000,25000,1350,1025]];
function verify(html){
 let checks=0;const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);},ok=(v,m)=>{checks++;assert(v,m);};
 const x=F.app(html),q=x.q;
 const seed=()=>{const s=F.seed(q);s.maxDepthEver=10000;s.lumen=s.shards='1e100';return s;};
 ok(q.defs().every(n=>Number.isInteger(n.levelCap)&&n.levelCap>0&&!n.endless),'every Forge upgrade has a finite ceiling');
 // Integer rational oracle sums marginal costs without the product's piecewise
 // geometric sums, Number powers or Amount arithmetic. Round only the total.
 function price(base,start,count,boundary,early,late){
  const end=start+count,den=1000n**BigInt(end),scale=1000n;let sum=0n;
  for(let l=start;l<end;l++){
   const before=Math.min(l,boundary-1),after=Math.max(0,l-boundary+1);
   sum+=BigInt(base)*BigInt(early)**BigInt(before)*BigInt(late)**BigInt(after)*scale**BigInt(end-l);
  }
  return Number((sum+den-1n)/den);
 }
 for(const [id,cap,tail,lumen,shard,early,late]of specs){
  const n=q.node(id);eq([n.levelCap,n.grandfatheredCap,n.priceTailStart,n.priceTailGrowth],[cap,true,tail,late/1000],'independent finite cap and price-tail policy '+id);
  const lastEarly=q.cost(id,tail-1,1),firstLate=q.cost(id,tail,1);
  ok(Math.abs(Number(firstLate.lumen)/Number(lastEarly.lumen)-late/1000)<1e-10,'first new rank immediately uses the stated slower growth '+id);
  for(const start of [0,1,tail-1,tail,tail+1,cap-1])for(const count of [1,Math.min(5,cap-start),cap-start]){
   const cost=q.cost(id,start,count);
   for(const [key,base]of [['lumen',lumen],['shard',shard]]){
    const expected=price(base,start,count,tail,early,late);
    ok(Math.abs(Number(cost[key])-expected)<=Math.max(1,expected*2e-11),'independent rational split-price oracle '+id+'/'+start+'/'+count+'/'+key);
   }
  }
  for(const owned of [cap-1,cap,cap+1,10000]){
   const s=seed();s.research[id]=owned;s.researchQueue[id]=true;q.set(s);
   const before=F.clone(q.get()),plan=q.plan(id,'max');eq(plan.maxed,owned>=cap,'finite maxed state '+id+'/'+owned);
   eq(q.preview(id,1).next===null,owned>=cap,'finite next preview '+id+'/'+owned);
   const expectedFactor=1+(id==='masterwork'?.05:.01)*owned;
   ok(Math.abs(q.effect(id,owned).factor-expectedFactor)<1e-10,'all paid above-cap effects retained '+id+'/'+owned);
   if(owned>=cap){eq(q.buy(id,1),false,'no paid purchase above cap');eq(q.queue(),false,'queue cannot overbuy');eq(q.get(),before,'maxed transaction leaves all fields unchanged');}
   else{
    eq(plan.buyCount,1,'max stops at final rank');
    x.fail(true,false);eq(q.buy(id,'max'),false,'final write failure rejected');eq(q.get(),before,'final write failure atomic rollback');x.fail(false,false);
    eq(q.buy(id,'max'),true,'buy actual final rank');eq(q.get().research[id],cap,'final rank earned');
    eq(A.exactAdd(q.get().lumen,plan.cost.lumen),s.lumen,'exact final Lumen debit');eq(A.exactAdd(q.get().shards,plan.cost.shard),s.shards,'exact final Shard debit');
   }
   q.save();const paid=F.clone(q.get());eq(F.app(html,x.storage).q.get(),paid,'cold reload keeps final and historical levels');
   eq(q.accept(q.decode(q.export())),paid,'backup roundtrip keeps historical paid bonuses');
   const corrupt=new Map(x.storage);corrupt.set(F.P,'bad');eq(F.app(html,corrupt).q.get(),paid,'recovery keeps final and historical levels');
   const keep=F.clone(q.get().research);q.ascend();eq(q.get().research,keep,'Ascend retains finite/historical ownership');
  }
  const s=seed();s.research[id]=cap-1;const cost=q.cost(id,cap-1,1);s.lumen=cost.lumen;s.shards=cost.shard;s.researchQueue[id]=true;q.set(s);
  eq(q.queue(),true,'actual queue buys final rank');eq(q.get().research[id],cap,'queued final boundary');eq(q.get().lumen,0,'queue exact final Lumen');eq(q.get().shards,0,'queue exact final Shards');eq(q.queue(),false,'repeat queue cannot exceed final cap');
  for(const missing of ['lumen','shards']){
   const poor=seed();poor.research[id]=cap-1;poor.lumen=cost.lumen;poor.shards=cost.shard;poor[missing]=A.exactSub(poor[missing],1);q.set(poor);
   eq(q.plan(id,1).affordable,false,'one-resource final shortage '+missing);const before=F.clone(q.get());eq(q.buy(id,1),false,'short final wallet rejects');eq(q.get(),before,'short final wallet unchanged');
  }
 }
 // Existing Labs supply actual combat/economy progress, including at Forge cap.
 const s=seed();s.depth=s.enemyDepth=501;s.activeParty=['ember'];s.spirits.ember=1000;
 for(const [id,cap]of specs)s.research[id]=cap;
 for(const id of Object.keys(s.longStudyLevels))s.longStudyLevels[id]=0;
 q.set(s);const weak={passive:q.passive(501),ability:q.burst('ember'),lumen:q.lumen(501,false),shards:q.shards(501,false)};
 Object.assign(s.longStudyLevels,{wispdamage:100,wispcritchance:100,wispcritdamage:100,lumenstudy:100,shardstudy:100});q.set(s);
 const strong={passive:q.passive(501),ability:q.burst('ember'),lumen:q.lumen(501,false),shards:q.shards(501,false)};
 for(const key of ['passive','ability'])ok(Number(A.div(strong[key],weak[key]))>=7.49,'completed damage/critical Labs strengthen capped Forge combat '+key);
 for(const key of ['lumen','shards'])ok(Number(A.div(strong[key],weak[key]))>=8.99,'completed economy Labs strengthen farming '+key);
 const walls=[];
 for(const kind of ['live','offline'])for(const researched of [false,true]){
  const wall=F.clone(s);wall.depth=wall.enemyDepth=490;wall.enemyHp=wall.enemyMaxHp=q.enemyHp(490);
  for(const node of q.defs())wall.research[node.id]=node.levelCap;
  Object.assign(wall.longStudyLevels,{wispdamage:researched?100:0,wispcritchance:researched?100:0,wispcritdamage:researched?100:0});q.set(wall);
  const assessment=q.assessment(490);eq(assessment.verdict,researched?'sustained':'wall','actual boss wall depends on completed Labs '+kind);
  const summary=q.advance(120,{kind,clockStartMs:F.CLOCK});
  ok(researched?summary.kills>0:summary.kills===0,'actual capped-Forge combat crosses wall only with damage Labs '+kind);
  walls.push({kind,researched,verdict:assessment.verdict,kills:summary.kills,endingDepth:q.get().depth});
 }
 return {checks,labComparison:{weak,strong},walls};
}
try{
 const result=verify(source),negative=[];
 if(process.argv.includes('--negative'))for(const [name,from,to]of [
  ['endless-returns',"levelCap:375,grandfatheredCap:true","endless:true,grandfatheredCap:true"],
  ['paid-bonus-clamped','return node.grandfatheredCap ? level :','return false ? level :'],
  ['tail-too-cheap','priceTailGrowth:1.002','priceTailGrowth:1.00001'],
  ['tail-off-by-one','Math.max(0,level-node.priceTailStart),late','Math.max(0,level-node.priceTailStart+1),late']
 ]){assert(source.includes(from),'negative-control anchor '+name);let caught;try{verify(source.replace(from,to));}catch(e){caught=e.message;}assert(caught,'causal defect rejected '+name);negative.push({name,caught});}
 console.log(JSON.stringify({status:'pass',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),...result,negative},null,2));
}catch(e){console.error(JSON.stringify({status:'fail',error:e.stack,actual:e.actual,expected:e.expected}));process.exitCode=1;}
