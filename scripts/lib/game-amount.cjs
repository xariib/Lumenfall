'use strict';
// Hybrid arithmetic: preserve ordinary Number behavior; store wide amounts as
// canonical coefficient/exponent strings. Wide addition and debit are exact.
// No BigInt, eval, external dependency or prototype mutation in game runtime.
function createGameAmount(){
  var SAFE=9007199254740991;
  var nativePartsCache=Object.create(null),nativePartsKeys=[];
  function clean(p){
    p.d=p.d.replace(/^0+/,'')||'0';
    if(p.d==='0')return {d:'0',e:0,s:1};
    var end=p.d.length;
    while(end>1&&p.d.charAt(end-1)==='0')end--;
    p.e+=p.d.length-end;p.d=p.d.slice(0,end);return p;
  }
  function digitAdd(a,b){
    var out=[],i=a.length,j=b.length,c=0;
    // Seven decimal digits keep every chunk/carry exactly representable and
    // avoid one allocation/conversion per digit on mature currency wallets.
    while(i>0||j>0||c){var ai=Math.max(0,i-7),bi=Math.max(0,j-7),n=Number(a.slice(ai,i)||0)+Number(b.slice(bi,j)||0)+c;out.push(String(n%10000000).padStart(7,'0'));c=Math.floor(n/10000000);i=ai;j=bi;}
    return out.reverse().join('').replace(/^0+/,'')||'0';
  }
  function digitSub(a,b){
    var out=[],i=a.length,j=b.length,c=0;
    while(i>0){var ai=Math.max(0,i-7),bi=Math.max(0,j-7),n=Number(a.slice(ai,i)||0)-Number(b.slice(bi,j)||0)-c;c=n<0?1:0;out.push(String(n+c*10000000).padStart(7,'0'));i=ai;j=bi;}
    return out.reverse().join('').replace(/^0+/,'')||'0';
  }
  function digitMul(a,b){
    var out=[],i,j;
    for(i=0;i<a.length+b.length;i++)out[i]=0;
    for(i=a.length-1;i>=0;i--)for(j=b.length-1;j>=0;j--){
      var at=i+j+1,n=out[at]+Number(a.charAt(i))*Number(b.charAt(j));out[at]=n%10;out[at-1]+=Math.floor(n/10);
    }
    return out.join('').replace(/^0+/,'')||'0';
  }
  function nativeInteger(n){
    // Reconstruct the actual IEEE-754 integer, rather than its shortened
    // display string. Old large wallets therefore retain their actual value.
    var key=String(n),cached=nativePartsCache[key];if(cached)return {d:cached.d,e:cached.e,s:cached.s};
    var v=new DataView(new ArrayBuffer(8));v.setFloat64(0,Math.abs(n));
    var hi=v.getUint32(0),lo=v.getUint32(4),shift=((hi>>>20)&2047)-1023-52;
    var d=String((hi&1048575)*4294967296+lo+4503599627370496);
    // Multiply in exact 26-bit chunks so repeatedly inspecting large native
    // combat values does not perform hundreds of decimal multiplications.
    while(shift>=26){d=digitMul(d,'67108864');shift-=26;}
    if(shift>0)d=digitMul(d,String(Math.pow(2,shift)));
    var p=clean({d:d,e:0,s:n<0?-1:1});nativePartsCache[key]=p;nativePartsKeys.push(key);
    if(nativePartsKeys.length>128)delete nativePartsCache[nativePartsKeys.shift()];
    return {d:p.d,e:p.e,s:p.s};
  }
  function parts(value){
    if(typeof value==='number'){
      if(!Number.isFinite(value))throw new RangeError('Amount must be finite');
      if(Math.abs(value)>SAFE)return nativeInteger(value);
    }else if(typeof value!=='string')throw new TypeError('Invalid amount');
    var match=String(value).match(/^(-?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/);
    if(!match)throw new TypeError('Invalid amount');
    var e=Number(match[4]||0)-(match[3]||'').length;
    if(!Number.isSafeInteger(e))throw new RangeError('Invalid amount exponent');
    return clean({d:match[2]+(match[3]||''),e:e,s:match[1]?-1:1});
  }
  function encode(p){
    p=clean(p);if(p.d==='0')return 0;
    var text=(p.s<0?'-':'')+p.d+'e'+p.e,n=Number(text);
    return Number.isFinite(n)&&Math.abs(n)<=SAFE?n:text;
  }
  function wide(value){return typeof value==='string'&&/^-?\d+e-?\d+$/.test(value);}
  function valid(value){if(typeof value==='number')return Number.isFinite(value);if(!wide(value))return false;try{parts(value);return true;}catch(e){return false;}}
  function compareParts(a,b){
    if(a.d==='0'&&b.d==='0')return 0;
    if(a.d==='0')return -b.s;if(b.d==='0')return a.s;
    if(a.s!==b.s)return a.s;
    var orderA=a.d.length+a.e,orderB=b.d.length+b.e;
    if(orderA!==orderB)return (orderA>orderB?1:-1)*a.s;
    var size=Math.max(a.d.length,b.d.length),ad=a.d.padEnd(size,'0'),bd=b.d.padEnd(size,'0');
    return (ad===bd?0:ad>bd?1:-1)*a.s;
  }
  function cmp(a,b){
    if(!wide(a)&&!wide(b))return a===b?0:a>b?1:-1;
    if(a===Infinity||b===-Infinity)return 1;if(a===-Infinity||b===Infinity)return -1;
    return compareParts(parts(a),parts(b));
  }
  function add(a,b){
    if((typeof a==='string'&&!wide(a))||(typeof b==='string'&&!wide(b)))return a+b;
    if(!wide(a)&&!wide(b)&&(typeof a!=='number'||typeof b!=='number'||!Number.isFinite(a)||!Number.isFinite(b)))return a+b;
    if(!wide(a)&&!wide(b)&&Number.isFinite(a+b))return a+b;
    return exactAdd(a,b);
  }
  function exactAdd(a,b){
    var x=parts(a),y=parts(b);if(x.d==='0')return encode(y);if(y.d==='0')return encode(x);var e=Math.min(x.e,y.e);
    var xd=x.d+'0'.repeat(x.e-e),yd=y.d+'0'.repeat(y.e-e);
    var d,s=x.s;
    if(x.s===y.s)d=digitAdd(xd,yd);
    else if(xd.length>yd.length||(xd.length===yd.length&&xd>=yd))d=digitSub(xd,yd);
    else{d=digitSub(yd,xd);s=y.s;}
    return encode({d:d,e:e,s:s});
  }
  function neg(a){if(!wide(a))return -a;var p=parts(a);p.s=-p.s;return encode(p);}
  function sub(a,b){if(!wide(a)&&!wide(b)&&Number.isFinite(a-b))return a-b;return add(a,neg(b));}
  function exactSub(a,b){return exactAdd(a,neg(b));}
  function mul(a,b){
    if((wide(a)&&b===0)||(wide(b)&&a===0))return 0;
    if(!wide(a)&&!wide(b)&&Number.isFinite(a*b))return a*b;
    var x=parts(a),y=parts(b);return encode({d:digitMul(x.d,y.d),e:x.e+y.e,s:x.s*y.s});
  }
  function log10(a){var p=parts(a);return p.d==='0'?-Infinity:Math.log10(Number(p.d.slice(0,16))/Math.pow(10,Math.min(16,p.d.length)-1))+p.d.length-1+p.e;}
  function fromLog(log,sign){
    if(!Number.isFinite(log))throw new RangeError('Invalid logarithmic amount');
    var e=Math.floor(log),d=String(Math.round(Math.pow(10,log-e)*1e14));
    return encode({d:d,e:e-14,s:sign||1});
  }
  function pow(base,exponent){
    var ordinary=Math.pow(base,exponent);
    if(Number.isFinite(ordinary))return ordinary;
    if(typeof base!=='number'||base<=0||!Number.isFinite(exponent))throw new RangeError('Invalid power');
    return fromLog(Math.log10(base)*exponent);
  }
  // Ratios and wide powers are approximate physical calculations. Wallet
  // comparisons/addition/subtraction never pass through this conversion.
  function ratio(a,b){
    if(!wide(a)&&!wide(b))return a/b;
    var x=parts(a),y=parts(b);if(y.d==='0')return x.d==='0'?NaN:x.s*Infinity;if(x.d==='0')return 0;
    var ax=Number(x.d.slice(0,16))/Math.pow(10,Math.min(16,x.d.length)-1);
    var by=Number(y.d.slice(0,16))/Math.pow(10,Math.min(16,y.d.length)-1);
    var exponent=(x.d.length+x.e)-(y.d.length+y.e);
    var result=x.s*y.s*(ax/by)*Math.pow(10,exponent);
    // 10^-324 underflows before multiplying its mantissa, even when the
    // complete quotient (e.g. 9e-324) is representable. Parse the full value.
    if(result===0)result=Number(String(x.s*y.s*(ax/by))+'e'+exponent);
    // A nonzero physical interval must not disappear at the native underflow
    // boundary. The scheduler can then resolve a state event at that interval.
    return result===0 ? x.s*y.s*Number.MIN_VALUE : result;
  }
  function div(a,b){
    var n=ratio(a,b);
    if(!wide(a)&&!wide(b)||Math.abs(n)<=SAFE||n===0)return n;
    return fromLog(log10(a)-log10(b),cmp(a,0)*cmp(b,0));
  }
  function divmod(a,b){
    var x=parts(a),y=parts(b);if(y.d==='0')throw new RangeError('Division by zero');
    var e=Math.min(x.e,y.e),ad=x.d+'0'.repeat(x.e-e),bd=y.d+'0'.repeat(y.e-e),r='0',q='';
    for(var i=0;i<ad.length;i++){
      r=(r+ad.charAt(i)).replace(/^0+/,'')||'0';var count=0;
      while(r.length>bd.length||(r.length===bd.length&&r>=bd)){r=digitSub(r,bd);count++;}
      q+=count;
    }
    return {q:encode({d:q,e:0,s:x.s*y.s}),r:encode({d:r,e:e,s:x.s})};
  }
  function mod(a,b){return !wide(a)&&!wide(b)?a%b:divmod(a,b).r;}
  function floorRatio(a,b){
    if(!wide(a)&&!wide(b))return Math.floor(a/b);
    var result=divmod(a,b);return cmp(a,0)*cmp(b,0)<0&&cmp(result.r,0)!==0?sub(result.q,1):result.q;
  }
  function round(a,kind){
    if(!wide(a))return kind==='floor'?Math.floor(a):kind==='ceil'?Math.ceil(a):Math.round(a);
    var p=parts(a);if(p.e>=0)return encode(p);
    var cut=p.d.length+p.e,integer=cut>0?p.d.slice(0,cut):'0';
    var rest=cut>0?p.d.slice(cut):p.d,nonzero=/[1-9]/.test(rest),up=false;
    if(kind==='ceil')up=p.s>0&&nonzero;
    else if(kind==='floor')up=p.s<0&&nonzero;
    else {var first=cut>=0?Number(p.d.charAt(cut)||0):0;up=first>5||(first===5&&(p.s>0||/[1-9]/.test(rest.slice(1))));}
    return encode({d:up?digitAdd(integer,'1'):integer,e:0,s:p.s});
  }
  function integer(a){return typeof a==='number'?Number.isInteger(a):valid(a)&&cmp(a,round(a,'floor'))===0;}
  function min(){var values=Array.prototype.slice.call(arguments);if(!values.some(wide))return Math.min.apply(Math,values);return values.reduce(function(a,b){return cmp(a,b)<=0?a:b;},Infinity);}
  function max(){var values=Array.prototype.slice.call(arguments);if(!values.some(wide))return Math.max.apply(Math,values);return values.reduce(function(a,b){return cmp(a,b)>=0?a:b;},-Infinity);}
  function text(a){var p=parts(a),e=p.d.length-1+p.e;return (p.s<0?'-':'')+p.d.charAt(0)+(p.d.length>1?'.'+p.d.slice(1,4):'')+'e'+e;}
  function normalize(a){return encode(parts(a));}
  function abs(a){if(!wide(a))return Math.abs(a);var p=parts(a);p.s=1;return encode(p);}
  function physical(a){
    if(!wide(a))return a;var p=parts(a);if(p.d.length<=16)return a;
    var keep=p.d.slice(0,16),more=p.d.length-16;
    if(Number(p.d.charAt(16))>=5)keep=digitAdd(keep,'1');
    return encode({d:keep,e:p.e+more,s:p.s});
  }
  function lt(a,b){return wide(a)||wide(b)?cmp(a,b)<0:a<b;}
  function le(a,b){return wide(a)||wide(b)?cmp(a,b)<=0:a<=b;}
  function gt(a,b){return wide(a)||wide(b)?cmp(a,b)>0:a>b;}
  function ge(a,b){return wide(a)||wide(b)?cmp(a,b)>=0:a>=b;}
  function fromHex(hex){var p={d:'0',e:0,s:1};for(var i=0;i<hex.length;i++)p.d=digitAdd(digitMul(p.d,'16'),String(parseInt(hex.charAt(i),16)));return encode(p);}
  function toHex(value){if(!integer(value)||cmp(value,0)<0)throw new RangeError('Hex needs a nonnegative integer');var result='';while(cmp(value,0)>0){var p=divmod(value,16);result=Number(p.r).toString(16)+result;value=p.q;}return result||'0';}
  return {wide:wide,valid:valid,cmp:cmp,lt:lt,le:le,gt:gt,ge:ge,add:add,sub:sub,exactAdd:exactAdd,exactSub:exactSub,mul:mul,div:div,mod:mod,divmod:divmod,floorRatio:floorRatio,pow:pow,ratio:ratio,round:round,integer:integer,min:min,max:max,text:text,log10:log10,normalize:normalize,abs:abs,physical:physical,fromHex:fromHex,toHex:toHex};
}
module.exports=createGameAmount();
