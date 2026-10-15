'use strict';
// Real mature Forge input switches to the exact clock during its eighth
// one-second window. A rounded elapsed sum used to consume its last fraction.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,CLOCK}=require('./forge-expansion-harness.cjs'),fixtures=require('./fixtures.json');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8');
let checks=0;
function run(text,name,kind){
 const x=app(text);x.q.set(fixtures[name].save);x.q.restoreEnemy();let clock=CLOCK;
 for(let i=0;i<60;i++){
  const result=x.q.advance(1,{kind,visual:false,clockStartMs:clock,offlineWindowStartMs:kind==='offline'?CLOCK:undefined});
  assert.equal(result.clockEndMs,CLOCK+(i+1)*1000,'every requested endpoint is reached');checks++;
  clock=result.clockEndMs;
 }
 return JSON.parse(JSON.stringify(x.q.get()));
}
for(const name of ['parity-early-simple','mid-game','mature-high-power']){
 const live=run(source,name,'live'),offline=run(source,name,'offline');
 assert(Math.abs(live.enemyHp-offline.enemyHp)<=1e-9*Math.max(1,Math.abs(offline.enemyHp)),'strict remaining HP parity');checks++;
 // Existing offline Lumen/Shard efficiency is intentionally policy dependent.
 for(const field of ['totalKills','ascendCount','prisms','sigils']){assert.deepEqual(live[field],offline[field],field+' live/offline equality');checks++;}
}
const current='    binaryClock.advanceLattice(previousDuration);remaining=binaryClock.remaining();';
assert.equal(source.split(current).length,2,'unique causal mutation');
const broken=source.replace(current,'    binaryClock.advance(previous);');
assert.throws(()=>run(broken,'mature-high-power','offline'),/Authoritative simulation stalled without elapsed-time or state progress/,'rounded activation reproduces the captured stall');checks++;
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),negativeControl:'rounded activation reproduces the mature eighth-window stall',limits:'Finite Forge inputs and strict parity; extended campaigns and device acceptance remain separate.'}));
