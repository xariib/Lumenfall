'use strict';
// A valid synthetic development configuration exercises fast, non-tiny cycles
// and naturally due automation. No balance/function override is used.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),build=require('./endless-cycle-source.cjs'),{app,CLOCK,clone}=require('./forge-expansion-harness.cjs'),{integer}=require('./amount-oracle.cjs');
let source=build(fs.readFileSync('index.html','utf8'));if(process.env.LUMENFALL_CYCLE_MUTATION==='automation'){const anchor='count=Amount.min(count,phaseLimit(state._autoTapAccum||0,state.achieved.autotap),phaseLimit(state._autoEmpowerAccum||0,state.achieved.labmaster));';assert.equal(source.split(anchor).length,2);source=source.replace(anchor,'/* intentional missing automation horizon */');}
process.once('uncaughtException',error=>{console.log(JSON.stringify({status:'FAIL',current:'development-speed due automation',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),error:error.stack}));process.exitCode=1;});
const seed=JSON.parse(fs.readFileSync('docs/qa/endless-progression-001/candidate-ak-mature-snapshot.json.endpoint.json')),start=CLOCK+180*86400000;
seed.depth=seed.enemyDepth=16;seed.riftMode='push';seed.autoAscendEnabled=true;seed.autoAscendTargetDepth=16;seed.research.masterwork=10;seed.longStudyLevels.wispascend=0;seed.nodes.chargememory=0;Object.keys(seed.wispMastery).forEach(id=>seed.wispMastery[id]=0);
seed.empowerQueue.ember=true;
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
for(const [memory,seconds]of [[0,.1],[0,.8],[0,1.4],[5,.1]]){
 function page(){const x=app(source);x.clock(start);const s=clone(seed);s.nodes.chargememory=memory;x.q.set(s);x.q.restoreEnemy();return x;}
 const a=page(),b=page(),fast=a.q.advance(seconds,{kind:'offline',clockStartMs:start}),literal=b.q.advance(seconds,{kind:'offline',clockStartMs:start,disableCycleBatching:true});
 eq(a.q.get(),b.q.get(),'automation horizon preserves every literal saved field');assert(fast.ascendGainRuns,'development-speed fixture actually batches cycles');checks++;
 for(const key of Object.keys(literal))if(!['iterations','fastForwardedKills','ascendGains'].includes(key))eq(fast[key],literal[key],'due automation exact summary '+key);
 eq(fast.ascendGainRuns.reduce((sum,r)=>sum+integer(r.count),0n),BigInt(literal.ascends),'automation boundaries retain every compressed reset');
 if(seconds>.7){assert(fast.autoTaps>0,'Auto-Tap actually fires inside comparison window');checks++;assert(fast.empowers>0,'Auto-Empower actually buys inside comparison window');checks++;}
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),limits:'Focused development-speed and due-automation comparison; broad campaigns and mobile/device acceptance remain separate.'}));
