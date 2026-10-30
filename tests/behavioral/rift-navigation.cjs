'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const F=require('./forge-expansion-harness.cjs');
module.exports=function(file){
const source=fs.readFileSync(file,'utf8');
const injected=source.replace("if(document.readyState==='loading'){",'window.endlessQa={step:stepRift,push:enterPushMode};if(document.readyState===\'loading\'){');
let checks=0;
function eq(a,b,label){checks++;assert.deepEqual(a,b,label);}
function fixture(depth,returning){const x=F.app(injected,undefined,{clockDate:true}),s=x.q.fresh();Object.assign(s,{depth,enemyDepth:depth,maxDepthEver:100,questDay:x.q.day(),lastSeen:F.CLOCK});if(returning)Object.assign(s,{riftMode:'farm',farmDepth:depth,farmReturnDepth:returning,farmAutoResume:true});x.q.set(s);return x;}
eq(source.includes('id="farm-picker-overlay"'),false,'picker removed');
for(const [depth,returning,offset,expected,mode] of [
 [40,0,-1,39,'farm'],[40,0,-10,29,'farm'],[39,40,-1,38,'farm'],
 [38,40,1,39,'farm'],[39,40,1,40,'push'],[9,12,1,11,'farm'],
 [11,12,-1,9,'farm'],[25,40,-10,15,'farm'],[15,40,-10,5,'farm'],
 [5,40,-10,1,'farm'],[1,2,1,2,'push'],[99,101,1,101,'push']
]){
 const x=fixture(depth,returning),q=x.q;
 eq(q.endless.step(offset),true,'navigation succeeds');
 eq(q.get().depth,expected,'independent target');eq(q.get().riftMode,mode,'mode');
 eq(q.get().farmAutoResume,false,'manual selection cancels automatic retry');
 eq(q.get().farmReturnDepth,mode==='farm'?(returning||depth):0,'saved Push position');
 const saved=F.clone(q.get());q.load();eq(q.get().depth,saved.depth,'reload depth');eq(q.get().riftMode,mode,'reload intent');
}
for(const [depth,returning,offset]of [[1,0,-1],[1,0,-10],[1,2,-1],[40,0,1],[20,0,2]]){
 const {q}=fixture(depth,returning),before=F.clone(q.get());eq(q.endless.step(offset),false,'invalid or boundary no-op');eq(q.get(),before,'no-op preserves state');
}
for(const [depth,returning,offset]of [[40,0,-1],[25,40,-10],[39,40,1]]){
 const x=fixture(depth,returning),before=F.clone(x.q.get());x.fail(true,true);
 eq(x.q.endless.step(offset),false,'failed persistence rejects navigation');eq(x.q.get(),before,'failed navigation rolls back full state');
}
return {status:'pass',checks};
};
if(require.main===module)console.log(JSON.stringify(module.exports(process.argv[2]||'index.html')));
