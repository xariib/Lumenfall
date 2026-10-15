/* Timed Lab packages and global Luminous payout chronology, production code. */
window.labMotesSeed=function(b,ctx){return window.inquirySeed(b,ctx);};
window.runLabMotesQa=function(b,ctx,assert,protectedParity,summaryParity){
 var checks=0,t=b.labMotes,clock=2000000000000,records=[];
 function ok(v,m){checks++;assert(v,'LAB timed oracle: '+m);}
 function same(a,c,m){ok(JSON.stringify(a)===JSON.stringify(c),m);}
 function near(a,c,m){ok(Math.abs(a-c)<1e-6,m+' ('+a+' vs '+c+')');}
 function seed(){var s=window.labMotesSeed(b,ctx);s.moteNextAtMs=0;s.studyBoosts={};return s;}
 function install(s){b.setState(s);b.renderLayout();}
 function active(id){return b.getState().activeStudies.find(function(a){return a.id===id;});}
 function paid(s,id,remaining,speed){s.activeStudies.push({id:id,remainingSec:remaining,totalDurationSec:Math.max(remaining,180),speedMult:speed||1});s.studyUseMotes[id]=true;s.studySpeedTargets[id]=3;return s;}
 b.resetFeedback();
 if(ctx.scenario==='lab-motes-contracts'){
  var tiers=[1.5,2,3,4,5,6,7,8],prices=[800,1500,3500,6500,10000,15000,20500,27500];
  tiers.forEach(function(mult,i){[8,12,24].forEach(function(h,j){
   var cost=Math.ceil(prices[i]*h*[100,95,90][j]/800),s=paid(seed(),'guardmastery',150);s.motes=cost-1;install(s);
   ok(t.cost(mult,h)===cost,'exact visible package '+mult+'/'+h);var before=b.getState(),save=b.rawSave();ok(!t.activate('guardmastery',mult,h),'one-short rejects');same(b.getState(),before,'rejection pure');ok(b.rawSave()===save,'rejection no save');
   s.motes=cost;install(s);ok(t.activate('guardmastery',mult,h),'exact activates');var a=b.getState();ok(a.motes===0&&a.studyBoosts.guardmastery.mult===mult&&a.studyBoosts.guardmastery.expiresAtMs-a.studyBoosts.guardmastery.startedAtMs===h*3600000,'single debit/deadline');same(a.activeStudies,s.activeStudies,'no retroactive work/floor rewrite');
   a.motes=100000;install(a);ok(!t.activate('guardmastery',mult,h)&&!t.activate('guardmastery',8,24),'rich repeated/overlapping input rejected');ok(b.getState().motes===100000,'duplicate pure');
  });});
  [false,true].forEach(function(queue){[false,true].forEach(function(oldConsent){var s=seed();s.motes=100000;s.studyQueue.guardmastery=queue;s.studyUseMotes.guardmastery=oldConsent;install(s);var r=t.direct(0);ok(!!active('guardmastery')===queue,'Study Queue independent');ok(r.summary.studySpeedPurchases===0&&r.state.motes===100000&&!r.state.studyUseMotes.guardmastery,'old consent migrates OFF and never auto spends');if(!queue)ok(b.inquiry.start('guardmastery'),'manual start still allowed');});});
  var s=paid(seed(),'guardmastery',150,4);s.motes=100000;install(s);ok(!t.activate('guardmastery',3,8),'no paid downgrade');var r=t.direct(1);ok(active('guardmastery').speedMult===4&&r.state.motes===100000,'legacy paid floor retained');near(active('guardmastery').remainingSec,146,'legacy work unchanged');
  [0,1.25,9,'3',NaN].forEach(function(mult){ok(!t.activate('guardmastery',mult,8),'invalid tier');});[0,7,48,'8'].forEach(function(h){ok(!t.activate('guardmastery',8,h),'invalid duration');});ok(!t.activate('unknown',8,8),'unknown ID');
  [10,13].forEach(function(level){s=paid(seed(),'measuredinquiry',1);s.longStudyLevels.measuredinquiry=level;s.studyQueue.measuredinquiry=true;install(s);ok(!t.activate('measuredinquiry',3,8),'cap/overcap no spending');r=b.inquiry.tail(2);ok(r.state.longStudyLevels.measuredinquiry===level&&!r.state.activeStudies.length,'cap closes without extra level');});
  s=paid(seed(),'guardmastery',0);install(s);ok(!t.activate('guardmastery',3,8),'due record no spending');s=paid(seed(),'motestudy',100);s.maxDepthEver=s.depth=s.enemyDepth=59;install(s);ok(!t.activate('motestudy',3,8),'locked no spending');
  s=seed();delete s.studyUseMotes;delete s.studySpeedTargets;s.activeStudies=[{id:'guardmastery',remainingSec:70,totalDurationSec:150,speedMult:4}];var input=JSON.stringify(s),n=b.forge.canonical(s);ok(n.studySpeedTargets.guardmastery===4&&!n.studyUseMotes.guardmastery&&!n.studyBoosts.guardmastery,'old saves paid4x/no free timer');same(s,JSON.parse(input),'normalization pure');same(b.forge.canonical(n),n,'idempotent');
  return {checks:checks,tiers:tiers,prices:prices,migration:true};
 }
 if(ctx.scenario==='lab-motes-chronology'){
  function farm(first,accum,tracking){var s=seed();s.depth=s.enemyDepth=s.farmDepth=11;s.farmReturnDepth=12;s.riftMode='farm';s.enemyMaxHp=b.enemyHpFor(11);s.enemyHp=s.enemyMaxHp*.5;s.luminousAccum=accum;s.enemyIsLuminous=first;s.motes=0;s.research.luminoustracking=tracking;s.activeStudies=[];s.spirits.tide=1;s.activeParty=['tide'];s.activeFormationPreset='push';s.formationPresets.push=['tide'];delete s.achieved.autotap;return s;}
  // Independent spawn-by-spawn oracle: rewards only at actual eligible kills,
  // never an expected rate or a batch-end grant. Partial first HP is included.
  [false,true].forEach(function(first){[.01,.37,.95].forEach(function(accum){[0,10].forEach(function(tracking){
   var s=farm(first,accum,tracking),a=accum,flag=first,chance=.05+.005*tracking,payouts=0,next=0,count=0;
   for(var k=1;k<=18001;k++){var at=clock+(k-.5)*10;if(at>clock+180000)break;count++;if(flag&&at>=next){payouts++;next=at+60000;}a+=chance;flag=a>=1-1e-12;if(flag)a-=1;}
   install(s);var r=t.withDps(s.enemyMaxHp*100,function(){return t.direct(180,'live',clock);});ok(r.summary.kills===count,'all kills preserved '+r.summary.kills+'/'+count+' depth'+r.state.depth);ok(r.summary.motesGained===2*payouts&&r.state.motes===2*payouts,'exact cooldown payout oracle '+first+'/'+accum+'/'+tracking);near(r.state.moteNextAtMs,next,'exact payout timestamp');ok(r.summary.studySpeedPurchases===0,'income never authorizes spending');records.push({first:first,accum:accum,tracking:tracking,payouts:payouts,next:next});
  });});});
  var base=farm(false,.37,0);function run(kind,chunk){install(base);return t.withDps(base.enemyMaxHp*100,function(){return chunk?b.simulate(180,kind,chunk,clock):t.direct(180,kind,clock);});}
  var one=run('live'),split=run('live',.25),off=run('offline'),offSplit=run('offline',.25);protectedParity(split.state,one.state,'timed Motes split/live');summaryParity(split.summary,one.summary,'timed Motes split/live');protectedParity(offSplit.state,off.state,'timed Motes split/offline');summaryParity(offSplit.summary,off.summary,'timed Motes split/offline');same([off.state.motes,off.state.moteNextAtMs],[one.state.motes,one.state.moteNextAtMs],'Mote reward policy unscaled');near(off.summary.lumenGained,one.summary.lumenGained*.7,'offline Lumen policy');near(off.summary.shardGained,one.summary.shardGained*.7,'offline Shards policy');
  // Expiry is a chronological boundary; next levels keep only unexpired time.
  var s=paid(seed(),'guardmastery',6);s.studyQueue.guardmastery=true;s.motes=123;s.studyBoosts.guardmastery={mult:3,startedAtMs:clock-28800000+2000,expiresAtMs:clock+2000};install(s);r=b.inquiry.tail(3);ok(r.state.longStudyLevels.guardmastery===1&&r.state.motes===123,'expiry/completion earns once without renewal');near(active('guardmastery').remainingSec,239,'next level at1x after deadline');
  s=paid(seed(),'guardmastery',6);s.studyQueue.guardmastery=true;s.studyBoosts.guardmastery={mult:3,startedAtMs:clock,expiresAtMs:clock+28800000};install(s);r=b.inquiry.tail(3);near(active('guardmastery').remainingSec,237,'same timer across levels');ok(active('guardmastery').speedMult===1,'carry does not mutate legacy floor');
  return {checks:checks,oracle:records,liveOfflineSplit:true};
 }
 var q=function(s){return document.querySelector(s);},s=paid(seed(),'guardmastery',150);s.motes=0;install(s);q('[data-tab="research"]').click();
 var before=b.getState();b.renderLayout();same(b.getState(),before,'render cannot pay');window.runLabUiQa(b,ctx,assert);install(s);
 var select=q('[data-study-speed-target="guardmastery"]');select.focus();window.selectLabSpeed('guardmastery',3);ok(document.activeElement===select&&b.getState().studySpeedTargets.guardmastery===3&&b.getState().motes===0,'selection focus/no spending');
 var duration=q('[data-study-boost-hours="guardmastery"]');duration.focus();duration.value='24';duration.dispatchEvent(new Event('change',{bubbles:true}));ok(document.activeElement===duration&&b.getState().studyBoostHours.guardmastery===24,'duration focus/persistence');
 var snapshot=b.getState(),save=b.rawSave(),recovery=b.rawRecovery(),events=b.lifecycleTrace();b.renderLayout();same(b.getState(),snapshot,'render state purity');same([b.rawSave(),b.rawRecovery(),b.lifecycleTrace()],[save,recovery,events],'render observer/save purity');
 var buy=q('[data-speed-study="guardmastery"]');ok(buy.disabled&&Number(buy.querySelector('[data-price-currency]').dataset.priceAmount)===9450,'poor action retains full discounted package quote');
 Array.from(q('#study-list').querySelectorAll('[data-study-boost-hours],[data-study-speed-target]')).filter(function(e){return e.getClientRects().length;}).forEach(function(e){ok(e.offsetHeight>=44&&e.offsetWidth>=44&&!!e.getAttribute('aria-label'),'44px named native control');});
 ok(!q('[data-study-use-motes]')&&!/Buy now/.test(q('#study-list').textContent),'obsolete controls removed');ok(document.documentElement.scrollWidth<=innerWidth+1,'no horizontal overflow');same(Array.from(document.querySelectorAll('nav.tabbar .tab-btn')).map(function(e){return e.dataset.tab;}),['spirits','workshop','battle','ascend','deeds'],'five destinations');q('[data-tab="battle"]').click();ok(q('main').scrollHeight<=q('main').clientHeight+1,'Rift scroll free');
 return {checks:checks,focus:true,quotes:true};
};

window.runLabMotesPersistence=function(b,ctx,assert,phase,nextPhase,backupCode,finish){
  var keys=['schemaVersion','studyQueue','studyUseMotes','studySpeedTargets','activeStudies','motes','studyBoosts','studyBoostHours','moteNextAtMs'];
  if(phase()===0){var s=window.labMotesSeed(b,ctx);s.studyUseMotes.guardmastery=true;s.studySpeedTargets.guardmastery=3;s.studySpeedTargets.wispascend=8;s.studyQueue.wispascend=true;s.motes=0;s.studyBoosts={guardmastery:{mult:8,startedAtMs:b.clockNow(),expiresAtMs:b.clockNow()+43200000}};s.studyBoostHours.guardmastery=12;s.moteNextAtMs=b.clockNow()+30000;s.activeStudies=[{id:'guardmastery',remainingSec:77,totalDurationSec:150,speedMult:4}];b.setState(s);b.feedbackSave();var expected=b.getState();localStorage.setItem('lab-motes-expected',JSON.stringify(expected));nextPhase(1);if(ctx.scenario==='lab-motes-reset'){b.reset();return;}if(ctx.scenario==='lab-motes-backup-restore'){b.setState(b.freshStateSnapshot());b.restoreBackup(backupCode(expected));return;}if(ctx.scenario==='lab-motes-recovery')b.formationTest.corruptPrimary();b.suppressUnloadSave();location.reload();return;}
  var s=b.getState(),expected=JSON.parse(localStorage.getItem('lab-motes-expected'));
  if(ctx.scenario==='lab-motes-reset'){assert(s.schemaVersion===5&&!s.activeStudies.length&&!Object.keys(s.studyBoosts).length&&s.moteNextAtMs===0&&Object.values(s.studyUseMotes).every(function(v){return v===false;})&&Object.values(s.studySpeedTargets).every(function(v){return v===1.5;}),'actual Reset clears intent, targets and work');finish('pass',{reset:true});return;}
  keys.forEach(function(key){assert(JSON.stringify(s[key])===JSON.stringify(expected[key]),ctx.scenario+' preserves '+key);});
  ['studyUseMotes','studySpeedTargets','activeStudies','studyBoosts','studyBoostHours','moteNextAtMs'].forEach(function(key){assert(JSON.stringify(JSON.parse(b.rawRecovery())[key])===JSON.stringify(expected[key]),'recovery retains '+key);});
  s.depth=s.enemyDepth=16;s.enemyMaxHp=s.enemyHp=b.enemyHpFor(16);b.setState(s);b.ascendManual();s=b.getState();['studyUseMotes','studySpeedTargets','activeStudies','studyQueue','studyBoosts','studyBoostHours','moteNextAtMs'].forEach(function(key){assert(JSON.stringify(s[key])===JSON.stringify(expected[key]),'Ascend preserves '+key);});finish('pass',{keys:keys,ascend:true,activeSpeed:4,independentTarget:3});
};
