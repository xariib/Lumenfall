'use strict';
// ES2017 probes on actual V8 6.0. Android/native acceptance remains separate.
var fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
var source=fs.readFileSync(process.argv[2]||path.join(__dirname,'../../index.html'),'utf8');
var fixtures=JSON.parse(fs.readFileSync(path.join(__dirname,'swift-current-legacy-values.json'),'utf8'));
assert.strictEqual(crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'swift-original-modern-prices.json'))).digest('hex'),fixtures.witnessSha256,'independent original-price witness');
var ctx=vm.createContext({document:{readyState:'loading',addEventListener:function(){}},window:{addEventListener:function(){}},console:console});
var script=source.match(/<script>\s*([\s\S]*?)<\/script>/)[1],marker="if(document.readyState==='loading'){";
assert.strictEqual(script.split(marker).length,2);
var bridge="window.swiftQA={fresh:freshState,set:function(s){state=acceptPersistedState(s);},get:function(){return state;},normalize:acceptPersistedState,hex:function(){return shardBudgetHex(state);},cycle:abilityCycleSeconds,fill:fillRateMult,spend:spendShards,defs:function(){return RESEARCH;},deeds:legacyResearchLevels,progress:deedProgress};";
vm.runInContext(script.replace(marker,bridge+marker),ctx);var q=ctx.window.swiftQA,checks=0;
function eq(a,b,label){checks++;assert.deepStrictEqual(a,b,label);}
function copy(x){return JSON.parse(JSON.stringify(x));}
fixtures.cases.forEach(function(test){
 var s=q.fresh();s.schemaVersion=3;s.research.charge=test.raw;s.shards=test.wallet;q.set(s);
 eq(q.hex(),test.initialHex,'independent exact original total '+test.raw+'/'+test.wallet);
 eq(q.get().research.charge,test.raw,'raw history retained');
 assert(Math.abs(q.cycle()-Math.max(10/3,6/(1+.08*Math.min(test.raw,10))))<1e-12);checks++;
 eq(copy(q.normalize(q.get())),copy(q.get()),'canonical reload idempotent');
 if(test.spend){assert(q.spend(test.spend));checks++;eq(q.hex(),test.spentHex,'exact original credit debit');eq(copy(q.normalize(q.get())),copy(q.get()),'spent audit canonical');}
});
var s=q.fresh();s.research.charge=10;s.research.arcanecal=10;s.research.conduction=10;s.research.cauterize=10;s.research.focus=20;
q.set(s);eq(q.deeds(q.get()),60,'current and historical paid levels');
if(process.argv.indexOf('--v8')>=0){assert(/^v8\.3\./.test(process.version));assert(/^6\.0\./.test(process.versions.v8));}
console.log(JSON.stringify({status:'PASS',checks:checks,cases:fixtures.cases.length,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),node:process.version,v8:process.versions.v8,limits:'Engine probe; no native Android/WebView/device claim.'}));
