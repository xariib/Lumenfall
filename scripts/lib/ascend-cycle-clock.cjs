'use strict';
// Exact dyadic scheduling for a fixed recurring native-Number combat recipe.
// Returns the sub-cycle remainder separately: rounding it into an epoch/grid
// countdown would lose material damage before the next real timer event.
module.exports=function(A,intervals,budget){
  function product(a,b){return A.mul(typeof a==='number'?String(a)+'e0':a,typeof b==='number'?String(b)+'e0':b);}
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
  return {cycles:cycles,unitExponent:unit,elapsedTicks:A.exactSub(total,left),remainingTicks:left,budgetTicks:total,cycleTicks:durations,periodTicks:period,
    remainingSec:unit>=0?Number(product(left,pow2(unit))):A.ratio(left,pow2(-unit))};
};
