'use strict';
// Independent ES2017 vectors executed by the existing actual Node8/V8 gate.
module.exports=function(ctx){
 var source=ctx.source,H=ctx.H,eq=ctx.eq,ok=ctx.ok,scenario=ctx.scenario,world=ctx.world,clone=H.clone,P=H.P,R=H.R,CLOCK=H.CLOCK;
 var rows=[['astralcore',250,750],['astralecho',500,1250],['astralconvergence',1000,2000]],prices=0,refunds=0,faults=0;
 function seed(q){var s=q.fresh();s.maxDepthEver=5000;s.comets=100000;s.questDay=q.day();return s;}
 scenario('permanent-catalog-and-all-exact-prices',function(){
  var q=world().q;eq(q.schema(),6,'current schema6');eq(q.shopDefs().map(function(r){return r.id;}),['autoascend','astralcore','astralecho','astralconvergence'],'only permanent paid catalogue');eq(q.achievementDefs().length,76,'all historical reward identities retained');
  rows.forEach(function(row){for(var rank=0;rank<10;rank++){
   var a=world(),q=a.q,s=seed(q),price=Math.ceil(row[2]*Math.pow(1.2,rank));s.astralUpgrades[row[0]]=rank;s.comets=price-1;q.set(s);q.save(CLOCK);var before=clone(q.get()),raw=Array.from(a.storage);
   eq(q.buyPlan(row[0]).cost,price,'independent exact rank price');eq(q.buy(row[0]),false,'one-short refused');eq(q.get(),before,'one-short retains paid state');eq(Array.from(a.storage),raw,'one-short has no writes');
   q.get().comets=price;eq(q.buy(row[0]),true,'exact permanent purchase');eq(q.get().comets,0,'exact debit');eq(q.get().astralUpgrades[row[0]],rank+1,'one paid rank');eq(world(a.storage).q.get(),q.get(),'actual cold purchase');eq(q.accept(q.decode(q.export())),q.get(),'backup normalization');prices++;
  }
  var s=seed(q);s.astralUpgrades[row[0]]=10;q.set(s);var capped=clone(q.get());eq(q.buy(row[0]),false,'cap refuses purchase');eq(q.get(),capped,'cap retains all state');s=seed(q);s.maxDepthEver=row[1]-1;q.set(s);eq(q.buyPlan(row[0]).reason,'locked','rift-1 lock');s.maxDepthEver=row[1];q.set(s);eq(q.buyPlan(row[0]).available,true,'exact Rift unlock');
  });
 });
 scenario('immutable-command-refunds-all-paid-subsets',function(){
  for(var mask=0;mask<4;mask++)for(var reserve=0;reserve<=2;reserve++)for(var cycle=0;cycle<=3;cycle++)for(var core=0;core<=4;core++){
   // Original paid catalogue required one owned command for Reserve/Engine,
   // and Meteor for Core. Enumerate every valid former paid combination.
   if((reserve||cycle)&&mask===0||core&&!(mask&1))continue;
   var a=world(),q=a.q,s=seed(q);s.schemaVersion=5;s.comets=7;s.owned.meteor=!!(mask&1);s.owned.starcall=!!(mask&2);s.cometUpgrades={cometreservoir:reserve,cometcycle:cycle,meteorcore:core};
   var total=(mask&1?100:0)+(mask&2?140:0)+[0,60,180][reserve]+[0,80,220,440][cycle]+[0,45,120,240,420][core];q.set(s);eq(q.get().comets,7+total,'independent original-price refund');eq(q.get().commandRefund,{policy:'commands-retired-v1',total:total,paid:true},'once-only exact receipt');eq(q.get().cometUpgrades,s.cometUpgrades,'raw paid historical ranks retained');eq(q.get().owned.meteor,s.owned.meteor,'old Meteor ownership retained');eq(q.get().owned.starcall,s.owned.starcall,'old Call ownership retained');q.save(CLOCK);var endpoint=clone(q.get());eq(world(a.storage).q.get(),endpoint,'cold refund cannot replay');eq(q.accept(q.decode(q.export())),endpoint,'backup cannot replay');refunds++;
  }
 });
 scenario('permanent-transaction-and-lifecycle-failures',function(){
  [null,'primary','recovery'].forEach(function(fault){var a=world(),q=a.q,s=seed(q);s.comets=750;s.activeStudies=[{id:'guardmastery',slot:0,totalDurationSec:150,remainingSec:70,speedMult:1}];s.studySlotProjects[0]='guardmastery';q.set(s);q.save(CLOCK);var before=clone(q.get()),slots=Array.from(a.storage);a.fail(fault==='primary',fault==='recovery');eq(q.buy('astralcore'),fault!=='primary','native commit outcome');if(fault==='primary'){eq(q.get(),before,'primary rollback all fields');eq(Array.from(a.storage),slots,'both original saves retained');a.fail(false,false);eq(q.buy('astralcore'),true,'retry succeeds once');}eq(q.get().comets,0,'one payment');eq(q.get().activeStudies,before.activeStudies,'paid Lab work retained');eq(world(a.storage).q.get().astralUpgrades.astralcore,1,'cold paid rank');faults++;});
  ['resetInProgress','reloadInProgress','offlineCatchup','offlinePending','resumeFlowBusy','startupIntroPlaying','persistenceBlocked'].forEach(function(flag){var q=world().q;q.set(seed(q));var values={};values[flag]=true;q.lifecycle(values);var before=clone(q.get());eq(q.buy('astralcore'),false,'lifecycle blocks '+flag);eq(q.get(),before,'lifecycle retains '+flag);});
 });
 scenario('strict-current-recovery-and-retired-actions',function(){
  var a=world(),q=a.q,s=seed(q);q.set(s);q.save(CLOCK);var good=a.storage.get(P),bad=clone(q.get());bad.astralUpgrades.astralcore=11;a.storage.set(P,JSON.stringify(bad));q.load();eq(q.get().astralUpgrades.astralcore,0,'valid recovery selected');eq(q.persistenceStatus().blocked,true,'bad current source protected');eq(a.storage.get(P),JSON.stringify(bad),'bad raw primary not overwritten');eq(a.storage.get(R),good,'valid recovery not overwritten');
  q=world().q;q.set(seed(q));['meteor','starcall'].forEach(function(id){var before=clone(q.get());eq(q.command(id),false,'retired handler inert');eq(q.commandPlan(id).available,false,'retired preview');eq(q.get(),before,'retired action no side effect');});eq(q.refresh('q_tap_small'),false,'retired consumable Refresh');
 });
 scenario('saved-call-offline-and-permanent-ascend',function(){
  var a=world(),q=a.q,s=seed(q);s.schemaVersion=5;s.owned.starcall=true;s.cometCalled=true;s.cometEvents.firstCommand=true;s.achieved.comet_first_command=true;s.depth=s.enemyDepth=s.farmDepth=9;s.farmReturnDepth=101;s.riftMode='farm';s.enemyHp=s.enemyMaxHp=q.enemyHp(9);s.enemyIsLuminous=true;s.spirits.ember=15;s.activeParty=['ember'];q.set(s);var before=q.get().comets;q.batch(1);eq(q.get().cometCalled,false,'real batch consumes paid old target');eq(q.get().cometEvents.calledKill,true,'real old target earns event');eq(q.get().achieved.comet_called_kill,true,'real old objective stays earned');var paid=q.get().comets;q.batch(1);eq(q.get().comets,paid,'no repeated old event');eq(q.get().cometCharges,0,'no recharge');
  s=seed(q);s.astralUpgrades={astralcore:4,astralecho:3,astralconvergence:2};s.depth=101;q.set(s);eq(q.ascend(),true,'actual Ascend');eq(q.get().astralUpgrades,s.astralUpgrades,'Ascend keeps all permanent investments');
 });
 return {priceCases:prices,migrationCases:refunds,faultCases:faults,families:5};
};
