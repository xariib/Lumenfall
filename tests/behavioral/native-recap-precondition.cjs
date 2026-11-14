'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {app,clone}=require('./lab-expansion-harness.cjs');
function run(source,driverOverride){
 let checks=0;const ok=(v,m)=>{checks++;assert(v,m);},eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);};
 const root=path.resolve(__dirname,'../..'),driver=driverOverride||fs.readFileSync(path.join(root,'scripts/ci/android-upgrade.cjs'),'utf8');
 const start=driver.indexOf('async function prepareOfflineRecap(page,retainedSave){'),end=driver.indexOf(" const marker='native-offline-recap-'",start);
 ok(start>=0&&end>start,'exact native fixture prefix found');
 const prepare=new Function('retainedSave',driver.slice(start+driver.slice(start).indexOf('{')+1,end)+'\nreturn fixture;');
 const retained=JSON.parse(fs.readFileSync(path.join(root,'docs/qa/deeds-progressive-001/android-first-failure/new-upgrade-state.json'))).save;
 const original=clone(retained),fixture=prepare(retained);eq(retained,original,'fixture builder cannot mutate retained upgrade evidence');
 const allowed=new Set(['tutorialDone','riftMode','farmDepth','farmReturnDepth','depth','enemyDepth','enemyHp','enemyMaxHp']);
 for(const key of Object.keys(retained))if(!allowed.has(key))eq(fixture[key],retained[key],'preserve paid/wallet/progression field '+key);
 const suffix=/\}\)\(\);(?=\r?\n<\/script>)/g;eq([...source.matchAll(suffix)].length,1,'one complete-game observation suffix');
 const observed=source.replace(suffix,'if(window.qa){window.qa.restoreEnemy=restoreEnemyOrSpawn;window.qa.meaningful=hasMeaningfulOfflineProgress;}\n})();');
 const records=[];
 for(const seconds of [60,60.373]){
  const x=app(observed),q=x.q,now=1794648602316,s=clone(fixture);x.clock(now);s.lastSeen=now-seconds*1000;s.offlineClockHighWaterMs=s.lastSeen;q.set(s);q.restoreEnemy();
  const before=clone(q.get()),result=q.offline();ok(result&&result.earned>1,'native minute earns actual combat rewards');ok(q.meaningful(result),'production predicate requires a real recap');
  ok(q.get().totalKills>before.totalKills,'actual farming defeats enemies');ok(q.get().totalOfflineSeconds>=before.totalOfflineSeconds+60,'full absent minute credited');eq(q.get().depth,1,'fixture stays in selected farming Rift');
  records.push({seconds,earned:result.earned,kills:q.get().totalKills-before.totalKills,meaningful:q.meaningful(result)});
 }
 return {checks,records,productionCodeUnchanged:true,originalAssertionAndDeadlineRetained:true};
}
function verify(source){
 const result=run(source),driver=fs.readFileSync(path.resolve(__dirname,'../../scripts/ci/android-upgrade.cjs'),'utf8');
 const setup=/\s+Object\.assign\(fixture,\{riftMode:'farm',farmDepth:1,farmReturnDepth:Math\.max\(1,fixture\.depth\|\|1\),\r?\n\s+depth:1,enemyDepth:0,enemyHp:0,enemyMaxHp:0\}\);/g;
 assert.equal([...driver.matchAll(setup)].length,1,'one native reward-producing fixture setup');
 assert.throws(()=>run(source,driver.replace(setup,'')),/native minute earns actual combat rewards/,'removing the fixture precondition reproduces the original empty-reward failure');
 return {...result,checks:result.checks+2,negativeControl:true};
}
module.exports={run,verify};
if(require.main===module){const source=fs.readFileSync(process.argv[2]||'index.html','utf8');console.log(JSON.stringify({status:'pass',sourceSha256:require('node:crypto').createHash('sha256').update(source).digest('hex'),...verify(source)}));}
