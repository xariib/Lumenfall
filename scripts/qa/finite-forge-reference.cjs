'use strict';
// Paired independent one-second caller windows against immutable released code.
// Never replace expected results with one bulk/offline transaction's endpoint.
const fs=require('node:fs'),path=require('node:path'),z=require('node:zlib'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {app,clone}=require('../../tests/behavioral/comet-expansion-harness.cjs');
const root=path.resolve(__dirname,'../..'),file=path.join(root,'tests/behavioral/offline-swift-current-golden.json');
const source=fs.readFileSync(process.argv[2]||path.join(root,'index.html'),'utf8');
const baseline=z.gunzipSync(fs.readFileSync(path.join(root,'tests/behavioral/fixtures/forge-years-main-b075cfba.html.gz'))).toString('utf8');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
assert.equal(hash(baseline),'3f9123285f3377740e3017246fa7b0a5f8cbad60cabc9e477be9c9aefdeffa80','immutable released baseline');
const seed=JSON.parse(fs.readFileSync(path.join(root,'docs/qa/offline-autoascend-2026-10-07/device_backup.json')));
const golden=JSON.parse(fs.readFileSync(file));
let end=Date.UTC(2035,0,15,12);seed.lastSeen=end-28800000;
const worlds=[baseline,source].map(html=>app(html));
for(const w of worlds){w.clock(end);w.q.set(clone(seed));}
const phases=[];
for(let phase=0;phase<4;phase++){
 if(phase)end+=28800000;const results=[];
 for(const w of worlds){
  w.clock(end);w.q.ensureDaily();const start=end-28800000,before=w.q.get().prisms;let kills=0,ascends=0;
  for(let sec=0;sec<28800;sec++){
   const r=w.q.advance(1,{kind:'offline',visual:false,clockStartMs:start+sec*1000,offlineWindowStartMs:start});kills+=r.kills;ascends+=r.ascends;
  }
  assert(w.q.save(end),'canonical endpoint persisted');
  results.push({kills,ascends,prisms:w.q.get().prisms-before,state:clone(w.q.get())});
 }
 const [old,current]=results;
 assert.deepEqual(current,old,'all saved fields, clocks, prices paid and rewards unchanged in paired window '+phase);
 assert.equal(hash(JSON.stringify(current.state)),hash(JSON.stringify(old.state)),'canonical serialized endpoint unchanged '+phase);
 assert.deepEqual([current.kills,current.ascends,current.prisms],[golden.phases[phase].kills,golden.phases[phase].ascends,golden.phases[phase].prisms],'accepted independent window totals '+phase);
 phases.push({phase,kills:current.kills,ascends:current.ascends,prisms:current.prisms,
  baselineStateSha256:hash(JSON.stringify(old.state)),currentStateSha256:hash(JSON.stringify(current.state)),everySavedFieldEqual:true});
 process.stderr.write('Paired one-second window '+phase+' preserves every saved field\n');
}
if(process.argv.includes('--write')){
 assert.equal(golden.sourceSha256,hash(baseline),'only the verified released source binding may be replaced');
 // Retain all accepted endpoint hashes, including their runtime-specific byte
 // representation. Paired exact comparisons establish unchanged behavior here.
 fs.writeFileSync(file,JSON.stringify({...golden,sourceSha256:hash(source)},null,2)+'\n');
}
console.log(JSON.stringify({status:'pass',node:process.version,baselineSourceSha256:hash(baseline),sourceSha256:hash(source),
 originalAcceptedEndpointHashesRetained:true,phases},null,2));
