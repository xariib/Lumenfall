'use strict';
// User15Oct explicitly chose stricter live/offline HP parity over retaining
// segmentation-dependent automation arithmetic. Experimental complete builder.
const fs=require('node:fs'),assert=require('node:assert/strict');
module.exports=function(source){
 function edit(a,b){assert.equal(source.split(a).length,2,a);source=source.replace(a,b);}
 const helpers=`
var canonicalAutomationAnchors={},canonicalAutomationDurations=new Map();
function canonicalAutomationMillis(intervals){
 var key=JSON.stringify(intervals),cached=canonicalAutomationDurations.get(key);if(cached!==undefined)return cached;
 var sum=intervals.reduce(function(a,b){return a+b;},0),clock=createBinarySimulationClock(Amount,0,Math.max(1,sum*2));
 intervals.forEach(function(dt){clock.advance(dt);});var value=clock.elapsedNumber()*1000;
 canonicalAutomationDurations.set(key,value);if(canonicalAutomationDurations.size>64)canonicalAutomationDurations.delete(canonicalAutomationDurations.keys().next().value);return value;
}
function canonicalAutomationAnchor(field,clock){
 var value=state[field]||0,m=canonicalAutomationAnchors[field];
 if(!m||m.state!==state||m.run!==ascendRunToken||m.last!==value){
   var delay=Math.max(0,(1000-value)/1000);
   m={state:state,run:ascendRunToken,base:value,last:value,start:clock.absoluteSnapshot(),delay:delay,deadline:clock.project(delay).absoluteSnapshot()};canonicalAutomationAnchors[field]=m;
 }
 return m;
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
   state[pair[0]]=m.base+to.sinceNumber(m.start)*1000;m.last=state[pair[0]];
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
    }`);
 edit('function nativeProgram(recipe){return recipe.intervals.map(function(n){return n*1000;}).concat([null]);}','function nativeProgram(recipe){return [canonicalAutomationMillis(recipe.intervals),null];}');
 // A saved timer may legitimately be between999.999ms and1000ms. The
 //999.999ms cap still belongs to Ascend; loading is not an Ascension.
 for(const field of ['_autoTapAccum','_autoEmpowerAccum'])edit('out.'+field+' = Math.max(0,Math.min(999.999,finiteNonNegative(source.'+field+',0)));','out.'+field+' = Math.max(0,Math.min(1000,finiteNonNegative(source.'+field+',0)));');
 return source;
};
if(require.main===module){assert(process.argv[2]&&process.argv[3]);fs.writeFileSync(process.argv[3],module.exports(fs.readFileSync(process.argv[2],'utf8')));}
