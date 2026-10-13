'use strict';
// Shared by modern acceptance and the actual Node 8.3/V8 6.0 driver.
// Execute the complete production game IIFE. Only DOM presentation, storage,
// clocks and the host callback queue are supplied here; gameplay owners stay real.
// Keep this file ES2017, including its dependencies. No BigInt oracle is imported.
var assert = require('assert');
var P = 'lumenfall_save_v2', R = 'lumenfall_save_recovery_v1';
var CLOCK = 2000000000000;
function clone(value) { return JSON.parse(JSON.stringify(value)); }

function app(source, rawSlots) {
  assert.strictEqual(typeof source, 'string', 'full production HTML source required');
  var now = CLOCK, nextTimer = 0, reloadCount = 0, performanceNow = 0, performanceStep = 0;
  var failPrimary = false, failRecovery = false;
  var timers = [], writes = [], attempts = [], reads = [], presentations = [];
  var storage = new Map(rawSlots || []);
  storage.forEach(function (value, key) {
    assert.strictEqual(typeof key, 'string', 'raw slot key is a string');
    assert.strictEqual(typeof value, 'string', 'raw slot bytes are supplied as a string');
  });
  var area = {value: '', focus: function () {}, select: function () {}};
  var localStorage = {
    getItem: function (key) {
      key = String(key);
      var value = storage.has(key) ? storage.get(key) : null;
      reads.push({key: key, value: value});
      return value;
    },
    setItem: function (key, value) {
      key = String(key); value = String(value);
      var attempt = {operation: 'set', key: key, value: value, success: false};
      attempts.push(attempt);
      if ((failPrimary && key === P) || (failRecovery && key === R)) {
        attempt.error = 'injected ' + (key === P ? 'primary' : 'recovery') + ' write failure';
        throw Error(attempt.error);
      }
      storage.set(key, value);
      attempt.success = true;
      writes.push({operation: 'set', key: key, value: value});
    },
    removeItem: function (key) {
      key = String(key);
      var attempt = {operation: 'remove', key: key, success: false};
      attempts.push(attempt);
      if ((failPrimary && key === P) || (failRecovery && key === R)) {
        attempt.error = 'injected ' + (key === P ? 'primary' : 'recovery') + ' removal failure';
        throw Error(attempt.error);
      }
      storage.delete(key);
      attempt.success = true;
      writes.push({operation: 'remove', key: key});
    }
  };
  var classes = {add: function () {}, remove: function () {}, toggle: function () {}};
  var stage = {classList: classes};
  var window = {addEventListener: function () {}, matchMedia: function () { return {matches: true}; }};
  var document = {
    readyState: 'loading', hidden: false, addEventListener: function () {},
    querySelector: function () { return null; }, querySelectorAll: function () { return []; },
    getElementById: function (id) { return id === 'save-backup-code' ? area : null; },
    body: {classList: classes}
  };
  var hooks = `
  var qaRequired={
    cometUpgradeLevel:typeof cometUpgradeLevel,cometCapacity:typeof cometCapacity,
    cometWorkPerKill:typeof cometWorkPerKill,cometHasLegacy:typeof cometHasLegacy,
    getCometBuyPlan:typeof getCometBuyPlan,cometMeteorBudget:typeof cometMeteorBudget,
    cometMeteorHpPlan:typeof cometMeteorHpPlan,getCometCommandPlan:typeof getCometCommandPlan,
    activateCometCommand:typeof activateCometCommand,cometRecordDefeats:typeof cometRecordDefeats,
    getDailyQuestRefreshPlan:typeof getDailyQuestRefreshPlan,settleCometClaims:typeof settleCometClaims,
    cometCommitMutation:typeof cometCommitMutation,renderCometCommands:typeof renderCometCommands,
    renderCometJournal:typeof renderCometJournal
  };
  Object.keys(qaRequired).forEach(function(name){
    if(qaRequired[name]!=='function')throw new Error('Missing original Comet production hook: '+name);
  });
  renderAll=renderHud=renderAchievements=renderShop=renderSpirits=renderSideStats=renderDaily=updateBattleFast=renderCosmetics=renderNodes=renderAscendSummary=renderResearch=renderLongStudies=showAscendFlash=renderCometCommands=renderCometJournal=renderRiftMode=applyRiftTheme=function(){};
  spawnFloatNum=emitCombatVfx=flashBattleStage=pulseWispCard=renderDynamic=function(){};
  showToast=function(message){qaPresentations.push({type:'toast',message:String(message)});};
  function qaSpirit(id){return SPIRITS.find(function(sp){return sp.id===id;});}
  function qaItem(id){return SHOP.find(function(item){return item.id===id;});}
  function qaLifecycle(patch){
    if(patch!==undefined){
      var allowed=['hidden','resetInProgress','reloadInProgress','offlineCatchup','offlinePending','resumeFlowBusy','startupIntroPlaying','persistenceBlocked'];
      Object.keys(patch).forEach(function(key){
        if(allowed.indexOf(key)===-1)throw Error('Unknown lifecycle fixture flag: '+key);
        if(key!=='offlineCatchup' && typeof patch[key]!=='boolean')throw Error('Lifecycle fixture flag must be boolean: '+key);
      });
      if(Object.prototype.hasOwnProperty.call(patch,'hidden'))document.hidden=patch.hidden;
      if(Object.prototype.hasOwnProperty.call(patch,'resetInProgress'))resetInProgress=patch.resetInProgress;
      if(Object.prototype.hasOwnProperty.call(patch,'reloadInProgress'))reloadInProgress=patch.reloadInProgress;
      if(Object.prototype.hasOwnProperty.call(patch,'offlineCatchup'))offlineCatchup=patch.offlineCatchup;
      if(Object.prototype.hasOwnProperty.call(patch,'offlinePending'))offlinePending=patch.offlinePending;
      if(Object.prototype.hasOwnProperty.call(patch,'resumeFlowBusy'))resumeFlowBusy=patch.resumeFlowBusy;
      if(Object.prototype.hasOwnProperty.call(patch,'startupIntroPlaying'))startupIntroPlaying=patch.startupIntroPlaying;
      if(Object.prototype.hasOwnProperty.call(patch,'persistenceBlocked'))persistenceBlocked=patch.persistenceBlocked;
    }
    return {hidden:document.hidden,resetInProgress:resetInProgress,reloadInProgress:reloadInProgress,
      offlineCatchup:offlineCatchup,offlinePending:offlinePending,resumeFlowBusy:resumeFlowBusy,
      startupIntroPlaying:startupIntroPlaying,persistenceBlocked:persistenceBlocked};
  }
  var qaObserveOwners={
    saveState:[function(){return saveState;},function(fn){saveState=fn;}],
    cometCommitMutation:[function(){return cometCommitMutation;},function(fn){cometCommitMutation=fn;}],
    applyAscendMutation:[function(){return applyAscendMutation;},function(fn){applyAscendMutation=fn;}],
    simulationApplyAutoAscend:[function(){return simulationApplyAutoAscend;},function(fn){simulationApplyAutoAscend=fn;}],
    checkAutoAscend:[function(){return checkAutoAscend;},function(fn){checkAutoAscend=fn;}],
    defeatEnemy:[function(){return defeatEnemy;},function(fn){defeatEnemy=fn;}],
    simulationDefeatEnemy:[function(){return simulationDefeatEnemy;},function(fn){simulationDefeatEnemy=fn;}],
    simulationBatchFarmKills:[function(){return simulationBatchFarmKills;},function(fn){simulationBatchFarmKills=fn;}],
    cometRecordDefeats:[function(){return cometRecordDefeats;},function(fn){cometRecordDefeats=fn;}],
    spawnEnemy:[function(){return spawnEnemy;},function(fn){spawnEnemy=fn;}],
    applyAchievementChecks:[function(){return applyAchievementChecks;},function(fn){applyAchievementChecks=fn;}],
    settleCometClaims:[function(){return settleCometClaims;},function(fn){settleCometClaims=fn;}],
    forgeBossVictory:[function(){return forgeBossVictory;},function(fn){forgeBossVictory=fn;}],
    simulationTriggerAbility:[function(){return simulationTriggerAbility;},function(fn){simulationTriggerAbility=fn;}],
    simulationApplyPushPassive:[function(){return simulationApplyPushPassive;},function(fn){simulationApplyPushPassive=fn;}],
    simulationProcessAutoTap:[function(){return simulationProcessAutoTap;},function(fn){simulationProcessAutoTap=fn;}],
    simulationDealDiscreteDamage:[function(){return simulationDealDiscreteDamage;},function(fn){simulationDealDiscreteDamage=fn;}],
    advanceAuthoritativeTime:[function(){return advanceAuthoritativeTime;},function(fn){advanceAuthoritativeTime=fn;}]
  };
  function qaObserve(name,observer){
    var owner=qaObserveOwners[name];
    if(!owner || typeof observer!=='function')throw Error('Unknown original observation owner: '+name);
    var original=owner[0](),active=true;
    owner[1](function(){
      var args=Array.prototype.slice.call(arguments),beforeState=state,beforeToken=ascendRunToken;
      observer({phase:'before',name:name,args:args,state:state,token:ascendRunToken});
      var result,error;
      try{result=original.apply(this,arguments);return result;}
      catch(caught){error=caught;throw caught;}
      finally{observer({phase:'after',name:name,args:args,state:state,token:ascendRunToken,
        beforeState:beforeState,beforeToken:beforeToken,result:result,error:error});}
    });
    return function(){if(active){owner[1](original);active=false;}};
  }
  window.qa={
    fresh:freshState,get:function(){return state;},
    set:function(snapshot){state=acceptPersistedState(snapshot,'qa-fixture');return state;},
    accept:acceptPersistedState,load:function(){state=loadState();return state;},
    schema:function(){return SAVE_SCHEMA_VERSION;},day:todayStr,now:function(){return Date.now();},
    lifecycle:qaLifecycle,persistenceStatus:persistenceStatus,
    shopDefs:function(){return SHOP;},item:qaItem,
    buyPlan:function(item){return getCometBuyPlan(item);},buy:function(id){return buyShopItem(typeof id==='string'?qaItem(id):id);},
    upgradeLevel:function(id,snapshot){return cometUpgradeLevel(id,snapshot);},
    capacity:function(snapshot){return cometCapacity(snapshot);},workPerKill:function(snapshot){return cometWorkPerKill(snapshot);},
    hasLegacy:function(id,snapshot){return cometHasLegacy(id,snapshot);},
    meteorBudget:function(H,P,rank){return cometMeteorBudget(H,P,rank);},
    meteorHpPlan:function(H,h,P,rank){return cometMeteorHpPlan(H,h,P,rank);},
    commandPlan:function(id){return getCometCommandPlan(id);},command:function(id){return activateCometCommand(id);},
    commitMutation:function(apply){return cometCommitMutation(apply);},
    recordDefeats:function(count,called){return cometRecordDefeats(count,called);},
    refreshPlan:function(id){return getDailyQuestRefreshPlan(id);},refresh:function(id){return refreshDailyQuest(id);},
    refreshCost:dailyQuestRefreshCost,refreshCandidates:dailyQuestRefreshCandidates,
    questDefs:function(){return QUEST_POOL;},dateSeed:dateSeed,questEligible:dailyQuestEligible,restStop:restStopComplete,ensureDaily:ensureDaily,
    achievementDefs:function(){return ACHIEVEMENTS;},
    checkAchievements:function(){return checkAchievements();},applyAchievements:function(){return applyAchievementChecks();},
    settleClaims:function(snapshot){return settleCometClaims(snapshot);},
    save:function(at){return saveState(at);},export:function(){return currentSaveBackup();},encode:encodeSaveBackup,decode:decodeSaveBackup,
    restore:function(code){if(code!==undefined)qaArea.value=code;return restoreSaveBackup();},
    ascend:function(auto){return doAscend(!!auto);},runToken:function(){return ascendRunToken;},
    autoReady:autoAscendReady,checkAuto:function(){return checkAutoAscend();},
    spawn:function(rollLuminous){return spawnEnemy(rollLuminous);},restoreEnemy:restoreEnemyOrSpawn,
    manualKill:function(){return defeatEnemy();},manualTap:function(){return doTap(qaStage);},
    kill:function(kind){var summary=simulationSummary(0);simulationDefeatEnemy(simulationPolicy(kind||'live'),summary);return summary;},
    batch:function(count,kind){var summary=simulationSummary(0);simulationBatchFarmKills(count,simulationPolicy(kind||'live'),summary);return summary;},
    advance:function(seconds,options){return advanceAuthoritativeTime(seconds,options);},offline:function(done){return applyOfflineProgress(done);},
    policy:simulationPolicy,passive:passiveWispDpsAt,enemyHp:enemyHpFor,lumen:enemyRewardFor,shards:shardRewardFor,motes:motesDropFor,sigils:sigilsFromBoss,
    enterFarm:enterFarmMode,enterPush:enterPushMode,
    queueTrial:queueCometTrial,cancelTrial:cancelCometTrial,trialDefs:function(){return COMET_TRIALS;},selectCosmetic:selectCometCosmetic,
    spirit:qaSpirit,spiritDefs:function(){return SPIRITS;},
    cast:function(id,kind,at){var summary=simulationSummary(0);simulationTriggerAbility(qaSpirit(id),state.spirits[id],at===undefined?Date.now():at,simulationPolicy(kind||'live'),summary);return summary;},
    manualCast:function(id){return triggerAbility(qaSpirit(id),state.spirits[id]);},
    buff:simulationBuffMult,tap:tapDamage,fill:fillRateMult,sustained:sustainedCombatDps,estimatedBoss:estimatedBossKillSeconds,
    forgeProfile:forgeChargeProfile,forgeAssessment:forgeBossAssessment,observe:qaObserve
  };
  `;
  var match = source.match(/<script>\s*([\s\S]*?)<\/script>/);
  assert(match, 'complete inline game script exists');
  var marker = "if(document.readyState==='loading'){", script = match[1];
  assert.strictEqual(script.split(marker).length, 2, 'one complete-IIFE observation hook');
  class ClockDate extends Date {
    constructor() {
      var args = Array.prototype.slice.call(arguments);
      if (!args.length) super(now); else super(...args);
    }
    static now() { return now; }
  }
  new Function('window', 'document', 'localStorage', 'Date', 'setTimeout', 'clearTimeout',
    'performance', 'BigInt', 'location', 'navigator', 'qaStage', 'qaArea', 'qaPresentations',
    script.replace(marker, hooks + marker))(
      window, document, localStorage, ClockDate,
      function (fn, delay) { timers.push({id: ++nextTimer, fn: fn, delay: delay}); return nextTimer; },
      function (id) { var i = timers.findIndex(function (timer) { return timer.id === id; }); if (i >= 0) timers.splice(i, 1); },
      {now: function () { var result = performanceNow; performanceNow += performanceStep; return result; }},
      undefined, {reload: function () { reloadCount++; }}, {}, stage, area, presentations
    );
  var q = window.qa;
  assert(q, 'actual complete-IIFE facade installed');
  if (rawSlots !== undefined) q.load(); else q.set(q.fresh());
  return {
    q: q, storage: storage, area: area, writes: writes, attempts: attempts, reads: reads, presentations: presentations,
    clock: function (value) { if (value !== undefined) { assert(Number.isFinite(value), 'finite test clock'); now = value; } return now; },
    performanceStep: function (value) { assert(Number.isFinite(value) && value >= 0, 'finite nonnegative host processing cost'); performanceStep = value; },
    fail: function (primary, recovery) { failPrimary = !!primary; failRecovery = !!recovery; },
    reloads: function () { return reloadCount; },pending: function () { return timers.length; },
    step: function () { if (!timers.length) return false; timers.shift().fn(); return true; },
    drain: function (limit) {
      if (limit === undefined) limit = 100000;
      var count = 0;
      while (timers.length) { assert(count < limit, 'bounded pending callback drain'); count++; timers.shift().fn(); }
      return count;
    }
  };
}

function seed(q) {
  var s = q.fresh();
  // Unmigrated historical fixture, before either refund audit existed.
  delete s.feedbackMigration.bondsCreditAuditVersion;
  delete s.feedbackMigration.echoCreditAuditVersion;
  s.maxDepthEver = 250; s.questDay = q.day(); s.lastSeen = CLOCK;
  s.lumen = 1000000000000; s.shards = 1000000000000;
  s.motes = 10000; s.sigils = 10000; s.prisms = 10000; s.comets = 2000;
  s.depth = 101; s.enemyDepth = 101; s.enemyHp = s.enemyMaxHp = 1000000000000;
  s.autoAscendEnabled = false;
  ['empowerQueue', 'researchQueue', 'studyQueue', 'studyUseMotes'].forEach(function (key) {
    Object.keys(s[key]).forEach(function (id) { s[key][id] = false; });
  });
  return s;
}

module.exports = {app: app, seed: seed, clone: clone, P: P, R: R, CLOCK: CLOCK};
