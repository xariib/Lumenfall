'use strict';
// Re-read captured bytes and observations only. Never launches the game/browser.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const raw=path.resolve(process.argv[2]||path.join(__dirname,'../raw'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),dependencies=[];
function read(rel){const b=fs.readFileSync(path.join(raw,rel));dependencies.push({path:rel,bytes:b.length,sha256:sha(b)});return b;}
const verification=JSON.parse(read('artifact-verification.json'));
const sourceAudit=JSON.parse(read('source-audit.json'));const rawManifest=JSON.parse(read('manifest.json'));
assert.equal(verification.artifact.head,'b11567aac6a2d52145fe86c522b36fb559062cf9');
assert.equal(verification.artifact.run,38111828759);assert.equal(verification.artifact.id,11691069774);
assert.equal(verification.crc.exitCode,0);assert.equal(sourceAudit.head,verification.artifact.head);
assert.equal(sourceAudit.tree,'c9b173671946e4fecfeaffc3305813b9e75911c5');
assert.deepEqual(sourceAudit.orderedParents,['33153db7a59dbf0d69412241a33ac076177dee7f']);
function member(rel){const b=read('artifact/'+rel),e=verification.members.find(x=>x.path===rel);assert(e,rel);assert.equal(b.length,e.bytes);assert.equal(sha(b),e.sha256);return b;}
function sourceFile(rel){const b=read('source/'+rel),e=sourceAudit.sourceRows.find(x=>x.path===rel);assert(e,rel);assert.equal(b.length,e.bytes);assert.equal(sha(b),e.sha256);return b;}
const SOURCE='38eebcb93e4cdc2fbb1f9f67800f8cfb433005904389c0815641d26bbae00b6f';
const TEST='a2d4346daa8da30d61ef39135cb22399fc7b9b3cce40da9813d70c1fbcdf058c';
const GENERATED='d7ae33bf404009191d0dbe726f9d7ed6b2fa9eaa633413174da4863b011f82f5';
const source=member('layout/candidate-source.html');assert.equal(sha(source),SOURCE);assert.equal(sha(sourceFile('index.html')),SOURCE);
assert.equal(sha(sourceFile('tests/behavioral/shared-layout-ui.cjs')),TEST);
assert.equal(sha(sourceFile('tests/behavioral/prism-acceptance.cjs')),'8009b22eb4d4551f4aef2c3f0db82507e595d8f434db000327cb95805291d6dd');
assert.equal(sha(sourceFile('tests/behavioral/prism-earning-reference.cjs')),'46d0ce1b498f6a7f37d87d6e5954e717292a6db86f39e2093853164435b51be2');
assert.equal(sha(member('layout/instrumented-driver.cjs')),GENERATED);
const preparation=JSON.parse(member('layout/preparation.json')),summary=JSON.parse(member('layout/summary.json'));
for(const a of preparation.assets){const b=sourceFile(a.path);assert.equal(b.length,a.bytes);assert.equal(sha(b),a.sha256);}
assert.equal(summary.status,'PASS');assert.equal(summary.results.length,4);assert(summary.results.every(r=>r.accepted));
const specs=[['ember','Ember Wisp','Starcaller · Burst'],['tide','Tide Sprite','Dawnpriest · Amplifier'],['stone','Stoneheart Golem','Duskguard · Breaker'],['gale','Gale Dancer','Windrunner · Shard Utility'],['thorn','Thornback','Thornshaper · Lumen Utility'],['void','Voidling','Starcaller · Burst'],['aurora','Aurora Seer','Dawnpriest · Amplifier'],['titan','Starforged Titan','Duskguard · Breaker']];
const inverses=[
 {id:'brand-spacing',code:'brand-glyph-intersects-settings',checks:1176,from:'  @media(max-width:360px){.hud .brand{letter-spacing:.04em;}}\n',to:''},
 {id:'wisp-header',code:'wisp-glyph-intersects-toggle',checks:1268,from:'  #tab-spirits .hero-top{margin-bottom:6px;flex-wrap:wrap;}\n  #tab-spirits .hero-id{min-width:min-content;}\n',to:'  #tab-spirits .hero-top{margin-bottom:6px;}\n'},
 {id:'toast-leading',code:'toast-adjacent-glyph-lines-intersect',checks:1699,from:'    line-height:1.4;border-radius:12px;\n',to:'    line-height:16px;border-radius:12px;\n'}
];
const contains=(a,b)=>b.left>=a.left-.5&&b.right<=a.right+.5&&b.top>=a.top-.5&&b.bottom<=a.bottom+.5;
const intersects=(a,b)=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>.5&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>.5;
function ready(report){return report.diagnostics.readiness.map(t=>{
 assert.equal(t.status,'ready');assert(t.elapsedMs<=10000);const s=t.probes.at(-1).value;
 assert(s.initialized);for(const k of ['newGame','startup','hasStartupFinish','resume','offline','offlinePending','reload','reset','blocked','hidden','inert','toastShown'])assert.equal(s[k],false,k);
 assert.deepEqual(s.errors,[]);assert.deepEqual(s.overlays,[]);assert.equal(s.milestones,0);
 for(const p of t.probes)if(p.status==='navigation-interrupted'){assert.equal(p.error.method,'Runtime.evaluate');assert.equal(p.error.protocol.code,-32000);assert.equal(p.error.protocol.message,'Inspected target navigated or closed');}
 return {profile:t.profile,phase:t.phase,elapsedMs:t.elapsedMs,probes:t.probes.length,naturalReady:true};
});}
function loadReport(id,expectedSource){
 const rb=member('layout/'+id+'/receipt.json'),r=JSON.parse(rb),p=JSON.parse(member('layout/'+id+'/process.json'));
 const out=member('layout/'+id+'/stdout.log'),err=member('layout/'+id+'/stderr.log');
 assert.equal(out.toString(),JSON.stringify(r)+'\n');assert.equal(out.length,p.stdout.bytes);assert.equal(sha(out),p.stdout.sha256);
 assert.equal(err.length,0);assert.equal(sha(err),p.stderr.sha256);assert.equal(p.signal,null);assert.equal(p.error,null);
 assert.equal(sha(member('layout/'+id+'/source.html')),expectedSource);assert.equal(r.sourceSha256,expectedSource);assert.equal(p.sourceSha256,expectedSource);
 assert.equal(r.identity.testSha256,TEST);assert.deepEqual(r.identity,summary.identity);assert.equal(p.driverSha256,GENERATED);
 assert.deepEqual(r.exit,{code:0,signal:null});assert.equal(r.teardown,undefined);assert.equal(r.browserVersion.product,'Chrome/154.0.8037.97');
 const sr=summary.results.find(x=>x.id===id);assert.equal(sr.receiptSha256,sha(rb));assert.equal(sr.exitCode,p.status);assert.equal(sr.checks,r.checks);assert.equal(sr.profiles,r.profiles.length);
 const readiness=ready(r);assert.equal(readiness.length,r.diagnostics.profiles.length*2);
 // Chrome infrastructure stderr is preserved in the original receipt; its DBus
 // and registration diagnostics are not application runtime exceptions.
 return {report:r,process:p,readiness,rawReceiptSha256:sha(rb),chromeStderrBytes:Buffer.byteLength(r.stderr||''),chromeStderrSha256:sha(Buffer.from(r.stderr||''))};
}
function font(d,p){assert.equal(d.context.width,p.width);assert.equal(d.context.height,844);assert.equal(d.context.rootFont,16*p.scale+'px');assert(d.context.bodyWidth<=p.width+1&&d.context.documentWidth<=p.width+1);assert.equal(d.context.fontStatus,'loaded');assert(d.context.fonts.cinzel&&d.context.fonts.manrope&&d.context.rafNative);}
function fixture(f,single){const party=single?['ember']:specs.slice(0,5).map(x=>x[0]);assert.deepEqual(f.chosen,party);assert.deepEqual(f.state.activeParty,party);assert.equal(f.capacity,5);
 assert.equal(f.slots.length,2);for(const x of f.slots)assert.equal(x.raw,JSON.stringify(f.state));
 for(const s of specs)assert.equal(f.state.spirits[s[0]],20);for(const k of ['push','farm','boss'])assert.deepEqual(f.state.formationPresets[k],party);
 assert.equal(f.state.activeFormationPreset,'push');assert.equal(f.state.formationRebuild,null);
 for(const [k,v] of Object.entries({starlight:7,steady:9,momentum:11,swift:10}))assert.equal(f.state.nodes[k],v);
 for(const [k,v] of Object.entries({focus:3,sense:4,formation:5,resolve:6}))assert.equal(f.state.research[k],v);
 for(const [k,v] of Object.entries({guardmastery:2,prismstudy:3,labcapacity:1}))assert.equal(f.state.longStudyLevels[k],v);
 assert.deepEqual(f.state.activeStudies,[{id:'wispascend',remainingSec:90,totalDurationSec:180,speedMult:1.5},{id:'shardstudy',remainingSec:100,totalDurationSec:200,speedMult:2}]);
 assert.equal(f.state.owned.autoascend,true);assert.equal(f.state.autoAscendEnabled,false);assert.equal(f.state.autoAscendTargetDepth,200);
 for(const k of ['empowerQueue','researchQueue','studyQueue'])assert(Object.values(f.state[k]).every(x=>x===false));
}
function action(row){
 for(const phase of ['immediate','settled']){assert.deepEqual(row[phase].state,row.before.state);assert.deepEqual(row[phase].slots,row.before.slots);assert.equal(row[phase].writes,row.before.writes);assert.deepEqual(row[phase].status.errors,[]);for(const k of ['reload','reset','blocked'])assert.equal(row[phase].status[k],false);}
 const expected=row.label==='native Escape closes Settings'?null:row.selector==='#settings-btn'?{id:'settings-btn',toggle:null,tab:null}:row.selector==='#settings-close'?{id:'settings-close',toggle:null,tab:null}:row.selector.includes('data-tab')?{id:'nav-spirits',toggle:null,tab:'spirits'}:{id:null,toggle:'ember',tab:null};
 if(!expected)assert(row.events.some(e=>e.trusted&&e.type==='keydown'&&e.key==='Escape'));
 else {assert(row.events.some(e=>e.trusted&&e.type==='click'&&JSON.stringify(e.control)===JSON.stringify(expected)));
  const c=row.before.control.control;assert(c.connected&&!c.disabled&&c.hit);assert(c.rect.width>=44&&c.rect.height>=44);
  if(row.kind==='touch'){assert(row.events.some(e=>e.trusted&&e.type==='touchstart'));assert(row.events.some(e=>e.trusted&&e.type==='touchend'));}
  else assert(row.events.some(e=>e.trusted&&e.type==='keydown'&&e.key==='Enter'));
 }
 return {label:row.label,kind:row.kind||'Escape',completeStateAndBothSlotsUnchanged:true,noSaveWrites:true,nativeInput:true,immediateFocus:row.immediate.control.context.focus,settledFocus:row.settled.control.context.focus};
}
function samePosition(before,after){const a=before.control.control.rect,b=after.control.control.rect;for(const k of ['left','top','width','height'])assert(Math.abs(a[k]-b[k])<=1,k);assert(Math.abs(before.control.context.mainScroll-after.control.context.mainScroll)<=1);}
function brand(d,p){font(d,p);assert.equal(d.brand.text,'Lumenfall');assert.equal(d.brand.glyphs.length,9);assert.equal(parseFloat(d.brand.fontSize),16*p.scale);assert(d.logo.loaded);assert.equal(d.logo.rect.width,30);assert.equal(d.logo.rect.height,30);assert(d.gear.rect.width>=44&&d.gear.rect.height>=44);assert.equal(d.gear.label,'Open settings');
 for(const g of d.brand.glyphs){assert(!intersects(g.rect,d.gear.rect));assert(!intersects(g.rect,d.logo.rect));assert(contains(d.context.layout['.hud-title-row'],g.rect));assert(g.rect.left>=-.5&&g.rect.right<=p.width+.5);}
 return {letterSpacing:d.brand.letterSpacing,brandFont:d.brand.fontSize,gear:d.gear.rect,glyphToGearGap:d.gear.rect.left-Math.max(...d.brand.glyphs.map(g=>g.rect.right))};
}
let glyphMeasurements=0,ownerMeasurements=0;
function wisp(d,p,spec){font(d,p);assert.equal(d.name.text,spec[1]);assert.equal(d.classTag.text,spec[2]);assert.equal(d.button.text,specs.indexOf(spec)<5?'Bench':'Field');assert(d.button.rect.width>=44&&d.button.rect.height>=44);
 const glyphs=d.name.glyphs.concat(d.classTag.glyphs),v={left:Math.max(0,d.context.mainInner.left),right:Math.min(p.width,d.context.mainInner.right),top:Math.max(0,d.context.mainInner.top),bottom:Math.min(844,d.context.mainInner.bottom,d.context.nav.top)};
 assert(glyphs.length>0);glyphMeasurements+=glyphs.length;
 for(const g of glyphs){assert(!intersects(g.rect,d.button.rect));assert(!intersects(g.rect,d.portrait.rect));assert(contains(d.card.rect,g.rect));assert(contains(v,g.rect));for(const e of [d.header,d.identity])assert(g.rect.left>=e.rect.left-.5&&g.rect.right<=e.rect.right+.5);if(d.identity.overflowY!=='visible')assert(g.rect.top>=d.identity.rect.top-.5&&g.rect.bottom<=d.identity.rect.bottom+.5);}
 assert(!d.name.glyphs.some(a=>d.classTag.glyphs.some(b=>intersects(a.rect,b.rect))));
 const owners=[];for(const field of ['name','classTag']){const list=d.clippingOwners[field];assert(list.some(o=>o.className.includes('hero-card')));assert(list.some(o=>o.tag==='MAIN'));assert(list.some(o=>o.className==='shell'));assert(list.some(o=>o.tag==='BODY'));
  for(const o of list){assert.equal(o.transform,'none');assert.equal(o.clipsX,o.overflowX!=='visible');assert.equal(o.clipsY,o.overflowY!=='visible');assert.equal(o.client.left,o.rect.left+o.clientLeft);assert.equal(o.client.top,o.rect.top+o.clientTop);assert.equal(o.client.right,o.client.left+o.client.width);assert.equal(o.client.bottom,o.client.top+o.client.height);assert(o.client.width>0&&o.client.height>0);ownerMeasurements++;
   for(const g of d[field].glyphs){if(o.clipsX)assert(g.rect.left>=o.client.left-.5&&g.rect.right<=o.client.right+.5);if(o.clipsY)assert(g.rect.top>=o.client.top-.5&&g.rect.bottom<=o.client.bottom+.5);}
   owners.push({field,tag:o.tag,className:o.className,overflowX:o.overflowX,overflowY:o.overflowY,client:o.client});
  }
 }
 assert(d.header.rect.top>=d.context.main.top-.5&&d.header.rect.bottom<=Math.min(d.context.main.bottom,d.context.nav.top)+.5);
 return {id:spec[0],identity:d.identity.rect,header:d.header.rect,nameLines:d.name.lines,classLines:d.classTag.lines,button:d.button.rect,card:d.card.rect,visibleMain:v,owners};
}
function toast(d,p,settled){const t=d.toast;assert.equal(t.text,'You need at least one chosen Wisp.');assert(t.shown);assert.equal(t.role,'status');assert.equal(t.live,'polite');assert.equal(t.atomic,'true');assert(t.glyphs.length>0&&t.lines.length>0);if(p.scale===2)assert(t.lines.length>=2);
 const gaps=[];for(let i=1;i<t.lines.length;i++){const gap=t.lines[i].top-t.lines[i-1].bottom;assert(gap>=-.5);gaps.push(gap);}for(const g of t.glyphs)assert(contains(t.rect,g.rect));assert(t.rect.left>=-.5&&t.rect.right<=p.width+.5&&t.rect.top>=-.5&&t.rect.bottom<=d.context.nav.top+.5);if(settled){assert.equal(parseFloat(t.opacity),1);assert.equal(t.visibility,'visible');assert.notEqual(t.display,'none');}
 return {fontSize:t.fontSize,lineHeight:t.lineHeight,lines:t.lines,adjacentGaps:gaps,rect:t.rect};
}
const normal=loadReport('normal',SOURCE),r=normal.report;assert.equal(normal.process.status,0);assert.equal(r.status,'pass');assert.equal(r.checks,6985);assert.equal(r.profiles.length,12);assert.equal(r.diagnostics.geometryFailure,null);
const wanted=[];for(const width of [320,390,430])for(const scale of [1,2])for(const motion of ['no-preference','reduce'])wanted.push([width,scale,motion]);assert.deepEqual(r.profiles.map(p=>[p.width,p.scale,p.motion]),wanted);assert.deepEqual(r.diagnostics.profiles,r.profiles);
const profileFacts=r.profiles.map(p=>{
 fixture(p.fixture,false);fixture(p.refusalFixture,true);assert.equal(p.brand.length,2);assert.equal(p.wisps.length,8);assert.equal(p.inputs.length,7);assert.equal(p.refusals.length,2);assert.equal(p.images.length,6);
 const brands=p.brand.map(b=>({phase:b.phase,...brand(b.measurement,p)}));const actions=p.inputs.map(action);
 const open=p.inputs[0],escape=p.inputs[1],enter=p.inputs[2],close=p.inputs[3];
 for(const phase of ['immediate','settled']){for(const x of [open,enter]){assert.equal(x[phase].settings.overlay.display,'flex');assert(x[phase].settings.shellInert);assert.equal(x[phase].control.context.focus.id,'settings-close');}
  for(const x of [escape,close]){assert.equal(x[phase].settings.overlay.display,'none');assert.equal(x[phase].settings.shellInert,false);assert(x[phase].control.context.sameGear&&x[phase].control.context.focusSameGear);}
  samePosition(open.before,escape[phase]);assert.deepEqual(escape[phase].control.context.layout,open.before.control.context.layout);
 }
 assert.deepEqual(p.brand[1].measurement.context.layout,open.before.control.context.layout);
 const wisps=p.wisps.map((w,i)=>{assert.equal(w.id,specs[i][0]);return {id:w.id,immediate:wisp(w.immediate,p,specs[i]),settled:wisp(w.settled,p,specs[i])};});
 const refusals=p.refusals.map((a,i)=>{assert.deepEqual(a,p.inputs[i+5]);assert.equal(a.kind,i?'Enter':'touch');for(const phase of ['immediate','settled']){assert(a[phase].control.context.sameRefusal);samePosition(a.before,a[phase]);}return {kind:a.kind,immediate:toast(a.immediate.toast,p,false),settled:toast(a.settled.toast,p,true)};});
 return {profile:{width:p.width,scale:p.scale,motion:p.motion},brands,actions,wisps,refusals,images:p.images};
});
const negativeFacts=inverses.map(inv=>{
 assert.equal(source.toString().split(inv.from).length-1,1);const expected=Buffer.from(source.toString().replace(inv.from,inv.to));const inverse=JSON.parse(member('layout/'+inv.id+'-inverse.json'));assert.equal(inverse.from,inv.from);assert.equal(inverse.to,inv.to);assert.equal(inverse.sourceSha256,SOURCE);assert.equal(inverse.mutantSha256,sha(expected));
 const n=loadReport(inv.id,sha(expected));assert.equal(n.process.status,1);assert.equal(n.report.status,'fail');assert.equal(n.report.geometryCode,inv.code);assert.equal(n.report.checks,inv.checks);assert.equal(n.report.profiles.length,2);assert.deepEqual(n.report.failure.status.errors,[]);assert(n.report.error.startsWith('AssertionError [ERR_ASSERTION]: '+inv.code+'\n'));
 const f=n.report.diagnostics.geometryFailure;assert.equal(f.code,inv.code);assert.deepEqual(f.profile,{width:320,scale:2,motion:'no-preference'});member('layout/'+inv.id+'/failure-dom.html');
 const d=f.detail.measurement||f.detail;let proof;
 if(inv.id==='brand-spacing'){const hits=d.brand.glyphs.filter(g=>intersects(g.rect,d.gear.rect));assert.equal(hits.length,1);assert.equal(d.brand.letterSpacing,'3.84px');assert.equal(hits[0].rect.right,287.390625);assert.equal(d.gear.rect.left,264.984375);proof={glyphs:hits,gear:d.gear.rect,horizontalOverlap:Math.min(hits[0].rect.right,d.gear.rect.right)-Math.max(hits[0].rect.left,d.gear.rect.left)};}
 else if(inv.id==='wisp-header'){assert.equal(f.detail.id,'ember');const hits=d.name.glyphs.concat(d.classTag.glyphs).filter(g=>intersects(g.rect,d.button.rect));assert.deepEqual(hits.map(g=>g.text),['e','r']);proof={glyphs:hits,button:d.button.rect,identity:d.identity.rect};}
 else {assert.equal(d.toast.lineHeight,'16px');assert.equal(d.toast.fontSize,'24.32px');const overlap=d.toast.lines[0].bottom-d.toast.lines[1].top;assert.equal(overlap,17);proof={lines:d.toast.lines,overlap,container:d.toast.rect};}
 const nativeActions=n.report.diagnostics.profiles.flatMap(p=>p.inputs).map(action);
 return {id:inv.id,exactSourceOnlyInverse:true,sourceSha256:sha(expected),expectedAndActualGeometryCode:inv.code,checks:n.report.checks,completedPrefixProfiles:2,processExit:1,chromeExit:n.report.exit,readiness:n.readiness,proof,nativePrefixActions:nativeActions.length,rawReceiptSha256:n.rawReceiptSha256,chromeStderrBytes:n.chromeStderrBytes,chromeStderrSha256:n.chromeStderrSha256};
});
const viewed=JSON.parse(fs.readFileSync(path.join(__dirname,'viewed-paths.json'),'utf8'));
assert.equal(viewed.length,75);assert.equal(new Set(viewed).size,75);
function visualObservation(rel){
 if(rel==='brand-spacing/failure.png')return 'Directly viewed the final enlarged wordmark glyph occupying the Settings area after the sole narrow-spacing reversal.';
 if(rel==='wisp-header/failure.png')return 'Directly viewed enlarged Starcaller text extending underneath Bench after only the wrap/min-content reversal.';
 if(rel==='toast-leading/failure.png')return 'Directly viewed two actual refusal lines overlapping after only the16px-leading reversal.';
 if(rel.includes('brand-rift'))return rel.includes('-2-')?'Directly viewed enlarged wordmark and gear separated;320px is close but clear. The original fixed-height guidance shows a partial hint, already excluded from this three-fix scope.':'Directly viewed original wordmark, sigil and Settings separated; Rift/HUD/navigation fit.';
 if(rel.includes('settings'))return 'Directly viewed Settings title and native Close control fully visible; body wraps and continues through the existing modal scroll region. Input/focus proof comes from actual traces, not the still image.';
 if(rel.includes('last-wisp-toast'))return rel.includes('-2-')?'Directly viewed two clear refusal lines fully inside the toast above navigation, with separate line spacing.':'Directly viewed one clear refusal line above navigation.';
 if(rel.includes('wisp-'))return 'Directly viewed complete Wisp name and class, separate from portrait and Field/Bench. At320/root32 the control wraps below;390/430 permit side-by-side layout. Lower ability content may continue offscreen through normal main scrolling.';
 throw Error('unclassified viewed image '+rel);
}
const images=[];for(const dir of ['normal',...inverses.map(x=>x.id)])for(const name of fs.readdirSync(path.join(raw,'artifact/layout',dir)).filter(n=>n.endsWith('.png')).sort()){
 const rel=dir+'/'+name,b=member('layout/'+rel);images.push({path:'artifact/layout/'+rel,bytes:b.length,sha256:sha(b),width:b.readUInt32BE(16),height:b.readUInt32BE(20),directlyViewed:viewed.includes(rel),observation:viewed.includes(rel)?visualObservation(rel):'Original negative-prefix screenshot hash-bound; not separately visually re-reviewed in this focused subaudit.'});
}
assert.equal(images.length,118);assert.equal(images.filter(x=>x.directlyViewed).length,75);assert.equal(new Set(images.map(x=>x.sha256)).size,116);
for(const p of r.profiles)for(const name of p.images)assert(viewed.includes('normal/'+name));
const duplicates=[...new Set(images.map(x=>x.sha256))].map(h=>images.filter(x=>x.sha256===h)).filter(g=>g.length>1).map(g=>({sha256:g[0].sha256,paths:g.map(x=>x.path),coveredByDirectView:g.some(x=>x.directlyViewed)}));
const audit={status:'PASS_INDEPENDENT_DIAGNOSTIC_BROWSER_SUBAUDIT',auditKind:'Original-byte/geometry/input re-read plus direct PNG inspection; no new game or browser execution',candidate:verification.artifact.head,run:verification.artifact.run,artifact:verification.artifact,sourceTree:sourceAudit.tree,identity:r.identity,generatedDriverSha256:GENERATED,browserVersion:r.browserVersion,node:r.node,actual:{checks:6985,profiles:12,exactInverseCauses:3,normalProcessExit:0,chromeExit:r.exit,wispRows:96,wispImmediateAndSettledObservations:192,glyphMeasurements,clippingOwnerObservations:ownerMeasurements,nativeActionRows:84,settingsActionRows:48,nativeWispTabRows:12,lastWispRefusals:24,refusalTouch:12,refusalEnter:12,completeStateAndRawSlotComparisons:168,saveWritesDuringObservedActions:0,runtimeErrors:[]},readiness:normal.readiness,normalChromeStderr:{bytes:normal.chromeStderrBytes,sha256:normal.chromeStderrSha256,disposition:'Original DBus/UPower/registration infrastructure messages preserved; actual browser exits0 and application error arrays stay empty.'},profiles:profileFacts,negativeControls:negativeFacts,images:{total:118,uniqueHashes:116,directlyViewed:75,normalAll72:true,causalFailureAll3:true,remainingNegativePrefix:43,duplicateGroups:duplicates,entries:images},limitations:['This is the separate successful Diagnostic003 candidate, not the required final PR six-gate or postmerge acceptance.','Only CSS root-font16/32 emulation is measured; actual Android/WebView60 CSS, native textZoom, physical-device input and TalkBack remain untested.','Ambient setInterval is paused in the inherited transport; original native RAF, fonts, startup timers and action handlers execute.','Range rectangles are typographic font metrics, not pixel-level ink masks. Actual clipping ancestors/client boxes, visible main, card and overlapping controls remain measured.','Original fixed-height F07 guidance is a separate accepted contract and later readability follow-up; this audit adds no fourth layout fix.','The43 other negative-prefix PNG bodies are preserved/hash-bound; only the72 normal matrix images and3 causal failure images were directly viewed.','No all-body Settings-scroll, whole-application contrast or arbitrary save coverage is inferred from these scoped screenshots and synthetic fixtures.'],dependencies};
fs.writeFileSync(path.join(__dirname,'browser-subaudit.json'),JSON.stringify(audit,null,2)+'\n');
fs.writeFileSync(path.join(__dirname,'causal-geometry.json'),JSON.stringify({sourceSha256:SOURCE,normalProfile:profileFacts.find(p=>p.profile.width===320&&p.profile.scale===2&&p.profile.motion==='no-preference'),inverses:negativeFacts},null,2)+'\n');
console.log(JSON.stringify({status:audit.status,actual:audit.actual,images:{total:118,directlyViewed:75,unique:116},negativeCauses:negativeFacts.map(n=>n.expectedAndActualGeometryCode)}));
