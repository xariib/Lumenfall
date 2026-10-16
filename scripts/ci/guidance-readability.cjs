#!/usr/bin/env node
'use strict';
// The original 16-profile/160-sample driver remains a separate Full CI gate.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {findChrome}=require('../../tests/behavioral/run.cjs');
const {assertGuidanceWord}=require('../../tests/behavioral/rift-guidance-readability.cjs');
const {oldTitleInverse,oldLayoutInverse}=require('../../tests/behavioral/rift-guidance-inverses.cjs');
const {restoreBaselineAssets}=require('./guidance-baseline-assets.cjs');
const {archivedBaseline}=require('./guidance-archived-baseline.cjs');
const root=path.resolve(__dirname,'../..'),stage=path.join(root,'mobile/www');
const BASE='684bfc52bb2ca523124fe63981188b9a8004d747',SHA='38eebcb93e4cdc2fbb1f9f67800f8cfb433005904389c0815641d26bbae00b6f',CAUSE='guidance-leading-word-fragmented';
assert(process.argv.length===3,'Usage: node scripts/ci/guidance-readability.cjs OUTPUT_DIR');
assert(Number(process.versions.node.split('.')[0])>=20,'Node20+ required');
const out=path.resolve(root,process.argv[2]);
assert(out!==stage&&!out.startsWith(stage+path.sep),'Output must be outside the staged webroot');
assert(!fs.existsSync(out)||(fs.lstatSync(out).isDirectory()&&!fs.lstatSync(out).isSymbolicLink()&&fs.readdirSync(out).length===0),'Output must be new or intentionally empty');
fs.mkdirSync(out,{recursive:true});
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),read=p=>fs.readFileSync(p),json=p=>JSON.parse(read(p));
const pin=p=>({path:p,bytes:fs.statSync(p).size,sha256:hash(read(p))});
const write=(name,value)=>fs.writeFileSync(path.join(out,name),JSON.stringify(value,null,2)+'\n');
const env={...process.env,GIT_OPTIONAL_LOCKS:'0'};delete env.NODE_OPTIONS;delete env.NODE_PATH;
const result={status:'fail',scope:'GUIDANCE_READABILITY_001',baselineCommit:BASE,fullDefaultGateExecutedHere:false};
function execute(id,command,timeout=300000,input){
 const startedUtc=new Date().toISOString(),r=cp.spawnSync(command[0],command.slice(1),{cwd:root,env,timeout,input,maxBuffer:64*1024*1024,killSignal:'SIGKILL'});
 fs.writeFileSync(path.join(out,id+'.stdout.log'),r.stdout||Buffer.alloc(0));fs.writeFileSync(path.join(out,id+'.stderr.log'),r.stderr||Buffer.alloc(0));
 const record={command,startedUtc,completedUtc:new Date().toISOString(),timeoutMs:timeout,exitCode:r.status,signal:r.signal,timedOut:r.error?.code==='ETIMEDOUT',error:r.error?{code:r.error.code,message:r.error.message}:null,stdout:pin(path.join(out,id+'.stdout.log')),stderr:pin(path.join(out,id+'.stderr.log'))};
 write(id+'-process.json',record);return {raw:r,record};
}
function successful(p,code=0){assert.equal(p.record.timedOut,false);assert.equal(p.record.error,null);assert.equal(p.record.signal,null);assert.equal(p.record.exitCode,code);}
function assets(webroot){
 const rows=[];function walk(relative){const p=path.join(webroot,relative),s=fs.lstatSync(p);assert(!s.isSymbolicLink(),'Regular staged assets required');if(s.isDirectory())for(const n of fs.readdirSync(p).sort())walk(path.join(relative,n));else{assert(s.isFile());rows.push({path:relative.split(path.sep).join('/'),bytes:s.size,sha256:hash(read(p))});}}
 for(const dir of ['fonts','branding'])walk(dir);return rows;
}
const driver=path.join(root,'tests/behavioral/rift-guidance.cjs');
const tests=[__filename,path.join(__dirname,'guidance-baseline-assets.cjs'),path.join(__dirname,'guidance-archived-baseline.cjs'),driver,...['guidance-baseline-assets.test.cjs','rift-guidance-readability.cjs','rift-guidance-inverses.cjs','rift-guidance-inverses.test.cjs','run.cjs','prelude.js','bridge.js','wisp-upgrades-bridge.js','rift-status.js','fixtures.json','scenarios.json'].map(p=>path.join(root,'tests/behavioral',p))];
function inputs(){return {candidate:pin(path.join(stage,'index.html')),tests:tests.map(pin),assets:assets(stage)};}
function fonts(m){
 assert.equal(m?.schema,'rift-guidance-readability-001');assert.equal(m.fontStatus,'loaded');
 const sizes=['root','title','detail','toggle'].map(k=>parseFloat(m.fonts?.[k]?.fontSize));
 [32,28,24,28].forEach((n,i)=>assert(Number.isFinite(sizes[i])&&Math.abs(sizes[i]-n)<=0.01,'Unchanged root/title/detail/toggle font sizes'));
 return sizes;
}
function measurement(m,multiline=false){
 fonts(m);assert.deepEqual(m.invisibleAncestors,[],'The measured hint and its ancestors remain visible');let value,error;try{value=assertGuidanceWord(m);}catch(e){error=e;}
 if(multiline){assert.equal(error?.code,CAUSE);assert(Number.isInteger(error.details?.lineCount)&&error.details.lineCount>1);return error.details;}
 if(error)throw error;assert.equal(value.lineCount,1);return value;
}
function healthy(r){
 assert.equal(r.readabilityProbe,true);assert.equal(r.baselineProbe,false);assert.deepEqual(r.runtimeErrors,[]);
 assert.equal(r.teardown?.code,0);assert.equal(r.teardown.signal,null);assert(!r.teardown.error&&!r.teardown.timeout);
 assert(!r.transportErrors||r.transportErrors.length===0);assert(r.browserVersion?.product,'Actual CDP browser identity required');
}
try{
 const before=inputs();assert(read(path.join(stage,'index.html')).equals(read(path.join(root,'index.html'))),'Candidate stage must equal current source');
 write('inputs.json',before);result.inputs=pin(path.join(out,'inputs.json'));const chrome=findChrome();
 write('runtime.json',{node:process.version,versions:process.versions,binary:pin(fs.realpathSync(process.execPath)),chrome:{selected:chrome,launcher:pin(fs.realpathSync(chrome))}});
 result.runtime=pin(path.join(out,'runtime.json'));
 const head=execute('candidate-git',['git','show','-s','--format=%H%n%T','HEAD'],30000);successful(head);
 let original=execute('baseline-git-show',['git','show',BASE+':index.html'],30000);
 let recovered;
 if(original.record.exitCode!==0){
  const missing=execute('baseline-object-check',['git','cat-file','--batch-check'],30000,BASE+'\n');successful(missing);
  assert.equal(missing.raw.stdout.toString().trim(),BASE+' missing','Archived recovery is allowed only for the missing exact baseline object');
  recovered=archivedBaseline(root);
  original={record:{timedOut:false,error:null,signal:null,exitCode:0},raw:{stdout:recovered.source}};
  write('baseline-offline-recovery.json',{baselineCommit:BASE,sourceSha256:hash(recovered.source),provenance:'Pinned pre-existing historical source, merge tree and unchanged-asset diff; original Git blobs'});
 }
 successful(original);assert.equal(hash(original.raw.stdout),SHA,'Immutable baseline HTML SHA256');
 const baselineRoot=path.join(out,'baseline-www');fs.mkdirSync(baselineRoot);
 fs.writeFileSync(path.join(baselineRoot,'index.html'),original.raw.stdout);
 const baselineAssets=restoreBaselineAssets(BASE,baselineRoot,(id,command)=>{if(recovered&&id==='baseline-assets-tree')return recovered.tree;const p=execute(id,command,30000);successful(p);return p.raw.stdout;});
 const baselineAssetPins=baselineAssets.assets.map(({path,bytes,sha256})=>({path,bytes,sha256})).sort((a,b)=>a.path.localeCompare(b.path,'en'));
 const sortedAssets=webroot=>assets(webroot).sort((a,b)=>a.path.localeCompare(b.path,'en'));
 assert.deepEqual(sortedAssets(baselineRoot),baselineAssetPins,'Written baseline assets match the immutable Git objects');
 write('baseline-assets.json',baselineAssets);result.baselineAssets=pin(path.join(out,'baseline-assets.json'));
 const assetUnit=execute('baseline-assets-unit',[process.execPath,path.join(root,'tests/behavioral/guidance-baseline-assets.test.cjs')]);successful(assetUnit);
 result.baselineAssetsUnit={process:pin(path.join(out,'baseline-assets-unit-process.json')),report:JSON.parse(assetUnit.raw.stdout.toString('utf8'))};assert.equal(result.baselineAssetsUnit.report.status,'pass');
 const unit=execute('inverse-unit',[process.execPath,path.join(root,'tests/behavioral/rift-guidance-inverses.test.cjs'),path.join(stage,'index.html'),path.join(baselineRoot,'index.html')]);successful(unit);
 result.inverseUnit={process:pin(path.join(out,'inverse-unit-process.json')),report:JSON.parse(unit.raw.stdout.toString('utf8'))};assert.equal(result.inverseUnit.report.status,'pass');
 function run(id,webroot,expectedExit=id==='baseline'?1:0){
  const evidence=path.join(out,id),p=execute(id,[process.execPath,driver,chrome,webroot,evidence,'--readability-probe']);
  successful(p,expectedExit);
  const report=json(path.join(evidence,'results.json')),summary=JSON.parse(p.raw.stdout.toString('utf8'));
  assert.equal(summary.status,report.status);assert.equal(path.resolve(summary.result),path.join(evidence,'results.json'));
  assert.equal(summary.profiles,report.records.length);assert.equal(summary.samples,report.records.reduce((n,r)=>n+r.samples.length,0));
  assert.equal(report.sourceSha256,hash(read(path.join(webroot,'index.html'))));healthy(report);
  return {p,report,evidence};
 }
 const baseline=run('baseline',baselineRoot);successful(baseline.p,1);assert.equal(baseline.report.status,'fail');
 assert.equal(baseline.report.error?.code,CAUSE);assert.equal(baseline.report.records.length,1);
 assert.equal(baseline.report.records[0].profile,'320x640-safe0-text2-no-preference');
 const baselineSamples=baseline.report.records[0].samples;assert.equal(baselineSamples.length,1);assert.equal(baselineSamples[0].kind,'fresh');assert.equal(baselineSamples[0].longHint,false);
 const baselineWord=baselineSamples[0].readability,baselineDetails=measurement(baselineWord,true);
 assert.deepEqual(baseline.report.error.details,baselineDetails,'Actual baseline failure matches its complete unchanged word/glyph measurement');
 result.baseline={sourceSha256:SHA,process:pin(path.join(out,'baseline-process.json')),receipt:pin(path.join(baseline.evidence,'results.json')),failure:baseline.report.error,fontSizes:fonts(baselineWord)};
 assert.deepEqual(inputs(),before,'No candidate/test/asset changes between runs');
 const candidate=run('candidate',stage);successful(candidate.p);assert.equal(candidate.report.status,'pass');assert(!candidate.report.error);
 assert.equal(candidate.report.records.length,1);const record=candidate.report.records[0];
 assert.equal(record.profile,'320x640-safe0-text2-no-preference');assert.deepEqual(record.samples.map(s=>s.kind),['fresh','dense','boss','boss-conditional','farm']);
 for(const sample of record.samples){assert.equal(sample.longHint,false);measurement(sample.readability);}
 const ascend=record.ascendReadability;assert(ascend,'Actual Ascend-ready hint coverage is required');assert.equal(ascend.passed,true,'Ascend-ready native navigation/state checks must complete');measurement(ascend.measurement);
 assert.equal(ascend.measurement.word.text,'Ascend');
 const inverse=record.readabilityNegative;assert.equal(inverse?.declaration,'width:9.5em');assert.equal(inverse.cause,CAUSE);assert.equal(inverse.rejection?.code,CAUSE);
 measurement(inverse.original);assert.deepEqual(inverse.rejection.details,measurement(inverse.measurement,true));measurement(inverse.restored);assert.deepEqual(inverse.runtimeErrors,[]);
 assert.equal(inverse.measurement.word.text,inverse.original.word.text);assert.equal(inverse.restored.word.text,inverse.original.word.text);
 for(const part of ['root','title','detail','toggle']){assert.equal(inverse.measurement.fonts[part].font,inverse.original.fonts[part].font);assert.equal(record.samples[0].readability.fonts[part].font,baselineWord.fonts[part].font);}
 assert.deepEqual(inputs(),before,'No source/test/asset changes during candidate');assert(read(path.join(baselineRoot,'index.html')).equals(original.raw.stdout),'Original baseline HTML remains intact');
 result.candidate={sourceSha256:candidate.report.sourceSha256,profiles:1,samples:5,supplementalSamples:1,oldWidthInverse:inverse.rejection,process:pin(path.join(out,'candidate-process.json')),receipt:pin(path.join(candidate.evidence,'results.json'))};
 // Preserve the historical whole-file proof only for its original source.
 // Later unrelated product changes retain an exact, dynamically pinned inverse.
 const oldCopyRoot=path.join(out,'old-copy-www'),candidateHtml=read(path.join(stage,'index.html')).toString('utf8'),copyMutation=oldTitleInverse(candidateHtml);
 const oldCopyHtml=Buffer.from(copyMutation.html);
 fs.mkdirSync(oldCopyRoot);fs.writeFileSync(path.join(oldCopyRoot,'index.html'),oldCopyHtml);for(const dir of ['fonts','branding'])fs.cpSync(path.join(stage,dir),path.join(oldCopyRoot,dir),{recursive:true});
 assert.deepEqual(assets(oldCopyRoot),before.assets,'Copy inverse retains all fonts/branding');
 const oldCopy=run('old-copy',oldCopyRoot,1);assert.equal(oldCopy.report.status,'fail');assert.equal(oldCopy.report.error?.code,CAUSE);assert.equal(oldCopy.report.records.length,1);
 const oldRecord=oldCopy.report.records[0];assert.equal(oldRecord.profile,record.profile);assert.deepEqual(oldRecord.samples.map(s=>s.kind),record.samples.map(s=>s.kind));for(const sample of oldRecord.samples)measurement(sample.readability);
 const oldAscend=oldRecord.ascendReadability;assert(oldAscend,'Old-copy failure must occur in the actual Ascend-ready hint');
 assert.equal(oldAscend.measurement.word.text,'Permanent');assert.equal(oldAscend.measurement.title.text,'Permanent power is waiting');
 assert.deepEqual(oldCopy.report.error.details,measurement(oldAscend.measurement,true),'Actual old-copy failure agrees with saved complete word/glyph measurement');
 for(const part of ['root','title','detail','toggle'])assert.equal(oldAscend.measurement.fonts[part].font,ascend.measurement.fonts[part].font,'Copy inverse preserves '+part+' font');
 assert.deepEqual(inputs(),before,'No candidate/test/asset changes during exact copy inverse');
 result.oldCopyInverse={publishedSourceCommit:copyMutation.publishedSourceCommit,historicalMatch:copyMutation.historicalMatch,sourceSha256:copyMutation.sourceSha256,mutation:'Only the Ascend-ready production title literal is reversed',failure:oldCopy.report.error,process:pin(path.join(out,'old-copy-process.json')),receipt:pin(path.join(oldCopy.evidence,'results.json'))};
 // Add the complete baseline CSS inverse alongside the retained width-only
 // sensitivity check. Every other current product byte stays unchanged.
 const oldLayoutRoot=path.join(out,'old-layout-www'),layoutMutation=oldLayoutInverse(candidateHtml,original.raw.stdout.toString('utf8'));
 write('old-layout-edit-ledger.json',layoutMutation.ledger);fs.mkdirSync(oldLayoutRoot);fs.writeFileSync(path.join(oldLayoutRoot,'index.html'),layoutMutation.html);
 for(const dir of ['fonts','branding'])fs.cpSync(path.join(stage,dir),path.join(oldLayoutRoot,dir),{recursive:true});
 assert.deepEqual(assets(oldLayoutRoot),before.assets,'Complete CSS inverse retains all fonts/branding');
 const oldLayout=run('old-layout',oldLayoutRoot,1);assert.equal(oldLayout.report.status,'fail');assert.equal(oldLayout.report.error?.code,CAUSE);assert.equal(oldLayout.report.records.length,1);
 const layoutRecord=oldLayout.report.records[0];assert.equal(layoutRecord.profile,record.profile);assert.equal(layoutRecord.samples.length,1);assert.equal(layoutRecord.samples[0].kind,'fresh');assert.equal(layoutRecord.samples[0].longHint,false);
 const layoutWord=layoutRecord.samples[0].readability;assert.equal(layoutWord.word.text,'Awaken');assert.equal(layoutWord.title.text,record.samples[0].readability.title.text);
 assert.deepEqual(oldLayout.report.error.details,measurement(layoutWord,true),'Complete old CSS fails at the saved ordinary-word assertion');
 for(const part of ['root','title','detail','toggle'])assert.equal(layoutWord.fonts[part].font,record.samples[0].readability.fonts[part].font,'Complete CSS inverse retains '+part+' font');
 assert.deepEqual(inputs(),before,'No current source/test/asset changes during complete CSS inverse');
 assert.deepEqual(sortedAssets(baselineRoot),baselineAssetPins,'Historical baseline assets remain unchanged through every probe');
 result.oldLayoutInverse={baselineCommit:BASE,sourceSha256:layoutMutation.sourceSha256,mutation:'Only the complete Guidance CSS block is restored from the immutable baseline',ledger:pin(path.join(out,'old-layout-edit-ledger.json')),failure:oldLayout.report.error,process:pin(path.join(out,'old-layout-process.json')),receipt:pin(path.join(oldLayout.evidence,'results.json'))};result.status='pass';
}catch(error){result.error={code:error.code||null,message:error.message,stack:error.stack};process.exitCode=1;}
result.completedUtc=new Date().toISOString();write('result.json',result);console.log(JSON.stringify(result));
