'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawn}=require('node:child_process');
const out=__dirname,sourceRoot=path.dirname(out),deb=path.join(sourceRoot,'google-chrome.deb');
const expectedDeb='c58aa0f2cd66179c9f050e062c882d27aa9b9f8c2b7c73fee3498560b5ed0b38';
const expectedChrome='9bfb381296dffe75f3419d07b6cc64525105ed117d1453a4ef3b291cb97d2b58';
const report={schema:1,scope:'Isolated official Chrome runtime diagnosis; only version/about:blank; no game or Git',trustedStartedUtc:process.argv[2],steps:[],observations:[]};
const env=Object.assign({},process.env);delete env.NODE_OPTIONS;delete env.NODE_PATH;
function digest(bytes){return crypto.createHash('sha256').update(bytes).digest('hex');}
function write(name,value){fs.writeFileSync(path.join(out,name),JSON.stringify(value,null,2)+'\n');}
function receipt(file){const b=fs.readFileSync(file),s=fs.statSync(file);return {path:file,bytes:b.length,sha256:digest(b),statBytes:s.size,mode:(s.mode&0o7777).toString(8),executorMtime:s.mtime.toISOString()};}
function checkpoint(){write('diagnostic-progress.json',report);}
function observe(name,operation){try{report.observations.push({name,value:operation()});}catch(e){report.observations.push({name,error:{code:e.code,message:e.message}});}checkpoint();}
async function command(id,command,args,timeoutMs=12000){
  const stdout=path.join(out,id+'.stdout.log'),stderr=path.join(out,id+'.stderr.log');
  const a=fs.openSync(stdout,'wx'),b=fs.openSync(stderr,'wx'),start=process.hrtime.bigint();
  const entry={id,command,args,timeoutMs,timeout:false,exitCode:null,signal:null,error:null};
  await new Promise(resolve=>{
    let child,timer,hardTimer,finished=false;
    function finish(code,signal){if(finished)return;finished=true;clearTimeout(timer);clearTimeout(hardTimer);entry.exitCode=code;entry.signal=signal;resolve();}
    try{child=spawn(command,args,{cwd:out,env,detached:true,stdio:['ignore',a,b]});}
    catch(e){entry.error={code:e.code,message:e.message};finish(null,null);return;}
    child.on('error',e=>{entry.error={code:e.code,message:e.message};finish(null,null);});
    child.on('close',finish);
    timer=setTimeout(()=>{entry.timeout=true;try{process.kill(-child.pid,'SIGTERM');}catch(e){entry.terminateError=e.message;}
      hardTimer=setTimeout(()=>{try{process.kill(-child.pid,'SIGKILL');}catch(e){entry.killError=e.message;}},1000);
    },timeoutMs);
  });
  fs.closeSync(a);fs.closeSync(b);entry.elapsedMs=Number(process.hrtime.bigint()-start)/1e6;
  entry.stdout=receipt(stdout);entry.stderr=receipt(stderr);report.steps.push(entry);write(id+'.process.json',entry);checkpoint();
  console.log(JSON.stringify({id,exitCode:entry.exitCode,signal:entry.signal,timeout:entry.timeout,error:entry.error,elapsedMs:entry.elapsedMs,stdoutBytes:entry.stdout.bytes,stderrBytes:entry.stderr.bytes}));
  return entry;
}
(async()=>{
  if(!report.trustedStartedUtc||!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC$/.test(report.trustedStartedUtc))throw Error('Trusted UTC argument required');
  fs.copyFileSync(path.join(sourceRoot,'process.json'),path.join(out,'root-original-runtime-receipt.json'));
  report.debBefore=receipt(deb);if(report.debBefore.bytes!==143552428||report.debBefore.sha256!==expectedDeb)throw Error('Official input .deb differs from pinned original');
  observe('rootChromeBefore',()=>receipt(path.join(sourceRoot,'unpacked/opt/google/chrome/chrome')));
  observe('nodeRuntime',()=>({version:process.version,pid:process.pid,ppid:process.ppid,platform:process.platform,arch:process.arch,versions:process.versions}));
  for(const item of ['status','limits','cgroup','mountinfo'])observe('proc-self-'+item,()=>{const p='/proc/self/'+item,b=fs.readFileSync(p);fs.writeFileSync(path.join(out,'proc-self-'+item+'.txt'),b);return {path:p,bytes:b.length,sha256:digest(b)};});
  observe('proc-self-link',()=>fs.readlinkSync('/proc/self'));
  await command('ps','ps',['-eo','pid,ppid,stat,etime,comm']);
  await command('disk','df',['-h',out,'/tmp','/dev/shm']);
  await command('kernel','uname',['-a']);
  const extraction=await command('extract','dpkg-deb',['--extract',deb,path.join(out,'unpacked')],30000);
  if(extraction.exitCode!==0||extraction.timeout)throw Error('Isolated extraction failed');
  const chrome=path.join(out,'unpacked/opt/google/chrome/chrome');
  report.chromeBefore=receipt(chrome);checkpoint();
  if(report.chromeBefore.bytes!==297798984||report.chromeBefore.sha256!==expectedChrome)throw Error('Isolated extracted Chrome differs from pinned original');
  await command('version',chrome,['--version']);
  await command('about-blank',chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--no-first-run','--no-default-browser-check','--user-data-dir='+path.join(out,'about-blank-profile'),'--dump-dom','about:blank']);
  report.chromeAfter=receipt(chrome);report.debAfter=receipt(deb);
  observe('rootChromeAfter',()=>receipt(path.join(sourceRoot,'unpacked/opt/google/chrome/chrome')));
  report.completed=true;checkpoint();
})().catch(e=>{report.fatal={name:e.name,code:e.code||null,message:e.message,stack:e.stack};checkpoint();console.error(e.stack);process.exitCode=1;});
