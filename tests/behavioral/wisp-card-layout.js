/* Card layout/preservation checks. Injected in a throwaway browser only.
 * Run with wisp-upgrades.cjs --card-layout [--baseline] --evidence DIR.
 */
window.runWispCardLayoutQa=function(baseline){
  var b=window.__wispQa,checks=0,observations=[];
  function ok(value,message){checks++;if(!value)throw Error(message);}
  function seed(id,stage){
    var s=b.fresh();s.maxDepthEver=250;s.tutorialDone=true;s.activeParty=[id];
    s.spirits[id]=stage===0?1:100;s.heroRarity[id]=stage===2?5:0;
    s.wispModules[id]=stage===2?b.moduleCap():(stage===1?b.moduleCap()-1:0);s.wispUltimate[id]=stage===2;
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
    var readout=card.querySelector('[data-wisp-role]');
    if(baseline)ok(readout.textContent.includes('Party preview lost if removed'),'baseline has party preview '+id);
    else{
      ok(!card.textContent.includes('Raw damage')&&!card.textContent.includes('Party preview'),'requested preview rows removed '+id);
      if(!readout.textContent.trim())ok(readout.getBoundingClientRect().height===0,'empty readout leaves no gap '+id);
    }
    var nodes=Array.from(card.querySelectorAll('div,span,strong,h3,button,summary'));
    nodes.forEach(function(e){var r=e.getBoundingClientRect();if(!r.width||!r.height)return;
      ok(e.scrollWidth<=e.clientWidth+1&&r.left>=-1&&r.right<=innerWidth+1,'no clipped card text '+id+'/'+stage+': '+JSON.stringify({className:e.className,scroll:e.scrollWidth,client:e.clientWidth,left:r.left,right:r.right,viewport:innerWidth,text:e.textContent}));
    });
    Array.from(card.querySelectorAll('button,summary')).forEach(function(e){var r=e.getBoundingClientRect();if(r.height)ok(r.width>=44&&r.height>=44,'44px control '+e.outerHTML.slice(0,160));});
    if(stage<2){
      ['module','rarity','ultimate'].forEach(function(action){var e=card.querySelector('[data-'+action+']');ok(e&&e.getBoundingClientRect().height>=44,'unfinished '+action+' visible');});
      ok(card.querySelector('[data-module]').querySelectorAll('.cost-icon').length===2,'both Module prices retained');
      if(!baseline){
        var upgrade=card.querySelector('[data-module]'),label={dps:'Upgrade Ability',breaker:'Upgrade Ability',ranged:'Upgrade Shards',druid:'Upgrade Lumen',support:'Upgrade Motes'}[b.spirit(id).abilityType];
        ok(upgrade.textContent.includes(label)&&!upgrade.textContent.includes('Upgrade Module')&&!upgrade.textContent.includes('Upgrade Rewards'),'purchase label names the exact improvement '+id);
        ok(upgrade.getAttribute('aria-label').includes(label)&&upgrade.getAttribute('aria-label').includes(b.spirit(id).name),'accessible purchase name identifies effect and Wisp '+id);
      }
      if(baseline){
        ok(card.querySelector('[data-ultimate]').textContent.includes('Mythic required'),'baseline Ultimate prerequisite retained');
      }else{
        var ultimateButton=card.querySelector('[data-ultimate]'),ultimateHelp=card.querySelector('.ultimate-requirements');
        ok(ultimateHelp&&ultimateButton.getAttribute('aria-describedby')===ultimateHelp.id,'Ultimate associates its full requirements for assistive technology');
        var ultimateText=ultimateHelp.textContent;
        ok(ultimateText.includes('Requires Mythic rarity')&&ultimateText.includes('highest rarity')&&ultimateText.includes('Use Rarity Up'),'Ultimate explains rarity requirement and route');
        var rarity=card.querySelector('.wisp-rarity-section'),requirement=rarity.querySelector('.rarity-level-requirement');
        ok(requirement.textContent.includes('Requires Wisp Lv. '+b.rarityRequirement(0))&&requirement.textContent.includes('Rift'),'Rarity requirement explicitly uses Wisp level and Rift');
        ok(rarity.querySelector('[data-rarity]').getAttribute('aria-describedby')===requirement.id,'Rarity button associates its Wisp-level requirement');
      }
    }
    var a=getComputedStyle(card.querySelector('.hero-ability')),m=getComputedStyle(card.querySelector('.module-row'));
    if(!baseline){
      ok(a.borderLeftWidth==='0px'&&a.backgroundColor==='rgba(0, 0, 0, 0)','ability uses plain card surface');
      ok(m.borderLeftWidth==='0px'&&m.backgroundColor==='rgba(0, 0, 0, 0)','Module uses plain card surface');
      var heading=card.querySelector('[data-wisp-details]'),level=card.querySelector('.wisp-level'),levelStyle=level&&getComputedStyle(level);
      ok(heading.textContent===(stage===2?'Upgrades':b.spirit(id).abilityName),'ability leads unfinished section without extra heading');
      ok(heading.getAttribute('aria-label')===b.spirit(id).name+(stage===2?' upgrades':' ability and upgrades'),'heading/disclosure retains Wisp context for assistive technology');
      ok(!card.querySelector('.ability-label'),'no redundant Ability label');
      var abilityTitle=card.querySelector('.wisp-ability-title h3,.wisp-ability-title strong');
      ok(!card.querySelector('.ability-badge'),'compact card omits redundant Ability badge '+id);
      ok(abilityTitle&&abilityTitle.textContent===b.spirit(id).abilityName,'compact ability retains its actual name '+id);
      ok(['Overcharge Core','Impact Core','Piercing Lens','Bloom Catalyst','Resonant Focus'].every(function(name){return !card.textContent.includes(name);}),'no second upgrade identity on card '+id);
      var progress=card.querySelector('.ability-level'),savedLevel=b.get().wispModules[id],cap=b.moduleCap();
      ok(progress&&progress.textContent==='Lv. '+savedLevel+'/'+cap&&!card.querySelector('.ability-upgrades'),'ability level has a clear badge '+id);
      ok(progress.getAttribute('aria-label')==='Ability upgrade level '+savedLevel+' of '+cap&&progress.getBoundingClientRect().right<=abilityTitle.getBoundingClientRect().left+1,'ability level precedes its named ability with distinct accessible name '+id);
      var raritySection=card.querySelector('.wisp-rarity-section'),abilitySection=card.querySelector('.wisp-ability-section');
      ok(raritySection&&abilitySection&&raritySection!==abilitySection&&raritySection.contains(card.querySelector('[data-rarity]'))&&!abilitySection.querySelector('[data-rarity]'),'Rarity purchase is separate from ability upgrades '+id);
      ok(abilitySection.querySelector('[data-ability-current]').textContent===b.moduleEffect(id,savedLevel),'Current matches purchased upgrade level '+id);
      ok(abilitySection.querySelector('[data-ability-next]').textContent===(savedLevel>=cap?'Maxed':b.moduleEffect(id,savedLevel+1)),'Next shows exact next level or Maxed without exceeding cap '+id);
      ok(level&&level.textContent==='Lv. '+b.get().spirits[id]&&parseFloat(levelStyle.borderLeftWidth)>0&&levelStyle.backgroundColor!=='rgba(0, 0, 0, 0)','saved Wisp level in a little box');
      var button=card.querySelector('[data-module]');if(button)ok(getComputedStyle(button).flexDirection==='row','inline Module prices');
    }
    observations.push({id:id,stage:stage,height:card.getBoundingClientRect().height,moduleColumns:m.gridTemplateColumns});
  });});
  if(!baseline){
    var gateState=seed('ember',1);gateState.spirits.ember=1;b.set(gateState);b.render();
    ok(document.querySelector('[data-rarity=ember]').disabled,'high ability level cannot bypass low Wisp-level rarity gate');
    gateState.spirits.ember=100;gateState.wispModules.ember=0;b.set(gateState);b.render();
    ok(!document.querySelector('[data-rarity=ember]').disabled,'zero ability upgrades do not block funded Wisp-level rarity purchase');
  }
  // Leave a representative starting card for the driver's geometry and screenshots.
  b.set(seed('ember',0));b.render();b.refresh();b.present();
  return {checks:checks,fixtures:observations.length,observations:observations};
};
