'use strict';
const assert=require('node:assert/strict'),A=require('../../scripts/lib/game-amount.cjs'),create=require('../../scripts/lib/native-event-threshold.cjs'),{integer}=require('./amount-oracle.cjs'),native=create(A);
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
function bits(n){const b=Buffer.alloc(8);b.writeDoubleBE(n);return b.readBigUInt64BE();}function number(n){const b=Buffer.alloc(8);b.writeBigUInt64BE(n);return b.readDoubleBE();}
function oracle(predicate,estimate){let lo=0n,hi=bits(estimate);while(!predicate(number(hi)))hi++;while(hi-lo>1n){const mid=(lo+hi)/2n;if(predicate(number(mid)))hi=mid;else lo=mid;}return number(hi);}
function dyad(n){if(!n)return {n:0n,e:0};const raw=bits(n),exponent=Number(raw>>52n&2047n);return {n:(raw&((1n<<52n)-1n))+(exponent?1n<<52n:0n),e:exponent?exponent-1075:-1074};}
for(const remaining of [100,435456,864000,1e-8,Number.MAX_VALUE])for(const speed of [1,1.5,8]){
 const predicate=w=>remaining-w*speed<=1e-9,r=native.firstTrue(predicate,remaining/speed),expected=oracle(predicate,remaining/speed);eq(r.upper,expected,'independent IEEE-bit search gives first native completion value');
 const a=dyad(r.lower),b=dyad(r.upper),unit=Math.min(a.e,b.e,r.unit),sum=(a.n<<BigInt(a.e-unit))+(b.n<<BigInt(b.e-unit));eq(integer(r.ticks)<<BigInt(r.unit-unit+1),sum*125n,'exact paid-work rounding midpoint');
 eq(predicate(r.lower),false,'previous native work value retains paid work');eq(predicate(r.upper),true,'first qualifying native work value completes');
}
for(const n of [0,Number.MIN_VALUE,1e-9,100,Number.MAX_VALUE/2]){eq(native.nextUp(n),number(bits(n)+1n),'native nextUp independent bits');if(n)eq(native.nextDown(n),number(bits(n)-1n),'native nextDown independent bits');}
console.log(JSON.stringify({status:'PASS',checks,limits:'Threshold certificates only; normal completion/recast owners and existing EPS contracts are retained.'}));
