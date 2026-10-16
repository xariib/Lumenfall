'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const root='docs/qa/endless-progression-001',input=root+'/candidate-combined-c.html',output=root+'/candidate-combined-d.html';
const original=fs.readFileSync(input,'utf8');assert.equal(original.split('titan:{depth:100,lab:40}').length,2);const source=original.replace('titan:{depth:100,lab:40}','titan:{depth:100,lab:43}');fs.writeFileSync(output,source);
const runtime=root+'/runtimes/timed-twelve';
for(const file of ['tests/behavioral/endless-campaign.cjs','tests/behavioral/forge-expansion-harness.cjs','scripts/lib/game-amount.cjs']){
 const target=path.join(runtime,file);fs.mkdirSync(path.dirname(target),{recursive:true});let bytes=fs.readFileSync(root+'/runtimes/timed-two/'+file);
 if(file.endsWith('endless-campaign.cjs')){
  let s=bytes.toString();const from='speed:function(preferred,budget){';assert.equal(s.split(from).length,2);s=s.replace(from,'speed:function(preferred,budget,hours){');
  const quote='if(tier<=preferred && tier>active.speedMult && Amount.le(speedTierCost(tier,node),Amount.mul(state.motes,budget)))return applySpeedTier(node.id,tier);';assert.equal(s.split(quote).length,2);
  s=s.replace(quote,'if(tier<=preferred && tier>active.speedMult && Amount.le(studyBoostCost(tier,hours),Amount.mul(state.motes,budget)))return activateStudyBoost(node.id,tier,hours);');
  assert.equal(s.split('b.speed(policy.speed,policy.budget);').length,2);s=s.replace('b.speed(policy.speed,policy.budget);','b.speed(policy.speed,policy.budget,policy.sessions===2?12:8);');bytes=Buffer.from(s);
 }
 fs.writeFileSync(target,bytes);
}
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');fs.writeFileSync(root+'/candidate-combined-d.json',JSON.stringify({status:'EXPERIMENT',baseSourceSha256:hash(original),sourceSha256:hash(source),changes:['Titan completed Lab43 instead of40, after C observed recruitment19.33d','Explicit player policy buys12h packages for12h session gaps,8h for8h or shorter; paid only at visits with earned funds'],limits:'Fresh runs required; no checkpoint rebasing or changed timer/prices.'},null,2)+'\n');
