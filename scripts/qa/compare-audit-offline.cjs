'use strict';
// Run both original and changed product through the same independent one-second
// windows. Require byte-identical full endpoints, not only matching rewards.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const {app,clone}=require('../../tests/behavioral/comet-expansion-harness.cjs');
const original=execFileSync('git',['show','595619f27b54eee351c5f3f2dfb0dd46a4ecd487:index.html'],{encoding:'utf8',maxBuffer:4*1024*1024});
const changed=fs.readFileSync('index.html','utf8'),states=[original,changed].map(s=>app(s)),seed=JSON.parse(fs.readFileSync('docs/qa/offline-autoascend-2026-10-07/device_backup.json'));
let end=Date.UTC(2035,0,15,12);seed.lastSeen=end-28800000;
for(const x of states){x.clock(end);x.q.set(clone(seed));}
const records=[];
for(let phase=0;phase<4;phase++){
 if(phase)end+=28800000;const results=[];
 for(const x of states){x.clock(end);x.q.ensureDaily();const start=end-28800000;let kills=0,ascends=0;const before=x.q.get().prisms;
  for(let sec=0;sec<28800;sec++){const r=x.q.advance(1,{kind:'offline',visual:false,clockStartMs:start+sec*1000,offlineWindowStartMs:start});kills+=r.kills;ascends+=r.ascends;}
  assert(x.q.save(end));results.push({kills,ascends,prisms:x.q.get().prisms-before,state:clone(x.q.get())});
 }
 assert.deepEqual(results[1],results[0],'full independent old/new phase '+phase);
 records.push({phase,kills:results[1].kills,ascends:results[1].ascends,prisms:results[1].prisms,stateSha256:crypto.createHash('sha256').update(JSON.stringify(results[1].state)).digest('hex')});
 console.error('Identical baseline/candidate full endpoint '+phase);
}
console.log(JSON.stringify({status:'pass',baselineCommit:'595619f27b54eee351c5f3f2dfb0dd46a4ecd487',baselineSha256:crypto.createHash('sha256').update(original).digest('hex'),sourceSha256:crypto.createHash('sha256').update(changed).digest('hex'),node:process.version,platform:process.platform,records},null,2));
