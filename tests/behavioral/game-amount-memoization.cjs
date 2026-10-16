'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync(process.argv[2]||'index.html','utf8');
const factory=html.slice(html.indexOf('function createGameAmount(){'),html.indexOf('var Amount=createGameAmount();'));
function make(text){return new Function(text+'return createGameAmount();')();}
let checks=0;
function exercise(A){
 for(const coefficient of [1n,10n,9007199254740993n,123456789012345678901234567890123456789n]){
  const negative='-'+coefficient+'e0',positive=coefficient+'e0';
  for(let round=0;round<5;round++){
   assert(A.cmp(A.abs(negative),positive)===0);checks++;
   assert(A.cmp(A.abs(negative),positive)===0);checks++;
   assert(A.cmp(A.normalize(negative),negative)===0);checks++;
   const difference=A.exactSub(positive,negative);
   assert(A.cmp(difference,(coefficient*2n)+'e0')===0);checks++;
   assert(A.cmp(A.normalize(negative),negative)===0);checks++;
   // Evict ordinary entries, then repeat the mutation-sensitive operations.
   for(let i=1;i<=300;i++){assert.equal(A.integer((coefficient+BigInt(i))+'e0'),true);checks++;}
  }
 }
 const huge='-'+('1234567890'.repeat(60))+'1e0';
 for(let i=0;i<3;i++){assert(A.cmp(A.abs(huge),0)>0);assert(A.cmp(A.normalize(huge),0)<0);checks+=2;}
 for(const invalid of ['__proto__','constructor','toString','NaN','Infinity','1e9007199254740992']){
  for(let i=0;i<3;i++){assert.equal(A.integer(invalid),false);checks++;}
 }
}
exercise(make(factory));exercise(require('../../scripts/lib/game-amount.cjs'));
// A borrowed memoized parts object corrupts the next negative normalization.
const anchor='var key=String(value),cached=decimalPartsCache[key];\n    if(cached)return {d:cached.d,e:cached.e,s:cached.s};';
assert.equal(factory.split(anchor).length,2,'one decimal-cache copy boundary');
assert.throws(()=>exercise(make(factory.replace(anchor,'var key=String(value),cached=decimalPartsCache[key];\n    if(cached)return cached;'))),assert.AssertionError);
console.log(JSON.stringify({status:'PASS',checks,negativeControls:1,oracle:'Independent BigInt debits, interleaved signs, eviction and oversized values'}));
