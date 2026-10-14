'use strict';
// One-time source surgery, preserving every byte outside named numeric owners.
// Uses Node's already-bundled parser; no game dependency or formatting pass.
const fs=require('node:fs'),assert=require('node:assert/strict');
const m={exports:{}};
new Function('exports','module',process.binding('natives')['internal/deps/acorn/acorn/dist/acorn'])(m.exports,m);
const parser=m.exports;
const file=process.argv[2]||'index.html',source=fs.readFileSync(file,'utf8');
if(process.argv.includes('--refresh-core')){
 const lib=fs.readFileSync('scripts/lib/game-amount.cjs','utf8'),factory=lib.slice(lib.indexOf('function createGameAmount()'),lib.indexOf('\nmodule.exports='));
 new Function(factory);
 const start=source.indexOf('function createGameAmount()'),end=source.indexOf('\nvar Amount=createGameAmount();',start);
 assert(start>=0&&end>start);fs.writeFileSync(file,source.slice(0,start)+factory+source.slice(end));console.log('Refreshed arithmetic core');process.exit(0);
}
if(process.argv.includes('--simplify-text')){
 const match=/<script>\s*([\s\S]*?)<\/script>/.exec(source),script=match[1],offset=match.index+match[0].indexOf(script),changes=[];
 function childNodes(n){const out=[];for(const v of Object.values(n)){if(Array.isArray(v)){for(const c of v)if(c&&c.type)out.push(c);}else if(v&&v.type)out.push(v);}return out;}
 function isAdd(n){return n.type==='CallExpression'&&n.callee.type==='MemberExpression'&&n.callee.object.name==='Amount'&&n.callee.property.name==='add';}
 function textNode(n){
  if(n.type==='Literal')return typeof n.value==='string'&&!/^-?\d+e-?\d+$/.test(n.value);
  if(isAdd(n))return n.arguments.some(textNode);
  if(n.type==='Identifier')return ['html','moduleHtml','ultimateHtml','resonanceHtml','rarityLabel','empowerHtml'].includes(n.name);
  if(n.type==='MemberExpression'&&!n.computed)return ['name','shortName','desc','textContent','innerHTML','abilityName'].includes(n.property.name);
  if(n.type==='CallExpression'&&n.callee.type==='Identifier')return ['formatNum','formatRiftNumber','costIcon','purchasePriceMarkup','wispPortrait','ultimateEffectText'].includes(n.callee.name);
  return false;
 }
 function pieces(n){if(isAdd(n)&&textNode(n))return n.arguments.flatMap(pieces);const raw=script.slice(n.start,n.end);return [n.type==='Literal'||n.type==='Identifier'||n.type==='CallExpression'||n.type==='MemberExpression'?raw:'('+raw+')'];}
 function scan(n){if(isAdd(n)&&textNode(n)){changes.push({start:n.start,end:n.end,text:'('+pieces(n).join(' + ')+')'});return;}for(const c of childNodes(n))scan(c);}
 scan(parser.parse(script,{ecmaVersion:2020}));let result=script;
 for(const c of changes.sort((a,b)=>b.start-a.start))result=result.slice(0,c.start)+c.text+result.slice(c.end);
 new Function(result);fs.writeFileSync(file,source.slice(0,offset)+result+source.slice(offset+script.length));console.log('Simplified '+changes.length+' text concatenations');process.exit(0);
}
assert(!source.includes('var Amount=createGameAmount();')||process.argv.includes('--extend'),'arithmetic already connected');
const match=/<script>\s*([\s\S]*?)<\/script>/.exec(source),script=match[1];
const offset=match.index+match[0].indexOf(script);
const owners=new Set([
 'labDiscountCost','labCanPay','labPercentBonus','labEncounterReward',
 'formatNum','purchasePriceColor','purchasePriceMarkup','refreshPurchasePriceColors',
 'getSpiritBuyPlan','treePaidEmpower','buyRarity','buyModule','buyUltimate','getNodeBuyPlan',
 'moduleCost','spiritCost','nodeCost','rarityCost','spiritPower','wispPower','totalActivePartyPower','chipEffectivePower',
 'effectivePartyPower','guardianTapBaseDamage','guardianTapDamageAt','passiveWispDpsAt','idleDps',
 'forgeBossAssessment','estimatedBossKillSeconds','abilityRawBurst','abilityBurstDamage','abilityRewardRaw','abilityRewardPerCast',
 'forgeSpillDamage','forgeAbilityRewards','averageAbilityDps','sustainedWispDps','automatedGuardianDps','sustainedCombatDps','abilityResourceRates',
 'enemyHpFor','enemyRewardFor','shardRewardFor','gainLumen','dealDamage','defeatEnemy','doTap','triggerAbility',
 'geometricSum','researchCostForLevels','maxAffordableLevels','getResearchBuyPlan','researchPreview','researchPreviewText','buyResearch','autoLabQueueTick',
 'studyCost','getStudyStartPlan','commitStudyStart','buyStudySpeed','getStudySpeedBuyPlan',
 'applyAscendMutation','treeAscendMotesForWallet','useSigilResonance','claimQuest','ensureDaily',
 'renderSpirits','renderHud','updateBattleFast','renderAscendSummary','refreshAffordability','autoEmpowerTick','treeRecruitReserveAmount',
 'wispRoleSnapshot','renderContribution','renderSideStats',
 'simulationCurrencyKillsNeeded','simulationLabCurrencyKillsNeeded','simulationKillsUntilEconomyMutation','simulationFarmEconomyBoundarySeconds',
 'simulationDefeatEnemy','simulationBatchFarmKills','simulationApplyFarmPassive','simulationPassiveKillSeconds','simulationApplyPushPassive',
 'simulationDealDiscreteDamage','simulationTriggerAbility','simulationWholeHpUnits',
 'cometMeteorHpPlan','getCometCommandPlan','getCometBuyPlan','getCometUpgradeBuyPlan','cometMeteorDisplayDamage',
 'buyShop','buyCometUpgrade','buyQuestRefresh','refreshDailyQuest','cometEligibleRift',
 'renderResearch','renderLongStudies','renderNodes','renderShop','renderCometCommandDock','renderCometShop',
 'advanceAuthoritativeTime'
]);
const ratioOwners=new Set(['estimatedBossKillSeconds','simulationPassiveKillSeconds','simulationFarmEconomyBoundarySeconds','simulationCurrencyKillsNeeded']);
if(process.argv.includes('--extend')){owners.clear();for(const name of process.argv[process.argv.indexOf('--extend')+1].split(','))owners.add(name);}
const ops={'+':'add','-':'sub','*':'mul','/':'div','%':'mod','<':'lt','<=':'le','>':'gt','>=':'ge'};
const method={min:'min',max:'max',pow:'pow',abs:'abs'};
const edits=[],found=new Set();
function children(node){const out=[];for(const value of Object.values(node)){if(Array.isArray(value)){for(const child of value)if(child&&child.type)out.push(child);}else if(value&&value.type)out.push(value);}return out;}
// Keep recursion explicit: braces avoid binding an else to the inner child test.
function walk(node,owner){
 if(node.type==='FunctionDeclaration')owner=node.id.name;
 const before=edits.length;visitShallow(node,owner);
 if(edits.length===before)for(const child of children(node))walk(child,owner);
}
function visitShallow(node,owner){
 if(!owners.has(owner))return;found.add(owner);
 if(node.type==='BinaryExpression'&&ops[node.operator]||node.type==='AssignmentExpression'&&['+=','-=','*=','/='].includes(node.operator))edits.push({start:node.start,end:node.end,node,owner});
 else if(node.type==='CallExpression'&&node.callee.type==='MemberExpression'&&!node.callee.computed){const obj=node.callee.object.name,key=node.callee.property.name;if(obj==='Math'&&(['floor','ceil','round'].includes(key)||method[key])||obj==='Number'&&['isFinite','isInteger'].includes(key))edits.push({start:node.start,end:node.end,node,owner});}
}
function render(node,owner){
 if(node.type==='FunctionDeclaration')owner=node.id.name;
 if(owners.has(owner)){
  if(node.type==='BinaryExpression'&&ops[node.operator])return 'Amount.'+(node.operator==='/'&&ratioOwners.has(owner)?'ratio':ops[node.operator])+'('+render(node.left,owner)+','+render(node.right,owner)+')';
  if(node.type==='AssignmentExpression'&&['+=','-=','*=','/='].includes(node.operator)){const lhs=script.slice(node.left.start,node.left.end);return lhs+'=Amount.'+ops[node.operator.charAt(0)]+'('+lhs+','+render(node.right,owner)+')';}
  if(node.type==='CallExpression'&&node.callee.type==='MemberExpression'&&!node.callee.computed){
   const obj=node.callee.object.name,key=node.callee.property.name,args=node.arguments.map(n=>render(n,owner));
   if(obj==='Math'&&['floor','ceil','round'].includes(key)){
    const n=node.arguments[0];if(key==='floor'&&n.type==='BinaryExpression'&&n.operator==='/')return 'Amount.floorRatio('+render(n.left,owner)+','+render(n.right,owner)+')';
    return 'Amount.round('+args.join(',')+',\''+key+'\')';
   }
   if(obj==='Math'&&method[key])return 'Amount.'+method[key]+'('+args.join(',')+')';
   if(obj==='Number'&&key==='isFinite')return 'Amount.valid('+args.join(',')+')';
   if(obj==='Number'&&key==='isInteger')return 'Amount.integer('+args.join(',')+')';
  }
 }
 const nested=children(node).sort((a,b)=>a.start-b.start);let text='',last=node.start;
 for(const child of nested){if(child.start<last)continue;text+=script.slice(last,child.start)+render(child,owner);last=child.end;}
 return text+script.slice(last,node.end);
}
walk(parser.parse(script,{ecmaVersion:2020}),null);
let result=script;
for(const edit of edits.sort((a,b)=>b.start-a.start))result=result.slice(0,edit.start)+render(edit.node,edit.owner)+result.slice(edit.end);
const lib=fs.readFileSync('scripts/lib/game-amount.cjs','utf8');
const factory=lib.slice(lib.indexOf('function createGameAmount()'),lib.indexOf('\nmodule.exports='));
if(!source.includes('var Amount=createGameAmount();'))result=result.replace('var SPIRITS = [',factory+'\nvar Amount=createGameAmount();\n\nvar SPIRITS = [');
new Function(result);
fs.writeFileSync(file,source.slice(0,offset)+result+source.slice(offset+script.length));
console.log(JSON.stringify({edits:edits.length,owners:[...found].sort(),notPresent:[...owners].filter(x=>!found.has(x))},null,2));
