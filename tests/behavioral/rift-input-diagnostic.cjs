'use strict';
// Auxiliary investigation only. Original assertions and 15-second deadlines stay.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const mode=process.argv[2],out=path.resolve(process.argv[3]);
if(!['trace','agents'].includes(mode))throw Error('trace or agents required');
fs.mkdirSync(out,{recursive:true});
global.riftInputDiagnostic={mode,selector:null,check:null,trace:[],record(kind,value){this.trace.push({at:Date.now(),kind,...value});if(this.trace.length>400)this.trace.shift();},save(value){fs.writeFileSync(path.join(out,'diagnostic.json'),JSON.stringify({mode,selector:this.selector,check:this.check,trace:this.trace,...value},null,2));}};
const original=Module.prototype._compile;
Module.prototype._compile=function(source,filename){
 if(/lab-(boost-queue|speed-presets)-ui\.cjs$/.test(filename))source=source.replace('async function touch(selector){','async function touch(selector){global.riftInputDiagnostic.selector=selector;');
 if(filename.endsWith('lab-speed-controls.cjs')){
  const replace=(from,to)=>{if(source.split(from).length!==2)throw Error('Diagnostic anchor '+from);source=source.replace(from,to);};
  replace('checks++;assert(value,message);','checks++;global.riftInputDiagnostic.check=message;assert(value,message);');
  replace('const id=++seq,timer=',"global.riftInputDiagnostic.record('send',{method,selector:global.riftInputDiagnostic.selector,params:method==='Runtime.evaluate'?{expression:params.expression.slice(0,180)}:params});const id=++seq,timer=");
  replace('const m=JSON.parse(raw),p=pending.get(m.id);',"const m=JSON.parse(raw),p=pending.get(m.id);global.riftInputDiagnostic.record('receive',{id:m.id,method:m.method,error:m.error,params:m.method==='Page.javascriptDialogOpening'?m.params:undefined});");
  if(mode==='agents')replace("await send('Page.enable');","await send('Page.enable');await send('Runtime.enable');await send('DOM.enable');");
  replace("result={status:'fail',sourceSha256,mutation,checks,profiles:records,error:e.stack,stderr};",`global.riftInputDiagnostic.save({failure:e.stack,checks,profiles:records});
   const probe=async(method,params={},sid=session)=>{try{return await Promise.race([send(method,params,sid),new Promise((_,reject)=>setTimeout(()=>reject(Error('diagnostic probe 2s')),2000))]);}catch(e){return {error:e.message};}};
   const probes=await Promise.all([probe('Browser.getVersion',{},null),probe('Runtime.evaluate',{expression:'JSON.stringify({ready:document.readyState,active:document.activeElement&&document.activeElement.outerHTML.slice(0,600),animations:document.getAnimations().map(a=>({state:a.playState,time:a.currentTime})),errors:window.uiRegressionErrors})',returnByValue:true})]);
   global.riftInputDiagnostic.save({failure:e.stack,checks,profiles:records,probes});result={status:'fail',sourceSha256,mutation,checks,profiles:records,error:e.stack,stderr};`);
  replace('console.log(JSON.stringify(result));',"if(result.status==='pass')global.riftInputDiagnostic.save({status:'pass',checks,version:result.version});console.log(JSON.stringify(result));");
 }
 return original.call(this,source,filename);
};
process.argv=[process.execPath,path.join(__dirname,'lab-speed-controls.cjs'),'index.html','--boost-queue'];
require('./lab-speed-controls.cjs');
