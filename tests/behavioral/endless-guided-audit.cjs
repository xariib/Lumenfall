'use strict';
const fs=require('node:fs'),z=require('node:zlib'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {integer}=require('./amount-oracle.cjs');
const [resultFile,originFile,sourceFile]=process.argv.slice(2),raw=fs.readFileSync(resultFile),r=JSON.parse(raw),ob=fs.readFileSync(originFile),decoded=originFile.endsWith('.gz')?z.gunzipSync(ob):ob,c=JSON.parse(decoded),origin=c.state,hash=b=>crypto.createHash('sha256').update(b).digest('hex');let checks=0;
function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}function ok(a,m){checks++;assert(a,m);}
eq(r.status,'MEASURED','whole campaign completes');eq(r.sourceSha256,hash(fs.readFileSync(sourceFile)),'actual source');eq(r.originSha256,hash(decoded),'exact earned input bytes (decompress transport archive)');eq(r.originSourceSha256,c.sourceSha256,'old source stays identified');eq(r.originPolicySha256,c.policySha256,'old policy stays identified');
eq(r.windows.reduce((n,w)=>n+w.summary.elapsedSec,0),r.days*86400,'whole elapsed time');
let timeline=c.elapsed;for(const w of r.windows){timeline+=w.summary.elapsedSec;eq(w.at,timeline,'chronological window endpoint');}
const offline=r.windows.filter(w=>w.kind==='offline').reduce((n,w)=>n+w.summary.elapsedSec,0);eq(r.windows.filter(w=>w.kind==='live').reduce((n,w)=>n+w.summary.elapsedSec,0),r.days*r.visitsPerDay*r.activeSecondsPerVisit,'regular visit time');eq(integer(r.state.totalOfflineSeconds)-integer(origin.totalOfflineSeconds),BigInt(offline),'exact offline lifetime accounting');
const sum=key=>r.windows.reduce((n,w)=>n+integer(w.summary[key]||0),0n),paid=r.actions.filter(a=>a.kind==='MASTERY READY'),manual=r.actions.filter(a=>a.manual);
eq(integer(r.state.totalKills)-integer(origin.totalKills),sum('kills'),'exact lifetime kills');eq(integer(r.state.ascendCount)-integer(origin.ascendCount),sum('ascends')+BigInt(manual.length),'every Ascend counted');
eq(origin.refundCredits.prisms,[],'origin no synthetic credits');eq(r.state.refundCredits.prisms,[],'no granted credits');
const rewards=r.windows.reduce((n,w)=>n+(w.summary.ascendGainRuns?w.summary.ascendGainRuns.reduce((a,run)=>a+integer(run.gain)*integer(run.count),0n):(w.summary.ascendGains||[]).reduce((a,g)=>a+integer(g),0n)),0n);
const manualGain=manual.reduce((n,a)=>n+integer(a.prismsAfter)-integer(a.prismsBefore),0n);
eq(integer(r.state.prisms),integer(origin.prisms)+rewards+manualGain-paid.reduce((n,a)=>n+integer(a.cost.prism),0n),'exact Prism ledger');
eq(integer(r.state.sigils),integer(origin.sigils)+sum('sigilsGained')-paid.reduce((n,a)=>n+integer(a.cost.sigil),0n),'exact Sigil ledger');
const speeds=r.actions.filter(a=>a.kind==='LAB SPEED'),catalysis=origin.longStudyLevels.catalysis||0;
eq(r.state.longStudyLevels.catalysis||0,catalysis,'speed discount unchanged during these campaigns');
for(const a of speeds)ok([27500,74250].map(n=>BigInt(Math.ceil(n*(100-2*catalysis)/100))).includes(integer(a.cost.motes)),'independent8x8h/24h earned speed price');
const manualDust=manual.reduce((n,a)=>{const gain=integer(a.prismsAfter)-integer(a.prismsBefore);ok(Number.isSafeInteger(a.prismsAfter-a.prismsBefore),'native manual reward fixture for independent Dust oracle');return n+(gain/20n<10n?gain/20n:10n)*BigInt(origin.nodes.stardust||0);},0n);
eq(integer(r.state.motes),integer(origin.motes)+sum('motesGained')+manualDust-sum('studyMotesSpent')-speeds.reduce((n,a)=>n+integer(a.cost.motes),0n),'exact Mote ledger including earned speed and Ascension Dust');
for(const id of Object.keys(origin.wispMastery)){
 const purchases=paid.filter(a=>a.id===id);eq(r.state.wispMastery[id]-origin.wispMastery[id],purchases.length,'explicit rank purchases '+id);
 for(const [i,p]of purchases.entries()){const rank=origin.wispMastery[id]+i;eq(integer(p.cost.prism),20000n+1000n*BigInt(rank),'independent Prism price');eq(integer(p.cost.sigil),500000n+50000n*BigInt(rank),'independent Sigil price');}
 for(const key of ['heroRarity','wispModules','wispUltimate','recruitmentEntitlements'])eq(r.state[key][id],origin[key][id],'permanent retention '+key+'/'+id);
}
for(const key of ['nodes','research','longStudyLevels'])for(const id of Object.keys(origin[key]))ok(integer(r.state[key][id])>=integer(origin[key][id]),'permanent path retained '+key+'/'+id);
eq(r.state.owned,origin.owned,'paid entitlements retained');
// Field Best now intentionally autosaves the selected preset. The existing
// Formation contract protects every other preset, not the selected destination.
for(const id of Object.keys(origin.formationPresets))if(id!==origin.activeFormationPreset)eq(r.state.formationPresets[id],origin.formationPresets[id],'unselected Formation preset retained '+id);
eq(r.history.length,r.days,'every whole day');for(let i=0;i<r.history.length;i++){const row=r.history[i];eq(row.elapsed,c.elapsed+(i+1)*86400,'whole chronological day');ok(row.rift>r.originRecord,'record above old plateau');if(i)ok(row.rift>=r.history[i-1].rift,'record never falls');}
let prior=r.originRecord,at=c.elapsed,max=0;for(const g of r.gaps){eq(g.from,prior,'contiguous record log');ok(g.to>g.from,'new record');max=Math.max(max,g.seconds);at+=g.seconds;prior=g.to;}const elapsed=c.elapsed+r.days*86400,open=elapsed-at;eq(r.openRecordGapDays,open/86400,'open gap cannot disappear');eq(r.maxObservedGapDays,Math.max(max,open)/86400,'maximum includes open gap');ok(r.maxObservedGapDays<=5,'five-day working benchmark');
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:r.sourceSha256,inputSha256:hash(raw),originSha256:hash(ob),policySha256:r.policySha256,days:r.days,record:r.state.maxDepthEver,maxObservedGapDays:r.maxObservedGapDays,masteryPurchases:paid.length,limits:'Earned-save continuation and exact integer ledger/retention/clock audit, not fresh full-campaign, human or Android acceptance.'}));
