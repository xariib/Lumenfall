'use strict';
// Experimental function embedded into the complete game by the test builder.
// Free identifiers are the existing game's closure and named pure components.
module.exports=function createEndlessCycleRuntime(summary,policy,options,paidDeadline){
  var rows=[],pending=null,plan=null,lastBoundary=null,lastPassive=null,latticeMemo=new Map();
  var ignored={lumen:1,shards:1,prisms:1,motes:1,sigils:1,ascendCount:1,totalKills:1,totalTaps:1,dailyStats:1,luminousAccum:1,enemyIsLuminous:1,_autoTapAccum:1,_autoEmpowerAccum:1,activeStudies:1,studyBoosts:1,studySpeedTargets:1,studyBoostHours:1,studyUseMotes:1,moteNextAtMs:1,buffUntil:1,buffMult:1,supportBuffs:1,supportRecastUntil:1};
  function signature(withoutResources){var out={};Object.keys(state).forEach(function(key){if(!ignored[key]&&!(withoutResources&&key==='heroResource'))out[key]=state[key];});out.cycleBuff=simulationBuffMult(policy.nowMs,policy.clock);out.cycleRewardScale=simulationRewardScale(policy);out.cycleRecastReady={};state.activeParty.forEach(function(id){var sp=SPIRITS.find(function(s){return s.id===id;});if(sp.abilityType==='support')out.cycleRecastReady[id]=supportRecastSeconds(sp,policy.nowMs,policy.clock)<=SIM_EPS;});return JSON.stringify(out);}
  function eligible(){return !options.disableCycleBatching&&!options.captureTimeline&&!options.traceEverySec&&options.traceEventsFromSec===undefined&&state.riftMode==='push'&&state.owned.autoascend&&state.autoAscendEnabled&&Amount.ge(state.ascendCount,12)&&autoAscendClearedTarget()<=256&&!state.cometTrial;}
  function fullReset(){return state.depth===1+treeLevel('riftstep')&&state.enemyDepth===state.depth&&Amount.cmp(state.enemyHp,state.enemyMaxHp)===0;}
  function rotate(list,offset){return list.slice(offset).concat(list.slice(0,offset));}
  function ceil(v){return Amount.round(v,'ceil');}
  function nativeProgram(recipe){return recipe.intervals.map(function(n){return n*1000;}).concat([null]);}
  function formulate(records,passive){
    var killPath=records[0].ops.filter(function(op){return op.kind==='kill';}),count=autoAscendClearedTarget()-state.depth+1;
    if(killPath.length!==count||killPath.some(function(op,i){return op.depth!==state.depth+i;}))return null;
    var pattern=killPath.map(function(op){return op.nextChance;}).concat([records[0].ops[records[0].ops.length-1].resetChance]);
    var recipes=[],lumenRecipes=[],maxLumen=0,maxShard=0,cap=50000*treeLevel('lumenmemory');
    for(var i=0;i<records.length;i++){
      var row=records[i],ops=row.ops,last=ops[ops.length-1],shards=0,lumen=0,lumenCredits=[],shardsCredits=[],fractionLumen=false,fractionShard=false,sigils=0,bosses=0,peakLumen=cap,peakShard=0,totalMillis=0;
      if(!last||last.kind!=='retain'||row.autoTaps||row.empowers||row.automaticTicks||row.intervals.some(function(n){return typeof n!=='number'||!Number.isFinite(n)||n<=0;}))return null;
      if(ops.some(function(op){if(op.kind!=='gain')return false;var sp=SPIRITS.find(function(s){return s.id===op.id;});return passive||!sp||sp.abilityType==='support';}))return null;
      if(passive&&(!row.heroOps||row.heroOps.some(function(op){return op.kind==='interval'&&op.soleAbility;})))return null;
      row.intervals.forEach(function(n){totalMillis+=n*1000;});if(!Number.isFinite(totalMillis))return null;
      var path=ops.filter(function(op){return op.kind==='kill';});
      if(JSON.stringify(path)!==JSON.stringify(killPath)||last.resetChance!==pattern[pattern.length-1])return null;
      var lr=[];
      for(var j=0;j<ops.length;j++){
        var op=ops[j];
        if(op.kind==='kill'){
          if(!Amount.integer(op.normalLumen)||!Amount.integer(op.brightLumen))fractionLumen=true;
          if(!Amount.integer(op.normalShard)||!Amount.integer(op.brightShard))fractionShard=true;
          lr.push({kind:'kill',normal:op.normalLumen,bright:op.brightLumen});
          peakLumen=Amount.exactAdd(peakLumen,Amount.exactAdd(ceil(Amount.max(op.normalLumen,op.brightLumen)),1));
          peakShard=Amount.exactAdd(peakShard,Amount.exactAdd(ceil(Amount.max(op.normalShard,op.brightShard)),1));
          if(isBoss(op.depth)){sigils=Amount.exactAdd(sigils,sigilsFromBoss(op.depth));bosses++;}
        }else if(op.kind==='gain'){
          if(!Amount.integer(op.lumen))fractionLumen=true;if(!Amount.integer(op.shards))fractionShard=true;
          lumenCredits.push(op.lumen);shardsCredits.push(op.shards);
          lr.push({kind:'gain',amount:op.lumen});shards=Amount.exactAdd(shards,op.shards);lumen=Amount.exactAdd(lumen,op.lumen);
          peakLumen=Amount.exactAdd(peakLumen,Amount.exactAdd(ceil(op.lumen),1));peakShard=Amount.exactAdd(peakShard,Amount.exactAdd(ceil(op.shards),1));
        }else if(op.kind==='retain')lr.push({kind:'retain',factor:op.factor,cap:op.cap});
      }
      if(Amount.gt(row.endLumen,cap))return null;
      recipes.push({lumen:lumen,shards:shards,lumenCredits:lumenCredits,shardsCredits:shardsCredits,fractionLumen:fractionLumen,fractionShard:fractionShard,sigils:sigils,prisms:last.prisms,motes:last.motes,kills:count,bossKills:bosses});lumenRecipes.push(lr);
      if(i&&(Amount.cmp(last.prisms,recipes[0].prisms)!==0||Amount.cmp(last.motes,recipes[0].motes)!==0))return null;
      maxLumen=Amount.max(maxLumen,peakLumen);maxShard=Amount.max(maxShard,peakShard);
    }
    var result={key:passive?records[0].baseKey:records[0].startKey,baseKey:records[0].baseKey,passive:!!passive,records:records,recipes:recipes,lumenRecipes:lumenRecipes,pattern:pattern,cap:cap,maxLumen:maxLumen,maxShard:maxShard,
      kills:killPath.map(function(op){return {normal:op.normalShard,bright:op.brightShard,normalLumen:op.normalLumen,brightLumen:op.brightLumen};})};
    // Positive unbuffed passive net damage is sufficient for both existing
    // Boss controllers to avoid a wall verdict, independent of ready bars.
    result.passiveBossSafe=killPath.every(function(op){return !isBoss(op.depth)||Amount.gt(passiveWispDpsAt(op.depth),Amount.mul(enemyHpFor(op.depth),bossRegenRate(op.depth)));});
    for(var offset=0;offset<records.length;offset++){
      var cached={};Object.keys(result).forEach(function(key){cached[key]=result[key];});cached.key=passive?records[offset].baseKey:records[offset].startKey;cached.baseKey=records[offset].baseKey;cached.records=rotate(records,offset);cached.recipes=rotate(recipes,offset);cached.lumenRecipes=rotate(lumenRecipes,offset);
      var cache=passive?endlessPassiveCache:endlessCombatCache;cache.set(cached.key,cached);if(cache.size>(passive?32:256))cache.delete(cache.keys().next().value);
      if(!passive&&records.every(function(r){return r.baseKey===cached.baseKey&&r.heroOps&&r.heroOps.length;})){
        cached.programKey=JSON.stringify(cached.records.map(function(r){return [r.ops,r.intervals,r.heroOps];}));
        var list=endlessResourceCache.get(cached.baseKey)||[];if(!list.some(function(p){return p.programKey===cached.programKey;}))list.push(cached);if(list.length>32)list.shift();endlessResourceCache.set(cached.baseKey,list);if(endlessResourceCache.size>8)endlessResourceCache.delete(endlessResourceCache.keys().next().value);
      }
    }
    return result;
  }
  function boundary(){
    if(!eligible()||!fullReset())return;
    if(lastBoundary!==null&&Amount.cmp(lastBoundary,state.ascendCount)===0)return;
    var key=signature(),captureHero=true,baseKey=signature(true);
    if(pending){
      var row={startKey:pending.key,baseKey:pending.baseKey,ops:pending.ops,intervals:pending.intervals,heroOps:pending.heroOps,endHero:clonePersistedValue(state.heroResource),endLumen:state.lumen,autoTaps:summary.autoTaps-pending.autoTaps,empowers:summary.empowers-pending.empowers,automaticTicks:pending.automaticTicks};
      row.fingerprint=JSON.stringify([row.startKey,row.ops,row.intervals,row.autoTaps,row.empowers,row.automaticTicks]);rows.push(row);if(rows.length>64)rows.shift();
      if(treeLevel('chargememory')<5&&!row.autoTaps&&!row.automaticTicks&&!row.ops.some(function(op){return op.kind==='gain';})){
        var fingerprint=JSON.stringify([row.baseKey,row.ops,row.intervals,row.heroOps]);if(lastPassive===fingerprint)formulate([row],true);lastPassive=fingerprint;
      }else lastPassive=null;
      for(var p=1;p<=Math.min(32,Math.floor(rows.length/2));p++){
        var a=rows.length-2*p,b=rows.length-p,match=key===rows[a].startKey;
        for(var k=0;match&&k<p;k++)match=rows[a+k].fingerprint===rows[b+k].fingerprint;
        if(match){plan=formulate(rows.slice(b));if(plan)break;}
      }
    }
    pending={key:key,baseKey:baseKey,captureHero:captureHero,ops:[],intervals:[],heroOps:[],automaticTicks:0,autoTaps:summary.autoTaps,empowers:summary.empowers};lastBoundary=state.ascendCount;
  }
  function horizon(clock){
    var best=clock.latticeRemaining(),blocked=false;
    best.strict=false;
    function consider(d){d.strict=true;if(clock.compareDuration(d,best)<=0)best=d;}
    function deadline(until,early){if(!until)return;var d=clock.latticeUntil(until,early);if(Amount.le(d.ticks,0))return;consider(d);}
    deadline(state.buffUntil);
    if(state.supportBuffs)Object.keys(state.supportBuffs.sources).forEach(function(id){deadline(state.supportBuffs.sources[id].until);});
    state.activeParty.forEach(function(id){var sp=SPIRITS.find(function(s){return s.id===id;});if(sp.abilityType!=='support')return;var until=state.supportRecastUntil[id]||0,d=clock.latticeUntil(until,cycleRecastThreshold);if(Amount.gt(d.ticks,0))consider(d);});
    Object.keys(state.studyBoosts).forEach(function(id){var b=state.studyBoosts[id];deadline(b.startedAtMs);deadline(b.expiresAtMs);});
    state.activeStudies.forEach(function(active){var left=paidDeadline(active);if(!left||Amount.le(left.ticks,0))blocked=true;else consider(left);});
    var mote=clock.latticeUntil(state.moteNextAtMs);if(Amount.le(mote.ticks,0))blocked=true;else consider(mote);
    return blocked?null:best;
  }
  function queuedPrices(){
    var costs=[];
    RESEARCH.forEach(function(node){if(!state.researchQueue[node.id])return;var e=researchEligibility(node);if(e.unlocked&&!e.maxed&&getResearchBuyPlan(node,1).reason!=='unavailable')costs.push(researchCostForLevels(node,state.research[node.id],1));});
    if(state.activeStudies.length<studySlotCount())LONG_STUDIES.forEach(function(node){if(!state.studyQueue[node.id])return;var p=getStudyStartPlan(node);if(p.eligible)costs.push(p.cost);});
    return costs;
  }
  function* prepare(clock){
    boundary();var exactKey=eligible()&&fullReset()?signature():null;
    if(exactKey)plan=plan&&!plan.passive&&plan.key===exactKey?plan:endlessCombatCache.get(exactKey)||(treeLevel('chargememory')<5?endlessPassiveCache.get(signature(true)):null)||null;
    if(!clock||!eligible()||!fullReset())return null;
    var budget=horizon(clock);if(!budget)return null;
    var resources=null,resourceFallback=false,baseKey=signature(true);
    function* certify(candidate){
      var canCast={};SPIRITS.forEach(function(sp){canCast[sp.id]=(state.spirits[sp.id]||0)>0&&state.activeParty.indexOf(sp.id)!==-1&&supportRecastSeconds(sp,policy.nowMs,policy.clock)<=SIM_EPS;});
      if(candidate.records.some(function(r){return r.heroOps.some(function(op){return op.kind==='interval'&&op.soleAbility&&(!op.witnesses||!op.witnesses.length);});}))return null;
      var resourceCursor=cycleResources(Amount,candidate.records.map(function(r){return r.heroOps;}),clonePersistedValue(state.heroResource),canCast,16384*candidate.records.length,{maxBlocks:32}),resourceStep=null;
      try{do{resourceStep=resourceCursor.next();if(!resourceStep.done&&options.resumable)yield {preparingResources:true,resource:resourceStep.value.resource};}while(!resourceStep.done);}finally{if(!resourceStep||!resourceStep.done)resourceCursor.return();}
      return resourceStep.value.unbounded?resourceStep.value:null;
    }
    if(!plan||plan.passive){
      var candidates=(endlessResourceCache.get(baseKey)||[]).slice();if(plan&&plan.passive)candidates.push(plan);plan=null;
      for(var candidateIndex=0;candidateIndex<candidates.length;candidateIndex++){var candidate=candidates[candidateIndex];if(candidate.baseKey!==baseKey)continue;var certificate=yield* certify(candidate);if(certificate){plan=candidate;resources=certificate;resourceFallback=true;break;}}
    }
    var key=resourceFallback||plan&&plan.passive?baseKey:exactKey;
    if(!plan||key!==(resourceFallback?plan.baseKey:plan.key)||Amount.gt(state.lumen,plan.cap))return null;
    if(policy.allowBossRetreat&&!plan.passiveBossSafe&&Number.isFinite(policy.bossRetreatNotBeforeMs)){
      var retreat=clock.latticeUntil(policy.bossRetreatNotBeforeMs);if(Amount.le(retreat.ticks,0))return null;retreat.strict=true;if(clock.compareDuration(retreat,budget)<=0)budget=retreat;
    }
    var period=cycleLatticeClock(Amount,plan.records.map(function(r){return r.intervals;}),budget,latticeMemo),maximum=period.cycles;
    if(budget.strict&&Amount.cmp(period.remaining.ticks,0)===0)maximum=Amount.max(0,Amount.exactSub(maximum,1));
    var count=cycleEconomyBound(Amount,maximum,plan.maxLumen,shardsAvailable(),plan.maxShard,queuedPrices()).cycles;
    var creditPlans=[];
    function creditPlan(object,field,reward){
      var hasKills=reward==='lumen'||reward==='shards',fixed=plan.recipes.map(function(r){return hasKills?r[reward+'Credits']:[r[reward]||0];});
      var choices=hasKills?plan.kills.map(function(k){return reward==='lumen'?{normal:k.normalLumen,bright:k.brightLumen}:{normal:k.normal,bright:k.bright};}):[];
      var certificate=cycleNativeCredit(Amount,object[field],fixed,choices,count,{ordered:function(){
        if(!hasKills)return fixed.map(function(row){return row.map(function(amount){return {kind:'gain',amount:amount};});});
        return plan.records.map(function(r){var index=0,out=[];r.ops.forEach(function(op){if(op.kind==='kill')out.push({kind:'kill',index:index++});else if(op.kind==='gain')out.push({kind:'gain',amount:reward==='lumen'?op.lumen:op.shards});});return out;});
      }});count=Amount.min(count,certificate.cycles);
      creditPlans.push({object:object,field:field,reward:reward,certificate:certificate,hasKills:hasKills});
    }
    ['shards','prisms','motes','sigils'].forEach(function(key){creditPlan(state,key,key);});
    [['lumenGained','lumen'],['shardGained','shards'],['sigilsGained','sigils'],['motesGained','motes']].forEach(function(pair){creditPlan(summary,pair[0],pair[1]);});
    if(Amount.lt(count,2))return null;
    var phasePrograms=[];plan.records.forEach(function(r){phasePrograms=phasePrograms.concat(nativeProgram(r));});
    function phaseLimit(value,achieved){
      if(!achieved)return count;
      var pieces=Amount.divmod(count,plan.records.length),cap=treeLevel('phasememory')?999.999:0;
      var r=cycleNativePhase(Amount,phasePrograms,pieces.q,value,cap,{threshold:1000-1e-7}),safe=Amount.mul(r.cycles,String(plan.records.length)+'e0');
      if(r.stopped)return safe;
      value=r.value;
      for(var i=0;i<Number(pieces.r);i++){r=cycleNativePhase(Amount,nativeProgram(plan.records[i]),1,value,cap,{threshold:1000-1e-7});if(r.stopped)return safe;value=r.value;safe=Amount.exactAdd(safe,1);}
      return safe;
    }
    count=Amount.min(count,phaseLimit(state._autoTapAccum||0,state.achieved.autotap),phaseLimit(state._autoEmpowerAccum||0,state.achieved.labmaster));
    if(Amount.lt(count,2))return null;
    var patternKey=JSON.stringify(plan.pattern),cache=endlessPityCache;
    function* ensure(n){
      if(!Amount.gt(n,cache.generated))return;
      var initial=cache.generated,cursor=cache.orbit.cursor(Amount.exactSub(n,initial),{maxBlocks:16}),step;
      try{
        do{step=cursor.next();cache.generated=Amount.exactAdd(initial,step.value.cycles);if(!step.done&&options.resumable)yield {preparingCycles:true,regions:step.value.regions};}while(!step.done);
      }finally{if(!step||!step.done)cursor.return();}
    }
    if(cache&&cache.key===patternKey&&Amount.ge(state.ascendCount,cache.lastAscend)){
      var next=Amount.exactAdd(cache.logical,Amount.exactSub(state.ascendCount,cache.lastAscend));yield* ensure(next);var current=cache.orbit.position(next);
      if(current.phase===state.luminousAccum&&current.flag===state.enemyIsLuminous){cache.logical=next;cache.lastAscend=state.ascendCount;}else cache=null;
    }else cache=null;
    if(!cache)cache={key:patternKey,orbit:createLuminousOrbitSession(Amount,createLuminousOrbit(Amount,{phaseCeiling:.999999}),plan.pattern,state.luminousAccum,state.enemyIsLuminous),logical:0,generated:0,lastAscend:state.ascendCount};
    endlessPityCache=cache;var target=Amount.exactAdd(cache.logical,count);yield* ensure(Amount.max(target,'1e25'));
    var before=cache.orbit.position(cache.logical),after=cache.orbit.position(target),spawns={phase:after.phase,flag:after.flag,counts:after.counts.map(function(v,i){return Amount.exactSub(v,before.counts[i]);})};
    var lumen=cycleTailLumen(Amount,createLuminousOrbit(Amount,{phaseCeiling:.999999}),cache.orbit,plan.pattern,plan.lumenRecipes,count,plan.cap,64,{orbitOffset:cache.logical,initial:state.lumen});
    if(!lumen.independent&&!lumen.exactInitial)return null;
    var gain=cycleAggregate(Amount,plan.recipes,plan.kills,spawns.counts,count),last=plan.records[Number(Amount.mod(Amount.exactSub(count,1),plan.records.length))];
    for(var creditIndex=0;creditIndex<creditPlans.length;creditIndex++){
      var credit=creditPlans[creditIndex];if(credit.certificate.mode!=='native')continue;
      var fold=credit.certificate.finishCursor(credit.hasKills?spawns.counts:[],count,cache.orbit,cache.logical,{maxBlocks:1}),step=null;
      try{do{step=fold.next();if(!step.done&&options.resumable)yield {preparingCredits:true,foldRegions:step.value.foldRegions};}while(!step.done);}
      finally{if(!step||!step.done)fold.return();}
      credit.nativeValue=step.value;
    }
    var pieces=Amount.divmod(count,plan.records.length),tap=state._autoTapAccum||0,empower=state._autoEmpowerAccum||0;
    function advancePhase(value){
      if(!treeLevel('phasememory'))return 0;
      value=cycleNativePhase(Amount,phasePrograms,pieces.q,value,999.999).value;
      for(var i=0;i<Number(pieces.r);i++)value=cycleNativePhase(Amount,nativeProgram(plan.records[i]),1,value,999.999).value;
      return value;
    }
    if(state.achieved.autotap)tap=advancePhase(tap);if(state.achieved.labmaster)empower=advancePhase(empower);
    return {duration:period.durationFor(count),count:count,apply:function(){
      creditPlans.forEach(function(p){p.object[p.field]=p.certificate.mode==='native'?p.nativeValue:creditAmount(p.object[p.field],gain[p.reward]);});state.lumen=lumen.lumen;
      state.totalKills=creditAmount(state.totalKills,gain.kills);state.ascendCount=creditAmount(state.ascendCount,count);
      state.heroResource=resources?resources.at(count):clonePersistedValue(last.endHero);state._autoTapAccum=tap;state._autoEmpowerAccum=empower;
      state.luminousAccum=spawns.phase;state.enemyIsLuminous=spawns.flag;ascendRunToken={};
      ['kills','bossKills','luminousKills','ascends'].forEach(function(key){if(Amount.gt(gain[key],0))trackDaily(key,gain[key]);});
      ['kills','bossKills','luminousKills'].forEach(function(key){summary[key]=creditAmount(summary[key],gain[key]);});
      summary.fastForwardedKills=creditAmount(summary.fastForwardedKills,gain.kills);
      cycleRecordAscends(summary,plan.recipes[0].prisms,count);cache.logical=target;cache.lastAscend=state.ascendCount;
      simulationRecordAchievements(summary);rows=[];pending=null;plan=null;lastBoundary=null;lastPassive=null;
    }};
  }
  return {boundary:boundary,prepare:prepare,active:function(){return !!pending;},
    capturesResources:function(){return !!(pending&&pending.captureHero);},
    interval:function(n,soleAbility){if(pending){pending.intervals.push(n);if(pending.captureHero){var rate=(100/ABILITY_BASE_CYCLE_SEC)*fillRateMult(),ids=poweredActiveIds().slice(),witnesses=[];if(soleAbility)ids.forEach(function(id){var sp=SPIRITS.find(function(s){return s.id===id;}),cur=Math.max(0,Math.min(100,state.heroResource[id]||0)),needed=Math.max(0,(100-cur)/rate,supportRecastSeconds(sp,policy.nowMs,policy.clock));if(needed===n)witnesses.push(id);});pending.heroOps.push({kind:'interval',seconds:n,rate:rate,ids:ids,witnesses:witnesses,soleAbility:!!soleAbility});}}},
    fill:function(amount){if(pending&&pending.captureHero)pending.heroOps.push({kind:'add',ids:poweredActiveIds().slice(),amount:amount});},
    charge:function(id,amount){if(pending&&pending.captureHero)pending.heroOps.push({kind:'add',ids:[id],amount:amount});},
    heroCheck:function(id,nowMs,clock){if(pending&&pending.captureHero){var sp=SPIRITS.find(function(s){return s.id===id;}),fired=(state.spirits[id]||0)>0&&(state.heroResource[id]||0)>=100-1e-7&&supportRecastSeconds(sp,nowMs,clock)<=SIM_EPS;pending.heroOps.push({kind:'check',id:id,fired:!!fired});}},
    automaticTick:function(){if(pending)pending.automaticTicks++;},
    kill:function(op){if(pending)pending.ops.push(op);},
    gain:function(lumen,shards,id){if(pending)pending.ops.push({kind:'gain',lumen:lumen,shards:shards,id:id});},
    ascend:function(gain,dust){if(pending){pending.ops.push({kind:'retain',factor:treeLevel('lumenmemory')/20,cap:50000*treeLevel('lumenmemory'),prisms:gain,motes:dust,resetChance:isBoss(state.depth)?null:eliteChance(state.depth)});if(pending.captureHero)pending.heroOps.push({kind:'retain',level:treeLevel('chargememory')});}}
  };
};
