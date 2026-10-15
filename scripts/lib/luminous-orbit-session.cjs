'use strict';
// Experimental reusable, lossless index of the certified floating orbit.
// No game calls this module until full combat-cycle acceptance is complete.
function createLuminousOrbitSession(A,kernel,chances,initialPhase,initialFlag){
  var size=chances.length-1,zero=chances.slice(1).map(function(){return 0;}),phase=initialPhase,flag=initialFlag;
  var done=0,totals=zero.slice(),segments=[],seen=new Map(),cycle=null,regions=0;
  var initial={phase:phase,flag:flag};
  var foldMemos=new Map();
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
  // Fold a finite-state weighted consumer over the actual certified spawn
  // words. Translation regions repeat the same branches; the native phase is
  // never replaced with a rational approximation. Consumers must include all
  // transformation semantics in key before opting into the bounded memo.
  function* foldCursor(start,n,consumer,options){
    options=options||{};
    if(!A.integer(start)||A.lt(start,0)||!A.integer(n)||A.lt(n,0)||(!cycle&&A.gt(A.exactAdd(start,n),done)))throw new RangeError('Orbit fold is not indexed');
    start=A.exactAdd(start,0);n=A.exactAdd(n,0);
    var memo=consumer.key&&foldMemos.get(consumer.key),visited=0;
    if(!memo){memo={regions:new WeakMap(),cycle:null};if(consumer.key){foldMemos.set(consumer.key,memo);if(foldMemos.size>16)foldMemos.delete(foldMemos.keys().next().value);}}
    function full(region){var value=memo.regions.get(region);if(value===undefined){value=consumer.word(kernel.word(chances,region.primitiveCycles,region.phase,region.flag));memo.regions.set(region,value);}return value;}
    function slice(region,offset,count){return offset===0&&count===region.primitiveCycles?full(region):consumer.word(kernel.word(chances,region.primitiveCycles,region.phase,region.flag).slice(offset,offset+count));}
    function span(region,offset,count){
      var result=consumer.identity(),skip=Number(A.mod(offset,region.primitiveCycles));
      if(skip){var take=A.min(count,region.primitiveCycles-skip);result=consumer.combine(result,slice(region,skip,Number(take)));count=A.exactSub(count,take);}
      var parts=A.divmod(count,region.primitiveCycles);
      if(A.gt(parts.q,0))result=consumer.combine(result,consumer.repeat(full(region),parts.q));
      if(A.gt(parts.r,0))result=consumer.combine(result,slice(region,0,Number(parts.r)));
      return result;
    }
    function* contiguous(at,count){
      var result=consumer.identity(),low=0,high=segments.length-1,index=0;
      while(low<=high){var mid=Math.floor((low+high)/2);if(A.le(segments[mid].prefix,at)){index=mid;low=mid+1;}else high=mid-1;}
      while(A.gt(count,0)){
        var segment=segments[index++];if(!segment)throw new RangeError('Missing orbit fold segment');
        var offset=A.exactSub(at,segment.prefix),take=A.min(count,A.exactSub(segment.cycles,offset));if(A.le(take,0))throw new RangeError('Empty orbit fold segment');
        result=consumer.combine(result,span(segment.region,offset,take));at=A.exactAdd(at,take);count=A.exactSub(count,take);visited++;
        if(options.maxBlocks&&visited%options.maxBlocks===0)yield {foldRegions:visited};
      }
      return result;
    }
    var result=consumer.identity();
    if(!cycle||A.lt(start,cycle.base)){
      var before=cycle?A.min(n,A.exactSub(cycle.base,start)):n;
      result=consumer.combine(result,yield* contiguous(start,before));start=A.exactAdd(start,before);n=A.exactSub(n,before);
    }
    if(A.gt(n,0)){
      var offset=A.mod(A.exactSub(start,cycle.base),cycle.length);
      if(A.gt(offset,0)){var take=A.min(n,A.exactSub(cycle.length,offset));result=consumer.combine(result,yield* contiguous(A.exactAdd(cycle.base,offset),take));n=A.exactSub(n,take);}
      var pieces=A.divmod(n,cycle.length);
      if(A.gt(pieces.q,0)){if(memo.cycle===null)memo.cycle=yield* contiguous(cycle.base,cycle.length);result=consumer.combine(result,consumer.repeat(memo.cycle,pieces.q));}
      if(A.gt(pieces.r,0))result=consumer.combine(result,yield* contiguous(cycle.base,pieces.r));
    }
    return result;
  }
  function fold(start,n,consumer,options){var iterator=foldCursor(start,n,consumer,options),step;do{step=iterator.next();}while(!step.done);return step.value;}
  return {cursor:cursor,advance:advance,position:position,fold:fold,foldCursor:foldCursor,stats:function(){return {regions:regions,segments:segments.length,compiled:!!cycle,periodCycles:cycle&&cycle.length};}};
}
module.exports=function(A,chances,phase,flag,settings){return createLuminousOrbitSession(A,require('./luminous-orbit.cjs')(A,settings),chances,phase,flag);};
