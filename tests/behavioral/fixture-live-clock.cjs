'use strict';
const assert=require('node:assert/strict');

// Match a throwaway UI fixture's paused scheduler without freezing performance
// budgets, layout/animation frames, input dispatch or its ordinary live windows.
module.exports=function fixtureLiveClock(html,property,runningValue){
  const marker="if(document.readyState==='loading'){";
  assert.equal(html.split(marker).length,2,'one complete game clock hook');
  const prelude=`<script>(function(){
    var value,elapsed=100,anchor=performance.now(),property=${JSON.stringify(property||null)},running=${JSON.stringify(runningValue===undefined?true:runningValue)};
    function active(){return property && value===running;}
    window.__fixtureLiveNow=function(){return elapsed+(active()?performance.now()-anchor:0);};
    if(property)Object.defineProperty(window,property,{configurable:true,get:function(){return value;},set:function(next){var now=performance.now();if(active())elapsed+=now-anchor;anchor=now;value=next;}});
  })();</script>`;
  return html.replace('<head>','<head>'+prelude).replace(marker,
    "if(typeof liveMonotonicNow==='function')liveMonotonicNow=window.__fixtureLiveNow;\n"+marker);
};
