'use strict';
// A valid synthetic development configuration exercises fast, non-tiny cycles
// and naturally due automation. No balance/function override is used.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),build=require('./endless-cycle-source.cjs'),{app,CLOCK,clone}=require('./forge-expansion-harness.cjs'),{integer}=require('./amount-oracle.cjs');
const source=build(fs.readFileSync('index.html','utf8')),seed=JSON.parse(fs.readFileSync('docs/qa/endless-progression-001/candidate-ak-mature-snapshot.json.endpoint.json')),start=CLOCK+180*86400000;
seed.depth=seed.enemyDepth=16;seed.riftMode='push';seed.autoAscendEnabled=true;seed.autoAscendTargetDepth=16;seed.research.masterwork=10;seed.longStudyLevels.wispascend=0;seed.nodes.chargememory=0;Object.keys(seed.wispMastery).forEach(id=>seed.wispMastery[id]=0);
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
for(const seconds of [.1,.8,1.4]){
 function page(){const x=app(source);x.clock(start);x.q.set(clone(seed));x.q.restoreEnemy();return x;}
 const a=page(),b=page(),fast=a.q.advance(seconds,{kind:'offline',clockStartMs:start}),literal=b.q.advance(seconds,{kind:'offline',clockStartMs:start,disableCycleBatching:true});
 eq(a.q.get(),b.q.get(),'automation horizon preserves every literal saved field');assert(fast.ascendGainRuns,'development-speed fixture actually batches cycles');checks++;
 for(const key of Object.keys(literal))if(!['iterations','fastForwardedKills','ascendGains'].includes(key))eq(fast[key],literal[key],'due automation exact summary '+key);
 eq(fast.ascendGainRuns.reduce((sum,r)=>sum+integer(r.count),0n),BigInt(literal.ascends),'automation boundaries retain every compressed reset');
 if(seconds>.7){assert(fast.autoTaps>0,'Auto-Tap actually fires inside comparison window');checks++;}
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),limits:'Focused development-speed and due-automation comparison; broad campaigns and mobile/device acceptance remain separate.'}));
