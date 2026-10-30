'use strict';
// Full production IIFE: verify presentation against complete offline receipts.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone}=require('./forge-expansion-harness.cjs');
const file=process.argv[2]||'index.html',source=fs.readFileSync(file,'utf8');
const marker="if(document.readyState==='loading'){";assert.equal(source.split(marker).length,2);
const {q}=app(source.replace(marker,'window.endlessQa={message:offlineReturnMessage,meaningful:hasMeaningfulOfflineProgress};'+marker));
q.set(q.fresh());const before=clone(q.get());let checks=0;
function ok(v,m){checks++;assert(v,m);}
const short={elapsedSec:17,earned:558.6,shardEarned:106.4,sigilsEarned:0,motesEarned:0,ascends:0,completedStudies:[],closedStudies:[]};
const shortHtml=q.endless.message(short);
ok(shortHtml.includes('Away for 17s'),'actual time away');
ok(shortHtml.includes('<dt>Lumen</dt><dd>+558.6</dd>')&&shortHtml.includes('<dt>Shards</dt><dd>+106.4</dd>'),'separate exact resource rows');
ok(!shortHtml.includes('<details')&&!shortHtml.includes('Sigils')&&!shortHtml.includes('Motes')&&!shortHtml.includes('Auto Ascend'),'omit absent results');
ok(shortHtml.includes('12 hours of rewards, Lab and automation'),'shared cap remains visible');
const receipt={...short,elapsedSec:86400,earned:'1e400',sigilsEarned:32,motesEarned:8,ascends:4114,retreated:true,endDepth:91,pushDepth:101,
 completedStudies:[...Array(120).fill('Measured Inquiry'),...Array(4).fill('Wisp Ascension'),'A < B & C'],closedStudies:['Measured Inquiry','Measured Inquiry']};
const original=clone(receipt),html=q.endless.message(receipt);
ok(html.includes('Away for 24h 0m'),'elapsed time is not replaced by the reward cap');
ok(html.includes('<dt>Sigils</dt><dd>+32</dd>')&&html.includes('<dt>Motes</dt><dd>+8</dd>')&&!html.includes('Infinity'),'all resource types and wide amounts');
ok(html.includes('Auto Ascend: 4114 times'),'full Auto Ascend count');
ok(html.includes('Farm at Rift 91')&&html.includes('5 minutes')&&html.includes('Push saved at Rift 101'),'retreat reason and saved Push point');
ok(html.includes('Lab: 125 levels completed')&&html.includes('+120 levels')&&html.includes('+4 levels'),'complete grouped level totals');
ok((html.match(/Measured Inquiry/g)||[]).length===2,'one row per name in each outcome group');
ok(html.includes('Lab: 2 paid studies finished at cap')&&html.includes('2 finished · no levels added'),'cap closure never reported as gained levels');
ok(html.includes('A &lt; B &amp; C')&&!html.includes('A < B'),'names are safe HTML text');
ok(!html.includes('<details open')&&(html.match(/<summary tabindex="0">/g)||[]).length===2,'details initially collapsed and included in existing focus trap');
const single=q.endless.message({...short,ascends:1,completedStudies:['Wisp Ascension'],closedStudies:['Measured Inquiry']});
ok(single.includes('1 time</li>')&&single.includes('1 level completed')&&single.includes('+1 level</span>')&&single.includes('1 paid study finished'),'singular labels');
for(const field of ['completedStudies','closedStudies'])ok(q.endless.meaningful({...short,earned:0,shardEarned:0,[field]:['Only Lab']}),'Lab-only return still opens');
assert.deepEqual(receipt,original,'formatting preserves the complete receipt');assert.deepEqual(q.get(),before,'formatting preserves every gameplay field');checks+=2;
console.log(JSON.stringify({status:'PASS',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex')}));
