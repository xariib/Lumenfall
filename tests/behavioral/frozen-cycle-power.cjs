'use strict';
// The immutable dyadic clock transcript describes the old 1.25^rank input.
// Pin ONLY that numeric input for clock/batching/transaction oracles; do not
// regenerate their expected results from the new bulk implementation. Current
// balance, real campaigns, frame parity and wide-Power Farm policy are tested
// separately against unmodified production source.
const assert=require('node:assert/strict');
module.exports=function(source){
  const before="return Amount.add(1,Amount.mul(ENDLESS_PROGRESSION.masterworkPowerPerLevel,level===undefined?researchLevel('masterwork'):level));";
  assert.equal(source.split(before).length,2,'one explicit historical clock-Power adapter');
  return source.replace(before,"return Amount.pow(1.25,level===undefined?researchLevel('masterwork'):level);");
};
