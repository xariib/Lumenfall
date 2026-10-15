'use strict';
// Conservative purchase-free prefix. Caller supplies upper bounds for every
// in-cycle wallet peak/gain (including ability income and native rounding).
module.exports=function(A,limit,lumenCeiling,shardCeiling,shardGain,costs){
  [limit,lumenCeiling,shardCeiling,shardGain].forEach(function(v){if(!A.valid(v)||A.lt(v,0))throw new RangeError('Invalid economy bound');});
  if(!A.integer(limit)||!Array.isArray(costs))throw new RangeError('Invalid cycle limit');
  var count=A.exactAdd(limit,0),held=A.round(shardCeiling,'ceil'),limiting=null;
  costs.forEach(function(cost,index){
    var lumen=cost.lumen===undefined?0:cost.lumen,shard=cost.shard===undefined?0:cost.shard;
    if(!A.valid(lumen)||A.lt(lumen,0)||!A.valid(shard)||A.lt(shard,0))throw new RangeError('Invalid queued price');
    if(A.gt(lumen,lumenCeiling))return;
    var bound;
    if(A.ge(held,shard))bound=0;
    else if(A.cmp(shardGain,0)===0)return;
    else{
      var split=A.divmod(A.exactSub(shard,held),shardGain);bound=split.q;
      if(A.cmp(split.r,0)===0)bound=A.max(0,A.exactSub(bound,1));
    }
    if(A.lt(bound,count)){count=bound;limiting=index;}
  });
  return {cycles:count,limiting:limiting};
};
