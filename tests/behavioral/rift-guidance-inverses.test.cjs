'use strict';
// Reproduce the future-unrelated-byte CI regression without launching a game.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {oldTitleInverse,oldLayoutInverse,guidanceCssRange}=require('./rift-guidance-inverses.cjs');
assert.equal(process.argv.length,4,'Usage: node rift-guidance-inverses.test.cjs CURRENT_HTML BASELINE_HTML');
const source=fs.readFileSync(process.argv[2],'utf8'),baseline=fs.readFileSync(process.argv[3],'utf8');
const hash=text=>crypto.createHash('sha256').update(text).digest('hex');
const base=oldTitleInverse(source),layout=oldLayoutInverse(source,baseline);
assert.equal(base.sourceSha256,hash(base.html));
assert.equal(base.historicalMatch,hash(source)==='dd81757378880ef42052cf6b175ea06721043e0ba7213cd135d5661367a743f1');
assert.equal(base.publishedSourceCommit,base.historicalMatch?'3f1505d14fbc856160314af22547e28891043330':null);
const probes=[source+'\n<!-- unrelated future documentation comment -->\n','<!-- unrelated future prefix -->\n'+source];
for(const future of probes){
 const inverse=oldTitleInverse(future),css=oldLayoutInverse(future,baseline);
 assert.equal(inverse.html,future.replace("title:'Ascend for permanent power',","title:'Permanent power is waiting',"));
 assert.equal(inverse.sourceSha256,hash(inverse.html));assert.equal(inverse.historicalMatch,false);assert.equal(inverse.publishedSourceCommit,null);
 assert.equal(guidanceCssRange(css.html).text,guidanceCssRange(baseline).text);
 assert.equal(css.html.slice(0,css.ledger.currentStart)+css.ledger.currentCss+css.html.slice(css.ledger.mutatedEnd),future);
}
assert.throws(()=>oldTitleInverse(source.replace("title:'Ascend for permanent power',","title:'Changed title',")),/Exactly one production title/);
assert.throws(()=>oldTitleInverse(source+"\ntitle:'Ascend for permanent power',"),/Exactly one production title/);
assert.throws(()=>oldTitleInverse(source+"\ntitle:'Permanent power is waiting',"),/Old title must be absent/);
assert(layout.ledger.baselineCss.includes('margin:0 10px;'));
assert(layout.ledger.baselineCss.includes('width:9.5em;'));
assert(layout.ledger.baselineCss.includes('padding:2px 6px;'));
assert(layout.ledger.baselineCss.includes('padding:4px 6px;'));
assert(layout.ledger.baselineCss.includes('gap:5px;'));
assert(!layout.ledger.baselineCss.includes('#rift-hints-toggle::before'));
assert.equal(layout.html.slice(0,layout.ledger.currentStart)+layout.ledger.currentCss+layout.html.slice(layout.ledger.mutatedEnd),source);
assert.throws(()=>oldLayoutInverse(source.replace('/* F07:','/* changed:'),baseline),/Unique Guidance CSS start/);
assert.throws(()=>oldLayoutInverse(guidanceCssRange(source).text+'  .stage .objective-kind{',baseline),/inside one stylesheet/);
console.log(JSON.stringify({status:'pass',scope:'Pure inverse regression; no game/browser executed',sourceSha256:hash(source),baselineSha256:hash(baseline),unrelatedFutureProbes:probes.length,invalidTitleCases:3,completeBaselineCss:true,roundtripsExact:true,historicalMatch:base.historicalMatch,oldTitleSourceSha256:base.sourceSha256,oldLayoutSourceSha256:layout.sourceSha256}));
