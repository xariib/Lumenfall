'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const source=process.argv[2]||path.join(__dirname,'../../index.html'),out=process.argv[3]||'/tmp/lumenfall-f21-negative';
fs.mkdirSync(out,{recursive:true});const records=[];
for(const mutation of ['handler','ui','raw','refund','credit','free-credit','wallet','receipt','cache','credit-record','ascend-copy','version-check','credit-reconcile','missing-receipt','missing-audit-history','missing-audit-proof','quote-copy']){
  const output=path.join(out,mutation+'.json');
  const result=spawnSync(process.execPath,[path.join(__dirname,'cheaper-recruitment-development.cjs'),'--source',source,'--mutation',mutation,'--output',output],{encoding:'utf8',timeout:180000});
  assert(!result.error,'runner error '+mutation+' '+result.error);
  assert.equal(result.status,1,'causal mutant must fail '+mutation+' '+result.stdout+result.stderr);
  const evidence=JSON.parse(fs.readFileSync(output,'utf8'));
  assert.equal(evidence.status,'FAIL');
  assert(evidence.browserIdentity && /Chrom(e|ium)/.test(evidence.browserIdentity.version),'actual browser required '+mutation);
  assert(!/TypeError|ReferenceError|SyntaxError|timeout|browser closed|Chromium required|ENOENT|EACCES|EPERM|spawn|CDP /i.test(evidence.failure),'must fail a behavioral assertion '+mutation+' '+evidence.failure);
  records.push({mutation,sourceSha256:evidence.sourceSha256,assertion:evidence.failure.split('\n')[0]});
  console.log('Killed '+mutation+': '+evidence.failure.split('\n')[0]);
}
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({status:'PASS',controls:records.length,records},null,2)+'\n');
