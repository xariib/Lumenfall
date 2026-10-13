'use strict';
const fs=require('node:fs'),path=require('node:path');

function resolveBrowser(command, env=process.env) {
  if (!command) throw Error('No Chromium browser configured');
  const directories=path.isAbsolute(command)||command.includes('/')||command.includes('\\')
    ? [''] : (env.PATH||'').split(path.delimiter);
  const suffixes=process.platform==='win32'&&!path.extname(command) ? ['', '.exe'] : [''];
  for(const directory of directories)for(const suffix of suffixes){
    const file=path.resolve(directory,command+suffix);
    try { fs.accessSync(file,fs.constants.X_OK);if(fs.statSync(file).isFile())return file; } catch {}
  }
  throw Error('Chromium executable not found: '+command);
}
function findChrome(env=process.env){
  if(env.LUMENFALL_QA_CDP_CHROME)return resolveBrowser(env.LUMENFALL_QA_CDP_CHROME,env);
  for(const candidate of ['google-chrome','google-chrome-stable','chromium','chromium-browser','chrome.exe','msedge.exe']){
    try{return resolveBrowser(candidate,env);}catch{}
  }
  throw Error('Behavioral QA failed: no supported Chromium browser found; set LUMENFALL_QA_CDP_CHROME');
}
module.exports={resolveBrowser,findChrome};
