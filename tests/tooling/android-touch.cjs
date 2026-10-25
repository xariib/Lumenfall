'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {transformFromProbes, nativePoint, requireCenteredPointer} = require('../../scripts/lib/android-touch.cjs');

let controls = 0;
function rejects(fn, message) { assert.throws(fn, message); controls++; }
function probes(scale, x, y) {
  return [{x:100,y:200},{x:148,y:224}].map(point => ({
    native: {x:point.x*scale+x,y:point.y*scale+y},
    event: {type:'pointerdown',trusted:true,interactive:false,x:point.x,y:point.y}
  }));
}
for (const [scale,x,y] of [[1,0,24],[2,16,48],[1.25,8,30],[1,0,0]]) {
  const transform=transformFromProbes(probes(scale,x,y),scale);
  assert.deepEqual(transform,{scale,x,y});
  assert.deepEqual(nativePoint(transform,{x:160,y:397}),{x:Math.round(160*scale+x),y:Math.round(397*scale+y)});
}
const before=JSON.parse(fs.readFileSync(path.join(__dirname,'../../docs/qa/offline-recap-release-001/before-touch.json')));
assert.equal(before.welcome.y,397);
assert.equal(before.events.find(e=>e.type==='pointerdown').y,373);
rejects(()=>requireCenteredPointer(before.events,before.welcome,'welcome-claim'),/CSS center/);
const centered=[{type:'pointerdown',trusted:true,target:'welcome-claim',x:160,y:397},{type:'click',trusted:true,target:'welcome-claim'}];
requireCenteredPointer(centered,{x:160,y:397},'welcome-claim');
rejects(()=>requireCenteredPointer(centered.map(e=>({...e,trusted:false})),before.welcome,'welcome-claim'),/Trusted native pointer/);
rejects(()=>requireCenteredPointer(centered.slice(0,1),before.welcome,'welcome-claim'),/Trusted native click/);
rejects(()=>transformFromProbes(probes(1,0,24),0),/scale/);
rejects(()=>transformFromProbes(probes(1,0,24).slice(0,1),1),/Two independent/);
for (const key of ['trusted','interactive']) {
  const bad=probes(1,0,24);bad[0].event[key]=key==='interactive';
  rejects(()=>transformFromProbes(bad,1));
}
const moving=probes(1,0,24);moving[1].native.y+=5;
rejects(()=>transformFromProbes(moving,1),/Stable WebView Y/);
console.log(JSON.stringify({status:'PASS',transforms:4,negativeControls:controls,historical24pxErrorRejected:true}));
