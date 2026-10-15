'use strict';
const assert=require('node:assert/strict'),A=require('../../scripts/lib/game-amount.cjs'),create=require('../../scripts/lib/luminous-orbit-session.cjs');
const MOD=65537;let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
const consumer={key:'ordered-hash-65537-v1',identity:()=>({a:1,b:0}),combine:(x,y)=>({a:x.a*y.a%MOD,b:(x.b*y.a+y.b)%MOD}),word:rows=>{let b=0,a=1;for(const row of rows)for(const flag of row){a=a*33%MOD;b=(b*33+(flag?7:3))%MOD;}return {a,b};}};
consumer.repeat=(word,n)=>{let out=consumer.identity();while(A.gt(n,0)){const p=A.divmod(n,2);if(A.cmp(p.r,0))out=consumer.combine(out,word);n=p.q;if(A.gt(n,0))word=consumer.combine(word,word);}return out;};
function reference(pattern,start,count,phase,flag){let h=0;for(let i=0;i<start+count;i++){for(let j=0;j<pattern.length;j++){if(i>=start&&j<pattern.length-1)h=(h*33+(flag?7:3))%MOD;if(pattern[j]===null){flag=false;continue;}phase+=pattern[j];flag=phase>=1;if(flag)phase-=1;}if(phase>.999999)phase=.999999;}return h;}
for(const pattern of [[.08,.08,.08,null,.1,.1,.1,.1,.1,.1,.08],[.03,.03,.03,null,.05,.05,.05,.05,.05,.05,.03]]){
 const initial=.20999899976786907,session=create(A,pattern,initial,false,{phaseCeiling:.999999});session.advance('1e25');const before=session.position('1e25');
 for(const [start,n]of [[0,0],[0,1],[1,5],[31,137],[1001,3000],[99991,9]])eq(session.fold(start,n,consumer).b,reference(pattern,start,n,initial,false),'ordered fold matches independent literal rolling hash');
 const whole=session.fold(17,'1e25',consumer),first=session.fold(17,'4e24',consumer),last=session.fold(A.exactAdd(17,'4e24'),'6e24',consumer);eq(whole,consumer.combine(first,last),'huge fold composition preserves order, offsets and recipe-independent state');
 const cursor=session.foldCursor(17,'1e25',consumer,{maxBlocks:1});let step,yields=0;do{step=cursor.next();if(!step.done)yields++;}while(!step.done);eq(step.value,whole,'resumable weighted fold matches synchronous result');assert(yields>0);checks++;
 eq(session.position('1e25'),before,'folding and yielding do not move the actual orbit cursor');
}
{
 const n=10n**25n,session=create(A,[0,.25],0,false,{phaseCeiling:.999999});session.advance(n.toString()+'e0');
 function pow(a,n){let out=1n;for(;n;n>>=1n,a=a*a%65537n)if(n&1n)out=out*a%65537n;return out;}
 let prefix=0n;for(let i=0;i<4;i++)prefix=(prefix*33n+3n)%65537n;
 const blockA=pow(33n,4n),blockB=(7n*pow(33n,3n)+3n*pow(33n,2n)+3n*33n+3n)%65537n,q=(n-4n)/4n,power=pow(blockA,q),inverse=pow(blockA-1n,65535n),expected=(prefix*power+blockB*(power-1n+65537n)*inverse)%65537n;
 eq(session.fold(0,n.toString()+'e0',consumer).b,Number(expected),'independent closed quarter-stream geometric sum over1e25 cycles');
}
console.log(JSON.stringify({status:'PASS',checks,limits:'Ordered orbit-word component only. Native rounding automaton and full scheduler connection remain separate.'}));
