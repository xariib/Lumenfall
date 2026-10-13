'use strict';
const fs=require('node:fs'),path=require('node:path');
const P='/workspace/Lumenfall-guidance-evidence/docs/qa/guidance-readability-001/evidence/ci-bfed/full-publication';
const F=require(P+'/format.cjs'),S=require(P+'/root-schema.cjs');
const inv=JSON.parse(fs.readFileSync(P+'/inventory.json')),selected=JSON.parse(fs.readFileSync(P+'/original-inputs.json'));
const packed=Buffer.concat(inv.archive.parts.map(e=>{const b=fs.readFileSync(P+'/'+e.path);F.checkPin(b,e,e.path);return b;}));
F.checkPin(packed,inv.archive.gzip,'gzip');
const tar=F.zlib.gunzipSync(packed);F.checkPin(tar,inv.archive.tar,'tar');const top=F.parseTar(tar).entries;
const read=p=>top.get(p).body,zips=new Map();for(const s of F.CONFIG.scopes.filter(s=>s.artifact))zips.set(s.id,S.checkOriginalZip(s,p=>read(s.id+'/'+p)));
const out='/workspace/guidance-review-20261011/restored-full';F.assert(!fs.existsSync(out));fs.mkdirSync(out);
for(const e of inv.entries){F.safe(e.path);const b=e.disposition==='retained'?read(e.path):zips.get(e.scope).get(e.member).body;F.checkPin(b,e,e.path);const f=path.join(out,e.path);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,b,{flag:'wx',mode:parseInt(e.mode,8)});}
console.log(JSON.stringify({status:'ORIGINAL_BYTES_RESTORED_FOR_READ_ONLY_REVIEW',files:inv.entries.length,output:out}));
