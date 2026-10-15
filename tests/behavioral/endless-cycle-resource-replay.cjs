'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),build=require('./endless-cycle-source.cjs'),{app,CLOCK,clone}=require('./forge-expansion-harness.cjs');
const base=build(fs.readFileSync('index.html','utf8')),anchor='state.heroResource=resources?resources.at(count):clonePersistedValue(last.endHero);';assert.equal(base.split(anchor).length,2);
let source=base.replace(anchor,'if(resources)resourceReplays++;'+anchor).replace("if(document.readyState==='loading'){","var resourceReplays=0;window.endlessQa={count:function(){return resourceReplays;},observer:function(){return endlessHeroObserver!==null;}};if(document.readyState==='loading'){");
if(process.env.LUMENFALL_CYCLE_MUTATION==='resourceReplay')source=source.replace(anchor,'state.heroResource=clonePersistedValue(last.endHero);');
process.once('uncaughtException',error=>{console.log(JSON.stringify({status:'FAIL',current:'Checked ability bar replay',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),error:error.stack}));process.exitCode=1;});
const seed=JSON.parse(fs.readFileSync('docs/qa/endless-progression-001/candidate-ak-mature-snapshot.json.endpoint.json')),start=CLOCK+180*86400000;seed.depth=seed.enemyDepth=16;seed.riftMode='push';seed.autoAscendEnabled=true;seed.autoAscendTargetDepth=16;seed.research.masterwork=10;seed.longStudyLevels.wispascend=0;Object.keys(seed.wispMastery).forEach(id=>seed.wispMastery[id]=0);
let checks=0;const records=[];function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
for(const memory of [1,2,3]){
 function page(){const x=app(source);x.clock(start);const s=clone(seed);s.nodes.chargememory=memory;x.q.set(s);x.q.restoreEnemy();return x;}
 const a=page(),b=page(),seconds=.8,fast=a.q.advance(seconds,{kind:'offline',clockStartMs:start}),literal=b.q.advance(seconds,{kind:'offline',clockStartMs:start,disableCycleBatching:true});
 eq(a.q.get(),b.q.get(),'checked resource replay preserves every literal saved field');assert(a.q.endless.count()>0,'test actually applies the checked resource certificate');checks++;
 for(const key of Object.keys(literal))if(!['iterations','fastForwardedKills','ascendGains'].includes(key))eq(fast[key],literal[key],'checked resource exact summary '+key);
 eq(a.q.endless.observer(),false,'resource observer is released after synchronous completion');
 const paused=page(),cursor=paused.q.advance(.1,{kind:'offline',clockStartMs:start,resumable:true});let step=cursor.next();eq(paused.q.endless.observer(),false,'resource observer is released while the cursor yields');cursor.return();eq(paused.q.endless.observer(),false,'resource observer is released on cursor cancellation');
 records.push({memory,replays:a.q.endless.count(),iterations:fast.iterations,literalIterations:literal.iterations});
}
console.log(JSON.stringify({status:'PASS',checks,baseSourceSha256:crypto.createHash('sha256').update(base).digest('hex'),instrumentedSourceSha256:crypto.createHash('sha256').update(source).digest('hex'),records,limits:'Focused checked-bar and observer lifetime tests; broad campaigns, mature throughput and device acceptance remain separate.'}));
