'use strict';
// Purchase-free, fixed-path reward component only. The real scheduler must
// prove those preconditions and stop at the next changing chronological event.
module.exports=function(A,recipes,killShards,spawnCounts,total){
  if(!recipes.length||!A.integer(total)||A.lt(total,0)||killShards.length!==spawnCounts.length)throw new RangeError('Invalid Ascend reward recipe');
  total=A.exactAdd(total,0);
  function product(a,b){a=typeof a==='number'?A.exactAdd(a,0):a;b=typeof b==='number'?A.exactAdd(b,0):b;return A.mul(a,typeof b==='number'?String(b)+'e0':b);}
  function exactCredits(terms){
    // Once a credited wallet is wide, each individual native fractional gain
    // is added as its decimal representation. Sum on an integer decimal
    // lattice: small intermediate fractions must never round before the
    // complete aggregate reaches that existing wide wallet.
    var rows=terms.map(function(term){var value=typeof term[0]==='number'?A.exactAdd(term[0],0):term[0],m=/^(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/.exec(String(value));if(!m)throw new RangeError('Invalid reward credit');return {n:(m[1]+(m[2]||''))+'e0',e:Number(m[3]||0)-(m[2]||'').length,count:term[1]};}),unit=rows.reduce(function(e,r){return Math.min(e,r.e);},0),sum=0;
    rows.forEach(function(r){sum=A.exactAdd(sum,product(A.mul(r.n,'1e'+(r.e-unit)),r.count));});
    if(A.cmp(sum,0)===0)return 0;
    var parts=String(sum).split('e'),digits=parts[0],exponent=Number(parts[1]||0)+unit;
    while(digits.length>1&&digits.charAt(digits.length-1)==='0'){digits=digits.slice(0,-1);exponent++;}
    var token=digits+'e'+exponent,native=Number(token);
    return Number.isSafeInteger(native)&&A.cmp(token,native)===0?native:token;
  }
  var parts=A.divmod(total,recipes.length),tail=Number(parts.r),out={lumen:0,shards:0,sigils:0,prisms:0,motes:0,kills:0,bossKills:0,luminousKills:0,ascends:total};
  var credits={lumen:[],shards:[]};
  recipes.forEach(function(recipe,i){
    var count=A.exactAdd(parts.q,i<tail?1:0);
    ['sigils','prisms','motes','kills','bossKills'].forEach(function(key){out[key]=A.exactAdd(out[key],product(recipe[key]||0,count));});
    ['lumen','shards'].forEach(function(key){(recipe[key+'Credits']||[recipe[key]||0]).forEach(function(value){credits[key].push([value,count]);});});
  });
  killShards.forEach(function(reward,i){
    var ordinary=A.exactSub(total,spawnCounts[i]);
    credits.shards.push([reward.normal,ordinary],[reward.bright,spawnCounts[i]]);
    credits.lumen.push([reward.normalLumen||0,ordinary],[reward.brightLumen||0,spawnCounts[i]]);
    out.luminousKills=A.exactAdd(out.luminousKills,spawnCounts[i]);
  });
  out.lumen=exactCredits(credits.lumen);out.shards=exactCredits(credits.shards);
  return out;
};
