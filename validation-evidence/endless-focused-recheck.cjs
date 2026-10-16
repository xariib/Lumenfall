'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {runProcess}=require('../scripts/lib/process.cjs');
const dir='docs/qa/endless-progression-001/applied-focused-verified';fs.mkdirSync(dir,{recursive:true});
const sourceSha256=crypto.createHash('sha256').update(fs.readFileSync('index.html')).digest('hex');
const cases=[...['anchor','focus','periodic'].map(name=>({name:'wisp-'+name,negative:true,args:['tests/behavioral/wisp-rarity-scroll.cjs','index.html','--mutate-'+name],timeout:90000})),
 ...['p2-wisp-progression-pacing','p2-endgame-currency-utility','wisp-rarity-scroll'].map(name=>({name,args:['tests/behavioral/run.cjs','--web-root','mobile/www','--scenario',name,'--raw-artifacts',path.join(process.env.TEMP||process.env.TMP,'lf-endless-focused-'+name)],timeout:120000}))];
(async()=>{const records=[];for(const row of cases){
 const start=performance.now(),result=await runProcess([process.execPath,...row.args],{timeout:row.timeout});
 fs.writeFileSync(path.join(dir,row.name+'.log'),result.stdout);fs.writeFileSync(path.join(dir,row.name+'.stderr.log'),result.stderr);
 let detail;try{detail=JSON.parse(result.stdout);}catch{}
 const complete=!result.timed_out&&result.exitcode===(row.negative?1:0);
 const observed=row.negative?complete&&detail?.status==='fail'&&/^AssertionError \[ERR_ASSERTION\]:/.test(detail.error||''):complete&&result.stdout.includes('PASS '+row.name);
 const record={name:row.name,status:observed?(row.negative?'COMPLETED_ASSERTION_FAILURE':'PASS'):'FAIL',elapsedMs:performance.now()-start,exitcode:result.exitcode,timedOut:result.timed_out,error:detail?.error};records.push(record);
 console.log(JSON.stringify(record));fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify({status:records.every(r=>r.status!=='FAIL')?'OBSERVED':'FAIL',sourceSha256,records,limits:'Original deadlines/assertions retained; completed negative assertions require causal-message review.'},null,2));
 }if(records.some(r=>r.status==='FAIL'))process.exitCode=1;
})();
