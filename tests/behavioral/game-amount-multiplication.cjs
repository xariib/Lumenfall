'use strict';
// Independent Node BigInt oracle; the shipped arithmetic contains no BigInt.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),crypto=require('node:crypto');
const modulePath=path.resolve(process.argv[2]||'scripts/lib/game-amount.cjs'),a=require(modulePath);
let checks=0,seed=0x9e3779b9;
if(!process.argv[2]){
 const helper=fs.readFileSync(modulePath,'utf8'),game=fs.readFileSync(path.resolve('index.html'),'utf8');
 const factory=(text,end)=>text.slice(text.indexOf('function createGameAmount(){'),text.indexOf(end)).replace(/\r\n/g,'\n').trim();
 assert.equal(factory(game,'var Amount=createGameAmount();'),factory(helper,'module.exports=createGameAmount();'),'the independent oracle exercises the exact shipped factory');checks++;
}
function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed;}
function integer(value){
 if(typeof value==='number')return BigInt(value);
 const match=/^(-?\d+)e(-?\d+)$/.exec(value);assert(match,'canonical integer amount');
 const coefficient=BigInt(match[1]),exponent=Number(match[2]);
 return exponent>=0?coefficient*10n**BigInt(exponent):coefficient/10n**BigInt(-exponent);
}
function equal(actual,expected){checks++;assert.equal(integer(actual),expected);}
function digits(size){let s=String(random()%9+1);while(s.length<size)s+=String(random()%10);return s;}
for(const length of [1,6,7,8,13,14,15,16,17,27,28,29,70,71,99,100,101,308,309,1000]){
 for(let trial=0;trial<12;trial++){
  const x=digits(length),y=digits([1,7,16,length][trial%4]);
  for(const sign of [1,-1])equal(a.mul((sign<0?'-':'')+x+'e0',y+'e0'),BigInt(sign)*BigInt(x)*BigInt(y));
 }
 const n='9'.repeat(length);equal(a.mul(n+'e0',n+'e0'),BigInt(n)**2n);
}
const allNines='9'.repeat(6000);equal(a.mul(allNines+'e0',allNines+'e0'),BigInt(allNines)**2n);
// Generate actual IEEE-754 integers, rather than using their rounded display
// strings as an oracle. Exponent range covers every finite unsafe integer.
const bytes=new ArrayBuffer(8),view=new DataView(bytes);
for(let i=0;i<12000;i++){
 const exponent=53+random()%971;
 view.setUint32(0,((random()&1)*0x80000000)|((exponent+1023)<<20)|(random()&0xfffff));
 view.setUint32(4,random());
 const n=view.getFloat64(0),exact=BigInt(n);
 equal(a.mul(n,'1e1'),exact*10n);
 equal(a.exactSub(n,1),exact-1n);
 equal(a.exactAdd(n,7),exact+7n);
}
console.log(JSON.stringify({status:'PASS',checks,moduleSha256:crypto.createHash('sha256').update(fs.readFileSync(modulePath)).digest('hex'),oracle:'Node BigInt; deterministic decimal products, carries and actual IEEE-754 integers; runtime remains WebView60 compatible.'}));
