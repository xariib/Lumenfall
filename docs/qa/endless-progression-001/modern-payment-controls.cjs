'use strict';
const fs=require('fs'),{spawnSync}=require('child_process');
const out=process.argv[2]||'docs/qa/endless-progression-001/final-modern-payment-controls';fs.mkdirSync(out,{recursive:true});
const workflow=fs.readFileSync('.github/workflows/pre-merge-validation.yml','utf8');
const marker='const expected = ',start=workflow.indexOf(marker+'{handler:');
const expected=Function('return ('+workflow.slice(start+marker.length,workflow.indexOf(';',start))+')')();const records=[];
for(const mutation of (process.argv.length>3?process.argv.slice(3):Object.keys(expected))){
 const output=out+'/'+mutation+'.json';const run=spawnSync(process.execPath,['tests/behavioral/cheaper-recruitment.cjs','--source','index.html','--mutation',mutation,'--output',output],{encoding:'utf8',timeout:180000});
 const result=fs.existsSync(output)?JSON.parse(fs.readFileSync(output)):{};const failure=result.failure||run.error?.message||run.stderr;
 const causal=run.status===1&&result.status==='FAIL'&&failure.includes(expected[mutation])&&result.teardown?.browser?.code===0&&result.teardown?.pending===0;
 records.push({mutation,causal,sourceSha256:result.sourceSha256,expected:expected[mutation],assertion:failure.split('\n')[0]});console.error(mutation+' '+(causal?'CAUSAL':'OPEN')+' '+failure.split('\n')[0]);
 fs.writeFileSync(out+'/summary.json',JSON.stringify({status:records.every(r=>r.causal)?'PASS':'FAIL',records},null,2));
}if(records.some(r=>!r.causal))process.exitCode=1;
