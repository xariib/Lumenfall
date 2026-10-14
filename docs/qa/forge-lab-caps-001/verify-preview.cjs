'use strict';
// Read-only verification of current source, staging and playable HTTP assets.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function files(dir){return fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(dir+'/'+e.name):[dir+'/'+e.name]);}
(async()=>{
  const manifest={url:'http://127.0.0.1:4174/index.html',sourceSha256:hash(fs.readFileSync(path.join(root,'index.html'))),files:[]};
  for(const file of ['index.html',...files('fonts'),...files('branding')]){
    const expected=hash(fs.readFileSync(path.join(root,file)));
    assert.equal(hash(fs.readFileSync(path.join(root,'mobile/www',file))),expected,'staged '+file);
    const response=await fetch('http://127.0.0.1:4174/'+file);
    assert.equal(response.status,200,'HTTP '+file);
    assert.equal(hash(Buffer.from(await response.arrayBuffer())),expected,'served '+file);
    manifest.files.push({file,sha256:expected,staged:true,http:true});
  }
  fs.writeFileSync(path.join(__dirname,'preview-assets.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log('PASS: '+manifest.files.length+' source/staged/HTTP assets; '+manifest.sourceSha256);
})().catch(error=>{console.error(error);process.exitCode=1;});
