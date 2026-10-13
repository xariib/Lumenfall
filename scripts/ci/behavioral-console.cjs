'use strict';
// tee stores the complete original log before this console-only projection.
// Keep every case outcome and bounded failed-case diagnostics readable; test
// execution, exit status and full artifact bytes are unchanged.
const readline=require('node:readline');
let failedCase=false;
const input=readline.createInterface({input:process.stdin,crlfDelay:Infinity});
input.on('line',line=>{
  if(/^(PASS |FAIL )/.test(line))failedCase=line.startsWith('FAIL ');
  if(/^(PASS |FAIL |Behavioral QA |Browser identity:|Staged source:)/.test(line)||
     failedCase&&/^  (process:|observed QA:|failure:|detail:|raw artifacts:)/.test(line)){
    process.stdout.write(line.slice(0,2400)+(line.length>2400?' [complete line retained in behavioral.log]':'')+'\n');
  }
});
