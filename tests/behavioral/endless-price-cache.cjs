'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app}=require('./forge-expansion-harness.cjs');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8'),{q}=app(source);
const bases={ember:10,tide:60,stone:360,gale:2100,thorn:12000,void:70000,aurora:400000,titan:2200000};
let checks=0;const state=q.get();
// Deliberately restart and jump the cursor, change discounts/ranks, and exceed
// the quote-cache capacity. Expected prices use an independent BigInt fraction.
for(const rank of [1,5,2,5])for(const bonds of [0,7,20])for(const [id,base]of Object.entries(bases)){
 state.nodes.gentlegrowth=rank;state.nodes.bonds=bonds;
 for(const level of [...Array.from({length:135},(_,i)=>i+26),500,30,120,45,320,321,35]){
  state.spirits[id]=level;
  const numerator=BigInt(base)*113n**BigInt(Math.min(25,level))*BigInt(113-rank)**BigInt(Math.max(0,level-25))*BigInt(100-Math.min(60,3*bonds));
  const denominator=100n**BigInt(level+1),expected=(numerator+denominator/2n)/denominator;
  if(expected>BigInt(Number.MAX_SAFE_INTEGER))continue;
  assert.equal(q.empowerCost(id),Number(expected),'independent exact price '+[id,rank,bonds,level].join('/'));checks++;
 }
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex')}));
