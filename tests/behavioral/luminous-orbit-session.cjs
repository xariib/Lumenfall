'use strict';
const assert=require('node:assert/strict'),A=require('../../scripts/lib/game-amount.cjs'),create=require('../../scripts/lib/luminous-orbit-session.cjs'),{integer}=require('./amount-oracle.cjs');
const pattern=[.08,.08,.08,null,.1,.1,.1,.1,.1,.1,.08];
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
function reference(n,phase,flag){const counts=Array(pattern.length-1).fill(0);for(let i=0;i<n;i++)for(let j=0;j<pattern.length;j++){if(j<counts.length&&flag)counts[j]++;if(pattern[j]===null){flag=false;continue;}phase+=pattern[j];flag=phase>=1;if(flag)phase-=1;}return {phase,flag,counts};}
const started=performance.now();
for(const seed of [0,.20999899976786907,.5,.9999999999999999]){
 const session=create(A,pattern,seed,false);let phase=seed,flag=false;
 for(const n of [1,7,23,99,100,101,100000]){const expected=reference(n,phase,flag),actual=session.advance(n);eq(actual.phase,expected.phase,'exact queried phase');eq(actual.flag,expected.flag,'exact queried flag');eq(actual.counts,expected.counts,'exact queried counts');phase=expected.phase;flag=expected.flag;}
}
const session=create(A,pattern,.20999899976786907,false),cursor=session.cursor('1e25',{maxBlocks:1000});let step,yields=0;
do{step=cursor.next();if(!step.done)yields++;}while(!step.done);
const whole=step.value;eq(whole.complete,true,'huge cursor completes');eq(whole.phase,.43136104858527186,'same1e25 endpoint as block100 certified experiment');assert(yields>0);checks++;
const samples=[],queryStart=performance.now();let sum=whole.counts.map(integer);
for(const n of [1,17,100001,'1e20',3,'7e25',99]){const start=session.advance(0),r=session.advance(n);eq(r.complete,true,'indexed query completes');if(typeof n==='number'){const expected=reference(n,start.phase,start.flag);eq(r.phase,expected.phase,'indexed finite phase has independent literal oracle');eq(r.flag,expected.flag,'indexed finite flag has independent literal oracle');eq(r.counts,expected.counts,'indexed finite counts have independent literal oracle');}samples.push({n,phase:r.phase,counts:r.counts});sum=sum.map((v,i)=>v+integer(r.counts[i]));}
const indexedQueryMs=performance.now()-queryStart;
const combined=create(A,pattern,.20999899976786907,false),all=A.exactAdd('8e25',A.exactAdd('1e20',100121)),final=combined.advance(all);
eq(session.advance(0).phase,final.phase,'huge mixed-query phase matches whole');final.counts.forEach((v,i)=>eq(integer(v),sum[i],'huge mixed-query exact counts'));
console.log(JSON.stringify({status:'PASS',checks,yields,stats:session.stats(),wallMs:performance.now()-started,indexedQueryMs,samples}));
