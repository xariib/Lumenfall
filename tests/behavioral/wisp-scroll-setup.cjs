'use strict';
// Replay the entrance-animation boundary that made the Windows reflow check
// intermittent. Exercise the real driver, CSS animation and scroll assertions.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {runProcess}=require('../../scripts/lib/process.cjs');
const args=process.argv.slice(2),sourcePath=path.resolve(args[0]||'index.html');
const evidence=path.resolve(args[1]||'validation-evidence/wisp-scroll-setup');
const driver=path.join(__dirname,'wisp-rarity-scroll.cjs');
if(args.includes('--child')){
 const Module=require('node:module');let code=fs.readFileSync(driver,'utf8');
 const replace=(anchor,value)=>{assert.equal(code.split(anchor).length,2,'unique setup replay anchor');code=code.replace(anchor,()=>value);};
 const wait="await settledSetup('controlled-reflow');";
 replace(wait,`await ev(\`(()=>{
  var panel=document.querySelector('#tab-spirits');
  panel.style.animation='none';void panel.offsetHeight;panel.style.animation='';
  var animation=panel.getAnimations()[0];
  window.__wispSetupAnimation=animation;
  if(animation){animation.pause();animation.currentTime=0;}
 })()\`);${args.includes('--mutate-setup-wait')?'':wait}`);
 // Hold four frames before releasing the real animation. Without the
 // animation check, three identical frames can look stable while paused.
 // Without the wait it stays at frame zero until the render below, so the race is
 // deterministic and does not depend on machine speed or a longer sleep.
 replace('function frame(){if(ended)return;try{',
  'function frame(){if(ended)return;if(window.__wispSetupAnimation&&frames===4)window.__wispSetupAnimation.finish();try{');
 if(args.includes('--mutate-animation-check'))replace('stable=!animating&&geometry===previous?stable+1:0;', 'stable=geometry===previous?stable+1:0;');
 replace("\n  await ev('uiRegression.render()');\n",
  "\n  await ev('if(window.__wispSetupAnimation)window.__wispSetupAnimation.finish();uiRegression.render()');\n");
 process.argv=[process.execPath,driver,sourcePath,'--role-only','--empower-only'];
 const mod=new Module(driver,module);mod.filename=driver;mod.paths=Module._nodeModulePaths(path.dirname(driver));mod._compile(code,driver);
}else{
 (async()=>{
  fs.mkdirSync(evidence,{recursive:true});const records=[];
  for(const mutation of (args.includes('--negative')?[null,'setup-wait','animation-check']:[null])){
   const result=await runProcess([process.execPath,__filename,sourcePath,evidence,'--child',...(mutation?['--mutate-'+mutation]:[])],{timeout:90000});
   const name=mutation?'without-'+mutation:'settled-setup';
   fs.writeFileSync(path.join(evidence,name+'.json'),result.stdout);
   fs.writeFileSync(path.join(evidence,name+'.stderr.log'),result.stderr);
   assert(!result.timed_out,name+' finishes within the original deadline');
   assert(result.stdout.trim(),name+' returned driver JSON: '+result.stderr);
   const data=JSON.parse(result.stdout);assert(!data.teardown,name+' cleans up browser and staging');
   if(mutation){
    assert.equal(result.exitcode,1);assert.equal(data.status,'fail');assert.equal(data.checks,4);
    assert(data.error.includes('periodic reflow keeps focused action screen position'),'setup regression fails the original position assertion');
    assert.equal(data.reflows[0].after.card,'stone','focus is retained during the animation race');
    assert(Math.abs(data.reflows[0].after.top-data.reflows[0].before.top)>1);
   }else{
    assert.equal(result.exitcode,0);assert.equal(data.status,'pass');assert.equal(data.reflows.length,12);
    for(const row of data.reflows){assert(Math.abs(row.after.top-row.before.top)<=1);assert.equal(row.after.card,'stone');}
   }
   records.push({name,exitcode:result.exitcode,status:data.status,checks:data.checks,sourceSha256:data.sourceSha256,reflows:data.reflows,version:data.version});
  }
  for(const record of records)assert.equal(records[0].sourceSha256,record.sourceSha256,'only test setup is mutated; game bytes stay identical');
  const receipt={status:'pass',node:process.version,platform:process.platform,records};
  fs.writeFileSync(path.join(evidence,'receipt.json'),JSON.stringify(receipt,null,2));
  console.log(JSON.stringify(receipt));
 })().catch(error=>{console.error(error);process.exitCode=1;});
}
