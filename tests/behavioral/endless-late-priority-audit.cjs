'use strict';
// Independent BigInt ledger oracle for the sourced late-player continuation.
const fs=require('node:fs'),z=require('node:zlib'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {integer}=require('./amount-oracle.cjs'),{app,CLOCK}=require('./forge-expansion-harness.cjs');
const [resultFile,originFile,sourceFile]=process.argv.slice(2),raw=fs.readFileSync(resultFile),r=JSON.parse(raw),ob=fs.readFileSync(originFile),origin=JSON.parse(originFile.endsWith('.gz')?z.gunzipSync(ob):ob),source=fs.readFileSync(sourceFile,'utf8'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
let checks=0;function eq(a,b,message){checks++;assert.deepEqual(a,b,message);}
eq(r.status,'MEASURED','whole continuation completes');eq(r.sourceSha256,hash(source),'actual game source');eq(r.originSha256,hash(ob),'exact earned origin');eq(r.originPolicySha256,origin.policySha256,'origin policy remains identified');
const windows=r.windows,sum=field=>windows.reduce((n,w)=>n+integer(w.summary[field]||0),0n),masteries=r.actions.filter(a=>a.kind==='mastery');
eq(windows.reduce((n,w)=>n+w.summary.elapsedSec,0),r.days*86400,'whole requested time');
eq(windows.filter(w=>w.kind==='live').reduce((n,w)=>n+w.summary.elapsedSec,0),r.days*2*600,'two ten-minute visits');
const offline=windows.filter(w=>w.kind==='offline').reduce((n,w)=>n+w.summary.elapsedSec,0);
eq(integer(r.state.totalOfflineSeconds)-integer(origin.state.totalOfflineSeconds),BigInt(offline),'exact cumulative offline accounting');
eq(integer(r.state.totalKills)-integer(origin.state.totalKills),sum('kills'),'exact lifetime victories');
const manual=integer(r.state.ascendCount)-integer(origin.state.ascendCount)-sum('ascends');eq(manual,r.burstPrisms?1n:BigInt(r.days),'explicit manual Ascends outside simulation windows');
const marker="if(document.readyState==='loading'){",instrumented=source.replace(marker,'window.endlessQa={push:enterPushMode};'+marker),x=app(instrumented,undefined,{clockDate:true,retainWrites:false});x.clock(CLOCK+origin.elapsed*1000);x.q.set(origin.state);x.q.endless.push();const before=integer(x.q.get().prisms);x.q.ascend();const manualGain=integer(x.q.get().prisms)-before;
if(r.burstPrisms){
 const rewards=windows.reduce((n,w)=>n+(w.summary.ascendGainRuns?w.summary.ascendGainRuns.reduce((a,run)=>a+integer(run.gain)*integer(run.count),0n):(w.summary.ascendGains||[]).reduce((a,g)=>a+integer(g),0n)),0n);
 eq(origin.state.refundCredits.prisms,[],'fresh earned origin has no restitution credits');eq(r.state.refundCredits.prisms,[],'no invented credits');
 eq(integer(r.state.prisms),integer(origin.state.prisms)+manualGain+rewards-masteries.reduce((n,a)=>n+integer(a.cost.prism),0n),'exact Prism ledger across huge reset count and purchases');
}
eq(integer(r.state.sigils),integer(origin.state.sigils)+sum('sigilsGained')-masteries.reduce((n,a)=>n+integer(a.cost.sigil),0n),'exact Sigil ledger');
for(const id of Object.keys(origin.state.wispMastery)){
 eq(r.state.wispMastery[id]-origin.state.wispMastery[id],masteries.filter(a=>a.id===id).length,'one explicit purchase per rank '+id);
 for(const field of ['heroRarity','wispModules','wispUltimate','recruitmentEntitlements'])eq(r.state[field][id],origin.state[field][id],'retained '+field+'/'+id);
}
eq(r.state.research.masterwork-origin.state.research.masterwork,r.actions.filter(a=>a.kind==='forge').length,'one paid Forge level per purchase');
eq(r.state.nodes,origin.state.nodes,'Tree retained across unrestricted Ascends');
assert(r.history.some(h=>h.rift>r.originRecord));checks++;
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:r.sourceSha256,inputSha256:hash(raw),originSha256:r.originSha256,originPolicySha256:r.originPolicySha256,policySha256:r.policySha256,manualAscends:String(manual),automaticAscends:String(sum('ascends')),masteryPurchases:masteries.length,limits:'Independent integer conservation, per-rank purchase counts, retention and complete clock windows. Manual Prism reward is quoted from separately regression-tested production reward code. No fresh-campaign or device acceptance inferred.'}));
