/* Fixed clear-Rift target: real controls/handlers and independent boundary oracles. */
window.autoTargetSeed=function(b,clear,enabled){
  var s=b.freshStateSnapshot();s.owned.autoascend=true;s.autoAscendEnabled=!!enabled;
  s.autoAscendTargetDepth=clear+1;s.maxDepthEver=101;s.depth=1;s.enemyDepth=1;
  s.enemyHp=s.enemyMaxHp=b.enemyHpFor(1);s.questDay=b.currentDay();s.loginStreak=1;
  return s;
};
window.autoTargetObservation=function(b){
  return {state:b.getState(),primary:b.rawSave(),recovery:b.rawRecovery(),events:b.lifecycleTrace(),persistence:b.persistenceStatus(),flags:b.autoTarget.flags()};
};
window.autoTargetStableJson=function(value){
  function ordered(v){if(Array.isArray(v))return v.map(ordered);if(v&&typeof v==='object'){var out={};Object.keys(v).sort().forEach(function(k){out[k]=ordered(v[k]);});return out;}return v;}
  return JSON.stringify(ordered(value));
};
// Existing scenario IDs now protect retirement, manual records and legacy history.
window.runAutoTargetWindows=function(b,assert){
 var checks=0,records=[];function ok(v,m){checks++;assert(v,m);}
 [214,215,220,10001,10015,Math.pow(2,53),1e30,Number.MAX_VALUE].forEach(function(history){
  var s=autoTargetSeed(b,43,true);s.maxDepthEver=history;b.setState(s);b.feedbackSave();var before=autoTargetObservation(b);
  b.autoTarget.render();b.refreshAffordability();
  ok(!document.querySelector('[data-autoascend-target],[data-autoascend-toggle],[data-autoascend-open],[data-shop="autoascend"]'),'retired controls absent at every history');
  ok(JSON.stringify(autoTargetObservation(b))===JSON.stringify(before),'retirement render is pure');
  ok(b.getState().maxDepthEver===history&&b.getState().autoAscendTargetDepth===44,'legacy high history/target retained');
  ok(!b.getState().autoAscendEnabled&&!b.ascendEligibility().autoReady,'imported ON cannot revive automatic reset');
  ok(b.autoTarget.input('55')===false,'retired target action unavailable');
  ok(JSON.stringify(autoTargetObservation(b))===JSON.stringify(before),'retired action preserves all state and both slots');
  records.push({history,target:44,automatic:false});
 });return {checks:checks,records:records};
};
window.runAutoTargetContract=function(b,ctx,assert,parity){
 var checks=0,records=[],copy=x=>JSON.parse(JSON.stringify(x));function ok(v,m){checks++;assert(v,m);}function same(a,c,m){ok(JSON.stringify(a)===JSON.stringify(c),m);}
 b.uiMeasurementPause(true);var windows=runAutoTargetWindows(b,assert);checks+=windows.checks;
 [15,43,55].forEach(function(clear){
  var s=autoTargetSeed(b,clear,true);s.depth=s.enemyDepth=clear+1;s.enemyHp=s.enemyMaxHp=b.enemyHpFor(clear+1);s.autoAscendTargetDepth=16;s.activeStudies=[{id:'guardmastery',remainingSec:123,totalDurationSec:150,speedMult:2}];s.comets=37;
  b.setState(s);var baseline=b.getState();ok(baseline.comets===137&&baseline.autoAscendRefund.paid,'one exact owner refund');
  ['live','offline'].forEach(function(kind){b.setState(baseline);var r=b.simulateTimeline(.25,kind,b.clockNow());ok(r.summary.ascends===0&&r.state.ascendCount===baseline.ascendCount&&r.state.prisms===baseline.prisms,'elapsed combat cannot automatically reset/pay '+kind);});
  b.setState(baseline);b.feedbackSave();var quote=b.ascendBreakdown().gain,paid=b.getState();
  ok(b.autoTarget.manual()===true,'manual clear qualifies '+clear);var after=b.getState();
  ok(after.prisms===paid.prisms+quote&&after.ascendCount===paid.ascendCount+1&&after.ascendRewardedDepth===clear,'one exact manual record transaction');
  ok(after.autoAscendTargetDepth===paid.autoAscendTargetDepth&&!after.autoAscendEnabled,'manual reset preserves historical target without automation');
  same(after.activeStudies,paid.activeStudies,'manual reset preserves every paid work receipt');
  same(after.autoAscendRefund,paid.autoAscendRefund,'manual reset cannot refund twice');
  var repeat=copy(after);repeat.depth=repeat.enemyDepth=clear+1;repeat.enemyHp=repeat.enemyMaxHp=b.enemyHpFor(clear+1);b.setState(repeat);var before=autoTargetObservation(b);
  ok(b.ascendBreakdown().gain===0&&!b.ascendEligibility().eligible,'same record awards nothing');ok(b.autoTarget.manual()===false,'same record cannot reset');same(autoTargetObservation(b),before,'denied manual reset preserves whole state and slots');
  repeat.depth=repeat.enemyDepth=clear+2;repeat.maxDepthEver=Math.max(repeat.maxDepthEver,clear+2);repeat.enemyHp=repeat.enemyMaxHp=b.enemyHpFor(clear+2);b.setState(repeat);ok(b.autoTarget.manual()===true,'next higher clear unlocks manual reset');
  records.push({clear:clear,firstReward:quote,nextRecord:b.getState().ascendRewardedDepth});
 });
 [14,15].forEach(function(clear){var s=autoTargetSeed(b,clear,true);s.depth=s.enemyDepth=clear+1;s.maxDepthEver=10000;b.setState(s);ok(b.ascendEligibility().eligible===(clear===15),'first clear15 boundary uses current run');});
 var s=autoTargetSeed(b,43,true);s.depth=s.enemyDepth=43;s.enemyHp=1;s.enemyMaxHp=b.enemyHpFor(43);s.spirits.ember=100;s.heroResource.ember=100;b.setState(s);var r=b.simulateTimeline(0,'offline',b.clockNow());ok(r.summary.kills===1&&r.summary.ascends===0,'actual target kill stays in current run');
 ok(b.getState().depth===44&&b.getState().autoAscendTargetDepth===44,'actual kill retains new run progress/history');
 return {checks:checks,records:records,windows:windows,policy:'manual higher-record Ascension; retired automatic actions unavailable'};
};

window.runAutoTargetPersistence=function(b,ctx,assert,phase,nextPhase,finish){
  var key='auto-target-persistence-'+ctx.scenario,copy=x=>JSON.parse(JSON.stringify(x));
  if(phase()===0){
    var match=ctx.scenario.match(/legacy(\d+)$/),internal=match?Number(match[1]):44;
    var s=window.autoTargetSeed(b,internal-1,true);s.maxDepthEver=21;
    s.research.arcanecal=4;s.comets=37;s.activeStudies=[{id:'guardmastery',totalDurationSec:150,remainingSec:123,speedMult:2}];
    if(ctx.scenario.endsWith('manual-reload')){s.depth=101;s.maxDepthEver=101;s.enemyDepth=101;s.enemyHp=s.enemyMaxHp=b.enemyHpFor(101);}
    if(ctx.scenario==='auto-ascend-target-cold-resume'){
      s.depth=43;s.enemyDepth=43;s.enemyHp=1;s.enemyMaxHp=b.enemyHpFor(43);s.spirits.ember=100;s.heroResource.ember=100;s.activeStudies=[{id:'guardmastery',totalDurationSec:150,remainingSec:.5,speedMult:2}];
    }
    b.setState(s);if(ctx.scenario.endsWith('manual-reload'))b.autoTarget.manual();b.feedbackSave();var saved=b.getState();
    if(ctx.scenario==='auto-ascend-target-cold-resume'){
      var oracle=b.previewOffline(saved,6,b.clockNow());oracle.state.lastSeen=b.clockNow()+6000;oracle.state.offlineClockHighWaterMs=Math.max(saved.offlineClockHighWaterMs,oracle.state.lastSeen);oracle.state.totalOfflineSeconds=saved.totalOfflineSeconds+6;
      localStorage.setItem(key,JSON.stringify(oracle.state));b.advanceTime(6000);
    } else localStorage.setItem(key,JSON.stringify(saved));
    nextPhase(1);
    if(ctx.scenario.endsWith('backup-restore')){
      var different=copy(saved);different.autoAscendEnabled=false;different.autoAscendTargetDepth=16;different.owned.autoascend=false;different.autoAscendRefund={policy:'autoascend-retired-v1',total:0,paid:true};
      b.setState(different);b.restoreBackup('LUMENFALL1:'+encodeURIComponent(JSON.stringify(saved)));return;
    }
    if(ctx.scenario.endsWith('reset')){b.reset();return;}
    if(ctx.scenario.endsWith('recovery'))b.formationTest.corruptPrimary();
    b.suppressUnloadSave();location.reload();return;
  }
  var expected=JSON.parse(localStorage.getItem(key)),actual=b.getState();
  if(ctx.scenario.endsWith('reset')){assert(actual.autoAscendTargetDepth===16&&!actual.owned.autoascend&&!actual.autoAscendEnabled,'full Reset fresh target/ownership/OFF');finish('pass',{state:actual});return;}
  assert(autoTargetStableJson(actual)===autoTargetStableJson(expected),'actual zero-time loader keeps entire state/legacy target '+JSON.stringify(Object.keys(actual).filter(function(k){return autoTargetStableJson(actual[k])!==autoTargetStableJson(expected[k]);}).map(function(k){return {field:k,actual:actual[k],expected:expected[k]};})));
  b.autoTarget.render();var el=document.querySelector('[data-autoascend-target]');
  assert(!el&&!document.querySelector('[data-shop=autoascend],[data-autoascend-toggle]'),'legacy reload never recreates retired controls');
  assert(JSON.parse(b.rawSave()).autoAscendTargetDepth===expected.autoAscendTargetDepth&&JSON.parse(b.rawRecovery()).autoAscendTargetDepth===expected.autoAscendTargetDepth,'primary/recovery exact legacy target');
  if(ctx.scenario==='auto-ascend-target-cold-resume'){
    assert(actual.autoAscendTargetDepth===44&&actual.ascendCount===0&&actual.longStudyLevels.guardmastery===1,'actual cold load finishes paid Study without automatic reset');
    assert(b.lifecycleTrace().filter(e=>e.type==='offline'&&e.detail.result).length===1,'cold offline applied once');
    return finish('pass',{state:actual,primary:b.rawSave(),recovery:b.rawRecovery(),events:b.lifecycleTrace()});
  }
  if(ctx.scenario.endsWith('resume')){
    var s=window.autoTargetSeed(b,43,true);s.depth=43;s.enemyDepth=43;s.enemyHp=1;s.enemyMaxHp=b.enemyHpFor(43);s.spirits.ember=100;s.heroResource.ember=100;s.activeStudies=[{id:'guardmastery',totalDurationSec:150,remainingSec:.5,speedMult:2}];
    b.setState(s);b.feedbackSave();s=b.getState();var now=b.clockNow(),oracle=b.previewOffline(s,6,now);
    oracle.state.lastSeen=now+6000;oracle.state.offlineClockHighWaterMs=Math.max(s.offlineClockHighWaterMs,oracle.state.lastSeen);oracle.state.totalOfflineSeconds=s.totalOfflineSeconds+6;
    b.clearLifecycleTrace();b.autoTarget.visibility(true);b.advanceTime(6000);b.autoTarget.visibility(false);
    actual=b.getState();assert(JSON.stringify(actual)===JSON.stringify(oracle.state),'whole-state visibility resume matches authoritative offline window and explicit lifecycle metadata');
    assert(actual.autoAscendTargetDepth===44&&actual.ascendCount===s.ascendCount&&!actual.autoAscendEnabled,'resume retains current run and historical target');
    var before=window.autoTargetObservation(b);b.autoTarget.visibility(false);assert(JSON.stringify(b.getState())===JSON.stringify(before.state),'duplicate visibility no extra reward/reset');
    assert(b.lifecycleTrace().filter(e=>e.type==='offline'&&e.detail.result).length===1,'offline exactly once');
    return finish('pass',{state:actual,oracle,primary:b.rawSave(),recovery:b.rawRecovery(),events:b.lifecycleTrace()});
  }
  finish('pass',{state:actual,primary:b.rawSave(),recovery:b.rawRecovery(),events:b.lifecycleTrace()});
};
