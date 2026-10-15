'use strict';
// Real complete engine, real purchases; deterministic player decisions only.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {app,CLOCK}=require('./forge-expansion-harness.cjs');
const amount=require('../../scripts/lib/game-amount.cjs');
const sourcePath=process.argv[2]||'index.html';
const source=fs.readFileSync(sourcePath,'utf8');
const policyBytes=fs.readFileSync(__filename),harnessBytes=fs.readFileSync(require.resolve('./forge-expansion-harness.cjs')),amountBytes=fs.readFileSync(require.resolve('../../scripts/lib/game-amount.cjs'));
const policySha256=crypto.createHash('sha256').update(policyBytes).update(harnessBytes).update(amountBytes).digest('hex');
if(process.env.LUMENFALL_CAMPAIGN_SNAPSHOT){
 const path=require('node:path'),dir=path.join(path.dirname(process.env.LUMENFALL_CAMPAIGN_SNAPSHOT),'policies',policySha256);fs.mkdirSync(dir,{recursive:true});
 for(const [name,bytes]of [['endless-campaign.cjs',policyBytes],['forge-expansion-harness.cjs',harnessBytes],['game-amount.cjs',amountBytes]])fs.writeFileSync(path.join(dir,name),bytes);
}
const marker="if(document.readyState==='loading'){";
const bridge=`
window.endlessQa={
  wisps:function(){return SPIRITS;},nodes:function(){return NODES;},
  unlocked:function(sp){return typeof wispRecruitmentUnlocked==='function'?wispRecruitmentUnlocked(sp):state.maxDepthEver>=treeWispUnlockDepth(sp);},
  rarity:function(sp){return buyRarity(sp);},module:function(sp){return buyModule(sp);},
  moduleCost:moduleCost,rarityCost:rarityCost,rarityReq:rarityReq,
  ultimateCost:ultimateSigilCost,ultimatePlan:getWispUltimatePlan,masteryPlan:getWispMasteryPlan,
  buyNode:buyNode,nodePlan:getNodeBuyPlan,studyPlan:getStudyStartPlan,
  farm:enterFarmMode,push:enterPushMode,eligible:ascendEligible,
  day:ensureDaily,
  best:function(mode){
    var owned=SPIRITS.filter(function(sp){return state.spirits[sp.id]>0;});
    owned.sort(function(a,b){return Amount.cmp(wispPower(b,state.spirits[b.id]),wispPower(a,state.spirits[a.id]));});
    var support=owned.filter(function(sp){return sp.abilityType==='support';})[0];
    var forced=mode==='farm'?['tide','aurora','gale','thorn'].filter(function(id){return state.spirits[id]>0;}):support?[support.id]:[];
    var chosen=owned.filter(function(sp){return forced.indexOf(sp.id)===-1;}).slice(0,treeFormationCapacity()-forced.length).map(function(sp){return sp.id;}).concat(forced);
    commitFormationMembers(chosen);
  },
  claim:function(){(state.questIds||[]).forEach(function(id){claimQuest(id);});},
  mastery:function(sp){return typeof buyWispMastery==='function' && buyWispMastery(sp);},
  masterworkPower:function(){return ENDLESS_PROGRESSION.masterworkPowerGrowth||1;},
  speed:function(preferred,budget,hours){
    var node=LONG_STUDIES.find(function(n){return n.id==='wispascend';}),active=findActiveStudy('wispascend');
    if(!active)return false;
    for(var i=LAB_SPEED_TIERS.length-1;i>=0;i--){var tier=LAB_SPEED_TIERS[i];
      if(tier<=preferred && tier>active.speedMult && Amount.le(studyBoostCost(tier,hours),Amount.mul(state.motes,budget)))return activateStudyBoost(node.id,tier,hours);
    }
    return false;
  },
  auto:function(enabled){
    var item=SHOP.find(function(row){return row.id==='autoascend';});
    if(!enabled){state.autoAscendEnabled=false;return;}
    if(!state.owned.autoascend)buyShopItem(item);
    if(!state.owned.autoascend)return;
    setAutoAscendClearedTarget('15');
    state.autoAscendEnabled=!!enabled;
  }
};
`;
const instrumented=source.replace(marker,bridge+marker);
const policies={regular_two:{sessions:2,activeSec:600,decisionSec:10,speed:8,budget:.5},casual:{sessions:2,activeSec:300,decisionSec:10,speed:8,budget:.5},regular:{sessions:3,activeSec:600,decisionSec:10,speed:8,budget:.5},frequent:{sessions:6,activeSec:600,decisionSec:10,speed:8,budget:.5},regular_fast:{sessions:3,activeSec:600,decisionSec:10,speed:8,budget:.5},efficient:{sessions:6,activeSec:900,decisionSec:5,speed:8,budget:.9}};
const days=Number(process.argv[3]||7),name=process.argv[4]||'regular';
assert(policies[name]&&Number.isInteger(days)&&days>0&&days<=730);
const runBudgetMs=Number(process.env.LUMENFALL_CAMPAIGN_RUN_MS||0),runStarted=performance.now();assert(Number.isFinite(runBudgetMs)&&runBudgetMs>=0);
const sourceSha256=crypto.createHash('sha256').update(source).digest('hex');
const resumePath=process.env.LUMENFALL_CAMPAIGN_RESUME;
const phases=[{"sourceSha256":"f98b93475dc5a7a3a7b0dd17b981d818b94c38cb5f3242011cf3a40fc6dc782a","throughDay":3},{"sourceSha256":"10e141a1d9cc181f95ca19c3887a273a72f4e51ff194a69c0838693a4f90e91b","fromDay":3,"throughDay":4},{sourceSha256,policySha256,fromDay:4,changes:'Checked native resource replay; same D balance and player choices, no grants.'}];
const checkpoint=resumePath?JSON.parse(fs.readFileSync(resumePath,'utf8')):null;
if(checkpoint){assert(checkpoint.sourceSha256===sourceSha256||(checkpoint.sourceSha256==='10e141a1d9cc181f95ca19c3887a273a72f4e51ff194a69c0838693a4f90e91b'&&checkpoint.history.length===4),'exact source or explicit day3 native-engine transition');assert(checkpoint.policySha256===policySha256||(checkpoint.policySha256==='82c1c70e6fed890d7aa78a28c76d161869ce2521053ac8d52b30ab34a843966e'&&checkpoint.history.length===4),'exact policy or explicit day3 engine phase');assert.equal(checkpoint.policy,name);assert(checkpoint.history.length<days,'resume extends a campaign');}
let diagnostic=()=>({});
process.once('uncaughtException',error=>{
 const failure={status:'FAIL',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),policySha256,policy:name,error:error.stack,...diagnostic()};
 if(process.env.LUMENFALL_CAMPAIGN_SNAPSHOT)fs.writeFileSync(process.env.LUMENFALL_CAMPAIGN_SNAPSHOT+'.failure.json',JSON.stringify(failure,null,2));
 process.stderr.write(error.stack+'\n');process.exitCode=1;
});

function campaign(){
  const x=app(instrumented,undefined,{clockDate:true,retainWrites:false}),q=x.q;
  // Bridge is observed through a test-only function returning its closure.
  const b=q.endless;
  const policy=policies[name],milestones=checkpoint?checkpoint.milestones:{},history=checkpoint?checkpoint.history:[],walls=checkpoint?checkpoint.walls:[];
  const purchases=checkpoint?checkpoint.purchases||[]:[];
  let elapsed=checkpoint?checkpoint.elapsed:0,lastRecordAt=checkpoint?checkpoint.lastRecordAt:0,lastRecord=checkpoint?checkpoint.lastRecord:1,lastAscendAt=checkpoint?checkpoint.lastAscendAt:-Infinity,lastSaving=checkpoint?checkpoint.lastSaving:false;
  if(checkpoint){q.set(checkpoint.state);x.clock(CLOCK+elapsed*1000);}
  diagnostic=()=>({elapsed,milestones,state:q.get()});
  const s=q.get();
  // Automation remains gated by earned Deeds in the production scheduler.
  if(!checkpoint){
  Object.keys(s.empowerQueue).forEach(id=>s.empowerQueue[id]=true);
  for(const study of q.projects())s.studyQueue[study.id]=study.id==='wispascend';
  // Speed is paid only from earned Motes, at the actual per-project price.
  for(const study of q.projects()){s.studyUseMotes[study.id]=study.id==='wispascend';s.studySpeedTargets[study.id]=policy.speed;}
  // Only useful repeatable foundations and charge are automatically purchased.
  for(const node of q.defs())s.researchQueue[node.id]=!node.retiredTo&&node.levelCap!==undefined;
  }
  const note=()=>{
    const state=q.get();
    for(const sp of b.wisps()){
      if(state.spirits[sp.id]>0&&milestones['recruit.'+sp.id]===undefined)milestones['recruit.'+sp.id]=elapsed;
      if(state.heroRarity[sp.id]>0&&milestones.firstRarity===undefined)milestones.firstRarity=elapsed;
      if(state.heroRarity[sp.id]>=5&&milestones.firstMythic===undefined)milestones.firstMythic=elapsed;
      if(state.heroRarity[sp.id]>=5&&milestones['mythic.'+sp.id]===undefined)milestones['mythic.'+sp.id]=elapsed;
      if(state.wispUltimate[sp.id]&&milestones.firstUltimate===undefined)milestones.firstUltimate=elapsed;
      if(state.wispUltimate[sp.id]&&milestones['ultimate.'+sp.id]===undefined)milestones['ultimate.'+sp.id]=elapsed;
      if(state.wispMastery&&state.wispMastery[sp.id]>0&&milestones.firstMastery===undefined)milestones.firstMastery=elapsed;
      if(state.wispMastery&&state.wispMastery[sp.id]>0&&milestones['mastery.'+sp.id]===undefined)milestones['mastery.'+sp.id]=elapsed;
    }
    if(state.ascendCount>0&&milestones.firstAscend===undefined)milestones.firstAscend=elapsed;
    if(b.wisps().every(sp=>milestones['recruit.'+sp.id]!==undefined)&&milestones.allRecruits===undefined)milestones.allRecruits=elapsed;
    if(b.wisps().every(sp=>state.heroRarity[sp.id]>=5&&state.wispModules[sp.id]>=20&&state.wispUltimate[sp.id])&&milestones.fullRosterDevelopment===undefined)milestones.fullRosterDevelopment=elapsed;
    if(state.maxDepthEver>lastRecord){
      if(elapsed-lastRecordAt>=3600)walls.push({from:lastRecord,to:state.maxDepthEver,seconds:elapsed-lastRecordAt});
      lastRecord=state.maxDepthEver;lastRecordAt=elapsed;
    }
  };
  function funds(){const s=q.get();return {lumen:s.lumen,shards:s.shards,sigils:s.sigils,prisms:s.prisms};}
  function receipt(kind,id,before,cost){const after=funds();purchases.push({kind,id,at:elapsed,price:cost,before,after,shareOfWallet:Object.fromEntries(Object.entries(cost).map(([key,value])=>[key,amount.ratio(value,before[key])]))});}
  function advance(seconds,kind){
    x.clock(CLOCK+elapsed*1000);
    let result;
    if(kind==='offline'&&process.env.LUMENFALL_CAMPAIGN_WINDOW_PROGRESS==='1'){
      const began=performance.now(),prefix=process.env.LUMENFALL_CAMPAIGN_SNAPSHOT;
      if(prefix)fs.writeFileSync(prefix+'.window-input.json',JSON.stringify({status:'OBSERVED_INPUT',sourceSha256,policySha256,elapsed,seconds,state:q.get()}));
      process.stderr.write(JSON.stringify({windowStart:elapsed,seconds,rift:q.get().maxDepthEver,depth:q.get().depth,masterwork:q.get().research.masterwork})+'\n');
      const cursor=q.advance(seconds,{kind:kind,clockStartMs:CLOCK+elapsed*1000,offlineWindowStartMs:CLOCK+elapsed*1000,resumable:true});let step,last=began,logical=0;
      do{step=cursor.next();if(!step.done){if(step.value.elapsedSec!==undefined)logical=step.value.elapsedSec;if(performance.now()-last>5000){process.stderr.write(JSON.stringify({windowStart:elapsed,processed:logical,wallSeconds:(performance.now()-began)/1000,depth:q.get().depth,ascends:q.get().ascendCount})+'\n');last=performance.now();}}}while(!step.done);result=step.value;
      process.stderr.write(JSON.stringify({windowEnd:elapsed+seconds,wallSeconds:(performance.now()-began)/1000,iterations:result.iterations,ascends:result.ascends})+'\n');
    }else result=q.advance(seconds,{kind:kind,clockStartMs:CLOCK+elapsed*1000,offlineWindowStartMs:CLOCK+elapsed*1000});
    elapsed+=seconds;x.clock(CLOCK+elapsed*1000);if(kind==='offline'){q.get().totalOfflineSeconds=amount.add(q.get().totalOfflineSeconds,seconds);q.achievements();}note();
    assert.equal(result.processedSec===undefined||result.processedSec>=0,true);
    assert(amount.valid(q.get().lumen)&&amount.valid(q.get().enemyHp),'finite represented engine campaign state');
  }
  function decisions(){
    b.day();
    b.push();
    const growth=q.projects().find(study=>study.id==='wispascend');
    if(growth)q.startStudy(growth.id);
    b.speed(policy.speed,policy.budget,policy.sessions===2?12:8);
    const growthPlan=growth&&b.studyPlan(growth);
    const growthSaving=growthPlan&&!q.get().activeStudies.some(study=>study.id==='wispascend')&&amount.gt(growthPlan.cost.lumen,q.get().lumen)&&(q.get().longStudyLevels.wispascend||0)>=5&&(q.get().spirits.ember||0)>=80;
    const forgeMasterwork=q.defs().find(node=>node.id==='masterwork'),forgeGoal=forgeMasterwork&&q.plan('masterwork',1);
    const wantsForge=b.masterworkPower()>1&&elapsed-lastRecordAt>=43200&&q.get().maxDepthEver>=70&&(q.get().spirits.ember||0)>=80;
    const forgeSaving=!growthSaving&&wantsForge&&forgeGoal&&amount.gt(forgeGoal.needed.lumen,q.get().lumen);
    const saving=growthSaving||forgeSaving;
    lastSaving=!!saving;
    // Save for the visible next development goal, rather than repeatedly
    // discarding its Lumen budget at Ascend or spending it on run levels.
    for(const sp of b.wisps())q.get().empowerQueue[sp.id]=!saving;
    for(const node of q.defs())q.get().researchQueue[node.id]=!saving&&!node.retiredTo&&node.levelCap!==undefined;
    if(!q.get().wispUltimate.ember&&q.get().spirits.tide>=10)q.get().empowerQueue.tide=false;
    if(!q.get().wispUltimate.ember&&q.get().spirits.aurora>=10)q.get().empowerQueue.aurora=false;
    b.auto(false);
    for(const sp of b.wisps()){
      if(!b.unlocked(sp))continue;
      if(q.get().spirits[sp.id]===0){const before=funds(),price=q.empowerCost(sp.id);if(q.empower(sp.id))receipt('recruit',sp.id,before,{lumen:price});}
      if(q.get().spirits[sp.id]>0){
        let before=funds(),price=b.rarityCost(sp,q.get().heroRarity[sp.id]||0);if(b.rarity(sp))receipt('rarity',sp.id,before,{lumen:price.lumen,shards:price.shard});
        before=funds();price=b.ultimateCost(sp);if(q.ultimate(sp.id))receipt('ultimate',sp.id,before,{sigils:price});
        before=funds();price=b.masteryPlan(sp).cost;
        const pendingUltimates=b.wisps().map(w=>b.ultimatePlan(w)).filter(p=>p.eligible);
        const reserve=pendingUltimates.length?pendingUltimates.reduce((least,p)=>amount.min(least,p.cost),pendingUltimates[0].cost):0;
        if(amount.ge(amount.sub(q.get().sigils,price.sigil),reserve)&&b.mastery(sp))receipt('mastery',sp.id,before,{prisms:price.prism,sigils:price.sigil});
      }
    }
    // Fewer cheap purchases per check than the old 20-per-second fixture.
    for(let i=0;i<(saving?0:5);i++){
      const options=b.wisps().filter(sp=>b.unlocked(sp)&&q.get().empowerQueue[sp.id]!==false).map(sp=>({sp,cost:q.empowerCost(sp.id)}))
        .filter(v=>amount.le(v.cost,q.get().lumen)).sort((a,b)=>amount.cmp(a.cost,b.cost));
      if(!options.length||!q.empower(options[0].sp.id))break;
    }
    if(saving)for(const id of ['thorn','gale']){
      const sp=b.wisps().find(sp=>sp.id===id);if(!sp||q.get().spirits[id]===0)continue;
      for(let n=0;n<5&&q.get().spirits[id]<50;n++){
        const cost=q.empowerCost(id);if(amount.gt(cost,amount.mul(q.get().lumen,.25))||amount.gt(cost,amount.mul(growthPlan.cost.lumen,.02)))break;q.empower(id);
      }
    }
    b.best();
    const unlocked=b.wisps().filter(sp=>q.get().spirits[sp.id]>0);
    for(const sp of unlocked){
      const state=q.get(),cost=b.moduleCost(sp,state.wispModules[sp.id]||0);
      if((!saving||sp.id==='thorn'||sp.id==='gale')&&amount.le(cost.lumen,amount.mul(state.lumen,saving?.05:.15))&&amount.le(cost.shard,amount.mul(state.shards,.15))){const before=funds();if(b.module(sp))receipt('ability',sp.id,before,{lumen:cost.lumen,shards:cost.shard});}
    }
    const nodes=b.nodes().filter(n=>b.nodePlan(n).affordable);
    // Swift is a repeat-farming investment; later buy other affordable paths.
    nodes.sort((a,c)=>Number(c.id==='swift')-Number(a.id==='swift')||amount.cmp(b.nodePlan(a).cost,b.nodePlan(c).cost));
    const readyMasteries=b.wisps().map(sp=>b.masteryPlan(sp)).filter(p=>p.eligible);
    const prismReserve=readyMasteries.length?readyMasteries.reduce((least,p)=>amount.min(least,p.cost.prism),readyMasteries[0].cost.prism):0;
    if(nodes.length&&amount.ge(amount.sub(q.get().prisms,b.nodePlan(nodes[0]).cost),prismReserve))b.buyNode(nodes[0]);
    if(forgeMasterwork){const n=!growthSaving&&wantsForge?5:1,p=q.plan('masterwork',n);if(p.buyCount>0&&((!growthSaving&&wantsForge)||amount.le(p.cost.lumen,amount.mul(q.get().lumen,.2)))&&amount.le(p.cost.shard,amount.mul(q.get().shards,.2)))q.buy('masterwork',n);}
    if(!saving){
      const priorities=['labcapacity','measuredinquiry','focusprotocol','curriculum','procurement','catalysis'];
      const studies=q.projects().filter(study=>!study.retiredTo&&study.id!=='wispascend');
      studies.sort((a,c)=>{
        const rank=s=>priorities.includes(s.id)?priorities.indexOf(s.id):s.levelCap!==undefined?priorities.length:priorities.length+1;
        return rank(a)-rank(c);
      });
      for(const study of studies)q.startStudy(study.id);
    }
    b.claim();note();
    const state=q.get();
    if(!state.owned.autoascend&&!saving&&b.eligible()&&(state.ascendCount===0||elapsed-lastRecordAt>3600)&&elapsed-lastAscendAt>=3600){
      q.ascend();lastAscendAt=elapsed;note();
    }
  }
  for(let day=history.length;day<days;day++){
    for(let session=0;session<policy.sessions;session++){
      decisions();
      for(let t=0;t<policy.activeSec;t+=policy.decisionSec){
        if(q.get().achieved.autotap)advance(policy.decisionSec,'live');
        else for(let second=0;second<policy.decisionSec;second++){q.manualTap();advance(1,'live');}
        decisions();
      }
      // Each absence is below the established 12h productive cap.
      const gap=86400/policy.sessions-policy.activeSec;
      const repeat=!lastSaving&&(q.get().longStudyLevels.wispascend||0)>=15&&(q.get().spirits.ember||0)>=80;
      b.auto(repeat);
      if(repeat&&q.get().autoAscendEnabled){b.best('push');b.push();}
      else{b.best('farm');b.farm();}
      advance(Math.min(gap,43200),'offline');
      // Nonproductive remainder would still advance wall-clock time.
      if(gap>43200)elapsed+=gap-43200;
    }
    const state=q.get();
    history.push({day:day+1,maxDepth:state.maxDepthEver,ascends:state.ascendCount,
      levels:JSON.parse(JSON.stringify(state.spirits)),rarity:JSON.parse(JSON.stringify(state.heroRarity)),
      modules:JSON.parse(JSON.stringify(state.wispModules)),labs:JSON.parse(JSON.stringify(state.longStudyLevels)),
      ultimates:JSON.parse(JSON.stringify(state.wispUltimate)),mastery:JSON.parse(JSON.stringify(state.wispMastery)),
      forge:JSON.parse(JSON.stringify(state.research)),tree:JSON.parse(JSON.stringify(state.nodes)),
      lumen:state.lumen,shards:state.shards,prisms:state.prisms,sigils:state.sigils,motes:state.motes,owned:JSON.parse(JSON.stringify(state.owned)),active:JSON.parse(JSON.stringify(state.activeStudies)),autoAscend:state.autoAscendEnabled});
    if(process.env.LUMENFALL_CAMPAIGN_PROGRESS==='1')process.stderr.write(name+' day '+(day+1)+' Rift '+state.maxDepthEver+' Lab '+state.longStudyLevels.wispascend+'\n');
    if(process.env.LUMENFALL_CAMPAIGN_SNAPSHOT){
      fs.writeFileSync(process.env.LUMENFALL_CAMPAIGN_SNAPSHOT,JSON.stringify({milestones,history,walls},null,2));
      fs.writeFileSync(process.env.LUMENFALL_CAMPAIGN_SNAPSHOT+'.endpoint.json',JSON.stringify(q.get()));
      fs.writeFileSync(process.env.LUMENFALL_CAMPAIGN_SNAPSHOT+'.checkpoint.json',JSON.stringify({phases,sourceSha256,policySha256,policy:name,elapsed,lastRecordAt,lastRecord,lastAscendAt,lastSaving,milestones,history,walls,purchases,state:q.get()}));
    }
    // Retained write evidence is not the campaign's history; release its memory.
    x.writes.length=0;
    if(runBudgetMs&&performance.now()-runStarted>=runBudgetMs)break;
  }
  const reportedWalls=walls.slice();if(elapsed-lastRecordAt>=3600)reportedWalls.push({from:lastRecord,to:null,open:true,seconds:elapsed-lastRecordAt});
  return {phases,milestones,walls:reportedWalls,history,purchases};
}
const result=campaign();
console.log(JSON.stringify({status:result.history.length===days?'MEASURED':'MEASURED_PARTIAL',sourceSha256,policySha256:policySha256,policy:name,policyDetails:policies[name],days:result.history.length,targetDays:days,resumedFrom:resumePath||null,
  policyNotes:'Early Support level10 focus ends at first Ultimate; save for eligible Ultimates before optional Mastery and reserve an eligible Mastery price before Tree spending.',limits:'Deterministic real-engine sessions and offline chronology; only earned currencies fund automation/speed; not human/device acceptance.',...result},null,2));
