'use strict';
// Paired independent one-second windows. Preserve the accepted golden vectors;
// do not use the historical pre-Tap generator or bulk offline results as oracle.
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone}=require('./comet-expansion-harness.cjs');
const base=process.argv[2]||'0f72b061',hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const read=file=>cp.execFileSync('git',['show',base+':'+file],{encoding:'utf8',maxBuffer:16*1024*1024});
const baseline=read('index.html'),candidate=fs.readFileSync('index.html','utf8'),accepted=JSON.parse(read('tests/behavioral/offline-swift-current-golden.json'));
assert.equal(hash(baseline),accepted.sourceSha256,'Accepted baseline is bound to the released source');
const goldenFile='tests/behavioral/offline-swift-current-golden.json';
assert.deepEqual(JSON.parse(fs.readFileSync(goldenFile)).phases,accepted.phases,'Accepted canonical vectors remain unchanged');
const seed=JSON.parse(fs.readFileSync('docs/qa/offline-autoascend-2026-10-07/device_backup.json'));
function replay(source,label){
  const e=app(source),q=e.q,s=clone(seed),states=[],phases=[];let end=Date.UTC(2035,0,15,12);s.lastSeen=end-28800000;e.clock(end);q.set(s);
  for(let phase=0;phase<4;phase++){
    if(phase)end+=28800000;e.clock(end);q.ensureDaily();const start=end-28800000,prisms=q.get().prisms;let kills=0,ascends=0;
    for(let sec=0;sec<28800;sec++){const r=q.advance(1,{kind:'offline',visual:false,clockStartMs:start+sec*1000,offlineWindowStartMs:start});kills+=r.kills;ascends+=r.ascends;}
    assert(q.save(end));const state=clone(q.get());states.push(state);
    const result={kills,ascends,prisms:q.get().prisms-prisms,stateSha256:hash(JSON.stringify(state))};phases.push(result);
    assert.deepEqual([result.kills,result.ascends,result.prisms],[accepted.phases[phase].kills,accepted.phases[phase].ascends,accepted.phases[phase].prisms],'Accepted reward triple retained');
    process.stderr.write(label+' phase '+phase+' '+JSON.stringify(result)+'\n');
  }
  return {states,phases};
}
const b=replay(baseline,'baseline'),c=replay(candidate,'candidate');
assert.deepEqual(c.states,b.states,'Every field of all four complete endpoint states is preserved');
const receipt={status:'PASS',kind:'paired independent one-second state preservation',base,baselineSourceSha256:hash(baseline),candidateSourceSha256:hash(candidate),runtime:process.version,platform:process.platform,callsPerReplay:115200,baseline:b.phases,candidate:c.phases,allEndpointStatesEqual:true,canonicalHashesMatch:b.phases.every((p,i)=>p.stateSha256===accepted.phases[i].stateSha256),qualification:'Upstream canonical full-state hashes are not reproduced by the unchanged baseline on this runtime; preserve them rather than claiming a match.'};
fs.mkdirSync('docs/qa/in-app-updates-001',{recursive:true});fs.writeFileSync('docs/qa/in-app-updates-001/independent-replay.json',JSON.stringify(receipt,null,2)+'\n');
if(process.argv.includes('--write'))fs.writeFileSync(goldenFile,JSON.stringify({...accepted,sourceSha256:hash(candidate)},null,2)+'\n');
console.log(JSON.stringify({status:receipt.status,allEndpointStatesEqual:true,canonicalHashesMatch:receipt.canonicalHashesMatch}));
