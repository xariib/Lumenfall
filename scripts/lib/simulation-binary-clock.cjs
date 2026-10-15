'use strict';
// Internal exact event clock for the extreme Push path. Units are 2^e/125
// seconds: both native seconds and native saved milliseconds are dyadic in
// this lattice. It needs no BigInt and never rounds a positive remainder into
// a large epoch timestamp. The normal scheduler is not changed by this module.
module.exports=function(A,startMs,budgetSec,options){
  var powers2={0:1},powers5={0:1},nativeParts=Object.create(null),nativeKeys=[];
  function product(a,b){if(b===1)return A.normalize(a);a=typeof a==='number'?A.exactAdd(a,0):a;b=typeof b==='number'?A.exactAdd(b,0):b;return A.mul(a,typeof b==='number'?String(b)+'e0':b);}
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
  function nativeDyad(d,denominator){
    if(A.cmp(d.n,0)===0)return 0;
    // Convert the integer coefficient to base2^26 limbs. Each decimal chunk
    // multiply/carry stays below2^50, so every operation is exact on V8 6.0.
    // Read the top53 bits plus guard/sticky directly instead of decimal long
    // division by an often hundreds-of-digits power of two on every kill.
    var sign=A.cmp(d.n,0)<0?-1:1,exact=A.exactAdd(A.abs(d.n),0),parts=String(exact).split('e'),text=parts[0]+'0'.repeat(Number(parts[1]||0)),limbs=[0],base=67108864,e=d.e,fraction=0;
    for(var at=0;at<text.length;at+=7){
      var chunk=text.slice(at,at+7),scale=Math.pow(10,chunk.length),carry=Number(chunk);
      for(var k=0;k<limbs.length;k++){var value=limbs[k]*scale+carry;carry=Math.floor(value/base);limbs[k]=value-carry*base;}
      if(carry)limbs.push(carry);
    }
    var bits=(limbs.length-1)*26+32-Math.clz32(limbs[limbs.length-1]);
    if(denominator===125){
      // Generate at least53 quotient bits before the one final rounding. The
      // remainder from this small integer division contributes to sticky.
      var extra=Math.max(0,60-bits);e-=extra;
      while(extra){var step=Math.min(26,extra),factor=Math.pow(2,step),carry=0;for(var l=0;l<limbs.length;l++){var shifted=limbs[l]*factor+carry;carry=Math.floor(shifted/base);limbs[l]=shifted-carry*base;}if(carry)limbs.push(carry);extra-=step;}
      for(var l=limbs.length-1;l>=0;l--){var divided=fraction*base+limbs[l];limbs[l]=Math.floor(divided/125);fraction=divided-limbs[l]*125;}
      while(limbs.length>1&&!limbs[limbs.length-1])limbs.pop();
      bits=(limbs.length-1)*26+32-Math.clz32(limbs[limbs.length-1]);
    }
    var shift=Math.max(0,bits-53,-1074-e),word=Math.floor(shift/26),offset=shift%26,q=0;
    for(var i=limbs.length-1;i>word;i--)q=q*base+limbs[i];
    q=q*Math.pow(2,26-offset)+Math.floor((limbs[word]||0)/Math.pow(2,offset));
    if(shift){
      var guardWord=Math.floor((shift-1)/26),guardOffset=(shift-1)%26,guard=Math.floor((limbs[guardWord]||0)/Math.pow(2,guardOffset))%2,sticky=fraction!==0;
      for(var j=0;j<Math.min(guardWord,limbs.length);j++)if(limbs[j])sticky=true;
      if((limbs[guardWord]||0)%Math.pow(2,guardOffset))sticky=true;
      if(guard&&(sticky||q%2))q++;
    }else if(fraction>=63)q++;
    return sign*q*Math.pow(2,e+shift);
  }
  function create(originD,budgetD){
    var unit=Math.min(originD.n?originD.e:0,budgetD.n?budgetD.e:0),origin=scaled(originD,unit),target=scaled(budgetD,unit),elapsed=0;
    var nowCache,remainingCache,elapsedCache,untilCache=Object.create(null),differenceCache=Object.create(null);
    function absolute(){return {n:A.exactAdd(origin,elapsed),e:unit};}
    function difference(deadline,early){var current=absolute(),common=Math.min(current.e,deadline.e,early?early.e:current.e);return {n:A.exactSub(A.exactSub(scaled(deadline,common),scaled(current,common)),early?scaled(early,common):0),e:common};}
    function deadlineKey(deadline,early){return String(deadline)+'/'+(early&&early.scale===125?String(early.ticks)+'/'+early.unit:String(early||0));}
    function deadlineDifference(deadline,early){var key=deadlineKey(deadline,early);if(!differenceCache[key])differenceCache[key]=difference(millis(deadline),early?duration(early):null);return differenceCache[key];}
    function pointAfter(point,delay){var d=duration(delay),common=Math.min(point.e,d.e);return {n:A.exactAdd(scaled(point,common),scaled(d,common)),e:common};}
    function add(d){
      if(!A.integer(d.n)||A.lt(d.n,0)||!Number.isInteger(d.e))throw new RangeError('Invalid binary duration');
      var common=Math.min(unit,d.e),same=common===unit,scale=pow2(unit-common),nextOrigin=same?origin:product(origin,scale),nextTarget=same?target:product(target,scale),nextElapsed=A.exactAdd(same?elapsed:product(elapsed,scale),scaled(d,common));
      if(A.gt(nextElapsed,nextTarget))throw new RangeError('Clock step exceeds its window');
      unit=common;origin=nextOrigin;target=nextTarget;elapsed=nextElapsed;
      nowCache=remainingCache=elapsedCache=undefined;untilCache=Object.create(null);differenceCache=Object.create(null);
    }
    return {
      advance:function(value){add(seconds(value));},
      advanceTicks:function(ticks,exponent){add({n:product(ticks,125),e:exponent});},
      advanceToMs:function(deadline){var d=difference(millis(deadline));add(d);},
      until:function(deadline,early){var key=deadlineKey(deadline,early);if(untilCache[key]===undefined)untilCache[key]=exactSeconds(deadlineDifference(deadline,early));return untilCache[key];},
      compareMs:function(deadline,early){return A.cmp(deadlineDifference(deadline,early).n,0);},
      latticeRemaining:function(){return {ticks:A.exactSub(target,elapsed),unit:unit,scale:125};},
      latticeUntil:function(deadline,early){var d=difference(millis(deadline),early?duration(early):null);return {ticks:d.n,unit:d.e,scale:125};},
      latticeDuration:function(value){var d=seconds(value);return {ticks:d.n,unit:d.e,scale:125};},
      advanceLattice:function(duration){if(duration.scale!==125)throw new RangeError('Invalid clock lattice');add({n:duration.ticks,e:duration.unit});},
      absoluteSnapshot:function(){return absolute();},
      pointBefore:function(value){var at=absolute(),d=duration(value),common=Math.min(at.e,d.e);return {n:A.exactSub(scaled(at,common),scaled(d,common)),e:common};},
      pointAfter:pointAfter,
      latticeAfter:function(point,delay){var left=difference(pointAfter(point,delay));return {ticks:left.n,unit:left.e,scale:125};},
      compareDuration:function(a,b){var common=Math.min(a.unit,b.unit);return A.cmp(scaled({n:a.ticks,e:a.unit},common),scaled({n:b.ticks,e:b.unit},common));},
      since:function(point){var current=absolute(),common=Math.min(current.e,point.e);return exactSeconds({n:A.exactSub(scaled(current,common),scaled(point,common)),e:common});},
      sinceNumber:function(point){var current=absolute(),common=Math.min(current.e,point.e);return nativeDyad({n:A.exactSub(scaled(current,common),scaled(point,common)),e:common},125);},
      remaining:function(){if(remainingCache===undefined)remainingCache=exactSeconds({n:A.exactSub(target,elapsed),e:unit});return remainingCache;},
      elapsed:function(){if(elapsedCache===undefined)elapsedCache=exactSeconds({n:elapsed,e:unit});return elapsedCache;},
      elapsedNumber:function(){return nativeDyad({n:elapsed,e:unit},125);},
      nowMs:function(){if(nowCache===undefined){var d=absolute();nowCache=nativeDyad({n:product(d.n,8),e:d.e});}return nowCache;},
      nextWindow:function(value,settings){return create(absolute(),budget(value,settings));},
      project:function(value){var clock=create(absolute(),seconds(value));clock.advance(value);return clock;},
      snapshot:function(){return {origin:origin,elapsed:elapsed,target:target,unit:unit};}
    };
  }
  return create(millis(startMs),budget(budgetSec,options));
};
