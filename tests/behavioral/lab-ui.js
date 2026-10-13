/* LAB_UI_001 presentation checks against real rendering and handlers. */
window.selectLabSpeed=function(id,mult){var select=document.querySelector('[data-study-speed-target="'+id+'"]');select.value=String(mult);select.dispatchEvent(new Event('change',{bubbles:true}));};
window.checkLabSpeedControls = function(b,assert,id){
 var q=function(selector){return document.querySelector(selector);},row=q('[data-study-inspection="'+id+'"]'),select=q('[data-study-speed-target="'+id+'"]');
 assert(!row.hidden&&select.getClientRects().length,'speed controls directly visible');
 var before=JSON.stringify(b.getState()),save=b.rawSave(),recovery=b.rawRecovery();
 select.focus();b.renderLayout();
 assert(document.activeElement===select&&select.isConnected,'native speed select stays attached across rendering');
 assert(select.options.length===8,'all original tiers directly reachable');
 assert(row.closest('.study-card').textContent.includes('On completion:'),'effect remains on card');
 assert(JSON.stringify(b.getState())===before&&b.rawSave()===save&&b.rawRecovery()===recovery,'focus/render do not pay, advance or save');
};

window.runLabUiQa = function(b,ctx,assert){
  var checks=0,records=[],q=function(selector){return document.querySelector(selector);};
  function ok(value,message){checks++;assert(value,'LAB_UI_001: '+message);}
  function seed(){var s=window.labMotesSeed(b,ctx);s.motes=1000;s.studyUseMotes.guardmastery=false;s.activeStudies=[{id:'guardmastery',remainingSec:150,totalDurationSec:150,speedMult:1}];return s;}
  function install(s){b.setState(s);b.renderLayout();q('[data-tab="research"]').click();}
  function fit(){
    ok(document.documentElement.scrollWidth<=innerWidth+1&&q('#study-list').scrollWidth<=q('#study-list').clientWidth+1,'no horizontal overflow');
    Array.from(q('#study-list').querySelectorAll('button,select')).filter(function(el){return el.getClientRects().length;}).forEach(function(el){
      ok(el.offsetWidth>=44&&el.offsetHeight>=44,'controls have 44px layout targets: '+el.outerHTML.slice(0,180));
    });
  }
  function luminance(css){return css.match(/[\d.]+/g).slice(0,3).map(function(v){v=Number(v)/255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4);}).reduce(function(sum,v,i){return sum+v*[.2126,.7152,.0722][i];},0);}
  install(seed());
  var card=q('[data-running-study="guardmastery"]');
  ok(card.innerText.split("Guardian's Mastery").length===2,'one visible title');
  ok((card.innerText.match(/Lv\./g)||[]).length===1&&!/Completed level|In progress: level|Details/.test(card.innerText),'one current level and no repeated status');
  ok(card.innerText.includes('Earned: +0%')&&card.innerText.includes('On completion: +20% tap damage'),'earned and completion effects distinct');
  ok(!card.querySelector('details')&&!card.querySelector('[data-study-details]'),'direct controls without a separate panel');
  ok(card.querySelector('[data-study-speed-target]').getClientRects().length,'direct selector visible initially');
  window.checkLabSpeedControls(b,ok,'guardmastery');

  [0,50,99.999,100].forEach(function(percent){
    var s=seed();s.activeStudies[0].remainingSec=150*(1-percent/100);s.activeStudies[0].speedMult=8;install(s);
    var bar=q('[data-running-study="guardmastery"] [role="progressbar"]'),text=q('[data-study-text="guardmastery"]');
    ok(bar&&bar.contains(text),'time and speed are inside progressbar');
    var expected=percent<100?Math.min(99,Math.round(percent)):100;
    ok(bar.getAttribute('aria-valuemin')==='0'&&bar.getAttribute('aria-valuemax')==='100'&&Number(bar.getAttribute('aria-valuenow'))===expected,'progress ARIA range/value never announces incomplete work as 100%');
    ok(bar.getAttribute('aria-label').includes("Guardian's Mastery")&&bar.getAttribute('aria-valuetext').includes(text.textContent)&&text.textContent.includes('8x'),'named progress with time and speed');
    var tr=text.getBoundingClientRect(),br=bar.getBoundingClientRect(),style=getComputedStyle(text);
    ok(tr.left>=br.left&&tr.right<=br.right&&tr.top>=br.top&&tr.bottom<=br.bottom,'progress text fits its bar');
    var contrast=(Math.max(luminance(style.color),luminance(style.backgroundColor))+.05)/(Math.min(luminance(style.color),luminance(style.backgroundColor))+.05);
    ok(contrast>=4.5&&style.backgroundColor!=='rgba(0, 0, 0, 0)','opaque text background maintains contrast independent of fill');
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)ok(getComputedStyle(q('[data-study-bar="guardmastery"]')).transitionDuration==='0s','reduced motion removes progress transition');
    var before=JSON.stringify(b.getState()),save=b.rawSave();b.studyPresentation.update();
    ok(Number(bar.getAttribute('aria-valuenow'))===expected&&bar.getAttribute('aria-valuetext').indexOf(expected+'%')===0,'live progress update preserves incomplete/completed work distinction');
    ok(before===JSON.stringify(b.getState())&&save===b.rawSave(),'progress never completes work or writes save');
    fit();records.push({percent:percent,contrast:contrast,text:text.textContent});
  });
  var long=seed();long.activeStudies[0].remainingSec=8640009;long.activeStudies[0].totalDurationSec=9000000;install(long);fit();
  ok(q('[data-study-text="guardmastery"]').textContent.includes('100d'),'long duration remains readable');

  ['guardmastery','wispascend'].forEach(function(id){
    var beginning=seed();beginning.activeStudies=[];install(beginning);
    var begin=q('[data-study="'+id+'"]');begin.focus();begin.click();
    ok(b.getState().activeStudies.some(function(active){return active.id===id;}),'Begin Study starts the selected Study');
    ok(document.activeElement.dataset.studySpeedTarget===id&&document.activeElement.getClientRects().length,'beginning a Study restores focus to its visible speed selector');
    ok(!q('[data-study-inspection="'+id+'"]').hidden,'beginning a Study keeps controls visible');
  });

  install(seed());
  var select=q('[data-study-speed-target="guardmastery"]');select.value='3';select.dispatchEvent(new Event('change',{bubbles:true}));
  var saved=b.getState();ok(saved.studySpeedTargets.guardmastery===3&&saved.motes===1000&&saved.activeStudies[0].speedMult===1,'selection alone never buys');
  var buy=q('[data-speed-study="guardmastery"][data-speed="3"]');buy.focus();b.renderLayout();
  ok(document.activeElement.dataset.speed==='3'&&document.activeElement.dataset.speedStudy==='guardmastery','unrelated rendering preserves an available purchase focus');
  q('[data-speed-study="guardmastery"][data-speed="3"]').click();
  var paid=b.getState();ok(paid.motes===940&&paid.activeStudies[0].speedMult===3,'real button charges exactly 60 Motes');
  ok(document.activeElement.dataset.studySpeedTarget==='guardmastery','purchase returns usable focus to same Study selector');
  ok(!q('[data-study-inspection="guardmastery"]').hidden&&q('[data-speed-study="guardmastery"][data-speed="3"]').getAttribute('aria-pressed')==='true','inline purchase marks current speed');
  ok(q('[data-study-inspection="wispascend"] [data-speed-study]').disabled,'idle controls cannot purchase a nonexistent level');
  window.selectLabSpeed('guardmastery',2);
  var finish=seed();finish.activeStudies[0].remainingSec=.1;install(finish);window.selectLabSpeed('guardmastery',2);
  q('[data-speed-study="guardmastery"][data-speed="2"]').focus();b.inquiry.tail(.1);b.renderLayout();
  ok(!b.getState().activeStudies.length&&document.activeElement.dataset.studySpeedTarget==='guardmastery','completion leaves focus on the same Study selector');
  ok(q('[data-study-inspection="guardmastery"] [data-speed-study]').disabled,'completed record cannot be bought again');
  ['[data-study-use-motes="riftattune"]','[data-speed-study="riftattune"][data-speed="3"]','[data-study-speed-target="riftattune"]'].forEach(function(control){
    var legacy=seed();legacy.longStudyLevels.riftattune=2;legacy.studyUseMotes.riftattune=false;legacy.activeStudies=[{id:'riftattune',remainingSec:.1,totalDurationSec:150,speedMult:2}];install(legacy);
    window.selectLabSpeed('riftattune',3);
    var target=q(control);ok(target.getClientRects().length,'retired focus fixture visible '+control);target.focus();
    ok(document.activeElement===target,'retired focus fixture actually focused '+control);
    b.inquiry.tail(.1);b.renderLayout();
    ok(b.getState().longStudyLevels.riftattune===3&&!b.getState().activeStudies.length,'retired paid work earns its last level');
    ok(!q('[data-legacy-upgrade="riftattune"]'),'completed legacy card stays out of the shop');
    ok(document.activeElement.id==='study-choices'&&document.activeElement.getClientRects().length,'retired completion focuses visible choices heading from '+control);
    var settled=JSON.stringify(b.getState()),primary=b.rawSave(),recovery=b.rawRecovery();
    b.renderLayout();ok(document.activeElement.id==='study-choices'&&document.activeElement.isConnected,'choices heading focus survives rendering');
    ok(JSON.stringify(b.getState())===settled&&b.rawSave()===primary&&b.rawRecovery()===recovery,'focus restoration never changes paid values or saves');
    b.inquiry.tail(.1);b.renderLayout();
    ok(b.getState().longStudyLevels.riftattune===3&&!b.getState().activeStudies.length,'retired completion cannot grant twice');
    ok(document.activeElement.id==='study-choices','choices heading remains focused after subsequent updates');
  });
  install(seed());fit();
  return {checks:checks,progress:records};
};
