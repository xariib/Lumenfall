/* Long-offline regression and independent baseline comparisons. Built-ins only.
 * Run: node tests/behavioral/offline-catchup.cjs [--source path/to/index.html]
 * Timers are queued deterministically; real browser responsiveness is separately
 * covered by offline-catchup-ui.cjs, not inferred from this runner.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{performance}=require('node:perf_hooks');
const root=path.resolve(__dirname,'../..');
const {reward:prismRewardOracle}=require('./prism-earning-reference.cjs');
const sourceArg=process.argv.indexOf('--source');
const source=fs.readFileSync(sourceArg<0?path.join(root,'index.html'):process.argv[sourceArg+1],'utf8');
const baseline=fs.readFileSync(path.join(root,'docs/recovery/2026-10-07/lead_context/FEEDBACK/EVIDENCE/main-index.html'),'utf8');
assert.equal(require('node:crypto').createHash('sha1').update('blob '+Buffer.byteLength(baseline)+'\0'+baseline).digest('hex'),'ea44431c163569548973d9e489f75345749a07ee','original product oracle blob');
// Replace only the two historical reward bodies. A span between named functions
// also erased later Tree helpers that the unchanged Ascend path still calls.
function legacyPrismPolicy(current,frozen,names){
 function body(html,name){
  const pattern=new RegExp('^function '+name+'\\([^\\n]*\\)\\{\\n([\\s\\S]*?)^\\}','gm');
  const matches=Array.from(html.matchAll(pattern));
  assert.equal(matches.length,1,'unique reward function '+name);
  const match=matches[0],header=match[0].slice(0,match[0].indexOf('\n')+1);
  return {header,text:match[1],start:match.index+header.length};
 }
 for(const name of names||['ascendFullPrismGainForCleared','ascendPrismBreakdown']){
  const actual=body(current,name),original=body(frozen,name);
  if(names){
   // The current reward helpers also accept luminous context. The historical
   // body intentionally ignores that optional operand in this counterfactual.
   assert.equal(actual.header.replace(/,\s*luminous(?=\))/,'').replace(/\s/g,''),original.header.replace(/\s/g,''),'compatible reference signature '+name);
  }else assert.equal(actual.header,original.header,'unchanged reference signature '+name);
  current=current.slice(0,actual.start)+original.text+current.slice(actual.start+actual.text.length);
 }
 return current;
}
// PR70's independently prepared clock correction is a necessary dependency:
// closing old queues exposes a canonical-grid stall. Keep the immutable old
// engine as the reference, applying ONLY its two clock corrections. The complete
// state and summary comparisons below remain exact, including economy/ownership.
function clockReference(original){
 // A separate paid-work clock adapter avoids preserving the old timer's
 // rounding drift as a required behavior. Only the countdown arithmetic changes;
 // all original event ordering, work, prices, completions and rewards stay intact.
 const paidClock=`  var paidWorkOrigins = {};
  function pinPaidWork(){
    state.activeStudies.forEach(function(a){
      var x=paidWorkOrigins[a.id];
      if(x && x.result===a.remainingSec && x.rate===a.speedMult && x.duration===a.totalDurationSec) return;
      paidWorkOrigins[a.id]={value:a.remainingSec,result:a.remainingSec,rate:a.speedMult,
        duration:a.totalDurationSec,second:farmGridCrossings,countdown:farmGridRemainingSec};
    });
  }
  function applyPaidWorkClock(){
    state.activeStudies.forEach(function(a){
      var x=paidWorkOrigins[a.id];
      var dt=(farmGridCrossings-x.second)+(x.countdown-farmGridRemainingSec);
      x.result=a.remainingSec=x.value-dt*x.rate;
    });
  }
`;
 const replacements=[
  ['  var targetGridPositionSec = startPhaseSec+elapsedSec;\n  var targetFarmGridCrossings = Math.floor(targetGridPositionSec);\n  var targetGridPhaseSec = targetGridPositionSec-targetFarmGridCrossings;',
   '  var targetGridPhaseSec = startPhaseSec+targetFractionSec;\n  var targetGridCarry = Math.floor(targetGridPhaseSec);\n  var targetFarmGridCrossings = targetWholeSec+targetGridCarry;\n  targetGridPhaseSec -= targetGridCarry;'],
  ['    var elapsedWholeBefore = elapsedWholeSec;\n    var elapsedFractionBefore = elapsedFractionSec;',
   '    var gridCrossingsBefore = farmGridCrossings;\n    var gridRemainingBefore = farmGridRemainingSec;'],
  ['if(elapsedWholeSec===elapsedWholeBefore && elapsedFractionSec===elapsedFractionBefore && actions===0){',
   'if(farmGridCrossings===gridCrossingsBefore && farmGridRemainingSec===gridRemainingBefore && actions===0){'],
  ['  var traceEverySec = Math.max(0,Number(options.traceEverySec)||0);',
   paidClock+'  var traceEverySec = Math.max(0,Number(options.traceEverySec)||0);'],
  ['    if(next>0){\n      if(policy.visual', '    if(next>0){\n      pinPaidWork();\n      if(policy.visual'],
  ['      simulationAdvanceStudyProgress(next);\n      var crossedFarmGrids', '      var crossedFarmGrids'],
  ['      elapsedInRun = currentElapsedSec();', '      applyPaidWorkClock();\n      elapsedInRun = currentElapsedSec();']
 ];
 for(const [before,after] of replacements){assert.equal(original.split(before).length,2,'unique frozen clock marker');original=original.replace(before,after);}
 return original;
}
function supportRuleReference(original){
 // Apply the approved F18 rule to the frozen world, without replacing its
 // simulation clock, resource arithmetic, combat or reward implementations.
 function rule(from,to){assert.equal(original.split(from).length,2,'unique approved Support baseline rule');original=original.replace(from,to);}
 rule('buffUntil:0, buffMult:1, supportBuffs:null,','buffUntil:0, buffMult:1, supportBuffs:null, supportRecastUntil:{tide:0,aurora:0},');
 rule('out.supportBuffs = normalizeSupportBuffs(source.supportBuffs);','out.supportBuffs = normalizeSupportBuffs(source.supportBuffs);\n  if(source.supportRecastUntil)out.supportRecastUntil=clonePersistedValue(source.supportRecastUntil);');
 rule('durationMs:ultimate ? 8000 : 4000','durationMs:ultimate ? 1500 : 1000');
 rule('function simulationNextAbilitySeconds(){','function simulationNextAbilitySeconds(nowMs,clock){');
 rule('next = Math.min(next,Math.max(0,(100-cur)/fillPerSec));',
  'var wait=(id===\'tide\'||id===\'aurora\')?supportDeadlineSecondsRemaining(state.supportRecastUntil[id],nowMs,clock):0;\n    next = Math.min(next,Math.max(0,(100-cur)/fillPerSec,wait));');
 rule('ability:simulationNextAbilitySeconds(),','ability:simulationNextAbilitySeconds(simulationNowMs(),simulationClockPosition()),');
 rule('var abilityStep = simulationNextAbilitySeconds();','var abilityStep = simulationNextAbilitySeconds(nowMs,simulationClockPosition());');
 rule('if(!sp) continue;\n    state.heroResource[id] = 0;',
  'if(!sp) continue;\n    if(sp.abilityType===\'support\' && supportDeadlineSecondsRemaining(state.supportRecastUntil[id],nowMs,clock)>SIM_EPS)continue;\n    state.heroResource[id] = 0;');
 rule('// buffUntil/buffMult are an opaque legacy entitlement, never an aggregate.',
  'state.supportRecastUntil[sp.id]=nowMs+abilityCycleSeconds()*1000;\n  // buffUntil/buffMult are an opaque legacy entitlement, never an aggregate.');
 rule('return sp.basePower * level * (1 + 0.01*(level-1));',
  "var bonus=(sp.id==='ember'||sp.id==='stone')&&level>70?352*(level-70)*(level-70):0;\n  return sp.basePower * level * (1 + 0.01*(level-1)) + bonus;");
 return original;
}
function slotPolicyReference(html){
 const old='  if(n<=2) return 1;\n  if(n<=5) return 2;\n  if(n===6) return 3;\n  if(n===7) return 4;\n  return 5;';
 assert.equal(html.split(old).length,2,'one frozen slot policy');
 return html.replace(old,'  var base=n<=3?1:n<=6?2:3;\n  return Math.min(5,base+Math.min(2,(state.longStudyLevels||{}).labcapacity||0));');
}
const correctedClockBaseline=slotPolicyReference(clockReference(supportRuleReference(baseline)));
const original=JSON.parse(fs.readFileSync(path.join(root,'docs/qa/offline-autoascend-2026-10-07/device_backup.json'),'utf8'));
const copy=x=>JSON.parse(JSON.stringify(x)),records=[];
// Literal original Echo prices for this preserved level20 device fixture.
const echoFixturePrices=[16,22,30,42,58,81,114,159,223,312,436,610,854,1196];
const echoFixtureRefund=4153;
function app(seed,html=source,seconds=0){
 let now=seed.lastSeen+seconds*1000,monotonic=0,seq=0,fault=null,primaryFail=false,recoveryFail=false;
 const queue=[],writes=[],storage=new Map([['lumenfall_save_v2',JSON.stringify(seed)],['lumenfall_save_recovery_v1',JSON.stringify(seed)]]);
 const date=class extends Date {static now(){return now;}};
 const document={readyState:'loading',addEventListener(){}};
 const window={addEventListener(){}};
 const localStorage={getItem:k=>storage.get(k)||null,setItem(k,v){
  if((primaryFail&&k==='lumenfall_save_v2')||(recoveryFail&&k==='lumenfall_save_recovery_v1'))throw Error('injected storage failure');
  storage.set(k,v);writes.push({key:k,state:JSON.parse(v)});
 },removeItem:k=>storage.delete(k)};
 const bridge=`window.qa={set:s=>state=acceptPersistedState(s),get:()=>state,apply:applyOfflineProgress,advance:advanceAuthoritativeTime,study:advanceStudyOnlyTime,summary:simulationSummary,load:loadState,backup:currentSaveBackup,decode:decodeSaveBackup,save:saveState,cancel:typeof cancelOfflineCatchup==='function'?cancelOfflineCatchup:()=>{},flags:()=>({busy:typeof offlineCatchup!=='undefined'&&!!offlineCatchup,pending:typeof offlinePending!=='undefined'&&offlinePending,resume:typeof resumeFlowBusy!=='undefined'&&resumeFlowBusy}),batch:n=>{if(typeof SIM_BATCH_EVENTS!=='undefined')SIM_BATCH_EVENTS=n;},fault:()=>{simulationResolveTimestamp=function(){throw Error('injected simulation failure');};}};`;
 const script=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1].replace("if(document.readyState==='loading'){",bridge+"if(document.readyState==='loading'){");
 new Function('window','document','localStorage','Date','setTimeout','clearTimeout','performance',script)(window,document,localStorage,date,(fn)=>{queue.push({id:++seq,fn});return seq;},id=>{const i=queue.findIndex(x=>x.id===id);if(i>=0)queue.splice(i,1);},{now:()=>monotonic});
 const b=window.qa;b.set(copy(seed));
 return {b,storage,writes,queue,clock:v=>now=v,monotonic:v=>monotonic=v,failPrimary:v=>primaryFail=v,failRecovery:v=>recoveryFail=v,
  drain(){let batches=0;while(queue.length){queue.shift().fn();batches++;assert(batches<100000,'bounded number of work batches');}return batches;}};
}
function approx(a,b,label){const tolerance=Math.max(1e-6,Math.max(Math.abs(a),Math.abs(b))*1e-12);assert(Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tolerance,`${label}: ${a} vs ${b}, tolerance ${tolerance}`);}
function compare(a,b,label='state',wholeA=a,wholeB=b){
 // Optional timer history can use different bases on ordinary/exact paths.
 // Validate each against its authoritative phase; storage/recovery/import
 // tests separately require every saved bit. Existing fields stay checked.
 if(label.endsWith('.canonicalAutomationClock')){
  for(const [basis,state]of [[a,wholeA],[b,wholeB]])for(const field of Object.keys(basis)){
   assert(['_autoTapAccum','_autoEmpowerAccum'].includes(field),label+' known timer');
   const r=basis[field],elapsed=Number(r.elapsed);assert.deepEqual(Object.keys(r).sort(),['base','elapsed','last'],label+' basis shape');
   assert(Number.isFinite(elapsed)&&elapsed>=0&&elapsed<=2,label+' physical elapsed');
   assert(Number.isFinite(r.base)&&r.base>=0&&r.base<=1000,label+' base');
   assert.equal(r.base+elapsed*1000,r.last,label+' represented phase');assert.equal(r.last,state[field],label+' current timer owner');
  }return;
 }
 if(typeof a==='number'&&typeof b==='number'){
  if(label.endsWith('.enemyHp'))assert(Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=1e-9*Math.max(1,Math.abs(a),Math.abs(b)),label+' strict remaining-HP parity');else approx(a,b,label);return;
 }
 if(Array.isArray(a)||a&&typeof a==='object'){
  assert.deepEqual(Object.keys(a).sort(),Object.keys(b).sort(),label+' keys');
  Object.keys(a).forEach(k=>compare(a[k],b[k],label+'.'+k,wholeA,wholeB));return;
 }
 assert.equal(a,b,label);
}
// The frozen product has no repeat-speed fields. Assert their exact legacy OFF
// defaults separately, then retain the complete original state/summary oracle.
function baselineSummary(actual,expected,label){
 assert.equal(actual.studySpeedPurchases,0,label+' no legacy repeat purchases');
 assert.equal(actual.studyMotesSpent,0,label+' no legacy repeat spending');
 const {studySpeedPurchases,studyMotesSpent,...existing}=actual;
 const newlyEarned=actual.achievements.filter(id=>id.startsWith('endless_'));
 assert.equal(new Set(newlyEarned).size,newlyEarned.length,label+' distinct new Deeds');
 existing.achievements=actual.achievements.filter(id=>!id.startsWith('endless_'));
 // The separately accepted timed-Lab revision changes only eligible Mote
 // frequency here. Its exact cooldown/amount/chronology oracle lives in
 // lab-timed-boosts.cjs. Retain every other historical summary field.
 assert(Number.isSafeInteger(actual.motesGained)&&actual.motesGained>=0&&actual.motesGained<=expected.motesGained,label+' eligible Motes cannot exceed the old every-kill payout');
 assert.deepEqual(existing,{...expected,motesGained:actual.motesGained},label);
}
function baselineState(actual,expected,seed,label,currentSummary,oldSummary,seconds){
 // Additive Lab fields are independently required to be zero/OFF on this old save.
 // Remove only those verified defaults before the unchanged full historical oracle.
 actual=copy(actual);
 assert.equal(actual.offlineClockHighWaterMs,Math.max(seed.offlineClockHighWaterMs||0,actual.lastSeen),label+' exact backwards-compatible credited clock frontier');
 delete actual.offlineClockHighWaterMs;
 assert.equal(actual.farmAutoResume,expected.riftMode==='farm',label+' only a historical automatic boss retreat owns retry intent');delete actual.farmAutoResume;
 const targets={rift:[500,1000,2500,5000,10000,25000,100000,1000000],ascend:[25,50,100,250,500,1000,10000,100000],kills:[10000,100000,1000000,10000000,100000000,1000000000],lab:[50,100,250,500,1000,2000],forge:[100,200,300,400,500,600],mastery:[10,25,50,100,250,500,1000,5000,10000],rest:[24,72,168,720,2160,8760]};
 const rewardById=new Map(Object.entries(targets).flatMap(([track,values])=>values.map((target,index)=>['endless_'+track+'_'+target,10+5*index])));
 let deedRewards=0;
 for(const id of currentSummary.achievements.filter(id=>id.startsWith('endless_'))){
  assert(rewardById.has(id),label+' known long-term Deed '+id);
  assert.equal(actual.achieved[id],true,label+' new Deed persisted '+id);
  deedRewards+=rewardById.get(id);
 }
 for(const id of rewardById.keys())delete actual.achieved[id];
 assert(Array.isArray(actual.studySlotProjects)&&actual.studySlotProjects.length===5,label+' five saved slots');
 actual.activeStudies.forEach(record=>{if(record.slot<5)assert.equal(actual.studySlotProjects[record.slot],record.id,label+' paid work owns assigned slot');});
 delete actual.studySlotProjects;
 assert.deepEqual(actual.studyBoosts,{},label+' old save receives no free timed boosts');
 assert.deepEqual(actual.studyBoostHours,Object.fromEntries(Object.keys(actual.longStudyLevels).map(id=>[id,8])),label+' exact default boost durations');
 assert(actual.moteNextAtMs===0 || actual.moteNextAtMs>=seed.lastSeen && actual.moteNextAtMs<=seed.lastSeen+seconds*1000+60000,label+' actual eligible payout clock stays inside the simulated window');
 delete actual.studyBoosts;delete actual.studyBoostHours;delete actual.moteNextAtMs;
 const wispIds=['ember','tide','stone','gale','thorn','void','aurora','titan'],oldDepths=[1,3,6,9,12,18,24,32],newDepths=[1,3,6,15,35,55,75,100],newLabs=[0,0,0,15,18,20,21,24];
 assert.deepEqual(actual.wispMastery,Object.fromEntries(wispIds.map(id=>[id,0])),label+' no invented Mastery');
 assert.deepEqual(actual.recruitmentEntitlements,Object.fromEntries(wispIds.map((id,i)=>[id,id==='ember'||(seed.spirits?.[id]||0)>0||(seed.heroRarity?.[id]||0)>0||(seed.wispModules?.[id]||0)>0||seed.wispUltimate?.[id]===true||seed.maxDepthEver>=oldDepths[i]||(actual.maxDepthEver>=newDepths[i]&&(actual.longStudyLevels.wispascend||0)>=newLabs[i])])),label+' retained old or earned new recruitment access');
 delete actual.wispMastery;delete actual.recruitmentEntitlements;
 assert(seed.research.charge<=10&&!seed.researchQueue.charge,label+' historical comparison exercises unchanged Swift route');
 assert.equal(actual.swiftRecoveryRefund,null,label+' no overcap refund');assert.equal(actual.swiftRecoveryRefundAudit,null,label+' no overcap audit');
 delete actual.swiftRecoveryRefund;delete actual.swiftRecoveryRefundAudit;
 // F21 is below cap; F20 restores its original individually rounded prices.
 // Require the complete new receipt/value before the frozen full comparison.
 assert((seed.nodes.bonds||0)<=20,label+' historical oracle has no overcap refund');
 assert.equal(seed.nodes.echo,20,label+' unchanged historical Echo level');
 assert.deepEqual(actual.feedbackMigration,{version:1,applied:true,bondsCreditAuditVersion:1,echoCreditAuditVersion:1,receipts:{'node.echo':{from:6,to:20,unpricedFrom:0,amounts:{prisms:echoFixturePrices},creditAuditVersion:1,remainingCredits:[]}},history:{bonds:{levels:seed.nodes.bonds||0},echo:{levels:20}}},label+' exact F21/F20 receipt/history');
 assert.deepEqual(actual.refundCredits,{prisms:[]},label+' all small original refunds fit the wallet');
 delete actual.feedbackMigration;delete actual.refundCredits;
 // The historical no-command oracle remains complete after the exact new
 // schema3 defaults and nonowner ledger have been independently verified.
 assert.deepEqual(actual.astralUpgrades,{astralcore:0,astralecho:0,astralconvergence:0},label+' no free permanent Comet ranks');
 assert.deepEqual(actual.commandRefund,{policy:'commands-retired-v1',total:0,paid:true},label+' no invented retired-command value');
 delete actual.astralUpgrades;delete actual.commandRefund;
 assert.deepEqual(actual.cometUpgrades,{cometreservoir:0,cometcycle:0,meteorcore:0},label+' no new paid Comet levels');
 assert.equal(actual.cometCharges,0,label+' no free initial charge');
 assert.equal(actual.cometWork,0,label+' no command work without ownership');
 assert.equal(actual.cometMeteorUsed,false,label+' no Meteor marker');
 assert.equal(actual.cometCalled,false,label+' no called enemy');
 assert.deepEqual(actual.cometEvents,{firstCommand:false,firstRecharge:false,bossStrike:false,calledKill:false},label+' no invented command events');
 assert.deepEqual(actual.cometClaims,{policy:'comet-commands-001',retired:{comettrials:'absent',rifttrail:'absent',starfallcrest:'absent'},deeds:{}},label+' exact nonowner ledger and no pending old reward');
 for(const id of ['comettrials','rifttrail','starfallcrest'])assert.notEqual((seed.owned||{})[id],true,label+' historical fixture owns no retired card '+id);
 for(const id of ['meteor','starcall']){assert.equal(actual.owned[id],false,label+' no new command ownership '+id);delete actual.owned[id];}
 for(const id of ['comet_first_command','comet_first_recharge','comet_boss_strike','comet_called_kill']){assert.notEqual(actual.achieved[id],true,label+' no new earned Deed '+id);delete actual.achieved[id];}
 for(const field of ['cometUpgrades','cometCharges','cometWork','cometMeteorUsed','cometCalled','cometEvents','cometClaims'])delete actual[field];
 const newTreeIds=['swiftcharter','lumenmemory','veteranrecruits','rosterrecall','chargememory','supportmemory','phasememory','riftstep','frontier','stardust','gentlegrowth','formationseat','benchmentor','empowerbatch','wallwisdom','invitations','recruitreserve'];
 for(const id of newTreeIds){
  assert.equal(actual.nodes[id],0,label+' exact unpurchased Tree default nodes.'+id);
  delete actual.nodes[id];
 }
 assert.equal(actual.treeTrainingProgress,0,label+' exact unpurchased Tree training default');
 delete actual.treeTrainingProgress;
 const newForgeIds=['battletempering','arcanetempering','harvesttempering','masterwork','cauterize','fracturekey','guardianseal','spillway','sustainedchannel','tapconduit','guardiancadence','relay','resonantedge','victorycharge','amplifiertrim','dualchannel','overflowconduit','resonancecells','resonancecascade','resonancereclaim'];
 for(const [field,value] of [['research',0],['researchQueue',false]])for(const id of newForgeIds){
  assert.equal(actual[field][id],value,label+' exact unpurchased Forge default '+field+'.'+id);
  delete actual[field][id];
 }
 const newIds=['labcapacity','procurement','catalysis','focusprotocol','fieldnotes','curriculum','bossledger','luminousdistill','sigilcartography','rarityappraisal','modulefabrication','ultimateanalysis','resonantefficiency','adaptivegrowth','wispdamage','wispcritchance','wispcritdamage'];
 for(const [field,value] of [['longStudyLevels',0],['studyQueue',false],['studyUseMotes',false],['studySpeedTargets',1.5]])for(const id of newIds){
  assert.equal(actual[field][id],value,label+' exact unpurchased Lab default '+field+'.'+id);
  delete actual[field][id];
 }
 const ids=Object.keys(expected.longStudyLevels);
 assert.deepEqual(actual.studyUseMotes,Object.fromEntries(ids.map(id=>[id,false])),label+' legacy OFF intent');
 assert.deepEqual(actual.studySpeedTargets,Object.fromEntries(ids.map(id=>{
  const paid=(seed.activeStudies||[]).find(study=>study.id===id);
  return [id,paid&&paid.speedMult>1?paid.speedMult:1.5];
 })),label+' remembered legacy paid tier');
 assert.equal(actual.cometTrial,null,label+' no unsolicited Trial');
 assert.equal(actual.cometTrialResult,null,label+' no unsolicited result');
 assert.deepEqual(actual.cometTrialMarks,{},label+' no unsolicited marks');
 assert.deepEqual(actual.cometCosmetics,{trail:false,crest:false},label+' new cosmetics default OFF');
 const oldOwnership={...expected.owned},legacy={};
 for(const id of ['rememberbulk','offline24','offline48']){if(oldOwnership[id]===true)legacy[id]=true;delete oldOwnership[id];}
 assert.deepEqual(actual.legacyCometPurchases,legacy,label+' full legacy ownership archived');
 // Exact F21/F20 receipts and credit defaults were verified above before
 // removing those separately checked additive records from this comparison.
 assert.deepEqual(actual.canonicalAutomationClock,{},label+' legacy Native fallback has no exact-clock basis');
 assert.deepEqual(actual.pausedStudies,[],label+' legacy save creates no paused paid work');
 const assigned=new Set();actual.activeStudies.forEach(record=>{assert.ok(Number.isInteger(record.slot)&&record.slot>=0&&record.slot<7&&!assigned.has(record.slot),label+' legacy paid Study has one stable slot');assigned.add(record.slot);delete record.slot;});
 const {pausedStudies,canonicalAutomationClock,studyUseMotes,studySpeedTargets,cometTrial,cometTrialResult,cometTrialMarks,cometCosmetics,legacyCometPurchases,offline12hRefund,feedbackMigration,refundCredits,...existing}=actual;
 // F14 changes only the selected destination during a matching partial rebuild.
 const intent=expected.formationRebuild;
 const selected=intent&&intent.preset&&expected.formationPresets[intent.preset]&&
   expected.formationPresets[intent.preset].join(',')===intent.members.join(',')
   ? intent.preset : expected.activeFormationPreset;
 let refund=0;for(let i=0;i<(seed.nodes?.reserves||0);i++)refund+=Math.ceil(6*Math.pow(1.6,i));
 assert.equal(actual.schemaVersion,6,label+' migrated schema');
 assert.deepEqual(existing,{...expected,schemaVersion:6,owned:oldOwnership,activeFormationPreset:selected,
  prisms:expected.prisms+refund+echoFixtureRefund,comets:expected.comets+(legacy.offline24?140:0)+(legacy.offline48?160:0)+deedRewards,motes:expected.motes-oldSummary.motesGained+currentSummary.motesGained},label);
}
function runAsync(seed,seconds,batch=256){
 const x=app(seed,source,seconds),before=copy(x.b.get());x.b.batch(batch);
 let result=null,error=null,callbacks=0;
 x.b.apply((r,e)=>{result=r;error=e;callbacks++;});
 assert(x.b.flags().busy,'long catch-up must yield before returning');
 assert.deepEqual(x.b.get(),before,'yield leaves authoritative runtime unchanged');
 assert.deepEqual(JSON.parse(x.storage.get('lumenfall_save_v2')),seed,'no partial primary save');
 assert.equal(x.b.save(),false,'autosave blocked while busy');
 assert.equal(x.b.apply(()=>{throw Error('duplicate return callback');}),null,'duplicate return cannot start another job');
 const batches=x.drain();assert.ifError(error);assert.equal(callbacks,1,'complete once');
 assert(!x.b.flags().busy&&!x.b.flags().pending&&!x.b.flags().resume,'flags clear after completion');
 assert.equal(x.b.get().lastSeen,seed.lastSeen+seconds*1000,'consumed endpoint');
 assert.equal(x.b.get().totalOfflineSeconds,seed.totalOfflineSeconds+Math.min(seconds,12*3600),'combat accounting/cap');
 const committed=copy(x.b.get());let duplicate;
 x.b.apply(r=>duplicate=r);assert.equal(duplicate,null,'repeated return awards nothing');
 assert.deepEqual(x.b.get(),committed,'repeated return preserves state');
 assert.deepEqual(JSON.parse(x.storage.get('lumenfall_save_v2')),committed,'primary completed save');
 assert.deepEqual(JSON.parse(x.storage.get('lumenfall_save_recovery_v1')),committed,'recovery completed save');
 records.push({case:seed.autoAscendEnabled?'ON Clear'+(seed.autoAscendTargetDepth-1):'OFF',seconds,batch,batches,kills:result.kills,ascends:result.ascends,iterations:result.iterations,earned:result.earned});
 return {x,result,committed};
}
const start=performance.now();
// Swift60 intentionally changes rewards; compare independent one-second calls
// with full-window batching. Historical uncapped goldens stay source-labelled.
function oneSecondReference(seed,seconds){
 const x=app(seed,source,seconds),before=copy(x.b.get());
 for(let i=0;i<seconds;i++)x.b.advance(1,{kind:'offline',visual:false,clockStartMs:seed.lastSeen+i*1000,offlineWindowStartMs:seed.lastSeen});
 x.b.get().totalOfflineSeconds+=seconds;x.b.get().lastSeen=seed.lastSeen+seconds*1000;x.b.save();
 return {state:copy(x.b.get()),kills:x.b.get().totalKills-before.totalKills,ascends:x.b.get().ascendCount-before.ascendCount,prisms:x.b.get().prisms-before.prisms};
}
if(process.argv.includes('--generate-swift-golden')){
 let seed=copy(original);const phases=[];
 for(let i=0;i<4;i++){
  const reference=oneSecondReference(seed,28800);
  phases.push({kills:reference.kills,ascends:reference.ascends,prisms:reference.prisms,
   stateSha256:require('node:crypto').createHash('sha256').update(JSON.stringify(reference.state)).digest('hex')});
  seed=reference.state;
 }
 console.log(JSON.stringify({sourceSha256:require('node:crypto').createHash('sha256').update(source).digest('hex'),
  oracle:'Independent one-second advance calls, fixed whole-window start',phases},null,2));process.exit(0);
}

// Fails on the unchanged product through the reported production entry.
const on=runAsync(original,28800);
const onReference=oneSecondReference(original,28800);
assert.equal(on.result.kills,onReference.kills);assert.equal(on.result.ascends,onReference.ascends);
compare(on.committed,onReference.state,'capped Swift full8h one-second oracle');
assert.equal(on.committed.prisms-original.prisms,onReference.prisms+2810+echoFixtureRefund,'independent one-second rewards plus original migration');
const perAscend=prismRewardOracle(original.autoAscendTargetDepth-1,original.ascendRewardedDepth,original.nodes.swift,original.longStudyLevels.prismstudy);
assert.equal(on.committed.nodes.swift,original.nodes.swift,'fixed Tree investment in long reward fixture');
assert.equal(on.committed.longStudyLevels.prismstudy,original.longStudyLevels.prismstudy,'fixed completed Clarity in long reward fixture');
assert.equal(on.committed.prisms-original.prisms,perAscend*on.result.ascends+2810+echoFixtureRefund,'independent new-policy reward plus original F26/Echo refunds');
// Retain the original exact reward assertion on an explicitly labelled old-
// reward counterfactual. Every other state field must match the real new game.
const oldRewardSource=legacyPrismPolicy(source,baseline);
const oldRewardRun=app(original,oldRewardSource,28800);oldRewardRun.b.apply();
assert.equal(oldRewardRun.b.get().prisms-original.prisms,6*on.result.ascends+2810+echoFixtureRefund,'historical policy control and original refunds remain exact');
assert.deepEqual({...oldRewardRun.b.get(),prisms:on.committed.prisms},on.committed,'only Prism balance differs under old reward policy');
records.push({case:'Prism policy isolation',perAscend,newPrisms:on.committed.prisms-original.prisms,legacyPrisms:oldRewardRun.b.get().prisms-original.prisms});
assert.equal(on.committed.lumen,onReference.state.lumen,'partial final run matches independent one-second balance');
assert(on.result.earned>on.committed.lumen,'Ascend resets run Lumen, not reported earned total');
assert.deepEqual(on.committed.formationRebuild,original.formationRebuild,'unaffordable Boss reconstruction intent persists');
assert.deepEqual(on.committed.empowerQueue,original.empowerQueue,'purchase intent preserved');
assert.deepEqual(on.committed.activeParty,['ember']);
const sync=app(original,source,28800);const syncResult=sync.b.apply();
assert.deepEqual(syncResult,on.result,'same full summary across yielding/synchronous facade');
assert.deepEqual(sync.b.get(),on.committed,'exact scheduler state across yielding/synchronous facade');
const narrow=runAsync(original,28800,31);
assert.deepEqual(narrow.committed,on.committed,'changing work budget changes no state');
assert.deepEqual(narrow.result,on.result,'changing work budget changes no rewards/accounting');
const clear20=copy(original);clear20.autoAscendTargetDepth=21;
const c20=runAsync(clear20,28800);
const off=copy(original);off.autoAscendEnabled=false;
const disabled=runAsync(off,28800),offReference=oneSecondReference(off,28800);assert.equal(disabled.result.kills,offReference.kills);assert.equal(disabled.result.ascends,0);
compare(disabled.committed,offReference.state,'capped Swift OFF full8h one-second oracle');
const cap=runAsync(original,72*3600),capReference=oneSecondReference(original,12*3600);assert.equal(cap.result.kills,capReference.kills);assert.equal(cap.result.ascends,capReference.ascends);
// Independent caller partitions preserve the complete state comparison: twelve
// hours of combat, then one-second Lab-only windows for the rest of the absence.
const labReference=app(capReference.state,source,60*3600),labSummary=labReference.b.summary(60*3600);
for(let second=0;second<60*3600;second++)labReference.b.study(1,original.lastSeen+(12*3600+second)*1000,labSummary);
labReference.b.get().lastSeen=original.lastSeen+72*3600000;
labReference.b.get().offlineClockHighWaterMs=labReference.b.get().lastSeen;
labReference.b.save();
compare(cap.committed,labReference.b.get(),'capped Swift combat plus full-absence one-second Lab oracle');
const beyond=copy(original);beyond.activeStudies=[{id:'guardmastery',remainingSec:80*3600,totalDurationSec:80*3600,speedMult:1}];beyond.studyQueue={};
const long=runAsync(beyond,96*3600);assert.equal(long.result.effectiveSec,12*3600);
assert(long.result.completedStudies.includes("Guardian's Mastery"),'paid Study completes beyond the combat cap');assert.equal(long.committed.activeStudies.length,0,'Queue OFF leaves no new work after its paid80h completes');
const samePaidWork=runAsync(beyond,12*3600);assert.equal(long.result.kills,samePaidWork.result.kills,'beyond-cap time earns no extra combat with same paid work');
// Preserve old numerical policy against the unchanged scheduler for short windows
// and chronological research/Motes/automation boundaries.
// Compare unchanged chronology with closed purchase intent disabled on both
// sides. UPGRADE_IDENTITY tests separately exercise old ON intent and paid work.
// New F15 operands are intentional. Preserve the upstream exact legacy oracle
// as a four-Bond counterfactual; actual eight-Bond long/split checks stay intact.
// Preserve the legacy four-Bond AND legacy Prism policy for the frozen
// scheduler oracle. Actual eight-Bond/new-Prism full-window tests above remain.
// User-approved progression balance changes the old encounter/reward/work
// inputs. Freeze only those inputs on this explicitly historical comparison;
// all actual-current long/whole/split, transaction and cap checks remain above.
// The original archived HTML is still byte-checked and never edited.
const legacyBalanceSource=legacyPrismPolicy(oldRewardSource,baseline,['enemyHpFor','enemyRewardFor','shardRewardFor','studyCost','studyDuration','guardianTapBaseDamage']);
const legacyBondAnchor=legacyBalanceSource.match(/function bondActive\(bondId(?:,ids)?\)\{/);
assert(legacyBondAnchor,'legacy Bond control function');
assert.equal(legacyBalanceSource.split(legacyBondAnchor[0]).length,2,'one legacy Bond control anchor');
// The historical counterfactual also uses the original Native clock. The human
// explicitly approved new automation arithmetic; current-clock whole/split and
// one-second oracle checks above continue to exercise the real production path.
assert.equal(legacyBalanceSource.split('activateBinaryClock();').length,3,'two exact-clock activation sites');
const legacyBondSource=legacyBalanceSource.replace(legacyBondAnchor[0],
 legacyBondAnchor[0]+"\n  if(['kindling','vanguard','quarry','harvest'].indexOf(bondId)!==-1) return false;").split('activateBinaryClock();').join('void 0; /* explicitly historical Native clock */');
assert.notEqual(legacyBondSource,legacyBalanceSource,'legacy Bond control anchor');
for(const rawSeed of [original,clear20,off]){
 const seed=copy(rawSeed);seed.research.charge=9;seed.researchQueue.charge=false;
 for(const id of ['focus','sense','formation','resolve'])seed.researchQueue[id]=false;
 for(const id of ['riftattune','formationstudy','prismstudy'])seed.studyQueue[id]=false;
 for(const seconds of [60,300,3600]){
  const old=app(seed,correctedClockBaseline,seconds),next=app(seed,legacyBondSource,seconds);
  const a=old.b.advance(seconds,{kind:'offline',visual:false,clockStartMs:seed.lastSeen});
  const b=next.b.advance(seconds,{kind:'offline',visual:false,clockStartMs:seed.lastSeen});
  baselineSummary(b,a,'unchanged baseline summary '+seconds);baselineState(next.b.get(),old.b.get(),seed,'unchanged baseline state '+seconds,b,a,seconds);
 }
}
const all=copy(original);all.research.charge=9;all.researchQueue.charge=false;all.research.arcanecal=0;
for(const id of ['focus','sense','formation','resolve'])all.researchQueue[id]=false;
for(const id of ['riftattune','formationstudy','prismstudy'])all.studyQueue[id]=false;Object.keys(all.empowerQueue).forEach(k=>all.empowerQueue[k]=true);
all.researchQueue.arcanecal=true;all.studyQueue.guardmastery=true;
for(const kind of ['live','offline']){
 const whole=app(all),split=app(all),old=app(all,correctedClockBaseline),legacy=app(all,legacyBondSource),options={kind,visual:false,clockStartMs:all.lastSeen};
 const sum=whole.b.advance(3600,options),legacySum=legacy.b.advance(3600,options),oldSum=old.b.advance(3600,options);
 baselineSummary(legacySum,oldSum,'economy/order baseline '+kind);baselineState(legacy.b.get(),old.b.get(),all,'baseline chronology '+kind,legacySum,oldSum,3600);
 for(let i=0;i<4;i++)split.b.advance(900,{...options,clockStartMs:all.lastSeen+i*900000,offlineWindowStartMs:all.lastSeen});
 compare(split.b.get(),whole.b.get(),'whole/split '+kind);
 assert(sum.motesGained>0&&sum.empowers>0&&sum.researchBought>0,'Motes, Research and Empower chronology exercised');
 records.push({case:'boundaries '+kind,kills:sum.kills,motes:sum.motesGained,empowers:sum.empowers,research:sum.researchBought,studies:sum.completedStudies});
}
// Cancellation, restart and primary/recovery failures never partially consume.
for(const failure of ['cancel','simulation','primary','recovery']){
 const x=app(original,source,28800),before=copy(x.b.get());let result,error,callbacks=0;
 if(failure==='primary')x.failPrimary(true);if(failure==='recovery')x.failRecovery(true);
 x.b.apply((r,e)=>{result=r;error=e;callbacks++;});
 if(failure==='cancel')x.b.cancel();if(failure==='simulation')x.b.fault();x.drain();
 assert.equal(callbacks,1,failure+' callback exactly once');assert(!x.b.flags().busy&&!x.b.flags().resume,failure+' busy flags clear');
 if(failure==='recovery'){
  assert.ifError(error);assert.deepEqual(x.b.get(),on.committed,'primary success remains authoritative after recovery failure');
  x.failRecovery(false);x.b.set(x.b.load());assert.equal(x.b.apply(),null,'reload from primary cannot duplicate');
 }else{
  assert(error,failure+' reports error');assert.deepEqual(x.b.get(),before,failure+' rollback runtime');
  assert.deepEqual(JSON.parse(x.storage.get('lumenfall_save_v2')),original,failure+' preserves primary');
  assert.equal(x.b.save(),false,failure+' failed endpoint cannot be consumed by autosave');
  const restart=app(x.b.load(),source,28800);let retryError,retry;restart.b.apply((r,e)=>{retry=r;retryError=e;});restart.drain();assert.ifError(retryError);assert.deepEqual(restart.b.get(),on.committed,failure+' restart replays entire window once');
 }
 records.push({case:failure,callbacks,error:error&&error.message,pending:x.b.flags().pending});
}
// Completed primary corruption recovers the completed endpoint, not the old window.
const recovery=app(on.committed,source,0);recovery.storage.set('lumenfall_save_v2','broken');
recovery.b.set(recovery.b.load());assert.equal(recovery.b.apply(),null);assert.deepEqual(recovery.b.get(),on.committed);
const backup=on.x.b.backup();assert.deepEqual(on.x.b.decode(backup),on.committed,'backup/reload compatible schema');
// Real cooperative work can outlast the captured return clock. It must not
// disappear when the next autosave records the current time, even after the cap.
for(const seconds of [28800,72*3600]){
 const slow=app(original,source,seconds);let error,result;
 slow.b.apply((r,e)=>{result=r;error=e;});
 slow.clock(original.lastSeen+(seconds+60)*1000);slow.monotonic(60000);slow.drain();assert.ifError(error);
 assert.equal(slow.b.get().lastSeen,original.lastSeen+(seconds+60)*1000,'processing time reaches completed save endpoint');
 const reference=app(original,source,seconds);reference.b.apply();
 reference.b.advance(60,{kind:'live',visual:false,clockStartMs:original.lastSeen+seconds*1000});
 reference.b.get().lastSeen=original.lastSeen+(seconds+60)*1000;
 reference.b.get().offlineClockHighWaterMs=original.lastSeen+(seconds+60)*1000;
 assert.equal(slow.b.get().offlineClockHighWaterMs,reference.b.get().offlineClockHighWaterMs,'processing time retains its exact credited frontier');
 compare(slow.b.get(),reference.b.get(),'processing time live parity '+seconds);
 approx(slow.b.get().totalOfflineSeconds-original.totalOfflineSeconds,Math.min(seconds,43200),'processing time does not expand offline cap/accounting');
 records.push({case:'processing time '+seconds,kills:result.kills,lastSeen:slow.b.get().lastSeen});
}
for(const jump of [-7*86400000,7*86400000]){
 const shifted=app(original,source,28800);let error;shifted.b.apply((r,e)=>{error=e;});
 shifted.clock(original.lastSeen+28800000+60000+jump);shifted.monotonic(60000);shifted.drain();assert.ifError(error);
 const reference=app(original,source,28800);reference.b.apply();reference.b.advance(60,{kind:'live',visual:false,clockStartMs:original.lastSeen+28800000});
 reference.b.get().lastSeen=original.lastSeen+28800000+60000+jump;
 reference.b.get().offlineClockHighWaterMs=Math.max(original.lastSeen+28800000+60000,reference.b.get().lastSeen);
 assert.equal(shifted.b.get().offlineClockHighWaterMs,reference.b.get().offlineClockHighWaterMs,'clock correction cannot reopen credited processing time');
 compare(shifted.b.get(),reference.b.get(),'monotonic processing with wall-clock jump '+jump);
 records.push({case:'wall-clock jump '+jump,kills:shifted.b.get().totalKills-original.totalKills,lastSeen:shifted.b.get().lastSeen});
}
console.log(JSON.stringify({status:'pass',scenario:'offline-catchup-core',sourceSha256:require('node:crypto').createHash('sha256').update(source).digest('hex'),wallMs:performance.now()-start,records},null,2));
