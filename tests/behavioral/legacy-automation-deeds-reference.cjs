'use strict';
// Explicit historical counterfactual for frozen, unrelated gameplay oracles.
// Current unlock eligibility is independently tested by lab-offline-deed-pacing.
var assert=require('assert');
module.exports=function legacyAutomationDeeds(html){
  [
    ["check:function(s){return automationDeedReady('autotap',s);}","check:function(s){return s.ascendCount>=12;}"],
    ["check:function(s){return automationDeedReady('labmaster',s);}","check:function(s){return legacyResearchLevels(s)>=20;}"]
  ].forEach(function(rule){
    assert.strictEqual(html.split(rule[0]).length,2,'one explicit historical Deed policy anchor');
    html=html.replace(rule[0],rule[1]);
  });
  // The frozen PR15 state hashes include the former long-tail Comet rewards.
  // Restore only that policy in this explicitly historical counterfactual;
  // actual-current payout, live/offline and migration suites retain new rewards.
  if(html.indexOf('var DEED_TRACK_REWARD_FLOORS=')!==-1){
    var rewardAnchor='var DEED_TRACK_REWARD_FLOORS={rift:100,ascend:50,forge:40,rest:15};';
    assert.strictEqual(html.split(rewardAnchor).length,2,'one explicit historical Deed reward anchor');
    html=html.replace(rewardAnchor,'var DEED_TRACK_REWARD_FLOORS={rift:5,ascend:5,forge:5,rest:5};');
  }
  //20 November adds roster/development rewards and unbounded Strike/Rift
  // continuations. This helper is explicitly the pre-feature counterfactual;
  // current grants, migration and parity are covered by wisp-gameplay-pacing.
  for(const key of ['roster','abilities','rarities','ultimates']){
    const expression=new RegExp("^addDeedTrack\\('"+key+"'.*$",'m');
    assert(expression.test(html),'one new-track historical exclusion '+key);html=html.replace(expression,'');
  }
  const continuing='function ensureContinuingDeeds(snapshot,readReceipts){';
  assert.strictEqual(html.split(continuing).length,2,'one continuing catalog policy');
  html=html.replace(continuing,continuing+'\n  return; // Explicit historical reward policy only.');
  return html;
};
