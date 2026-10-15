'use strict';
// Experimental exact clock with base2^26 integer words. Public values retain
// the existing2^e/125 lattice and decimal save representation; no BigInt.
module.exports=function(A,startMs,budgetSec,options){
 var B=67108864,Z={w:[],s:0},partsCache=Object.create(null),partKeys=[],fives={0:{w:[1],s:1}};
 function clean(w,s){while(w.length&&!w[w.length-1])w.pop();return w.length?{w:w,s:s}:Z;}
 function small(n){var s=n<0?-1:1,w=[];n=Math.abs(n);while(n){var q=Math.floor(n/B);w.push(n-q*B);n=q;}return clean(w,s);}
 function magnitude(a,b){if(a.w.length!==b.w.length)return a.w.length>b.w.length?1:-1;for(var i=a.w.length-1;i>=0;i--)if(a.w[i]!==b.w[i])return a.w[i]>b.w[i]?1:-1;return 0;}
 function cmp(a,b){return a.s!==b.s?(a.s>b.s?1:-1):a.s*magnitude(a,b);}
 function positiveSub(a,b){var w=[],borrow=0;for(var i=0;i<a.w.length;i++){var v=a.w[i]-(b.w[i]||0)-borrow;borrow=v<0?1:0;w.push(v+borrow*B);}return clean(w,1);}
 function add(a,b){if(!a.s)return b;if(!b.s)return a;if(a.s!==b.s){var order=magnitude(a,b);if(!order)return Z;var d=order>0?positiveSub(a,b):positiveSub(b,a);return {w:d.w,s:order>0?a.s:b.s};}var w=[],carry=0;for(var i=0;i<Math.max(a.w.length,b.w.length);i++){var n=(a.w[i]||0)+(b.w[i]||0)+carry;carry=n>=B?1:0;w.push(n-carry*B);}if(carry)w.push(carry);return clean(w,a.s);}
 function sub(a,b){return add(a,b.s?{w:b.w,s:-b.s}:Z);}
 function mul(a,b){if(!a.s||!b.s)return Z;var w=new Array(a.w.length+b.w.length);for(var k=0;k<w.length;k++)w[k]=0;for(var i=0;i<a.w.length;i++){var carry=0;for(var j=0;j<b.w.length;j++){var n=w[i+j]+a.w[i]*b.w[j]+carry;carry=Math.floor(n/B);w[i+j]=n-carry*B;}var at=i+b.w.length;while(carry){var n=(w[at]||0)+carry;carry=Math.floor(n/B);w[at++]=n-carry*B;}}return clean(w,a.s*b.s);}
 function times(a,n){return mul(a,small(n));}
 function shift(a,bits){if(!Number.isInteger(bits)||bits<0)throw new RangeError('Invalid binary shift');if(!a.s||!bits)return a;var whole=Math.floor(bits/26),fraction=bits%26,w=[],carry=0,factor=Math.pow(2,fraction);for(var i=0;i<whole;i++)w.push(0);for(var i=0;i<a.w.length;i++){var n=a.w[i]*factor+carry;carry=Math.floor(n/B);w.push(n-carry*B);}if(carry)w.push(carry);return clean(w,a.s);}
 function half(a){var w=a.w.slice(),carry=0;for(var i=w.length-1;i>=0;i--){var n=w[i]+carry*B;w[i]=Math.floor(n/2);carry=n%2;}return clean(w,a.s);}
 function bits(a){return a.w.length?(a.w.length-1)*26+32-Math.clz32(a.w[a.w.length-1]):0;}
 function divmod(a,b){if(a.s<0||b.s<=0)throw new RangeError('Invalid unsigned division');var rem=a,offset=bits(a)-bits(b),w=[];if(offset<0)return {q:Z,r:a};var divisor=shift(b,offset);for(var bit=offset;bit>=0;bit--){if(magnitude(rem,divisor)>=0){rem=positiveSub(rem,divisor);var at=Math.floor(bit/26);w[at]=(w[at]||0)+Math.pow(2,bit%26);}divisor=half(divisor);}for(var i=0;i<w.length;i++)if(w[i]===undefined)w[i]=0;return {q:clean(w,1),r:rem};}
 function pow5(n){if(!Number.isInteger(n)||n<0)throw new RangeError('Invalid power');if(fives[n])return fives[n];var result=small(1),factor=small(5),left=n;while(left){if(left%2)result=mul(result,factor);left=Math.floor(left/2);if(left)factor=mul(factor,factor);}fives[n]=result;return result;}
 function integer(value){if(!A.integer(value))throw new RangeError('Invalid binary coefficient');if(typeof value==='number'&&Number.isSafeInteger(value))return small(value);var normalized=A.normalize(value),text=String(normalized),s=text.charAt(0)==='-'?-1:1;if(s<0)text=text.slice(1);var p=text.split('e'),digits=p[0],e=Number(p[1]||0);if(e<0)throw new RangeError('Noninteger coefficient');digits+='0'.repeat(e);var out=Z;for(var i=0;i<digits.length;i+=7){var chunk=digits.slice(i,i+7);out=add(times(out,Math.pow(10,chunk.length)),small(Number(chunk)));}return out.s?{w:out.w,s:s}:Z;}
 function amount(a){if(!a.s)return 0;var native=0;for(var i=a.w.length-1;i>=0;i--)native=native*B+a.w[i];if(Number.isSafeInteger(native))return a.s*native;var chunks=[0],D=10000000;for(var i=a.w.length-1;i>=0;i--){var carry=a.w[i];for(var j=0;j<chunks.length;j++){var n=chunks[j]*B+carry;carry=Math.floor(n/D);chunks[j]=n-carry*D;}while(carry){var rest=Math.floor(carry/D);chunks.push(carry-rest*D);carry=rest;}}var text=String(chunks.pop());while(chunks.length){var chunk=String(chunks.pop());text+='0'.repeat(7-chunk.length)+chunk;}return A.normalize((a.s<0?'-':'')+text+'e0');}
 function dyad(n){if(!Number.isFinite(n)||n<0)throw new RangeError('Invalid native clock value');if(!n)return {n:Z,e:0};var key=String(n),cached=partsCache[key];if(cached)return cached;var v=new DataView(new ArrayBuffer(8));v.setFloat64(0,n);var hi=v.getUint32(0),raw=(hi>>>20)&2047,c=(hi&1048575)*4294967296+v.getUint32(4)+(raw?4503599627370496:0),e=raw?raw-1075:-1074;while(c%2===0){c/=2;e++;}var d={n:small(c),e:e};partsCache[key]=d;partKeys.push(key);if(partKeys.length>256)delete partsCache[partKeys.shift()];return d;}
 function seconds(value){if(typeof value==='number'){var d=dyad(value);return {n:times(d.n,125),e:d.e};}if(!A.wide(value)||!A.valid(value)||A.lt(value,0))throw new RangeError('Invalid exact clock interval');var p=value.split('e'),coefficient=integer(p[0]+'e0'),e=Number(p[1]);if(!coefficient.s)return {n:Z,e:0};if(e>=-3)return {n:mul(coefficient,pow5(e+3)),e:e};var divided=divmod(coefficient,pow5(-e-3));if(divided.r.s)throw new RangeError('Interval does not lie on the binary clock lattice');return {n:divided.q,e:e};}
 function millis(value){var d=dyad(value);return {n:d.n,e:d.e-3};}
 function budget(value,settings){return settings&&settings.budgetMs!==undefined?millis(settings.budgetMs):seconds(value);}
 function duration(value){if(value&&value.scale===125){if(!Number.isInteger(value.unit))throw new RangeError('Invalid lattice exponent');return {n:integer(value.ticks),e:value.unit};}return seconds(value);}
 function point(value){if(!value||!Number.isInteger(value.e))throw new RangeError('Invalid clock point');return {n:integer(value.n),e:value.e};}
 function scaled(d,unit){return d.n.s?shift(d.n,d.e-unit):Z;}
 function publicPoint(d){return {n:amount(d.n),e:d.e};}
 function lattice(d){return {ticks:amount(d.n),unit:d.e,scale:125};}
 function exactSeconds(d){if(!d.n.s)return 0;var k=Math.max(0,-d.e),c=times(d.n,8),e=-3-k;c=d.e>=0?shift(c,d.e):mul(c,pow5(k));var encoded=amount(c),text=typeof encoded==='number'?String(encoded)+'e0':encoded,p=text.split('e');return p[0]+'e'+(Number(p[1])+e);}
 function nativeDyad(d,denominator){
  if(!d.n.s)return 0;var limbs=d.n.w.slice(),sign=d.n.s,e=d.e,fraction=0,count=bits(d.n);
  if(denominator===125){var extra=Math.max(0,60-count);e-=extra;limbs=shift({w:limbs,s:1},extra).w.slice();for(var i=limbs.length-1;i>=0;i--){var n=fraction*B+limbs[i];limbs[i]=Math.floor(n/125);fraction=n-limbs[i]*125;}while(limbs.length>1&&!limbs[limbs.length-1])limbs.pop();count=bits(clean(limbs.slice(),1));}
  var shiftBy=Math.max(0,count-53,-1074-e),word=Math.floor(shiftBy/26),offset=shiftBy%26,q=0;
  for(var i=limbs.length-1;i>word;i--)q=q*B+limbs[i];q=q*Math.pow(2,26-offset)+Math.floor((limbs[word]||0)/Math.pow(2,offset));
  if(shiftBy){var guardWord=Math.floor((shiftBy-1)/26),guardOffset=(shiftBy-1)%26,guard=Math.floor((limbs[guardWord]||0)/Math.pow(2,guardOffset))%2,sticky=fraction!==0;for(var i=0;i<guardWord;i++)if(limbs[i])sticky=true;if((limbs[guardWord]||0)%Math.pow(2,guardOffset))sticky=true;if(guard&&(sticky||q%2))q++;}else if(fraction>=63)q++;
  return sign*q*Math.pow(2,e+shiftBy);
 }
 function create(originD,budgetD){
  var unit=Math.min(originD.n.s?originD.e:0,budgetD.n.s?budgetD.e:0),origin=scaled(originD,unit),target=scaled(budgetD,unit),elapsed=Z,nowCache,remainingCache,elapsedCache,untilCache=Object.create(null),differenceCache=Object.create(null);
  function absolute(){return {n:add(origin,elapsed),e:unit};}
  function difference(deadline,early){var current=absolute(),common=Math.min(current.e,deadline.e,early?early.e:current.e);return {n:sub(sub(scaled(deadline,common),scaled(current,common)),early?scaled(early,common):Z),e:common};}
  function key(deadline,early){return String(deadline)+'/'+(early&&early.scale===125?String(early.ticks)+'/'+early.unit:String(early||0));}
  function untilParts(deadline,early){var id=key(deadline,early);if(!differenceCache[id])differenceCache[id]=difference(millis(deadline),early?duration(early):null);return differenceCache[id];}
  function after(p,delay){var d=duration(delay),common=Math.min(p.e,d.e);return {n:add(scaled(p,common),scaled(d,common)),e:common};}
  function since(p){var current=absolute(),common=Math.min(current.e,p.e);return {n:sub(scaled(current,common),scaled(p,common)),e:common};}
  function advance(d){if(d.n.s<0||!Number.isInteger(d.e))throw new RangeError('Invalid binary duration');var common=Math.min(unit,d.e),same=common===unit,nextOrigin=same?origin:shift(origin,unit-common),nextTarget=same?target:shift(target,unit-common),nextElapsed=add(same?elapsed:shift(elapsed,unit-common),scaled(d,common));if(cmp(nextElapsed,nextTarget)>0)throw new RangeError('Clock step exceeds its window');unit=common;origin=nextOrigin;target=nextTarget;elapsed=nextElapsed;nowCache=remainingCache=elapsedCache=undefined;untilCache=Object.create(null);differenceCache=Object.create(null);}
  return {
   advance:function(value){advance(seconds(value));},advanceTicks:function(ticks,e){advance({n:times(integer(ticks),125),e:e});},advanceToMs:function(deadline){advance(difference(millis(deadline)));},
   until:function(deadline,early){var id=key(deadline,early);if(untilCache[id]===undefined)untilCache[id]=exactSeconds(untilParts(deadline,early));return untilCache[id];},compareMs:function(deadline,early){return untilParts(deadline,early).n.s;},
   latticeRemaining:function(){return lattice({n:sub(target,elapsed),e:unit});},latticeUntil:function(deadline,early){return lattice(untilParts(deadline,early));},latticeDuration:function(value){return lattice(seconds(value));},advanceLattice:function(d){if(d.scale!==125)throw new RangeError('Invalid clock lattice');advance(duration(d));},
   absoluteSnapshot:function(){return publicPoint(absolute());},pointBefore:function(value){var at=absolute(),d=duration(value),common=Math.min(at.e,d.e);return publicPoint({n:sub(scaled(at,common),scaled(d,common)),e:common});},pointAfter:function(p,d){return publicPoint(after(point(p),d));},latticeAfter:function(p,d){return lattice(difference(after(point(p),d)));},
   compareDuration:function(a,b){var x=duration(a),y=duration(b),common=Math.min(x.e,y.e);return cmp(scaled(x,common),scaled(y,common));},since:function(p){return exactSeconds(since(point(p)));},sinceNumber:function(p){return nativeDyad(since(point(p)),125);},
   remaining:function(){if(remainingCache===undefined)remainingCache=exactSeconds({n:sub(target,elapsed),e:unit});return remainingCache;},elapsed:function(){if(elapsedCache===undefined)elapsedCache=exactSeconds({n:elapsed,e:unit});return elapsedCache;},elapsedNumber:function(){return nativeDyad({n:elapsed,e:unit},125);},nowMs:function(){if(nowCache===undefined){var d=absolute();nowCache=nativeDyad({n:times(d.n,8),e:d.e});}return nowCache;},
   nextWindow:function(value,settings){return create(absolute(),budget(value,settings));},project:function(value){var c=create(absolute(),seconds(value));c.advance(value);return c;},snapshot:function(){return {origin:amount(origin),elapsed:amount(elapsed),target:amount(target),unit:unit};}
  };
 }
 return create(millis(startMs),budget(budgetSec,options));
};
