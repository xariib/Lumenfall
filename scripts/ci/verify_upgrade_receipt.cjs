'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
function verify(file,apk,version){
 const r=JSON.parse(fs.readFileSync(file));assert.equal(r.status,'PASS','Completed upgrade required');
 for(const flag of ['baselineColdRestartVerified','uidRetained','bothSaveSlotsRetained','progressAndPaidStudyRetained','offlineRecapDismissed'])assert.equal(r[flag],true,flag);
 assert.equal(r.package,'com.lumenfall.app');assert.equal(r.origin,'https://localhost');assert.equal(r.physicalDevice,false);
 assert(r.beforeUid&&r.beforeUid===r.afterUid,'Same actual Android UID');assert(r.candidateVersionCode>r.baselineVersionCode,'Actual version increases');assert.equal(r.candidateVersionCode,Number(version));
 assert.equal(r.apkSha256,crypto.createHash('sha256').update(fs.readFileSync(apk)).digest('hex'),'Receipt identifies exact APK');
 const m=r.installedFiveWispMigration;assert(m,'Installed five-Wisp migration required');assert.equal(m.status,'PASS');assert.equal(m.refund,120);assert.equal(m.activeCount,5);
 for(const flag of ['ownedRetained','coldRestart','refundPaidOnce','bothSaveSlots'])assert.equal(m[flag],true,'Installed migration '+flag);
 assert.equal(m.afterPrisms,m.beforePrisms+120,'Exactly one installed refund');assert(m.retainedBenchedLevel>0,'Sixth Wisp retained on bench');
 assert.equal(r.installedCompactWisps?.status,'PASS');assert.equal(r.installedCompactWisps.nativeInput,true);
 return r;
}
module.exports={verify};
if(require.main===module){verify(process.argv[2]||'release-evidence/emulator-upgrade.json',process.argv[3]||'Lumenfall.apk',process.env.EXPECTED_VERSION_CODE);console.log('Completed emulator upgrade receipt verified against exact APK/version');}
