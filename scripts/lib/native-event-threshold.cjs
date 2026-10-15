'use strict';
// Boundaries of the existing native floating predicates. A periodic skip
// stops before these exact midpoints; the ordinary event owner still acts.
module.exports=function(A){
  function product(a,b){a=typeof a==='number'?A.exactAdd(a,0):a;b=typeof b==='number'?A.exactAdd(b,0):b;return A.mul(a,typeof b==='number'?String(b)+'e0':b);}
  function pow2(n){var out=1,base=2;while(n){if(n%2)out=product(out,base);n=Math.floor(n/2);if(n)base=product(base,base);}return out;}
  function adjacent(n,direction){
    if(!Number.isFinite(n)||n<0)throw new RangeError('Invalid native boundary');if(n===0)return direction>0?Number.MIN_VALUE:0;
    var v=new DataView(new ArrayBuffer(8));v.setFloat64(0,n);var hi=v.getUint32(0),lo=v.getUint32(4);
    if(direction>0){if(lo===4294967295){hi++;lo=0;}else lo++;}else if(lo===0){hi--;lo=4294967295;}else lo--;
    v.setUint32(0,hi);v.setUint32(4,lo);return v.getFloat64(0);
  }
  function dyad(n){if(n===0)return {n:0,e:0};var v=new DataView(new ArrayBuffer(8));v.setFloat64(0,n);var hi=v.getUint32(0),raw=(hi>>>20)&2047;return {n:product((hi&1048575)*4294967296+v.getUint32(4)+(raw?4503599627370496:0),125),e:raw?raw-1075:-1074};}
  function midpoint(a,b){
    if(!Number.isFinite(a)||!Number.isFinite(b)||a<0||b<a)throw new RangeError('Invalid midpoint');
    var left=dyad(a),right=dyad(b),unit=Math.min(a?left.e:0,b?right.e:0);
    var ticks=A.exactAdd(a?product(left.n,pow2(left.e-unit)):0,b?product(right.n,pow2(right.e-unit)):0);
    return {ticks:ticks,unit:unit-1,scale:125};
  }
  function firstTrue(predicate,estimate){
    if(typeof predicate!=='function'||!Number.isFinite(estimate)||estimate<0)throw new RangeError('Invalid native predicate');
    if(predicate(0))return {ticks:0,unit:0,scale:125};
    var lo=0,hi=estimate;
    while(!predicate(hi)){hi=adjacent(hi,1);if(!Number.isFinite(hi))throw new RangeError('No finite native event boundary');}
    while(adjacent(lo,1)<hi){var mid=lo+(hi-lo)/2;if(mid<=lo||mid>=hi)break;if(predicate(mid))hi=mid;else lo=mid;}
    var lower=adjacent(hi,-1),result=midpoint(lower,hi);result.lower=lower;result.upper=hi;return result;
  }
  return {nextUp:function(n){return adjacent(n,1);},nextDown:function(n){return adjacent(n,-1);},midpoint:midpoint,firstTrue:firstTrue};
};
