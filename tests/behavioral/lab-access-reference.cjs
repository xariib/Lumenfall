'use strict';
// Independent acceptance table for the chosen Rift-and-research policy.
const rules={
 wispdamage:{depth:25,studies:{wispascend:5}},
 wispcritchance:{depth:75,studies:{wispdamage:10}},
 wispcritdamage:{depth:150,studies:{wispcritchance:10}},
 measuredinquiry:{depth:150,studies:{wispascend:25}},
 procurement:{depth:100,studies:{lumenstudy:10}},
 catalysis:{depth:200,studies:{motestudy:10}},
 focusprotocol:{depth:125,studies:{guardmastery:15}},
 curriculum:{depth:250,studies:{measuredinquiry:3}}
};
// Fixtures using this helper represent research already earned, never a
// bypass of production gating. Tests of locked access use unmodified saves.
function ready(s,id){
 const rule=rules[id];if(!rule)return s;
 s.maxDepthEver=Math.max(s.maxDepthEver,rule.depth);
 for(const [key,level]of Object.entries(rule.studies))s.longStudyLevels[key]=Math.max(s.longStudyLevels[key]||0,level);
 return s;
}
module.exports={rules,ready};
