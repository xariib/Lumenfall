'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {app,clone}=require('./forge-expansion-harness.cjs');
let html=fs.readFileSync(process.argv[2]||'index.html','utf8');
const baseline=fs.readFileSync(require('node:path').join(__dirname,'../../docs/qa/finish-development-release-001/early-wisps/baseline-support.html'),'utf8');
assert.equal(crypto.createHash('sha256').update(baseline).digest('hex'),'d81ae87e388b52a0cd575fe45534ac85236dbab9374adb91bbde9be6878bd735');
if(process.env.EARLY_WISP_MUTANT){
 const changes={missing:['352*Math.pow(Math.max(0,level-70),2)','0'],boundary:['level-70','level-69'],titan:["sp.id==='stone'","sp.id==='stone' || sp.id==='titan'"]};
 const p=changes[process.env.EARLY_WISP_MUTANT];assert(p);assert.equal(html.split(p[0]).length,2);html=html.replace(p[0],p[1]);
}
// Observe unchanged pre-curve pricing directly from the frozen whole game.
const previous=app(baseline);
const current=app(html),q=current.q,p=previous.q;
let checks=0;const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);};
const ids=['ember','tide','stone','gale','thorn','void','aurora','titan'];
const levels=[0,1,25,69,70,71,72,80,100,170,250,500];
const rarity=[1,1.5,2.25,3.5,5.5,9];
const prices=[];
for(const id of ids)for(const level of levels)for(let tier=0;tier<6;tier++){
 const s=q.fresh();s.maxDepthEver=250;s.spirits[id]=level;s.heroRarity[id]=tier;
 s.activeParty=[id];q.set(s);p.set(s);
 const before=clone(q.get()),base=q.sp(id).basePower;
 const bonus=(id==='ember'||id==='stone')&&level>70?352*(level-70)*(level-70):0;
 const expected=level>0?(base*level*(1+.01*(level-1))+bonus)*rarity[tier]:0;
 eq(q.power(id,level),expected,'independent approved power '+id+'/'+level+'/'+tier);
 if(id!=='ember'&&id!=='stone'||level<=70)eq(q.power(id,level),p.power(id,level),'unaffected power bit-identical');
 eq(q.get(),before,'power lookup does not alter any saved field');
 // Compare real cost paths including Tree discounts and Gentle Growth.
 for(const rank of [0,5]){
  const state=q.get();state.nodes.gentlegrowth=rank;state.nodes.bonds=20;q.set(state);p.set(state);
  eq(q.empowerCost(id),p.empowerCost(id),'unchanged real Empower price '+id+'/'+level+'/'+rank);
 }
 if(tier===0)prices.push({id,level,power:q.power(id),cost:q.empowerCost(id)});
}
eq(q.sp('titan'),p.sp('titan'),'Titan definition unchanged');
eq(q.defs(),p.defs(),'Forge prices/caps/definitions unchanged');
const controls=[];
if(process.argv.includes('--negative'))for(const id of ['missing','boundary','titan']){
 const r=require('node:child_process').spawnSync(process.execPath,[__filename,process.argv[2]||'index.html'],{encoding:'utf8',env:{...process.env,EARLY_WISP_MUTANT:id}});
 assert(!r.error);assert.equal(r.status,1);assert(r.stderr.includes('AssertionError'));controls.push(id);
}
console.log(JSON.stringify({status:'PASS',checks,controls,prices,sourceSha256:crypto.createHash('sha256').update(html).digest('hex')}));
