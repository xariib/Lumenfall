'use strict';
// Audit saved real-engine campaigns. Partial runs remain explicitly partial;
// milestone evidence is separate from human/device acceptance.
const fs=require('node:fs'),assert=require('node:assert/strict'),amount=require('../../scripts/lib/game-amount.cjs');
const positional=process.argv.slice(2).filter(arg=>!arg.startsWith('--'));
const prefix=positional[0]||'docs/qa/endless-progression-001/candidate-z',output=positional[1];
const day=86400,records=[];
let checks=0;
function equal(a,b,label){checks++;assert(amount.cmp(a,b)===0,label);}
for(const policy of ['regular','regular_two','casual','frequent','efficient','mature']){
 const file=prefix+'-'+policy+'-snapshot.json.checkpoint.json';
 if(!fs.existsSync(file))continue;
 const c=JSON.parse(fs.readFileSync(file,'utf8'));
 assert.equal(c.policy,policy==='mature'?'regular':policy);assert(c.history.length>0);assert.equal(c.elapsed,c.history.length*day);
 const milestones=Object.fromEntries(Object.entries(c.milestones).map(([key,value])=>[key,value/day]));
 for(const p of c.purchases||[])for(const key of ['lumen','shards','prisms','sigils']){
  const price=p.price[key]||0,before=p.before[key];
  const expected=typeof before==='number'&&Math.abs(before)<=Number.MAX_SAFE_INTEGER?before-price:amount.exactSub(before,price);
  equal(p.after[key],expected,policy+' '+p.kind+'/'+p.id+' '+key+' receipt');
 }
 const firstDay=['recruit.tide','recruit.stone','firstRarity','firstAscend'].map(key=>({key,day:milestones[key],met:milestones[key]!==undefined&&milestones[key]<1}));
 const targets=[['allRecruits',21,28],['firstMythic',42,56],['firstUltimate',42,56]].map(([key,min,max])=>({key,min,max,day:milestones[key],status:milestones[key]===undefined?'PENDING':milestones[key]>=min&&milestones[key]<=max?'MET':'OUTSIDE_TARGET'}));
 const plateaus=[];
 for(let i=1;i<c.history.length;i++){
  const a=c.history[i-1],b=c.history[i];if(a.maxDepth!==b.maxDepth)continue;
  const increased=(before,after)=>Object.keys(after).filter(key=>(after[key]||0)>(before[key]||0));
  plateaus.push({day:b.day,rift:b.maxDepth,ascends:b.ascends-a.ascends,labs:increased(a.labs,b.labs),forge:increased(a.forge,b.forge),tree:increased(a.tree,b.tree),mastery:increased(a.mastery,b.mastery)});
 }
 const gaps=(c.walls||[]).map(w=>({...w,days:w.seconds/day}));
 const investments=(c.purchases||[]).filter(p=>p.kind==='ultimate'||p.kind==='mastery').map(p=>({kind:p.kind,id:p.id,day:p.at/day,price:p.price,shareOfWallet:p.shareOfWallet}));
 const last=c.history[c.history.length-1];
 records.push({policy,phases:c.phases,sourceSha256:c.sourceSha256,policySha256:c.policySha256,days:c.history.length,status:c.history.length>=56?'MILESTONE_WINDOW_MEASURED':'PARTIAL',milestones,firstDay,targets,
  endpoint:{rift:last.maxDepth,ascends:last.ascends,lab:last.labs.wispascend,masterwork:last.forge.masterwork,mastery:last.mastery},
  longestClosedWallDays:Math.max(0,...gaps.map(w=>w.days)),walls:gaps,wholeDayPlateaus:plateaus,investments,purchaseReceiptCount:(c.purchases||[]).length});
}
assert(records.length>0,'saved campaigns required');
if(process.argv.includes('--require-primary')){
 const primary=records.find(r=>r.policy==='regular');assert(primary&&primary.days>=56,'complete primary milestone window required');
 assert(primary.firstDay.every(t=>t.met),'primary Day1 targets');assert(primary.targets.every(t=>t.status==='MET'),'primary elapsed-day targets');
}
const result={status:records.every(r=>r.days>=56)?'MEASURED':'PARTIAL',checks,limits:'Real-engine deterministic policies and exact purchase receipts; no human/device acceptance inferred.',records};
if(output)fs.writeFileSync(output,JSON.stringify(result,null,2));
console.log(JSON.stringify({status:result.status,checks,policies:records.map(r=>({policy:r.policy,days:r.days,milestones:r.milestones,targets:r.targets,longestClosedWallDays:r.longestClosedWallDays}))}));
