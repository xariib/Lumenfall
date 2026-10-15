'use strict';
// Experimental reusable, lossless index of the certified floating orbit.
// No game calls this module until full combat-cycle acceptance is complete.
function createLuminousOrbitSession(A,kernel,chances,initialPhase,initialFlag){
  var size=chances.length-1,zero=chances.slice(1).map(function(){return 0;}),phase=initialPhase,flag=initialFlag;
  var done=0,totals=zero.slice(),segments=[],seen=new Map(),cycle=null,regions=0;
  var initial={phase:phase,flag:flag};
  var sum=chances.reduce(function(a,c){return a+(c||0);},0),period=200;
  for(var p=1;p<=200;p++)if(Math.abs(sum*p-Math.round(sum*p))<1e-9){period=p;break;}
  function product(a,b){a=typeof a==='number'?A.exactAdd(a,0):a;b=typeof b==='number'?A.exactAdd(b,0):b;return A.mul(a,typeof b==='number'?String(b)+'e0':b);}
  function vectorAdd(a,b){return a.map(function(v,i){return A.exactAdd(v,b[i]);});}
  function vectorSub(a,b){return a.map(function(v,i){return A.exactSub(v,b[i]);});}
  function vectorMul(a,n){return a.map(function(v){return product(v,n);});}
  function literal(n,start,first){return kernel.advance(chances,n,start,first);}
  function measure(){
    var metadata;
    kernel.advance(chances,'1e25',phase,flag,{maxBlocks:1,observe:function(row){metadata=row;}});
    if(!metadata)throw new Error('Orbit region missing');
    if(metadata.delta===0&&metadata.flag===metadata.endFlag)metadata.repetitions=1;
    metadata.cycles=product(metadata.primitiveCycles,metadata.repetitions);
    return metadata;
  }
  function at(region,n){
    var pieces=A.divmod(n,region.primitiveCycles),whole=pieces.q,remainder=Number(pieces.r);
    var shifted=region.delta===0?region.phase:region.phase+Number(whole)*region.delta;
    var first=A.gt(whole,0)?region.endFlag:region.flag;
    var counts=vectorMul(region.counts,whole),end={phase:shifted,flag:first,counts:zero};
    if(remainder)end=literal(remainder,shifted,first);
    return {phase:end.phase,flag:end.flag,counts:vectorAdd(counts,end.counts)};
  }
  function addSegment(region,n){
    var result=at(region,n);
    segments.push({prefix:done,counts:totals.slice(),region:region,cycles:n});
    phase=result.phase;flag=result.flag;done=A.exactAdd(done,n);totals=vectorAdd(totals,result.counts);
  }
  function cycleAt(offset){
    if(A.cmp(offset,0)===0)return {phase:cycle.phase,flag:cycle.flag,counts:zero.slice()};
    var low=cycle.first,high=segments.length-1,index=low;
    while(low<=high){var mid=Math.floor((low+high)/2),relative=A.exactSub(segments[mid].prefix,cycle.base);
      if(A.le(relative,offset)){index=mid;low=mid+1;}else high=mid-1;}
    var segment=segments[index],relativeOffset=A.exactSub(offset,A.exactSub(segment.prefix,cycle.base));
    var result=at(segment.region,relativeOffset);
    result.counts=vectorAdd(vectorSub(segment.counts,cycle.baseCounts),result.counts);return result;
  }
  function useCycle(n){
    var before=cycleAt(cycle.offset),parts=A.divmod(A.exactAdd(cycle.offset,n),cycle.length),after=cycleAt(parts.r);
    var gain=vectorAdd(vectorSub(after.counts,before.counts),vectorMul(cycle.counts,parts.q));
    totals=vectorAdd(totals,gain);done=A.exactAdd(done,n);phase=after.phase;flag=after.flag;cycle.offset=parts.r;
  }
  // Read an already indexed prefix without moving the live cursor. Combat
  // reconstruction can inspect its tail and the first eligible payout.
  function position(n){
    if(!A.integer(n)||A.lt(n,0)||(!cycle&&A.gt(n,done)))throw new RangeError('Orbit position is not indexed');
    n=A.exactAdd(n,0);
    if(A.cmp(n,0)===0)return {phase:initial.phase,flag:initial.flag,counts:zero.slice()};
    if(cycle&&A.ge(n,cycle.base)){
      var parts=A.divmod(A.exactSub(n,cycle.base),cycle.length),r=cycleAt(parts.r);
      return {phase:r.phase,flag:r.flag,counts:vectorAdd(cycle.baseCounts,vectorAdd(vectorMul(cycle.counts,parts.q),r.counts))};
    }
    var low=0,high=segments.length-1,index=0;
    while(low<=high){var mid=Math.floor((low+high)/2);if(A.le(segments[mid].prefix,n)){index=mid;low=mid+1;}else high=mid-1;}
    var segment=segments[index],atEnd=at(segment.region,A.exactSub(n,segment.prefix));
    return {phase:atEnd.phase,flag:atEnd.flag,counts:vectorAdd(segment.counts,atEnd.counts)};
  }
  function* cursor(n,options){
    options=options||{};if(!A.integer(n)||A.lt(n,0))throw new RangeError('Invalid orbit count');
    n=A.exactAdd(n,0);
    var start=done,before=totals.slice(),target=A.exactAdd(done,n),batch=0;
    function result(complete){return {complete:complete,cycles:A.exactSub(done,start),phase:phase,flag:flag,counts:vectorSub(totals,before),regions:regions,compiled:!!cycle};}
    while(A.lt(done,target)){
      if(cycle){useCycle(A.exactSub(target,done));break;}
      if(options.maxBlocks&&batch>=options.maxBlocks){batch=0;yield result(false);}
      var remaining=A.exactSub(target,done),mod=Number(A.mod(done,period));
      if(mod){
        var padding=A.min(remaining,period-mod),plain=literal(Number(padding),phase,flag);
        addSegment({phase:phase,flag:flag,delta:plain.phase-phase,primitiveCycles:Number(padding),repetitions:1,counts:plain.counts,endFlag:plain.flag},padding);
        continue;
      }
      var key=String(phase)+'/'+(flag?1:0),previous=seen.get(key);
      if(previous!==undefined){
        var first=segments[previous];cycle={first:previous,base:first.prefix,baseCounts:first.counts,length:A.exactSub(done,first.prefix),counts:vectorSub(totals,first.counts),phase:phase,flag:flag,offset:0};
        continue;
      }
      seen.set(key,segments.length);
      var region=measure(),take=A.min(remaining,region.cycles);addSegment(region,take);regions++;batch++;
    }
    return result(true);
  }
  function advance(n,options){var iterator=cursor(n,options),step;do{step=iterator.next();}while(!step.done);return step.value;}
  return {cursor:cursor,advance:advance,position:position,stats:function(){return {regions:regions,segments:segments.length,compiled:!!cycle,periodCycles:cycle&&cycle.length};}};
}
module.exports=function(A,chances,phase,flag,settings){return createLuminousOrbitSession(A,require('./luminous-orbit.cjs')(A,settings),chances,phase,flag);};
