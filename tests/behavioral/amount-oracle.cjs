'use strict';
// Independent Node-only rational oracle; never imported by the game.
const assert=require('node:assert/strict');
function fraction(value){
 if(typeof value==='number'&&Number.isInteger(value))return {n:BigInt(value),d:1n};
 const match=/^(-?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/.exec(String(value));assert(match,'decimal oracle input');
 const exponent=Number(match[4]||0)-(match[3]||'').length,n=BigInt((match[1]||'')+match[2]+(match[3]||''));
 return exponent>=0?{n:n*10n**BigInt(exponent),d:1n}:{n,d:10n**BigInt(-exponent)};
}
function ge(a,b){if(typeof a==='number'&&typeof b==='number')return a>=b;const x=fraction(a),y=fraction(b);return x.n*y.d>=y.n*x.d;}
function integer(value){const x=fraction(value);assert.equal(x.n%x.d,0n,'integer oracle input');return x.n/x.d;}
module.exports={fraction,ge,integer};
