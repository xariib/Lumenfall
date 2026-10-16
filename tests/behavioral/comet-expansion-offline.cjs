'use strict';
// Real scheduler, real saved offline transaction and original kill owners.
// BigInt below is an independent bounded-bank test oracle; neither the shared
// ES2017 harness nor the executed production IIFE imports it.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {app,clone,P,R,CLOCK}=require('./comet-expansion-harness.cjs');
const {fixture,ownedFixture,snapshot,commandOnlyFields}=require('./comet-expansion-core.cjs');
const {NEW_DEEDS,replaceOne,replaceFunction}=require('./comet-expansion-numerical.cjs');
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const RATE=[20,25,32,40];
const COUNTS=['kills','bossKills','luminousKills','ascends','autoTaps','empowers','researchBought','studiesStarted','studySpeedPurchases'];

function farmFixture(q,rank=0,history=true){
  const s=fixture(q);s.owned.meteor=true;s.owned.starcall=true;
  s.cometUpgrades={cometreservoir:2,cometcycle:rank,meteorcore:4};s.cometCharges=0;s.cometWork=3970;
  s.riftMode='farm';s.farmDepth=s.depth=s.enemyDepth=9;s.farmReturnDepth=11;
  s.enemyHp=s.enemyMaxHp=q.enemyHp(9);s.luminousAccum=.375;
  s.spirits.ember=60;s.spirits.tide=10;s.activeParty=['ember','tide'];s.heroResource.ember=31;s.heroResource.tide=47;
  s._autoTapAccum=125;s._autoEmpowerAccum=375;
  s.longStudyLevels.luminousdistill=3;s.longStudyLevels.motestudy=2;
  s.research.tapconduit=2;s.research.endpassrelay=2;s.research.amplifiertrim=2;
  if(history){s.cometEvents={firstCommand:true,firstRecharge:true,bossStrike:true,calledKill:true};for(const [id]of NEW_DEEDS)s.achieved[id]=true;}
  return s;
}
function bankAfter(charges,work,count,rank,cap,owned=true){
  if(!owned||count<1||charges>=cap)return {charges,work};
  const total=BigInt(work)+BigInt(count)*BigInt(RATE[rank]),earned=total/4000n;
  if(BigInt(charges)+earned>=BigInt(cap))return {charges:cap,work:0};
  return {charges:charges+Number(earned),work:Number(total%4000n)};
}
function fieldState(s){const copy=clone(s);delete copy.cometUpgrades;delete copy.cometCharges;delete copy.cometWork;return copy;}

function runOffline(source,options={}){
  const report={status:'RUNNING',checks:0,groups:[],runs:[],witnesses:[],negativeControls:[]};
  if(options.progress)options.progress(report);
  const eq=(a,b,label)=>{assert.deepEqual(a,b,label);report.checks++;};
  const ok=(value,label)=>{assert(value,label);report.checks++;};
  function group(name,fn){report.currentGroup=name;const before=report.checks;fn();report.groups.push({name,status:'PASS',checks:report.checks-before});}
  function observeBank(q,rank,cap){
    const result={calls:0,kills:0,calledDefeats:0,first:[],last:null},stack=[];
    const undo=q.observe('cometRecordDefeats',event=>{
      if(event.phase==='before'){
        const s=event.state;stack.push({charges:s.cometCharges,work:s.cometWork,recharge:s.cometEvents.firstRecharge,called:s.cometEvents.calledKill,ownsCall:s.owned.starcall,owned:s.owned.meteor||s.owned.starcall,count:event.args[0],marked:!!event.args[1]});return;
      }
      const before=stack.pop(),s=event.state;ok(!event.error,'real defeat accounting owner has no runtime error');
      ok(Number.isInteger(before.count)&&before.count>0,'actual defeat owner supplies a positive integer count');
      const expected=bankAfter(before.charges,before.work,before.count,rank,cap,before.owned);
      eq({charges:s.cometCharges,work:s.cometWork},expected,'independent BigInt bank agrees at every original defeat owner');
      eq(s.cometEvents.firstRecharge,before.recharge||expected.charges>before.charges,'firstRecharge records actual gained charge only');
      eq(s.cometEvents.calledKill,before.called||(before.marked&&before.ownsCall),'called fact comes from the actual marked defeat');
      const row={count:before.count,marked:before.marked,before:{charges:before.charges,work:before.work},after:expected};
      if(result.first.length<4)result.first.push(row);result.last=row;result.calls++;result.kills+=before.count;if(before.marked)result.calledDefeats++;
    });
    return {result,undo};
  }
  function scheduled(text,initial,config){
    const e=app(text),q=e.q;q.set(initial);const before=clone(q.get()),rank=initial.cometUpgrades.cometcycle,cap=1+initial.cometUpgrades.cometreservoir;
    const bank=observeBank(q,rank,cap),total=Object.fromEntries(COUNTS.map(key=>[key,0]));
    let at=0,yields=0,firstYield=null,lastYield=null;const timeline=[];
    try{
      for(const span of config.spans){
        let part=q.advance(span,{kind:config.kind,clockStartMs:CLOCK+at*1000,offlineWindowStartMs:CLOCK,resumable:!!config.cursor,captureTimeline:!!config.timeline});
        if(config.cursor){let step;do{step=part.next();if(!step.done){ok(++yields<10000,'bounded real cursor yields');if(firstYield===null)firstYield=at+step.value.elapsedSec;lastYield=at+step.value.elapsedSec;}}while(!step.done);part=step.value;}
        COUNTS.forEach(key=>{total[key]+=part[key];});
        (part.timeline||[]).forEach(row=>{timeline.push({elapsedSec:at+row.elapsedSec,type:row.type,detail:row.detail});});
        at+=span;
      }
    }finally{bank.undo();}
    eq(total.kills,bank.result.kills,'every scheduled kill has exactly one original Comet accounting owner');
    const expectedBank=bankAfter(before.cometCharges,before.cometWork,bank.result.kills,rank,cap,before.owned.meteor||before.owned.starcall);
    eq({charges:q.get().cometCharges,work:q.get().cometWork},expectedBank,'independent cumulative bank at the exact real-kill count');
    if(config.requireSaturation!==false){eq(q.get().cometCharges,q.capacity(),'productive fixed world reaches its finite bank cap');eq(q.get().cometWork,0,'full bank has no deferred excess work');}
    else ok(total.kills>0,'short timing trace includes real productive defeats');
    eq(q.get().comets,before.comets,'previously earned identities cannot pay again during scheduled combat');
    for(const key of ['owned','cometUpgrades','nodes','research','longStudyLevels','studyQueue','autoAscendEnabled','autoAscendTargetDepth'])eq(q.get()[key],before[key],'fixed world retains '+key);
    const state=clone(q.get());
    const receipt={id:config.id,kind:config.kind,seconds:at,spans:config.spans,yields,firstYield,lastYield,counts:total,bank:bank.result,stateSha256:sha(JSON.stringify(state)),timelineSha256:sha(JSON.stringify(timeline)),sourceSha256:sha(text)};
    report.runs.push(receipt);return {state,counts:total,timeline,receipt};
  }
  group('fixed-world live/offline, split and cursor chronology with every real kill owner',()=>{
    // Exact persisted-byte preservation at whole-grid caller cuts, retaining
    // the fractional total endpoint and actual resumable cursor yields. F18's
    // shorter expiry introduces an extra event inside the former13.125s cut.
    const q=app(source).q,seconds=600.125,spans=[13,187,200,200.125];
    for(const kind of ['live','offline']){
      const start=farmFixture(q,0),full=scheduled(source,start,{id:kind+'-unsplit',kind,spans:[seconds]});
      const split=scheduled(source,start,{id:kind+'-split-cursor',kind,spans,cursor:true});
      eq(split.state,full.state,'same-kind split cursor retains every persisted endpoint byte '+kind);eq(split.counts,full.counts,'same-kind split keeps every gameplay count '+kind);ok(split.receipt.yields>0,'real split cursor crosses default256-event yields');
      const upgraded=clone(start);upgraded.cometUpgrades.cometcycle=3;
      const max=scheduled(source,upgraded,{id:kind+'-engine3-same-world',kind,spans:[seconds]});
      eq(fieldState(max.state),fieldState(full.state),'Engine/Reserve/Core do not alter combat, economy or elapsed state '+kind);eq(max.counts,full.counts,'Engine changes only work per actual defeat '+kind);
    }
    // A bounded short trace compares actual event identities and epochs. The
    // long runs above retain counters/endpoints without hitting the inherited
    // diagnostic timeline's deliberate 2,000-row bound. The short trace need
    // not saturate both banks; the long runs above still require saturation.
    const start=farmFixture(q,0),rank3=clone(start);rank3.cometUpgrades.cometcycle=3;
    const low=scheduled(source,start,{id:'timeline-engine0',kind:'live',spans:[180],timeline:true,requireSaturation:false});
    const high=scheduled(source,rank3,{id:'timeline-engine3',kind:'live',spans:[180],timeline:true,requireSaturation:false});
    eq(high.timeline,low.timeline,'new manual-command ranks add no scheduler event or timing boundary');
    report.witnesses.push({id:'identical-original-event-timeline',rows:low.timeline.length,sha256:sha(JSON.stringify(low.timeline)),first:low.timeline.slice(0,5),last:low.timeline.slice(-5)});
  });
  function silentCase(text,callback=false,initialCharges=0){
    const e=app(text),q=e.q,s=ownedFixture(q);s.enemyHp=s.enemyMaxHp=1e100;s.cometUpgrades.cometreservoir=2;s.cometCharges=initialCharges;s.cometWork=initialCharges===3?0:1234;
    s.cometEvents.firstCommand=true;s.achieved.comet_first_command=true;s.cometMeteorUsed=true;q.set(s);q.save(CLOCK);const before=clone(q.get());
    let result,error,callbacks=0;if(callback){e.clock(CLOCK+60000);q.offline((r,err)=>{result=r;error=err;callbacks++;});e.drain();assert.ifError(error);assert.equal(callbacks,1);}else result=q.advance(60,{kind:'live',clockStartMs:CLOCK});
    assert.equal(result.kills,0,'silent witness has no actual defeat');assert.equal(q.get().cometCharges,before.cometCharges,'elapsed time must not spend or refill command charges');assert.equal(q.get().cometWork,before.cometWork,'elapsed time alone must not earn work');assert.equal(q.get().cometMeteorUsed,true,'no actual spawn means the saved Meteor marker stays used');
    assert.equal(q.get().cometEvents.firstRecharge,false,'no defeat means no invented recharge fact');return {callback,callbacks,kills:result.kills,bank:commandOnlyFields(q.get())};
  }
  group('elapsed time is neither a command nor a defeat',()=>{
    for(const callback of [false,true])for(const charges of [0,3]){const row=silentCase(source,callback,charges);report.witnesses.push(Object.assign({id:'silent-elapsed'},row));report.checks+=5;}
  });
  function calledInitial(text,wallet=1e30){
    const e=app(text),q=e.q,s=farmFixture(q,2,false);s.comets=wallet;s.cometCharges=1;q.set(s);
    const before=clone(q.get());eq(q.command('starcall'),true,'real paid Call immediately before the saved absence');
    eq(q.get().enemyHp,before.enemyHp,'Call preserves current HP');eq(q.get().luminousAccum,before.luminousAccum,'Call preserves Luminous phase');
    eq(q.get().cometCalled,true,'real Call marker committed');eq(q.get().cometCharges,0,'Call spends exactly one existing charge');
    eq(q.get().cometEvents.calledKill,false,'Call purchase is not a defeat');
    return {state:clone(q.get()),slots:Array.from(e.storage)};
  }
  function savedWindow(text,initial,config){
    const e=app(text,initial.slots),q=e.q;q.restoreEnemy();eq(q.get().cometCalled,true,'actual cold ratio restore retains the called enemy');
    const before=clone(q.get()),slots=Array.from(e.storage),attempts=e.attempts.length,bank=observeBank(q,2,3);
    e.clock(CLOCK+600000);e.fail(config.fault==='primary',config.fault==='recovery');
    let result,error,callbacks=0;
    const done=(r,err)=>{result=r;error=err;callbacks++;};q.offline(done);
    ok(e.pending()>0,'actual offline transaction yields before completion');eq(q.get(),before,'yielded offline state is private');eq(Array.from(e.storage),slots,'yielded offline slots are byte-identical');eq(e.attempts.length,attempts,'no intermediate storage attempt');
    const closed=snapshot(e);eq(q.command('starcall'),false,'real command cannot spend while offline transaction owns state');eq(q.buy('cometreservoir'),false,'real shop cannot spend while offline transaction owns state');eq(q.get(),closed.state,'blocked input leaves private transaction alone');eq(Array.from(e.storage),closed.slots,'blocked input makes no save');
    let yields=e.drain(10000);bank.undo();eq(callbacks,1,'original completion callback fires once per attempt');eq(bank.result.calledDefeats,1,'saved called marker reaches exactly one actual defeat per attempt');
    const first={callbacks,error:error?{name:error.name,message:error.message}:null,bank:bank.result,yields};
    if(config.fault==='primary'){
      ok(error,'failed primary offline window reports a commit error');eq(result,null,'failed window publishes no successful summary');eq(q.get(),before,'failed offline window restores every state field including bank/claims/marker');eq(Array.from(e.storage),slots,'failed primary keeps both raw slots');
      e.fail(false,false);const retryBank=observeBank(q,2,3);q.offline(done);yields+=e.drain(10000);retryBank.undo();eq(callbacks,2,'one successful retry has one additional callback');eq(result.kills,retryBank.result.kills,'retry counts its own actual defeats once');eq(retryBank.result.calledDefeats,1,'retry consumes the original restored called enemy exactly once');
    }else eq(result.kills,bank.result.kills,'committed summary equals original defeat-owner total');
    ok(!error,'known successful primary owns the completed window');eq(q.get().cometCharges,3,'actual offline kills fill finite bank');eq(q.get().cometWork,0,'offline saturation keeps no excess work');eq(q.get().cometCalled,false,'first offline defeat consumes the saved called marker');eq(q.get().cometEvents.calledKill,true,'actual offline called defeat earns the sticky fact');eq(q.get().cometEvents.firstRecharge,true,'actual offline earned charges mark firstRecharge');
    eq(q.get().totalOfflineSeconds-before.totalOfflineSeconds,600,'one exact productive absence');eq(q.get().lastSeen,CLOCK+600000,'lastSeen advances only with accepted whole window');
    eq(q.get().comets,1e30,'huge wallet loses no unpaid Comet award');eq(q.get().cometClaims.deeds,{comet_first_command:true,comet_first_recharge:true,comet_called_kill:true},'three different unrepresentable event rewards stay pending once');
    eq(e.attempts.slice(attempts).filter(a=>a.key===P&&a.success).length,1,'one successful primary commit across any retry');eq(JSON.parse(e.storage.get(P)),q.get(),'primary bytes own current complete state');
    if(config.fault==='recovery')eq(e.storage.get(R),slots.find(row=>row[0]===R)[1],'recovery-only failure preserves older recovery bytes');
    const accepted=clone(q.get());eq(q.offline(),null,'accepted absence cannot repeat');eq(q.get(),accepted,'repeat return adds no charge, reward or time');eq(app(text,Array.from(e.storage)).q.get(),accepted,'cold accepted primary reload preserves pending identities');
    const receipt={id:config.id,sourceSha256:sha(text),fault:config.fault,callbacks,yields,firstAttempt:first,result,stateSha256:sha(JSON.stringify(accepted)),primarySha256:sha(e.storage.get(P)),claims:accepted.cometClaims};
    report.runs.push(receipt);return {state:accepted,receipt};
  }
  group('saved Call, private offline work, primary rollback/retry and recovery-only commit',()=>{
    const initial=calledInitial(source),clean=savedWindow(source,initial,{id:'saved-called-clean',fault:'none'});
    for(const fault of ['primary','recovery']){const run=savedWindow(source,initial,{id:'saved-called-'+fault,fault});eq(run.state,clean.state,'failed-save route reaches byte-identical clean endpoint '+fault);}
    const narrow=replaceOne(source,'var SIM_BATCH_EVENTS = 256;','var SIM_BATCH_EVENTS = 31;'),small=savedWindow(narrow,initial,{id:'saved-called-batch31',fault:'none'});
    eq(small.state,clean.state,'actual31/256-event offline batches produce identical saved bytes');ok(small.receipt.yields>clean.receipt.yields,'31-event runtime really yields more often');
  });
  function ascending(text,fault='none'){
    const e=app(text),q=e.q,s=ownedFixture(q,'meteor',15);s.owned.starcall=true;s.owned.autoascend=true;s.autoAscendEnabled=true;s.autoAscendTargetDepth=16;s.ascendCount=1e30;
    s.enemyHp=1;s.cometUpgrades={cometreservoir:2,cometcycle:3,meteorcore:4};s.cometCharges=2;s.cometWork=3970;s.cometEvents.firstCommand=true;s.achieved.comet_first_command=true;s.cometMeteorUsed=true;
    q.set(s);q.save(CLOCK);const before=clone(q.get()),stored=e.storage.get(P),transitions=[],bank=observeBank(q,3,3);let pending=null;
    const undo=q.observe('applyAscendMutation',event=>{
      if(event.phase==='before')pending={bank:{charges:event.state.cometCharges,work:event.state.cometWork},levels:clone(event.state.cometUpgrades),token:event.token};
      else{eq({charges:event.state.cometCharges,work:event.state.cometWork},pending.bank,'actual offline Ascend must preserve earned bank');eq(event.state.cometUpgrades,pending.levels,'offline Ascend keeps every paid Comet rank');ok(event.token!==pending.token,'real run identity changes despite unsafe count');eq(event.state.cometMeteorUsed,false,'actual new run clears old encounter marker');transitions.push({bank:pending.bank,depth:event.state.depth,count:event.state.ascendCount});}
    });
    e.clock(CLOCK+60000);e.fail(fault==='primary',fault==='recovery');let result,error,calls=0;
    const done=(r,err)=>{result=r;error=err;calls++;};q.offline(done);e.drain(10000);
    if(fault==='primary'){ok(error,'primary failure is reported for offline Auto-Ascend');eq(q.get(),before,'offline Auto-Ascend failure restores every original bank/encounter/state field');eq(e.storage.get(P),stored,'failed Auto-Ascend keeps original primary');e.fail(false,false);q.offline(done);e.drain(10000);}
    undo();bank.undo();ok(!error,'actual offline Auto-Ascend route completes');ok(result.ascends>=1,'actual unsafe-count fixture really Auto-Ascends');eq(require('./amount-oracle.cjs').integer(q.get().ascendCount),BigInt(before.ascendCount)+BigInt(result.ascends),'original exact lifetime value plus every actual Ascend');eq(q.get().cometCharges,3,'charge earned on ending hit survives actual offline reset');eq(q.get().cometWork,0,'full bank remains closed across later kills');
    eq(calls,fault==='primary'?2:1,'one callback per attempted absence');eq(q.get().autoAscendTargetDepth,16,'exact user target preserved');eq(q.get().autoAscendEnabled,true,'user Auto-Ascend remains enabled');const state=clone(q.get());eq(q.offline(),null,'accepted Auto-Ascend absence cannot replay');
    const receipt={id:'offline-auto-ascend-'+fault,result,calls,transitions:transitions.slice(0,4),transitionCount:transitions.length,bank:bank.result,stateSha256:sha(JSON.stringify(state))};report.runs.push(receipt);return {state,receipt};
  }
  group('actual offline Auto-Ascend keeps the bank and exact paid ranks',()=>{
    const clean=ascending(source);for(const fault of ['primary','recovery'])eq(ascending(source,fault).state,clean.state,'offline ending-hit fault/retry equals clean persisted endpoint '+fault);
  });
  group('host-processing foreground replay uses existing live time exactly once',()=>{
    const seedApp=app(source),initial=farmFixture(seedApp.q,3),e=app(source),q=e.q;q.set(initial);q.save(CLOCK);e.clock(CLOCK+60000);e.performanceStep(200);
    let result,error,callbacks=0;q.offline((r,err)=>{result=r;error=err;callbacks++;});ok(e.pending()>0,'measured host-cost fixture really yields');const before=clone(q.get());e.performanceStep(0);e.drain(10000);assert.ifError(error);report.checks++;
    const reference=app(source),r=reference.q;r.set(initial);r.save(CLOCK);reference.clock(CLOCK+60000);let baseResult,baseError;r.offline((value,err)=>{baseResult=value;baseError=err;});reference.drain(10000);assert.ifError(baseError);report.checks++;
    // Clock calls are independent host observations: processingStart0,
    // batchStart200, first boundary check400, then held at600ms. The original
    // transaction therefore replays0.6 live seconds after60 offline seconds.
    const live=r.advance(.6,{kind:'live',clockStartMs:CLOCK+60000});r.save(CLOCK+60000);
    eq(q.get(),r.get(),'host cost produces exactly the original0.6s live replay, with no Comet timer');eq(result.kills,baseResult.kills+live.kills,'reported kills include existing live replay once');eq(callbacks,1,'host processing does not create an extra completion callback');eq(q.get().totalOfflineSeconds-before.totalOfflineSeconds,60,'processing replay is live, never extra offline duration');
    report.witnesses.push({id:'host-processing-replay',offlineSeconds:60,hostCostMs:600,liveSeconds:.6,offlineKills:baseResult.kills,liveKills:live.kills,totalKills:result.kills,callbacks,stateSha256:sha(JSON.stringify(q.get()))});
  });
  if(options.negative)group('causal offline controls execute the complete mutated production IIFE',()=>{
    function control(id,name,change,probe,message){
      const mutated=replaceFunction(source,name,change);probe(source);report.checks++;let error;
      try{probe(mutated);}catch(failure){error=failure;}
      report.lastNegativeAttempt={id,error:error?{name:error.name,code:error.code,message:error.message}:null};
      ok(error&&error.code==='ERR_ASSERTION','causal failure is semantic, not runtime/parser: '+id);ok(message.test(error.message),'intended offline causal assertion: '+id);
      report.negativeControls.push({id,function:name,sourceSha256:sha(mutated),detected:true,error:{name:error.name,code:error.code,message:error.message}});delete report.lastNegativeAttempt;
    }
    control('elapsed-seconds-are-not-defeat-work','advanceAuthoritativeTime',body=>'cometRecordDefeats(Math.floor(elapsedSec),false);'+body,text=>silentCase(text),/elapsed time alone must not earn work/);
    control('offline-never-automatically-spends-a-command','applyOfflineProgress',body=>replaceOne(body,'var now = Date.now();','if(state.cometCharges>0)state.cometCharges--;var now = Date.now();'),text=>silentCase(text,true,3),/elapsed time must not spend or refill/);
    control('direct-farm-batch-count-is-required','simulationBatchFarmKills',body=>replaceOne(body,'cometRecordDefeats(count,state.cometCalled);','/* causal omitted batch Comet owner */'),text=>{
      const e=app(text),q=e.q,s=farmFixture(q,0);s.spirits.ember=1000;q.set(s);const result=q.advance(60,{kind:'offline',clockStartMs:CLOCK});assert(result.fastForwardedKills>0);const expected=bankAfter(s.cometCharges,s.cometWork,result.kills,0,3);assert.deepEqual({charges:q.get().cometCharges,work:q.get().cometWork},expected,'real Farm fast-forward must account for every defeat');
    },/real Farm fast-forward must account/);
    control('unsafe-lifetime-counter-does-not-suppress-recharge','cometRecordDefeats',body=>'if(state.totalKills+count===state.totalKills)return;'+body,text=>{
      const e=app(text),q=e.q,s=farmFixture(q,2);s.totalKills=1e30;q.set(s);const result=q.advance(60,{kind:'offline',clockStartMs:CLOCK});assert(result.kills>0);const expected=bankAfter(s.cometCharges,s.cometWork,result.kills,2,3);assert.deepEqual({charges:q.get().cometCharges,work:q.get().cometWork},expected,'actual offline defeats survive a stalled lifetime counter');
    },/actual offline defeats survive/);
    control('direct-farm-replacement-clears-called-marker','simulationBatchFarmKills',body=>replaceOne(body,'state.cometMeteorUsed=false;state.cometCalled=false;','state.cometMeteorUsed=false;'),text=>{
      const e=app(text),q=e.q,s=farmFixture(q,0);s.cometCalled=true;s.enemyIsLuminous=true;q.set(s);const result=q.advance(2,{kind:'offline',clockStartMs:CLOCK});assert(result.kills>0);assert.equal(q.get().cometCalled,false,'actual Farm replacement must consume the called marker');
    },/actual Farm replacement must consume/);
    control('offline-primary-failure-cannot-publish-working-bank','applyOfflineProgress',body=>replaceOne(body,'if(!saved && state===job.working){','if(false && !saved && state===job.working){'),text=>{
      const e=app(text),q=e.q;q.set(farmFixture(q,2));q.save(CLOCK);const before=clone(q.get());e.clock(CLOCK+60000);e.fail(true,false);let error;q.offline((result,failure)=>{error=failure;});e.drain(10000);assert(error,'failed primary must report rejected offline commit');assert.deepEqual(q.get(),before);
    },/failed primary must report rejected/);
    control('actual-ascend-does-not-empty-earned-comet-bank','applyAscendMutation',body=>'state.cometCharges=0;state.cometWork=0;'+body,text=>{
      const e=app(text),q=e.q,s=ownedFixture(q,'meteor',15);s.owned.autoascend=true;s.autoAscendEnabled=true;s.autoAscendTargetDepth=16;s.enemyHp=1;
      s.cometUpgrades.cometreservoir=2;s.cometCharges=2;s.cometWork=3970;q.set(s);q.save(CLOCK);let before,after,error,ascends=0;
      const undo=q.observe('applyAscendMutation',event=>{if(event.phase==='before')before={charges:event.state.cometCharges,work:event.state.cometWork};else{ascends++;if(!after)after={before,after:{charges:event.state.cometCharges,work:event.state.cometWork}};}});
      e.clock(CLOCK+6000);q.offline((result,failure)=>{error=failure;});e.drain(10000);undo();assert.ifError(error);assert(ascends>0,'causal witness actually Auto-Ascends');
      assert.deepEqual(after.after,after.before,'actual offline Ascend must preserve earned bank');
    },/actual offline Ascend must preserve earned bank/);
  });
  report.status='PASS';delete report.currentGroup;return report;
}

function cli(){
  const sourcePath=path.resolve(process.argv[2]||'index.html'),bytes=fs.readFileSync(sourcePath);let progress=null,report;
  try{report=runOffline(bytes.toString('utf8'),{negative:process.argv.includes('--negative'),progress:value=>{progress=value;}});}
  catch(error){report=Object.assign(progress||{},{status:'FAIL',error:{name:error.name,code:error.code,message:error.message,stack:error.stack}});process.exitCode=1;}
  report.input={path:sourcePath,bytes:bytes.length,sha256:sha(bytes)};
  report.dependencies=[__filename,'comet-expansion-harness.cjs','comet-expansion-core.cjs','comet-expansion-numerical.cjs'].map(name=>{const filename=path.isAbsolute(name)?name:path.join(__dirname,name),body=fs.readFileSync(filename);return {path:filename,bytes:body.length,sha256:sha(body)};});
  report.runtime={node:process.version,v8:process.versions.v8};report.scope='Actual original scheduler and offline transaction; supplied synthetic storage/clocks/DOM. No native WebView, touch or browser geometry claim.';
  process.stdout.write(JSON.stringify(report,null,2)+'\n');
}
module.exports={runOffline,farmFixture,bankAfter};
if(require.main===module)cli();
