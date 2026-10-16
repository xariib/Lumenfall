'use strict';
const fs=require('node:fs'),z=require('node:zlib'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,CLOCK}=require('./forge-expansion-harness.cjs');
const file=process.argv[2]||'index.html',source=fs.readFileSync(file,'utf8'),marker="if(document.readyState==='loading'){";
const x=app(source.replace(marker,'window.endlessQa={advice:latePowerAdvice,objective:nextRiftObjective};'+marker),undefined,{clockDate:true}),q=x.q;let checks=0;
function ok(value,label){checks++;assert(value,label);}function eq(a,b,label){checks++;assert.deepEqual(a,b,label);}
eq(q.endless.advice(),null,'fresh game keeps existing early guidance');
const c=JSON.parse(z.gunzipSync(fs.readFileSync('docs/qa/endless-progression-001/experiments/applied-f/both-full-regular_two-day138.checkpoint.json.gz')));x.clock(CLOCK+c.elapsed*1000);q.set(c.state);
const earned=JSON.stringify(q.get()),slots=JSON.stringify([...x.storage]);
for(let i=0;i<50;i++){const a=q.endless.advice();ok(a&&a.tab&&a.selector,'actionable late recommendation');ok(a.labNote.includes('Lab gate met'),'no unnecessary Lab saving');ok(a.labTarget<=q.get().longStudyLevels.wispascend,'reports exact current Mastery Lab requirement');}
eq(JSON.stringify(q.get()),earned,'advice preserves entire state including queues and paid work');eq(JSON.stringify([...x.storage]),slots,'advice never saves');
function fixture(){const s=q.accept(c.state);s.autoAscendEnabled=false;s.riftMode='push';s.activeStudies=[];s.studyBoosts={};s.lumen=0;s.shards=0;s.prisms=0;s.sigils=0;for(const id of Object.keys(s.spirits)){s.spirits[id]=300;s.empowerQueue[id]=true;s.wispMastery[id]=0;}s.longStudyLevels.wispascend=200;s.research.masterwork=200;s.nodes.swift=100;s.maxDepthEver=10000;return s;}
let s=fixture();s.prisms=1e6;s.sigils=1e8;q.set(s);let a=q.endless.advice();eq(a.kind,'MASTERY READY','funded Mastery before optional Lab');eq(q.endless.objective(),a,'Rift points to same recommendation');ok(a.detail.includes('×1.10'),'own Power increase shown');
s=fixture();s.prisms=19999;s.sigils=1e8;q.set(s);eq(q.endless.advice().kind,'FARM PRISMS','one Prism short guides Ascend');
s.prisms=20000;q.set(s);eq(q.endless.advice().kind,'MASTERY READY','exact funded boundary');
s=fixture();s.prisms=20000;s.sigils=499999;q.set(s);eq(q.endless.advice().kind,'FARM SIGILS','one Sigil short guides boss farming');
s=fixture();s.prisms=1e6;s.sigils=1e8;s.autoAscendEnabled=true;q.set(s);eq(q.endless.advice().kind,'RETURN TO PUSH','funded player guided out of repeated resets');
s.autoAscendEnabled=false;s.riftMode='farm';q.set(s);eq(q.endless.advice().selector,'#rift-push-btn','funded Farm player guided to Push');
s=fixture();s.longStudyLevels.wispascend=91;q.set(s);a=q.endless.advice();eq(a.kind,'MASTERY PATH','missing Lab gate shown');eq(a.id,'lab','correct development path');ok(a.title.includes('91 / 92'),'current/required Lab values');
s=fixture();s.research.masterwork=0;q.set(s);eq(q.endless.advice().id,'forge','missing Forge gate');
s=fixture();s.nodes.swift=9;q.set(s);eq(q.endless.advice().id,'tree','missing uncapped Tree gate');
s=fixture();s.depth=199;s.enemyDepth=199;s.farmReturnDepth=199;s.maxDepthEver=199;q.set(s);eq(q.endless.advice().kind,'PUSH','missing Rift gate');
s.lumen=s.shards='1e400';q.set(s);eq(q.endless.advice().kind,'FORGE POWER','affordable Forge helps overcome a Rift wall');
s=fixture();s.lumen=1e28;s.empowerQueue.ember=false;q.set(s);a=q.endless.advice();eq(a.kind,'REBUILD','cheap levels not blocked by unaffordable next Lab');eq(a.id,'ember','specific Empower control');
s=fixture();s.spirits.ember=0;s.lumen=10;q.set(s);eq(q.endless.advice().kind,'REBUILD','permanent recruits rebuild after Ascend');
s=fixture();s.lumen='1e400';s.shards='1e400';q.set(s);eq(q.endless.advice().kind,'FORGE POWER','wide-value affordable Forge remains useful');
s=fixture();s.prisms='1e400';s.sigils='1e400';q.set(s);eq(q.endless.advice().kind,'MASTERY READY','wide-value funded Mastery');
s=fixture();s.maxDepthEver=20000;s.wispMastery.ember=495;s.longStudyLevels.wispascend=190;s.prisms=s.sigils='1e400';q.set(s);a=q.endless.advice();eq(a.kind,'MASTERY PATH','leading Wisp gate before low-impact trailing Mastery');eq(a.labTarget,191,'leading Wisp next Lab gate');
s.longStudyLevels.catalysis=0;s.motes=1e6;s.activeStudies=[{id:'wispascend',remainingSec:864000,totalDurationSec:864000,speedMult:1}];q.set(s);a=q.endless.advice();eq(a.kind,'LAB SPEED','earned speed offered during required Lab wait');eq(a.boost,{mult:8,hours:24,cost:74250},'independent24h speed quote');eq(a.affordable,true,'earned Motes can fund quoted speed');
s.motes=0;q.set(s);eq(q.endless.advice().affordable,false,'unfunded speed directs Mote farming');
s.studyBoosts.wispascend={mult:3,startedAtMs:CLOCK+c.elapsed*1000,expiresAtMs:CLOCK+c.elapsed*1000+28800000};q.set(s);eq(q.endless.advice().kind,'MASTERY PATH','never replace already-paid running boost');
s.studyBoosts={};s.activeStudies[0].speedMult=8;q.set(s);eq(q.endless.advice().kind,'MASTERY PATH','purchased base speed prevents redundant payment');
// Causal controls: deleting late advice or recommending Lab unconditionally must
// fail the same positive contract, not pass by changing expected game behavior.
if(process.argv.includes('--negative')){
 for(const replacement of ['return null;','return {kind:"MASTERY PATH",id:"lab"};']){
  const bad=source.replace('function latePowerAdvice(){','function latePowerAdvice(){'+replacement);
  const y=app(bad.replace(marker,'window.endlessQa={advice:latePowerAdvice};'+marker));y.q.set(c.state);const g=y.q.endless.advice();ok(!g||!g.labNote||!g.selector,'detect missing/use-less advice mutation');
 }
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex')}));
