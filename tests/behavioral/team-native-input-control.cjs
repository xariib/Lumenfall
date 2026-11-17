'use strict';
// Require the original disclosure assertion to reject a missing native gesture.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const source=path.resolve(process.argv[2]||'index.html'),out=path.resolve(process.argv[3]||'validation-evidence/team-native-input-control');
fs.mkdirSync(out,{recursive:true});
const result=spawnSync(process.execPath,[path.join(__dirname,'wisp-contribution-mobile.cjs'),source,out,'--suppress-team-touch'],{encoding:'utf8',timeout:90000,maxBuffer:16*1024*1024,windowsHide:true});
fs.writeFileSync(path.join(out,'stdout.log'),result.stdout||'');fs.writeFileSync(path.join(out,'stderr.log'),result.stderr||'');
const failure=JSON.parse(fs.readFileSync(path.join(out,'failure.json'))),inputs=JSON.parse(fs.readFileSync(path.join(out,'team-native-inputs.json')));
assert.equal(result.status,1,'negative native-input process exits with its assertion');
assert.match(failure.error,/AssertionError.*real touch opens damage details/);
assert(!failure.teardown,'negative control must clean up normally');
assert.equal(failure.sourceSha256,crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'));
assert.equal(inputs.length,1);assert.equal(inputs[0].selector,'[data-wisp-damage=ember] summary');
assert(inputs[0].suppressed&&inputs[0].point.hit&&inputs[0].point.visible);
assert.equal(inputs[0].detailsOpen,false,'presentation barriers cannot open the disclosure without native input');
const receipt={status:'pass',sourceSha256:failure.sourceSha256,expectedFailure:'real touch opens damage details',checks:failure.checks,nativeGestureRequired:true,cleanExit:true};
fs.writeFileSync(path.join(out,'control.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
