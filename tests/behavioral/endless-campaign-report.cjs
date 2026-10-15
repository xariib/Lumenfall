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
 const file=prefix+'-'+policy+(process.argv.includes('--frozen-day60')?'-day60.json':'-snapshot.json.checkpoint.json');
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
 const openRecordGapDays=Number.isFinite(c.lastRecordAt)&&c.lastRecordAt>=0&&c.lastRecordAt<=c.elapsed?(c.elapsed-c.lastRecordAt)/day:null;
 const longestClosedWallDays=Math.max(0,...gaps.map(w=>w.days)),longestObservedRecordGapDays=openRecordGapDays===null?null:Math.max(longestClosedWallDays,openRecordGapDays);
 const investments=(c.purchases||[]).filter(p=>p.kind==='ultimate'||p.kind==='mastery').map(p=>({kind:p.kind,id:p.id,day:p.at/day,price:p.price,shareOfWallet:p.shareOfWallet}));
 const last=c.history[c.history.length-1];
 const ids=Object.keys(last.rarity),fullRoster=row=>ids.every(id=>row.rarity[id]>=5&&row.modules[id]>=20&&row.ultimates[id]);
 const firstFull=c.history.find(fullRoster);
 for(let i=1;i<c.history.length;i++){
  const before=c.history[i-1],after=c.history[i];
  for(const field of ['rarity','modules','ultimates','mastery','labs','forge','tree'])for(const id of Object.keys(before[field])){
   checks++;assert(amount.ge(Number(before[field][id]),0)&&amount.ge(Number(after[field][id]),Number(before[field][id])),policy+' permanent '+field+'/'+id+' never decreases on day'+after.day);
  }
  for(const field of ['ascends','maxDepth']){checks++;assert(amount.ge(after[field],before[field]),policy+' permanent '+field+' never decreases on day'+after.day);}
 }
 const postRoster=firstFull?{daysObserved:last.day-firstFull.day,firstRanks:firstFull.mastery,endpointRanks:last.mastery,advancedWisps:ids.filter(id=>last.mastery[id]>firstFull.mastery[id])}:null;
 const roster={mythics:ids.filter(id=>last.rarity[id]>=5).length,abilities20:ids.filter(id=>last.modules[id]>=20).length,ultimates:ids.filter(id=>last.ultimates[id]).length,mastered:ids.filter(id=>last.mastery[id]>0).length,
  fullDevelopmentDay:milestones.fullRosterDevelopment,firstFullDayEndpoint:firstFull&&firstFull.day,status:fullRoster(last)?'FULL_ROSTER_OBSERVED':'DEVELOPING'};
 if(milestones.fullRosterDevelopment!==undefined){checks++;assert(firstFull&&Math.abs(firstFull.day-milestones.fullRosterDevelopment)<=1,'full roster milestone agrees with the saved daily endpoint');}
 records.push({policy,phases:c.phases,sourceSha256:c.sourceSha256,policySha256:c.policySha256,days:c.history.length,status:c.history.length>=56?'MILESTONE_WINDOW_MEASURED':'PARTIAL',milestones,firstDay,targets,
  roster,postRoster,endpoint:{rift:last.maxDepth,ascends:last.ascends,lab:last.labs.wispascend,masterwork:last.forge.masterwork,mastery:last.mastery},
  longestClosedWallDays,openRecordGapDays,longestObservedRecordGapDays,walls:gaps,wholeDayPlateaus:plateaus,investments,purchaseReceiptCount:(c.purchases||[]).length});
}
assert(records.length>0,'saved campaigns required');
for(const [policy,flag]of [['regular','--require-primary'],['regular_two','--require-regular-two']])if(process.argv.includes(flag)){
 const primary=records.find(r=>r.policy===policy);assert(primary&&primary.days>=56,'complete '+policy+' milestone window required');
 assert(primary.firstDay.every(t=>t.met),policy+' Day1 targets');assert(primary.targets.every(t=>t.status==='MET'),policy+' elapsed-day targets');
}
if(process.argv.includes('--require-roster'))assert(records.find(r=>r.policy==='regular')?.roster.status==='FULL_ROSTER_OBSERVED','regular campaign must actually develop all eight Wisps');
if(process.argv.includes('--require-post-roster'))assert(records.find(r=>r.policy==='regular')?.postRoster?.advancedWisps.length>0,'regular campaign must purchase further Mastery after full roster development');
if(process.argv.includes('--require-regular-two-roster'))assert(records.find(r=>r.policy==='regular_two')?.roster.status==='FULL_ROSTER_OBSERVED','regular_two campaign must actually develop all eight Wisps');
if(process.argv.includes('--require-regular-two-post-roster'))assert(records.find(r=>r.policy==='regular_two')?.postRoster?.advancedWisps.length>0,'regular_two campaign must purchase further Mastery after full roster development');
const result={status:records.every(r=>r.days>=56)?'MEASURED':'PARTIAL',checks,limits:'Real-engine deterministic policies and exact purchase receipts; no human/device acceptance inferred.',records};
if(output)fs.writeFileSync(output,JSON.stringify(result,null,2));
console.log(JSON.stringify({status:result.status,checks,policies:records.map(r=>({policy:r.policy,days:r.days,milestones:r.milestones,targets:r.targets,longestClosedWallDays:r.longestClosedWallDays,openRecordGapDays:r.openRecordGapDays,longestObservedRecordGapDays:r.longestObservedRecordGapDays}))}));
