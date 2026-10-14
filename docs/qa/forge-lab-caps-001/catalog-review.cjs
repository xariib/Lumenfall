'use strict';
// Read-only production catalog observation. Hypothetical endpoints use the
// existing price/work functions, never change the product or its catalog caps.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..');
const {app:forgeApp,seed:forgeSeed}=require(path.join(root,'tests/behavioral/forge-expansion-harness.cjs'));
const {app:labApp,seed:labSeed}=require(path.join(root,'tests/behavioral/lab-expansion-harness.cjs'));
const {exactCost}=require(path.join(root,'tests/behavioral/forge-expansion.cjs'));
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const hash=crypto.createHash('sha256').update(source).digest('hex');
const {q:f}=forgeApp(source),{q:l}=labApp(source);
let checks=0;
function eq(a,b,label){checks++;assert.deepEqual(a,b,label);}
function ok(value,label){checks++;assert.ok(value,label);}
function finite(record,label){for(const [key,value] of Object.entries(record)){checks++;assert(Number.isFinite(value)&&value>=0,label+' '+key);}}
function labState(optimized=false){
  const s=labSeed(l);s.activeStudies=[];
  Object.keys(s.studyQueue).forEach(id=>s.studyQueue[id]=false);
  Object.keys(s.longStudyLevels).forEach(id=>s.longStudyLevels[id]=0);
  if(optimized){
    l.expansion().forEach(node=>s.longStudyLevels[node.id]=1);
    Object.assign(s.longStudyLevels,{labcapacity:2,procurement:10,catalysis:10,focusprotocol:5,curriculum:3});
  }
  l.set(s);
}
const forge=f.defs().filter(node=>!node.retiredTo);
const lab=l.projects().filter(node=>!node.retiredTo);
eq(forge.length,20,'twenty current Forge tracks');eq(lab.length,20,'twenty current Lab projects');
const report={status:'PASS',phase:'read-only proposal; no cap implementation',sourceSha256:hash,node:process.version,forge:[],lab:[],capReproduction:[],proposals:[],roundingDiagnostics:[]};
for(const node of forge){
  const state=forgeSeed(f);state.research[node.id]=node.levelCap;f.set(state);
  const before=JSON.stringify(f.get());
  eq(f.plan(node.id,1).reason,'maxed','current Forge cap: '+node.id);
  eq(f.buy(node.id,1),false,'current Forge rejects further purchase: '+node.id);
  eq(JSON.stringify(f.get()),before,'rejected Forge buy preserves state: '+node.id);
  const last=f.cost(node.id,node.levelCap-1,1);finite(last,node.id+' current last price');
  const full=f.cost(node.id,0,node.levelCap);finite(full,node.id+' current total');
  report.forge.push({...node,firstPrice:f.cost(node.id,0,1),lastPrice:last,zeroToCapBulkPrice:full,effectAtCap:f.effect(node.id,node.levelCap)});
  report.capReproduction.push({system:'Forge',id:node.id,cap:node.levelCap,reason:'maxed',rejected:true,stateUnchanged:true});
}
labState();
for(const node of lab){
  const firstPrice=l.cost(node.id,0),firstWork=l.duration(node.id,0);finite(firstPrice,node.id+' first price');
  const row={...node,cap:node.levelCap===undefined?'none':node.levelCap,firstPrice,firstWorkSec:firstWork};
  if(node.levelCap!==undefined){
    labState();l.get().longStudyLevels[node.id]=node.levelCap;
    const before=JSON.stringify(l.get());
    eq(l.plan(node.id).reason,'maxed','current Lab cap: '+node.id);
    eq(l.start(node.id),false,'current Lab rejects start: '+node.id);
    eq(JSON.stringify(l.get()),before,'rejected Lab start preserves state: '+node.id);
    labState();row.lastPrice=l.cost(node.id,node.levelCap-1);row.lastWorkSec=l.duration(node.id,node.levelCap-1);
    row.effectAtCap=l.effect(node.id,node.levelCap);finite(row.lastPrice,node.id+' current last price');
    report.capReproduction.push({system:'Lab',id:node.id,cap:node.levelCap,reason:'maxed',rejected:true,stateUnchanged:true});
  }else{
    labState();row.level20Price=l.cost(node.id,19);row.level20WorkSec=l.duration(node.id,19);row.level20Effect=l.effect(node.id,20);
  }
  report.lab.push(row);
}
eq(report.lab.filter(row=>row.cap==='none').length,5,'five current foundations are uncapped');
// Four candidate IDs have steady damage/resource effects, without changing
// charge cadence, encounter chance, discounts, slots or Resonate run limits.
for(const id of ['arcanecal','conduction'])for(const cap of [10,20,50,100]){
  const node=f.node(id),lastPrice=f.cost(id,cap-1,1),total=f.cost(id,0,cap);
  const extra=cap>10?f.cost(id,10,cap-10):{lumen:0,shard:0};
  finite(lastPrice,id+' projected final price');finite(total,id+' projected total');finite(extra,id+' projected extension');
  report.proposals.push({system:'Forge',id,name:node.name,currentCap:10,proposedCap:cap,implemented:false,
    effectBonus:node.effectPerLevel*cap,effectFactor:1+node.effectPerLevel*cap,
    factorRelativeToCap10:(1+node.effectPerLevel*cap)/(1+node.effectPerLevel*10),
    lastPrice,zeroToCapBulkPrice:total,tenToCapBulkPrice:extra,
    lastPriceSafeIntegers:Object.values(lastPrice).every(Number.isSafeInteger),
    notes:'Existing generic geometric price path extrapolated; live purchase remains capped at10. No time-to-afford claim.'});
  if(cap<=50){
    const diagnostic={id,cap,baselineMismatchQueries:0,extensionMismatchQueries:0,maximumCurrencyDifference:0,first:null};
    for(let start=0;start<cap;start++)for(let qty=1;qty<=cap-start;qty++){
      const actual=f.cost(id,start,qty),rational=exactCost({cap,lumen:node.lumenBase,shard:node.shardBase,growth:160},start,qty);
      if(actual.lumen!==rational.lumen||actual.shard!==rational.shard){
        diagnostic[start+qty<=10?'baselineMismatchQueries':'extensionMismatchQueries']++;
        diagnostic.maximumCurrencyDifference=Math.max(diagnostic.maximumCurrencyDifference,Math.abs(actual.lumen-rational.lumen),Math.abs(actual.shard-rational.shard));
        diagnostic.first||={start,qty,actual,rational};
      }
    }
    report.roundingDiagnostics.push(diagnostic);
  }
}
for(const id of ['bossledger','luminousdistill'])for(const cap of [10,20,50,100]){
  const node=lab.find(row=>row.id===id),perLevel=id==='bossledger'?0.05:0.10;
  const scenarios=[];
  for(const optimized of [false,true]){
    labState(optimized);
    const finalPrice=l.cost(id,cap-1),finalWorkSec=l.duration(id,cap-1);finite(finalPrice,id+' projected final price');
    let extraLumen=0,extraShards=0,extraWorkSec=0;
    for(let level=10;level<cap;level++){const price=l.cost(id,level);extraLumen+=price.lumen;extraShards+=price.shard;extraWorkSec+=l.duration(id,level);}
    finite({finalWorkSec,extraLumen,extraShards,extraWorkSec},id+' projected work/cost');
    scenarios.push({optimized,finalPrice,finalWorkSec,finalWallSecondsAt8x:finalWorkSec/8,
      tenToCapStartPrices:{lumen:extraLumen,shard:extraShards},tenToCapWorkSec:extraWorkSec,tenToCapWallSecondsAt8x:extraWorkSec/8,
      speed8xMotesPerLevel:l.speedCost(8),speed8xMotesForExtension:Math.max(0,cap-10)*l.speedCost(8),
      assumptions:optimized?'Procurement10, Catalysis10, Focus5, Curriculum3, Capacity2, ten counted subjects, no other active work: cost80%, work49%. All these helpers already earned. Each level buys 8x.':
      'No Procurement/Focus/Curriculum discounts; each level buys 8x separately. No time to acquire material or Motes included.'});
  }
  report.proposals.push({system:'Lab',id,name:node.name,currentCap:10,proposedCap:cap,implemented:false,effectBonus:perLevel*cap,
    effectFactor:1+perLevel*cap,factorRelativeToCap10:(1+perLevel*cap)/(1+perLevel*10),scenarios,
    notes:'Future price/work formula extrapolation, not permission to start or simulated campaign reach time. Offline productive time remains capped at12h per catch-up.'});
}
labState();
// Preserve the source throughout analysis; do not edit an in-memory catalog.
eq(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'index.html'))).digest('hex'),hash,'product bytes unchanged');
report.checks=checks;
fs.writeFileSync(path.join(__dirname,'catalog.json'),JSON.stringify(report,null,2)+'\n');
const fmt=n=>n<1e9?n.toLocaleString('en-US'):n.toExponential(4);
const pair=p=>fmt(p.lumen)+' L / '+fmt(p.shard)+' S';
let md='# Current Forge and Lab catalog\n\nRead-only live source `'+hash+'`. Node '+process.version+'.\nTwenty active tracks per system; retired entries excluded from new purchases.\nPrices below are neutral, without Lab discounts. Last means the purchase that\nearns the published cap (raw level cap−1). Shard values use the game price key shard.\n\n';
md+='| Forge track (ID) | Cap | Unlock Rift | First cost | Final cost | Published effect |\n|---|---:|---:|---|---|---|\n';
for(const n of report.forge)md+='|'+n.name+' (`'+n.id+'`)|'+n.levelCap+'|'+(n.unlockDepth||1)+'|'+pair(n.firstPrice)+'|'+pair(n.lastPrice)+'|'+n.desc.replace(/\|/g,'\\|')+'|\n';
md+='\n| Lab project (ID) | Cap | Unlock Rift | First cost | First work (seconds) | Published effect |\n|---|---:|---:|---|---:|---|\n';
for(const n of report.lab)md+='|'+n.name+' (`'+n.id+'`)|'+n.cap+'|'+(n.unlockDepth||1)+'|'+pair(n.firstPrice)+'|'+n.firstWorkSec+'|'+n.desc.replace(/\|/g,'\\|')+'|\n';
md+='\nThe five uncapped foundations keep linear earned bonuses, but prices grow1.8x\nand work1.6x per level. Level20 price/work measurements and all capped endpoints\nare in catalog.json. No numeric cap is applied to those foundations by this review.\n';
fs.writeFileSync(path.join(__dirname,'CATALOG.md'),md);
console.log(JSON.stringify({status:report.status,checks,forge:forge.length,lab:lab.length,sourceSha256:hash}));
