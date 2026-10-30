'use strict';
// Execute the complete production IIFE, purchases and persistence owners.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone,P,R,CLOCK}=require('./comet-expansion-harness.cjs');
const SUBJECTS=['wispascend','guardmastery','shardstudy','lumenstudy','motestudy','measuredinquiry'];
function qualify(s){
  s.ascendCount=25;s.maxDepthEver=150;
  SUBJECTS.forEach((id,i)=>s.longStudyLevels[id]=i<2?9:8);
  return s;
}
function run(source){
  let checks=0;const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);},ok=(v,m)=>{checks++;assert(v,m);};
  function world(){
    const e=app(source),q=e.q,s=qualify(q.fresh());
    s.comets=100;s.lastSeen=CLOCK;s.questDay=q.day();q.set(s);return {e,q};
  }
  function snapshot(e){return {state:clone(e.q.get()),slots:Array.from(e.storage),writes:e.writes.length};}
  for(const [key,change]of [
    ['ascends',s=>s.ascendCount=24],['rift',s=>s.maxDepthEver=149],
    ['lab',s=>s.longStudyLevels.guardmastery=8],
    ['subjects',s=>{s.longStudyLevels.wispascend+=8;s.longStudyLevels.measuredinquiry=0;}]
  ]){
    const {e,q}=world();change(q.get());q.get().comets=1e9;q.save();
    const before=snapshot(e),plan=q.buyPlan('autoascend');
    eq(plan.reason,'locked','independently missing '+key+' locks rich wallet');
    eq(plan.requirements.filter(r=>!r.met).map(r=>r.key),[key],'only missing condition '+key);
    eq(q.buy({id:'autoascend',cost:0,requirements:[]}),false,'forged quote cannot bypass '+key);
    eq(snapshot(e),before,'locked handler preserves complete state and both saves '+key);
  }
  {
    const {e,q}=world(),before=clone(q.get()),plan=q.buyPlan('autoascend');
    eq(plan.requirements.map(r=>[r.key,r.current,r.target,r.met]),[
      ['ascends',25,25,true],['rift',150,150,true],['lab',50,50,true],['subjects',6,6,true]
    ],'literal approved boundary and visible progress');
    eq(plan.available,true,'all goals and exact wallet unlock');eq(q.get(),before,'quote is pure');
    ok(q.buy('autoascend'),'actual purchase at all exact boundaries');
    eq(q.get().comets,0,'exact100Comet debit');eq(q.get().owned.autoascend,true,'permanent entitlement');
    eq([q.get().autoAscendEnabled,q.get().autoAscendTargetDepth],[true,150],'existing ON/default target');
    eq(q.get().longStudyLevels,before.longStudyLevels,'purchase preserves earned research');
    const paid=snapshot(e);eq(q.buy('autoascend'),false,'duplicate refused');eq(snapshot(e),paid,'duplicate inert');
    const endpoint=clone(q.get());q.load();eq(q.get(),endpoint,'both-slot cold load retains purchase');
    eq(q.accept(q.decode(q.export())),endpoint,'backup retains purchased state');
  }
  {
    const {q}=world();q.get().comets=99;eq(q.buyPlan('autoascend').reason,'funds','oneCometshort');
    const before=clone(q.get());eq(q.buy('autoascend'),false,'short purchase refused');eq(q.get(),before,'short purchase inert');
    q.get().comets=100;ok(q.buyPlan('autoascend').available,'currency refresh unlocks');
  }
  {
    const {q}=world(),s=q.get();s.longStudyLevels={wispascend:45,guardmastery:1,shardstudy:1,lumenstudy:1,motestudy:1};
    s.activeStudies=[{id:'measuredinquiry',slot:0,remainingSec:1,totalDurationSec:1,speedMult:1}];
    s.pausedStudies=[{id:'bossledger',remainingSec:1,totalDurationSec:1,speedMult:1}];
    s.longStudyLevels.formationstudy=s.longStudyLevels.riftattune=s.longStudyLevels.prismstudy=10000;
    eq(q.buyPlan('autoascend').requirements.filter(r=>!r.met).map(r=>r.key),['lab','subjects'],'paid unfinished and retired work excluded');
    s.longStudyLevels.measuredinquiry=1;
    eq(q.buyPlan('autoascend').available,true,'sixth completed current subject unlocks exact50levels');
    s.longStudyLevels.wispascend=5000;
    eq(q.buyPlan('autoascend').requirements.find(r=>r.key==='lab').current,50,'saved overcap levels count with bounded display');
  }
  {
    const {q}=world();q.get().ascendCount=24;q.get().depth=q.get().enemyDepth=16;
    eq(q.buyPlan('autoascend').reason,'locked','24completedAscensions locked');
    q.ascend(false);eq(q.get().ascendCount,25,'actual manual25thAscension');
    eq(q.buyPlan('autoascend').available,true,'manualAscension unlocks without another run');
  }
  {
    const {q}=world();q.get().maxDepthEver=q.get().depth=q.get().enemyDepth=149;
    eq(q.buyPlan('autoascend').reason,'locked','149highestRift locked');
    q.kill('live');eq(q.get().maxDepthEver,150,'actual defeat reaches Rift150');
    eq(q.buyPlan('autoascend').available,true,'reachedRift unlocks');
  }
  for(const version of [0,1,2,3,4,5,6]){
    const {e,q}=world(),s=q.fresh();s.schemaVersion=version;if(!version)delete s.schemaVersion;
    s.owned.autoascend=true;s.autoAscendEnabled=true;s.autoAscendTargetDepth=16;s.lastSeen=CLOCK;
    q.set(s);eq(q.buyPlan('autoascend').unlocked,true,'saved owner keeps unlock schema'+version);
    ok(q.save(),'save low-progress owner');const paid=clone(q.get());q.load();eq(q.get(),paid,'normal load retains owner schema'+version);
    e.storage.set(P,'corrupt');q.load();eq(q.get().owned.autoascend,true,'recovery load retains owner schema'+version);
    eq([q.get().autoAscendEnabled,q.get().autoAscendTargetDepth],[true,16],'recovery retains automation settings');
    eq(q.accept(q.decode(q.export())).owned.autoascend,true,'backup retains old entitlement');
    q.get().depth=q.get().enemyDepth=16;q.get().riftMode='push';
    eq(q.autoReady(),true,'old owner below new goals remains ready');
    ok(q.checkAuto(),'old owner automatically ascends');eq(q.get().owned.autoascend,true,'old owner kept after Ascend');
  }
  for(const failure of ['primary','both']){
    const {e,q}=world();q.save();const before=snapshot(e);e.fail(true,failure==='both');
    eq(q.buy('autoascend'),false,'storage failure refuses purchase '+failure);
    eq(q.get(),before.state,'failed purchase restores whole state '+failure);
    eq(Array.from(e.storage),before.slots,'failed purchase restores both slots '+failure);
    e.fail(false,false);ok(q.buy('autoascend'),'retry purchase succeeds once '+failure);eq(q.get().comets,0,'retry exact debit '+failure);
  }
  {
    const {e,q}=world();q.save();const recovery=e.storage.get(R);e.fail(false,true);
    ok(q.buy('autoascend'),'primary commit survives recovery-only failure');
    eq(JSON.parse(e.storage.get(P)),q.get(),'primary contains committed purchase');
    eq(e.storage.get(R),recovery,'failed recovery preserves previous recovery');
    e.fail(false,false);q.load();eq(q.get().owned.autoascend,true,'primary reload retains purchase after recovery failure');
  }
  return checks;
}
function verify(source,negative=false){
  const result={status:'pass',checks:run(source),sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),controls:[]};
  if(negative)for(const [name,from,to]of [
    ['Ascension threshold',"label:'Ascensions',current:s.ascendCount,target:25","label:'Ascensions',current:s.ascendCount,target:24"],
    ['Rift threshold',"label:'Highest Rift',current:s.maxDepthEver,target:150","label:'Highest Rift',current:s.maxDepthEver,target:149"],
    ['Lab threshold',"label:'Completed Lab levels',current:levels,target:50","label:'Completed Lab levels',current:levels,target:49"],
    ['subject threshold',"label:'Different Lab subjects',current:subjects,target:6","label:'Different Lab subjects',current:subjects,target:5"],
    ['purchase gate',"if(id==='autoascend')unlocked=level>0||requirements.every(function(row){return row.met;});","if(id==='autoascend')unlocked=true;"],
    ['existing owners',"unlocked=level>0||requirements.every(function(row){return row.met;});","unlocked=requirements.every(function(row){return row.met;});"],
    ['retired subjects','if(node.retiredTo)return;','if(false)return;']
  ]){
    assert.equal(source.split(from).length,2,'unique mutation '+name);let error;
    try{run(source.replace(from,to));}catch(e){error=e;}
    assert(error instanceof assert.AssertionError,'causal mutation detected '+name);
    result.controls.push({name,caught:error.message.split('\n')[0]});
  }
  return result;
}
module.exports={qualify,run,verify};
if(require.main===module)console.log(JSON.stringify(verify(fs.readFileSync(process.argv[2]||'index.html','utf8'),process.argv.includes('--negative'))));
