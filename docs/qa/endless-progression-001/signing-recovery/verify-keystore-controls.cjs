'use strict';
// Negative cases stay in memory; never create a second private keystore file.
const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict'),path=require('node:path');
const [keystore,openssl]=process.argv.slice(2),scriptPath=path.join(__dirname,'verify-keystore.cjs'),source=fs.readFileSync(scriptPath,'utf8');
assert(keystore&&openssl,'Supply keystore and existing OpenSSL paths.');
const digest=()=>crypto.createHash('sha256').update(fs.readFileSync(keystore)).digest('hex'),before=digest(),records=[];
for(const mode of ['tampered-file','wrong-password']){
 const output=[];
 const wrappedFs={...fs,readFileSync(file,...args){const value=fs.readFileSync(file,...args);
  if(mode==='tampered-file'&&file===keystore){const b=Buffer.from(value);b[100]^=1;return b;}
  if(mode==='wrong-password'&&file==='.github/workflows/build-android.yml')return value.replace(/-storepass ([^\s]+)/,'-storepass invalid-verification-control');
  return value;
 }};
 let failure;
 try{vm.runInNewContext(source,{require:name=>name==='node:fs'?wrappedFs:require(name),process:{argv:[process.execPath,scriptPath,keystore,openssl],env:process.env,version:process.version},console:{log:value=>output.push(value)}},{filename:scriptPath,timeout:30000});}catch(error){failure=error;}
 assert(failure,mode+' must fail');assert.equal(output.length,0,mode+' must never emit a passing receipt');
 assert(failure.message.includes(mode==='tampered-file'?'Exact historical and currently displayed release digest':'OpenSSL operation failed'),mode+' fails at the intended verification');
 records.push({case:mode,status:'EXPECTED_FAILURE',passReceiptEmitted:false});
}
assert.equal(digest(),before,'Original downloaded file unchanged');
console.log(JSON.stringify({status:'PASS',checks:7,verifierSha256:crypto.createHash('sha256').update(source).digest('hex'),records,originalFileUnchanged:true,limits:'Read-only negative verification; no private copies, emitted key material, APK build or installed update.'},null,2));
