'use strict';
// Verify that the only JavaScript differences remove the requested -10 control.
// CSS/markup do not enter the independent offline simulation reference.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const baseline='c67c4c2d171cec17f36d02d111de896f1d3b95ce';
const before=execFileSync('git',['show',baseline+':index.html'],{encoding:'utf8',maxBuffer:4e6});
const after=fs.readFileSync('index.html','utf8');
const scripts=s=>Array.from(s.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g),m=>m[1]).join('\n');
let restored=scripts(after);
for(const [current,old] of [
 ["if(offset!==-1&&offset!==1)return false;","if(offset!==-10&&offset!==-1&&offset!==1)return false;"],
 ["'depth-label','rift-back-one'","'depth-label','rift-back-ten','rift-back-one'"],
 ["els['rift-back-one'].disabled=state.depth<=1;","els['rift-back-ten'].disabled=els['rift-back-one'].disabled=state.depth<=1;"],
 ["  document.getElementById('rift-back-one').onclick=function(){stepRift(-1);};","  document.getElementById('rift-back-ten').onclick=function(){stepRift(-10);};\n  document.getElementById('rift-back-one').onclick=function(){stepRift(-1);};"]
]){
 assert.equal(restored.split(current).length,2,'one explicit navigation difference');
 restored=restored.replace(current,()=>old);
}
assert.equal(restored,scripts(before),'all other JavaScript remains byte-identical');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const accepted=JSON.parse(execFileSync('git',['show',baseline+':tests/behavioral/offline-swift-current-golden.json'],{encoding:'utf8'}));
assert.equal(accepted.sourceSha256,hash(before),'baseline binds the accepted independent oracle');
const golden=JSON.parse(fs.readFileSync('tests/behavioral/offline-swift-current-golden.json'));
assert.deepEqual({...golden,sourceSha256:accepted.sourceSha256},accepted,'all independent outcomes and state hashes preserved');
if(process.argv.includes('--bind'))fs.writeFileSync('tests/behavioral/offline-swift-current-golden.json',JSON.stringify({...accepted,sourceSha256:hash(after)},null,2)+'\n');
console.log(JSON.stringify({status:'pass',baseline,baselineSha256:hash(before),sourceSha256:hash(after),allowedScriptChanges:4,allOtherScriptBytesIdentical:true,independentOracleUnchanged:true}));
