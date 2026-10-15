'use strict';
// Exact repeated native additions with the existing per-Ascend Phase Memory
// ceiling. No timer is advanced by replacing its recurrence with elapsed*time.
module.exports=function(A,program,total,value,cap,options){
  if(!A.integer(total)||A.lt(total,0)||!Number.isFinite(value)||value<0||!Number.isFinite(cap)||cap<value||!program.length||program[program.length-1]!==null)throw new RangeError('Invalid native phase');
  total=A.exactAdd(total,0);
  program.forEach(function(n){if(n!==null&&(!Number.isFinite(n)||n<0))throw new RangeError('Invalid native phase increment');});
  function product(a,b){a=typeof a==='number'?A.exactAdd(a,0):a;b=typeof b==='number'?A.exactAdd(b,0):b;return A.mul(a,typeof b==='number'?String(b)+'e0':b);}
  var done=0,blocks=0,threshold=options&&options.threshold;
  if(threshold!==undefined&&(!Number.isFinite(threshold)||threshold<=cap))throw new RangeError('Invalid native phase threshold');
  function block(n){
    var start=value,low=-Infinity,high=Infinity,maxUlp=Number.MIN_VALUE;
    function bound(x){
      if(x===0){low=Math.max(low,0);high=Math.min(high,0);return;}
      var exponent=Math.floor(Math.log(x)/Math.LN2),base=Math.pow(2,exponent);
      if(x<base){exponent--;base/=2;}else if(x>=base*2){exponent++;base*=2;}
      var ulp=Math.max(Number.MIN_VALUE,Math.pow(2,exponent-52)),upper=base*2;
      if(exponent<-1022){base=0;upper=Math.pow(2,-1022);}
      maxUlp=Math.max(maxUlp,ulp);low=Math.max(low,base+2*ulp-x);high=Math.min(high,upper-2*ulp-x);
    }
    for(var i=0;i<n;i++)for(var j=0;j<program.length;j++){
      if(program[j]===null){if(value>cap){value=cap;low=0;high=0;}else high=Math.min(high,cap-value);}
      else{bound(value);value+=program[j];if(!Number.isFinite(value))throw new RangeError('Native phase overflow');bound(value);if(threshold!==undefined){if(value>=threshold){value=start;return {crossed:true,start:start};}high=Math.min(high,threshold-value-2*maxUlp);}}
    }
    return {start:start,delta:value-start,low:low,high:high,quantum:2*maxUlp};
  }
  while(A.lt(done,total)){
    var left=A.exactSub(total,done),n=1,b=block(n);blocks++;
    if(b.crossed)return {value:value,blocks:blocks,cycles:done,stopped:true};
    while(n<8&&A.ge(left,n*2)&&b.delta!==0&&!Number.isInteger(b.delta/b.quantum)&&b.low<=0&&b.high>=0){var previous=b;value=b.start;n*=2;b=block(n);if(b.crossed){n/=2;b=previous;value=b.start+b.delta;break;}}
    var repetitions=1;
    if(b.delta===0)repetitions=A.floorRatio(left,n);
    else if(Number.isInteger(b.delta/b.quantum)&&b.low<=0&&b.high>=0){
      var steps=Math.min(4503599627370495,Math.floor(b.high/b.delta));
      while(steps>0&&steps*b.delta>b.high)steps--;
      repetitions=A.min(A.floorRatio(left,n),Math.max(1,steps+1));
      if(A.gt(repetitions,1))value=b.start+Number(repetitions)*b.delta;
    }
    done=A.exactAdd(done,product(n,repetitions));
  }
  return {value:value,blocks:blocks,cycles:done};
};
