'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone,CLOCK}=require('./forge-expansion-harness.cjs');
const amount=require('../../scripts/lib/game-amount.cjs');
const original=fs.readFileSync(process.argv[2]||'index.html','utf8');
// Independent proposal constants; never derive an expected price/gate from code.
const calibrated=!process.argv.includes('--initial-proposal');
const expected=calibrated?{forgeDepth:70,forgeLumen:1000000,forgeShards:25000,recruitLab:24,lab:32,mythicLab:31,work:864000,prisms:100000,sigils:100000000,ultimate:40000000,voidUltimate:140000000,masteryPrisms:20000,masterySigils:500000}:{forgeDepth:120,forgeLumen:50000000,forgeShards:500000,recruitLab:22,lab:30,mythicLab:29,work:777600,prisms:1000,sigils:50000,ultimate:15000,voidUltimate:45000,masteryPrisms:200,masterySigils:5000};
const source=original.replace("if(document.readyState==='loading'){",`window.endlessQa={
  unlocked:wispRecruitmentUnlocked,rarityPlan:getWispRarityPlan,rarity:buyRarity,
  ultimatePlan:getWispUltimatePlan,masteryPlan:getWispMasteryPlan,mastery:buyWispMastery,module:buyModule,
  farm:enterFarmMode,curve:endlessCurveDepth,studyWork:studyDuration,studyPrice:studyCost,
  factor:wispMasteryFactor,requirements:wispRequirementText,
  recruitmentPrice:function(id,price){ENDLESS_PROGRESSION.recruitLumen[id]=price;},rarityPrice:rarityCost,
  creditTotal:prismRefundCreditTotal,
  quoteProbe:function(){var copies=0,original=clonePersistedValue,before=JSON.stringify(state);clonePersistedValue=function(value){copies++;return original(value);};try{for(var i=0;i<100;i++)prismPurchasePlan(3,true);}finally{clonePersistedValue=original;}return {copies:copies,unchanged:before===JSON.stringify(state)};},
  start:function(id){return startStudy(LONG_STUDIES.find(function(n){return n.id===id;}));},speed:applySpeedTier,
  speedPrice:function(id,mult){return speedTierCost(mult,LONG_STUDIES.find(function(n){return n.id===id;}));},speedGrowth:function(growth){ENDLESS_PROGRESSION.speedMoteGrowth=growth;}
};if(document.readyState==='loading'){`);
let checks=0;const eq=(x,y,m)=>{checks++;assert.deepEqual(x,y,m);},ok=(x,m)=>{checks++;assert(x,m);};
const near=(x,y,m)=>{checks++;assert(Math.abs(x-y)<=Math.max(1,Math.abs(y))*1e-12,m);};
function game(){const x=app(source);return {x,q:x.q,b:x.q.endless};}
{
 const {q,b}=game(),s=q.fresh();s.maxDepthEver=32;s.lumen=1e9;q.set(s);
 const forge=q.defs().find(node=>node.id==='masterwork');eq({depth:forge.unlockDepth,lumen:forge.lumenBase,shard:forge.shardBase,lumenGrowth:forge.lumenGrowth,shardGrowth:forge.shardGrowth,cap:forge.levelCap}, {depth:expected.forgeDepth,lumen:expected.forgeLumen,shard:expected.forgeShards,lumenGrowth:1.35,shardGrowth:1.35,cap:undefined},'new repeatable Forge independent catalog contract');
 for(const id of ['ember','tide','stone'])ok(b.unlocked(q.sp(id)),'early team available '+id);
 for(const id of ['gale','thorn','void','aurora','titan'])eq(b.unlocked(q.sp(id)),false,'Rift32 is not whole roster '+id);
 const gates=[['gale',15,15],['thorn',35,18],['void',55,20],['aurora',75,21],['titan',100,expected.recruitLab]];
 for(const [id,depth,lab]of gates){const a=q.fresh();a.maxDepthEver=depth;a.longStudyLevels.wispascend=lab-1;q.set(a);eq(b.unlocked(q.sp(id)),false,'research boundary '+id);a.longStudyLevels.wispascend=lab;a.maxDepthEver=depth-1;q.set(a);eq(b.unlocked(q.sp(id)),false,'depth boundary '+id);a.maxDepthEver=depth;q.set(a);ok(b.unlocked(q.sp(id)),'both gates '+id);q.set(q.get());ok(q.get().recruitmentEntitlements[id],'unlock saves permanently '+id);}
 const old=q.fresh();old.schemaVersion=4;old.maxDepthEver=32;old.depth=20;old.lumen=1e8;q.set(old);
 for(const id of Object.keys(q.get().spirits))ok(b.unlocked(q.sp(id)),'old unlocked roster preserved '+id);
 q.ascend();for(const id of Object.keys(q.get().spirits))ok(b.unlocked(q.sp(id)),'old entitlements survive Ascend '+id);
}
function late(){const {x,q,b}=game(),s=q.fresh();s.spirits.ember=140;s.maxDepthEver=200;s.depth=100;s.ascendCount=50;s.heroRarity.ember=4;s.wispModules.ember=20;s.longStudyLevels.wispascend=expected.lab;s.research.arcanecal=10;s.research.masterwork=1;s.nodes.swift=10;s.lumen=1e12;s.shards=1e12;s.prisms=expected.prisms;s.sigils=expected.sigils;return {x,q,b,s};}
{
 const {q,b}=game(),s=q.fresh();s.schemaVersion=1;s.nodes.bonds=21;s.prisms=1e30;delete s.feedbackMigration;delete s.refundCredits;q.set(s);
 eq(b.creditTotal(),3376,'original held refund total');
 q.get().refundCredits.prisms[0].amount=3373;eq(b.creditTotal(),3373,'in-place held-credit change updates total');
 q.get().refundCredits.prisms[0].amount='1e400';eq(b.creditTotal(),'1e400','wide held total retained');
 q.get().refundCredits.prisms=[];eq(b.creditTotal(),0,'removed held credits update total');
}
{
 const {q,b}=game(),s=q.fresh();s.schemaVersion=1;s.nodes.bonds=2000;s.prisms=0;delete s.feedbackMigration;delete s.refundCredits;q.set(s);q.get().prisms='1e400';
 ok(q.get().refundCredits.prisms.length>100,'real large original refund ledger');
 eq(b.quoteProbe(),{copies:0,unchanged:true},'wide price quotes never clone or mutate paid ledgers');
}
{
 const {q,b}=game(),s=q.fresh();s.maxDepthEver=200;s.longStudyLevels.wispascend=30;q.set(s);const sp=q.sp('void');
 eq(q.empowerCost('void'),70000,'independent recruitment base');eq(b.rarityPrice(sp,0).lumen,560000,'independent rarity base');eq(b.ultimatePlan(sp).cost,expected.voidUltimate,'independent Ultimate table');
 b.recruitmentPrice('void',700000);eq(q.empowerCost('void'),700000,'recruitment table changes its own quote');eq(b.rarityPrice(sp,0).lumen,560000,'recruitment price cannot reprice rarity');eq(b.ultimatePlan(sp).cost,expected.voidUltimate,'recruitment price cannot reprice Ultimate');
}
{
 const {q,b,s}=late();q.set(s);const sp=q.sp('ember');ok(b.rarityPlan(sp).affordable,'Mythic full requirements');
 for(const [field,value]of [['level',139],['depth',99],['ascends',39],['lab',expected.mythicLab-1],['forge',9]]){
  const a=clone(s);if(field==='level')a.spirits.ember=value;if(field==='depth'){a.maxDepthEver=value;a.depth=Math.min(a.depth,value);}if(field==='ascends')a.ascendCount=value;if(field==='lab')a.longStudyLevels.wispascend=value;if(field==='forge')a.research.arcanecal=value;
  q.set(a);const before=clone(q.get());eq(b.rarity(sp),false,'reject missing '+field);eq(q.get(),before,'missing gate spends nothing '+field);
 }
 q.set(s);ok(b.rarity(sp),'real Mythic purchase');eq(q.get().heroRarity.ember,5,'earned Mythic');eq(q.get().lumen,1e12-25000000,'Mythic Lumen');eq(q.get().shards,1e12-250000000,'Mythic Shards');
 const mythic=clone(q.get());ok(b.ultimatePlan(sp).affordable,'Ultimate full requirements');const a=clone(mythic);a.wispModules.ember=14;q.set(a);const untouched=clone(q.get());eq(q.ultimate('ember'),false,'Ultimate needs ability15');eq(q.get(),untouched,'failed Ultimate changes nothing');
 q.set(mythic);ok(q.ultimate('ember'),'real Ultimate purchase');eq(q.get().sigils,expected.sigils-expected.ultimate,'independent Ultimate debit');
}
{
 const {x,q,b,s}=late();s.heroRarity.ember=5;s.wispUltimate.ember=true;q.set(s);const sp=q.sp('ember'),power=q.power('ember');
 ok(b.masteryPlan(sp).affordable,'first Mastery ready');eq(b.masteryPlan(sp).cost,{prism:expected.masteryPrisms,sigil:expected.masterySigils},'first Mastery prices');
 const before=clone(q.get());x.fail(true,false);eq(b.mastery(sp),false,'failed primary Mastery returns failure');eq(q.get(),before,'failed primary Mastery rolls back everything');x.fail(false,false);
 ok(b.mastery(sp),'first Mastery bought');eq(q.get().wispMastery.ember,1,'rank1');eq(q.get().prisms,expected.prisms-expected.masteryPrisms,'Mastery Prism debit');eq(q.get().sigils,expected.sigils-expected.masterySigils,'Mastery Sigil debit');near(q.power('ember'),power*1.1,'own Power compounded10%');
 eq(b.masteryPlan(sp).affordable,false,'next rank needs deeper record');const a=clone(q.get());a.maxDepthEver=225;q.set(a);ok(b.mastery(sp),'next record opens rank2');near(q.power('ember'),power*1.1*1.1,'two compound ranks');
 const owned=clone(q.get());q.ascend();eq(q.get().wispMastery.ember,2,'Mastery survives Ascend');eq(q.get().heroRarity.ember,5,'rarity retained');eq(q.get().wispModules.ember,20,'ability retained');eq(q.get().wispUltimate.ember,true,'Ultimate retained');
 q.set(owned);const a5=clone(owned);a5.wispMastery.ember=5;a5.maxDepthEver=325;a5.longStudyLevels.wispascend=expected.lab+1;q.set(a5);eq(b.masteryPlan(sp).affordable,false,'Forge opens groups of5');a5.research.masterwork=2;q.set(a5);ok(b.masteryPlan(sp).affordable,'second Forge group');
}
{
 const {q,b,s}=late();s.spirits.tide=140;s.heroRarity.tide=5;s.wispModules.tide=20;s.wispUltimate.tide=true;s.activeParty=['tide'];q.set(s);const before=q.supportProfile('tide'),power=q.power('tide');ok(b.mastery(q.sp('tide')),'Support Mastery bought');eq(q.supportProfile('tide'),before,'Support strength/duration/recast unchanged');near(q.power('tide'),power*1.1,'Support own Power improves');
}
{
 const {q,b,s}=late();s.heroRarity.ember=5;s.wispUltimate.ember=true;s.wispMastery.ember=10000;s.maxDepthEver=250200;s.longStudyLevels.wispascend=2000+expected.lab;s.research.masterwork=2001;s.nodes.swift=1010;s.lumen='1e400';s.shards='1e400';s.prisms='1e400';s.sigils='1e400';q.set(s);
 ok(amount.valid(q.power('ember')),'rank10000 Power has a finite representation');ok(amount.wide(q.power('ember')),'rank10000 crosses native limit');ok(b.mastery(q.sp('ember')),'high rank remains purchasable');eq(q.get().wispMastery.ember,10001,'no arbitrary Mastery cap');
 q.restoreEnemy();const oldDepth=q.get().depth;q.manualTap();eq(q.get().depth,oldDepth+1,'wide damage advances a real encounter');
 b.farm();q.advance(1,{kind:'live',clockStartMs:CLOCK});ok(amount.valid(q.get().lumen),'wide-power Farm timeline stays valid');ok(amount.valid(q.get().totalKills),'wide Farm count remains valid');
 const f=q.fresh();f.depth=1e100;f.maxDepthEver=1e100;q.set(f);q.restoreEnemy();ok(amount.valid(q.get().enemyHp),'extreme-depth health is represented');ok(amount.wide(q.get().enemyHp),'extreme-depth health crosses native limit');q.advance(1,{kind:'live',clockStartMs:CLOCK});ok(amount.valid(q.get().enemyHp),'extreme-depth timeline advances');
}
{
 const {q,b}=game();const s=q.fresh();s.longStudyLevels.measuredinquiry=10;q.set(s);const node=q.projects().find(n=>n.id==='wispascend');
 for(const level of [50,500,5000]){const sec=b.studyWork(node,level);ok(Number.isFinite(sec)&&sec>0&&sec<=expected.work,'bounded future work '+level);}
 const s2=q.fresh();s2.activeStudies=[{id:'wispascend',remainingSec:40000000,totalDurationSec:80000000,speedMult:8}];q.set(s2);eq(q.get().activeStudies,s2.activeStudies,'existing paid work and speed unchanged');
}
{
 const {x,q,b}=game(),s=q.fresh();s.lumen=s.shards=s.motes='1e400';q.set(s);q.save();
 const before=clone(q.get());x.fail(true,false);eq(b.start('wispascend'),false,'failed primary Study start');eq(q.get(),before,'Study start rolls back funds and work');x.fail(false,false);ok(b.start('wispascend'),'Study retry succeeds once');
 const running=clone(q.get());x.fail(true,false);eq(b.speed('wispascend',1.5),false,'failed primary paid speed');eq(q.get(),running,'paid speed rolls back Motes, target and project');x.fail(false,false);ok(b.speed('wispascend',1.5),'paid speed retry succeeds');eq(q.get().activeStudies[0].speedMult,1,'prepaid boost retains original paid floor');eq(q.get().studyBoosts.wispascend.mult,1.5,'one paid timed speed retained');
}
{
 const endpoints=[];
 for(const fail of [false,true]){
  const {x,q,b,s}=late();s.heroRarity.ember=5;s.wispUltimate.ember=true;s.activeStudies=[{id:'wispascend',remainingSec:10000,totalDurationSec:20000,speedMult:8}];q.set(s);q.restoreEnemy();
  q.advance(.0003,{kind:'live',clockStartMs:CLOCK});
  if(fail){const before=clone(q.get());x.fail(true,false);eq(b.mastery(q.sp('ember')),false,'failed purchase within paid chronological work');eq(q.get(),before,'failure retains the chronological endpoint');x.fail(false,false);}
  q.advance(.0003,{kind:'live',clockStartMs:CLOCK+.3});endpoints.push(clone(q.get().activeStudies));
 }
 eq(endpoints[0],endpoints[1],'failed purchase preserves paid-work clock continuity');
}
{
 const {q,s}=late();s.heroRarity.ember=5;s.wispUltimate.ember=true;s.wispMastery.ember=1;
 for(const rank of [-1,.5,'2',Infinity]){const f=clone(s);f.wispMastery.ember=rank;checks++;assert.throws(()=>q.accept(f),/Invalid Wisp Mastery/,'malformed rank rejects for recovery');}
 const f=clone(s);f.wispModules.ember=19;checks++;assert.throws(()=>q.accept(f),/Incomplete Wisp Mastery/,'malformed prerequisites reject for recovery');
}
{
 const {x,q,b}=game();
 for(const [level,plain,discounted]of [[0,27500,22000],[5,27500,22000],[20,27500,22000]]){
  const s=q.fresh();s.longStudyLevels.wispascend=level;q.set(s);eq(b.speedPrice('wispascend',8),plain,'independent future speed price '+level);
  q.get().longStudyLevels.catalysis=10;eq(b.speedPrice('wispascend',8),discounted,'Cata preserves20% future speed benefit '+level);
 }
 const s=q.fresh();s.longStudyLevels.wispascend=20;s.longStudyLevels.catalysis=10;s.motes=21999;s.activeStudies=[{id:'wispascend',remainingSec:100000,totalDurationSec:100000,speedMult:1}];q.set(s);
 const short=clone(q.get());eq(b.speed('wispascend',8),false,'scaled Mote price shortage rejects');eq(q.get(),short,'shortage retains paid work and wallet');
 q.get().motes='1e400';const before=clone(q.get());x.fail(true,false);eq(b.speed('wispascend',8),false,'scaled speed failed save');eq(q.get(),before,'scaled speed rollback retains every field');x.fail(false,false);ok(b.speed('wispascend',8),'scaled wide-funded speed purchase');
 eq(amount.exactAdd(q.get().motes,22000),'1e400','timed price exact wide debit');eq(q.get().activeStudies[0],s.activeStudies[0],'prepaid boost retains purchased work and floor');eq(q.get().studyBoosts.wispascend,{mult:8,startedAtMs:CLOCK,expiresAtMs:CLOCK+28800000},'exact8h paid timer');
 const paid=clone(q.get());eq(b.speed('wispascend',8),false,'unexpired boost cannot charge twice');eq(q.get(),paid,'owned speed and work remain intact');
}
// Ability purchases use the same atomic boundary as other Wisp development.
function exactInteger(value){if(typeof value==='number')return BigInt(value);const p=/^(\d+)e(\d+)$/.exec(value);assert(p,'canonical integer amount');return BigInt(p[1])*10n**BigInt(p[2]);}
for(const [id,base]of [['ember',10],['tide',60],['stone',360],['gale',2100],['thorn',12000],['void',70000],['aurora',400000],['titan',2200000]]){
 const {x,q,b}=game(),s=q.fresh();s.maxDepthEver=250;s.spirits[id]=1;s.lumen=s.shards='1e400';s.activeStudies=[{id:'guardmastery',remainingSec:70,totalDurationSec:150,speedMult:4}];q.set(s);q.save();
 const before=clone(q.get()),disk=Array.from(x.storage);x.fail(true,false);
 eq(b.module(q.sp(id)),false,'failed primary ability purchase '+id);eq(q.get(),before,'failed ability rolls back wallet and rank '+id);eq(Array.from(x.storage),disk,'failed ability leaves both save slots '+id);x.fail(false,false);
 ok(b.module(q.sp(id)),'real ability purchase '+id);eq(q.get().wispModules[id],1,'one ability level '+id);
 eq(exactInteger(q.get().lumen),10n**400n-BigInt(base*4),'exact wide ability Lumen debit '+id);eq(exactInteger(q.get().shards),10n**400n-BigInt(Math.round(base*.4)),'exact wide ability Shard debit '+id);eq(q.get().activeStudies,before.activeStudies,'ability retains paid work '+id);
 const paid=clone(q.get());q.load();eq(q.get(),paid,'ability cold save endpoint '+id);q.get().wispModules[id]=20;const capped=clone(q.get());eq(b.module(q.sp(id)),false,'ability cap has no extra purchase '+id);eq(q.get(),capped,'ability cap preserves wallet '+id);
}
if(calibrated){
 const q=app(source).q,s=q.fresh();s.maxDepthEver=70;s.lumen=s.shards='1e400';q.set(s);
 const text=q.previewText('masterwork',1);ok(text.includes('Current: Own Wisp Power ×1.00;'),'explicit current Masterwork Power');ok(text.includes('Next: Own Wisp Power ×1.25;'),'exact first Masterwork multiplier display');ok(q.node('masterwork').desc.includes('25% per level'),'Masterwork description discloses its compounded Power effect');
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(original).digest('hex')}));
