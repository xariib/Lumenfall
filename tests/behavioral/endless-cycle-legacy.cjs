'use strict';
// Actual V8 6.0 complete-engine batching. No runtime BigInt or decimal package.
var fs=require('fs'),path=require('path'),assert=require('assert'),crypto=require('crypto'),Module=require('module');
assert(/^6\.0\./.test(process.versions.v8));assert.strictEqual(typeof BigInt,'undefined');
var source=fs.readFileSync(process.argv[2],'utf8'),file=path.join(__dirname,'forge-expansion-harness.cjs'),text=fs.readFileSync(file,'utf8').replace("require('node:assert/strict')","require('assert')"),h=new Module(file,module);h.filename=file;h.paths=module.paths;h._compile(text,file);
var seed=JSON.parse(fs.readFileSync('docs/qa/endless-progression-001/candidate-ak-mature-snapshot.json.endpoint.json')),start=h.exports.CLOCK+180*86400000,A=require('../../scripts/lib/game-amount.cjs'),checks=0;
process.once('uncaughtException',function(error){console.log(JSON.stringify({status:'FAIL',current:'actual V8 full-engine',checks:checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),error:error.stack}));process.exitCode=1;});
seed.depth=seed.enemyDepth=16;seed.riftMode='push';seed.autoAscendEnabled=true;seed.autoAscendTargetDepth=16;
function eq(a,b,m){checks++;assert.deepStrictEqual(a,b,m);}function ok(a,m){checks++;assert(a,m);}
function page(){var x=h.exports.app(source);x.clock(start);x.q.set(h.exports.clone(seed));x.q.restoreEnemy();return x;}
[1e-16,3e-16].forEach(function(seconds){var a=page(),b=page(),fast=a.q.advance(seconds,{kind:'offline',clockStartMs:start}),literal=b.q.advance(seconds,{kind:'offline',clockStartMs:start,disableCycleBatching:true});eq(a.q.get(),b.q.get(),'actual V8 exact literal endpoint');ok(fast.ascendGainRuns,'actual V8 fixture batches real cycles');Object.keys(literal).forEach(function(key){if(['iterations','fastForwardedKills','ascendGains'].indexOf(key)<0)eq(fast[key],literal[key],'actual V8 exact summary '+key);});});
var x=page(),before=h.exports.clone(x.q.get()),s=x.q.advance(.01,{kind:'offline',clockStartMs:start}),after=x.q.get(),n=s.ascends;
ok(A.gt(n,1e12),'actual V8 huge unrestricted count');eq(A.exactSub(after.ascendCount,before.ascendCount),n,'actual V8 exact lifetime resets');eq(A.exactSub(after.prisms,before.prisms),A.mul(n,'222e0'),'actual V8 protected Prism accounting');eq(A.exactSub(after.motes,before.motes),A.exactAdd(A.mul(n,'50e0'),60),'actual V8 paid Dust and fixed Mote accounting');eq(s.kills,A.exactAdd(A.mul(A.exactSub(n,1),'10e0'),after.depth-6),'actual V8 full and partial cycle victories');
ok(x.q.save(),'actual V8 save commits huge-count endpoint');var saved=JSON.stringify(x.q.get());x.q.load();eq(JSON.stringify(x.q.get()),saved,'actual V8 huge-count cold reload');
// These bar transients cannot use a repeated exact Hero signature initially.
var originalSeed=h.exports.clone(seed),resourceAnchor='state.heroResource=resources?resources.at(count):clonePersistedValue(last.endHero);';
assert.strictEqual(source.split(resourceAnchor).length,2);
var resourceSource=source.replace(resourceAnchor,'if(resources)resourceReplays++;'+resourceAnchor).replace("if(document.readyState==='loading'){","var resourceReplays=0;window.endlessQa={count:function(){return resourceReplays;}};if(document.readyState==='loading'){");
[1,2,3].forEach(function(memory){
 seed=h.exports.clone(originalSeed);seed.research.masterwork=10;seed.longStudyLevels.wispascend=0;seed.nodes.chargememory=memory;Object.keys(seed.wispMastery).forEach(function(id){seed.wispMastery[id]=0;});
 function resourcePage(){var p=h.exports.app(resourceSource);p.clock(start);p.q.set(h.exports.clone(seed));p.q.restoreEnemy();return p;}
 var a=resourcePage(),b=resourcePage(),fast=a.q.advance(.1,{kind:'offline',clockStartMs:start}),literal=b.q.advance(.1,{kind:'offline',clockStartMs:start,disableCycleBatching:true});
 eq(a.q.get(),b.q.get(),'actual V8 checked bars retain literal saved fields');ok(a.q.endless.count()>0,'actual V8 actually replays checked resources');
 Object.keys(literal).forEach(function(key){if(['iterations','fastForwardedKills','ascendGains'].indexOf(key)<0)eq(fast[key],literal[key],'actual V8 checked-bar exact summary '+key);});
});
seed=h.exports.clone(originalSeed);seed.wispMastery.ember=10000;
var huge=page(),hugeBefore=h.exports.clone(huge.q.get()),hugeSummary=huge.q.advance(.001,{kind:'offline',clockStartMs:start}),hugeAfter=huge.q.get();
ok(A.gt(hugeSummary.ascends,'1e300'),'actual V8 counts exceed native numeric range');eq(A.exactSub(hugeAfter.ascendCount,hugeBefore.ascendCount),hugeSummary.ascends,'actual V8 exact overflow lifetime resets');eq(A.exactSub(hugeAfter.prisms,hugeBefore.prisms),A.mul(hugeSummary.ascends,'222e0'),'actual V8 exact overflow protected Prisms');eq(A.exactSub(hugeAfter.sigils,hugeBefore.sigils),A.mul(hugeSummary.bossKills,'6e0'),'actual V8 exact overflow fixed Sigils');ok(huge.q.save(),'actual V8 commits overflow endpoint');var hugeSaved=JSON.stringify(huge.q.get());huge.q.load();eq(JSON.stringify(huge.q.get()),hugeSaved,'actual V8 overflow cold reload');
console.log(JSON.stringify({status:'PASS',checks:checks,node:process.version,v8:process.versions.v8,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),ascends:n,limits:'JavaScript-engine acceptance only; no Android device, DOM or overnight timing acceptance.'}));
