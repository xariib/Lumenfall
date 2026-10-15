'use strict';
// Capture an earned policy input before its first simulation step. This is an
// observation, never a completed campaign or a modified player decision.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),Module=require('node:module');
const [runnerArg,source,checkpoint,out]=process.argv.slice(2),runner=path.resolve(runnerArg),original=fs.readFileSync(runner,'utf8'),anchor='  function advance(seconds,kind){';
assert.equal(original.split(anchor).length,2,'one policy step entry');
let text=original.replace(anchor,anchor+"\n    fs.writeFileSync(process.env.LUMENFALL_STEP_OUTPUT,JSON.stringify({status:'OBSERVED_INPUT_NOT_CAMPAIGN',sourceSha256,originalPolicySha256:policySha256,instrumentedPolicySha256:process.env.LUMENFALL_STEP_HASH,elapsed,seconds,kind,state:q.get()}));if(!process.env.LUMENFALL_STEP_CONTINUE)process.exit(0);");
if(process.env.LUMENFALL_STEP_CONTINUE){
 const oldAdvance="result=q.advance(seconds,{kind:kind,clockStartMs:CLOCK+elapsed*1000,offlineWindowStartMs:CLOCK+elapsed*1000});";assert.equal(text.split(oldAdvance).length,2);
 text=text.replace(oldAdvance,`{
 const began=performance.now(),cursor=q.advance(seconds,{kind:kind,clockStartMs:CLOCK+elapsed*1000,offlineWindowStartMs:CLOCK+elapsed*1000,resumable:true});let step;
 do{step=cursor.next();}while(!step.done&&performance.now()-began<30000);
 if(!step.done){cursor.return();fs.writeFileSync(process.env.LUMENFALL_STEP_OUTPUT+'.partial.json',JSON.stringify({status:'PARTIAL_DIAGNOSIS',elapsed,seconds,wallMs:performance.now()-began,progress:step.value,state:q.get()}));process.exit(0);}result=step.value;
 }`);
}
process.env.LUMENFALL_STEP_OUTPUT=out;process.env.LUMENFALL_STEP_HASH=crypto.createHash('sha256').update(text).digest('hex');process.env.LUMENFALL_CAMPAIGN_RESUME=checkpoint;delete process.env.LUMENFALL_CAMPAIGN_SNAPSHOT;
process.argv=[process.execPath,runner,source,'60','efficient'];const m=new Module(runner,module);m.filename=runner;m.paths=Module._nodeModulePaths(path.dirname(runner));m._compile(text,runner);
