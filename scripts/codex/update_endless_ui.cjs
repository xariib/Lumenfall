'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const file=process.argv[2]||'index.html';let html=fs.readFileSync(file,'utf8');
const match=/<script>\s*([\s\S]*?)<\/script>/.exec(html),script=match[1],offset=match.index+match[0].indexOf(script);
const m={exports:{}};new Function('exports','module',process.binding('natives')['internal/deps/acorn/acorn/dist/acorn'])(m.exports,m);
const nodes=[];function visit(n){if(n.type==='VariableDeclaration'&&n.declarations.some(d=>d.id.name==='ultimateHtml'))nodes.push(n);for(const v of Object.values(n)){if(Array.isArray(v)){for(const c of v)if(c&&c.type)visit(c);}else if(v&&v.type)visit(v);}}
visit(m.exports.parse(script,{ecmaVersion:2020}));assert.equal(nodes.length,1);
const n=nodes[0];
const text=`var ultimateHtml = '<div class="ultimate-row">'+(ultimateUnlocked(sp.id)
      ? '<div class="ultimate-badge">Ultimate Unlocked — '+ultimateEffectText(sp)+'</div>'+resonanceHtml
      : '<p class="ultimate-requirements">Requires Mythic rarity (highest rarity). Use Rarity Up. '+wispRequirementText(ultimatePlan.requirements.filter(function(r){return r.key!==\'rarity\';}))+'</p>'+
        '<button class="mini-btn ultimate-btn" data-ultimate="'+sp.id+'" '+(ultimatePlan.affordable?'':'disabled')+'>Unlock Ultimate'+purchasePriceMarkup('sigil',ultCost,'wisp-upgrade-price')+'</button>')+'</div>';`;
const next=script.slice(0,n.start)+text+script.slice(n.end);new Function(next);
fs.writeFileSync(file,html.slice(0,offset)+next+html.slice(offset+script.length));
console.log('Updated Ultimate requirements and price presentation');
