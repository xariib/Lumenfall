'use strict';
// Real modern/legacy production execution; no Android DOM or native claim.
var fs=require('fs'),path=require('path'),assert=require('assert'),crypto=require('crypto');
var args=process.argv.slice(2),sourcePath=path.resolve(args[0]||'index.html'),source=fs.readFileSync(sourcePath,'utf8');
assert(args.indexOf('--observe')<0||args.indexOf('--probe')>=0,'observation is not an acceptance run');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'refund-original-modern-prices.json'))).digest('hex'),'eb1de3966e989ccc0c99bfc51d0cf4b21c431252c39766352efd098acc5b6e43','immutable pre-change original reference');
function option(name){var i=args.indexOf(name);return i<0?null:args[i+1];}
function probe(){
 var window={addEventListener:function(){}},document={readyState:'loading',addEventListener:function(){},getElementById:function(){return null;},querySelector:function(){return null;}};
 var bridge="window.refundQa={fresh:freshState,accept:acceptPersistedState};";
 var script=source.match(/<script>\s*([\s\S]*?)<\/script>/)[1].replace("if(document.readyState==='loading'){",bridge+"if(document.readyState==='loading'){");
 new Function('window','document','localStorage',script)(window,document,{getItem:function(){return null;},setItem:function(){},removeItem:function(){}});
 var observed=require('./cheaper-receipt-prices.json');
 var q=window.refundQa,original=Object.assign({},require('./refund-original-modern-prices.json').modern,{bonds:observed.modern.map(function(n,i){return Math.max(n,observed.legacy[i]);})}),records=[],issued=[];
 [95,2100,2500,1e300].forEach(function(raw){['echo','bonds','mixed'].forEach(function(kind){
  var s=q.fresh();delete s.feedbackMigration;delete s.refundCredits;s.prisms=17;
  s.nodes.echo=kind==='bonds'?0:raw;s.nodes.bonds=kind==='echo'?0:raw;
  var accepted=q.accept(s),proof={raw:raw,kind:kind,prisms:accepted.prisms,credits:accepted.refundCredits.prisms,receipts:accepted.feedbackMigration.receipts,history:accepted.feedbackMigration.history};
  if(args.indexOf('--observe')<0)['echo','bonds'].forEach(function(id){var r=proof.receipts['node.'+id];if(r)assert.deepEqual(r.amounts.prisms,original[id].slice(0,raw-(id==='echo'?6:20)),'frozen original modern schedule '+id+'/'+raw);});
  assert.deepEqual(q.accept(accepted),accepted,'issued record never revalued');records.push(proof);
 });});
 if(args.indexOf('--observe')<0)require('./refund-issued-legacy.json').records.forEach(function(old){
  var s=q.fresh();s.nodes.echo=old.kind==='bonds'?0:old.raw;s.nodes.bonds=old.kind==='echo'?0:old.raw;s.prisms=old.prisms;s.refundCredits.prisms=old.credits;s.feedbackMigration.receipts=old.receipts;s.feedbackMigration.history=old.history;
  var accepted=q.accept(s),preserved={raw:old.raw,kind:old.kind,prisms:accepted.prisms,credits:accepted.refundCredits.prisms,receipts:accepted.feedbackMigration.receipts,history:accepted.feedbackMigration.history};assert.deepEqual(preserved,old,'actual old engine issued refund preserved without revaluation');issued.push(preserved);
 });
 return {node:process.version,v8:process.versions.v8,records:records,issued:issued};
}
if(args.indexOf('--probe')>=0){process.stdout.write(JSON.stringify(probe()));}
else{
 var child=require('child_process'),modern=probe(),legacyNode=option('--legacy-node');assert(legacyNode,'explicit actual legacy runtime required');
 var executed=child.spawnSync(legacyNode,[__filename,sourcePath,'--probe'],{encoding:'utf8',timeout:30000,maxBuffer:8*1024*1024});
 assert.ifError(executed.error);assert.equal(executed.status,0,executed.stderr);var legacy=JSON.parse(executed.stdout);
 assert(/^v8\.3\.0$/.test(legacy.node)&&/^6\.0\./.test(legacy.v8),'actual V8.6.0 required');
 assert.deepEqual(legacy.records,modern.records,'initial wallet, every original price, remaining credit/audit/history identical across engines');
 assert.deepEqual(legacy.issued,modern.issued,'both engines preserve actual older-engine issued values');
 var negative=[];
 if(args.indexOf('--negative')>=0){var os=require('os'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'refund-parity-'));try{
  [['echo','value=echoingRestOriginalValues[echoingRestRefundPrices.length]','value=2*Math.pow(1.40,level)'],['bonds','price=cheaperRecruitmentCanonicalPrices[level-20]','price=Math.ceil(value)']].forEach(function(control){
   var id=control[0],anchor=control[1];assert.equal(source.split(anchor).length,2,'one causal price anchor '+id);var mutated=source.replace(anchor,control[2]),file=path.join(temp,id+'.html');fs.writeFileSync(file,mutated);
   var killed=child.spawnSync(legacyNode,[__filename,file,'--probe'],{encoding:'utf8',timeout:30000,maxBuffer:8*1024*1024});assert.ifError(killed.error);assert.equal(killed.status,1,'host-engine price mutant must fail '+id);assert(/AssertionError/.test(killed.stderr)&&killed.stderr.indexOf('frozen original modern schedule '+id)>=0,'specific independent original-price assertion required '+id);assert(!/TypeError|ReferenceError|SyntaxError|EPERM|EACCES|ENOENT/.test(killed.stderr),'runtime failure cannot count as a killed mutant');negative.push({id:id,sourceSha256:crypto.createHash('sha256').update(mutated).digest('hex'),assertion:'frozen original modern schedule '+id,stderrSha256:crypto.createHash('sha256').update(killed.stderr).digest('hex')});
  });
 }finally{fs.readdirSync(temp).forEach(function(file){fs.unlinkSync(path.join(temp,file));});fs.rmdirSync(temp);}}
 var result={status:'PASS',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),modern:{node:modern.node,v8:modern.v8},legacy:{node:legacy.node,v8:legacy.v8},cases:modern.records.length,issuedLegacyCases:modern.issued.length,negative:negative,recordsSha256:crypto.createHash('sha256').update(JSON.stringify(modern.records)).digest('hex'),originalFixtureSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'refund-original-modern-prices.json'))).digest('hex'),issuedFixtureSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'refund-issued-legacy.json'))).digest('hex'),scope:'Both original initial refunds, exact wallet/credit/receipt/history parity and repeat normalization; both engines retain original previously-issued legacy values. No native claim.'};
 var output=option('--output');if(output)fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}
