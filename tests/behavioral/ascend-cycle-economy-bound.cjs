'use strict';
const assert=require('node:assert/strict'),A=require('../../scripts/lib/game-amount.cjs'),bound=require('../../scripts/lib/ascend-cycle-economy-bound.cjs'),{integer}=require('./amount-oracle.cjs');
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
eq(bound(A,1000,100,0,10,[{lumen:50,shard:100}]),{cycles:9,limiting:0},'stop strictly before possible affordability');
eq(bound(A,1000,49,0,10,[{lumen:50,shard:100}]),{cycles:1000,limiting:null},'per-cycle Lumen ceiling proves this queue remains unaffordable');
eq(bound(A,1000,100,100,10,[{lumen:50,shard:100}]),{cycles:0,limiting:0},'already fundable queue returns to literal purchase owner');
eq(bound(A,1000,100,0,0,[{lumen:50,shard:100}]),{cycles:1000,limiting:null},'no Shard income cannot reach the price');
eq(bound(A,1000,100,0,10,[{lumen:50,shard:101},{lumen:80,shard:40}]),{cycles:3,limiting:1},'all queued prices participate');
const huge=bound(A,'1e200',100,'9e399','1e300',[{lumen:100,shard:'1e400'}]);eq(integer(huge.cycles),(10n**400n-9n*10n**399n-1n)/10n**300n,'independent huge strict-bound oracle');
for(const held of [0,.1,.9,1,Number.MAX_SAFE_INTEGER-32])for(const gain of [.1,.3,1,16]){
 const price=Math.ceil(held+20),r=bound(A,1000,100,held,Math.ceil(gain)+1,[{lumen:10,shard:price}]);let actual=held;
 for(let i=0;i<Number(r.cycles);i++)actual+=gain;
 eq(actual<price,true,'native rounding cannot fund a purchase inside the certified prefix');
}
for(const n of [1e25,1e28,1e30])eq(integer(bound(A,n,0,0,0,[]).cycles),BigInt(n),'unsafe native prefix count remains exact');
for(const args of [[-1,0,0,0,[]],[1,0,0,-1,[]],[1,1,0,1,[{lumen:-1}]]]){assert.throws(()=>bound(A,...args),RangeError);checks++;}
console.log(JSON.stringify({status:'PASS',checks,huge,limits:'Conservative resource preflight only; real scheduler must derive complete peak/gain bounds and retain literal purchase ordering.'}));
