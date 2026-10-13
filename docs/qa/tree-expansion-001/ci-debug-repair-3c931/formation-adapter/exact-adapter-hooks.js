
  var adapterCalls=[],adapterAttempts=[],adapterAscends=[];
  var originalAuditBuy=buySpirit,originalAuditSave=localStorage.setItem,originalAuditAscend=doAscend;
  buySpirit=function(sp){var row={id:sp&&sp.id,reloadAtEntry:reloadInProgress},value;adapterCalls.push(row);try{value=originalAuditBuy.apply(this,arguments);row.result=value;return value;}catch(e){row.error=String(e);throw e;}};
  localStorage.setItem=function(key,value){var row={key:key,value:String(value),success:false};adapterAttempts.push(row);try{var result=originalAuditSave.apply(this,arguments);row.success=true;return result;}catch(e){row.error=String(e);throw e;}};
  doAscend=function(){var row={reloadAtEntry:reloadInProgress},value;adapterAscends.push(row);value=originalAuditAscend.apply(this,arguments);row.result=value;return value;};
  window.qa.audit={oldBuy:function(id){ buySpirit(SPIRITS.find(function(sp){return sp.id===id;})); },fixedBuy:function(id){
      var previousReload=reloadInProgress;
      reloadInProgress=false;
      try { return buySpirit(SPIRITS.find(function(sp){return sp.id===id;})); }
      finally { reloadInProgress=previousReload; }
    },manual:function(){
    var before = {prisms:state.prisms,ascendCount:state.ascendCount,benchmark:state.ascendRewardedDepth||0};
    var previousReload = reloadInProgress;
    reloadInProgress = false;
    try { doAscend(false); } finally { reloadInProgress = previousReload; }
    return {
      before:before,
      after:{
        prisms:state.prisms,
        ascendCount:state.ascendCount,
        benchmark:state.ascendRewardedDepth||0,
        depth:state.depth
      },
      gain:state.prisms-before.prisms
    };
  },setState:function(next){
    state = acceptPersistedState(JSON.parse(JSON.stringify(next)),'qa-simulation');
    restoreEnemyOrSpawn();
    return JSON.parse(JSON.stringify(state));
  },getState:function(){ return JSON.parse(JSON.stringify(state)); },cometAscend:function(){doAscend(false);},
    reload:function(value){if(value!==undefined)reloadInProgress=value;return reloadInProgress;},
    calls:function(){return adapterCalls;},attempts:function(){return adapterAttempts;},ascends:function(){return adapterAscends;},
    bonds:function(){return FORMATION_BONDS;},activeBonds:function(){return activeFormationBonds();}
  };
