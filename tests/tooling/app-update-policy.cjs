'use strict';
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {install}=require('../../scripts/ci/install_android_updater.cjs');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-updater-'));
try {
  const main=path.join(temp,'app/src/main'),java=path.join(main,'java/com/lumenfall/app');
  fs.mkdirSync(java,{recursive:true});
  fs.writeFileSync(path.join(java,'MainActivity.java'),'package com.lumenfall.app;\nimport com.getcapacitor.BridgeActivity;\npublic class MainActivity extends BridgeActivity {}\n');
  fs.writeFileSync(path.join(main,'AndroidManifest.xml'),'<manifest><application></application></manifest>');
  install(temp);
  assert(fs.readFileSync(path.join(java,'MainActivity.java'),'utf8').includes('registerPlugin(AppUpdaterPlugin.class);'));
  assert(fs.readFileSync(path.join(main,'AndroidManifest.xml'),'utf8').includes('REQUEST_INSTALL_PACKAGES'));
  assert(fs.readFileSync(path.join(main,'res/xml/update_paths.xml'),'utf8').includes('path="updates/"'));
  assert.throws(()=>install(temp),/Unexpected generated MainActivity/,'Do not silently overwrite native customizations');
  const bin=process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME,'bin') : '';
  const command=name=>bin ? path.join(bin,name+(process.platform==='win32'?'.exe':'')) : name;
  cp.execFileSync(command('javac'),['-d',temp,'mobile/native/UpdatePolicy.java','tests/tooling/UpdatePolicyTest.java'],{stdio:'inherit'});
  cp.execFileSync(command('java'),['-cp',temp,'com.lumenfall.app.UpdatePolicyTest'],{stdio:'inherit'});
  console.log('PASS generated Android registration, permission, narrow FileProvider and overwrite control');
} finally {fs.rmSync(temp,{recursive:true,force:true});}
