'use strict';
// Diagnostic continuation only. Existing scenario gates remain authoritative.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{spawn}=require('child_process');
const {SCENARIOS}=require('../../../tests/behavioral/scenarios.json');
const root=path.resolve(__dirname,'../../..'),stage='docs/qa/endless-progression-001/atomic-web',out='docs/qa/endless-progression-001/atomic-remainder';
fs.mkdirSync(out,{recursive:true});
const sourceSha256=crypto.createHash('sha256').update(fs.readFileSync(stage+'/index.html')).digest('hex');
const cases=Object.keys(SCENARIOS),start=cases.indexOf('offline-catchup-core');if(start<0)throw Error('continuation marker');
const records=[];
function testHash(){const h=crypto.createHash('sha256');for(const name of fs.readdirSync('tests/behavioral').filter(n=>/\.(js|cjs|json)$/.test(n)).sort()){h.update(name);h.update(fs.readFileSync('tests/behavioral/'+name));}return h.digest('hex');}
async function run(scenario){
 const log=out+'/'+scenario+'.log',fd=fs.openSync(log,'w'),testSha256=testHash(),began=Date.now();
 let watchdog=false;
 const child=spawn(process.execPath,['tests/behavioral/run.cjs','--web-root',stage,'--scenario',scenario,'--raw-artifacts',out+'/raw'],{cwd:root,stdio:['ignore',fd,fd],windowsHide:true});
 const timer=setTimeout(()=>{watchdog=true;if(process.platform==='win32'){const kill=spawn('taskkill',['/PID',String(child.pid),'/T','/F'],{stdio:'ignore',windowsHide:true});kill.once('exit',()=>child.kill('SIGKILL'));kill.once('error',()=>child.kill('SIGKILL'));}else child.kill('SIGKILL');},360000);
 const result=await new Promise(resolve=>{child.once('error',error=>resolve({error:String(error)}));child.once('exit',(code,signal)=>resolve({code,signal}));});
 clearTimeout(timer);fs.closeSync(fd);const text=fs.readFileSync(log,'utf8');
 const status=result.code===0&&!watchdog&&text.includes('Behavioral QA passed:')?'PASS':'FAIL';
 const record={scenario,status,sourceSha256,testSha256,wallMs:Date.now()-began,watchdog,...result,log};
 records.push(record);fs.writeFileSync(out+'/summary.json',JSON.stringify({status:'IN_PROGRESS',records},null,2));console.error(status+' '+scenario+' '+Math.round(record.wallMs/1000)+'s');
}
(async()=>{for(const scenario of cases.slice(start))await run(scenario);fs.writeFileSync(out+'/summary.json',JSON.stringify({status:records.every(r=>r.status==='PASS')?'PASS':'FAIL',records},null,2));if(records.some(r=>r.status!=='PASS'))process.exitCode=1;})();
