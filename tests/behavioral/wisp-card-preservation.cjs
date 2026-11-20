'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict'),path=require('node:path');
const {app}=require('./forge-expansion-harness.cjs');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
function manifest(html){
 const script=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1].replace(/\r\n/g,'\n');
 const names=[...new Set([...script.matchAll(/^function ([A-Za-z_$][\w$]*)\(/gm)].map(m=>m[1]))];
 const marker="if(document.readyState==='loading'){";assert.equal(html.split(marker).length,2);
 const bridge='window.endlessQa={functions:{'+names.map(n=>JSON.stringify(n)+':'+n+'.toString()').join(',')+'}};';
 const functions=app(html.replace(marker,bridge+marker)).q.endless.functions;
 let remainder=script;for(const [name,body]of Object.entries(functions)){const normalized=body.replace(/\r\n/g,'\n');assert(remainder.includes(normalized),'original function body '+name);remainder=remainder.replace(normalized,'');}
 remainder=remainder.replace(/^var WISP_ACTION_KEYS=.*;\n?/m,'').replace(/^var managedWispId='',wispRosterScroll=null;\n?/m,'').replace(/\s/g,'');
 return {sourceSha256:hash(html),functions:Object.fromEntries(Object.entries(functions).map(([n,v])=>[n,hash(v.replace(/\r\n/g,'\n'))])),catalogAndNonFunctionCodeSha256:hash(remainder)};
}
const ui=new Set(['presentControlStates','openPowerAdvice','renderFormationPresets','wispDamageMarkup','restoreWispActionView','highlightWispActions','renderSpirits','init']);
const additions=new Set(['openWispManagement','closeWispManagement','arrangeWispCards']);
function verify(html,baseline){
 assert.equal(baseline.sourceSha256,'39199dfe5160773e0fb1300878b4119183a7a6e071871135699982b284759bd4','immutable released148 baseline');
 const current=manifest(html),changed=[];
 for(const [name,digest]of Object.entries(baseline.functions)){assert(current.functions[name],'no removed function '+name);if(current.functions[name]!==digest){assert(ui.has(name),'protected gameplay/save function changed: '+name);changed.push(name);}}
 for(const name of Object.keys(current.functions))if(!baseline.functions[name])assert(additions.has(name),'only declared presentation additions: '+name);
 assert.equal(current.catalogAndNonFunctionCodeSha256,baseline.catalogAndNonFunctionCodeSha256,'all original catalogs/non-function script code retained (only UI declarations and whitespace excluded)');
 return {status:'PASS',sourceSha256:current.sourceSha256,baseline:baseline.sourceSha256,protectedFunctions:Object.keys(baseline.functions).length-changed.length,changedPresentationFunctions:changed,addedPresentationFunctions:Object.keys(current.functions).filter(n=>!baseline.functions[n]),catalogAndNonFunctionCodeSha256:current.catalogAndNonFunctionCodeSha256};
}
module.exports={manifest,verify};
if(require.main===module){const source=process.argv[2]||'index.html',baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'../../docs/qa/wisp-card-redesign-001/baseline-functions.json')));console.log(JSON.stringify(verify(fs.readFileSync(source,'utf8'),baseline)));}
