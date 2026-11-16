'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone}=require('./forge-expansion-harness.cjs');
const seed=JSON.parse(fs.readFileSync(path.join(__dirname,'../../docs/qa/offline-autoascend-2026-10-07/device_backup.json')));
function verify(html){
 let checks=0;const records=[];
 function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
 function compare(a,b,p){
  if(p.endsWith('.canonicalAutomationClock')){
   // A zero phase may omit the optional exact-clock basis while another
   // partition retains a sub-ulp positive duration. Validate both owners;
   // every gameplay timer value is still compared below in the whole state.
   for(const memo of [a,b])for(const field of Object.keys(memo)){
    checks++;assert(['_autoTapAccum','_autoEmpowerAccum'].includes(field),p+' known owner');
    const r=memo[field];eq(Object.keys(r).sort(),['base','elapsed','last'],p+' basis shape');
    checks++;assert(Number.isFinite(Number(r.elapsed))&&Number(r.elapsed)>=0&&Number(r.elapsed)<=2,p+' physical elapsed');
    eq(r.base+Number(r.elapsed)*1000,r.last,p+' exact represented timer phase');
   }return;
  }
  if(/\.canonicalAutomationClock\.[^.]+\.elapsed$/.test(p)){checks++;assert(Math.abs(Number(a)-Number(b))<=1e-9,p);return;}
  if(typeof a==='number'&&typeof b==='number'){const tolerance=Math.max(1e-6,Math.max(Math.abs(a),Math.abs(b))*(p.endsWith('.enemyHp')?1e-9:1e-12));checks++;assert(Math.abs(a-b)<=tolerance,p+': '+a+' / '+b);return;}
  if(a&&typeof a==='object'){eq(Object.keys(a),Object.keys(b),p+' keys');for(const k of Object.keys(a))compare(a[k],b[k],p+'.'+k);return;}
  eq(a,b,p);
 }
 function run(chunk,cold){
  const w=app(html,undefined,{clockDate:true,retainWrites:false});w.clock(seed.lastSeen);w.q.set(seed);const initial=clone(w.q.get());let retreats=0,retries=0;
  for(let sec=0;sec<28800;sec+=chunk){const dt=Math.min(chunk,28800-sec),r=w.q.advance(dt,{kind:'offline',visual:false,clockStartMs:seed.lastSeen+sec*1000,offlineWindowStartMs:seed.lastSeen});retreats+=r.retreats;retries+=r.retries;eq(r.ascends,0,'long offline never resets');
   if(cold){w.clock(seed.lastSeen+(sec+dt)*1000);w.q.save();w.q.load();}
  }
  eq(w.q.get().ascendCount,initial.ascendCount,'long window retains lifetime count');eq(w.q.get().prisms,initial.prisms,'long window grants no automatic Prisms');
  w.clock(seed.lastSeen+28800000);w.q.save();const state=clone(w.q.get());records.push({chunk,cold,retreats,retries,kills:state.totalKills-initial.totalKills,taps:state.totalTaps-initial.totalTaps});return state;
 }
 const whole=run(28800,false),seconds=run(1,false),cold=run(60,true);
 checks++;assert(records.every(r=>r.retreats>0&&r.retries>0),'each partition actually crosses Push/Farm/Push');
 compare(whole,seconds,'whole/seconds');compare(whole,cold,'whole/cold');return {checks,records};
}
function run(html,negative){const result={status:'PASS',sourceSha256:crypto.createHash('sha256').update(html).digest('hex'),...verify(html),controls:[]};
 if(negative){const a='if(binaryClock){\n      canonicalAutomationAdvance(binaryClock,binaryClock.project(stepSec));';assert.equal(html.split(a).length,2);let caught;
  try{verify(html.replace(a,"if(binaryClock&&state.riftMode==='push'){\n      canonicalAutomationAdvance(binaryClock,binaryClock.project(stepSec));"));}catch(e){caught=e.message;}
  assert(caught,'dropping the exact clock in Farm must fail complete partition parity');result.controls.push({name:'farm-clock-rebase',caught});
 }
 return result;
}
module.exports={run};
if(require.main===module)try{console.log(JSON.stringify(run(fs.readFileSync(process.argv[2]||'index.html','utf8'),process.argv.includes('--negative'))));}catch(e){console.error(e);process.exitCode=1;}
