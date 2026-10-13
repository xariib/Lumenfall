#!/usr/bin/env node
'use strict';
// Exact adapter functions and original scenario seeds, complete production IIFE.
// This is a transaction-boundary witness; it is not a browser/scenario PASS.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const repo='/workspace/scratch/0848c4e4f365/Lumenfall-tree',out=__dirname,head='3c931a26bbcf7b009dee03e7411ed41faeb971f8';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const original=file=>cp.execFileSync('git',['show',head+':'+file],{cwd:repo});
const source=fs.readFileSync(path.join(repo,'index.html'),'utf8');
const beforeBridge=fs.readFileSync(path.join(out,'bridge-before.js'),'utf8'),afterBridge=fs.readFileSync(path.join(repo,'tests/behavioral/bridge.js'),'utf8');
const oldLine='    buy: function(id){ buySpirit(SPIRITS.find(function(sp){return sp.id===id;})); },';
const newLines='    buy: function(id){\n      var previousReload=reloadInProgress;\n      reloadInProgress=false;\n      try { return buySpirit(SPIRITS.find(function(sp){return sp.id===id;})); }\n      finally { reloadInProgress=previousReload; }\n    },';
assert.equal(sha(source),'ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3');
assert.equal(sha(beforeBridge),'8568cfb994b0a6c4c1c2bded8f2946a6489b18591992e58d534f483f5cb287c1');
assert.equal(beforeBridge.split(oldLine).length,2);
assert.equal(afterBridge,beforeBridge.replace(oldLine,newLines),'only the authorized formationTest.buy member changes');
fs.writeFileSync(path.join(out,'bridge-after.js'),afterBridge);
const harness=fs.readFileSync(path.join(out,'tree-expansion-harness.cjs'));
assert.equal(sha(harness),'bcf080ce494ee1a2df450241dbd6a087fb6880239c3d2e711d1d2116f4ce3463');
const {app,clone,P,R,CLOCK}=require('./tree-expansion-harness.cjs');
function member(text,name,next,indent='  '){const p=text.indexOf(indent+name+': function('),end=text.indexOf('\n'+indent+next+':',p);assert(p>=0&&end>p,name+' exact member anchors');const raw=text.slice(p,end),value=raw.slice(raw.indexOf('function(')).trim();assert(value.endsWith(','));return value.slice(0,-1);}
const oldBuy=oldLine.slice(oldLine.indexOf('function('),-1),fixedBuy=newLines.slice(newLines.indexOf('function('),-1);
const manual=member(afterBridge,'ascendManual','bossRetreatGraceSec'),setState=member(afterBridge,'setState','applyFormationPreset'),getState=member(afterBridge,'getState','getFlags');
const comet=afterBridge.match(/tab:activateTab,ascend:(function\(\)\{doAscend\(false\);\}),queue:/)[1];
const hooks=`
  var adapterCalls=[],adapterAttempts=[],adapterAscends=[];
  var originalAuditBuy=buySpirit,originalAuditSave=localStorage.setItem,originalAuditAscend=doAscend;
  buySpirit=function(sp){var row={id:sp&&sp.id,reloadAtEntry:reloadInProgress},value;adapterCalls.push(row);try{value=originalAuditBuy.apply(this,arguments);row.result=value;return value;}catch(e){row.error=String(e);throw e;}};
  localStorage.setItem=function(key,value){var row={key:key,value:String(value),success:false};adapterAttempts.push(row);try{var result=originalAuditSave.apply(this,arguments);row.success=true;return result;}catch(e){row.error=String(e);throw e;}};
  doAscend=function(){var row={reloadAtEntry:reloadInProgress},value;adapterAscends.push(row);value=originalAuditAscend.apply(this,arguments);row.result=value;return value;};
  window.qa.audit={oldBuy:${oldBuy},fixedBuy:${fixedBuy},manual:${manual},setState:${setState},getState:${getState},cometAscend:${comet},
    reload:function(value){if(value!==undefined)reloadInProgress=value;return reloadInProgress;},
    calls:function(){return adapterCalls;},attempts:function(){return adapterAttempts;},ascends:function(){return adapterAscends;},
    bonds:function(){return FORMATION_BONDS;},activeBonds:function(){return activeFormationBonds();}
  };
`;
fs.writeFileSync(path.join(out,'exact-adapter-hooks.js'),hooks);
const instrumented=source.replace("if(document.readyState==='loading'){","if(document.readyState==='loading'){"+hooks);
assert.equal(source.split("if(document.readyState==='loading'){").length,2);
const window={},modules=[];
for(const name of ['support-stacking.js','formation.js','rift-status.js']){const file='tests/behavioral/'+name,b=original(file);new Function('window',b.toString())(window);modules.push({path:file,sha256:sha(b),bytes:b.length});}
const newNodes=['swiftcharter','lumenmemory','veteranrecruits','rosterrecall','chargememory','supportmemory','phasememory','riftstep','frontier','stardust','gentlegrowth','formationseat','benchmentor','empowerbatch','wallwisdom','invitations','recruitreserve'];
function zero(q){newNodes.forEach(id=>assert.equal(q.get().nodes[id],0,id+' remains default0'));assert.equal(q.get().treeTrainingProgress,0);}
function sb(q){return {freshStateSnapshot:q.fresh,enemyHpFor:q.enemyHp,currentDay:q.day,forge:{deeds:()=>({items:q.achievementDefs()})},riftStatus:{bonds:q.audit.bonds}};}
function fields(s){return Object.fromEntries(['lumen','shards','prisms','comets','spirits','activeParty','formationRebuild','nodes','longStudyLevels','supportBuffs','owned','achieved'].map(k=>[k,clone(s[k])]));}
function attemptRows(rows){return rows.map(r=>({key:r.key,bytes:Buffer.byteLength(r.value),sha256:sha(r.value),success:r.success,error:r.error||null}));}
function setup(family,reload=true){
  const a=app(instrumented),q=a.q,b=sb(q),ctx={currentDay:q.day};let seed,id,expectedCost;
  q.audit.reload(true);
  if(family==='support'){
    a.clock(CLOCK+.375);seed=window.supportStackSeed(b,ctx,['tide','aurora']);q.audit.setState(seed);q.cast('tide','live',a.clock());q.cast('aurora','live',a.clock());id='tide';expectedCost=60;
  }else if(family==='rift-status'){
    seed=window.riftStatusSeed(b,ctx);seed.activeParty=window.riftStatusWorst(b,ctx).ids;seed.activeParty.forEach(id=>seed.spirits[id]=2);q.audit.setState(seed);id='void';expectedCost=70000;
  }else{
    seed=window.p207Seed(b,['stone','ember','tide'],'boss');q.audit.setState(seed);id='tide';expectedCost=60;
  }
  const originalSeed=clone(seed),reset=q.audit.manual();assert.equal(q.audit.ascends().at(-1).result,true);assert.equal(q.audit.reload(),true);
  const funded=q.audit.getState();funded.lumen=family==='support'?1e8:family==='rift-status'?3000000:60;q.audit.setState(funded);zero(q);
  assert.equal(q.spiritCost(id),expectedCost);assert.equal(q.get().spirits[id],0);
  // Commit this exact funded synthetic boundary once so the primary/recovery
  // fault controls have an explicit cold-load baseline. It changes no price,
  // gameplay field or original seeded level; the browser UI is not simulated.
  q.audit.reload(false);assert.equal(q.save(),true);q.audit.reload(reload);
  return {a,id,expectedCost,originalSeed,reset,fundedBoundary:q.audit.getState()};
}
function invoke(set,method){
  const {a,id}=set,q=a.q,before=q.audit.getState(),live=q.get(),guard=q.audit.reload(),n=a.writes.length,c=q.audit.calls().length,at=q.audit.attempts().length;
  const beforeSnapshot=clone(before),primary=a.storage.get(P),recovery=a.storage.get(R),ret=q.audit[method](id),after=q.audit.getState();
  assert.deepEqual(before,beforeSnapshot,'getState returns a detached before snapshot');
  assert.equal(q.audit.reload(),guard,'adapter restores prior reload flag');
  const record={method,id,cost:set.expectedCost,before,after,guardBefore:guard,guardAfter:q.audit.reload(),adapterReturnType:typeof ret,adapterReturn:ret===undefined?null:ret,actualCalls:clone(q.audit.calls().slice(c)),attempts:attemptRows(q.audit.attempts().slice(at)),successfulWrites:a.writes.slice(n).map(w=>({key:w.key,bytes:Buffer.byteLength(w.value),sha256:sha(w.value)})),actualDebit:before.lumen-after.lumen,levelDelta:after.spirits[id]-before.spirits[id],stateIdentityReplaced:q.get()!==live,beforeSnapshotUnchanged:true,primaryChanged:a.storage.get(P)!==primary,recoveryChanged:a.storage.get(R)!==recovery};
  return record;
}
function endpointChecks(set,record){
  const {a}=set,q=a.q,at=q.audit.attempts().length,backup=q.export(),decoded=q.decode(backup),cold=app(instrumented,[...a.storage]);
  assert.deepEqual(fields(decoded),fields(record.after),'actual backup exports transaction endpoint');
  assert.deepEqual(fields(cold.q.get()),fields(record.after),'actual cold load matches transaction endpoint');
  record.backup={bytes:Buffer.byteLength(backup),sha256:sha(backup),fields:fields(decoded),attempts:attemptRows(q.audit.attempts().slice(at))};record.coldReload=fields(cold.q.get());
}
const records=[];
for(const family of ['support','rift-status','formation'])for(const method of ['oldBuy','fixedBuy']){
  const set=setup(family,true),r=invoke(set,method),success=method==='fixedBuy';
  assert.equal(r.actualCalls.length,1);assert.equal(r.actualCalls[0].result,success);assert.equal(r.actualCalls[0].reloadAtEntry,!success);
  assert.equal(r.actualDebit,success?set.expectedCost:0);assert.equal(r.levelDelta,success?1:0);assert.equal(r.successfulWrites.length,success?2:0);
  assert.equal(r.attempts.length,success?2:0);endpointChecks(set,r);records.push({kind:'original-scenario-boundary',family,originalSeed:set.originalSeed,...r});
}
for(const reload of [false,true])for(const fault of ['none','primary','recovery']){
  const set=setup('formation',reload),a=set.a;a.fail(fault==='primary',fault==='recovery');
  const r=invoke(set,'fixedBuy'),success=fault!=='primary';
  assert.equal(r.actualCalls[0].reloadAtEntry,false);assert.equal(r.actualCalls[0].result,success);assert.equal(r.adapterReturn,success);
  assert.equal(r.actualDebit,success?60:0);assert.equal(r.levelDelta,success?1:0);
  assert.equal(r.attempts.length,fault==='primary'?1:2);assert.equal(r.successfulWrites.length,fault==='primary'?0:fault==='recovery'?1:2);
  if(!success)assert.deepEqual(r.after,r.before,'primary failure restores entire live state');
  endpointChecks(set,r);
  if(fault!=='none'){
    a.fail(false,false);const retry=invoke(set,'fixedBuy');r.recoveredRetry=retry;
    assert.equal(retry.actualCalls[0].result,fault==='primary');
    assert.equal(a.q.get().spirits.tide,1,'retry cannot duplicate level after primary success');assert.equal(a.q.get().lumen,0);
    assert.equal(retry.actualDebit,fault==='primary'?60:0);assert.equal(retry.guardAfter,reload);endpointChecks(set,retry);
  }
  records.push({kind:'guard-and-storage-control',reload,fault,...r});
}
// The old direct adapter itself remains valid when no QA reload is held.
{
  const set=setup('formation',false),r=invoke(set,'oldBuy');assert.equal(r.actualCalls[0].result,true);assert.equal(r.actualDebit,60);assert.equal(r.levelDelta,1);records.push({kind:'old-adapter-unblocked-control',...r});
}
const cometRecords=[];
for(const reload of [false,true]){
  const a=app(instrumented),q=a.q,s=q.fresh();s.depth=16;s.enemyDepth=16;s.enemyHp=s.enemyMaxHp=q.enemyHp(16);s.maxDepthEver=101;s.comets=1000;s.autoAscendEnabled=false;s.owned={autoascend:true,comettrials:true,rifttrail:true,starfallcrest:true};s.cometCosmetics={trail:true,crest:true};
  q.audit.setState(s);assert.equal(q.save(),true);q.audit.reload(reload);const before=q.audit.getState(),n=a.writes.length,c=q.audit.ascends().length,ret=q.audit.cometAscend(),after=q.audit.getState(),calls=clone(q.audit.ascends().slice(c));
  assert.equal(calls.length,1);assert.equal(calls[0].result,!reload);assert.equal(after.ascendCount-before.ascendCount,reload?0:1);assert.equal(q.audit.reload(),reload);assert.deepEqual(after.owned,before.owned);assert.deepEqual(after.cometCosmetics,before.cometCosmetics);
  cometRecords.push({kind:'unused-comet-adapter-probe',reload,before,after,adapterReturnType:typeof ret,actualCalls:calls,successfulWrites:a.writes.slice(n).map(w=>({key:w.key,sha256:sha(w.value)})),note:'No active caller of bridge.comet.ascend found in existing test source; the core test uses its own direct applyAscendMutation facade.'});
}
const rawRoot='/workspace/scratch/0848c4e4f365/tree-ci/scroll-diagnostic/third/artifact/tree-scroll-diagnostic',rawBase=path.join(rawRoot,'full-failed-rerun'),rawReceipt=JSON.parse(fs.readFileSync(path.join(rawBase,'receipt.json'),'utf8'));
const rawRows=[];
for(const name of ['support-stacking','rift-status-contract','p2-07a-formation-reconstruction']){
  const base=path.join(rawBase,name,'raw'),dir=fs.readdirSync(base)[0],domPath=path.join(base,dir,'stdout.html'),dom=fs.readFileSync(domPath),text=dom.toString();
  const match=[...text.matchAll(/<pre\b[^>]*id="qa-result"[^>]*>([\s\S]*?)<\/pre>/g)].at(-1);assert(match);const raw=match[1],decoded=raw.replace(/&(amp|lt|gt|quot|#39);/g,(_,name)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"})[name]),qa=JSON.parse(decoded);
  const processPath=path.join(base,dir,'process.json'),processBytes=fs.readFileSync(processPath),process=JSON.parse(processBytes);
  assert.equal(qa.status,'fail');assert.equal(process.process.exitcode,0);assert.equal(process.process.timed_out,false);assert.deepEqual(qa.runtimeErrors,[]);assert(text.includes(oldLine));
  const output=name+'.qa-result.htmltext';fs.writeFileSync(path.join(out,output),raw);fs.writeFileSync(path.join(out,name+'.process.json'),processBytes);
  rawRows.push({name,dom:{path:domPath,bytes:dom.length,sha256:sha(dom)},process:{path:processPath,bytes:processBytes.length,sha256:sha(processBytes)},originalQaText:{path:output,bytes:Buffer.byteLength(raw),sha256:sha(raw)},qa,commandReceipt:rawReceipt.rows.find(r=>r.scenario===name),containsExactOldBuyAdapter:true});
}
const identity={localHead:head,diagnosticCommit:fs.readFileSync(path.join(rawRoot,'commit.txt'),'utf8').trim(),diagnosticTree:fs.readFileSync(path.join(rawRoot,'tree.txt'),'utf8').trim(),sourceSha256:sha(source),beforeBridgeSha256:sha(beforeBridge),afterBridgeSha256:sha(afterBridge),harnessSha256:sha(harness),testSha256:sha(fs.readFileSync(__filename)),hooksSha256:sha(hooks),modules,node:process.version,v8:process.versions.v8,rawReceiptSha256:sha(fs.readFileSync(path.join(rawBase,'receipt.json')))};
const result={status:'SCOPED_TRANSACTION_BOUNDARIES_PASS',scope:'Exact three original recruitment boundaries plus guard/storage controls. No browser or full scenario PASS claimed.',identity,records:records.length,scenarioPairs:3,storageAndGuardControls:6,oldUnblockedControl:1,cometReadOnlyProbes:2,allNewTreeNodesAndTrainingZero:true,rows:records.map(r=>({kind:r.kind,family:r.family||null,method:r.method,reload:r.guardBefore,fault:r.fault||'none',actualReturn:r.actualCalls[0].result,actualDebit:r.actualDebit,levelDelta:r.levelDelta,successfulWrites:r.successfulWrites.length,attempts:r.attempts.length,guardRestored:r.guardBefore===r.guardAfter,beforeSnapshotUnchanged:r.beforeSnapshotUnchanged,recoveredRetry:r.recoveredRetry?{actualReturn:r.recoveredRetry.actualCalls[0].result,debit:r.recoveredRetry.actualDebit,level:r.recoveredRetry.after.spirits.tide}:null})),rawFailures:rawRows.map(r=>({name:r.name,assertion:typeof r.qa.detail==='string'?r.qa.detail:r.qa.detail.message,dom:r.dom})),comet:cometRecords.map(r=>({reload:r.reload,actualReturn:r.actualCalls[0].result,ascends:r.after.ascendCount-r.before.ascendCount,successfulWrites:r.successfulWrites.length,activeCallerFound:false}))};
fs.writeFileSync(path.join(out,'witnesses.json'),JSON.stringify({identity,setupNote:'Original complete seed functions and actual Ascend produce each funded boundary. A single explicit baseline save is made for fault/cold-load controls, without changing game fields. No browser DOM or later scenario assertions execute here.',records,cometRecords,rawRows},null,2)+'\n');
fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
