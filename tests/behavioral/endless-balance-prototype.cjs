'use strict';
// Source-bound pre-implementation experiment. Never stage this file as product.
const fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8');
let candidate=source;
function edit(before,after){assert.equal(candidate.split(before).length,2,before);candidate=candidate.replace(before,after);}
const data={
 recruitment:{ember:{depth:1,lab:0},tide:{depth:3,lab:0},stone:{depth:6,lab:0},gale:{depth:15,lab:15},thorn:{depth:35,lab:18},void:{depth:55,lab:20},aurora:{depth:75,lab:21},titan:{depth:100,lab:22}},
 rarity:{level:[8,25,50,90,140],depth:[5,15,35,70,100],ascends:[0,1,5,15,40],lab:[0,5,12,20,29],forge:[0,1,3,6,10],shards:[15,1500,150000,5000000,250000000],lumen:[8,50,1000,50000,2500000]},
 ultimate:{sigils:{ember:15000,tide:18750,stone:22500,gale:30000,thorn:37500,void:45000,aurora:60000,titan:75000},module:15,depth:120,lab:30,forge:10,ascends:50},
 maxStudyWorkSec:604800
};
edit('var SPIRITS = [','var ENDLESS_PROTOTYPE = '+JSON.stringify(data)+';\nvar SPIRITS = [');
edit("function treeWispUnlockDepth(sp,snapshot){return Math.max(1,sp.unlockDepth-treeLevel('invitations',snapshot));}",
 "function treeWispUnlockDepth(sp,snapshot){var s=snapshot||state,g=ENDLESS_PROTOTYPE.recruitment[sp.id];return (s.longStudyLevels.wispascend||0)<g.lab?Infinity:Math.max(1,g.depth-treeLevel('invitations',s));}");
edit('var RARITY_LEVEL_REQUIREMENTS = [8,18,30,45,65];','var RARITY_LEVEL_REQUIREMENTS = ENDLESS_PROTOTYPE.rarity.level;');
edit('var RARITY_SHARD_COSTS = [15,90,900,15000,500000];','var RARITY_SHARD_COSTS = ENDLESS_PROTOTYPE.rarity.shards;');
edit('var RARITY_LUMEN_BASE_MULTS = [8,20,80,400,2400];','var RARITY_LUMEN_BASE_MULTS = ENDLESS_PROTOTYPE.rarity.lumen;');
edit('if(level < rarityReq(tier)) return;',`if(level < rarityReq(tier)) return;
  var g=ENDLESS_PROTOTYPE.rarity;
  if(state.maxDepthEver<g.depth[tier] || state.ascendCount<g.ascends[tier] || longStudyLevel('wispascend')<g.lab[tier] || researchLevel('arcanecal')<g.forge[tier]) return;`);
edit("function ultimateSigilCost(sp){ return labDiscountCost(Math.round(5 + sp.unlockDepth*2),2*labExpansionLevel('ultimateanalysis')); }",
 "function ultimateSigilCost(sp){ return labDiscountCost(ENDLESS_PROTOTYPE.ultimate.sigils[sp.id],2*labExpansionLevel('ultimateanalysis')); }");
edit('if(tier<5 || ultimateUnlocked(sp.id)) return;',`if(tier<5 || ultimateUnlocked(sp.id)) return;
  var g=ENDLESS_PROTOTYPE.ultimate;
  if(moduleLevel(sp.id)<g.module || state.maxDepthEver<g.depth || longStudyLevel('wispascend')<g.lab || researchLevel('arcanecal')<g.forge || state.ascendCount<g.ascends) return;`);
edit('var work=Math.round(node.baseDurationSec * Math.pow(node.durationGrowth, level));','var work=Math.round(Math.min(ENDLESS_PROTOTYPE.maxStudyWorkSec,node.baseDurationSec * Math.pow(node.durationGrowth, level)));');
const out=process.argv[3]||'docs/qa/endless-progression-001/candidate-balance.html';
fs.writeFileSync(out,candidate);
fs.writeFileSync(out.replace(/\.html$/,'.json'),JSON.stringify(data,null,2)+'\n');
console.log('Wrote isolated balancing experiment '+out);
