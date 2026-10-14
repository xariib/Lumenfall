'use strict';
// Real complete engine, real purchases; deterministic player decisions only.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {app,CLOCK}=require('./forge-expansion-harness.cjs');
const sourcePath=process.argv[2]||'index.html';
const source=fs.readFileSync(sourcePath,'utf8');
const policySha256=crypto.createHash('sha256').update(fs.readFileSync(__filename)).update(fs.readFileSync(require.resolve('./forge-expansion-harness.cjs'))).digest('hex');
const marker="if(document.readyState==='loading'){";
const bridge=`
window.endlessQa={
  wisps:function(){return SPIRITS;},nodes:function(){return NODES;},
  unlocked:function(sp){return state.maxDepthEver>=treeWispUnlockDepth(sp);},
  rarity:function(sp){return buyRarity(sp);},module:function(sp){return buyModule(sp);},
  moduleCost:moduleCost,rarityCost:rarityCost,rarityReq:rarityReq,
  buyNode:buyNode,nodePlan:getNodeBuyPlan,studyPlan:getStudyStartPlan,
  farm:enterFarmMode,push:enterPushMode,eligible:ascendEligible,
  day:ensureDaily,
  best:function(mode){
    var owned=SPIRITS.filter(function(sp){return state.spirits[sp.id]>0;});
    owned.sort(function(a,b){return wispPower(b,state.spirits[b.id])-wispPower(a,state.spirits[a.id]);});
    var support=owned.filter(function(sp){return sp.abilityType==='support';})[0];
    var forced=mode==='farm'?['tide','aurora','gale','thorn'].filter(function(id){return state.spirits[id]>0;}):support?[support.id]:[];
    var chosen=owned.filter(function(sp){return forced.indexOf(sp.id)===-1;}).slice(0,treeFormationCapacity()-forced.length).map(function(sp){return sp.id;}).concat(forced);
    commitFormationMembers(chosen);
  },
  claim:function(){(state.questIds||[]).forEach(function(id){claimQuest(id);});},
  mastery:function(sp){return typeof buyWispMastery==='function' && buyWispMastery(sp);},
  auto:function(enabled){
    var item=SHOP.find(function(row){return row.id==='autoascend';});
    if(!state.owned.autoascend)buyShopItem(item);
    if(!state.owned.autoascend)return;
    setAutoAscendClearedTarget(String(Math.max(15,state.maxDepthEver-1)));
    state.autoAscendEnabled=!!enabled;
  }
};
`;
const instrumented=source.replace(marker,bridge+marker);
const policies={casual:{sessions:2,activeSec:300,decisionSec:10,speed:1.5},regular:{sessions:3,activeSec:600,decisionSec:10,speed:1.5},efficient:{sessions:6,activeSec:900,decisionSec:5,speed:8}};
const days=Number(process.argv[3]||7),name=process.argv[4]||'regular';
assert(policies[name]&&Number.isInteger(days)&&days>0&&days<=730);

function campaign(){
  const x=app(instrumented,undefined,{clockDate:true}),q=x.q;
  // Bridge is observed through a test-only function returning its closure.
  const b=q.endless;
  const policy=policies[name],milestones={},history=[],walls=[];
  let elapsed=0,lastRecordAt=0,lastRecord=1,lastAscendAt=-Infinity,lastSaving=false;
  const s=q.get();
  // Automation remains gated by earned Deeds in the production scheduler.
  Object.keys(s.empowerQueue).forEach(id=>s.empowerQueue[id]=true);
  for(const study of q.projects())s.studyQueue[study.id]=study.id==='wispascend';
  // Speed is paid only from earned Motes, at the actual per-project price.
  for(const study of q.projects()){s.studyUseMotes[study.id]=study.id==='wispascend';s.studySpeedTargets[study.id]=policy.speed;}
  // Only useful repeatable foundations and charge are automatically purchased.
  for(const node of q.defs())s.researchQueue[node.id]=!node.retiredTo&&node.levelCap!==undefined;
  const note=()=>{
    const state=q.get();
    for(const sp of b.wisps()){
      if(state.spirits[sp.id]>0&&milestones['recruit.'+sp.id]===undefined)milestones['recruit.'+sp.id]=elapsed;
      if(state.heroRarity[sp.id]>0&&milestones.firstRarity===undefined)milestones.firstRarity=elapsed;
      if(state.heroRarity[sp.id]>=5&&milestones.firstMythic===undefined)milestones.firstMythic=elapsed;
      if(state.wispUltimate[sp.id]&&milestones.firstUltimate===undefined)milestones.firstUltimate=elapsed;
      if(state.wispMastery&&state.wispMastery[sp.id]>0&&milestones.firstMastery===undefined)milestones.firstMastery=elapsed;
    }
    if(state.ascendCount>0&&milestones.firstAscend===undefined)milestones.firstAscend=elapsed;
    if(b.wisps().every(sp=>milestones['recruit.'+sp.id]!==undefined)&&milestones.allRecruits===undefined)milestones.allRecruits=elapsed;
    if(state.maxDepthEver>lastRecord){
      if(elapsed-lastRecordAt>=3600)walls.push({from:lastRecord,to:state.maxDepthEver,seconds:elapsed-lastRecordAt});
      lastRecord=state.maxDepthEver;lastRecordAt=elapsed;
    }
  };
  function advance(seconds,kind){
    x.clock(CLOCK+elapsed*1000);
    const result=q.advance(seconds,{kind:kind,clockStartMs:CLOCK+elapsed*1000,offlineWindowStartMs:CLOCK+elapsed*1000});
    elapsed+=seconds;x.clock(CLOCK+elapsed*1000);note();
    assert.equal(result.processedSec===undefined||result.processedSec>=0,true);
    assert(Number.isFinite(q.get().lumen)&&Number.isFinite(q.get().enemyHp),'finite engine campaign state');
  }
  function decisions(){
    b.day();
    b.push();
    const growth=q.projects().find(study=>study.id==='wispascend');
    if(growth)q.startStudy(growth.id);
    const growthPlan=growth&&b.studyPlan(growth);
    const saving=growthPlan&&!q.get().activeStudies.some(study=>study.id==='wispascend')&&growthPlan.cost.lumen>q.get().lumen&&(q.get().longStudyLevels.wispascend||0)>=10&&(q.get().spirits.ember||0)>=80;
    lastSaving=!!saving;
    // Save for the visible next development goal, rather than repeatedly
    // discarding its Lumen budget at Ascend or spending it on run levels.
    for(const sp of b.wisps())q.get().empowerQueue[sp.id]=!saving;
    if(q.get().spirits.tide>=10)q.get().empowerQueue.tide=false;
    if(q.get().spirits.aurora>=10)q.get().empowerQueue.aurora=false;
    b.auto(false);
    for(const sp of b.wisps()){
      if(!b.unlocked(sp))continue;
      if(q.get().spirits[sp.id]===0)q.empower(sp.id);
      if(q.get().spirits[sp.id]>0){b.rarity(sp);q.ultimate(sp.id);b.mastery(sp);}
    }
    // Fewer cheap purchases per check than the old 20-per-second fixture.
    for(let i=0;i<(saving?0:5);i++){
      const options=b.wisps().filter(sp=>b.unlocked(sp)&&q.get().empowerQueue[sp.id]!==false).map(sp=>({sp,cost:q.empowerCost(sp.id)}))
        .filter(v=>v.cost<=q.get().lumen).sort((a,b)=>a.cost-b.cost);
      if(!options.length||!q.empower(options[0].sp.id))break;
    }
    if(saving)for(const id of ['thorn','gale']){
      const sp=b.wisps().find(sp=>sp.id===id);if(!sp||q.get().spirits[id]===0)continue;
      for(let n=0;n<5&&q.get().spirits[id]<50;n++){
        const cost=q.empowerCost(id);if(cost>q.get().lumen*.25||cost>growthPlan.cost.lumen*.02)break;q.empower(id);
      }
    }
    b.best();
    const unlocked=b.wisps().filter(sp=>q.get().spirits[sp.id]>0);
    for(const sp of unlocked){
      const state=q.get(),cost=b.moduleCost(sp,state.wispModules[sp.id]||0);
      if((!saving||sp.id==='thorn'||sp.id==='gale')&&cost.lumen<=state.lumen*(saving?.05:.15)&&cost.shard<=state.shards*.15)b.module(sp);
    }
    const nodes=b.nodes().filter(n=>b.nodePlan(n).affordable);
    // Swift is a repeat-farming investment; later buy other affordable paths.
    nodes.sort((a,c)=>Number(c.id==='swift')-Number(a.id==='swift')||b.nodePlan(a).cost-b.nodePlan(c).cost);
    if(nodes.length)b.buyNode(nodes[0]);
    const forgeMasterwork=q.defs().find(node=>node.id==='masterwork');
    if(!saving&&forgeMasterwork){const p=q.plan('masterwork',1);if(p.buyCount===1&&p.cost.lumen<=q.get().lumen*.2&&p.cost.shard<=q.get().shards*.2)q.buy('masterwork',1);}
    if(!saving)for(const study of q.projects())if(!study.retiredTo)q.startStudy(study.id);
    b.claim();note();
    const state=q.get();
    if(!state.owned.autoascend&&!saving&&b.eligible()&&(state.ascendCount===0||elapsed-lastRecordAt>3600)&&elapsed-lastAscendAt>=3600){
      q.ascend();lastAscendAt=elapsed;note();
    }
  }
  for(let day=0;day<days;day++){
    for(let session=0;session<policy.sessions;session++){
      decisions();
      for(let t=0;t<policy.activeSec;t+=policy.decisionSec){
        if(q.get().achieved.autotap)advance(policy.decisionSec,'live');
        else for(let second=0;second<policy.decisionSec;second++){q.manualTap();advance(1,'live');}
        decisions();
      }
      // Each absence is below the established 12h productive cap.
      const gap=86400/policy.sessions-policy.activeSec;
      b.best('farm');
      b.auto(!lastSaving&&(q.get().longStudyLevels.wispascend||0)>=15&&(q.get().spirits.ember||0)>=80);
      advance(Math.min(gap,43200),'offline');
      // Nonproductive remainder would still advance wall-clock time.
      if(gap>43200)elapsed+=gap-43200;
    }
    const state=q.get();
    history.push({day:day+1,maxDepth:state.maxDepthEver,ascends:state.ascendCount,
      levels:JSON.parse(JSON.stringify(state.spirits)),rarity:JSON.parse(JSON.stringify(state.heroRarity)),
      modules:JSON.parse(JSON.stringify(state.wispModules)),labs:JSON.parse(JSON.stringify(state.longStudyLevels)),
      forge:JSON.parse(JSON.stringify(state.research)),tree:JSON.parse(JSON.stringify(state.nodes)),
      lumen:state.lumen,shards:state.shards,prisms:state.prisms,sigils:state.sigils,motes:state.motes,owned:JSON.parse(JSON.stringify(state.owned)),active:JSON.parse(JSON.stringify(state.activeStudies)),autoAscend:state.autoAscendEnabled});
    if(process.env.LUMENFALL_CAMPAIGN_PROGRESS==='1')process.stderr.write(name+' day '+(day+1)+' Rift '+state.maxDepthEver+' Lab '+state.longStudyLevels.wispascend+'\n');
    if(process.env.LUMENFALL_CAMPAIGN_SNAPSHOT)fs.writeFileSync(process.env.LUMENFALL_CAMPAIGN_SNAPSHOT,JSON.stringify({milestones,history,walls},null,2));
    // Retained write evidence is not the campaign's history; release its memory.
    x.writes.length=0;
  }
  return {milestones,walls,history};
}
const result=campaign();
console.log(JSON.stringify({status:'MEASURED',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),policySha256:policySha256,policy:name,policyDetails:policies[name],days,
  limits:'Deterministic real-engine sessions and offline chronology; only earned currencies fund automation/speed; not human/device acceptance.',...result},null,2));
