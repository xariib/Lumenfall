'use strict';
// Lossless run receipts for bulk Ascends. Ordinary gameplay retains its exact
// existing array shape. The UI's last gain remains available after compression.
module.exports=function(A){
  return function record(summary,gain,count){
    if(count===undefined)count=1;
    if(!A.integer(count)||A.le(count,0)||!A.valid(gain)||A.lt(gain,0))throw new RangeError('Invalid Ascend receipt');
    function run(value,n){
      var last=summary.ascendGainRuns[summary.ascendGainRuns.length-1];
      if(last&&A.cmp(last.gain,value)===0)last.count=A.exactAdd(last.count,n);
      else summary.ascendGainRuns.push({gain:value,count:n});
    }
    if(!summary.ascendGainRuns&&A.cmp(count,1)===0)summary.ascendGains.push(gain);
    else{
      if(!summary.ascendGainRuns){summary.ascendGainRuns=[];summary.ascendGains.forEach(function(value){run(value,1);});}
      run(gain,count);summary.ascendGains=[gain];
    }
    summary.ascends=A.exactAdd(summary.ascends,count);
  };
};
