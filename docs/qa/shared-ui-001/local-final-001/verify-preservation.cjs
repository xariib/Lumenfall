'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root='/workspace/scratch/0848c4e4f365/Lumenfall-shared-ui';
const base='fe2a7b32859ebe04ecd3382d7b74ef285f683771';
const git=args=>cp.execFileSync('git',args,{cwd:root,maxBuffer:128*1024*1024});
const before=git(['show',base+':index.html']).toString(),after=fs.readFileSync(root+'/index.html','utf8');
function withoutStyle(source){
  assert.equal(source.split('<style>').length,2,'one actual style start');
  assert.equal(source.split('</style>').length,2,'one actual style end');
  const start=source.indexOf('<style>'),end=source.indexOf('</style>',start);
  assert(end>start,'ordered style boundaries');
  return source.slice(0,start)+'<style/>'+source.slice(end+'</style>'.length);
}
assert.equal(after.split('<script>').length-1,2,'two actual game script tags');
assert(withoutStyle(after)===withoutStyle(before),'all non-style product bytes unchanged');
const paths=git(['ls-tree','-r','--name-only',base,'--','.github/workflows','tests/behavioral','fonts','branding','mobile']).toString().trim().split('\n');
for(const p of paths)assert(git(['show',base+':'+p]).equals(fs.readFileSync(root+'/'+p)),'protected original changed: '+p);
console.log(JSON.stringify({status:'PASS',baseline:base,protectedOriginalFiles:paths.length,gameScripts:2,onlyStyleChanges:true,
  sourceSha256:crypto.createHash('sha256').update(after).digest('hex'),sourceBytes:Buffer.byteLength(after),sourceByteDelta:Buffer.byteLength(after)-Buffer.byteLength(before)}));
