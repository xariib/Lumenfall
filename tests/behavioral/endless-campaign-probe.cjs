'use strict';
// Observe the exact first offline input after a saved campaign day. The frozen
// policy's decisions and game source are unchanged up to this observation.
// Stop before the slow window; never label the probe a completed campaign.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),Module=require('node:module');
const [runnerArg,source,checkpoint,out]=process.argv.slice(2),runner=path.resolve(runnerArg),original=fs.readFileSync(runner,'utf8');
const anchor="      advance(Math.min(gap,43200),'offline');";assert.equal(original.split(anchor).length,2,'one observed first offline input');
const text=original.replace(anchor,`      fs.writeFileSync(process.env.LUMENFALL_PROBE_OUTPUT,JSON.stringify({status:'OBSERVATION_NOT_CAMPAIGN',sourceSha256,originalPolicySha256:policySha256,instrumentedPolicySha256:process.env.LUMENFALL_PROBE_HASH,elapsed,seconds:Math.min(gap,43200),repeat,state:q.get()}));process.exit(0);\n`+anchor);
process.env.LUMENFALL_PROBE_OUTPUT=out;process.env.LUMENFALL_PROBE_HASH=crypto.createHash('sha256').update(text).digest('hex');process.env.LUMENFALL_CAMPAIGN_RESUME=checkpoint;process.env.LUMENFALL_CAMPAIGN_RUN_MS='0';delete process.env.LUMENFALL_CAMPAIGN_SNAPSHOT;
process.argv=[process.execPath,runner,source,'60','efficient'];const m=new Module(runner,module);m.filename=runner;m.paths=Module._nodeModulePaths(path.dirname(runner));m._compile(text,runner);
