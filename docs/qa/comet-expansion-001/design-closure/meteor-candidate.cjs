'use strict';
// Design prototype only. This file is run with Node 20+; these pure candidate
// functions intentionally use only ES2017/Number/DataView operations supported
// by the product's Node-8-era target. No game source or stored state is changed.

function meteorBudget(H, P, rank) {
  if (!Number.isFinite(H) || H <= 0 || !Number.isFinite(P) || P <= 0 ||
      rank !== Math.floor(rank) || rank < 0 || rank > 4) return 0;
  var bits = new DataView(new ArrayBuffer(8));
  // Exact positive x = m * 2^e. Only the two fixed Meteor factors use this
  // private quotient kernel: (4+rank)/20 and (12/16)*2^4.
  function part(x, numerator, denominator, shift) {
    bits.setFloat64(0, x, false);
    var hi = bits.getUint32(0, false), lo = bits.getUint32(4, false);
    var raw = (hi >>> 20) & 2047;
    var m = ((hi & 1048575) + (raw ? 1048576 : 0)) * 4294967296 + lo;
    var e = (raw ? raw - 1075 : -1074) + shift;
    while (m < 4503599627370496) { m *= 2; e--; }
    // Base-2^26 limbs keep every integer intermediate below 2^53. Never
    // form m*numerator, H*percent or 12*P as a floating-point product.
    var radix = 67108864;
    var high = Math.floor(m / radix), low = m - high * radix;
    low *= numerator;
    high = high * numerator + Math.floor(low / radix);
    low %= radix;
    var qh = Math.floor(high / denominator);
    var remainder = high - qh * denominator;
    var joined = remainder * radix + low;
    var ql = Math.floor(joined / denominator);
    remainder = joined - ql * denominator;
    var q = qh * radix + ql;
    while (q < 4503599627370496) {
      q *= 2; remainder *= 2;
      if (remainder >= denominator) { q++; remainder -= denominator; }
      e--;
    }
    return {q: q, e: e};
  }
  var hp = part(H, 4 + rank, 20, 0);
  var power = part(P, 12, 16, 4);
  // Monotone directed conversion: equal q/e means equal output even when
  // the unused remainders differ. The chosen result cannot exceed 0.4*H.
  var chosen = hp.e < power.e || (hp.e === power.e && hp.q <= power.q) ? hp : power;
  if (chosen.e < -52) return 0;
  var result = chosen.q * Math.pow(2, chosen.e);
  return chosen.e < 0 ? Math.floor(result) : result;
}

function meteorNextUp(x) {
  if (x === 0) return Number.MIN_VALUE;
  var bits = new DataView(new ArrayBuffer(8));
  bits.setFloat64(0, x, false);
  var hi = bits.getUint32(0, false), lo = bits.getUint32(4, false);
  if (lo === 4294967295) { hi++; lo = 0; } else lo++;
  bits.setUint32(0, hi, false); bits.setUint32(4, lo, false);
  return bits.getFloat64(0, false);
}

function meteorPlan(H, h, P, rank) {
  if (!Number.isFinite(H) || H <= 0 || !Number.isFinite(h) || h <= 0 || h > H ||
      !Number.isFinite(P) || P < 0 || rank !== Math.floor(rank) || rank < 0 || rank > 4) {
    return {available: false, reason: 'invalid', budget: 0};
  }
  var budget = meteorBudget(H, P, rank);
  if (budget < 1) return {available: false, reason: 'zero-budget', budget: budget};
  if (budget >= h) return {available: true, lethal: true, budget: budget, damage: h, hpAfter: 0};
  var after = h - budget;
  if (h - after > budget) after = meteorNextUp(after);
  var damage = h - after;
  if (!(after >= 0 && after < h && damage > 0 && damage <= budget && h - damage === after)) {
    return {available: false, reason: 'unrepresentable', budget: budget};
  }
  return {available: true, lethal: false, budget: budget, damage: damage, hpAfter: after};
}

module.exports = {meteorBudget: meteorBudget, meteorPlan: meteorPlan, meteorNextUp: meteorNextUp};
