'use strict';
const assert = require('node:assert/strict');

// A successful save advances only the wall endpoint and its credited frontier.
// Validate those values before comparing every remaining gameplay/save field.
module.exports = function expectSaveClock(expected, actual) {
  assert(Number.isFinite(actual.lastSeen) && actual.lastSeen >= expected.lastSeen,
    'successful save has a nondecreasing finite wall endpoint');
  expected.lastSeen = actual.lastSeen;
  if (Object.hasOwn(expected, 'offlineClockHighWaterMs')) {
    assert.equal(actual.offlineClockHighWaterMs,
      Math.max(expected.offlineClockHighWaterMs, actual.lastSeen),
      'successful save retains exactly the consumed offline frontier');
    expected.offlineClockHighWaterMs = actual.offlineClockHighWaterMs;
  }
};
