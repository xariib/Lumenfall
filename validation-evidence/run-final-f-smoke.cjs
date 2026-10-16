'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const {serve}=require('../scripts/lib/static-server.cjs'),{runProcess}=require('../scripts/lib/process.cjs'),{installGuard,checkSmoke}=require('../scripts/ci/smoke.cjs');
(async()=>{
 const out=path.resolve('validation-evidence/final-f-smoke');fs.mkdirSync(out,{recursive:true});
 const stage=path.join(out,'www');fs.mkdirSync(stage,{recursive:true});
 const original=fs.readFileSync('index.html');fs.writeFileSync(path.join(stage,'index.html'),original);
 for(const dir of ['fonts','branding'])fs.cpSync(dir,path.join(stage,dir),{recursive:true});
 installGuard(path.join(stage,'index.html'));
 const profile=fs.mkdtempSync(path.join(out,'profile-')),server=await serve(stage);
 try{
  const command=[process.env.LUMENFALL_QA_CDP_CHROME,'--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--user-data-dir='+profile,'--window-size=390,844','--virtual-time-budget=1800','--dump-dom','http://127.0.0.1:'+server.address().port+'/index.html'];
  const result=await runProcess(command,{timeout:30000});
  fs.writeFileSync(path.join(out,'dom.html'),result.stdout);fs.writeFileSync(path.join(out,'chrome.txt'),result.stderr);
  assert.equal(result.timed_out,false);assert.equal(result.exitcode,0);
  checkSmoke(path.join(out,'dom.html'),path.join(out,'chrome.txt'),true);
  assert(fs.readFileSync('index.html').equals(original),'product remains unchanged');
  assert(fs.readFileSync('mobile/www/index.html').equals(original),'active stage remains unchanged');
  fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({status:'PASS',sourceSha256:crypto.createHash('sha256').update(original).digest('hex'),command,exitcode:result.exitcode,elapsedSec:result.elapsed_sec,guard:'temporary copy only'},null,2));
 }finally{await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
