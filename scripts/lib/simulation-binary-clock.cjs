'use strict';
// Internal exact event clock for the extreme Push path. Units are 2^e/125
// seconds: both native seconds and native saved milliseconds are dyadic in
// this lattice. It needs no BigInt and never rounds a positive remainder into
// a large epoch timestamp. The normal scheduler is not changed by this module.
module.exports=function(A,startMs,budgetSec,options){
  var powers2={0:1},powers5={0:1},nativeParts=Object.create(null),nativeKeys=[];
  function product(a,b){a=typeof a==='number'?A.exactAdd(a,0):a;b=typeof b==='number'?A.exactAdd(b,0):b;return A.mul(a,typeof b==='number'?String(b)+'e0':b);}
  function power(base,n,cache){if(!Number.isInteger(n)||n<0)throw new RangeError('Invalid clock exponent');if(cache[n]!==undefined)return cache[n];var value=1,factor=base,left=n;while(left){if(left%2)value=product(value,factor);left=Math.floor(left/2);if(left)factor=product(factor,factor);}cache[n]=value;return value;}
  function pow2(n){return power(2,n,powers2);}
  function dyad(n){
    if(!Number.isFinite(n)||n<0)throw new RangeError('Invalid native clock value');if(n===0)return {n:0,e:0};
    var key=String(n);if(nativeParts[key])return nativeParts[key];
    var v=new DataView(new ArrayBuffer(8));v.setFloat64(0,n);var hi=v.getUint32(0),raw=(hi>>>20)&2047;
    var coefficient=(hi&1048575)*4294967296+v.getUint32(4)+(raw?4503599627370496:0),exponent=raw?raw-1075:-1074;
    while(coefficient%2===0){coefficient/=2;exponent++;}var result={n:coefficient,e:exponent};nativeParts[key]=result;nativeKeys.push(key);if(nativeKeys.length>256)delete nativeParts[nativeKeys.shift()];return result;
  }
  function seconds(n){
    if(typeof n==='number'){var d=dyad(n);return {n:product(d.n,125),e:d.e};}
    if(!A.wide(n)||!A.valid(n)||A.lt(n,0))throw new RangeError('Invalid exact clock interval');
    var parts=n.split('e'),coefficient=parts[0]+'e0',exponent=Number(parts[1]);
    if(A.cmp(coefficient,0)===0)return {n:0,e:0};
    if(exponent>=-3)return {n:product(coefficient,power(5,exponent+3,powers5)),e:exponent};
    var divided=A.divmod(coefficient,power(5,-exponent-3,powers5));
    if(A.cmp(divided.r,0)!==0)throw new RangeError('Interval does not lie on the binary clock lattice');
    return {n:divided.q,e:exponent};
  }
  function millis(n){var d=dyad(n);return {n:d.n,e:d.e-3};}
  function budget(value,settings){return settings&&settings.budgetMs!==undefined?millis(settings.budgetMs):seconds(value);}
  function duration(value){return value&&value.scale===125?{n:value.ticks,e:value.unit}:seconds(value);}
  function scaled(d,unit){return A.cmp(d.n,0)===0?0:product(d.n,pow2(d.e-unit));}
  function exactSeconds(d){
    if(A.cmp(d.n,0)===0)return 0;
    var k=Math.max(0,-d.e),coefficient=product(d.n,8),exponent=-3-k;
    coefficient=product(coefficient,d.e>=0?pow2(d.e):power(5,k,powers5));
    var text=typeof coefficient==='number'?String(coefficient)+'e0':coefficient,parts=text.split('e');return parts[0]+'e'+(Number(parts[1])+exponent);
  }
  function nativeDyad(d){
    if(A.cmp(d.n,0)===0)return 0;
    var bits=Math.floor(A.log10(d.n)/(Math.LN2/Math.LN10))+1,lower=pow2(Math.max(0,bits-1));
    while(A.lt(d.n,lower)){bits--;lower=pow2(bits-1);}
    while(A.ge(d.n,product(lower,2))){bits++;lower=product(lower,2);}
    var shift=Math.max(0,bits-53,-1074-d.e),scale=pow2(shift),parts=A.divmod(d.n,scale),q=Number(parts.q),half=shift?pow2(shift-1):0;
    if(shift&&(A.gt(parts.r,half)||(A.cmp(parts.r,half)===0&&q%2)))q++;
    return q*Math.pow(2,d.e+shift);
  }
  function create(originD,budgetD){
    var unit=Math.min(originD.n?originD.e:0,budgetD.n?budgetD.e:0),origin=scaled(originD,unit),target=scaled(budgetD,unit),elapsed=0;
    var nowCache,remainingCache,elapsedCache,untilCache=Object.create(null);
    function absolute(){return {n:A.exactAdd(origin,elapsed),e:unit};}
    function difference(deadline,early){var current=absolute(),common=Math.min(current.e,deadline.e,early?early.e:current.e);return {n:A.exactSub(A.exactSub(scaled(deadline,common),scaled(current,common)),early?scaled(early,common):0),e:common};}
    function add(d){
      if(!A.integer(d.n)||A.lt(d.n,0)||!Number.isInteger(d.e))throw new RangeError('Invalid binary duration');
      var common=Math.min(unit,d.e),scale=pow2(unit-common),nextOrigin=product(origin,scale),nextTarget=product(target,scale),nextElapsed=A.exactAdd(product(elapsed,scale),scaled(d,common));
      if(A.gt(nextElapsed,nextTarget))throw new RangeError('Clock step exceeds its window');
      unit=common;origin=nextOrigin;target=nextTarget;elapsed=nextElapsed;
      nowCache=remainingCache=elapsedCache=undefined;untilCache=Object.create(null);
    }
    return {
      advance:function(value){add(seconds(value));},
      advanceTicks:function(ticks,exponent){add({n:product(ticks,125),e:exponent});},
      advanceToMs:function(deadline){var d=difference(millis(deadline));add(d);},
      until:function(deadline,early){var key=String(deadline)+'/'+(early&&early.scale===125?String(early.ticks)+'/'+early.unit:String(early||0));if(untilCache[key]===undefined)untilCache[key]=exactSeconds(difference(millis(deadline),early?duration(early):null));return untilCache[key];},
      latticeRemaining:function(){return {ticks:A.exactSub(target,elapsed),unit:unit,scale:125};},
      latticeUntil:function(deadline,early){var d=difference(millis(deadline),early?duration(early):null);return {ticks:d.n,unit:d.e,scale:125};},
      latticeDuration:function(value){var d=seconds(value);return {ticks:d.n,unit:d.e,scale:125};},
      advanceLattice:function(duration){if(duration.scale!==125)throw new RangeError('Invalid clock lattice');add({n:duration.ticks,e:duration.unit});},
      absoluteSnapshot:function(){return absolute();},
      latticeAfter:function(point,delay){var d=duration(delay),common=Math.min(point.e,d.e),targetPoint={n:A.exactAdd(scaled(point,common),scaled(d,common)),e:common},left=difference(targetPoint);return {ticks:left.n,unit:left.e,scale:125};},
      compareDuration:function(a,b){var common=Math.min(a.unit,b.unit);return A.cmp(scaled({n:a.ticks,e:a.unit},common),scaled({n:b.ticks,e:b.unit},common));},
      since:function(point){var current=absolute(),common=Math.min(current.e,point.e);return exactSeconds({n:A.exactSub(scaled(current,common),scaled(point,common)),e:common});},
      remaining:function(){if(remainingCache===undefined)remainingCache=exactSeconds({n:A.exactSub(target,elapsed),e:unit});return remainingCache;},
      elapsed:function(){if(elapsedCache===undefined)elapsedCache=exactSeconds({n:elapsed,e:unit});return elapsedCache;},
      nowMs:function(){if(nowCache===undefined){var d=absolute();nowCache=nativeDyad({n:product(d.n,8),e:d.e});}return nowCache;},
      nextWindow:function(value,settings){return create(absolute(),budget(value,settings));},
      project:function(value){var clock=create(absolute(),seconds(value));clock.advance(value);return clock;},
      snapshot:function(){return {origin:origin,elapsed:elapsed,target:target,unit:unit};}
    };
  }
  return create(millis(startMs),budget(budgetSec,options));
};
