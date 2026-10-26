'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,seed,clone}=require('./lab-expansion-harness.cjs');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8');let checks=0;
function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}function ok(v,m){checks++;assert(v,m);}
let x=app(source),q=x.q,s=seed(q);s.longStudyLevels.labcapacity=2;q.set(s);
ok(q.startAt('guardmastery',3),'start explicitly in slot four');eq(q.get().activeStudies[0].slot,3,'does not pick first free slot');eq(q.get().studySlotProjects[3],'guardmastery','continuation association saved');
ok(q.boost('guardmastery',2,8),'buy slot speed');q.studyOnly(5);const paid=clone(q.get().activeStudies[0]),boost=clone(q.get().studyBoosts.slot3),before=clone(q.get());
ok(q.startAt('wispascend',3),'replace research in occupied slot');eq(q.get().activeStudies.length,1,'only one research in the slot');eq(q.get().activeStudies[0].id,'wispascend','new research runs');eq(q.get().pausedStudies[0].remainingSec,paid.remainingSec,'old paid work kept');eq(q.get().studyBoosts.slot3,boost,'slot speed and expiry kept');eq(q.get().studyQueue.guardmastery,false,'old queue stopped');eq(q.get().studyQueue.wispascend,true,'selected research repeats');
ok(q.clearSlot(3),'Queue OFF clears occupied slot');eq(q.get().activeStudies.length,0,'cleared slot empty');eq(q.get().studySlotProjects[3],null,'cleared assignment');const wallet=clone(q.get());ok(q.startAt('guardmastery',3),'select saved work again');eq(q.get().lumen,wallet.lumen,'no repeated Lumen payment');eq(q.get().shards,wallet.shards,'no repeated Shard payment');eq(q.get().activeStudies[0].remainingSec,paid.remainingSec,'saved work resumes without loss');eq(q.get().studyBoosts.slot3,boost,'original slot timer unchanged');
ok(q.save(),'save replacement');let loaded=app(source,x.storage).q;eq(loaded.get().studySlotProjects,q.get().studySlotProjects,'slot assignment reload');eq(loaded.get().pausedStudies,q.get().pausedStudies,'paid saved work reload');
x=app(source);q=x.q;s=seed(q);s.longStudyLevels.labcapacity=2;q.set(s);q.startAt('guardmastery',2);const snapshot=clone(q.get());x.fail(true,true);eq(q.startAt('wispascend',2),false,'replacement refuses failed persistence');eq(q.get(),snapshot,'failed replacement restores every field');eq(q.clearSlot(2),false,'clear refuses failed persistence');eq(q.get(),snapshot,'failed clear restores every field');
x=app(source);q=x.q;s=seed(q);q.set(s);eq(q.startAt('guardmastery',4),false,'locked slot cannot start');eq(q.startAt('guardmastery',-1),false,'negative slot rejected');eq(q.startAt('guardmastery',7),false,'legacy capacity never creates a new slot');
s=seed(q);s.longStudyLevels.labcapacity=2;q.set(s);q.startAt('guardmastery',4);q.finish(1e9);q.queue();eq(q.get().activeStudies[0].slot,4,'queued next level uses same slot');
const deeds=q.deeds(),extra=deeds.filter(a=>a.counter);eq(extra.length,49,'49 additional fixed milestones');eq(new Set(deeds.map(a=>a.id)).size,deeds.length,'all Deed identities unique');
for(const [track,defs]of [['lab',q.projects()],['forge',q.forgeDefs()]]){
 const maximum=defs.filter(n=>!n.retiredTo&&!n.retired).reduce((sum,n)=>sum+n.levelCap,0);
 for(const deed of extra.filter(a=>a.track===track))ok(deed.target<=maximum,track+' objective remains reachable using only currently purchasable levels: '+deed.target+' / '+maximum);
}
for(const a of extra){const p=q.deedProgress(a,q.get());ok(p&&p.target===a.target,'authoritative progress for '+a.id);}
s=seed(q);s.maxDepthEver=1000;q.set(s);const rewards=extra.filter(a=>a.check(q.get())).reduce((n,a)=>n+a.reward,0);const beforeComets=q.get().comets;q.achievements();const after=q.get().comets;ok(after>=beforeComets+rewards,'new milestones pay fixed rewards');q.achievements();eq(q.get().comets,after,'one-time rewards cannot repeat');ok(q.save(),'milestones save');loaded=app(source,x.storage).q;loaded.achievements();eq(loaded.get().comets,after,'reward receipts survive reload');
console.log(JSON.stringify({status:'pass',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex')}));
