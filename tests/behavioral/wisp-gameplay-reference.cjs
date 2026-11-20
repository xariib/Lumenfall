'use strict';
// Approved20 November prices and requirements, independent of product catalogs.
const bases={ember:10,tide:60,stone:360,gale:2361183,thorn:39614081,void:664613998,aurora:6968982875,titan:3138550867693};
const recruitment={ember:[1,0,0],tide:[5,0,25],stone:[10,1,100],gale:[15,17,0],thorn:[35,23,0],void:[55,29,0],aurora:[75,34,0],titan:[100,47,0]};
function empower(id,level,rank,bonds){
 const base=bases[id],discount=100-Math.min(60,3*bonds);
 if(!rank||level<=25)return Math.round((base*1.13**level)*(1-Math.min(.6,.03*bonds)));
 const estimate=((base*1.13**25)*((113-rank)/100)**(level-25))*(discount/100);
 if(estimate>Number.MAX_SAFE_INTEGER)return Math.round(estimate);
 const numerator=BigInt(base)*113n**25n*BigInt(113-rank)**BigInt(level-25)*BigInt(discount),denominator=100n**BigInt(level+1);
 return Number((2n*numerator+denominator)/(2n*denominator));
}
module.exports={bases,recruitment,empower};
