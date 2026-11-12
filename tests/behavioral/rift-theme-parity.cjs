'use strict';
// A visual redesign must preserve complete saved states and every reward.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const {app,clone}=require('./comet-expansion-harness.cjs');
const baseline='6b990b70ccfdd62049ca10172b0c770ae808a6bc';
const original=execFileSync('git',['show',baseline+':index.html'],{encoding:'utf8',maxBuffer:4*1024*1024});
const source=fs.readFileSync('index.html','utf8'),states=[original,source].map(s=>app(s));
const golden=JSON.parse(execFileSync('git',['show',baseline+':tests/behavioral/offline-swift-current-golden.json'],{encoding:'utf8'}));
const seed=JSON.parse(fs.readFileSync('docs/qa/offline-autoascend-2026-10-07/device_backup.json'));
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
assert.equal(hash(original),golden.sourceSha256,'baseline reference matches its actual source');
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
 assert.deepEqual(record,golden.phases[phase],'published independent endpoint unchanged');phases.push(record);
 console.error('Paired one-second replay phase '+phase+' passed');
}
const updated={sourceSha256:hash(source),oracle:golden.oracle,phases};
if(process.argv.includes('--write'))fs.writeFileSync('tests/behavioral/offline-swift-current-golden.json',JSON.stringify(updated,null,2)+'\n');
console.log(JSON.stringify({status:'pass',baseline,node:process.version,baselineSha256:hash(original),...updated},null,2));
