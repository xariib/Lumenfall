'use strict';
// Temporary bridge for the approved WORKSHOP_CARD_CLARITY_001 delivery only.
// Remove this file and its workflow after verified publication.
// workflow_dispatch can be triggered with GITHUB_TOKEN:
// https://docs.github.com/actions/using-workflows/triggering-a-workflow
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const repo=process.env.GITHUB_REPOSITORY,sha=process.env.GITHUB_SHA;
const product='62672c9cbabc1c25ed5dbf5bad083133b3bae45d918210bbb2bf26db5795046a';
const required=['pre-merge-validation.yml','comet-expansion-validation.yml','forge-expansion-validation.yml','lab-expansion-validation.yml','shared-ui-validation.yml','tree-focused-qa.yml'];
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function api(endpoint,body){
 const args=['api',endpoint],options={encoding:'utf8',maxBuffer:16*1024*1024};
 if(body){args.push('--method','POST','--input','-');options.input=JSON.stringify(body);}
 const output=execFileSync('gh',args,options).trim();return output?JSON.parse(output):null;
}
function runs(file){return api('repos/'+repo+'/actions/workflows/'+file+'/runs?head_sha='+sha+'&event=workflow_dispatch&per_page=100').workflow_runs.filter(r=>r.head_sha===sha&&r.event==='workflow_dispatch').sort((a,b)=>b.id-a.id);}
function guard(){
 assert.equal(repo,'xariib/Lumenfall');assert.equal(process.env.GITHUB_REF,'refs/heads/main');assert.equal(process.env.GITHUB_EVENT_NAME,'push');assert(/^[0-9a-f]{40}$/.test(sha));
 assert.equal(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sha);
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync('index.html')).digest('hex'),product,'Approved product identity');
 const pr=api('repos/'+repo+'/pulls/13');assert(pr.merged&&pr.merge_commit_sha===sha,'Only the approved PR #13 merge can dispatch this delivery');
 assert.equal(api('repos/'+repo+'/git/ref/heads/main').object.sha,sha,'Main must stay on this exact integration commit');
}
async function dispatch(file,inputs){
 const existing=new Set(runs(file).map(r=>r.id));api('repos/'+repo+'/actions/workflows/'+file+'/dispatches',{ref:'main',...(inputs?{inputs}:{})});
 const until=Date.now()+180000;
 while(Date.now()<until){const fresh=runs(file).find(r=>!existing.has(r.id));if(fresh){console.log(JSON.stringify({phase:'dispatched',workflow:file,sourceCommit:sha,runId:fresh.id,url:fresh.html_url}));return fresh;}await pause(10000);}
 throw Error('Dispatched run did not appear: '+file);
}
async function wait(run){
 const until=Date.now()+3*3600000;
 while(Date.now()<until){
  const current=api('repos/'+repo+'/actions/runs/'+run.id);
  assert.equal(current.head_sha,sha);assert.equal(current.event,'workflow_dispatch');
  if(current.status==='completed'){assert.equal(current.conclusion,'success',current.html_url+' must pass');console.log(JSON.stringify({phase:'passed',runId:current.id,url:current.html_url,sourceCommit:sha}));return current;}
  await pause(45000);
 }
 throw Error('Workflow wait expired: '+run.html_url);
}
function verifyBothJobs(run){
 const jobs=api('repos/'+repo+'/actions/runs/'+run.id+'/jobs?filter=latest&per_page=100').jobs;
 for(const name of ['Lumenfall pre-merge validation','Lumenfall isolated offline catch-up'])assert(jobs.some(j=>j.name===name&&j.conclusion==='success'),name+' must pass');
}
function verifyAll(){
 for(const file of required){const latest=runs(file)[0];assert(latest&&latest.conclusion==='success',file+' latest exact-main validation must pass');if(file==='pre-merge-validation.yml')verifyBothJobs(latest);}
}
function download(url,target){
 const u=new URL(url);assert.equal(u.hostname,'github.com');assert(u.pathname.startsWith('/xariib/Lumenfall/releases/download/'),'Expected public release asset');
 execFileSync('curl',['--fail','--location','--silent','--show-error','--retry','2','--retry-delay','2',url,'--output',target],{stdio:'inherit'});
}
function verifyPublic(release,buildRun){
 assert.equal(release.target_commitish,sha);assert(!release.draft&&!release.prerelease);
 const apk=release.assets.find(a=>a.name==='Lumenfall.apk'),checksum=release.assets.find(a=>a.name==='apk-sha256.txt'),receipt=release.assets.find(a=>a.name==='emulator-upgrade.json'),identity=release.assets.find(a=>a.name==='identity.txt');
 assert(apk&&checksum&&receipt&&identity,'Release must contain APK, checksum, installed-upgrade receipt and identity');
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'workshop-public-'));
 try{
  const apkPath=path.join(dir,'Lumenfall.apk'),sumPath=path.join(dir,'apk-sha256.txt');
  download(checksum.browser_download_url,sumPath);download(apk.browser_download_url,apkPath);
  const expected=/^[a-f0-9]{64}/.exec(fs.readFileSync(sumPath,'utf8'));assert(expected,'Valid published checksum');
  const digest=crypto.createHash('sha256').update(fs.readFileSync(apkPath)).digest('hex');assert.equal(digest,expected[0]);if(apk.digest)assert.equal(apk.digest,'sha256:'+digest);
  const result={status:'pass',sourceCommit:sha,sourceHtmlSha256:product,release:release.html_url,tag:release.tag_name,name:release.name,apk:apk.browser_download_url,apkSha256:digest,bytes:fs.statSync(apkPath).size,nativeBuildRunId:buildRun.id,nativeBuild:buildRun.html_url,nativeReceipt:receipt.browser_download_url,identity:identity.browser_download_url,anonymousDownload:true};
  fs.mkdirSync('validation-evidence/workshop-delivery',{recursive:true});fs.writeFileSync('validation-evidence/workshop-delivery/public-download.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
}
(async()=>{
 guard();const [mode,file]=process.argv.slice(2);
 if(mode==='validate'){assert(required.includes(file),'Expected one original required workflow');const run=await wait(await dispatch(file));if(file==='pre-merge-validation.yml')verifyBothJobs(run);return;}
 assert.equal(mode,'publish');verifyAll();guard();
 let release=api('repos/'+repo+'/releases?per_page=100').find(r=>r.target_commitish===sha&&!r.draft&&!r.prerelease&&r.assets.some(a=>a.name==='Lumenfall.apk'));
 let build=release&&runs('build-android.yml').find(r=>r.conclusion==='success');
 if(!release||!build){build=await wait(await dispatch('build-android.yml',{publish:true}));release=api('repos/'+repo+'/releases/latest');}
 verifyPublic(release,build);
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
