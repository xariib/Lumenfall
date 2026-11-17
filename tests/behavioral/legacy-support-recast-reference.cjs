'use strict';
// Pin only the captured Support recast input. Current clock/combat code remains
// under test, while ordinary current-source parity lanes never use this adapter.
const fs=require('node:fs'),z=require('node:zlib'),crypto=require('node:crypto'),assert=require('node:assert/strict'),path=require('node:path');
const captured=z.gunzipSync(fs.readFileSync(path.join(__dirname,'../../docs/qa/team-progression-001/support-year/historical-hud-epoch-130.html.gz'))).toString();
assert.equal(crypto.createHash('sha256').update(captured).digest('hex'),'3f9123285f3377740e3017246fa7b0a5f8cbad60cabc9e477be9c9aefdeffa80','immutable captured Support recast input');
const recast=/^function supportCycleSeconds\(\)\{[\s\S]*?^\}/gm;
assert.equal([...captured.matchAll(recast)].length,1,'one captured recast input');
module.exports=function capturedSupportRecast(source){
 assert.equal([...source.matchAll(recast)].length,1,'one subject recast input');
 return source.replace(recast,()=>captured.match(recast)[0]);
};
