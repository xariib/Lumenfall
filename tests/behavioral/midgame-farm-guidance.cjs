'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {app}=require('./forge-expansion-harness.cjs');

const source=fs.readFileSync(process.argv[2]||'index.html','utf8');
const marker="if(document.readyState==='loading'){";
const injected='window.endlessQa={objective:nextRiftObjective,option:midgameFarmPowerOption};';
function open(src){
  assert.equal(src.split(marker).length,2,'unique production startup marker');
  return app(src.replace(marker,injected+marker),undefined,{clockDate:true});
}
const x=open(source),q=x.q;
let checks=0;
function equal(actual,expected,label){checks++;assert.deepEqual(actual,expected,label);}
function okay(value,label){checks++;assert(value,label);}
function setup(){
  const state=q.fresh();
  state.ascendCount=1;state.maxDepthEver=30;state.depth=26;state.enemyDepth=26;
  state.riftMode='farm';state.farmDepth=20;state.farmReturnDepth=26;
  state.lumen=800;state.shards=80;
  q.set(state);return state;
}

const early=q.fresh();early.riftMode='farm';early.farmDepth=1;early.farmReturnDepth=2;
q.set(early);equal(q.endless.objective().kind,'FARM','unascended Farm retains original milestone guidance');
let state=setup(),goal=q.endless.objective(),lab=q.projects().find(node=>node.id==='wispascend');
okay(lab&&!lab.retiredTo,'suggested Lab project is active');
okay(q.node('formation').retiredTo,'old Forge Formation Training is retired');
equal(goal.kind,'POWER OPTION','a developing Farm state has a named power option');
equal(goal.title,'Power option: Wisp Ascendancy 1','title identifies exact next level without an optimality claim');
equal(goal.detail,'+15% passive Wisp damage after study · 800 Lumen + 80 Shards','exactly funded quote and completed effect');
equal(goal.tab,'research','the actual destination is Lab');
okay(goal.selector.includes('[data-study-card="wispascend"]'),'destination resolves the active Lab card');
okay(!goal.unfunded,'exactly funded quote is available');

const before=JSON.stringify(q.get()),storage=JSON.stringify([...x.storage]);
for(let i=0;i<50;i++)q.endless.objective();
equal(JSON.stringify(q.get()),before,'reading guidance does not change the accepted game state');
equal(JSON.stringify([...x.storage]),storage,'reading guidance does not touch either saved slot');

state.lumen=799;state.shards=79;q.set(state);goal=q.endless.objective();
equal(goal.detail,'Missing 1 Lumen + 1 Shards for Lab','both exact resource shortfalls');
equal(goal.unfunded,true,'shortfalls marked for red text');
state.lumen=800;q.set(state);equal(q.endless.objective().detail,'Missing 1 Shards for Lab','funded Lumen is not falsely missing');
state.shards=80;q.set(state);equal(q.endless.objective().progress,100,'resource refresh makes the existing plan available');

state.activeStudies=[{id:'wispascend',remainingSec:100,totalDurationSec:100,speedMult:1}];q.set(state);
goal=q.endless.objective();equal(goal.title,'Wisp Ascendancy in progress','paid running work is not offered twice');
okay(!goal.detail.includes('800 Lumen'),'running work is not given a second purchase quote');
state.activeStudies=['guardmastery','shardstudy'].map(id=>({id,remainingSec:100,totalDurationSec:100,speedMult:1}));q.set(state);
goal=q.endless.objective();equal(goal.detail,'All '+q.slots()+' Lab slots occupied','occupied slot prerequisite shown');

state.activeStudies=[];state.riftMode='push';q.set(state);
okay(q.endless.objective().kind!=='POWER OPTION','Push objectives stay authoritative');
state.riftMode='farm';state.ascendCount=0;q.set(state);
equal(q.endless.objective().kind,'FARM','first run keeps existing Farm text');

okay(source.includes('#rift-guidance-slot .objective-copy small.objective-shortfall{color:#ff9fae;}'),'unfunded guidance is visibly red');
okay(source.includes("(goal.unfunded?' class=\"objective-shortfall\"':'')"),'renderer uses the shortfall marker');

// Exact inverse: the old generic Farm branch must fail the new funded contract.
if(process.argv.includes('--negative')){
  const changed=source.replace('    if(powerOption)return powerOption;','    if(false)return powerOption;');
  okay(changed!==source,'causal mutation matched only this feature');
  const bad=open(changed).q;
  const fixture=setup();bad.set(fixture);
  let rejected=false;
  try{assert.equal(bad.endless.objective().kind,'POWER OPTION');}
  catch(error){rejected=error.code==='ERR_ASSERTION'&&bad.endless.objective().kind==='FARM';}
  okay(rejected,'old generic Farm objective is rejected by the same funded contract');
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex')}));
