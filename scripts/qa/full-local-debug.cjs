'use strict';
// Local orchestration only; existing tests and their acceptance limits are unchanged.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),group=process.argv[2]||'core';
if(!['core','ui','legacy','full','negative','negative-all','refund-negative'].includes(group))throw Error('Unknown group '+group);
const parent=path.resolve('validation-evidence/full-debug-2026-10-14');fs.mkdirSync(parent,{recursive:true});
const out=process.argv[3]?path.resolve(process.argv[3]):fs.mkdtempSync(path.join(parent,group+'-'));
if(fs.existsSync(out)&&fs.readdirSync(out).length)throw Error('Evidence output must be new or empty; preserve previous receipts');
fs.mkdirSync(out,{recursive:true});
console.log('Evidence: '+out);
const test=(name,file,...args)=>({name,args:[file,...args]});
const core=[
 test('context','scripts/codex/check_context.cjs','--task',process.env.LUMENFALL_QA_TASK||'docs/tasks/LOCAL_FULL_DEBUG_001.md'),
 test('source','scripts/ci/validate_source.cjs'),test('tooling','tests/tooling/run.cjs'),
 test('apk-identity','scripts/verify_apk_identity.cjs','--self-test'),
 ...['lab-expansion','lab-expansion-boundary','forge-expansion','forge-expansion-calibration','tree-expansion-core','tree-expansion-offline','tree-expansion-economy','comet-expansion-core','comet-expansion-numerical','comet-expansion-offline','echo-refund-core','swift-current-core','support-recast-current','early-wisp-curve-current','wisp-contribution-core'].map(n=>test(n,'tests/behavioral/'+n+'.cjs','index.html','--negative')),
 ...['lab-expansion-stress','prism-earning-state','forge-lab-caps'].map(n=>test(n,'tests/behavioral/'+n+'.cjs','index.html')),
 test('prism-exact','tests/behavioral/prism-earning.cjs','--source','index.html'),
 test('payment','tests/behavioral/cheaper-payment-oracle.cjs','--source','index.html','--output',path.join(out,'payment.json')),
 test('f21-integration','tests/behavioral/cheaper-recruitment-integrated.cjs','index.html',path.join(out,'f21.json')),
 test('offline-catchup','tests/behavioral/offline-catchup.cjs','--source','index.html')
];
const ui=[
 ...['prism-acceptance','lab-expansion-ui','forge-expansion-ui','tree-expansion-mobile','comet-expansion-mobile','wisp-contribution-mobile','shared-layout-ui','collection-price-ui','ui-attention-quest','forge-lab-caps-mobile'].map(n=>test(n,'tests/behavioral/'+n+'.cjs','index.html',path.join(out,n))),
 test('guidance','scripts/ci/guidance-readability.cjs',path.join(out,'guidance')),
 test('rift-cosmetics','tests/behavioral/rift-cosmetics.cjs','--source','index.html','--negative'),
 test('refund-browser','tests/behavioral/cheaper-recruitment.cjs','--source','index.html','--echo','--output',path.join(out,'refund.json'))
];
const legacy=['lab-expansion-legacy','forge-expansion-legacy','tree-expansion-v8','comet-expansion-v8','cheaper-recruitment-v8','echo-refund-v8'].map(n=>test(n,'tests/behavioral/'+n+'.cjs','index.html'));
legacy.push(test('swift-v8','tests/behavioral/swift-current-legacy.cjs','index.html','--v8'),test('wisp-v8','tests/behavioral/wisp-contribution-core.cjs','index.html','--v8','--preservation'));
const workflow=fs.readFileSync(path.join(root,'.github/workflows/pre-merge-validation.yml'),'utf8');
const negativeNames=workflow.match(/for scenario in ([^\n]+); do/)[1].trim().split(/\s+/);
const negative=negativeNames.map(n=>({...test(n,'tests/behavioral/run.cjs','--web-root','mobile/www','--scenario',n,'--raw-artifacts',path.join(out,n)),expectedExit:1}));
const allNegative=Object.keys(require('../../tests/behavioral/scenarios.json').NEGATIVE_SCENARIOS).map(n=>({...test(n,'tests/behavioral/run.cjs','--web-root','mobile/www','--scenario',n,'--raw-artifacts',path.join(out,n)),expectedExit:1}));
const refundExpected={handler:'UI maxed even with affordable wallet',refund:'refund receipt prevents a second credit',credit:'fractional original wallet retains exact refund value','free-credit':'large credit quote conserves exact value',wallet:'large wallet quote conserves exact value',receipt:'wrong receipt amount rejects for recovery',cache:'completed large refund avoids repeated price calculation at Ascend boundaries','credit-record':'malformed persisted Prism credit rejects for recovery','ascend-copy':'actual auto-Ascends avoid repeated refund cloning and validation','version-check':'unsupported migration version rejects before any early return','credit-reconcile':'own credit sequence reconciles with saved receipt','below-cap-receipt':'below-cap receipt rejects before legitimate purchase','missing-receipt':'completed marker cannot refund again after receipt deletion','canonical-price':'all finite original purchase value retained','mixed-payment':'wallet-only payment preserves original small credit','power-spacing':'downward ULP at power of two supports exact mixed payment','funding-sources':'best exact available contribution finds payable Tree price'};
const refundNames=workflow.match(/for mutation in ([^\n]+); do/)[1].trim().split(/\s+/);
const refundNegative=refundNames.map(n=>({...test(n,'tests/behavioral/cheaper-recruitment.cjs','--source','mobile/www/index.html','--mutation',n,'--output',path.join(out,n+'.json')),expectedExit:1,refundFailure:refundExpected[n]}));
const groups={core,ui,legacy,negative,'negative-all':allNegative,'refund-negative':refundNegative,full:[test('behavioral-suite','tests/behavioral/run.cjs','--web-root','mobile/www','--raw-artifacts',path.join(out,'raw'))]};
if(!groups[group])throw Error('Unknown group '+group);
const runtime=group==='legacy'?process.env.LUMENFALL_QA_LEGACY_NODE:process.execPath;
if(!runtime)throw Error('LUMENFALL_QA_LEGACY_NODE must identify the existing verified old-engine runtime');
const hash=()=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'index.html'))).digest('hex');
const pinTests=()=>fs.readdirSync(path.join(root,'tests/behavioral')).filter(n=>!n.startsWith('.')).map(n=>path.join('tests/behavioral',n)).filter(n=>fs.statSync(path.join(root,n)).isFile()).map(file=>({file,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')}));
const summary={group,started:new Date().toISOString(),base:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),sourceSha256:hash(),node:process.version,runtime,browser:process.env.LUMENFALL_QA_CDP_CHROME||null,transport:process.env.LUMENFALL_QA_DOM_TRANSPORT||'default',results:[]};
summary.testInputs=pinTests();
const save=()=>fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');
async function main(){
 for(const row of groups[group]){
  console.log('START '+row.name);const started=Date.now(),log=fs.openSync(path.join(out,row.name+'.log'),'w');
  const result=await new Promise(resolve=>{
   const child=cp.spawn(runtime,row.args,{cwd:root,env:process.env,stdio:['ignore',log,log]});let timedOut=false;
   const timer=setTimeout(()=>{timedOut=true;child.kill('SIGKILL');},group==='full'?3600000:900000);
   child.once('error',error=>{clearTimeout(timer);resolve({code:null,error:error.message});});
   child.once('close',(code,signal)=>{clearTimeout(timer);resolve({code,signal,timedOut});});
  });fs.closeSync(log);
  if(row.expectedExit===1){
   if(row.refundFailure){
    const file=path.join(out,row.name+'.json'),receipt=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):null;
    result.completedNegative=result.code===1&&!result.timedOut&&receipt?.status==='FAIL'&&receipt.failure?.includes(row.refundFailure)&&receipt.teardown?.browser?.code===0&&receipt.teardown?.pending===0;
   }else{
    const output=fs.readFileSync(path.join(out,row.name+'.log'),'utf8');
    // Record completed failures only; causal assertion messages still need review.
    result.completedNegative=result.code===1&&!result.timedOut&&output.includes('FAIL '+row.name)&&output.includes('"timed_out": false')&&
     (output.includes('"qa_status": "fail"')&&output.includes('"valid": true')||output.includes('  detail: { "status": "fail"'))&&
     !/Invalid driver JSON|CDP deadline|CDP timeout|No completed QA DOM/.test(output);
   }
  }
  summary.results.push({...row,...result,seconds:(Date.now()-started)/1000});save();
  console.log((row.expectedExit===1?(result.completedNegative?'COMPLETED NEGATIVE ':'UNVERIFIED NEGATIVE '):result.code===0&&!result.timedOut?'PASS ':'FAIL ')+row.name);
 }
 summary.finished=new Date().toISOString();summary.finalSourceSha256=hash();
 summary.finalTestInputs=pinTests();summary.unchangedTests=JSON.stringify(summary.testInputs)===JSON.stringify(summary.finalTestInputs);
 summary.passed=summary.results.every(r=>r.expectedExit===1?r.completedNegative:r.code===0&&!r.timedOut)&&summary.sourceSha256===summary.finalSourceSha256&&summary.unchangedTests;save();
 console.log('FINISHED '+group+' '+summary.results.filter(r=>r.expectedExit===1?r.completedNegative:r.code===0&&!r.timedOut).length+'/'+summary.results.length+' expected outcomes');
 process.exitCode=summary.passed?0:1;
}
main().catch(e=>{summary.error=e.stack;save();console.error(e);process.exitCode=1;});
