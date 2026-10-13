'use strict';
// Measured deterministic player-policy runs, not a claim about a received
// mature save, physical device or human pacing acceptance.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,CLOCK,clone}=require('./forge-expansion-harness.cjs');
const html=fs.readFileSync(process.argv[2]||'index.html','utf8');
const old=fs.readFileSync(path.join(__dirname,'../../docs/qa/finish-development-release-001/early-wisps/baseline-support.html'),'utf8');
const fixtures=require('./fixtures.json'),ids=['ember','tide','stone','gale','thorn','void','aurora','titan'];
function campaign(source,name,seconds){
 const x=app(source),q=x.q,s=name==='fresh'?q.fresh():clone(fixtures[name].save);
 s.lastSeen=CLOCK;s.questDay=q.day();s.autoAscendEnabled=false;
 for(const key of ['empowerQueue','researchQueue','studyQueue','studyUseMotes'])if(s[key])for(const id of Object.keys(s[key]))s[key][id]=false;
 q.set(s);q.restoreEnemy();
 const start=clone(q.get()),spent={empower:0,forgeLumen:0,forgeShards:0,studyLumen:0,studyShards:0},waits=[];
 let kills=0,empowers=0,forge=0,studies=0,lastUpgrade=0,ascendReady=null,firstAscend=null,lastKillAt=0;const killIntervals=[];
 const samples=[];
 for(let t=1;t<=seconds;t++){
  x.clock(CLOCK+t*1000);
  if(!q.get().achieved.autotap)q.manualTap();
  const r=q.advance(1,{kind:'live',visual:false,clockStartMs:CLOCK+(t-1)*1000});kills+=r.kills;
  if(r.kills){killIntervals.push((t-lastKillAt)/r.kills);lastKillAt=t;}
  if(ascendReady===null&&q.get().maxDepthEver>=17){ascendReady=t;if(name==='fresh'){const before=q.get().prisms;q.ascend();firstAscend={at:t,prisms:q.get().prisms-before};}}
  for(let n=0;n<20;n++){
   const candidates=ids.filter(id=>q.get().maxDepthEver>=q.sp(id).unlockDepth).map(id=>({id,cost:q.empowerCost(id)})).filter(v=>v.cost<=q.get().lumen).sort((a,b)=>a.cost-b.cost);
   if(!candidates.length)break;
   const before=q.get().lumen;if(!q.empower(candidates[0].id))break;
   spent.empower+=before-q.get().lumen;empowers++;waits.push(t-lastUpgrade);lastUpgrade=t;
  }
  const affordable=q.defs().filter(n=>!n.retiredTo).map(n=>({id:n.id,plan:q.plan(n.id,1)})).filter(v=>v.plan.buyCount===1).sort((a,b)=>a.plan.needed.shard-b.plan.needed.shard);
  if(affordable.length){const before=clone(q.get());q.buy(affordable[0].id,1);const next=q.get();if(next.research[affordable[0].id]>before.research[affordable[0].id]){forge++;spent.forgeLumen+=before.lumen-next.lumen;spent.forgeShards+=before.shards-next.shards;}}
  if(t%10===0)for(const study of q.projects()){
   const before=clone(q.get());if(!q.startStudy(study.id))continue;
   studies++;spent.studyLumen+=before.lumen-q.get().lumen;spent.studyShards+=before.shards-q.get().shards;
  }
  if(t%300===0||t===seconds)samples.push({seconds:t,depth:q.get().depth,maxDepth:q.get().maxDepthEver,lumen:q.get().lumen,shards:q.get().shards,levels:clone(q.get().spirits)});
 }
 const state=q.get(),sorted=waits.slice().sort((a,b)=>a-b),combat=killIntervals.slice().sort((a,b)=>a-b);
 assert(Number.isFinite(state.enemyHp)&&state.enemyHp>=0);assert(spent.empower>=0&&spent.forgeLumen>=0&&spent.forgeShards>=0);
 return {fixture:name,seconds,startDepth:start.depth,endDepth:state.depth,maxDepth:state.maxDepthEver,kills,measuredSecondsPerKill:kills?seconds/kills:null,
  medianKillInterval:combat.length?combat[Math.floor(combat.length/2)]:null,secondsSinceLastKill:seconds-lastKillAt,
  empowers,forge,studies,ascendReadySeconds:ascendReady,firstAscend,upgradeWaitMedian:sorted.length?sorted[Math.floor(sorted.length/2)]:null,
  upgradeWaitP95:sorted.length?sorted[Math.floor((sorted.length-1)*.95)]:null,spent,samples};
}
const cases=[['fresh',7200],['mid-game',1800],['mature-high-power',1800]];
const before=cases.map(([name,sec])=>campaign(old,name,sec)),after=cases.map(([name,sec])=>campaign(html,name,sec));
console.log(JSON.stringify({status:'PASS',policy:'One manual tap/second until Auto-Tap; up to20 cheapest affordable Wisp levels/second; one affordable Forge level/second; attempt paid Studies every10s; first fresh Ascend when ready. Existing automatic behavior retained.',
 limits:'Deterministic standard fixtures; gameplay measurements, not human or Android acceptance. No arbitrary economy/price rebalance.',before,after,sourceSha256:crypto.createHash('sha256').update(html).digest('hex')},null,2));
