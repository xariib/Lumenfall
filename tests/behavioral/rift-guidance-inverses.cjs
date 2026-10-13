'use strict';
// Pure source mutations for the Guidance causal controls. No browser/game runs.
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=text=>crypto.createHash('sha256').update(text).digest('hex');
const REPAIR_SHA='dd81757378880ef42052cf6b175ea06721043e0ba7213cd135d5661367a743f1';
const OLD_COPY_COMMIT='3f1505d14fbc856160314af22547e28891043330';
const OLD_COPY_SHA='4eb7bb4469a8a82981817fe7077cf5493f020774ec4c34d79312afe3bc99709c';
const newTitle="title:'Ascend for permanent power',",oldTitle="title:'Permanent power is waiting',";
function oldTitleInverse(html){
 assert.equal(html.split(newTitle).length,2,'Exactly one production title literal');
 assert(!html.includes(oldTitle),'Old title must be absent before the inverse');
 const text=html.replace(newTitle,oldTitle),sourceSha256=hash(text);
 assert.equal(text.replace(oldTitle,newTitle),html,'Exact single-title roundtrip');
 const historicalMatch=hash(html)===REPAIR_SHA;
 if(historicalMatch)assert.equal(sourceSha256,OLD_COPY_SHA,'Original repair inverse equals the published previous source');
 return {html:text,sourceSha256,historicalMatch,publishedSourceCommit:historicalMatch?OLD_COPY_COMMIT:null};
}
function guidanceCssRange(html){
 const startToken='  /* F07: the hint body has the same reserved space when hidden or scrollable. */';
 const endToken='  .stage .objective-kind{';
 const start=html.indexOf(startToken),end=html.indexOf(endToken,start);
 assert(start>=0&&start===html.lastIndexOf(startToken),'Unique Guidance CSS start');
 assert(end>start&&end===html.lastIndexOf(endToken),'Unique Guidance CSS end');
 const styleStart=html.lastIndexOf('<style',start),styleOpenEnd=html.indexOf('>',styleStart),styleEnd=html.indexOf('</style>',styleOpenEnd);
 assert(styleStart>=0&&styleOpenEnd<start&&styleEnd>=end&&html.lastIndexOf('</style>',start)<styleStart,'Guidance CSS anchors stay inside one stylesheet');
 return {start,end,text:html.slice(start,end)};
}
function oldLayoutInverse(html,baselineHtml){
 const current=guidanceCssRange(html),baseline=guidanceCssRange(baselineHtml);
 const text=html.slice(0,current.start)+baseline.text+html.slice(current.end);
 const mutated=guidanceCssRange(text);
 assert.equal(mutated.text,baseline.text,'Complete original Guidance CSS, including absence of the new pseudo-element');
 assert.equal(text.slice(0,mutated.start),html.slice(0,current.start),'All source before Guidance CSS unchanged');
 assert.equal(text.slice(mutated.end),html.slice(current.end),'All source after Guidance CSS unchanged');
 assert.equal(text.slice(0,mutated.start)+current.text+text.slice(mutated.end),html,'Exact CSS inverse roundtrip');
 return {html:text,sourceSha256:hash(text),ledger:{currentStart:current.start,currentEnd:current.end,mutatedEnd:mutated.end,currentCssSha256:hash(current.text),baselineCssSha256:hash(baseline.text),currentCss:current.text,baselineCss:baseline.text,outsideCssUnchanged:true,roundtripExact:true}};
}
module.exports={oldTitleInverse,oldLayoutInverse,guidanceCssRange};
