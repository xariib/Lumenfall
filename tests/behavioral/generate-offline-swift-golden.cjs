'use strict';
// Independent one-second caller windows. Never derive expected outcomes from a
// single bulk/offline transaction. Preserve the released four-window outcomes.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone}=require('./comet-expansion-harness.cjs');
const root=path.resolve(__dirname,'../..'),sourcePath=path.resolve(process.argv[2]||'index.html'),source=fs.readFileSync(sourcePath,'utf8'),e=app(source),q=e.q;
const seed=JSON.parse(fs.readFileSync(path.join(root,'docs/qa/offline-autoascend-2026-10-07/device_backup.json'),'utf8'));
let end=Date.UTC(2035,0,15,12);seed.lastSeen=end-28800000;e.clock(end);q.set(seed);const phases=[];
for(let phase=0;phase<4;phase++){
 if(phase)end+=28800000;e.clock(end);q.ensureDaily();const start=end-28800000,prisms=q.get().prisms;let kills=0,ascends=0;
 for(let sec=0;sec<28800;sec++){const r=q.advance(1,{kind:'offline',visual:false,clockStartMs:start+sec*1000,offlineWindowStartMs:start});kills+=r.kills;ascends+=r.ascends;}
 assert(q.save(end),'one canonical endpoint save');
 phases.push({kills,ascends,prisms:q.get().prisms-prisms,stateSha256:crypto.createHash('sha256').update(JSON.stringify(clone(q.get()))).digest('hex')});
 process.stderr.write('one-second phase '+phase+' '+JSON.stringify(phases.at(-1))+'\n');
}
const expected=[[86404,4114,94622],[86401,4114,94622],[86396,4114,94622],[86405,4115,94645]];
assert.deepEqual(phases.map(p=>[p.kills,p.ascends,p.prisms]),expected,'released independent four-window outcomes remain unchanged');
const result={sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),oracle:'Independent one-second advance calls, fixed whole-window start',phases};
if(process.argv.includes('--write'))fs.writeFileSync(path.join(root,'tests/behavioral/offline-swift-current-golden.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
