> SUPERSEDED: these receipts verify the uncommitted dropdown candidate only.
> The later user slider/name/badge requirements and current acceptance are in
> [slider/README.md](../slider/README.md).

# Lab speed — corrected two-control layout

13 October 2026. Baseline clean local/full-debug6a694f4/source639b5426.
Current source SHA-256: `740239a65d0df0cd3272a6a091eefdea9d6a6e5a2776ce7868e2d03e8199cff9`. Node24.19.0, Chrome151.0.7922.34.

User feedback (user-before.png): appearance could improve; too many boxes;
keep Lab Queue and one Speed Queue choice; remove Paid speed text, with queue
status shown only in the box. An uncommitted four-control visual refinement was
superseded by these corrections. Current screenshot: preview-card.png.

Only two visible controls remain: Lab Queue and the native Speed Queue selector.
It shows OFF or ON/tier/price. The menu distinguishes automatic queue targets
(Motes per level, also offline) from immediate Buy now choices (this level).
OFF retains paid work and target preference. Both use the same existing prices/
discounts/transactions. Choosing a queue tier enables it without a direct debit
in the change handler; the unchanged scheduler spends when eligible. Keyboard
navigation through immediate choices previews; Enter commits, Escape cancels.
Pointer choice commits once through the unchanged guarded transaction.
No per-card Paid speed/status explanation. Actual speed remains in the existing
progress bar; common explanation is in the Lab footer and accessible description.

## Final-source verification

Set LUMENFALL_QA_CDP_CHROME to the executable recorded in browser.json.
Browser runs used approved local outside-sandbox Chromium/loopback execution.

- `node tests/behavioral/lab-speed-controls.cjs mobile/www/index.html`:1046
  assertions/12 profiles PASS (browser.json, screenshots/). 320/390/430px,100/200%
  text, both motion modes. Exactly two controls, no repeated Paid speed text,
  OFF/ON/tier/cost states; all8 original prices; one-short/exact funds; disabled
  idle/capped/covered choices; unchanged work; rich duplicate input; queue and
  immediate purchases; OFF preserving target and speed; actual save/load;
  native arrow/Home/End/Enter/Escape and opened touch popup; keyboard navigation
  cannot charge, Enter commits once; attached selector/focus/scroll through
  refresh/purchase/completion; current Catalysis prices in both option groups.
- Same command with `--mutate-selection`: expected FAIL on affordable queued
  intent paying inside change handler. `--mutate-select`: expected FAIL on
  native select attachment (selection-control.json/select-control.json).
  Both have different source hashes and normal teardown. A first draft lacked
  the affordable selection assertion; that gap was fixed and the control now
  fails for the intended reason. No positive checks/gates were weakened.
- `node tests/behavioral/run.cjs --web-root mobile/www --scenario lab-ui-regression`:
  19 existing Lab/Inquiry/duration/identity/navigation/persistence cases PASS
  (existing-ui.txt). Obsolete button/disclosure/paid-state expectations are
  replaced by native menu and queue-intent assertions, keeping purchase/value/
  save/progress/contrast/completion protection. Disabled paid-option bypass
  attempts leave full state, saves and lifecycle events unchanged.
- Same runner with `lab-motes-native` / `lab-motes-reduced-motion`: each6
  profiles PASS (native.txt/reduced.txt), including real live timers, exact
  automatic payment and primary/recovery save, touch/menu, OFF and lower targets.
- `node tests/behavioral/lab-expansion-ui.cjs index.html docs/qa/lab-speed-controls-001/polish/expansion-ui`:
  6588 assertions/12 profiles PASS; all expansion prices/work/effects, discount,
  native priced purchase, seven slots, actual reload (expansion-ui.txt/receipt).
- Lab core2465 and offline transaction/yield/retry/recovery/shared12h cap PASS
  (core.json/offline.json); syntax/context/diff checks PASS.

Source/fonts/branding refreshed in mobile/www; all15 source and HTTP files byte
verified, loaded complete game script matches (preview-assets.json /
loaded-preview.json). Actual playable preview is open on Lab at
http://127.0.0.1:4174/index.html; its saved game is not replaced with test fixtures.

Self-review only. No known unresolved task-introduced scoped failure remains.
Inherited full/combined CI, Prism/Windows transport issues and Android/device/
exact WebView60/TalkBack acceptance remain pending. No remote, APK/signing or
archive work. Next: user reviews corrected preview, then RIFT_HINT_LAYOUT_001.
