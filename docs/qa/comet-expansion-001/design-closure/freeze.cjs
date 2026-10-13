'use strict';
// Node20+ metadata freezer. Does not run a game or repeat the arithmetic proof.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const directory = __dirname;
const sourcePath = process.argv[2], frozenAt = process.argv[3];
assert(path.isAbsolute(sourcePath || ''));
assert(/^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d UTC$/.test(frozenAt || ''));
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const item = absolute => {const b = fs.readFileSync(absolute); return {path:absolute,bytes:b.length,sha256:sha(b)};};
const read = name => JSON.parse(fs.readFileSync(path.join(directory,name),'utf8'));
const meteor = read('meteor-proof.json'), ledger = read('ledger-proof.json');
assert.equal(meteor.status,'PASS_DESIGN_PROTOTYPE_ORACLE');
assert.equal(ledger.status,'PASS_DESIGN_MODEL_ORACLE');
for (const receipt of [meteor,ledger]) {
  assert.equal(receipt.input.sha256,item(sourcePath).sha256);
  for (const dependency of receipt.dependencies) {
    const current = item(path.join(directory,dependency.name));
    assert.equal(current.bytes,dependency.bytes); assert.equal(current.sha256,dependency.sha256);
  }
}
assert.equal(fs.statSync(path.join(directory,'meteor-proof.stderr.txt')).size,0);
assert.equal(fs.statSync(path.join(directory,'ledger-proof.stderr.txt')).size,0);
const repo = path.dirname(sourcePath);
const git = args => cp.execFileSync('git',args,{cwd:repo,encoding:'utf8'}).trim();
const sourceStatus = git(['status','--porcelain','--','index.html']);
assert.equal(sourceStatus,'');
const execution = {
  status:'FROZEN_DESIGN_CLOSURE_NOT_GAMEPLAY_ACCEPTANCE',frozenAt,clockSource:'clock__curr_time UTC supplied as argument; no executor wall-clock timestamp',
  node:process.version,
  source:{...item(sourcePath),head:git(['rev-parse','HEAD']),tree:git(['rev-parse','HEAD^{tree}']),blob:git(['hash-object','index.html']),sourceWorktreeStatus:sourceStatus},
  inputs:['../design-proposal.md','../root-design-review.md'].map(name=>item(path.resolve(directory,name))),
  observedCommands:[
    {argv:['node','prove-meteor.cjs',sourcePath,meteor.auditedAt],exitCode:0,execWallSeconds:0.532402103,stdout:'meteor-proof.json',stderr:'meteor-proof.stderr.txt',origin:'actual exec tool completion; preserved stdout/stderr'},
    {argv:['node','prove-ledger.cjs',sourcePath,ledger.auditedAt],exitCode:0,execWallSeconds:0.077720037,stdout:'ledger-proof.json',stderr:'ledger-proof.stderr.txt',origin:'actual exec tool completion; preserved stdout/stderr; final run includes the five immediate-new-award cases'},
    {commands:['node --check meteor-candidate.cjs','node --check exact-oracle.cjs','node --check prove-meteor.cjs','node --check prove-ledger.cjs','node --check freeze.cjs'],exitCode:0,origin:'actual sequential syntax-only exec completion; followed by read-only summary printing; no syntax errors'}
  ],
  counts:{meteor:meteor.counts,ledger:ledger.counts},
  noChanges:['game source','tracked tests','repo documentation','staging','commits','remote branches/PRs','user saves','APK'],
  acceptanceLimit:'Only pure candidate/oracle/model proofs plus isolated original F26 and epsilon-branch observations. Actual Node8, UI, Comet integration, persistence faults, rewards and timing regressions remain future implementation gates.'
};
fs.writeFileSync(path.join(directory,'execution.json'),JSON.stringify(execution,null,2)+'\n');
const names = fs.readdirSync(directory).filter(name=>name!=='manifest.json').sort();
const files = names.map(name=>{
  const stat=fs.lstatSync(path.join(directory,name)); assert(stat.isFile()&&!stat.isSymbolicLink());
  const x=item(path.join(directory,name)); return {path:name,originalBytes:x.bytes,storedBytes:x.bytes,originalSha256:x.sha256,storedSha256:x.sha256,encoding:'original bytes'};
});
const manifest={status:'FROZEN_DESIGN_CLOSURE',frozenAt,sourceSha256:execution.source.sha256,fileCount:files.length,bytes:files.reduce((sum,x)=>sum+x.storedBytes,0),files};
fs.writeFileSync(path.join(directory,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
process.stdout.write(JSON.stringify({status:manifest.status,frozenAt,source:execution.source,files:files.length,bytes:manifest.bytes,manifest:item(path.join(directory,'manifest.json')),execution:item(path.join(directory,'execution.json'))},null,2)+'\n');
