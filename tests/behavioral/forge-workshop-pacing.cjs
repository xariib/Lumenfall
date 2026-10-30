'use strict';
// Independent catalogue/pricing policy, real production transactions and farming.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const F=require('./forge-expansion-harness.cjs'),A=require('../../scripts/lib/game-amount.cjs');
const file=process.argv[2]||'index.html',original=fs.readFileSync(file,'utf8');
const baseline=require('node:zlib').gunzipSync(fs.readFileSync(require('node:path').join(__dirname,'fixtures/forge-workshop-baseline-d9a341e.html.gz'))).toString('utf8');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
assert.equal(hash(baseline),'4246093dad1dfd496307c7281e97df53bd6f902f33d804c246ca9f36f66cae65','immutable Git blob (checkout CRLF has a different byte hash)');
const specs=[['battletempering',100,10000000,250000],['arcanetempering',150,25000000,625000],['harvesttempering',200,40000000,1000000]];
const ids=specs.map(s=>s[0]);
function verify(source){
 let checks=0;const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);},ok=(v,m)=>{checks++;assert(v,m);};
 const near=(a,b,m)=>ok(Math.abs(Number(a)-Number(b))<=Math.max(1,Math.abs(Number(b)))*2e-12,m);
 function game(){return F.app(source);}
 function seed(q){const s=F.seed(q);s.lumen=s.shards='1e100';s.maxDepthEver=1000;return s;}
 const q=game().q,b=F.app(baseline).q;
 eq(q.defs().map(n=>n.id),b.defs().map(n=>n.id).concat(ids),'three additive long-tail identities');
 eq(q.defs().filter(n=>!ids.includes(n.id)),b.defs(),'every old definition, cap, price and effect retained');
 for(const [id,unlock,lumen,shard]of specs){
  const node=q.node(id);eq([node.unlockDepth,node.levelCap,node.effectPerLevel,node.lumenBase,node.shardBase,node.lumenGrowth,node.shardGrowth,node.forgeGroup],[unlock,300,.01,lumen,shard,1.1,1.1,'Enhancements'],'independent enhancement definition');
  // Rational 11/10, independent of geometricSum and the amount runtime.
  function rational(base,start,count){let numerator=0n;const denominator=10n**BigInt(start+count-1);for(let k=start;k<start+count;k++)numerator+=BigInt(base)*11n**BigInt(k)*10n**BigInt(start+count-1-k);return Number((numerator+denominator-1n)/denominator);}
  for(const start of [0,1,25,100,200,299])for(const count of [1,Math.min(25,300-start),300-start]){
   const cost=q.cost(id,start,count);ok(Math.abs(Number(cost.lumen)-rational(lumen,start,count))<=Math.max(1,rational(lumen,start,count)*2e-12),'independent rational Lumen quote within one rounding unit');ok(Math.abs(Number(cost.shard)-rational(shard,start,count))<=Math.max(1,rational(shard,start,count)*2e-12),'independent rational Shard quote within one rounding unit');
  }
  for(const depth of [unlock-1,unlock]){const s=seed(q);s.depth=s.enemyDepth=1;s.maxDepthEver=depth;q.set(s);eq(q.plan(id,1).reason,depth<unlock?'locked':'','exact Rift unlock');eq(q.plan(id,'max').buyCount,depth<unlock?0:300,'wallet cannot bypass unlock or finite cap');}
  for(const level of [0,1,99,299,300,301]){
   const s=seed(q);s.research[id]=level;q.set(s);near(q.effect(id,level).factor,1+.01*Math.min(level,300),'linear bounded effect, including historical overcap');
   eq(q.preview(id,1).next===null,level>=300,'next preview absent only at cap');ok(q.previewText(id,1).includes('×'+Number((1+.01*Math.min(level,300)).toFixed(2))),'current earned multiplier visible');
   eq(q.plan(id,'max').buyCount,Math.max(0,300-level),'bulk buys exact remaining finite levels');
  }
  for(const request of [1,5,25,'max']){
   const x=game(),c=x.q,s=seed(c);s.research[id]=275;c.set(s);const plan=c.plan(id,request),before=F.clone(c.get());
   x.fail(true,false);eq(c.buy(id,request),false,'primary-write failure rejects purchase');eq(c.get(),before,'failed purchase rolls back every field');x.fail(false,false);
   eq(c.buy(id,request),true,'real requested purchase');eq(c.get().research[id],275+plan.buyCount,'paid level count');
   eq(A.exactAdd(c.get().lumen,plan.cost.lumen),'1e100','exact Lumen debit');eq(A.exactAdd(c.get().shards,plan.cost.shard),'1e100','exact Shard debit');
   const paid=F.clone(c.get());eq(F.app(source,x.storage).q.get(),paid,'both-slot cold reload');eq(c.accept(c.decode(c.export())),paid,'backup roundtrip');
   const corrupt=new Map(x.storage);corrupt.set(F.P,'bad');eq(F.app(source,corrupt).q.get(),paid,'actual recovery load');
  }
  const x=game(),c=x.q,s=seed(c);s.research[id]=299;s.researchQueue[id]=true;c.set(s);eq(c.queue(),true,'queue purchases final rank');eq(c.get().research[id],300,'queue earns cap exactly');eq(c.queue(),false,'queue cannot spend past cap');
  // Each deficient currency blocks the real transaction, including Lumen-only
  // and Shards-only shortages; the shared native UI checks the matching red cost.
  for(const missing of ['lumen','shards']){const s=seed(q),price=q.cost(id,0,1);s.lumen=price.lumen;s.shards=price.shard;s[missing]--;q.set(s);const before=F.clone(q.get());eq(q.plan(id,1).reason,'unaffordable','single-resource shortage');eq(q.buy(id,1),false,'shortage blocks debit');eq(q.get(),before,'failed affordability leaves state intact');}
 }
 // Old saves gain exactly zero/OFF entries. All old fields and paid work match.
 const legacy=F.seed(b);legacy.research.arcanecal=20;legacy.research.masterwork=21;legacy.activeStudies=[{id:'guardmastery',slot:0,remainingSec:123,totalDurationSec:321,speedMult:2}];
 b.set(legacy);q.set(legacy);const migrated=F.clone(q.get());for(const id of ids){eq(migrated.research[id],0,'missing new level is zero');eq(migrated.researchQueue[id],false,'new queue is OFF');delete migrated.research[id];delete migrated.researchQueue[id];}for(const id of ['wispdamage','wispcritchance','wispcritdamage'])for(const [field,value]of [['longStudyLevels',0],['studyQueue',false],['studyUseMotes',false],['studySpeedTargets',1.5],['studyBoostHours',8]]){eq(migrated[field][id],value,'new Lab research retains unpurchased default '+field+'.'+id);delete migrated[field][id];}eq(migrated,b.get(),'all original save fields and paid work preserved');
 // Independent scope checks: no compounding, no currencies from extra damage,
 // no Support power/charge buff and no effect leaking into unrelated domains.
 const s=seed(q);s.depth=s.enemyDepth=101;s.riftMode='push';s.activeParty=['ember','tide','gale','thorn'];for(const id of s.activeParty)s.spirits[id]=100;s.research.resonantedge=5;
 function measure(){return {power:q.power('ember'),passive:q.passive(101),tap:q.tapAt(101,1,0),ability:q.burst('ember'),edge:q.burst('tide'),raw:q.abilityRawReward('gale'),support:q.supportProfile('tide'),lumen:q.lumen(101,false),shards:q.shards(101,false),motes:q.motes(101),prisms:q.prismPreview(),sigils:q.sigils(100)};}
 q.set(s);const bareTap=5*1.25;const before=measure(); // fixture's Kindling Bond, no tap upgrades
 for(const id of ids){q.set(s);q.get().research[id]=100;const after=measure();eq(after.power,before.power,'own Power retained');eq(after.raw,before.raw,'ability currencies unchanged');eq(after.support,before.support,'Support profile unchanged');eq(after.motes,before.motes,'Motes unchanged');eq(after.prisms,before.prisms,'Prisms unchanged');eq(after.sigils,before.sigils,'Sigils unchanged');near(after.passive,before.passive*(id==='battletempering'?2:1),'passive effect scope');near(after.tap,id==='battletempering'?(before.tap-bareTap)*2+bareTap:before.tap,'powered tap effect scope');near(after.ability,before.ability*(id==='arcanetempering'?2:1),'ability effect scope');near(after.edge,before.edge*(id==='arcanetempering'?2:1),'owned Resonant Edge effect scope');ok(Math.abs(after.lumen-before.lumen*(id==='harvesttempering'?2:1))<=1,'kill Lumen effect scope, final rounding');ok(Math.abs(after.shards-before.shards*(id==='harvesttempering'?2:1))<=1,'kill Shard effect scope, final rounding');}
 // Integrated Lab and Forge bonuses multiply in their shared damage domain.
 const combined=F.clone(s);combined.longStudyLevels.wispdamage=25;combined.longStudyLevels.wispcritchance=40;combined.longStudyLevels.wispcritdamage=50;
 q.set(combined);const labOnly=measure();
 near(labOnly.ability,before.ability*2.1,'earned Lab damage and critical research apply before Forge');
 combined.research.arcanetempering=100;combined.research.battletempering=100;q.set(combined);const together=measure();
 near(together.ability,labOnly.ability*2,'Arcane Tempering retains every earned Lab damage bonus');
 near(together.passive,labOnly.passive*2,'Battle Tempering retains every earned Lab passive bonus');
 eq(together.raw,before.raw,'combined combat bonuses do not multiply ability currencies');
 for(const id of ids){const c=game().q,t=seed(c);t.research[id]=1;c.set(t);eq(c.policyActive(),id!=='harvesttempering','combat enhancements activate conservative boss assessment');}
 // Observe actual scheduler damage with enhancements alone and combined with
 // charge grants; automatic boss bounds must contain that sustained damage.
 for(const charge of [false,true]){
  const c=game().q,t=seed(c);t.depth=t.enemyDepth=120;t.enemyHp=t.enemyMaxHp=1e100;t.activeParty=['ember','tide','gale','thorn'];t.achieved.autotap=true;
  for(const id of t.activeParty)t.spirits[id]=100;for(const id of ids)t.research[id]=300;
  if(charge)Object.assign(t.research,{tapconduit:5,relay:5,sustainedchannel:5,amplifiertrim:5});c.set(t);
  const bounds=c.assessment(120);let damage=0;
  const undo=c.observeCalibration(e=>{if(e.type==='damage')damage+=e.amount;if(e.type==='interval')damage+=e.dps*e.seconds;});
  try{eq(c.advance(120,{kind:'live',clockStartMs:F.CLOCK}).kills,0,'fixed boss survives measurement');}finally{undo();}
  ok(damage/120>=bounds.lowerDps*(1-1e-9),'enhanced original damage exceeds conservative lower bound');ok(damage/120<=bounds.upperDps*(1+1e-9),'enhanced original damage stays under conservative upper bound');
 }
 // Every new track is included in actual farm/chronological execution. The
 // generous fixture starts with maxed enhancements, old economy and Wisps:
 // it credits the earnings of the benefits BEFORE paying any purchase price.
 const farms=[];
 for(const depth of [32,51,101,250,501,1001]){
  const x=game(),c=x.q,t=seed(c);t.depth=t.enemyDepth=t.farmDepth=depth;t.farmReturnDepth=depth+9;t.maxDepthEver=depth+9;t.riftMode='farm';t.nodes.echo=6;t.activeParty=['ember','gale','thorn'];for(const id of t.activeParty)t.spirits[id]=10000;
  t.research.masterwork=500;t.research.formation=250;t.research.focus=t.research.sense=250;t.research.conduction=20;t.research.dualchannel=5;t.research.overflowconduit=5;t.longStudyLevels.wispascend=500;t.longStudyLevels.lumenstudy=t.longStudyLevels.shardstudy=500;ids.forEach(id=>t.research[id]=300);
  c.set(t);c.restoreEnemy();const summary=c.advance(60,{kind:'live',clockStartMs:F.CLOCK});const day={lumen:A.mul(summary.lumenGained,1440),shards:A.mul(summary.shardGained,1440)};const record={depth,seconds:60,kills:summary.kills,per24h:day,tracks:[]};
  for(const [id]of specs){const price=c.cost(id,0,300),days=Math.max(Number(A.div(price.lumen,day.lumen)),Number(A.div(price.shard,day.shards)));ok(days>3,'three generous farming days cannot complete '+id+' at Rift '+depth);const spend=seed(c);spend.lumen=A.mul(day.lumen,3);spend.shards=A.mul(day.shards,3);c.set(spend);ok(c.plan(id,'max').buyCount<300,'real three-day budget cannot buy cap');record.tracks.push({id,fullCost:price,fixedDepthDays:days,threeDayLevels:c.plan(id,'max').buyCount});}
  farms.push(record);
 }
 const horizon=farms.find(r=>r.depth===1001).tracks.reduce((days,t)=>days+t.fixedDepthDays,0);ok(horizon>=180&&horizon<=365,'all three tracks span six to twelve months even at optimistic fixed Rift1001 income');
 // Paid levels, queues and work survive Ascend; caller partitions agree.
 const endpoints=[];
 for(const kind of ['live','offline'])for(const split of [false,true]){const c=game().q,t=seed(c);t.lumen=t.shards=0;t.depth=t.enemyDepth=t.farmDepth=101;t.farmReturnDepth=110;t.riftMode='farm';t.nodes.echo=6;t.activeParty=['ember'];t.spirits.ember=100;ids.forEach(id=>t.research[id]=25);t.activeStudies=[{id:'guardmastery',slot:0,remainingSec:100,totalDurationSec:100,speedMult:1}];c.set(t);c.restoreEnemy();if(split)for(let i=0;i<10;i++)c.advance(1,{kind,clockStartMs:F.CLOCK+i*1000});else c.advance(10,{kind,clockStartMs:F.CLOCK});endpoints.push(F.clone(c.get()));const paid=F.clone(c.get().research);c.ascend();eq(c.get().research,paid,'Ascend retains every paid Forge rank');}
 for(const end of endpoints.slice(1))for(const key of ['research','researchQueue','activeStudies','longStudyLevels','lumen','shards','totalKills','depth'])eq(end[key],endpoints[0][key],'live/offline caller partition '+key);
 return {checks,farms};
}
const result=verify(original),negative=[];
if(process.argv.includes('--negative'))for(const [name,from,to]of [
 ['cheap-tail','lumenBase:10000000,lumenGrowth:1.10','lumenBase:10000000,lumenGrowth:1.001'],
 ['missing-ability-effect',"*researchFactor('arcanetempering')",''],
 ['missing-kill-effect',"* researchFactor('harvesttempering')",''],
 ['missing-passive-effect',"* researchFactor('battletempering')",'']
]){assert(original.includes(from),'mutation anchor '+name);let caught;try{verify(original.replace(from,to));}catch(e){assert(e instanceof assert.AssertionError);caught=e.message;}assert(caught,'defect rejected '+name);negative.push({name,caught});}
console.log(JSON.stringify({status:'pass',sourceSha256:hash(original),...result,negative,limitations:'Fixed-depth optimistic 24h/day forecasts; actual progression, player choices and human months-long pacing remain unverified.'},null,2));
