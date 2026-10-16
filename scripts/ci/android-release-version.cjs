'use strict';
const assert=require('node:assert/strict');
// A repository-independent epoch leaves historical run-number builds behind.
const VERSION_CODE_BASE=1000000;
const HISTORICAL_VERSION_FLOOR=158;
function releaseVersion(runNumber){
  assert(/^\d+$/.test(String(runNumber||'')),'Positive integer workflow run number required');
  const run=Number(runNumber),code=VERSION_CODE_BASE+run;
  assert(Number.isSafeInteger(run)&&run>0&&code<=2100000000,'Android versionCode out of range');
  assert(code>HISTORICAL_VERSION_FLOOR,'Android versionCode must exceed historical releases');
  return {versionCode:code,versionName:'0.2.'+run};
}
function assertNewerThanPublished(code,releases){
 let floor=HISTORICAL_VERSION_FLOOR;
 for(const r of releases){
  if(r.draft||!(r.assets||[]).some(a=>/\.apk$/i.test(a.name)))continue;
  const match=/^android-(\d+)$/.exec(r.tag_name);assert(match,'Published APK has an unknown version tag; inspect its actual version before release');
  floor=Math.max(floor,Number(match[1]));
 }
 assert(code>floor,'Android versionCode must exceed every published APK; refusing stale run or downgrade');return floor;
}
module.exports={releaseVersion,assertNewerThanPublished,VERSION_CODE_BASE,HISTORICAL_VERSION_FLOOR};
if(require.main===module){
  const v=releaseVersion(process.env.GITHUB_RUN_NUMBER);
  const fs=require('node:fs');
  assert.equal(process.env.GITHUB_REPOSITORY,'xariib/Lumenfall');
  const releases=JSON.parse(require('node:child_process').execFileSync('gh',['api','--paginate','--slurp','repos/'+process.env.GITHUB_REPOSITORY+'/releases?per_page=100'],{encoding:'utf8'})).flat();
  const floor=assertNewerThanPublished(v.versionCode,releases);
  if(process.argv[2]==='--check-published'){assert.equal(String(v.versionCode),process.env.EXPECTED_VERSION_CODE);console.log('Release version '+v.versionCode+' exceeds published floor '+floor);process.exit(0);}
  assert.equal(process.argv.length,2,'Unexpected version command argument');
  assert(process.env.GITHUB_ENV,'GitHub environment file required');
  fs.appendFileSync(process.env.GITHUB_ENV,`BUILD_NUMBER=${v.versionCode}\nEXPECTED_VERSION_CODE=${v.versionCode}\nEXPECTED_VERSION_NAME=${v.versionName}\n`);
  console.log(JSON.stringify(v));
}
