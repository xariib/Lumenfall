'use strict';
const assert=require('node:assert/strict'),A=require('../../scripts/lib/game-amount.cjs'),certify=require('../../scripts/lib/native-credit-prefix.cjs'),create=require('../../scripts/lib/luminous-orbit-session.cjs'),{integer}=require('./amount-oracle.cjs');
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
const orbit=create(A,[0,.25],0,false,{phaseCeiling:.999999});orbit.advance('1e25');
for(const order of [[1,.5],[.5,1]])for(const odd of [0,1])for(const offset of [0,17]){
 const wallet=2**52+odd,recipes=[order,order,order],kills=[{normal:.5,bright:1.5}],ordered=recipes.map(row=>row.map(amount=>({kind:'gain',amount})).concat([{kind:'kill',index:0}])),n=100000,r=certify(A,wallet,recipes,kills,n,{ordered});
 eq(r.mode,'native','mixed half-ULP credits are certified with their real order');eq(r.needsFold,true,'test actually exercises incoming parity');
 let value=wallet,bright=0;for(let i=offset;i<offset+n;i++){for(const amount of order)value+=amount;const luminous=i>=4&&i%4===0;if(luminous)bright++;value+=luminous?1.5:.5;}
 eq(r.finish([bright],n,orbit,offset),value,'ordered native fold matches every independently literal addition');
 const expected=order[0]===1?BigInt(wallet)+2n*BigInt(n)+2n*BigInt(bright)-BigInt(odd):BigInt(wallet)+2n*BigInt(n)+BigInt(odd);
 eq(BigInt(value),expected,'closed-form half-ULP credit recurrence is independent of the fold');
}
{
 const wallet=2**52,recipes=[[1,.5],[1,.5],[1,.5]],kills=[{normal:.5,bright:1.5}],ordered=recipes.map(row=>row.map(amount=>({kind:'gain',amount})).concat([{kind:'kill',index:0}])),r=certify(A,wallet,recipes,kills,'1e25',{ordered}),n=integer(r.cycles),bright=(n-1n)/4n,expected=BigInt(wallet)+2n*n+2n*bright;
 eq(BigInt(r.finish([bright.toString()+'e0'],r.cycles,orbit,0)),expected,'huge parity fold remains exact before the binade crossing');
 const cursor=r.finishCursor([bright.toString()+'e0'],r.cycles,orbit,0,{maxBlocks:1});let step,yields=0;do{step=cursor.next();if(!step.done)yields++;}while(!step.done);eq(BigInt(step.value),expected,'resumable native rounding fold retains exact endpoint');assert(yields>0);checks++;
}
assert.throws(()=>certify(A,2**52,[[1,.5]],[{normal:.5,bright:1.5}],100,{ordered:[[{kind:'gain',amount:1},{kind:'gain',amount:.5}]]}),RangeError);checks++;
console.log(JSON.stringify({status:'PASS',checks,limits:'Ordered Native rounding component; full scheduler connection and mobile latency remain separate.'}));
