'use strict';
const assert=require('node:assert/strict');
const a=require('../../scripts/lib/game-amount.cjs');
let checks=0;
function eq(x,y){checks++;assert.equal(x,y);}
function asBig(value){
  if(typeof value==='number')return BigInt(value);
  const [digits,e]=value.split('e');const exponent=Number(e);
  return exponent>=0?BigInt(digits)*10n**BigInt(exponent):BigInt(digits)/10n**BigInt(-exponent);
}
for(const exp of [16,30,100,308,309,400,1000,6000]){
  const x=10n**BigInt(exp),str='1e'+exp;
  for(const n of [1,7,99,1234567,9007199254740991]){
    eq(asBig(a.add(str,n)),x+BigInt(n));eq(asBig(a.sub(str,n)),x-BigInt(n));
    eq(asBig(a.mul(str,n)),x*BigInt(n));eq(a.cmp(a.sub(str,n),str),-1);
  }
  eq(a.ratio(str,str),1);eq(a.cmp(a.add(str,1),str),1);
  eq(a.sub(a.add(str,1),str),1);
  const divided=a.divmod(a.add(str,17),7);
  eq(asBig(divided.q),(x+17n)/7n);eq(asBig(divided.r),(x+17n)%7n);
  eq(asBig(a.floorRatio(str,3)),x/3n);
}
for(const n of [9007199254740992,1e20,1e30,Number.MAX_VALUE])eq(asBig(a.normalize(n)),BigInt(n));
for(let exponent=54;exponent<=1023;exponent+=13){const n=Math.pow(2,exponent)*1.23456789;eq(asBig(a.normalize(n)),BigInt(n));}
eq(asBig(a.add(Number.MAX_VALUE,Number.MAX_VALUE)),BigInt(Number.MAX_VALUE)*2n);
eq(asBig(a.sub(-Number.MAX_VALUE,Number.MAX_VALUE)),-BigInt(Number.MAX_VALUE)*2n);
for(const n of [9007199254740991,1e20,1e30,Number.MAX_VALUE]){eq(asBig(a.exactAdd(n,1)),BigInt(n)+1n);eq(asBig(a.exactSub(n,1)),BigInt(n)-1n);}
for(const exp of [16,100,400]){const x=10n**BigInt(exp)+37n,hex=x.toString(16);eq(asBig(a.fromHex(hex)),x);eq(a.toHex(a.fromHex(hex)),hex);}
let seed=12345;for(const size of [6,7,8,13,14,15,16,17,70,71,1000]){let left='1',right='2';for(let i=1;i<size;i++){seed=(seed*1664525+1013904223)>>>0;left+=seed%10;right+=(seed>>>5)%10;}const x=BigInt(left),y=BigInt(right);eq(asBig(a.exactAdd(left+'e0',right+'e0')),x+y);eq(asBig(a.exactSub(left+'e0',right+'e0')),x-y);eq(asBig(a.exactAdd(left+'e0',0)),x);}
for(const n of [0,1,.7,Math.PI,12345])for(const m of [0,1,.7,3.25]){
  eq(a.add(n,m),n+m);eq(a.sub(n,m),n-m);eq(a.mul(n,m),n*m);
}
eq(a.round('123456789012345678901e-2','floor'),'1234567890123456789e0');
eq(a.round('123456789012345678999e-2','ceil'),'123456789012345679e1');
eq(a.ratio('1e400','1e399'),10);eq(a.integer('1e400'),true);
eq(a.ratio('1e400','1e1000'),Number.MIN_VALUE);eq(a.ratio('-1e400','1e1000'),-Number.MIN_VALUE);
eq(a.ratio('9e400','1e724'),Number('9e-324'));eq(a.ratio('-9e400','1e724'),Number('-9e-324'));
eq(a.valid('Infinity'),false);eq(a.valid('1eNaN'),false);eq(a.valid('1e9007199254740992'),false);
eq(a.valid('2'),false);eq(a.add('Rank ',4),'Rank 4');eq(a.mod('1e400',5),0);
eq(a.cmp(a.pow(1.145,6000),'1e309'),1);
eq(a.cmp(a.pow(1.1,10000),a.pow(1.1,9999)),1);
console.log(JSON.stringify({status:'PASS',checks,limits:'Wide powers/physical ratios approximate; exact integer wallet accounting independently checked with Node BigInt.'}));
