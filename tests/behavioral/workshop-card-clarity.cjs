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
for(const mode of ['direct','offline']){
 const legacy=seed(q);legacy.studyQueue.guardmastery=false;legacy.activeStudies=[{id:'guardmastery',slot:0,totalDurationSec:150,remainingSec:.5,speedMult:2}];q.set(legacy);
 if(mode==='direct')q.finish(1);else q.advance(1,{kind:'offline',visual:false,clockStartMs:2000000000000,offlineWindowStartMs:2000000000000});
 eq(q.get().longStudyLevels.guardmastery,1,mode+' completion earns the paid level');eq(q.get().studySlotProjects[0],null,mode+' non-repeating completion clears its assignment');
 eq(q.accept(clone(q.get())),q.get(),mode+' completed state is already canonical without a reload');
}
const waiting=seed(q);waiting.longStudyLevels.guardmastery=1;waiting.studyQueue.guardmastery=true;waiting.studySlotProjects[0]='guardmastery';waiting.lumen=800;waiting.shards=80;q.set(waiting);
const waitingFault=app(source);waitingFault.q.set(waiting);const waitingBefore=clone(waitingFault.q.get());waitingFault.fail(true,true);
eq(waitingFault.q.startAt('wispascend',0),false,'failed save blocks waiting replacement');eq(waitingFault.q.get(),waitingBefore,'failed waiting replacement restores intent and wallets');
eq(waitingFault.q.clearSlot(0),false,'failed save blocks waiting clear');eq(waitingFault.q.get(),waitingBefore,'failed waiting clear restores complete state');
ok(q.startAt('wispascend',0),'replace a waiting slot with affordable research');eq(q.get().studyQueue.guardmastery,false,'replacement disables the old waiting queue');eq(q.get().studyQueue.wispascend,true,'new selected queue stays on');
eq(q.get().lumen,0,'waiting replacement pays only the new Lumen price');eq(q.get().shards,0,'waiting replacement pays only the new Shard price');
q.get().lumen=q.get().shards=1e9;q.queue();ok(!q.get().activeStudies.some(a=>a.id==='guardmastery'),'old waiting research cannot restart in another free slot');
q.set(waiting);ok(q.clearSlot(0),'Queue OFF clears a waiting slot');eq(q.get().studySlotProjects[0],null,'waiting assignment cleared');eq(q.get().studyQueue.guardmastery,false,'waiting queue disabled');eq(q.get().lumen,800,'clearing unpaid waiting work never spends Lumen');
ok(q.save(),'cleared waiting slot saves');loaded=app(source,x.storage).q;eq(loaded.get().studySlotProjects[0],null,'waiting clear survives reload');eq(loaded.get().studyQueue.guardmastery,false,'waiting queue stays off after reload');
const deeds=q.deeds(),extra=deeds.filter(a=>a.counter);eq(extra.length,49,'49 additional fixed milestones');eq(new Set(deeds.map(a=>a.id)).size,deeds.length,'all Deed identities unique');
for(const [track,defs]of [['lab',q.projects()],['forge',q.forgeDefs()]]){
 const maximum=defs.filter(n=>!n.retiredTo&&!n.retired).reduce((sum,n)=>sum+n.levelCap,0);
 for(const deed of extra.filter(a=>a.track===track))ok(deed.target<=maximum,track+' objective remains reachable using only currently purchasable levels: '+deed.target+' / '+maximum);
}
for(const a of extra){const p=q.deedProgress(a,q.get());ok(p&&p.target===a.target,'authoritative progress for '+a.id);}
s=seed(q);s.maxDepthEver=1000;q.set(s);const rewards=extra.filter(a=>a.check(q.get())).reduce((n,a)=>n+a.reward,0);const beforeComets=q.get().comets;q.achievements();const after=q.get().comets;ok(after>=beforeComets+rewards,'new milestones pay fixed rewards');q.achievements();eq(q.get().comets,after,'one-time rewards cannot repeat');ok(q.save(),'milestones save');loaded=app(source,x.storage).q;loaded.achievements();eq(loaded.get().comets,after,'reward receipts survive reload');
for(const depth of [1,14,15,25,39,40,59,60,90])for(const apparatus of [0,1,2]){
 const initial=seed(q);initial.maxDepthEver=depth;initial.longStudyLevels.labcapacity=apparatus;q.set(initial);const slots=q.slots();
 for(let slot=slots;slot<5;slot++){
  q.set(initial);const hint=q.slotHint(slot),expansion=/^Expanded Apparatus ([12])/.exec(hint);
  if(expansion){
   const rank=Number(expansion[1])-1,goals=rank?[300,100,150,10]:[150,25,60,6],labels=['Rift','Ascends','Lab levels','Different studies'];
   labels.forEach((label,i)=>ok(hint.includes(label+' '+(i===0?depth:0)+'/'+goals[i]),'locked expansion shows actual current/required '+label));
   const fulfilled=require('./lab-longtail-reference.cjs').capacityReady(clone(initial),rank);fulfilled.longStudyLevels.labcapacity=rank;q.set(fulfilled);
   const plan=q.plan('labcapacity');ok(plan.affordable,'fulfilling displayed goals permits the expansion');
   ok(q.slots()<=slot,'goals alone do not grant an unpaid expansion');ok(q.start('labcapacity'),'displayed expansion can actually start');
   ok(q.slots()<=slot,'starting expansion does not grant its slot early');q.finish(plan.duration);
   ok(q.slots()>slot,'completing displayed expansion unlocks the slot');continue;
  }
  const rift=/Rift (\d+)/.exec(hint),level=/level (\d+)/.exec(hint);
  const requiredDepth=rift?Number(rift[1]):depth,requiredLevel=level?Number(level[1]):apparatus;
  ok(requiredDepth>depth||requiredLevel>apparatus,'locked slot never names requirements already met: '+depth+'/'+apparatus+'/'+slot+' '+hint);
  const fulfilled=clone(initial);fulfilled.maxDepthEver=Math.max(depth,requiredDepth);fulfilled.longStudyLevels.labcapacity=Math.max(apparatus,requiredLevel);q.set(fulfilled);
  ok(q.slots()>slot,'fulfilling the displayed requirements really unlocks the slot: '+hint);
 }
}
console.log(JSON.stringify({status:'pass',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex')}));
