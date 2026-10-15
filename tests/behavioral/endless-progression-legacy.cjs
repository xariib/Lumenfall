'use strict';
// Actual V8 6.0, with the complete game IIFE and its real save/purchase paths.
var fs=require('fs'),path=require('path'),assert=require('assert'),crypto=require('crypto'),Module=require('module');
assert(/^6\.0\./.test(process.versions.v8),'Run on the actual Chrome 60 engine generation');
assert.strictEqual(typeof BigInt,'undefined');
var original=fs.readFileSync(process.argv[2]||'index.html','utf8'),checks=0;
function eq(a,b,m){checks++;assert.deepStrictEqual(a,b,m);}
function ok(v,m){checks++;assert(v,m);}
var file=path.join(__dirname,'forge-expansion-harness.cjs'),h=fs.readFileSync(file,'utf8').replace("require('node:assert/strict')","require('assert')");
var compiled=new Module(file,module);compiled.filename=file;compiled.paths=module.paths;compiled._compile(h,file);
var source=original.replace("if(document.readyState==='loading'){",'window.endlessQa={speed:applySpeedTier,amount:Amount,module:buyModule,mastery:buyWispMastery,factor:wispMasteryFactor,labPay:labCanPay,cometBuy:function(id){return buyShopItem(SHOP.find(function(item){return item.id===id;}));}};if(document.readyState===\x27loading\x27){');
var x=compiled.exports.app(source),q=x.q,b=q.endless,s=q.fresh();
s.lumen=s.shards=s.prisms=s.sigils=s.motes=s.comets='1e400';
s.spirits.ember=140;s.heroRarity.ember=5;s.wispModules.ember=20;s.wispUltimate.ember=true;
s.maxDepthEver=250200;s.depth=200;s.longStudyLevels.wispascend=2032;s.research.masterwork=2001;s.nodes.swift=1010;s.wispMastery.ember=10000;
q.set(s);ok(b.amount.wide(q.power('ember')),'large Power in actual V8');
ok(b.mastery(q.sp('ember')),'large funded rank purchase');eq(q.get().wispMastery.ember,10001,'rank retained');
eq(b.amount.exactAdd(q.get().sigils,500500000),'1e400','exact large Sigil debit');
eq(b.amount.exactAdd(q.get().prisms,10020000),'1e400','exact large Prism debit');
ok(b.labPay(1e30,800),'unsafe native balance can fund an exact debit');
q.restoreEnemy();q.manualTap();ok(q.get().depth>200,'wide damage reaches a real next Rift');
ok(q.save(),'wide primary and recovery write');var endpoint=JSON.stringify(q.get());q.load();eq(JSON.stringify(q.get()),endpoint,'wide cold normalization');
q.ascend();eq(q.get().wispMastery.ember,10001,'Mastery kept through Ascend');
eq(q.get().wispModules.ember,20,'ability kept');eq(q.get().wispUltimate.ember,true,'Ultimate kept');
eq(b.amount.ratio('9e400','1e724'),Number('9e-324'),'subnormal mantissa retained in actual V8');
var speed=q.fresh();speed.maxDepthEver=130;speed.motes='1e400';speed.activeStudies=[{id:'guardmastery',remainingSec:100,totalDurationSec:100,speedMult:1}];speed.studyUseMotes.guardmastery=true;speed.studySpeedTargets.guardmastery=3;q.set(speed);
var paid=q.advance(0,{kind:'offline',clockStartMs:compiled.exports.CLOCK});eq(q.get().motes,'1e400','retired queue cannot spend in actual V8');eq(paid.studyMotesSpent,0,'no automatic timed purchase in actual V8');ok(b.speed('guardmastery',3),'explicit timed activation in actual V8');eq(b.amount.exactAdd(q.get().motes,3500),'1e400','exact wide timed debit in actual V8');eq(q.get().activeStudies[0].speedMult,1,'paid base floor retained in actual V8');eq(q.get().studyBoosts.guardmastery.expiresAtMs,compiled.exports.CLOCK+28800000,'exact timer in actual V8');
q.set(s);s.depth=s.enemyDepth=1;s.enemyMaxHp=s.enemyHp=b.amount.mul(q.passive(1),'11e-324');Object.keys(s.empowerQueue).forEach(function(id){s.empowerQueue[id]=false;});q.set(s);
var partial=q.advance(.001,{kind:'live',clockStartMs:compiled.exports.CLOCK,resumable:true});partial.next();ok(b.amount.ge(q.get().totalKills,1),'subnormal partial damage resolves in actual V8');partial.return();
eq(q.get().recruitmentEntitlements.ember,true,'recruitment entitlement kept');
var prices=q.fresh();prices.nodes.gentlegrowth=5;prices.nodes.bonds=7;q.set(prices);
[[26,181],[27,196],[28,211],[160,5455005],[30,246],[120,251099],[321,1312259732725],[35,362]].forEach(function(row){
  q.get().spirits.ember=row[0];eq(q.empowerCost('ember'),row[1],'exact cached price in actual V8 '+row[0]);
});
var ability=q.fresh();ability.lumen=ability.shards='1e400';q.set(ability);var abilityBefore=JSON.stringify(q.get());x.fail(true,false);eq(b.module(q.sp('ember')),false,'V8 failed ability returns false');eq(JSON.stringify(q.get()),abilityBefore,'V8 failed ability rolls back');x.fail(false,false);ok(b.module(q.sp('ember')),'V8 real ability purchase');eq(b.amount.exactAdd(q.get().lumen,40),'1e400','V8 exact ability Lumen');eq(b.amount.exactAdd(q.get().shards,4),'1e400','V8 exact ability Shards');eq(q.get().wispModules.ember,1,'V8 one ability rank');q.load();eq(q.get().wispModules.ember,1,'V8 ability cold retention');
[[6000,600],[6005,601],[6040,700],[6100,1220],[7000,70700]].forEach(function(row){eq(q.sigils(row[0]),row[1],'calibrated boss Sigils in actual V8 '+row[0]);});
ok(b.amount.valid(q.sigils(Number.MAX_VALUE))&&b.amount.wide(q.sigils(Number.MAX_VALUE)),'Sigil rewards beyond native overflow in actual V8');
var nativeComets=q.fresh();nativeComets.comets=Math.pow(2,54);q.set(nativeComets);ok(b.cometBuy('autoascend'),'V8 native exact Comet purchase');eq(typeof q.get().comets,'number','V8 native Comet representation');eq(q.get().comets,Math.pow(2,54)-100,'V8 original native Comet debit');
var wideComets=q.fresh();wideComets.comets='1e400';q.set(wideComets);ok(b.cometBuy('autoascend'),'V8 wide Comet purchase');eq(b.amount.exactAdd(q.get().comets,100),'1e400','V8 exact wide Comet debit');eq(q.get().owned.autoascend,true,'V8 one paid Comet entitlement');
var wideAscend=q.fresh();wideAscend.depth=wideAscend.enemyDepth=16;wideAscend.maxDepthEver=100;wideAscend.ascendCount='1e400';wideAscend.dailyStats.ascends='1e400';wideAscend.cometClaims.retired.comettrials='settled';wideAscend.cometTrial={id:'quiet',target:15,phase:'active',startedAscend:'10e399',failed:false,reason:''};q.set(wideAscend);q.restoreEnemy();
eq(q.get().cometTrial.startedAscend,'1e400','V8 exact trial run normalization');var countBefore=JSON.stringify(q.get());x.fail(true,false);eq(q.ascend(),false,'V8 failed wide-count Ascend');eq(JSON.stringify(q.get()),countBefore,'V8 wide-count rollback');x.fail(false,false);ok(q.ascend(),'V8 unrestricted wide-count Ascend');eq(b.amount.exactSub(q.get().ascendCount,1),'1e400','V8 exact Ascend increment');eq(b.amount.exactSub(q.get().dailyStats.ascends,1),'1e400','V8 exact daily Ascend increment');eq(q.get().cometTrialResult.outcome,'completed','V8 wide-count trial completion');q.load();eq(b.amount.exactSub(q.get().ascendCount,1),'1e400','V8 wide-count cold retention');
console.log(JSON.stringify({status:'PASS',checks:checks,node:process.version,v8:process.versions.v8,sourceSha256:crypto.createHash('sha256').update(original).digest('hex'),limits:'JavaScript engine evidence; Android/WebView DOM and device acceptance remain separate.'}));
