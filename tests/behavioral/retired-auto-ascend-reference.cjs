'use strict';
// Historical stress entry conditions ONLY. Never call from a production harness
// or use this as acceptance of the current manual game. Required current-power
// and Support gates run team-progression/manual-offline-parity on unmodified HTML.
const fs=require('node:fs'),z=require('node:zlib'),crypto=require('node:crypto'),assert=require('node:assert/strict'),path=require('node:path');
const frozen=z.gunzipSync(fs.readFileSync(path.join(__dirname,'../../docs/qa/team-progression-001/pre-team-policy.html.gz'))).toString();
assert.equal(crypto.createHash('sha256').update(frozen).digest('hex'),'fc407785579ce6f0505f492aabe1d98ba68e53e8196f86a030c9046c39c5539c','immutable released pre-team policy');
function replaceFunction(source,name){
 const pattern=new RegExp('^function '+name+'\\([^\\n]*\\)\\{[\\s\\S]*?^\\}','gm'),a=[...source.matchAll(pattern)],b=[...frozen.matchAll(pattern)];
 assert.equal(a.length,1,'unique current '+name);assert.equal(b.length,1,'unique released '+name);return source.replace(pattern,()=>b[0][0]);
}
module.exports=function historicalRepeatedAscend(source){
 assert(source.includes('Automatic Ascension is retired'),'only explicit retired-policy candidate');
 for(const name of ['ascendEligible','autoAscendReady','ascendPrismBreakdown','spiritPower'])source=replaceFunction(source,name);
 const from='  out.autoAscendEnabled = false;';assert.equal(source.split(from).length,2);source=source.replace(from,'  out.autoAscendEnabled = strictBool(source.autoAscendEnabled,fresh.autoAscendEnabled);');
 return source;
};
module.exports.frozen=frozen;
