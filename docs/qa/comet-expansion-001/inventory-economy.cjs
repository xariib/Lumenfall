'use strict';
// Read-only observations of a pinned, published candidate and proposal arithmetic.
// This is not an implementation of the proposed commands or an acceptance suite.
const fs = require('node:fs');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const path = require('node:path');
const root = '/workspace/scratch/0848c4e4f365/Lumenfall-tree';
const ref = '3c931a26bbcf7b009dee03e7411ed41faeb971f8';
const get = name => cp.execFileSync('git', ['show', ref + ':' + name], {cwd:root});
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const source = get('index.html');
const fixtureBytes = get('tests/behavioral/fixtures.json');
const harnessBytes = get('tests/behavioral/tree-expansion-harness.cjs');
const Module = require('node:module');
const moduleCopy = new Module(path.join(root, 'tests/behavioral/tree-expansion-harness.cjs'), module);
moduleCopy.filename = path.join(root, 'tests/behavioral/tree-expansion-harness.cjs');
moduleCopy.paths = Module._nodeModulePaths(path.dirname(moduleCopy.filename));
moduleCopy._compile(harnessBytes.toString(), moduleCopy.filename);
const {app, clone} = moduleCopy.exports;
const fixtures = JSON.parse(fixtureBytes);
const baseline = app(source.toString()).q;
const deeds = baseline.achievementDefs().map(a => ({id:a.id, name:a.name, comets:a.reward}));
const observations = ['parity-early-simple', 'mid-game', 'mature-high-power'].map(id => {
  const q = app(source.toString()).q, raw = fixtures[id].save;
  q.set(clone(raw));
  const s = q.get();
  return {
    fixture:id, rawComets:raw.comets, canonicalComets:s.comets,
    record:s.maxDepthEver, currentRift:s.depth, ascends:s.ascendCount,
    knownOwned:clone(s.owned), historicalCometPurchases:clone(s.legacyCometPurchases),
    f26CometRefund:s.offline12hRefund ? {amount:s.offline12hRefund.comets, paid:s.offline12hRefund.cometsPaid} : null,
    earnedDeedIds:Object.keys(s.achieved).filter(k => s.achieved[k]),
    moteQuotesBeforeOptionalSupport:[49,99,249].map(depth => ({depth, motes:q.motes(depth)})),
    scope:'Read-only canonicalization of frozen public fixture; no tick, rewards, purchase or proposed migration executed.'
  };
});
const prices = {
  autoascend:[100], meteor:[100], starcall:[140], cometreservoir:[60,120],
  cometcycle:[80,140,220], meteorcore:[45,75,120,180]
};
const totals = Object.fromEntries(Object.entries(prices).map(([id,p]) => [id,p.reduce((a,b)=>a+b,0)]));
const exactCredit = (wallet,amount) => {
  const next = wallet + amount;
  return Number.isFinite(next) && next-wallet===amount && next-amount===wallet;
};
const refunds = [0,2**54,2**55,1e30].map(wallet => {
  const start=wallet,items=[];
  for(const [id,amount] of [['comettrials',140],['rifttrail',50],['starfallcrest',160]]) {
    const observedDelta = (wallet+amount)-wallet,paid=exactCredit(wallet,amount);
    if(paid)wallet+=amount;
    items.push({id,amount,paid,observedAttemptDelta:observedDelta});
  }
  return {initial:start,final:wallet,representedCredit:wallet-start,items,pending:items.reduce((n,x)=>n+(x.paid?0:x.amount),0)};
});
const exactDebit = (wallet,cost) => {
  const next=wallet-cost;
  return Number.isFinite(wallet) && Number.isFinite(next) && next>=0 && wallet-next===cost && next+cost===wallet;
};
const workPerKill=[20,25,32,40];
const newDeeds=[
  {id:'comet_first_command',comets:5}, {id:'comet_first_recharge',comets:10},
  {id:'comet_boss_strike',comets:15}, {id:'comet_called_kill',comets:20}
];
const meteorExamples=[
  {case:'ordinary percentage limit',maxHp:1000,currentHp:1000,unbuffedPartyDps:50},
  {case:'bounded execution',maxHp:1000,currentHp:350,unbuffedPartyDps:50},
  {case:'party limit binds both ranks',maxHp:10000,currentHp:10000,unbuffedPartyDps:100},
  {case:'party supports full rank benefit',maxHp:10000,currentHp:10000,unbuffedPartyDps:500},
  {case:'arbitrary extreme boss is not bypassed',maxHp:1e18,currentHp:1e18,unbuffedPartyDps:1e6},
  {case:'no active power',maxHp:1000,currentHp:1000,unbuffedPartyDps:0}
].map(x=>({...x,rank0Damage:Math.min(Math.floor(x.maxHp*.20),Math.floor(12*x.unbuffedPartyDps)),rank4Damage:Math.min(Math.floor(x.maxHp*.40),Math.floor(12*x.unbuffedPartyDps))}));
const controls={
  deedPool:deeds.reduce((n,a)=>n+a.comets,0),
  proposedNewDeeds:newDeeds,newDeedComets:newDeeds.reduce((n,a)=>n+a.comets,0),combinedProposedDeedComets:683+newDeeds.reduce((n,a)=>n+a.comets,0),
  newMaximumCost:Object.entries(totals).filter(([id])=>id!=='autoascend').reduce((n,[,v])=>n+v,0),
  completeMaximumCost:Object.values(totals).reduce((n,v)=>n+v,0),
  oldRetiredPrice:140+50+160,
  refundStarter:{availablePrincipal:350,purchases:['meteor','starcall','cometreservoir:1','meteorcore:1'],cost:100+140+60+45,remainingPrincipal:350-100-140-60-45,requiredNewDeedCredits:5+15,normalWalletRemainingAtLeast:25},
  allDeedsExample:{availablePrincipal:683,purchases:['autoascend','meteor','starcall','cometreservoir:1..2','cometcycle:1','meteorcore:1'],cost:100+100+140+60+120+80+45,remainingPrincipal:683-100-100-140-60-120-80-45,requiredNewDeedCredits:5+10+15,normalWalletRemainingAtLeast:68},
  weeklyLogin:5+8+12+16+20+25+40,
  theoreticalThreeDistinctQuestComets:{minimum:8+10+10,maximum:25+20+18,qualification:'Bounds from distinct quest rewards only; actual deterministic daily choice/eligibility/completion is not guaranteed.'},
  commandSupply:workPerKill.map((units,rank)=>({rank,unitsPerKill:units,defeatsPerCharge:4000/units,extraChargesIn2000Defeats:Math.floor(2000*units/4000)})),
  meteor:[11,1000,999999].map(hp=>({enemyMaxHp:hp,damage:[20,25,30,35,40].map(percent=>({percent,damage:Math.floor(hp/100)*percent+Math.floor((hp%100)*percent/100)}))})),
  meteorPowerBoundExamples:meteorExamples,
  refundRepresentability:refunds,
  debitRepresentability:[[100,100],[1e16,100],[2**54,45],[2**54,100],[1e30,100],[1e30,25]].map(([wallet,cost])=>({wallet,cost,representedDebit:wallet-(wallet-cost),accepted:exactDebit(wallet,cost)}))
};
const result={
  purpose:'Published-source inventory plus independent arithmetic for an UNACCEPTED Comet proposal; no new command or refund migration has been implemented or acceptance-tested.',
  publishedHead:ref,productSha256:hash(source),productBytes:source.length,
  fixtureSha256:hash(fixtureBytes),fixtureBytes:fixtureBytes.length,harnessSha256:hash(harnessBytes),
  node:process.version,v8:process.versions.v8,localHeadAtRead:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),
  deeds,publicFixtureSnapshots:observations,proposedPrices:prices,proposedCostTotals:totals,proposalArithmetic:controls,
  observationsOnly:true,privateSaveUsed:false
};
fs.writeFileSync(path.join(__dirname,'inventory-economy.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({productSha256:result.productSha256,fixtureSha256:result.fixtureSha256,deedCount:deeds.length,oldCometPool:controls.deedPool,proposedMaximumCost:controls.completeMaximumCost,fixtureBudgets:observations.map(x=>({id:x.fixture,raw:x.rawComets,canonical:x.canonicalComets,record:x.record,owned:x.knownOwned,oldRefund:x.f26CometRefund})),outputs:'inventory-economy.json'},null,2));
