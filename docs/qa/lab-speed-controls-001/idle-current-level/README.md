# Idle boost action and current level — 15 October 2026

Follow-up to LAB_SPEED_CONTROLS_001. User requested removal of the idle
“Start a Study to boost” box; leave speed/hours choices and show the priced
boost button after research starts. Also show the current earned level.

Baseline: fe14b2d on local/full-debug, source419f650d. Checkout clean except
unrelated validation-evidence/, left untouched. Existing markup reproduced both
issues: idle disabled action and badges showing the upcoming level. The new
focused browser assertion failed on that baseline ([baseline.json](baseline.json)).

Changed only index.html presentation and affected regression expectations:
- Idle, unpaid cards have speed/hours choices without a boost action or quote box.
- Starting a Study reveals the selected multiplier/duration and priced action.
- An already-paid timer stays visible between levels, preserving paid time.
- Badge shows earned `Lv. 0`, `Lv. 5`, etc., on idle and running cards; it increases
  on genuine completion. Accessible label identifies “Current level”.
- Slider preview handles missing idle actions while keeping native focus/scroll.
- No price, timer, work, save, queue, payout, cap or balance formula changes.

Candidate source2d162943544713074e9a484937565e1b1dbca7d0a6e035a47658e988da51b27c.
Checks on those exact bytes, Node24.19.0 / Chromium151.0.7922.34:
- `node scripts/ci/validate_source.cjs`: PASS.
- `node tests/behavioral/lab-speed-controls.cjs index.html`: PASS1206, all12
  profiles (320/390/430px,100/200% text, both motion modes), native touch/keyboard,
  idle selection/Begin/completion and current levels0/5/6; existing quotes,
  duplicate protection, timer carry, focus/scroll and live callbacks retained.
  [Receipt](native.json), [screenshots](browser/lab-390-100-no-preference.png).
- `node tests/behavioral/run.cjs --web-root <source-and-assets-only-stage> --scenario lab-ui-regression`:
  PASS22 existing scenarios, including saving/recovery/Reset/Ascend, progress,
  caps, accessibility/contrast and real reload/live completion. [Receipt](regression.json).
- `node tests/behavioral/lab-timed-boosts.cjs index.html`: PASS1480; [core.json](core.json).
- Actual Node8.3.0/V8 6.0 Lab check: PASS580, both complete scripts parsed;
  [v8.json](v8.json). This is not physical Android/WebView acceptance.
- Full self-review: changes limited to the requested presentation; no test
  tolerance or gate lowered. Prior timed-price evidence remains historical at
  its recorded source hash, not rerun evidence for this follow-up.

Next: local checkpoint, refresh mobile/www from current source/fonts/branding,
verify loaded playable4174 source/assets and show the new idle card. No remote,
APK or signing. Combined/release/device/TalkBack acceptance remains OPEN.
