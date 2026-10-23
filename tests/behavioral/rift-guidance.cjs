/* F07 browser acceptance. Reuse run.cjs's existing instrumentation/fixtures;
 * this JavaScript driver owns HTTP, CDP and every assertion.
 * node tests/behavioral/rift-guidance.cjs chromium webRoot evidenceDir
 * --baseline-probe records the original hide-induced geometry shift.
 * --existing-contract runs the existing Rift contract with the CDP driver.
 * --readability-probe runs the five ordinary hints plus Ascend-ready at 320px/200% text.
 * --layout-before / --layout-probe capture the inset/fade baseline and candidate.
 * --layout-reference=PATH compares protected geometry with that baseline report.
 */
'use strict';
const {spawn}=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const [chrome,webRoot,evidenceDir,...flags]=process.argv.slice(2);
if(!chrome||!webRoot||!evidenceDir)throw Error('Expected chrome, instrumented webRoot, evidenceDir');
const sourceRoot=path.resolve(webRoot),root=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-guidance-www-')),out=path.resolve(evidenceDir),baseline=flags.includes('--baseline-probe'),contract=flags.includes('--existing-contract'),readabilityProbe=flags.includes('--readability-probe');
const collectTitleInverse=flags.includes('--collect-title-inverse');
const midgameAccept=flags.includes('--midgame-accept');
if(collectTitleInverse&&!readabilityProbe)throw Error('Title inverse collection requires the bounded readability probe');
const {instrumentHtml,loadFixtures}=require('./run.cjs');
let source=fs.readFileSync(path.join(sourceRoot,'index.html'),'utf8');
const hintMutation=flags.includes('--mutate-hint-open')?'open':flags.includes('--mutate-hint-refresh')?'refresh':null;
if(hintMutation){
 if(!midgameAccept)throw Error('Hint controls require --midgame-accept');
 const from=hintMutation==='open'?'openRiftHintDetails();return;':'if(details && !riftGuidanceHidden)renderRiftHintDetails(goal);';
 const to=hintMutation==='open'?'return;':'if(false)renderRiftHintDetails(goal);';
 if(source.split(from).length!==2)throw Error('Unique hint control marker required');
 source=source.replace(from,to);
}
const {measureGuidanceWord,assertGuidanceWord}=require('./rift-guidance-readability.cjs');
fs.cpSync(sourceRoot,root,{recursive:true});fs.writeFileSync(path.join(root,'index.html'),instrumentHtml(source,loadFixtures()));
fs.mkdirSync(out,{recursive:true});
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-rift-guidance-'));
const layoutBefore=flags.includes('--layout-before'),layoutProbe=layoutBefore||flags.includes('--layout-probe');
const referenceFlag=flags.find(flag=>flag.startsWith('--layout-reference='));
const layoutReference=referenceFlag?JSON.parse(fs.readFileSync(referenceFlag.slice('--layout-reference='.length),'utf8')):null;
const server=http.createServer((request,response)=>{
 const name=decodeURIComponent(new URL(request.url,'http://localhost').pathname),file=path.resolve(root,'.'+name);
 if(!file.startsWith(root+path.sep)){response.writeHead(403).end();return;}
 fs.readFile(file,(error,bytes)=>{if(error){response.writeHead(404).end();return;}
  const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png'};
  response.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});response.end(bytes);
 });
});
let browser,session,seq=0,buffer='',stderr='',browserExit,closed=false,closing=false;
const pending=new Map(),records=[],runtimeErrors=[];
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function assert(value,message){if(!value)throw Error(message);}
function send(method,params={},sid=session){return new Promise((resolve,reject)=>{
 const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout '+method));},20000);
 pending.set(id,{resolve,reject,timer});browser.stdio[3].write(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})})+'\0');
});}
async function evaluate(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
async function key(name,shift=false){const specs={Space:{key:' ',code:'Space',windowsVirtualKeyCode:32},Tab:{key:'Tab',code:'Tab',windowsVirtualKeyCode:9},Enter:{key:'Enter',code:'Enter',windowsVirtualKeyCode:13},Escape:{key:'Escape',code:'Escape',windowsVirtualKeyCode:27},End:{key:'End',code:'End',windowsVirtualKeyCode:35}};const spec=specs[name];await send('Input.dispatchKeyEvent',{type:'rawKeyDown',...spec,modifiers:shift?8:0});await send('Input.dispatchKeyEvent',{type:'keyUp',...spec,modifiers:shift?8:0});}
async function nativeEnter(){
 // Native buttons activate on the complete Enter sequence, including its
 // character event. rawKeyDown alone only exercises custom keydown handlers.
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});
 await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
}
async function touch(selector){const box=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)}),r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,hit:e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))};})()`);assert(box.hit,'native touch reaches '+selector);await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x,y:box.y}]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
async function touchVisibleHint(){
 const box=await evaluate(`(()=>{const e=document.querySelector('#rift-objective'),row=document.querySelector('#rift-objective-row'),r=e.getBoundingClientRect(),v=row.getBoundingClientRect();
   const x=r.left+r.width/2,y=(Math.max(r.top,v.top)+Math.min(r.bottom,v.bottom))/2;
   return {x,y,hit:e.contains(document.elementFromPoint(x,y)),visible:Math.min(r.bottom,v.bottom)>Math.max(r.top,v.top)};})()`);
 assert(box.visible&&box.hit,'native touch reaches the visible part of the scrollable Farm hint');
 await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x,y:box.y}]});
 await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
}
async function ready(){let loaded=false;for(let i=0;i<200&&!loaded;i++){try{loaded=await evaluate('!window.__riftGuidanceReloadToken&&!!window.__forgeUiReady');}catch(error){if(!/context|navigat/i.test(error.message))throw error;}if(!loaded)await pause(20);}assert(loaded,'production document reaches existing bridge');await evaluate('document.fonts.ready');await evaluate('__lumenfallQaBridge.uiMeasurementPause(true)');await evaluate('__qaForgeStartup.promise');await evaluate('__lumenfallQaBridge.resetFeedback()');}
async function reload(){await evaluate('window.__riftGuidanceReloadToken=true');await send('Page.reload',{ignoreCache:true});await ready();}
async function waitForHintScroll(){for(let i=0;i<50;i++){if(await evaluate('document.querySelector("#rift-objective-row").scrollTop>0'))return;await pause(20);}const diagnostic=await evaluate('({focus:document.activeElement.id,inert:document.querySelector(".shell").inert,scroll:document.querySelector("#rift-objective-row").scrollTop,hidden:document.querySelector("#rift-objective-row").hidden})');throw Error('long hint scroll did not move: '+JSON.stringify(diagnostic));}
async function settleHintScroll(){let previous=-1,stable=0;for(let i=0;i<80;i++){const top=await evaluate('document.querySelector("#rift-objective-row").scrollTop');stable=Math.abs(top-previous)<.1?stable+1:0;previous=top;if(stable>=4)return;await pause(25);}throw Error('native hint scroll did not settle before the next tap');}
async function snapshot(){return evaluate(`(()=>{
 const selectors=['.hud',...['lumen','shard','mote','prism','comet','sigil'].map(x=>'#hud-'+x),'.battle-row','#enemy-stage','.hp-wrap','#hp-text','#boss-combat','#rift-party','#rift-bond-effects','#rift-guidance-slot','#rift-hints-toggle'];
 const boxes={};selectors.forEach(selector=>{const e=document.querySelector(selector);if(!e||!e.getClientRects().length){boxes[selector]=null;return;}const r=e.getBoundingClientRect();boxes[selector]={x:r.x,y:r.y,width:r.width,height:r.height};});
 const saves={};Object.keys(localStorage).sort().filter(k=>k!=='lumenfall_rift_guidance_hidden_v1').forEach(k=>saves[k]=localStorage.getItem(k));
 return {boxes,state:JSON.stringify(__lumenfallQaBridge.getState()),saves};
})()`);}
function sameGeometry(a,b,label){for(const selector of Object.keys(a.boxes)){const before=a.boxes[selector],after=b.boxes[selector];assert(!!before===!!after,label+' presence '+selector);if(before)for(const axis of ['x','y','width','height'])assert(Math.abs(before[axis]-after[axis])<=0.1,label+' '+selector+' '+axis+': '+before[axis]+' -> '+after[axis]);}}
function sameData(a,b,label){assert(a.state===b.state,label+' preserves full game state');assert(JSON.stringify(a.saves)===JSON.stringify(b.saves),label+' preserves all other localStorage bytes');}
async function screenshot(name){const r=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(r.data,'base64'));}
async function wordReadability(){return evaluate('('+measureGuidanceWord.toString()+')()');}
async function toggleAccessibleName(){
 const label=await evaluate('document.querySelector("#rift-hints-toggle").textContent');
 const {root:dom}=await send('DOM.getDocument'),{nodeId}=await send('DOM.querySelector',{nodeId:dom.nodeId,selector:'#rift-hints-toggle'});
 const tree=await send('Accessibility.getPartialAXTree',{nodeId,fetchRelatives:false});
 const button=tree.nodes.find(node=>!node.ignored&&node.role?.value==='button');
 assert(button?.name?.value===label,'hint toggle accessible name must equal its visible label');
 return {label,name:button.name.value};
}
async function midgameFarmAcceptance(record,name,inset){
 await evaluate(`riftStatusMobile.setup(${inset},'farm');(()=>{
   const b=__lumenfallQaBridge,s=b.getState();b.freeze();
   s.ascendCount=1;s.maxDepthEver=30;s.depth=s.enemyDepth=26;
   s.riftMode='farm';s.farmDepth=20;s.farmReturnDepth=26;
   s.lumen=800;s.shards=80;s.activeStudies=[];
   b.setState(s);b.renderLayout();
 })()`);
 const before=await snapshot();
 const summary=await evaluate(`(()=>{
   const e=document.querySelector('#rift-objective'),r=e.getBoundingClientRect(),s=e.querySelector('strong'),range=document.createRange(),row=document.querySelector('#rift-objective-row');
   range.selectNodeContents(s);const t=range.getBoundingClientRect();
   return {kind:e.querySelector('.objective-kind').textContent,title:s.textContent,name:e.getAttribute('aria-label'),
     popup:e.getAttribute('aria-haspopup'),role:e.getAttribute('role'),target:e.getAttribute('data-target-tab'),selector:e.getAttribute('data-target-selector'),
     fit:r.left>=0&&r.right<=innerWidth+1&&document.documentElement.scrollWidth<=innerWidth+1,
     readable:t.right<=r.right+1&&t.top>=row.getBoundingClientRect().top&&t.bottom<=row.getBoundingClientRect().bottom+1,
     width:r.width,height:r.height,scroll:row.scrollHeight,rowHeight:row.clientHeight};
 })()`);
 assert(summary.kind==='POWER OPTION'&&summary.title==='Lab hint'&&summary.popup==='dialog'&&summary.role==='button','short summary advertises details dialog');
 assert(summary.fit&&summary.readable&&summary.height>=44&&summary.width>=44&&summary.scroll<=summary.rowHeight+1,'summary fully readable in fixed strip without nested scrolling');
 assert(summary.name==='Read Lab hint — Power option: Wisp Ascendancy 1 — +15% passive Wisp damage after study · 800 Lumen + 80 Shards','full funded accessible summary');
 assert(summary.target==='research'&&summary.selector.includes('[data-study-card="wispascend"]'),'existing Lab card destination retained');
 await screenshot(name+'-summary');
 async function dialog(){return evaluate(`(()=>{const o=document.querySelector('#rift-hint-overlay'),m=o.querySelector('[role="dialog"]'),r=m.getBoundingClientRect(),d=document.querySelector('#rift-hint-detail');
   const controls=[...m.querySelectorAll('button')].map(e=>{const r=e.getBoundingClientRect();return {w:r.width,h:r.height};});
   return {open:getComputedStyle(o).display!=='none',title:document.querySelector('#rift-hint-title').textContent,detail:d.textContent,
     color:getComputedStyle(d).color,shortfall:d.classList.contains('objective-shortfall'),focus:document.activeElement.id,inert:document.querySelector('.shell').inert,
     fits:r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight+1&&m.scrollWidth<=m.clientWidth+1,
     controls,described:m.getAttribute('aria-describedby'),labelled:m.getAttribute('aria-labelledby')};})()`);}
 await evaluate('document.querySelector("#rift-objective").focus({preventScroll:true})');await key('Enter');
 const funded=await dialog();
 assert(funded.open,'keyboard opens Lab details dialog');
 assert(funded.title==='Power option: Wisp Ascendancy 1'&&funded.detail==='+15% passive Wisp damage after study · 800 Lumen + 80 Shards','full exact funded title, price and effect');
 assert(funded.fits&&funded.controls.every(c=>c.w>=44&&c.h>=44)&&funded.described==='rift-hint-detail'&&funded.labelled==='rift-hint-title','wrapped dialog fits and names its full content with 44px controls');
 assert(funded.inert&&funded.focus==='rift-hint-title','long advice starts at focused heading with inert background');
 sameGeometry(before,await snapshot(),'opening details');sameData(before,await snapshot(),'opening details');
 await screenshot(name+'-funded');
 await key('Tab',true);assert(await evaluate('document.activeElement.id')==='rift-hint-close','reverse Tab wraps inside dialog');
 await key('Tab');assert(await evaluate('document.activeElement.id')==='rift-hint-open-lab','Tab wraps inside dialog');
 await key('Escape');assert(!(await dialog()).open&&await evaluate('document.activeElement.id')==='rift-objective','Escape returns focus to summary');
 sameGeometry(before,await snapshot(),'Escape details');sameData(before,await snapshot(),'Escape details');
 await touchVisibleHint();assert((await dialog()).open,'native touch opens details');
 await evaluate('document.querySelector("#rift-hint-close").scrollIntoView({block:"center"})');await touch('#rift-hint-close');
 assert(!(await dialog()).open&&await evaluate('document.activeElement.id')==='rift-objective','native Close restores summary focus');
 await touchVisibleHint();
 // Existing background refresh updates details in place, preserving focus.
 await evaluate(`(()=>{const b=__lumenfallQaBridge,s=b.getState();s.lumen=799;s.shards=79;b.setState(s);b.renderLayout();})()`);
 const shortfall=await snapshot(),missing=await dialog();
 assert(missing.title==='Wisp Ascendancy: level 1'&&missing.detail==='Missing 1 Lumen + 1 Shards for Lab','open details refresh both exact shortfalls');
 assert(missing.shortfall&&missing.color==='rgb(255, 159, 174)'&&missing.fits&&missing.focus==='rift-hint-title','red shortfalls retain dialog focus and fit');
 await screenshot(name+'-unfunded');
 await key('Escape');sameData(shortfall,await snapshot(),'shortfall close');
 await key('Space');assert((await dialog()).open,'Space opens current details');
 // Refresh back to funded without closing/recreating the focused control.
 await evaluate(`(()=>{const b=__lumenfallQaBridge,s=b.getState();s.lumen=800;s.shards=80;b.setState(s);b.renderLayout();})()`);
 assert((await dialog()).detail===funded.detail&&!(await dialog()).shortfall,'resource refresh restores funded quote and clears red');
 const navigation=await snapshot();await key('Tab');
 assert(await evaluate('document.activeElement.id')==='rift-hint-open-lab','Tab reaches original native Go to Lab button');
 await nativeEnter();
 assert(await evaluate('document.querySelector("#tab-research").classList.contains("active")&&document.activeElement===document.querySelector(\'[data-study-card="wispascend"]\')'),'keyboard Go to Lab focuses original card');
 assert(!(await dialog()).open,'Lab navigation closes details');sameData(navigation,await snapshot(),'keyboard Lab navigation');
 await touch('[data-tab="battle"]');await touchVisibleHint();
 await evaluate('document.querySelector("#rift-hint-open-lab").scrollIntoView({block:"center"})');await touch('#rift-hint-open-lab');
 assert(await evaluate('document.querySelector("#tab-research").classList.contains("active")&&document.activeElement===document.querySelector(\'[data-study-card="wispascend"]\')'),'native Go to Lab focuses original card');
 sameData(navigation,await snapshot(),'native Lab navigation');
 await touch('[data-tab="battle"]');
 for(const [activeStudies,title,detail] of [
   [[{id:'wispascend',remainingSec:100,totalDurationSec:100,speedMult:1}],'Wisp Ascendancy in progress','Paid level 1 is running in Lab'],
   [['guardmastery','shardstudy'].map(id=>({id,remainingSec:100,totalDurationSec:100,speedMult:1})),'Wisp Ascendancy: level 1','All 2 Lab slots occupied']]){
   await evaluate(`(()=>{const b=__lumenfallQaBridge,s=b.getState();s.activeStudies=${JSON.stringify(activeStudies)};b.setState(s);b.renderLayout();})()`);
   const runningBefore=await snapshot();await touchVisibleHint();const running=await dialog();
   assert(running.title===title&&running.detail===detail,'paid running work and occupied slots remain exact');
   sameData(runningBefore,await snapshot(),'running work details');await key('Escape');
 }
 // A live change away from this option closes rather than retaining stale advice.
 await touchVisibleHint();
 await evaluate(`(()=>{const b=__lumenfallQaBridge,s=b.getState();s.riftMode='push';b.setState(s);b.renderLayout();})()`);
 assert(!(await dialog()).open&&!await evaluate('document.querySelector(".shell").inert'),'irrelevant advice closes and releases focus lifecycle');
 record.samples.push({summary,funded,missing});
}
async function readabilityNegative(record,name){
 const before=await snapshot(),savedStyle=await evaluate('document.querySelector("#rift-hints-toggle").getAttribute("style")');
 const original=await wordReadability();assertGuidanceWord(original);
 const control={declaration:'width:9.5em',cause:'guidance-leading-word-fragmented',original};record.readabilityNegative=control;
 try{
  // Restore only the exact old width in this isolated document. The native
  // label, font, hint, handlers and fixed reservation are unchanged.
  await evaluate('document.querySelector("#rift-hints-toggle").style.width="9.5em"');
  control.measurement=await wordReadability();
  const after=await snapshot();sameData(before,after,'readability inverse');
  const boxes={...before.boxes},mutated={...after.boxes};delete boxes['#rift-hints-toggle'];delete mutated['#rift-hints-toggle'];
  sameGeometry({boxes},{boxes:mutated},'readability inverse protected geometry');
  assert(control.measurement.title.text===original.title.text&&control.measurement.word.text===original.word.text,'readability inverse preserves the actual ordinary hint word');
  assert(!control.measurement.invisibleAncestors.length,'readability inverse keeps the hint visible');
  for(const part of ['root','title','detail','toggle'])assert(control.measurement.fonts[part].font===original.fonts[part].font,'readability inverse preserves '+part+' font');
  let rejection;try{assertGuidanceWord(control.measurement);}catch(error){rejection={code:error.code,message:error.message,details:error.details};}
  control.rejection=rejection||null;
  assert(rejection&&rejection.code===control.cause&&Number.isInteger(rejection.details?.lineCount)&&rejection.details.lineCount>1,'exact old width must split the unchanged leading word across multiple lines');
  await screenshot(name+'-readability-inverse');
  fs.writeFileSync(path.join(out,name+'-readability-inverse.html'),await evaluate('document.documentElement.outerHTML'));
 }finally{
  await evaluate(`(()=>{const e=document.querySelector('#rift-hints-toggle'),saved=${JSON.stringify(savedStyle)};if(saved===null)e.removeAttribute('style');else e.setAttribute('style',saved);})()`);
 }
 control.restored=await wordReadability();assertGuidanceWord(control.restored);
 sameGeometry(before,await snapshot(),'readability inverse restored');sameData(before,await snapshot(),'readability inverse restored');
 control.runtimeErrors=await evaluate('__lumenfallQaContext.errors');assert(!control.runtimeErrors.length,'readability inverse has no unrelated runtime errors');
}
async function hiddenAccessibility(){const {root:dom}=await send('DOM.getDocument');for(const selector of ['#rift-objective-row','#rift-objective']){const {nodeId}=await send('DOM.querySelector',{nodeId:dom.nodeId,selector});const tree=await send('Accessibility.getPartialAXTree',{nodeId,fetchRelatives:false});assert(tree.nodes.every(node=>node.ignored),'hidden hint is absent from accessibility tree: '+selector);}const tree=await send('Accessibility.getFullAXTree');assert(!tree.nodes.some(node=>!node.ignored&&/Guidance stress sentinel/.test(node.name?.value||'')),'hidden long hint is absent from full accessibility tree');}
async function toggleWithInput(useTouch=false){
 if(useTouch)await settleHintScroll();
 const before=await evaluate('document.querySelector("#rift-hints-toggle").getAttribute("aria-expanded")');
 await evaluate('document.querySelector("#rift-hints-toggle").focus({preventScroll:true})');
 if(useTouch)await touch('#rift-hints-toggle');else await key('Space');
 // Native Space activation can finish after CDP acknowledges key-up. Observe
 // the committed toggle once; never retry input or manufacture a DOM click.
 for(let i=0;i<50;i++){
  if(await evaluate('document.querySelector("#rift-hints-toggle").getAttribute("aria-expanded")')!==before)return;
  await pause(20);
 }
 throw Error('native hints input did not commit a state change');
}
async function scrollHintsWithTouch(){const r=await evaluate('(()=>{const r=document.querySelector("#rift-objective-row").getBoundingClientRect();return {x:r.x+r.width/2,top:r.top+4,bottom:r.bottom-4};})()');await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:r.x,y:r.bottom}]});for(let i=1;i<=4;i++){await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:r.x,y:r.bottom+(r.top-r.bottom)*i/4}]});await pause(16);}await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(100);}
async function inspectContent(){return evaluate(`(()=>{
 const row=document.querySelector('#rift-objective-row'),objective=document.querySelector('#rift-objective'),toggle=document.querySelector('#rift-hints-toggle'),slot=document.querySelector('#rift-guidance-slot'),hud=document.querySelector('.hud'),main=document.querySelector('main');
 const sr=slot.getBoundingClientRect(),rr=row.getBoundingClientRect(),tr=toggle.getBoundingClientRect(),hr=hud.getBoundingClientRect(),mr=main.getBoundingClientRect();
 if(sr.top<hr.bottom||sr.bottom>mr.top)throw Error('guidance must be directly below currencies and clear of combat');
 if(tr.width<44||tr.height<44)throw Error('hints control must be at least 44px');
 if(toggle.scrollWidth>toggle.clientWidth||toggle.scrollHeight>toggle.clientHeight)throw Error('Show hints/Hide hints text must fit at enlarged text size: '+JSON.stringify({text:toggle.textContent,width:toggle.clientWidth,height:toggle.clientHeight,scrollWidth:toggle.scrollWidth,scrollHeight:toggle.scrollHeight,font:getComputedStyle(toggle).fontSize,family:getComputedStyle(toggle).fontFamily,lineHeight:getComputedStyle(toggle).lineHeight,rootFont:getComputedStyle(document.documentElement).fontSize,viewport:[innerWidth,innerHeight],ua:navigator.userAgent}));
 if(row.scrollWidth>row.clientWidth+1)throw Error('hint text must wrap without horizontal clipping');
 const actionable=objective.getAttribute('role')==='button',or=objective.getBoundingClientRect();
 if(actionable&&(or.width<44||or.height<44))throw Error('hint navigation must be at least 44px');
 const style=getComputedStyle(toggle),ink=style.color,bg=style.backgroundColor;
 const rgb=color=>color.match(/[\\d.]+/g).slice(0,3).map(Number).map(x=>{x/=255;return x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4);});
 const lum=c=>{const a=rgb(c);return a[0]*.2126+a[1]*.7152+a[2]*.0722;},ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05),contrast=ratio(ink,bg),hintBackground=getComputedStyle(slot).backgroundColor,hintContrasts=[objective.querySelector('strong'),objective.querySelector('small')].map(e=>ratio(getComputedStyle(e).color,hintBackground));
 if(contrast<4.5)throw Error('hints text contrast <4.5');
 if(hintContrasts.some(value=>value<4.5))throw Error('hint title/detail contrast <4.5');
 if(getComputedStyle(slot).animationName!=='none'||getComputedStyle(row).animationName!=='none')throw Error('guidance must not animate geometry');
 return {slotHeight:sr.height,rowHeight:rr.height,contentHeight:row.scrollHeight,contrast,hintContrasts,fontSize:style.fontSize,actionable};
})()`);}
async function inspectInset(){return evaluate(`(()=>{
 const slot=document.querySelector('#rift-guidance-slot'),topbar=document.querySelector('.topbar');
 const r=slot.getBoundingClientRect(),p=topbar.getBoundingClientRect(),s=getComputedStyle(slot,'::before');
 return {left:r.left-p.left,right:p.right-r.right,height:r.height,fade:s.backgroundImage,background:s.backgroundColor,fadeContent:s.content,fadeHitTest:s.pointerEvents,
  overflow:document.documentElement.scrollWidth>innerWidth,focus:getComputedStyle(document.querySelector('#rift-hints-toggle')).outlineStyle};
})()`);}
function assertInset(m){
 assert(Math.abs(m.left-10)<.1&&Math.abs(m.right-10)<.1,'hint strip has symmetric 10px inset');
 assert(m.height===46&&!m.overflow,'inset preserves reservation and viewport fit');
 assert(m.fade.includes('linear-gradient')&&m.fade.includes('23, 25, 48')&&m.fade.includes('13, 15, 31'),'Rift header fades from HUD into arena surroundings');
 assert(m.fadeHitTest==='none','decorative fade cannot intercept input');
}
async function layoutSample(record,name,inset){
 for(const kind of ['fresh','boss']){
  await evaluate(`riftStatusMobile.setup(${inset},${JSON.stringify(kind)});document.querySelector('#toast').classList.remove('show')`);
  const shown=await snapshot(),content=await inspectContent(),readability=await wordReadability();assertGuidanceWord(readability);
  const style=await inspectInset(),sample={kind,shown:shown.boxes,content,readability,inset:style};record.samples.push(sample);
  if(layoutBefore){assert(style.left===0&&style.right===0,'baseline reproduces edge-to-edge hint strip');assert(style.fade==='none','baseline has no surrounding header fade');}
  else {
   assertInset(style);
   if(layoutReference){
    const original=layoutReference.records.find(r=>r.profile===record.profile)?.samples.find(s=>s.kind===kind);assert(original,'same baseline profile exists');
    const before={...original.shown},after={...shown.boxes};delete before['#rift-guidance-slot'];delete after['#rift-guidance-slot'];delete before['#rift-hints-toggle'];delete after['#rift-hints-toggle'];
    sameGeometry({boxes:before},{boxes:after},'inset versus baseline currencies/combat');
    assert(original.shown['#rift-guidance-slot'].y===shown.boxes['#rift-guidance-slot'].y,'inset retains slot vertical position');
   }
  }
  if(name.endsWith('no-preference')&&(kind==='fresh'||name.startsWith('390'))){await screenshot(name+'-'+kind);sample.screenshot=name+'-'+kind+'.png';}
  await toggleWithInput();sameGeometry(shown,await snapshot(),'layout hide');sameData(shown,await snapshot(),'layout hide');
  if(!layoutBefore){const hidden=await inspectInset();assertInset(hidden);assert(hidden.focus==='solid','keyboard focus stays visible');}
  await toggleWithInput(true);sameGeometry(shown,await snapshot(),'layout touch show');sameData(shown,await snapshot(),'layout touch show');
  if(name.endsWith('no-preference')&&kind==='fresh'){await toggleWithInput();await screenshot(name+'-hidden');await toggleWithInput();}
 }
 if(!layoutBefore&&records.length===1){
  for(const [property,value] of [['margin','0'],['background','none']]){
   await evaluate(`window.layoutControl=document.createElement('style');layoutControl.textContent='#rift-guidance-slot${property==='background'?'::before':''}{${property}:${value}!important}';document.head.appendChild(layoutControl)`);
   let rejection;try{assertInset(await inspectInset());}catch(e){rejection=e.message;}
   assert(rejection,'layout oracle rejects reverted '+property);(record.controls||(record.controls=[])).push({property,value,rejection});
   await evaluate('layoutControl.remove();delete window.layoutControl');assertInset(await inspectInset());
  }
 }
 await evaluate('document.querySelector("[data-tab=spirits]").click()');
 assert(await evaluate('document.querySelector("#rift-guidance-slot").hidden'),'hint strip absent outside Rift');
 if(!layoutBefore)assert(await evaluate('document.querySelector("#rift-guidance-slot").getClientRects().length===0'),'hidden Rift strip also removes its decorative fade');
}
async function checkAscendReadability(record,name,inset,capture){
 const a={};record.ascendReadability=a;
 a.fixture=await evaluate(`(()=>{
  riftStatusMobile.setup(${inset},'fresh');
  const b=__lumenfallQaBridge,s=riftStatusSeed(b,__lumenfallQaContext);
  s.riftMode='push';s.depth=101;s.enemyDepth=101;s.maxDepthEver=101;s.ascendCount=0;s.lumen=0;
  s.enemyMaxHp=b.enemyHpFor(101);s.enemyHp=s.enemyMaxHp;b.setState(s);b.renderLayout();
  const actual=b.getState();return {state:actual,unowned:b.wispRoleContract().filter(sp=>actual.spirits[sp.id]===0).map(sp=>{
   const control=document.querySelector('[data-empower="'+sp.id+'"]');
   return {id:sp.id,cost:b.formationTest.cost(sp.id),nativeButton:control?.tagName==='BUTTON',disabled:control?.disabled};
  })};
 })()`);
 assert(a.fixture.state.riftMode==='push'&&a.fixture.state.depth===101&&a.fixture.state.enemyDepth===101&&a.fixture.state.maxDepthEver===101&&a.fixture.state.ascendCount===0&&a.fixture.state.lumen===0,'actual Ascend-ready fixture survives canonical installation');
 assert(a.fixture.unowned.length===7&&a.fixture.unowned.every(sp=>Number.isFinite(sp.cost)&&sp.cost>0&&sp.nativeButton&&sp.disabled),'no unowned Wisp is affordable before the Ascend-ready hint');
 await evaluate('document.querySelector("#rift-objective-row").scrollTop=0');
 // Preserve the production title and complete native glyph record before the
 // oracle: the exact old-copy source must fail on its real word "Permanent".
 a.measurement=await wordReadability();
 a.generated=await evaluate(`(()=>{const e=document.querySelector('#rift-objective');return {className:e.className,title:e.querySelector('strong').textContent,detail:e.querySelector('small').textContent,target:e.getAttribute('data-target-tab'),role:e.getAttribute('role'),tabIndex:e.tabIndex,ariaLabel:e.getAttribute('aria-label'),rowHidden:document.querySelector('#rift-objective-row').hidden,slotHidden:document.querySelector('#rift-guidance-slot').hidden};})()`);
 a.shown=await snapshot();a.shownPreference=await evaluate('localStorage.getItem("lumenfall_rift_guidance_hidden_v1")');
 a.shownToggleName=await toggleAccessibleName();a.content=await inspectContent();
 const {root:dom}=await send('DOM.getDocument'),{nodeId}=await send('DOM.querySelector',{nodeId:dom.nodeId,selector:'#rift-objective'});
 const tree=await send('Accessibility.getPartialAXTree',{nodeId,fetchRelatives:false}),button=tree.nodes.find(node=>!node.ignored&&node.role?.value==='button');
 a.objectiveAX={role:button?.role?.value,name:button?.name?.value};
 if(capture)await screenshot(name+'-ascend-readability');
 assertGuidanceWord(a.measurement);
 assert(a.generated.className.split(' ').includes('objective-ascend-ready')&&a.generated.target==='ascend'&&a.generated.role==='button'&&a.generated.tabIndex===0,'actual Ascend-ready objective retains its native destination');
 assert(a.measurement.word.text==='Ascend'&&a.generated.title==='Ascend for permanent power','the Ascend-ready title starts with the complete Ascend action');
 assert(/^\+[1-9]\d* Prisms now$/.test(a.generated.detail)&&a.generated.ariaLabel===a.generated.title+' — '+a.generated.detail&&a.objectiveAX.name===a.generated.ariaLabel,'actual Ascend-ready title and earned-Prism detail form its native accessible name');
 assert(!a.generated.rowHidden&&!a.generated.slotHidden&&a.shownToggleName.label==='Hide hints'&&a.shownPreference===null,'Ascend-ready hints start visibly shown');
 await evaluate(`(()=>{window.__riftGuidanceAscendInputs=[];window.__riftGuidanceAscendCapture=e=>{const el=e.target.closest?.('#rift-objective,#rift-hints-toggle,[data-tab]');if(el)__riftGuidanceAscendInputs.push({type:e.type,key:e.key||null,trusted:e.isTrusted,control:el.id,tab:el.getAttribute('data-tab')});};['keydown','keyup','click','touchstart','touchend'].forEach(type=>document.addEventListener(type,__riftGuidanceAscendCapture,{capture:true,passive:true}));})()`);
 try{
  await toggleWithInput();a.hidden=await snapshot();a.hiddenToggleName=await toggleAccessibleName();
  a.hiddenPreference=await evaluate('localStorage.getItem("lumenfall_rift_guidance_hidden_v1")');
  sameGeometry(a.shown,a.hidden,'Ascend-ready hide');sameData(a.shown,a.hidden,'Ascend-ready hide');
  assert(a.hiddenToggleName.label==='Show hints'&&a.hiddenPreference==='1'&&await evaluate('document.querySelector("#rift-objective-row").hidden&&document.querySelector("#rift-hints-toggle").getAttribute("aria-expanded")==="false"&&document.activeElement.id==="rift-hints-toggle"'),'Ascend-ready native hide keeps the visible toggle focus and device preference');
  await hiddenAccessibility();
  await toggleWithInput(true);a.restored=await snapshot();a.restoredToggleName=await toggleAccessibleName();
  a.restoredPreference=await evaluate('localStorage.getItem("lumenfall_rift_guidance_hidden_v1")');
  sameGeometry(a.shown,a.restored,'Ascend-ready show');sameData(a.shown,a.restored,'Ascend-ready show');
  assert(a.restoredToggleName.label==='Hide hints'&&a.restoredPreference===null&&await evaluate('!document.querySelector("#rift-objective-row").hidden&&document.querySelector("#rift-hints-toggle").getAttribute("aria-expanded")==="true"'),'Ascend-ready native show restores the same device preference');
  a.restoredMeasurement=await wordReadability();assertGuidanceWord(a.restoredMeasurement);
  assert(a.restoredMeasurement.title.text===a.measurement.title.text&&a.restoredMeasurement.detail.text===a.measurement.detail.text,'Ascend-ready toggle preserves its actual title and reward detail');
  await evaluate('document.querySelector("#rift-objective").focus({preventScroll:true})');
  assert(await evaluate('document.activeElement.id')==='rift-objective','Ascend-ready objective receives keyboard focus');
  await key('Enter');a.destination=await snapshot();
  a.destinationState=await evaluate('({ascend:document.querySelector("#tab-ascend").classList.contains("active"),battle:document.querySelector("#tab-battle").classList.contains("active"),slotHidden:document.querySelector("#rift-guidance-slot").hidden,slotRects:document.querySelector("#rift-guidance-slot").getClientRects().length,preference:localStorage.getItem("lumenfall_rift_guidance_hidden_v1")})');
  assert(a.destinationState.ascend&&!a.destinationState.battle&&a.destinationState.slotHidden&&a.destinationState.slotRects===0,'real Enter opens Ascend and removes the guidance slot from the destination');
  sameData(a.shown,a.destination,'Ascend-ready destination');assert(a.destinationState.preference===a.shownPreference,'Ascend-ready navigation preserves the device preference');
  await touch('[data-tab="battle"]');a.returned=await snapshot();
  a.returnState=await evaluate('({battle:document.querySelector("#tab-battle").classList.contains("active"),slotHidden:document.querySelector("#rift-guidance-slot").hidden,rowHidden:document.querySelector("#rift-objective-row").hidden,target:document.querySelector("#rift-objective").getAttribute("data-target-tab"),preference:localStorage.getItem("lumenfall_rift_guidance_hidden_v1")})');
  assert(a.returnState.battle&&!a.returnState.slotHidden&&!a.returnState.rowHidden&&a.returnState.target==='ascend'&&a.returnState.preference===a.shownPreference,'native Rift return restores the visible Ascend-ready destination');
  sameGeometry(a.shown,a.returned,'Ascend-ready Rift return');sameData(a.shown,a.returned,'Ascend-ready Rift return');
  a.returnedMeasurement=await wordReadability();assertGuidanceWord(a.returnedMeasurement);
  assert(a.returnedMeasurement.title.text===a.measurement.title.text&&a.returnedMeasurement.detail.text===a.measurement.detail.text,'Rift return preserves the actual Ascend-ready title and reward detail');
 }finally{
  a.inputs=await evaluate(`(()=>{['keydown','keyup','click','touchstart','touchend'].forEach(type=>document.removeEventListener(type,__riftGuidanceAscendCapture,true));const events=__riftGuidanceAscendInputs;delete window.__riftGuidanceAscendInputs;delete window.__riftGuidanceAscendCapture;return events;})()`);
 }
 // The production objective key handler calls this.click(); its consequent
 // click is synthetic, while the original Enter and both touch inputs are trusted.
 assert(a.inputs.some(e=>e.trusted&&e.type==='keydown'&&e.key===' '&&e.control==='rift-hints-toggle'),'Ascend-ready hide uses actual native Space');
 assert(a.inputs.some(e=>e.trusted&&e.type==='touchstart'&&e.control==='rift-hints-toggle'),'Ascend-ready show uses actual native touch');
 assert(a.inputs.some(e=>e.trusted&&e.type==='keydown'&&e.key==='Enter'&&e.control==='rift-objective'),'Ascend-ready navigation uses actual native Enter');
 assert(a.inputs.some(e=>e.trusted&&e.type==='touchstart'&&e.tab==='battle'),'Ascend-ready return uses actual native Rift touch');
 a.runtimeErrors=await evaluate('__lumenfallQaContext.errors');assert(!a.runtimeErrors.length,'Ascend-ready case has no unrelated runtime errors');
 a.passed=true;
}
async function run(url){
 for(const [width,height,inset] of (readabilityProbe?[[320,640,0]]:midgameAccept?[[320,640,0],[390,844,24],[430,932,24]]:baseline||contract?[[390,844,24]]:[[320,640,0],[360,640,24],[390,844,24],[430,932,24]]))for(const scale of (readabilityProbe?[2]:midgameAccept?[1,1.5,2]:baseline||contract?[1]:[1,2]))for(const motion of (baseline||contract||readabilityProbe?['no-preference']:['no-preference','reduce'])){
  const name=`${width}x${height}-safe${inset}-text${scale}-${motion}`,record={profile:name,samples:[]};records.push(record);
  const context=await send('Target.createBrowserContext',{},null),target=await send('Target.createTarget',{url:'about:blank',browserContextId:context.browserContextId},null);session=(await send('Target.attachToTarget',{targetId:target.targetId,flatten:true},null)).sessionId;
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});await send('Emulation.setTouchEmulationEnabled',{enabled:true});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});await send('Page.enable');await send('Runtime.enable');await send('Page.navigate',{url});await ready();
  await evaluate(`document.documentElement.style.fontSize=(parseFloat(getComputedStyle(document.documentElement).fontSize)*${scale})+'px'`);
  if(midgameAccept){await midgameFarmAcceptance(record,name,inset);await send('Target.disposeBrowserContext',{browserContextId:context.browserContextId},null);continue;}
  if(layoutProbe){await layoutSample(record,name,inset);await send('Target.disposeBrowserContext',{browserContextId:context.browserContextId},null);continue;}
  if(contract){record.existingContract=await evaluate('(()=>{const b=__lumenfallQaBridge;b.freeze();return runRiftStatusQa(b,__lumenfallQaContext,(value,message)=>{if(!value)throw Error(message);});})()');await reload();record.navContract=await evaluate('(()=>{__lumenfallQaBridge.freeze();return runNavWorkshopQa(__lumenfallQaBridge,__lumenfallQaContext,(value,message)=>{if(!value)throw Error(message);});})()');await send('Target.disposeBrowserContext',{browserContextId:context.browserContextId},null);continue;}
  if(baseline){await evaluate(`riftStatusMobile.setup(${inset},'boss')`);const shown=await snapshot();await touch('#rift-objective-dismiss');const hidden=await snapshot();record.shown=shown.boxes;record.hidden=hidden.boxes;record.tapDelta={y:hidden.boxes['#enemy-stage'].y-shown.boxes['#enemy-stage'].y,height:hidden.boxes['#enemy-stage'].height-shown.boxes['#enemy-stage'].height};assert(Math.abs(record.tapDelta.y)>1||Math.abs(record.tapDelta.height)>1,'original baseline exposes the reported layout shift');await send('Target.disposeBrowserContext',{browserContextId:context.browserContextId},null);continue;}
  for(const kind of ['fresh','dense','boss','boss-conditional','farm'])for(const longHint of (readabilityProbe?[false]:[false,true])){
   await evaluate(`riftStatusMobile.setup(${inset},${JSON.stringify(kind)});(()=>{const b=__lumenfallQaBridge,s=b.getState();if(${JSON.stringify(kind)}==='farm'){s.riftMode='farm';s.farmDepth=9;s.farmReturnDepth=10;s.depth=9;s.enemyDepth=9;s.enemyMaxHp=b.enemyHpFor(9);s.enemyHp=s.enemyMaxHp;}b.setState(s);b.renderLayout();})()`);
   await evaluate('__lumenfallQaBridge.uiMeasurementPause(false)');await pause(120);await evaluate('__lumenfallQaBridge.uiMeasurementPause(true)');
   if(longHint)await evaluate(`(()=>{const el=document.querySelector('#rift-objective'),title='Guidance stress sentinel — '+('Long Rift hint with all its words readable. ').repeat(12)+'Unbroken'+('W').repeat(100),detail=('Additional guidance detail with a clear next step. ').repeat(8);el.querySelector('strong').textContent=title;el.querySelector('small').textContent=detail;if(el.getAttribute('role')==='button')el.setAttribute('aria-label',title+' — '+detail);})()`);
   await evaluate('document.querySelector("#rift-objective-row").scrollTop=0');
   const content=await inspectContent(),shown=await snapshot(),riftMeasure=await evaluate('riftStatusMobile.measure()');
   const sample={kind,longHint,content,shown:shown.boxes,riftMeasure};record.samples.push(sample);
   if(!longHint){
    // Preserve actual measurements before a readability assertion can fail.
    sample.readability=await wordReadability();sample.toggleName=await toggleAccessibleName();
    try{assertGuidanceWord(sample.readability);}catch(error){
     // The dense current fixture can itself show the Ascend-ready title.
     // Collect only this exact controlled reversion so all five ordinary
     // cases and the dedicated Ascend case are still measured. Other failures
     // remain immediate; the CI owner independently rechecks every measurement.
     if(!collectTitleInverse||error.code!=='guidance-leading-word-fragmented'||sample.readability.title.text!=='Permanent power is waiting')throw error;
     (record.titleInverseOrdinaryFailures||(record.titleInverseOrdinaryFailures=[])).push({kind,code:error.code,details:error.details});
    }
    if(width===320&&scale===2&&motion==='no-preference'&&kind==='fresh'){
     await screenshot(name+'-readability-normal');await readabilityNegative(record,name);
    }
   }
   if(readabilityProbe){await screenshot(name+'-'+kind);continue;}
   if(longHint){assert(content.contentHeight>content.rowHeight,'long text creates a bounded scroll area');await evaluate('document.querySelector("#rift-objective-row").focus({preventScroll:true})');assert(await evaluate('document.activeElement.id')==='rift-objective-row','hint scroll area receives keyboard focus');await key('End');await waitForHintScroll();sameGeometry(shown,await snapshot(),'long hint scrolling');await evaluate('document.querySelector("#rift-objective-row").scrollTop=0');await scrollHintsWithTouch();await waitForHintScroll();assert(await evaluate('document.querySelector("#tab-battle").classList.contains("active")'),'native touch scroll does not activate the hint destination');sameGeometry(shown,await snapshot(),'touch hint scrolling');sample.nativeTouchScrolled=true;}
   await toggleWithInput(longHint);const hidden=await snapshot();sameGeometry(shown,hidden,'hide '+name+'/'+kind);sameData(shown,hidden,'hide hints');sample.hidden=hidden.boxes;
   assert(await evaluate('document.querySelector("#rift-objective-row").hidden&&document.querySelector("#rift-hints-toggle").textContent==="Show hints"&&document.querySelector("#rift-hints-toggle").getAttribute("aria-expanded")==="false"'),'hidden hints control state');
   if(!longHint)sample.hiddenToggleName=await toggleAccessibleName();
   await evaluate('document.querySelector("#rift-objective-row").focus();document.querySelector("#rift-objective").focus()');assert(await evaluate('document.activeElement.id')==='rift-hints-toggle','hidden hints cannot take programmatic focus');await hiddenAccessibility();
   const tabStops=[];
   for(let i=0;i<12;i++){await key('Tab');const stop=await evaluate('(()=>{const a=document.activeElement;return {id:a.id,tab:a.dataset.tab,hiddenHint:document.querySelector("#rift-objective-row").contains(a)};})()');tabStops.push(stop);assert(!stop.hiddenHint,'native Tab skips hidden hints');if(stop.id==='enemy-stage')break;}
   assert(tabStops.at(-1).id==='enemy-stage','native Tab reaches Guardian Tap');sample.hiddenTabStops=tabStops;
   for(let i=0;i<12&&await evaluate('document.activeElement.id!=="rift-hints-toggle"');i++){await key('Tab',true);assert(await evaluate('!document.querySelector("#rift-objective-row").contains(document.activeElement)'),'reverse Tab skips hidden hints');}
   assert(await evaluate('document.activeElement.id')==='rift-hints-toggle','reverse Tab reaches the visible hints control');
   await toggleWithInput();sameGeometry(shown,await snapshot(),'show hints');sameData(shown,await snapshot(),'show hints');assert(await evaluate('document.querySelector("#rift-hints-toggle").textContent==="Hide hints"&&document.querySelector("#rift-hints-toggle").getAttribute("aria-expanded")==="true"'),'restored hints control state');
   if(width===390&&motion==='reduce'&&kind==='boss'){await screenshot(name+'-'+(longHint?'long':'normal'));if(longHint){await toggleWithInput();await screenshot(name+'-hidden');await toggleWithInput();}}
  }
  await checkAscendReadability(record,name,inset,width===320&&scale===2&&motion==='no-preference');
  if(readabilityProbe){await send('Target.disposeBrowserContext',{browserContextId:context.browserContextId},null);continue;}
  // Content changes and text enlargement leave every protected box in place.
  for(const sample of record.samples.filter(sample=>sample.longHint)){const normal=record.samples.find(other=>other.kind===sample.kind&&!other.longHint);sameGeometry({boxes:normal.shown},{boxes:sample.shown},'long versus normal hint');}
  if(scale===2){const normalProfile=records.find(other=>other.profile===name.replace('text2','text1'));for(const sample of record.samples){const normal=normalProfile.samples.find(other=>other.kind===sample.kind&&other.longHint===sample.longHint);const boxes={...normal.shown},enlarged={...sample.shown};delete boxes['#rift-hints-toggle'];delete enlarged['#rift-hints-toggle'];sameGeometry({boxes},{boxes:enlarged},'200% versus normal text');}record.enlargedTextStable=true;}
  // Exercise hiding from inside the body through the existing Settings handler.
  await evaluate('document.querySelector("#rift-objective-row").focus({preventScroll:true});document.querySelector("#rift-guidance-toggle").click()');assert(await evaluate('document.activeElement.id==="rift-hints-toggle"&&document.querySelector("#rift-objective-row").hidden'),'hiding focused hints returns focus to the visible toggle');await toggleWithInput();
  // Every existing unlocked cosmetic uses the same unchanged combat contract.
  record.cosmetics=[];
  for(const theme of ['default','ember','void','aurora','solar','radiant']){await evaluate(`riftStatusMobile.setup(${inset},'boss');(()=>{const b=__lumenfallQaBridge,s=b.getState();['d50','asc5','mythic','d250','modulemax'].forEach(id=>s.achieved[id]=true);b.setState(s);b.renderLayout();document.querySelector('[data-theme-select="'+${JSON.stringify(theme)}+'"]').click();})()`);assert(await evaluate(`__lumenfallQaBridge.getState().riftTheme===${JSON.stringify(theme)}`),'actual theme selection');const shown=await snapshot();await toggleWithInput(true);const hidden=await snapshot();sameGeometry(shown,hidden,'cosmetic '+theme);sameData(shown,hidden,'cosmetic hide');await toggleWithInput();record.cosmetics.push({theme,boxes:shown.boxes});}
  // F27 cosmetics and its visible Trial status are now integrated dependencies.
  record.cometCosmetics=[];
  for(const equipped of [{trail:true,crest:false},{trail:false,crest:true},{trail:true,crest:true}]){
   await evaluate(`riftStatusMobile.setup(${inset},'boss');(()=>{const b=__lumenfallQaBridge,s=b.getState();s.schemaVersion=2;s.owned.rifttrail=true;s.owned.starfallcrest=true;s.cometCosmetics={trail:false,crest:false};b.setState(s);b.renderLayout();${equipped.trail?"document.querySelector('[data-comet-cosmetic=trail]').click();":""}${equipped.crest?"document.querySelector('[data-comet-cosmetic=crest]').click();":""}})()`);
   assert(await evaluate(`document.querySelector('#enemy-stage').classList.contains('comet-trail-equipped')===${equipped.trail}&&document.querySelector('#enemy-stage').classList.contains('comet-crest-equipped')===${equipped.crest}`),'production Comet cosmetics are equipped');
   const shown=await snapshot();await toggleWithInput(true);const hidden=await snapshot();sameGeometry(shown,hidden,'Comet cosmetics');sameData(shown,hidden,'Comet cosmetics hints');await toggleWithInput();record.cometCosmetics.push({equipped,boxes:shown.boxes});
  }
  await evaluate(`riftStatusMobile.setup(${inset},'dense');(()=>{const b=__lumenfallQaBridge,s=b.getState();s.schemaVersion=2;s.owned.comettrials=true;s.maxDepthEver=Math.max(20,s.maxDepthEver);s.cometTrial={id:'quiet',target:15,phase:'pending'};b.setState(s);b.renderLayout();})()`);
  assert(await evaluate('!document.querySelector("#comet-trial-status").hidden&&document.querySelector("#comet-trial-status").textContent.length>0'),'integrated Trial status remains visible');
  const trialShown=await snapshot();await toggleWithInput(true);sameGeometry(trialShown,await snapshot(),'visible Trial hints');sameData(trialShown,await snapshot(),'visible Trial data');await toggleWithInput();record.visibleTrial={boxes:trialShown.boxes};
  // Collapse the reserved space in a throwaway DOM to prove the geometry oracle.
  if(records.length===1){await evaluate('document.querySelector("#rift-guidance-slot").style.height="90px"');const shown=await snapshot();await toggleWithInput();await evaluate('document.querySelector("#rift-guidance-slot").style.height="46px"');const hidden=await snapshot();let rejection;try{sameGeometry(shown,hidden,'collapsed reservation negative');}catch(error){rejection=error.message;}assert(rejection,'geometry oracle must reject collapsed reserved space');record.negativeControl=rejection;await evaluate('document.querySelector("#rift-guidance-slot").style.height=""');await toggleWithInput();}
  // Keyboard activation of the actual hint destination and tab return.
  await evaluate(`riftStatusMobile.setup(${inset},'fresh');(()=>{const b=__lumenfallQaBridge,s=b.getState();s.depth=s.enemyDepth=s.maxDepthEver=3;s.enemyMaxHp=s.enemyHp=b.enemyHpFor(3);s.lumen=100;b.setState(s);b.renderLayout();})();document.querySelector('#rift-objective').focus({preventScroll:true})`);await key('Enter');assert(await evaluate('document.querySelector("#tab-spirits").classList.contains("active")&&document.querySelector("#rift-guidance-slot").hidden'),'actual hint opens Wisps and removes the whole slot on another tab');await touch('[data-tab="battle"]');
  await toggleWithInput();await reload();assert(await evaluate('document.querySelector("#rift-objective-row").hidden&&localStorage.getItem("lumenfall_rift_guidance_hidden_v1")==="1"'),'real reload preserves hidden device preference');
  await evaluate(`riftStatusMobile.setup(${inset},'fresh')`);await touch('#settings-btn');const settingsBefore=await snapshot();await evaluate('document.querySelector("#rift-guidance-toggle").focus({preventScroll:true})');await touch('#rift-guidance-toggle');sameData(settingsBefore,await snapshot(),'Settings restore');assert(await evaluate('!document.querySelector("#rift-objective-row").hidden&&document.querySelector("#rift-hints-toggle").textContent==="Hide hints"&&localStorage.getItem("lumenfall_rift_guidance_hidden_v1")===null'),'Settings restores the same preference');assert(await evaluate('document.activeElement.id')==='rift-guidance-toggle','Settings restore keeps modal focus');await key('Escape');assert(await evaluate('document.activeElement.id')==='settings-btn','Settings closes with correct focus return');
  const errors=await evaluate('__lumenfallQaContext.errors');assert(!errors.length,'no production runtime errors');record.reloadPersisted=true;record.settingsSynchronized=true;
  await send('Target.disposeBrowserContext',{browserContextId:context.browserContextId},null);
 }
 assert(!runtimeErrors.length,'no CDP runtime exceptions');
}
(async()=>{
 const result={status:'fail',scope:midgameAccept?'RIFT_HINT_READABILITY_002':'RIFT_GUIDANCE_001',hintMutation,baselineProbe:baseline,readabilityProbe,midgameAccept,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),instrumentedSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'index.html'))).digest('hex'),records};
 try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
  browserExit=new Promise(resolve=>{browser.once('error',error=>resolve({error:error.message}));browser.once('close',(code,signal)=>{closed=true;resolve({code,signal});for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('browser closed'));}pending.clear();});});
  browser.stderr.on('data',data=>{stderr+=data;fs.appendFileSync(path.join(out,'chrome.stderr.log'),data);});
  for(const pipe of [browser.stdio[3],browser.stdio[4]])pipe.on('error',error=>{
   if(!closing){(result.transportErrors||(result.transportErrors=[])).push({code:error.code,message:error.message});result.status='fail';}
   for(const p of pending.values()){clearTimeout(p.timer);p.reject(error);}pending.clear();
  });
  browser.stdio[4].on('data',data=>{buffer+=data;let at;while((at=buffer.indexOf('\0'))>=0){const raw=buffer.slice(0,at);buffer=buffer.slice(at+1);if(!raw)continue;const m=JSON.parse(raw);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')runtimeErrors.push(m.params);}});
  result.browserVersion=await send('Browser.getVersion',{},null);
  await run(`http://127.0.0.1:${server.address().port}/index.html?qaScenario=rift-status-mobile&qaFixture=fresh`);assert(!result.transportErrors?.length,'no CDP transport errors');result.status='pass';
 }catch(error){
  result.message=error.stack;
  result.error={code:error.code||null,message:error.message,details:error.details||null};
  if(session&&!closed){try{await screenshot('failure');fs.writeFileSync(path.join(out,'failure.html'),await evaluate('document.documentElement.outerHTML'));}catch(captureError){result.captureError=captureError.stack;}}
 }
 finally{
  if(browser){closing=true;if(!closed)await send('Browser.close',{},null).catch(()=>{});let timer;const exit=await Promise.race([browserExit,new Promise(resolve=>timer=setTimeout(()=>resolve({timeout:true}),5000))]);clearTimeout(timer);if(exit.timeout){browser.kill('SIGKILL');await browserExit;}if(exit.timeout||exit.code!==0||exit.signal||exit.error)result.status='fail';result.teardown=exit;assert(closed,'browser closed before removing profile');}
  await new Promise(resolve=>server.close(resolve));fs.rmSync(profile,{recursive:true,force:true});fs.rmSync(root,{recursive:true,force:true});
 }
 result.runtimeErrors=runtimeErrors;
 fs.writeFileSync(path.join(out,'chrome.stderr.log'),stderr);
 result.chromeStderr={path:'chrome.stderr.log',bytes:Buffer.byteLength(stderr),sha256:crypto.createHash('sha256').update(stderr).digest('hex')};
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:result.status,profiles:records.length,samples:records.reduce((n,r)=>n+r.samples.length,0),message:result.message,result:path.join(out,'results.json')}));if(result.status!=='pass')process.exitCode=1;
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
