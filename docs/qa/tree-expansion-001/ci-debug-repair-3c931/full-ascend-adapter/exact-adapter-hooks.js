
  var adapterAscendCalls=[],adapterOriginalAscend=doAscend;
  doAscend=function(){var reload=reloadInProgress,result=adapterOriginalAscend.apply(this,arguments);adapterAscendCalls.push({reloadAtEntry:reload,result:result});return result;};
  window.qa.audit={oldManual:function(){
    var before = {prisms:state.prisms,ascendCount:state.ascendCount,benchmark:state.ascendRewardedDepth||0};
    doAscend(false);
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
  },fixedManual:function(){
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
  },feedbackSave:function(){
    reloadInProgress=false;
    try { saveState(); } finally { reloadInProgress=true; }
  },freeze:function(){ if(window.__qaUiMeasurementPause)window.__qaUiMeasurementPause(true); reloadInProgress = true; document.body.classList.add('app-paused'); },
    calls:function(){return adapterAscendCalls;},reload:function(){return reloadInProgress;},
    bonds:function(){return FORMATION_BONDS;},activeBonds:function(){return activeFormationBonds();},intended:intendedFormationIds,
    startupNeeded:function(){return !!state.formationRebuild && intendedFormationIds().indexOf('ember')===-1 && state.activeParty.indexOf('ember')!==-1;}
  };
