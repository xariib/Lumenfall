'use strict';
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {entries,verifyZip}=require('../lib/zip.cjs');
function verify(apk,root=process.cwd()){
  const bytes=fs.readFileSync(apk),rows=verifyZip(bytes),report=[];
  const payload=row=>{const start=row.offset+30+bytes.readUInt16LE(row.offset+26)+bytes.readUInt16LE(row.offset+28),b=bytes.subarray(start,start+row.compressed);return row.method===8?zlib.inflateRawSync(b):b;};
  const files=['index.html'];
  function walk(rel){for(const name of fs.readdirSync(path.join(root,rel)).sort()){const p=path.posix.join(rel,name),s=fs.lstatSync(path.join(root,p));assert(!s.isSymbolicLink());if(s.isDirectory())walk(p);else files.push(p);}}
  walk('fonts');walk('branding');
  for(const file of files){const found=rows.filter(r=>r.name==='assets/public/'+file);assert.equal(found.length,1,'Exactly one packaged '+file);const data=payload(found[0]);assert(data.equals(fs.readFileSync(path.join(root,file))),'Packaged bytes differ: '+file);report.push({path:file,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')});}
  const config=JSON.parse(payload(rows.find(r=>r.name==='assets/capacitor.config.json')));
  assert.equal(config.appId,'com.lumenfall.app');assert(!config.server?.url,'No remote server origin');assert(!config.server?.hostname||config.server.hostname==='localhost','Original localhost origin');assert(!config.server?.androidScheme||config.server.androidScheme==='https','Original Android scheme');
  assert(!rows.some(r=>/^assets\/public\/.*(?:qa-bridge|fixtures\.json|prelude\.js|runner\.js)$/.test(r.name)),'No test assets packaged');
  return {status:'PASS',apkSha256:crypto.createHash('sha256').update(bytes).digest('hex'),package:config.appId,origin:config.server||'Capacitor 6 Android defaults: https://localhost',assets:report};
}
module.exports={verify};
if(require.main===module)console.log(JSON.stringify(verify(process.argv[2]||'Lumenfall.apk'),null,2));
