'use strict';
// TASK7 option A. Full production IIFEs; isolated presentation/timers/storage.
// The immutable pre-decision local checkpoint is the paid-value/old-quote oracle.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const F=require('./forge-expansion-harness.cjs'),L=require('./lab-expansion-harness.cjs');
const {exactCost}=require('./forge-expansion.cjs');
const {integer}=require('./amount-oracle.cjs');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8');
const baselineRef='fe42861fce2895c24b9e24de18714606973481ea';
const baseline=execFileSync('git',['show',baselineRef+':index.html'],{encoding:'utf8',maxBuffer:8388608,cwd:path.resolve(__dirname,'../..')});
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
assert.equal(hash(baseline),'f8f787fd4a520ec277b350f40c6caeefa519c48cb55ddeb9bbe486e4cd0200b6','immutable accepted pre-decision source');
const combinedRef='a4f82f47a818c11ecfcf74850a080f57d6cb690e';
const combined=execFileSync('git',['show',combinedRef+':index.html'],{encoding:'utf8',maxBuffer:8388608,cwd:path.resolve(__dirname,'../..')});
assert.equal(hash(combined),'e110f182e500eed4bbb0382d182471c93110da28fda97fff4856b5931791a9ac','immutable accepted combined baseline');
const forgeIds=['arcanecal','conduction'],labIds=['bossledger','luminousdistill'];
function verify(html){
  let checks=0;const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);};
  const ok=(v,m)=>{checks++;assert.ok(v,m);};
  const near=(a,b,m)=>ok(Number.isFinite(a)&&Math.abs(a-b)<=Math.max(1,Math.abs(b))*1e-10,m);
  const fx=F.app(html),f=fx.q,bf=F.app(baseline).q,cf=F.app(combined).q,lx=L.app(html),l=lx.q,bl=L.app(baseline).q;
  function labSeed(){const s=L.seed(l);s.activeStudies=[];Object.keys(s.studyQueue).forEach(id=>s.studyQueue[id]=false);return s;}
  function legacyInput(s,q){s=F.clone(s);s.schemaVersion=q.fresh().schemaVersion;delete s.wispMastery;delete s.recruitmentEntitlements;delete s.research.masterwork;delete s.researchQueue.masterwork;return s;}
  const originalIds=bf.defs().map(n=>n.id);originalIds.splice(8,0,'masterwork');eq(f.defs().map(n=>n.id),originalIds,'all original Forge IDs retained plus explicit Masterwork');
  eq(l.projects().map(n=>n.id),bl.projects().map(n=>n.id),'no Lab ID removed or replaced');
  for(const node of f.defs()){
    if(node.id==='masterwork'){eq([node.unlockDepth,node.lumenBase,node.shardBase,node.lumenGrowth,node.shardGrowth,node.effectPerLevel,node.levelCap,node.grandfatheredCap,node.retiredTo],[70,1000000,25000,1.35,1.35,5,500,true,''],'independent finite Masterwork definition');continue;}
    const old=JSON.parse(JSON.stringify(bf.node(node.id)));if(forgeIds.includes(node.id))old.levelCap=20;
    if(old.levelCap===undefined){old.levelCap=250;old.grandfatheredCap=true;}
    eq(node,old,'only agreed Forge caps change: '+node.id);
  }
  for(const node of l.projects()){
    const old=JSON.parse(JSON.stringify(bl.projects().find(n=>n.id===node.id)));
    if(labIds.includes(node.id)){old.levelCap=20;old.desc=old.desc.replace(node.id==='bossledger'?'up to 50%':'up to 100%',node.id==='bossledger'?'up to 100%':'up to 200%');}
    if(node.id==='catalysis')old.desc='2% lower Mote prices per level for future timed Lab boosts, up to 20%. Existing paid speed and boost time are retained; project levels share unexpired boost time.';
    if(old.levelCap===undefined){old.levelCap=500;old.grandfatheredCap=true;}
    eq(node,old,'only agreed Lab cap/endpoint wording changes: '+node.id);
  }
  for(const id of forgeIds){
    const def={cap:20,lumen:id==='arcanecal'?15000:90000,shard:id==='arcanecal'?120:280,growth:160};
    for(let start=0;start<20;start++)for(let count=1;count<=20-start;count++){
      const price=f.cost(id,start,count);
      eq(price,start+count<=10?bf.cost(id,start,count):exactCost(def,start,count),'preserved old quote or exact new curve '+id+' '+start+'/'+count);
      ok(Object.values(price).every(n=>Number.isSafeInteger(n)&&n>0),'finite exactly representable price '+id);
    }
    for(const level of [9,10,11,19,20,21,1000000])for(const request of [1,5,10,25,100,'max']){
      const s=F.seed(f);s.research[id]=level;f.set(s);const prior=F.clone(f.get());
      const remaining=Math.max(0,20-level),count=request==='max'?remaining:request<=remaining?request:0,plan=f.plan(id,request);
      eq(plan.buyCount,count,'approved cap20 bulk count '+id);eq(f.get(),prior,'preview purity');
      eq(f.buy(id,request),count>0,'real manual purchase '+id);
      eq(f.get().research[id],level+count,'actual purchased endpoint');
      eq(f.get().lumen,prior.lumen-plan.cost.lumen,'exact quoted Lumen debit');eq(f.get().shards,prior.shards-plan.cost.shard,'exact quoted Shard debit');
      near(f.effect(id,level).factor,1+(id==='arcanecal'?.03:.04)*Math.min(level,20),'approved cap20 source factor '+id);
      if(count===0)eq(f.get(),prior,'maxed/refused purchase has no mutation');
    }
    const queue=F.seed(f);queue.research[id]=19;queue.researchQueue[id]=true;f.set(queue);
    eq(f.queue(),true,'queue earns final Forge level');eq(f.get().research[id],20,'queue stops at20');
    const endpoint=F.clone(f.get());eq(f.queue(),false,'second queue tick cannot overbuy');eq(f.get(),endpoint,'maxed queue preserves state');
    const huge=F.seed(f);huge.research[id]=19;huge.lumen=huge.shards=1e30;f.set(huge);const before=F.clone(f.get());
    const price=f.cost(id,19,1);eq(f.buy(id,1),true,'large wallet funds a paid cap level');eq(integer(f.get().lumen),BigInt(before.lumen)-BigInt(price.lumen),'large cap Lumen debit');eq(integer(f.get().shards),BigInt(before.shards)-BigInt(price.shard),'large cap Shard debit');eq(f.get().research[id],20,'one paid final level');
  }
  for(const id of labIds){
    const node=l.projects().find(n=>n.id===id);
    for(let level=0;level<20;level++){
      l.set(labSeed());bl.set(legacyInput(labSeed(),bl));
      eq(l.cost(id,level),bl.cost(id,level),'unchanged Lab price curve '+id);
      eq(l.duration(id,level),Math.min(864000,bl.duration(id,level)),'bounded future Lab work curve '+id);
      const expected={lumen:Math.round((id==='bossledger'?14000:25000)*Math.pow(1.55,level)),shard:Math.round((id==='bossledger'?500:800)*Math.pow(1.55,level))};
      eq(l.cost(id,level),expected,'independent new Lab level price');ok(Object.values(expected).every(Number.isSafeInteger),'finite new Lab prices');
      eq(l.duration(id,level),Math.round(Math.min(864000,(id==='bossledger'?720:960)*Math.pow(1.45,level))),'independent bounded new work');
    }
    for(const level of [10,19,20,23]){
      const s=labSeed();s.longStudyLevels[id]=level;s.studyQueue[id]=true;l.set(s);const prior=L.clone(l.get()),plan=l.plan(id);
      eq(plan.maxed,level>=20,'approved Lab cap20 gate');eq(l.start(id),level<20,'real Lab payment gate');
      eq(l.get().longStudyLevels[id],level,'start does not grant a level');
      if(level<20){
        eq(l.get().lumen,prior.lumen-plan.cost.lumen,'exact Lab Lumen debit');eq(l.get().shards,prior.shards-plan.cost.shard,'exact Lab Shard debit');
        eq(l.get().activeStudies[0],{id,slot:0,remainingSec:plan.duration,totalDurationSec:plan.duration,speedMult:1},'paid fixed work snapshot');
        l.finish(plan.duration-.5);eq(l.get().longStudyLevels[id],level,'no early completion');l.finish(.5);eq(l.get().longStudyLevels[id],level+1,'one real completion');
        l.finish(plan.duration);eq(l.get().longStudyLevels[id],level+1,'no double earned level');
      }else eq(l.get(),prior,'maxed start preserves paid state');
    }
    const discounted=labSeed();discounted.longStudyLevels[id]=19;discounted.longStudyLevels.procurement=10;discounted.longStudyLevels.catalysis=10;l.set(discounted);
    bl.set(legacyInput(discounted,bl));eq(l.cost(id,19),bl.cost(id,19),'existing discounts apply to added level');eq(l.speedCost(8),22000,'discount applies to new timed speed price');
  }
  // Retain all pre-existing combined-save fields. Schema5 adds only the
  // explicit Mastery/entitlement fields and the new Masterwork path here.
  function oldFields(s){s=F.clone(s);delete s.farmAutoResume;delete s.schemaVersion;delete s.wispMastery;delete s.recruitmentEntitlements;delete s.canonicalAutomationClock;delete s.pausedStudies;delete s.astralUpgrades;delete s.commandRefund;delete s.studySlotProjects;s.activeStudies.forEach(work=>{delete work.slot;});delete s.research.masterwork;delete s.researchQueue.masterwork;return s;}
  for(const schema of [1,2,3])for(const level of [10,13,20,23]){
    const s=F.seed(f);s.schemaVersion=schema;s.research.charge=28;s.research.focus=37;
    forgeIds.forEach(id=>{s.research[id]=level;s.researchQueue[id]=true;});labIds.forEach(id=>{s.longStudyLevels[id]=level;s.studyQueue[id]=true;s.studyUseMotes[id]=true;s.studySpeedTargets[id]=8;});
    s.longStudyLevels.labcapacity=2;s.activeStudies=[{id:'bossledger',remainingSec:12.5,totalDurationSec:123.75,speedMult:8},{id:'prismstudy',remainingSec:17,totalDurationSec:90,speedMult:3}];
    f.set(s);cf.set(s);const expectedOld=oldFields(cf.get());expectedOld.studyBoosts={};expectedOld.studyBoostHours=l.fresh().studyBoostHours;expectedOld.moteNextAtMs=0;Object.keys(expectedOld.studyUseMotes).forEach(id=>expectedOld.studyUseMotes[id]=false);eq(oldFields(f.get()),expectedOld,'all old combined-save fields retained '+schema+'/'+level);eq(f.get().schemaVersion,6,'current protected schema6');eq(f.get().astralUpgrades,{astralcore:0,astralecho:0,astralconvergence:0},'no free permanent Comet levels');eq(f.get().commandRefund,{policy:'commands-retired-v1',total:0,paid:true},'zero historic command cost settled without a gift');eq(f.get().studySlotProjects,['bossledger','prismstudy',null,null,null],'paid slot associations reconstructed without moving work');eq(f.get().wispMastery,Object.fromEntries(Object.keys(s.spirits).map(id=>[id,0])),'migration creates no free Mastery ranks');for(const id of Object.keys(s.spirits))if(s.spirits[id]>0)eq(f.get().recruitmentEntitlements[id],true,'owned recruit entitlement retained '+id);
    const canonical=F.clone(f.get());f.set(canonical);eq(f.get(),canonical,'idempotent normalization');
    f.save();eq(F.app(html,fx.storage).q.get(),canonical,'actual cold save reload');
    eq(f.accept(f.decode(f.export())),canonical,'backup roundtrip keeps raw progress/paid work');
    const corrupt=new Map(fx.storage);corrupt.set(F.P,'broken JSON');eq(F.app(html,corrupt).q.get(),canonical,'actual corrupt-primary recovery');
  }
  // Real chronological completion and queued Forge spending at the new caps.
  // Online step partitioning, offline authoritative batch and actual catch-up
  // must agree. Echo6 makes currency rates equal; no enemy can be killed here.
  const s=F.seed(f);s.depth=s.enemyDepth=101;s.enemyHp=s.enemyMaxHp=1e30;s.nodes.echo=6;s.autoAscendEnabled=false;
  forgeIds.forEach(id=>{s.research[id]=19;s.researchQueue[id]=true;});
  labIds.forEach(id=>{s.longStudyLevels[id]=19;s.studyQueue[id]=true;});s.longStudyLevels.fieldnotes=3;
  s.activeStudies=labIds.map(id=>({id,remainingSec:1,totalDurationSec:123.75,speedMult:2}));
  const live=F.app(html),offline=F.app(html),catchup=F.app(html);for(const x of [live,offline,catchup])x.q.set(s);
  for(let t=0;t<16;t++){live.clock(F.CLOCK+(t+1)*1000);live.q.advance(1,{kind:'live',visual:false,clockStartMs:F.CLOCK+t*1000});}
  offline.clock(F.CLOCK+16000);offline.q.advance(16,{kind:'offline',visual:false,clockStartMs:F.CLOCK,offlineWindowStartMs:F.CLOCK});
  catchup.clock(F.CLOCK+16000);catchup.q.offline();
  for(const x of [live,offline,catchup]){forgeIds.forEach(id=>eq(x.q.get().research[id],20,'chronological final Forge cap'));labIds.forEach(id=>eq(x.q.get().longStudyLevels[id],20,'chronological final Lab cap'));eq(x.q.get().activeStudies.length,0,'maxed queue does not buy another level');eq(x.q.get().motes,s.motes+12,'two earned Field Notes completions only');}
  for(const key of ['research','researchQueue','longStudyLevels','studyQueue','activeStudies','lumen','shards','motes','sigils','prisms','feedbackMigration','swiftRecoveryRefund']){
    eq(live.q.get()[key],offline.q.get()[key],'online/offline exact endpoint '+key);eq(live.q.get()[key],catchup.q.get()[key],'actual catch-up preserves endpoint '+key);
  }
  // Actual Boss/Luminous kill payouts at levels19/20/raw23; fixed other drops
  // and per-cast resources/chance stay unchanged for this Lab-only comparison.
  for(const level of [10,19,20,23])for(const depth of [19,20,39,40])for(const luminous of [false,true]){
    const s=labSeed();s.depth=s.enemyDepth=depth;s.enemyIsLuminous=luminous;s.longStudyLevels.bossledger=level;s.longStudyLevels.luminousdistill=level;
    l.set(s);const zero=L.clone(s);zero.longStudyLevels.bossledger=zero.longStudyLevels.luminousdistill=0;bl.set(legacyInput(zero,bl));
    const percent=depth%10===0?5*Math.min(level,20):luminous?10*Math.min(level,20):0;
    for(const kind of ['lumen','shards']){const original=bl[kind](depth,luminous);eq(l[kind](depth,luminous),original+Math.round(original*percent/100),'independent conditional kill reward '+kind);}
    eq(l.sigils(depth),bl.sigils(depth),'no Sigil reward change');eq(l.motes(depth),bl.motes(depth),'no Mote reward change');eq(l.chance(depth),bl.chance(depth),'no encounter chance change');
    const prior=L.clone(l.get()),Lprice=l.lumen(depth,luminous),Sprice=l.shards(depth,luminous);l.kill('live');
    eq(l.get().lumen-prior.lumen,Lprice,'real kill Lumen credit');eq(l.get().shards-prior.shards,Sprice,'real kill Shard credit');
  }
  // Extended Luminous earnings must fund the final queued Boss Survey start
  // at the first real kill boundary, including fractional offline currency.
  for(const level of [19,20,23])for(const first of [false,true])for(const echo of [2,6]){
    const s=labSeed();s.depth=s.enemyDepth=s.farmDepth=39;s.riftMode='farm';s.farmReturnDepth=41;s.nodes.echo=echo;
    s.longStudyLevels.bossledger=19;s.longStudyLevels.luminousdistill=level;s.enemyIsLuminous=first;s.luminousAccum=.3;s.studyQueue.bossledger=true;
    s.lumen=s.shards=0;l.set(s);const cost=l.cost('bossledger',19),earned=l.batch(16,'offline'),rate=Math.min(1,.70+.05*echo);
    s.lumen=Math.max(0,cost.lumen-earned.lumenGained);s.shards=Math.max(0,cost.shard-earned.shardGained);l.set(s);
    const predicted=l.boundary(cost,rate);let firstFunded=null;
    for(let count=0;count<=18;count++){l.set(s);l.batch(count,'offline');if(l.plan('bossledger').affordable){firstFunded=count;break;}}
    ok(firstFunded!==null,'finite extended-reward purchase boundary');eq(predicted,firstFunded,'independent actual first-funded kill boundary');
    if(firstFunded){l.set(s);l.batch(firstFunded-1,'offline');eq(l.queue().studiesStarted,0,'one kill earlier cannot spend');}
    l.set(s);l.batch(firstFunded,'offline');eq(l.queue().studiesStarted,1,'actual earliest queued final-level start');
    eq(l.get().activeStudies[0].id,'bossledger','queue paid the intended final project');eq(l.get().longStudyLevels.bossledger,19,'queued work does not award early level20');
  }
  return {checks,sourceSha256:hash(html),baselineRef,baselineSha256:hash(baseline),combinedRef,combinedSha256:hash(combined),selected:{arcanecal:20,conduction:20,bossledger:20,luminousdistill:20}};
}
const result=verify(source),negativeControls=[];
if(process.argv.includes('--negative'))for(const [name,from,to] of [
  ['old-Arcane-cap',"unlockDepth:12, levelCap:20, effectPerLevel:0.03","unlockDepth:12, levelCap:10, effectPerLevel:0.03"],
  ['old-effective-Forge-cap','return node.grandfatheredCap ? level : node.levelCap===undefined ? level : Math.min(level,node.levelCap);','return node.grandfatheredCap ? Math.min(level,10) : node.levelCap===undefined ? level : Math.min(level,10);'],
  ['double-earned-Lab-level','if(earned) state.longStudyLevels[active.id]=level+1;','if(earned) state.longStudyLevels[active.id]=level+2;']
]){
  assert(source.includes(from),'causal mutation anchor '+name);let caught;
  try{verify(source.replace(from,to));}catch(error){assert(error instanceof assert.AssertionError,'causal assertion rather than setup error');caught=error.message;}
  assert(caught,'causal defect must reject '+name);negativeControls.push({name,caught});
}
console.log(JSON.stringify({status:'pass',...result,negativeControls}));
