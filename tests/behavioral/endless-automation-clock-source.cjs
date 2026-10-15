'use strict';
// User15Oct explicitly chose stricter live/offline HP parity over retaining
// segmentation-dependent automation arithmetic. Experimental complete builder.
const fs=require('node:fs'),assert=require('node:assert/strict');
module.exports=function(source){
 function edit(a,b){assert.equal(source.split(a).length,2,a);source=source.replace(a,b);}
 const helpers=`
var canonicalAutomationAnchors={},canonicalAutomationDurations=new Map();
function invalidateCanonicalAutomation(field){delete canonicalAutomationAnchors[field];if(state.canonicalAutomationClock)delete state.canonicalAutomationClock[field];}
function canonicalAutomationMillis(intervals){
 var key=JSON.stringify(intervals),cached=canonicalAutomationDurations.get(key);if(cached!==undefined)return cached;
 var sum=intervals.reduce(function(a,b){return a+b;},0),clock=createBinarySimulationClock(Amount,0,Math.max(1,sum*2));
 intervals.forEach(function(dt){clock.advance(dt);});var value=clock.elapsedNumber()*1000;
 canonicalAutomationDurations.set(key,value);if(canonicalAutomationDurations.size>64)canonicalAutomationDurations.delete(canonicalAutomationDurations.keys().next().value);return value;
}
function canonicalAutomationAnchor(field,clock){
 var value=state[field]||0,m=canonicalAutomationAnchors[field];
 if(!m||m.state!==state||m.run!==ascendRunToken||m.last!==value){
   var sameOwner=m&&m.state===state&&m.run===ascendRunToken,saved=!sameOwner&&state.canonicalAutomationClock&&state.canonicalAutomationClock[field];
   var base=saved&&saved.last===value?saved.base:value,start=saved&&saved.last===value?clock.pointBefore(saved.elapsed):clock.absoluteSnapshot(),delay=Math.max(0,(1000-base)/1000);
   m={state:state,run:ascendRunToken,base:base,last:value,start:start,delay:delay,deadline:clock.pointAfter(start,delay)};canonicalAutomationAnchors[field]=m;
 }
 return m;
}
function recordCanonicalAutomation(field,m,clock){
 if(!state.canonicalAutomationClock)state.canonicalAutomationClock={};
 state.canonicalAutomationClock[field]={base:m.base,elapsed:clock.since(m.start),last:state[field]||0};
}
function persistCanonicalAutomation(clock){
 var next={};[['_autoTapAccum','autotap'],['_autoEmpowerAccum','labmaster']].forEach(function(pair){if(state.achieved[pair[1]]){var m=canonicalAutomationAnchor(pair[0],clock),elapsed=clock.since(m.start);if(Amount.gt(elapsed,0))next[pair[0]]={base:m.base,elapsed:elapsed,last:state[pair[0]]||0};}});state.canonicalAutomationClock=next;
}
function canonicalAutomationNext(field,clock){
 var m=canonicalAutomationAnchor(field,clock),at=clock.absoluteSnapshot();
 if(at.e===m.start.e&&Amount.cmp(at.n,m.start.n)===0)return m.delay;
 var left=Amount.exactSub(0,clock.since(m.deadline));
 if(Amount.le(left,0)&&(state[field]||0)<1000-1e-7)throw new Error('Canonical timer deadline mismatch '+JSON.stringify({field:field,base:m.base,last:m.last,value:state[field],elapsed:clock.sinceNumber(m.start),delay:m.delay}));
 return Amount.max(0,left);
}
function canonicalAutomationAdvance(from,to){
 [['_autoTapAccum','autotap'],['_autoEmpowerAccum','labmaster']].forEach(function(pair){
   if(!state.achieved[pair[1]])return;var m=canonicalAutomationAnchor(pair[0],from);
   state[pair[0]]=m.base+to.sinceNumber(m.start)*1000;m.last=state[pair[0]];recordCanonicalAutomation(pair[0],m,to);
 });
}
`;
 edit('function simulationNextAutoTapSeconds(){',helpers+'\nfunction simulationNextAutoTapSeconds(clock){\n  if(state.achieved.autotap&&clock&&clock.binary)return canonicalAutomationNext(\'_autoTapAccum\',clock.binary);');
 edit('function simulationNextAutoEmpowerSeconds(){','function simulationNextAutoEmpowerSeconds(clock){\n  if(state.achieved.labmaster&&clock&&clock.binary)return canonicalAutomationNext(\'_autoEmpowerAccum\',clock.binary);');
 edit('var autoTapStep = simulationNextAutoTapSeconds();','var autoTapStep = simulationNextAutoTapSeconds(simulationClockPosition());');
 edit('var autoEmpowerStep = simulationNextAutoEmpowerSeconds();','var autoEmpowerStep = simulationNextAutoEmpowerSeconds(simulationClockPosition());');
 edit('  function advanceAutomationToProjectedClock(stepSec,windowEnd){',`  function advanceAutomationToProjectedClock(stepSec,windowEnd){
    if(binaryClock&&state.riftMode==='push'){
      canonicalAutomationAdvance(binaryClock,binaryClock.project(stepSec));simulationAdvanceAbilityResources(stepSec);
      resourceProgressAnchors={};automationProgressAnchors={};return;
    }
    canonicalAutomationAnchors={};state.canonicalAutomationClock={};`);
 edit('    state._autoTapAccum=Amount.lt(Amount.abs(tapResidual),1e-7) ? 0 : Amount.max(0,tapResidual);',"    state._autoTapAccum=Amount.lt(Amount.abs(tapResidual),1e-7) ? 0 : Amount.max(0,tapResidual);\n    invalidateCanonicalAutomation('_autoTapAccum');");
 edit('    state._autoEmpowerAccum = Math.abs(empowerResidual)<1e-7 ? 0 : Math.max(0,empowerResidual);',"    state._autoEmpowerAccum = Math.abs(empowerResidual)<1e-7 ? 0 : Math.max(0,empowerResidual);\n    invalidateCanonicalAutomation('_autoEmpowerAccum');");
 edit('function nativeProgram(recipe){return recipe.intervals.map(function(n){return n*1000;}).concat([null]);}','function nativeProgram(recipe){return [canonicalAutomationMillis(recipe.intervals),null];}');
 // A saved timer may legitimately be between999.999ms and1000ms. The
 //999.999ms cap still belongs to Ascend; loading is not an Ascension.
 for(const field of ['_autoTapAccum','_autoEmpowerAccum'])edit('out.'+field+' = Math.max(0,Math.min(999.999,finiteNonNegative(source.'+field+',0)));','out.'+field+' = Math.max(0,Math.min(1000,finiteNonNegative(source.'+field+',0)));');
 edit('  out._autoEmpowerAccum = Math.max(0,Math.min(1000,finiteNonNegative(source._autoEmpowerAccum,0)));',`  out._autoEmpowerAccum = Math.max(0,Math.min(1000,finiteNonNegative(source._autoEmpowerAccum,0)));
  out.canonicalAutomationClock={};
  if(source.canonicalAutomationClock!==undefined){
    if(!isPlainObject(source.canonicalAutomationClock))throw persistenceError('invalid-automation-clock','Automation clock needs recovery');
    ['_autoTapAccum','_autoEmpowerAccum'].forEach(function(field){
      var record=source.canonicalAutomationClock[field];if(record===undefined)return;
      if(!isPlainObject(record)||!Number.isFinite(record.base)||record.base<0||record.base>1000||!Number.isFinite(record.last)||record.last<0||record.last>1000||!Amount.valid(record.elapsed)||Amount.lt(record.elapsed,0)||Amount.gt(record.elapsed,2))throw persistenceError('invalid-automation-clock','Automation clock needs recovery');
      var elapsed=record.elapsed,probe;try{probe=createBinarySimulationClock(Amount,0,elapsed);probe.advance(elapsed);}catch(error){throw persistenceError('invalid-automation-clock','Automation clock needs recovery');}
      // An actual tick/reset may have changed the phase since its last recorded
      // basis. Keep that legitimate phase; start a new basis at its real owner.
      if(record.last===out[field]){if(record.base+probe.elapsedNumber()*1000!==record.last)throw persistenceError('invalid-automation-clock','Automation clock needs recovery');if(Amount.gt(elapsed,0))out.canonicalAutomationClock[field]={base:record.base,elapsed:elapsed,last:record.last};}
    });
  }`);
 edit('wispMastery:wispMastery, recruitmentEntitlements:recruitmentEntitlements','wispMastery:wispMastery, canonicalAutomationClock:{}, recruitmentEntitlements:recruitmentEntitlements');
 edit('  var oldTapPhase=state._autoTapAccum||0,oldEmpowerPhase=state._autoEmpowerAccum||0;','  state.canonicalAutomationClock={};\n  var oldTapPhase=state._autoTapAccum||0,oldEmpowerPhase=state._autoEmpowerAccum||0;');
 edit('state.luminousAccum=spawns.phase;state.enemyIsLuminous=spawns.flag;ascendRunToken={};','state.luminousAccum=spawns.phase;state.enemyIsLuminous=spawns.flag;state.canonicalAutomationClock={};ascendRunToken={};');
 edit('  delete summary._cycle;cycleOwner=null;','  if(binaryClock)persistCanonicalAutomation(binaryClock);\n  delete summary._cycle;cycleOwner=null;');
 return source;
};
if(require.main===module){assert(process.argv[2]&&process.argv[3]);fs.writeFileSync(process.argv[3],module.exports(fs.readFileSync(process.argv[2],'utf8')));}
