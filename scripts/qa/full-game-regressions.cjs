'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {runProcess}=require('../lib/process.cjs');
const out=process.argv[2]||'validation-evidence/full-game-audit/core-regressions';fs.mkdirSync(out,{recursive:true});
const tests=[
 ['scripts/codex/check_context.cjs','--task','docs/tasks/FULL_GAME_WORKSHOP_AUDIT_001.md'],
 ['scripts/ci/validate_source.cjs'],
 ['tests/behavioral/full-game-audit.cjs','index.html','--negative'],
 ['tests/behavioral/exploit-fixes.cjs','index.html','--negative'],
 ['tests/behavioral/startup-order.cjs'],
 ['tests/behavioral/progression-pacing.cjs','index.html','--negative'],
 ['tests/behavioral/forge-expansion.cjs','index.html','--negative'],
 ['tests/behavioral/forge-expansion-calibration.cjs','index.html','--negative'],
 ['tests/behavioral/lab-expansion.cjs','index.html','--negative'],
 ['tests/behavioral/lab-expansion-boundary.cjs','index.html','--negative'],
 ['tests/behavioral/lab-expansion-stress.cjs','index.html'],
 ['tests/behavioral/forge-lab-caps.cjs','index.html'],
 ['tests/behavioral/lab-slot-contract.cjs','index.html'],
 ['tests/behavioral/lab-timed-boosts.cjs','index.html'],
 ['tests/behavioral/lab-boost-queue.cjs','index.html','--negative'],
 ['tests/behavioral/lab-queue-continuity.cjs','index.html'],
 ['tests/behavioral/endless-progression-core.cjs','index.html','--focus-f'],
 ['tests/behavioral/endless-price-cache.cjs','index.html'],
 ['tests/behavioral/comet-expansion-core.cjs','index.html'],
 ['tests/behavioral/tree-expansion-core.cjs','index.html'],
 ['tests/behavioral/prism-earning-state.cjs','index.html'],
 ['tests/behavioral/loadout-memory.cjs','--source','index.html',...(process.env.LUMENFALL_QA_CDP_CHROME?['--chrome',process.env.LUMENFALL_QA_CDP_CHROME]:[])],
 ['tests/behavioral/formation-best-now-core.cjs','index.html'],
 ['tests/behavioral/wisp-contribution-core.cjs','index.html'],
 ['tests/behavioral/permanent-progression.cjs','index.html'],
 ['tests/behavioral/support-recast-current.cjs','index.html','--negative'],
 ['tests/behavioral/early-wisp-curve-current.cjs','index.html','--negative'],
 ['tests/behavioral/farm-recap-parity.cjs','index.html','--negative'],
 ['tests/behavioral/offline-catchup.cjs','--source','index.html']
];
(async()=>{
 const results=[];
 for(const args of tests){const name=path.basename(args[0],'.cjs'),started=performance.now(),r=await runProcess([process.execPath,...args],{timeout:600000});
  fs.writeFileSync(path.join(out,name+'.stdout.txt'),r.stdout);fs.writeFileSync(path.join(out,name+'.stderr.txt'),r.stderr);
  const row={name,args,status:r.exitcode===0&&!r.timed_out?'pass':'fail',exitCode:r.exitcode,timedOut:r.timed_out,seconds:(performance.now()-started)/1000};results.push(row);console.log(JSON.stringify(row));
  fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({status:results.some(r=>r.status==='fail')?'fail':results.length===tests.length?'pass':'running',sourceSha256:crypto.createHash('sha256').update(fs.readFileSync('index.html')).digest('hex'),node:process.version,results},null,2));
 }
 if(results.some(r=>r.status==='fail'))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
