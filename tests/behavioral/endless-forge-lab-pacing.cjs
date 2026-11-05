'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const F=require('./forge-expansion-harness.cjs'),L=require('./lab-expansion-harness.cjs');
const A=require('../../scripts/lib/game-amount.cjs'),{rules,ready}=require('./lab-access-reference.cjs');
const file=process.argv[2]||'index.html',source=fs.readFileSync(file,'utf8');
const ids=['battletempering','arcanetempering','harvesttempering'],T=F.CLOCK;
function verify(html,farming){
 let checks=0;const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);},ok=(v,m)=>{checks++;assert(v,m);};
 const x=L.app(html),q=x.q;
 function seed(){const s=L.seed(q);s.lumen=s.shards='1e100';s.activeStudies=[];s.pausedStudies=[];return s;}
 for(const [id,rule]of Object.entries(rules)){
  const node=q.projects().find(n=>n.id===id),s=ready(seed(),id);s.maxDepthEver=rule.depth;
  q.set(s);eq(q.plan(id).affordable,true,'all exact requirements allow first start '+id);
  const requirements=q.plan(id).access.requirements;
  eq(requirements.map(r=>r.target),[rule.depth,...Object.values(rule.studies)],'independent requirement values '+id);
  const below=L.clone(s);below.maxDepthEver=rule.depth-1;
  const cases=[below];for(const [key,level]of Object.entries(rule.studies)){const missing=L.clone(s);missing.longStudyLevels[key]=level-1;cases.push(missing);}
  // An unlimited wallet cannot buy or queue around either kind of gate.
  for(const blocked of cases){
   blocked.studyQueue[id]=true;q.set(blocked);const before=L.clone(q.get());
   eq(q.plan(id).reason,'locked','one missing requirement locks '+id);eq(q.start(id),false,'manual start rejected '+id);
   eq(q.get(),before,'rejected manual start is pure '+id);q.queue();eq(q.get().activeStudies.length,0,'queue cannot bypass requirements '+id);
   eq(q.get().lumen,before.lumen,'locked queue spends no Lumen '+id);eq(q.get().shards,before.shards,'locked queue spends no Shards '+id);
  }
  q.set(s);const price=q.plan(id).cost;eq(q.start(id),true,'real first start '+id);
  eq(A.exactAdd(q.get().lumen,price.lumen),s.lumen,'exact first Lumen payment '+id);
  eq(A.exactAdd(q.get().shards,price.shard),s.shards,'exact first Shard payment '+id);
  // Historical access derives from actual paid levels or paid work. It never
  // infers prerequisite levels, grants currency or rewrites remaining time.
  for(const kind of ['earned','active','paused']){
   const old=seed();old.maxDepthEver=1;
   if(kind==='earned')old.longStudyLevels[id]=1;
   else old[kind==='active'?'activeStudies':'pausedStudies']=[{id,slot:0,remainingSec:123.25,totalDurationSec:987.5,speedMult:2}];
   q.set(old);const before=L.clone(q.get());eq(q.plan(id).unlocked,true,'retained '+kind+' access '+id);
   eq(q.get(),before,'retained access preview pure '+id);q.save();eq(L.app(html,x.storage).q.get(),before,'retained cold reload '+id);
   eq(q.accept(q.decode(q.export())),before,'retained backup '+id);
   const corrupt=new Map(x.storage);corrupt.set(L.P,'invalid');eq(L.app(html,corrupt).q.get(),before,'retained recovery '+id);
   if(kind==='paused'){eq(q.start(id),true,'resume paid work below new requirements '+id);eq(q.get().activeStudies[0].remainingSec,123.25,'paid work never lengthened '+id);}
  }
 }
 // The earlier study finishes at a real event boundary. Dependent queued work
 // starts after that completion identically in live/offline and split calls.
 const ends=[];
 for(const kind of ['live','offline'])for(const split of [false,true]){
  const a=L.app(html),c=a.q,s=L.seed(c);s.lumen=s.shards='1e20';s.maxDepthEver=25;s.activeParty=[];
  s.depth=s.enemyDepth=101;s.enemyHp=s.enemyMaxHp=1e100;
  s.longStudyLevels.wispascend=4;s.activeStudies=[{id:'wispascend',slot:0,remainingSec:1,totalDurationSec:10,speedMult:1}];s.studyQueue.wispdamage=true;
  c.set(s);if(split){c.advance(1,{kind,clockStartMs:T});c.advance(1,{kind,clockStartMs:T+1000});}else c.advance(2,{kind,clockStartMs:T});
  ok(c.get().activeStudies.some(n=>n.id==='wispdamage'),'dependent queue starts at earned completion '+kind+'/'+split);
  ends.push(L.clone(c.get()));
 }
 for(const end of ends.slice(1))for(const key of ['longStudyLevels','activeStudies','studyQueue','lumen','shards'])eq(end[key],ends[0][key],'dependent start live/offline partition '+key);
 const f=F.app(html),c=f.q;
 for(const id of ids)for(const level of [299,300,301,1000,10000]){
  const s=F.seed(c);s.maxDepthEver=1000;s.research[id]=level;s.lumen=s.shards='1e1000';c.set(s);
  eq(c.plan(id,1).maxed,false,'no final Forge level '+id+'/'+level);
  ok(Math.abs(c.effect(id,level).factor-(1+.01*level))<1e-10,'continuing additive effect '+id+'/'+level);
  ok(c.preview(id,1).next!==null,'next effect remains visible '+id+'/'+level);
  const plan=c.plan(id,1);if(A.le(plan.cost.lumen,s.lumen)&&A.le(plan.cost.shard,s.shards)){
   const before=F.clone(c.get());f.fail(true,false);eq(c.buy(id,1),false,'write failure rejects continuing purchase');eq(c.get(),before,'continuing purchase rollback');f.fail(false,false);
   eq(c.buy(id,1),true,'real continuing Forge purchase');eq(c.get().research[id],level+1,'real continuing level');
   ok(A.gt(c.cost(id,level+1,1).lumen,plan.cost.lumen),'next level is more expensive');
  }
 }
 const farms=[];
 if(farming)for(const depth of [32,101,501]){
  const a=F.app(html),c=a.q,s=F.seed(c);s.lumen=s.shards=0;s.depth=s.enemyDepth=s.farmDepth=depth;s.farmReturnDepth=depth+9;s.maxDepthEver=1001;s.riftMode='farm';s.activeParty=['ember','gale','thorn'];s.nodes.echo=6;
  for(const id of s.activeParty)s.spirits[id]=10000;
  Object.assign(s.research,{masterwork:500,formation:250,focus:250,sense:250,conduction:20,dualchannel:5,overflowconduit:5});
  Object.assign(s.longStudyLevels,{wispascend:500,lumenstudy:500,shardstudy:500});for(const id of ids)s.research[id]=300;
  c.set(s);c.restoreEnemy();const five=c.advance(5*3600,{kind:'offline',clockStartMs:T});const atFive=F.clone(c.get());
  const three=c.advance(3*3600,{kind:'offline',clockStartMs:T+5*3600000});const atEight=F.clone(c.get());
  const row={rift:depth,grantedEnhancementLevels:300,firstFiveHours:{kills:five.kills,lumen:atFive.lumen,shards:atFive.shards},lastThreeHours:{kills:three.kills},purchases:[]};
  for(const [hours,wallet]of [[5,atFive],[8,atEight]])for(const id of ids){
   const spend=F.seed(c);spend.maxDepthEver=1001;spend.lumen=wallet.lumen;spend.shards=wallet.shards;c.set(spend);
   const plan=c.plan(id,'max');ok(plan.buyCount>0,'farm funds permanent progress');ok(plan.buyCount<300,'generous 5/8h farm cannot buy first300 ranks');eq(c.buy(id,'max'),true,'farm budget buys real permanent levels');
   eq(c.plan(id,1).maxed,false,'farm never goldboxes continuing track');ok(c.preview(id,1).next!==null,'farm leaves next upgrade visible');
   const nextPrice=c.cost(id,plan.buyCount,1);let repeatBought=null;
   if(hours===8){
    c.get().lumen=A.exactAdd(c.get().lumen,wallet.lumen);c.get().shards=A.exactAdd(c.get().shards,wallet.shards);
    repeatBought=c.plan(id,'max').buyCount;ok(repeatBought>0&&repeatBought<plan.buyCount,'a second equal farm budget buys fewer ranks, but still makes progress');
    eq(c.buy(id,'max'),true,'repeat budget makes a real purchase');eq(c.get().research[id],plan.buyCount+repeatBought,'repeat budget retains all earlier progress');
   }
   row.purchases.push({hours,id,bought:plan.buyCount,nextPrice,repeatBought});
  }
  farms.push(row);
 }
 return {checks,farms};
}
try{
 const result=verify(source,!process.argv.includes('--no-farm')),negative=[];
 if(process.argv.includes('--negative'))for(const [name,from,to]of [
  ['forge-final-level','name:\'Battle Tempering\',forgeGroup:\'Enhancements\',endless:true','name:\'Battle Tempering\',forgeGroup:\'Enhancements\',levelCap:300'],
  ['lab-ignores-prerequisite','target:rule.studies[id],met:Amount.ge(longStudyLevel(id),rule.studies[id])','target:rule.studies[id],met:true'],
  ['lab-ignores-rift','target:depth,met:Amount.ge(state.maxDepthEver,depth)','target:depth,met:true'],
  ['lab-loses-paid-access','unlocked:paid?true:','unlocked:false?true:']
 ]){assert.equal(source.split(from).length,2,'unique defect anchor '+name);let caught;try{verify(source.replace(from,to),false);}catch(e){caught=e.message;}assert(caught,'defect rejected '+name);negative.push({name,caught});}
 console.log(JSON.stringify({status:'pass',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),...result,negative,assumptions:'Generous fixed-depth farm grants all300 enhancement ranks and mature economic research before earning; each track receives the entire budget independently. Repeat spending adds the same eight-hour budget to the first purchase leftovers. Actual player pacing remains to be reviewed.'},null,2));
}catch(e){console.error(JSON.stringify({status:'fail',error:e.stack,actual:e.actual,expected:e.expected}));process.exitCode=1;}
