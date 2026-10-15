'use strict';
// Separate calibration candidate after a real focused policy recruited all
// eight Wisps at18.6667d. Never overwrite the current product or prior evidence.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const [input,output]=process.argv.slice(2);assert(input&&output);assert.notEqual(path.resolve(input),path.resolve(output));
const original=fs.readFileSync(input,'utf8');let source=original;
function edit(a,b){assert.equal(source.split(a).length,2,'unique focused calibration anchor '+a);source=source.replace(a,b);}
edit('titan:{depth:100,lab:43}','titan:{depth:100,lab:48}');
edit('lab:[0,5,15,40,78]','lab:[0,5,15,40,90]');
edit('module:15,depth:120,lab:84','module:15,depth:120,lab:92');
edit('labBase:84','labBase:92');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
fs.writeFileSync(output,source);fs.writeFileSync(output.replace(/\.html$/,'.json'),JSON.stringify({status:'EXPERIMENT_NOT_APPLIED',baseSourceSha256:hash(original),sourceSha256:hash(source),reason:'Focused free three-visit policy recruited all eight at18.6667d on D; test robust pacing before accepting numeric gates.',changes:['Titan completed Wisp Lab48','Mythic completed Wisp Lab90 plus existing roster offset','Ultimate completed Wisp Lab92 plus existing roster offset; Mastery Lab base92'],preserved:['All prices and effects','Early recruitment and rarity gates','Running projects, speed benefits and resource affordability','Unrestricted Ascend and exact engine'],limits:'Provisional numeric model only. Fresh complete-engine measurements are required before application.'},null,2)+'\n');
