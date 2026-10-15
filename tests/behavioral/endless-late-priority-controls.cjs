'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const {integer}=require('./amount-oracle.cjs');
const [input,origin,source,out]=process.argv.slice(2),base=JSON.parse(fs.readFileSync(input));assert(input&&origin&&source&&out);
fs.mkdirSync(out,{recursive:true});
const cases=[['sigil-unit','exact Sigil ledger',j=>{j.state.sigils=String(integer(j.state.sigils)+1n)+'e0';}],['free-rank','one explicit purchase per rank ember',j=>j.state.wispMastery.ember++],['offline-unit','exact cumulative offline accounting',j=>j.state.totalOfflineSeconds++]],records=[];
for(const[name,cause,mutate]of cases){
 const j=JSON.parse(JSON.stringify(base));mutate(j);const file=path.join(out,name+'.json'),bytes=Buffer.from(JSON.stringify(j));fs.writeFileSync(file,bytes);
 const result=spawnSync(process.execPath,[path.join(__dirname,'endless-late-priority-audit.cjs'),file,origin,source],{encoding:'utf8',windowsHide:true,timeout:30000});
 assert(!result.error,String(result.error));assert.equal(result.status,1);assert(result.stderr.includes(cause),'specific causal assertion '+name);
 fs.writeFileSync(path.join(out,name+'.stderr.txt'),result.stderr);records.push({name,cause,exit:result.status,mutatedInputSha256:crypto.createHash('sha256').update(bytes).digest('hex')});
}
const report={status:'PASS',sourceSha256:base.sourceSha256,controls:records};fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
