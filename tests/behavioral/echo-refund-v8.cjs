'use strict';
// Actual V8.6.0 production execution; no Android DOM or lifecycle claim.
var fs=require('fs'),path=require('path'),assert=require('assert'),crypto=require('crypto');
var source=fs.readFileSync(path.resolve(__dirname,'../../index.html'),'utf8'),storage={},writes=0;
var window={addEventListener:function(){}},document={readyState:'loading',addEventListener:function(){},getElementById:function(){return null;},querySelector:function(){return null;}};
var bridge="renderNodes=renderAscendSummary=renderHud=updateBattleFast=renderSpirits=function(){};window.qa={fresh:freshState,set:function(s){state=acceptPersistedState(s);},get:function(){return state;},save:saveState,payment:prismPurchasePlan,buy:function(id){return buyNode(NODES.find(function(n){return n.id===id;}));},accept:acceptPersistedState};";
var script=source.match(/<script>\s*([\s\S]*?)<\/script>/)[1].replace("if(document.readyState==='loading'){",bridge+"if(document.readyState==='loading'){");
new Function('window','document','localStorage',script)(window,document,{getItem:function(k){return storage[k]||null;},setItem:function(k,v){storage[k]=v;writes++;},removeItem:function(k){delete storage[k];}});
function old(raw,wallet){var s=window.qa.fresh();s.nodes.echo=raw;s.prisms=wallet;delete s.feedbackMigration;delete s.refundCredits;return s;}
[6,7,20,2500].forEach(function(raw){window.qa.set(old(raw,17));var before=JSON.stringify(window.qa.get()),beforeWrites=writes;for(var i=0;i<100;i++)assert.equal(window.qa.buy('echo'),false);assert.equal(JSON.stringify(window.qa.get()),before);assert.equal(writes,beforeWrites);});
window.qa.set(old(20,0));assert.equal(window.qa.get().prisms,4153);assert.deepEqual(window.qa.get().feedbackMigration.receipts['node.echo'].amounts.prisms,[16,22,30,42,58,81,114,159,223,312,436,610,854,1196]);
window.qa.set(old(7,1e30));assert.equal(window.qa.buy('swift'),true);assert.equal(window.qa.get().prisms,1e30);assert.deepEqual(window.qa.get().feedbackMigration.receipts['node.echo'].remainingCredits,[13]);assert.equal(window.qa.get().refundCredits.prisms[0].amount,13);assert.equal(window.qa.get().nodes.swift,1);
window.qa.save();var saved=JSON.stringify(window.qa.get());assert.equal(storage.lumenfall_save_v2,saved);window.qa.set(JSON.parse(saved));assert.equal(JSON.stringify(window.qa.get()),saved);
window.qa.set(old(2500,0));var legacy=JSON.parse(JSON.stringify(window.qa.get())),legacyPrices=legacy.feedbackMigration.receipts['node.echo'].amounts.prisms;
var modern=require('./echo-receipt-prices.json').modern,compatible=JSON.parse(JSON.stringify(legacy));compatible.feedbackMigration.receipts['node.echo'].amounts.prisms=modern;
window.qa.set(compatible);assert.deepEqual(window.qa.get(),compatible);
var originalPow=Math.pow,calls=0;Math.pow=function(base,level){if(base===1.4&&level>=6)calls++;return originalPow(base,level);};try{for(var boundary=0;boundary<100;boundary++)window.qa.set(window.qa.get());}finally{Math.pow=originalPow;}assert.equal(calls,0);
var beforeQuote=JSON.stringify(window.qa.get());for(var quote=0;quote<2000;quote++)assert(window.qa.payment(3,true));assert.equal(JSON.stringify(window.qa.get()),beforeQuote);assert.equal(window.qa.payment(3,true).credits,undefined);
window.qa.set(old(95,1e30));var bad=window.qa.get();delete bad.feedbackMigration.receipts['node.echo'];assert.throws(function(){window.qa.set(bad);});
window.qa.set(old(95,1e30));var bad=window.qa.get();delete bad.feedbackMigration.receipts['node.echo'];delete bad.feedbackMigration.echoCreditAuditVersion;assert.throws(function(){window.qa.set(bad);});
window.qa.set(old(95,1e30));var bad=window.qa.get();bad.refundCredits.prisms[0].amount++;assert.throws(function(){window.qa.set(bad);});
window.qa.set(old(7,17));var bad=window.qa.get();delete bad.feedbackMigration.receipts['node.echo'];delete bad.feedbackMigration.history;assert.throws(function(){window.qa.set(bad);});
var result={status:'PASS',node:process.version,v8:process.versions.v8,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),blockedAttempts:400,originalRefund:4153,actualEchoCreditPurchase:true,quoteAttempts:2000,cachedBoundaries:100,modernPriceCompatibility:true,legacyPriceCount:legacyPrices.length,limitation:'Production IIFE on V8.6.0 with storage shim; exact WebView60 DOM/native/physical acceptance remains separate'};
var exportIndex=process.argv.indexOf('--export');if(exportIndex>=0)fs.writeFileSync(process.argv[exportIndex+1],JSON.stringify({runtime:result.node,v8:result.v8,sourceSha256:result.sourceSha256,legacyState:legacy},null,2)+'\n');
console.log(JSON.stringify(result));
