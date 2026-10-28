'use strict';
// Complete production IIFE, read-only observations and independent removal
// replays. ES2017 so exactly the same contracts also execute on V8 6.0.
var fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
var source=fs.readFileSync(process.argv[2]||path.join(__dirname,'../../index.html'),'utf8'),clock=2000000000000;
function clone(x){return JSON.parse(JSON.stringify(x));}
function world(html){
 var ctx=vm.createContext({document:{readyState:'loading',addEventListener:function(){}},window:{addEventListener:function(){}},console:console});
 var game=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1],marker="if(document.readyState==='loading'){";
 assert.strictEqual(game.split(marker).length,2);
 var bridge="window.roles={set:function(s){state=acceptPersistedState(s);},get:function(){return state;},fresh:freshState,compare:typeof wispRoleComparison==='function'?wispRoleComparison:null,snapshot:typeof wispRoleSnapshot==='function'?wispRoleSnapshot:null,spirits:function(){return SPIRITS;},forge:function(){return RESEARCH;},dps:sustainedCombatDps,passive:passiveWispDpsAt,buff:simulationBuffMult,auto:automatedGuardianDps,ability:averageAbilityDps,rewards:abilityRewardPerCast,power:wispPower,profile:forgeChargeProfile,simulate:function(sec,kind,start){return advanceAuthoritativeTime(sec,{kind:kind,visual:false,clockStartMs:start,offlineWindowStartMs:start});}};";
 vm.runInContext(game.replace(marker,bridge+marker),ctx);return ctx.window.roles;
}
function contracts(html){
 var b=world(html),spirits=clone(b.spirits()),ids=spirits.map(function(s){return s.id;}),checks=0,records=[];
 function near(a,c,m){checks++;assert(Number.isFinite(a)&&Number.isFinite(c)&&Math.abs(a-c)<=Math.max(1e-6,Math.abs(a)*1e-12,Math.abs(c)*1e-12),m+': '+a+' / '+c);}
 function ok(x,m){checks++;assert(x,m);}
 function eq(a,c,m){checks++;assert.deepStrictEqual(clone(a),clone(c),m);}
 function combos(xs,k){if(!k)return [[]];var result=[];xs.forEach(function(id,i){combos(xs.slice(i+1),k-1).forEach(function(t){result.push([id].concat(t));});});return result;}
 function seed(party,depth,forge){
  var s=b.fresh();s.maxDepthEver=250;s.depth=depth;s.activeParty=party;s.formationRebuild=null;
  ids.forEach(function(id,i){s.spirits[id]=170-i*17;s.heroRarity[id]=5;s.wispModules[id]=20;s.wispUltimate[id]=true;});
  s.achieved.autotap=true;s.nodes.momentum=3;s.research.formation=2;s.research.charge=10;s.longStudyLevels.wispascend=3;
  if(forge)b.forge().forEach(function(n){if(n.forgeGroup && !n.retiredTo)s.research[n.id]=n.levelCap||5;});
  return s;
 }
 var literal=seed(['stone','gale','thorn','tide','aurora'],99,false);
 ['gale','thorn'].forEach(function(id){literal.spirits[id]=100;literal.heroRarity[id]=0;literal.wispModules[id]=0;literal.wispUltimate[id]=false;});
 literal.research.conduction=0;b.set(literal);var lv=clone(b.compare(99,clock)).steady;
 eq(lv.rows[3].shardsPerCast,1940,'literal Gale100 Quarry/Dawn reward');eq(lv.rows[4].lumenPerCast,20298,'literal Thorn100 Harvest/Dawn reward');
 literal.research.dualchannel=5;b.set(literal);lv=clone(b.compare(99,clock)).steady;
 eq(lv.rows[3].lumenPerCast,1940,'literal Dual Channel Gale secondary reward');eq(lv.rows[4].shardsPerCast,2029,'literal Dual Channel Thorn secondary reward');
 combos(ids,5).forEach(function(party){[99,160,170,180].forEach(function(depth){[false,true].forEach(function(forge){
  var s=seed(party,depth,forge);b.set(s);var before=JSON.stringify(b.get()),r=clone(b.compare(depth,clock)),v=r.steady;
  near(v.totalDps,b.dps(depth),'authoritative total');near(v.rawDps+v.bondDps+v.supportDps,v.totalDps,'additive ledger');
  near(v.rows.reduce(function(n,row){return n+row.rawDps;},0)+v.guardianBaseDps,v.rawDps,'raw row conservation');
  near(v.rows.reduce(function(n,row){return n+row.supportDps;},0),v.supportDps,'Support counted once');
  ok(JSON.stringify(b.get())===before,'read-only complete state');
  v.rows.forEach(function(row,i){
   if(row.active){var without=clone(s);without.activeParty=party.filter(function(id){return id!==row.id;});b.set(without);near(row.removalDps+b.dps(depth),v.totalDps,'independent authoritative removal');b.set(s);
    var reward=clone(b.rewards(b.spirits()[i],s.spirits[row.id]));eq([row.lumenPerCast,row.shardsPerCast],[reward.lumen,reward.shards],'exact current per-cast resources');
   }else eq([row.rawDps,row.supportDps,row.removalDps,row.lumenPerCast,row.shardsPerCast],[0,0,0,0,0],'benched has no future contribution');
  });
  records.push({party:party,depth:depth,forge:forge,total:v.totalDps});
 });});});
 var s=seed(['ember','tide','aurora','void','titan'],99,true);
 s.supportBuffs={version:1,sources:{tide:{mult:1.25,until:clock+4000},aurora:{mult:1.5,until:clock+8000}}};
 [1,1.3,1.8,3].forEach(function(legacy){[0,4000,8000].forEach(function(offset){
  s.buffUntil=clock+6000;s.buffMult=legacy;b.set(s);var now=clock+offset,v=clone(b.snapshot(99,now));
  near(v.passiveDps,b.passive(99)*b.buff(now),'exact current passive/expiry/legacy');
  // Current ability/Auto-Tap rates are previews; current buff applies only to
  // passive damage and tap. Production auto() uses average future Support.
  var steady=clone(b.snapshot(99,now,undefined,true)),avg=b.profile(99).supportMult;
  near(v.totalDps,b.passive(99)*b.buff(now)+b.ability(99)+b.auto(99)/avg*b.buff(now),'source plus opaque legacy scope');
 });});
 s.activeParty=['ember'];b.set(s);var r=clone(b.compare(99,clock));
 ok(r.current.rows[1].supportDps>0,'earned benched Support retained');eq(r.steady.rows[1].supportDps,0,'no future benched Support');
 s=seed(['tide','aurora'],99,true);s.spirits.tide=s.spirits.aurora=0;s.formationRebuild={members:['tide','aurora'],preset:'farm'};b.set(s);
 r=clone(b.compare(99,clock));eq(r.steady.bonds,[],'pending Bond absent');eq(r.steady.rows[1].rawDps,0,'pending damage absent');
 [Math.pow(2,53),1e30].forEach(function(ordinal){s=seed(['ember','tide','stone','gale','aurora'],160,true);s.totalTaps=ordinal;b.set(s);near(b.compare(160,clock).steady.totalDps,b.dps(160),'retained unsafe tap ordinal cadence');});
 s=seed(['ember','tide','stone','gale','aurora'],101,true);b.set(s);var canonical=clone(b.get());b.set(canonical);eq(b.get(),canonical,'canonical endpoint idempotent');
 return {status:'PASS',checks:checks,teams:56,contexts:4,forgeContexts:2,records:records};
}
function preservation(html,baseline){
 assert.strictEqual(crypto.createHash('sha256').update(baseline).digest('hex'),'d90742bc1e9377e8a35ac8dc498f3a6d5509d2c05e71353f2c3df33d6e6f21f8','immutable pre-display source');
 // F19 intentionally changes Deed counting and the minimum natural cycle.
 // Apply those approved rules to the immutable pre-readout oracle, retaining
 // its original Wisp formulas/controller. ENDLESS adds explicit state fields
 // and changes combat pacing; compare all prior fields in a no-kill world,
 // while separately asserting the new fields start without free Mastery.
 function approvedRule(from,to){assert.strictEqual(baseline.split(from).length,2,'unique approved Swift oracle anchor');baseline=baseline.replace(from,to);}
 approvedRule('var SAVE_SCHEMA_VERSION = 3;','var SAVE_SCHEMA_VERSION = 4;');
 approvedRule('return LEGACY_RESEARCH_IDS.reduce(function(sum,id){return sum+(s.research[id]||0);},0);','return RESEARCH.reduce(function(sum,node){return sum+(s.research[node.id]||0);},0);');
 approvedRule('schemaVersion:SAVE_SCHEMA_VERSION, offline12hRefund:null,','schemaVersion:SAVE_SCHEMA_VERSION, offline12hRefund:null,\n    swiftRecoveryRefund:null, swiftRecoveryRefundAudit:null,');
 approvedRule('var ABILITY_BASE_CYCLE_SEC = 6;','var ABILITY_BASE_CYCLE_SEC = 6;\nvar ABILITY_MIN_CYCLE_SEC = 10 / 3;');
 approvedRule("function fillRateMult(level){ return researchFactor('charge',level); }\nfunction abilityCycleSeconds(level){ return ABILITY_BASE_CYCLE_SEC / fillRateMult(level); }","function abilityCycleSeconds(level){ return Math.max(ABILITY_MIN_CYCLE_SEC,ABILITY_BASE_CYCLE_SEC / researchFactor('charge',level)); }\nfunction fillRateMult(level){ return Math.min(researchFactor('charge',level),ABILITY_BASE_CYCLE_SEC / ABILITY_MIN_CYCLE_SEC); }");
 // F18 changes only the approved duration/recast policy in the historical
 // world. Its scheduler, charge arithmetic and Wisp formulas stay original.
 // Independent interval-union/payment/save checks live in support-recast-current.
 approvedRule('buffUntil:0, buffMult:1, supportBuffs:null,','buffUntil:0, buffMult:1, supportBuffs:null, supportRecastUntil:{tide:0,aurora:0},');
 approvedRule('out.supportBuffs = normalizeSupportBuffs(source.supportBuffs,out.research);',
  'out.supportBuffs = normalizeSupportBuffs(source.supportBuffs,out.research);\n    if(source.supportRecastUntil)out.supportRecastUntil=clonePersistedValue(source.supportRecastUntil);');
 approvedRule('durationMs:ultimate ? 8000 : 4000','durationMs:ultimate ? 1500 : 1000');
 approvedRule('function simulationNextAbilitySeconds(){','function simulationNextAbilitySeconds(nowMs,clock){');
 approvedRule('next = Math.min(next,Math.max(0,(100-cur)/fillPerSec));',
  'var delay=(id===\'tide\'||id===\'aurora\') ? supportDeadlineSecondsRemaining(state.supportRecastUntil[id],nowMs,clock) : 0;\n    next = Math.min(next,Math.max(0,(100-cur)/fillPerSec,delay));');
 approvedRule('ability:simulationNextAbilitySeconds(),','ability:simulationNextAbilitySeconds(simulationNowMs(),simulationClockPosition()),');
 approvedRule('var abilityStep = simulationNextAbilitySeconds();','var abilityStep = simulationNextAbilitySeconds(nowMs,simulationClockPosition());');
 approvedRule('if(!sp) continue;\n    var run=ascendRunToken,relay=',
  'if(!sp) continue;\n    if(sp.abilityType===\'support\' && supportDeadlineSecondsRemaining(state.supportRecastUntil[id],nowMs,clock)>SIM_EPS)continue;\n    var run=ascendRunToken,relay=');
 approvedRule('// buffUntil/buffMult are an opaque legacy entitlement, never an aggregate.',
  'state.supportRecastUntil[sp.id]=nowMs+abilityCycleSeconds()*1000;\n  // buffUntil/buffMult are an opaque legacy entitlement, never an aggregate.');
 approvedRule('var charge=ids.map(function(){return 0;}),until=ids.map(function(){return 0;}),counts=',
  'var charge=ids.map(function(){return 0;}),until=ids.map(function(){return 0;}),available=ids.map(function(){return 0;}),counts=');
 approvedRule('if(charge[i]<100-1e-7) return;','if(charge[i]<100-1e-7 || (m.support && u+1e-9<available[i])) return;');
 approvedRule('if(m.support){until[i]=u+m.duration;pending+=relay;} else charge[i]=refund;',
  'if(m.support){until[i]=u+m.duration;available[i]=u+1;pending+=relay;} else charge[i]=refund;');
 approvedRule('charge.forEach(function(value){dt=Math.min(dt,Math.max(0,(100-value)/100));});',
  'charge.forEach(function(value,i){dt=Math.min(dt,Math.max(0,(100-value)/100,members[i].support ? available[i]-u : 0));});');
 // F17's separately approved polynomial changes Ember/Stone only; prices and
 // all remaining historical power/resource/controller formulas stay original.
 approvedRule('return sp.basePower * level * (1 + 0.01*(level-1));',
  "var bonus=(sp.id==='ember'||sp.id==='stone')&&level>70?352*(level-70)*(level-70):0;\n  return sp.basePower * level * (1 + 0.01*(level-1)) + bonus;");
 // Apply only the approved current-Rift currency input ceiling to the frozen
 // reward oracle. Its rounding, resource multipliers and chronology stay intact.
 approvedRule('function abilityRewardRaw(sp,level,conductionLevel){',
  "function abilityRewardRaw(sp,level,conductionLevel){\n  var rift=state.depth<=100?state.depth:100+40*Math.log1p((state.depth-100)/40);\n  var originalPower=wispPower;wispPower=function(w,l){var p=originalPower(w,l);return w.id===sp.id&&w.abilityType==='ranged'?Math.min(p,40*Math.pow(1.09,rift)):w.id===sp.id&&w.abilityType==='druid'?Math.min(p,100*Math.pow(1.11,rift)):p;};\n  try{return cappedAbilityRewardRaw(sp,level,conductionLevel);}finally{wispPower=originalPower;}\n}\nfunction cappedAbilityRewardRaw(sp,level,conductionLevel){");
 var before=world(baseline),after=world(html),ids=clone(after.spirits()).map(function(s){return s.id;}),checks=0,cases=[];
 function eq(a,b,m){checks++;assert.deepStrictEqual(clone(a),clone(b),m);}
 function oldFields(s){s=clone(s);if(Object.prototype.hasOwnProperty.call(s,'offlineClockHighWaterMs')){eq(s.offlineClockHighWaterMs,s.lastSeen,'new clock metadata retains exact historical endpoint');delete s.offlineClockHighWaterMs;}delete s.farmAutoResume;delete s.schemaVersion;delete s.astralUpgrades;delete s.commandRefund;delete s.wispMastery;delete s.canonicalAutomationClock;delete s.recruitmentEntitlements;delete s.research.masterwork;delete s.researchQueue.masterwork;delete s.studyBoosts;delete s.studyBoostHours;delete s.pausedStudies;delete s.studySlotProjects;delete s.moteNextAtMs;return s;}
 var noMastery={};ids.forEach(function(id){noMastery[id]=0;});
 var noBoostHours={};Object.keys(after.fresh().longStudyLevels).forEach(function(id){noBoostHours[id]=8;});
 function combos(xs,k){if(!k)return [[]];var r=[];xs.forEach(function(id,i){combos(xs.slice(i+1),k-1).forEach(function(t){r.push([id].concat(t));});});return r;}
 combos(ids,5).forEach(function(party){[99,160,170,180].forEach(function(depth){[false,true].forEach(function(forge){
  var s=before.fresh();s.lastSeen=clock;s.maxDepthEver=250;s.depth=depth;s.activeParty=party;s.achieved.autotap=true;
  ids.forEach(function(id,i){s.spirits[id]=170-i*17;s.heroRarity[id]=5;s.wispModules[id]=20;s.wispUltimate[id]=true;});
  s.research.charge=10;if(forge)before.forge().forEach(function(n){if(n.forgeGroup&&!n.retiredTo)s.research[n.id]=n.levelCap||5;});
  before.set(s);after.set(s);eq(oldFields(after.get()),oldFields(before.get()),'every prior canonical field retained');eq(after.get().schemaVersion,6,'current schema6');eq(after.get().astralUpgrades,{astralcore:0,astralecho:0,astralconvergence:0},'migration grants no paid investments');eq(after.get().commandRefund,{policy:'commands-retired-v1',total:0,paid:true},'no fabricated command refund');eq(after.get().studySlotProjects,[null,null,null,null,null],'five empty slot assignments on legacy migration');eq(after.get().wispMastery,noMastery,'migration grants no Mastery');eq(after.get().canonicalAutomationClock,{},'migration grants no automation time');ids.forEach(function(id){eq(after.get().recruitmentEntitlements[id],true,'existing recruited Wisp remains entitled');});eq(after.get().research.masterwork,0,'new Forge path starts unpurchased');eq(after.get().studyBoosts,{},'no free timed boost');eq(after.get().studyBoostHours,noBoostHours,'exact default timed preferences');eq(after.get().moteNextAtMs,0,'no invented payout clock');
  eq([after.dps(depth),after.passive(depth),after.ability(depth),after.auto(depth)],[before.dps(depth),before.passive(depth),before.ability(depth),before.auto(depth)],'all default gameplay estimates bit-identical');
  ids.forEach(function(id,i){eq(after.power(after.spirits()[i],s.spirits[id]),before.power(before.spirits()[i],s.spirits[id]),'unchanged power curve');eq(after.rewards(after.spirits()[i],s.spirits[id]),before.rewards(before.spirits()[i],s.spirits[id]),'unchanged default resource formula');});
  var profile=clone(after.profile(depth));if(profile)delete profile.supportUptime;eq(profile,before.profile(depth),'default cast rates/integral/cache result unchanged');
  if(forge && depth===99 && party[0]==='ember' && party[1]==='tide') ['live','offline'].forEach(function(kind){
   var seed=clone(before.get());seed.riftMode='farm';seed.farmDepth=seed.enemyDepth=99;seed.depth=99;seed.enemyHp=seed.enemyMaxHp=1e200;seed.enemyIsLuminous=false;seed.autoAscendEnabled=false;
   before.set(seed);after.set(seed);var old=before.simulate(60,kind,clock+.125),next=after.simulate(60,kind,clock+.125);eq(next.kills,0,'fixed world isolates unchanged casts and paid effects from the new enemy curve');eq(next,old,'unchanged chronological summary');eq(oldFields(after.get()),oldFields(before.get()),'every prior simulation endpoint field retained');cases.push({party:party,kind:kind,seconds:60,kills:next.kills});
  });
 });});});
 return {status:'PASS',checks:checks,baselineSha256:'d90742bc1e9377e8a35ac8dc498f3a6d5509d2c05e71353f2c3df33d6e6f21f8',defaultFormulaCases:448,chronologicalCases:cases};
}
var result=contracts(source),controls=[];
if(process.argv.indexOf('--negative')>=0){
 [['double-support','supportDps:support,legacyDps:legacy,totalDps:Amount.add(Amount.add(Amount.add(raw,bondDps),support),legacy)','supportDps:support,legacyDps:legacy,totalDps:Amount.add(Amount.add(Amount.add(raw,bondDps),support*2),legacy)'],
 ['missing-kindling',"if(b.id==='kindling') kindling=Amount.mul(kindling,1.25);",''],['wrong-reward-bond',"bondActive('quarry',ids)",'false'],
 ['wrong-removal','ids.filter(function(id){return id!==row.id;})','ids'],['missing-legacy','Amount.mul(Amount.max(0,Amount.sub(state.buffMult,known)),supportBase)','0'],
 ['missing-forge-uptime','estimate.supportUptime[row.id]||0','0'],['missing-cadence',"Amount.add(1,Amount.mul(Amount.mul(0.10,forgeLevel('guardiancadence')),cadenceFrequency))",'1']].forEach(function(row){
  var changed=source.replace(row[1],row[2]);assert.notStrictEqual(changed,source,'control anchor');
  var caught=false;try{contracts(changed);}catch(e){assert.strictEqual(e.code,'ERR_ASSERTION','assertion failure only');caught=true;}
  assert(caught,'actual control must fail '+row[0]);controls.push({id:row[0],status:'killed',failure:'ERR_ASSERTION'});
 });
}
if(process.argv.indexOf('--v8')>=0){assert(/^v8\.3\./.test(process.version));assert(/^6\.0\./.test(process.versions.v8));}
result.controls=controls;result.sourceSha256=crypto.createHash('sha256').update(source).digest('hex');result.node=process.version;result.v8=process.versions.v8;
if(process.argv.indexOf('--preservation')>=0) result.preservation=preservation(source,fs.readFileSync(path.join(__dirname,'../../docs/qa/wisp-contribution-001/baseline-d90742bc.html'),'utf8'));
console.log(JSON.stringify(result));
