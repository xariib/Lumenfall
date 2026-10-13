'use strict';
// Full production-IIFE Comet acceptance. All gameplay, migration, settlement,
// save and defeat owners are real. Browser geometry has its own actual UI lane.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {app,seed,clone,P,R,CLOCK}=require('./comet-expansion-harness.cjs');
const {oracle,OLD_DEEDS,NEW_DEEDS,RETIRED,CATALOG,CLAIMS,POLICY,replaceFunction,replaceOne,pendingIds}=require('./comet-expansion-numerical.cjs');
const EVENT_IDS={comet_first_command:'firstCommand',comet_first_recharge:'firstRecharge',comet_boss_strike:'bossStrike',comet_called_kill:'calledKill'};
const NEW_FIELDS=['cometUpgrades','cometCharges','cometWork','cometMeteorUsed','cometCalled','cometEvents','cometClaims'];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const emptyEvents=()=>({firstCommand:false,firstRecharge:false,bossStrike:false,calledKill:false});
function fixture(q){
  const s=seed(q);s.comets=10000;
  for(const [id]of OLD_DEEDS)s.achieved[id]=true;
  return s;
}
function prepared(source){const e=app(source);e.q.set(fixture(e.q));return e;}
function ownedFixture(q,id='meteor',depth=21){
  const s=fixture(q);s.owned[id]=true;s.cometCharges=1;s.depth=s.enemyDepth=depth;
  s.enemyMaxHp=s.enemyHp=10000;
  return s;
}
function legacyFixture(q,version=2,mask=7,wallet=100){
  const s=fixture(q);s.schemaVersion=version;if(version===0)delete s.schemaVersion;
  for(const key of NEW_FIELDS)delete s[key];
  delete s.owned.meteor;delete s.owned.starcall;
  for(const [id]of NEW_DEEDS)delete s.achieved[id];
  RETIRED.forEach(([id],index)=>{s.owned[id]=!!(mask&(1<<index));});
  s.comets=wallet;s.owned.autoascend=true;s.autoAscendEnabled=true;s.autoAscendTargetDepth=120;
  s.ascendCount=3;s.cometCosmetics={trail:!!(mask&2),crest:!!(mask&4)};
  s.cometTrial=mask&1?{id:'quiet',target:50,phase:'active',startedAscend:3,failed:false,reason:''}:null;
  s.cometTrialMarks={quiet:true,single:true};s.cometTrialResult={id:'single',target:50,outcome:'completed'};
  s.nodes.echo=7;s.nodes.lumenmemory=6;s.nodes.stardust=4;
  s.research.charge=11;s.research.spillway=7;s.longStudyLevels.wispascend=5;s.longStudyLevels.luminousdistill=7;
  s.activeStudies=[{id:'guardmastery',remainingSec:321,totalDurationSec:900,speedMult:1.5}];
  return s;
}
function snapshot(e){return {state:clone(e.q.get()),slots:Array.from(e.storage),token:e.q.runToken(),attempts:e.attempts.length,writes:e.writes.length};}
function ownedState(e,s){e.q.set(s);return e.q.get();}
function commandOnlyFields(s){return {charges:s.cometCharges,work:s.cometWork,used:s.cometMeteorUsed,called:s.cometCalled,events:s.cometEvents};}

function runCore(source,options={}){
  const report={status:'RUNNING',checks:0,groups:[],witnesses:[],negativeControls:[]};
  if(options.progress)options.progress(report);
  const eq=(a,b,label)=>{assert.deepEqual(a,b,label);report.checks++;};
  const ok=(value,label)=>{assert(value,label);report.checks++;};
  function group(name,fn){report.currentGroup=name;const before=report.checks;fn();report.groups.push({name,checks:report.checks-before,status:'PASS'});}
  function unchanged(e,before,label,attempts=true){
    eq(e.q.get(),before.state,label+' live endpoint');eq(Array.from(e.storage),before.slots,label+' raw slots');
    eq(e.q.runToken()===before.token,true,label+' original run token identity');
    if(attempts)eq(e.attempts.length,before.attempts,label+' no storage attempt');
  }
  function paid(e,id,price){
    const before=clone(e.q.get()),attempts=e.attempts.length,plan=e.q.buyPlan(id);
    eq(plan.cost,price,'independent quote '+id);eq(plan.available,true,'available '+id);
    eq(e.q.buy(id),true,'actual paid handler '+id);
    eq(before.comets-e.q.get().comets,price,'one exact independent debit '+id);
    eq(e.attempts.slice(attempts).filter(a=>a.operation==='set'&&a.key===P).length,1,'one primary write '+id);
    eq(e.attempts.slice(attempts).filter(a=>a.operation==='set'&&a.key===R).length,1,'one recovery write '+id);
  }
  group('fresh schema, fixed catalog and historical reward policy',()=>{
    const e=app(source),q=e.q,s=q.get();
    eq(q.schema(),4,'schema4 is actual');eq(s.schemaVersion,4,'fresh schema4');
    eq(s.cometUpgrades,{cometreservoir:0,cometcycle:0,meteorcore:0},'three separate raw level fields');
    eq(commandOnlyFields(s),{charges:0,work:0,used:false,called:false,events:emptyEvents()},'no gifts/events on fresh load');
    eq(s.cometClaims,{policy:POLICY,retired:{comettrials:'absent',rifttrail:'absent',starfallcrest:'absent'},deeds:{}},'closed fresh ledger');
    eq(s.owned.meteor,false,'Meteor unowned');eq(s.owned.starcall,false,'Call unowned');
    eq(q.shopDefs().map(r=>r.id),CATALOG.map(r=>r.id),'exact six-row catalog');
    eq(q.achievementDefs().map(a=>[a.id,a.reward]),OLD_DEEDS.concat(NEW_DEEDS),'all23 old rewards/order plus four fixed rewards');
    eq(OLD_DEEDS.reduce((n,r)=>n+r[1],0),683,'old pool');eq(NEW_DEEDS.reduce((n,r)=>n+r[1],0),50,'new pool');
    eq(CATALOG.reduce((n,r)=>n+r.prices.reduce((a,b)=>a+b,0),0),1380,'whole catalog');
    eq(CLAIMS.length,30,'bounded known identities');eq(CLAIMS.reduce((n,r)=>n+r[1],0),1083,'bounded family amount');
    eq(q.capacity(),1,'base capacity');eq(q.workPerKill(),20,'base work');
    for(const [id]of RETIRED)eq(Object.prototype.hasOwnProperty.call(s.owned,id),false,'retired owned key absent '+id);
    for(const id of ['unknown','comettrials','rifttrail','starfallcrest']){
      const b=snapshot(e);eq(q.buyPlan(id).available,false,'unknown/retired quote refuses '+id);eq(q.buy({id,cost:0}),false,'canonical catalog rejects forgery '+id);unchanged(e,b,id);
    }
  });
  group('old0/1/2 paid migrations and one-pass retirement compensation',()=>{
    const e=app(source),q=e.q;
    for(const version of [0,1,2])for(let mask=0;mask<8;mask++)for(const wallet of [0,0.125,0.1,2**54,2**54-10,1e30]){
      const old=legacyFixture(q,version,mask,wallet),raw=JSON.stringify(old);
      const ids=RETIRED.filter((_,i)=>mask&(1<<i)).map(([id])=>'retirement:'+id),expected=oracle.settleKnownClaims(wallet,ids);
      const accepted=q.accept(old,'synthetic-old'+version);
      eq(JSON.stringify(old),raw,'migration preserves input bytes/object');eq(accepted.schemaVersion,4,'ordered migration reaches4');
      eq(accepted.comets,expected.wallet,'fixed once retirement amount');eq(pendingIds(accepted),expected.pendingIds,'unrepresentable identities stay due');
      eq(accepted.owned.meteor,false,'no migrated Meteor');eq(accepted.owned.starcall,false,'no migrated Call');
      eq(accepted.cometUpgrades,{cometreservoir:0,cometcycle:0,meteorcore:0},'no migrated new levels');
      eq(commandOnlyFields(accepted),{charges:0,work:0,used:false,called:false,events:emptyEvents()},'migration creates no command/recharge facts');
      eq(accepted.cometClaims.deeds,{},'old earned flags do not create retroactive683 claims');
      for(const [id]of OLD_DEEDS)eq(accepted.achieved[id],true,'old earned flag '+id);
      for(const [id]of NEW_DEEDS)eq(accepted.achieved[id]===true,false,'new event Deed begins unearned '+id);
      for(let i=0;i<RETIRED.length;i++){
        const id=RETIRED[i][0];eq(q.hasLegacy(id,accepted),!!(mask&(1<<i)),'snapshot entitlement '+id);
        eq(Object.prototype.hasOwnProperty.call(accepted.owned,id),false,'old key retired '+id);
      }
      eq(accepted.cometCosmetics,old.cometCosmetics,'paid cosmetics retained');eq(accepted.cometTrial,old.cometTrial,'active paid Trial retained');
      eq(accepted.cometTrialMarks,old.cometTrialMarks,'marks retained');eq(accepted.cometTrialResult,old.cometTrialResult,'result retained');
      for(const key of ['nodes','research','longStudyLevels','activeStudies','studyQueue','studySpeedTargets','formationPresets','lastSeen','autoAscendEnabled','autoAscendTargetDepth','ascendCount'])eq(accepted[key],old[key],'old paid/progression field '+key);
    }
    for(const value of [1,'true',{},false,null]){
      const old=legacyFixture(q,2,0,0);old.owned.comettrials=value;
      eq(q.accept(old).cometClaims.retired.comettrials,'absent','legacy entitlement uses strict true');
    }
    const raw=JSON.stringify(legacyFixture(q,2,7,100)),loaded=app(source,[[P,raw]]);
    eq(loaded.q.get().comets,450,'actual raw primary loader compensation');eq(loaded.storage.get(P),raw,'read does not overwrite original schema2 bytes');
    eq(loaded.q.save(),true,'actual schema4 save');const first=clone(loaded.q.get());
    const reloaded=app(source,Array.from(loaded.storage));eq(reloaded.q.get(),first,'settled old paid identities never replay');
    eq(reloaded.q.selectCosmetic('trail',false),true,'retained Trail original owner');eq(reloaded.q.selectCosmetic('crest',false),true,'retained Crest original owner');
    eq(reloaded.q.cancelTrial(),true,'retained active Trial can cancel');eq(reloaded.q.queueTrial('quiet',50),true,'retained Trial can queue free');
    eq(reloaded.q.get().comets,450,'legacy controls charge no new price');
    report.witnesses.push({id:'old-loader',rawSha256:sha(raw),finalComets:first.comets,claims:first.cometClaims});
  });
  group('strict current4 paid data, recovery preservation and explicit restore',()=>{
    const e=prepared(source),q=e.q,valid=clone(q.get()),bad=[];
    function add(id,mutate,code='invalid-comet-state'){const s=clone(valid);mutate(s);bad.push({id,s,code});}
    for(const field of NEW_FIELDS)add('missing-'+field,s=>{delete s[field];},field==='cometClaims'?'invalid-comet-claims':'invalid-comet-state');
    for(const field of ['meteor','starcall']){
      add('missing-owned-'+field,s=>{delete s.owned[field];});add('nonboolean-owned-'+field,s=>{s.owned[field]=1;});
    }
    for(const id of RETIRED.map(r=>r[0]).concat(['cometreservoir','cometcycle','meteorcore']))add('redundant-owned-'+id,s=>{s.owned[id]=true;});
    add('unknown-level',s=>{s.cometUpgrades.extra=1;});add('array-levels',s=>{s.cometUpgrades=[];});
    for(const value of [-1,0.5,NaN,Infinity,'1',null])add('invalid-level-'+String(value),s=>{s.cometUpgrades.cometreservoir=value;});
    add('unknown-event',s=>{s.cometEvents.extra=false;});add('nonboolean-event',s=>{s.cometEvents.firstCommand=1;});
    add('orphan-event',s=>{s.cometEvents.firstCommand=true;});add('orphan-boss',s=>{s.owned.starcall=true;s.cometEvents.firstCommand=true;s.cometEvents.bossStrike=true;});
    add('orphan-called-kill',s=>{s.owned.meteor=true;s.cometEvents.firstCommand=true;s.cometEvents.calledKill=true;});
    add('earned-without-event',s=>{s.achieved.comet_first_command=true;});
    for(const value of [-1,0.5,4,Infinity])add('invalid-charges-'+value,s=>{s.owned.meteor=true;s.cometCharges=value;});
    for(const value of [-1,0.5,4000,Infinity])add('invalid-work-'+value,s=>{s.owned.meteor=true;s.cometWork=value;});
    add('full-bank-work',s=>{s.owned.meteor=true;s.cometCharges=1;s.cometWork=1;});
    add('orphan-charge',s=>{s.cometCharges=1;});add('nonboolean-used',s=>{s.cometMeteorUsed=1;});add('nonboolean-called',s=>{s.cometCalled=0;});
    add('marker-no-owner',s=>{s.cometMeteorUsed=true;});
    add('called-not-luminous',s=>{s.owned.starcall=true;s.cometEvents.firstCommand=true;s.cometCalled=true;});
    add('called-boss',s=>{s.owned.starcall=true;s.cometEvents.firstCommand=true;s.cometCalled=true;s.enemyIsLuminous=true;s.depth=s.enemyDepth=100;});
    add('marker-wrong-encounter',s=>{s.owned.meteor=true;s.cometEvents.firstCommand=true;s.cometMeteorUsed=true;s.enemyDepth=3;});
    add('wrong-policy',s=>{s.cometClaims.policy='unknown';},'invalid-comet-claims');
    add('extra-claims-field',s=>{s.cometClaims.extra=1;},'invalid-comet-claims');
    add('missing-retirement',s=>{delete s.cometClaims.retired.rifttrail;},'invalid-comet-claims');
    add('unknown-retirement',s=>{s.cometClaims.retired.rifttrail='none';},'invalid-comet-claims');
    add('unknown-deed',s=>{s.cometClaims.deeds.unknown=true;},'invalid-comet-claims');
    add('false-pending-deed',s=>{s.cometClaims.deeds.d25=false;},'invalid-comet-claims');
    add('orphan-pending-deed',s=>{s.cometClaims.deeds.d25=true;s.achieved.d25=false;},'invalid-comet-claims');
    for(const entry of bad){
      const before=JSON.stringify(entry.s);let error=null;try{q.accept(entry.s);}catch(caught){error=caught;}
      eq(error&&error.code,entry.code,'strict refusal '+entry.id);eq(JSON.stringify(entry.s),before,'bad snapshot stays untouched '+entry.id);
    }
    for(const entry of bad.filter(x=>['missing-cometClaims','wrong-policy','orphan-pending-deed','redundant-owned-rifttrail','full-bank-work'].includes(x.id))){
      const raw=JSON.stringify(entry.s),recovery=JSON.stringify(valid),loaded=app(source,[[P,raw],[R,recovery]]);
      eq(loaded.q.get(),valid,'valid recovery loaded '+entry.id);eq(loaded.q.persistenceStatus().blocked,true,'bad primary blocks writes');
      eq(loaded.q.persistenceStatus().recovered,true,'recovery provenance');ok(/Comet/.test(loaded.q.persistenceStatus().blockedReason),'accurate Comet-history explanation');
      const before=snapshot(loaded);eq(loaded.q.save(),false,'blocked autosave');unchanged(loaded,before,'blocked recovery preservation');
      eq(loaded.storage.get(P),raw,'exact malformed primary retained');eq(loaded.storage.get(R),recovery,'exact recovery retained');
      const neither=app(source,[[P,raw],[R,'{broken recovery']]);eq(neither.q.persistenceStatus().blocked,true,'both invalid stay blocked');
      eq(neither.storage.get(P),raw,'no recovery preserves primary');eq(neither.storage.get(R),'{broken recovery','no recovery preserves recovery bytes');
      const target=prepared(source);target.q.save();const original=snapshot(target);
      target.q.restore('LUMENFALL1:'+encodeURIComponent(raw));unchanged(target,original,'invalid explicit backup');eq(target.reloads(),0,'invalid backup never reloads');
      loaded.q.restore('LUMENFALL1:'+encodeURIComponent(recovery));eq(loaded.q.lifecycle().reloadInProgress,true,'valid explicit restore owns reload boundary');
      eq(loaded.storage.get(P),loaded.storage.get(R),'valid restore commits both exact slots');loaded.drain();eq(loaded.reloads(),1,'one actual scheduled reload');
    }
    const corrupt=app(source,[[P,'{corrupt'],[R,JSON.stringify(valid)]]);
    eq(corrupt.q.persistenceStatus().blocked,false,'ordinary corrupt primary keeps old repair semantics');eq(JSON.parse(corrupt.storage.get(P)),valid,'ordinary recovery repairs primary');
    const future=clone(valid);future.schemaVersion=5;const futureRaw=JSON.stringify(future),futureLoaded=app(source,[[P,futureRaw],[R,JSON.stringify(valid)]]);
    eq(futureLoaded.q.persistenceStatus().blocked,true,'future schema remains separate blocked case');eq(futureLoaded.storage.get(P),futureRaw,'future primary unchanged');
    const over=ownedFixture(q);over.cometUpgrades={cometreservoir:1e30,cometcycle:9,meteorcore:7};
    const accepted=q.accept(over);eq(accepted.cometUpgrades,over.cometUpgrades,'raw overcaps never rewritten');eq(q.capacity(accepted),3,'capacity effective cap');eq(q.workPerKill(accepted),40,'Engine effective cap');eq(q.upgradeLevel('meteorcore',accepted),4,'Core effective cap');
    eq(q.get(),valid,'all alternate snapshot validation is independent of global state');
    report.witnesses.push({id:'strict-schema',invalidCases:bad.map(x=>({id:x.id,code:x.code})),overcaps:accepted.cometUpgrades});
  });
  group('actual six-type purchases and four event Deeds',()=>{
    const e=prepared(source),q=e.q;
    paid(e,'autoascend',100);eq(q.get().autoAscendEnabled,true,'existing first Auto-Ascend enabled');eq(q.get().autoAscendTargetDepth,250,'existing target choice preserved');
    paid(e,'meteor',100);eq(q.get().cometCharges,1,'first command grants one');eq(q.get().cometEvents,emptyEvents(),'initial gift is not a command or recharge');
    paid(e,'starcall',140);eq(q.get().cometCharges,1,'second command grants none');
    eq(q.command('starcall'),true,'actual Call');eq(q.get().cometCharges,0,'Call spends exactly one');eq(q.get().cometEvents.firstCommand,true,'actual first command event');eq(q.get().achieved.comet_first_command,true,'actual first command Deed');
    paid(e,'cometreservoir',60);eq(q.capacity(),2,'first Reserve increases cap');eq(q.get().cometCharges,0,'Reserve grants no charge');
    const called=q.kill();eq(called.kills,1,'actual called enemy defeated');eq(q.get().cometEvents.calledKill,true,'actual called defeat event');eq(q.get().achieved.comet_called_kill,true,'actual called defeat Deed');
    q.get().riftMode='farm';q.get().farmDepth=q.get().depth=101;q.get().enemyDepth=101;q.spawn(false);
    const recharge=q.batch(199);eq(recharge.kills,199,'real Farm count');eq(q.get().cometCharges,1,'199 subsequent kills complete200');
    eq(q.get().cometWork,0,'exact threshold residual');eq(q.get().cometEvents.firstRecharge,true,'real recharge fact');eq(q.get().achieved.comet_first_recharge,true,'real recharge Deed');
    q.get().riftMode='push';q.get().farmDepth=0;q.get().depth=100;q.spawn(false);
    eq(q.command('meteor'),true,'actual positive boss Meteor');eq(q.get().cometEvents.bossStrike,true,'boss strike event');eq(q.get().achieved.comet_boss_strike,true,'boss strike Deed');
    paid(e,'cometreservoir',120);
    q.get().cometWork=3970;
    for(const price of [80,140,220]){paid(e,'cometcycle',price);eq(q.get().cometWork,3970,'Engine preserves old work');}
    for(const price of [45,75,120,180])paid(e,'meteorcore',price);
    eq(q.get().comets,10000-1380+50,'all actual purchases and all four new rewards reconcile');eq(q.capacity(),3,'final Reserve cap');eq(q.workPerKill(),40,'final Engine rate');
    for(const row of CATALOG){const before=snapshot(e);eq(q.buyPlan(row.id).reason,'cap','exact catalog cap '+row.id);eq(q.buy(row.id),false,'capped handler refuses');unchanged(e,before,'cap '+row.id);}
    const before=clone(q.get());q.save();const again=app(source,Array.from(e.storage));eq(again.q.get(),before,'all paid levels/events/currency persist');
    report.witnesses.push({id:'complete-real-catalog',comets:q.get().comets,upgrades:q.get().cometUpgrades,events:q.get().cometEvents,earned:NEW_DEEDS.map(([id])=>[id,q.get().achieved[id]])});
  });
  group('sticky unlocks, exact wallets and read-only plans',()=>{
    const e=prepared(source),q=e.q;
    for(const row of CATALOG.filter(r=>r.deeds.length))for(const deed of row.deeds){
      const s=ownedFixture(q);s.owned.starcall=true;s.cometCharges=0;s.cometEvents={firstCommand:true,firstRecharge:true,bossStrike:true,calledKill:true};
      for(const [id]of NEW_DEEDS)s.achieved[id]=true;
      if(row.id==='meteor'){s.owned.meteor=false;s.cometEvents.bossStrike=false;s.achieved.comet_boss_strike=false;}
      if(row.id==='starcall'){s.owned.starcall=false;s.cometEvents.calledKill=false;s.achieved.comet_called_kill=false;}
      s.achieved[deed]=false;q.set(s);const before=snapshot(e);
      eq(q.buyPlan(row.id).reason,'locked','sticky Deed required '+row.id+'/'+deed);eq(q.buy(row.id),false,'locked actual purchase');unchanged(e,before,'locked '+row.id);
    }
    for(const wallet of [0,99,100,0.1,1e30,Number.MAX_VALUE]){
      const s=fixture(q);s.comets=wallet;q.set(s);const before=snapshot(e),plan=q.buyPlan('meteor');
      eq(plan.affordable,wallet>=100,'wallet coverage '+wallet);eq(plan.available,oracle.exactDebit(wallet,100)!==null,'representable debit '+wallet);
      unchanged(e,before,'read-only quote '+wallet);
      if(!plan.available){eq(q.buy('meteor'),false,'unavailable handler refuses '+wallet);unchanged(e,before,'unavailable purchase '+wallet);}
    }
    for(const field of ['hidden','resetInProgress','reloadInProgress','offlinePending','resumeFlowBusy','startupIntroPlaying','persistenceBlocked','offlineCatchup']){
      const e2=prepared(source),m=e2.q;m.lifecycle({[field]:field==='offlineCatchup'?{qaOnly:true}:true});const before=snapshot(e2);
      eq(m.buyPlan('meteor').available,false,'purchase gate '+field);eq(m.buy('meteor'),false,'closed lifecycle refuses buy '+field);unchanged(e2,before,'buy gate '+field);
    }
  });
  group('newly earned credits and transactional spend plus settlement',()=>{
    for(const wallet of [0.125,1e30]){
      const e=prepared(source),q=e.q,s=fixture(q);s.comets=wallet;s.achieved.d25=false;q.set(s);
      const attempts=e.attempts.length,changed=q.applyAchievements();eq(changed.map(a=>a.id),['d25'],'actual unchanged old threshold earns one Deed');
      eq(q.get().achieved.d25,true,'earned flag sticky');eq(q.get().comets,oracle.exactCredit(wallet,10)===null?wallet:wallet+10,'exact immediate credit');
      eq(q.get().cometClaims.deeds.d25===true,wallet===1e30,'only unrepresentable credit remains due');eq(e.attempts.length,attempts,'no inner Deed save');
      q.get().comets=0.125;const before=clone(q.get());eq(q.applyAchievements(),[],'already-earned checks do not retry');eq(q.get(),before,'old pending identity untouched');
      q.save();eq(q.get().cometClaims.deeds.d25,undefined,'canonical save later consumes payable claim');
    }
    const eventOnly=prepared(source),s=fixture(eventOnly.q);s.comets=1e30;s.cometClaims.retired.rifttrail='due';s.achieved.d25=false;
    eventOnly.q.set(s);eventOnly.q.get().comets=0.125;eventOnly.q.applyAchievements();
    eq(eventOnly.q.get().comets,10.125,'new award immediately attempts itself');eq(eventOnly.q.get().cometClaims.retired.rifttrail,'due','new award never sweeps an older payable claim');
    for(const failure of ['none','primary','recovery']){
      const e=prepared(source),q=e.q,s=fixture(q);s.comets=2**54;s.cometClaims.retired.rifttrail='due';q.set(s);q.save();const before=snapshot(e),staged=[];
      const undo=q.observe('saveState',event=>{if(event.phase==='before')staged.push({comets:event.state.comets,claim:event.state.cometClaims.retired.rifttrail});});
      e.fail(failure==='primary',failure==='recovery');const result=q.buy('meteor');undo();
      eq(staged.length,1,'single staged save attempt');eq(staged[0],{comets:2**54-100,claim:'due'},'debit precedes canonical credit');
      if(failure==='primary'){
        eq(result,false,'primary failure refuses purchase');unchanged(e,before,'primary paid rollback',false);
        e.fail(false,false);eq(q.buy('meteor'),true,'single successful retry');
      }else eq(result,true,'known primary commit survives '+failure);
      eq(q.get().comets,2**54-50,'net delta includes independent exact50 claim');eq(q.get().cometClaims.retired.rifttrail,'settled','one identity consumed');
      eq(q.get().owned.meteor,true,'one command ownership');eq(q.get().cometCharges,1,'one initial charge after committed purchase');
      eq(JSON.parse(e.storage.get(P)),q.get(),'primary endpoint is authoritative');
      if(failure==='recovery')eq(e.storage.get(R),before.slots.find(row=>row[0]===R)[1],'failed recovery keeps older recovery');
      report.witnesses.push({id:'purchase-settlement-'+failure,staged,result,finalComets:q.get().comets,claims:q.get().cometClaims,primarySha256:sha(e.storage.get(P))});
    }
  });
  group('command lifecycle, pure nested preview and no zero-effect charge',()=>{
    for(const id of ['meteor','starcall'])for(const field of ['hidden','resetInProgress','reloadInProgress','offlinePending','resumeFlowBusy','startupIntroPlaying','persistenceBlocked','offlineCatchup']){
      const e=prepared(source),q=e.q;q.set(ownedFixture(q,id));
      q.lifecycle({[field]:field==='offlineCatchup'?{qaOnly:true}:true});const before=snapshot(e),plan=q.commandPlan(id);
      eq(plan.available,false,'closed command lifecycle '+id+'/'+field);
      if(id==='meteor')eq(plan.meteor.available,true,'numeric availability stays separate from lifecycle');
      eq(q.command(id),false,'actual lifecycle refusal');unchanged(e,before,'command gate '+id+'/'+field);
    }
    for(const scenario of ['unowned','charge','used','luminous','boss','wrong-encounter','zero-hp','unsafe-hp','auto-ready']){
      const e=prepared(source),q=e.q,s=ownedFixture(q,scenario==='luminous'||scenario==='boss'?'starcall':'meteor');
      if(scenario==='unowned'){s.owned.meteor=false;s.cometCharges=0;}
      if(scenario==='charge')s.cometCharges=0;
      if(scenario==='used'){s.cometMeteorUsed=true;s.cometEvents.firstCommand=true;}
      if(scenario==='luminous')s.enemyIsLuminous=true;
      if(scenario==='boss')s.depth=s.enemyDepth=20;
      if(scenario==='wrong-encounter')s.enemyDepth=22;
      if(scenario==='zero-hp')s.enemyHp=0;
      if(scenario==='unsafe-hp')s.enemyHp=s.enemyMaxHp=1e30;
      if(scenario==='auto-ready'){s.depth=s.enemyDepth=16;s.owned.autoascend=true;s.autoAscendEnabled=true;s.autoAscendTargetDepth=16;}
      q.set(s);const id=scenario==='luminous'||scenario==='boss'?'starcall':'meteor',before=snapshot(e),preview=q.commandPlan(id);
      eq(preview.available,false,'unavailable '+scenario);eq(q.command(id),false,'actual free refusal '+scenario);unchanged(e,before,'free '+scenario);
    }
  });
  group('Meteor exact HP, no elapsed work or duplicate multipliers',()=>{
    for(const depth of [21,10,20,30])for(const core of [0,4]){
      const e=prepared(source),q=e.q,s=ownedFixture(q,'meteor',depth);s.enemyHp=s.enemyMaxHp=1000000;
      s.cometUpgrades.meteorcore=core;s.cometEvents.firstCommand=true;s.achieved.comet_first_command=true;
      s.research.arcanecal=10;s.research.spillway=10;s.heroResource.ember=73;
      s.buffUntil=CLOCK+4000;s.buffMult=1.25;s.supportBuffs={version:1,sources:{tide:{until:CLOCK+4000,mult:1.25}}};
      q.set(s);const before=clone(q.get()),power=q.passive(depth),expected=oracle.plan(before.enemyMaxHp,before.enemyHp,power,core);
      const numeric=q.commandPlan('meteor').meteor;eq(numeric,expected,'actual canonical passive operand, no extra cast/tap/Support multiplier');
      const timers=e.pending(),now=q.now(),events=[];
      const owners=['advanceAuthoritativeTime','simulationTriggerAbility','simulationProcessAutoTap','simulationDealDiscreteDamage','simulationDefeatEnemy'];
      const undos=owners.map(name=>q.observe(name,event=>{if(event.phase==='before')events.push(name);}));
      eq(q.command('meteor'),true,'actual nonlethal Meteor');undos.reverse().forEach(fn=>fn());
      eq(q.get().enemyHp,expected.hpAfter,'exact actual represented HP debit');eq(q.get().enemyMaxHp,before.enemyMaxHp,'same maxHP');
      eq(q.get().cometCharges,0,'one charge');eq(q.get().cometMeteorUsed,true,'once-per-encounter marker');
      for(const key of ['depth','enemyDepth','totalKills','totalTaps','totalOfflineSeconds','heroResource','buffUntil','buffMult','supportBuffs','luminousAccum','lastSeen'])eq(q.get()[key],before[key],'nonlethal leaves '+key);
      eq(q.now(),now,'twelve is not elapsed time');eq(e.pending(),timers,'no new scheduler boundary');eq(events,[],'no discrete/elapsed/cast/kill side owner on nonlethal strike');
      const after=snapshot(e);eq(q.command('meteor'),false,'once per encounter');unchanged(e,after,'second Meteor');
    }
    const e=prepared(source),q=e.q,s=ownedFixture(q);s.enemyMaxHp=5;s.enemyHp=1+5e-10;q.set(s);
    const before=clone(q.get()),expected=oracle.plan(5,before.enemyHp,q.passive(s.depth),0),deaths=[];
    const undo=q.observe('simulationDefeatEnemy',ev=>{if(ev.phase==='before')deaths.push(ev.name);});
    eq(expected.lethal,false,'independent epsilon witness is nonlethal');eq(q.command('meteor'),true,'actual epsilon-sized remainder command');undo();
    eq(q.get().enemyHp,expected.hpAfter,'positive epsilon remainder preserved');eq(q.get().totalKills,before.totalKills,'no epsilon kill');eq(deaths,[],'shared damage epsilon is not called');
    report.witnesses.push({id:'actual-epsilon-nonlethal',beforeHp:before.enemyHp,budget:expected.budget,afterHp:q.get().enemyHp,killOwners:deaths});
    const boosts=prepared(source),b=ownedFixture(boosts.q);b.owned.starcall=true;b.cometEvents={firstCommand:true,firstRecharge:true,bossStrike:true,calledKill:true};for(const [id]of NEW_DEEDS)b.achieved[id]=true;
    boosts.q.set(b);const baseline=[boosts.q.passive(21),boosts.q.sustained(21),boosts.q.estimatedBoss(20),boosts.q.forgeAssessment(20)];
    boosts.q.get().cometUpgrades={cometreservoir:2,cometcycle:3,meteorcore:4};
    eq([boosts.q.passive(21),boosts.q.sustained(21),boosts.q.estimatedBoss(20),boosts.q.forgeAssessment(20)],baseline,'manual command ownership/ranks never enter sustained DPS or retreat bounds');
  });
  group('canonical lethal rewards, Auto-Ascend and rollback after state replacement',()=>{
    for(const depth of [10,20,30]){
      const e=prepared(source),q=e.q,s=ownedFixture(q,'meteor',depth);s.enemyMaxHp=10000;s.enemyHp=1;q.set(s);
      const control=prepared(source);control.q.set(clone(q.get()));control.q.get().cometCharges--;control.q.get().cometEvents.firstCommand=true;control.q.get().cometEvents.bossStrike=true;
      const deaths=[],victories=[],saves=[];const undo=[q.observe('simulationDefeatEnemy',x=>{if(x.phase==='before')deaths.push(x.name);}),q.observe('forgeBossVictory',x=>{if(x.phase==='before')victories.push(x.name);}),q.observe('saveState',x=>{if(x.phase==='before')saves.push(x.name);})];
      eq(q.command('meteor'),true,'actual lethal boss Meteor');undo.reverse().forEach(f=>f());control.q.kill();control.q.save();
      eq(q.get(),control.q.get(),'canonical rewards/progression exactly match actual defeat owner');eq(deaths.length,1,'one canonical defeat');eq(victories.length,1,'one Victory Charge owner');eq(saves.length,1,'one outer save');
    }
    for(const unsafe of [false,true])for(const fault of ['none','primary','recovery']){
      const e=prepared(source),q=e.q,s=ownedFixture(q,'meteor',15);s.enemyMaxHp=10000;s.enemyHp=1;s.owned.autoascend=true;s.autoAscendEnabled=true;s.autoAscendTargetDepth=16;s.cometUpgrades.cometreservoir=1;s.cometWork=3970;s.cometEvents.firstCommand=true;s.achieved.comet_first_command=true;
      s.ascendCount=unsafe?1e30:3;q.set(s);q.save();const before=snapshot(e),ascends=[],saves=[];
      const undo=[q.observe('applyAscendMutation',x=>{if(x.phase==='after')ascends.push({before:x.beforeToken,after:x.token,count:x.state.ascendCount});}),q.observe('saveState',x=>{if(x.phase==='before')saves.push({depth:x.state.depth,state:x.state});})];
      eq(q.autoReady(),false,'boundary is not already ready');e.fail(fault==='primary',fault==='recovery');const result=q.command('meteor');undo.reverse().forEach(f=>f());
      eq(ascends.length,1,'canonical kill reaches exactly one Auto-Ascend');eq(saves.length,1,'one outer save after replacement');
      if(fault==='primary'){
        eq(result,false,'primary failure refuses ending-hit command');unchanged(e,before,'ending-hit rollback',false);e.fail(false,false);eq(q.command('meteor'),true,'one later successful ending-hit retry');
      }else eq(result,true,'primary known committed ending-hit');
      ok(q.runToken()!==before.token,'actual run token changes even for unsafe count');eq(q.get().ascendCount,unsafe?1e30:4,'existing lifetime counter semantics unchanged');
      eq(q.get().depth,1,'new run started');eq(q.get().cometCharges,0,'spent charge survives Ascend');eq(q.get().cometWork,3990,'actual one kill work survives Ascend');eq(q.get().cometMeteorUsed,false,'new enemy clears use');
      eq(JSON.parse(e.storage.get(P)),q.get(),'current replaced endpoint owns primary commit');
      report.witnesses.push({id:'ending-hit-'+fault+(unsafe?'-unsafe-count':''),result,ascends:ascends.length,saves:saves.length,after:{depth:q.get().depth,ascendCount:q.get().ascendCount,charges:q.get().cometCharges,work:q.get().cometWork},tokenChanged:q.runToken()!==before.token});
    }
    const e=prepared(source),q=e.q,s=ownedFixture(q,'meteor',15);s.owned.autoascend=true;s.autoAscendEnabled=true;s.autoAscendTargetDepth=16;q.set(s);q.save();const before=snapshot(e);
    eq(q.commitMutation(()=>{q.kill();throw Error('injected post-Ascend mutation exception');}),false,'reported mutation exception refuses');unchanged(e,before,'exception restores endpoint/token');ok(q.persistenceStatus().failureCount>=1,'exception is reported');
  });
  group('Call, reload, abandonment and actual defeat owners',()=>{
    for(const kind of ['manual','live','offline','batch']){
      const e=prepared(source),q=e.q,s=ownedFixture(q,'starcall');s.cometClaims.retired.comettrials='settled';s.ascendCount=3;s.cometTrial={id:'quiet',target:50,phase:'active',startedAscend:3,failed:false,reason:''};
      s.luminousAccum=0.375;s.longStudyLevels.luminousdistill=3;s.longStudyLevels.motestudy=2;q.set(s);const before=clone(q.get());
      eq(q.command('starcall'),true,'actual Call '+kind);
      for(const key of ['depth','enemyDepth','enemyHp','enemyMaxHp','lumen','shards','motes','sigils','prisms','totalKills','totalTaps','heroResource','luminousAccum','lastSeen','cometTrial'])eq(q.get()[key],before[key],'Call only marks; preserves '+key);
      eq(q.get().enemyIsLuminous,true,'Call makes luminous');eq(q.get().cometCalled,true,'saved Call marker');eq(q.get().cometEvents.calledKill,false,'no immediate called defeat');eq(q.get().cometTrial.failed,false,'Call is not a manual attack');
      const loaded=app(source,Array.from(e.storage));loaded.q.restoreEnemy();eq(loaded.q.get().cometCalled,true,'actual ratio restore keeps called marker');eq(loaded.q.get().enemyIsLuminous,true,'actual ratio restore keeps Luminous');
      const natural=prepared(source);natural.q.set(clone(loaded.q.get()));natural.q.get().cometCalled=false;
      const action=m=>{if(kind==='manual')m.manualKill();else if(kind==='batch'){m.get().riftMode='farm';m.get().farmDepth=m.get().depth;m.batch(1);}else m.kill(kind);};
      action(loaded.q);action(natural.q);
      for(const key of ['depth','enemyDepth','enemyHp','enemyMaxHp','lumen','shards','motes','sigils','prisms','totalKills','totalTaps','heroResource','luminousAccum'])eq(loaded.q.get()[key],natural.q.get()[key],'called reward matches actual Luminous owner '+kind+'/'+key);
      eq(loaded.q.get().cometEvents.calledKill,true,'actual called kill fact '+kind);eq(loaded.q.get().achieved.comet_called_kill,true,'actual called kill reward check '+kind);
      eq(loaded.q.get().cometCalled,false,'replacement consumes marker');eq(loaded.q.get().cometMeteorUsed,false,'replacement clears Meteor marker');
      const comets=loaded.q.get().comets;action(loaded.q);eq(loaded.q.get().comets,comets,'second enemy cannot replay called credit');
    }
    for(const mode of ['farm','ascend']){
      const e=prepared(source),q=e.q,s=ownedFixture(q,'starcall');q.set(s);q.command('starcall');const old=q.get().comets,kills=q.get().totalKills;
      if(mode==='farm')q.enterFarm();else q.ascend();
      eq(q.get().cometCalled,false,'abandonment clears actual encounter '+mode);eq(q.get().cometEvents.calledKill,false,'abandonment earns no called kill '+mode);eq(q.get().cometCharges,0,'abandonment refunds no charge '+mode);eq(q.get().totalKills,kills,'abandonment creates no kill '+mode);eq(q.get().comets,old,'abandonment creates no reward '+mode);
    }
    for(const id of ['meteor','starcall']){
      const e=prepared(source),q=e.q,s=ownedFixture(q,id);s.cometClaims.retired.comettrials='settled';s.ascendCount=3;s.cometTrial={id:'quiet',target:50,phase:'active',startedAscend:3,failed:false,reason:''};q.set(s);q.save();const before=snapshot(e);
      e.fail(true,false);eq(q.command(id),false,'primary-failed command '+id);unchanged(e,before,'command rollback '+id,false);e.fail(false,false);eq(q.command(id),true,'real successful command retry '+id);eq(q.get().cometTrial.failed,id==='meteor','Quiet Guardian records only accepted Meteor');
    }
  });
  group('exact charge thresholds, unsafe lifetime counters and admitted-state closure',()=>{
    for(const reserve of [0,1,2])for(const rank of [0,1,2,3])for(const work of [0,3970,3999]){
      const e=prepared(source),q=e.q,s=ownedFixture(q);s.cometCharges=0;s.cometWork=work;s.cometUpgrades.cometreservoir=reserve;s.cometUpgrades.cometcycle=rank;s.cometEvents.firstCommand=true;s.achieved.comet_first_command=true;
      s.riftMode='farm';s.farmDepth=s.depth;s.totalKills=1e30;q.set(s);const rate=[20,25,32,40][rank],need=Math.ceil(((reserve+1)*4000-work)/rate);
      const first=q.batch(need-1);eq(first.kills,need-1,'actual unsaturated batch count');
      const total=work+(need-1)*rate;eq(q.get().cometCharges,Math.floor(total/4000),'exact unsaturated bank');eq(q.get().cometWork,total%4000,'exact unsaturated residual');
      q.batch(1);eq(q.get().cometCharges,reserve+1,'next actual defeat fills bank');eq(q.get().cometWork,0,'full bank discards residual');eq(q.get().totalKills,1e30,'unsafe lifetime counter stays unchanged without controlling bank');
      const bank=commandOnlyFields(clone(q.get()));q.batch(1e30);eq(q.get().cometCharges,bank.charges,'huge count saturates bounded bank');eq(q.get().cometWork,0,'no overflowing work accumulation');eq(q.save(),true,'earned bank persists with unsafe lifetime count');
    }
    const e=prepared(source),q=e.q,s=ownedFixture(q);s.cometCharges=0;s.cometWork=0;s.riftMode='farm';s.farmDepth=s.depth;q.set(s);
    eq(q.get().cometEvents,emptyEvents(),'accepted empty bank without historical command');const result=q.batch(200);
    eq(result.kills,200,'200 real defeats');eq(q.get().cometCharges,1,'real first recharge');eq(q.get().cometEvents.firstRecharge,true,'recharge is actual independent fact');eq(q.get().cometEvents.firstCommand,false,'recharge does not invent command use');
    eq(q.get().achieved.comet_first_recharge,true,'real recharge Deed earned');eq(q.get().achieved.comet_first_command===true,false,'first command Deed remains unearned');eq(q.save(),true,'accepted state remains valid after actual recharge');
    report.witnesses.push({id:'admitted-state-real-recharge',kills:result.kills,bank:commandOnlyFields(q.get()),comets:q.get().comets,saveStatus:q.persistenceStatus()});
  });
  group('paid Refresh legacy/new routes, determinism, exact counter and rollback',()=>{
    for(const route of ['trials','reststop','called'])for(const fault of ['none','primary','recovery']){
      const e=prepared(source),q=e.q,s=fixture(q);s.owned.autoascend=true;s.questIds=['q_tap_small','q_kill_small','q_empower'];s.dailyStats={taps:700,kills:200,empowers:20};
      if(route==='trials')s.cometClaims.retired.comettrials='settled';
      if(route==='reststop')s.legacyCometPurchases={offline24:true,offline48:true,rememberbulk:true};
      if(route==='called'){s.owned.starcall=true;s.cometEvents.firstCommand=true;s.cometEvents.calledKill=true;s.achieved.comet_first_command=true;s.achieved.comet_called_kill=true;}
      q.set(s);
      q.save();const before=snapshot(e),id='q_tap_small',plan=q.refreshPlan(id),candidates=q.refreshCandidates(id);
      eq(q.refreshCost(),25,'original richest reward sets25C cost');eq(plan.cost,25,'actual Refresh quote');
      const seedValue=q.dateSeed(q.get().questDay)+(q.get().dailyQuestRefreshes||0)*31;
      const expected=candidates[Math.abs(seedValue)%candidates.length];ok(expected,'actual eligible replacement exists');
      eq(plan.available,true,'Refresh eligible '+route);unchanged(e,before,'Refresh plan is read-only');
      e.fail(fault==='primary',fault==='recovery');const result=q.refresh(id);
      if(fault==='primary'){eq(result,false,'failed primary Refresh');unchanged(e,before,'Refresh rollback',false);e.fail(false,false);eq(q.refresh(id),true,'same deterministic retry');}else eq(result,true,'committed Refresh');
      eq(q.get().questIds[0],expected.id,'unchanged deterministic replacement');eq(q.get().dailyQuestRefreshes,before.state.dailyQuestRefreshes+1,'one exact Refresh count');eq(q.get().comets,before.state.comets-25,'one exact Refresh price');eq(q.get().dailyStats,before.state.dailyStats,'existing quest progress unchanged');
      ok(q.questDefs().every(row=>(row.reward.comets||0)<=25),'no positive Comet arbitrage from inherited quest progress');
    }
  });
  group('separate original F26 receipts settle before the bounded Comet family',()=>{
    const policy='OFFLINE_12H_001:140/160:sum-ceil-6x1.6^level';
    for(const wallet of [0.125,2**54-10,1e30])for(const prisms of [0.125,1e30]){
      const e=app(source),q=e.q,s=fixture(q);s.comets=wallet;s.prisms=prisms;
      const receipt={policy,offline24:true,offline48:true,reservesLevel:3,comets:300,
        prismPrices:[6,10,16],prismsExact:'32',cometsPaid:[false,false],prismsPaid:[false,false,false]};
      s.offline12hRefund=clone(receipt);s.nodes.reserves=3;
      RETIRED.forEach(([id])=>{s.cometClaims.retired[id]='due';});
      let expectedC=wallet,expectedP=prisms;
      const paidC=[140,160].map(amount=>{const next=oracle.exactCredit(expectedC,amount);if(next===null)return false;expectedC=next;return true;});
      const paidP=[6,10,16].map(amount=>{const next=oracle.exactCredit(expectedP,amount);if(next===null)return false;expectedP=next;return true;});
      const comet=oracle.settleKnownClaims(expectedC,RETIRED.map(([id])=>'retirement:'+id));
      const out=q.accept(s,'separate-f26-family');
      eq(out.comets,comet.wallet,'F26 then one Comet pass');eq(out.prisms,expectedP,'F26 retains its own Prism currency');
      eq(out.offline12hRefund,Object.assign(clone(receipt),{cometsPaid:paidC,prismsPaid:paidP}),'original policy, prices, exact total and independent paid bits');
      eq(pendingIds(out),comet.pendingIds,'same140 amount remains two distinct claim owners');eq(out.nodes.reserves,3,'paid raw Reserves level retained');
      eq(s.offline12hRefund,receipt,'acceptance never mutates the original receipt');
      if(wallet===2**54-10){eq(out.offline12hRefund.cometsPaid,[false,false],'later Comet credit does not trigger an earlier F26 rescan');eq(out.comets,wallet+210,'only Trail50 and Crest160 settle in this pass');}
    }
    const e=app(source),s=legacyFixture(e.q,1,7,0.125);s.owned.offline24=true;s.owned.offline48=true;s.nodes.reserves=3;s.prisms=0.125;
    const out=e.q.accept(s,'actual-v1-combined-paid-history');
    eq(out.comets,650.125,'original300 plus three distinct retired350');eq(out.prisms,48.125,'original recorded Reserves32 plus Echo16 and retained fraction');
    eq(out.feedbackMigration.receipts['node.echo'].amounts.prisms,[16],'separate original Echo6 purchase receipt');
    eq(out.offline12hRefund.policy,policy,'unchanged F26 policy');eq(out.offline12hRefund.prismPrices,[6,10,16],'original small Number prices');
    eq(out.offline12hRefund.cometsPaid,[true,true],'F26 independent payments');eq(out.cometClaims.retired,{comettrials:'settled',rifttrail:'settled',starfallcrest:'settled'},'new retirement family separately settled');
  });
  group('protected original Deed thresholds count all paid Forge levels',()=>{
    const e=app(source),q=e.q;
    for(const [id,below,at]of [['autotap',11,12],['labmaster',19,20],['labqueue',59,60]]){
      const s=fixture(q);s.achieved[id]=false;
      if(id==='autotap')s.ascendCount=below;else{Object.keys(s.research).forEach(key=>{s.research[key]=0;});s.research.focus=below-15;s.research.arcanecal=10;s.research.spillway=5;}
      s.owned.meteor=true;s.owned.starcall=true;s.cometUpgrades={cometreservoir:2,cometcycle:3,meteorcore:4};
      q.set(s);eq(q.achievementDefs().find(row=>row.id===id).check(q.get()),false,'all paid levels remain below '+id+' threshold');
      eq(q.applyAchievements().some(row=>row.id===id),false,'real old Deed owner stays locked below '+id);
      if(id==='autotap')q.get().ascendCount=at;else q.get().research.focus=at-15;
      eq(q.applyAchievements().filter(row=>row.id===id).map(row=>row.id),[id],'original threshold still earns '+id);
    }
    const s=fixture(q);s.achieved.fullparty=false;s.activeParty=q.spiritDefs().slice(0,4).map(sp=>sp.id);
    s.activeParty.forEach(id=>{s.spirits[id]=1;});q.set(s);
    eq(q.achievementDefs().find(row=>row.id==='fullparty').check(q.get()),false,'four do not earn original Full Formation');
    const fifth=q.spiritDefs()[4].id;q.get().spirits[fifth]=1;q.get().activeParty.push(fifth);
    eq(q.applyAchievements().filter(row=>row.id==='fullparty').length,1,'five still earn original Full Formation without Sixth Star');
  });
  group('Refresh representability, saturation, lifecycle and free refusals',()=>{
    for(const wallet of [0,24,25,25.125,100.1,2**53,1e30,Number.MAX_VALUE])for(const count of [0,1,Number.MAX_SAFE_INTEGER,2**53,1e30]){
      const e=prepared(source),q=e.q,s=fixture(q);s.owned.autoascend=true;s.cometClaims.retired.comettrials='settled';s.questIds=['q_tap_small','q_kill_small','q_empower'];s.comets=wallet;s.dailyQuestRefreshes=count;q.set(s);
      const before=snapshot(e),id='q_tap_small',candidates=q.refreshCandidates(id),seedValue=q.dateSeed(q.get().questDay)+count*31;
      const replacement=candidates[Math.abs(seedValue)%candidates.length];
      const exactCounter=count+1-count===1&&(count+1)-1===count;
      const expected=!!replacement&&exactCounter&&oracle.exactDebit(wallet,25)!==null;
      const plan=q.refreshPlan(id);eq(plan.available,expected,'independent Refresh exact debit/counter '+wallet+'/'+count);unchanged(e,before,'pure Refresh bound');
      eq(q.refresh(id),expected,'actual Refresh bound owner');
      if(expected){eq(q.get().comets,oracle.exactDebit(wallet,25),'exact single Refresh debit');eq(q.get().dailyQuestRefreshes,count+1,'exact represented counter');eq(q.get().questIds[0],replacement.id,'unchanged deterministic selector at large counter');}
      else unchanged(e,before,'free Refresh refusal');
    }
    for(const field of ['hidden','resetInProgress','reloadInProgress','offlinePending','resumeFlowBusy','startupIntroPlaying','persistenceBlocked','offlineCatchup']){
      const e=prepared(source),q=e.q,s=fixture(q);s.owned.autoascend=true;s.cometClaims.retired.comettrials='settled';s.questIds=['q_tap_small','q_kill_small','q_empower'];q.set(s);
      q.lifecycle({[field]:field==='offlineCatchup'?{qaOnly:true}:true});const before=snapshot(e);eq(q.refresh('q_tap_small'),false,'Refresh lifecycle '+field);unchanged(e,before,'closed Refresh '+field);
    }
    for(const scenario of ['unowned','claimed','missing-id']){
      const e=prepared(source),q=e.q,s=fixture(q);s.owned.autoascend=scenario!=='unowned';s.cometClaims.retired.comettrials='settled';s.questIds=['q_tap_small','q_kill_small','q_empower'];if(scenario==='claimed')s.questClaimed.q_tap_small=true;q.set(s);
      const before=snapshot(e);eq(q.refresh(scenario==='missing-id'?'unknown':'q_tap_small'),false,'ineligible Refresh '+scenario);unchanged(e,before,'ineligible Refresh is free');
    }
  });
  if(options.negative)group('causal controls against the complete original IIFE',()=>{
    function control(id,name,before,after,probe,expectedMessage){
      const mutated=replaceFunction(source,name,body=>replaceOne(body,before,after));
      const witness=probe(source);report.checks++;
      let failure=null;try{probe(mutated);}catch(error){failure=error;}
      report.lastNegativeAttempt={id,function:name,sourceSha256:sha(mutated),error:failure?{name:failure.name,code:failure.code,message:failure.message,stack:failure.stack,actual:failure.actual,expected:failure.expected,operator:failure.operator}:null};
      ok(failure&&failure.code==='ERR_ASSERTION','semantic control detected without runtime/parser failure: '+id);
      ok(expectedMessage.test(failure.message),'intended causal assertion: '+id);
      report.negativeControls.push({id,function:name,sourceSha256:sha(mutated),positiveWitness:witness||null,detected:true,error:{name:failure.name,code:failure.code,message:failure.message}});
      delete report.lastNegativeAttempt;
    }
    control('second-command-is-not-another-initial-gift','buyShopItem','&& firstCommand) state.cometCharges=1;',') state.cometCharges=1;',text=>{
      const e=prepared(text),q=e.q;assert.equal(q.buy('meteor'),true);assert.equal(q.command('meteor'),true);assert.equal(q.get().cometCharges,0);assert.equal(q.buy('starcall'),true);
      assert.equal(q.get().cometCharges,0,'second purchase must not refill the spent shared gift');return {charges:q.get().cometCharges,owned:[q.get().owned.meteor,q.get().owned.starcall]};
    },/second purchase must not refill/);
    control('representable-debit-required','cometExactDebit','wallet-remaining===cost && remaining+cost===wallet','true',text=>{
      const e=prepared(text),q=e.q;q.get().comets=1e30;const before=snapshot(e);assert.equal(q.buy('meteor'),false,'unrepresentable paid debit must refuse');assert.deepEqual(q.get(),before.state);assert.deepEqual(Array.from(e.storage),before.slots);
    },/unrepresentable paid debit must refuse/);
    control('unrepresentable-credit-keeps-original-claim','cometCreditExactly','!Number.isFinite(next) || next-before!==amount || next-amount!==before','!Number.isFinite(next)',text=>{
      const e=prepared(text),q=e.q;q.get().comets=1e30;q.get().achieved.d25=false;q.applyAchievements();assert.equal(q.get().comets,1e30);assert.equal(q.get().cometClaims.deeds.d25,true,'lost credit must retain its original pending identity');
    },/lost credit must retain/);
    control('new-deed-does-not-sweep-older-claims','cometEarnDeed','if(cometCreditExactly(state,COMET_DEED_REWARDS[id])) delete state.cometClaims.deeds[id];','if(cometCreditExactly(state,COMET_DEED_REWARDS[id])) delete state.cometClaims.deeds[id];settleCometClaims(state);',text=>{
      const e=prepared(text),q=e.q;q.get().comets=0.125;q.get().cometClaims.retired.rifttrail='due';q.get().achieved.d25=false;q.applyAchievements();assert.equal(q.get().cometClaims.retired.rifttrail,'due','new Deed must not sweep an unrelated old claim');assert.equal(q.get().comets,10.125);
    },/new Deed must not sweep/);
    control('recharge-does-not-imply-an-earlier-command','normalizeCometState','((events.bossStrike || events.calledKill || out.cometMeteorUsed || out.cometCalled) && !events.firstCommand)','((events.firstRecharge || events.bossStrike || events.calledKill || out.cometMeteorUsed || out.cometCalled) && !events.firstCommand)',text=>{
      const e=prepared(text),q=e.q,s=ownedFixture(q);s.cometCharges=0;q.set(s);q.get().riftMode='farm';q.get().farmDepth=q.get().depth;q.batch(200);assert.equal(q.get().cometEvents.firstRecharge,true);assert.equal(q.get().cometEvents.firstCommand,false);assert.equal(q.save(),true,'accepted owned empty bank must stay valid after 200 actual defeats');return commandOnlyFields(q.get());
    },/must stay valid after 200 actual defeats/);
    control('hidden-page-cannot-spend','cometMutationOpen','!document.hidden && ','',text=>{
      const e=prepared(text),q=e.q;q.set(ownedFixture(q));q.lifecycle({hidden:true});const before=snapshot(e);assert.equal(q.command('meteor'),false,'hidden command must remain unavailable');assert.deepEqual(q.get(),before.state);
    },/hidden command must remain unavailable/);
    control('ready-auto-ascend-cannot-spend','getCometCommandPlan','!cometMutationOpen() || autoAscendReady()','!cometMutationOpen()',text=>{
      const e=prepared(text),q=e.q,s=ownedFixture(q,'meteor',16);s.owned.autoascend=true;s.autoAscendEnabled=true;s.autoAscendTargetDepth=16;q.set(s);assert.equal(q.autoReady(),true);assert.equal(q.command('meteor'),false,'already-ready Auto-Ascend must not spend a command');
    },/already-ready Auto-Ascend must not spend/);
    control('positive-epsilon-hp-is-not-a-lethal-command','activateCometCommand','if(plan.meteor.lethal) simulationDefeatEnemy','if(plan.meteor.lethal || state.enemyHp<=1e-9) simulationDefeatEnemy',text=>{
      const e=prepared(text),q=e.q,s=ownedFixture(q);s.enemyMaxHp=5;s.enemyHp=1+5e-10;q.set(s);const kills=q.get().totalKills;assert.equal(q.command('meteor'),true);assert.equal(q.get().totalKills,kills,'positive Meteor remainder must not become an epsilon kill');assert(q.get().enemyHp>0);
    },/positive Meteor remainder must not become/);
    control('primary-failure-restores-run-identity','cometCommitMutation','if(!saved && state===working){state=base;ascendRunToken=oldRun;return false;}','if(!saved && state===working){state=base;return false;}',text=>{
      const e=prepared(text),q=e.q,s=ownedFixture(q,'meteor',15);s.enemyHp=1;s.owned.autoascend=true;s.autoAscendEnabled=true;s.autoAscendTargetDepth=16;s.ascendCount=1e30;q.set(s);q.save();const before=snapshot(e);e.fail(true,false);assert.equal(q.command('meteor'),false);assert.deepEqual(q.get(),before.state);assert(q.runToken()===before.token,'failed ending hit must restore the exact original run token');
    },/failed ending hit must restore/);
    const workingMutated=replaceFunction(source,'cometCommitMutation',body=>replaceOne(replaceOne(body,'try{','var working=state;try{'),'var working=state,saved=saveState();','var saved=saveState();'));
    function workingProbe(text){const e=prepared(text),q=e.q,s=ownedFixture(q,'meteor',15);s.enemyHp=1;s.owned.autoascend=true;s.autoAscendEnabled=true;s.autoAscendTargetDepth=16;q.set(s);q.save();const before=snapshot(e);e.fail(true,false);assert.equal(q.command('meteor'),false,'primary failure after actual Ascend replacement must refuse');assert.deepEqual(q.get(),before.state);}
    workingProbe(source);let workingFailure;try{workingProbe(workingMutated);}catch(error){workingFailure=error;}
    report.lastNegativeAttempt={id:'capture-working-object-after-actual-ascend',function:'cometCommitMutation',sourceSha256:sha(workingMutated),error:workingFailure?{name:workingFailure.name,code:workingFailure.code,message:workingFailure.message,stack:workingFailure.stack,actual:workingFailure.actual,expected:workingFailure.expected,operator:workingFailure.operator}:null};
    ok(workingFailure&&workingFailure.code==='ERR_ASSERTION'&&/primary failure after actual Ascend replacement/.test(workingFailure.message),'current post-apply working object causally owns commit');
    report.negativeControls.push({id:'capture-working-object-after-actual-ascend',function:'cometCommitMutation',sourceSha256:sha(workingMutated),detected:true,error:{name:workingFailure.name,code:workingFailure.code,message:workingFailure.message}});
    delete report.lastNegativeAttempt;
    control('new-encounter-clears-command-use','spawnEnemy','state.cometMeteorUsed=false;state.cometCalled=false;','/* causal omission of encounter markers */',text=>{
      const e=prepared(text),q=e.q;q.set(ownedFixture(q));assert.equal(q.command('meteor'),true);assert.equal(q.get().cometMeteorUsed,true);q.spawn();assert.equal(q.get().cometMeteorUsed,false,'new actual enemy must clear the Meteor use marker');
    },/new actual enemy must clear/);
    control('farm-batch-captures-called-enemy-before-replacement','simulationBatchFarmKills','cometRecordDefeats(count,state.cometCalled);','cometRecordDefeats(count,false);',text=>{
      const e=prepared(text),q=e.q;q.set(ownedFixture(q,'starcall'));assert.equal(q.command('starcall'),true);q.get().riftMode='farm';q.get().farmDepth=q.get().depth;q.batch(1);assert.equal(q.get().cometEvents.calledKill,true,'actual called Farm defeat must retain its event');
    },/actual called Farm defeat must retain/);
    control('manual-defeat-owner-awards-work','defeatEnemy','cometRecordDefeats(1,state.cometCalled);','/* omitted manual defeat bank owner */',text=>{
      const e=prepared(text),q=e.q,s=ownedFixture(q);s.cometCharges=0;q.set(s);q.manualKill();assert.equal(q.get().cometWork,20,'one original manual defeat must award20 work');
    },/one original manual defeat must award20/);
    control('authoritative-defeat-owner-awards-work','simulationDefeatEnemy','cometRecordDefeats(1,state.cometCalled);','/* omitted authoritative defeat bank owner */',text=>{
      const e=prepared(text),q=e.q,s=ownedFixture(q);s.cometCharges=0;q.set(s);q.kill();assert.equal(q.get().cometWork,20,'one authoritative defeat must award20 work');
    },/one authoritative defeat must award20/);
    control('engine-rank-changes-defeat-work-only','cometWorkPerKill','[20,25,32,40]','[20,25,31,40]',text=>{
      const e=prepared(text),q=e.q,s=ownedFixture(q);s.cometCharges=0;s.cometUpgrades.cometcycle=2;q.set(s);q.get().riftMode='farm';q.get().farmDepth=q.get().depth;q.batch(124);assert.equal(q.get().cometWork,3968,'124 actual rank2 defeats must produce3968 work');q.batch(1);assert.equal(q.get().cometCharges,1);
    },/124 actual rank2 defeats must produce3968/);
    control('full-bank-discards-bounded-residual','cometRecordDefeats','state.cometCharges=cap;state.cometWork=0;','state.cometCharges=cap;state.cometWork=1;',text=>{
      const e=prepared(text),q=e.q,s=ownedFixture(q);s.cometCharges=0;q.set(s);q.get().riftMode='farm';q.get().farmDepth=q.get().depth;q.batch(1e30);assert.equal(q.get().cometWork,0,'saturated bank must discard all residual work');
    },/saturated bank must discard/);
    control('refresh-refuses-stagnating-counter','getDailyQuestRefreshPlan','count+1-count===1 && (count+1)-1===count && ','',text=>{
      const e=prepared(text),q=e.q,s=fixture(q);s.owned.autoascend=true;s.cometClaims.retired.comettrials='settled';s.questIds=['q_tap_small','q_kill_small','q_empower'];s.dailyQuestRefreshes=2**53;q.set(s);assert(q.refreshPlan('q_tap_small').replacement);assert.equal(q.refresh('q_tap_small'),false,'Refresh must refuse a counter that cannot increment exactly');
    },/Refresh must refuse a counter/);
    control('paid-forge-deeds-include-current-levels','legacyResearchLevels','return RESEARCH.reduce(function(sum,node){return sum+(s.research[node.id]||0);},0);','return LEGACY_RESEARCH_IDS.reduce(function(sum,id){return sum+(s.research[id]||0);},0);',text=>{
      const e=prepared(text),q=e.q,s=fixture(q);s.achieved.labmaster=false;Object.keys(s.research).forEach(id=>{s.research[id]=0;});s.research.arcanecal=10;s.research.conduction=10;q.set(s);assert.equal(q.applyAchievements().some(row=>row.id==='labmaster'),true,'paid current Forge levels must satisfy the original20-level Deed');
    },/paid current Forge levels must satisfy/);
  });
  report.status='PASS';delete report.currentGroup;return report;
}

function cli(){
  const sourcePath=path.resolve(process.argv[2]||'index.html');const bytes=fs.readFileSync(sourcePath);
  let progress=null,report;
  try{report=runCore(bytes.toString('utf8'),{negative:process.argv.includes('--negative'),progress:value=>{progress=value;}});}
  catch(error){report=Object.assign(progress||{},{status:'FAIL',error:{name:error.name,code:error.code,message:error.message,stack:error.stack}});process.exitCode=1;}
  report.input={path:sourcePath,bytes:bytes.length,sha256:sha(bytes)};
  report.dependencies=[__filename,path.join(__dirname,'comet-expansion-harness.cjs'),path.join(__dirname,'comet-expansion-numerical.cjs')].map(filename=>{const b=fs.readFileSync(filename);return {path:filename,bytes:b.length,sha256:sha(b)};});
  report.runtime={node:process.version,v8:process.versions.v8};
  process.stdout.write(JSON.stringify(report,null,2)+'\n');
}
module.exports={runCore,fixture,ownedFixture,legacyFixture,snapshot,commandOnlyFields};
if(require.main===module)cli();
