'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),build=require('./endless-cycle-source.cjs'),A=require('../../scripts/lib/game-amount.cjs');
const {app,CLOCK,clone}=require('./forge-expansion-harness.cjs'),source=require('./frozen-cycle-power.cjs')(build(fs.readFileSync('index.html','utf8'))),seed=JSON.parse(fs.readFileSync('docs/qa/endless-progression-001/candidate-ak-mature-snapshot.json.endpoint.json','utf8')),start=CLOCK+180*86400000;
const {integer}=require('./amount-oracle.cjs');
seed.depth=seed.enemyDepth=16;seed.riftMode='push';seed.autoAscendEnabled=true;seed.autoAscendTargetDepth=16;
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
function page(){const x=app(source);x.clock(start);x.q.set(clone(seed));x.q.restoreEnemy();return x;}
for(const seconds of [1e-20,1e-19,1e-18,1e-17]){
 const a=page(),b=page(),fast=a.q.advance(seconds,{kind:'offline',clockStartMs:start}),literal=b.q.advance(seconds,{kind:'offline',clockStartMs:start,disableCycleBatching:true});
 eq(a.q.get(),b.q.get(),'finite complete-engine state matches literal clock reference');
 if(!fast.ascendGainRuns)eq(fast,literal,'ordinary summary shape/effects unchanged without actual batching');
 else{for(const key of Object.keys(literal))if(!['iterations','fastForwardedKills','ascendGains'].includes(key))eq(fast[key],literal[key],'short bulk preserves exact summary '+key);eq(fast.ascendGainRuns.reduce((n,r)=>n+integer(r.count),0n),BigInt(literal.ascends),'short bulk preserves every compressed receipt');}
}
for(const seconds of [1e-16,3e-16]){
 const a=page(),b=page(),fast=a.q.advance(seconds,{kind:'offline',clockStartMs:start}),literal=b.q.advance(seconds,{kind:'offline',clockStartMs:start,disableCycleBatching:true});
 eq(a.q.get(),b.q.get(),'finite actual bulk exactly matches every literal saved field');
 for(const key of Object.keys(literal))if(!['iterations','fastForwardedKills','ascendGains'].includes(key))eq(fast[key],literal[key],'finite bulk exact summary '+key);
 eq(fast.ascendGainRuns.reduce((n,r)=>n+integer(r.count),0n),BigInt(literal.ascends),'compressed sequence represents every literal Ascend');
}
const x=page(),before=clone(x.q.get()),t=performance.now(),seconds=.01,s=x.q.advance(seconds,{kind:'offline',clockStartMs:start});
assert(A.gt(s.ascends,1e12),'stress actually performs the unrestricted repeated resets');checks++;
assert(s.ascendGainRuns&&s.ascendGainRuns.length<100,'compressed lossless reward receipts');checks++;
eq(s.elapsedSec,seconds,'full requested stress interval completes');
const n=integer(s.ascends),after=x.q.get();
eq(integer(after.ascendCount),integer(before.ascendCount)+n,'independent exact lifetime Ascend count');
eq(integer(after.prisms),integer(before.prisms)+222n*n,'independent protected Prism credits');
eq(integer(after.motes),integer(before.motes)+50n*n+60n,'independent paid Dust and one fixed Luminous payout');
eq(integer(after.totalKills),integer(before.totalKills)+integer(s.kills),'independent exact victory credits');
eq(integer(s.kills),10n*(n-1n)+BigInt(after.depth-6),'every full and final partial path accounted once');
eq(integer(after.sigils),integer(before.sigils)+6n*(n-1n+BigInt(after.depth>10?1:0)),'independent boss Sigil credits');
function dyad(v){const b=Buffer.alloc(8);b.writeDoubleBE(v);const raw=b.readBigUInt64BE(),e=Number(raw>>52n&2047n);return {n:(raw&((1n<<52n)-1n))+(e?1n<<52n:0n),e:e?e-1075:-1074};}
const probe=JSON.parse(require('node:zlib').gunzipSync(fs.readFileSync('docs/qa/endless-progression-001/experiments/ascend-cycle-transcript.json.gz'))),prefix=probe.rows.slice(0,5),period=probe.rows.slice(5,10),all=prefix.concat(period).flatMap(r=>r.ops.filter(o=>o.kind==='interval').map(o=>dyad(o.seconds))),unit=Math.min(-3,...all.map(d=>d.e)),sum=row=>row.ops.filter(o=>o.kind==='interval').reduce((s,o)=>{const d=dyad(o.seconds);return s+(d.n*125n<<BigInt(d.e-unit));},0n),periodTicks=period.map(sum),totalPeriod=periodTicks.reduce((a,b)=>a+b,0n);
let left=(10n<<BigInt(-3-unit))-prefix.reduce((s,r)=>s+sum(r),0n),expected=6n+left/totalPeriod*5n;left%=totalPeriod;for(const d of periodTicks){if(left<d)break;left-=d;expected++;}eq(n,expected,'independent IEEE dyads over the frozen literal combat period give the huge exact count');
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),wallMs:performance.now()-t,stress:{ascends:s.ascends,kills:s.kills,iterations:s.iterations,prisms:x.q.get().prisms,enemyHp:x.q.get().enemyHp,gainRuns:s.ascendGainRuns},limits:'First connected prototype only; full8h, exact aggregate oracles, persistence, boundary controls, general configurations and whole regressions pending.'}));
