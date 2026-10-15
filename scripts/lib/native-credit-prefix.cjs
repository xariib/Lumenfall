'use strict';
// Literal native credit additions, certified within one floating binade.
// Purchases remain the caller's responsibility. No wallet rounding is changed.
module.exports=function(A,wallet,recipes,kills,limit){
  if(!A.valid(wallet)||A.lt(wallet,0)||!A.integer(limit)||A.lt(limit,0)||!recipes.length)throw new RangeError('Invalid native credit prefix');
  var amounts=[];recipes.forEach(function(row){amounts=amounts.concat(row);});kills.forEach(function(k){amounts.push(k.normal,k.bright);});
  if(amounts.some(function(v){return !A.valid(v)||A.lt(v,0);}))throw new RangeError('Invalid native credit');
  if(A.wide(wallet)||wallet>Number.MAX_SAFE_INTEGER||(Number.isInteger(wallet)&&amounts.every(A.integer)))return {mode:'exact',cycles:limit};
  function literal(){return {mode:'literal',cycles:0};}
  if(!wallet||amounts.some(A.wide))return literal();
  var exponent=Math.floor(Math.log(wallet)/Math.LN2),base=Math.pow(2,exponent);
  if(wallet<base){exponent--;base/=2;}else if(wallet>=base*2){exponent++;base*=2;}
  var ulp=Math.max(Number.MIN_VALUE,Math.pow(2,exponent-52)),upperUnits=9007199254740992;
  if(exponent<-1022)upperUnits=4503599627370496;
  var units=wallet/ulp,available=upperUnits-2-units,hasTie=false,oddIncrement=false;
  if(!Number.isSafeInteger(units)||available<0)return literal();
  function increment(value){
    var ratio=value/ulp;if(!Number.isFinite(ratio)||ratio>Number.MAX_SAFE_INTEGER)return null;
    var floor=Math.floor(ratio),tie=ratio-floor===.5,n=tie?floor+((floor%2+units%2)%2?1:0):Math.round(ratio);
    if(tie)hasTie=true;else if(n%2)oddIncrement=true;return n;
  }
  var fixed=recipes.map(function(row){var sum=0;for(var i=0;i<row.length;i++){var n=increment(row[i]);if(n===null)return null;sum=A.exactAdd(sum,n);}return sum;});
  var choices=kills.map(function(k){return {normal:increment(k.normal),bright:increment(k.bright)};});
  // Half-ULP credits can depend on incoming parity. This certificate accepts
  // them only when every possible credit retains the same even parity.
  if(fixed.some(function(n){return n===null;})||choices.some(function(k){return k.normal===null||k.bright===null;})||(hasTie&&(units%2||oddIncrement)))return literal();
  var killCeiling=choices.reduce(function(sum,k){return A.exactAdd(sum,Math.max(k.normal,k.bright));},0),maximum=fixed.reduce(function(m,n){return A.max(m,A.exactAdd(n,killCeiling));},0);
  var count=A.cmp(maximum,0)===0?limit:A.min(limit,A.floorRatio(available,maximum));
  function product(a,b){return A.mul(a,typeof b==='number'?String(b)+'e0':b);}
  return {mode:'native',cycles:count,ulp:ulp,finish:function(spawns,total){
    if(spawns.length!==choices.length||!A.integer(total)||A.lt(total,0)||A.gt(total,count))throw new RangeError('Native credit prefix exceeded');
    var parts=A.divmod(total,fixed.length),gain=0;
    fixed.forEach(function(n,i){gain=A.exactAdd(gain,product(n,A.exactAdd(parts.q,i<Number(parts.r)?1:0)));});
    choices.forEach(function(k,i){if(!A.integer(spawns[i])||A.lt(spawns[i],0)||A.gt(spawns[i],total))throw new RangeError('Invalid native luminous count');gain=A.exactAdd(gain,A.exactAdd(product(k.normal,A.exactSub(total,spawns[i])),product(k.bright,spawns[i])));});
    if(A.gt(gain,available))throw new RangeError('Native credit binade crossed');
    return (units+Number(gain))*ulp;
  }};
};
