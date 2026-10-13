'use strict';
// Focused diagnostic, not a replacement for the unchanged browser contract.
// Complete game IIFE and complete original browser bridge execute. The three
// original seeds and independent BigInt oracle are read from ascend-prisms.js.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const repo=process.argv[2],mode=process.argv[3]||'before';
const sourcePath=process.argv[4]||path.join(repo,'index.html');
const source=fs.readFileSync(sourcePath,'utf8');
const bridge=fs.readFileSync(path.join(repo,'tests/behavioral/bridge.js'),'utf8');
const oracleSource=fs.readFileSync(path.join(repo,'tests/behavioral/ascend-prisms.js'),'utf8');
const harnessPath=path.join(repo,'tests/behavioral/tree-expansion-harness.cjs');
const {app}=require(harnessPath);
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function make(){
  const marker="if(document.readyState==='loading'){";
  assert.equal(source.split(marker).length,2,'one complete game startup marker');
  const extra=`
window.__lumenfallQaContext={scenario:'ascend-prisms-contract',clockNow:function(){return Date.now();},currentDay:todayStr};
window.__qaUiMeasurementPause=function(){};
${bridge}
var auditQ;
Object.defineProperty(window,'qa',{get:function(){return auditQ;},set:function(q){auditQ=q;q.b=window.__lumenfallQaBridge;q.window=window;q.document=document;
q.reload=function(v){if(v!==undefined)reloadInProgress=v;return reloadInProgress;};
q.throwAscend=function(error,observer){var old=doAscend;doAscend=function(){observer(reloadInProgress);throw error;};return function(){doAscend=old;};};
}});
`;
  const a=app(source.replace(marker,extra+marker));
  const oracle=new Function('window','document',oracleSource+'\nreturn {expected:prismEarningOracle,seed:window.ascendPrismsSeed};')(a.q.window,a.q.document);
  return {a,b:a.q.b,oracle};
}
const result={mode,sourceSha256:sha(source),bridgeSha256:sha(bridge),oracleSha256:sha(oracleSource),harnessSha256:sha(fs.readFileSync(harnessPath)),engine:{node:process.version,v8:process.versions.v8},scope:'Complete production IIFE, actual bridge and real transaction/storage. Presentation stubbed by unchanged Tree harness; original first three browser seeds/BigInt reward oracle, not browser or native acceptance.',rows:[],restoration:[]};
try{
  const {a,b,oracle}=make();
  for(const values of [[16,15,0,0],[16,15,1,0],[16,15,0,1]]){
    const s=oracle.seed(b,...values),want=oracle.expected(...values);
    b.setState(s);
    const before=b.getState(),flagsBefore=b.getFlags(),breakdown=b.ascendBreakdown();
    for(const key of Object.keys(want))assert.equal(breakdown[key],want[key],'original reward oracle '+values+','+key);
    const payout=b.ascendManual(),after=b.getState();
    result.rows.push({values,want,payout,flagsBefore,flagsAfter:b.getFlags(),actualReset:after.depth===1&&after.ascendCount===before.ascendCount+1,primary:b.rawSave()&&JSON.parse(b.rawSave()).prisms,recovery:b.rawRecovery()&&JSON.parse(b.rawRecovery()).prisms});
    assert.equal(payout.gain,want.gain,'manual payout equals preview/oracle');
    assert.equal(after.ascendCount,before.ascendCount+1,'actual Ascend count');
    assert.equal(after.depth,1,'actual reset');
    assert.equal(after.ascendRewardedDepth,Math.max(values[0],values[1]),'manual reward benchmark');
    assert.equal(after.nodes.swift,values[2],'Ascend retains Tree bonus');
    assert.equal(after.longStudyLevels.prismstudy,values[3],'Ascend retains completed Lab bonus');
    assert.equal(b.getFlags().reloadInProgress,flagsBefore.reloadInProgress,'adapter restores incoming reload flag after successful Ascend');
    b.feedbackSave();
    assert.equal(b.rawSave(),b.rawRecovery(),'primary and recovery agree after payout');
    assert.equal(JSON.parse(b.rawSave()).prisms,100+want.gain,'payout saved exactly');
  }
  for(const previousReload of [false,true]){
    const {a,b,oracle}=make();b.setState(oracle.seed(b,20,219,17,18));a.q.reload(previousReload);
    const before=b.getState(),token=a.q.runToken();a.fail(true,false);
    const refusal=b.ascendManual();
    assert.equal(refusal.gain,0,'actual primary failure grants no Prisms');
    assert.deepEqual(b.getState(),before,'actual primary failure preserves entire state');
    assert.equal(a.q.runToken(),token,'actual primary failure preserves run token');
    assert.equal(a.q.reload(),previousReload,'actual primary refusal restores reload flag');
    a.fail(false,false);
    const error=new Error('intentional scoped Ascend exception');let flagInside;
    const restore=a.q.throwAscend(error,flag=>{flagInside=flag;});
    try{assert.throws(()=>b.ascendManual(),actual=>actual===error,'same exception propagated');}
    finally{restore();}
    assert.equal(flagInside,false,'actual call scope opens save guard');
    assert.equal(a.q.reload(),previousReload,'exception restores previous reload flag');
    assert.deepEqual(b.getState(),before,'exception control does not mutate state');
    const retry=b.ascendManual();assert.equal(retry.gain,21,'real retry succeeds');
    assert.equal(a.q.reload(),previousReload,'retry restores reload flag');
    result.restoration.push({previousReload,primaryFailurePreservesState:true,exceptionIdentityPreserved:true,flagInside,retryGain:retry.gain});
  }
  result.status='pass';
}catch(error){result.status='fail';result.error={name:error.name,message:error.message,stack:error.stack};process.exitCode=1;}
console.log(JSON.stringify(result,null,2));
