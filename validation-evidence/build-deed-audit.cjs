'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const from='docs/qa/endless-progression-001/runtimes/ah',to='validation-evidence/deed-audit';
for(const file of ['tests/behavioral/forge-expansion-harness.cjs','scripts/lib/game-amount.cjs']){fs.mkdirSync(path.dirname(path.join(to,file)),{recursive:true});fs.copyFileSync(path.join(from,file),path.join(to,file));}
let text=fs.readFileSync(path.join(from,'tests/behavioral/endless-campaign.cjs'),'utf8');
function replace(a,b){assert.equal(text.split(a).length,2,a);text=text.replace(a,b);}
replace('if(!state.owned.autoascend)buyShopItem(item);',"if(!state.owned.autoascend){window.firstAutoAttempt={comets:state.comets,lab:state.longStudyLevels.wispascend,ember:state.spirits.ember,achievements:JSON.parse(JSON.stringify(state.achieved))};buyShopItem(item);}");
replace('auto:function(enabled){','firstAutoAttempt:function(){return window.firstAutoAttempt;},auto:function(enabled){');
replace('b.auto(repeat);',`b.auto(repeat);
      if(b.firstAutoAttempt()){
        const first=b.firstAutoAttempt();assert(amount.ge(first.comets,100),'first attempted Auto-Ascend already affordable without Idle8');
        assert(q.get().owned.autoascend,'actual Auto-Ascend purchase succeeds');
        assert.equal(q.get().totalOfflineSeconds,0,'audit observes original omitted statistic');
        console.log(JSON.stringify({status:'PASS',sourceSha256,policySha256,policy:name,at:elapsed,day:elapsed/86400,firstAttempt:first,remainingComets:q.get().comets,limits:'First attempted purchase only; original campaign omits offline-hours Deed15 Comets. No other policy choice spends Comets, so the omitted reward cannot move this purchase or later gameplay decisions.'}));process.exit(0);
      }`);
fs.writeFileSync(path.join(to,'tests/behavioral/endless-campaign.cjs'),text);
