'use strict';
const assert=require('node:assert/strict'),A=require('../../scripts/lib/game-amount.cjs'),create=require('../../scripts/lib/luminous-orbit-session.cjs'),{integer}=require('./amount-oracle.cjs');
const patterns=[[.08,.08,.08,null,.1,.1,.1,.1,.1,.1,.08],[.03,.03,.03,null,.05,.05,.05,.05,.05,.05,.03]],ceiling=.999999;
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
function reference(pattern,n,phase,flag){const counts=Array(pattern.length-1).fill(0);for(let i=0;i<n;i++){for(let j=0;j<pattern.length;j++){if(j<counts.length&&flag)counts[j]++;if(pattern[j]===null){flag=false;continue;}phase+=pattern[j];flag=phase>=1;if(flag)phase-=1;}phase=Math.min(ceiling,phase);}return {phase,flag,counts};}
for(const pattern of patterns)for(const seed of [0,.07999999999999995,.20999899976786907,.5,.999999])for(const flag of [false,true]){
 const session=create(A,pattern,seed,flag,{phaseCeiling:ceiling}),expected=reference(pattern,100000,seed,flag),r=session.advance(100000);
 eq(r.phase,expected.phase,'literal Ascend normalization at every cycle');eq(r.flag,expected.flag,'normalization retains actual reset spawn identity');eq(r.counts,expected.counts,'normalization keeps exact per-Rift Luminous counts');
}
const observations=[];for(const pattern of patterns){
const started=performance.now(),session=create(A,pattern,.20999899976786907,false,{phaseCeiling:ceiling}),it=session.cursor('1e25',{maxBlocks:1000});let step,yields=0;
do{step=it.next();if(!step.done)yields++;}while(!step.done);
eq(step.value.complete,true,'huge normalized orbit completes');const first=step.value,at=performance.now(),next=session.advance(100001),literal=reference(pattern,100001,first.phase,first.flag);
eq(next.phase,literal.phase,'huge normalized endpoint continues with literal oracle');eq(next.counts,literal.counts,'huge normalized counts continue with literal oracle');
const indexedMs=performance.now()-at;
for(const n of [0,1,31,100001]){const indexed=session.position(n),expected=reference(pattern,n,.20999899976786907,false);eq(indexed.phase,expected.phase,'indexed prefix independently literal');eq(indexed.counts,expected.counts,'indexed prefix counters independently literal');}
const whole=create(A,pattern,.20999899976786907,false,{phaseCeiling:ceiling}).advance(A.exactAdd('1e25',100001));
eq(whole.phase,next.phase,'normalized whole/split endpoint identical');whole.counts.forEach((v,i)=>eq(integer(v),integer(first.counts[i])+integer(next.counts[i]),'normalized whole/split counters exact'));
observations.push({yields,stats:session.stats(),wallMs:performance.now()-started,indexedWithLiteralMs:indexedMs,phase:first.phase});}
console.log(JSON.stringify({status:'PASS',checks,observations}));
