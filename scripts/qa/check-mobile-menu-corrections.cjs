'use strict';
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const out='docs/qa/mobile-menu-corrections-001';fs.mkdirSync(out,{recursive:true});
const mode=process.argv[2]||'menus';
const cases={
 menus:[['menus',['tests/behavioral/lab-speed-controls.cjs','index.html','--menus','--evidence',out]]],
 'scroll-control':[['scroll-control',['tests/behavioral/lab-speed-controls.cjs','index.html','--menus','--mutate-menu-scroll']]],
 legacy:[['legacy-viewport',['tests/behavioral/lab-speed-controls.cjs','index.html','--menus','--legacy-viewport','--evidence',out+'/legacy-viewport']]],
 'native-menus':[['native-menus',['tests/behavioral/lab-speed-controls.cjs','index.html','--menus','--legacy-viewport','--native-menu-navigation']]],
 'settle-control':[['settle-control',['tests/behavioral/lab-speed-controls.cjs','index.html','--menus','--legacy-viewport','--native-menu-navigation','--mutate-menu-settle']]],
 'viewport-control':[['viewport-control',['tests/behavioral/lab-speed-controls.cjs','index.html','--menus','--legacy-viewport','--mutate-viewport-fallback']]],
 lab:[['simple',['tests/behavioral/lab-speed-controls.cjs','index.html','--simple','--evidence',out+'/lab']],['slots',['tests/behavioral/lab-speed-controls.cjs','index.html','--slots']],['deeds-ui',['tests/behavioral/lab-speed-controls.cjs','index.html','--deeds']]],
 rift:[['visual',['tests/behavioral/visual-audit.cjs','index.html',out+'/visual']],['cosmetics',['tests/behavioral/rift-cosmetics.cjs','--source','index.html','--negative','--out',out+'/cosmetics']]],
 navigation:['rift-status-mobile','rift-status-reduced-motion','rift-status-stacking-mobile','rift-status-stacking-reduced-motion','rift-status-contract','layout-dense','layout-boss','nav-workshop-contract','formation-bonds-mobile','upgrade-effects-and-deeds','p2-02a-core-qol'].map(name=>[name,['tests/behavioral/run.cjs','--web-root','mobile/www','--scenario',name,'--raw-artifacts',out+'/raw']]),
 core:[['deeds-core',['tests/behavioral/deeds-progressive.cjs','index.html']],['clarity',['tests/behavioral/workshop-card-clarity.cjs','index.html']],['replay',['scripts/qa/verify-deeds-reward-replay.cjs','--write']]]
};
cases['rift-fixture-followup']=cases.navigation.filter(([name])=>['rift-status-mobile','rift-status-stacking-mobile','rift-status-stacking-reduced-motion'].includes(name));
if(!cases[mode]){const single=Object.values(cases).flat().find(([name])=>name===mode);if(!single)throw Error('Unknown mode '+mode);cases[mode]=[single];}
if(cases[mode].some(([,args])=>args.includes('--web-root'))){fs.mkdirSync('mobile/www',{recursive:true});fs.copyFileSync('index.html','mobile/www/index.html');for(const dir of ['fonts','branding'])fs.cpSync(dir,'mobile/www/'+dir,{recursive:true});}
const env={...process.env};if(process.platform==='win32'&&!env.LUMENFALL_QA_CDP_CHROME)env.LUMENFALL_QA_CDP_CHROME='C:/Users/xarib/AppData/Local/BraveSoftware/Brave-Browser/Application/brave.exe';
if(process.platform==='win32'&&!env.LUMENFALL_QA_DOM_TRANSPORT)env.LUMENFALL_QA_DOM_TRANSPORT='pipe';
for(const [name,args]of cases[mode]){
 for(const suffix of ['stdout.txt','stderr.txt']){const previous=path.join(out,name+'.'+suffix);if(fs.existsSync(previous)){const history=path.join(out,'earlier-runs');fs.mkdirSync(history,{recursive:true});fs.copyFileSync(previous,path.join(history,name+'-'+Date.now()+'.'+suffix));}}
 const start=Date.now();console.log('Running '+name);
 const r=spawnSync(process.execPath,args,{env,encoding:'utf8',maxBuffer:32e6});
 fs.writeFileSync(path.join(out,name+'.stdout.txt'),r.stdout||'');fs.writeFileSync(path.join(out,name+'.stderr.txt'),r.stderr||'');
 console.log(JSON.stringify({name,status:r.status,seconds:(Date.now()-start)/1000,error:r.error?.message}));
 if(name==='scroll-control'){const receipt=JSON.parse(r.stdout);if(r.status!==1||receipt.status!=='fail'||!receipt.error.includes('return restores independent offset for spirits'))throw Error('Scroll reset control did not fail at the intended assertion');continue;}
 if(name==='viewport-control'){const receipt=JSON.parse(r.stdout);if(r.status!==1||receipt.status!=='fail'||!receipt.error.includes('scrollable fixture for spirits'))throw Error('Viewport fallback control did not fail at the intended assertion');continue;}
 if(name==='settle-control'){const receipt=JSON.parse(r.stdout);if(r.status!==1||receipt.status!=='fail'||!receipt.error.includes('return restores bottom after entry layout settles'))throw Error('Menu settling control did not fail at the intended assertion');continue;}
 if(r.status!==0){console.log((r.stdout||'').slice(-6000));console.log((r.stderr||'').slice(-2000));process.exitCode=1;break;}
}
