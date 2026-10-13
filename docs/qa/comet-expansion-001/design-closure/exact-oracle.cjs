'use strict';
// Independent Node20+ test oracle. BigInt exists ONLY here/in the proof runner;
// it is neither proposed for the product nor supplied to the candidate.
const bitsBuffer = Buffer.alloc(8);
const MAX_BITS = 0x7fefffffffffffffn;
function bits(x) { bitsBuffer.writeDoubleBE(x); return bitsBuffer.readBigUInt64BE(); }
function fromBits(value) { bitsBuffer.writeBigUInt64BE(value); return bitsBuffer.readDoubleBE(); }
function dyadic(x) {
  const raw = bits(x), exp = Number((raw >> 52n) & 2047n);
  return {n: (raw & 0xfffffffffffffn) + (exp ? 0x10000000000000n : 0n), e: exp ? exp - 1075 : -1074};
}
function compare(a, b) {
  const e = Math.min(a.e, b.e), an = a.n << BigInt(a.e - e), bn = b.n << BigInt(b.e - e);
  return an < bn ? -1 : an > bn ? 1 : 0;
}
function subtract(a, b) {
  const e = Math.min(a.e, b.e);
  return {n: (a.n << BigInt(a.e - e)) - (b.n << BigInt(b.e - e)), e};
}
function floorRatio(x, numerator, denominator) {
  let {n, e} = dyadic(x); n *= BigInt(numerator);
  return e >= 0 ? (n << BigInt(e)) / BigInt(denominator) : n / (BigInt(denominator) << BigInt(-e));
}
function floorIntegerNumber(integer) {
  if (integer === 0n) return 0;
  const closest = Number(integer);
  return BigInt(closest) <= integer ? closest : fromBits(bits(closest) - 1n);
}
function ceilDyadicNumber(value, maximum) {
  if (value.n === 0n) return 0;
  // Independent monotone bit-space search; no candidate subtraction/nextUp.
  let low = 0n, high = maximum === undefined ? MAX_BITS : bits(maximum);
  while (low < high) {
    const mid = (low + high) >> 1n;
    if (compare(dyadic(fromBits(mid)), value) < 0) low = mid + 1n;
    else high = mid;
  }
  return fromBits(low);
}
function exactBudget(H, P, rank) {
  const hp = floorRatio(H, 4 + rank, 20), power = floorRatio(P, 12, 1);
  const integer = hp < power ? hp : power;
  return {hp, power, integer, budget: floorIntegerNumber(integer)};
}
function plan(H, h, P, rank) {
  if (!Number.isFinite(H) || H <= 0 || !Number.isFinite(h) || h <= 0 || h > H ||
      !Number.isFinite(P) || P < 0 || !Number.isInteger(rank) || rank < 0 || rank > 4) {
    return {available: false, reason: 'invalid', budget: 0};
  }
  const b = exactBudget(H, P, rank).budget;
  if (b < 1) return {available: false, reason: 'zero-budget', budget: b};
  if (b >= h) return {available: true, lethal: true, budget: b, damage: h, hpAfter: 0};
  const exactRemainder = subtract(dyadic(h), dyadic(b));
  const hpAfter = ceilDyadicNumber(exactRemainder, h);
  if (hpAfter === h) return {available: false, reason: 'unrepresentable', budget: b};
  const damageDyadic = subtract(dyadic(h), dyadic(hpAfter));
  // The mathematical difference is independently proved equal to this Number.
  const damage = h - hpAfter;
  if (compare(dyadic(damage), damageDyadic) !== 0) throw Error('Oracle damage conversion unexpectedly inexact');
  return {available: true, lethal: false, budget: b, damage, hpAfter};
}
module.exports = {bits, fromBits, dyadic, compare, subtract, floorRatio, floorIntegerNumber, ceilDyadicNumber, exactBudget, plan};
