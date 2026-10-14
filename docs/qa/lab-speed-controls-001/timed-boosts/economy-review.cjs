'use strict';
// Read-only economy observations using complete production logic and existing
// synthetic fixtures. No player save, production formula or timer is replaced.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../..');
const {app,clone}=require(path.join(root,'tests/behavioral/lab-expansion-harness.cjs'));
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const fixtures=JSON.parse(fs.readFileSync(path.join(root,'tests/behavioral/fixtures.json'),'utf8'));
const q=app(source).q;
const perThousand=[];
for(const depth of [9,39,79,149,249]){
 const s=q.fresh();Object.assign(s,{maxDepthEver:250,depth,enemyDepth:depth,enemyHp:1,enemyMaxHp:1,riftMode:'farm',farmDepth:depth,farmReturnDepth:depth+1,questDay:q.day(),motes:0,activeParty:[]});
 q.set(s);const r=q.batch(1000,'live');
 perThousand.push({depth,chance:q.chance(depth),fixedMoteReward:q.motes(depth),kills:r.kills,luminous:r.luminousKills,motes:r.motesGained});
}
const samples=[];
for(const fixture of ['mid-game','farm-mode','parity-medium-farm','mature-high-power']){
 const s=clone(fixtures[fixture].save);
 Object.assign(s,{riftMode:'farm',farmDepth:s.depth,farmReturnDepth:s.depth+1,autoAscendEnabled:false,activeStudies:[],studyQueue:{},studyUseMotes:{},empowerQueue:{ember:false,tide:false,stone:false,gale:false,thorn:false,void:false,aurora:false,titan:false},motes:0,questDay:q.day()});
 q.set(s);
 // Fixtures can contain synthetic1-HP enemies. Complete one excluded warmup
 // kill to spawn canonical current-depth HP before measuring income.
 q.batch(1,'live');Object.assign(q.get(),{motes:0,moteNextAtMs:0,luminousAccum:0,enemyIsLuminous:false});
 const canonicalHp=q.get().enemyMaxHp,depth=q.get().depth;
 const initial=clone(q.get());
 for(const seconds of [60,600,3600]){q.set(initial);
 const r=q.advance(seconds,{kind:'live',clockStartMs:2000000000000});
 samples.push({fixture,depth,canonicalHp,seconds,kills:r.kills,luminous:r.luminousKills,motes:r.motesGained});}
}
const prices=[800,1500,3500,6500,10000,15000,20500,27500].map((base,i)=>({mult:[1.5,2,3,4,5,6,7,8][i],prices:[8,12,24].map((hours,j)=>Number((BigInt(base)*BigInt(hours)*BigInt([100,95,90][j])+799n)/800n))}));
const report={status:'observed-current-source',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),scope:'synthetic fixture observations, not player telemetry',perThousand,samples,delegatedBalance:{status:'implemented-candidate',luminousMotePayoutIntervalSeconds:60,keepCurrentFixedEligiblePayoutAndBonusPercentages:true,otherMoteSources:'Field Notes and Ascension Dust unchanged',prices}};
console.log(JSON.stringify(report,null,2));
