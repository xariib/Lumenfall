'use strict';
// Recompute all four independent one-second windows and require every endpoint
// to match the released reference before rebinding it to presentation-only bytes.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone}=require('../../tests/behavioral/comet-expansion-harness.cjs');
const source=fs.readFileSync('index.html','utf8'),file='tests/behavioral/offline-swift-current-golden.json',golden=JSON.parse(fs.readFileSync(file));
const x=app(source),q=x.q,seed=JSON.parse(fs.readFileSync('docs/qa/offline-autoascend-2026-10-07/device_backup.json'));
let end=Date.UTC(2035,0,15,12);seed.lastSeen=end-28800000;x.clock(end);q.set(seed);const phases=[];
for(let phase=0;phase<4;phase++){
 if(phase)end+=28800000;x.clock(end);q.ensureDaily();const start=end-28800000,before=q.get().prisms;let kills=0,ascends=0;
 for(let sec=0;sec<28800;sec++){const r=q.advance(1,{kind:'offline',visual:false,clockStartMs:start+sec*1000,offlineWindowStartMs:start});kills+=r.kills;ascends+=r.ascends;}
 assert(q.save(end));const result={kills,ascends,prisms:q.get().prisms-before,stateSha256:crypto.createHash('sha256').update(JSON.stringify(clone(q.get()))).digest('hex')};
 assert.deepEqual(result,golden.phases[phase],'unchanged released full-state endpoint '+phase);phases.push(result);process.stderr.write('Identical released endpoint '+phase+'\n');
}
const sourceSha256=crypto.createHash('sha256').update(source).digest('hex');
if(process.argv.includes('--write'))fs.writeFileSync(file,JSON.stringify({...golden,sourceSha256,phases},null,2)+'\n');
console.log(JSON.stringify({status:'pass',sourceSha256,baselineSha256:golden.sourceSha256,node:process.version,phases}));
