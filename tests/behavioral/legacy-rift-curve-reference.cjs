'use strict';
const assert = require('node:assert/strict');

module.exports = function withLegacyRiftCurve(source) {
  const curve = /^function endlessCurveDepth\(depth\)\{\n[\s\S]*?^\}/gm;
  assert.equal([...source.matchAll(curve)].length, 1, 'unique Rift curve for the historical reference');
  return source.replace(curve, `function endlessCurveDepth(depth){
    if(depth>1e9)return endlessCurveDepth(1e9)+40*Math.log(depth/1e9);
    if(depth>1000)return endlessCurveDepth(1000)+(depth-1000)*.03;
    return depth<=100?depth:100+40*Math.log1p((depth-100)/40);
  }`);
};
