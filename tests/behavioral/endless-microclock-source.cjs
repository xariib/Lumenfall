'use strict';
// Experimental patch builder; never overwrites the product or frozen campaigns.
const fs=require('node:fs'),assert=require('node:assert/strict');
module.exports=function(source){
 function edit(a,b){assert.equal(source.split(a).length,2,a);source=source.replace(a,b);}
 edit('  function currentElapsedSec(){',`  var microClock=false,microError=0,microStartError=0,microTargetError=0;
  function clockTwoSum(a,b){var hi=a+b,v=hi-a;return {hi:hi,lo:(a-(hi-v))+(b-v)};}
  function activateMicroClock(){
    microClock=true;microStartError=-clockTwoSum(1,-startPhaseSec).lo;microError=microStartError;
    var phase=clockTwoSum(startPhaseSec,targetFractionSec),remaining=clockTwoSum(1,-(phase.hi-targetGridCarry));
    microTargetError=phase.lo-remaining.lo;
  }
  function currentElapsedSec(){`);
 edit('return Math.max(0,farmGridRemainingSec-targetFarmGridRemainingSec);','return Math.max(0,(farmGridRemainingSec-targetFarmGridRemainingSec)+(microClock?microTargetError-microError:0));');
 edit('return farmGridRemainingSec + Math.max(0,crossingDelta-1) + (1-targetFarmGridRemainingSec);','return farmGridRemainingSec + Math.max(0,crossingDelta-1) + (1-targetFarmGridRemainingSec)+(microClock?microTargetError-microError:0);');
 edit('return {wholeSec:clockStartWholeSec+farmGridCrossings,remainingSec:farmGridRemainingSec};','var position={wholeSec:clockStartWholeSec+farmGridCrossings,remainingSec:farmGridRemainingSec};if(microClock)position.compensationSec=microError;return position;');
 edit('    if(stepSec<farmGridRemainingSec){',`    if(!microClock&&state.riftMode==='push'&&farmGridRemainingSec-stepSec===farmGridRemainingSec)activateMicroClock();
    if(microClock){
      var y=-stepSec-microError,t=farmGridRemainingSec+y;microError=(t-farmGridRemainingSec)-y;farmGridRemainingSec=t;
      if(t>0||(t===0&&microError<0))return 0;
      var after=-t+microError,whole=Math.floor(after),fraction=(-t-whole)+microError;
      if(fraction<0)whole--;else if(fraction>=1)whole++;
      var shifted=clockTwoSum(1+whole,t);farmGridRemainingSec=shifted.hi;microError-=shifted.lo;farmGridCrossings+=1+whole;return 1+whole;
    }
    if(stepSec<farmGridRemainingSec){`);
 edit('elapsedFractionSec = firstFarmGridSec-farmGridRemainingSec;','elapsedFractionSec = firstFarmGridSec-farmGridRemainingSec+(microClock?microError-microStartError:0);');
 edit('elapsedFractionSec = firstFarmGridSec+(1-farmGridRemainingSec);','elapsedFractionSec = firstFarmGridSec+(1-farmGridRemainingSec)+(microClock?microError-microStartError:0);');
 edit('        farmGridRemainingSec = targetFarmGridRemainingSec;','        farmGridRemainingSec = targetFarmGridRemainingSec;if(microClock)microError=microTargetError;');
 edit('return (deadlineWhole-clock.wholeSec)+(clock.remainingSec-deadlineRemaining);',`var delta=(deadlineWhole-clock.wholeSec)+(clock.remainingSec-deadlineRemaining);
  if(clock.compensationSec!==undefined||(deadlineWhole===clock.wholeSec&&clock.remainingSec===deadlineRemaining)){
    var phase=(until-deadlineWhole*1000)/1000,virtual=deadlineRemaining-1,low=(1-(deadlineRemaining-virtual))+(-phase-virtual);
    delta-=low+(clock.compensationSec||0);
  }
  return delta;`);
 edit('speed:studyEffectiveSpeed(active,simulationNowMs()),total:active.totalDurationSec,','speed:studyEffectiveSpeed(active,simulationNowMs()),total:active.totalDurationSec,compensation:studyClockPosition().compensationSec||0,');
 edit('var workSeconds = (position.wholeSec-anchor.wholeSec)+(anchor.gridRemaining-position.remainingSec);','var workSeconds = (position.wholeSec-anchor.wholeSec)+(anchor.gridRemaining-position.remainingSec)+(position.compensationSec||0)-(anchor.compensation||0);');
 return source;
};
if(require.main===module){const source=module.exports(fs.readFileSync(process.argv[2]||'index.html','utf8'));if(!process.argv[3])throw Error('Separate output required');fs.writeFileSync(process.argv[3],source);}
