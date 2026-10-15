'use strict';
const fs=require('fs'),assert=require('assert/strict'),{app,CLOCK}=require('../../../../tests/behavioral/forge-expansion-harness.cjs');
let html=fs.readFileSync('index.html','utf8');
function edit(a,b){assert.equal(html.split(a).length,2,a);html=html.replace(a,b);}
edit('var studyClockMemo={state:null,endMs:null,anchors:{}};','var cycleProbeEnabled=false,cycleProbeTime=0,cycleProbeRows=[];\nvar studyClockMemo={state:null,endMs:null,anchors:{}};');
edit('    if(Amount.gt(next,0)){','    if(Amount.gt(next,0)){if(cycleProbeEnabled)cycleProbeTime+=next;');
edit('  state = normalizeCurrentSave(state,true);\n  simulationRecordAchievements(summary);\n  return true;',`  state = normalizeCurrentSave(state,true);
  simulationRecordAchievements(summary);
  if(cycleProbeEnabled){cycleProbeRows.push({time:cycleProbeTime,phase:state.luminousAccum,flag:state.enemyIsLuminous,lumen:state.lumen,shards:state.shards,prisms:state.prisms,motes:state.motes,hero:JSON.stringify([state.spirits,state.activeParty,state.heroResource,state.formationRebuild,state.buffMult,state.buffUntil,state.supportBuffs,state.supportRecastUntil]),resource:state.heroResource,autoTap:state._autoTapAccum,autoEmpower:state._autoEmpowerAccum,kills:summary.kills});cycleProbeTime=0;if(cycleProbeRows.length>=200)throw Error('PROBE STOP');}
  return true;`);
edit("if(document.readyState==='loading'){","window.endlessQa={enable:function(){cycleProbeEnabled=true;},rows:function(){return cycleProbeRows;}};if(document.readyState==='loading'){");
const {q}=app(html),s=JSON.parse(fs.readFileSync('docs/qa/endless-progression-001/candidate-ak-mature-snapshot.json.endpoint.json'));
s.depth=s.enemyDepth=16;s.riftMode='push';s.autoAscendEnabled=true;s.autoAscendTargetDepth=16;q.set(s);q.restoreEnemy();q.endless.enable();
assert.throws(()=>q.advance(.001,{kind:'offline',clockStartMs:CLOCK}),/PROBE STOP/);
const rows=q.endless.rows(),seen=new Map(),repeats=[];
rows.forEach((r,i)=>{if(seen.has(r.hero))repeats.push({before:seen.get(r.hero),after:i,period:i-seen.get(r.hero),time:r.time});else seen.set(r.hero,i);});
fs.writeFileSync('validation-evidence/ascend-cycle-probe.json',JSON.stringify({rows,repeats},null,2));console.log(JSON.stringify({rows:rows.length,uniqueHeroes:seen.size,repeats:repeats.slice(0,8),first:rows[0],last:rows.at(-1)},null,2));
