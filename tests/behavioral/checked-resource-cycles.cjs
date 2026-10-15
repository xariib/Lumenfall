'use strict';
const assert=require('node:assert/strict'),A=require('../../scripts/lib/game-amount.cjs'),certify=require('../../scripts/lib/checked-resource-cycles.cjs');let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}function run(program,initial,cast,n,options){const cursor=certify(A,program,initial,cast,n,options);let step;do{step=cursor.next();}while(!step.done);return step.value;}
const ids=['ember','tide'];
for(const level of [0,1,2,3,4,5])for(const start of [0,.125,29.999999999999996,80]){
 const program=[[{kind:'interval',seconds:.001,rate:30,ids,witnesses:[]},{kind:'add',amount:.03,ids},{kind:'add',amount:20,ids},{kind:'retain',level},{kind:'check',id:'ember',fired:false},{kind:'check',id:'tide',fired:false}]],initial={ember:start,tide:start},cast={ember:true,tide:false},r=run(program,initial,cast,1000,{maxBlocks:16});let value=start,count=0;
 for(;count<Number(r.cycles);count++){assert((100-value)/30>=.001);value=Math.min(100,value+.03);value=Math.min(100,value+20);value=Math.min(100,(value*level)/5);assert(value<100-1e-7);}
 if(r.cycles>0)eq(r.at(r.cycles).ember,value,'resource endpoint matches literal multiply-before-divide and every native addition');
 if(r.unbounded){let expected=start;for(let i=0;i<100000;i++)expected=Math.min(100,(Math.min(100,Math.min(100,expected+.03)+20)*level)/5);eq(r.at('1e25').ember,expected,'fixed native period retains its actual fixed point over huge counts');}
}
{
 const p=[[{kind:'add',ids,amount:100},{kind:'check',id:'ember',fired:true},{kind:'retain',level:5}]],r=run(p,{ember:17,tide:17},{ember:true,tide:false},'1e25');eq(r.unbounded,true,'recorded reset makes a fully checked fixed program');eq(r.at('1e25'),{ember:0,tide:100},'independent active cast and blocked Support endpoints');
 const bad=run([[{kind:'check',id:'ember',fired:true}]],{ember:0},{ember:true},100);eq(bad.cycles,0,'changed readiness refuses the first differing cycle');
 const early=run([[{kind:'interval',seconds:1,rate:30,ids:['ember'],witnesses:[]},{kind:'add',amount:30,ids:['ember']}]],{ember:90},{ember:true},100);eq(early.cycles,0,'earlier natural ability event cannot be skipped');
}
console.log(JSON.stringify({status:'PASS',checks,limits:'Checked bar-program component only; observed program capture and guarded combat replay require full-engine tests.'}));
