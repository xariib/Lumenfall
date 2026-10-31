# Lab Speed Up design evidence

Integrated [PR32](https://github.com/xariib/Lumenfall/pull/32), b7371ced6283b97f58f89ed1accff3dcc383f5ee.
Product SHA256c1c2e46bc9cf2c24b12cb3010b388fbda72aabfd20ddf6d915bd00f5d85b791b; accepted Tap/Auto Ascend retained.

Current qualifying evidence:

- speed-up.png: actual390px production dialog,3x/24h selected.
- ci.json / ci-final.log.gz: seven workflows/nine jobs on8e4ec15e PASS;
  190 main +1 isolated offline scenarios and runtime smoke PASS.
- presets-ui-current.json:668/18profiles; caps-ui.json:552/12profiles.
- replay-current-main.json: four full endpoints equal accepted main3f74661b.
- readiness-controls.cjs/json: narrow retry, original deadline, immediate
  game/browser errors and original-defect detection.
- context-gates.json: all31 startup checks under unchanged32KiB budget.
- final-android-identity.txt, final-apk-assets.json, final-emulator-upgrade.json:
  signed0.2.68/code1000068, build41143127589 attempt2,15 matching assets,
  installed upgrade/save/UID/paid work/entitlements/native navigation PASS.
- delivery.json: integration/source/CI/APK qualification and limits.

Historical receipts retain exact source identity. presets-ui.json, timed-ui.json
(1182/12), native-ui.json (1212 Lab checks/6profiles), core.json and
independent-replay.json qualify original017fb859. Baseline/slots/permanent,
earlier replay/tap and original APK receipts are older candidates. Use current/
final files above for delivery. Preset/next-lock defect receipts retain failures.

Intermediate cap-navigation and startup-budget failures are retained; corrected
transport and compact status pass final CI. Android attempt1 missed back-one
(25 vs24); unchanged attempt2 PASS. Attempt1 JSON/calibration/log/logcat retained.
No claim all attempts passed. Self-review/automation only; physical phone,
exactWebView60, TalkBack and human design acceptance open. No release/archive.
