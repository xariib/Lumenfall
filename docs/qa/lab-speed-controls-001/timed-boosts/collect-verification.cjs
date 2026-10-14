'use strict';
// Save compact source-bound receipts; ignored raw logs stay available locally.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),file=p=>path.join(__dirname,p),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const source=fs.readFileSync(path.join(root,'index.html'),'utf8'),sourceSha256=sha(source);
function json(p){return JSON.parse(fs.readFileSync(file(p),'utf8'));}
function log(p){const lines=fs.readFileSync(file(p),'utf8').split('\n'),line=lines.find(s=>s.startsWith('  detail:'));
 assert(lines.some(s=>s.startsWith('PASS ')),'successful process required: '+p);
 const bound=JSON.parse(lines.find(s=>s.startsWith('Staged source: ')).slice(15));assert.equal(bound.source_sha256,sourceSha256,p+' source');
 const result=JSON.parse(line.slice(9));assert(!result.status||result.status==='pass',p+' driver result');return result;}
const checks=[];
for(const [name,p]of [['timed core','core.json'],['Lab expansion core','expansion-core.json'],['caps/old paid value','caps-core.json'],['V8 6.0 Lab engine','v8-lab.json'],['offline transaction','offline-integration.json'],['native slider/duration/activation','native-ui.json'],['existing Lab catalog mobile','expansion-ui.json']]){
 const r=json(p);assert.equal(r.status,'pass',name);assert.equal(r.sourceSha256,sourceSha256,name+' source');checks.push({name,status:r.status,receipt:p,checks:r.checks,profiles:r.profiles?.length,controls:r.controls||r.negativeControls,records:name==='offline transaction'?r.records:undefined});
}
const regression=log('regression-final.log');assert.equal(regression.records.length,22);assert(regression.records.every(r=>r.status==='pass'));
checks.push({name:'existing browser regressions',status:'pass',scenarios:regression.records.map(r=>({scenario:r.scenario,status:r.status,checks:r.payload.detail.checks,fixtures:r.payload.detail.fixtures})),teardown:regression.teardown});
for(const p of ['final-lab-motes-native.log','final-lab-motes-reduced-motion.log','final-lab-motes-numerical.log','final-lab-motes-runtime.log']){const r=log(p);checks.push({name:p,status:'pass',checks:r.checks,profiles:r.records?.length,details:r.records?.map(x=>({width:x.width,textScale:x.textScale,motion:x.motion,presentationChecks:x.labUi?.checks})),causalControl:r.causalControl,teardown:r.teardown});}
for(const [p,a,b]of [
 ['mutate-selection.json','state.studySpeedTargets[id]=LAB_SPEED_TIERS[index];','state.studySpeedTargets[id]=LAB_SPEED_TIERS[index];applySpeedTier(id,LAB_SPEED_TIERS[index]);'],
 ['mutate-select.json','  replaceStudyMarkup(html);',"  replaceControlMarkup(els['study-list'],html);"]]){
 const r=json(p);assert.equal(r.status,'fail');assert(r.error.includes('AssertionError'));assert.equal(r.sourceSha256,sha(source.replace(a,b)),p+' source mutation');checks.push({name:p,status:'expected-failure',assertion:r.error.split('\n')[0]});
}
const report={status:'local-focused-pass',sourceSha256,node:process.version,browser:json('native-ui.json').version,checks,
 limits:['Self-review; no independent review','Synthetic income fixtures, not player telemetry','Full combined/main/CI/GitHub acceptance pending','No APK/build/signing or physical Android/WebView60/TalkBack acceptance','Wall-clock deadlines are not a trusted or tamper-resistant server clock'],
 findings:['Optional Windows dump-dom/CDP-DOM transport sometimes returns valid PASS DOM but fails browser teardown; same assertions pass via the existing native CDP regression driver. Process exit requirements were retained.','Existing numerical fixtures refer to absent summary.abilityCasts; their exact kill/damage/currency assertions and causal controls pass. A separate test cleanup can use recorded ability timeline events.','Do not pass the entire repository as --web-root: the runner copies that tree. Use source/assets-only staging. Unrelated validation-evidence remains untouched.']};
fs.writeFileSync(file('verification.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,sourceSha256,checks:checks.length,scenarios:regression.records.length}));
