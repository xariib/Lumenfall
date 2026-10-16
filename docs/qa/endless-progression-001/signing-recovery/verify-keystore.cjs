'use strict';
// Read-only local verification. Never prints or writes private key material.
// Run from the repository root with: node <this script> <keystore> <openssl>
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const [keystore,openssl]=process.argv.slice(2);
assert(keystore&&openssl,'Supply the downloaded keystore and an existing OpenSSL executable.');
const expectedCertificate='A9:1C:BF:34:27:D2:CE:B1:CD:BE:07:E5:22:5F:17:D4:71:B1:82:9E:52:F7:AB:66:49:7E:75:49:75:AD:3E:21';
const expectedFile='0f628d30730e7e8f1a34a4df60a13227540533141d9481d0e837100db900d65c';
const workflow=fs.readFileSync('.github/workflows/build-android.yml','utf8');
const password=workflow.match(/-storepass ([^\s]+)/);
assert(password,'Existing workflow must supply the established store password.');
assert(workflow.includes(expectedCertificate),'Workflow must retain the expected certificate.');
const bytes=fs.readFileSync(keystore),fileSha256=crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(bytes.length,2682,'Exact recorded asset size');
assert.equal(fileSha256,expectedFile,'Exact historical and currently displayed release digest');
const env={...process.env,LUMENFALL_VERIFY_STORE_PASSWORD:password[1]};
function run(args){
 const r=spawnSync(openssl,args,{env,windowsHide:true,stdio:['ignore','pipe','pipe'],maxBuffer:128*1024,timeout:20000});
 assert(!r.error&&r.status===0,'OpenSSL operation failed; no key material is included in diagnostics.');
 return r.stdout;
}
const version=run(['version']).toString('utf8').trim();
const common=['pkcs12','-in',keystore,'-passin','env:LUMENFALL_VERIFY_STORE_PASSWORD'];
// OpenSSL verifies the container MAC while reading; -nokeys exports certificates only.
const certificateOutput=run([...common,'-nokeys','-clcerts']);
const certificates=certificateOutput.toString('utf8').match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g);
assert(certificates&&certificates.length===1,'Exactly one signing certificate');
const certificate=new crypto.X509Certificate(certificates[0]);
assert.equal(certificate.fingerprint256,expectedCertificate,'Actual signing certificate fingerprint');
// Decrypt only into process memory and prove possession of its matching key.
// This buffer is never logged or saved, and is cleared after import.
const privateOutput=run([...common,'-nocerts','-nodes']);
let key;
try{key=crypto.createPrivateKey(privateOutput);}finally{privateOutput.fill(0);}
const challenge=crypto.randomBytes(32),signature=crypto.sign('sha256',challenge,key);
assert(crypto.verify('sha256',challenge,certificate.publicKey,signature),'Private key matches the expected certificate');
bytes.fill(0);
console.log(JSON.stringify({status:'PASS',verifiedAt:new Date().toISOString(),asset:'Lumenfall-debug.keystore',releaseId:396126590,assetId:586981383,bytes:2682,fileSha256,certificateSha256:certificate.fingerprint256,container:'PKCS12',containerMacVerified:true,privateKeyMatchesCertificate:true,validFrom:certificate.validFrom,validTo:certificate.validTo,node:process.version,openssl:version,limits:'Signing identity and key possession verified locally. No APK built, signed or installed; version/package/save-preserving upgrade acceptance remains outstanding. Private material stays outside Git.'},null,2));
