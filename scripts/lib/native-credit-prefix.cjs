'use strict';
// Literal native credit additions, certified within one floating binade.
// Purchases remain the caller's responsibility. No wallet rounding is changed.
module.exports=function(A,wallet,recipes,kills,limit,options){
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
  if(fixed.some(function(n){return n===null;})||choices.some(function(k){return k.normal===null||k.bright===null;}))return literal();
  var needsFold=!!(hasTie&&(units%2||oddIncrement)),ordered=null;
  if(needsFold){
    if(!options||!options.ordered)return literal();ordered=typeof options.ordered==='function'?options.ordered():options.ordered;
    if(!Array.isArray(ordered)||ordered.length!==recipes.length)throw new RangeError('Invalid ordered native credits');
    ordered.forEach(function(row,i){var index=0,gains=[];row.forEach(function(op){if(op.kind==='kill'){if(op.index!==index++)throw new RangeError('Native kill order changed');}else if(op.kind==='gain')gains.push(op.amount);else throw new RangeError('Unknown native credit operation');});if(index!==kills.length||gains.length!==recipes[i].length||gains.some(function(v,j){return A.cmp(v,recipes[i][j])!==0;}))throw new RangeError('Native credit recipe changed');});
  }
  function ceiling(value){var ratio=value/ulp,floor=Math.floor(ratio);return ratio-floor===.5?floor+1:Math.round(ratio);}
  var killCeiling=needsFold?kills.reduce(function(sum,k){return A.exactAdd(sum,Math.max(ceiling(k.normal),ceiling(k.bright)));},0):choices.reduce(function(sum,k){return A.exactAdd(sum,Math.max(k.normal,k.bright));},0);
  var maximum=needsFold?recipes.reduce(function(m,row){return A.max(m,A.exactAdd(row.reduce(function(sum,n){return A.exactAdd(sum,ceiling(n));},0),killCeiling));},0):fixed.reduce(function(m,n){return A.max(m,A.exactAdd(n,killCeiling));},0);
  var count=A.cmp(maximum,0)===0?limit:A.min(limit,A.floorRatio(available,maximum));
  function product(a,b){return A.mul(a,typeof b==='number'?String(b)+'e0':b);}
  function consumer(){
    // Keep phase and incoming mantissa parity in a tiny deterministic
    // transducer. Saturation is above every valid binade prefix; it bounds
    // unused states without changing any affordable path's exact weight.
    var cap=4503599627370496,size=recipes.length*2;
    function profile(value){var r=value/ulp,f=Math.floor(r);return r-f===.5?[1,f]:[0,Math.round(r)];}
    var choices=kills.map(function(k){return [profile(k.normal),profile(k.bright)];}),program=ordered.map(function(row){return row.map(function(op){return op.kind==='kill'?['kill',op.index]:['gain',profile(op.amount)];});});
    function identity(){var out=[];for(var i=0;i<size;i++)out.push({next:i,gain:0});return out;}
    function combine(a,b){return a.map(function(row){var next=b[row.next];return {next:next.next,gain:Math.min(cap,row.gain+next.gain)};});}
    function repeat(word,n){var result=identity();while(A.gt(n,0)){var p=A.divmod(n,2);if(A.cmp(p.r,0))result=combine(result,word);n=p.q;if(A.gt(n,0))word=combine(word,word);}return result;}
    function word(rows){
      var out=[];
      for(var state=0;state<size;state++){
        var phase=Math.floor(state/2),parity=state%2,gain=0;
        rows.forEach(function(flags){program[phase].forEach(function(op){var p=op[0]==='kill'?choices[op[1]][flags[op[1]]?1:0]:op[1],n=p[0]?p[1]+((p[1]%2+parity)%2?1:0):p[1];gain=Math.min(cap,gain+n);parity=(parity+n%2)%2;});phase=(phase+1)%recipes.length;});
        out.push({next:phase*2+parity,gain:gain});
      }
      return out;
    }
    return {key:JSON.stringify(['native-credit-parity-v1',cap,program,choices]),identity:identity,combine:combine,repeat:repeat,word:word};
  }
  var weighted=needsFold?consumer():null;
  function* finishCursor(spawns,total,orbit,offset,settings){
    if(spawns.length!==choices.length||!A.integer(total)||A.lt(total,0)||A.gt(total,count))throw new RangeError('Native credit prefix exceeded');
    spawns.forEach(function(v){if(!A.integer(v)||A.lt(v,0)||A.gt(v,total))throw new RangeError('Invalid native luminous count');});
    var parts=A.divmod(total,fixed.length),gain=0;
    if(weighted){if(!orbit||!orbit.foldCursor)throw new RangeError('Native parity needs an indexed orbit');var folded=yield* orbit.foldCursor(offset||0,total,weighted,settings);gain=folded[units%2].gain;}
    else{
      fixed.forEach(function(n,i){gain=A.exactAdd(gain,product(n,A.exactAdd(parts.q,i<Number(parts.r)?1:0)));});
      choices.forEach(function(k,i){gain=A.exactAdd(gain,A.exactAdd(product(k.normal,A.exactSub(total,spawns[i])),product(k.bright,spawns[i])));});
    }
    if(A.gt(gain,available))throw new RangeError('Native credit binade crossed');
    return (units+Number(gain))*ulp;
  }
  function finish(spawns,total,orbit,offset,settings){var cursor=finishCursor(spawns,total,orbit,offset,settings),step;do{step=cursor.next();}while(!step.done);return step.value;}
  return {mode:'native',cycles:count,ulp:ulp,needsFold:needsFold,finish:finish,finishCursor:finishCursor};
};
