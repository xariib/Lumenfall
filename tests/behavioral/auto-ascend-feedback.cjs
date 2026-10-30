'use strict';
// Complete production game; control only DOM nodes and presentation deadlines.
// Real combat/save checks below use the unchanged existing production harness.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const F=require('./forge-expansion-harness.cjs'),A=require('../../scripts/lib/game-amount.cjs');
const file=process.argv[2]||'index.html',original=fs.readFileSync(file,'utf8');
let source=original,checks=0;
function eq(a,b,message){checks++;assert.deepEqual(a,b,message);}
function ok(value,message){checks++;assert(value,message);}
function hash(value){return crypto.createHash('sha256').update(typeof value==='string'?value:JSON.stringify(value)).digest('hex');}
const mutations={
  restart:["if(ascendFeedback && auto){","if(ascendFeedback && auto) clearAscendFeedback();\n  if(ascendFeedback && auto){"],
  lastGain:['showAscendFlash(gain,true,sim.ascends);','showAscendFlash(sim.ascendGains[sim.ascendGains.length-1]||0,true,1);'],
  manual:["if(!ascendFeedback.auto){","if(false){"],
  runs:['if(sim.ascendGainRuns){','if(false){']
};
if(process.env.ASCEND_FEEDBACK_MUTANT){
  const edit=mutations[process.env.ASCEND_FEEDBACK_MUTANT];assert(edit);assert.equal(source.split(edit[0]).length,2);source=source.replace(...edit);
}
function feedbackPage(){
  const marker="if(document.readyState==='loading'){";
  const bridge=`
  var feedbackTimers=[],feedbackNextTimer=0,feedbackNodes=[];
  setTimeout=function(fn,delay){var id=++feedbackNextTimer;feedbackTimers.push({id:id,at:Date.now()+delay,fn:fn});return id;};
  clearTimeout=function(id){feedbackTimers=feedbackTimers.filter(function(t){return t.id!==id;});};
  document.createElement=function(){
    var children={};['span','strong','small'].forEach(function(tag){children[tag]={textContent:''};});
    var node={className:'',attributes:{},innerHTML:'',parentNode:null,children:children,
      setAttribute:function(k,v){this.attributes[k]=v;},querySelector:function(tag){return children[tag];},
      remove:function(){this.parentNode=null;feedbackNodes=feedbackNodes.filter(function(n){return n!==node;});}};
    node.classList={add:function(name){node.className+=' '+name;}};return node;
  };
  document.body.appendChild=function(node){feedbackNodes.push(node);node.parentNode=document.body;};
  var feedbackShow=showAscendFlash;
  window.endlessQa={show:function(){showAscendFlash=feedbackShow;return feedbackShow.apply(null,arguments);},
    present:function(sim){showAscendFlash=feedbackShow;return presentLiveAscendResult(sim);},clear:clearAscendFeedback,
    node:function(){return feedbackNodes[0];},nodes:function(){return feedbackNodes.length;},
    info:function(){return ascendFeedback && {gain:ascendFeedback.gain,count:ascendFeedback.count,auto:ascendFeedback.auto};},
    pending:function(){return feedbackTimers.length;},
    flush:function(){var n=0;while(true){feedbackTimers.sort(function(a,b){return a.at-b.at;});if(!feedbackTimers.length||feedbackTimers[0].at>Date.now())break;feedbackTimers.shift().fn();if(++n>100)throw Error('Unbounded presentation timers');}},
    lifecycle:function(flags){document.hidden=!!flags.hidden;startupIntroPlaying=!!flags.intro;offlinePending=!!flags.offline;resetInProgress=!!flags.reset;reloadInProgress=!!flags.reload;}
  };
  `;
  const x=F.app(source.replace(marker,bridge+marker),undefined,{clockDate:true});
  return {...x,ui:x.q.endless,at(ms){x.clock(F.CLOCK+ms);x.q.endless.flush();}};
}
if(!process.argv.includes('--record-baseline')){
{
  const x=feedbackPage(),u=x.ui,before=F.clone(x.q.get()),writes=x.writes.length;
  u.show(11,true);const node=u.node();
  eq(node.children.strong.textContent,'+11 PRISMS','first reward immediately readable');
  eq(node.attributes,{role:'status','aria-live':'polite','aria-atomic':'true'},'atomic accessible notification');
  for(let i=1;i<=9;i++){x.at(i*100);u.show(11,true);eq(u.node(),node,'rapid events keep the same node');}
  eq(u.nodes(),1,'one notification for rapid events');
  eq(node.children.strong.textContent,'+11 PRISMS','rapid events do not rewrite text every tick');
  x.at(1100);eq(node.children.strong.textContent,'+110 PRISMS','coalesced complete Prism total');
  eq(node.children.small.textContent,'10 ascensions','coalesced complete run count');
  ok(!node.className.includes('leaving'),'rapid auto summary never restarts fade/entry');
  eq(x.q.get(),before,'notification does not mutate any save field');eq(x.writes.length,writes,'notification writes no persistence');
  x.at(3899);eq(u.node(),node,'readable until three seconds after last receipt');
  x.at(3900);eq(u.nodes(),0,'idle summary removed');eq(u.pending(),0,'idle cleanup leaves no timers');
}
{
  const x=feedbackPage(),u=x.ui;
  u.present({ascends:3,ascendGains:[7,11,13]});
  eq(u.info(),{gain:31,count:3,auto:true},'all committed gains in a live tick are presented');
  x.at(100);u.present({ascends:5,ascendGains:[19],ascendGainRuns:[{gain:17,count:3},{gain:19,count:2}]});
  eq(u.info(),{gain:120,count:8,auto:true},'compressed runs combine every reward without expansion');
  const count='9007199254740993e0';
  u.clear();u.present({ascends:count,ascendGains:[7],ascendGainRuns:[{gain:7,count}]});
  eq(u.info().gain,'63050394783186951e0','wide batch uses exact arithmetic');
  eq(u.info().count,count,'wide count retained');
  eq(u.pending(),1,'wide batch schedules constant presentation work');
  u.clear();u.present({ascends:9007199254740991,ascendGains:[7],ascendGainRuns:[{gain:7,count:9007199254740991}]});
  eq(u.info().gain,'63050394783186937e0','native count multiplication does not round a large reward');
  u.clear();u.present({ascends:1e20,ascendGains:[3],ascendGainRuns:[{gain:3,count:1e20}]});
  eq(u.info().gain,'3e20','large native count canonicalizes before exact multiplication');
}
{
  const x=feedbackPage(),u=x.ui;
  u.show(23,false);const manual=u.node();x.at(100);u.show(5,true,2);x.at(500);u.show(7,true,3);
  eq(u.node(),manual,'automatic receipts preserve the manual reading interval');
  eq(manual.children.strong.textContent,'+23 PRISMS','manual amount stays stable');
  x.at(2499);ok(!manual.className.includes('leaving'),'manual remains fully readable for 2.5 seconds');
  x.at(2500);ok(manual.className.includes('leaving'),'manual leaves after reading interval');
  x.at(3000);ok(u.node()!==manual,'queued automatic summary follows manual feedback');
  eq(u.info(),{gain:12,count:5,auto:true},'queued automatic receipts are counted once');
  x.at(6000);eq(u.nodes(),0,'queued summary clears');eq(u.pending(),0,'manual and auto timers clean up');
  u.show(1,true);x.at(6100);u.show(29,false);const next=u.node();x.at(7000);
  eq(u.node(),next,'old auto callbacks never remove a newer manual notification');
  eq(next.children.strong.textContent,'+29 PRISMS','new manual amount remains correct');
}
for(const flag of ['hidden','intro','offline','reset','reload']){
  const x=feedbackPage(),u=x.ui;u.show(3,false);u.show(7,true);u.lifecycle({[flag]:true});u.clear();x.at(10000);
  eq(u.nodes(),0,'lifecycle discards queued live receipts: '+flag);eq(u.pending(),0,'no stale timers: '+flag);
  u.show(11,true);eq(u.nodes(),0,'no replay while lifecycle blocks live feedback: '+flag);
}
{
  const x=feedbackPage(),u=x.ui;u.show(3,true);u.node().remove();u.show(5,true);
  eq(u.info(),{gain:5,count:1,auto:true},'detached node starts a clean summary');
  eq(u.pending(),1,'detached notification timers canceled');
}
// Preserve exact endpoint hashes recorded from PR15 main, including all saved
// fields and wallets. This is independent of the UI assertions above.
}
const receiptPath=path.resolve(__dirname,'../../docs/qa/auto-ascend-feedback-001/baseline.json');
function endpointCases(input){
  const results=[];
  for(const mode of ['push','auto','farm'])for(const kind of ['live','offline']){
    const x=F.app(input,undefined,{clockDate:true}),q=x.q,s=q.fresh();
    Object.assign(s,{depth:32,maxDepthEver:1000,lastSeen:F.CLOCK,questDay:q.day(),riftMode:mode==='farm'?'farm':'push',farmDepth:mode==='farm'?32:0,farmReturnDepth:mode==='farm'?60:0,autoAscendEnabled:mode==='auto',autoAscendTargetDepth:31});
    s.owned.autoascend=true;s.activeParty=['ember','tide','stone'];for(const id of s.activeParty)s.spirits[id]=300;
    s.research.masterwork=20;s.nodes.echo=6;s.activeStudies=[{id:'guardmastery',remainingSec:120,totalDurationSec:120,speedMult:1}];
    if(mode==='auto'){s.research.masterwork=500;s.research.formation=250;s.longStudyLevels.wispascend=500;s.wispMastery.ember=250;s.heroRarity.ember=5;s.wispModules.ember=20;s.wispUltimate.ember=true;}
    q.set(s);q.restoreEnemy();const before=F.clone(q.get());
    const summary=q.advance(10,{kind,clockStartMs:F.CLOCK});ok(q.save(),'endpoint persists: '+mode+'/'+kind);
    const endpoint=F.clone(q.get());
    const historicalEndpoint=F.clone(endpoint);
    for(const id of ['battletempering','arcanetempering','harvesttempering']){
      eq(historicalEndpoint.research[id],0,'new Forge enhancement stays unpurchased in PR15 oracle '+id);
      eq(historicalEndpoint.researchQueue[id],false,'new Forge enhancement queue stays OFF in PR15 oracle '+id);
      delete historicalEndpoint.research[id];delete historicalEndpoint.researchQueue[id];
    }
    // PR15 predates these additive identities. Require their exact unpurchased
    // defaults before retaining the complete frozen historical endpoint hash.
    for(const id of ['wispdamage','wispcritchance','wispcritdamage']){
      for(const [field,value]of [['longStudyLevels',0],['studyQueue',false],['studyUseMotes',false],['studySpeedTargets',1.5],['studyBoostHours',8]]){
        eq(historicalEndpoint[field][id],value,'new Wisp research stays unpurchased in PR15 oracle '+field+'.'+id);
        delete historicalEndpoint[field][id];
      }
    }
    if(Object.hasOwn(historicalEndpoint,'offlineClockHighWaterMs')){
      eq(historicalEndpoint.offlineClockHighWaterMs,F.CLOCK,'new credited-time metadata retains exact fixture save endpoint');
      delete historicalEndpoint.offlineClockHighWaterMs;
    }
    results.push({mode,kind,kills:summary.kills,ascends:summary.ascends,prisms:A.exactSub(endpoint.prisms,before.prisms),depth:endpoint.depth,stateSha256:hash(historicalEndpoint)});
    const cold=F.app(input,x.storage,{clockDate:true});eq(cold.q.get(),endpoint,'both-slot reload retains exact endpoint');
    if(mode==='auto'){
      ok(summary.ascends>1,'multiple real automatic cycles execute');
      let total=0;for(const row of summary.ascendGainRuns||summary.ascendGains.map(gain=>({gain,count:1})))total=A.exactAdd(total,A.mul(row.gain,row.count));
      eq(A.cmp(total,A.exactSub(endpoint.prisms,before.prisms)),0,'committed receipts equal exact actual Prism credit');
    }
  }
  const x=F.app(input,undefined,{clockDate:true}),s=x.q.fresh();s.depth=s.maxDepthEver=32;x.q.set(s);x.q.restoreEnemy();
  const before=F.clone(x.q.get());x.fail(true,false);eq(x.q.ascend(),false,'failed Ascend rejects');eq(x.q.get(),before,'failed Ascend retains every field');
  return results;
}
const endpoints=endpointCases(source);
if(process.argv.includes('--record-baseline')){
  assert.equal(hash(original),'ce4223a749cc307760895f84b8983e4cc2348e57df251c3dff357a07d021d8ba','record only the verified PR15 baseline source');
  fs.mkdirSync(path.dirname(receiptPath),{recursive:true});fs.writeFileSync(receiptPath,JSON.stringify({commit:'cc03df4972808666436eb0386515d20e88d04255',sourceSha256:hash(original),endpoints},null,2)+'\n');
}else eq(endpoints,JSON.parse(fs.readFileSync(receiptPath)).endpoints,'all current production endpoints exactly match PR15');
if(process.argv.includes('--negative')){
  const cp=require('node:child_process');
  for(const name of Object.keys(mutations)){
    const r=cp.spawnSync(process.execPath,[__filename,file],{encoding:'utf8',env:{...process.env,ASCEND_FEEDBACK_MUTANT:name},timeout:60000});
    ok(!r.error&&r.status===1&&r.stderr.includes('AssertionError'),'causal defect rejected: '+name);
  }
}
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:hash(original),endpoints,limits:'Controlled DOM and deadlines with full production simulation. Actual browser geometry/motion, Android and physical phone remain separate.'}));
