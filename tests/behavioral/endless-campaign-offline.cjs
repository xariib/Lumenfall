'use strict';
// Paired real campaigns isolate the missing offline-lifecycle statistic.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const source=path.resolve(process.argv[2]||'index.html'),root=path.resolve(__dirname,'../..'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'lf-campaign-offline-'));
assert.equal(path.dirname(path.resolve(dir)),path.resolve(os.tmpdir()));assert(path.basename(dir).startsWith('lf-campaign-offline-'),'verified owned temporary target');
const sourceSha256=crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex');
function run(label,runner){
 const prefix=path.join(dir,label),env={...process.env,LUMENFALL_CAMPAIGN_SNAPSHOT:prefix,LUMENFALL_CAMPAIGN_PROGRESS:'0'};
 delete env.LUMENFALL_CAMPAIGN_RESUME;delete env.LUMENFALL_CAMPAIGN_RUN_MS;
 const child=spawnSync(process.execPath,[path.join(root,runner),source,'1','regular'],{cwd:root,env,encoding:'utf8',timeout:120000,maxBuffer:32*1024*1024,windowsHide:true});
 assert.ifError(child.error);assert.equal(child.status,0,child.stderr);const output=JSON.parse(child.stdout);
 assert.equal(output.status,'MEASURED');assert.equal(output.sourceSha256,sourceSha256);assert.equal(output.days,1);
 return {output,state:JSON.parse(fs.readFileSync(prefix+'.endpoint.json','utf8'))};
}
try{
 const before=run('before','docs/qa/endless-progression-001/runtimes/offline-stat-before/tests/behavioral/endless-campaign.cjs');
 const after=run('after','tests/behavioral/endless-campaign.cjs');
 assert.equal(before.state.totalOfflineSeconds,0,'negative baseline actually omits the lifecycle statistic');assert.equal(before.state.achieved.idle8,undefined,'negative baseline omits Idle8');
 const expected=JSON.parse(JSON.stringify(before.state));expected.totalOfflineSeconds=3*(8*3600-600);expected.comets+=15;expected.achieved.idle8=true;
 assert.deepEqual(after.state,expected,'real overnight adapter changes only earned offline hours and the fixed Idle8 reward');
 for(const key of ['milestones','history','walls','purchases'])assert.deepEqual(after.output[key],before.output[key],'same first-day gameplay decisions and exact receipts: '+key);
 console.log(JSON.stringify({status:'PASS',sourceSha256,beforePolicySha256:before.output.policySha256,afterPolicySha256:after.output.policySha256,offlineSeconds:after.state.totalOfflineSeconds,cometsBefore:before.state.comets,cometsAfter:after.state.comets,purchaseReceipts:after.output.purchases.length,limits:'One full real-engine day; no inference that later Comet purchases are unchanged without the separate first-attempt affordability audit.'}));
}finally{fs.rmSync(dir,{recursive:true,force:true});}
