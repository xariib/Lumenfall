'use strict';
const assert=require('node:assert/strict'),A=require('../../scripts/lib/game-amount.cjs'),advance=require('../../scripts/lib/ascend-native-phase.cjs');
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
function literal(program,n,value,cap){for(let i=0;i<n;i++)for(const op of program)value=op===null?Math.min(value,cap):value+op;return value;}
const programs=[[1.2e-17,2.8e-17,3.4e-17,null],[1e-8,1e-7,.00001,null],[Number.MIN_VALUE,Number.MIN_VALUE*2,null],[.1,.2,null]];
for(const program of programs)for(const start of [0,Number.MIN_VALUE,1e-20,.0001,389.45354674756527,999.999]){
 const r=advance(A,program,100000,start,999.999);eq(r.value,literal(program,100000,start,999.999),'certified phase matches every native addition and clamp');
}
const records=[];
for(const program of programs){const start=0,n='1e25',whole=advance(A,program,n,start,999.999),first=advance(A,program,'5e24',start,999.999),last=advance(A,program,'5e24',first.value,999.999);eq(whole.value,last.value,'huge native phase split matches whole');assert(whole.blocks<10000);checks++;records.push(whole);}
const mature=advance(A,programs[0],'1e25',389.45354674756527,999.999);eq(mature.value,389.45354674756527,'literal mature phase stagnation is preserved');
for(const program of [[.01,.003,null],[.0001,.0002,null],[.1,.2,null],[.00001,null]])for(const start of [0,389.45354674756527,999.999]){
 const cap=999.999,threshold=1000-1e-7,limit=100000;let value=start,cycles=0;
 outer:for(;cycles<limit;cycles++){let next=value;for(const op of program){next=op===null?Math.min(next,cap):next+op;if(next>=threshold)break outer;}value=next;}
 const r=advance(A,program,limit,start,cap,{threshold});eq(r.cycles,cycles,'phase horizon stops before the first native due action');eq(r.value,value,'safe prefix retains every literal phase bit');
}
for(const r of records)eq(literal(programs[records.indexOf(r)],1,r.value,999.999),r.value,'huge endpoint has an independently literal fixed point');
for(const n of [1e25,1e28,1e30])eq(require('./amount-oracle.cjs').integer(advance(A,[0,null],n,0,999.999).cycles),BigInt(n),'native unsafe cycle count preserves its actual binary integer');
assert.throws(()=>advance(A,[Number.MAX_VALUE,Number.MAX_VALUE,null],1,0,999.999),RangeError);checks++;
console.log(JSON.stringify({status:'PASS',checks,records,mature,limits:'Native timer recurrence only; full combat scheduler not integrated.'}));
