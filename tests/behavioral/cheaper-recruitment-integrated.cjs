'use strict';
// Current collection integration: complete production IIFE and real storage
// transactions. Original-price BigInt totals are independent value oracles.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,seed,clone}=require('./tree-expansion-harness.cjs');
const source=fs.readFileSync(process.argv[2]||require('node:path').join(__dirname,'../../index.html'),'utf8');
let checks=0;
const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);};
const balance=s=>BigInt(s.prisms)+s.refundCredits.prisms.reduce((sum,e)=>sum+BigInt(e.amount),0n);
// Immutable original reference captured before production canonical tables;
// host Math.pow is deliberately not the deterministic-refund oracle.
const observed=require('./cheaper-receipt-prices.json');
const originalPrices=observed.modern.map((value,index)=>Math.max(value,observed.legacy[index]));
const owed=raw=>originalPrices.slice(0,Math.max(0,raw-20)).reduce((n,price)=>n+BigInt(price),0n);
const records=[];
for(const [raw,wallet] of [[0,17],[20,17],[21,17],[40,17],[95,0],[2000,0],[21,1e30]]){
  const a=app(source),q=a.q,s=seed(q);s.nodes.bonds=raw;s.prisms=wallet;
  delete s.feedbackMigration;delete s.refundCredits;
  s.activeStudies=[{id:'guardmastery',remainingSec:70,totalDurationSec:150,speedMult:4}];
  s.nodes.gentlegrowth=3;s.nodes.motedust=2;s.research.tapconduit=2;
  const original=clone(s);q.set(s);const accepted=clone(q.get());
  eq(balance(accepted),BigInt(wallet)+owed(raw),'exact original value '+raw);
  eq(s,original,'input unchanged');eq(accepted.nodes.bonds,raw,'raw history');
  eq(accepted.activeStudies,s.activeStudies,'paid Study snapshot');
  eq(accepted.nodes.gentlegrowth,3,'current Tree ownership');eq(accepted.research.tapconduit,2,'current Forge ownership');
  eq(q.accept(accepted),accepted,'repeat canonicalization');eq(q.decode(q.encode(accepted)),accepted,'backup roundtrip');
  if(raw>20){for(const lostProof of ['none','marker','history']){const damaged=clone(accepted);delete damaged.feedbackMigration.receipts['node.bonds'];if(lostProof==='marker')delete damaged.feedbackMigration.bondsCreditAuditVersion;if(lostProof==='history')delete damaged.feedbackMigration.history;checks++;assert.throws(()=>q.accept(damaged),{code:'invalid-bonds-refund'},'either completed proof requires recovery: '+lostProof);}}
  q.save();eq(app(source,a.storage).q.get(),q.get(),'cold load');
  records.push({raw,wallet,value:balance(accepted).toString()});
}
// Every current Tree purchase consumes an exact quoted price from the same
// credit ledger. No historical bundle can replace the accepted catalog.
{
  const probe=app(source);
  for(const def of probe.q.defs().filter(d=>!d.retired&&!d.retiredTo&&d.id!=='bonds')){
    const a=app(source),q=a.q,s=seed(q);s.nodes.bonds=21;s.prisms=1e30;
    s.maxDepthEver=1000;s.nodes.swift=10;
    q.defs().forEach(d=>{if(d.requiresAchievement)s.achieved[d.requiresAchievement]=true;});
    delete s.feedbackMigration;delete s.refundCredits;q.set(s);
    const plan=q.plan(def.id),before=clone(q.get());eq(plan.affordable,true,'credit can buy '+def.id);
    eq(q.buy(def.id),true,'real purchase '+def.id);eq(balance(q.get()),balance(before)-BigInt(plan.cost),'exact price '+def.id);
    eq(q.get().nodes[def.id],before.nodes[def.id]+1,'one level '+def.id);
    eq(q.get().prisms,1e30,'large existing wallet retained '+def.id);
    eq(q.accept(q.get()),q.get(),'debit receipt accepted '+def.id);
  }
}
for(const fault of ['primary','recovery']){
  const a=app(source),q=a.q,s=seed(q);s.nodes.bonds=21;s.prisms=1e30;
  delete s.feedbackMigration;delete s.refundCredits;q.set(s);q.save();
  const before=clone(q.get());eq(q.plan('lumenmemory').cost,8,'accepted first Lumen Memory price');a.fail(fault==='primary',fault==='recovery');
  eq(q.buy('lumenmemory'),fault!=='primary','authoritative primary transaction '+fault);
  if(fault==='primary'){eq(q.get(),before,'wallet/receipt/ownership rollback');a.fail(false,false);eq(q.buy('lumenmemory'),true,'retry');}
  eq(balance(q.get()),balance(before)-8n,'one exact credit debit');
  eq(app(source,a.storage).q.get(),q.get(),'authoritative persisted endpoint');
}
// Existing fixed-12h restitution settles independently of F21.
{
  const a=app(source),q=a.q,s=seed(q);s.schemaVersion=1;s.nodes.bonds=21;s.nodes.reserves=4;s.prisms=7;
  s.owned.offline24=true;s.owned.offline48=true;delete s.feedbackMigration;delete s.refundCredits;q.set(s);
  eq(q.get().prisms,3440,'original F26+F21 Prism prices');eq(q.get().comets,s.comets+300,'original F26 Comets');
  eq(q.offlineCap(),12,'fixed12h');eq(q.accept(q.get()),q.get(),'separate ledgers idempotent');
}
const result={status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),records,scope:'current twenty-path Tree, exact restitution, paid Studies, Forge ownership, cold load, backup, transactional storage failures and F26 coexistence; native acceptance separate'};
if(process.argv[3])fs.writeFileSync(process.argv[3],JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
