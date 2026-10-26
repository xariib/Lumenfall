#!/usr/bin/env node
'use strict';
// Actual Node 8.3 / V8 6.0 acceptance. Only ES2017 and built-in modules are
// used here or in the shared complete-IIFE harness. Fixed independent vectors
// are intentionally separate from the modern numerical oracle.
var fs=require('fs'),path=require('path'),assert=require('assert'),crypto=require('crypto');
var harnessPath=require.resolve('./comet-expansion-harness.cjs');
var H=require(harnessPath),clone=H.clone,P=H.P,R=H.R,CLOCK=H.CLOCK;
var file=path.resolve(process.argv[2]||'index.html'),source=fs.readFileSync(file,'utf8');
var hash=function(value){return crypto.createHash('sha256').update(value).digest('hex');};
var identity={sourceSha256:hash(source),testSha256:hash(fs.readFileSync(__filename)),harnessSha256:hash(fs.readFileSync(harnessPath)),node:process.version,v8:process.versions.v8};
var phase='runtime',checks=0,instances=0,priceCases=0,faultCases=0,numericCases=0,migrationCases=0,invalidCases=0,records=[];
function eq(actual,expected,label){checks++;assert.deepStrictEqual(actual,expected,phase+': '+label);}
function ok(value,label){checks++;assert(value,phase+': '+label);}
function owns(object,key){return Object.prototype.hasOwnProperty.call(object,key);}
function world(raw){instances++;return H.app(source,raw);}
function scenario(id,fn){phase=id;var before=checks;fn();records.push({id:id,checks:checks-before});}
function selected(s,keys){var out={};keys.forEach(function(k){out[k]=clone(s[k]);});return out;}
function storage(a){return Array.from(a.storage.entries());}
function persistentWrites(a,start){return a.writes.slice(start||0).filter(function(v){return v.key===P||v.key===R;});}
function slotsUnchanged(a,before,label){eq(storage(a),before,label);}
function noAction(a,call,label){var before=clone(a.q.get()),slots=storage(a),attempts=a.attempts.length;eq(call(),false,label+' result');eq(a.q.get(),before,label+' live state');slotsUnchanged(a,slots,label+' stored state');eq(a.attempts.length,attempts,label+' makes no storage attempt');}
var OLD_DEEDS=[['d10',5],['d25',10],['d50',20],['d100',50],['d250',100],['tap100',3],['tap1000',8],['tap10000',20],['fullparty',12],['asc1',10],['asc5',25],['asc10',50],['all',30],['mythic',40],['idle8',15],['autotap',25],['labmaster',30],['study1',15],['study25',50],['allstudies',35],['labqueue',40],['firstultimate',45],['modulemax',45]];
var NEW_DEEDS=[['comet_first_command',5],['comet_first_recharge',10],['comet_boss_strike',15],['comet_called_kill',20]];
var ROWS=[['autoascend',1,[100]],['meteor',1,[100]],['starcall',1,[140]],['cometreservoir',2,[60,120]],['cometcycle',3,[80,140,220]],['meteorcore',4,[45,75,120,180]]];
var RETIRED=[['comettrials',140],['rifttrail',50],['starfallcrest',160]];
var EMPTY_LEVELS={cometreservoir:0,cometcycle:0,meteorcore:0};
var EMPTY_EVENTS={firstCommand:false,firstRecharge:false,bossStrike:false,calledKill:false};
var EMPTY_CLAIMS={policy:'comet-commands-001',retired:{comettrials:'absent',rifttrail:'absent',starfallcrest:'absent'},deeds:{}};
var PAID=['nodes','research','longStudyLevels','activeStudies','heroRarity','wispModules','wispUltimate','spirits','activeParty','formationPresets','formationRebuild','empowerQueue','researchQueue','studyQueue','studyUseMotes','savedLabMultiplier','legacyCometPurchases','offline12hRefund','treeTrainingProgress'];
function isolated(q){
  var s=H.seed(q);s.schemaVersion=3;OLD_DEEDS.forEach(function(d){s.achieved[d[0]]=true;});
  // Nonzero historical paid records make preservation assertions sensitive to
  // destructive resets, while all new Tree/Forge operating additions stay0.
  s.nodes.starlight=7;s.nodes.steady=5;s.nodes.momentum=3;s.nodes.echo=6;s.nodes.bonds=10;s.nodes.swift=12;
  s.research.focus=4;s.research.sense=3;s.research.formation=2;s.research.resolve=1;s.research.charge=28;s.research.arcanecal=2;s.research.conduction=3;s.research.luminoustracking=4;
  s.longStudyLevels.riftattune=1;s.longStudyLevels.formationstudy=3;s.longStudyLevels.prismstudy=2;s.longStudyLevels.guardmastery=2;s.longStudyLevels.wispascend=1;s.longStudyLevels.motestudy=3;s.longStudyLevels.measuredinquiry=4;
  s.activeStudies=[{id:'riftattune',remainingSec:900,totalDurationSec:1200,speedMult:1.5},{id:'wispascend',remainingSec:950,totalDurationSec:1800,speedMult:2}];
  s.heroRarity.ember=5;s.wispModules.ember=20;s.wispUltimate.ember=true;
  return s;
}
function funded(a){a.q.set(isolated(a.q));return a.q;}
function upgradeSeed(q,id,level,wallet){
  var s=isolated(q);s.comets=wallet;
  if(id==='cometreservoir'||id==='cometcycle'||id==='meteorcore'){
    s.owned.meteor=s.owned.starcall=true;
    s.cometEvents={firstCommand:true,firstRecharge:true,bossStrike:true,calledKill:true};
    NEW_DEEDS.forEach(function(d){s.achieved[d[0]]=true;});
    s.cometUpgrades[id]=level;s.cometWork=1234;
  }else s.owned[id]=level>0;
  return s;
}
function battle(q,depth){
  var s=isolated(q);s.depth=s.enemyDepth=depth||21;s.enemyMaxHp=s.enemyHp=1000;s.enemyIsLuminous=false;s.luminousAccum=.125;
  Object.keys(s.spirits).forEach(function(id){s.spirits[id]=id==='ember'?100:0;s.heroResource[id]=0;});
  s.activeParty=['ember'];s.activeFormationPreset='custom';s.formationRebuild=null;
  s.buffUntil=0;s.buffMult=1;s.supportBuffs={version:1,sources:{}};
  s.autoAscendEnabled=false;s._autoTapAccum=0;s._autoEmpowerAccum=0;
  return s;
}
function ownedBattle(a,id,depth){var q=a.q;q.set(battle(q,depth));eq(q.buy(id),true,'actual first command purchase '+id);return q;}
function legacyRaw(q,schema,ids){
  var s=isolated(q);s.schemaVersion=schema;s.comets=7;
  s.owned={autoascend:true};ids.forEach(function(id){s.owned[id]=true;});
  s.autoAscendEnabled=true;s.autoAscendTargetDepth=250;
  // Same-day fixtures must retain actual quest slots: ensureDaily deliberately
  // does not fabricate another day's list when the saved date is already today.
  s.questIds=['q_tap_small','q_empower','q_boss'];s.questClaimed={};s.dailyQuestRefreshes=0;
  if(schema===0)delete s.schemaVersion;
  return s;
}
function countWrites(a,start,expected,label){eq(persistentWrites(a,start).map(function(x){return x.key;}),expected,label);}
function savedEndpoint(a,label){[P,R].forEach(function(k){eq(JSON.parse(a.storage.get(k)),a.q.get(),label+' '+k);});}
process.on('uncaughtException',function(error){
  console.log(JSON.stringify(Object.assign({status:'fail',phase:phase,checks:checks,priceCases:priceCases,faultCases:faultCases,numericCases:numericCases,migrationCases:migrationCases,invalidCases:invalidCases,records:records,error:String(error.stack||error),actual:error.actual,expected:error.expected},identity),null,2));process.exit(1);
});
ok(/^v8\.3\./.test(process.version),'actual Node 8.3 required');
ok(/^6\.0\./.test(process.versions.v8),'actual V8 6.0 required');
eq(typeof BigInt,'undefined','runtime has no native BigInt');
var scripts=[],pattern=/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g,match;
while((match=pattern.exec(source))){if(match[1].trim()){new Function(match[1]);scripts.push(match[1]);}}
ok(scripts.length>=1,'every nonempty inline script parses in actual V8 6.0');

scenario('catalog-and-historical-ledgers',function(){
  var a=world(),q=a.q;
  eq(q.schema(),5,'current schema5');
  eq(q.shopDefs().map(function(x){return x.id;}),ROWS.map(function(x){return x[0];}),'six exact ordered catalog IDs');
  eq(q.achievementDefs().map(function(x){return [x.id,x.reward];}),OLD_DEEDS.concat(NEW_DEEDS),'all27 exact rewards and original order');
  eq(OLD_DEEDS.reduce(function(n,x){return n+x[1];},0),683,'independent original23 pool');
  eq(NEW_DEEDS.reduce(function(n,x){return n+x[1];},0),50,'four additional event rewards');
  eq(ROWS.reduce(function(n,r){return n+r[2].reduce(function(a,b){return a+b;},0);},0),1380,'current full purchased ladder');
  eq(RETIRED.reduce(function(n,x){return n+x[1];},0),350,'intentional retirement compensation');
  eq(100+140+50+160,450,'historical four prices kept separate');
  eq(q.get().cometUpgrades,EMPTY_LEVELS,'no free upgrade levels');eq(q.get().cometEvents,EMPTY_EVENTS,'no invented event facts');eq(q.get().cometClaims,EMPTY_CLAIMS,'fresh strict known ledger');
  eq([q.get().owned.meteor,q.get().owned.starcall,q.get().cometCharges,q.get().cometWork,q.get().cometMeteorUsed,q.get().cometCalled],[false,false,0,0,false,false],'fresh command defaults');
  RETIRED.forEach(function(r){eq(q.hasLegacy(r[0]),false,'fresh has no retired entitlement '+r[0]);eq(q.item(r[0]),undefined,'no retired purchase card '+r[0]);});
  var gate=q.achievementDefs().find(function(x){return x.id==='autotap';}),s=q.fresh();s.ascendCount=11;eq(gate.check(s),false,'original AutoTap below12');s.ascendCount=12;eq(gate.check(s),true,'original AutoTap at12');
  [['labmaster',19,20],['labqueue',59,60]].forEach(function(v){var d=q.achievementDefs().find(function(x){return x.id===v[0];}),x=q.fresh();x.research.focus=v[1]-5;x.research.relay=5;eq(d.check(x),false,'all paid Forge levels below '+v[0]);x.research.focus=v[2]-5;eq(d.check(x),true,'historical and current Forge levels reach '+v[0]);});
});

scenario('all-purchased-prices-caps-and-storage',function(){
  ROWS.forEach(function(row){row[2].forEach(function(cost,level){
    phase='purchase '+row[0]+'/'+level;var a=world(),q=a.q,id=row[0];q.set(upgradeSeed(q,id,level,cost-1));
    eq(q.buyPlan(id).cost,cost,'literal exact recipe');eq(q.buyPlan(id).reason,'funds','one Comet short');noAction(a,function(){return q.buy(id);},'short purchase');
    q.get().comets=cost;var before=clone(q.get()),start=a.writes.length;
    eq(q.buyPlan(id).available,true,'fully payable exact quote');eq(q.buy(id),true,'actual paid handler');
    eq(id.indexOf('comet')===0||id==='meteorcore'?q.get().cometUpgrades[id]:q.get().owned[id],id.indexOf('comet')===0||id==='meteorcore'?level+1:true,'one exact purchased entitlement');
    eq(q.get().comets,0,'exact quoted debit');eq(selected(q.get(),PAID),selected(before,PAID),'other paid work and progression unchanged');
    if(id==='autoascend'){eq(q.get().autoAscendEnabled,true,'old purchase default ON');eq(q.get().autoAscendTargetDepth,250,'old purchase target current record');}
    else eq([q.get().autoAscendEnabled,q.get().autoAscendTargetDepth],[before.autoAscendEnabled,before.autoAscendTargetDepth],'purchase preserves Auto-Ascend');
    if(id==='meteor'||id==='starcall')eq([q.get().cometCharges,q.get().cometWork],[1,0],'only first command ownership gifts one charge');
    else eq([q.get().cometCharges,q.get().cometWork],[before.cometCharges,before.cometWork],'upgrade never refills or rescales work');
    if(id==='cometreservoir')eq(q.capacity(),level+2,'actual purchased capacity effect');
    if(id==='cometcycle')eq(q.workPerKill(),[25,32,40][level],'actual purchased recharge effect');
    countWrites(a,start,[P,R],'one primary/recovery commit');savedEndpoint(a,'canonical paid endpoint');
    var cold=world(a.storage);eq(cold.q.get(),q.get(),'cold load exact committed state');eq(q.decode(q.export()),q.get(),'actual exported backup endpoint');
    var restored=world(),restoreStart=restored.writes.length,oldLive=clone(restored.q.get());restored.q.restore(q.export());eq(restored.q.get(),oldLive,'restore protects stored endpoint until its native reload');countWrites(restored,restoreStart,[R,P],'existing restore stages recovery before primary');restored.drain(10);eq(restored.reloads(),1,'one actual reload request');eq(world(restored.storage).q.get(),q.get(),'actual restored cold endpoint');
    priceCases++;
  });
  if(row[0]==='cometreservoir'||row[0]==='cometcycle'||row[0]==='meteorcore'){
    [row[1],row[1]+1,1000000].forEach(function(raw){var a=world(),q=a.q;q.set(upgradeSeed(q,row[0],raw,2000));var before=clone(q.get());eq(q.get().cometUpgrades[row[0]],raw,'retain raw overcap purchase');eq(q.upgradeLevel(row[0]),row[1],'bounded effective rank');eq(q.buyPlan(row[0]).reason,'cap','cap blocks quote');noAction(a,function(){return q.buy(row[0]);},'cap purchase');eq(q.get(),before,'cap retains every raw field');});
  }else{var a=world(),q=a.q;q.set(upgradeSeed(q,row[0],1,2000));eq(q.buyPlan(row[0]).reason,'cap','already owned command cap');noAction(a,function(){return q.buy(row[0]);},'duplicate single purchase');}
  });
});

scenario('purchase-unlocks-lifecycle-and-exact-debit',function(){
  [['meteor','d25'],['starcall','d50'],['cometreservoir','comet_first_command'],['cometcycle','comet_first_recharge'],['cometcycle','d100'],['meteorcore','comet_boss_strike'],['meteorcore','d50']].forEach(function(c){
    var a=world(),q=a.q,s=upgradeSeed(q,c[0],0,2000);s.achieved[c[1]]=false;q.set(s);eq(q.buyPlan(c[0]).reason,'locked','missing sticky Deed '+c.join('/'));noAction(a,function(){return q.buy(c[0]);},'locked '+c.join('/'));
  });
  ['cometreservoir','cometcycle','meteorcore'].forEach(function(id){var a=world(),q=a.q,s=isolated(q);q.set(s);eq(q.buyPlan(id).reason,'locked','no qualifying command ownership '+id);noAction(a,function(){return q.buy(id);},'ownership prerequisite '+id);});
  ROWS.forEach(function(row){var a=world(),q=a.q;q.set(upgradeSeed(q,row[0],0,1e30));eq(q.buyPlan(row[0]).affordable,true,'huge wallet still covers currency color');eq(q.buyPlan(row[0]).reason,'unavailable','unrepresented actual debit');noAction(a,function(){return q.buy(row[0]);},'no free huge-wallet '+row[0]);});
  var a=world(),q=funded(a);['comettrials','rifttrail','starfallcrest','rememberbulk','offline24','unknown'].forEach(function(id){noAction(a,function(){return q.buy({id:id,cost:0});},'retired or unknown '+id);});
  eq(q.buyPlan({id:'meteor',cost:0,cap:100}).cost,100,'caller metadata cannot alter canonical price');
  var lifecycle=['hidden','resetInProgress','reloadInProgress','offlineCatchup','offlinePending','resumeFlowBusy','startupIntroPlaying','persistenceBlocked'];
  lifecycle.forEach(function(key){var a=world(),q=funded(a),patch={};patch[key]=key==='offlineCatchup'?{}:true;q.lifecycle(patch);noAction(a,function(){return q.buy('meteor');},'closed lifecycle '+key);});
  var first=world(),fq=funded(first);eq(fq.buy('meteor'),true,'first command bought');fq.get().cometCharges=0;eq(fq.buy('starcall'),true,'second command bought');eq([fq.get().cometCharges,fq.get().cometWork],[0,0],'second purchase never gifts a refill');
  ['cometreservoir','cometcycle'].forEach(function(id){var a=world(),q=a.q,s=upgradeSeed(q,id,0,2000);s.cometWork=3970;q.set(s);eq(q.buy(id),true,'actual near-complete-work upgrade');eq([q.get().cometCharges,q.get().cometWork],[0,3970],'existing orbital work remains exact '+id);});
});

scenario('all-shop-primary-and-recovery-faults',function(){
  ROWS.forEach(function(row){[true,false].forEach(function(primary){var a=world(),q=a.q;q.set(upgradeSeed(q,row[0],0,row[2][0]));eq(q.save(),true,'initial stored baseline');var before=clone(q.get()),slots=storage(a),start=a.writes.length,attemptStart=a.attempts.length,token=q.runToken();a.fail(primary,!primary);
    eq(q.buy(row[0]),!primary,'actual committed result '+row[0]);
    if(primary){eq(q.get(),before,'entire primary-failed purchase rolled back');eq(q.runToken(),token,'run identity unchanged');slotsUnchanged(a,slots,'old slots preserved');countWrites(a,start,[],'no successful paid write');eq(a.attempts.slice(attemptStart).map(function(v){return [v.key,v.success];}),[[P,false]],'one failed primary, recovery not attempted');}
    else{eq(q.get().comets,0,'primary paid once');countWrites(a,start,[P],'primary retained when recovery fails');eq(a.attempts.slice(attemptStart).map(function(v){return [v.key,v.success];}),[[P,true],[R,false]],'primary then failed recovery');eq(a.storage.get(R),slots.find(function(v){return v[0]===R;})[1],'preceding recovery bytes retained');eq(world(a.storage).q.get(),q.get(),'cold load prioritizes successful primary');}
    a.fail(false,false);if(primary){eq(q.buy(row[0]),true,'actual retry buys exactly once');eq(q.get().comets,0,'retry exact debit');}else noAction(a,function(){return q.buy(row[0]);},'already-owned/capped recovery-failed retry');
    faultCases++;
  });});
});

scenario('raw-old-schema-migrations-and-idempotency',function(){
  [0,1,2].forEach(function(schema){var maker=world(),raw=legacyRaw(maker.q,schema,RETIRED.map(function(r){return r[0];})),rawBytes=JSON.stringify(raw);var a=world([[P,rawBytes],[R,rawBytes]]),q=a.q;
    eq(q.schema(),5,'actual current schema');eq(q.get().schemaVersion,5,'real old-loader endpoint');eq(q.get().comets,357,'7 plus exactly350 retirement');eq(q.get().cometClaims.retired,{comettrials:'settled',rifttrail:'settled',starfallcrest:'settled'},'three retained paid entries');
    RETIRED.forEach(function(r){eq(q.hasLegacy(r[0]),true,'retained legacy '+r[0]);eq(owns(q.get().owned,r[0]),false,'retired ownership removed from current3 '+r[0]);});
    eq([q.get().owned.meteor,q.get().owned.starcall,q.get().cometCharges,q.get().cometWork],[false,false,0,0],'migration grants no new command or work');eq(q.get().cometUpgrades,EMPTY_LEVELS,'migration grants no upgrades');eq(q.get().cometEvents,EMPTY_EVENTS,'historical Deeds do not invent command events');eq(q.get().cometClaims.deeds,{},'historically earned23 rewards not granted again');
    var retained=PAID.filter(function(key){return key!=='offline12hRefund';}),expectedPaid=selected(raw,retained);expectedPaid.activeStudies=expectedPaid.activeStudies.map(function(work,i){work.slot=i;return work;});eq(selected(q.get(),retained),expectedPaid,'all existing paid work preserved with stable slot');
    eq(q.get().offline12hRefund,schema===2?null:{policy:'OFFLINE_12H_001:140/160:sum-ceil-6x1.6^level',offline24:false,offline48:false,reservesLevel:0,comets:0,prismPrices:[],prismsExact:'0',cometsPaid:[true,true],prismsPaid:[]},'original schema0/1 F26 transition versus schema2 null kept exact');
    eq([q.get().autoAscendEnabled,q.get().autoAscendTargetDepth],[true,250],'Auto-Ascend preference retained');ok(q.restStop(),'old Trials keeps Refresh entitlement');
    var endpoint=clone(q.get());eq(q.accept(endpoint),endpoint,'canonical second pass idempotent');eq(q.decode(q.encode(endpoint)),endpoint,'backup second pass idempotent');eq(q.save(),true,'persist migrated endpoint');eq(world(a.storage).q.get(),endpoint,'second cold load cannot repay350');migrationCases++;
  });
  RETIRED.forEach(function(row){[false,'true',1,null].forEach(function(flag){var maker=world(),raw=legacyRaw(maker.q,2,[]);raw.owned[row[0]]=flag;var a=world([[P,JSON.stringify(raw)]]);eq(a.q.get().comets,7,'only strict true is paid '+row[0]);eq(a.q.hasLegacy(row[0]),false,'nontrue has no entitlement '+row[0]);migrationCases++;});});
  var maker=world(),old=legacyRaw(maker.q,1,RETIRED.map(function(r){return r[0];}));delete old.offline12hRefund;old.nodes.reserves=3;old.prisms=100;old.owned.offline24=old.owned.offline48=true;
  var a=world([[P,JSON.stringify(old)]]),q=a.q;eq([q.get().prisms,q.get().comets],[132,657],'F26 old32P/300C then separate350C retirement');eq(q.get().offline12hRefund.prismPrices,[6,10,16],'original paid Prism ladder preserved');eq(q.accept(q.get()),q.get(),'both refund families stable together');migrationCases++;
});

scenario('pending-claims-representability-and-one-pass-order',function(){
  var maker=world(),old=legacyRaw(maker.q,2,RETIRED.map(function(r){return r[0];}));old.comets=1e30;var a=world([[P,JSON.stringify(old)]]),q=a.q;
  eq(q.get().comets,1e30,'huge wallet never receives phantom350');eq(q.get().cometClaims.retired,{comettrials:'due',rifttrail:'due',starfallcrest:'due'},'whole unpaid retired claims remain');RETIRED.forEach(function(r){ok(q.hasLegacy(r[0]),'pending compensation still retains '+r[0]);});
  q.save();eq(world(a.storage).q.get().cometClaims,q.get().cometClaims,'cold retry keeps pending exactly');
  [0.1,0.125].forEach(function(wallet){var a=world(),q=a.q,s=isolated(q);s.comets=wallet;s.cometClaims.deeds.d10=true;q.set(s);eq(q.get().comets,wallet===0.1?0.1:5.125,'whole exact dyadic reward only');eq(!!q.get().cometClaims.deeds.d10,wallet===0.1,'unrepresented fixed reward stays pending');});
  var b=world(),s=legacyRaw(b.q,2,['rifttrail']);s.comets=18014398509481984;b.q.set(s);eq(b.q.get().cometClaims.retired.rifttrail,'due','50 unrepresentable above boundary');eq(b.q.buyPlan('meteor').cost,100,'independent100 debit quote');eq(b.q.buy('meteor'),true,'exact purchase crosses wallet spacing boundary');eq(b.q.get().comets,18014398509481934,'100 debit then distinct50 settlement');eq(b.q.get().cometClaims.retired.rifttrail,'settled','single claim settled once');
  var c=world(),t=legacyRaw(c.q,2,RETIRED.map(function(r){return r[0];}));t.comets=18014398509481984;c.q.set(t);eq(c.q.get().comets,18014398509482284,'fixed onepass140 then skip50 then160');eq(c.q.get().cometClaims.retired,{comettrials:'settled',rifttrail:'due',starfallcrest:'settled'},'no combined350 or fractional partial claim');
  var d=world(),z=isolated(d.q);z.maxDepthEver=10;z.depth=z.enemyDepth=1;z.enemyHp=z.enemyMaxHp=11;z.comets=1e30;z.achieved.d10=false;d.q.set(z);d.q.applyAchievements();eq(d.q.get().achieved.d10,true,'actual original Deed earned');eq(d.q.get().comets,1e30,'actual unrepresented reward never disappears into wallet');eq(d.q.get().cometClaims.deeds.d10,true,'actual newly earned identity remains payable');d.q.get().comets=0;d.q.save();eq(d.q.get().comets,5,'later canonical save pays exactly original5');eq(d.q.get().cometClaims.deeds,{},'whole claim removed only after credit');d.q.save();eq(d.q.get().comets,5,'no duplicate on next save');
});

scenario('strict-current3-preservation-and-backups',function(){
  var mutations=[
    ['missing-claims','invalid-comet-claims',function(s){delete s.cometClaims;}],
    ['unknown-policy','invalid-comet-claims',function(s){s.cometClaims.policy='other';}],
    ['unknown-retired','invalid-comet-claims',function(s){s.cometClaims.retired.unknown='due';}],
    ['bad-status','invalid-comet-claims',function(s){s.cometClaims.retired.rifttrail=true;}],
    ['unknown-deed','invalid-comet-claims',function(s){s.cometClaims.deeds.unknown=true;}],
    ['unearned-deed','invalid-comet-claims',function(s){s.achieved.d10=false;s.cometClaims.deeds.d10=true;}],
    ['missing-levels','invalid-comet-state',function(s){delete s.cometUpgrades;}],
    ['fractional-level','invalid-comet-state',function(s){s.cometUpgrades.cometcycle=.5;}],
    ['extra-level','invalid-comet-state',function(s){s.cometUpgrades.unknown=0;}],
    ['missing-event','invalid-comet-state',function(s){delete s.cometEvents.calledKill;}],
    ['string-event','invalid-comet-state',function(s){s.cometEvents.firstCommand='false';}],
    ['fractional-charge','invalid-comet-state',function(s){s.cometCharges=.5;}],
    ['overflow-bank','invalid-comet-state',function(s){s.cometCharges=2;}],
    ['bad-work','invalid-comet-state',function(s){s.cometWork=4000;}],
    ['marker-type','invalid-comet-state',function(s){s.cometCalled=0;}],
    ['old-owned-in-current3','invalid-comet-state',function(s){s.owned.comettrials=true;}],
    ['missing-command-bit','invalid-comet-state',function(s){delete s.owned.meteor;}],
    ['event-without-command','invalid-comet-state',function(s){s.cometEvents.firstCommand=true;}]
  ];
  mutations.forEach(function(m){var maker=world(),s=isolated(maker.q),good=JSON.stringify(s);m[2](s);var bad=JSON.stringify(s),before=clone(s),error;
    try{maker.q.accept(s);}catch(e){error=e;}ok(error,'current3 malformed input rejected '+m[0]);eq(error.code,m[1],'specific error identity '+m[0]);eq(s,before,'input never repaired in place');
    var a=world([[P,bad],[R,good]]),q=a.q;eq(a.storage.get(P),bad,'bad paid primary raw bytes preserved '+m[0]);eq(a.storage.get(R),good,'recovery raw bytes preserved '+m[0]);ok(q.lifecycle().persistenceBlocked,'malformed paid primary blocks writes '+m[0]);
    var slots=storage(a);eq(q.save(),false,'preservation guard refuses save');slotsUnchanged(a,slots,'no silent replacement of malformed primary');invalidCases++;
  });
  var a=world(),q=funded(a);q.save();var before=clone(q.get()),slots=storage(a);q.restore('invalid backup');eq(q.get(),before,'invalid backup keeps live state');slotsUnchanged(a,slots,'invalid backup keeps both slots');
  var s=isolated(q);s.schemaVersion=99;var raw=JSON.stringify(s),future=world([[P,raw],[R,JSON.stringify(q.get())]]);eq(future.storage.get(P),raw,'future schema protection unchanged');ok(future.q.lifecycle().persistenceBlocked,'future schema remains blocked');
});

scenario('literal-independent-meteor-numerics',function(){
  var q=world().q;
  var vectors=[
    [1000,1000,50,0,{available:true,lethal:false,budget:200,damage:200,hpAfter:800}],
    [1000,350,50,4,{available:true,lethal:true,budget:400,damage:350,hpAfter:0}],
    [10000,10000,100,4,{available:true,lethal:false,budget:1200,damage:1200,hpAfter:8800}],
    [5,5,0.08333333333333333,0,{available:false,reason:'zero-budget',budget:0}],
    [5,5,0.08333333333333334,0,{available:true,lethal:false,budget:1,damage:1,hpAfter:4}],
    [5,0.125,1,0,{available:true,lethal:true,budget:1,damage:0.125,hpAfter:0}],
    [72057594037927936,72057594037927936,Number.MAX_VALUE,0,{available:true,lethal:false,budget:14411518807585586,damage:14411518807585584,hpAfter:57646075230342352}],
    [18014398509481984,18014398509481984,0.25,0,{available:true,lethal:false,budget:3,damage:2,hpAfter:18014398509481982}],
    [18014398509481984,18014398509481984,0.1,0,{available:false,reason:'unrepresentable',budget:1}],
    [5,1.0000000005,1,0,{available:true,lethal:false,budget:1,damage:1,hpAfter:5.000000413701855e-10}],
    [1000,1000,Number.MAX_VALUE,0,{available:true,lethal:false,budget:200,damage:200,hpAfter:800}],
    [Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE,4,{available:true,lethal:false,budget:7.190772539449262e307,damage:7.190772539449262e307,hpAfter:1.0786158809173895e308}],
    [Number.MAX_VALUE,Number.MAX_VALUE,1,4,{available:false,reason:'unrepresentable',budget:12}],
    [Number.MIN_VALUE,Number.MIN_VALUE,Number.MAX_VALUE,0,{available:false,reason:'zero-budget',budget:0}],
    [5,Number.MIN_VALUE,1,0,{available:true,lethal:true,budget:1,damage:Number.MIN_VALUE,hpAfter:0}]
  ];
  vectors.forEach(function(v,i){eq(q.meteorHpPlan(v[0],v[1],v[2],v[3]),v[4],'independent represented HP vector '+i);eq(q.meteorBudget(v[0],v[2],v[3]),v[4].budget,'independent exact quota '+i);numericCases++;});
  eq(q.meteorBudget(9007199254740991,Number.MAX_VALUE,3),3152519739159346,'neither multiply-first nor division-first rounding allowed');
  [[NaN,1,1,0],[Infinity,1,1,0],[1,Infinity,1,0],[1,1,Infinity,0],[-1,1,1,0],[1,-1,1,0],[1,2,1,0],[0,0,1,0],[1,1,-1,0],[1,1,1,NaN],[1,1,1,.5],[1,1,1,-1],[1,1,1,5]].forEach(function(v){eq(q.meteorHpPlan.apply(null,v),{available:false,reason:'invalid',budget:0},'invalid numeric target rejected');numericCases++;});
});

scenario('actual-meteor-no-time-no-extra-hit-and-preview',function(){
  var a=world(),q=ownedBattle(a,'meteor',21);ok(q.passive(21)>=50,'fixture power leaves exact HP cap controlling');var before=clone(q.get()),start=a.writes.length;
  eq(q.commandPlan('meteor').meteor,{available:true,lethal:false,budget:200,damage:200,hpAfter:800},'native numeric preview');eq(q.command('meteor'),true,'actual Meteor owner');
  eq([q.get().enemyHp,q.get().cometCharges,q.get().cometMeteorUsed],[800,0,true],'exact HP and single charge');eq(q.get().comets,before.comets+5,'first actual command earns5 once');eq(q.get().achieved.comet_first_command,true,'actual command sticky Deed');eq(q.get().cometClaims.deeds,{},'represented new reward fully paid');
  ['lumen','shards','motes','sigils','prisms','totalKills','totalTaps','lastSeen','heroResource','buffUntil','buffMult','supportBuffs','_autoTapAccum','_autoEmpowerAccum'].forEach(function(k){eq(q.get()[k],before[k],'Meteor does not borrow '+k);});eq(selected(q.get(),PAID),selected(before,PAID),'paid progress unchanged');countWrites(a,start,[P,R],'one command transaction');
  noAction(a,function(){return q.command('meteor');},'same encounter cannot use Meteor twice');q.save();var cold=world(a.storage);eq([cold.q.get().enemyHp,cold.q.get().cometMeteorUsed],[800,true],'encounter use saved across cold load');noAction(cold,function(){return cold.q.command('meteor');},'reload cannot repeat');
  var b=world(),z=ownedBattle(b,'meteor',21);z.get().cometCharges=0;eq(z.commandPlan('meteor').meteor.available,true,'zero charge still exposes real numerical preview');eq(z.commandPlan('meteor').available,false,'zero charge cannot act');z.lifecycle({offlineCatchup:{}});eq(z.commandPlan('meteor').meteor.budget,200,'offline gate does not erase numerical preview');eq(z.commandPlan('meteor').available,false,'offline command closed');
  var c=world(),x=ownedBattle(c,'meteor',21);x.get().enemyMaxHp=5;x.get().enemyHp=1.0000000005;var kills=x.get().totalKills;eq(x.command('meteor'),true,'sub-epsilon residual real command');eq(x.get().enemyHp,5.000000413701855e-10,'positive represented residual kept alive');eq(x.get().totalKills,kills,'no shared-epsilon phantom kill');eq(x.get().depth,21,'no premature spawn');
  var d=world(),z=ownedBattle(d,'meteor',20);eq(z.command('meteor'),true,'actual boss strike earns the Core gate');eq(z.get().achieved.comet_boss_strike,true,'Core gate comes from real command event');
  [45,75,120,180].forEach(function(cost,rank){z.get().comets=cost;var power=z.passive(20);eq(z.buy('meteorcore'),true,'actual paid Core rank '+(rank+1));eq(z.passive(20),power,'Core never changes ordinary Wisp power');eq(z.commandPlan('meteor').meteor.budget,[250,300,350,400][rank],'purchased Core changes the real command plan');});
});

scenario('actual-command-rejections-and-primary-faults',function(){
  ['meteor','starcall'].forEach(function(id){['hidden','resetInProgress','reloadInProgress','offlineCatchup','offlinePending','resumeFlowBusy','startupIntroPlaying','persistenceBlocked'].forEach(function(key){var a=world(),q=ownedBattle(a,id,21),patch={};patch[key]=key==='offlineCatchup'?{}:true;q.lifecycle(patch);noAction(a,function(){return q.command(id);},'command '+id+' lifecycle '+key);});
    [true,false].forEach(function(primary){var a=world(),q=ownedBattle(a,id,21),before=clone(q.get()),slots=storage(a),token=q.runToken(),start=a.writes.length;a.fail(primary,!primary);eq(q.command(id),!primary,'actual command fault '+id);
      if(primary){eq(q.get(),before,'whole primary-failed command rollback');eq(q.runToken(),token,'command run identity rollback');slotsUnchanged(a,slots,'command slots unchanged');countWrites(a,start,[],'no committed command');a.fail(false,false);eq(q.command(id),true,'single successful command retry');}
      else{countWrites(a,start,[P],'command primary survives recovery failure');eq(q.get().cometCharges,0,'committed charge spent once');eq(world(a.storage).q.get(),q.get(),'cold primary is accepted command');}
      faultCases++;
    });
  });
  var a=world(),q=ownedBattle(a,'starcall',20);noAction(a,function(){return q.command('starcall');},'Call cannot target a boss');q.get().depth=q.get().enemyDepth=21;q.get().enemyIsLuminous=true;noAction(a,function(){return q.command('starcall');},'Call cannot overwrite natural Luminous');q.get().enemyIsLuminous=false;q.get().enemyHp=0;noAction(a,function(){return q.command('starcall');},'Call cannot target dead enemy');noAction(a,function(){return q.command('unknown');},'unknown command');
  var b=world(),z=ownedBattle(b,'meteor',21);z.get().owned.autoascend=true;z.get().autoAscendEnabled=true;z.get().autoAscendTargetDepth=21;ok(z.autoReady(),'actual ready Auto-Ascend fixture');noAction(b,function(){return z.command('meteor');},'already ready Auto-Ascend');
});

scenario('actual-call-kill-natural-counter-and-retained-motes',function(){
  ['manual','simulation','farm'].forEach(function(kind){var a=world(),q=ownedBattle(a,'starcall',21);if(kind==='farm'){q.get().riftMode='farm';q.get().farmDepth=21;q.get().farmReturnDepth=22;}
    q.get().longStudyLevels.motestudy=3;var before=clone(q.get()),expectedMotes=q.motes(21),start=a.writes.length;
    eq(q.command('starcall'),true,'actual paid Call '+kind);eq([q.get().enemyHp,q.get().enemyMaxHp,q.get().luminousAccum],[before.enemyHp,before.enemyMaxHp,before.luminousAccum],'Call changes neither HP nor natural spawn clock');eq([q.get().enemyIsLuminous,q.get().cometCalled,q.get().cometCharges],[true,true,0],'called encounter tagged once');eq(q.get().motes,before.motes,'no immediate invented bounty');countWrites(a,start,[P,R],'Call single commit');
    var called=clone(q.get());q.save();var cold=world(a.storage);eq(cold.q.get().cometCalled,true,'called identity survives reload');
    if(kind==='manual')q.manualKill();else if(kind==='simulation')q.kill('live');else q.batch(1,'live');
    eq(q.get().motes-before.motes,expectedMotes,'canonical retained fixed Motes '+kind);eq(q.get().cometEvents.calledKill,true,'actual called defeat event '+kind);eq(q.get().achieved.comet_called_kill,true,'actual called-kill Deed '+kind);eq(q.get().comets,called.comets+20,'called-kill exact20 once');eq([q.get().cometCalled,q.get().cometMeteorUsed],[false,false],'real replacement clears encounter markers');eq([q.get().cometCharges,q.get().cometWork],[0,20],'actual one defeat adds20 orbital work');
    var wallet=q.get().comets;q.applyAchievements();eq(q.get().comets,wallet,'earned called-kill cannot pay twice');
  });
});

scenario('actual-orbital-kill-work-and-bounded-farm-batches',function(){
  var a=world(),q=ownedBattle(a,'meteor',21);eq(q.command('meteor'),true,'spend the earned initial bank');q.get().riftMode='farm';q.get().farmDepth=21;q.get().farmReturnDepth=22;
  var before=q.get().comets,first=q.batch(199,'live');eq(first.kills,199,'actual batch count');eq([q.get().cometCharges,q.get().cometWork],[0,3980],'199 real defeats at20work');eq(q.get().cometEvents.firstRecharge,false,'no premature recharge event');var last=q.kill('live');eq(last.kills,1,'actual final defeat');eq([q.get().cometCharges,q.get().cometWork],[1,0],'200th actual defeat fills bank');eq(q.get().cometEvents.firstRecharge,true,'recharge observed');eq(q.get().achieved.comet_first_recharge,true,'actual recharge Deed');eq(q.get().comets,before+10,'one actual recharge reward10');
  [0,1,2,3].forEach(function(rank){[0,1,2].forEach(function(reserve){var b=world(),z=b.q,s=battle(z,21);s.owned.meteor=true;s.cometEvents.firstCommand=true;s.achieved.comet_first_command=true;s.cometUpgrades.cometcycle=rank;s.cometUpgrades.cometreservoir=reserve;s.riftMode='farm';s.farmDepth=21;s.farmReturnDepth=22;z.set(s);var rate=[20,25,32,40][rank],threshold=Math.ceil((reserve+1)*4000/rate);eq(z.capacity(),reserve+1,'independent bank capacity');eq(z.workPerKill(),rate,'independent work rate');z.batch(threshold-1,'live');var total=(threshold-1)*rate;eq([z.get().cometCharges,z.get().cometWork],[Math.floor(total/4000),total%4000],'below total bank threshold');z.kill('live');eq([z.get().cometCharges,z.get().cometWork],[reserve+1,0],'saturated final defeat clamps only real capacity');z.batch(1e20,'live');eq([z.get().cometCharges,z.get().cometWork],[reserve+1,0],'huge actual Farm batch bounded at full bank');});});
  var b=world(),z=b.q,s=battle(z,21);s.owned.meteor=true;s.cometEvents.firstCommand=true;s.achieved.comet_first_command=true;s.totalKills=1e30;z.set(s);z.kill('live');eq(z.get().totalKills,'1000000000000000019884624838657e0','unsafe binary Number lifetime count gains exactly one victory');eq([z.get().cometCharges,z.get().cometWork],[0,20],'actual defeat hook independent of rounded Number counter delta');
});

scenario('lethal-meteor-auto-ascend-atomicity-and-run-token',function(){
  [null,'primary','recovery'].forEach(function(fault){var a=world(),q=ownedBattle(a,'meteor',20);q.get().owned.autoascend=true;q.get().autoAscendEnabled=true;q.get().autoAscendTargetDepth=21;q.get().ascendCount=1e30;q.get().enemyHp=100;q.get().enemyMaxHp=1000;q.get().cometWork=0;q.save();var before=clone(q.get()),token=q.runToken(),slots=storage(a),start=a.writes.length,observed=[];
    var stop=q.observe('applyAscendMutation',function(e){if(e.phase==='after')observed.push({before:e.beforeToken,after:e.token});});a.fail(fault==='primary',fault==='recovery');eq(q.commandPlan('meteor').meteor.lethal,true,'valid actual lethal plan');eq(q.command('meteor'),fault!=='primary','actual lethal command result');stop();eq(observed.length,1,'exactly one canonical Auto-Ascend mutation');
    if(fault==='primary'){eq(q.get(),before,'kill rewards, charge, events and Ascend all rollback');eq(q.runToken(),token,'old transient run token restored');slotsUnchanged(a,slots,'primary failure keeps raw slots');countWrites(a,start,[],'nested kill/Ascend performs no inner committed write');a.fail(false,false);eq(q.command('meteor'),true,'retry lethal command once');}
    else{ok(q.runToken()!==token,'new run token with exact wide ascendCount');eq(q.get().ascendCount,'1000000000000000019884624838657e0','legacy unsafe binary Number gains exactly one Ascend');countWrites(a,start,fault==='recovery'?[P]:[P,R],'one outer save after mutation-only Ascend');}
    eq([q.get().depth,q.get().enemyDepth],[1,1],'actual canonical next run');eq(q.get().totalKills,before.totalKills+1,'exactly one defeated boss');eq([q.get().cometMeteorUsed,q.get().cometCalled],[false,false],'new encounter has no old use markers');eq([q.get().cometCharges,q.get().cometWork],[0,20],'spent bank and actual one-kill work cross Ascend unchanged');eq([q.get().cometEvents.firstCommand,q.get().cometEvents.bossStrike],[true,true],'actual first command and boss events retained');eq(q.get().comets,before.comets+20,'5 first command plus15 boss once');eq(q.get().autoAscendTargetDepth,21,'target exactly retained');
    eq(world(a.storage).q.get(),q.get(),'cold primary contains whole lethal endpoint');faultCases++;
  });
});

scenario('legacy-trials-refresh-and-save-faults',function(){
  var maker=world(),raw=legacyRaw(maker.q,2,['comettrials','rifttrail','starfallcrest']),a=world([[P,JSON.stringify(raw)]]),q=a.q;
  ok(q.restStop(),'AA plus retained Trials unlocks old Rest Stop');eq(q.queueTrial('quiet',30),true,'retained Trial can still be queued');eq(q.get().cometTrial.id,'quiet','legacy queued work retained');q.cancelTrial();
  q.selectCosmetic('trail',true);q.selectCosmetic('crest',true);eq(q.get().cometCosmetics,{trail:true,crest:true},'old paid equipment remains selectable');
  [null,'primary','recovery'].forEach(function(fault){var m=world(),old=legacyRaw(m.q,2,['comettrials']);var a=world([[P,JSON.stringify(old)]]),q=a.q;q.ensureDaily();q.get().comets=100;q.get().dailyQuestRefreshes=0;var id=q.get().questIds[0],plan=q.refreshPlan(id);ok(plan.available,'actual original eligible Refresh');eq(plan.cost,25,'unchanged anti-arbitrage cost');var before=clone(q.get()),slots=storage(a),start=a.writes.length;a.fail(fault==='primary',fault==='recovery');eq(q.refresh(id),fault!=='primary','actual refresh committed result');
    if(fault==='primary'){eq(q.get(),before,'primary-failed refresh rolls back slot/counter/debit');slotsUnchanged(a,slots,'failed refresh keeps old raw slots');countWrites(a,start,[],'no successful failed Refresh save');a.fail(false,false);eq(q.refresh(id),true,'refresh retry succeeds once');}
    else countWrites(a,start,fault==='recovery'?[P]:[P,R],'one Refresh save owner');
    eq(q.get().comets,75,'exact original25 paid once');eq(q.get().dailyQuestRefreshes,1,'one deterministic replacement');eq(q.get().questIds[0],typeof plan.replacement==='string'?plan.replacement:plan.replacement.id,'live canonical deterministic candidate');eq(q.get().dailyStats,before.dailyStats,'earned daily progress retained');faultCases++;
  });
  var b=world(),old=legacyRaw(b.q,2,['comettrials']);b.q.set(old);b.q.ensureDaily();var id=b.q.get().questIds[0];b.q.get().comets=1e30;eq(b.q.refreshPlan(id).reason,'unavailable','huge covered wallet cannot pay25');noAction(b,function(){return b.q.refresh(id);},'no free oversized Refresh');b.q.get().comets=100;b.q.get().dailyQuestRefreshes=1e30;noAction(b,function(){return b.q.refresh(id);},'unrepresented refresh ordinal');
});

scenario('real-offline-call-endpoint-and-bank-retention',function(){
  var a=world(),q=ownedBattle(a,'starcall',21);q.get().riftMode='farm';q.get().farmDepth=21;q.get().farmReturnDepth=22;q.get().enemyHp=1;eq(q.command('starcall'),true,'real called enemy before offline');var before=clone(q.get());q.get().lastSeen=CLOCK-5000;var result,callbacksBefore=a.pending();q.offline(function(value){result=value;});var callbacks=a.drain(10000);ok(result,'actual bounded offline completion callback');ok(callbacks>=callbacksBefore,'bounded callbacks observed');ok(q.get().totalKills>before.totalKills,'actual offline defeats occur');eq(q.get().achieved.comet_called_kill,true,'actual offline called kill earns event');eq(q.get().cometCalled,false,'real offline enemy replacement clears marker');eq(q.get().cometCharges,Math.min(1,Math.floor((q.get().totalKills-before.totalKills)*20/4000)),'actual offline kills fund finite bank');ok(q.get().cometWork>=0&&q.get().cometWork<4000,'bounded offline orbital remainder');eq(q.get().autoAscendTargetDepth,before.autoAscendTargetDepth,'offline retains target');
  eq(world(a.storage).q.get(),q.get(),'cold load retains actual offline endpoint');eq(q.decode(q.export()),q.get(),'offline backup exact');
});

phase='completion';
eq(records.length,15,'all required old-runtime acceptance families completed');
console.log(JSON.stringify(Object.assign({status:'pass',checks:checks,inlineScriptsParsed:scripts.length,completeIifeInstances:instances,priceCases:priceCases,faultCases:faultCases,numericCases:numericCases,migrationCases:migrationCases,invalidCases:invalidCases,records:records,bigIntAvailable:false,scope:'Actual Node8.3/V8 6.0 complete production IIFE: all six purchases, fixed numeric vectors, old/current schema, exact claims, actual commands and defeat owners, Auto-Ascend, offline and persistence. Native browser layout is a separate gate.'},identity),null,2));
