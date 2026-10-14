/* Card layout/preservation checks. Injected in a throwaway browser only.
 * Run with wisp-upgrades.cjs --card-layout [--baseline] --evidence DIR.
 */
window.runWispCardLayoutQa=function(baseline){
  var b=window.__wispQa,checks=0,observations=[];
  function ok(value,message){checks++;if(!value)throw Error(message);}
  function seed(id,stage){
    var s=b.fresh();s.maxDepthEver=250;s.tutorialDone=true;s.activeParty=[id];
    s.spirits[id]=stage===0?1:100;s.heroRarity[id]=stage===2?5:0;
    s.wispModules[id]=stage===2?20:0;s.wispUltimate[id]=stage===2;
    s.lumen=s.shards=s.sigils=stage===0?0:1e20;return s;
  }
  b.prepare();
  b.ids.forEach(function(id){[0,1,2].forEach(function(stage){
    b.set(seed(id,stage));b.render();b.refresh();
    var card=document.querySelector('[data-wisp-card="'+id+'"]');
    var p=card.querySelector('[data-wisp-progression]');if(p.tagName==='DETAILS')p.open=true;
    var before=JSON.stringify(b.get()),slots=JSON.stringify(b.slots());
    b.render();b.refresh();card=document.querySelector('[data-wisp-card="'+id+'"]');p=card.querySelector('[data-wisp-progression]');
    ok(JSON.stringify(b.get())===before&&JSON.stringify(b.slots())===slots,'render leaves full state and both save slots unchanged '+id+'/'+stage);
    ok((p.tagName==='DETAILS')===(stage===2),'unfinished upgrades remain visible '+id+'/'+stage);
    ok(card.textContent.includes(b.spirit(id).abilityName),'ability retained '+id);
    ok(card.textContent.includes('Wisp Power')&&card.querySelector('.rarity-badge'),'power/rarity retained '+id);
    ok(card.querySelector('[data-wisp-role]').textContent.includes('Party preview lost if removed'),'contribution retained '+id);
    var nodes=Array.from(card.querySelectorAll('div,span,strong,h3,button,summary'));
    nodes.forEach(function(e){var r=e.getBoundingClientRect();if(!r.width||!r.height)return;
      ok(e.scrollWidth<=e.clientWidth+1&&r.left>=-1&&r.right<=innerWidth+1,'no clipped card text '+id+'/'+stage+': '+e.outerHTML.slice(0,200));
    });
    Array.from(card.querySelectorAll('button,summary')).forEach(function(e){var r=e.getBoundingClientRect();if(r.height)ok(r.width>=44&&r.height>=44,'44px control '+e.outerHTML.slice(0,160));});
    if(stage<2){
      ['module','rarity','ultimate'].forEach(function(action){var e=card.querySelector('[data-'+action+']');ok(e&&e.getBoundingClientRect().height>=44,'unfinished '+action+' visible');});
      ok(card.querySelector('[data-module]').querySelectorAll('.cost-icon').length===2,'both Module prices retained');
      ok(card.querySelector('[data-ultimate]').textContent.includes('Mythic required'),'Ultimate prerequisite retained');
      ok(card.querySelector('[data-rarity]').textContent.includes('Lv.'+b.rarityRequirement(0)+' req')||stage!==0,'Rarity prerequisite retained');
    }
    var a=getComputedStyle(card.querySelector('.hero-ability')),m=getComputedStyle(card.querySelector('.module-row'));
    if(!baseline){
      ok(a.borderLeftWidth==='0px'&&a.backgroundColor==='rgba(0, 0, 0, 0)','ability uses plain card surface');
      ok(m.borderLeftWidth==='0px'&&m.backgroundColor==='rgba(0, 0, 0, 0)','Module uses plain card surface');
      ok(card.querySelector('[data-wisp-details]').textContent==='Upgrades','short progression heading');
      var button=card.querySelector('[data-module]');if(button)ok(getComputedStyle(button).flexDirection==='row','inline Module prices');
    }
    observations.push({id:id,stage:stage,height:card.getBoundingClientRect().height,moduleColumns:m.gridTemplateColumns});
  });});
  // Leave a representative starting card for the driver's geometry and screenshots.
  b.set(seed('ember',0));b.render();b.refresh();b.present();
  return {checks:checks,fixtures:observations.length,observations:observations};
};
