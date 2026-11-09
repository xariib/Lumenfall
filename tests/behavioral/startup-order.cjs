'use strict';
// Execute the actual init return-flow functions with controllable I/O boundaries.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8');
const start=source.indexOf('  var appHiddenAt = 0;'),end=source.indexOf('  // Cooperative simulation releases',start);
assert(start>0&&end>start);const code=source.slice(start,end);let checks=0;
function eq(a,b,message){checks++;assert.deepEqual(a,b,message);}
function app(throwOffline,hidden=false){
 const events=[],classes=new Set(['startup-pending']),ctx={events,classes,returnFlowGeneration:0,resumeFlowBusy:false,offlinePending:false,persistenceBlocked:false};
 ctx.document={hidden,documentElement:{classList:{remove:n=>classes.delete(n),contains:n=>classes.has(n)}},body:{classList:{toggle(){}}},getElementById:()=>null,querySelectorAll:()=>[],querySelector:()=>({classList:{remove(){}}}),addEventListener:(type,fn)=>{ctx.visibility=fn;}};
 ctx.clock=10000;ctx.Date={now:()=>ctx.clock};ctx.isNewGame=false;ctx.cancelOfflineCatchup=()=>{};ctx.ensureDaily=()=>false;
 ctx.Amount={add:(a,b)=>a+b};
 ctx.feedbackClears=0;ctx.clearAscendFeedback=()=>ctx.feedbackClears++;
 ctx.resetLiveClock=()=>events.push('clock-reset');ctx.flushLiveProgress=allowHidden=>{ctx.allowHidden=allowHidden;events.push('live-flush');return true;};
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
 eq(a.events.filter(e=>e==='clock-reset').length,1,'new live clock starts after successful return exactly once');
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
 eq(a.feedbackClears,1,'background discards live Ascend feedback exactly once');
 eq(a.events.filter(e=>e==='live-flush').length,1,'background flushes live work before saving its endpoint');
 eq(a.allowHidden,true,'hide transition alone authorizes final foreground settlement');
 eq(a.events.filter(e=>e==='intro').length,2,'500ms interruption restarts invalidated startup');
 oldIntro();eq(a.classes.has('startup-pending'),true,'stale intro cannot uncover replacement flow');
 a.introDone();a.offlineDone(null,null);eq(a.classes.has('startup-pending'),false,'short resume cannot leave loading cover stuck');
 eq(a.events.filter(Array.isArray),[['return',{earned:42},false]],'committed recap survives the interrupted intro');
 a.beginReturn(false);a.introDone();a.offlineDone(null,null);
 eq(a.events.filter(Array.isArray),[['return',{earned:42},false],['return',null,false]],'shown recap does not repeat');
}
{
 const a=app(false,true);
 const result={elapsedSec:60,earned:42,shardEarned:3,sigilsEarned:0,motesEarned:2,ascends:0,completedStudies:['A'],closedStudies:[]};
 a.beginReturn(false);a.offlineDone(result,null);a.introDone();
 eq(a.events.filter(Array.isArray),[],'hidden startup retains the committed recap without presenting it');
 a.clock+=10000;a.document.hidden=false;a.visibility();
 a.offlineDone({...result,earned:8,completedStudies:['B'],retreated:true,endDepth:19,pushDepth:20},null);a.introDone();
 eq(a.events.filter(Array.isArray),[['return',{elapsedSec:120,earned:50,shardEarned:6,sigilsEarned:0,motesEarned:4,ascends:0,completedStudies:['A','B'],closedStudies:[],retreated:true,endDepth:19,pushDepth:20},false]],'return shows both committed windows once');
}
{
 const a=app();a.classes.delete('startup-pending');a.document.hidden=true;a.visibility();a.clock+=500;a.document.hidden=false;a.visibility();
 eq(a.events.filter(e=>e==='clock-reset').length,1,'settled short resume restarts foreground clock');eq(a.events.includes('offline'),false,'sub-second return retains original no-offline path');
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex')}));
