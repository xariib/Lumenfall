'use strict';
// Player follows production advice. No injected goals, grants, prices or gates.
const fs=require('node:fs'),z=require('node:zlib'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {app,CLOCK}=require('./forge-expansion-harness.cjs'),A=require('../../scripts/lib/game-amount.cjs');
const [file,originFile,daysText,out,sessionsText='2',activeText='600']=process.argv.slice(2),days=Number(daysText),sessions=Number(sessionsText),active=Number(activeText);
assert(file&&originFile&&out&&Number.isInteger(days)&&days>0&&days<=90&&[2,3,6].includes(sessions)&&active>=120);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),raw=fs.readFileSync(originFile),c=JSON.parse(originFile.endsWith('.gz')?z.gunzipSync(raw):raw),source=fs.readFileSync(file,'utf8'),sourceSha256=hash(source);
const policySha256=hash(Buffer.concat([fs.readFileSync(__filename),fs.readFileSync(require.resolve('./forge-expansion-harness.cjs')),fs.readFileSync(require.resolve('../../scripts/lib/game-amount.cjs')),Buffer.from(JSON.stringify({sessions,active}))]));
const marker="if(document.readyState==='loading'){",bridge=`window.endlessQa={advice:latePowerAdvice,best:fieldBestNowFormation,push:enterPushMode,farm:enterFarmMode,eligible:ascendEligible,mastery:buyWispMastery,plan:getWispMasteryPlan,speed:activateStudyBoost,wisps:function(){return SPIRITS;},node:function(){return NODES.find(function(n){return n.id==='swift';});},buyNode:buyNode,auto:function(on){if(on)setAutoAscendClearedTarget('15');state.autoAscendEnabled=on;}};`;
assert.equal(source.split(marker).length,2);const x=app(source.replace(marker,bridge+marker),undefined,{clockDate:true,retainWrites:false}),q=x.q,b=q.endless;
let elapsed=c.elapsed,lastRecord=c.state.maxDepthEver,lastRecordAt=elapsed;const origin=JSON.parse(JSON.stringify(c.state)),history=[],actions=[],windows=[],gaps=[];const began=performance.now();
x.clock(CLOCK+elapsed*1000);q.set(c.state);assert(b.advice(),'earned developed roster supports advice');
function advance(seconds,kind){const start=CLOCK+elapsed*1000;x.clock(start);const cursor=q.advance(seconds,{kind,clockStartMs:start,offlineWindowStartMs:start,resumable:true});let step;do{step=cursor.next();}while(!step.done);assert.equal(step.value.elapsedSec,seconds);elapsed+=seconds;x.clock(CLOCK+elapsed*1000);if(kind==='offline'){q.get().totalOfflineSeconds=A.add(q.get().totalOfflineSeconds,seconds);q.achievements();}windows.push({at:elapsed,kind,summary:step.value});if(q.get().maxDepthEver>lastRecord){gaps.push({seconds:elapsed-lastRecordAt,from:lastRecord,to:q.get().maxDepthEver});lastRecord=q.get().maxDepthEver;lastRecordAt=elapsed;}}
function follow(){
 const g=b.advice(),s=q.get();assert(g);
 // This is the explicit Lab queue advice, not a cancellation of paid work.
 if(s.longStudyLevels.wispascend>=g.labTarget)s.studyQueue.wispascend=false;
 const event={at:elapsed,kind:g.kind,id:g.id,title:g.title};
 if(g.kind==='MASTERY READY'){const sp=b.wisps().find(sp=>sp.id===g.id);event.cost=b.plan(sp).cost;assert(b.mastery(sp));}
 else if(g.kind==='REBUILD'){
  if(!s.spirits[g.id]){event.cost={lumen:q.empowerCost(g.id)};assert(q.empower(g.id));}
  else {for(const id of s.activeParty)s.empowerQueue[id]=true;event.queues=[...s.activeParty];}
 }else if(g.kind==='FORGE POWER'){event.cost=q.plan('masterwork',1).cost;assert(q.buy('masterwork',1));}
 else if(g.kind==='RETURN TO PUSH'){b.auto(false);b.push();b.best();}
 else if(g.kind==='FARM PRISMS'){
  // Check funding every minute of this visit, then follow RETURN TO PUSH.
  if(b.eligible()&&!s.autoAscendEnabled){event.manual=true;event.prismsBefore=s.prisms;assert(q.ascend());event.prismsAfter=q.get().prisms;}
  b.auto(true);
 }else if(g.kind==='MASTERY PATH'){
  if(g.id==='lab'){event.started=q.startStudy('wispascend');if(!event.started)return false;}
  else if(g.id==='forge'){if(!q.plan('masterwork',1).affordable)return false;event.cost=q.plan('masterwork',1).cost;assert(q.buy('masterwork',1));}
  else if(g.id==='tree'){if(!b.buyNode(b.node()))return false;}
 }else if(g.kind==='LAB SPEED'){
  if(!g.affordable)return false;event.cost={motes:g.boost.cost};const before=q.get().motes;assert(b.speed('wispascend',g.boost.mult,g.boost.hours));assert.equal(A.cmp(A.exactSub(before,q.get().motes),g.boost.cost),0,'exact paid speed debit');
 }else if(g.kind==='PUSH'){b.best();b.push();return false;}
 else if(g.kind==='FARM SIGILS'){b.push();return false;}
 else return false;
 actions.push(event);return g.kind!=='FARM PRISMS';
}
for(let day=0;day<days;day++){
 for(let visit=0;visit<sessions;visit++){
  // One considered action per 30 seconds, including navigation and purchases.
  for(let t=0;t<active;t+=30){follow();advance(Math.min(30,active-t),'live');}
  advance(86400/sessions-active,'offline');
 }
 const s=q.get();history.push({day:elapsed/86400,elapsed,rift:s.maxDepthEver,lab:s.longStudyLevels.wispascend,forge:s.research.masterwork,mastery:{...s.wispMastery}});
 fs.writeFileSync(out,JSON.stringify({status:'MEASURED_PARTIAL',sourceSha256,originSha256:hash(raw),originSourceSha256:c.sourceSha256,originPolicySha256:c.policySha256,policySha256,history,actions,windows,state:s}));
 console.log(JSON.stringify(history[history.length-1]));
}
const openGap=elapsed-lastRecordAt,maxGap=Math.max(openGap,...gaps.map(g=>g.seconds)),s=q.get();
for(const id of Object.keys(origin.wispMastery)){assert(s.wispMastery[id]>=origin.wispMastery[id]);for(const key of ['heroRarity','wispModules','wispUltimate','recruitmentEntitlements'])assert.equal(s[key][id],origin[key][id]);}
const result={status:'MEASURED',sourceSha256,originSha256:hash(raw),originSourceSha256:c.sourceSha256,originPolicySha256:c.policySha256,policySha256,visitsPerDay:sessions,activeSecondsPerVisit:active,days,originElapsed:c.elapsed,originRecord:origin.maxDepthEver,maxObservedGapDays:maxGap/86400,openRecordGapDays:openGap/86400,gaps,history,actions,windows,state:s,wallMs:performance.now()-began};
fs.writeFileSync(out,JSON.stringify(result));console.log(JSON.stringify({status:result.status,record:s.maxDepthEver,maxObservedGapDays:result.maxObservedGapDays,wallMs:result.wallMs}));
assert(maxGap<=5*86400,'working late-wall benchmark: no observed record gap over five days');
