'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {runProcess}=require('../../scripts/lib/process.cjs');
async function main(){
 const script="const {spawn}=require('node:child_process');const child=spawn(process.execPath,['-e',\"console.log('grandchild '+process.pid);setInterval(()=>{},1000)\"],{stdio:['ignore','inherit','inherit']});setInterval(()=>{},1000);";
 const started=performance.now(),result=await runProcess([process.execPath,'-e',script],{timeout:1000});
 assert(result.timed_out&&result.exitcode===null,'timeout always fails');
 assert(performance.now()-started<5000,'inherited pipes cannot outlive the deadline indefinitely');
 const match=result.stdout.match(/grandchild (\d+)/);assert(match,'real grandchild started with inherited pipes');
 const pid=Number(match[1]);
 let running=true;
 for(let i=0;i<40;i++){
  try{process.kill(pid,0);if(process.platform==='linux'&&fs.readFileSync('/proc/'+pid+'/stat','utf8').split(') ')[1].startsWith('Z'))running=false;}catch(error){if(error.code==='ESRCH'||error.code==='ENOENT')running=false;else throw error;}
  if(!running)break;await new Promise(resolve=>setTimeout(resolve,25));
 }
 assert(!running,'deadline terminates the owned grandchild too');
 const pass=await runProcess([process.execPath,'-e',"console.log('ordinary success')"],{timeout:5000});
 assert.equal(pass.exitcode,0);assert.equal(pass.timed_out,false);assert.equal(pass.stdout.trim(),'ordinary success');
 console.log(JSON.stringify({status:'PASS',checks:7,platform:process.platform,scope:'Owned subprocess trees and inherited pipe deadlines'}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
