'use strict';
// Offline recovery of the same pinned baseline when the flagged origin is gone.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const BASE='684bfc52bb2ca523124fe63981188b9a8004d747';
function archivedBaseline(root){
 const dir=path.join(root,'docs/qa/guidance-readability-001/development-acceptance-015');
 const tree=fs.readFileSync(path.join(dir,'whole-tree.json')),diff=fs.readFileSync(path.join(dir,'complete-diff.patch'));
 assert.equal(hash(tree),'d0418880369e373e26dc6fbb6a184ece0f303c0ce3ea112cc411acd7e9a68737');
 assert.equal(hash(diff),'58a11149cb068ea04258ac6ecb4b385ab11a976e967563b21a101835b03c6085');
 const record=JSON.parse(tree);assert.equal(record.orderedParents[0],BASE);
 assert(!/^diff --git a\/(?:fonts|branding)\//m.test(diff.toString()),'Historical merge changed no baseline assets');
 const source=fs.readFileSync(path.join(root,'docs/qa/shared-ui-001/repair-003/before/index.html'));
 assert.equal(hash(source),'38eebcb93e4cdc2fbb1f9f67800f8cfb433005904389c0815641d26bbae00b6f');
 const assets=record.files.filter(r=>/^(fonts|branding)\//.test(r.path));assert.equal(assets.length,14);
 return {source,tree:Buffer.from(assets.map(r=>r.gitMode+' blob '+r.gitBlob+'\t'+r.path+'\0').join(''))};
}
module.exports={archivedBaseline,BASE};
