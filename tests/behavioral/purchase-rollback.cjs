'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const F=require('./forge-expansion-harness.cjs');
const file=process.argv[2]||'index.html',original=fs.readFileSync(file,'utf8'),marker="if(document.readyState==='loading'){";
let raw=original;const mutation=process.env.PURCHASE_ROLLBACK_MUTANT;
if(mutation){const from=mutation==='false'?'if(apply()===false)return rollback();':'rollback();recordPersistenceFailure(error);return false;';const to=mutation==='false'?'apply();':'recordPersistenceFailure(error);return false;';assert.equal(raw.split(from).length,2);raw=raw.replace(from,to);}
const source=raw.replace(marker,`window.endlessQa={transaction:forgeCommitPaidMutation,run:function(){return ascendRunToken;},
 fault:function(mode){return forgeCommitPaidMutation(function(){state.lumen+=777;state.research.focus+=1;ascendRunToken+=1;if(mode==='throw')throw Error('injected purchase failure');return false;});},
 resonate:useSigilResonance};`+marker);
let checks=0;const records=[];
function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
for(const mode of ['throw','false']){
 const x=F.app(source,undefined,{clockDate:true}),q=x.q,s=F.seed(q);q.set(s);q.save();
 const before=F.clone(q.get()),saved=Array.from(x.storage),run=q.endless.run();let result,error;
 try{result=q.endless.fault(mode);}catch(e){error=e.message;}
 try{
  eq(error,undefined,'purchase error is contained');eq(result,false,'purchase rejects '+mode);eq(q.get(),before,'all failed purchase mutations roll back');eq(q.endless.run(),run,'failed purchase restores run token');eq(Array.from(x.storage),saved,'failed purchase cannot overwrite either save');
  eq(q.save(),true,'later autosave succeeds');eq(F.app(source,x.storage,{clockDate:true}).q.get(),before,'later reload cannot acquire rejected reward');records.push({mode,status:'pass'});
 }catch(e){records.push({mode,status:'fail',error:e.message});}
}
const result={status:records.every(r=>r.status==='pass')?'pass':'fail',checks,sourceSha256:crypto.createHash('sha256').update(raw).digest('hex'),records};
if(process.argv.includes('--negative')&&result.status==='pass'){
 result.controls=[];for(const name of ['throw','false']){
  const r=require('node:child_process').spawnSync(process.execPath,[__filename,file],{encoding:'utf8',env:{...process.env,PURCHASE_ROLLBACK_MUTANT:name}}),receipt=JSON.parse(r.stdout);
  const detected=r.status===1&&receipt.records.some(x=>x.mode===name&&x.status==='fail');assert(detected,'rollback defect rejected '+name);result.controls.push({name,detected});
 }
}
console.log(JSON.stringify(result,null,2));if(result.status==='fail')process.exitCode=1;
