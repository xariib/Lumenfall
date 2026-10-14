'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone,CLOCK}=require('./forge-expansion-harness.cjs');
const amount=require('../../scripts/lib/game-amount.cjs');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8');
let checks=0;
function equal(a,b,m){checks++;assert.deepEqual(a,b,m);}
function compare(a,b,path){
 if(typeof a==='number'&&typeof b==='number'){
  checks++;assert(Math.abs(a-b)<=Math.max(1,Math.abs(a),Math.abs(b))*1e-9,path+': '+a+' vs '+b);return;
 }
 if(amount.wide(a)||amount.wide(b)){
  checks++;assert(amount.valid(a)&&amount.valid(b),path+' amount validity');
  checks++;assert(Math.abs(amount.log10(a)-amount.log10(b))<=1e-9,path+' wide physical agreement');return;
 }
 if(a&&b&&typeof a==='object'&&typeof b==='object'){
  equal(Object.keys(a),Object.keys(b),path+' keys');Object.keys(a).forEach(k=>compare(a[k],b[k],path+'.'+k));return;
 }
 equal(a,b,path);
}
const fixtures=[];
{
 const q=app(source).q,s=q.fresh();s.depth=40;s.maxDepthEver=120;s.spirits.ember=80;s.spirits.tide=10;s.spirits.stone=40;
 s.activeParty=['ember','tide','stone'];s.heroResource.ember=91;s.heroResource.tide=99;s.heroResource.stone=70;s.nodes.echo=6;
 s.heroRarity.ember=2;s.wispModules.ember=12;s.achieved.autotap=true;s.empowerQueue.ember=false;
 s.longStudyLevels.wispascend=15;s.research.relay=3;s.research.sustainedchannel=3;
 s.activeStudies=[{id:'guardmastery',remainingSec:5.25,totalDurationSec:10,speedMult:1.5}];fixtures.push({name:'developing chronology',seed:s,seconds:60});
 const f=clone(s);f.riftMode='farm';f.farmDepth=39;f.depth=39;f.farmReturnDepth=41;f.lumen=f.shards='1e400';f.prisms=f.sigils=f.motes='1e400';
 f.heroRarity.ember=5;f.wispModules.ember=20;f.wispUltimate.ember=true;f.wispMastery.ember=10000;
 fixtures.push({name:'extended Mastery and wide wallets',seed:f,seconds:2});
 const slow=clone(f);slow.wispMastery.ember=0;slow.enemyHp=slow.enemyMaxHp='1e400';slow.enemyDepth=39;
 fixtures.push({name:'wide HP without overkill',seed:slow,seconds:60});
}
for(const fixture of fixtures){
 const one=app(source),many=app(source);one.q.set(fixture.seed);many.q.set(fixture.seed);
 if(fixture.name!=='wide HP without overkill'){one.q.restoreEnemy();many.q.restoreEnemy();}
 const starting=clone(one.q.get());one.q.advance(fixture.seconds,{kind:'offline',clockStartMs:CLOCK,offlineWindowStartMs:CLOCK});
 for(let t=0;t<fixture.seconds;t++)many.q.advance(1,{kind:'live',clockStartMs:CLOCK+t*1000,offlineWindowStartMs:CLOCK});
 for(const key of ['depth','enemyDepth','enemyHp','enemyMaxHp','lumen','shards','prisms','motes','sigils','heroResource','supportBuffs','supportRecastUntil','longStudyLevels','activeStudies','research','totalKills','totalTaps','dailyStats','wispMastery'])compare(one.q.get()[key],many.q.get()[key],fixture.name+'.'+key);
 equal(one.q.get().wispMastery,starting.wispMastery,'simulation never grants a Mastery rank');
}
console.log(JSON.stringify({status:'PASS',checks,fixtures:fixtures.map(f=>f.name),sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),limits:'Relative floating tolerance for physical quantities; purchase exactness has separate independent integer oracles.'}));
