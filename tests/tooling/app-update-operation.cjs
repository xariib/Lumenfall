'use strict';
// Execute the production native operation gate with immediate callbacks. A fast
// WebView may request install/retry as soon as a download promise completes.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const source=fs.readFileSync('mobile/native/AppUpdaterPlugin.java','utf8');
const gate=source.slice(source.indexOf('    private interface Work'),source.indexOf('    private Runnable resolveState'));
assert(gate.includes('completion.run();'),'Production operation gate found');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'lumenfall-operation-'));
fs.writeFileSync(path.join(temp,'task-owner.json'),JSON.stringify({task:'MOBILE_POWER_001',disposable:true,path:temp}));
const java=body=>`import java.util.concurrent.Executor;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
public class UpdateOperationTest {
  private final Executor worker=Runnable::run;
  private final AtomicBoolean busy=new AtomicBoolean(false);
  private boolean cancelled;
  private String message(Exception e){return e.getMessage();}
  static class PluginCall {
    String error; java.util.function.Consumer<String> failure;
    void reject(String value){error=value;if(failure!=null)failure.accept(value);}
  }
${body}
  static void require(boolean value,String message){if(!value)throw new AssertionError(message);}
  public static void main(String[] args){
    UpdateOperationTest test=new UpdateOperationTest();
    for(int mode=0;mode<3;mode++){
      final int scenario=mode;AtomicInteger retries=new AtomicInteger();
      AtomicBoolean cleaned=new AtomicBoolean();PluginCall first=new PluginCall();
      Runnable retry=()->{
        require(cleaned.get(),"Cleanup precedes completion");
        require(!test.busy.get(),"Completion must release operation before immediate retry");
        PluginCall second=new PluginCall();
        test.run(second,()->()->retries.incrementAndGet());
        require(second.error==null,"Immediate follow-up accepted");
      };
      first.failure=error->{
        require(error.equals(scenario==2?"Download cancelled.":"verification failed"),"Original error preserved");
        retry.run();
      };
      test.run(first,()->{
        try {
          require(test.busy.get(),"Operation remains locked during work");
          PluginCall competing=new PluginCall();
          test.run(competing,()->()->{throw new AssertionError("Concurrent operation ran");});
          require("An update operation is already running.".equals(competing.error),"Concurrent request rejected");
          if(scenario!=0){test.cancelled=scenario==2;throw new java.io.IOException("verification failed");}
          return retry;
        } finally {cleaned.set(true);}
      });
      require(retries.get()==1&&!test.busy.get(),"Exactly one completed follow-up");
    }
    System.out.println("PASS native success, failure and cancellation release before follow-up; concurrent work rejected");
  }
}`;
const bin=process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME,'bin') : '';
const command=name=>bin ? path.join(bin,name+(process.platform==='win32'?'.exe':'')) : name;
try {
  const file=path.join(temp,'UpdateOperationTest.java');
  fs.writeFileSync(file,java(gate));
  cp.execFileSync(command('javac'),['-d',temp,file],{stdio:'inherit'});
  cp.execFileSync(command('java'),['-cp',temp,'UpdateOperationTest'],{stdio:'inherit'});
  const mutant=gate.replace('finally { busy.set(false); }','finally {}').replace('completion.run();','completion.run(); busy.set(false);');
  assert.notEqual(mutant,gate);fs.writeFileSync(file,java(mutant));
  cp.execFileSync(command('javac'),['-d',temp,file],{stdio:'inherit'});
  const rejected=cp.spawnSync(command('java'),['-cp',temp,'UpdateOperationTest'],{encoding:'utf8'});
  assert.notEqual(rejected.status,0);assert(rejected.stderr.includes('Completion must release operation before immediate retry'));
  console.log('PASS causal late-release control rejects the original ordering');
} finally {
  const owner=JSON.parse(fs.readFileSync(path.join(temp,'task-owner.json')));assert.equal(owner.path,temp);assert.equal(owner.task,'MOBILE_POWER_001');
  assert.equal(fs.realpathSync(temp),temp);assert(!fs.existsSync(path.join(temp,'.git')));
  assert(fs.readdirSync(temp).every(name=>fs.lstatSync(path.join(temp,name)).isFile()),'Only owned compiler files; no links/directories');
  if(process.platform==='win32')cp.execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',"Remove-Item -LiteralPath '"+temp.replace(/'/g,"''")+"' -Recurse -Force"],{stdio:'inherit'});
  else fs.rmSync(temp,{recursive:true});
}
