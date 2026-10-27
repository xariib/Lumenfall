'use strict';
// Complete production game, independent policy constants, real transactions,
// chronological combat and actual primary/recovery storage. No fake rewards.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const F=require('./forge-expansion-harness.cjs'),A=require('../../scripts/lib/game-amount.cjs');
const file=process.argv[2]||'index.html',original=fs.readFileSync(file,'utf8');
let source=original,checks=0;
const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);},ok=(v,m)=>{checks++;assert(v,m);};
const near=(a,b,m)=>ok(Math.abs(a-b)<=Math.max(1,Math.abs(b))*1e-10,m);
const mutations={
  intent:[" || !state.farmAutoResume ||",' || false ||'],
  power:['return Amount.add(1,Amount.mul(ENDLESS_PROGRESSION.masterworkPowerPerLevel,level===undefined?researchLevel(\'masterwork\'):level));',"return Amount.pow(1.25,level===undefined?researchLevel('masterwork'):level);"],
  farm:["return state.riftMode==='farm' ? Amount.min(dps,Amount.mul(state.enemyMaxHp||enemyHpFor(state.depth),ENDLESS_PROGRESSION.farmPassiveKillsPerSecond)) : dps;",'return dps;'],
  resources:["if(sp.abilityType==='ranged')power=Amount.min(power,Amount.mul(40,Amount.pow(1.09,endlessCurveDepth(state.depth))));",''],
  gate:['requiredDepth+=Math.floor(level/ENDLESS_PROGRESSION.masterworkLevelsPerBand)*ENDLESS_PROGRESSION.masterworkRiftsPerBand;','requiredDepth=node.unlockDepth;']
};
if(process.env.PACING_MUTANT){const p=mutations[process.env.PACING_MUTANT];assert(p);assert.equal(source.split(p[0]).length,2);source=source.replace(...p);}
const marker="if(document.readyState==='loading'){";
source=source.replace(marker,`window.endlessQa={select:selectFarmDepth,push:enterPushMode,passive:simulationPassiveDps,factor:masterworkPowerFactor,curve:endlessCurveDepth,rate:offlineRate};`+marker);
function game(saved){return F.app(source,saved,{clockDate:true});}
function farm(q,depth=32,auto=true){
  const s=q.fresh();Object.assign(s,{depth,farmDepth:depth,farmReturnDepth:60,maxDepthEver:100,riftMode:'farm',autoAscendEnabled:auto,lastSeen:F.CLOCK,questDay:q.day()});
  s.owned.autoascend=true;s.activeParty=['ember','tide','stone'];
  for(const id of s.activeParty)s.spirits[id]=300;
  s.research.masterwork=30;s.nodes.echo=6; // equal live/offline reward rate
  return s;
}
// Purchased levels do not reset; no multiplicative cliff, including old overcap.
{
  const {q}=game(),s=q.fresh();s.spirits.ember=100;q.set(s);const base=q.power('ember');
  for(const [level,factor]of [[0,1],[1,1.05],[20,2],[21,2.05],[100,6],[500,26],[501,26.05]]){
    q.get().research.masterwork=level;near(q.endless.factor(),factor,'independent additive Masterwork factor');near(q.power('ember'),base*factor,'actual Wisp Power uses additive factor');eq(q.effect('masterwork',level).capacity,level*5,'all paid Mastery capacity retained');
  }
}
// Five levels per fifty record Rifts; prices unchanged, wallet cannot bypass.
for(const [depth,limit]of [[69,0],[70,5],[119,5],[120,10],[169,10],[170,15],[5020,500]]){
  const x=game(),q=x.q,s=q.fresh();s.maxDepthEver=depth;s.lumen=s.shards='1e400';q.set(s);
  eq(q.plan('masterwork','max').buyCount,limit,'independent record-bound bulk limit');
  if(limit){
    const before=F.clone(q.get()),cost=q.cost('masterwork',0,limit);x.fail(true,false);
    eq(q.buy('masterwork','max'),false,'failed primary bulk rejects');eq(q.get(),before,'failed bulk restores all state');x.fail(false,false);
    ok(q.buy('masterwork','max'),'exact bulk purchase succeeds');eq(q.get().research.masterwork,limit,'only developed levels bought');eq(A.exactAdd(q.get().lumen,cost.lumen),'1e400','exact bulk Lumen debit');eq(A.exactAdd(q.get().shards,cost.shard),'1e400','exact bulk Shard debit');
    eq(q.plan('masterwork',1).reason,limit===500?'maxed':'locked','next band requires deeper record');
    q.get().researchQueue.masterwork=true;eq(q.queue(),false,'queue cannot bypass record gate');
    if(limit<500)eq(q.plan('masterwork',1).requiredDepth,70+limit/5*50,'precise next unlock displayed');
  }
}
// Manual Farm remains selected regardless of Auto Ascend and return-boss strength.
for(const auto of [false,true])for(const kind of ['live','offline'])for(const depth of [32,51]){
  const x=game(),q=x.q,s=farm(q,depth,auto);delete s.farmAutoResume;q.set(s);q.restoreEnemy();ok(q.save(),'save manual legacy Farm');
  const cold=game(x.storage),c=cold.q;eq(c.get().farmAutoResume,false,'legacy Farm conservatively migrates to manual');
  const before=c.get().ascendCount,r=c.advance(12,{kind,clockStartMs:F.CLOCK});
  eq(c.get().riftMode,'farm','manual Farm survives chronological catch-up');eq(c.get().depth,depth,'same selected Rift');eq(c.get().autoAscendEnabled,auto,'automation preference retained');eq(c.get().ascendCount,before,'manual Farm does not auto Ascend');eq(r.retries,0,'manual Farm never retries return boss');
  ok(c.save(),'save endpoint');const paid=F.clone(c.get());eq(game(cold.storage).q.get(),paid,'both-slot cold endpoint');eq(c.accept(c.decode(c.export())),paid,'backup retains endpoint');
  const broken=new Map(cold.storage);broken.set(F.P,'broken');eq(game(broken).q.get(),paid,'recovery slot retains manual Farm');
}
// Only an automatic boss retreat may resume. Explicit same-Rift takeover and
// failed persistence must retain intent just as they retain purchased resources.
{
  const x=game(),q=x.q,s=q.fresh();s.depth=s.enemyDepth=s.maxDepthEver=40;s.lastSeen=F.CLOCK;s.questDay=q.day();s.spirits.ember=1;q.set(s);q.restoreEnemy();
  const r=q.advance(301,{kind:'offline',clockStartMs:F.CLOCK});eq(r.retreats,1,'impossible boss retreats after grace');eq(q.get().farmAutoResume,true,'automatic retreat records retry intent');ok(q.save(),'persist automatic retreat');
  const cold=game(x.storage),c=cold.q;eq(c.get().farmAutoResume,true,'automatic retry intent survives reload');
  const before=F.clone(c.get());cold.fail(true,false);eq(c.endless.select(c.get().farmDepth),false,'failed manual takeover rejects');eq(c.get(),before,'failed takeover restores automatic intent');cold.fail(false,false);
  ok(c.endless.select(c.get().farmDepth),'same-Rift manual takeover succeeds');eq(c.get().farmAutoResume,false,'explicit Farm cancels retry');
  c.get().spirits.ember=300;c.advance(1,{kind:'offline',clockStartMs:F.CLOCK+301000});eq(c.get().riftMode,'farm','manual takeover stays Farm after becoming strong');
  q.get().spirits.ember=300;const retry=q.advance(.01,{kind:'offline',clockStartMs:F.CLOCK+301000});eq(retry.retries,1,'automatic retreat still retries a beatable boss');eq(q.get().riftMode,'push','automatic retry resumes Push');eq(q.get().farmAutoResume,false,'retry consumes automatic intent');
}
// Passive-only throughput is bounded even with extreme existing investments.
// Actual discrete casts/taps are additional, never mislabelled a global spawn cap.
const income=[];
for(const depth of [32,51,101,501]){
  const x=game(),q=x.q,s=farm(q,depth);s.farmReturnDepth=depth+9;s.maxDepthEver=depth+9;s.spirits.ember=s.spirits.tide=s.spirits.stone=10000;s.research.masterwork=500;s.research.formation=250;s.longStudyLevels.wispascend=500;q.set(s);q.restoreEnemy();
  eq(q.endless.passive(F.CLOCK),q.enemyHp(depth)*2,'independent two-enemy-HP/second Farm ceiling');
  const summary=q.advance(60,{kind:'live',clockStartMs:F.CLOCK,captureTimeline:true});
  const casts=summary.timeline.filter(e=>e.type==='ability').reduce((sum,e)=>sum+e.detail.count,0);
  ok(summary.kills<=120+casts+summary.autoTaps+1,'actual farm cannot convert huge passive overkill to unbounded kills');
  income.push({depth,seconds:60,kills:summary.kills,lumen:summary.lumenGained,shards:summary.shardGained});
}
ok(income[1].lumen>income[0].lumen,'deeper overpowered farming gives more Lumen');ok(income[1].shards>income[0].shards,'deeper overpowered farming gives more Shards');
{
  const {q}=game(),s=farm(q);s.enemyDepth=32;s.enemyMaxHp=11;s.enemyHp=8.03;q.set(s);
  eq(q.endless.passive(F.CLOCK),22,'legacy saved encounter HP also bounds passive throughput');
  eq(q.advance(.9,{kind:'live',clockStartMs:F.CLOCK}).kills,2,'actual legacy encounter cannot bypass the Farm ceiling');
}
// Resource input caps depend on current Rift, not lifetime depth or Power.
for(const id of ['gale','thorn'])for(const depth of [1,32,51,101]){
  const {q}=game(),s=q.fresh();s.depth=depth;s.maxDepthEver=10000;s.spirits[id]=10000;s.heroRarity[id]=5;s.research.masterwork=500;q.set(s);
  const curve=depth<=100?depth:100+40*Math.log1p((depth-100)/40);
  const expected=id==='gale'?2*Math.pow(1.09,curve):10*Math.pow(1.11,curve),key=id==='gale'?'shards':'lumen';
  near(q.abilityRawReward(id)[key],expected,'independent current-Rift resource ceiling');
  q.get().wispModules[id]=20;q.get().wispUltimate[id]=true;q.get().research.conduction=20;
  near(q.abilityRawReward(id)[key],expected*2*2*1.8,'paid resource multipliers remain above capped base');
}
// Paid work, queues, exact balances and intent agree across caller partitions.
{
  const parts=[];
  for(const kind of ['live','offline'])for(const split of [false,true]){
    const {q}=game(),s=farm(q);s.activeStudies=[{id:'guardmastery',remainingSec:120,totalDurationSec:120,speedMult:1}];s.studyBoosts.slot0={mult:3,startedAtMs:F.CLOCK-28800000+5000,expiresAtMs:F.CLOCK+5000};q.set(s);q.restoreEnemy();
    if(split)for(let i=0;i<20;i++)q.advance(.5,{kind,clockStartMs:F.CLOCK+i*500});else q.advance(10,{kind,clockStartMs:F.CLOCK});
    const end=q.get();near(end.activeStudies[0].remainingSec,100,'paid boost expiry splits actual work correctly');
    parts.push(Object.fromEntries(['depth','riftMode','farmDepth','farmReturnDepth','farmAutoResume','lumen','shards','motes','prisms','sigils','totalKills','activeStudies','research'].map(k=>[k,end[k]])));
  }
  for(let i=1;i<parts.length;i++)eq(parts[i],parts[0],'live/offline caller partitions agree on preserved endpoint');
}
if(process.argv.includes('--negative')){
  const cp=require('node:child_process');for(const id of Object.keys(mutations)){
    const r=cp.spawnSync(process.execPath,[__filename,file],{encoding:'utf8',env:{...process.env,PACING_MUTANT:id},timeout:120000});
    ok(!r.error&&r.status===1&&r.stderr.includes('AssertionError'),'causal control rejected: '+id);
  }
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(original).digest('hex'),income,limitations:'Synthetic high-power farming, independent mathematical bounds and chronological/persistence regressions; not a year-long player cohort or physical Android acceptance.'}));
