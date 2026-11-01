'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const controller=html.slice(html.indexOf('var appUpdate = {'),html.indexOf('\nfunction closeSettings(){'));
assert(controller.includes('function initAppUpdater()'),'Production controller found');
const elements=new Map(),listeners={},calls=[];
const element=id=>{if(!elements.has(id))elements.set(id,{style:{},value:0,attributes:{},addEventListener(type,fn){this[type]=fn;},setAttribute(k,v){this.attributes[k]=v;}});return elements.get(id);};
let info={currentVersion:'0.2.69',available:false,ready:false},saveResult=true,installResult={status:'cancelled'},checkError=null,downloadError=null,downloadWait=null;
const plugin={
  getState:async()=>({...info}),
  check:async options=>{calls.push(['check',options]);if(checkError)throw Error(checkError);return {...info};},
  addListener:async(event,fn)=>{listeners[event]=fn;},
  cancel:async()=>{calls.push(['cancel']);},
  download:async()=>{calls.push(['download']);if(downloadWait)await downloadWait;if(downloadError)throw Error(downloadError);info.ready=true;return {...info};},
  install:async()=>{calls.push(['install']);return installResult;}
};
const document={hidden:false,getElementById:element,addEventListener(type,fn){listeners[type]=fn;}};
const context=vm.createContext({document,window:{},Promise,Error,Math,showToast:message=>calls.push(['toast',message]),resetInProgress:false,reloadInProgress:false,flushLiveProgress:()=>{calls.push(['flush']);return true;},saveState:()=>{calls.push(['save']);return saveResult;}});
vm.runInContext(controller,context);
const settle=async()=>{for(let i=0;i<20;i++)await Promise.resolve();};
async function main(){
  context.initAppUpdater();assert.equal(context.appUpdate.plugin,null,'Browser makes no native/network calls');
  context.window.Capacitor={isNativePlatform:()=>true,isPluginAvailable:()=>true,Plugins:{AppUpdater:plugin}};
  context.initAppUpdater();await settle();assert.equal(element('app-update-section').style.display,'block');
  assert(calls.some(c=>c[0]==='check'&&c[1].force===false),'Startup automatic check');
  info={...info,available:true,version:'0.2.70',bytes:10485760};
  await context.checkAppUpdate(true);assert.equal(element('app-update-action').textContent,'Download & install');
  assert(element('app-update-status').textContent.includes('10.0 MB'));
  const toastCount=calls.filter(c=>c[0]==='toast').length;
  await context.checkAppUpdate(false);assert.equal(calls.filter(c=>c[0]==='toast').length,toastCount,'No repeated notification');
  context.startAppUpdate();await settle();
  const actions=calls.map(c=>c[0]);assert(actions.indexOf('download')<actions.indexOf('flush'));assert(actions.indexOf('flush')<actions.indexOf('save'));assert(actions.indexOf('save')<actions.indexOf('install'));
  assert.equal(element('app-update-action').textContent,'Install update');assert(element('app-update-status').textContent.includes('cancelled'),'Installer cancellation retains retry');
  saveResult=false;const installs=calls.filter(c=>c[0]==='install').length;
  context.startAppUpdate();await settle();assert.equal(calls.filter(c=>c[0]==='install').length,installs,'Save failure prevents installer');
  assert(element('app-update-status').textContent.includes('could not be saved'));
  saveResult=true;checkError='Offline';await context.checkAppUpdate(true);assert.equal(element('app-update-status').textContent,'Offline');assert.equal(context.appUpdate.info.ready,true,'Offline check retains verified download');checkError=null;
  info.ready=false;context.appUpdate.info={...info};downloadError='Download cancelled.';
  context.startAppUpdate();await settle();assert.equal(element('app-update-status').textContent,'Download cancelled.');assert.equal(element('app-update-action').disabled,false,'Download failure allows retry');downloadError=null;
  let finish;downloadWait=new Promise(resolve=>{finish=resolve;});context.startAppUpdate();await settle();
  listeners.progress({received:25,total:100});assert.equal(element('app-update-progress').value,25);
  element('app-update-cancel').click();await settle();assert(calls.some(c=>c[0]==='cancel'));
  const downloadCount=calls.filter(c=>c[0]==='download').length;context.startAppUpdate();assert.equal(calls.filter(c=>c[0]==='download').length,downloadCount,'No double download');
  document.hidden=true;finish();await settle();assert.equal(calls.filter(c=>c[0]==='install').length,installs,'Background completion does not launch installer');
  assert.equal(element('app-update-action').textContent,'Install update');
  document.hidden=false;listeners.visibilitychange();await settle();assert.equal(context.appUpdate.busy,false);
  console.log('PASS production updater controller: browser fallback, automatic/manual checks, download/progress/cancel/retry, save-before-install, denied save, offline retention, background completion');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
