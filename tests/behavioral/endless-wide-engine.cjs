'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone,P,R,CLOCK}=require('./forge-expansion-harness.cjs');
const a=require('../../scripts/lib/game-amount.cjs');
const original=fs.readFileSync(process.argv[2]||'index.html','utf8');
const source=original.replace("if(document.readyState==='loading'){",`window.endlessQa={speed:applySpeedTier,amount:Amount,format:formatNum,riftFormat:formatRiftNumber,prismPlan:prismPurchasePlan,spendShards:spendShards,canShards:canSpendShards,shardsAvailable:shardsAvailable,node:function(id){return NODES.find(function(n){return n.id===id;});},buyNode:buyNode,speedCost:function(id,mult){return speedTierCost(mult,LONG_STUDIES.find(function(n){return n.id===id;}));},speedGrowth:function(growth){ENDLESS_PROGRESSION.speedMoteGrowth=growth;}};if(document.readyState==='loading'){`);
let checks=0;function eq(x,y,m){checks++;assert.deepEqual(x,y,m);}function ok(value,m){checks++;assert(value,m);}
function big(value){if(typeof value==='number')return BigInt(value);const [d,e]=value.split('e');return Number(e)>=0?BigInt(d)*10n**BigInt(e):BigInt(d)/10n**BigInt(-Number(e));}
let x=app(source),q=x.q,b=q.endless;
{
 const x=app(source),q=x.q,s=q.fresh();
 s.prisms=1e30;s.nodes.stardust=5;s.depth=s.enemyDepth=10001;s.maxDepthEver=10001;
 s.owned.autoascend=true;s.autoAscendEnabled=true;s.autoAscendTargetDepth=10000;
 q.set(s);q.restoreEnemy();const gain=q.prismPreview().gain;
 ok(gain>=200,'legacy unsafe-wallet fixture earns the complete Ascension Dust reward');
 const before=clone(q.get()),result=q.advance(0,{kind:'offline',clockStartMs:CLOCK});
 eq(result.ascends,1,'legacy unsafe-wallet automatic Ascend executes');
 eq(big(q.get().prisms),BigInt(before.prisms)+BigInt(gain),'legacy unsafe native Prism wallet receives every earned Prism');
 eq(q.get().motes-before.motes,50,'paid Ascension Dust retained when the old Prism wallet would round away the gain');
}
function hugeState(){const s=q.fresh();s.lumen='1e400';s.shards='1e400';s.prisms='1e400';s.sigils='1e400';s.motes='1e400';s.comets='1e400';s.maxDepthEver=100;s.spirits.ember=100;return s;}
q.set(hugeState());
eq(q.get().lumen,'1e400','normalization keeps wide currency');
const before=clone(q.get()),price=Math.round(10*Math.pow(1.13,100));eq(q.empowerCost('ember'),price,'ordinary price rounding retained');ok(q.empower('ember'),'real wide-funded Empower');
eq(big(q.get().lumen),big(before.lumen)-BigInt(price),'exact paid debit at old starting level');
const current=clone(q.get());ok(b.canShards('1e399'),'wide Shard affordability');ok(b.spendShards('1e399'),'wide Shard debit');
eq(q.get().shards,'9e399','wide debit exact');
eq(b.format('1e400'),'1e400','wide display');eq(b.riftFormat('1e400'),'1e400','Rift display');
ok(b.buyNode(b.node('swift')),'wide-funded real Tree purchase');
eq(big(q.get().prisms),10n**400n-3n,'exact Prism purchase');
const saved=clone(q.get());ok(q.save(),'wide primary/recovery save');q.load();eq(q.get(),saved,'wide save/load idempotent');
const backup=q.export();q.set(q.fresh());x.area.value=backup;q.restore();x.drain();eq(x.reloads(),1,'wide backup import owns a saved reload');q.load();eq(q.get(),saved,'wide backup preserves every field');
x=app(source,[...x.storage]);q=x.q;b=q.endless;eq(q.get(),saved,'actual new page starts from restored wide save');
const legacy=hugeState();legacy.schemaVersion=4;legacy.lumen=123;legacy.shards=456;legacy.prisms=78;legacy.motes=9;legacy.comets=10;legacy.sigils=11;
legacy.maxDepthEver=32;legacy.nodes.invitations=0;q.set(legacy);
for(const id of Object.keys(q.get().spirits))eq(q.get().recruitmentEntitlements[id],true,'legacy unlocked Wisp retained '+id);
eq(q.get().lumen,123,'legacy native wallet retained');eq(q.get().wispMastery.ember,0,'migration grants no Mastery');
const migrated=clone(q.get());q.set(migrated);eq(q.get(),migrated,'migration repeats safely');
{
 const old=q.fresh();old.schemaVersion=4;old.maxDepthEver=100;old.nodes.bonds=2000;old.prisms=0;delete old.feedbackMigration.bondsCreditAuditVersion;delete old.feedbackMigration.echoCreditAuditVersion;q.set(old);
 // A valid historical endpoint after the smaller refund allocations were spent.
 const held=clone(q.get());held.prisms=0;held.refundCredits.prisms=held.refundCredits.prisms.filter(e=>e.amount>1e20);
 const receipt=held.feedbackMigration.receipts['node.bonds'];receipt.remainingCredits=held.refundCredits.prisms.filter(e=>e.id==='node.bonds').map(e=>e.amount);
 q.set(held);const balance=()=>q.get().refundCredits.prisms.reduce((sum,e)=>sum+big(e.amount),big(q.get().prisms));
 const before=balance();ok(b.buyNode(b.node('swift')),'real small Tree price funded by a huge old credit');eq(balance(),before-3n,'independent exact old-credit debit');
 ok(q.get().refundCredits.prisms.some(e=>a.wide(e.amount)),'partial debit promotes the held credit');
 ok(q.save(),'held credit saves with matching original-value receipt');const saved=clone(q.get());q.load();eq(q.get(),saved,'held-credit audit survives cold load');
}
const deep=q.fresh();deep.depth=6001;deep.maxDepthEver=6001;deep.spirits.ember=100;q.set(deep);q.restoreEnemy();
ok(a.valid(q.get().enemyMaxHp),'health past former overflow is represented');ok(a.valid(q.get().enemyHp),'deep health finite representation');
q.advance(1,{kind:'live',clockStartMs:CLOCK});ok(a.valid(q.get().enemyHp),'deep live combat advances');
ok(q.save(),'deep combat save');q.load();ok(a.valid(q.get().enemyHp),'deep load preserves health');
{
 const s=q.fresh();s.schemaVersion=3;s.research.charge=2000;s.shards=Number.MAX_VALUE;q.set(s);
 const credit=BigInt('0x'+q.get().swiftRecoveryRefund.remainingShardsHex),expected=BigInt(Number.MAX_VALUE)+credit;
 eq(big(b.shardsAvailable()),expected,'available Shards include every retained credit beyond native capacity');ok(a.wide(b.shardsAvailable()),'combined available Shards remain displayable');
}
{
 const x=app(source),q=x.q,b=q.endless,s=hugeState();s.maxDepthEver=130;s.activeStudies=[{id:'guardmastery',remainingSec:100,totalDurationSec:100,speedMult:1}];s.studyUseMotes.guardmastery=true;s.studySpeedTargets.guardmastery=3;q.set(s);
 const result=q.advance(0,{kind:'offline',clockStartMs:CLOCK});
 eq(big(q.get().motes),10n**400n,'retired queue consent cannot spend wide Motes');eq(result.studyMotesSpent,0,'no automatic timed purchase');eq(q.get().activeStudies[0].speedMult,1,'queue cannot grant free speed');
 ok(b.speed('guardmastery',3),'explicit timed boost accepts wide wallet');eq(big(q.get().motes),10n**400n-3500n,'timed boost exactly debits a wide Mote wallet');eq(q.get().studyBoosts.guardmastery,{mult:3,startedAtMs:CLOCK,expiresAtMs:CLOCK+28800000},'one exact paid8h timer');
 s.longStudyLevels.wispascend=1500;s.activeStudies=[{id:'wispascend',remainingSec:100,totalDurationSec:100,speedMult:1}];s.studyUseMotes.wispascend=true;s.studySpeedTargets.wispascend=8;q.set(s);const cost=b.speedCost('wispascend',8);eq(cost,27500,'timed package price remains independent of project level');
 const wide=q.advance(0,{kind:'offline',clockStartMs:CLOCK});eq(big(q.get().motes),10n**400n,'future project never renews automatically');eq(wide.studyMotesSpent,0,'future project reports no automatic spend');ok(b.speed('wispascend',8),'explicit future boost');eq(big(q.get().motes),10n**400n-27500n,'future timed package exact debit');ok(q.save(),'wide timed endpoint saves');
}
{
 const x=app(source),q=x.q,s=hugeState();s.depth=s.enemyDepth=17;s.owned.autoascend=true;s.autoAscendEnabled=true;s.autoAscendTargetDepth=16;q.set(s);q.restoreEnemy();
 const result=q.advance(0,{kind:'offline',clockStartMs:CLOCK});eq(result.ascends,1,'real automatic Ascend with wide currencies');ok(a.valid(result.motesGained),'wide Ascend reports valid Mote gain');eq(big(q.get().motes),10n**400n+big(result.motesGained),'wide Mote Ascend credit exact');
 s.depth=s.enemyDepth=1;s.owned.autoascend=false;s.autoAscendEnabled=false;s.lastSeen=CLOCK-6000;s.totalOfflineSeconds='1e400';q.set(s);q.restoreEnemy();const offline=q.offline();eq(offline.effectiveSec,6,'wide offline accumulator processes the real window');eq(big(q.get().totalOfflineSeconds),10n**400n+6n,'wide offline time accumulator remains exact');ok(q.save(),'wide offline endpoint saves');
}
{
 const x=app(source),q=x.q,s=hugeState();s.heroRarity.ember=5;s.wispModules.ember=20;s.wispUltimate.ember=true;s.wispMastery.ember=10000;s.longStudyLevels.wispascend=2030;
 Object.keys(s.empowerQueue).forEach(id=>s.empowerQueue[id]=false);q.set(s);
 s.enemyDepth=s.depth=1;s.enemyMaxHp=s.enemyHp=a.mul(q.passive(1),'11e-324');q.set(s);
 const cursor=q.advance(.001,{kind:'live',clockStartMs:CLOCK,resumable:true});cursor.next();ok(a.ge(q.get().totalKills,1),'subnormal partial damage completes an encounter without a false stall');cursor.return();
}
{
 const x=app(source),q=x.q,s=hugeState();s.riftMode='farm';s.farmDepth=s.depth=s.enemyDepth=1;s.farmReturnDepth=2;s.spirits.ember=140;s.heroRarity.ember=5;s.wispModules.ember=20;s.wispUltimate.ember=true;s.wispMastery.ember=10000;s.research.masterwork=2001;
 Object.keys(s.empowerQueue).forEach(id=>s.empowerQueue[id]=false);q.set(s);q.restoreEnemy();const before=clone(q.get());
 const result=q.advance(1,{kind:'offline',clockStartMs:CLOCK});ok(a.wide(result.kills),'real wide-count Farm batch');eq(result.motesGained,1,'subnormal kill intervals cannot pay past the actual one-second endpoint');eq(big(q.get().motes),big(before.motes)+1n,'wide Farm pays the one eligible fixed Mote exactly');eq(q.get().moteNextAtMs,CLOCK+60000,'wide Farm preserves the exact global cooldown boundary');
 const next=q.advance(1,{kind:'offline',clockStartMs:CLOCK+1000});eq(next.motesGained,0,'next wide-count batch cannot bypass cooldown');
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(original).digest('hex')}));
