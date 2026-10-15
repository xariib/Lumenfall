'use strict';
// Same productive physical time, one offline window versus live frames.
// Rewards are1x on both policies in this fixture. Money/counters remain exact;
// physical Number fields use the repository's established parity tolerance.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),A=require('../../scripts/lib/game-amount.cjs'),build=require('./endless-cycle-source.cjs'),{app,CLOCK,clone}=require('./forge-expansion-harness.cjs');
let source=process.argv[2]?fs.readFileSync(process.argv[2],'utf8'):build(fs.readFileSync('index.html','utf8'));
if(process.env.LUMENFALL_CYCLE_MUTATION==='frameClock'){
 function edit(a,b){assert.equal(source.split(a).length,2,a);source=source.replace(a,b);}
 edit("if(state.achieved.autotap&&clock&&clock.binary)return canonicalAutomationNext('_autoTapAccum',clock.binary);",'/* intentional original frame-dependent next tap */');
 edit("if(state.achieved.labmaster&&clock&&clock.binary)return canonicalAutomationNext('_autoEmpowerAccum',clock.binary);",'/* intentional original frame-dependent next empower */');
 edit('canonicalAutomationAdvance(binaryClock,binaryClock.project(stepSec));','simulationAdvanceAutomationTimers(stepSec);');
 edit('function nativeProgram(recipe){return [canonicalAutomationMillis(recipe.intervals),null];}','function nativeProgram(recipe){return recipe.intervals.map(function(n){return n*1000;}).concat([null]);}');
}
process.once('uncaughtException',error=>{console.log(JSON.stringify({status:'FAIL',current:'Strict live/offline combat',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),error:error.stack}));process.exitCode=1;});
const original=JSON.parse(fs.readFileSync('docs/qa/endless-progression-001/candidate-ak-mature-snapshot.json.endpoint.json')),start=CLOCK+180*86400000;let checks=0;const records=[];
function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
function compare(a,b,path){
 // This new field is a physical duration in seconds, despite its exact saved
 // string representation. Cross-policy traces use the same1e-9 physical
 // tolerance; separate round-trip checks require its saved bytes exactly.
 if(/^saved\.canonicalAutomationClock\.[^.]+\.elapsed$/.test(path)){checks++;assert(A.valid(a)&&A.valid(b)&&Math.abs(A.ratio(a,1)-A.ratio(b,1))<=1e-9,path);return;}
 if(typeof a==='number'&&typeof b==='number'){checks++;assert(Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=1e-9*Math.max(1,Math.abs(a),Math.abs(b)),path+': '+a+' vs '+b);return;}if(a&&b&&typeof a==='object'&&typeof b==='object'){eq(Object.keys(a),Object.keys(b),path+' keys');for(const k of Object.keys(a))compare(a[k],b[k],path+'.'+k);}else eq(a,b,path);}
for(const developing of process.env.LUMENFALL_CYCLE_LITERAL==='1'?[true]:[false,true]){
 const seed=clone(original);seed.depth=seed.enemyDepth=16;seed.riftMode='push';seed.autoAscendEnabled=true;seed.autoAscendTargetDepth=16;
 if(developing){seed.research.masterwork=10;seed.longStudyLevels.wispascend=0;seed.nodes.chargememory=2;Object.keys(seed.wispMastery).forEach(id=>seed.wispMastery[id]=0);}
 seed.activeStudies=seed.activeStudies.map(row=>row.id==='guardmastery'?{...row,remainingSec:30.25}:row.id==='wispascend'?{...row,remainingSec:100,totalDurationSec:1000}:row);
 if(process.env.LUMENFALL_CYCLE_NO_AUTOMATION==='1'){seed.achieved.autotap=false;seed.achieved.labmaster=false;}
 seed.studyBoosts={};seed.studyBoosts.wispascend={mult:3,startedAtMs:start-28800000+15000,expiresAtMs:start+15000};
 function page(){const x=app(source,undefined,{clockDate:true});x.clock(start);x.q.set(clone(seed));x.q.restoreEnemy();return x;}
 const a=page(),b=page(),seconds=developing?10:60,frame=developing?.1:.5,t=performance.now(),whole=a.q.advance(seconds,{kind:'offline',clockStartMs:start,disableCycleBatching:process.env.LUMENFALL_CYCLE_LITERAL==='1'});
 for(let i=0;i<Math.round(seconds/frame);i++){b.clock(start+i*frame*1000);b.q.advance(frame,{kind:'live',clockStartMs:start+i*frame*1000,disableCycleBatching:process.env.LUMENFALL_CYCLE_LITERAL==='1'});if(process.env.LUMENFALL_CYCLE_COLD_FRAMES==='1'){b.clock(start+(i+1)*frame*1000);assert(b.q.save(),'each frame save commits');b.q.load();}}
 if(process.env.LUMENFALL_CYCLE_COLD_FRAMES==='1'){a.clock(start+seconds*1000);assert(a.q.save());a.q.load();}
 const left=a.q.get(),right=b.q.get();
 fs.writeFileSync('validation-evidence/endless-cycle-split-'+(developing?'developing':'mature')+'-diagnostic.json',JSON.stringify({left,right,whole}));
 for(const key of ['lumen','shards','prisms','motes','sigils','ascendCount','totalKills','totalTaps','dailyStats'])eq(left[key],right[key],'split exact saved '+key);
 compare(left,right,'saved');eq(left.studyBoosts,right.studyBoosts,'explicit timed package has identical lifecycle');
 if(!developing){eq(left.longStudyLevels.guardmastery,seed.longStudyLevels.guardmastery+1,'Lab completes exactly once inside both timelines');eq(left.activeStudies.find(x=>x.id==='wispascend').remainingSec,10,'15s paid3x then45s base work');}
 records.push({developing,seconds,frame,wallMs:performance.now()-t,wholeIterations:whole.iterations,ascends:whole.ascends});
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),automationEnabled:process.env.LUMENFALL_CYCLE_NO_AUTOMATION!=='1',literal:process.env.LUMENFALL_CYCLE_LITERAL==='1',coldFrames:process.env.LUMENFALL_CYCLE_COLD_FRAMES==='1',records,limits:'Focused live/split parity and paid expiry. Broader campaigns, mature8h throughput and Android/device acceptance remain separate.'}));
