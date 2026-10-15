'use strict';
// Exact jumps through the existing floating-point spawn recurrence. Each
// region is certified by the actual intermediate binades and an even-ULP
// translation; no rationalized replacement for the saved pity counter.
function createLuminousOrbit(A){
  var QUANTUM=Math.pow(2,-51);
  function product(a,b){return A.mul(typeof a==='number'?String(a)+'e0':a,typeof b==='number'?String(b)+'e0':b);}
  function advance(chances,total,phase,flag,options){
    options=options||{};
    if(!Array.isArray(chances)||chances.length<2||!A.integer(total)||A.lt(total,0)||!Number.isFinite(phase)||phase<0||phase>=1)throw new RangeError('Invalid luminous orbit');
    chances.forEach(function(c){if(c!==null&&(!Number.isFinite(c)||c<0||c>.35))throw new RangeError('Invalid spawn chance');});
    // This selects a block length only. Every spawn still performs the
    // original Number addition/subtraction, including its rounding drift.
    var sum=chances.reduce(function(a,c){return a+(c||0);},0),period=200;
    for(var candidate=1;candidate<=200;candidate++)if(Math.abs(sum*candidate-Math.round(sum*candidate))<1e-9){period=candidate;break;}
    var size=chances.length-1,counts=chances.slice(1).map(function(){return 0;}),done=0,blocks=0,jumps=0,seen=new Map();
    function addCounts(values,n){for(var i=0;i<size;i++)counts[i]=A.exactAdd(counts[i],product(values[i],n));}
    function block(cycles){
      var start=phase,startFlag=flag,low=-Infinity,high=Infinity,values=counts.map(function(){return 0;});
      function bound(value){
        if(value===0){low=Math.max(low,0);high=Math.min(high,0);return;}
        var exponent=Math.floor(Math.log(value)/Math.LN2),base=Math.pow(2,exponent);
        // Correct log rounding at exact powers of two.
        if(value<base){exponent--;base/=2;}else if(value>=base*2){exponent++;base*=2;}
        var ulp=Math.pow(2,exponent-52);
        low=Math.max(low,base+2*ulp-value);high=Math.min(high,base*2-2*ulp-value);
      }
      for(var n=0;n<cycles;n++)for(var j=0;j<chances.length;j++){
        if(j<size&&flag)values[j]++;
        if(chances[j]===null){flag=false;continue;}
        bound(phase);phase+=chances[j];bound(phase);
        flag=phase>=1;if(flag)phase-=1;bound(phase);
      }
      return {start:start,startFlag:startFlag,phase:phase,flag:flag,delta:phase-start,low:low,high:high,counts:values};
    }
    while(A.lt(done,total)){
      var key=String(phase)+'/'+(flag?1:0),previous=seen.get(key);
      if(previous){
        var cycle=A.exactSub(done,previous.done),repeat=A.floorRatio(A.exactSub(total,done),cycle);
        if(A.gt(repeat,0)){
          for(var p=0;p<size;p++)counts[p]=A.exactAdd(counts[p],product(A.exactSub(counts[p],previous.counts[p]),repeat));
          done=A.exactAdd(done,product(cycle,repeat));jumps++;
          if(A.cmp(done,total)===0)break;
        }
      }else seen.set(key,{done:done,counts:counts.slice()});
      var remaining=A.exactSub(total,done),cycles=A.ge(remaining,period)?period:Number(remaining),b=block(cycles);blocks++;
      while(cycles>=period && cycles<period*8 && b.delta!==0 && flag===b.startFlag &&
          !Number.isInteger(b.delta/QUANTUM) && b.low<=0 && b.high>=0 && A.ge(remaining,cycles*2)){
        phase=b.start;flag=b.startFlag;cycles*=2;b=block(cycles);
      }
      var repetitions=1;
      if(cycles>=period && flag===b.startFlag){
        if(b.delta===0)repetitions=A.floorRatio(remaining,cycles);
        else if(Number.isInteger(b.delta/QUANTUM)&&b.low<=0&&b.high>=0){
          var limit=b.delta>0?b.high:b.low,steps=Math.floor(limit/b.delta);
          // Keep every translated operand strictly inside its certified range.
          while(steps>0 && !(steps*b.delta>=b.low&&steps*b.delta<=b.high))steps--;
          var available=A.floorRatio(remaining,cycles);
          repetitions=A.min(available,Math.max(1,steps+1));
          if(repetitions>1)phase=b.start+Number(repetitions)*b.delta;
        }
      }
      if(options.observe)options.observe({phase:b.start,delta:b.delta,low:b.low,high:b.high,repetitions:repetitions});
      addCounts(b.counts,repetitions);done=A.exactAdd(done,product(cycles,repetitions));
      if(A.gt(repetitions,1))jumps++;
      if(options.maxBlocks&&blocks>=options.maxBlocks&&A.lt(done,total))return {complete:false,cycles:done,phase:phase,flag:flag,counts:counts,blocks:blocks,jumps:jumps};
    }
    return {complete:true,cycles:done,phase:phase,flag:flag,counts:counts,blocks:blocks,jumps:jumps};
  }
  return {advance:advance};
}
module.exports=createLuminousOrbit;
