'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone}=require('./lab-expansion-harness.cjs');
const tracks={
 rift:['d10','d25','d50','d100','d250',...[500,1000,2500,5000,10000,25000,100000,1000000].map(n=>'endless_rift_'+n)],
 strikes:['tap100','tap1000','tap10000'],
 ascend:['asc1','asc5','asc10',...[25,50,100,250,500,1000,10000,100000].map(n=>'endless_ascend_'+n)],
 rest:['idle8',...[24,72,168,720,2160,8760].map(n=>'endless_rest_'+n)],
 projects:['study1','study25'],
 forge:['labqueue',...[100,200,300,400,500,600].map(n=>'endless_forge_'+n)],
 lab:[50,100,250,500,1000,2000].map(n=>'endless_lab_'+n),
 mastery:[10,25,50,100,250,500,1000,5000,10000].map(n=>'endless_mastery_'+n),
 kills:[10000,100000,1000000,10000000,100000000,1000000000].map(n=>'endless_kills_'+n)
};
const singles=['fullparty','all','mythic','autotap','labmaster','allstudies','firstultimate','modulemax'];
const rewards={rift:[5,10,20,50,100,105,110,115,120,125,130,135,140],strikes:[3,8,20],ascend:[10,25,50,55,60,65,70,75,80,85,90],rest:[15,20,25,30,35,40,45],projects:[15,50],forge:[40,45,50,55,60,65,70],lab:[10,15,20,25,30,35],mastery:[10,15,20,25,30,35,40,45,50],kills:[10,15,20,25,30,35]};
function run(source){
 let checks=0;const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);},ok=(v,m)=>{checks++;assert(v,m);};
 const x=app(source),q=x.q;
 for(const [key,ids]of Object.entries({...tracks,...Object.fromEntries(singles.map(id=>[id,[id]]))})){
  const s=q.fresh();eq(q.deedSeries(s).find(r=>r.key===key).milestones.map(a=>a.id),ids,key+' exact complete series');
  for(let n=0;n<=ids.length;n++){
   s.achieved={};ids.slice(0,n).forEach(id=>s.achieved[id]=true);const before=clone(s),row=q.deedSeries(s).find(r=>r.key===key);
   eq(row.next.id,ids[Math.min(n,ids.length-1)],key+' advances at milestone '+n);
   eq(row.earned.map(a=>a.id),ids.slice(0,n),key+' keeps every earned identity');eq(s,before,'selection never mutates state');
  }
  s.achieved={};s.achieved[ids.at(-1)]=true;eq(q.deedSeries(s).find(r=>r.key===key).next.id,ids[0],'out-of-order legacy flags cannot hide an unearned earlier reward');
 }
 const rows=q.deedSeries(q.fresh()),ids=rows.flatMap(r=>r.milestones.map(a=>a.id));
 eq(rows.length,17,'one card for nine series and eight distinct single-goal challenges');eq(ids.length,72,'all active identities covered');eq(new Set(ids).size,72,'each active identity appears once');
 for(const [key,expected]of Object.entries(rewards)){
  const actual=rows.find(r=>r.key===key).milestones.map(a=>a.reward);
  eq(actual,expected,key+' accepted increasing reward schedule');
  ok(actual.every((n,i)=>i===0||n>actual[i-1]),key+' each next reward increases');
 }
 const counters={rift:(s,n)=>s.maxDepthEver=n,ascend:(s,n)=>s.ascendCount=n,forge:(s,n)=>s.research.focus=n,rest:(s,n)=>s.totalOfflineSeconds=n*3600};
 for(const key of Object.keys(counters)){
  const milestones=rows.find(r=>r.key===key).milestones;
  for(let i=0;i<milestones.length;i++){
   const a=milestones[i],fixture=q.fresh();
   rows.flatMap(r=>r.milestones).forEach(m=>fixture.achieved[m.id]=true);fixture.achieved[a.id]=false;
   const target=q.deedProgress(a,fixture).target;counters[key](fixture,key==='rest'&&a.id==='idle8'?target/3600:target);
   fixture.comets=0;q.set(fixture);q.achievements();eq(q.get().comets,rewards[key][i],'actual isolated payout matches increasing '+a.id);q.achievements();eq(q.get().comets,rewards[key][i],'actual '+a.id+' payout cannot repeat');
  }
 }
 eq(rows.flatMap(r=>r.milestones).reduce((n,a)=>n+a.reward,0),3323,'approved increasing active reward pool');eq(q.deeds().reduce((n,a)=>n+a.reward,0),3373,'originals and event rewards plus approved higher later stages');
 // A real grant skips all reached Rift thresholds, with no repeated payments.
 const s=q.fresh();s.maxDepthEver=1000;q.set(s);const before=q.get().comets,expected=q.deeds().filter(a=>a.check(q.get())).reduce((n,a)=>n+a.reward,0);
 q.achievements();eq(q.get().comets-before,expected,'all reached milestones pay exactly once');eq(q.deedSeries(q.get()).find(r=>r.key==='rift').next.id,'endless_rift_2500','catch-up advances straight to next unmet Rift');
 const earned=clone(q.get());q.achievements();eq(q.get(),earned,'repeat grant is idempotent');ok(q.save(),'earned milestones persist');
 const loaded=app(source,x.storage).q;loaded.achievements();eq(loaded.get().comets,earned.comets,'reload cannot repeat payout');eq(loaded.deedSeries(loaded.get()).find(r=>r.key==='rift').next.id,'endless_rift_2500','reload retains next milestone');
 loaded.get().maxDepthEver=1;eq(loaded.deedSeries(loaded.get()).find(r=>r.key==='rift').next.id,'endless_rift_2500','earned milestones survive counter reset');
 // A completed old stage cannot be paid again when upgrading the reward table.
 const prior=q.fresh();prior.achieved.endless_rift_500=true;prior.comets=123;q.set(prior);ok(q.save(),'old earned receipt saves');
 const resumed=app(source,x.storage).q;eq(resumed.get().comets,123,'settled legacy receipt gets no retroactive duplicate');eq(resumed.get().achieved.endless_rift_500,true,'legacy completion is retained');
 const due=q.fresh();due.achieved.endless_rift_500=true;due.cometClaims.deeds.endless_rift_500=true;due.comets=0;q.set(due);ok(q.save(),'old pending boolean claim remains valid');
 eq(q.get().comets,105,'unpaid stage receives current increased reward once');eq(q.get().cometClaims.deeds,{},'increased pending claim settles');ok(q.save(),'settled increased reward saves');eq(q.get().comets,105,'save cannot pay higher reward twice');
 return {checks,series:17,activeIdentities:72,fixedRewards:3373};
}
module.exports={run,tracks,singles};
if(require.main===module){const source=fs.readFileSync(process.argv[2]||'index.html','utf8');console.log(JSON.stringify({status:'pass',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),...run(source)}));}
