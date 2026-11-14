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
 eq(rows.flatMap(r=>r.milestones).reduce((n,a)=>n+a.reward,0),1933,'active fixed reward pool unchanged');eq(q.deeds().reduce((n,a)=>n+a.reward,0),1983,'all historical rewards unchanged');
 // A real grant skips all reached Rift thresholds, with no repeated payments.
 const s=q.fresh();s.maxDepthEver=1000;q.set(s);const before=q.get().comets,expected=q.deeds().filter(a=>a.check(q.get())).reduce((n,a)=>n+a.reward,0);
 q.achievements();eq(q.get().comets-before,expected,'all reached milestones pay exactly once');eq(q.deedSeries(q.get()).find(r=>r.key==='rift').next.id,'endless_rift_2500','catch-up advances straight to next unmet Rift');
 const earned=clone(q.get());q.achievements();eq(q.get(),earned,'repeat grant is idempotent');ok(q.save(),'earned milestones persist');
 const loaded=app(source,x.storage).q;loaded.achievements();eq(loaded.get().comets,earned.comets,'reload cannot repeat payout');eq(loaded.deedSeries(loaded.get()).find(r=>r.key==='rift').next.id,'endless_rift_2500','reload retains next milestone');
 loaded.get().maxDepthEver=1;eq(loaded.deedSeries(loaded.get()).find(r=>r.key==='rift').next.id,'endless_rift_2500','earned milestones survive counter reset');
 return {checks,series:17,activeIdentities:72,fixedRewards:1983};
}
module.exports={run,tracks,singles};
if(require.main===module){const source=fs.readFileSync(process.argv[2]||'index.html','utf8');console.log(JSON.stringify({status:'pass',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),...run(source)}));}
