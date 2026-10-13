#!/usr/bin/env node
'use strict';
// Read-only diagnosis: original scenario seed functions and exact old/fixed
// adapter function bytes, against the complete game IIFE. No DOM pass implied.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const repo='/workspace/scratch/0848c4e4f365/Lumenfall-tree',out=__dirname,commit='3c931a26bbcf7b009dee03e7411ed41faeb971f8';
const git=(...a)=>cp.execFileSync('git',a,{cwd:repo});
const published=file=>git('show',commit+':'+file);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const oldSource=published('index.html').toString(),currentSource=fs.readFileSync(path.join(repo,'index.html'),'utf8');
const oldBridge=published('tests/behavioral/bridge.js').toString(),fixedBridge=fs.readFileSync(path.join(repo,'tests/behavioral/bridge.js'),'utf8');
assert.equal(sha(oldSource),'4e4707afca6672ea46aad03ebd05cd7341ad61d7316a9636fed6172dbfed96ef');
assert.equal(sha(currentSource),'ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3');
assert.equal(sha(fixedBridge),'8568cfb994b0a6c4c1c2bded8f2946a6489b18591992e58d534f483f5cb287c1');
fs.mkdirSync(out,{recursive:true});
const harnessBytes=published('tests/behavioral/tree-expansion-harness.cjs');
fs.writeFileSync(path.join(out,'tree-expansion-harness.cjs'),harnessBytes);
const {app,clone,P,R,CLOCK}=require('./tree-expansion-harness.cjs');
function member(text,name,next){
  const start=text.indexOf('  '+name+': function('),end=text.indexOf('\n  '+next+':',start);
  assert(start>=0&&end>start,name+' unique exact member anchors');
  const raw=text.slice(start,end),value=raw.slice(raw.indexOf('function(')).trim();
  assert(value.endsWith(','));return value.slice(0,-1);
}
const oldManual=member(oldBridge,'ascendManual','bossRetreatGraceSec'),fixedManual=member(fixedBridge,'ascendManual','bossRetreatGraceSec');
const setState=member(oldBridge,'setState','applyFormationPreset'),feedbackSave=member(oldBridge,'feedbackSave','refreshAffordability');
const freeze=oldBridge.match(/  freeze: (function\(\)\{[^\n]+\})\n/)[1];
const hooks=`
  var adapterAscendCalls=[],adapterOriginalAscend=doAscend;
  doAscend=function(){var reload=reloadInProgress,result=adapterOriginalAscend.apply(this,arguments);adapterAscendCalls.push({reloadAtEntry:reload,result:result});return result;};
  window.qa.audit={oldManual:${oldManual},fixedManual:${fixedManual},setState:${setState},feedbackSave:${feedbackSave},freeze:${freeze},
    calls:function(){return adapterAscendCalls;},reload:function(){return reloadInProgress;},
    bonds:function(){return FORMATION_BONDS;},activeBonds:function(){return activeFormationBonds();},intended:intendedFormationIds,
    startupNeeded:function(){return !!state.formationRebuild && intendedFormationIds().indexOf('ember')===-1 && state.activeParty.indexOf('ember')!==-1;}
  };
`;
fs.writeFileSync(path.join(out,'exact-adapter-hooks.js'),hooks);
const modules=['measured-inquiry.js','support-stacking.js','formation.js','rift-status.js','ascend-prisms.js'];
const window={},moduleMeta=[];
for(const name of modules){const b=published('tests/behavioral/'+name);new Function('window',b.toString())(window);moduleMeta.push({path:'tests/behavioral/'+name,sha256:sha(b),bytes:b.length});}
const ids=['swiftcharter','lumenmemory','veteranrecruits','rosterrecall','chargememory','supportmemory','phasememory','riftstep','frontier','stardust','gentlegrowth','formationseat','benchmentor','empowerbatch','wallwisdom','invitations','recruitreserve'];
function create(source){const marker="if(document.readyState==='loading'){";assert.equal(source.split(marker).length,2);const a=app(source.replace(marker,marker+hooks));a.q.save();return a;}
function seedBridge(q){return {freshStateSnapshot:q.fresh,enemyHpFor:q.enemyHp,currentDay:q.day,forge:{deeds:()=>({items:q.achievementDefs()})},riftStatus:{bonds:q.audit.bonds}};}
function slim(q){const s=q.get();return {depth:s.depth,ascendCount:s.ascendCount,prisms:s.prisms,lumen:s.lumen,shards:s.shards,activeParty:clone(s.activeParty),spirits:clone(s.spirits),heroResource:clone(s.heroResource),formationRebuild:clone(s.formationRebuild),supportBuffs:clone(s.supportBuffs),buffUntil:s.buffUntil,buffMult:s.buffMult,newTreeLevels:Object.fromEntries(ids.map(id=>[id,s.nodes[id]])),treeTrainingProgress:s.treeTrainingProgress,intended:clone(q.audit.intended()),activeBonds:q.audit.activeBonds().map(b=>b.id),startupSupportCondition:q.audit.startupNeeded(),reloadFlag:q.audit.reload()};}
function capture(q){return {state:clone(q.get()),summary:slim(q)};}
function invoke(a,method){const before=capture(a.q),offset=a.writes.length,callOffset=a.q.audit.calls().length,primary=a.storage.get(P),recovery=a.storage.get(R);const returned=a.q.audit[method]();return {before,returned,originalDoAscendCalls:clone(a.q.audit.calls().slice(callOffset)),after:capture(a.q),successfulWrites:a.writes.slice(offset).map(w=>({key:w.key,sha256:sha(w.value),bytes:Buffer.byteLength(w.value)})),primaryChanged:a.storage.get(P)!==primary,recoveryChanged:a.storage.get(R)!==recovery};}
function install(a,s){a.q.audit.setState(s);for(const id of ids)assert.equal(a.q.get().nodes[id],0,'original scenario has new Tree level0 '+id);assert.equal(a.q.get().treeTrainingProgress,0);}
const records=[];
for(const [product,source] of [['published4e',oldSource],['viewportCcef',currentSource]]){
  for(const method of ['oldManual','fixedManual']){
    const expected=method==='fixedManual';
    for(const family of ['inquiry','support','formation','chronology','rift-status','layout']){
      const a=create(source),q=a.q,b=seedBridge(q),ctx={currentDay:q.day};q.audit.freeze();let seed;
      if(family==='inquiry'){
        seed=window.inquirySeed(b,ctx);seed.longStudyLevels.measuredinquiry=13;seed.studyQueue.measuredinquiry=true;
        seed.activeStudies=[{id:'measuredinquiry',remainingSec:531,totalDurationSec:600,speedMult:8},{id:'guardmastery',remainingSec:77,totalDurationSec:120,speedMult:2}];
        seed.depth=seed.enemyDepth=16;seed.enemyHp=seed.enemyMaxHp=q.enemyHp(16);install(a,seed);
      }else if(family==='support'){
        const T=2000000000000.375;a.clock(T);seed=window.supportStackSeed(b,ctx,['tide','aurora']);install(a,seed);
        q.cast('tide','live',T);q.cast('aurora','live',T);seed=clone(q.get());seed.spirits.ember=1;seed.activeParty=['ember'];install(a,seed);
      }else if(family==='rift-status'){
        seed=window.riftStatusSeed(b,ctx);const worst=window.riftStatusWorst(b,ctx);seed.activeParty=worst.ids;seed.activeParty.forEach(id=>seed.spirits[id]=2);install(a,seed);
      }else{
        seed=window.p207Seed(b,family==='formation'?['stone','ember','tide']:family==='chronology'?['tide','stone']:['void','tide','stone','gale','thorn'],'boss');install(a,seed);
      }
      const result=invoke(a,method);assert.equal(result.originalDoAscendCalls[0].result,expected);assert.equal(q.audit.reload(),true);
      assert.equal(result.successfulWrites.length,expected?2:0);
      let predicate;
      if(family==='inquiry')predicate=q.get().lumen===0&&q.get().shards===result.before.state.shards;
      else if(family==='support')predicate=q.get().supportBuffs===null&&q.get().buffUntil===0&&q.get().buffMult===1;
      else if(family==='formation')predicate=JSON.stringify(q.get().activeParty)==='["ember"]';
      else if(family==='rift-status')predicate=!!q.get().formationRebuild&&!q.audit.activeBonds().length;
      else if(family==='layout')predicate=q.audit.startupNeeded();
      else{
        seed=clone(q.get());seed.empowerQueue.ember=false;seed.lumen=1000000;seed.depth=seed.enemyDepth=101;seed.enemyHp=seed.enemyMaxHp=q.enemyHp(101);seed.autoAscendEnabled=false;install(a,seed);
        const at999=q.advance(.999,{kind:'live',clockStartMs:CLOCK}),state999=clone(q.get());
        const at1000=q.advance(.001,{kind:'live',clockStartMs:CLOCK+999}),state1000=clone(q.get());
        result.chronology={at999:{summary:at999,state:state999},at1000:{summary:at1000,state:state1000}};
        assert.equal(at999.empowers,0,'both adapters have zero early purchases');
        predicate=at999.empowers===0&&state999.spirits.tide===0;
      }
      assert.equal(!!predicate,expected,family+' intended state predicate');
      records.push({product,sourceSha256:sha(source),method,family,originalSeed:seed,predicateObserved:!!predicate,result});
    }
    const a=create(source),q=a.q,b=seedBridge(q);
    // Preserve the actual first-two-check order of runAscendPrismsContract.
    install(a,window.ascendPrismsSeed(b,16,15,0,0));const first=invoke(a,method);assert.equal(first.returned.gain,2);assert.equal(q.audit.reload(),false);
    q.audit.feedbackSave();assert.equal(q.audit.reload(),true);
    install(a,window.ascendPrismsSeed(b,16,15,1,0));const second=invoke(a,method);
    assert.equal(q.prismPreview().gain,2);assert.equal(second.returned.gain,expected?2:0);assert.equal(q.audit.reload(),true);
    records.push({product,sourceSha256:sha(source),method,family:'prism-first-two-checks',first,feedbackSaveSetsReload:true,second,predicateObserved:second.returned.gain===2});
  }
}
const analysisPath='/workspace/scratch/0848c4e4f365/tree-ci/repair/full/failed-scenario-analysis.json',analysis=JSON.parse(fs.readFileSync(analysisPath));
const artifacts='/workspace/scratch/0848c4e4f365/tree-ci/repair/full/artifact';
const rawRows=analysis.failedRows.map(row=>{
  const relative=row.domProvenance.path,bytes=fs.readFileSync(path.join(artifacts,relative));assert.equal(sha(bytes),row.domProvenance.sha256);
  const containsOldAdapter=bytes.toString().includes('ascendManual: '+oldManual);
  if(!row.name.startsWith('layout-'))assert(containsOldAdapter,'archived DOM contains exact original adapter '+row.name);
  return {name:row.name,viewport:row.rawProcess.viewport,assertion:typeof row.qa.payload.detail==='string'?row.qa.payload.detail:row.qa.payload.detail.message,process:row.process,runtimeErrors:row.qa.payload.runtimeErrors,sourceDom:{path:path.join(artifacts,relative),sha256:sha(bytes),bytes:bytes.length},containsOldAdapter};
});
const identity={commit,tree:git('rev-parse',commit+'^{tree}').toString().trim(),publishedSourceSha256:sha(oldSource),viewportSourceSha256:sha(currentSource),oldBridgeSha256:sha(oldBridge),fixedBridgeSha256:sha(fixedBridge),harnessSha256:sha(harnessBytes),adapterHooksSha256:sha(hooks),testSha256:sha(fs.readFileSync(__filename)),modules:moduleMeta,rawAnalysisSha256:sha(fs.readFileSync(analysisPath)),node:process.version,v8:process.versions.v8};
fs.writeFileSync(path.join(out,'witnesses.json'),JSON.stringify({identity,records,rawRows},null,2)+'\n');
const result={status:'COMMON_ADAPTER_CAUSE_REPRODUCED',scope:'Complete-IIFE state-boundary witnesses, exact old/new adapter functions and original seeds. No browser/layout or full-scenario PASS claimed.',identity,vmRecords:records.length,failedRows:rawRows.length,distinctScenarios:new Set(rawRows.map(r=>r.name)).size,allNewTreeNodesZero:true,rows:records.map(r=>({product:r.product,method:r.method,family:r.family,predicate:r.predicateObserved,gain:r.result?r.result.returned.gain:r.second.returned.gain,ascendReturn:r.result?r.result.originalDoAscendCalls[0].result:r.second.originalDoAscendCalls[0].result,writes:r.result?r.result.successfulWrites.length:r.second.successfulWrites.length,chronology999:r.result&&r.result.chronology?{empowers:r.result.chronology.at999.summary.empowers,tide:r.result.chronology.at999.state.spirits.tide}:null}))};
fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
