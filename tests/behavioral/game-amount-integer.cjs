'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const A=require('../../scripts/lib/game-amount.cjs');
const html=fs.readFileSync(process.argv[2]||'index.html','utf8');
const factory=html.slice(html.indexOf('function createGameAmount(){'),html.indexOf('var Amount=createGameAmount();'));
const product=new Function(factory+'return createGameAmount();')();
let checks=0;
function check(value,expected){
 for(const [name,engine]of [['library',A],['packaged',product]]){
  assert.equal(engine.integer(value),expected,name+' integer '+String(value));checks++;
 }
}
// Independent exact rational oracle: divisibility of a BigInt numerator by its
// decimal denominator. No Amount parsing, rounding or normalization in oracle.
for(let coefficient=-2500;coefficient<=2500;coefficient++)for(let exponent=-6;exponent<=6;exponent++){
 const numerator=BigInt(coefficient),denominator=exponent<0?10n**BigInt(-exponent):1n;
 check(coefficient+'e'+exponent,numerator%denominator===0n);
}
for(const digits of ['0','0000000','10','100000000000000000000000000000000000','100000000000000000000000000000000001','9007199254740991','9007199254740992','999999999999999999999999999999999999999'])
 for(const sign of ['','-'])for(let exponent=-60;exponent<=60;exponent++){
  const numerator=BigInt(sign+digits),denominator=exponent<0?10n**BigInt(-exponent):1n;
  check(sign+digits+'e'+exponent,numerator%denominator===0n);
 }
for(const value of [0,-0,1,-1,.5,-.5,Number.MIN_VALUE,Number.MAX_VALUE,Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER+1,NaN,Infinity,-Infinity])check(value,Number.isInteger(value));
for(const value of [null,undefined,true,false,{},[],1n,'','1','1.0e0','1e+0','1e1.5','NaN','Infinity','1e9007199254740992','1e-9007199254740992'])check(value,false);
for(const value of ['1e9007199254740991','0e-9007199254740991'])check(value,true);
for(const engine of [A,product]){assert.throws(()=>engine.integer('10e9007199254740991'),RangeError);checks++;}
for(const value of ['1e-9007199254740991','10e-9007199254740991'])check(value,false);
// The oracle rejects both an always-true predicate and a native-only shortcut.
assert.notEqual(true,product.integer('1e-1'));
assert.notEqual(Number.isInteger('100e-2'),product.integer('100e-2'));
console.log(JSON.stringify({status:'PASS',checks,oracle:'Independent BigInt rational divisibility; same library/product public behavior'}));
