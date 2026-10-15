'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,CLOCK}=require('./forge-expansion-harness.cjs');
const original=fs.readFileSync(process.argv[2]||'index.html','utf8'),marker="if(document.readyState==='loading'){";
assert.equal(original.split(marker).length,2);
const source=original.replace(marker,'window.endlessQa={motes:batchLuminousMotes};'+marker);
const {q}=app(source),s=q.fresh();s.motes='1e400';q.set(s);
// A physical interval below native capacity is clamped to Number.MIN_VALUE.
// Its represented count must not let the index-to-time projection pay after
// the caller's real endpoint. This finite count keeps the causal control finite.
const policy={nowMs:CLOCK+1000,moteFarmClock:{startMs:CLOCK,firstSec:Number.MIN_VALUE,gapSec:Number.MIN_VALUE}};
assert.equal(q.endless.motes('1e326',true,0,.05,policy),1,'wide count pays only inside the actual window');
assert.equal(q.get().moteNextAtMs,CLOCK+60000,'exact global payout boundary');
assert.equal(q.get().motes,'1'+'0'.repeat(399)+'1e0','wide eligible reward is exact');
console.log(JSON.stringify({status:'PASS',checks:3,sourceSha256:crypto.createHash('sha256').update(original).digest('hex')}));
