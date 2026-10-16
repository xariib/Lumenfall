'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),cp=require('node:child_process');
const {releaseVersion}=require('../../scripts/ci/android-release-version.cjs');
const {setVersion}=require('../../scripts/ci/set_android_version.cjs');
const {archivedBaseline}=require('../../scripts/ci/guidance-archived-baseline.cjs');
const {restoreBaselineAssets}=require('../../scripts/ci/guidance-baseline-assets.cjs');
const {verify:verifyUpgrade}=require('../../scripts/ci/verify_upgrade_receipt.cjs');
const root=path.resolve(__dirname,'../..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-migration-'));
try{
 const v=releaseVersion('1');assert.equal(v.versionCode,1000001);assert.equal(v.versionName,'0.2.1');assert(releaseVersion('2').versionCode>v.versionCode);
 const apk=path.join(temp,'test.apk'),receipt=path.join(temp,'upgrade.json');fs.writeFileSync(apk,'synthetic receipt-binding fixture');assert.throws(()=>verifyUpgrade(receipt,apk,v.versionCode));
 const complete={status:'PASS',uidRetained:true,bothSaveSlotsRetained:true,progressAndPaidStudyRetained:true,package:'com.lumenfall.app',origin:'https://localhost',physicalDevice:false,beforeUid:'123',afterUid:'123',candidateVersionCode:v.versionCode,baselineVersionCode:158,apkSha256:require('node:crypto').createHash('sha256').update(fs.readFileSync(apk)).digest('hex')};
 fs.writeFileSync(receipt,JSON.stringify(complete));assert.equal(verifyUpgrade(receipt,apk,v.versionCode).status,'PASS');
 for(const change of [{status:'RUNNING'},{bothSaveSlotsRetained:false},{afterUid:'456'},{candidateVersionCode:158},{apkSha256:'0'.repeat(64)}]){fs.writeFileSync(receipt,JSON.stringify({...complete,...change}));assert.throws(()=>verifyUpgrade(receipt,apk,v.versionCode));}
 for(const x of ['',0,-1,'1.5','NaN','2099000001'])assert.throws(()=>releaseVersion(x));
 const file=path.join(temp,'build.gradle');fs.writeFileSync(file,'versionCode 1\nversionName "1.0"\n');setVersion(file,String(v.versionCode),v.versionName);assert.match(fs.readFileSync(file,'utf8'),/versionCode 1000001\nversionName "0.2.1"/);
 const baseline=archivedBaseline(root);assert.equal(baseline.source.length,657751);
 const restored=restoreBaselineAssets('684bfc52bb2ca523124fe63981188b9a8004d747',path.join(temp,'assets'),(id,args)=>id==='baseline-assets-tree'?baseline.tree:cp.execFileSync(args[0],args.slice(1),{cwd:root}));assert.equal(restored.assets.length,14);
 const damaged=path.join(temp,'damaged');fs.mkdirSync(path.join(damaged,'docs/qa/guidance-readability-001/development-acceptance-015'),{recursive:true});fs.writeFileSync(path.join(damaged,'docs/qa/guidance-readability-001/development-acceptance-015/whole-tree.json'),'{}');fs.writeFileSync(path.join(damaged,'docs/qa/guidance-readability-001/development-acceptance-015/complete-diff.patch'),'');assert.throws(()=>archivedBaseline(damaged));
 const workflow=fs.readFileSync(path.join(root,'.github/workflows/build-android.yml'),'utf8');assert(!/^  push:/m.test(workflow));assert(workflow.includes('secrets.LUMENFALL_KEYSTORE_BASE64'));assert(!workflow.includes('git push origin --force'));assert(workflow.includes('release-ci-gate.cjs'));assert(!workflow.includes('EXPECTED_VERSION_CODE: "${{ github.run_number }}"'));
 console.log(JSON.stringify({status:'PASS',version:v,monotonicity:true,invalidVersionsRejected:6,missingOrWrongUpgradeReceiptsRejected:6,gradleAndVerifierUseSharedVersion:true,historicalSourceAnd14AssetsRestored:true,damagedHistoryRejected:true,noPushPublication:true}));
}finally{fs.rmSync(temp,{recursive:true,force:true});}
