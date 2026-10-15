'use strict';
const assert=require('node:assert/strict'),A=require('../../scripts/lib/game-amount.cjs'),certify=require('../../scripts/lib/native-credit-prefix.cjs');
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
const records=[];
for(const wallet of [1.3,1024.3,1e8+.13,2**40+.2,2**52])for(const factor of [.7,.95,1.05]){
 const recipes=[[.13*factor,.001*factor],[.7*factor],[.31*factor]],kills=[{normal:3*factor,bright:7*factor},{normal:2*factor,bright:4*factor}],r=certify(A,wallet,recipes,kills,1000);
 if(r.mode!=='native'||r.cycles<1){records.push({wallet,factor,mode:r.mode,cycles:r.cycles});continue;}
 const n=Number(r.cycles),counts=[0,0];let value=wallet;
 for(let i=0;i<n;i++){for(const gain of recipes[i%recipes.length])value+=gain;for(let j=0;j<kills.length;j++){const bright=(i*13+j*17)%23<7;if(bright)counts[j]++;value+=bright?kills[j].bright:kills[j].normal;}}
 eq(r.finish(counts,n),value,'certified native units match every literal per-credit addition');records.push({wallet,factor,mode:r.mode,cycles:n});
}
{
 const r=certify(A,2**52,[[.5]],[{normal:.5,bright:.5}],'1e25');eq(r.mode,'native','stable even half-ULP path certified');eq(r.finish(['5e24'],'1e25'),2**52,'huge native stagnation is preserved exactly');
 eq(certify(A,2**52,[[1,.5]],[],1000).mode,'literal','changing half-ULP parity stays with literal owner');eq(certify(A,2**52+1,[[.5]],[],1000).mode,'literal','initial odd tie stays with literal owner');
}
for(const wallet of [0,100,'1e400',1e30])eq(certify(A,wallet,[[1,3]],[{normal:2,bright:4}],'1e25').mode,'exact','integer and wide wallets retain existing exact credit path');
eq(certify(A,100,[[.5]],[],1000).mode,'native','integer wallet with fractional credits uses native rounding certificate');
eq(certify(A,1,[[1e30]],[],1000).mode,'exact','integer credit can promote directly to existing wide accounting');
const edge=certify(A,2048-2**-42,[[.3]],[],1000);eq(edge.cycles,0,'stop before native precision crossing');
assert.throws(()=>certify(A,-1,[[1]],[],1),RangeError);checks++;
console.log(JSON.stringify({status:'PASS',checks,records,limits:'Native addition component only; changing half-ULP parity remains literal. Scheduler, purchases and chronology require connected tests.'}));
