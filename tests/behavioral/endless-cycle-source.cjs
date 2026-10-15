'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'),binary=require('./endless-binary-clock-source.cjs');
module.exports=function(source){
 source=binary(source);
 function edit(a,b,n=1){assert.equal(source.split(a).length,n+1,a);source=source.split(a).join(b);}
 const lib=name=>require('../../scripts/lib/'+name+'.cjs').toString();
 const session=fs.readFileSync(path.resolve(__dirname,'../../scripts/lib/luminous-orbit-session.cjs'),'utf8').split('\nmodule.exports')[0];
 const definitions=[
  'var createLuminousOrbit='+lib('luminous-orbit')+';',session,
  'var cycleAggregate='+lib('ascend-cycle-aggregate')+';',
  'var cycleTailLumen='+lib('ascend-cycle-lumen')+';',
  'var cycleLatticeClock='+lib('ascend-cycle-lattice-clock')+';',
  'var cycleNativePhase='+lib('ascend-native-phase')+';',
  'var cycleEconomyBound='+lib('ascend-cycle-economy-bound')+';',
  'var cycleNativeCredit='+lib('native-credit-prefix')+';',
  'var cycleResources='+lib('checked-resource-cycles')+';',
  'var cycleNativeThreshold=('+lib('native-event-threshold')+')(Amount);',
  'var cycleRecastThreshold=cycleNativeThreshold.midpoint(SIM_EPS,cycleNativeThreshold.nextUp(SIM_EPS));',
  'var cycleRecordAscends=('+lib('ascend-cycle-receipts')+')(Amount);',
  'var endlessPityCache=null,endlessCombatCache=new Map(),endlessPassiveCache=new Map(),endlessResourceCache=new Map(),endlessHeroObserver=null;',
  'var createEndlessCycleRuntime='+require('./endless-cycle-runtime.cjs').toString()+';'
 ].join('\n');
 edit('var studyClockMemo={state:null,endMs:null,anchors:{}};',definitions+'\nvar studyClockMemo={state:null,endMs:null,anchors:{}};');
 edit('function advanceAuthoritativeTime(elapsedSec,options){','function advanceAuthoritativeTime(elapsedSec,options){\n  var cycleOwner=null;');
 edit('  var summary = simulationSummary(elapsedSec);',`  var summary = simulationSummary(elapsedSec);
  Object.defineProperty(summary,'_cycle',{value:createEndlessCycleRuntime(summary,policy,options,cyclePaidDeadline),configurable:true});
  cycleOwner=summary._cycle;endlessHeroObserver=cycleOwner;`);
 edit('  summary.ascends++;\n  summary.ascendGains.push(gain);','  cycleRecordAscends(summary,gain,1);');
 edit('    summary.luminousKills++;','    summary.luminousKills=creditAmount(summary.luminousKills,1);');
 edit('    summary.bossKills++;','    summary.bossKills=creditAmount(summary.bossKills,1);');
 for(const [field,count]of [['lumenGained',3],['shardGained',3],['sigilsGained',1],['motesGained',4]])edit('summary.'+field+'=Amount.add(','summary.'+field+'=creditAmount(',count);
 edit('  state = normalizeCurrentSave(state,true);\n  simulationRecordAchievements(summary);',`  state = normalizeCurrentSave(state,true);
  if(summary._cycle)summary._cycle.ascend(gain,Amount.exactSub(state.motes,motesBeforeAscend));
  simulationRecordAchievements(summary);`);
 edit('  var shardGain = Amount.mul(shardRewardFor(depth,wasLuminous),rewardScale);',`  var shardGain = Amount.mul(shardRewardFor(depth,wasLuminous),rewardScale);
  if(summary._cycle&&summary._cycle.active())summary._cycle.kill({kind:'kill',depth:depth,
    normalLumen:Amount.mul(enemyRewardFor(depth,false),rewardScale),brightLumen:Amount.mul(enemyRewardFor(depth,true),rewardScale),
    normalShard:Amount.mul(shardRewardFor(depth,false),rewardScale),brightShard:Amount.mul(shardRewardFor(depth,true),rewardScale),nextChance:isBoss(depth+1)?null:eliteChance(depth+1)});`);
 edit('  var rewardScale=simulationRewardScale(policy);\n  if(Amount.gt(rewards.shards,0)){',`  var rewardScale=simulationRewardScale(policy);
  if(summary._cycle)summary._cycle.gain(Amount.mul(rewards.lumen,rewardScale),Amount.mul(rewards.shards,rewardScale),sp.id);
  if(Amount.gt(rewards.shards,0)){`);
 edit('    if(Amount.gt(next,0)){',`    if(Amount.gt(next,0)){
      if(summary._cycle)summary._cycle.interval(next,summary._cycle.capturesResources()&&Amount.cmp(next,abilityStep)===0&&[remaining,autoTapStep,autoEmpowerStep,studyStep,buffStep,bossRetreatStep,farmGridStep,economyStep,simulationPassiveKillSeconds(dps)].every(function(v){return Amount.lt(next,v);}));`);
 edit('  state.heroResource[id]=Math.min(100,(state.heroResource[id]||0)+amount);','  if(endlessHeroObserver)endlessHeroObserver.charge(id,amount);\n  state.heroResource[id]=Math.min(100,(state.heroResource[id]||0)+amount);');
 edit('var fill=Amount.wide(elapsedSec)?Amount.mul(rate,elapsedSec):rate*elapsedSec;','var fill=Amount.wide(elapsedSec)?Amount.mul(rate,elapsedSec):rate*elapsedSec;\n  if(endlessHeroObserver)endlessHeroObserver.fill(fill);');
 edit("    var id=ids[i];\n    if((state.spirits[id]||0)<=0 || (state.heroResource[id]||0)<100-1e-7) continue;","    var id=ids[i];\n    if(summary._cycle)summary._cycle.heroCheck(id,nowMs,clock);\n    if((state.spirits[id]||0)<=0 || (state.heroResource[id]||0)<100-1e-7) continue;");
 edit("    if(processed>10) throw new Error('Authoritative simulation Auto-Empower guard exceeded');","    if(summary._cycle)summary._cycle.automaticTick();\n    if(processed>10) throw new Error('Authoritative simulation Auto-Empower guard exceeded');");
 edit('  function currentElapsedSec(){',`  function advanceCycleClock(duration){
    binaryClock.advanceLattice(duration);binaryStudyClock.advanceLattice(duration);
    var at=binaryClock.nowMs(),whole=Math.floor(at/1000),fraction=(at-whole*1000)/1000;
    farmGridCrossings=whole-clockStartWholeSec;farmGridRemainingSec=fraction===0?1:1-fraction;syncElapsedClockFromFarmGrid();
  }
  function cyclePaidDeadline(active){
    var anchor=studyProgressAnchors[active.id];if(!anchor||!anchor.binaryAnchor||!binaryStudyClock)return null;
    if(!anchor.cycleThreshold)anchor.cycleThreshold=cycleNativeThreshold.firstTrue(function(work){return anchor.remaining-work*anchor.speed<=SIM_EPS;},anchor.remaining/anchor.speed);
    return binaryStudyClock.latticeAfter(anchor.binaryAnchor,anchor.cycleThreshold);
  }
  function currentElapsedSec(){`);
 edit('    policy.clock=simulationClockPosition();',`    policy.clock=simulationClockPosition();
    if(binaryClock)captureStudyProgressAnchors();
    var bulk=yield* summary._cycle.prepare(binaryClock);
    if(bulk){
      captureStudyProgressAnchors();advanceCycleClock(bulk.duration);bulk.apply();advanceStudyProgressToClock();
      elapsedInRun=currentElapsedSec();remaining=simulationRemainingSec();policy.clock=simulationClockPosition();policy.nowMs=simulationNowMs();
      simulationResolveTimestamp(policy.nowMs,elapsedInRun,policy,summary,policy.clock);continue;
    }`);
 edit('  summary.endDepth = state.depth;','  delete summary._cycle;cycleOwner=null;\n  summary.endDepth = state.depth;');
 edit('  var cursor = run();\n  if(options && options.resumable) return cursor;',`  var cursor = run();
  ['next','return','throw'].forEach(function(name){var method=cursor[name];cursor[name]=function(value){var previous=endlessHeroObserver;try{endlessHeroObserver=cycleOwner;return method.call(cursor,value);}finally{endlessHeroObserver=previous;}};});
  if(options && options.resumable) return cursor;`);
 edit('  offlineCatchup = null;\n  offlinePending = true;\n  resumeFlowBusy = false;','  offlineCatchup = null;\n  if(job.cursor&&job.cursor.return)job.cursor.return();\n  offlinePending = true;\n  resumeFlowBusy = false;');
 edit('if(summary.ascends>ascendsBefore){','if(Amount.gt(summary.ascends,ascendsBefore)){',2);
 edit('count:summary.ascends-ascendsBefore','count:Amount.exactSub(summary.ascends,ascendsBefore)',2);
 edit("offline.ascends + ' time'","(Amount.wide(offline.ascends)?formatNum(offline.ascends):offline.ascends) + ' time'");
 return source;
};
if(require.main===module){if(!process.argv[3])throw Error('Separate candidate output required');fs.writeFileSync(process.argv[3],module.exports(fs.readFileSync(process.argv[2]||'index.html','utf8')));}
