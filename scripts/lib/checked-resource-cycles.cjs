'use strict';
// Exact native ability-bar programs under an unchanged, guarded combat
// context. Every readiness decision is checked. A fixed period may repeat;
// a differing decision stops before that cycle instead of changing gameplay.
module.exports=function* certifyResources(A,programs,initial,canCast,requested,options){
  options=options||{};
  if(!programs.length||!A.integer(requested)||A.lt(requested,0))throw new RangeError('Invalid resource cycle request');
  var ids=Object.keys(initial),period=programs.length,certificates={},limit=requested,allFixed=true,examined=0;
  if(ids.some(function(id){return !Number.isFinite(initial[id])||initial[id]<0||initial[id]>100;}))throw new RangeError('Invalid initial ability resource');
  function apply(value,ops,id){
    for(var i=0;i<ops.length;i++){
      var op=ops[i];
      if(op.kind==='interval'&&op.ids.indexOf(id)!==-1){
        var witness=op.witnesses&&op.witnesses.indexOf(id)!==-1;
        if(witness&&!canCast[id])return null;
        if(canCast[id]){var needed=op.rate>0?Math.max(0,(100-value)/op.rate):Infinity;if(needed<op.seconds||(witness&&needed!==op.seconds))return null;}
      }else if(op.kind==='add'&&op.ids.indexOf(id)!==-1)value=Math.min(100,value+op.amount);
      else if(op.kind==='retain')value=Math.min(100,(value*op.level)/5);
      else if(op.kind==='check'&&op.id===id){var fired=!!canCast[id]&&value>=100-1e-7;if(fired!==op.fired)return null;if(fired)value=0;}
    }
    return value;
  }
  function* scalar(id,maximum){
    var value=initial[id];if(!Number.isFinite(value)||value<0||value>100)throw new RangeError('Invalid initial ability resource');
    var starts=[value],complete=0,fixedAt=null,fixedValue=null,stopped=false;
    outer:for(var group=0;group<(options.maxPeriods||16384)&&A.lt(complete,maximum);group++){
      var start=value;
      for(var j=0;j<period;j++){
        if(!A.lt(complete,maximum))break outer;
        var next=apply(value,programs[j],id);examined++;
        if(next===null){stopped=true;break outer;}value=next;complete++;
      }
      if(value===start){fixedAt=group;fixedValue=value;break;}
      starts.push(value);
      if(options.maxBlocks&&(group+1)%options.maxBlocks===0)yield {resourcePeriods:group+1,resource:id};
    }
    var fixed=fixedAt!==null,safe=fixed?maximum:A.min(maximum,complete);
    function at(n){
      if(!A.integer(n)||A.lt(n,0)||(!fixed&&A.gt(n,safe)))throw new RangeError('Resource certificate exceeded');
      var parts=A.divmod(n,period),q=parts.q,r=Number(parts.r),current;
      if(fixed&&A.ge(q,fixedAt))current=fixedValue;
      else{current=starts[Number(q)];if(current===undefined)throw new RangeError('Missing resource checkpoint');}
      for(var k=0;k<r;k++){current=apply(current,programs[k],id);if(current===null)throw new RangeError('Resource decision changed');}
      return current;
    }
    return {cycles:safe,unbounded:fixed,stopped:stopped,at:at};
  }
  for(var i=0;i<ids.length;i++){
    var id=ids[i],certificate=yield* scalar(id,limit);certificates[id]=certificate;limit=A.min(limit,certificate.cycles);allFixed=allFixed&&certificate.unbounded;
    if(A.cmp(limit,0)===0)break;
  }
  return {cycles:limit,unbounded:allFixed,examined:examined,at:function(n){if(!A.integer(n)||A.lt(n,0)||(!allFixed&&A.gt(n,limit)))throw new RangeError('Resource prefix exceeded');var out={};ids.forEach(function(id){if(A.cmp(n,0)===0)out[id]=initial[id];else{if(!certificates[id])throw new RangeError('Incomplete resource certificate');out[id]=certificates[id].at(n);}});return out;}};
};
