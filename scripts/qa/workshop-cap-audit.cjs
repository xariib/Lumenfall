'use strict';
// Inventory every current path using the actual catalogue and price/work functions.
// Optimistic work bounds grant all discounts and permanent 8x speed for free.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const F=require('../../tests/behavioral/forge-expansion-harness.cjs');
const raw=fs.readFileSync(process.argv[2]||'index.html','utf8'),marker="if(document.readyState==='loading'){";
assert.equal(raw.split(marker).length,2);
const source=raw.replace(marker,'window.endlessQa={duration:studyDuration,cost:studyCost};'+marker),{q}=F.app(source),b=q.endless;
const s=q.fresh();s.maxDepthEver=100000;
for(const n of q.projects())s.longStudyLevels[n.id]=n.levelCap;
q.set(s);
const forge=q.defs().map(n=>({id:n.id,name:n.name,retiredTo:n.retiredTo||null,cap:n.levelCap,unlockRift:n.unlockDepth||1,
  totalPrice:q.cost(n.id,0,n.levelCap),lastPrice:q.cost(n.id,n.levelCap-1,1),
  description:n.desc,effectAtCap:q.effect(n.id,n.levelCap),
  decision:n.retiredTo?'Keep historical ranks and their paid effects; future purchases use the listed successor.':n.id==='masterwork'?'Keep 500; additive power and five ranks per 50 record Rifts; last band requires Rift 5020.':
    n.levelCap===250?'Keep 250; scalable additive foundation, exponential total price.':
    'Keep bounded cap; charge, regeneration, conversion, resonance or encounter mechanics require finite effect ceilings.'}));
const lab=q.projects().map(n=>{
  let seconds=0;for(let rank=0;rank<n.levelCap;rank++)seconds+=b.duration(n,rank)/8;
  return {id:n.id,name:n.name,retiredTo:n.retiredTo||null,cap:n.levelCap,unlockRift:n.unlockDepth||1,
    firstPrice:b.cost(n,0),lastPrice:b.cost(n,n.levelCap-1),
    optimisticDaysToCap:seconds/86400,
    description:n.desc,
    decision:n.retiredTo?'Keep historical ranks and paid work; future purchases use the listed successor.':n.levelCap===500?'Keep 500; long timed foundation.':'Keep current cap; bounded utility/discount or specialized timed path.'};
});
assert(forge.every(n=>Number.isInteger(n.cap)&&n.cap>0));assert(lab.every(n=>Number.isInteger(n.cap)&&n.cap>0));
assert(lab.filter(n=>n.cap===500).every(n=>n.optimisticDaysToCap>2),'even free maximum discounts and permanent 8x speed cannot cap foundations within 48h');
console.log(JSON.stringify({status:'pass',sourceSha256:crypto.createHash('sha256').update(raw).digest('hex'),
  assumptions:'Lab bound grants all capped discounts, five free slots, unlimited currencies/Motes and permanent 8x speed from the beginning; one project still cannot run twice concurrently. Actual fresh progression is slower. Small specialized paths may finish earlier intentionally.',
  catalogue:{forge:forge.length,lab:lab.length,activeForge:forge.filter(n=>!n.retiredTo).length,activeLab:lab.filter(n=>!n.retiredTo).length},forge,lab},null,2));
