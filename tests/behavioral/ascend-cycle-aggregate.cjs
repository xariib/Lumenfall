'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),A=require('../../scripts/lib/game-amount.cjs'),create=require('../../scripts/lib/luminous-orbit-session.cjs'),aggregate=require('../../scripts/lib/ascend-cycle-aggregate.cjs'),{integer}=require('./amount-oracle.cjs');
const {app}=require('./forge-expansion-harness.cjs'),source=fs.readFileSync('index.html','utf8'),{q}=app(source),probe=JSON.parse(require('node:zlib').gunzipSync(fs.readFileSync('docs/qa/endless-progression-001/experiments/ascend-cycle-transcript.json.gz')));
assert.equal(probe.sourceSha256,crypto.createHash('sha256').update(source).digest('hex'));
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
const rows=probe.rows,base=4,initial=rows[base-1].state,pattern=[.08,.08,.08,null,.1,.1,.1,.1,.1,.1,.08],session=create(A,pattern,initial.luminousAccum,initial.enemyIsLuminous,{phaseCeiling:.999999});
q.set(initial);const recipes=rows.slice(base,base+5).map(row=>{
 const kills=row.ops.filter(o=>o.kind==='kill'),recipe={shards:0,sigils:0,prisms:222,motes:50,kills:kills.length,bossKills:0};
 for(const op of row.ops){if(op.kind==='ability')recipe.shards=A.exactAdd(recipe.shards,A.mul(op.rewards.shards,kills[0].scale));if(op.kind==='kill'&&op.depth%10===0){recipe.sigils=A.exactAdd(recipe.sigils,q.sigils(op.depth));recipe.bossKills++;}}
 return recipe;
}),killShards=rows[base].ops.filter(o=>o.kind==='kill').map(op=>({normal:A.mul(q.shards(op.depth,false),op.scale),bright:A.mul(q.shards(op.depth,true),op.scale)}));
// Fixed Prism/Dust oracles are separate from observed wallet deltas.
eq(q.prismPreview(16).gain,222,'protected repeat reward at Rift15');eq(initial.nodes.stardust,5,'paid Ascension Dust at5');
session.advance(rows.length-base);
for(let n=1;n<=rows.length-base;n++){
 const r=aggregate(A,recipes,killShards,session.position(n).counts,n),expected=rows[base+n-1].state;
 for(const key of ['shards','prisms','motes','sigils'])eq(integer(initial[key])+integer(r[key]),integer(expected[key]),'literal earned '+key+' endpoint');
 eq(integer(initial.totalKills)+integer(r.kills),integer(expected.totalKills),'literal victory count');eq(integer(initial.ascendCount)+integer(r.ascends),integer(expected.ascendCount),'literal Ascend count');
 for(const key of ['kills','ascends','bossKills','luminousKills'])eq(integer(initial.dailyStats[key])+integer(r[key]),integer(expected.dailyStats[key]),'literal daily '+key);
}
session.advance(A.exactSub('1e25',rows.length-base));const result=aggregate(A,recipes,killShards,session.position('1e25').counts,'1e25');
eq(integer(result.ascends),10n**25n,'huge Ascend integer oracle');eq(integer(result.kills),10n**26n,'huge victory integer oracle');eq(integer(result.prisms),222n*10n**25n,'huge protected Prism oracle');eq(integer(result.motes),50n*10n**25n,'huge paid Dust oracle');eq(integer(result.bossKills),10n**25n,'huge boss integer oracle');
for(const n of [1e25,1e28,1e30]){const r=aggregate(A,[{prisms:1e30}],[],[],n);eq(integer(r.prisms),BigInt(1e30)*BigInt(n),'native unsafe rewards/counts preserve exact binary input values');eq(integer(r.ascends),BigInt(n),'native unsafe reset count retained');}
eq(integer(aggregate(A,[{shards:.25}],[],[],'1e25').shards),10n**25n/4n,'fractional operand reaches the exact multiply instead of an invalid coefficient token');
console.log(JSON.stringify({status:'PASS',checks,result,limits:'Reward component; caller must prove unchanged recipes and no eligible Luminous payout/purchase before its stop. Full engine acceptance remains open.'}));
