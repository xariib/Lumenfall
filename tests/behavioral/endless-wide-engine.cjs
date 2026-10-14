'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone,P,R,CLOCK}=require('./forge-expansion-harness.cjs');
const a=require('../../scripts/lib/game-amount.cjs');
const original=fs.readFileSync(process.argv[2]||'index.html','utf8');
const source=original.replace("if(document.readyState==='loading'){",`window.endlessQa={amount:Amount,format:formatNum,riftFormat:formatRiftNumber,prismPlan:prismPurchasePlan,spendShards:spendShards,canShards:canSpendShards,shardsAvailable:shardsAvailable,node:function(id){return NODES.find(function(n){return n.id===id;});},buyNode:buyNode};if(document.readyState==='loading'){`);
let checks=0;function eq(x,y,m){checks++;assert.deepEqual(x,y,m);}function ok(value,m){checks++;assert(value,m);}
function big(value){if(typeof value==='number')return BigInt(value);const [d,e]=value.split('e');return Number(e)>=0?BigInt(d)*10n**BigInt(e):BigInt(d)/10n**BigInt(-Number(e));}
let x=app(source),q=x.q,b=q.endless;
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
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(original).digest('hex')}));
