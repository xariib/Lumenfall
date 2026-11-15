'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
function hasVisibleGameControls(xml,width,height){
  if(/Preparing your Rift|Skip intro/.test(xml))return false;
  const labels=new Set();
  for(const match of xml.matchAll(/<node\b([^>]+)>/g)){
    const attrs=Object.fromEntries([...match[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(a=>[a[1],a[2]]));
    if(attrs.package!=='com.lumenfall.app'||attrs.clickable!=='true'||attrs.enabled!=='true')continue;
    const bounds=/^\[(\d+),(\d+)\]\[(\d+),(\d+)\]$/.exec(attrs.bounds||'');
    if(!bounds)continue;
    const [,left,top,right,bottom]=bounds.map(Number);
    if(right<=left||bottom<=top||right>width||bottom>height)continue;
    for(const label of ['Wisps','Rift'])if(attrs.text===label||attrs['content-desc']===label)labels.add(label);
  }
  return labels.has('Wisps')&&labels.has('Rift');
}
function buildShellSnapshot(directory){
  const sdk=process.env.ANDROID_HOME||process.env.ANDROID_SDK_ROOT;
  assert(sdk,'Android SDK required for shell-only accessibility capture');
  const buildTools=path.join(sdk,'build-tools');
  const versions=fs.readdirSync(buildTools).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true}));
  const d8=versions.map(v=>path.join(buildTools,v,'d8')).find(p=>fs.existsSync(p));
  assert(d8,'Android d8 tool required');
  fs.mkdirSync(directory,{recursive:true});
  cp.execFileSync('javac',['--release','8','-d',directory,'tests/android/LiveUiSnapshot.java'],{stdio:'inherit',timeout:30000});
  const jar=path.join(directory,'live-ui-classes.jar');
  cp.execFileSync('jar',['cf',jar,'-C',directory,'com'],{stdio:'inherit',timeout:30000});
  const dex=path.join(directory,'live-ui-snapshot.jar');
  cp.execFileSync(d8,['--min-api','26','--output',dex,jar],{stdio:'inherit',timeout:30000});
  return dex;
}
module.exports={hasVisibleGameControls,buildShellSnapshot};
