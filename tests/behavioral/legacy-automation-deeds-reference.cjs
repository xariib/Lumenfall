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
  return html;
};
