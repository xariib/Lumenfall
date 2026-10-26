window.runBondTextQa=function(b,assert){
  var wisps=b.wispRoleContract(),bonds=b.riftStatus.bonds(),checks=0;
  function ok(value,message){assert(value,message);checks++;}
  function seed(ids,zero){
    var s=b.freshStateSnapshot();
    s.depth=101;s.enemyDepth=101;s.maxDepthEver=101;
    s.enemyMaxHp=b.enemyHpFor(101);s.enemyHp=s.enemyMaxHp;
    s.activeParty=ids.slice();
    wisps.forEach(function(sp){s.spirits[sp.id]=10;s.wispModules[sp.id]=20;});
    if(zero)s.spirits[zero]=0;
    b.setState(s);
  }
  function render(){b.renderLayout();b.renderGameplayLanguage();}
  function name(id){return wisps.find(function(sp){return sp.id===id;}).name;}
  function checkRows(bond,active){
    var partners=bond.ids.map(name).join(' + ');
    var row=Array.from(document.querySelectorAll('#bond-card .bond-row')).find(function(el){return el.querySelector('.bond-name').textContent.indexOf(bond.name)===0;});
    var card=Array.from(document.querySelectorAll('#encyclopedia-content .ency-card')).find(function(el){return el.querySelector('.ency-name').textContent===bond.name;});
    ok(row&&row.querySelector('.bond-req').textContent===partners,bond.id+' Formation row identifies full partner names');
    ok(card&&card.querySelector('.ency-meta').textContent===partners+' · '+bond.tag,bond.id+' Encyclopedia Bond identifies full partner names');
    ok(row.querySelector('.bond-effect').textContent===bond.effect&&card.querySelector('.ency-desc').textContent.indexOf(bond.effect)===0,bond.id+' retains its bonus explanation');
    ok(row.classList.contains('active')===active&&card.querySelector('.ency-status').textContent===(active?'Active':'Inactive'),bond.id+' displays actual activation');
    ok(card.querySelector('.ency-desc').textContent.includes('Both listed Wisps must be Active and above Lv.0.'),bond.id+' explains activation requirements');
    ok(b.activeBondIds().includes(bond.id)===active,bond.id+' display agrees with simulation');
  }
  bonds.forEach(function(bond){
    seed(bond.ids);render();checkRows(bond,true);
    seed([bond.ids[0]]);render();checkRows(bond,false);
    seed(bond.ids,bond.ids[1]);render();checkRows(bond,false);
  });
  seed(['ember','void']);render();
  document.querySelector('[data-tab="spirits"]').click();
  wisps.forEach(function(sp){
    var desc=sp.description;
    var card=document.querySelector('[data-wisp-card="'+sp.id+'"]');card.querySelector('[data-wisp-progression]').open=true;
    var details=card.querySelector('[data-card-details="wisp-'+sp.id+'"]');details.open=true;var row=details.querySelector('div');
    var upgradeEffect=document.querySelector('[data-wisp-card="'+sp.id+'"] .module-effect');
    var encyclopedia=document.querySelector('[data-ency-wisp="'+sp.id+'"] .ency-desc');
    ok(row&&row.getClientRects().length&&row.textContent===desc,sp.id+' Wisp ability exposes its full explanation through Details');
    ok(encyclopedia&&encyclopedia.textContent.endsWith(desc),sp.id+' Encyclopedia ability uses its explanation');
    ok(upgradeEffect&&upgradeEffect.textContent===sp.moduleEffect20,sp.id+' shows its full permanent upgrade effect beside the ability');
    ok(!/bond|formation|\+.*(?:Stone|Titan)/i.test(desc),sp.id+' ability does not repeat Bond partnerships');
    wisps.forEach(function(partner){ok(!desc.includes(partner.name),sp.id+' ability does not list partner '+partner.id);});
    if(sp.abilityType==='support'){
      ok(/passive Wisp damage/.test(desc)&&/Guardian Tap/.test(desc)&&/\+25% for 1s/.test(desc)&&/\+50% for 1\.5s/.test(desc),sp.id+' retains buff duration and targets');
    }else{
      ok(/ability damage/i.test(desc)&&/Ultimate doubles/.test(desc),sp.id+' retains ability damage and Ultimate explanation');
      if(sp.abilityType==='ranged')ok(/Shards/.test(desc)&&/doubles both/.test(desc),sp.id+' retains Shard generation');
      if(sp.abilityType==='druid')ok(/Lumen/.test(desc)&&/doubles both/.test(desc),sp.id+' retains Lumen generation');
      if(sp.abilityType==='breaker')ok(/Heavy/.test(desc)&&/ability burst damage/.test(upgradeEffect.textContent),sp.id+' retains heavy-hit role and visible upgrade effect');
    }
  });
  var before=JSON.stringify(b.getState());render();
  ok(JSON.stringify(b.getState())===before,'Rendering descriptions and Bond partners preserves player state');
  return {checks:checks,bonds:bonds.length,statesPerBond:3,wisps:wisps.length};
};
