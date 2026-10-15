'use strict';
// Run immutable campaign policies in bounded, resumable whole-day chunks.
// Keep the last successful output if a later invocation fails.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const args=process.argv.slice(2),positionals=args.filter((arg,i)=>!arg.startsWith('--')&&(i===0||!args[i-1].startsWith('--')));
const [runner,source,daysText,policy,prefix]=positionals,days=Number(daysText);
function option(name,fallback){const i=args.indexOf(name);return i<0?fallback:args[i+1];}
const chunks=Number(option('--chunks',24)),runMs=Number(option('--run-ms',45000));
assert(runner&&source&&policy&&prefix&&Number.isInteger(days)&&days>0);
assert(Number.isInteger(chunks)&&chunks>0&&chunks<=730);
assert(Number.isFinite(runMs)&&runMs>0);
const snapshot=prefix+'-snapshot.json',checkpointFile=snapshot+'.checkpoint.json',output=prefix+'.json',pending=prefix+'.pending.json';
fs.mkdirSync(path.dirname(snapshot),{recursive:true});
let checkpoint=fs.existsSync(checkpointFile)?JSON.parse(fs.readFileSync(checkpointFile,'utf8')):null;
function status(kind,extra){
 const result={status:kind,runner,source,targetDays:days,policy,checkpointFile,days:checkpoint?checkpoint.history.length:0,sourceSha256:checkpoint&&checkpoint.sourceSha256,policySha256:checkpoint&&checkpoint.policySha256,...extra};
 fs.writeFileSync(prefix+'.batch-status.json',JSON.stringify(result,null,2));
 return result;
}
for(let chunk=0;chunk<chunks&&(!checkpoint||checkpoint.history.length<days);chunk++){
 const env={...process.env,LUMENFALL_CAMPAIGN_RUN_MS:String(runMs),LUMENFALL_CAMPAIGN_SNAPSHOT:snapshot};
 if(checkpoint)env.LUMENFALL_CAMPAIGN_RESUME=checkpointFile;
 else delete env.LUMENFALL_CAMPAIGN_RESUME;
 const fd=fs.openSync(pending,'w');let result;
 try{result=spawnSync(process.execPath,[runner,source,String(days),policy],{env,stdio:['ignore',fd,'inherit'],timeout:1200000,windowsHide:true});}
 finally{fs.closeSync(fd);}
 if(result.error||result.status!==0){status('FAIL',{chunk,error:String(result.error||'Campaign exited '+result.status)});process.exitCode=1;break;}
 const measured=JSON.parse(fs.readFileSync(pending,'utf8'));
 const next=JSON.parse(fs.readFileSync(checkpointFile,'utf8'));
 assert.equal(measured.days,next.history.length,'output and saved endpoint agree');
 assert.equal(next.policy,policy,'policy remains explicit');
 assert(next.history.length>(checkpoint?checkpoint.history.length:0),'successful chunk advances whole days');
 if(checkpoint){assert.equal(next.sourceSha256,checkpoint.sourceSha256);assert.equal(next.policySha256,checkpoint.policySha256);}
 checkpoint=next;fs.renameSync(pending,output);
 status('MEASURED_PARTIAL',{chunk:chunk+1});
}
if(!process.exitCode)console.log(JSON.stringify(status(checkpoint&&checkpoint.history.length>=days?'MEASURED_TARGET_REACHED':'MEASURED_PARTIAL')));
