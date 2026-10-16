'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {plan,combine}=require('../behavioral/offline-catchup-parallel.cjs');
const text=fs.readFileSync('tests/behavioral/offline-catchup.cjs','utf8'),p=plan(text),hash=s=>crypto.createHash('sha256').update(s).digest('hex'),sourceSha='a'.repeat(64),baseline='b'.repeat(64);
assert.equal(p.prefix+p.groups.map(g=>g.body).join('')+p.suffix,text);
assert.equal(p.originalTestSha256,hash(text));
function rows(){return p.groups.map(g=>({id:g.id,exitcode:0,result:{report:{status:'pass',sourceSha256:sourceSha,records:Array.from({length:g.records},(_,i)=>({case:g.id+'/'+i})),wallMs:1},originalTestSha256:p.originalTestSha256,bodySha256:hash(g.body),baselineSha256:baseline,extraSetupRecords:[]}}));}
assert.equal(combine(p,rows(),sourceSha,5).records.length,18);let controls=0;
for(const mutate of [r=>r.pop(),r=>r[1].id=r[0].id,r=>r[0].exitcode=1,r=>r[0].error='late worker error',r=>delete r[0].result,r=>r[0].result.report.status='fail',r=>r[0].result.report.records.pop(),r=>r[0].result.report.sourceSha256='c'.repeat(64),r=>r[0].result.originalTestSha256='d'.repeat(64),r=>r[0].result.bodySha256='e'.repeat(64),r=>r[2].result.baselineSha256='f'.repeat(64)]){const broken=rows();mutate(broken);assert.throws(()=>combine(p,broken,sourceSha,5));controls++;}
assert.throws(()=>plan(text.replace('// Cancellation, restart and primary/recovery failures never partially consume.','')));controls++;
const sentinel='\nassert(false,"new assertion must not disappear");\n',at=text.indexOf('// Cancellation, restart and primary/recovery failures never partially consume.');
const extended=text.slice(0,at)+sentinel+text.slice(at),future=plan(extended);
assert.equal(future.prefix+future.groups.map(g=>g.body).join('')+future.suffix,extended);
assert(future.groups.some(g=>g.body.includes(sentinel)));
for(const replay of ['const reference=app(original,source,seconds);reference.b.apply();','const reference=app(original,source,28800);reference.b.apply();'])assert(p.groups.some(g=>g.body.includes(replay)),'all original independent processing replays retained');
console.log(JSON.stringify({status:'PASS',groups:p.groups.length,originalRecords:18,originalTestSha256:p.originalTestSha256,completeOriginalSourceRetained:true,referenceReplaysRetained:true,negativeControls:controls}));
