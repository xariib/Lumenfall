'use strict';
var assert=require('assert'),A=require('../../scripts/lib/game-amount.cjs'),create=require('../../scripts/lib/simulation-binary-clock.cjs'),phase=require('../../scripts/lib/ascend-native-phase.cjs');
assert(/^6\.0\./.test(process.versions.v8),'Actual WebView60 engine generation required');assert.strictEqual(typeof BigInt,'undefined');
var n=1;for(var i=0;i<400;i++)n=A.mul(typeof n==='number'?String(n)+'e0':n,'2e0');
var c=create(A,2000000000000,1);c.advanceTicks(A.exactSub(n,1),-400);assert.strictEqual(c.nowMs(),2000000001000);assert.strictEqual(Number(c.until(2000000001000)),Math.pow(2,-400));c.advanceToMs(2000000001000);assert.strictEqual(c.remaining(),0);
var ms=create(A,0,.1,{budgetMs:100});ms.advance(ms.remaining());assert.strictEqual(ms.nowMs(),100);
var p=phase(A,[1.2e-17,2.8e-17,3.4e-17,null],'1e25',0,999.999);assert.strictEqual(p.value,.5);
console.log(JSON.stringify({status:'PASS',checks:7,node:process.version,v8:process.versions.v8,limits:'Exact-clock/phase modules only; Android/WebView UI and full scheduler acceptance are separate.'}));
