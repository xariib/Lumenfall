'use strict';
// Observation-only diagnostic. Never used as the required90s gate.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),Module=require('node:module'),assert=require('node:assert/strict');
const file=path.resolve('tests/behavioral/wisp-rarity-scroll.cjs'),original=fs.readFileSync(file,'utf8');
let source=original;
const marker='function check(value,message){checks++;assert(value,message);}';
assert.equal(source.split(marker).length,2);
source=source.replace(marker,'function check(value,message){checks++;if(checks%100===0)process.stderr.write(JSON.stringify({event:"checks",checks,ms:performance.now()-qaDiagStarted})+"\\n");assert(value,message);}');
const profile="  await send('Emulation.setDeviceMetricsOverride',";assert.equal(source.split(profile).length,2);
source=source.replace(profile,'  process.stderr.write(JSON.stringify({event:"profile",width,scale,motion,ms:performance.now()-qaDiagStarted})+"\\n");\n'+profile);
source='const qaDiagStarted=performance.now();\n'+source;
process.stderr.write(JSON.stringify({event:'diagnostic',driverSha256:crypto.createHash('sha256').update(original).digest('hex'),source:process.argv[2]})+'\n');
const compiled=new Module(file,module);compiled.filename=file;compiled.paths=Module._nodeModulePaths(path.dirname(file));compiled._compile(source,file);
