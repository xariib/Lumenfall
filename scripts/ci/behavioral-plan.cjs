'use strict';
const assert=require('node:assert/strict');
const isolated='offline-catchup-core';
function verify(scenarios,groups){
 assert.deepEqual(Object.keys(groups).sort(),['main','offline']);
 assert(Array.isArray(groups.main)&&Array.isArray(groups.offline));
 assert.deepEqual(groups.offline,[isolated],'long offline case remains mandatory');
 const actual=groups.main.concat(groups.offline);
 assert.equal(new Set(actual).size,actual.length,'no duplicate cases');
 assert.deepEqual(actual.slice().sort(),Object.keys(scenarios).sort(),'every default case exactly once');
 return groups;
}
function plan(scenarios){
 assert(Object.hasOwn(scenarios,isolated),'required offline case exists');
 return verify(scenarios,{main:Object.keys(scenarios).filter(name=>name!==isolated),offline:[isolated]});
}
function select(scenarios,group){
 const groups=plan(scenarios);assert(Object.hasOwn(groups,group),'unknown CI group');
 return Object.fromEntries(groups[group].map(name=>[name,scenarios[name]]));
}
module.exports={plan,verify,select};
