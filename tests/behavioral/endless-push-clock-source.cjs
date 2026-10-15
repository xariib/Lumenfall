'use strict';
// Isolated experiment: a frame boundary must not recompute an enemy's already
// scheduled death from rounded residual HP. All native rates/products remain.
const fs=require('node:fs'),assert=require('node:assert/strict');
module.exports=function(source){
 function edit(a,b){assert.equal(source.split(a).length,2,a);source=source.replace(a,b);}
 edit('function simulationPassiveKillSeconds(dps){',`
var pushDeadlineMemo=null;
function pushDeadlineMatches(m,dps){return m&&m.state===state&&m.run===ascendRunToken&&m.depth===state.depth&&Amount.cmp(m.maximum,state.enemyMaxHp)===0&&Amount.cmp(m.lastHp,state.enemyHp)===0&&Amount.cmp(m.dps,dps)===0;}
function simulationPassiveKillSeconds(dps,clock){
 var original=simulationNativePassiveKillSeconds(dps);
 if(!clock||!clock.binary||!Number.isFinite(original)||original<=0)return original;
 var memo=pushDeadlineMemo,left;
 if(pushDeadlineMatches(memo,dps)){
   left=Amount.exactSub(0,clock.binary.since(memo.deadline));
   if(Amount.gt(left,0)){
     var at=clock.binary.absoluteSnapshot();
     if(at.e===memo.start.e&&Amount.cmp(at.n,memo.start.n)===0)return memo.original;
     return left;
   }
 }
 pushDeadlineMemo={state:state,run:ascendRunToken,depth:state.depth,maximum:state.enemyMaxHp,
   hp:state.enemyHp,lastHp:state.enemyHp,dps:dps,original:original,start:clock.binary.absoluteSnapshot(),
   deadline:clock.binary.project(original).absoluteSnapshot()};
 return original;
}
function simulationNativePassiveKillSeconds(dps){`);
 edit('function simulationApplyPushPassive(elapsedSec,dps,policy,summary){',`
function simulationApplyPushPassive(elapsedSec,dps,policy,summary){
 var memo=pushDeadlineMemo;
 if(Amount.gt(elapsedSec,0)&&policy.clock&&policy.clock.binary&&pushDeadlineMatches(memo,dps)){
   var elapsed=policy.clock.binary.sinceNumber(memo.start),net=isBoss(state.depth)?Amount.sub(dps,Amount.mul(state.enemyMaxHp,bossRegenRate(state.depth))):dps;
   state.enemyHp=Amount.min(state.enemyMaxHp,Amount.sub(memo.hp,Amount.mul(net,elapsed)));memo.lastHp=state.enemyHp;
   if(Amount.le(state.enemyHp,SIM_EPS))simulationDefeatEnemy(policy,summary);
   return;
 }`);
 // Initial admission still uses the original native prediction. Once its exact
 // clock exists, every scheduler query shares the same deadline.
 source=source.split('simulationPassiveKillSeconds(dps)').join('simulationPassiveKillSeconds(dps,simulationClockPosition())');
 // The function declaration was already extended and is unaffected above.
 return source;
};
if(require.main===module){assert(process.argv[2]&&process.argv[3]);fs.writeFileSync(process.argv[3],module.exports(fs.readFileSync(process.argv[2],'utf8')));}
