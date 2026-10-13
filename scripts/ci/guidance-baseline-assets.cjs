'use strict';
// Read historical assets from Git objects, never from the candidate webroot.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function restoreBaselineAssets(base,webroot,run){
 assert(/^[0-9a-f]{40}$/.test(base),'An exact baseline commit is required');
 const tree=run('baseline-assets-tree',['git','ls-tree','-rz',base,'--','fonts','branding']);
 const entries=tree.toString('utf8').split('\0').filter(Boolean).map(row=>{
  const match=/^(100644) blob ([0-9a-f]{40})\t((?:fonts|branding)\/[A-Za-z0-9_.\/-]+)$/.exec(row);
  assert(match,'Baseline assets must be regular files under fonts or branding');
  assert(match[3].split('/').every(part=>part!=='.'&&part!=='..'&&part!==''),'Safe baseline asset path');
  return {path:match[3],gitBlob:match[2]};
 });
 assert(entries.some(entry=>entry.path.startsWith('fonts/'))&&entries.some(entry=>entry.path.startsWith('branding/')),'Both baseline asset directories are required');
 assert.equal(new Set(entries.map(entry=>entry.path)).size,entries.length,'Unique baseline asset paths');
 const rows=entries.map((entry,index)=>{
  const bytes=run('baseline-asset-'+String(index).padStart(3,'0'),['git','cat-file','blob',entry.gitBlob]);
  const gitBlob=crypto.createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
  assert.equal(gitBlob,entry.gitBlob,'Actual asset bytes match the pinned baseline Git blob');
  const destination=path.join(webroot,entry.path);
  fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,bytes,{flag:'wx'});
  return {...entry,bytes:bytes.length,sha256:hash(bytes)};
 });
 return {baselineCommit:base,source:'Exact Git tree and blob objects; candidate assets are not inputs',assets:rows};
}
module.exports={restoreBaselineAssets};
