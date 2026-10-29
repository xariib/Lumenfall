'use strict';
// Independent accepted pacing table. ES5 so the existing V8 6.0 gate can use it.
var days={measuredinquiry:90,procurement:90,catalysis:120,focusprotocol:14,fieldnotes:60,curriculum:7,bossledger:180,luminousdistill:240,sigilcartography:30,rarityappraisal:60,modulefabrication:90,ultimateanalysis:120,resonantefficiency:14,adaptivegrowth:14,wispdamage:365,wispcritchance:365,wispcritdamage:365};
function nominal(node,level){
  if(node.id==='labcapacity')return [1296000,8640000][Math.min(1,Math.max(0,level))];
  var old=Math.round(Math.min(864000,node.baseDurationSec*Math.pow(node.durationGrowth,level)));
  if(!days[node.id]||level<2)return old;
  var weights=0;for(var i=2;i<node.levelCap;i++)weights+=(i-1)*(i-1)*(i-1);
  var factor=node.id==='focusprotocol'?0.7:node.id==='curriculum'?0.8:0.56;
  var step=Math.min(level,node.levelCap-1)-1;
  return Math.max(old,Math.ceil((days[node.id]*691200+node.levelCap)*step*step*step/(factor*weights)));
}
function capacityReady(s,rank){
  s.maxDepthEver=rank?300:150;s.ascendCount=rank?100:25;
  var ids=['wispascend','guardmastery','shardstudy','lumenstudy','motestudy','wispdamage'];
  if(rank)ids=ids.concat(['wispcritchance','wispcritdamage','measuredinquiry','bossledger']);
  ids.forEach(function(id){s.longStudyLevels[id]=rank?15:10;});
  if(rank){s.longStudyLevels.measuredinquiry=10;s.longStudyLevels.wispascend=20;}
  return s;
}
module.exports={days:days,nominal:nominal,capacityReady:capacityReady};
