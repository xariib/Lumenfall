'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,CLOCK,clone}=require('./forge-expansion-harness.cjs');
const file=process.argv[2]||'index.html',original=fs.readFileSync(file,'utf8');
let source=original,checks=0;
const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);};
function near(a,b,m){checks++;assert(Math.abs(a-b)<=Math.max(1e-6,Math.max(Math.abs(a),Math.abs(b))*1e-12),m+' '+a+' vs '+b);}
const condition="if(summary._farmCreditError && state.riftMode==='farm' && typeof value==='number' && typeof gain==='number'";
if(process.env.FARM_RECAP_MUTANT){assert.equal(source.split(condition).length,2);source=source.replace(condition,"if(false && typeof value==='number' && typeof gain==='number'");}
source=source.replace("if(document.readyState==='loading'){","window.endlessQa={credit:simulationCreditFarmSummary,summary:simulationSummary};if(document.readyState==='loading'){");
const fixture=JSON.parse(fs.readFileSync('tests/behavioral/fixtures.json','utf8'))['parity-long-high-power'].save;
const records=[];
for(const chunk of [14400,60,300]){
  const {q}=app(source,undefined,{clockDate:true,retainWrites:false});q.set(fixture);q.restoreEnemy();
  let clock=CLOCK;const summary={lumenGained:0,shardGained:0,kills:0,autoTaps:0,empowers:0,motesGained:0,luminousKills:0};
  for(let elapsed=0;elapsed<14400;elapsed+=chunk){
    const part=q.advance(Math.min(chunk,14400-elapsed),{kind:'offline',clockStartMs:clock,offlineWindowStartMs:CLOCK});
    clock=part.clockEndMs;for(const key of Object.keys(summary))summary[key]+=part[key];
    eq(Object.keys(part).includes('_farmCreditError'),false,'compensation is not serialized into the recap');
  }
  records.push({chunk,summary,state:clone(q.get())});
}
const direct=records[0];
for(const r of records.slice(1)){
  near(direct.summary.lumenGained,r.summary.lumenGained,'original four-hour summary lumen tolerance');
  near(direct.summary.shardGained,r.summary.shardGained,'original four-hour summary Shard tolerance');
  for(const key of ['kills','autoTaps','empowers','motesGained','luminousKills'])eq(direct.summary[key],r.summary[key],'exact summary '+key);
  for(const key of ['totalKills','motes','sigils','depth','riftMode','farmDepth','farmReturnDepth','ascendCount','totalTaps','prisms','comets','lumen','shards'])eq(direct.state[key],r.state[key],'unchanged chronological endpoint '+key);
  for(const key of ['activeParty','spirits','research','longStudyLevels','achieved','dailyStats','studyBoosts'])eq(direct.state[key],r.state[key],'retained purchases and work '+key);
}
// Captured before the recap fix: the game wallet is deliberately unchanged.
eq(direct.state.lumen,15859808.49997822,'original ordered native Lumen wallet');
eq(direct.state.shards,4026523.000008681,'original ordered native Shard wallet');
eq(direct.summary.kills,50400,'original complete four-hour kill count');
{
  const {q}=app(source,undefined,{clockDate:true,retainWrites:false}),s=q.fresh();s.riftMode='farm';s.farmDepth=s.depth=1;s.farmReturnDepth=2;q.set(s);
  const summary=q.endless.summary(0);for(let i=0;i<100000;i++)q.endless.credit(summary,'lumenGained',.1);
  eq(summary.lumenGained,10000,'independent decimal sum does not accumulate recap drift');
  eq(JSON.parse(JSON.stringify(summary))._farmCreditError,undefined,'internal error is absent from JSON');
  summary.lumenGained=0;q.endless.credit(summary,'lumenGained',.1);eq(summary.lumenGained,.1,'an external replacement invalidates the old compensation');
  q.get().riftMode='push';let expected=summary.lumenGained;
  for(let i=0;i<1000;i++){expected+=.1;q.endless.credit(summary,'lumenGained',.1);}
  eq(summary.lumenGained,expected,'Push retains its original native addition order');
  const pushSummary=q.endless.summary(0);q.get().riftMode='farm';expected=0;
  for(let i=0;i<1000;i++){expected+=.1;q.endless.credit(pushSummary,'lumenGained',.1);}
  eq(pushSummary.lumenGained,expected,'a Push-start window retains native order after automatic Farm retreat');
  q.get().riftMode='farm';summary.lumenGained='1e400';q.endless.credit(summary,'lumenGained',.1);
  eq(summary.lumenGained,'1'+'0'.repeat(400)+'1e-1','wide rewards keep exact decimal credit');
}
if(process.argv.includes('--negative')){
  const r=require('node:child_process').spawnSync(process.execPath,[__filename,file],{encoding:'utf8',env:{...process.env,FARM_RECAP_MUTANT:'1'},timeout:120000});
  checks++;assert(!r.error&&r.status===1&&r.stderr.includes('original four-hour summary lumen tolerance'),'old native-only recap must fail the original tolerance');
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(original).digest('hex'),records:records.map(r=>({chunk:r.chunk,...r.summary,lumen:r.state.lumen,shards:r.state.shards})),limits:'Original four-hour fixture and tolerances, unchanged native wallets; modern headless arithmetic is not Android acceptance.'}));
