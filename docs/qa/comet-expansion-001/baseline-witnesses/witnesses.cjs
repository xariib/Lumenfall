#!/usr/bin/env node
'use strict';
// Baseline diagnostic only. The archived published game and archived complete-
// IIFE harness stay byte-for-byte unchanged. Additive hooks expose actual handlers
// and observe the existing storage adapter. No handler body is replaced.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {app,clone,P,R,CLOCK}=require('./tree-expansion-harness.cjs');
const out=__dirname,source=fs.readFileSync(path.join(out,'source-3c931.html'),'utf8');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const marker="if(document.readyState==='loading'){";
assert.equal(sha(source),'4e4707afca6672ea46aad03ebd05cd7341ad61d7316a9636fed6172dbfed96ef');
assert.equal(source.split(marker).length,2);
const hooks=`
  var cometWitnessAttempts=[],cometWitnessSetItem=localStorage.setItem;
  localStorage.setItem=function(key,value){
    var entry={key:key,value:String(value),status:'started'};cometWitnessAttempts.push(entry);
    try{var result=cometWitnessSetItem.call(localStorage,key,value);entry.status='committed';return result;}
    catch(error){entry.status='threw';entry.error=String(error.message||error);throw error;}
  };
  window.qa.comet={
    shopDefs:function(){return SHOP;},buy:function(id){return buyShopItem({id:id});},
    refresh:refreshDailyQuest,refreshCost:dailyQuestRefreshCost,refreshCandidates:dailyQuestRefreshCandidates,
    restStop:restStopComplete,attempts:function(){return cometWitnessAttempts;},
    legacyForgeIds:function(){return LEGACY_RESEARCH_IDS;},foundationStudyIds:function(){return CURRENT_STUDY_IDS;},
    legacyStudyIds:function(){return LEGACY_STUDY_IDS;},trials:function(){return COMET_TRIALS;}
  };
`;
fs.writeFileSync(path.join(out,'observer-hooks.js'),hooks);
const observedSource=source.replace(marker,marker+hooks);
const make=saved=>app(observedSource,saved);
fs.mkdirSync(path.join(out,'blobs'),{recursive:true});
function rawBlob(raw,extension='json'){
  const bytes=Buffer.from(raw),hash=sha(bytes),name='blobs/'+hash+'.'+extension;
  if(!fs.existsSync(path.join(out,name)))fs.writeFileSync(path.join(out,name),bytes);
  return {path:name,bytes:bytes.length,sha256:hash};
}
const valueBlob=value=>rawBlob(JSON.stringify(value));
function view(s){return {comets:s.comets,owned:clone(s.owned),achieved:clone(s.achieved),questIds:clone(s.questIds),questClaimed:clone(s.questClaimed),questDay:s.questDay,dailyQuestRefreshes:s.dailyQuestRefreshes,autoAscendEnabled:s.autoAscendEnabled,autoAscendTargetDepth:s.autoAscendTargetDepth,legacyCometPurchases:clone(s.legacyCometPurchases),offline12hRefund:clone(s.offline12hRefund)};}
function snapshot(a){
  return {state:valueBlob(a.q.get()),view:view(a.q.get()),primary:a.storage.has(P)?rawBlob(a.storage.get(P)):null,recovery:a.storage.has(R)?rawBlob(a.storage.get(R)):null};
}
function observe(a,label,fn){
  const before=snapshot(a),state=a.q.get(),attemptIndex=a.q.comet.attempts().length,writeIndex=a.writes.length;
  let returned,error;
  try{returned=fn();}catch(e){error={name:e.name,message:e.message,stack:e.stack};}
  const attempts=a.q.comet.attempts().slice(attemptIndex).map(e=>({key:e.key,status:e.status,error:e.error||null,value:rawBlob(e.value)}));
  return {label,before,after:snapshot(a),sameLiveObject:state===a.q.get(),returned:returned===undefined?null:clone(returned),returnedUndefined:returned===undefined,error:error||null,attempts,attemptCounts:{primary:attempts.filter(e=>e.key===P).length,recovery:attempts.filter(e=>e.key===R).length},successfulWrites:a.writes.slice(writeIndex).map(e=>({key:e.key,value:rawBlob(e.value)}))};
}
function fresh(q,wallet=0){
  const s=q.fresh();s.comets=wallet;s.maxDepthEver=30;s.depth=s.enemyDepth=1;s.enemyHp=s.enemyMaxHp=11;
  s.questDay=q.day();s.lastSeen=CLOCK;s.autoAscendEnabled=false;s.autoAscendTargetDepth=43;
  for(const key of ['empowerQueue','researchQueue','studyQueue','studyUseMotes'])Object.keys(s[key]).forEach(id=>s[key][id]=false);
  return s;
}
function setup(mutator,wallet){
  const a=make(),s=fresh(a.q,wallet);if(mutator)mutator(s,a.q);const seeded=valueBlob(s);a.q.set(s);assert.equal(a.q.save(),true);
  return {a,seeded,baseline:snapshot(a)};
}
function backup(a){
  let code;
  const result=observe(a,'actual currentSaveBackup export',()=>{code=a.q.export();return {backup:rawBlob(code,'txt'),decoded:valueBlob(a.q.decode(code)),view:view(a.q.decode(code))};});
  return result;
}
const expectedShop=[['autoascend',100],['comettrials',140],['rifttrail',50],['starfallcrest',160]];
const expectedDeeds=[['d10',5],['d25',10],['d50',20],['d100',50],['d250',100],['tap100',3],['tap1000',8],['tap10000',20],['fullparty',12],['asc1',10],['asc5',25],['asc10',50],['all',30],['mythic',40],['idle8',15],['autotap',25],['labmaster',30],['study1',15],['study25',50],['allstudies',35],['labqueue',40],['firstultimate',45],['modulemax',45]];
const inventory=make().q;
assert.deepEqual(inventory.comet.shopDefs().map(s=>[s.id,s.cost]),expectedShop);
assert.deepEqual(inventory.achievementDefs().map(d=>[d.id,d.reward]),expectedDeeds);
const records=[];
function saveRecord(record){records.push(record);fs.writeFileSync(path.join(out,record.id+'.json'),JSON.stringify(record,null,2)+'\n');}

for(const [id,cost] of expectedShop){
  for(const fault of ['none','primary','recovery','huge','short']){
    const wallet=fault==='huge'?1e30:fault==='short'?cost-1:cost+7;
    const {a,seeded,baseline}=setup(null,wallet);a.fail(fault==='primary',fault==='recovery');
    const purchase=observe(a,'actual buyShopItem('+id+')',()=>a.q.comet.buy(id));
    assert.equal(purchase.error,null);assert.equal(purchase.returned,fault!=='short');
    assert.equal(!!a.q.get().owned[id],fault!=='short');
    const debit=wallet-a.q.get().comets;
    assert.equal(debit,fault==='huge'||fault==='short'?0:cost);
    assert.equal(purchase.successfulWrites.length,fault==='primary'||fault==='short'?0:fault==='recovery'?1:2);
    if(fault==='primary'||fault==='short')assert.equal(a.storage.get(P),fs.readFileSync(path.join(out,baseline.primary.path),'utf8'));
    const cold=make(a.storage),coldAfter=snapshot(cold);
    assert.equal(!!cold.q.get().owned[id],fault!=='primary'&&fault!=='short');
    const backupResult=backup(a);
    assert.equal(!!backupResult.returned.view.owned[id],fault!=='short');
    a.fail(false,false);
    const sameSessionRetry=observe(a,'same-session retry after clearing fault',()=>a.q.comet.buy(id));
    assert.equal(sameSessionRetry.returned,false);
    let coldRetry=null;
    if(fault==='primary'){
      coldRetry=observe(cold,'cold-reload retry against old committed endpoint',()=>cold.q.comet.buy(id));
      assert.equal(coldRetry.returned,true);assert.equal(coldRetry.before.view.comets-coldRetry.after.view.comets,cost);
    }
    saveRecord({id:'shop-'+id+'-'+fault,kind:'shop',item:id,quotedCost:cost,fault,seeded,baseline,purchase,representedDebit:debit,coldAfter,backup:backupResult,sameSessionRetry,coldRetry,observedDefect:fault==='primary'?'returned success and mutated live ownership/wallet despite failed primary; old cold state; leaked endpoint exportable':fault==='huge'?'ownership persisted with zero represented Comet debit':null});
  }
}

function questSeed(s){s.owned.autoascend=true;s.owned.comettrials=true;s.questIds=['q_tap_small','q_kill_small','q_empower'];s.questClaimed={};s.dailyQuestRefreshes=0;s.dailyStats={};}
for(const fault of ['none','primary','recovery','huge','short']){
  const wallet=fault==='huge'?1e30:fault==='short'?24:50;
  const {a,seeded,baseline}=setup(questSeed,wallet);assert.equal(a.q.comet.restStop(),true);assert.equal(a.q.comet.refreshCost(),25);
  a.fail(fault==='primary',fault==='recovery');
  const refresh=observe(a,'actual refreshDailyQuest(q_tap_small)',()=>a.q.comet.refresh('q_tap_small'));
  assert.equal(refresh.error,null);assert.equal(refresh.returned,fault!=='short');
  assert.equal(a.q.get().dailyQuestRefreshes,fault==='short'?0:1);
  const debit=wallet-a.q.get().comets;assert.equal(debit,fault==='huge'||fault==='short'?0:25);
  assert.equal(refresh.successfulWrites.length,fault==='primary'||fault==='short'?0:fault==='recovery'?1:2);
  const cold=make(a.storage),coldAfter=snapshot(cold);
  assert.equal(cold.q.get().dailyQuestRefreshes,fault==='primary'||fault==='short'?0:1);
  const backupResult=backup(a);a.fail(false,false);
  const sameOriginalIdRetry=observe(a,'same original slot-ID retry after clearing fault',()=>a.q.comet.refresh('q_tap_small'));
  assert.equal(sameOriginalIdRetry.returned,false);
  let coldRetry=null;
  if(fault==='primary'){
    coldRetry=observe(cold,'cold-reload retry of original quest',()=>cold.q.comet.refresh('q_tap_small'));
    assert.equal(coldRetry.returned,true);assert.equal(coldRetry.before.view.comets-coldRetry.after.view.comets,25);
  }
  saveRecord({id:'quest-refresh-'+fault,kind:'quest-refresh',quotedCost:25,fault,seeded,baseline,refresh,representedDebit:debit,coldAfter,backup:backupResult,sameOriginalIdRetry,coldRetry,observedDefect:fault==='primary'?'returned success and mutated quest/count/wallet despite failed primary; old cold state; leaked endpoint exportable':fault==='huge'?'quest/count persisted with zero represented Comet debit':null});
}

for(const [label,wallet,expectedCredit] of [['safe',0,3],['rounded',1e16,4],['huge',1e30,0]]){
  const {a,seeded,baseline}=setup(s=>{s.maxDepthEver=1;s.totalTaps=100;},wallet);
  const awarded=observe(a,'actual applyAchievementChecks()',()=>a.q.achievements().map(d=>({id:d.id,reward:d.reward})));
  assert.deepEqual(awarded.returned,[{id:'tap100',reward:3}]);assert.equal(awarded.attempts.length,0);
  const representedCredit=a.q.get().comets-wallet;assert.equal(representedCredit,expectedCredit);assert.equal(a.q.get().achieved.tap100,true);
  const save=observe(a,'actual subsequent saveState()',()=>a.q.save());assert.equal(save.returned,true);
  const cold=make(a.storage),coldAfter=snapshot(cold),recheck=observe(cold,'cold-reload applyAchievementChecks()',()=>cold.q.achievements().map(d=>({id:d.id,reward:d.reward})));
  assert.deepEqual(recheck.returned,[]);assert.equal(cold.q.get().comets,wallet+expectedCredit);
  const backupResult=backup(a);
  saveRecord({id:'deed-tap100-'+label,kind:'deed',seeded,baseline,nominalReward:3,awarded,representedCredit,save,coldAfter,recheck,backup:backupResult,observedDefect:label==='rounded'?'earned flag persists with represented reward4 instead of3':label==='huge'?'earned flag persists with zero represented reward; reload does not re-award':null});
}

for(const [id,reward,mutate] of [
  ['autotap',25,s=>{s.maxDepthEver=1;s.ascendCount=12;s.achieved={asc1:true,asc5:true,asc10:true};}],
  ['labmaster',30,s=>{s.maxDepthEver=1;s.research.focus=20;}]
]){
  const {a,seeded,baseline}=setup(mutate,1e30);
  const awarded=observe(a,'actual unlock Deed applyAchievementChecks()',()=>a.q.achievements().map(d=>({id:d.id,reward:d.reward})));
  assert.deepEqual(awarded.returned,[{id,reward}]);assert.equal(a.q.get().comets,1e30);assert.equal(a.q.get().achieved[id],true);
  const save=observe(a,'actual subsequent saveState()',()=>a.q.save());assert.equal(save.returned,true);
  const cold=make(a.storage),coldAfter=snapshot(cold);assert.equal(cold.q.get().achieved[id],true);
  saveRecord({id:'deed-'+id+'-huge',kind:'deed-unlock',seeded,baseline,nominalReward:reward,representedCredit:0,awarded,save,coldAfter,observedDefect:'sticky automation unlock persists while its nominal Comet reward is unrepresented; do not revoke this earned unlock in any future repair'});
}

const gates=[];
for(const count of [11,12]){const a=make(),s=fresh(a.q);s.ascendCount=count;a.q.set(s);gates.push({name:'autotap',ascends:count,eligible:a.q.deed('autotap')});}
for(const count of [19,20]){const a=make(),s=fresh(a.q);s.research.focus=count;a.q.set(s);gates.push({name:'labmaster',originalForgeLevels:count,eligible:a.q.deed('labmaster')});}
{const a=make(),s=fresh(a.q);s.research.relay=100;s.nodes.frontier=5;a.q.set(s);gates.push({name:'labmaster',onlyAddedForgeAndTree:true,eligible:a.q.deed('labmaster')});}
const entitlements=[];
for(const route of ['auto-only','auto-trials','auto-all-legacy','auto-two-legacy','no-auto-trials']){
  const a=make(),s=fresh(a.q);s.owned.autoascend=route!=='no-auto-trials';s.owned.comettrials=route==='auto-trials'||route==='no-auto-trials';
  if(route==='auto-all-legacy'||route==='auto-two-legacy')s.legacyCometPurchases={rememberbulk:true,offline24:true,offline48:route==='auto-all-legacy'};
  a.q.set(s);entitlements.push({route,seeded:valueBlob(s),accepted:snapshot(a),refreshEntitled:a.q.comet.restStop()});
}
assert.deepEqual(gates.map(g=>g.eligible),[false,true,false,true,false]);
assert.deepEqual(entitlements.map(e=>e.refreshEntitled),[false,true,true,false,false]);
const catalog={shop:expectedShop,deeds:expectedDeeds,deedCount:expectedDeeds.length,deedRewardPool:expectedDeeds.reduce((n,d)=>n+d[1],0),legacyForgeIds:inventory.comet.legacyForgeIds(),legacyStudyIds:inventory.comet.legacyStudyIds(),foundationStudyIds:inventory.comet.foundationStudyIds(),trials:inventory.comet.trials().map(t=>({id:t.id,rule:t.rule,mark:t.mark})),gates,entitlements};
assert.equal(catalog.deedRewardPool,683);
fs.writeFileSync(path.join(out,'catalog-and-entitlements.json'),JSON.stringify(catalog,null,2)+'\n');
const result={status:'KNOWN_BASELINE_BEHAVIOR_REPRODUCED',scope:'Read-only diagnostics against archived published product; no Comet implementation or product acceptance claimed.',sourceCommit:'3c931a26bbcf7b009dee03e7411ed41faeb971f8',sourceSha256:sha(source),observedSourceSha256:sha(observedSource),observerHooksSha256:sha(hooks),harnessSha256:sha(fs.readFileSync(path.join(out,'tree-expansion-harness.cjs'))),testSha256:sha(fs.readFileSync(__filename)),node:process.version,v8:process.versions.v8,caseCount:records.length,defectWitnesses:records.filter(r=>r.observedDefect).map(r=>({id:r.id,defect:r.observedDefect,nominalCost:r.quotedCost,representedDebit:r.representedDebit,nominalReward:r.nominalReward,representedCredit:r.representedCredit,caseFile:r.id+'.json'})),controls:records.filter(r=>!r.observedDefect).map(r=>r.id),catalog:'catalog-and-entitlements.json',syntheticSavesOnly:true,backupScope:'Actual currentSaveBackup calls are separate operations, including their additional attempted writes; decoded synthetic backups and exact raw code bytes are preserved.'};
fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
