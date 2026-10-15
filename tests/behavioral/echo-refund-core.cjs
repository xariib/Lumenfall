'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),path=require('node:path');
const {app,clone}=require('./tree-expansion-harness.cjs');
const source=fs.readFileSync(process.argv[2]||path.join(__dirname,'../../index.html'),'utf8');
function contracts(html){
 let checks=0;const records=[],eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);};
 const value=s=>BigInt(Math.floor(s.prisms))+s.refundCredits.prisms.reduce((n,e)=>n+BigInt(e.amount),0n);
 const observedRecruitment=require('./cheaper-receipt-prices.json');
 const originalPrices=Object.assign({},require('./refund-original-modern-prices.json').modern,
  {bonds:observedRecruitment.modern.map((n,i)=>Math.max(n,observedRecruitment.legacy[i]))});
 const owed=(raw,cap,growth)=>{assert(cap===6&&growth===1.4||cap===20&&growth===1.45,'original curve identity');return originalPrices[cap===6?'echo':'bonds'].slice(0,Math.max(0,raw-cap)).reduce((n,p)=>n+BigInt(p),0n);};
 const old=(q,raw,wallet,bonds=0)=>{const s=q.fresh();s.nodes.echo=raw;s.nodes.bonds=bonds;s.prisms=wallet;s.questDay=q.day();delete s.feedbackMigration;delete s.refundCredits;s.activeStudies=[{id:'guardmastery',remainingSec:70,totalDurationSec:150,speedMult:4}];return s;};
 for(const [raw,wallet,bonds] of [[0,17,0],[5,17,0],[6,17,0],[7,17,0],[10,17,21],[95,0,40],[2000,0,2000],[2100,0,0],[1e300,0,0],[7,.1,0],[7,.5,0],[7,1e30,21]]){
  const a=app(html),q=a.q,s=old(q,raw,wallet,bonds),original=clone(s);q.set(s);const accepted=clone(q.get());
  eq(value(accepted),BigInt(Math.floor(wallet))+owed(raw,6,1.4)+owed(bonds,20,1.45),'original total value '+raw+'/'+wallet);
  eq(accepted.prisms-Math.floor(accepted.prisms),wallet-Math.floor(wallet),'original fractional balance');
  eq(s,original,'input immutable');eq(accepted.nodes.echo,raw,'raw Echo ownership');eq(accepted.nodes.bonds,bonds,'raw recruitment ownership');eq(accepted.activeStudies,s.activeStudies,'paid Study snapshot');
  eq(q.offlineRate(),Math.min(1,.70+Math.min(raw,6)*.05),'unchanged capped rate');eq(q.offlineCap(),12,'fixed time cap');
  eq(q.accept(accepted),accepted,'second normalization never refunds again');eq(q.decode(q.encode(accepted)),accepted,'full backup roundtrip');
  q.save();eq(app(html,a.storage).q.get(),q.get(),'actual primary cold load');
  if(raw>6){for(const lostProof of ['none','marker','history']){const bad=clone(accepted);delete bad.feedbackMigration.receipts['node.echo'];if(lostProof==='marker')delete bad.feedbackMigration.echoCreditAuditVersion;if(lostProof==='history')delete bad.feedbackMigration.history;checks++;assert.throws(()=>q.accept(bad),{code:'invalid-echo-refund'},'either completed proof requires recovery: '+lostProof);}}
  else eq(accepted.feedbackMigration.receipts['node.echo'],undefined,'no refund below cap');
  records.push({raw,wallet,bonds,total:value(accepted).toString(),creditEntries:accepted.refundCredits.prisms.length});
 }
 {
  const q=app(html).q;q.set(old(q,20,0));eq(q.get().feedbackMigration.receipts['node.echo'].amounts.prisms,[16,22,30,42,58,81,114,159,223,312,436,610,854,1196],'literal original prices6..19');eq(q.get().prisms,4153,'literal original restitution');
 }
 // The finite-price suffix must never acquire infinite tolerance bounds.
 for(const [id,cap] of [['echo',6],['bonds',20]])for(const raw of [0,cap]){
  const a=app(html),q=a.q,s=old(q,id==='echo'?raw:0,17,id==='bonds'?raw:0);q.set(s);q.save();const accepted=clone(q.get()),bad=clone(accepted);
  bad.feedbackMigration.receipts['node.'+id]={from:cap,to:raw,unpricedFrom:0,amounts:{prisms:[]},creditAuditVersion:1,remainingCredits:[]};checks++;assert.throws(()=>q.accept(bad),{code:id==='echo'?'invalid-echo-refund':'invalid-bonds-refund'},'completed receipt requires a real overcap purchase range '+id+'/'+raw);a.storage.set('lumenfall_save_v2',JSON.stringify(bad));q.load();eq(q.get(),accepted,'empty/inverted refund range selects intact actual recovery '+id+'/'+raw);
 }
 {
  const a=app(html),q=a.q;q.set(old(q,2100,0));q.save();const accepted=clone(q.get());
  for(const index of [2085,2099]){const bad=clone(accepted);bad.feedbackMigration.receipts['node.echo'].amounts.prisms[index-6]=1;checks++;assert.throws(()=>q.accept(bad),{code:'invalid-echo-refund'},'finite original suffix rejects corrupted price '+index);a.storage.set('lumenfall_save_v2',JSON.stringify(bad));q.load();eq(q.get(),accepted,'actual recovery preserves huge original suffix '+index);}
 }
 for(const raw of [6,7,2000]){
  const a=app(html),q=a.q;q.set(old(q,raw,1000000));const before=clone(q.get());for(let i=0;i<100;i++)eq(q.buy('echo'),false,'cap blocks repeated canonical handler');eq(q.get(),before,'cap retains all value');eq(q.rawBuy({id:'echo',baseCost:0}),false,'alias cannot bypass canonical identity');
 }
 // Ordinary wallet-only purchases remain exact after merging the planner;
 // mixed-credit cases alone cannot detect a skipped numeric-wallet debit.
 {
  const q=app(html).q,s=q.fresh();s.prisms=17;q.set(s);
  eq(q.plan('echo').cost,2,'literal first Echo wallet price');
  eq(q.buy('echo'),true,'ordinary wallet buys first Echo');
  eq(q.get().prisms,15,'ordinary wallet is debited exactly');
  eq(q.get().nodes.echo,1,'one purchased Echo level');
  eq(q.get().feedbackMigration.receipts['node.echo'],undefined,'below-cap payment creates no refund');
 }
 // Every current Tree purchase pays the actual quoted price from mixed credits.
 {
  const probe=app(html).q;
  for(const def of probe.defs().filter(n=>!n.retired&&!n.retiredTo&&n.id!=='echo'&&n.id!=='bonds')){
   const a=app(html),q=a.q,s=old(q,10,1e30,21);s.maxDepthEver=1000;s.nodes.swift=10;for(const d of q.defs())if(d.requiresAchievement)s.achieved[d.requiresAchievement]=true;q.set(s);
   const before=clone(q.get()),plan=q.plan(def.id);eq(plan.affordable,true,'mixed credit quote '+def.id);eq(q.buy(def.id),true,'actual mixed-credit buy '+def.id);
   eq(value(q.get()),value(before)-BigInt(plan.cost),'one exact quoted debit '+def.id);eq(q.get().prisms,1e30,'large wallet preserved');eq(q.accept(q.get()),q.get(),'both remaining-credit audits reconcile');
  }
 }
 // Spend Echo's own credit and preserve each other permanent ledger.
 {
  const a=app(html),q=a.q;q.set(old(q,7,1e30));eq(q.buy('swift'),true,'Echo-only credit payment');eq(q.get().refundCredits.prisms,[{id:'node.echo',amount:13}],'exact Echo debit');eq(q.get().feedbackMigration.receipts['node.echo'].remainingCredits,[13],'Echo debit audit');eq(q.accept(q.get()),q.get(),'spent Echo record canonical');
 }
 // Large credit and wallet balances now fund an exactly debited paid level.
 {
  const integer=require('./amount-oracle.cjs').integer,q=app(html).q;q.set(old(q,250,1e100));const s=clone(q.get()),large=s.refundCredits.prisms.find(e=>e.id==='node.echo'&&e.amount>1e25);assert(large);s.prisms=0;s.refundCredits.prisms=[large];s.feedbackMigration.receipts['node.echo'].remainingCredits=[large.amount];q.set(s);const before=clone(q.get());eq(q.buy('swift'),true,'large credit funds a paid Swift level');eq(integer(q.get().prisms)+q.get().refundCredits.prisms.reduce((n,r)=>n+integer(r.amount),0n),BigInt(large.amount)-3n,'large credit exact conservation');eq(q.get().nodes.swift,before.nodes.swift+1,'one paid Swift level');eq(q.accept(q.get()),q.get(),'wide spent credit and audit remain canonical');
  q.set(old(q,7,1e30));const empty=clone(q.get());empty.refundCredits.prisms=[];empty.feedbackMigration.receipts['node.echo'].remainingCredits=[];q.set(empty);const wallet=integer(q.get().prisms);eq(q.buy('swift'),true,'large wallet funds a paid Swift level');eq(integer(q.get().prisms),wallet-3n,'large wallet exact conservation');
 }
 for(const damage of ['price','range','missing','audit','deleted-credit','duplicated-credit','changed-credit','missing-balance','version']){
  const a=app(html),q=a.q;q.set(old(q,95,1e30));q.save();const accepted=clone(q.get()),bad=clone(accepted),r=bad.feedbackMigration.receipts['node.echo'];
  if(damage==='price')r.amounts.prisms[0]=1;if(damage==='range')r.to++;if(damage==='missing')delete bad.feedbackMigration.receipts['node.echo'];if(damage==='audit')r.creditAuditVersion=2;
  if(damage==='deleted-credit')bad.refundCredits.prisms=[];if(damage==='duplicated-credit')bad.refundCredits.prisms.push(bad.refundCredits.prisms[0]);if(damage==='changed-credit')bad.refundCredits.prisms[0].amount++;
  if(damage==='missing-balance')delete r.remainingCredits;if(damage==='version')bad.feedbackMigration.echoCreditAuditVersion=2;
  checks++;assert.throws(()=>q.accept(bad),{code:'invalid-echo-refund'},'reject damaged '+damage);
  a.storage.set('lumenfall_save_v2',JSON.stringify(bad));q.load();eq(q.get(),accepted,'actual recovery selection '+damage);
 }
 {
  const q=app(html).q;q.set(old(q,7,1e30));const s=clone(q.get());delete s.feedbackMigration.echoCreditAuditVersion;delete s.feedbackMigration.receipts['node.echo'].creditAuditVersion;delete s.feedbackMigration.receipts['node.echo'].remainingCredits;
  const before=value(s),adopted=q.accept(s);eq(value(adopted),before,'legacy audit adopts only known remaining value');eq(adopted.feedbackMigration.receipts['node.echo'].remainingCredits,[16],'legacy audit preserves remaining credit');eq(q.accept(adopted),adopted,'legacy adoption once');
 }
 {
  const legacy=require('./echo-receipt-prices.json').legacyState;assert(legacy,'actual V8-generated fixture required');const q=app(html).q,before=value(legacy),accepted=q.accept(legacy);
  eq(value(accepted),before,'actual V8 remaining value preserved on modern engine');eq(accepted.feedbackMigration.receipts['node.echo'].amounts.prisms,legacy.feedbackMigration.receipts['node.echo'].amounts.prisms,'actual V8 original receipt prices retained');eq(q.accept(accepted),accepted,'cross-engine receipt never refunds twice');
 }
 for(const failure of ['primary','recovery']){
  const a=app(html),q=a.q;q.set(old(q,7,1e30));q.save();const before=clone(q.get());a.fail(failure==='primary',failure==='recovery');eq(q.buy('swift'),failure!=='primary','atomic authoritative transaction '+failure);
  if(failure==='primary'){eq(q.get(),before,'full rollback');a.fail(false,false);eq(q.buy('swift'),true,'safe retry');}
  eq(value(q.get()),value(before)-3n,'one exact persisted debit');eq(app(html,a.storage).q.get(),q.get(),'authoritative cold endpoint');
 }
 {
  const q=app(html).q,s=old(q,10,17,21);s.schemaVersion=1;s.nodes.reserves=4;s.owned.offline24=true;s.owned.offline48=true;q.set(s);eq(q.get().prisms,3560,'independent F26+F21+Echo original prices');eq(q.get().comets,300,'independent F26 Comets');eq(q.accept(q.get()),q.get(),'three migration ledgers once');
  const before=clone(q.get());q.get().depth=q.get().enemyDepth=16;q.ascend();eq(q.get().nodes.echo,10,'Ascend keeps raw Echo');eq(q.get().feedbackMigration,before.feedbackMigration,'Ascend keeps both receipt audits');eq(q.get().refundCredits,before.refundCredits,'Ascend keeps exact remaining credits');
  eq(q.fresh().refundCredits.prisms,[],'fresh reset credit default');eq(q.fresh().feedbackMigration.receipts,{},'fresh reset receipt default');
 }
 return {checks,records};
}
const result=contracts(source),negative=[];
if(process.argv.includes('--negative'))for(const [name,from,to] of [
 ['missing-refund','    normalizeEchoingRestRefund(out,source);',''],
 ['double-refund','  if(hasReceipt || raw<=6) return;','  if(raw<=6) return;'],
 ['wrong-price','value=echoingRestOriginalValues[echoingRestRefundPrices.length]','value=echoingRestOriginalValues[echoingRestRefundPrices.length]*1.1'],
 ['overflow-tolerance','var relativeError=level*Number.EPSILON/(1-level*Number.EPSILON),allowance=value*relativeError;\n    echoingRestRefundPrices','var allowance=value*level*Number.EPSILON/(1-level*Number.EPSILON);\n    echoingRestRefundPrices'],
 ['empty-echo-range','if(hasReceipt && (raw<=6 ||','if(hasReceipt && ('],
 ['empty-bonds-range','if(hasReceipt && (raw<=20 ||','if(hasReceipt && ('],
 ['missing-receipt',"if(!hasReceipt && ((saved.echoCreditAuditVersion===1 && raw>6) || (isPlainObject(saved.history) && isPlainObject(saved.history.echo) && saved.history.echo.levels>6))){","if(false){"],
 ['missing-history-audit',"if(!hasReceipt && ((saved.echoCreditAuditVersion===1 && raw>6) || (isPlainObject(saved.history) && isPlainObject(saved.history.echo) && saved.history.echo.levels>6))){","if(!hasReceipt && saved.echoCreditAuditVersion===1 && raw>6){"],
 ['missing-marker-audit',"if(!hasReceipt && ((saved.echoCreditAuditVersion===1 && raw>6) || (isPlainObject(saved.history) && isPlainObject(saved.history.echo) && saved.history.echo.levels>6))){","if(!hasReceipt && isPlainObject(saved.history) && isPlainObject(saved.history.echo) && saved.history.echo.levels>6){"],
 ['missing-credit-audit',"if(saved.echoCreditAuditVersion===1 || receipt.creditAuditVersion!==undefined || remaining!==undefined){","if(false){"],
  ['free-credit','left=exactPrismArithmetic(balance,-take)','left=balance-take'],
 ['free-wallet','if(source.index===-1) wallet=debit.left;','if(source.index===-1) wallet=wallet;'],
 ['lost-payment-audit','if(echoReceipt) echoReceipt.remainingCredits=plan.payment.remainingEchoCredits;','']
 ]){
  assert.equal(source.split(from).length,2,'one real mutation anchor '+name);let failure;try{contracts(source.replace(from,to));}catch(e){assert.equal(e.code,'ERR_ASSERTION','behavioral failure required '+name);failure=e.message;}assert(failure,'mutation survived '+name);negative.push({name,assertion:failure.split('\n')[0]});
 }
const evidence={status:'PASS',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),...result,negative,scope:'Complete current production IIFE; exact original prices and credits, cap/identity, mixed ledgers, backup/cold load/recovery/transaction failures, preserved raw levels and paid Study snapshots. UI/native/long chronology checked separately; reset defaults only.'};
const i=process.argv.indexOf('--output');if(i>=0){fs.mkdirSync(path.dirname(process.argv[i+1]),{recursive:true});fs.writeFileSync(process.argv[i+1],JSON.stringify(evidence,null,2)+'\n');}console.log(JSON.stringify(evidence));
