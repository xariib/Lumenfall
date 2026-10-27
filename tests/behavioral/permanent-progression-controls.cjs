'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto'),{replaceFunction,replaceOne}=require('./comet-expansion-numerical.cjs'),{verify:accept}=require('./permanent-progression.cjs');
function verify(source){
 const controls=[
  ['fixed-quantity-not-partial','getResearchBuyPlan','else count=requested;','else count=1;'],
  ['original-command-refund-price','retiredCommandCost','return total;','return total*2;'],
  ['settled-refund-never-replays','settleCommandRefund','!receipt.paid&&',''],
  ['independent-permanent-prices','astralCost','Math.ceil(item.baseCost*Math.pow(item.growth,level))','Math.ceil(item.baseCost*Math.pow(item.growth,level))+1'],
  ['purchased-power-invalidates-cache','wispPower',",astralLevel('astralcore')",''],
  ['commands-stay-unavailable','getCometCommandPlan','available:false','available:true'],
  ['command-owner-is-inert','activateCometCommand','return false;','return true;'],
  ['defeats-do-not-recharge','cometRecordDefeats',null,'state.cometWork=1;'],
  ['farm-cannot-target-uncleared-frontier','selectFarmDepth','depth>=returning','depth>returning'],
  ['hidden-page-cannot-invest','cometMutationOpen','!document.hidden && ',''],
  ['primary-failure-rolls-back','cometCommitMutation','if(!saved && state===working){state=base;ascendRunToken=oldRun;return false;}','if(!saved && state===working){return false;}']
 ];
 const out=[];for(const [id,name,from,to]of controls){const changed=replaceFunction(source,name,body=>from===null?to:replaceOne(body,from,to));let error;try{accept(changed);}catch(e){error=e;}assert(error?.code==='ERR_ASSERTION','semantic rejection required, not a parser/runtime failure: '+id+' '+error?.stack);out.push({id,function:name,sourceSha256:crypto.createHash('sha256').update(changed).digest('hex'),detected:true,message:error.message});}return out;
}
module.exports={verify};
if(require.main===module){const fs=require('fs');console.log(JSON.stringify({status:'pass',negativeControls:verify(fs.readFileSync(process.argv[2]||'index.html','utf8'))}));}
