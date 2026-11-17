'use strict';
// Rift presentation changes must preserve complete saved states and rewards.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const {app,clone}=require('./comet-expansion-harness.cjs');
const baseline='0adb60eb36a3be15ce152d6ffe416d5996b039c7';
const original=execFileSync('git',['show',baseline+':index.html'],{encoding:'utf8',maxBuffer:4*1024*1024});
const source=fs.readFileSync('index.html','utf8'),states=[original,source].map(s=>app(s));
const golden=JSON.parse(execFileSync('git',['show',baseline+':tests/behavioral/offline-swift-current-golden.json'],{encoding:'utf8'}));
// The released task retained separate browser and VM endpoint receipts.
// Compare each harness against its own exact-source reference.
const harnessGolden=JSON.parse(fs.readFileSync('docs/qa/team-progression-001/offline-golden-other-harness.json'));
const seed=JSON.parse(fs.readFileSync('docs/qa/offline-autoascend-2026-10-07/device_backup.json'));
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
assert.equal(hash(original),golden.sourceSha256,'baseline reference matches its actual source');
const forgeReplay=JSON.parse(fs.readFileSync('docs/qa/forge-years-001/independent-paired-replay.json'));
assert.equal(forgeReplay.baselineSourceSha256,harnessGolden.sourceSha256,'upstream Forge replay starts at the immutable accepted VM reference');
assert.equal(forgeReplay.sourceSha256,golden.sourceSha256,'upstream Forge replay binds the actual newer main');
assert.equal(forgeReplay.originalAcceptedEndpointHashesRetained,true);
for(let i=0;i<4;i++){
 assert.equal(forgeReplay.phases[i].everySavedFieldEqual,true);
 assert.equal(forgeReplay.phases[i].baselineStateSha256,harnessGolden.phases[i].stateSha256);
 assert.equal(forgeReplay.phases[i].currentStateSha256,harnessGolden.phases[i].stateSha256);
}
let end=Date.UTC(2035,0,15,12);seed.lastSeen=end-28800000;for(const e of states){e.clock(end);e.q.set(clone(seed));}
const phases=[];
for(let phase=0;phase<4;phase++){
 if(phase)end+=28800000;const results=[];
 for(const e of states){
  e.clock(end);e.q.ensureDaily();const start=end-28800000,prisms=e.q.get().prisms;let kills=0,ascends=0;
  for(let sec=0;sec<28800;sec++){const r=e.q.advance(1,{kind:'offline',visual:false,clockStartMs:start+sec*1000,offlineWindowStartMs:start});kills+=r.kills;ascends+=r.ascends;}
  assert(e.q.save(end));results.push({kills,ascends,prisms:e.q.get().prisms-prisms,state:clone(e.q.get())});
 }
 assert.deepEqual(results[1],results[0],'every field and reward matches at phase '+phase);
 const {kills,ascends,prisms,state}=results[1],record={kills,ascends,prisms,stateSha256:hash(JSON.stringify(state))};
 assert.deepEqual(record,harnessGolden.phases[phase],'released VM endpoint unchanged');
 for(const key of ['kills','ascends','prisms'])assert.equal(record[key],golden.phases[phase][key],'browser/VM rewards agree');phases.push(record);
 console.error('Paired one-second replay phase '+phase+' passed');
}
if(process.argv.includes('--write'))fs.writeFileSync('tests/behavioral/offline-swift-current-golden.json',JSON.stringify({...golden,sourceSha256:hash(source)},null,2)+'\n');
console.log(JSON.stringify({status:'pass',baseline,node:process.version,baselineSha256:hash(original),sourceSha256:hash(source),oracle:golden.oracle,phases,browserOraclePhasesPreserved:true},null,2));
