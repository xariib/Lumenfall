const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const src=fs.readFileSync(path.resolve(__dirname,'../../../tests/behavioral/forge-lab-caps-mobile.cjs'),'utf8');
const current=JSON.parse(src.match(/^\s{4}("async function ready.*")\);$/m)[1]);
const original=JSON.parse(src.match(/^one\(("async function ready.*"),$/m)[1]);
function fixture(code,fault){let clock=0,calls=0,pauses=0;const ev=async()=>{calls++;const error=fault(calls);if(error)throw error;return true;},pause=async()=>{pauses++;clock+=5000;};const ready=new Function('ev','pause','Date','return ('+code+');')(ev,pause,{now:()=>clock});return {ready,stats:()=>({calls,pauses,clock})};}
(async()=>{
 const navigation=Error('{"code":-32000,"message":"Inspected target navigated or closed"}');
 const good=fixture(current,n=>n===1?navigation:null);await good.ready();assert.equal(good.stats().pauses,1);
 const bad=fixture(original,n=>n===1?navigation:null);await assert.rejects(bad.ready(),e=>e===navigation);
 for(const message of ['browser closed','ReferenceError: real game failure']){const error=Error(message),f=fixture(current,()=>error);await assert.rejects(f.ready(),e=>e===error);assert.equal(f.stats().pauses,0);}
 const deadline=fixture(current,()=>navigation);await assert.rejects(deadline.ready(),/Game initialization deadline/);assert.equal(deadline.stats().clock,10000);assert.equal(deadline.stats().pauses,2);
 const result={status:'PASS',checks:['expected navigation transition retries readiness only','original defect is caught','closed browser propagates immediately','game error propagates immediately','original 10000ms deadline retained']};
 fs.writeFileSync(path.join(__dirname,'readiness-controls.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exitCode=1;});
