'use strict';
// Fixed combat recipes against an exact 2^unit/125-second event budget.
// Returned durations stay on that lattice; no native epoch/remainder rounding.
module.exports=function(A,intervals,budget){
  if(!intervals.length||!budget||budget.scale!==125||!A.integer(budget.ticks)||A.lt(budget.ticks,0)||!Number.isInteger(budget.unit))throw new RangeError('Invalid lattice cycle budget');
  function product(a,b){a=typeof a==='number'?A.exactAdd(a,0):a;b=typeof b==='number'?A.exactAdd(b,0):b;return A.mul(a,typeof b==='number'?String(b)+'e0':b);}
  function pow2(n){if(n<0)throw new RangeError('Negative clock shift');var out=1,base=2;while(n){if(n%2)out=product(out,base);n=Math.floor(n/2);if(n)base=product(base,base);}return out;}
  function dyad(n){if(!Number.isFinite(n)||n<0)throw new RangeError('Invalid native combat interval');if(!n)return {n:0,e:0};var v=new DataView(new ArrayBuffer(8));v.setFloat64(0,n);var hi=v.getUint32(0),raw=(hi>>>20)&2047;return {n:product((hi&1048575)*4294967296+v.getUint32(4)+(raw?4503599627370496:0),125),e:raw?raw-1075:-1074};}
  var values=intervals.map(function(row){if(!row.length)throw new RangeError('Empty combat cycle');return row.map(dyad);}),unit=budget.unit;
  values.forEach(function(row){row.forEach(function(d){if(A.gt(d.n,0))unit=Math.min(unit,d.e);});});
  function scaled(n,e){return A.cmp(n,0)===0?0:product(n,pow2(e-unit));}
  var durations=values.map(function(row){return row.reduce(function(sum,d){return A.exactAdd(sum,scaled(d.n,d.e));},0);});
  if(durations.some(function(d){return A.le(d,0);}))throw new RangeError('Zero combat cycle');
  var total=scaled(budget.ticks,budget.unit),period=durations.reduce(function(a,b){return A.exactAdd(a,b);},0),parts=A.divmod(total,period),cycles=product(parts.q,durations.length),left=parts.r;
  for(var i=0;i<durations.length&&A.ge(left,durations[i]);i++){left=A.exactSub(left,durations[i]);cycles=A.exactAdd(cycles,1);}
  function durationFor(count){if(!A.integer(count)||A.lt(count,0)||A.gt(count,cycles))throw new RangeError('Invalid prefix count');var split=A.divmod(count,durations.length),ticks=product(split.q,period);for(var j=0;j<Number(split.r);j++)ticks=A.exactAdd(ticks,durations[j]);return {ticks:ticks,unit:unit,scale:125};}
  return {cycles:cycles,elapsed:durationFor(cycles),remaining:{ticks:left,unit:unit,scale:125},durationFor:durationFor};
};
