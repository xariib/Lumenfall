'use strict';
// Static, read-only inventory of exact published files. Executes no product or tests.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),assert=require('node:assert/strict');
const repo='/workspace/scratch/0848c4e4f365/Lumenfall-tree',out=__dirname;
const head='768050d7cca586ea724e7ac677804a5ed7d6a3f5',expectedSource='ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(args)=>cp.execFileSync('git',args,{cwd:repo,maxBuffer:32*1024*1024});
const read=p=>git(['show',head+':'+p]);
assert.equal(git(['rev-parse','HEAD']).toString().trim(),head);
const product=read('index.html');assert.equal(sha(product),expectedSource);assert(fs.readFileSync(path.join(repo,'index.html')).equals(product));
const lines=product.toString('utf8').split('\n');
function identity(p){const b=read(p);return {path:p,bytes:b.length,sha256:sha(b),gitBlob:crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex')};}
const fileList=git(['ls-tree','-r','--name-only',head,'tests','scripts','.github/workflows']).toString().trim().split('\n');
const testFiles=fileList.filter(p=>p.startsWith('tests/')&&/\.(?:cjs|js)$/.test(p));
const patterns={schema:/\bschemaVersion\b|\bSAVE_SCHEMA_VERSION\b|\bsourceSchema\b/,
  retiredOwnership:/comettrials|rifttrail|starfallcrest|cometTrial|cometCosmetics|legacyCometPurchases/,
  catalogue:/\bSHOP\b|\bACHIEVEMENTS\b|deeds\(\)|deedCometTotal|restStopCometTotal|(?:===?|,)\s*(?:683|450)(?:\b|,)/,
  extraction:/function single\(|source\.slice\(|html\.slice\(|source\.indexOf\(|html\.indexOf\(|new Function\(|vm\.runInContext|vm\.runInNewContext|\.match\(\/<script/,
  fullState:/Object\.keys\(actual\)|Object\.keys\(a\)|baselineState\(|baselineSummary\(|PAID_FIELDS|paidFields|assertFresh\(|assertLifecycleState\(/};
const hits={};
for(const [kind,re] of Object.entries(patterns)){
  hits[kind]=[];
  for(const file of testFiles){
    const text=read(file).toString('utf8'),all=text.split('\n');let currentCase=null;
    all.forEach((line,index)=>{
      const found=line.match(/^\s*case '([^']+)'/);if(found)currentCase=found[1];
      if(re.test(line))hits[kind].push({path:file,line:index+1,nearestRunnerCase:file==='tests/behavioral/runner.js'?currentCase:null,text:line.length>900?line.slice(0,900)+' [line truncated in index; inspect exact published source]':line});
    });
  }
}
const deedStart=lines.findIndex(l=>l==='var ACHIEVEMENTS = [');
assert(deedStart>=0);const deeds=[];
for(let i=deedStart+1;i<lines.length&&lines[i]!=='];';i++){
 const l=lines[i],id=l.match(/id:'([^']+)'/),reward=l.match(/reward:(\d+)/),predicate=l.match(/check:function\(s\)\{(.*)\}\},?$/);
 assert(id&&reward&&predicate,'one original Deed per line');deeds.push({id:id[1],reward:Number(reward[1]),line:i+1,predicate:predicate[1],predicateSha256:sha(predicate[1]),rawLineSha256:sha(l),rawLine:l});
}
assert.equal(deeds.length,23);assert.equal(deeds.reduce((s,d)=>s+d.reward,0),683);
const shopStart=lines.findIndex(l=>l==='var SHOP = [');assert(shopStart>=0);const shop=[];
for(let i=shopStart+1;i<lines.length&&lines[i]!=='];';i++){
 const l=lines[i],id=l.match(/id:'([^']+)'/),cost=l.match(/cost:(\d+)/);assert(id&&cost);shop.push({id:id[1],cost:Number(cost[1]),line:i+1,rawLineSha256:sha(l),rawLine:l});
}
assert.deepEqual(shop.map(x=>[x.id,x.cost]),[['autoascend',100],['comettrials',140],['rifttrail',50],['starfallcrest',160]]);
const names=['freshState','identifySaveSchemaVersion','migrateSaveV0ToV1','migrateSaveV1ToV2','migratePersistedState','normalizeCurrentSave','acceptPersistedState','normalizeOffline12hRefund','settleOffline12hRefund','loadState','saveState','currentSaveBackup','restoreSaveBackup','forgeCommitPaidMutation','restStopComplete','refreshDailyQuest','applyAchievementChecks','checkAchievements','normalizeCometTrials','queueCometTrial','selectCometCosmetic','spawnEnemy','restoreEnemyOrSpawn','defeatEnemy','checkAutoAscend','autoAscendReady','applyAscendMutation','doAscend','simulationDefeatEnemy','simulationBatchFarmKills','simulationApplyFarmPassive','simulationApplyPushPassive','simulationResolveTimestamp','advanceAuthoritativeTime','offlineProgressSteps','renderShop','renderCosmetics','renderAchievements','deedProgress','deedPresentation'];
const productAnchors=names.map(name=>{const index=lines.findIndex(l=>new RegExp('^function\\*? '+name+'\\(').test(l));assert(index>=0,name);return {name,path:'index.html',line:index+1,signature:lines[index]};});
const workflowFiles=['pre-merge-validation.yml','lab-expansion-validation.yml','forge-expansion-validation.yml','tree-focused-qa.yml'];
const workflows=workflowFiles.map(file=>{
 const p='.github/workflows/'+file,text=read(p).toString('utf8'),l=text.split('\n'),runBlocks=[];let step=null;
 for(let i=0;i<l.length;i++){
  const n=l[i].match(/^\s+- name: (.*)$/);if(n)step=n[1];
  const m=l[i].match(/^(\s*)run: (.*)$/);if(!m)continue;
  const indent=m[1].length,start=i+1;let body=m[2],end=start;
  if(body==='|'||body==='>'){
   const b=[];while(i+1<l.length&&(l[i+1].trim()===''||l[i+1].match(/^ */)[0].length>indent)){i++;b.push(l[i]);}
   while(b.length&&b[b.length-1].trim()==='')b.pop();body=b.map(s=>s.slice(indent+2)).join('\n');end=start+b.length;
  }
  runBlocks.push({step,line:start,endLine:end,rawRun:body});
 }
 return {...identity(p),name:l[0].slice(6),status:'existing mandatory lane; preserve workflow',runBlocks};
});
const full=read('.github/workflows/pre-merge-validation.yml').toString();
const negative=full.match(/for scenario in (.+); do/)[1].trim().split(/\s+/);assert.equal(negative.length,22);
const scenarios=JSON.parse(read('tests/behavioral/scenarios.json'));assert.equal(Object.keys(scenarios.SCENARIOS).length,182);assert.equal(scenarios.NEGATIVE_SCENARIOS.length||Object.keys(scenarios.NEGATIVE_SCENARIOS).length,40);
const knownScenarios=Array.isArray(scenarios.SCENARIOS)?scenarios.SCENARIOS:Object.keys(scenarios.SCENARIOS);
const fixtures=JSON.parse(read('tests/behavioral/fixtures.json'));
const fixtureSummary=Object.entries(fixtures).map(([name,value])=>{const s=value&&value.save;return {name,hasObjectSave:!!s&&typeof s==='object',schema:s&&typeof s==='object'?(s.schemaVersion===undefined?0:s.schemaVersion):null,retiredOwnership:s&&typeof s==='object'?shop.slice(1).filter(d=>s.owned&&s.owned[d.id]===true).map(d=>d.id):[]};});
const extraFixtureSummary=['tests/behavioral/fixtures-offline-refund-interop.json','docs/qa/offline-autoascend-2026-10-07/device_backup.json'].map(file=>{
 const raw=JSON.parse(read(file)),states=[];
 function walk(value,at){
  if(!value||typeof value!=='object')return;
  if(value.owned||value.legacyCometPurchases||value.schemaVersion!==undefined)states.push({at,schema:value.schemaVersion===undefined?0:value.schemaVersion,retiredOwnership:shop.slice(1).filter(d=>value.owned&&value.owned[d.id]===true).map(d=>d.id),oldLegacyOwnership:Object.keys(value.legacyCometPurchases||{}).filter(id=>value.legacyCometPurchases[id]===true)});
  for(const [key,child]of Object.entries(value))if(child&&typeof child==='object')walk(child,at+'.'+key);
 }
 walk(raw,'$');return {file,states};
});
const protectedPaths=['tests/behavioral/fixtures.json','tests/behavioral/fixtures-offline-refund-interop.json','tests/behavioral/scenarios.json','tests/behavioral/prism-earning-reference.cjs','docs/recovery/2026-10-07/lead_context/FEEDBACK/EVIDENCE/main-index.html','docs/qa/offline-autoascend-2026-10-07/device_backup.json',...fileList.filter(p=>p.startsWith('.github/workflows/'))];
const relevantFiles=[...new Set(Object.values(hits).flat().map(h=>h.path))].sort();
const inventory={status:'read-only impact inventory; no Comet implementation or new test execution',publishedHead:head,tree:git(['rev-parse',head+'^{tree}']).toString().trim(),sourceSha256:expectedSource,sourceBytes:product.length,node:process.version,v8:process.versions.v8,
  selectedFutureContract:{status:'root-selected proposal, integration still gated',catalog:['autoascend','meteor','starcall','cometreservoir','cometcycle','meteorcore'],currentSchema:2,targetSchema:3,newStrictBlocks:['cometUpgrades','cometCharges','cometWork','cometMeteorUsed','cometCalled','cometEvents','cometClaims'],strictRule:'Initialize only fresh3 and schema2→3 migration. Missing/wrong-type current3 blocks reject with invalid-comet-claims or invalid-comet-state, preserve raw primary and block persistence even while valid recovery runs; no silent repair/defaulting. Retain valid overcap raw levels with effect clamps and bounded no-refill bank.',settlementOrder:['existing F26 unchanged','retired comettrials140','retired rifttrail50','retired starfallcrest160','pending known Deeds in fixed order'],newlyEarnedDeed:'Stickyflag plus claim; attempt only its own whole exact credit within existing owner; no nested save or old-claim sweep.',legacyRefunds:{comettrials:140,rifttrail:50,starfallcrest:160,totalWhenAllOwned:350},oldDeeds:23,oldDeedRewards:683,newDeeds:4,newDeedRewardsInProposal:50,globalDailyDebt:false},
  scope:{repositoryEdits:false,testsExecuted:false,remoteMutations:false,privateSavePayloadsCopied:false},deeds,shop,productAnchors,hits,workflows,
  fifthLane:{status:'new additional Comet workflow planned; no file exists at this head',preserveFourExisting:true,exactNewCommandNames:'not yet assigned; do not imply executable tests exist',requiredCoverage:['strict schema3 migration/recovery/backup and single pending-claim ledger','exact catalog/payment/effects/primary and recovery failure controls','actual Meteor/Call/charge-work events and all old23 plus new4 Deeds','live/split/yielded offline/Farm/Auto-Ascend chronology and no automatic commands','12 actual mobile input/price/focus/motion profiles','complete product on official checksum-verified Node8.3/V8 6.0']},
  fullGate:{scenarios:182,registeredNegativeScenarios:40,mandatoryNegativeScenarios:negative,knownScenarios},fixtureSummary,extraFixtureSummary,protectedFiles:protectedPaths.map(identity),relevantFileIdentities:relevantFiles.map(identity)};
fs.writeFileSync(path.join(out,'inventory.json'),JSON.stringify(inventory,null,2)+'\n');
console.log(JSON.stringify({status:inventory.status,sourceSha256:expectedSource,files:relevantFiles.length,hitCounts:Object.fromEntries(Object.entries(hits).map(([k,v])=>[k,v.length])),workflowRunBlocks:workflows.map(w=>({path:w.path,blocks:w.runBlocks.length})),deeds:deeds.length,oldDeedRewards:683,protectedFiles:inventory.protectedFiles.length,fixturesWithRetiredPurchases:fixtureSummary.filter(f=>f.retiredOwnership.length)}));
