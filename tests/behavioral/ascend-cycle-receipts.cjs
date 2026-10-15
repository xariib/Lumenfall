'use strict';
const assert=require('node:assert/strict'),A=require('../../scripts/lib/game-amount.cjs'),record=require('../../scripts/lib/ascend-cycle-receipts.cjs')(A),{integer}=require('./amount-oracle.cjs');
let checks=0;function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
const summary={ascends:0,ascendGains:[]},literal=[];
for(const gain of [16,16,18,18,18,222,222]){literal.push(gain);record(summary,gain);eq(summary,{ascends:literal.length,ascendGains:literal.slice()},'ordinary summary shape preserved exactly');}
record(summary,222,100);eq(summary.ascendGainRuns,[{gain:16,count:2},{gain:18,count:3},{gain:222,count:102}],'existing array losslessly converts before bulk append');eq(summary.ascendGains,[222],'UI retains last actual reward');
record(summary,223);record(summary,'223e0','1e25');record(summary,224,9);
eq(integer(summary.ascends),10n**25n+117n,'exact huge Ascend count');
const total=summary.ascendGainRuns.reduce((n,r)=>n+integer(r.count),0n);eq(total,integer(summary.ascends),'all ordinary and bulk Ascends represented once');
const weighted=summary.ascendGainRuns.reduce((n,r)=>n+integer(r.gain)*integer(r.count),0n);eq(weighted,2n*16n+3n*18n+102n*222n+(10n**25n+1n)*223n+9n*224n,'lossless huge Prism reward sequence');eq(summary.ascendGains,[224],'last UI effect after ordinary and bulk mixtures');eq(summary.ascendGainRuns.length,5,'receipt count follows reward changes instead of reset count');
for(const count of [0,-1,.5,NaN,Infinity,'-1e400']){const before=JSON.stringify(summary);assert.throws(()=>record(summary,1,count),RangeError);eq(JSON.stringify(summary),before,'invalid receipt is atomic');}
console.log(JSON.stringify({status:'PASS',checks,summary,limits:'Receipt component only; not yet called by the game.'}));
