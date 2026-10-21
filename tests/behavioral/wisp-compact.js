/* Compact-card acceptance in the actual app; injected for QA only. */
window.runWispCompactQa=function(){
  var result=window.runWispCardLayoutQa(false),b=window.__wispQa,checks=0,observations=[];
  function ok(value,message){checks++;if(!value)throw Error(message);}
  window.__wispFocusNames=[];
  document.addEventListener('focusin',function(event){
    if(event.target.matches('.wisp-action-primary'))window.__wispFocusNames.push({module:event.target.getAttribute('data-module'),name:event.target.getAttribute('aria-label')});
  },true);
  function namesBeforeRefresh(c){
    c.querySelectorAll('button').forEach(function(button){
      var cue=!!button.querySelector('.wisp-next-label'),name=button.getAttribute('aria-label')||'';
      ok(cue===name.includes('Next ·'),'next cue included in accessible name before refresh');
    });
  }
  function card(id){return document.querySelector('[data-wisp-card="'+id+'"]');}
  function inspect(id,expected){
    namesBeforeRefresh(card(id));
    var before=JSON.stringify(b.get()),slots=JSON.stringify(b.slots());b.refresh();
    var c=card(id),primary=c.querySelectorAll('.wisp-action-primary');
    ok(JSON.stringify(b.get())===before&&JSON.stringify(b.slots())===slots,'highlight never changes state or either saved slot');
    ok(primary.length===(expected?1:0),'unfunded card has no suggested purchase; funded card has one '+id+'/'+expected);
    ok(!c.querySelector('.wisp-next-action')&&!c.querySelector('.ability-badge'),'no duplicated next-action panel or Ability badge');
    if(expected){
      ok(c.dataset.primaryAction===expected&&primary[0].hasAttribute('data-'+expected)&&!primary[0].disabled,'correct original purchase highlighted '+id+'/'+expected);
      ok(primary[0].querySelector('.wisp-next-label').textContent==='Next ·','text cue accompanies color');
      var probe=document.createElement('span');probe.style.color='var(--lumen)';c.appendChild(probe);
      ok(getComputedStyle(primary[0]).borderTopColor===getComputedStyle(probe).color,'primary border survives chapter styles');probe.remove();
      ok(primary[0].getAttribute('aria-label').includes(b.spirit(id).name)&&primary[0].getAttribute('aria-label').includes('Next'),'accessible next action identifies Wisp and intent');
    }
    observations.push({id:id,action:expected||null});
  }
  b.set(b.fresh());b.render();inspect('ember',null);inspect('titan',null);
  var cost=b.empowerCost('ember');b.wallet(cost,0);inspect('ember','empower');
  var button=card('ember').querySelector('[data-empower]');button.scrollIntoView({block:'center'});button.focus({preventScroll:true});
  var main=document.querySelector('main'),top=main.scrollTop;
  b.wallet(0,0);inspect('ember',null);ok(Math.abs(main.scrollTop-top)<1&&document.activeElement.closest('[data-wisp-card]')===card('ember'),'wallet loss keeps exact scroll and same Wisp');
  var moduleCost=b.moduleCost('ember',0);b.wallet(moduleCost.lumen,moduleCost.shard);inspect('ember','module');
  b.wallet(moduleCost.lumen,moduleCost.shard-1);inspect('ember','empower');
  var s=b.fresh();s.spirits.ember=200;s.maxDepthEver=1000;s.ascendCount=100;s.longStudyLevels.wispascend=300;s.research.arcanecal=30;s.research.masterwork=10;s.nodes.swift=20;s.lumen=s.shards=1e20;
  b.set(s);b.render();inspect('ember','rarity');
  s.heroRarity.ember=5;s.wispModules.ember=20;s.sigils=1e10;b.set(s);b.render();inspect('ember','ultimate');
  s.wispUltimate.ember=true;s.prisms=20000;b.set(s);b.render();inspect('ember','mastery');
  s.spirits.tide=0;s.heroRarity.tide=5;s.wispModules.tide=20;s.wispUltimate.tide=true;b.set(s);b.render();inspect('tide','empower');
  // Keep a fresh, funded Ability for a representative screenshot and native input.
  s=b.fresh();s.lumen=moduleCost.lumen;s.shards=moduleCost.shard;b.set(s);b.render();b.refresh();b.present();
  return {checks:result.checks+checks,observations:result.observations,priorityCases:observations};
};
