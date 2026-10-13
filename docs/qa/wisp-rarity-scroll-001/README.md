# Wisp rarity scroll evidence

13 October 2026. Source SHA-256
`41a2b753db052ea22c8be3ade5002251399a188014cb5cc6c9d42a3361404b83`.
Node24.19.0; Chrome151.0.7922.34. Automated checks and local self-review.

[Baseline](baseline.json) on accepted `86f5779` reproduces a touch purchase:
main scroll1975 →704 and focus Stone →Ember. The generic disabled-button fallback
chose another Wisp and viewport correction followed that control.

The fix captures the rarity control/card context, bypasses that generic fallback
and restores exact main scroll. Focus returns to the same enabled rarity button
or the same card's progression heading when unavailable/capped. A DOM-only marker
retains this context through subsequent rendering; affordability refreshes handle
currency loss/recovery. Touch handlers explicitly establish purchase focus. Same-card disabled pointer
activation preserves the fallback focus without enabling a purchase.
No purchase formula, save schema, balance, reward or paid-value logic changed.

| Command from repository root | Result / evidence |
| --- | --- |
| `node scripts/codex/check_context.cjs --task docs/tasks/WISP_RARITY_SCROLL_001.md` | PASS links/startup budget |
| `node scripts/ci/validate_source.cjs` | [PASS](source-validation.txt) |
| `node scripts/verify_apk_identity.cjs --self-test` | [PASS](identity.txt); self-test only, no APK built |
| `node tests/behavioral/wisp-rarity-scroll.cjs mobile/www/index.html` | [PASS1573](browser.json),72 cases |
| same test `index.html --mutate-focus` | [Expected failure](focus-control.json), reproduces cross-card jump |
| same test `index.html --mutate-periodic` | [Expected failure](periodic-control.json), rejects lost fallback identity on repeat touch after rendering |
| `node tests/behavioral/run.cjs --web-root mobile/www --scenario wisp-rarity-scroll` | [PASS](registered.txt), registered in default suite |
| `node tests/behavioral/wisp-contribution-core.cjs index.html --negative --preservation` | [PASS8099](wisp-core.json) |
| `node tests/behavioral/early-wisp-curve-current.cjs index.html --negative` | [PASS2798](curve.json) |
| `node tests/behavioral/support-recast-current.cjs index.html --negative` | [PASS1594](support.json) |
| `node tests/behavioral/lab-affordable-alert.cjs mobile/www/index.html` | [PASS166](lab-alert.json), previous fix retained |
| `node tests/behavioral/ui-attention-quest.cjs mobile/www/index.html` | [PASS1081](attention-quest.json),12 profiles |
| `node docs/qa/lab-affordable-alert-001/run-existing.cjs mobile/www/index.html wisp-formula-contract` | [PASS](wisp-formula.json), unchanged formulas/effects |
| same saved adapter `nav-workshop-contract` | [PASS443](navigation.json) |
| same saved adapter `r3-save-reload` | [PASS](save-reload.json), actual reload and749 completion ticks |
| exact live source/fonts/branding HTTP comparison | [PASS](preview.json) |

Focused tests use actual production DOM and JS with automatic interval callbacks
paused for controlled states. Native CDP touch/Enter cover320/390/430 widths,
normal/doubled text, normal/reduced motion, affordable/unaffordable following
purchase, reaching Mythic cap, repeated disabled touch/Enter, repeated affordable
touch/Enter, currency loss during refresh and three subsequent full/affordability
renders. Exact original Stone costs and complete state deltas (including the
existing40-Comet Mythic achievement and save timestamp) are checked. Save/load
retains purchased rarity and exact wallets; existing suite also performs real
page reload. Fresh isolated test profiles never touch the user's preview saves.

Set `LUMENFALL_QA_CDP_CHROME` to the installed sibling
`work/browsers/chromium-1234/chrome-win64/chrome.exe`. Sandbox browser/loopback
access required successful escalation. All isolated profiles/stages cleaned up.
The initial registered driver used uppercase status despite passing assertions;
[initial receipt](registered-initial.txt) records rejection by the existing runner.
Driver output now uses the required lowercase status; no runner acceptance changed.
The saved CDP adapter retains existing assertion modules and25s deadline; prior
Windows dump-DOM timeout remains a transport limitation. No assertion/CI gate
was weakened. Full-suite, remote CI, unresolved Prism-contract deadline and
Android/device/WebView60/TalkBack acceptance remain pending. No independent
review, APK release, signing or remote integration is claimed.

Current root source/fonts/branding copied to ignored `mobile/www`; live preview
is http://127.0.0.1:4174/index.html. The app accepted a queued browser-panel open.
Next: user reviews this local checkpoint; task3 FORMATION_COLLAPSE_001 can then
start from this checkpoint. Final device/release acceptance stays open.
