'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8');
const eol=source.includes('\r\n')?'\r\n':'\n',transactionPrefix='function forgeCommitPaidMutation(apply){'+eol+'  var base=state,memoWasBase=studyClockMemo && studyClockMemo.state===state;'+eol;
const specs=[
 ['wrong-mastery-power','return Amount.pow(1.1,wispMasteryLevel(id));','return Amount.pow(1.2,wispMasteryLevel(id));','own Power compounded10%'],
 ['missing-next-record','depthStep:25','depthStep:0','next rank needs deeper record'],
 ['free-mastery-sigils','state.sigils=debitAmount(state.sigils,plan.cost.sigil);state.wispMastery[sp.id]=plan.rank+1;','state.wispMastery[sp.id]=plan.rank+1;','Mastery Sigil debit'],
 ['lost-mastery-on-ascend','state.ascendCount++;','state.ascendCount++;Object.keys(state.wispMastery).forEach(function(id){state.wispMastery[id]=0;});','Mastery survives Ascend'],
 ['leaked-paid-mutation',transactionPrefix+'  state=clonePersistedValue(base);',transactionPrefix+'  state=base;','failed primary Mastery rolls back everything'],
 ['lost-paid-clock','if(memoWasBase)studyClockMemo.state=base;','', 'failed purchase preserves paid-work clock continuity'],
 ['wide-quote-copy','if(!quoteOnly)credits=clonePersistedValue(credits);','credits=clonePersistedValue(credits);','wide price quotes never clone or mutate paid ledgers'],
 ['stale-refund-total','if(prismRefundCreditMemo.key===key)','if(prismRefundCreditMemo.key!==null)','in-place held-credit change updates total'],
 ['free-queued-speed','state.motes=debitAmount(state.motes,plan.cost);','', 'queued speed exactly debits a wide Mote wallet','endless-wide-engine.cjs'],
 ['discarded-physical-progress',' && !Amount.lt(state.enemyHp,hpBeforeAdvance)','', 'Authoritative simulation stalled','endless-wide-engine.cjs','runtime'],
 ['unbounded-future-work','Math.min(ENDLESS_PROGRESSION.maxStudyWorkSec,node.baseDurationSec * Math.pow(node.durationGrowth, level))','node.baseDurationSec * Math.pow(node.durationGrowth, level)','bounded future work'],
 ['lost-old-titan-entitlement','legacyDepth={ember:1,tide:3,stone:6,gale:9,thorn:12,void:18,aurora:24,titan:32}','legacyDepth={ember:1,tide:3,stone:6,gale:9,thorn:12,void:18,aurora:24,titan:100}','old unlocked roster preserved titan'],
 ['ability-live-leak','if(!forgeCommitPaidMutation(function(){'+eol+'    state.lumen=debitAmount(state.lumen,cost.lumen);','if(!(function(apply){apply();return false;})(function(){'+eol+'    state.lumen=debitAmount(state.lumen,cost.lumen);','failed ability rolls back wallet and rank ember'],
 ['early-ultimate','module:15,depth:120','module:14,depth:120','Ultimate needs ability15']
];
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-endless-controls-')),records=[];
try{
 for(const [name,from,to,expected,entry,kind]of specs){
  assert.equal(source.split(from).length,2,'one precise mutation anchor '+name);
  const mutant=source.replace(from,to),file=path.join(dir,name+'.html');fs.writeFileSync(file,mutant);
  const child=spawnSync(process.execPath,[path.join(__dirname,entry||'endless-progression-core.cjs'),file],{encoding:'utf8',timeout:30000});
  assert.equal(child.error,undefined,'control completed normally '+name);assert.notEqual(child.status,0,'control survived '+name);
  assert.match(child.stderr,kind==='runtime'?/Error: Authoritative simulation stalled/:/AssertionError/,'behavioural assertion catches '+name);assert(child.stderr.includes(expected),'causal assertion '+name+': '+child.stderr);
  records.push({name,status:'KILLED',assertion:expected,sourceSha256:crypto.createHash('sha256').update(mutant).digest('hex')});
 }
}finally{fs.rmSync(dir,{recursive:true,force:true});}
console.log(JSON.stringify({status:'PASS',controls:records.length,records,sourceSha256:crypto.createHash('sha256').update(source).digest('hex')},null,2));
