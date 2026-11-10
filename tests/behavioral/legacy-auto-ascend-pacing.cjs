'use strict';

const assert = require('node:assert/strict');

// Replay the previously unrestricted policy for frozen receipts and the
// synthetic stress that deliberately executes many cycles in one instant.
// Current production pacing has a separate full-engine suite.
module.exports = function legacyAutoAscendPacing(source) {
  const deadline = '    state.autoAscendRepeatAtMs=Math.ceil(nowMs===undefined?gameplayNowMs():nowMs)+AUTO_ASCEND_REPEAT_MS;';
  assert.equal(source.split(deadline).length, 2, 'one automatic repeat deadline write');
  return source.replace(deadline, '    /* historical Auto-Ascend has no repeat deadline */');
};
