'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {runProcess}=require('../scripts/lib/process.cjs');const args=process.argv.slice(2),dir=args.shift();assert(dir&&args.length);fs.mkdirSync(dir,{recursive:true});
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
(async()=>{const records=[];for(const name of args){assert(/^[a-z0-9-]+$/.test(name));const file='tests/behavioral/'+name+'.cjs',sourceSha256=hash('index.html'),testSha256=hash(file),command=[process.execPath,file,'index.html'];
 if(name!=='lab-expansion-stress')command.push('--negative');if(name==='wisp-contribution-core')command.push('--preservation');
 const started=performance.now(),result=await runProcess(command,{timeout:900000});fs.writeFileSync(path.join(dir,name+'.log'),result.stdout);fs.writeFileSync(path.join(dir,name+'.stderr.log'),result.stderr);
 let detail;try{detail=JSON.parse(result.stdout);}catch{}
 const row={name,sourceSha256,testSha256,unchangedSource:sourceSha256===hash('index.html'),unchangedTest:testSha256===hash(file),code:result.exitcode,timedOut:result.timed_out,seconds:(performance.now()-started)/1000,status:result.exitcode===0&&!result.timed_out?'PASS':'FAIL',error:detail?.error?.message||detail?.error||result.stderr.slice(-2000)};
 records.push(row);fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify({status:records.every(r=>r.status==='PASS'&&r.unchangedSource&&r.unchangedTest)?'PASS':'FAIL',records},null,2));console.log(JSON.stringify(row));
 }if(records.some(r=>r.status!=='PASS'||!r.unchangedSource||!r.unchangedTest))process.exitCode=1;
})();
