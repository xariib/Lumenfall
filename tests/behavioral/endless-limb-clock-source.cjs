'use strict';
// Isolated complete-game performance experiment. Only the exact-clock factory
// changes; combat, event policies, accounting, schema and presentation remain.
const fs=require('node:fs'),assert=require('node:assert/strict'),old=require('../../scripts/lib/simulation-binary-clock.cjs'),next=require('../../scripts/lib/simulation-limb-clock.cjs');
module.exports=function(source){const anchor='var createBinarySimulationClock='+old.toString()+';';assert.equal(source.split(anchor).length,2,'one exact factory');return source.replace(anchor,'var createBinarySimulationClock='+next.toString()+';');};
if(require.main===module){assert(process.argv[2]&&process.argv[3]);fs.writeFileSync(process.argv[3],module.exports(fs.readFileSync(process.argv[2],'utf8')));}
