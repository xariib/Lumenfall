'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone}=require('./comet-expansion-harness.cjs');
const {fixture}=require('./comet-expansion-core.cjs');
const {CATALOG,NEW_DEEDS,RETIRED}=require('./comet-expansion-numerical.cjs');
const {integer}=require('./amount-oracle.cjs');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8');let checks=0;
function eq(a,b,label){checks++;assert.deepEqual(a,b,label);}function ok(value,label){checks++;assert(value,label);}
function ready(q,id,level,wallet){
 const s=current?q.fresh():fixture(q);s.maxDepthEver=5000;s.comets=wallet;s.owned.meteor=s.owned.starcall=!current;s.owned.autoascend=false;
 if(id==='autoascend')require('./auto-ascend-challenges.cjs').qualify(s);
 if(!current){s.cometEvents={firstCommand:true,firstRecharge:true,bossStrike:true,calledKill:true};for(const [deed]of NEW_DEEDS)s.achieved[deed]=true;}
 s.activeStudies=[{id:'guardmastery',remainingSec:15,totalDurationSec:20,speedMult:3}];
 if(id==='meteor'){s.owned.meteor=false;s.cometEvents.bossStrike=false;delete s.achieved.comet_boss_strike;}
 else if(id==='starcall'){s.owned.starcall=false;s.cometEvents.calledKill=false;delete s.achieved.comet_called_kill;}
 else if(id!=='autoascend')(current?s.astralUpgrades:s.cometUpgrades)[id]=level;
 q.set(s);return clone(q.get());
}
const current=source.includes('var ASTRAL_UPGRADES=');
const activeCatalog=current?[{id:'autoascend',prices:[100]},...['astralcore','astralecho','astralconvergence'].map((id,i)=>({id,prices:Array.from({length:10},(_,rank)=>Math.ceil([750,1250,2000][i]*1.2**rank))}))]:CATALOG;
for(const item of activeCatalog)for(let level=0;level<item.prices.length;level++)for(const wallet of ['1e400','9007199254740993e0']){
 const e=app(source),q=e.q;ready(q,item.id,level,wallet);q.save();const before=clone(q.get()),slots=Array.from(e.storage),cost=item.prices[level];
 eq(q.buyPlan(item.id).cost,cost,'independent Comet quote '+item.id+'/'+level);ok(q.buyPlan(item.id).available,'wide Comet funds are available');
 e.fail(true,false);eq(q.buy(item.id),false,'failed primary Comet purchase rejects');eq(q.get(),before,'failed Comet purchase retains money, ownership and paid work');eq(Array.from(e.storage),slots,'failed Comet primary leaves saved slots unchanged');
 e.fail(false,false);ok(q.buy(item.id),'real wide Comet purchase');eq(integer(q.get().comets),integer(before.comets)-BigInt(cost),'independent exact wide Comet debit');eq(q.get().activeStudies,before.activeStudies,'Comet purchase keeps purchased Study work');
 if(item.id==='autoascend'||item.id==='meteor'||item.id==='starcall')eq(q.get().owned[item.id],true,'one paid Comet entitlement');else eq((current?q.get().astralUpgrades:q.get().cometUpgrades)[item.id],level+1,'one paid Comet rank');
 const endpoint=clone(q.get());q.load();eq(q.get(),endpoint,'wide Comet cold load');eq(q.accept(q.decode(q.export())),endpoint,'wide Comet backup/import');
}
{
 const e=app(source),q=e.q;ready(q,'autoascend',0,2**54);ok(q.buy('autoascend'),'native exactly payable Comet purchase');eq(typeof q.get().comets,'number','native exact Comet debit retains Number');eq(q.get().comets,2**54-100,'native exact Comet debit retains established rounding');
}
if(!current)for(const wallet of [2**53,'1e400']){
 const e=app(source),q=e.q;ready(q,'autoascend',0,wallet);q.get().owned.autoascend=true;q.get().questDay='';q.ensureDaily();q.save();
 const id=q.get().questIds[0],before=clone(q.get()),slots=Array.from(e.storage),plan=q.refreshPlan(id);
 eq(plan.cost,25,'independent daily refresh price');ok(plan.available,'funded daily refresh available');e.fail(true,false);eq(q.refresh(id),false,'failed daily refresh rejects');eq(q.get(),before,'failed refresh keeps money, quest and paid work');eq(Array.from(e.storage),slots,'failed refresh keeps saved slots');
 e.fail(false,false);ok(q.refresh(id),'real daily refresh');eq(integer(q.get().comets),integer(before.comets)-25n,'daily refresh exact debit');eq(q.get().dailyQuestRefreshes,before.dailyQuestRefreshes+1,'one paid refresh');if(typeof wallet==='number')eq(typeof q.get().comets,'number','native refresh retains its representation');
}
if(current){const q=app(source).q;ready(q,'autoascend',0,'1e400');q.ensureDaily();const before=clone(q.get());eq(q.refresh(q.get().questIds[0]),false,'retired consumable refresh cannot spend wide wallet');eq(q.get(),before,'retired refresh preserves all fields');}
{
 const e=app(source),q=e.q,s=fixture(q);s.comets='1e400';for(const [id]of RETIRED)s.cometClaims.retired[id]='due';q.set(s);
 const reward=RETIRED.reduce((n,row)=>n+BigInt(row[1]),0n);eq(integer(q.get().comets),10n**400n+reward,'wide wallet receives every fixed retirement reward');for(const [id]of RETIRED)eq(q.get().cometClaims.retired[id],'settled','wide retirement identity settles once');
 const endpoint=clone(q.get());eq(q.accept(endpoint),endpoint,'wide claim normalization is idempotent');q.save();q.load();eq(q.get(),endpoint,'wide claim reload cannot pay twice');
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),limits:'All fixed Comet prices, exact wide accounting, primary rollback, paid work, cold load, backup and once-only claims; native rounding/claim-order controls remain in the original Comet suites.'}));
