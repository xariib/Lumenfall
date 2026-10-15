'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),A=require('../../scripts/lib/game-amount.cjs'),create=require('../../scripts/lib/simulation-binary-clock.cjs'),cycles=require('../../scripts/lib/ascend-cycle-lattice-clock.cjs'),{fraction,integer}=require('./amount-oracle.cjs');
const probe=JSON.parse(require('node:zlib').gunzipSync(fs.readFileSync('docs/qa/endless-progression-001/experiments/ascend-cycle-transcript.json.gz'))),rows=probe.rows.slice(4,9).map(r=>r.ops.filter(o=>o.kind==='interval').map(o=>o.seconds));
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
function dyad(n){const v=Buffer.alloc(8);v.writeDoubleBE(n);const bits=v.readBigUInt64BE(),raw=Number(bits>>52n&2047n);return {n:(bits&((1n<<52n)-1n))+(raw?1n<<52n:0n),e:raw?raw-1075:-1074};}
function expected(rows,budgetMs){const ds=rows.map(row=>row.map(dyad)),unit=Math.min(...ds.flat().map(d=>d.e),-3),target=BigInt(budgetMs)<<BigInt(-3-unit),durations=ds.map(row=>row.reduce((s,d)=>s+(d.n*125n<<BigInt(d.e-unit)),0n)),period=durations.reduce((s,n)=>s+n,0n);let count=target/period*BigInt(rows.length),left=target%period;for(const d of durations){if(left<d)break;left-=d;count++;}return {count,left,unit};}
const memo=new Map();
for(const ms of [1,100,1000,28800000,43200000]){
 const clock=create(A,2000000000000,ms/1000,{budgetMs:ms}),r=cycles(A,rows,clock.latticeRemaining()),e=expected(rows,ms);eq(integer(r.cycles),e.count,'independent integer-millisecond whole-cycle oracle');
 for(let repeat=0;repeat<2;repeat++){const cached=cycles(A,rows,clock.latticeRemaining(),memo);eq(cached.cycles,r.cycles,'memo retains exact oracle count');eq(cached.elapsed,r.elapsed,'memo retains exact elapsed ticks');eq(cached.remaining,r.remaining,'memo retains every remaining tick');}
 clock.advanceLattice(r.elapsed);const remaining=clock.latticeRemaining(),common=Math.min(remaining.unit,e.unit);eq(integer(remaining.ticks)<<BigInt(remaining.unit-common),e.left<<BigInt(e.unit-common),'all final partial-cycle time retained');
 const token=clock.remaining();clock.advance(token);eq(clock.remaining(),0,'exact remainder token reaches caller endpoint');eq(clock.nowMs(),2000000000000+ms,'native endpoint matches requested milliseconds');
}
for(let i=1;i<=16;i++){const changed=rows.map(row=>row.map(x=>x*i)),budget=create(A,2000000000000,1,{budgetMs:1000}).latticeRemaining(),cached=cycles(A,changed,budget,memo),literal=cycles(A,changed,budget);eq(cached.elapsed,literal.elapsed,'different recipe cannot reuse another translation');assert(memo.size<=8);checks++;}
console.log(JSON.stringify({status:'PASS',checks,limits:'Exact periodic-budget integration component; game scheduler still not connected.'}));
