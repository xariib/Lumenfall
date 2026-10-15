'use strict';
// Disabling historical write observations must not change storage or failures.
const fs=require('node:fs'),assert=require('node:assert/strict'),{app,seed,clone}=require('./forge-expansion-harness.cjs');
const source=fs.readFileSync('index.html','utf8');let checks=0;
function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
const a=app(source),b=app(source,undefined,{retainWrites:false}),initial=seed(a.q);
a.q.set(clone(initial));b.q.set(clone(initial));
for(const pair of [[false,false],[true,false],[false,true],[false,false]]){
 a.fail(...pair);b.fail(...pair);eq(a.q.save(),b.q.save(),'identical save result under each injected fault');
 eq(a.q.get(),b.q.get(),'identical live saved fields');eq([...a.storage],[...b.storage],'identical actual storage writes');
}
assert(a.writes.length>0);checks++;eq(b.writes.length,0,'only the obsolete observation history is omitted');
a.fail(false,false);b.fail(false,false);a.q.load();b.q.load();eq(a.q.get(),b.q.get(),'identical recovery reload');
console.log(JSON.stringify({status:'PASS',checks,limits:'Test-harness observation setting only; product writes and fault behavior retained.'}));
