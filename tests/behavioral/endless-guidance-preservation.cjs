'use strict';
// Exact inverse of this presentation-only change. Any other product byte drift
// (including costs, timers, migrations or combat arithmetic) fails acceptance.
const fs=require('node:fs'),z=require('node:zlib'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8'),raw=fs.readFileSync(process.argv[3]),baseline=(process.argv[3].endsWith('.gz')?z.gunzipSync(raw):raw).toString('utf8'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.equal(hash(baseline),'4b052487793c768611ff39ba88872c0a3f4ea3aeaf217616e104bfd3eb34ac45','measured F baseline bytes');
function inverse(input){
 let text=input;
 function cut(first,end){const start=text.indexOf(first),finish=text.indexOf(end,start);assert(start>=0&&finish>start);text=text.slice(0,start)+text.slice(finish);}
 cut('  .late-power-guide[hidden]','  .stage .objective-kind');
 cut('      <section class="card late-power-guide"','      <div id="formation-presets">');
 cut('// Read-only advice after roster development.','function nextRiftObjective(){');
 for(const line of ["  var late=latePowerAdvice();if(late)return late;\n","  el.setAttribute('data-target-selector',goal.selector||'');\n","  renderLatePowerAdvice();\n","  document.getElementById('late-power-open').addEventListener('click',function(){openPowerAdvice(latePowerAdvice());});\n"]){assert.equal(text.split(line).length,2);text=text.replace(line,'');}
 text=text.replace("    if(target) openPowerAdvice({tab:target,selector:this.getAttribute('data-target-selector')});","    if(target) activateTab(target);");
 return text;
}
assert.equal(inverse(source),baseline,'all original product bytes retained outside optional advice and its presentation hooks');
assert.notEqual(inverse(source.replace('hpBase:60','hpBase:61')),baseline,'causal control detects unauthorized numeric change');
console.log(JSON.stringify({status:'PASS',sourceSha256:hash(source),baselineSha256:hash(baseline),checks:2,limits:'Exact unchanged gameplay, balance, save and paid-work bytes. Guided player decisions are measured separately.'}));
