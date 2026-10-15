'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone}=require('./forge-expansion-harness.cjs'),{integer}=require('./amount-oracle.cjs');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8');
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}function ok(a,m){checks++;assert(a,m);}
for(const count of [0,Number.MAX_SAFE_INTEGER,1e30,'1e400']){
 const x=app(source),q=x.q,s=q.fresh();s.depth=s.enemyDepth=16;s.maxDepthEver=100;
 s.ascendCount=count;s.totalKills=count;s.dailyStats={ascends:count,kills:count};
 s.cometClaims.retired.comettrials='settled';
 if(count)s.cometTrial={id:'quiet',target:15,phase:'active',startedAscend:count,failed:false,reason:''};
 q.set(s);q.restoreEnemy();
 if(count)eq(integer(q.get().cometTrial.startedAscend),integer(count),'legacy active trial recognizes an exact wide run');
 const before=clone(q.get());ok(q.save(),'initial exact counter save');
 x.fail(true,false);eq(q.ascend(),false,'failed primary Ascend is rejected');eq(q.get(),before,'failed primary Ascend rolls back complete state');x.fail(false,false);
 ok(q.ascend(),'unrestricted real Ascend at Rift15');eq(integer(q.get().ascendCount),integer(count)+1n,'every Ascend retained past safe integers');
 eq(integer(q.get().dailyStats.ascends),integer(count)+1n,'daily Ascend count exact');
 if(count)eq(q.get().cometTrialResult.outcome,'completed','wide run completes the existing paid trial');
 const after=clone(q.get());ok(q.save(),'wide counters save');q.load();eq(q.get(),after,'save/load retains exact counters');q.set(clone(q.get()));eq(q.get(),after,'repeat normalization retains exact counters');
 const code=q.export();q.set(q.fresh());x.area.value=code;q.restore();x.drain();q.load();eq(q.get(),after,'backup/import retains exact run identity');
 q.kill('offline');eq(integer(q.get().totalKills),integer(count)+1n,'literal victory count exact past safe integer');eq(integer(q.get().dailyStats.kills),integer(count)+1n,'daily victory count exact');
}
{
 const x=app(source),q=x.q,s=q.fresh();s.ascendCount='1e400';s.maxDepthEver=100;s.cometClaims.retired.comettrials='settled';
 s.cometTrial={id:'quiet',target:15,phase:'active',startedAscend:'10000000000000000001e381',failed:false,reason:''};q.set(s);
 eq(q.get().cometTrial,null,'different enormous run identities cannot alias through Infinity');
 s.cometTrial.startedAscend='10e399';q.set(s);eq(q.get().cometTrial.startedAscend,'1e400','equivalent exact run identity canonicalizes');
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex')}));
