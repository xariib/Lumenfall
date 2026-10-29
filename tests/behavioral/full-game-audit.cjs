'use strict';
// Complete production IIFE. Hooks expose entry points, never replace gameplay.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const F=require('./forge-expansion-harness.cjs'),A=require('../../scripts/lib/game-amount.cjs');
const file=process.argv[2]||'index.html',raw=fs.readFileSync(file,'utf8');
let product=raw;
if(process.env.FULL_GAME_AUDIT_MUTANT){
  const changes={
    recruitment:["affordable:recruited&&funded","affordable:funded"],
    canonical:["if(SPIRITS.indexOf(sp)===-1)return {affordable:false,reason:'invalid'};\n  var level=moduleLevel(sp.id);","if(!sp)return {affordable:false,reason:'invalid'};\n  var level=moduleLevel(sp.id);"],
    quest:["  if(!forgeCommitPaidMutation(function(){\n    state.questClaimed[id] = true;\n    state.comets=creditAmount(state.comets,q.reward.comets||0);\n    if(q.reward.prisms) state.prisms=creditAmount(state.prisms,q.reward.prisms);\n  }))return false;","  state.questClaimed[id]=true;state.comets=creditAmount(state.comets,q.reward.comets||0);if(q.reward.prisms)state.prisms=creditAmount(state.prisms,q.reward.prisms);"]
  };
  const patch=changes[process.env.FULL_GAME_AUDIT_MUTANT];assert(patch);assert.equal(product.split(patch[0]).length,2);product=product.replace(...patch);
}
const marker="if(document.readyState==='loading'){";
assert.equal(raw.split(marker).length,2);
const source=product.replace(marker,`window.endlessQa={module:buyModule,moduleCost:moduleCost,
  modulePlan:typeof getWispModulePlan==='function'?getWispModulePlan:null,
  claim:claimQuest,quests:QUEST_POOL,rarity:buyRarity,ultimate:buyUltimate,
  nodes:function(){return NODES;},buyNode:buyNode,nodePlan:getNodeBuyPlan,
  studyCost:studyCost,studyDuration:studyDuration,studyPlan:getStudyStartPlan,
  toggle:toggleActive,preset:applyFormationPreset};`+marker);
const records=[];let checks=0;
const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);},ok=(v,m)=>{checks++;assert(v,m);};
function game(){const x=F.app(source,undefined,{clockDate:true,retainWrites:false});return {...x,b:x.q.endless};}
function seed(q){const s=q.fresh();s.maxDepthEver=5000;s.questDay=q.day();s.lastSeen=F.CLOCK;
  s.lumen=s.shards=s.sigils=s.prisms=s.comets=1e12;
  for(const key of ['empowerQueue','researchQueue','studyQueue'])for(const id of Object.keys(s[key]))s[key][id]=false;
  return s;}
function test(name,fn){const start=checks;try{fn();records.push({name,status:'pass',checks:checks-start});}catch(e){records.push({name,status:'fail',checks:checks-start,error:e.message});}}
test('module-recruitment-and-canonical-price',()=>{
  const {q,b}=game(),s=seed(q);s.spirits.tide=0;q.set(s);
  const before=F.clone(q.get());eq(b.module(q.sp('tide')),false,'unrecruited Wisp cannot buy ability upgrades');eq(q.get(),before,'rejected upgrade preserves all state');
  q.get().spirits.tide=1;const funded=F.clone(q.get());
  eq(b.module({...q.sp('tide'),baseCost:0}),false,'forged Wisp cannot substitute a free price');eq(q.get(),funded,'noncanonical Wisp changes nothing');
  eq(b.module(null),false,'unknown Wisp safely rejects');
});
test('module-payment-cap-and-storage-failures',()=>{
  for(const wallet of [1e12,'1e400'])for(const fault of ['none','primary','recovery']){
    const x=game(),{q,b}=x,s=seed(q);s.spirits.tide=1;s.lumen=s.shards=wallet;q.set(s);ok(q.save(),'seed persists');
    const before=F.clone(q.get()),cost=b.moduleCost(q.sp('tide'),0);x.fail(fault==='primary',fault==='recovery');
    const purchased=b.module(q.sp('tide'));
    if(fault==='primary'){eq(purchased,false,'primary failure rejects upgrade');eq(q.get(),before,'primary failure rolls back complete state');x.fail(false,false);ok(b.module(q.sp('tide')),'retry pays once');}
    else ok(purchased,'accepted primary owns upgrade');
    eq(q.get().wispModules.tide,1,'one ability level');eq(A.exactAdd(q.get().lumen,cost.lumen),wallet,'exact Lumen debit');eq(A.exactAdd(q.get().shards,cost.shard),wallet,'exact Shard debit');
    const cold=F.app(source,x.storage,{clockDate:true}).q;eq(cold.get().wispModules.tide,1,'primary cold reload retains level');
    q.get().wispModules.tide=20;const capped=F.clone(q.get());eq(b.module(q.sp('tide')),false,'ability cap cannot be bypassed');eq(q.get(),capped,'cap changes nothing');
  }
});
test('quest-claim-durable-and-once',()=>{
  for(const fault of ['none','primary','recovery']){
    const x=game(),{q,b}=x,s=seed(q),quest=b.quests[0];s.questIds=[quest.id];s.dailyStats[quest.metric]=quest.goal;s.questClaimed={};q.set(s);ok(q.save(),'quest seed persists');
    const before=F.clone(q.get());x.fail(fault==='primary',fault==='recovery');
    const result=b.claim(quest.id);
    if(fault==='primary'){eq(result,false,'failed primary must reject claim');eq(q.get(),before,'failed claim rolls back');x.fail(false,false);ok(b.claim(quest.id),'claim retry succeeds');}
    else {
      const immediate=F.app(source,x.storage,{clockDate:true}).q;
      eq(immediate.get().questClaimed[quest.id],true,'claim survives immediate cold reload before any other action');
      ok(result,'claim reports persisted success');
    }
    const paid=F.clone(q.get());eq(paid.comets,before.comets+(quest.reward.comets||0),'exact quest reward');
    eq(b.claim(quest.id),false,'repeated claim rejected');eq(q.get(),paid,'repeat awards nothing');
    const cold=F.app(source,x.storage,{clockDate:true}).q;eq(cold.get().questClaimed[quest.id],true,'claim survives immediate cold reload');eq(cold.get().comets,paid.comets,'reward survives immediate cold reload');
  }
});
test('workshop-catalogue-and-cap-boundaries',()=>{
  const {q,b}=game(),s=seed(q);s.lumen=s.shards='1e400';q.set(s);
  const ids=new Set();
  for(const node of q.defs()){
    ok(!ids.has(node.id),'unique Forge ID '+node.id);ids.add(node.id);ok(Number.isInteger(node.levelCap)&&node.levelCap>0,'finite Forge cap '+node.id);
    const cap=node.levelCap;q.get().research[node.id]=cap;eq(q.plan(node.id,1).reason,node.retiredTo?'retired':'maxed','Forge cap rejects purchase '+node.id);
    const before=F.clone(q.get());eq(q.buy(node.id,1),false,'capped buy rejects '+node.id);eq(q.get(),before,'capped buy preserves complete state '+node.id);
  }
  const labIds=new Set();for(const node of q.projects()){
    ok(!labIds.has(node.id),'unique Lab ID '+node.id);labIds.add(node.id);ok(Number.isInteger(node.levelCap)&&node.levelCap>0,'finite Lab cap '+node.id);
    q.get().longStudyLevels[node.id]=node.levelCap;eq(b.studyPlan(node).reason,node.retiredTo?'retired':'maxed','Lab cap rejects start '+node.id);
  }
});
const failures=records.filter(r=>r.status==='fail'),controls=[];
if(process.argv.includes('--negative')&&!failures.length){
  const {spawnSync}=require('node:child_process');
  for(const id of ['recruitment','canonical','quest']){
    const r=spawnSync(process.execPath,[__filename,file],{encoding:'utf8',env:{...process.env,FULL_GAME_AUDIT_MUTANT:id}});
    assert.equal(r.status,1,'causal defect rejected '+id);const result=JSON.parse(r.stdout);
    const failed=result.records.filter(r=>r.status==='fail');assert(failed.length,'actual behavior fails '+id);
    controls.push({id,status:'killed',failures:failed.map(r=>({name:r.name,error:r.error}))});
  }
}
console.log(JSON.stringify({status:failures.length?'fail':'pass',checks,sourceSha256:crypto.createHash('sha256').update(raw).digest('hex'),records,controls},null,2));
if(failures.length)process.exitCode=1;
