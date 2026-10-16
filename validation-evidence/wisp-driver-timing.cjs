'use strict';
// Diagnostic preload only. The original assertions and 90-second gate remain.
const started=performance.now(),normal=console.log;
function note(event){process.stderr.write(JSON.stringify({event,elapsedMs:performance.now()-started,handles:process._getActiveHandles().map(h=>h.constructor.name)})+'\n');}
console.log=function(...args){note('before-result');const out=normal.apply(console,args);note('after-result');setTimeout(()=>note('post-result-1s'),1000).unref();return out;};
process.on('beforeExit',()=>note('before-exit'));process.on('exit',()=>note('exit'));
