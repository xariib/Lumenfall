/* Injected inside the game closure for F04 tests; never shipped. */
window.__wispQa={
 ids:SPIRITS.map(function(s){return s.id;}),
 fresh:function(){return freshState();},get:function(){return JSON.parse(JSON.stringify(state));},
 set:function(s){window.__wispQaTarget=s.activeParty&&s.activeParty[0]||'ember';state=acceptPersistedState(JSON.parse(JSON.stringify(s)),'qa-wisp');restoreEnemyOrSpawn();},
 refresh:function(){lastAffordabilityAt=0;checkAffordability();},
 rarityRequirement:function(t){return rarityReq(t);},rarityCost:function(id,t){return rarityCost(this.spirit(id),t);},
 render:function(){renderSpirits();if(typeof openWispManagement==='function'){var id=window.__wispQaTarget||state.activeParty[0]||'ember';if(managedWispId!==id)openWispManagement(id);}else document.querySelectorAll('[data-wisp-progression]').forEach(function(p){p.open=true;});},cap:function(n){MODULE_MAX_LEVEL=n;},
 manage:function(id){if(typeof openWispManagement==='function'&&managedWispId!==id)openWispManagement(id);},
 renderLive:function(){renderSpirits();},
 renderCompact:function(){if(typeof closeWispManagement==='function')closeWispManagement();document.querySelectorAll('[data-wisp-progression]').forEach(function(p){p.open=false;});renderSpirits();},
 moduleCap:function(){return MODULE_MAX_LEVEL;},moduleEffect:function(id,n){return MODULE_INFO[this.spirit(id).abilityType].effect(n);},
 empowerCost:function(id){return spiritCost(this.spirit(id));},
 wallet:function(lumen,shards){state.lumen=lumen;state.shards=shards;},
 present:function(id){renderHud();document.activeElement.blur();document.querySelector('[data-wisp-card="'+(id||'ember')+'"]').scrollIntoView({block:'start',behavior:'instant'});document.getElementById('toast').classList.remove('show');},
 spirit:function(id){return SPIRITS.find(function(sp){return sp.id===id;});},
 moduleCost:function(id,n){return moduleCost(this.spirit(id),n);},ultimateCost:function(id){return ultimateSigilCost(this.spirit(id));},
 slots:function(){return [localStorage.getItem(SAVE_KEY),localStorage.getItem(RECOVERY_SAVE_KEY)];},
 save:function(){return saveState();},
 roundTrip:function(route){if(route==='backup'){state=decodeSaveBackup(currentSaveBackup());}else{if(route==='recovery')localStorage.setItem(SAVE_KEY,'{bad');state=loadState();}},
 prepare:function(){if(startupIntroFinish)startupIntroFinish();document.querySelectorAll('.overlay,#startup-intro').forEach(function(el){el.style.display='none';});setOverlayInert(null);overlayFocus=null;isNewGame=false;activateTab('spirits');}
};
