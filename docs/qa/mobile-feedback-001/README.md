# Mobile feedback evidence

Integrated product SHA-256: b03770981e9fd0a4cc53d37021761cf93f148a0aae82874423780f8015f9efa2.
Tested head 952cc951, CI checkout 081fefdd and integrated main c4d5e060
have identical trees. [PR #9](https://github.com/xariib/Lumenfall/pull/9).

- validation.json: six required final-head workflows PASS, 189 main scenarios
  and the isolated offline case PASS, original gates and negative controls retained.
- startup-browser.json: final-head Chrome 155 native input, 30 profiles across
  320/390/430 px, both motion modes, fresh/return/cooldown/failure/interrupted boot.
- boot.png: inspected first paint before the game script executes (390 px).
- compact-cards.json: 18 final-head width/text/motion profiles and Tide heights.
- core.json: contribution/support negative controls, progression and Farm guidance.
- preservation.json: 29 protected declarations byte-identical to baseline 7df7f5c.
- startup-order.json: actual return-flow functions, both completion orders, errors
  and stale generation; baseline fails intro-first; reviewed source fails 500 ms resume.
- preceding-failures.json: preceding full run 187 PASS/2 FAIL. Reset observer
  ordering was corrected; the unchanged VFX gate passed on the final run. The
  known phase-sensitive overflow in RIFT_VFX_OVERFLOW_001 is not claimed fixed.
- android-attempt-1.json: failed integrated native recap dismissal check; no
  acceptance claim from that attempt. Attempt 2 did not show that recap and
  therefore does not prove its dismissal branch fixed.

- android-validation.json and android-emulator-upgrade.json: integrated Android
  #32 attempt 2 PASS, exact signed 0.2.32 APK, retained saves/paid work/entitlements,
  eight Wisp cards/native purchase and full Farm hint navigation.
- android-assets.json, android-identity.txt and android-apk-sha256.txt: exact
  packaged production source/assets, established package/certificate/origin.
- android-installed-wisp-card.png and android-installed-midgame-farm.png: actual
  installed WebView captures; the Wisp capture was visually inspected.
- android-build.jpg: verified successful GitHub build page.

[Task](../../tasks/MOBILE_FEEDBACK_001.md) records integration and Android status.
Modern Chromium does not establish installed WebView or physical-phone acceptance.
Physical phone, exact WebView60, TalkBack and human visual/startup pacing remain open.
