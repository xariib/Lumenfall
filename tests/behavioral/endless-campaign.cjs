'use strict';
// Real complete engine, real purchases; deterministic player decisions only.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {app,CLOCK}=require('./forge-expansion-harness.cjs');
const sourcePath=process.argv[2]||'index.html';
const source=fs.readFileSync(sourcePath,'utf8');
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
  claim:function(){(state.questIds||[]).forEach(function(id){claimQuest(id);});},
  mastery:function(sp){return typeof buyWispMastery==='function' && buyWispMastery(sp);}
};
`;
const instrumented=source.replace(marker,bridge+marker);
const policies={casual:{sessions:2,activeSec:300,decisionSec:10},regular:{sessions:3,activeSec:600,decisionSec:10},efficient:{sessions:6,activeSec:900,decisionSec:5}};
const days=Number(process.argv[3]||7),name=process.argv[4]||'regular';
assert(policies[name]&&Number.isInteger(days)&&days>0&&days<=730);

function campaign(){
  const x=app(instrumented,undefined,{clockDate:true}),q=x.q;
  // Bridge is observed through a test-only function returning its closure.
  const b=q.endless;
  const policy=policies[name],milestones={},history=[],walls=[];
  let elapsed=0,lastRecordAt=0,lastRecord=1,lastAscendAt=-Infinity;
  const s=q.get();
  // Automation remains gated by earned Deeds in the production scheduler.
  Object.keys(s.empowerQueue).forEach(id=>s.empowerQueue[id]=true);
  for(const study of q.projects())s.studyQueue[study.id]=!study.retiredTo;
  // Only useful repeatable foundations and charge are automatically purchased.
  for(const id of ['charge','arcanecal','conduction','cauterize','fracturekey','guardianseal'])s.researchQueue[id]=true;
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
    for(const sp of b.wisps()){
      if(!b.unlocked(sp))continue;
      if(q.get().spirits[sp.id]===0)q.empower(sp.id);
      if(q.get().spirits[sp.id]>0){b.rarity(sp);q.ultimate(sp.id);b.mastery(sp);}
    }
    // Fewer cheap purchases per check than the old 20-per-second fixture.
    for(let i=0;i<5;i++){
      const options=b.wisps().filter(sp=>b.unlocked(sp)).map(sp=>({sp,cost:q.empowerCost(sp.id)}))
        .filter(v=>v.cost<=q.get().lumen).sort((a,b)=>a.cost-b.cost);
      if(!options.length||!q.empower(options[0].sp.id))break;
    }
    const unlocked=b.wisps().filter(sp=>q.get().spirits[sp.id]>0);
    for(const sp of unlocked){
      const state=q.get(),cost=b.moduleCost(sp,state.wispModules[sp.id]||0);
      if(cost.lumen<=state.lumen*.15&&cost.shard<=state.shards*.15)b.module(sp);
    }
    const nodes=b.nodes().filter(n=>b.nodePlan(n).affordable);
    // Swift is a repeat-farming investment; later buy other affordable paths.
    nodes.sort((a,c)=>Number(c.id==='swift')-Number(a.id==='swift')||b.nodePlan(a).cost-b.nodePlan(c).cost);
    if(nodes.length)b.buyNode(nodes[0]);
    for(const study of q.projects())if(!study.retiredTo)q.startStudy(study.id);
    b.claim();note();
    const state=q.get();
    if(b.eligible()&&(state.ascendCount===0||elapsed-lastRecordAt>3600)&&elapsed-lastAscendAt>=3600){
      q.ascend();lastAscendAt=elapsed;note();
    }
  }
  for(let day=0;day<days;day++){
    for(let session=0;session<policy.sessions;session++){
      decisions();
      for(let t=0;t<policy.activeSec;t+=policy.decisionSec){
        for(let second=0;second<policy.decisionSec;second++){
          if(!q.get().achieved.autotap)q.manualTap();
          advance(1,'live');
        }
        decisions();
      }
      // Each absence is below the established 12h productive cap.
      const gap=86400/policy.sessions-policy.activeSec;
      advance(Math.min(gap,43200),'offline');
      // Nonproductive remainder would still advance wall-clock time.
      if(gap>43200)elapsed+=gap-43200;
    }
    const state=q.get();
    history.push({day:day+1,maxDepth:state.maxDepthEver,ascends:state.ascendCount,
      levels:JSON.parse(JSON.stringify(state.spirits)),rarity:JSON.parse(JSON.stringify(state.heroRarity)),
      modules:JSON.parse(JSON.stringify(state.wispModules)),labs:JSON.parse(JSON.stringify(state.longStudyLevels)),
      forge:JSON.parse(JSON.stringify(state.research)),tree:JSON.parse(JSON.stringify(state.nodes)),
      lumen:state.lumen,shards:state.shards,prisms:state.prisms,sigils:state.sigils});
    if(process.env.LUMENFALL_CAMPAIGN_PROGRESS==='1')process.stderr.write(name+' day '+(day+1)+' Rift '+state.maxDepthEver+' Lab '+state.longStudyLevels.wispascend+'\n');
    if(process.env.LUMENFALL_CAMPAIGN_SNAPSHOT)fs.writeFileSync(process.env.LUMENFALL_CAMPAIGN_SNAPSHOT,JSON.stringify({milestones,history,walls},null,2));
    // Retained write evidence is not the campaign's history; release its memory.
    x.writes.length=0;
  }
  return {milestones,walls,history};
}
const result=campaign();
console.log(JSON.stringify({status:'MEASURED',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),policy:name,policyDetails:policies[name],days,
  limits:'Deterministic real-engine sessions and offline chronology; no paid speed; not human/device acceptance.',...result},null,2));
