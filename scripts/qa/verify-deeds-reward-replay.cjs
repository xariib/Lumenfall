'use strict';
// Compare complete production states with the released source. The only allowed
// difference is the independently specified increase for newly earned Deeds.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const {app,clone}=require('../../tests/behavioral/comet-expansion-harness.cjs');
const baseline='6fd9e44ff61246e1c6337bd53e398234f19fb893';
const oldSource=execFileSync('git',['show',baseline+':index.html'],{encoding:'utf8',maxBuffer:4e6}),source=fs.readFileSync('index.html','utf8');
const file='tests/behavioral/offline-swift-current-golden.json';
const accepted=JSON.parse(execFileSync('git',['show',baseline+':'+file],{encoding:'utf8'}));
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
assert.equal(hash(oldSource),accepted.sourceSha256,'released source is bound to the independent reference');
const bonus={};
for(const [key,targets,extra]of [
 ['rift',[500,1000,2500,5000,10000,25000,100000,1000000],95],
 ['ascend',[25,50,100,250,500,1000,10000,100000],45],
 ['forge',[100,200,300,400,500,600],35],
 ['rest',[24,72,168,720,2160,8760],10]
])for(const target of targets)bonus['endless_'+key+'_'+target]=extra;
const seed=JSON.parse(fs.readFileSync('docs/qa/offline-autoascend-2026-10-07/device_backup.json'));
let end=Date.UTC(2035,0,15,12);seed.lastSeen=end-28800000;
const worlds=[oldSource,source].map(s=>app(s));
for(const e of worlds){e.clock(end);e.q.set(clone(seed));}
const initiallyEarned=clone(worlds[0].q.get().achieved),phases=[],evidence=[];
for(let phase=0;phase<4;phase++){
 if(phase)end+=28800000;const results=[];
 for(const e of worlds){
  e.clock(end);e.q.ensureDaily();const start=end-28800000,before=e.q.get().prisms;let kills=0,ascends=0;
  for(let sec=0;sec<28800;sec++){const r=e.q.advance(1,{kind:'offline',visual:false,clockStartMs:start+sec*1000,offlineWindowStartMs:start});kills+=r.kills;ascends+=r.ascends;}
  assert(e.q.save(end));const state=clone(e.q.get());results.push({kills,ascends,prisms:state.prisms-before,state});
 }
 const [old,current]=results;
 assert.deepEqual({kills:old.kills,ascends:old.ascends,prisms:old.prisms,stateSha256:hash(JSON.stringify(old.state))},accepted.phases[phase],'released complete endpoint '+phase);
 const additions=Object.entries(bonus).filter(([id])=>!initiallyEarned[id]&&current.state.achieved[id]).reduce((n,[,amount])=>n+amount,0);
 assert.equal(current.state.comets,old.state.comets+additions,'only approved newly earned Comet increases');
 const expected=clone(old);expected.state.comets+=additions;
 assert.deepEqual(current,expected,'every other simulation/save field and reward is unchanged');
 const {kills,ascends,prisms,state}=current;phases.push({kills,ascends,prisms,stateSha256:hash(JSON.stringify(state))});
 evidence.push({phase,approvedAdditionalComets:additions,oldComets:old.state.comets,newComets:state.comets,allOtherFieldsEqual:true});
 process.stderr.write('Paired Deeds replay phase '+phase+' passed; approved extra Comets '+additions+'\n');
}
const sourceSha256=hash(source);
if(process.argv.includes('--write'))fs.writeFileSync(file,JSON.stringify({...accepted,sourceSha256,phases},null,2)+'\n');
console.log(JSON.stringify({status:'PASS',baseline,baselineSha256:hash(oldSource),sourceSha256,node:process.version,phases,evidence},null,2));
