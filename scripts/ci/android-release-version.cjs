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
module.exports={releaseVersion,VERSION_CODE_BASE,HISTORICAL_VERSION_FLOOR};
if(require.main===module){
  const v=releaseVersion(process.env.GITHUB_RUN_NUMBER);
  const fs=require('node:fs');
  assert(process.env.GITHUB_ENV,'GitHub environment file required');
  fs.appendFileSync(process.env.GITHUB_ENV,`BUILD_NUMBER=${v.versionCode}\nEXPECTED_VERSION_CODE=${v.versionCode}\nEXPECTED_VERSION_NAME=${v.versionName}\n`);
  console.log(JSON.stringify(v));
}
