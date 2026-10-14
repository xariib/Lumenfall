'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,seed,source:defaultSource,copy}=require('./formation-bonds.cjs');
const source=process.argv[2]?require('node:fs').readFileSync(process.argv[2],'utf8'):defaultSource;
const extra='window.qa.plan=bestNowFormationPlan;window.qa.field=fieldBestNowFormation;';
let checks=0;function ok(value,label){checks++;assert(value,label);}
const contexts=[['Push',101,['ember','void','gale','thorn','tide']],['Farm',101,['tide','aurora','gale','thorn','stone']],['Boss',100,['ember','void','stone','titan']]];
function run(html=source){
 for(const [label,depth,required] of contexts)for(const seats of [0,1])for(const preset of ['push','farm','boss','']){
  const a=app(html,extra),b=a.b;
  const setup=()=>{let s=seed(b,['titan'],depth);s.nodes.formationseat=seats;s.activeFormationPreset=preset;
   s.formationPresets={push:['titan'],farm:['ember'],boss:['stone']};
   if(preset)s.formationPresets[preset]=['titan'];
   if(label==='Farm'){s.riftMode='farm';s.farmReturnDepth=102;s.farmDepth=101;}
   b.set(s);return copy(b.get());};
  let before=setup(),plan=b.plan();ok(plan.focus.label===label,'current context');assert.deepEqual(plan.required,required);checks++;
  ok(plan.members.length<=5+seats,'owned slot cap');ok(plan.available,'recruited required team available');
  for(const id of required){setup();let s=copy(b.get());s.spirits[id]=0;b.set(s);const initial=copy(b.get());
   ok(b.plan().missing.includes(id),'every missing recruit detected');ok(!b.field(),'missing recruit refuses whole operation');assert.deepEqual(b.get(),initial);checks++;
  }
  before=setup();plan=b.plan();ok(b.field(),'fields full recommendation');
  const expected=copy(before);expected.activeParty=plan.members.slice();if(preset)expected.formationPresets[preset]=plan.members.slice();
  expected.formationRebuild=null;expected.lastSeen=b.get().lastSeen;assert.deepEqual(b.get(),expected,'only selected formation and save timestamp change');checks++;
  ok(required.every(id=>b.get().activeParty.includes(id)),'all recommended members fielded');
  const after=copy(b.get());ok(!b.field(),'repeat/already-fielded action is inert');assert.deepEqual(b.get(),after);checks++;
  b.load();assert.deepEqual(b.get(),after,'real primary save reload preserves exact state');checks++;
  setup();const failureBefore=copy(b.get());a.fail(true);ok(!b.field(),'failed primary save reports refusal');assert.deepEqual(b.get(),failureBefore,'failed save rolls back formation');checks++;a.fail(false);
  // Only required members, not all eight, are needed. Keep a powered required
  // starter and no unrelated extras so their absence cannot affect the plan.
  setup();let partial=copy(b.get());b.spirits.forEach(sp=>{if(!required.includes(sp.id))partial.spirits[sp.id]=0;});partial.activeParty=[required[0]];
  if(preset)partial.formationPresets[preset]=partial.activeParty.slice();b.set(partial);ok(b.plan().available,'unrelated unrecruited Wisps do not gate');ok(b.field(),'fields when only required Wisps recruited');
 }
 const a=app(html,extra),b=a.b;let s=seed(b,['tide'],100);s.activeFormationPreset='';s.cometClaims.retired.comettrials='settled';s.ascendCount=1;s.cometTrial={id:'single',target:99,phase:'active',startedAscend:1,failed:false};b.set(s);
 ok(b.field(),'trial still permits ordinary formation edit');ok(b.get().cometTrial.failed&&b.get().cometTrial.reason==='party','existing trial party rule retained');
 let custom=seed(b,['titan'],101);custom.activeFormationPreset='push';custom.formationPresets.push=['titan','void'];custom.formationRebuild={preset:'push',members:['titan','void']};custom.spirits.void=0;b.set(custom);
 const pending=copy(b.get());ok(!b.field(),'pending required recruit blocks recommendation');assert.deepEqual(b.get(),pending);checks++;
 return checks;
}
run();const controls=[];
for(const [name,from,to] of [
 ['recruitment','missing.length===0','true'],
 ['all-eight','missing.length===0',"missing.length===0 && SPIRITS.every(function(sp){return (state.spirits[sp.id]||0)>0;})"],
 ['preset','commitFormationMembers(plan.members);','state.activeParty=plan.members.slice();'],
 ['trial',"trial.failed=true;trial.reason='party';","/* omitted party rule */"]]){
 assert(source.includes(from),name+' unique mutation anchor exists');let caught=false;try{run(source.replace(from,to));}catch(e){if(!(e instanceof assert.AssertionError))throw e;caught=true;controls.push({name,error:e.message});}ok(caught,name+' control caught');
}
console.log(JSON.stringify({status:'pass',checks,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),controls}));
