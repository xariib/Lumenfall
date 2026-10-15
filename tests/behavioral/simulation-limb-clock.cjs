'use strict';
// Byte-for-byte public API compatibility plus the separate independent707
// rational/IEEE checks. This comparison does not replace that oracle.
const assert=require('node:assert/strict'),A=require('../../scripts/lib/game-amount.cjs'),old=require('../../scripts/lib/simulation-binary-clock.cjs'),next=require('../../scripts/lib/simulation-limb-clock.cjs');let checks=0;
function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
for(const start of [0,Number.MIN_VALUE,2000000000000,Number.MAX_SAFE_INTEGER,2**200]){
 const a=old(A,start,2),b=next(A,start,2);
 for(const dt of [0,Number.MIN_VALUE,1e-200,1e-40,1e-20,.001,.125,.5]){
  a.advance(dt);b.advance(dt);
  for(const method of ['snapshot','absoluteSnapshot','latticeRemaining','remaining','elapsed','elapsedNumber','nowMs'])eq(b[method](),a[method](),'same exact '+method);
  for(const deadline of [0,start,start+1,start+1000])for(const early of [0,1e-9,.125]){
   eq(b.until(deadline,early),a.until(deadline,early),'identical exact deadline token');eq(b.latticeUntil(deadline,early),a.latticeUntil(deadline,early),'identical guarded deadline bits');eq(b.compareMs(deadline,early),a.compareMs(deadline,early),'identical deadline sign');
  }
  const pa=a.pointBefore(.125),pb=b.pointBefore(.125);eq(pb,pa,'rebased point byte compatibility');eq(b.since(pb),a.since(pa),'elapsed token compatibility');eq(b.pointAfter(pb,.25),a.pointAfter(pa,.25),'translated point compatibility');eq(b.project(.125).snapshot(),a.project(.125).snapshot(),'projected clock compatibility');
 }
 a.advance(a.remaining());b.advance(b.remaining());eq(b.snapshot(),a.snapshot(),'final endpoint retains every bit');
}
console.log(JSON.stringify({status:'PASS',checks,limits:'Public exact-clock compatibility;707 independent rational/IEEE checks and whole-game equivalence remain separate.'}));
