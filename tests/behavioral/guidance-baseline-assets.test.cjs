'use strict';
// Exercise the future-font regression with a real isolated Git repository.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {restoreBaselineAssets}=require('../../scripts/ci/guidance-baseline-assets.cjs');
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-baseline-assets-'));
const repository=path.join(temporary,'repo'),output=path.join(temporary,'restored');
const env={...process.env};delete env.NODE_OPTIONS;delete env.NODE_PATH;
function git(args){const p=cp.spawnSync('git',args,{cwd:repository,env,maxBuffer:4*1024*1024,timeout:30000});assert.ifError(p.error);assert.equal(p.signal,null);assert.equal(p.status,0,String(p.stderr));return p.stdout;}
try{
 fs.mkdirSync(repository);fs.mkdirSync(path.join(repository,'fonts'));fs.mkdirSync(path.join(repository,'branding'));
 const historicalFont=Buffer.from([0x77,0x4f,0x46,0x32,0,0xff,0x80,1]);
 fs.writeFileSync(path.join(repository,'fonts','font.woff2'),historicalFont);
 fs.writeFileSync(path.join(repository,'branding','mark.svg'),'<svg>baseline</svg>');
 git(['init','--quiet']);git(['add','fonts','branding']);
 git(['-c','user.name=Guidance fixture','-c','user.email=fixture@example.invalid','commit','--quiet','-m','Isolated immutable asset fixture']);
 const base=git(['rev-parse','HEAD']).toString('utf8').trim();
 const candidateFont=Buffer.from('different candidate font bytes');
 fs.writeFileSync(path.join(repository,'fonts','font.woff2'),candidateFont);
 fs.writeFileSync(path.join(repository,'fonts','candidate-only.css'),'candidate-only');
 fs.writeFileSync(path.join(repository,'branding','mark.svg'),'<svg>candidate</svg>');
 const run=(id,command)=>{assert.equal(command[0],'git');return git(command.slice(1));};
 const result=restoreBaselineAssets(base,output,run);
 assert.equal(result.assets.length,2);assert(fs.readFileSync(path.join(output,'fonts','font.woff2')).equals(historicalFont));
 assert.equal(fs.readFileSync(path.join(output,'branding','mark.svg'),'utf8'),'<svg>baseline</svg>');
 assert(!fs.existsSync(path.join(output,'fonts','candidate-only.css')));
 assert(fs.readFileSync(path.join(repository,'fonts','font.woff2')).equals(candidateFont),'Candidate worktree stays unchanged');
 assert.throws(()=>restoreBaselineAssets(base,path.join(temporary,'corrupt'),(id,command)=>id==='baseline-assets-tree'?run(id,command):Buffer.from('wrong blob body')),/pinned baseline Git blob/);
 console.log(JSON.stringify({status:'pass',scope:'Isolated Git asset unit test; no game or browser',baselineCommit:base,changedCandidateFontIgnored:true,changedCandidateBrandingIgnored:true,candidateOnlyAssetExcluded:true,candidateUnchanged:true,corruptBlobRejected:true,assets:result.assets}));
}finally{fs.rmSync(temporary,{recursive:true,force:true});}
