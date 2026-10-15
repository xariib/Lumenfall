'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),build=require('./endless-cycle-source.cjs'),aggregate=require('../../scripts/lib/ascend-cycle-aggregate.cjs'),A=require('../../scripts/lib/game-amount.cjs'),{fraction,integer}=require('./amount-oracle.cjs');
const {app,CLOCK,clone}=require('./forge-expansion-harness.cjs'),source=build(fs.readFileSync('index.html','utf8')),seed=JSON.parse(fs.readFileSync('docs/qa/endless-progression-001/candidate-ak-mature-snapshot.json.endpoint.json')),start=CLOCK+180*86400000;
seed.depth=seed.enemyDepth=16;seed.riftMode='push';seed.autoAscendEnabled=true;seed.autoAscendTargetDepth=16;
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
const total=10n**25n+3n,bright=total/3n,normal=.7*3,glow=.7*7,grants=[.12345678912345678,.1,.2],r=aggregate(A,[{shardsCredits:grants}], [{normal,bright:glow}],[bright.toString()+'e0'],total.toString()+'e0'),terms=[[normal,total-bright],[glow,bright],...grants.map(value=>[value,total])],expected=terms.reduce((sum,[v,count])=>{const f=fraction(v);return {n:sum.n*f.d+f.n*count*sum.d,d:sum.d*f.d};},{n:0n,d:1n}),got=fraction(r.shards);
eq(got.n*expected.d,expected.n*got.d,'independent rational sum keeps every decimal per-credit digit without small intermediate rounding');
for(const echo of [0,3])for(const seconds of [1e-16,3e-16]){
 function page(){const x=app(source);x.clock(start);const s=clone(seed);s.nodes.echo=echo;x.q.set(s);x.q.restoreEnemy();return x;}
 const a=page(),b=page(),fast=a.q.advance(seconds,{kind:'offline',clockStartMs:start}),literal=b.q.advance(seconds,{kind:'offline',clockStartMs:start,disableCycleBatching:true});
 eq(a.q.get(),b.q.get(),'fractional offline credits retain every literal saved field');assert(fast.ascendGainRuns,'fractional fixture actually uses batching');checks++;
 for(const key of Object.keys(literal))if(!['iterations','fastForwardedKills','ascendGains'].includes(key))eq(fast[key],literal[key],'fractional exact summary '+key);
 eq(fast.ascendGainRuns.reduce((n,r)=>n+integer(r.count),0n),BigInt(literal.ascends),'fractional reward policy keeps exact compressed Ascend count');
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),limits:'Fractional per-credit fast path is certified only after its credited wallets and summaries are wide. Native fractional recurrence still uses the literal owner.'}));
