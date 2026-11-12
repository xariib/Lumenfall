'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const F=require('./forge-expansion-harness.cjs');
const original=fs.readFileSync(process.argv[2]||'index.html','utf8');
const marker="if(document.readyState==='loading'){";
const source=original.replace(marker,'window.endlessQa={unlocked:wispRecruitmentUnlocked,requirement:wispRecruitmentRequirementText,rules:function(){return ENDLESS_PROGRESSION;}};'+marker);
let checks=0;const eq=(a,b,label)=>{checks++;assert.deepEqual(a,b,label);};
const rows=[['gale',15,17,2100],['thorn',35,23,12000],['void',55,29,70000],['aurora',75,34,400000],['titan',100,47,2200000]];
for(const [id,depth,lab,price]of rows){
 const x=F.app(source,undefined,{clockDate:true}),q=x.q;
 function seed(d,l){const s=q.fresh();s.maxDepthEver=d;s.longStudyLevels.wispascend=l;s.lumen=price;s.shards=0;return s;}
 eq(q.endless.rules().recruit[id],{depth,lab},'exact modest gate '+id);
 for(const [d,l,ready]of [[depth,lab-1,false],[depth-1,lab,false],[depth,lab,true]]){
  q.set(seed(d,l));eq(q.endless.unlocked(q.sp(id)),ready,'independent gates '+id+'/'+d+'/'+l);
  const before=F.clone(q.get());eq(q.empower(id),ready,'real recruitment respects both gates '+id);
  if(!ready)eq(q.get(),before,'rejected recruitment is inert '+id);
  else {eq(q.get().lumen,0,'original exact price debited '+id);eq(q.get().spirits[id],1,'one paid recruit '+id);}
 }
 q.set(seed(depth,lab));eq(q.endless.requirement(q.sp(id)),'Rift '+depth+' · Wisp Ascendancy Lv. '+lab,'visible gate '+id);
 eq(q.get().recruitmentEntitlements[id],true,'newly eligible save earns entitlement '+id);
 q.save();const cold=F.app(source,x.storage, {clockDate:true}).q;
 eq(cold.get().recruitmentEntitlements[id],true,'cold reload keeps earned access '+id);
 const old=seed(1,0);old.recruitmentEntitlements[id]=true;q.set(old);
 eq(q.endless.unlocked(q.sp(id)),true,'existing access survives below new gate '+id);
 eq(q.empowerCost(id),price,'recruitment price retained '+id);
}
const q=F.app(source).q;
eq(q.endless.rules().recruit.ember,{depth:1,lab:0},'early Ember unchanged');
eq(q.endless.rules().recruit.tide,{depth:3,lab:0},'early Tide unchanged');
eq(q.endless.rules().recruit.stone,{depth:6,lab:0},'early Stone unchanged');
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(original).digest('hex'),scope:'one fewer completed Wisp Ascendancy level for each later recruit; existing Rift and paid recruitment gates retained'}));
