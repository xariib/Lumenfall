'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),build=require('./endless-cycle-source.cjs'),{app,clone}=require('./forge-expansion-harness.cjs');
let source=require('./frozen-cycle-power.cjs')(build(fs.readFileSync('index.html','utf8')));const earned=JSON.parse(fs.readFileSync('docs/qa/endless-progression-001/candidate-ak-mature-snapshot.json.endpoint.json','utf8'));
const mutation=process.env.LUMENFALL_CYCLE_MUTATION||null;
function replace(a,b){assert.equal(source.split(a).length,2,'causal mutation anchor');source=source.replace(a,b);}
if(mutation==='mote')replace('var mote=clock.latticeUntil(state.moteNextAtMs);if(Amount.le(mote.ticks,0))blocked=true;else consider(mote);','var mote=null;');
else if(mutation==='lab')replace('state.activeStudies.forEach(function(active){var left=paidDeadline(active);if(!left||Amount.le(left.ticks,0))blocked=true;else consider(left);});','');
else if(mutation==='recast')replace("state.activeParty.forEach(function(id){var sp=SPIRITS.find(function(s){return s.id===id;});if(sp.abilityType!=='support')return;var until=state.supportRecastUntil[id]||0,d=clock.latticeUntil(until,cycleRecastThreshold);if(Amount.gt(d.ticks,0))consider(d);});",'');
else if(mutation==='buff'){replace('deadline(state.buffUntil);','');replace('if(state.supportBuffs)Object.keys(state.supportBuffs.sources).forEach(function(id){deadline(state.supportBuffs.sources[id].until);});','');}
else if(mutation==='economy')replace('var count=cycleEconomyBound(Amount,maximum,plan.maxLumen,shardsAvailable(),plan.maxShard,queuedPrices()).cycles;','var count=maximum;');
else if(mutation==='phase')replace('value=cycleNativePhase(Amount,phasePrograms,pieces.q,value,999.999).value;','value=value;');
else if(mutation==='receipt')replace('summary.ascends=A.exactAdd(summary.ascends,count);','summary.ascends=A.exactAdd(summary.ascends,A.gt(count,1)?A.exactSub(count,1):count);');
else if(mutation==='lumen')replace('state.lumen=lumen.lumen;','state.lumen=0;');
else assert.equal(mutation,null,'known mutation');
let checks=0,current,records=[];function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}function ok(a,m){checks++;assert(a,m);}
function base(){const s=clone(earned);s.depth=s.enemyDepth=16;s.riftMode='push';s.autoAscendEnabled=true;s.autoAscendTargetDepth=16;s.moteNextAtMs=60000;s.supportBuffs={version:1,sources:{tide:{until:1000,mult:1.55},aurora:{until:1000,mult:1.55}}};s.supportRecastUntil={tide:1000,aurora:1000};return s;}
function compare(name,s,seconds,witness){
 if(process.env.LUMENFALL_CYCLE_CASE&&process.env.LUMENFALL_CYCLE_CASE!==name)return;
 current=name;const a=app(source),b=app(source);for(const x of [a,b]){x.clock(0);x.q.set(clone(s));x.q.restoreEnemy();}
 const fast=a.q.advance(seconds,{kind:'offline',clockStartMs:0}),literal=b.q.advance(seconds,{kind:'offline',clockStartMs:0,disableCycleBatching:true});
 eq(a.q.get(),b.q.get(),name+' exact chronological saved endpoint');for(const key of Object.keys(literal))if(!['iterations','fastForwardedKills','ascendGains'].includes(key))eq(fast[key],literal[key],name+' exact summary '+key);
 ok(fast.fastForwardedKills>0,name+' actually uses a recurring-cycle batch');witness(a.q,fast);records.push({name,seconds,iterations:fast.iterations,literalIterations:literal.iterations,ascends:fast.ascends});
}
try{
 let s=base();s.supportBuffs.sources.tide.until=2e-14;compare('Support expiry',s,1e-16,q=>eq(q.get().supportBuffs.sources.tide,undefined,'expired source removed by its real owner'));
 s=base();s.supportRecastUntil.tide=1e-6+5e-14;compare('Support recast EPS boundary',s,1e-16,q=>ok(q.get().supportRecastUntil.tide>1,'real recast occurs after the native threshold'));
 s=base();s.moteNextAtMs=5e-14;compare('fixed Mote payout boundary',s,1e-16,q=>ok(q.get().moteNextAtMs>=60000,'real eligible Luminous defeat starts the cooldown'));
 s=base();s.activeStudies=[{id:'wispascend',remainingSec:1e-9+5e-17,totalDurationSec:1,speedMult:1}];compare('paid Lab completion EPS boundary',s,1e-16,(q,r)=>{eq(q.get().longStudyLevels.wispascend,s.longStudyLevels.wispascend+1,'paid project completes once and changes combat Power');eq(r.completedStudies.length,1,'one actual completion receipt');});
 const q=app(source).q;s=q.fresh();s.depth=s.enemyDepth=16;s.maxDepthEver=10000;s.owned.autoascend=true;s.autoAscendEnabled=true;s.autoAscendTargetDepth=16;s.research.masterwork=160;s.research.victorycharge=10;s.research.arcanecal=9;s.researchQueue.arcanecal=true;s.longStudyLevels.lumenstudy=100000;s.nodes.riftstep=s.nodes.veteranrecruits=s.nodes.chargememory=s.nodes.rosterrecall=5;s.nodes.phasememory=1;s.nodes.echo=6;
 s.activeParty=['ember','stone'];s.formationRebuild={members:s.activeParty.slice(),preset:'push'};s.activeFormationPreset='push';s.formationPresets.push=s.activeParty.slice();s.heroRarity.ember=s.heroRarity.stone=5;s.wispModules.ember=s.wispModules.stone=20;s.wispUltimate.ember=s.wispUltimate.stone=true;s.spirits.ember=s.spirits.stone=6;s.moteNextAtMs=60000;
 compare('queued Forge affordability',s,2e-13,q=>ok(q.get().research.arcanecal>9,'the literal paid queue actually purchases across the boundary'));
 console.log(JSON.stringify({status:process.env.LUMENFALL_CYCLE_CASE?'PASS_FILTERED':'PASS',mutation,filter:process.env.LUMENFALL_CYCLE_CASE||null,checks,records,sourceSha256:crypto.createHash('sha256').update(source).digest('hex')}));
}catch(error){console.log(JSON.stringify({status:'FAIL',checks,current,records,error:error.stack,sourceSha256:crypto.createHash('sha256').update(source).digest('hex')}));process.exitCode=1;}
