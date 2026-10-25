'use strict';
const assert = require('node:assert/strict');

// Native input uses screen pixels; CDP geometry uses WebView CSS coordinates.
// Measure the origin with trusted touches on inert text, not a guessed inset.
function transformFromProbes(probes, scale) {
  assert(Number.isFinite(scale) && scale > 0, 'Valid native/CSS scale');
  assert.equal(probes.length, 2, 'Two independent native probes required');
  const offsets = probes.map(({native, event}) => {
    assert.equal(event.trusted, true, 'Native calibration must be trusted');
    assert.equal(event.type, 'pointerdown');
    assert.equal(event.interactive, false, 'Calibration must touch inert content');
    for (const n of [native.x, native.y, event.x, event.y]) assert(Number.isFinite(n));
    return {x: native.x - event.x * scale, y: native.y - event.y * scale};
  });
  assert(Math.abs(probes[0].native.x - probes[1].native.x) >= 20 * scale);
  assert(Math.abs(probes[0].native.y - probes[1].native.y) >= 20 * scale);
  assert(Math.abs(offsets[0].x - offsets[1].x) <= 1, 'Stable WebView X origin');
  assert(Math.abs(offsets[0].y - offsets[1].y) <= 1, 'Stable WebView Y origin');
  return {scale, x: (offsets[0].x + offsets[1].x) / 2, y: (offsets[0].y + offsets[1].y) / 2};
}

function nativePoint(transform, point) {
  assert(Number.isFinite(point.x) && Number.isFinite(point.y));
  return {x: Math.round(transform.x + point.x * transform.scale), y: Math.round(transform.y + point.y * transform.scale)};
}

function requireCenteredPointer(events, point, target) {
  const down = events.find(e => e.type === 'pointerdown' && e.trusted && e.target === target);
  assert(down, 'Trusted native pointer reaches ' + target);
  assert(Math.abs(down.x - point.x) <= 1 && Math.abs(down.y - point.y) <= 1,
    'Native pointer reaches CSS center: ' + JSON.stringify({expected: point, actual: down}));
  assert(events.some(e => e.type === 'click' && e.trusted && e.target === target), 'Trusted native click reaches ' + target);
}

module.exports = {transformFromProbes, nativePoint, requireCenteredPointer};
