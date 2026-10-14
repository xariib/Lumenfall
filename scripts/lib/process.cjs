'use strict';
const { spawn } = require('node:child_process');

// Asynchronous execution lets the same Node process serve the staged browser app.
// A deadline always fails, even when the child already printed a passing result.
function runProcess(command, { timeout = 25000 } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command[0], command.slice(1), { stdio: ['ignore', 'pipe', 'pipe'], detached: process.platform !== 'win32', windowsHide: true });
    const stdout = [], stderr = [];
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      // Native browser drivers own helper processes. Killing only the driver
      // leaves inherited pipes open on Windows, so its close event never fires.
      if(process.platform === 'win32'){
        const killer=spawn('taskkill',['/PID',String(child.pid),'/T','/F'],{stdio:'ignore',windowsHide:true});
        killer.once('error',()=>child.kill('SIGKILL'));
      }else{
        try{process.kill(-child.pid,'SIGKILL');}catch(error){if(error.code!=='ESRCH')child.kill('SIGKILL');}
      }
    }, timeout);
    child.stdout.on('data', data => stdout.push(data));
    child.stderr.on('data', data => stderr.push(data));
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('close', (code, signal) => {
      clearTimeout(timer);
      resolve({ stdout: Buffer.concat(stdout).toString('utf8'), stderr: Buffer.concat(stderr).toString('utf8'),
        exitcode: timedOut ? null : code, timed_out: timedOut, signal });
    });
  });
}
module.exports = { runProcess };
