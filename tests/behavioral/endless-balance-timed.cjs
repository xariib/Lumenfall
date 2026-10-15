'use strict';
// Isolated recalibration after the accepted timed-Lab/Mote change. Never
// overwrite the live product; measure this complete-engine model first.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const input=process.argv[2]||'index.html',output=process.argv[3];assert(output);assert.notEqual(path.resolve(input),path.resolve(output));
const original=fs.readFileSync(input,'utf8');let source=original;
const titanLab=Number(process.argv[4]||40);assert(Number.isInteger(titanLab)&&titanLab>=40&&titanLab<=60);
function edit(a,b){assert.equal(source.split(a).length,2,'one timed calibration anchor '+a);source=source.replace(a,b);}
edit('gale:{depth:15,lab:15},thorn:{depth:35,lab:18},void:{depth:55,lab:20},aurora:{depth:75,lab:21},titan:{depth:100,lab:24}',
 'gale:{depth:15,lab:18},thorn:{depth:35,lab:24},void:{depth:55,lab:30},aurora:{depth:75,lab:35},titan:{depth:100,lab:'+titanLab+'}');
edit('lab:[0,5,12,20,31]','lab:[0,5,15,40,78]');
edit('module:15,depth:120,lab:32','module:15,depth:120,lab:84');
edit("longStudyLevel('wispascend'),g.lab+2*SPIRITS.indexOf(sp)","longStudyLevel('wispascend'),g.lab+12*SPIRITS.indexOf(sp)");
edit('labBase:32','labBase:84');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
fs.writeFileSync(output,source);fs.writeFileSync(output.replace(/\.html$/,'.json'),JSON.stringify({status:'EXPERIMENT',baseSourceSha256:hash(original),sourceSha256:hash(source),changes:['Later completed-Lab recruitment18/24/30/35/'+titanLab,'Rarity Labs0/5/15/40/78; early rarity unchanged','Ultimate Lab84+12 per Wisp; Mastery base84','Preserve accepted timed boost prices/60s payouts, paid work and all existing development; no calendar lock'],limits:'Unaccepted calibration model; fresh complete-engine measurements required before applying.'},null,2)+'\n');
