'use strict';
// Exact dyadic scheduling for a fixed recurring native-Number combat recipe.
// Returns the sub-cycle remainder separately: rounding it into an epoch/grid
// countdown would lose material damage before the next real timer event.
module.exports=function(A,intervals,budget){
  function product(a,b){a=typeof a==='number'?A.exactAdd(a,0):a;b=typeof b==='number'?A.exactAdd(b,0):b;return A.mul(a,typeof b==='number'?String(b)+'e0':b);}
  function pow2(n){var value=1,base=2;while(n){if(n%2)value=product(value,base);n=Math.floor(n/2);if(n)base=product(base,base);}return value;}
  function dyad(n){
    if(!Number.isFinite(n)||n<0)throw new RangeError('Invalid cycle interval');if(n===0)return {n:0,e:0};
    var v=new DataView(new ArrayBuffer(8));v.setFloat64(0,n);var hi=v.getUint32(0),raw=(hi>>>20)&2047;
    return {n:(hi&1048575)*4294967296+v.getUint32(4)+(raw?4503599627370496:0),e:raw?raw-1075:-1074};
  }
  if(!intervals.length||!Number.isFinite(budget)||budget<0)throw new RangeError('Invalid cycle clock');
  var values=intervals.map(function(row){if(!row.length)throw new RangeError('Empty combat cycle');return row.map(dyad);}),limit=dyad(budget),unit=limit.n?limit.e:0;
  values.forEach(function(row){row.forEach(function(d){if(d.n)unit=Math.min(unit,d.e);});});
  function ticks(d){return d.n?product(d.n,pow2(d.e-unit)):0;}
  var durations=values.map(function(row){return row.reduce(function(sum,d){return A.exactAdd(sum,ticks(d));},0);});
  if(durations.some(function(d){return A.le(d,0);}))throw new RangeError('Zero combat cycle');
  var period=durations.reduce(function(sum,n){return A.exactAdd(sum,n);},0),total=ticks(limit),parts=A.divmod(total,period),cycles=product(parts.q,durations.length),left=parts.r;
  for(var i=0;i<durations.length&&A.ge(left,durations[i]);i++){left=A.exactSub(left,durations[i]);cycles=A.exactAdd(cycles,1);}
  function nativeDyad(integer){
    var sign=A.lt(integer,0)?-1:1,abs=A.abs(integer);if(A.cmp(abs,0)===0)return {value:0,ticks:0};
    var hex=A.toHex(abs),first=parseInt(hex.charAt(0),16),bits=(hex.length-1)*4+1;
    while(first>=2){first=Math.floor(first/2);bits++;}
    var shift=Math.max(0,bits-53),scale=pow2(shift),split=A.divmod(abs,scale),q=Number(split.q),half=shift?pow2(shift-1):0;
    if(shift&&(A.gt(split.r,half)||(A.cmp(split.r,half)===0&&q%2)))q++;
    return {value:sign*q*Math.pow(2,unit+shift),ticks:product(sign*q,scale)};
  }
  var high=nativeDyad(left),low=nativeDyad(A.exactSub(left,high.ticks));
  return {cycles:cycles,unitExponent:unit,elapsedTicks:A.exactSub(total,left),remainingTicks:left,budgetTicks:total,cycleTicks:durations,periodTicks:period,
    remainingSec:high.value,remainingLowSec:low.value,remainingExact:A.cmp(A.exactAdd(high.ticks,low.ticks),left)===0};
};
