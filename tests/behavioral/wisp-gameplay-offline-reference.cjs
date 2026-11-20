'use strict';
// Recompute the accepted released one-second windows before recording the
// requested new-price endpoints. Current full windows must match saved state
// from independent one-second caller windows; never copy bulk outcomes
// into the oracle. Historical fixtures and released vectors remain unchanged.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),cp=require('node:child_process');
const {app,clone}=require('./comet-expansion-harness.cjs');
const baseline='c18e6189bbbbdef60bbd75a250e451433dfa1dbe',file='tests/behavioral/offline-swift-current-golden.json';
const released=cp.execFileSync('git',['show',baseline+':index.html'],{encoding:'utf8',maxBuffer:8*1024*1024});
const accepted=JSON.parse(cp.execFileSync('git',['show',baseline+':'+file],{encoding:'utf8'}));
// The project retains separate browser and VM hashes. Verify the baseline VM
// against its immutable VM receipt, and rewards against the browser vectors.
const acceptedVm=JSON.parse(fs.readFileSync('docs/qa/team-progression-001/offline-golden-other-harness.json'));
const source=fs.readFileSync('index.html','utf8'),hash=s=>crypto.createHash('sha256').update(s).digest('hex');
assert.equal(hash(released),accepted.sourceSha256,'Released reference is bound to the actual baseline');
const seed=JSON.parse(fs.readFileSync('docs/qa/offline-autoascend-2026-10-07/device_backup.json'));
function replay(html,chunk){
 const e=app(html),q=e.q,initial=clone(seed);let end=Date.UTC(2035,0,15,12);initial.lastSeen=end-28800000;e.clock(end);q.set(initial);
 const phases=[],states=[];
 for(let phase=0;phase<4;phase++){
  if(phase)end+=28800000;e.clock(end);q.ensureDaily();const start=end-28800000,before=q.get().prisms;let kills=0,ascends=0;
  for(let sec=0;sec<28800;sec+=chunk){const r=q.advance(Math.min(chunk,28800-sec),{kind:'offline',visual:false,clockStartMs:start+sec*1000,offlineWindowStartMs:start});kills+=r.kills;ascends+=r.ascends;}
  assert(q.save(end),'Canonical endpoint saves');const state=clone(q.get());states.push(state);
  phases.push({kills,ascends,prisms:state.prisms-before,stateSha256:hash(JSON.stringify(state))});
  process.stderr.write('reference chunk='+chunk+' phase='+phase+' '+JSON.stringify(phases.at(-1))+'\n');
 }
 return {phases,states};
}
const old=replay(released,1);assert.deepEqual(old.phases,acceptedVm.phases,'Every original VM one-second endpoint is reproduced');
assert.deepEqual(old.phases.map(p=>[p.kills,p.ascends,p.prisms]),accepted.phases.map(p=>[p.kills,p.ascends,p.prisms]),'Released browser and reproduced VM rewards agree');
const current=replay(source,1),whole=replay(source,28800);
const hpRoundoff=[];
for(let phase=0;phase<4;phase++){
 const a=whole.states[phase],b=current.states[phase],difference=Math.abs(a.enemyHp-b.enemyHp);
 // Native floating HP subtraction can differ by a final rounding bit. This
 // two-ULP bound is stricter than existing offline-catchup's1e-9 relative HP
 // limit. Every other state field, wallet and timer must remain exactly equal.
 const tolerance=2*Number.EPSILON*Math.max(1,Math.abs(a.enemyHp),Math.abs(b.enemyHp));
 assert(difference<=tolerance,'Remaining enemy HP within two native rounding units');
 hpRoundoff.push({phase,whole:a.enemyHp,oneSecond:b.enemyHp,difference,tolerance});
 assert.deepEqual({...a,enemyHp:b.enemyHp},b,'Every other saved field matches independent one-second phase '+phase);
}
assert.deepEqual(whole.phases.map(p=>[p.kills,p.ascends,p.prisms]),current.phases.map(p=>[p.kills,p.ascends,p.prisms]),'Exact current kills, Ascends and Prisms match');
assert(current.phases.every(p=>p.ascends===0),'Retired Auto Ascend stays retired');
const golden={sourceSha256:hash(source),oracle:accepted.oracle,phases:current.phases};
if(process.argv.includes('--write'))fs.writeFileSync(file,JSON.stringify(golden,null,2)+'\n');
console.log(JSON.stringify({status:'PASS',baseline,baselineSha256:hash(released),sourceSha256:hash(source),oracle:accepted.oracle,node:process.version,originalBrowser:accepted.phases,originalVm:old.phases,current:current.phases,whole:whole.phases,allOtherSavedFieldsExact:true,hpRoundoff,originalFixtureSha256:hash(fs.readFileSync('docs/qa/offline-autoascend-2026-10-07/device_backup.json')),limits:'Independent caller windows in the Node VM; one HP endpoint differs by1.17e-10 within two rounding units. Actual browser/native acceptance is separate.'},null,2));
