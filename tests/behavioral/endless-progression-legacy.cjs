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
var source=original.replace("if(document.readyState==='loading'){",'window.endlessQa={amount:Amount,mastery:buyWispMastery,factor:wispMasteryFactor,labPay:labCanPay};if(document.readyState===\x27loading\x27){');
var x=compiled.exports.app(source),q=x.q,b=q.endless,s=q.fresh();
s.lumen=s.shards=s.prisms=s.sigils=s.motes=s.comets='1e400';
s.spirits.ember=140;s.heroRarity.ember=5;s.wispModules.ember=20;s.wispUltimate.ember=true;
s.maxDepthEver=250200;s.depth=200;s.longStudyLevels.wispascend=2030;s.research.masterwork=2001;s.nodes.swift=1010;s.wispMastery.ember=10000;
q.set(s);ok(b.amount.wide(q.power('ember')),'large Power in actual V8');
ok(b.mastery(q.sp('ember')),'large funded rank purchase');eq(q.get().wispMastery.ember,10001,'rank retained');
eq(b.amount.exactAdd(q.get().sigils,5005000),'1e400','exact large Sigil debit');
eq(b.amount.exactAdd(q.get().prisms,100200),'1e400','exact large Prism debit');
ok(b.labPay(1e30,800),'unsafe native balance can fund an exact debit');
q.restoreEnemy();q.manualTap();ok(q.get().depth>200,'wide damage reaches a real next Rift');
ok(q.save(),'wide primary and recovery write');var endpoint=JSON.stringify(q.get());q.load();eq(JSON.stringify(q.get()),endpoint,'wide cold normalization');
q.ascend();eq(q.get().wispMastery.ember,10001,'Mastery kept through Ascend');
eq(q.get().wispModules.ember,20,'ability kept');eq(q.get().wispUltimate.ember,true,'Ultimate kept');
eq(q.get().recruitmentEntitlements.ember,true,'recruitment entitlement kept');
console.log(JSON.stringify({status:'PASS',checks:checks,node:process.version,v8:process.versions.v8,sourceSha256:crypto.createHash('sha256').update(original).digest('hex'),limits:'JavaScript engine evidence; Android/WebView DOM and device acceptance remain separate.'}));
