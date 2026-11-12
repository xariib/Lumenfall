'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const F=require('./forge-expansion-harness.cjs');
const raw=fs.readFileSync(process.argv[2]||'index.html','utf8'),marker="if(document.readyState==='loading'){";
const source=raw.replace(marker,'window.endlessQa={requirements:automationDeedRequirements};'+marker);
let checks=0;const records=[];
const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);},ok=(a,m)=>{checks++;assert(a,m);};
function test(name,fn){const before=checks;fn();records.push({name,checks:checks-before});}
function seed(q){const s=F.seed(q);s.ascendCount=100;s.maxDepthEver=250;s.totalKills=10000;s.totalTaps=0;return s;}
test('independent-requirements-and-visible-progress',()=>{
 const {q}=F.app(source,undefined,{clockDate:true});
 for(const [field,value]of [['ascendCount',99],['maxDepthEver',249],['totalKills',9999],['totalKills',10000],['totalKills','1e30']]){
  const s=seed(q);s[field]=value;q.set(s);const ready=field==='totalKills'&&value!==9999;
  eq(q.deed('autotap'),ready,'independent requirement '+field+'/'+value);
  const rows=q.endless.requirements('autotap',q.get());eq(rows.map(r=>[r.key,r.target]),[['ascends',100],['rift',250],['kills',10000]],'visible requirements match authorization');
  eq(rows[2].current,q.get().totalKills,'display uses real lifetime kills');eq(rows[2].label,'Enemies defeated','clear player label');
 }
 const s=seed(q);s.totalKills=9999;s.totalTaps=100000;q.set(s);eq(q.deed('autotap'),false,'manual spam cannot replace combat requirement');
 eq(q.deed('tap10000'),true,'separate manual tap achievement is preserved');
});
for(const kind of ['live','offline'])test('earned-combat-boundary-'+kind,()=>{
 const x=F.app(source,undefined,{clockDate:true}),q=x.q,s=seed(q);s.totalKills=9999;q.set(s);q.achievements();
 eq(!!q.get().achieved.autotap,false,'one kill still missing');const before=q.get().comets;
 q.kill(kind);eq(q.get().achieved.autotap,true,'real defeat earns Auto-Tap '+kind);
 eq(q.get().totalTaps,0,'no mandatory tapping');eq(q.get().totalKills,10000,'exact earned combat boundary');
 const paid=q.get().comets;ok(paid>=before+25,'Vigil reward retained');
 for(let i=0;i<5;i++)q.achievements();eq(q.get().comets,paid,'unlock and reward cannot repeat');
 ok(q.save(),'unlock persists');const cold=F.app(source,x.storage,{clockDate:true}).q;
 eq(cold.get().achieved.autotap,true,'cold reload retains unlock');eq(cold.get().comets,paid,'cold reload retains exact award');
 const backup=q.decode(q.export());eq(backup.achieved.autotap,true,'portable backup keeps unlock');
 x.storage.set(F.P,'invalid');q.load();eq(q.get().achieved.autotap,true,'recovery keeps unlock');
});
test('old-owners-and-unearned-saves',()=>{
 for(let schema=0;schema<=6;schema++){
  const {q}=F.app(source,undefined,{clockDate:true}),s=q.fresh();s.schemaVersion=schema;s.achieved.autotap=true;
  q.set(s);q.achievements();eq(q.get().achieved.autotap,true,'old earned ownership survives schema '+schema);
  eq(q.get().totalTaps,0,'migration invents no taps');eq(q.get().totalKills,0,'migration invents no kills');
 }
 const {q}=F.app(source,undefined,{clockDate:true}),s=seed(q);s.ascendCount=99;q.set(s);q.achievements();eq(!!q.get().achieved.autotap,false,'combat total cannot bypass required Ascensions');
});
console.log(JSON.stringify({status:'pass',checks,sourceSha256:crypto.createHash('sha256').update(raw).digest('hex'),records},null,2));
