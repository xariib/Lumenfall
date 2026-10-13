
  var cometWitnessAttempts=[],cometWitnessSetItem=localStorage.setItem;
  localStorage.setItem=function(key,value){
    var entry={key:key,value:String(value),status:'started'};cometWitnessAttempts.push(entry);
    try{var result=cometWitnessSetItem.call(localStorage,key,value);entry.status='committed';return result;}
    catch(error){entry.status='threw';entry.error=String(error.message||error);throw error;}
  };
  window.qa.comet={
    shopDefs:function(){return SHOP;},buy:function(id){return buyShopItem({id:id});},
    refresh:refreshDailyQuest,refreshCost:dailyQuestRefreshCost,refreshCandidates:dailyQuestRefreshCandidates,
    restStop:restStopComplete,attempts:function(){return cometWitnessAttempts;},
    legacyForgeIds:function(){return LEGACY_RESEARCH_IDS;},foundationStudyIds:function(){return CURRENT_STUDY_IDS;},
    legacyStudyIds:function(){return LEGACY_STUDY_IDS;},trials:function(){return COMET_TRIALS;}
  };
