#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {app,seed,clone}=require('./lab-expansion-harness.cjs');
const source=fs.readFileSync(path.join(__dirname,'../../index.html'),'utf8');
let checks=0;
function eq(actual,expected,label){checks++;assert.deepEqual(actual,expected,label);}
function ok(value,label){checks++;assert(value,label);}
const x=app(source),q=x.q;
for(const [depth,capacity,slots] of [[1,0,1],[40,0,2],[60,0,3],[90,0,3],[90,1,4],[90,2,5]]){
 const s=seed(q);s.maxDepthEver=depth;s.longStudyLevels.labcapacity=capacity;q.set(s);eq(q.slots(),slots,`slot unlock at Rift ${depth} and Apparatus ${capacity}`);
}
let s=seed(q);s.longStudyLevels.labcapacity=2;q.set(s);
const ids=['wispascend','guardmastery','shardstudy','lumenstudy','motestudy'];
ids.forEach(id=>ok(q.start(id),`five paid starts ${id}`));
eq(q.get().activeStudies.map(a=>a.slot),[0,1,2,3,4],'stable distinct slots');
eq(q.start('bossledger'),false,'sixth start refused without debit');
const wallet=clone(q.get());ok(q.boost('wispascend',2,8),'pay speed on slot zero');
eq(q.get().studyBoosts.slot0.mult,2,'timer belongs to slot');
eq(q.get().motes,wallet.motes-q.boostCost(2,8),'exact Mote debit');
const original=clone(q.get().activeStudies[0]);const beforeFailure=clone(q.get());x.fail(true,false);eq(q.pause('wispascend'),false,'failed primary write rejects pause');eq(q.get(),beforeFailure,'failed pause rolls back all work and speed');x.fail(false,false);ok(q.pause('wispascend'),'paid work pauses');
eq(q.get().pausedStudies[0].remainingSec,original.remainingSec,'remaining paid work preserved');
ok(q.start('bossledger'),'different Study starts in freed slot');
eq(q.get().activeStudies.find(a=>a.id==='bossledger').slot,0,'replacement reuses slot zero');
eq(q.boostSpeed(q.get().activeStudies.find(a=>a.id==='bossledger')),2,'replacement receives prepaid slot speed');
const replacementWork=q.get().activeStudies.find(a=>a.id==='bossledger').remainingSec;q.finish(10,2000000000000);eq(q.get().activeStudies.find(a=>a.id==='bossledger').remainingSec,replacementWork-20,'replacement advances at slot speed without another Mote payment');
ok(q.pause('bossledger'),'replacement pauses');const beforeResume=clone(q.get());
ok(q.start('wispascend'),'original paid work resumes without another purchase');
eq(q.get().activeStudies.find(a=>a.id==='wispascend').remainingSec,original.remainingSec,'resume keeps exact work');
eq(q.get().lumen,beforeResume.lumen,'resume costs no Lumen');
eq(q.get().shards,beforeResume.shards,'resume costs no Shards');
ok(q.save(),'save both copies');const restored=app(source,x.storage).q;
eq(restored.get().studyBoosts.slot0,q.get().studyBoosts.slot0,'slot timer survives reload');
eq(restored.get().pausedStudies,q.get().pausedStudies,'paused paid work survives reload');
eq(restored.get().activeStudies,q.get().activeStudies,'slot identity survives reload');
const legacy=seed(q);legacy.activeStudies=[{id:'guardmastery',remainingSec:100,totalDurationSec:150,speedMult:1}];legacy.studyBoosts.guardmastery={mult:3,startedAtMs:2000000000000,expiresAtMs:2000000000000+28800000};legacy.longStudyLevels.labcapacity=2;
const canonical=q.accept(legacy);eq(canonical.studyBoosts.slot0.mult,3,'old project timer migrates to occupied slot');eq(q.accept(canonical),canonical,'migration is idempotent');
const seven=seed(q);seven.longStudyLevels.labcapacity=2;seven.activeStudies=['wispascend','guardmastery','shardstudy','lumenstudy','motestudy','procurement','catalysis'].map(id=>({id,remainingSec:100,totalDurationSec:200,speedMult:1}));
q.set(seven);eq(q.slots(),5,'new starts have five slots');eq(q.get().activeStudies.length,7,'seven older paid records are retained');eq(q.start('bossledger'),false,'overcapacity cannot start new paid work');ok(q.save(),'grandfathered work saves');eq(app(source,x.storage).q.get().activeStudies.length,7,'grandfathered work reloads');
ok(q.projects().every(n=>Number.isSafeInteger(n.levelCap)&&n.levelCap>0),'every Lab project has a finite cap');
ok(q.forgeDefs().every(n=>Number.isSafeInteger(n.levelCap)&&n.levelCap>0),'every Forge upgrade has a finite cap');
ok(q.treeDefs().every(n=>Number.isSafeInteger(n.levelCap)&&n.levelCap>0),'every Tree path has a finite cap');
const capped=seed(q);capped.longStudyLevels.wispascend=500;capped.research.masterwork=500;capped.nodes.swift=250;capped.spirits.ember=10000;capped.heroRarity.ember=5;capped.wispModules.ember=20;capped.wispUltimate.ember=true;capped.wispMastery.ember=2000;
q.set(capped);eq(q.plan('wispascend').reason,'maxed','foundation Study stops at 500');eq(q.forgePlan('masterwork').reason,'maxed','long-tail Forge stops at 500');eq(q.treePlan('swift').reason,'cap','long-tail Tree stops at 250');eq(q.spiritPlan('ember').reason,'maxed','Empower stops at 10000');eq(q.masteryPlan('ember').reason,'maxed','Mastery stops at 2000');
const historical=clone(capped);historical.longStudyLevels.wispascend=501;historical.research.masterwork=501;historical.research.arcanecal=21;historical.nodes.swift=251;historical.spirits.ember=10001;historical.wispMastery.ember=2001;
q.set(historical);eq(q.get().longStudyLevels.wispascend,501,'old Lab level retained');eq(q.get().research.masterwork,501,'old Forge level retained');eq(q.forgeBonus('arcanecal'),20*.03,'previously capped Forge effect stays bounded');eq(q.get().nodes.swift,251,'old Tree level retained');eq(q.get().spirits.ember,10001,'old Wisp level retained');eq(q.get().wispMastery.ember,2001,'old Mastery level retained');
console.log(JSON.stringify({status:'pass',checks}));
