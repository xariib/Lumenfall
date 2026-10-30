'use strict';
// Whole production game, earned resources and real purchases/combat/storage.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const F=require('./forge-expansion-harness.cjs');
const file=process.argv[2]||'index.html',original=fs.readFileSync(file,'utf8');
const marker='return Amount.add(20,Amount.mul(effectivePartyPower(),0.02));';
let html=original,checks=0;
const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);};
const ok=(v,m)=>{checks++;assert(v,m);};
const near=(a,b,m)=>ok(Math.abs(a-b)<=Math.max(1,Math.abs(b))*1e-10,m);
eq(html.split(marker).length,2,'single authoritative opening formula');
const prior=html.replace(marker,'return Amount.add(5,Amount.mul(effectivePartyPower(),0.02));');
const studyGap='canonicalAutomationAnchors={}; // Study-only gaps do not advance combat timers.';
const ledgerBase='baseTap=Amount.mul(20,tapFactor)';
const mutants={weak:'return Amount.add(5,Amount.mul(effectivePartyPower(),0.02));',dominant:'return Amount.add(20,Amount.mul(effectivePartyPower(),0.50));',clock:'if(clock&&clock.binary?clock.binary.compareMs(state.moteNextAtMs)>0:nowMs<state.moteNextAtMs)return 0;',pause:'void 0; // Study-only gaps do not advance combat timers.',ledger:'baseTap=Amount.mul(5,tapFactor)'};
if(process.env.TAP_BALANCE_MUTANT){const id=process.env.TAP_BALANCE_MUTANT;assert(mutants[id]);html=html.replace(id==='clock'?'if(nowMs<state.moteNextAtMs)return 0;':id==='pause'?studyGap:id==='ledger'?ledgerBase:marker,mutants[id]);}
function game(source=html,saved){return F.app(source,saved,{clockDate:true,retainWrites:false});}
function encounter(q,depth=1){const s=q.fresh();s.depth=s.maxDepthEver=depth;s.lastSeen=F.CLOCK;s.questDay=q.day();q.set(s);q.restoreEnemy();}
function tapsToFirstKill(source){const {q}=game(source);encounter(q);let taps=0;while(!q.get().totalKills&&taps<30){q.manualTap();taps++;}return {taps,depth:q.get().depth};}
const opening={before:tapsToFirstKill(prior),after:tapsToFirstKill(html)};
eq(opening.before.taps,14,'historical opening takes fourteen taps');
eq(opening.after.taps,4,'opening clears in four taps');eq(opening.after.depth,2,'real tap kill advances to Rift2');
const {q}=game();encounter(q);near(q.tap(),20.02,'fresh uninvested tap');eq(q.enemyHp(1),69,'first enemy remains unchanged');

{
 const observed=html.replace("if(document.readyState==='loading'){",`window.endlessQa={roles:wispRoleComparison};if(document.readyState==='loading'){`);
 const r=game(observed).q,s=r.fresh();s.achieved.autotap=true;r.set(s);
 const ledger=r.endless.roles(1,F.CLOCK).steady;
 eq(ledger.guardianBaseDps,20,'damage readout uses the stronger flat Guardian base');
 near(ledger.totalDps,r.dps(1),'displayed total agrees with authoritative combat estimate');
}

// An exact internal clock can be slightly behind its rounded epoch timestamp.
// Discrete and batched defeats must use the same saved millisecond deadline.
{
 const observed=html.replace("if(document.readyState==='loading'){",`window.endlessQa={clock:function(t,n){return createBinarySimulationClock(Amount,t,n);},payout:luminousMotePayout};if(document.readyState==='loading'){`);
 const r=game(observed).q,s=r.fresh();s.depth=s.maxDepthEver=79;s.motes=0;s.moteNextAtMs=F.CLOCK+1000;r.set(s);
 const clock=r.endless.clock(F.CLOCK,100),reward=r.motes(79);
 clock.advance(.999);eq(r.endless.payout(clock.nowMs(),{binary:clock}),0,'no payout before represented deadline');
 clock.advance(.00099999);eq(clock.nowMs(),F.CLOCK+1000,'rounded epoch reaches saved deadline');
 ok(clock.compareMs(F.CLOCK+1000)>0,'actual fractional-clock reproducer straddles rounding boundary');
 eq(r.endless.payout(clock.nowMs(),{binary:clock}),reward,'discrete payout matches batched millisecond eligibility');
 eq(r.endless.payout(clock.nowMs(),{binary:clock}),0,'same instant cannot pay twice');
 clock.advance(59.999);eq(r.endless.payout(clock.nowMs(),{binary:clock}),0,'full sixty-second interval remains required');
 clock.advance(.001);eq(r.endless.payout(clock.nowMs(),{binary:clock}),reward,'next exact represented interval pays once');
}

// Research continues beyond the combat cap. Resume combat from its saved phase,
// rebuilding the transient exact-clock cache after a Lab-only wall-clock gap.
{
 const observed=html.replace("if(document.readyState==='loading'){",`window.endlessQa={study:function(t,at){return advanceStudyOnlyTime(t,at,simulationSummary(t));}};if(document.readyState==='loading'){`);
 const r=game(observed).q,s=r.fresh();s.depth=s.enemyDepth=1;s.enemyHp=s.enemyMaxHp=1e12;
 s.research.charge=10;s.achieved.autotap=true;r.set(s);
 r.advance(.123,{kind:'live',clockStartMs:F.CLOCK});const phase=r.get()._autoTapAccum,basis=F.clone(r.get().canonicalAutomationClock);
 r.endless.study(216000,F.CLOCK+123);
 eq(r.get()._autoTapAccum,phase,'sixty hours of research add no combat timer progress');
 eq(r.get().canonicalAutomationClock,basis,'research gap retains exact saved timer basis');
 checks++;assert.doesNotThrow(()=>r.advance(.877,{kind:'live',clockStartMs:F.CLOCK+216000123}),'combat resumes from retained phase after research-only gap');
 eq(r.get().totalTaps,1,'resume earns only the next due Auto-Tap');near(r.get()._autoTapAccum,0,'resume ends at one earned combat second');
}

// A developed early party already owns most damage at a sustainable input rate.
const shares=[];
for(const levels of [[25,10,5],[50,25,10],[100,50,25]]){
 const s=q.fresh();s.depth=11;s.maxDepthEver=30;s.activeParty=['ember','tide','stone'];
 s.activeParty.forEach((id,i)=>{s.spirits[id]=levels[i];});q.set(s);
 const passive=q.passive(11),tap=q.tapAt(11,1,0),share=3*tap/(passive+3*tap);
 ok(share<1/3,'Wisps own over two thirds of passive-plus-three-taps DPS '+levels);
 shares.push({levels,passive,tap,manualShareAtThreeTaps:share});
}
ok(shares[2].manualShareAtThreeTaps<.08,'late taps retain a small uninvested share');

// Existing paid multipliers still work on manual and automatic hits, including
// Mark bosses and every fifth lifetime tap; no alternate damage formula.
for(const route of ['manual','live','offline']){
 const x=game(),r=x.q,s=r.fresh();s.depth=s.enemyDepth=30;s.maxDepthEver=100;
 s.enemyHp=s.enemyMaxHp=1e8;s.nodes.steady=1;s.research.resolve=1;
 s.longStudyLevels.guardmastery=1;s.research.guardianseal=5;s.research.guardiancadence=5;
 s.totalTaps=4;s.achieved.autotap=true;s._autoTapAccum=1000;r.set(s);
 const expected=20.02*1.08*1.10*1.20*3.5*1.5;
 near(r.tapAt(30,1,5),expected,'independent purchased tap stack '+route);
 near(r.tapAt(30,1.25,5),expected*1.25,'Support applies to full hit '+route);
 const observed=[],undo=r.observeCalibration(e=>{if(e.type==='damage'&&e.source==='autoTap')observed.push(e.amount);});
 const hp=r.get().enemyHp;
 if(route==='manual')r.manualTap();else{const result=r.advance(0,{kind:route,clockStartMs:F.CLOCK});eq(result.autoTaps,1,'one due Auto-Tap '+route);}
 undo();near(hp-r.get().enemyHp,expected,'actual purchased hit '+route);eq(r.get().totalTaps,5,'shared lifetime ordinal '+route);
 if(route!=='manual')near(observed[0],expected,'authoritative Auto-Tap amount '+route);
}
// No progression-dependent taper or reset; two storage slots and backups retain
// paid work, wallet, upgrades and current encounter exactly.
{
 const x=game(),r=x.q,s=F.seed(r);s.nodes.steady=7;s.research.resolve=9;
 s.activeStudies=[{id:'guardmastery',remainingSec:60,totalDurationSec:150,speedMult:1}];
 r.set(s);const paid=F.clone(r.get());ok(r.save(),'save existing progress');
 const cold=game(html,x.storage);eq(cold.q.get(),paid,'cold load retains every saved field');
 eq(r.accept(r.decode(r.export())),paid,'backup retains every saved field');
 const broken=new Map(x.storage);broken.set(F.P,'broken');eq(game(html,broken).q.get(),paid,'recovery retains every saved field');
 const old=game(prior);old.q.set(paid);near(r.tap()-old.q.tap(),15*1.56*1.9,'only flat damage changes with retained investment');
}

// Same three-taps/second policy, real earnings, cheapest affordable early Wisp
// purchase each second. No gifted wallet, fake unlocks or changed enemy HP.
function campaign(source){
 const x=game(source),r=x.q;encounter(r);let purchases=0,rift3=null,rift10=null;
 for(let tick=0;tick<540;tick++){
  const start=F.CLOCK+tick*1000/3;x.clock(start);
  r.advance(1/3,{kind:'live',clockStartMs:start});x.clock(F.CLOCK+(tick+1)*1000/3);r.manualTap();
  if(tick%3===2){
   const options=['ember','tide','stone'].filter(id=>r.get().spirits[id]>0||r.get().maxDepthEver>=r.sp(id).unlockDepth).sort((a,b)=>r.empowerCost(a)-r.empowerCost(b));
   for(const id of options)if(r.empower(id)){purchases++;break;}
  }
  if(r.get().maxDepthEver>=3&&rift3===null)rift3=(tick+1)/3;
  if(r.get().maxDepthEver>=10&&rift10===null)rift10=(tick+1)/3;
 }
 return {seconds:180,rift3,rift10,depth:r.get().depth,record:r.get().maxDepthEver,kills:r.get().totalKills,purchases,spirits:r.get().spirits};
}
const campaigns={before:campaign(prior),after:campaign(html)};
ok(campaigns.after.rift3<campaigns.before.rift3,'same earned-resource policy reaches first recruit faster');
ok(campaigns.after.rift10!==null&&campaigns.after.rift10<campaigns.before.rift10,'same policy reaches first boss faster');
ok(campaigns.after.purchases>0,'progress uses actual paid Wisp purchases');
const controls=[];
if(process.argv.includes('--negative'))for(const id of Object.keys(mutants)){
 const child=require('node:child_process').spawnSync(process.execPath,[__filename,file],{encoding:'utf8',env:{...process.env,TAP_BALANCE_MUTANT:id},timeout:120000});
 ok(!child.error&&child.status===1&&child.stderr.includes('AssertionError'),'reject causal control '+id);controls.push(id);
}
console.log(JSON.stringify({status:'pass',checks,opening,shares,campaigns,controls,sourceSha256:crypto.createHash('sha256').update(original).digest('hex')},null,2));
