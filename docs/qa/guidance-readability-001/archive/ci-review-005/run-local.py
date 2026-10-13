import datetime, hashlib, json, os, pathlib, subprocess
root=pathlib.Path('/workspace/scratch/0848c4e4f365')
repo=root/'Lumenfall-guidance-large-text'
out=pathlib.Path(__file__).parent
node='/opt/codex/runtimes/codex-primary-runtime/dependencies/node/bin/node'
baseline=root/'guidance-work/ci-0401/full-early/extracted/baseline-www/index.html'
assert hashlib.sha256(baseline.read_bytes()).hexdigest()=='38eebcb93e4cdc2fbb1f9f67800f8cfb433005904389c0815641d26bbae00b6f'
env=dict(os.environ);env.pop('NODE_OPTIONS',None);env.pop('NODE_PATH',None)
commands=[('syntax-helper',['--check','scripts/ci/guidance-readability.cjs']),('syntax-mutators',['--check','tests/behavioral/rift-guidance-inverses.cjs']),('syntax-unit',['--check','tests/behavioral/rift-guidance-inverses.test.cjs']),('inverse-unit',['tests/behavioral/rift-guidance-inverses.test.cjs','index.html',str(baseline)]),('source',['scripts/ci/validate_source.cjs']),('context',['scripts/codex/check_context.cjs','--task','docs/tasks/GUIDANCE_READABILITY_001.md'])]
results=[]
for name,args in commands:
    start=datetime.datetime.now(datetime.timezone.utc).isoformat()
    with (out/(name+'.stdout.log')).open('xb') as stdout, (out/(name+'.stderr.log')).open('xb') as stderr:
        r=subprocess.run([node]+args,cwd=repo,env=env,stdout=stdout,stderr=stderr)
    result={'id':name,'command':[node]+args,'cwd':str(repo),'startedUtc':start,'completedUtc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'returncode':r.returncode}
    for stream in ['stdout','stderr']:
        p=out/(name+'.'+stream+'.log');b=p.read_bytes();result[stream]={'path':p.name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}
    with (out/(name+'.process.json')).open('x') as f:json.dump(result,f,indent=2);f.write('\n')
    results.append(result)
    if r.returncode:break
inputs={}
for relative in ['index.html','tests/behavioral/rift-guidance.cjs','tests/behavioral/fixtures.json','tests/behavioral/scenarios.json','scripts/ci/guidance-readability.cjs','tests/behavioral/rift-guidance-inverses.cjs','tests/behavioral/rift-guidance-inverses.test.cjs']:
    b=(repo/relative).read_bytes();inputs[relative]={'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}
summary={'status':'PASS' if len(results)==len(commands) and all(x['returncode']==0 for x in results) else 'FAIL_OR_INCOMPLETE','scope':'Pure inverse unit regression, syntax/source/context only; no browser/game run','inputs':inputs,'commands':results}
with (out/'summary.json').open('x') as f:json.dump(summary,f,indent=2);f.write('\n')
print(json.dumps({'status':summary['status'],'commands':len(results),'output':str(out)}))
raise SystemExit(0 if summary['status']=='PASS' else 1)
