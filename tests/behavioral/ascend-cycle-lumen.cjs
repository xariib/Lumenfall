'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),A=require('../../scripts/lib/game-amount.cjs'),create=require('../../scripts/lib/luminous-orbit-session.cjs'),kernel=require('../../scripts/lib/luminous-orbit.cjs')(A,{phaseCeiling:.999999}),tail=require('../../scripts/lib/ascend-cycle-lumen.cjs');
const {app}=require('./forge-expansion-harness.cjs'),source=fs.readFileSync('index.html','utf8'),{q}=app(source);
const probe=JSON.parse(require('node:zlib').gunzipSync(fs.readFileSync('docs/qa/endless-progression-001/experiments/ascend-cycle-transcript.json.gz')));
assert.equal(probe.sourceSha256,require('node:crypto').createHash('sha256').update(source).digest('hex'),'observation source matches the executed formulas');
const pattern=[.08,.08,.08,null,.1,.1,.1,.1,.1,.1,.08],rows=probe.rows,base=4,recipes=[];
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
q.set(rows[base].state);
for(const row of rows.slice(base,base+5)){
 const ops=[];
 for(const op of row.ops){
  if(op.kind==='kill')ops.push({kind:'kill',normal:A.mul(q.lumen(op.depth,false),op.scale),bright:A.mul(q.lumen(op.depth,true),op.scale)});
  if(op.kind==='ability'&&A.gt(op.rewards.lumen,0))ops.push({kind:'gain',amount:A.mul(op.rewards.lumen,row.ops.find(o=>o.kind==='kill').scale)});
  if(op.kind==='ascend')ops.push({kind:'retain',factor:.25,cap:250000});
 }
 eq(ops.at(-1).kind,'retain','observed stable boundary caps its Lumen');recipes.push(ops);
}
const initial=rows[base-1].state,session=create(A,pattern,initial.luminousAccum,initial.enemyIsLuminous,{phaseCeiling:.999999});session.advance(rows.length-base);
for(let n=5;n<=rows.length-base;n++){
 const r=tail(A,kernel,session,pattern,recipes,n,250000);
 eq(r.independent,true,'Gale saturation proves independence from skipped initial Lumen');eq(r.lumen,rows[base+n-1].state.lumen,'reconstruction matches real engine saved endpoint');eq(r.phase,rows[base+n-1].state.luminousAccum,'real engine normalized spawn phase matches');eq(r.flag,rows[base+n-1].state.enemyIsLuminous,'real engine reset spawn matches');
}
session.advance(A.exactSub('1e25',rows.length-base));const result=tail(A,kernel,session,pattern,recipes,'1e25',250000);
eq(result.independent,true,'huge endpoint bounded reconstruction');const next=tail(A,kernel,session,pattern,recipes,'1e25',250000,128);eq(next.lumen,result.lumen,'independent64/128-cycle tails agree');
const slowRecipes=[[{kind:'kill',normal:1,bright:1},{kind:'retain',factor:1,cap:250000}]],slow=create(A,[0,0],0,false);slow.advance(100);
const refused=tail(A,require('../../scripts/lib/luminous-orbit.cjs')(A),slow,[0,0],slowRecipes,100,250000);eq(refused.independent,false,'noncontractive wallet cannot claim reconstruction');eq(refused.lumen,null,'unproven endpoint is refused');
console.log(JSON.stringify({status:'PASS',checks,result,limits:'Lumen component only; queued purchases, other rewards, combat/timers and full catch-up remain separate.'}));
