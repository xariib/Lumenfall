'use strict';
// Experimental resource reconstruction, not called by the game. The caller
// must prove a purchase-free recipe, its recurring combat phase, and an
// initial wallet within [0,bound]. Matching monotone endpoint bounds then
// prove the skipped initial wallet cannot affect the reconstructed result.
module.exports=function(A,kernel,orbit,pattern,recipes,total,bound,tailLimit,options){
  if(!A.integer(total)||A.lt(total,0)||!recipes.length||!A.valid(bound)||A.lt(bound,0))throw new RangeError('Invalid Lumen recipe');
  total=A.exactAdd(total,0);
  options=options||{};
  var tail=A.min(total,tailLimit||64),prefix=A.exactSub(total,tail),start=orbit.position(A.exactAdd(options.orbitOffset||0,prefix));
  var phase=start.phase,flag=start.flag,index=Number(A.mod(A.exactAdd(prefix,options.recipeOffset||0),recipes.length)),low=0,high=bound;
  var exactInitial=A.cmp(prefix,0)===0&&options.initial!==undefined;
  if(exactInitial){if(!A.valid(options.initial)||A.lt(options.initial,0)||A.gt(options.initial,bound))throw new RangeError('Initial Lumen outside proven bounds');low=high=options.initial;}
  function credit(wallet,gain){
    return !A.wide(wallet)&&!A.wide(gain)&&Number.isFinite(wallet+gain)&&Math.abs(wallet+gain)<=Number.MAX_SAFE_INTEGER?wallet+gain:A.exactAdd(wallet,gain);
  }
  function apply(wallet,ops,flags){
    var kill=0;
    for(var i=0;i<ops.length;i++){
      var op=ops[i];
      if(op.kind==='kill')wallet=credit(wallet,flags[kill++]?op.bright:op.normal);
      else if(op.kind==='gain')wallet=credit(wallet,op.amount);
      else if(op.kind==='retain')wallet=A.min(A.mul(wallet,op.factor),op.cap);
      else throw new RangeError('Unknown Lumen operation');
    }
    if(kill!==flags.length)throw new RangeError('Lumen recipe does not match spawn path');
    return wallet;
  }
  for(var n=0;n<Number(tail);n++){
    var spawn=kernel.advance(pattern,1,phase,flag),ops=recipes[index];
    low=apply(low,ops,spawn.counts);high=apply(high,ops,spawn.counts);
    phase=spawn.phase;flag=spawn.flag;index=(index+1)%recipes.length;
  }
  return {independent:!exactInitial&&A.cmp(low,high)===0,exactInitial:exactInitial,low:low,high:high,lumen:A.cmp(low,high)===0?low:null,phase:phase,flag:flag,tailCycles:tail};
};
