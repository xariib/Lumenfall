'use strict';
// Purchase-free, fixed-path reward component only. The real scheduler must
// prove those preconditions and stop at the next changing chronological event.
module.exports=function(A,recipes,killShards,spawnCounts,total){
  if(!recipes.length||!A.integer(total)||A.lt(total,0)||killShards.length!==spawnCounts.length)throw new RangeError('Invalid Ascend reward recipe');
  function product(a,b){return A.mul(typeof a==='number'?String(a)+'e0':a,typeof b==='number'?String(b)+'e0':b);}
  var parts=A.divmod(total,recipes.length),tail=Number(parts.r),out={shards:0,sigils:0,prisms:0,motes:0,kills:0,bossKills:0,luminousKills:0,ascends:total};
  recipes.forEach(function(recipe,i){
    var count=A.exactAdd(parts.q,i<tail?1:0);
    ['shards','sigils','prisms','motes','kills','bossKills'].forEach(function(key){out[key]=A.exactAdd(out[key],product(recipe[key]||0,count));});
  });
  killShards.forEach(function(reward,i){
    out.shards=A.exactAdd(out.shards,product(reward.normal,total));
    out.shards=A.exactAdd(out.shards,product(A.exactSub(reward.bright,reward.normal),spawnCounts[i]));
    out.luminousKills=A.exactAdd(out.luminousKills,spawnCounts[i]);
  });
  return out;
};
