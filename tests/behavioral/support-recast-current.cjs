'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,CLOCK,clone}=require('./forge-expansion-harness.cjs');
let html=fs.readFileSync(process.argv[2]||'index.html','utf8');
const mutations={
 duration:['durationMs:ultimate ? 1500 : 1000','durationMs:ultimate ? 8000 : 4000'],
 bypass:["return Math.max(0,supportDeadlineSecondsRemaining(until,nowMs,clock));",'return 0;'],
 save:["out.supportRecastUntil[id]=until;",'out.supportRecastUntil[id]=0;'],
 estimate:['recast[i]=u+1;','recast[i]=u;']
};
if(process.env.SUPPORT_RECAST_MUTANT){const pair=mutations[process.env.SUPPORT_RECAST_MUTANT];assert(pair);assert.equal(html.split(pair[0]).length,2);html=html.replace(pair[0],pair[1]);}
let checks=0;const records=[];
const ok=(v,m)=>{checks++;assert(v,m);};
const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);};
function seed(q,level,ultimate){
  const s=q.fresh();s.lastSeen=CLOCK;s.maxDepthEver=250;s.depth=s.enemyDepth=99;
  s.enemyHp=s.enemyMaxHp=1e100;s.activeParty=['tide','aurora','ember','stone','gale'];
  s.research.charge=level;s.research.tapconduit=5;s.research.victorycharge=5;
  s.nodes.echo=6;
  s.research.relay=5;s.research.resonancecascade=5;s.research.amplifiertrim=5;
  s.achieved.autotap=true;s.sigils=1000;s.heroResource.tide=s.heroResource.aurora=100;
  for(const id of s.activeParty){s.spirits[id]=100;s.heroRarity[id]=ultimate?5:0;s.wispUltimate[id]=ultimate;}
  return s;
}
for(const level of [0,5,10])for(const ultimate of [false,true]){
  const x=app(html),q=x.q;
  q.set(seed(q,level,ultimate));
  const cycle=6/(1+.08*level),duration=ultimate?1500:1000;
  const estimate=q.profile(99);
  for(const id of ['tide','aurora'])ok(estimate.rates[id]<=1/cycle+1e-9,'HUD Support rate respects independent capped natural interval');
  q.abilities('offline',CLOCK);
  for(const id of ['tide','aurora']){
    eq(q.supportProfile(id).durationMs,duration,'approved cast duration');
    eq(q.get().supportBuffs.sources[id].until,CLOCK+duration,'actual expiry');
    eq(q.get().supportRecastUntil[id],CLOCK+cycle*1000,'independent natural cycle deadline');
  }
  const initial=clone(q.get());
  // Ready charge and repeated direct/manual calls cannot bypass the interval.
  for(const id of ['tide','aurora'])q.get().heroResource[id]=100;
  const ready=clone(q.get());
  q.abilities('offline',CLOCK+duration);q.cast('tide','offline',CLOCK+duration);
  x.clock(CLOCK+duration);q.manualCast('aurora');
  eq(q.get(),ready,'early scheduled/direct/manual calls preserve every field');
  eq(q.buff(CLOCK+duration),1,'both buffs expire before next cast');
  // Real paid Resonate still gives charge and spends its original cost.
  if(ultimate){
    for(const id of Object.keys(q.get().spirits)){q.get().heroRarity[id]=5;q.get().wispUltimate[id]=true;}
    q.get().heroResource.tide=0;
    const sigils=q.get().sigils;q.resonate('tide');
    eq(q.get().heroResource.tide,100,'Resonate grants charge during cooldown');
    ok(q.get().sigils<sigils,'Resonate retains payment');
  }
  const paid=clone(q.get());q.abilities('offline',CLOCK+duration+1);
  eq(q.get(),paid,'paid charge waits without losing its value');
  q.save();const saved=clone(q.get());q.load();eq(q.get(),saved,'recast history survives cold save/load');
  const backup=q.export();eq(q.decode(backup),saved,'backup/restore decode retains cooldown');
  x.clock(CLOCK+cycle*1000);q.abilities('offline',CLOCK+cycle*1000);
  ok(q.get().supportBuffs.sources.tide.until>=CLOCK+cycle*1000+duration,'ready Support fires at recast endpoint');
  records.push({level,ultimate,cycle,duration});
}
// Adversarial full charge before every tenth-second step, with both Ultimates
// staggered by half a natural cycle. Independent interval-union integration
// proves even this fastest legal pair has downtime.
for(const stagger of [0,5/3]){
 const x=app(html),q=x.q;q.set(seed(q,10,true));q.get().heroResource.aurora=0;
 const casts={tide:[],aurora:[]},until={tide:0,aurora:0};let uptime=0;
 for(let tick=0;tick<600;tick++){
  const at=CLOCK+tick*100;
  q.get().heroResource.tide=100;
  if(tick/10>=stagger)q.get().heroResource.aurora=100;
  q.abilities('offline',at);
  for(const id of ['tide','aurora']){
   const next=q.get().supportRecastUntil[id];
   if(next!==until[id]){casts[id].push(at);until[id]=next;}
  }
  if(q.buff(at)>1)uptime+=.1;
 }
 for(const id of ['tide','aurora'])for(let i=1;i<casts[id].length;i++)ok(casts[id][i]-casts[id][i-1]>=10000/3-1e-4,'each pair cast interval respects exact independent floor');
 ok(uptime<55,'pair downtime exists under unlimited external charge');
 records.push({stagger,uptime,seconds:60,casts});
}
// Real scheduler must compose and give matching live/offline results; no enemy
// deaths in this case, so comparisons cover every save field exactly/tightly.
function closeState(a,b,label){
 if(typeof a==='number'&&typeof b==='number'){ok(Math.abs(a-b)<=Math.max(1e-6,Math.max(Math.abs(a),Math.abs(b))*1e-12),label);return;}
 if(a&&typeof a==='object'){eq(Object.keys(a),Object.keys(b),label+' keys');for(const k of Object.keys(a))closeState(a[k],b[k],label+'.'+k);return;}
 eq(a,b,label);
}
for(const level of [0,10]){
 const a=app(html),b=app(html),c=app(html),s=seed(a.q,level,true);
 a.q.set(s);b.q.set(s);c.q.set(s);
 a.q.advance(60,{kind:'offline',visual:false,clockStartMs:CLOCK});
 b.q.advance(60,{kind:'live',visual:false,clockStartMs:CLOCK});
 for(let i=0;i<60;i++)c.q.advance(1,{kind:'offline',visual:false,clockStartMs:CLOCK+i*1000,offlineWindowStartMs:CLOCK});
 closeState(a.q.get(),b.q.get(),'live/offline');closeState(a.q.get(),c.q.get(),'whole/split');
}
const x=app(html),q=x.q,legacy=seed(q,10,true);delete legacy.supportRecastUntil;
legacy.supportBuffs={version:1,sources:{tide:{until:CLOCK+8000,mult:1.5}}};q.set(legacy);
eq(q.get().supportRecastUntil,{tide:0,aurora:0},'legacy starts without invented cooldown');
eq(q.get().supportBuffs.sources.tide,legacy.supportBuffs.sources.tide,'already-earned legacy buff retained');
for(const bad of [null,[],{tide:-1,aurora:0},{tide:Infinity,aurora:0}]){
 const invalid=clone(q.get());invalid.supportRecastUntil=bad;checks++;assert.throws(()=>q.accept(invalid),{code:'invalid-support-recast'});
}
const controls=[];
if(process.argv.includes('--negative'))for(const id of Object.keys(mutations)){
 const r=require('node:child_process').spawnSync(process.execPath,[__filename,process.argv[2]||'index.html'],{encoding:'utf8',env:{...process.env,SUPPORT_RECAST_MUTANT:id}});
 assert(!r.error);assert.equal(r.status,1);assert(r.stderr.includes('AssertionError'),'actual assertion failure '+id);controls.push(id);
}
console.log(JSON.stringify({status:'PASS',checks,records,controls,sourceSha256:crypto.createHash('sha256').update(html).digest('hex')}));
