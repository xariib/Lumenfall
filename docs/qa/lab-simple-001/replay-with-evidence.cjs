'use strict';
// Run the existing independent replay unchanged, redirecting its receipt into
// this feature's evidence instead of overwriting an earlier Lab task's result.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'../../..'),original=path.join(root,'tests/behavioral/lab-speed-replay-compare.cjs');
const label=process.argv[3]||'integrated';assert(/^[a-z0-9-]+$/.test(label));
let source=fs.readFileSync(original,'utf8');const old='docs/qa/lab-speed-design-001/replay-current-main.json';assert.equal(source.split(old).length,2);
source=source.replace(old,'docs/qa/lab-simple-001/replay-'+label+'.json');
new Function('require','__dirname',source)(createRequire(original),path.dirname(original));
