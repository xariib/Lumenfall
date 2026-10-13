'use strict';
// Original-data review only: no browser or gameplay execution.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const raw=path.resolve(process.argv[2]||path.join(__dirname,'../raw')),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),dependencies=[];
function read(rel){const b=fs.readFileSync(path.join(raw,rel));dependencies.push({path:rel,bytes:b.length,sha256:sha(b)});return b;}
const verification=JSON.parse(read('artifact-verification.json'));read('manifest.json');read('source-audit.json');
function member(rel){const b=read('artifact/'+rel),e=verification.members.find(x=>x.path===rel);assert(e);assert.equal(b.length,e.bytes);assert.equal(sha(b),e.sha256);return b;}
const report=JSON.parse(member('layout/normal/receipt.json')),processReceipt=JSON.parse(member('layout/normal/process.json')),summary=JSON.parse(member('layout/summary.json'));
const stdout=member('layout/normal/stdout.log');member('layout/normal/stderr.log');member('layout/normal/failure-dom.html');
const source=member('layout/normal/source.html'),driver=member('layout/instrumented-driver.cjs');
assert.equal(sha(source),'38eebcb93e4cdc2fbb1f9f67800f8cfb433005904389c0815641d26bbae00b6f');
assert.equal(sha(member('layout/candidate-source.html')),sha(source));member('layout/preparation.json');
for(const id of ['brand-spacing','wisp-header','toast-leading'])member('layout/'+id+'-inverse.json');
assert.equal(stdout.toString(),JSON.stringify(report)+'\n');assert.equal(sha(stdout),processReceipt.stdout.sha256);
assert.equal(report.status,'fail');assert.equal(report.checks,982);assert.equal(report.profiles.length,2);
assert.equal(report.identity.testSha256,'d95e30aa66b101bcfb8afcde023697e12acad581544964ece39a8304aa714abe');
assert.equal(report.sourceSha256,sha(source));assert.equal(processReceipt.driverSha256,sha(driver));
assert.equal(processReceipt.status,1);assert.equal(processReceipt.signal,null);assert.equal(processReceipt.error,null);
assert.deepEqual(report.exit,{code:0,signal:null});assert.equal(report.teardown,undefined);assert.equal(report.failure.status.errors.length,0);
assert.equal(summary.status,'FAIL');assert.equal(summary.results.length,1);assert.equal(summary.results[0].id,'normal');assert.equal(summary.results[0].accepted,false);
const f=report.diagnostics.geometryFailure,d=f.detail.measurement;
assert.equal(f.code,'wisp-glyph-outside-header');assert.equal(report.geometryCode,f.code);assert.deepEqual(f.profile,{width:320,scale:2,motion:'no-preference'});assert.equal(f.detail.id,'ember');
const contains=(a,b)=>b.left>=a.left-.5&&b.right<=a.right+.5&&b.top>=a.top-.5&&b.bottom<=a.bottom+.5;
const intersects=(a,b)=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>.5&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>.5;
const glyphs=d.name.glyphs.concat(d.classTag.glyphs),horizontal=glyphs.every(g=>g.rect.left>=d.header.rect.left-.5&&g.rect.right<=d.header.rect.right+.5);
const overhangs=d.name.glyphs.concat(d.classTag.glyphs).filter(g=>!contains(d.header.rect,g.rect)).map(g=>({text:g.text,rect:g.rect,top:d.header.rect.top-g.rect.top,left:Math.max(0,d.header.rect.left-g.rect.left),right:Math.max(0,g.rect.right-d.header.rect.right),bottom:Math.max(0,g.rect.bottom-d.header.rect.bottom)}));
assert(horizontal);assert.equal(d.header.overflowY,'visible');assert.equal(d.identity.overflowY,'visible');assert.equal(d.card.overflowY,'hidden');
assert.equal(overhangs.length,9);assert(overhangs.every(g=>g.top===1&&g.left===0&&g.right===0&&g.bottom===0));
assert(glyphs.every(g=>contains(d.card.rect,g.rect)&&contains(d.context.main,g.rect)&&g.rect.bottom<=d.context.nav.top+.5));
assert(!glyphs.some(g=>intersects(g.rect,d.button.rect)||intersects(g.rect,d.portrait.rect)));
assert(!d.name.glyphs.some(a=>d.classTag.glyphs.some(b=>intersects(a.rect,b.rect))));
assert.equal(d.name.rect.height,20.796875);assert.equal(d.name.lines[0].bottom-d.name.lines[0].top,22);
assert.equal(d.name.lines[0].top,347);assert.equal(d.header.rect.top,348);assert.equal(d.card.rect.top,335);
const partialProfiles=report.diagnostics.profiles.map(p=>{
 const actionFacts=p.inputs.map(row=>{
  for(const phase of ['immediate','settled']){assert.deepEqual(row[phase].state,row.before.state);assert.deepEqual(row[phase].slots,row.before.slots);assert.equal(row[phase].writes,row.before.writes);assert.equal(row[phase].status.errors.length,0);}
  const trusted=row.events.filter(e=>e.trusted&&(e.type==='click'||e.type==='keydown')).map(e=>({type:e.type,key:e.key,control:e.control}));assert(trusted.length>0);
  return {label:row.label,kind:row.kind||'Escape',completeStateAndBothSlotsUnchanged:true,saveWrites:0,trusted,immediateFocus:row.immediate.control.context.focus,settledFocus:row.settled.control.context.focus};
 });
 return {width:p.width,scale:p.scale,motion:p.motion,wisps:p.wisps.map(w=>w.id),actions:actionFacts,refusals:p.refusals.map(x=>({kind:x.kind,text:x.settled.toast.toast.text,lines:x.settled.toast.toast.lines,shown:x.settled.toast.toast.shown})),images:p.images};
});
assert.equal(partialProfiles.length,3);assert.equal(partialProfiles[2].actions.length,5);
for(const p of report.profiles){assert.equal(p.width,320);assert.equal(p.scale,1);assert.equal(p.wisps.length,8);assert.equal(p.refusals.length,2);assert.equal(p.inputs.length,7);
 for(const w of p.wisps)for(const phase of ['immediate','settled']){const m=w[phase],g=m.name.glyphs.concat(m.classTag.glyphs);assert(g.every(x=>contains(m.header.rect,x.rect)&&contains(m.card.rect,x.rect)));assert(!g.some(x=>intersects(x.rect,m.button.rect)||intersects(x.rect,m.portrait.rect)));}
 for(const action of p.refusals){assert.equal(action.settled.toast.toast.text,'You need at least one chosen Wisp.');assert(action.settled.control.context.sameRefusal);assert.deepEqual(action.before.state.activeParty,['ember']);for(const id of ['push','farm','boss'])assert.deepEqual(action.before.state.formationPresets[id],['ember']);assert.equal(action.before.state.formationRebuild,null);}
}
const readiness=report.diagnostics.readiness.map(t=>({profile:t.profile,phase:t.phase,status:t.status,elapsedMs:t.elapsedMs,probes:t.probes.length,final:t.probes.at(-1).value}));assert.equal(readiness.length,6);assert(readiness.every(t=>t.status==='ready'&&t.elapsedMs<=10000&&t.final.errors.length===0));
function observation(name){
 if(name==='failure.png')return 'Directly viewed enlarged Ember: full name and two class lines are clear; Bench occupies its own next row, without intersection. The one-pixel typographic overhang is inside the visible card. Lower ability content continues below the viewport through normal scrolling.';
 if(name.includes('brand-rift'))return name.includes('-2-')?'Directly viewed root32 wordmark close to but separate from Settings; original visible gear44px and native Rift remain. Fixed guidance shows a partial ordinary label, an explicitly excluded later readability topic.':'Directly viewed root16 wordmark, sigil and Settings remain separated; Rift and navigation fit.';
 if(name.includes('settings'))return name.includes('-2-')?'Directly viewed enlarged Settings title and Close fit; body wraps and continues below the scrollable modal. No enlarged body/full-scroll acceptance is inferred from this still image.':'Directly viewed Settings title/Close and ordinary body fit the modal; native focus and close behavior are separately bound to actual input records.';
 if(name.includes('last-wisp-toast'))return 'Directly viewed actual last-Wisp refusal as a clear single-line toast above navigation. This root16 image does not prove enlarged multiline toast behavior.';
 if(name.includes('wisp-ember'))return 'Directly viewed Ember name/class separated from portrait and Bench; no identity clipping.';
 if(name.includes('wisp-gale'))return 'Directly viewed Gale name and wrapped Windrunner/Shard Utility class separated from portrait and Bench.';
 if(name.includes('wisp-titan'))return 'Directly viewed two-line Starforged Titan name, Duskguard/Breaker class and Field control, all separated.';
 throw Error('unreviewed image '+name);
}
const images=fs.readdirSync(path.join(raw,'artifact/layout/normal')).filter(n=>n.endsWith('.png')).sort().map(name=>{const b=member('layout/normal/'+name);return {path:'artifact/layout/normal/'+name,bytes:b.length,sha256:sha(b),width:b.readUInt32BE(16),height:b.readUInt32BE(20),directlyViewed:true,observation:observation(name)};});assert.equal(images.length,15);assert.equal(new Set(images.map(i=>i.sha256)).size,15);
const audit={status:'FAILED_DIAGNOSTIC_TRANSPARENT_HEADER_BOUNDARY_IDENTIFIED',auditKind:'Re-read original bytes/measurements/input; no browser or gameplay execution',candidate:'33153db7a59dbf0d69412241a33ac076177dee7f',run:38111030896,artifact:verification.artifact,identity:report.identity,generatedDriverSha256:sha(driver),browserVersion:report.browserVersion,actual:{checks:982,completedProfiles:2,completedNegativeControls:0,negativeDisposition:'All three unexecuted because normal failed.',failureProfile:f.profile,failureWisp:'ember',processExit:1,chromeExit:report.exit,runtimeErrors:[]},finding:{classification:'The identity sets the enlarged flex-header height; the same transparent nonclipping Cinzel Range overhang lies1px above that header.',header:d.header.rect,headerOverflowY:d.header.overflowY,identity:d.identity.rect,identityOverflowY:d.identity.overflowY,nameBox:d.name.rect,nameGlyphLine:d.name.lines[0],classGlyphLines:d.classTag.lines,card:d.card.rect,cardOverflowY:d.card.overflowY,main:d.context.main,button:d.button.rect,overhangs,horizontalHeaderContainment:horizontal,fullCardAndVisibleMainRectContainment:true,allRelevantOverlapTestsClear:true},repairDirection:'Keep structural identity/header x limits and the0.5px tolerance. Observe actual per-axis overflow clipping ancestors using inner client boxes; require glyphs inside those owners and the visible main/viewport/card. Keep all overlap/input/focus/save/inverse assertions. Do not alter product typography.',readiness,partialProfiles,images,limitations:['Only the two320/root16 profiles completed; all12 and all3 causal controls remain required.','New ancestor/client-box observation code was not present in this run and awaits actual browser execution.','Arithmetic here re-evaluates previously captured measurements; it is not a repaired browser PASS.','Range boxes are typographic metrics rather than raster ink masks.','Native Android/WebView60/textZoom/physical input/TalkBack remain untested.'],dependencies};
fs.writeFileSync(path.join(__dirname,'browser-subaudit.json'),JSON.stringify(audit,null,2)+'\n');
fs.writeFileSync(path.join(__dirname,'observed-geometry.json'),JSON.stringify({originalReceiptSha256:'09fd6f9c90df523cc681d6bd4364b633b523639c0eae3ca2e995fe42b1496ce1',originalJsonPath:'diagnostics.geometryFailure',value:f},null,2)+'\n');
console.log(JSON.stringify({status:audit.status,actual:audit.actual,images:images.length,uniqueImages:15,overhangPx:1}));
