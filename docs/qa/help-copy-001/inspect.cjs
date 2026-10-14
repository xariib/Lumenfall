'use strict';
// One-off source-bound help inspection, reusing the existing complete-product
// Chromium driver. No product/test gate, fixture, or acceptance deadline changes.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),vm=require('node:vm');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../..'),out=path.resolve(process.argv[2]||path.join(root,'validation-evidence/help-copy-001/inspection'));
fs.mkdirSync(out,{recursive:true});
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const sourcePath=path.resolve(process.argv[3]||path.join(root,'index.html')),baseline=process.argv.includes('--baseline-layout');
const source=fs.readFileSync(sourcePath);
let driver=require(path.join(root,'tests/behavioral/shared-layout-ui.cjs')).buildDriver({task:'HELP_COPY_001',sourceSha256:hash(source)});
// Test-only hook for owned-upgrade descriptions; no product save is written.
const bridgeStart=driver.indexOf('const bridge='),bridgeEnd=driver.indexOf('\nconst prelude=',bridgeStart);
assert(bridgeStart>0&&bridgeEnd>bridgeStart);
const originalBridge=JSON.parse(driver.slice(bridgeStart+'const bridge='.length,bridgeEnd).trim().replace(/;$/,''));
const extraBridge=`
prismQa.helpUpgrade=function(){
 SPIRITS.forEach(function(sp){state.heroRarity[sp.id]=5;state.wispModules[sp.id]=20;state.wispUltimate[sp.id]=true;});
 state.longStudyLevels.resonantefficiency=5;
 state.research.amplifiertrim=5;state.research.resonantedge=5;state.research.relay=5;
 state.research.resonancecells=2;state.research.resonancecascade=2;state.research.resonancereclaim=3;
 state.research.cauterize=10;state.research.fracturekey=10;state.research.guardianseal=5;
 state.achieved.comet_called_kill=true;renderEncyclopedia();
};
`;
driver=driver.slice(0,bridgeStart)+'const bridge='+JSON.stringify(originalBridge+extraBridge)+';'+driver.slice(bridgeEnd);
const seam='  await (async function sharedScenario(){',start=driver.indexOf(seam),end=driver.indexOf("  await send('Target.disposeBrowserContext'",start);
assert(start>0&&end>start);
async function helpScenario(){
 const {width,scale,motion}=sharedActiveProfile,id=width+'-'+scale+'-'+motion;
 await ev('prismQa.sharedInstall(false,"battle")');
 const before=await ev('JSON.stringify(prismQa.get())'),slots=await ev('JSON.stringify(prismQa.keys().map(k=>localStorage.getItem(k)))');
 await tap('#settings-btn');await tap('#encyclopedia-btn');
 ok(await ev('document.activeElement.id')==='settings-back','Encyclopedia focuses Back');
 const measured=await ev(`(()=>{
  const cards=Array.from(document.querySelectorAll('#encyclopedia-content .ency-card'));
  const clipped=cards.flatMap(card=>Array.from(card.querySelectorAll('.ency-name,.ency-meta,.ency-desc')).filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.textContent));
  return {cards:cards.length,wisps:document.querySelectorAll('[data-ency-wisp]').length,clipped,text:document.querySelector('#encyclopedia-content').innerText,bodyWidth:document.body.scrollWidth};
 })()`);
 ok(measured.wisps===8,'all eight Wisp entries remain');if(!BASELINE)ok(measured.cards===51,'eight Wisps, eight Bonds, six currencies, twenty-nine mechanics');
 ok(measured.clipped.length===0,'all Encyclopedia text wraps: '+JSON.stringify(measured.clipped));ok(measured.bodyWidth<=width+1,'Encyclopedia document stays within viewport');
 ok(await ev(`(()=>{const title=document.querySelector('#settings-title'),close=document.querySelector('#settings-close'),r=title.getBoundingClientRect(),c=close.getBoundingClientRect();return title.scrollWidth<=title.clientWidth+1&&r.right<=c.left+.5&&c.right<=innerWidth+.5;})()`),'Encyclopedia heading wraps and leaves Close accessible');
 if(!BASELINE){ok(measured.text.includes('Field Notes')&&measured.text.includes('seventh login-streak reward'),'additional Mote/Prism sources visible');
 ok(measured.text.includes('Tree purchases are manual')&&measured.text.includes('Speed queue ON authorizes automatic purchases'),'spending permissions clearly distinguished');}
 if(width===390&&scale===1&&motion==='no-preference')await shot('encyclopedia-'+id);
 await tap('#settings-back');ok(await ev('document.activeElement.id')==='encyclopedia-btn','Back returns to Encyclopedia opener');
 await tap('#howtoplay-btn');const steps=[];
 for(let i=0;i<(BASELINE?3:6);i++){
  const step=await ev(`(()=>{const b=document.querySelector('#tut-body'),m=b.closest('.modal'),r=m.getBoundingClientRect();return {title:document.querySelector('#tut-title').textContent,body:b.textContent,button:document.querySelector('#tut-next').textContent,dots:document.querySelectorAll('#tut-dots .tut-dot').length,active:Array.from(document.querySelectorAll('#tut-dots .tut-dot')).findIndex(e=>e.classList.contains('on')),clip:b.scrollWidth>b.clientWidth+1||m.scrollWidth>m.clientWidth+1,left:r.left,right:r.right};})()`);
  ok(step.dots===(BASELINE?3:6)&&step.active===i,'tutorial dots and correct active step');ok(!step.clip&&step.left>=-.5&&step.right<=width+.5,'tutorial text and modal wrap');
  ok(step.button===(i===(BASELINE?2:5)?'Start Playing':'Next'),'tutorial final action');steps.push(step);
  if((width===390&&scale===1||width===320&&scale===2)&&motion==='no-preference')await shot('tutorial-'+id+'-'+(i+1));
  await tap('#tut-next');
 }
 ok(await ev('getComputedStyle(document.querySelector("#tutorial-overlay")).display')==='none','Start Playing finishes tutorial');
 ok(await ev('document.activeElement.id')==='settings-btn','tutorial returns focus to Settings opener');
 await tap('#settings-btn');await tap('#howtoplay-btn');await key('Escape','Escape',27);
 ok(await ev('document.activeElement.id')==='settings-btn','Escape closes tutorial to opener');
 await tap('#settings-btn');await tap('#howtoplay-btn');await tap('#tut-skip');
 ok(await ev('document.activeElement.id')==='settings-btn','Skip closes tutorial to opener');
 ok(await ev('JSON.stringify(prismQa.get())')===before,'reading/replaying help preserves complete gameplay state');
 ok(await ev('JSON.stringify(prismQa.keys().map(k=>localStorage.getItem(k)))')===slots,'reading/replaying preserves both exact saved slots');
 let upgraded=null;
 if(!BASELINE){
  await tap('#settings-btn');await tap('#encyclopedia-btn');await ev('prismQa.helpUpgrade()');
  upgraded=await ev('document.querySelector("#encyclopedia-content").innerText');
  ok(upgraded.includes('Resonate spends 15 Sigils')&&upgraded.includes('5 shared uses'),'owned Lab/Forge cost and capacity shown');
  ok(upgraded.includes('+30% for 1s')&&upgraded.includes('+55% for 1.5s'),'owned Amplifier Trim reflected in both Support profiles');
  ok(upgraded.includes('ability damage ×2')&&upgraded.includes('tap damage ×3.5'),'owned boss modifiers reflected');
  ok(await ev(`Array.from(document.querySelectorAll('#encyclopedia-content .ency-name,#encyclopedia-content .ency-meta,#encyclopedia-content .ency-desc')).every(e=>e.scrollWidth<=e.clientWidth+1)`),'owned-upgrade text also wraps');
  if(width===320&&scale===2&&motion==='no-preference')await shot('encyclopedia-upgraded-'+id);
  await key('Escape','Escape',27);
 }
 ok((await ev('window.__prismErrors')).length===0,'no runtime exceptions');
 records.push({width,scale,motion,encyclopedia:measured,steps,upgraded});
}
driver=driver.slice(0,start)+'  await ('+helpScenario.toString().replaceAll('BASELINE',String(baseline))+')();\n'+driver.slice(end);
driver=driver.replace('all twelve actual Shared UI profiles','all twelve actual help profiles');
new vm.Script(driver);
const generated=path.join(root,'tests/behavioral/.help-inspection-'+process.pid+'.cjs');
fs.writeFileSync(generated,driver);
try{
 const run=spawnSync(process.execPath,[generated,sourcePath,out],{cwd:root,encoding:'utf8',timeout:240000,maxBuffer:32*1024*1024});
 fs.writeFileSync(path.join(out,'stdout.txt'),run.stdout||'');fs.writeFileSync(path.join(out,'stderr.txt'),run.stderr||'');
 const result=JSON.parse(run.stdout||'{}');
 fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({status:result.status,checks:result.checks,profiles:result.profiles?.length,error:result.error,exitCode:run.status,sourceSha256:hash(source)}));
 if(run.status!==0||result.status!=='pass')process.exitCode=1;
}finally{fs.unlinkSync(generated);}
