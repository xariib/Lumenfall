'use strict';
const assert=require('node:assert/strict'),A=require('../../scripts/lib/game-amount.cjs'),create=require('../../scripts/lib/simulation-binary-clock.cjs'),{fraction,integer}=require('./amount-oracle.cjs');
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
function dyad(n){if(!n)return {n:0n,e:0};const b=Buffer.alloc(8);b.writeDoubleBE(n);const bits=b.readBigUInt64BE(),raw=Number(bits>>52n&2047n);return {n:(bits&((1n<<52n)-1n))+(raw?1n<<52n:0n),e:raw?raw-1075:-1074};}
function rationalDyad(n,e){return e>=0?{n:n<<BigInt(e),d:1n}:{n,d:1n<<BigInt(-e)};}
function same(value,r,label){const f=fraction(value);eq(f.n*r.d,r.n*f.d,label);}
function nativeRoundedMs(start,elapsed){const a=dyad(start),b=dyad(elapsed),unit=Math.min(a.e,b.e),n=(a.n<<BigInt(a.e-unit))+(b.n*1000n<<BigInt(b.e-unit));return unit>=0?Number(n<<BigInt(unit)):Number((n*5n**BigInt(-unit)).toString()+'e'+unit);}
for(const start of [0,Number.MIN_VALUE,2**-1022,2**20-1,2**41,2**53-1,2**200])for(const dt of [0,Number.MIN_VALUE,1e-20,.125,.5]){const c=create(A,start,1);c.advance(dt);eq(c.nowMs(),nativeRoundedMs(start,dt),'independently rounded epoch across native binade/subnormal boundaries');}
for(const start of [0,2000000000000,Number.MAX_SAFE_INTEGER]){
 const clock=create(A,start,1);let sum=0n,unit=-1074;
 for(const dt of [Number.MIN_VALUE,1e-200,1e-100,1e-20,.125,.25]){clock.advance(dt);const d=dyad(dt);sum+=d.n<<BigInt(d.e-unit);same(clock.elapsed(),rationalDyad(sum,unit),'all native interval bits retained');same(clock.remaining(),rationalDyad((1n<<1074n)-sum,unit),'exact positive remaining time');}
 const before=clock.snapshot();assert.throws(()=>clock.advance(2),RangeError);eq(clock.snapshot(),before,'rejected clock overshoot is atomic');
}
{
 const start=2000000000000,clock=create(A,start,1),ticks=(1n<<400n)-1n;clock.advanceTicks(ticks.toString()+'e0',-400);
 eq(clock.nowMs(),start+1000,'rounded epoch alone cannot distinguish the event');same(clock.until(start+1000),{n:1n,d:1n<<400n},'real deadline still lies ahead by2^-400 seconds');same(clock.remaining(),{n:1n,d:1n<<400n},'caller remainder survives rounded epoch equality');
 clock.advanceToMs(start+1000);eq(clock.remaining(),0,'exact deadline step finishes window');eq(clock.until(start+1000),0,'deadline is now due');
}
{
 let split=create(A,2000000000000,.25);for(let i=0;i<4;i++){split.advance(.25);if(i<3)split=split.nextWindow(.25);}
 const whole=create(A,2000000000000,1);whole.advance(1);eq(split.nowMs(),whole.nowMs(),'exact binary split windows retain epoch');same(split.until(2000000001000),{n:0n,d:1n},'split window deadline exact');
}
{
 let split=create(A,2000000000000,.1,{budgetMs:100});for(let i=0;i<10;i++){split.advance(split.remaining());if(i<9)split=split.nextWindow(.1,{budgetMs:100});}
 same(split.until(2000000001000),{n:0n,d:1n},'ten100ms live frames equal one1000ms offline window exactly');eq(split.nowMs(),2000000001000,'millisecond endpoint unchanged');
 const c=create(A,0,1,{budgetMs:100}),before=c.snapshot();assert.throws(()=>c.advance(.1),/exceeds/);eq(c.snapshot(),before,'native0.1 cannot silently exceed an explicit100ms endpoint');
 assert.throws(()=>c.advance('1e-400'),/lattice/);eq(c.snapshot(),before,'unrelated nonbinary fraction is rejected atomically');c.advance(c.remaining());eq(c.remaining(),0,'exact endpoint token is accepted without rounding');
}
for(const args of [[-1,1],[NaN,1],[0,-1],[0,Infinity]]){assert.throws(()=>create(A,...args),RangeError);checks++;}
{
 const c=create(A,0,1),before=c.snapshot();for(const args of [[-1,0],[1,.5],[Infinity,0]]){assert.throws(()=>c.advanceTicks(...args),RangeError);eq(c.snapshot(),before,'rejected exact step is atomic');}
}
console.log(JSON.stringify({status:'PASS',checks,limits:'Exact-clock component only. Scheduler integration, rounding contracts and full catch-up remain unverified.'}));
