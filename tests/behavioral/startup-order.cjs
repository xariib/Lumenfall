'use strict';
// Execute the actual init return-flow functions with controllable I/O boundaries.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8');
const start=source.indexOf('  var appHiddenAt = 0;'),end=source.indexOf('  // Cooperative simulation releases',start);
assert(start>0&&end>start);const code=source.slice(start,end);let checks=0;
function eq(a,b,message){checks++;assert.deepEqual(a,b,message);}
function app(throwOffline){
 const events=[],classes=new Set(['startup-pending']),ctx={events,classes,returnFlowGeneration:0,resumeFlowBusy:false,offlinePending:false,persistenceBlocked:false};
 ctx.document={hidden:false,documentElement:{classList:{remove:n=>classes.delete(n),contains:n=>classes.has(n)}},body:{classList:{toggle(){}}},getElementById:()=>null,querySelectorAll:()=>[],querySelector:()=>({classList:{remove(){}}}),addEventListener:(type,fn)=>{ctx.visibility=fn;}};
 ctx.clock=10000;ctx.Date={now:()=>ctx.clock};ctx.isNewGame=false;ctx.cancelOfflineCatchup=()=>{};ctx.ensureDaily=()=>false;
 Object.assign(ctx,{playStartupIntro:done=>{events.push('intro');ctx.introDone=done;},applyOfflineProgress:done=>{events.push('offline');ctx.offlineDone=done;if(throwOffline)throw Error('offline failed');},saveState:()=>events.push('save'),renderAll:()=>events.push('render'),showReturnFlow:(result,daily)=>events.push(['return',result,daily]),announcePersistenceStatus:()=>events.push('persistence'),showToast:()=>events.push('error')});
 vm.createContext(ctx);vm.runInContext(code,ctx);return ctx;
}
for(const first of ['intro','offline']){
 const a=app();a.beginReturn(true);eq(a.events,['intro','offline'],'intro starts before offline');
 const finish=()=>a.offlineDone({earned:42},null);
 if(first==='intro')a.introDone();else finish();
 eq(a.classes.has('startup-pending'),true,'cover remains while either path is busy');eq(a.resumeFlowBusy,true,'return remains busy');
 if(first==='intro')finish();else a.introDone();
 eq(a.classes.has('startup-pending'),false,'cover removed after both');eq(a.events.filter(e=>Array.isArray(e)),[['return',{earned:42},true]],'exactly one unchanged reward object');eq(a.resumeFlowBusy,false,'return complete');
}
for(const thrown of [false,true]){
 const a=app(thrown);a.beginReturn(false);if(!thrown)a.offlineDone(null,Error('offline failed'));a.introDone();eq(a.classes.has('startup-pending'),false,'error exposes recovery');eq(a.events.includes('error'),true,'error explained');eq(a.events.some(Array.isArray),false,'failure never shows rewards');
}
{
 const a=app();a.beginReturn(false);const oldIntro=a.introDone,oldOffline=a.offlineDone;
 a.returnFlowGeneration++;oldOffline(null,Error('cancelled'));oldIntro();eq(a.classes.has('startup-pending'),true,'cancelled generation cannot uncover startup');
 a.beginReturn(false);a.introDone();a.offlineDone(null,null);eq(a.events.filter(e=>Array.isArray(e)).length,1,'resume completes once');eq(a.events.filter(e=>e==='save').length,1,'zero-offline path retains save');
}
{
 const a=app();a.beginReturn(false);const oldIntro=a.introDone;a.offlineDone({earned:42},null);
 a.document.hidden=true;a.visibility();a.clock+=500;a.document.hidden=false;a.visibility();
 eq(a.events.filter(e=>e==='intro').length,2,'500ms interruption restarts invalidated startup');
 oldIntro();eq(a.classes.has('startup-pending'),true,'stale intro cannot uncover replacement flow');
 a.introDone();a.offlineDone(null,null);eq(a.classes.has('startup-pending'),false,'short resume cannot leave loading cover stuck');
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex')}));
