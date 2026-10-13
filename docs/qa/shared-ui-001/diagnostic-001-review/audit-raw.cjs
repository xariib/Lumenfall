'use strict';
// Re-read original CI observations only. This does not run a browser or game.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const raw=path.resolve(process.argv[2]||path.join(__dirname,'../raw'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const dependencies=[];
function read(rel){const b=fs.readFileSync(path.join(raw,rel));dependencies.push({path:rel,bytes:b.length,sha256:sha(b)});return b;}
const verification=JSON.parse(read('artifact-verification.json'));
function member(rel){const b=read('artifact/'+rel),e=verification.members.find(x=>x.path===rel);assert(e,'original ZIP member '+rel);assert.equal(b.length,e.bytes);assert.equal(sha(b),e.sha256);return b;}
const report=JSON.parse(member('layout/normal/receipt.json'));
const processReceipt=JSON.parse(member('layout/normal/process.json'));
const summary=JSON.parse(member('layout/summary.json'));
const stdout=member('layout/normal/stdout.log');member('layout/normal/stderr.log');
const source=member('layout/normal/source.html');
assert.equal(sha(source),'38eebcb93e4cdc2fbb1f9f67800f8cfb433005904389c0815641d26bbae00b6f');
assert.equal(sha(member('layout/candidate-source.html')),sha(source));
const driver=member('layout/instrumented-driver.cjs');
assert.equal(sha(driver),'b9d3276d59de4252d4176976fd8e611ba6fd1e7aa80832e748c945ec969b548e');
member('layout/normal/failure-dom.html');member('layout/preparation.json');
for(const id of ['brand-spacing','wisp-header','toast-leading'])member('layout/'+id+'-inverse.json');
assert.equal(stdout.toString(),JSON.stringify(report)+'\n');
assert.equal(processReceipt.stdout.sha256,sha(stdout));
assert.equal(report.status,'fail');assert.equal(report.checks,113);assert.equal(report.profiles.length,0);
assert.equal(processReceipt.status,1);assert.equal(processReceipt.signal,null);assert.equal(processReceipt.error,null);
assert.deepEqual(report.exit,{code:0,signal:null});assert.equal(report.teardown,undefined);
assert.equal(report.identity.testSha256,'da1b05466ec74394402f93733b9f665276b42ed87ff5fa1067554804b548f609');
assert.equal(report.sourceSha256,sha(source));assert.equal(report.geometryCode,'wisp-glyph-outside-identity');
assert.equal(summary.status,'FAIL');assert.equal(summary.results.length,1);assert.equal(summary.results[0].id,'normal');
assert.equal(summary.results[0].accepted,false);
const failure=report.diagnostics.geometryFailure,d=failure.detail.measurement;
assert.deepEqual(failure.profile,{width:320,scale:1,motion:'no-preference'});assert.equal(failure.detail.id,'ember');
assert.equal(report.failure.status.errors.length,0);
const contains=(a,b)=>b.left>=a.left-.5&&b.right<=a.right+.5&&b.top>=a.top-.5&&b.bottom<=a.bottom+.5;
const intersects=(a,b)=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>.5&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>.5;
const glyphs=d.name.glyphs.concat(d.classTag.glyphs);
const horizontal=glyphs.every(g=>g.rect.left>=d.identity.rect.left-.5&&g.rect.right<=d.identity.rect.right+.5);
const vertical=glyphs.every(g=>g.rect.top>=d.identity.rect.top-.5&&g.rect.bottom<=d.identity.rect.bottom+.5);
const oldFullContainment=glyphs.every(g=>contains(d.identity.rect,g.rect));
const overhangs=[['name',d.name],['classTag',d.classTag]].flatMap(([kind,e])=>e.glyphs.filter(g=>!contains(d.identity.rect,g.rect)).map(g=>({kind,text:g.text,rect:g.rect,left:Math.max(0,d.identity.rect.left-g.rect.left),right:Math.max(0,g.rect.right-d.identity.rect.right),top:Math.max(0,d.identity.rect.top-g.rect.top),bottom:Math.max(0,g.rect.bottom-d.identity.rect.bottom)})));
assert.equal(horizontal,true);assert.equal(vertical,false);assert.equal(oldFullContainment,false);
assert.equal(d.identity.overflowY,'visible');assert.equal(overhangs.length,9);
assert(overhangs.every(g=>g.kind==='name'&&g.top===1&&g.bottom===0&&g.left===0&&g.right===0));
assert(glyphs.every(g=>contains(d.header.rect,g.rect)&&contains(d.card.rect,g.rect)));
assert(!glyphs.some(g=>intersects(g.rect,d.button.rect)||intersects(g.rect,d.portrait.rect)));
assert(!d.name.glyphs.some(a=>d.classTag.glyphs.some(b=>intersects(a.rect,b.rect))));
assert.equal(d.context.fontStatus,'loaded');assert(d.context.fonts.cinzel&&d.context.fonts.manrope&&d.context.rafNative);
assert.equal(d.name.fontSize,'16px');assert.equal(d.name.lineHeight,'20.8px');
assert.equal(d.name.rect.height,20.796875);assert.equal(d.name.lines[0].bottom-d.name.lines[0].top,22);
const readiness=report.diagnostics.readiness.map(t=>({phase:t.phase,status:t.status,elapsedMs:t.elapsedMs,probes:t.probes.length,final:t.probes[t.probes.length-1].value}));
assert.equal(readiness.length,2);assert(readiness.every(t=>t.status==='ready'&&t.elapsedMs<=10000&&t.final.errors.length===0));
const partial=report.diagnostics.profiles[0];assert.equal(report.diagnostics.profiles.length,1);
const input=partial.inputs.map(row=>{
 for(const p of ['immediate','settled']){assert.deepEqual(row[p].state,row.before.state);assert.deepEqual(row[p].slots,row.before.slots);assert.equal(row[p].writes,row.before.writes);assert.equal(row[p].status.errors.length,0);}
 const trusted=row.events.filter(e=>e.trusted&&(e.type==='click'||e.type==='keydown')).map(e=>({type:e.type,key:e.key,control:e.control}));
 assert(trusted.length>0);
 return {label:row.label,kind:row.kind||'Escape',completeStateAndBothRawSlotsUnchanged:true,saveWrites:row.settled.writes-row.before.writes,trusted,immediateFocus:row.immediate.control.context.focus,settledFocus:row.settled.control.context.focus};
});
assert.equal(input.length,5);
const imageNotes={
 'shared-320-1-no-preference-brand-rift.png':'Directly viewed: root16 wordmark and gear are separated; original Rift, wallets and bottom navigation are visible. The intentionally fixed guidance strip remains vertically scrollable and is not accepted as a changed readability contract.',
 'shared-320-1-no-preference-settings.png':'Directly viewed: Settings title and Close control fit; body is a vertically scrollable modal. This still image does not independently prove keyboard focus; the original trusted event/endpoint records do.',
 'failure.png':'Directly viewed: full Ember name and class are clear and separated from portrait and Bench. No visible clipping at the transparent identity top. Card extends below the viewport with ordinary main scrolling; remaining cards and enlarged profiles were not reached.'
};
const images=Object.entries(imageNotes).map(([file,observation])=>{const b=member('layout/normal/'+file);return {path:'artifact/layout/normal/'+file,bytes:b.length,sha256:sha(b),directlyViewed:true,observation};});
const audit={status:'FAILED_DIAGNOSTIC_TEST_BOUNDARY_IDENTIFIED',auditKind:'Original-data hash/geometry/input review; not browser or game execution',candidate:'9f6ff0abe08c87ff8a7a007e5b51c89ca7e48233',run:38110447923,artifact:verification.artifact,identity:report.identity,generatedDriverSha256:sha(driver),browserVersion:report.browserVersion,actual:{checks:113,completedProfiles:0,startedProfile:failure.profile,startedWisp:'ember',completedNegativeControls:0,negativeDisposition:'All three were unexecuted because normal failed.',processExit:1,chromeExit:report.exit,runtimeErrors:[]},finding:{classification:'An overstrict test predicate applied full vertical containment to a transparent nonclipping CSS line box.',identity:d.identity.rect,identityOverflowY:d.identity.overflowY,nameElement:d.name.rect,nameFont:d.name.font,nameGlyphLine:d.name.lines[0],classGlyphLine:d.classTag.lines[0],header:d.header.rect,card:d.card.rect,button:d.button.rect,overhangs,oldFullContainment,horizontalContainment:horizontal,fullHeaderAndCardContainment:true,controlPortraitAndNameClassNonOverlap:true},repairDirection:'Bound the identity column horizontally using the same0.5px tolerance; enforce vertical containment when its observed overflowY clips; retain full2Dheader/viewport and all overlap checks, and add full card containment. Product CSS stays unchanged.',readiness,input,images,limitations:['No complete profile or CSS inversion passed in this run.','Receipt arithmetic is a re-evaluation of already captured measurements; it is not a fresh browser result for the repair.','Range rectangles are typographic boxes rather than raster ink bounds.','The first normal320/root16 profile does not establish enlarged text or other widths/motion.','Native Android/WebView60/textZoom/physical input/TalkBack remain untested.'],dependencies};
fs.writeFileSync(path.join(__dirname,'browser-subaudit.json'),JSON.stringify(audit,null,2)+'\n');
fs.writeFileSync(path.join(__dirname,'observed-geometry.json'),JSON.stringify({originalReceiptSha256:'634d64e9a642c810993159f44c9a64c5f815b659939e0e137ec2c4e1537b03bb',originalJsonPath:'diagnostics.geometryFailure',value:failure},null,2)+'\n');
console.log(JSON.stringify({status:audit.status,actual:audit.actual,classification:audit.finding.classification,overhangPx:1,images:images.length}));
