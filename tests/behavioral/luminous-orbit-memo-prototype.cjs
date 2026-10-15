'use strict';
// Experimental pure-result memo. The original certified arithmetic stays
// untouched on every miss; each hit returns a fresh value/count vector.
const assert=require('node:assert/strict'),original=require('../../scripts/lib/luminous-orbit.cjs');
let source=original.toString();
function edit(a,b){assert.equal(source.split(a).length,2,a);source=source.replace(a,b);}
edit('  var QUANTUM=Math.pow(2,-51);',`  var QUANTUM=Math.pow(2,-51);
  var root=createLuminousOrbit.memo||(createLuminousOrbit.memo={blocks:new Map(),hits:0,misses:0});
  function numericKey(value){return value===0&&1/value===-Infinity?'-0':String(value);}
  function copyBlock(b){return {start:b.start,startFlag:b.startFlag,phase:b.phase,flag:b.flag,delta:b.delta,low:b.low,high:b.high,counts:b.counts.slice()};}`);
edit('    function block(cycles){','    var prefix=numericKey(ceiling)+\'/\'+chances.map(function(c){return c===null?\'null\':numericKey(c);}).join(\',\')+\'/\';\n    function block(cycles){\n      var key=prefix+cycles+\'/\'+numericKey(phase)+\'/\'+(flag?1:0),cached=root.blocks.get(key);\n      if(cached){root.hits++;phase=cached.phase;flag=cached.flag;return copyBlock(cached);}\n      root.misses++;');
edit('      return {start:start,startFlag:startFlag,phase:phase,flag:flag,delta:phase-start,low:low,high:high,counts:values};',`      var result={start:start,startFlag:startFlag,phase:phase,flag:flag,delta:phase-start,low:low,high:high,counts:values};
      root.blocks.set(key,copyBlock(result));if(root.blocks.size>1024)root.blocks.delete(root.blocks.keys().next().value);
      return result;`);
module.exports=new Function('return ('+source+');')();
