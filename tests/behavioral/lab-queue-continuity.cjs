'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,seed,clone}=require('./lab-expansion-harness.cjs');
let source=fs.readFileSync(process.argv[2]||'index.html','utf8');
const mutation=process.argv.includes('--mutate-stop');
if(mutation){const anchor='state.studyQueue[id]=!state.studyQueue[id];';assert.equal(source.split(anchor).length,2);source=source.replace(anchor,anchor+'if(!state.studyQueue[id] && findActiveStudy(id))storeStudyWork(findActiveStudy(id));');}
let checks=0;const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);},ok=(a,m)=>{checks++;assert(a,m);};
for(const route of ['direct','offline','reload']){
 const x=app(source),q=x.q,s=seed(q);s.longStudyLevels.labcapacity=2;q.set(s);
 ok(q.startAt('guardmastery',3),'start in fourth slot');ok(q.boost('guardmastery',2,8),'buy speed for slot');q.studyOnly(5);
 const work=clone(q.get().activeStudies[0]),boost=clone(q.get().studyBoosts),wallet=[q.get().lumen,q.get().shards,q.get().motes];
 ok(q.toggleQueue('guardmastery'),'turn repeat off');eq(q.get().studyQueue.guardmastery,false,'repeat is off');
 eq(q.get().activeStudies,[work],'Queue OFF retains running paid work');eq(q.get().pausedStudies,[],'queue alone never pauses');eq(q.get().studyBoosts,boost,'queue alone never changes paid boosts');eq([q.get().lumen,q.get().shards,q.get().motes],wallet,'queue never spends');
 q.queue();eq(q.get().activeStudies,[work],'scheduler leaves current work intact');ok(q.save(),'persist Queue OFF');
 let loaded=route==='reload'?app(source,x.storage).q:q;eq(loaded.get().activeStudies,[work],'paid work survives reload');eq(loaded.get().studyQueue.guardmastery,false,'repeat-off survives reload');
 if(route==='direct')loaded.finish(1e6);else loaded.advance(500,{kind:'offline',visual:false,clockStartMs:2000000000000,offlineWindowStartMs:2000000000000});
 loaded.queue();eq(loaded.get().longStudyLevels.guardmastery,1,'the paid level completes');eq(loaded.get().activeStudies,[],'no next level starts');eq(loaded.get().studySlotProjects[3],null,'slot becomes empty after completion');
 eq(loaded.get().studyBoosts,boost,'boost deadline survives completion');if(route==='direct')eq([loaded.get().lumen,loaded.get().shards],wallet.slice(0,2),'direct completion does not buy next level');else ok(loaded.get().lumen>=wallet[0]&&loaded.get().shards>=wallet[1],'offline rewards credited without a next-level debit');
}
{
 const x=app(source),q=x.q,s=seed(q);s.longStudyLevels.labcapacity=2;q.set(s);q.startAt('guardmastery',4);q.boost('guardmastery',3,12);q.studyOnly(7);
 const paid=clone(q.get().activeStudies[0]),boost=clone(q.get().studyBoosts.slot4);q.toggleQueue('guardmastery');
 ok(q.startAt('wispascend',4),'explicit replacement starts new project');eq(q.get().pausedStudies[0].remainingSec,paid.remainingSec,'switch saves exact remaining work');eq(q.get().studyBoosts.slot4,boost,'replacement keeps slot boost');ok(q.save(),'save switched project');
 const reloaded=app(source,x.storage).q,oldWallet=[reloaded.get().lumen,reloaded.get().shards,reloaded.get().motes];
 ok(reloaded.startAt('guardmastery',4),'saved project can be selected again');eq(reloaded.get().activeStudies[0],paid,'resume restores exact paid timer and speed');eq([reloaded.get().lumen,reloaded.get().shards,reloaded.get().motes],oldWallet,'resume never pays again');eq(reloaded.get().studyBoosts.slot4,boost,'original wall-clock boost unchanged');
 reloaded.toggleQueue('guardmastery');reloaded.toggleQueue('guardmastery');reloaded.finish(1e6);reloaded.queue();eq(reloaded.get().activeStudies[0].slot,4,'re-enabled queue repeats in original slot');eq(reloaded.get().longStudyLevels.guardmastery,1,'exactly one completion before repeat');
}
{
 const x=app(source),q=x.q;q.set(seed(q));q.startAt('guardmastery',0);const before=clone(q.get());x.fail(true,true);
 eq(q.toggleQueue('guardmastery'),false,'failed persistence rejects toggle');eq(q.get(),before,'failed toggle rolls back whole state');eq(q.toggleQueue('unknown'),false,'unknown queue rejected');
}
console.log(JSON.stringify({status:'pass',checks,mutation,sourceSha256:crypto.createHash('sha256').update(source).digest('hex')}));
