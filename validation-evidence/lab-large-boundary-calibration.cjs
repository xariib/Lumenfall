'use strict';
const fs=require('node:fs'),{app,seed}=require('../tests/behavioral/lab-expansion-harness.cjs'),{ge}=require('../tests/behavioral/amount-oracle.cjs');
const q=app(fs.readFileSync('index.html','utf8')).q,s=seed(q);s.depth=s.enemyDepth=s.farmDepth=1;s.riftMode='farm';s.farmReturnDepth=3;s.nodes.echo=6;s.longStudyLevels.luminousdistill=10;s.enemyIsLuminous=false;s.luminousAccum=.3;s.studyQueue.guardmastery=true;s.longStudyLevels.guardmastery=100;s.lumen=1004000000000000000;s.shards=61500000000000000;
q.set(s);const cost=q.cost('guardmastery',100),predicted=q.boundary(cost,1);function funded(count){q.set(s);q.batch(Number(count),'offline');return ge(q.get().lumen,cost.lumen)&&ge(q.get().shards,cost.shard);}
let low=1n,high=BigInt(Number.MAX_SAFE_INTEGER);if(!funded(high))throw Error('No safe witness');while(low<high){const mid=(low+high)/2n;if(funded(mid))high=mid;else low=mid+1n;}
console.log(JSON.stringify({cost,predicted,firstAffordable:String(low),previous:funded(low-1n),exact:funded(low),normalLumenEstimate:(cost.lumen-s.lumen)/6,normalShardEstimate:cost.shard-s.shards}));
