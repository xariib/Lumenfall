'use strict';
// Independent modern test oracle. This file is deliberately NOT a dependency
// of the Node8 shared harness or V8 driver. Requiring it runs no suite or I/O.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const OLD_DEEDS = [
  ['d10',5], ['d25',10], ['d50',20], ['d100',50], ['d250',100],
  ['tap100',3], ['tap1000',8], ['tap10000',20], ['fullparty',12],
  ['asc1',10], ['asc5',25], ['asc10',50], ['all',30], ['mythic',40],
  ['idle8',15], ['autotap',25], ['labmaster',30], ['study1',15], ['study25',50],
  ['allstudies',35], ['labqueue',40], ['firstultimate',45], ['modulemax',45]
];
const NEW_DEEDS = [
  ['comet_first_command',5], ['comet_first_recharge',10],
  ['comet_boss_strike',15], ['comet_called_kill',20]
];
const RETIRED = [['comettrials',140], ['rifttrail',50], ['starfallcrest',160]];
const CATALOG = [
  {id:'autoascend',cap:1,prices:[100],deeds:[]},
  {id:'meteor',cap:1,prices:[100],deeds:['d25']},
  {id:'starcall',cap:1,prices:[140],deeds:['d50']},
  {id:'cometreservoir',cap:2,prices:[60,120],deeds:['comet_first_command']},
  {id:'cometcycle',cap:3,prices:[80,140,220],deeds:['d100','comet_first_recharge']},
  {id:'meteorcore',cap:4,prices:[45,75,120,180],deeds:['d50','comet_boss_strike']}
];
const CLAIMS = RETIRED.map(([id,amount])=>['retirement:'+id,amount])
  .concat(OLD_DEEDS.map(([id,amount])=>['deed:'+id,amount]),NEW_DEEDS.map(([id,amount])=>['deed:'+id,amount]));
const AMOUNTS = new Map(CLAIMS);
const POLICY = 'comet-commands-001';

// Independent binary64 decomposition uses Buffer+BigInt, not the product's
// DataView/base-2^26 fixed quotient. HP uses a monotone bit-space search, not
// the product's subtraction/nextUp branch.
const bitsBuffer = Buffer.alloc(8);
const MAX_BITS = 0x7fefffffffffffffn;
function bits(x) { bitsBuffer.writeDoubleBE(x); return bitsBuffer.readBigUInt64BE(); }
function fromBits(value) { bitsBuffer.writeBigUInt64BE(value); return bitsBuffer.readDoubleBE(); }
function dyadic(x) {
  const raw=bits(x),exp=Number((raw>>52n)&2047n);
  return {n:(raw&0xfffffffffffffn)+(exp?0x10000000000000n:0n),e:exp?exp-1075:-1074};
}
function compare(a,b) {
  const e=Math.min(a.e,b.e),an=a.n<<BigInt(a.e-e),bn=b.n<<BigInt(b.e-e);
  return an<bn?-1:an>bn?1:0;
}
function add(a,b) {
  const e=Math.min(a.e,b.e);
  return {n:(a.n<<BigInt(a.e-e))+(b.n<<BigInt(b.e-e)),e};
}
function subtract(a,b) {
  const e=Math.min(a.e,b.e);
  return {n:(a.n<<BigInt(a.e-e))-(b.n<<BigInt(b.e-e)),e};
}
function floorRatio(x,numerator,denominator) {
  let {n,e}=dyadic(x);n*=BigInt(numerator);
  return e>=0?(n<<BigInt(e))/BigInt(denominator):n/(BigInt(denominator)<<BigInt(-e));
}
function floorIntegerNumber(integer) {
  if(integer===0n)return 0;
  const closest=Number(integer);
  return BigInt(closest)<=integer?closest:fromBits(bits(closest)-1n);
}
function ceilDyadicNumber(value,maximum) {
  if(value.n===0n)return 0;
  let low=0n,high=maximum===undefined?MAX_BITS:bits(maximum);
  while(low<high){
    const mid=(low+high)>>1n;
    if(compare(dyadic(fromBits(mid)),value)<0)low=mid+1n;else high=mid;
  }
  return fromBits(low);
}
function exactBudget(H,P,rank) {
  assert(Number.isFinite(H)&&H>0&&Number.isFinite(P)&&P>=0&&Number.isInteger(rank)&&rank>=0&&rank<=4,'valid oracle budget operands');
  const hp=floorRatio(H,4+rank,20),power=floorRatio(P,12,1),integer=hp<power?hp:power;
  return {hp,power,integer,budget:floorIntegerNumber(integer)};
}
function plan(H,h,P,rank) {
  if(!Number.isFinite(H)||H<=0||!Number.isFinite(h)||h<=0||h>H||!Number.isFinite(P)||P<0||!Number.isInteger(rank)||rank<0||rank>4){
    return {available:false,reason:'invalid',budget:0};
  }
  const budget=exactBudget(H,P,rank).budget;
  if(budget<1)return {available:false,reason:'zero-budget',budget};
  if(budget>=h)return {available:true,lethal:true,budget,damage:h,hpAfter:0};
  const hpAfter=ceilDyadicNumber(subtract(dyadic(h),dyadic(budget)),h);
  if(hpAfter===h)return {available:false,reason:'unrepresentable',budget};
  const exactLoss=subtract(dyadic(h),dyadic(hpAfter)),damage=h-hpAfter;
  assert.equal(compare(dyadic(damage),exactLoss),0,'oracle represented HP loss is mathematically exact');
  return {available:true,lethal:false,budget,damage,hpAfter};
}
function exactCredit(wallet,amount) {
  if(!Number.isFinite(wallet)||wallet<0||!Number.isFinite(amount)||amount<0)return null;
  const target=add(dyadic(wallet),dyadic(amount)),next=wallet+amount;
  return Number.isFinite(next)&&compare(dyadic(next),target)===0?next:null;
}
function exactDebit(wallet,amount) {
  if(!Number.isFinite(wallet)||wallet<0||!Number.isFinite(amount)||amount<0||wallet<amount)return null;
  const target=subtract(dyadic(wallet),dyadic(amount)),next=wallet-amount;
  return Number.isFinite(next)&&compare(dyadic(next),target)===0?next:null;
}
function settleKnownClaims(wallet,pendingIds) {
  assert(Number.isFinite(wallet)&&wallet>=0,'valid ledger wallet');
  assert.equal(new Set(pendingIds).size,pendingIds.length,'unique claim identities');
  for(const id of pendingIds)assert(AMOUNTS.has(id),'known independent claim ID: '+id);
  const pending=new Set(pendingIds),events=[];
  for(const [id,amount] of CLAIMS){
    if(!pending.has(id))continue;
    const before=wallet,next=exactCredit(before,amount),credited=next!==null;
    if(credited){wallet=next;pending.delete(id);}
    events.push({id,amount,before,after:wallet,credited});
  }
  return {wallet,pendingIds:CLAIMS.filter(([id])=>pending.has(id)).map(([id])=>id),events};
}
const oracle={bits,fromBits,dyadic,compare,add,subtract,floorRatio,floorIntegerNumber,ceilDyadicNumber,exactBudget,plan,exactCredit,exactDebit,settleKnownClaims};

function sha(bytes) {return crypto.createHash('sha256').update(bytes).digest('hex');}
function readIdentity(filename) {const b=fs.readFileSync(filename);return {path:filename,bytes:b.length,sha256:sha(b)};}

function functionRange(source,name) {
  const expression=new RegExp('function\\s+'+name+'\\s*\\([^)]*\\)\\s*\\{','g');
  const match=expression.exec(source);
  assert(match,'actual function exists: '+name);
  assert.equal(expression.exec(source),null,'unique actual function: '+name);
  const open=match.index+match[0].length-1;
  let depth=1,quote=null,line=false,block=false;
  for(let i=open+1;i<source.length;i++){
    const c=source[i],n=source[i+1];
    if(line){if(c==='\n')line=false;continue;}
    if(block){if(c==='*'&&n==='/'){block=false;i++;}continue;}
    if(quote){if(c==='\\'){i++;continue;}if(c===quote)quote=null;continue;}
    if(c==='/'&&n==='/'){line=true;i++;continue;}
    if(c==='/'&&n==='*'){block=true;i++;continue;}
    if(c==='"'||c==="'"||c==='`'){quote=c;continue;}
    if(c==='{')depth++;
    if(c==='}'){
      depth--;
      if(depth===0)return {start:match.index,open,end:i+1,body:source.slice(open+1,i)};
    }
  }
  throw Error('Unclosed actual function: '+name);
}
function replaceFunction(source,name,transform) {
  const range=functionRange(source,name),body=transform(range.body);
  assert.notEqual(body,range.body,'mutant actually changes '+name);
  return source.slice(0,range.open+1)+body+source.slice(range.end-1);
}
function replaceOne(text,before,after) {
  assert.equal(text.split(before).length,2,'one causal mutation anchor: '+before);
  return text.replace(before,after);
}
function setPending(snapshot,ids) {
  snapshot.cometClaims={policy:POLICY,retired:{comettrials:'absent',rifttrail:'absent',starfallcrest:'absent'},deeds:{}};
  for(const id of ids){
    const [kind,key]=id.split(':');
    if(kind==='retirement')snapshot.cometClaims.retired[key]='due';
    else snapshot.cometClaims.deeds[key]=true;
  }
}
function pendingIds(snapshot) {
  return CLAIMS.filter(([id])=>{
    const [kind,key]=id.split(':');
    return kind==='retirement'?snapshot.cometClaims.retired[key]==='due':snapshot.cometClaims.deeds[key]===true;
  }).map(([id])=>id);
}
function claimSnapshot(q,wallet,ids) {
  const s=q.fresh();
  s.comets=wallet;s.owned.meteor=true;s.owned.starcall=true;
  s.cometEvents={firstCommand:true,firstRecharge:true,bossStrike:true,calledKill:true};
  for(const [id]of OLD_DEEDS.concat(NEW_DEEDS))s.achieved[id]=true;
  setPending(s,ids);
  return s;
}

function runNumerical(source,options={}) {
  const {app}=require('./comet-expansion-harness.cjs');
  const env=app(source),q=env.q;
  const report={status:'RUNNING',checks:0,budgetVectors:0,hpPlanVectors:0,creditVectors:0,debitVectors:0,settlementPasses:0,examples:[],negativeControls:[]};
  if(options.progress)options.progress(report);
  const equal=(a,b,label)=>{assert.deepEqual(a,b,label);report.checks++;};
  const check=(value,label)=>{assert(value,label);report.checks++;};
  equal(q.schema(),5,'current save schema5');
  equal(CLAIMS.length,30,'fixed bounded identity count');
  equal(CLAIMS.reduce((sum,row)=>sum+row[1],0),1083,'fixed old+new+retirement credit family');
  equal(q.achievementDefs().map(a=>[a.id,a.reward]),OLD_DEEDS.concat(NEW_DEEDS),'independent old23 + new4 reward table/order');
  let randomState=0x43da01b9;
  function random32(){randomState^=randomState<<13;randomState^=randomState>>>17;randomState^=randomState<<5;return randomState>>>0;}
  function randomFinite(){return fromBits((BigInt(random32()%2047)<<52n)|(BigInt(random32()&0xfffff)<<32n)|BigInt(random32()));}
  const vectorHash=crypto.createHash('sha256');
  function budgetCase(H,P,rank){
    const expected=exactBudget(H,P,rank),actual=q.meteorBudget(H,P,rank);
    equal(actual,expected.budget,'exact budget '+JSON.stringify({H,P,rank,exact:expected.integer.toString()}));
    check(Number.isFinite(actual)&&Number.isInteger(actual)&&actual>=0,'finite representable integer budget');
    check(BigInt(actual)<=expected.integer,'directed budget never exceeds mathematical floor');
    if(expected.integer<=BigInt(Number.MAX_SAFE_INTEGER))equal(BigInt(actual),expected.integer,'safe exact budget');
    if(actual>0){const next=fromBits(bits(actual)+1n);if(Number.isInteger(next))check(BigInt(next)>expected.integer,'greatest feasible representable integer');}
    report.budgetVectors++;
    vectorHash.update(JSON.stringify([bits(H).toString(16),bits(P).toString(16),rank,bits(actual).toString(16)])+'\n');
  }
  function hpCase(H,h,P,rank){
    const expected=plan(H,h,P,rank),actual=q.meteorHpPlan(H,h,P,rank);
    equal(actual,expected,'exact HP plan '+JSON.stringify({H,h,P,rank}));
    if(actual.available){
      check(actual.hpAfter>=0&&actual.hpAfter<h&&actual.damage>0&&actual.damage<=actual.budget,'positive bounded represented debit');
      equal(compare(subtract(dyadic(h),dyadic(actual.hpAfter)),dyadic(actual.damage)),0,'exact mathematical HP loss');
      equal(h-actual.damage,actual.hpAfter,'reverse endpoint equality');
      if(actual.lethal){equal(actual.hpAfter,0,'lethal endpoint');check(h<=actual.budget,'only genuinely lethal budget');}
      else check(actual.hpAfter>0,'positive nonlethal endpoint');
    }
    report.hpPlanVectors++;
    vectorHash.update(JSON.stringify([H,h,P,rank,actual])+'\n');
    return actual;
  }
  // Every finite exponent, all five ranks, three different significands.
  for(let exp=0;exp<2047;exp++)for(let rank=0;rank<=4;rank++)for(let pattern=0;pattern<3;pattern++){
    const fraction=pattern===0?1n:pattern===1?0xfffffffffffffn:(BigInt(random32()&0xfffff)<<32n)|BigInt(random32());
    const H=fromBits((BigInt(exp)<<52n)|fraction),P=pattern===0?Number.MAX_VALUE:pattern===1?H/37:randomFinite();
    budgetCase(H,P,rank);
    if((exp+rank*7+pattern)%19===0)hpCase(H,pattern===1?H/2:H,P,rank);
  }
  for(const base of [1,5,10,20,25,100,1e6,2**26,2**51,2**52,2**53,2**54,2**55,2**56,2**100,2**500,Number.MAX_VALUE]){
    const raw=bits(base);
    for(const delta of [-2n,-1n,0n,1n,2n]){
      if(raw+delta<=0n||raw+delta>MAX_BITS)continue;
      const H=fromBits(raw+delta);
      for(let rank=0;rank<=4;rank++)for(const P of [0,1/12,fromBits(bits(1/12)+1n),0.25,H/48,H,Number.MAX_VALUE]){
        budgetCase(H,P,rank);hpCase(H,H,P,rank);
      }
    }
  }
  for(let i=0;i<1500;i++){
    const H=randomFinite(),P=randomFinite(),rank=i%5,h=i%3===0?H:i%3===1?H*0.65:H/128;
    budgetCase(H,P,rank);hpCase(H,h,P,rank);
  }
  const examples=[
    ['ordinary-base',1000,1000,50,0],['ordinary-core4-lethal',1000,350,50,4],
    ['power-bound-core4',10000,10000,100,4],['fractional-power-below-one',5,5,1/12,0],
    ['fractional-power-above-one',5,5,fromBits(bits(1/12)+1n),0],['fractional-current-hp-lethal',5,0.125,1,0],
    ['unsafe-budget-directed-down',2**56,2**56,Number.MAX_VALUE,0],['rounded-subtraction-overdebit',2**54,2**54,0.25,0],
    ['stalled-current-hp',2**54,2**54,0.1,0],['nonlethal-epsilon-remainder',5,1+5e-10,1,0],
    ['overflowing-power-finite-hp-cap',1000,1000,Number.MAX_VALUE,0],['both-native-products-overflow',Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE,4],
    ['finite-maxhp-no-debit',Number.MAX_VALUE,Number.MAX_VALUE,1,4],['subnormal-inputs',Number.MIN_VALUE,Number.MIN_VALUE,Number.MAX_VALUE,0],
    ['subnormal-current-hp-lethal',5,Number.MIN_VALUE,1,0]
  ];
  for(const [id,H,h,P,rank]of examples){
    const exact=exactBudget(H,P,rank);
    report.examples.push({id,H,h,P,rank,exactInteger:exact.integer.toString(),actual:hpCase(H,h,P,rank)});
  }
  const invalids=[[NaN,1,1,0],[Infinity,1,1,0],[1,Infinity,1,0],[1,1,Infinity,0],[-1,1,1,0],[1,-1,1,0],[1,2,1,0],[0,0,1,0],[1,1,-1,0],[1,1,1,NaN],[1,1,1,0.5],[1,1,1,-1],[1,1,1,5]];
  for(const args of invalids)hpCase(...args);

  // Actual single-pass claim owner, independent exact-credit oracle. A separate
  // snapshot is deliberate: settlement must not read a different global wallet.
  const liveBefore=JSON.stringify(q.get());
  const wallets=[0,Number.MIN_VALUE,0.1,0.125,0.5,1,1.5,24.5,25,49.5,50,100,350,1083,1e16,1e30,Number.MAX_VALUE];
  for(let exp=0;exp<2047;exp++)for(const fraction of [1n,0xfffffffffffffn])wallets.push(fromBits((BigInt(exp)<<52n)|fraction));
  for(const center of [2**51,2**52,2**53,2**54,2**55,2**56])for(let offset=-200;offset<=200;offset++)wallets.push(center+offset);
  const distinctWallets=[...new Set(wallets)],uniqueAmounts=[...new Set(CLAIMS.map(row=>row[1]))];
  const ledger=claimSnapshot(q,0,[]);
  for(const wallet of distinctWallets)for(const amount of uniqueAmounts){
    const id=CLAIMS.find(row=>row[1]===amount)[0],expected=exactCredit(wallet,amount);
    ledger.comets=wallet;setPending(ledger,[id]);
    q.settleClaims(ledger);
    equal(ledger.comets,expected===null?wallet:expected,'whole exact credit '+JSON.stringify({wallet,amount,id}));
    equal(pendingIds(ledger),expected===null?[id]:[],'claim consumed iff credited');
    equal(compare(add(dyadic(wallet),dyadic(amount)),add(dyadic(ledger.comets),dyadic(expected===null?amount:0))),0,'exact wallet+due conservation');
    report.creditVectors++;
  }
  equal(JSON.stringify(q.get()),liveBefore,'snapshot settlement never changes unrelated live state');
  for(const wallet of [0,0.125,0.1,2**53,2**54-10,2**54,2**55,1e16,1e30,Number.MAX_VALUE]){
    const initial=CLAIMS.map(row=>row[0]),s=claimSnapshot(q,wallet,initial);let expected={wallet,pendingIds:initial};
    const passes=[];
    for(let pass=0;pass<4;pass++){
      expected=settleKnownClaims(expected.wallet,expected.pendingIds);q.settleClaims(s);
      equal(s.comets,expected.wallet,'fixed ordered one-pass wallet');equal(pendingIds(s),expected.pendingIds,'fixed ordered one-pass identities');
      passes.push({wallet:s.comets,pendingIds:pendingIds(s),events:expected.events});report.settlementPasses++;
    }
    report.examples.push({id:'ordered-ledger',initialWallet:wallet,passes});
  }
  const retirementIds=RETIRED.map(([id])=>'retirement:'+id),ordered=claimSnapshot(q,2**54-10,retirementIds);
  q.settleClaims(ordered);equal(pendingIds(ordered),['retirement:comettrials'],'do not rescan an earlier newly payable claim');
  const firstWallet=ordered.comets;q.settleClaims(ordered);
  equal(pendingIds(ordered),[],'next canonicalization may settle original identity');check(ordered.comets!==firstWallet,'whole-load numerical idempotence is not a promised invariant');
  report.settlementPasses+=2;

  // Test the real read-only shop quote for every actual level. Exact debit is
  // computed from dyadic arithmetic, never from the product's guard expression.
  for(const row of CATALOG)for(let level=0;level<row.prices.length;level++){
    const s=claimSnapshot(q,0,[]);
    if(row.id==='meteor'){
      s.owned.meteor=false;s.cometEvents.bossStrike=false;s.achieved.comet_boss_strike=false;
    }else if(row.id==='starcall'){
      s.owned.starcall=false;s.cometEvents.calledKill=false;s.achieved.comet_called_kill=false;
    }else if(row.id==='autoascend')s.owned.autoascend=false;
    else s.cometUpgrades[row.id]=level;
    q.set(s);
    const price=row.prices[level];
    for(const wallet of distinctWallets){
      q.get().comets=wallet;
      const actual=q.buyPlan(row.id),expected=exactDebit(wallet,price);
      equal(actual.cost,price,'independent exact catalog quote '+row.id+' '+level);
      equal(actual.affordable,wallet>=price,'coverage color remains a coverage comparison');
      equal(actual.available,expected!==null,'actual quote exact-debit availability '+JSON.stringify({id:row.id,level,wallet,price}));
      equal(actual.reason,expected!==null?'available':wallet<price?'funds':'unavailable','actual exact-debit reason');
      report.debitVectors++;
    }
    q.get().comets=2**54;
    const before=JSON.stringify(q.get()),writes=env.attempts.length;
    equal(q.buyPlan(row.id).item,q.item(row.id),'quote resolves authoritative catalog identity');
    equal(JSON.stringify(q.get()),before,'pure plan preserves complete state');equal(env.attempts.length,writes,'pure plan performs no storage action');
  }
  report.generator={initialSeed:'0x43da01b9',vectorSha256:vectorHash.digest('hex'),distinctWallets:distinctWallets.length};

  if(options.negative){
    const controls=[
      {id:'native-rounded-floor',name:'cometMeteorBudget',change:()=>"return Math.min(Math.floor(H*(20+5*rank)/100),Math.floor(12*P));",probe:m=>assert.equal(m.meteorBudget(5,1/12,0),0,'fractional power must floor before rounded native product')},
      {id:'division-first-safe-floor',name:'cometMeteorBudget',change:()=>"return Math.min(Math.floor((H/20)*(4+rank)),Math.floor(12*P));",probe:m=>assert.equal(m.meteorBudget(Number.MAX_SAFE_INTEGER,Number.MAX_VALUE,3),3152519739159346,'safe floor must be exact')},
      {id:'unused-power-overflow',name:'cometMeteorBudget',change:body=>"if(!Number.isFinite(12*P))return 0;"+body,probe:m=>assert.equal(m.meteorBudget(1000,Number.MAX_VALUE,0),200,'unused overflow cannot reject finite budget')},
      {id:'lost-power-ceiling',name:'cometMeteorBudget',change:body=>replaceOne(body,'var chosen = hp.e < power.e || (hp.e === power.e && hp.q <= power.q) ? hp : power;','var chosen = hp;'),probe:m=>assert.equal(m.meteorBudget(10000,100,4),1200,'power cap remains twelve passive seconds')},
      {id:'lost-core-rank',name:'cometMeteorBudget',change:body=>replaceOne(body,'part(H, 4 + rank, 20, 0)','part(H, 4, 20, 0)'),probe:m=>assert.equal(m.meteorBudget(1000,Number.MAX_VALUE,4),400,'Core rank4 remains forty percent')},
      {id:'lost-directed-hp-correction',name:'cometMeteorHpPlan',change:body=>replaceOne(body,'if (Amount.gt(Amount.sub(h,after),budget)) after = cometMeteorNextUp(after);','/* causal control: omit directed remainder correction */'),probe:m=>assert.deepEqual(m.meteorHpPlan(2**54,2**54,0.25,0),plan(2**54,2**54,0.25,0),'representable positive damage2 with budget3 remains available')},
      {id:'reject-valid-fractional-hp',name:'cometMeteorHpPlan',change:body=>replaceOne(body,'!Amount.valid(h)','!Number.isSafeInteger(h)'),probe:m=>assert.deepEqual(m.meteorHpPlan(5,0.125,1,0),plan(5,0.125,1,0),'fractional lethal HP is supported')},
      {id:'ledger-hidden-rescan',name:'settleCometClaims',change:body=>'for(var qaRepeat=0;qaRepeat<2;qaRepeat++){(function(snapshot){'+body+'})(snapshot);}',probe:m=>{const s=claimSnapshot(m,2**54-10,retirementIds);m.settleClaims(s);assert.deepEqual(pendingIds(s),['retirement:comettrials'],'one fixed pass must retain earlier due claim');}}
    ];
    for(const control of controls){
      const mutated=replaceFunction(source,control.name,control.change),m=app(mutated).q;let failure=null;
      try{control.probe(m);}catch(error){failure=error;}
      check(failure&&failure.code==='ERR_ASSERTION','causal mutant fails a semantic assertion, not runtime: '+control.id);
      report.negativeControls.push({id:control.id,function:control.name,sourceSha256:sha(mutated),detected:true,error:{name:failure.name,code:failure.code,message:failure.message}});
    }
  }
  report.status='PASS';return report;
}

function cli() {
  const sourcePath=path.resolve(process.argv[2]||'index.html'),negative=process.argv.includes('--negative');
  const input=readIdentity(sourcePath),dependencies=[__filename,path.join(__dirname,'comet-expansion-harness.cjs')].map(readIdentity);
  let progress=null,report;
  try{report=runNumerical(fs.readFileSync(sourcePath,'utf8'),{negative,progress:value=>{progress=value;}});}
  catch(error){report=Object.assign(progress||{},{status:'FAIL',error:{name:error.name,code:error.code,message:error.message,stack:error.stack}});process.exitCode=1;}
  report.input=input;report.dependencies=dependencies;report.runtime={node:process.version,v8:process.versions.v8};
  report.scope='Actual full game IIFE: numerical kernel, exact read-only debit plans and one-pass claim owner; gameplay transactions/chronology are separate core/offline suites.';
  process.stdout.write(JSON.stringify(report,null,2)+'\n');
}
module.exports={oracle,OLD_DEEDS,NEW_DEEDS,RETIRED,CATALOG,CLAIMS,POLICY,runNumerical,replaceFunction,replaceOne,claimSnapshot,pendingIds};
if(require.main===module)cli();
