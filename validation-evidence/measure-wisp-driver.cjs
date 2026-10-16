'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {runProcess}=require('../scripts/lib/process.cjs');
const started=performance.now(),source='index.html',driver='tests/behavioral/wisp-rarity-scroll.cjs';
(async()=>{
 const result=await runProcess([process.execPath,'--require',path.resolve(__dirname,'wisp-driver-timing.cjs'),driver,source],{timeout:90000});
 let detail;try{detail=JSON.parse(result.stdout);}catch(error){detail={status:'invalid',error:error.message};}
 const report={status:!result.timed_out&&result.exitcode===0&&detail.status==='pass'?'PASS':'FAIL',elapsedMs:performance.now()-started,
   sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),driverSha256:crypto.createHash('sha256').update(fs.readFileSync(driver)).digest('hex'),
   process:{exitcode:result.exitcode,timedOut:result.timed_out,stderr:result.stderr},body:{status:detail.status,checks:detail.checks,error:detail.error,teardown:detail.teardown},limit:90000};
 fs.writeFileSync('docs/qa/endless-progression-001/wisp-driver-timing.json',JSON.stringify(report,null,2));
 fs.writeFileSync('validation-evidence/wisp-driver-timing-raw.json',result.stdout);
 console.log(JSON.stringify(report));if(report.status!=='PASS')process.exitCode=1;
})();
