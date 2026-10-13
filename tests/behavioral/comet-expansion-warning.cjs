#!/usr/bin/env node
'use strict';
// One actual-browser source-reversion control after the complete positive lane.
// It runs the unchanged Comet mobile driver/helper; it does not alter its tests.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const EXPECTED_ERROR='AssertionError [ERR_ASSERTION]: real protected-load warning observed before cleanup';
const GENERIC_WARNING='Offline progress is safe. Return again to retry, or restore a backup in Settings.';
const PROTECTED_WARNING='Primary Comet history is invalid. The original save is preserved; restore a valid backup to resume saving.';
const HUNKS=[
 {
  fixed:"function announcePersistenceStatus(repeatBlocked){\n  if(persistenceBlocked){\n    if(!persistenceWarningShown || repeatBlocked===true){",
  original:"function announcePersistenceStatus(){\n  if(persistenceBlocked){\n    if(!persistenceWarningShown){"
 },
 {
  fixed:"    if(error){\n      if(!document.hidden){\n        if(persistenceBlocked) announcePersistenceStatus(true);\n        else showToast('Offline progress is safe. Return again to retry, or restore a backup in Settings.');\n      }\n      return;\n    }",
  original:"    if(error){\n      if(!document.hidden) showToast('Offline progress is safe. Return again to retry, or restore a backup in Settings.');\n      return;\n    }"
 }
];
function replaceOnce(text,from,to,label){assert.equal(text.split(from).length,2,'exactly one '+label);return text.replace(from,()=>to);}
function revertWarningPatch(source){
 let variant=source;for(let i=0;i<HUNKS.length;i++)variant=replaceOnce(variant,HUNKS[i].fixed,HUNKS[i].original,'fixed warning hunk '+i);
 let restored=variant;for(let i=0;i<HUNKS.length;i++)restored=replaceOnce(restored,HUNKS[i].original,HUNKS[i].fixed,'reverted warning hunk '+i);
 assert.equal(restored,source,'only the two exact warning hunks change');assert.notEqual(variant,source);
 return {variant,hunks:HUNKS.map((x,i)=>({index:i,fixed:x.fixed,original:x.original})),sourceSha256:sha(source),variantSha256:sha(variant)};
}
const profileKey=p=>[p.width,p.scale,p.motion].join('/');
function expectedProfiles(){return [320,390,430].flatMap(width=>[1,2].flatMap(scale=>['no-preference','reduce'].map(motion=>({width,scale,motion}))));}
function verifyProtectedRecord(record,positive){
 assert.equal(record.phase,'malformed-current3-claims');
 const primary=JSON.parse(record.primary),recovery=JSON.parse(record.recovery);
 assert.equal(primary.schemaVersion,4);assert.equal(recovery.schemaVersion,4);assert.equal(primary.comets,37);assert.equal(recovery.comets,37);
 assert.equal(primary.cometClaims.deeds.unknown_comet_claim,true);delete primary.cometClaims.deeds.unknown_comet_claim;assert.deepEqual(primary,recovery,'only the deliberate invalid current-schema claim differs');
 assert.equal(record.primarySha256,sha(record.primary));assert.equal(record.recoverySha256,sha(record.recovery));
 assert.equal(record.loaded.comets,37,'actual valid recovery endpoint');
 assert.deepEqual(record.slots.map(x=>x.key),['lumenfall_save_v2','lumenfall_save_recovery_v1']);
 assert.deepEqual(record.slots.map(x=>x.raw),[record.primary,record.recovery],'both original raw slots remain exact');
 assert(record.beforeReady.length>0,'actual pre-cleanup warning samples exist');
 for(const observation of record.beforeReady){assert.equal(observation.status.blocked,true);assert.equal(observation.status.recovered,true);assert.equal(observation.status.blockedReason,PROTECTED_WARNING);}
 const visible=record.beforeReady.filter(x=>x.shown===true);assert(visible.length>0,'warning actually visible before cleanup');
 if(positive)assert(visible.some(x=>x.toast===PROTECTED_WARNING&&x.status.warningShown===true),'specific protected warning survives offline return');
 else{assert(!visible.some(x=>x.toast===PROTECTED_WARNING),'reversion has lost the protected warning');assert(visible.some(x=>x.toast===GENERIC_WARNING&&x.status.warningShown===true),'exact original generic overwrite observed');}
 return {profile:record.profile,primarySha256:record.primarySha256,recoverySha256:record.recoverySha256,loadedComets:37,rawSlotsExact:true,beforeReady:record.beforeReady};
}
function inspectPositive(receipt,identity,sourceSha256){
 assert.equal(receipt.status,'pass','positive receipt must pass before any reversion runs');assert.equal(receipt.sourceSha256,sourceSha256,'positive source is the current source');assert.deepEqual(receipt.cometIdentity,identity,'positive uses the current unchanged browser inputs');assert(!receipt.error,'no positive error');
 assert.equal(receipt.profiles.length,12,'all twelve complete original profiles');
 assert.deepEqual(receipt.profiles.map(profileKey).sort(),expectedProfiles().map(profileKey).sort(),'complete exact viewport/text/motion matrix');
 for(const p of receipt.profiles){assert(Array.isArray(p.inputs));for(const input of p.inputs)assert.deepEqual(input.runtimeErrors,[],'positive actual input has no browser runtime error');}
 assert.equal(receipt.diagnostics.negatives.length,10,'all ten original causal pairs');
 const keys=new Set();for(const n of receipt.diagnostics.negatives){assert.equal(n.status,'pass');assert.equal(n.positive.status,'pass');assert.equal(n.negative.status,'caught');assert.equal(n.negative.caught.name,'AssertionError');assert.deepEqual(n.positive.runtimeErrors,[]);assert.deepEqual(n.negative.runtimeErrors,[]);const k=profileKey(n.profile)+'/'+n.kind;assert(!keys.has(k),'each original causal pair is unique');keys.add(k);}
 const records=receipt.diagnostics.migration.filter(x=>x.phase==='malformed-current3-claims');assert.equal(records.length,12,'each actual profile exercises protected load');assert.deepEqual(records.map(x=>profileKey(x.profile)).sort(),expectedProfiles().map(profileKey).sort());
 return {checks:receipt.checks,completedProfiles:12,originalCausalPairs:10,protectedWarnings:records.map(x=>verifyProtectedRecord(x,true))};
}
function inspectNegative(receipt,identity,variantSha256){
 assert.equal(receipt.status,'fail','the exact product reversion must fail the original browser test');assert.equal(receipt.sourceSha256,variantSha256);assert.deepEqual(receipt.cometIdentity,identity,'reversion uses the same unchanged driver/helper/transport/oracle');
 assert.equal(receipt.error.split('\n')[0],EXPECTED_ERROR,'only the original protected-warning assertion counts');assert.equal(receipt.profiles.length,0,'warning fails in the first actual profile');assert.equal(receipt.diagnostics.negatives.length,0,'unreached controls cannot count');assert.deepEqual(receipt.failure.runtimeErrors,[],'no runtime exception can stand in for the causal failure');
 const records=receipt.diagnostics.migration.filter(x=>x.phase==='malformed-current3-claims');assert.equal(records.length,1);assert.equal(profileKey(records[0].profile),'320/1/no-preference');const warning=verifyProtectedRecord(records[0],false);
 assert.deepEqual(receipt.failure.slots,records[0].slots,'raw slots remain untouched at the exact failed assertion');assert.deepEqual(receipt.failure.beforeReady,records[0].beforeReady);assert.equal(receipt.failure.state.comets,37);
 const trace=receipt.diagnostics.readiness.find(x=>x.phase==='malformed-current3-claims');assert(trace);assert.equal(trace.status,'ready');assert.equal(trace.action.status,'completed');
 return {checks:receipt.checks,completedProfiles:0,unreachedOriginalCausalPairs:0,caughtAssertion:receipt.error,warning,readiness:trace};
}
function main(args){
 assert(Number(process.versions.node.split('.')[0])>=20,'Node20+ required');
 const sourcePath=path.resolve(args[0]||'index.html'),positiveDir=path.resolve(args[1]||'comet-validation/mobile'),out=path.resolve(args[2]||'comet-validation/warning');
 const root=path.dirname(sourcePath),mainPath=path.join(root,'tests/behavioral/comet-expansion-mobile.cjs');
 assert(!fs.existsSync(out),'new evidence directory required; never overwrite previous results');fs.mkdirSync(out,{recursive:true});
 const read=p=>fs.readFileSync(p),json=p=>JSON.parse(read(p)),write=(p,v)=>fs.writeFileSync(path.join(out,p),Buffer.isBuffer(v)?v:typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'}),file=p=>{const b=read(p);return {path:p,bytes:b.length,sha256:sha(b)};};
 const result={status:'fail',kind:'exact protected-warning source reversion',startedAtRuntimeUtc:new Date().toISOString(),node:process.version,versions:process.versions,nativeAndroid:'untested',positive:null,negative:null};
 const git=(...args)=>{const r=spawnSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024});assert.equal(r.status,0,'Git identity '+args.join(' '));return r.stdout;};
 let exit=1;
 try{
  const source=read(sourcePath).toString(),sourceSha256=sha(source),head=git('rev-parse','HEAD').trim(),tree=git('rev-parse','HEAD^{tree}').trim();
  assert.equal(read(path.join(positiveDir,'../commit.txt')).toString().trim(),head,'positive belongs to the actual current Git HEAD');assert.equal(read(path.join(positiveDir,'../tree.txt')).toString().trim(),tree,'positive belongs to the current complete Git tree');
  const paths={testSha256:mainPath,helperSha256:path.join(root,'tests/behavioral/comet-expansion-mobile-helper.cjs'),transportSha256:path.join(root,'tests/behavioral/prism-acceptance.cjs'),numericalSha256:path.join(root,'tests/behavioral/comet-expansion-numerical.cjs')},identity=Object.fromEntries(Object.entries(paths).map(([key,p])=>[key,sha(read(p))]));
  for(const p of [sourcePath,...Object.values(paths)]){const relative=path.relative(root,p);assert(!relative.startsWith('..'));assert.equal(sha(git('show','HEAD:'+relative)),sha(read(p)),'active input bytes match the same committed candidate: '+relative);}
  result.identity={head,tree,source:file(sourcePath),tests:Object.values(paths).map(file),wrapper:file(__filename),positiveFiles:['receipt.json','driver-identity.json','instrumented-driver.cjs','process.json','command.stdout.txt'].map(p=>file(path.join(positiveDir,p)))};
  const positive=json(path.join(positiveDir,'receipt.json')),positiveProcess=json(path.join(positiveDir,'process.json')),positiveDriver=json(path.join(positiveDir,'driver-identity.json'));assert.equal(positiveProcess.status,0);assert.equal(positiveProcess.signal,null);assert.equal(positiveProcess.error,null);assert.deepEqual(json(path.join(positiveDir,'command.stdout.txt')),positive);assert.equal(positiveDriver.sourceSha256,sourceSha256);assert.equal(positiveDriver.generatedDriverSha256,sha(read(path.join(positiveDir,'instrumented-driver.cjs'))));for(const [k,v]of Object.entries(identity))assert.equal(positiveDriver[k],v);
  result.positive=inspectPositive(positive,identity,sourceSha256);
  const mutation=revertWarningPatch(source),variantRoot=path.join(out,'variant');fs.mkdirSync(variantRoot);write('variant/index.html',mutation.variant);result.mutation={...mutation,variant:undefined};write('mutation.json',result.mutation);
  // The original HTTP server serves fonts/branding relative to sourcePath.
  // Copy the real bytes so a missing asset cannot be the negative cause.
  const assets=[];for(const dir of ['fonts','branding']){const src=path.join(root,dir),dest=path.join(variantRoot,dir);assert(fs.statSync(src).isDirectory());fs.cpSync(src,dest,{recursive:true,dereference:false,errorOnExist:true,force:false});const scan=p=>{for(const n of fs.readdirSync(p).sort()){const f=path.join(p,n),s=fs.lstatSync(f);if(s.isDirectory())scan(f);else{assert(s.isFile(),'regular source-owned asset');const relative=path.relative(variantRoot,f),original=path.join(root,relative);assert.deepEqual(read(f),read(original),'exact variant asset '+relative);assets.push({path:relative,bytes:s.size,sha256:sha(read(f))});}}};scan(dest);}write('assets.json',assets);
  const command=[process.execPath,mainPath,path.join(variantRoot,'index.html'),path.join(out,'mobile')],startedAtRuntimeUtc=new Date().toISOString();const child=spawnSync(command[0],command.slice(1),{cwd:root,encoding:'utf8',timeout:1320000,maxBuffer:128*1024*1024});
  write('command.stdout.txt',child.stdout||'');write('command.stderr.txt',child.stderr||'');const processResult={command,cwd:root,startedAtRuntimeUtc,finishedAtRuntimeUtc:new Date().toISOString(),status:child.status,signal:child.signal,error:child.error?{name:child.error.name,message:child.error.message,code:child.error.code,stack:child.error.stack}:null};write('process.json',processResult);result.process=processResult;
  assert.equal(child.error,undefined,'no wrapper timeout/spawn error');assert.equal(child.signal,null);assert.equal(child.status,1,'original mobile wrapper must fail');
  const negative=json(path.join(out,'mobile/receipt.json')),negativeProcess=json(path.join(out,'mobile/process.json')),negativeDriver=json(path.join(out,'mobile/driver-identity.json'));assert.equal(negativeProcess.status,1);assert.equal(negativeProcess.signal,null);assert.equal(negativeProcess.error,null);assert.deepEqual(json(path.join(out,'mobile/command.stdout.txt')),negative);assert.equal(negativeDriver.sourceSha256,mutation.variantSha256);assert.equal(negativeDriver.generatedDriverSha256,sha(read(path.join(out,'mobile/instrumented-driver.cjs'))));for(const [k,v]of Object.entries(identity))assert.equal(negativeDriver[k],v);assert.equal(negativeDriver.generatedDriverSha256,positiveDriver.generatedDriverSha256,'identical generated driver bytes for the source-only reversion');
  result.negative=inspectNegative(negative,identity,mutation.variantSha256);assert.equal(negative.browserVersion.product,positive.browserVersion.product);assert.equal(negative.browserVersion.jsVersion,positive.browserVersion.jsVersion);result.browserVersion=negative.browserVersion;
  assert.equal(sha(read(sourcePath)),sourceSha256,'source file is untouched');for(const [k,p]of Object.entries(paths))assert.equal(sha(read(p)),identity[k],'active test file is untouched');
  result.status='pass';exit=0;
 }catch(error){result.error={name:error.name,message:error.message,stack:error.stack};}
 result.finishedAtRuntimeUtc=new Date().toISOString();write('receipt.json',result);
 const files=[];function scan(p){for(const n of fs.readdirSync(p).sort()){const f=path.join(p,n),s=fs.lstatSync(f);if(s.isDirectory())scan(f);else{assert(s.isFile());const b=read(f);files.push({path:path.relative(out,f),bytes:b.length,sha256:sha(b)});}}}scan(out);write('manifest.json',{status:result.status,scope:'Closed original outputs plus the exact source variant and its real assets; manifest excludes itself.',files});
 console.log(JSON.stringify({status:result.status,kind:result.kind,positiveProfiles:result.positive?.completedProfiles||0,originalCausalPairs:result.positive?.originalCausalPairs||0,warningReversionsCaught:result.negative?1:0,receipt:path.join(out,'receipt.json'),error:result.error?.message||null,nativeAndroid:'untested'}));return exit;
}
module.exports={revertWarningPatch,inspectPositive,inspectNegative,verifyProtectedRecord,EXPECTED_ERROR,GENERIC_WARNING,PROTECTED_WARNING};
if(require.main===module){try{process.exitCode=main(process.argv.slice(2));}catch(error){console.error(error.stack);process.exitCode=1;}}
