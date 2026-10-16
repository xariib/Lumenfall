'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const dir='docs/qa/endless-progression-001/deed-audit';fs.mkdirSync(dir,{recursive:true});const rows=[];
for(const policy of ['regular','regular_two','casual','frequent','efficient']){
 const env={...process.env};for(const key of ['LUMENFALL_CAMPAIGN_SNAPSHOT','LUMENFALL_CAMPAIGN_RESUME','LUMENFALL_CAMPAIGN_RUN_MS','LUMENFALL_CAMPAIGN_PROGRESS'])delete env[key];
 const result=spawnSync(process.execPath,['validation-evidence/deed-audit/tests/behavioral/endless-campaign.cjs','docs/qa/endless-progression-001/candidate-ak.html','12',policy],{env,encoding:'utf8',timeout:600000,maxBuffer:8*1024*1024,windowsHide:true});
 fs.writeFileSync(dir+'/'+policy+'.log',result.stdout);fs.writeFileSync(dir+'/'+policy+'.stderr.log',result.stderr);
 assert.ifError(result.error);assert.equal(result.status,0,result.stderr);const row=JSON.parse(result.stdout);assert.equal(row.status,'PASS');assert(row.firstAttempt.comets>=100);
 rows.push(row);fs.writeFileSync(dir+'/summary.json',JSON.stringify({status:'PASS',rows,limits:'Original immutable policy with observation hooks; original omitted Idle8 reward cannot move an already-funded first Auto-Ascend attempt. No policy choice otherwise spends Comets.'},null,2));
 console.log(JSON.stringify({policy,day:row.day,comets:row.firstAttempt.comets}));
}
