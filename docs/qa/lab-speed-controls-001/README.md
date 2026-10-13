# Lab speed controls — local evidence

13 October 2026. Baseline clean local/full-debug678ccd7; baseline source0bf0505f.
Final source SHA-256: `639b5426080744f43b3e3fb614bf3b40d253cb0db1a5b6cae04c45cb63f066b3`.
Node24.19.0; Chrome151.0.7922.34. Self-review only.

The browser baseline reproduces hidden speed/queue controls (baseline.json).
Original core2465 and offline checks passed before edits. The final source changes
presentation and interaction only: inline Study Queue/tier-price/Buy now/speed
queue, Paid/Covered labels, native select attachment and same-card focus/scroll.
Selection with queue OFF never spends; ON retains existing automatic behavior,
including current active work and offline. Existing numeric and save functions
remain unchanged. One-time event binding prevents duplicate retained handlers.

## Checks and reproduction

Set LUMENFALL_QA_CDP_CHROME to the installed Chromium executable recorded in
browser.json / expansion-ui/receipt.json. Windows sandbox blocks initial browser
startup; browser runs below used approved outside-sandbox local execution.

- `node scripts/codex/check_context.cjs --task docs/tasks/LAB_SPEED_CONTROLS_001.md`
  and `node scripts/ci/validate_source.cjs`: PASS (context.txt/source-validation.txt).
- `node tests/behavioral/lab-speed-controls.cjs mobile/www/index.html`:890
  assertions/12 profiles PASS (browser.json); 320/390/430px,100/200% text, both
  motion modes; original8 tiers and full prices, one-short/exact funds, discounted
  price, repeated rich-wallet input, unchanged work, ON/OFF/target changes,
  keyboard Enter/Space/arrows and touch, native select attachment, focus/scroll,
  actual save/load, beginning and completion. screenshots/ holds final views.
- Same command with `--mutate-selection` / `--mutate-select`: expected FAIL
  on selection payment / native attachment; distinct source hashes and normal
  teardown (selection-control.json/select-control.json).
- `node tests/behavioral/run.cjs --web-root mobile/www --scenario lab-speed-controls`:
  registered scenario PASS (registered.txt).
- `node tests/behavioral/lab-expansion-ui.cjs index.html docs/qa/lab-speed-controls-001/expansion-ui`:
  6588 assertions/12 profiles PASS; all20 cards,14 expansion tracks, prices,
  discounts, native inputs,7 slots, actual reload (expansion-ui.txt and receipt).
- `node tests/behavioral/lab-expansion.cjs index.html`:2465 PASS (lab-core.json).
- `node tests/behavioral/lab-motes-offline.cjs`: yielding/retry/failure recovery,
  exact single60-Mote payment and shared12h cap PASS (offline.json).
- `node tests/behavioral/run.cjs --web-root mobile/www --scenario lab-ui-regression`:
  19 existing cases PASS,18949 counted assertions plus persistence proofs
  (existing-ui.txt): Lab numerical/chronology/conservation/save/backup/recovery/
  reset, Inquiry, durations, upgrade identity, Lab hierarchy and navigation.
- Same runner with `lab-motes-native` and `lab-motes-reduced-motion`: each6
  profiles PASS, including AX/tab order, selector popup, live ticks, queued
  affordability and normal save/recovery (existing-native.txt/existing-reduced.txt).
- Existing Lab alert166, Wisp scroll3229 and Formation529/12 profiles PASS on
  final source (lab-alert.json/wisp-scroll.json/formation.txt and formation/).

Existing disclosure-only expectations were replaced with direct-control checks;
price/work/save/progress/completion assertions retained. The existing CDP driver
now explicitly sets both motion preferences, preserving the assertions instead
of inheriting Windows reduce. Screenshot review caught a retained-select price
refresh issue, fixed and covered before the final source checks.

## Delivery and pending acceptance

mobile/www source/fonts/branding refreshed; all15 files match source and HTTP
(preview-assets.json). Playable preview open on Lab at
http://127.0.0.1:4174/index.html. Its complete loaded game script matches current
source (loaded-preview.json); preview.png shows actual ongoing saved play.
No player reset, test hooks or fabricated state in that playable page.

No known unresolved task-introduced scoped failure. This is local implementation
acceptance; final combined suite/CI, inherited Prism contract/Windows dump-DOM
transport issues, Android/device/exact WebView60/TalkBack remain open. No remote,
APK release, signing changes or archive. Next queue item RIFT_HINT_LAYOUT_001.
