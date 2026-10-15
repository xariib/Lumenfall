'use strict';
// Experimental complete-game builder. Produces a separate candidate and keeps
// index.html/frozen campaigns unchanged while the engine connection is proved.
const fs=require('node:fs'),assert=require('node:assert/strict'),create=require('../../scripts/lib/simulation-binary-clock.cjs');
module.exports=function(source){
 function edit(a,b,n=1){assert.equal(source.split(a).length,n+1,a);source=source.split(a).join(b);}
 edit('var studyClockMemo={state:null,endMs:null,anchors:{}};','var createBinarySimulationClock='+create.toString()+';\nvar studyClockMemo={state:null,endMs:null,anchors:{}};');
 edit('  function currentElapsedSec(){',`  var binaryClock=null,binaryStudyClock=null;
  function activateBinaryClock(){
    if(binaryClock)return;
    var previous=currentElapsedSec(),durationMs=elapsedSec*1000,settings=Number.isInteger(durationMs)&&durationMs>0?{budgetMs:durationMs}:undefined;
    binaryClock=createBinarySimulationClock(Amount,clockStartMs,elapsedSec,settings);
    if(previous>0)binaryClock.advance(previous);
    var prior=continuousStudyClock&&studyStartPosition.binary;
    binaryStudyClock=prior?prior.nextWindow(elapsedSec,settings):createBinarySimulationClock(Amount,clockStartMs,elapsedSec,settings);
    if(previous>0)binaryStudyClock.advance(previous);
    state.activeStudies.forEach(function(active){
      var anchor=studyProgressAnchors[active.id];
      if(anchor&&anchor.binaryAnchor)return;
      studyProgressAnchors[active.id]={remaining:active.remainingSec,lastRemaining:active.remainingSec,
        speed:studyEffectiveSpeed(active,simulationNowMs(),simulationClockPosition()),total:active.totalDurationSec,
        wholeSec:simulationClockPosition().wholeSec,gridRemaining:simulationClockPosition().remainingSec,
        binaryAnchor:binaryStudyClock.absoluteSnapshot()};
    });
  }
  function currentElapsedSec(){
    if(binaryClock)return Number(binaryClock.elapsed());`);
 edit('    var crossingDelta = targetFarmGridCrossings-farmGridCrossings;','    if(binaryClock)return binaryClock.remaining();\n    var crossingDelta = targetFarmGridCrossings-farmGridCrossings;');
 edit('    return {wholeSec:clockStartWholeSec+farmGridCrossings,remainingSec:farmGridRemainingSec};','    return {wholeSec:clockStartWholeSec+farmGridCrossings,remainingSec:farmGridRemainingSec,binary:binaryClock};');
 edit('    var absoluteWholeSec = clockStartWholeSec + farmGridCrossings;','    if(binaryClock)return binaryClock.nowMs();\n    var absoluteWholeSec = clockStartWholeSec + farmGridCrossings;');
 edit('    if(stepSec<=0) return 0;\n    if(stepSec<farmGridRemainingSec){',`    if(Amount.le(stepSec,0))return 0;
    if(binaryClock){
      var before=farmGridCrossings;binaryClock.advance(stepSec);binaryStudyClock.advance(stepSec);
      var at=binaryClock.nowMs(),whole=Math.floor(at/1000),fraction=(at-whole*1000)/1000;
      farmGridCrossings=whole-clockStartWholeSec;farmGridRemainingSec=fraction===0?1:1-fraction;return farmGridCrossings-before;
    }
    if(stepSec<farmGridRemainingSec){`);
 edit('    // The grid countdown is the canonical sub-second clock. Derive logical','    if(binaryClock){var elapsed=Number(binaryClock.elapsed());elapsedWholeSec=Math.floor(elapsed);elapsedFractionSec=elapsed-elapsedWholeSec;return;}\n    // The grid countdown is the canonical sub-second clock. Derive logical');
 edit('    if(!continuousStudyClock) return simulationClockPosition();','    if(binaryClock){var p=simulationClockPosition();p.binary=binaryStudyClock;return p;}\n    if(!continuousStudyClock) return simulationClockPosition();');
 edit('studyEffectiveSpeed(active,simulationNowMs())','studyEffectiveSpeed(active,simulationNowMs(),simulationClockPosition())',2);
 edit('wholeSec:studyClockPosition().wholeSec,gridRemaining:studyClockPosition().remainingSec','wholeSec:studyClockPosition().wholeSec,gridRemaining:studyClockPosition().remainingSec,\n          binaryAnchor:binaryStudyClock?binaryStudyClock.absoluteSnapshot():null');
 edit('var workSeconds = (position.wholeSec-anchor.wholeSec)+(anchor.gridRemaining-position.remainingSec);','var workSeconds = binaryStudyClock&&anchor.binaryAnchor?Number(binaryStudyClock.since(anchor.binaryAnchor)):(position.wholeSec-anchor.wholeSec)+(anchor.gridRemaining-position.remainingSec);');
 edit('  var initialNowMs = simulationNowMs();',`  if(elapsedSec>0&&state.riftMode==='push'){
    var firstKill=simulationPassiveKillSeconds(simulationPassiveDps(simulationNowMs(),simulationClockPosition()));
    if(firstKill>0&&farmGridRemainingSec-firstKill===farmGridRemainingSec)activateBinaryClock();
  }
  var initialNowMs = simulationNowMs();`);
 edit('    var dps = simulationPassiveDps(nowMs,simulationClockPosition());',`    var dps = simulationPassiveDps(nowMs,simulationClockPosition());
    if(!binaryClock&&state.riftMode==='push'){
      var tinyKill=simulationPassiveKillSeconds(dps);
      if(tinyKill>0&&farmGridRemainingSec-tinyKill===farmGridRemainingSec){activateBinaryClock();nowMs=simulationNowMs();dps=simulationPassiveDps(nowMs,simulationClockPosition());}
    }
    policy.clock=simulationClockPosition();`);
 edit('    policy.nowMs=nowMs;','    policy.nowMs=nowMs;policy.clock=simulationClockPosition();');
 edit('var studyStep = simulationNextStudySeconds(nowMs);','var studyStep = simulationNextStudySeconds(nowMs,simulationClockPosition());');
 edit('      policy.nowMs=nowMs+next*1000;','      policy.clock=binaryClock?{binary:binaryClock.project(next)}:null;\n      policy.nowMs=binaryClock?policy.clock.binary.nowMs():nowMs+next*1000;');
 edit('    var gridRemainingBefore = farmGridRemainingSec;','    var gridRemainingBefore = farmGridRemainingSec;\n    var binaryElapsedBefore=binaryClock?binaryClock.elapsed():null;');
 edit('farmGridRemainingSec===gridRemainingBefore && actions===0','farmGridRemainingSec===gridRemainingBefore && (!binaryClock||binaryClock.elapsed()===binaryElapsedBefore) && actions===0');
 edit('function supportDeadlineSecondsRemaining(until,nowMs,clock){\n  if(!until) return 0;','function supportDeadlineSecondsRemaining(until,nowMs,clock){\n  if(!until) return 0;\n  if(clock&&clock.binary)return clock.binary.until(until);');
 edit('supportDeadlineSecondsRemaining(old.until,nowMs,clock)<=0','Amount.le(supportDeadlineSecondsRemaining(old.until,nowMs,clock),0)');
 edit('simulationBuffSecondsRemaining(nowMs,clock)<=0','Amount.le(simulationBuffSecondsRemaining(nowMs,clock),0)');
 edit('supportDeadlineSecondsRemaining(sources[id].until,nowMs,clock)<=0','Amount.le(supportDeadlineSecondsRemaining(sources[id].until,nowMs,clock),0)');
 edit('supportDeadlineSecondsRemaining(entry.until,nowMs,clock)>0','Amount.gt(supportDeadlineSecondsRemaining(entry.until,nowMs,clock),0)');
 edit('simulationBuffSecondsRemaining(nowMs,clock)>0','Amount.gt(simulationBuffSecondsRemaining(nowMs,clock),0)');
 edit('var next = remaining>0 ? remaining : Infinity;','var next = Amount.gt(remaining,0) ? remaining : Infinity;');
 edit('if(seconds>0) next = Math.min(next,seconds);','if(Amount.gt(seconds,0)) next = Amount.min(next,seconds);');
 edit('function luminousMotePayout(nowMs){\n  if(nowMs<state.moteNextAtMs)return 0;','function luminousMotePayout(nowMs,clock){\n  if(clock&&clock.binary?Amount.gt(clock.binary.until(state.moteNextAtMs),0):nowMs<state.moteNextAtMs)return 0;');
 edit('luminousMotePayout(Number.isFinite(policy.nowMs)?policy.nowMs:Date.now());','luminousMotePayout(Number.isFinite(policy.nowMs)?policy.nowMs:Date.now(),policy.clock);');
 edit('function studyBoostAt(id,nowMs){','function studyBoostAt(id,nowMs,clock){');
 edit('return b && now>=b.startedAtMs && now<b.expiresAtMs ? b : null;','return b && (clock&&clock.binary?Amount.le(clock.binary.until(b.startedAtMs),0)&&Amount.gt(clock.binary.until(b.expiresAtMs),0):now>=b.startedAtMs && now<b.expiresAtMs) ? b : null;');
 edit('function studyEffectiveSpeed(active,nowMs){\n  var boost=studyBoostAt(active.id,nowMs);','function studyEffectiveSpeed(active,nowMs,clock){\n  var boost=studyBoostAt(active.id,nowMs,clock);');
 edit('function nextStudyBoostExpiry(nowMs){\n  var next=Infinity;',`function nextStudyBoostExpiry(nowMs,clock){
  var next=Infinity;
  if(clock&&clock.binary){Object.keys(state.studyBoosts).forEach(function(id){var b=state.studyBoosts[id];[b.startedAtMs,b.expiresAtMs].forEach(function(at){var left=clock.binary.until(at);if(Amount.gt(left,0))next=Amount.min(next,left);});});return next;}`);
 edit('function simulationNextStudySeconds(nowMs){','function simulationNextStudySeconds(nowMs,clock){');
 edit('var next = nextStudyBoostExpiry(nowMs);','var next = nextStudyBoostExpiry(nowMs,clock);');
 edit('var speed=studyEffectiveSpeed(active,nowMs);','var speed=studyEffectiveSpeed(active,nowMs,clock);');
 edit('next = Math.min(next,Math.max(0,active.remainingSec/speed));','next = Amount.min(next,Math.max(0,active.remainingSec/speed));');
 edit('var fill = (100/ABILITY_BASE_CYCLE_SEC) * fillRateMult() * elapsedSec;','var rate=(100/ABILITY_BASE_CYCLE_SEC)*fillRateMult();var fill=Amount.wide(elapsedSec)?Amount.mul(rate,elapsedSec):rate*elapsedSec;');
 edit('function simulationAdvanceAbilityResources(elapsedSec){\n  if(elapsedSec<=0) return;','function simulationAdvanceAbilityResources(elapsedSec){\n  if(Amount.le(elapsedSec,0)) return;');
 edit('(state.heroResource[id]||0)+fill','Amount.add(state.heroResource[id]||0,fill)');
 edit('(state._autoTapAccum||0) + elapsedSec*1000','(state._autoTapAccum||0) + (Amount.wide(elapsedSec)?Amount.mul(elapsedSec,1000):elapsedSec*1000)');
 edit('(state._autoEmpowerAccum||0) + elapsedSec*1000','(state._autoEmpowerAccum||0) + (Amount.wide(elapsedSec)?Amount.mul(elapsedSec,1000):elapsedSec*1000)');
 return source;
};
if(require.main===module){if(!process.argv[3])throw Error('Separate candidate output required');fs.writeFileSync(process.argv[3],module.exports(fs.readFileSync(process.argv[2]||'index.html','utf8')));}
