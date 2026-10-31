const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..'),{app,clone}=require(path.join(root,'tests/behavioral/comet-expansion-harness.cjs'));
const baseRef=process.argv[2]||'origin/main';
const baseline=execFileSync('git',['show',baseRef+':index.html'],{cwd:root,encoding:'utf8',maxBuffer:4e6}),candidate=fs.readFileSync(path.join(root,'index.html'),'utf8');
const accepted=JSON.parse(execFileSync('git',['show',baseRef+':tests/behavioral/offline-swift-current-golden.json'],{cwd:root,encoding:'utf8'}));
const seed=JSON.parse(fs.readFileSync(path.join(root,'docs/qa/offline-autoascend-2026-10-07/device_backup.json'),'utf8'));
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
function replay(source,label){const e=app(source),q=e.q,s=clone(seed);let end=Date.UTC(2035,0,15,12);s.lastSeen=end-28800000;e.clock(end);q.set(s);const phases=[],states=[];
for(let phase=0;phase<4;phase++){if(phase)end+=28800000;e.clock(end);q.ensureDaily();const start=end-28800000,prisms=q.get().prisms;let kills=0,ascends=0;
for(let sec=0;sec<28800;sec++){const r=q.advance(1,{kind:'offline',visual:false,clockStartMs:start+sec*1000,offlineWindowStartMs:start});kills+=r.kills;ascends+=r.ascends;}assert(q.save(end));const state=clone(q.get());states.push(state);phases.push({kills,ascends,prisms:q.get().prisms-prisms,stateSha256:hash(JSON.stringify(state))});assert.deepEqual([kills,ascends,q.get().prisms-prisms],[accepted.phases[phase].kills,accepted.phases[phase].ascends,accepted.phases[phase].prisms],'retain accepted main rewards');process.stderr.write(label+' phase'+phase+' '+phases.at(-1).stateSha256+'\n');}
return {phases,states};}
const b=replay(baseline,'baseline'),c=replay(candidate,'candidate');assert.deepEqual(c.states,b.states,'all four complete endpoint states match current main on the same runtime');
const result={status:'PASS',runtime:process.version,platform:process.platform,baseRef,baselineSha256:hash(baseline),candidateSha256:hash(candidate),baseline:b.phases,candidate:c.phases,acceptedCanonical:accepted,canonicalHashesMatch:b.phases.every((p,i)=>p.stateSha256===accepted.phases[i].stateSha256)};
fs.writeFileSync(path.join(root,'docs/qa/lab-speed-design-001/replay-current-main.json'),JSON.stringify(result,null,2)+'\n');
// Preserve the accepted baseline's canonical hashes; the paired replay proves
// presentation changes retain complete states on this same runtime and host.
assert.equal(hash(baseline),accepted.sourceSha256,'accepted baseline source binding');
fs.writeFileSync(path.join(root,'tests/behavioral/offline-swift-current-golden.json'),JSON.stringify({...accepted,sourceSha256:hash(candidate)},null,2)+'\n');
console.log(JSON.stringify({status:result.status,baseline:result.baselineSha256,candidate:result.candidateSha256,canonicalHashesMatch:result.canonicalHashesMatch}));
