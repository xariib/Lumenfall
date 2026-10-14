'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,CLOCK}=require('./forge-expansion-harness.cjs');
const amount=require('../../scripts/lib/game-amount.cjs');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8'),x=app(source),q=x.q,s=q.fresh();
s.spirits.ember=140;s.heroRarity.ember=5;s.wispModules.ember=20;s.wispUltimate.ember=true;s.wispMastery.ember=10000;
const near=process.argv.includes('--near-frontier');
s.maxDepthEver=near?350001:250200;s.depth=near?350001:1;s.longStudyLevels.wispascend=2030;s.research.masterwork=2001;s.nodes.swift=1010;
Object.keys(s.empowerQueue).forEach(id=>s.empowerQueue[id]=false);q.set(s);q.restoreEnemy();
const cursor=q.advance(2,{kind:'offline',clockStartMs:CLOCK,resumable:true}),started=performance.now(),batch=cursor.next();
if(!near){assert.equal(batch.done,false,'extreme Push yields cooperatively');assert(q.get().depth>1,'underflow cannot stall real encounter progress');}
else assert.equal(batch.done,true,'near-frontier wide Push completes its full interval');
for(const key of ['enemyHp','enemyMaxHp','lumen','shards','totalKills','sigils','motes'])assert(amount.valid(q.get()[key]),'valid '+key);
const result={status:near?'PASS':'PARTIAL',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),rank:10000,requestedSec:2,firstBatch:batch.value,rift:q.get().depth,batchMs:performance.now()-started,limits:near?'Near-frontier wide Push completion only. Early-run replay and complete long high-rank campaigns remain separate acceptance.':'Cooperative event progress is verified; completing this extreme Push interval remains unverified. The current logarithmic HP curve can require impractically many encounters. This is an open acceptance issue.'};
cursor.return();console.log(JSON.stringify(result,null,2));
