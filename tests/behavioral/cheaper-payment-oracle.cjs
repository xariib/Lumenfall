/* Independent funding oracle: actual product planner, exact BigInt money, no DOM. */
const fs=require('fs'),assert=require('assert'),path=require('path'),crypto=require('crypto');const args=process.argv.slice(2),option=(n,f)=>{const i=args.indexOf(n);return i<0?f:args[i+1];},source=path.resolve(option('--source',path.resolve(__dirname,'../../index.html'))),src=fs.readFileSync(source,'utf8');const w={addEventListener(){}},d={readyState:'loading',addEventListener(){}};const bridge="window.payQa={fresh:freshState,set:function(s){state=acceptPersistedState(s,'payment-oracle');},get:function(){return state;},payment:prismPurchasePlan};";const script=src.match(/<script>\s*([\s\S]*?)<\/script>/)[1].replace("if(document.readyState==='loading'){",bridge+"if(document.readyState==='loading'){");new Function('window','document','localStorage',script)(w,d,{getItem(){return null},setItem(){throw Error('unexpected write')},removeItem(){throw Error('unexpected write')}});let seed=w.payQa.fresh();seed.nodes.bonds=110;seed.prisms=1e30;delete seed.feedbackMigration.bondsCreditAuditVersion;w.payQa.set(seed);seed=JSON.parse(JSON.stringify(w.payQa.get()));function exact(n,t){if(t>n)return false;const want=BigInt(n)-BigInt(t),actual=Number(want);return Number.isFinite(actual)&&BigInt(actual)===want;}
function integer(value){
 if(typeof value==='number'){assert(Number.isInteger(value));return BigInt(value);}
 const match=/^(\d+)e(\d+)$/.exec(value);assert(match,'canonical wide integer');
 return BigInt(match[1])*10n**BigInt(match[2]);
}
let cases=0,newlyPayable=0,insufficient=0,failures=[];
const costs=[...new Set([...Array.from({length:17},(_,k)=>Math.ceil(3*Math.pow(1.5,k))),...Array.from({length:6},(_,k)=>Math.ceil(2*Math.pow(1.4,k)))])];
for(const wallet of [0,1,2,3,2**53,2**54,2**54+4,2**55+8])for(const small of [1,2,3,5])for(const large of [1,2,2**54,2**54+4,2**55+8])for(const cost of costs){
 const s=JSON.parse(JSON.stringify(seed));s.prisms=wallet;s.refundCredits.prisms=[{id:'node.bonds',amount:small},{id:'node.bonds',amount:large}];s.feedbackMigration.receipts['node.bonds'].remainingCredits=[small,large];w.payQa.set(s);
 // Retain the exhaustive historical native-allocation comparison as evidence.
 // Wide arithmetic now makes every sufficiently funded integer balance payable.
 let nativePossible=false;
 for(let a=0;a<=Math.min(wallet,cost)&&!nativePossible;a++){
  if(!exact(wallet,a))continue;
  for(let b=0;b<=Math.min(small,cost-a);b++){if(exact(large,cost-a-b)){nativePossible=true;break;}}
 }
 const before=BigInt(wallet)+BigInt(small)+BigInt(large),possible=before>=BigInt(cost),plan=w.payQa.payment(cost);cases++;
 if(possible&&!nativePossible)newlyPayable++;if(!possible)insufficient++;
 if(!!plan!==possible)failures.push({wallet,small,large,cost,possible,plan});
 if(plan){const after=integer(plan.prisms)+plan.credits.reduce((sum,e)=>sum+integer(e.amount),0n);assert.equal(after,before-BigInt(cost),'independent exact conservation');}
}
const report={status:failures.length?'FAIL':'PASS',cases,newlyPayable,insufficient,failures:failures.slice(0,10),sourceSha256:crypto.createHash('sha256').update(src).digest('hex'),oracle:'Independent BigInt total affordability and exact conservation; historical exhaustive native allocation retained for comparison',scope:'Echo0..5 and Swift0..16 prices, eight wallets, four small credits, five other credits including insufficient balances'};
if(args.includes('--output'))fs.writeFileSync(option('--output'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));if(failures.length)process.exitCode=1;
