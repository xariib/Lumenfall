'use strict';
const assert=require('node:assert/strict'),A=require('../../scripts/lib/game-amount.cjs'),orbit=require('../../scripts/lib/luminous-orbit.cjs')(A);
const {integer}=require('./amount-oracle.cjs');let checks=0;
function equal(a,b,m){checks++;assert.deepEqual(a,b,m);}
function reference(chances,n,phase,flag){const counts=Array(chances.length-1).fill(0);for(let i=0;i<n;i++)for(let j=0;j<chances.length;j++){if(j<counts.length&&flag)counts[j]++;if(chances[j]===null){flag=false;continue;}phase+=chances[j];flag=phase>=1;if(flag)phase-=1;}return {phase,flag,counts};}
const patterns=[[.08,.08,.08,null,.1,.1,.1,.1,.1,.1,.08],[.03,.03,.03,null,.05,.05,.05,.05,.05,.05,.03],[.25,.25,null,.25]];
const started=performance.now();
for(const pattern of patterns)for(const phase of [0,Number.MIN_VALUE,.20999899976786907,.5-Number.EPSILON,.5,.5+Number.EPSILON,.9999999999999999])for(const flag of [false,true]){
 const n=100000,r=reference(pattern,n,phase,flag),fast=orbit.advance(pattern,n,phase,flag);
 equal(fast.complete,true,'orbit finishes');equal(fast.phase,r.phase,'every floating spawn addition retained');equal(fast.flag,r.flag,'last spawn identity');equal(fast.counts,r.counts,'exact defeated Luminous counts by Rift');
}
for(const pattern of patterns){
 const n='1e25',half='5e24',whole=orbit.advance(pattern,n,.20999899976786907,false,{maxBlocks:10000});
 const first=orbit.advance(pattern,half,.20999899976786907,false,{maxBlocks:10000}),last=orbit.advance(pattern,half,first.phase,first.flag,{maxBlocks:10000});
 equal(whole.complete,true,'huge orbit completes in bounded regions');equal(first.complete&&last.complete,true,'split huge orbit completes');equal(whole.phase,last.phase,'huge split exact saved phase');equal(whole.flag,last.flag,'huge split identity');
 whole.counts.forEach((value,i)=>equal(integer(value),integer(first.counts[i])+integer(last.counts[i]),'huge exact split count'));
}
console.log(JSON.stringify({status:'PASS',checks,wallMs:performance.now()-started,limits:'Exact literal floating recurrence for100000 cycles across42 boundary cases; huge composition and bounded-region evidence. Full combat-cycle batching remains separate.'}));
