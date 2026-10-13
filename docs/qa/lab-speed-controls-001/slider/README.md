# Lab slider and card hierarchy — current local evidence

13 October 2026. Parent6a694f4, local/full-debug. Node24.19.0 / Chrome151.0.7922.34.
Source SHA-256: `ac190cdf4632c12e2c0fda23a406078f1a0ae6cec7b35bad88ab39d13d4a9188`.
Self-review only. This supersedes the uncommitted dropdown receipts in ../polish.

User asked for fewer boxes, no Paid speed line, a1.5x–8x slider with speed queue
ON/OFF, and a card hierarchy matching the marked name/badge reference. Running/
Next completion are removed; Earned/On completion become Current/Next. The
reference is user-reference.jpg; actual playable result is preview.png. The
live page uses the user's ongoing save, without test hooks, reset or fabricated
state. First checkpoint and initial hidden-panel reproduction remain in ../.

Implementation keeps Lab Queue in the header, with a prominent name and level
badge underneath. The native slider has exactly the existing eight tiers, a
visible multiplier/full Mote quote, adjacent speed queue toggle and unboxed
Buy now action. Actual paid speed remains in the completion progress bar. Shared
footer explains immediate/current-level and queued/per-level/offline purchases.
Drag/held-key previews never change saved targets or pay intermediate tiers;
release saves final target. Focused native input survives renders/reordering;
render-induced blur cannot commit a pending preview. OFF retains paid speed.
Original prices/discounts, guarded purchase function, scheduler, work, levels,
save schema and offline mechanics are unchanged.

## Final source checks

Set LUMENFALL_QA_CDP_CHROME to the installed executable recorded in native.txt
or expansion-ui/receipt.json. Browser runs use isolated profiles and approved
local outside-sandbox execution because sandbox Chrome previously exits before
readiness. Main runner used LUMENFALL_QA_DOM_TRANSPORT=pipe for accessibility/R3;
this executes existing assertions, not a weakened acceptance gate.

- `node tests/behavioral/lab-speed-controls.cjs index.html`:1118 assertions/12
  profiles PASS (focused.json).320/390/430px,100/200% text, both motion modes;
  original tiers/prices, one-short/exact funds, Catalysis, rich duplicate input,
  queue independence/target changes, original work, actual save/load, disabled
  idle/covered actions, touch drag and Buy, held native arrows/Home, Enter/Space,
  attached input/focus/scroll through refresh, purchase, completion and begin.
  Name/level hierarchy and Current/Next/no repeated status labels checked.
  DOM-only previews, final-only purchase and auto-payment of the saved target
  during a drag/reorder have direct coverage. lab-*.png show final profiles.
- Same command with `--mutate-selection` / `--mutate-select`: expected FAIL on
  accidental direct selection payment / detached preview (selection-control.json,
  slider-control.json). Mutated hashes differ from production; neither is a
  startup error. Both errors name the relevant behavioral assertion.
- `node tests/behavioral/lab-expansion-ui.cjs index.html docs/qa/lab-speed-controls-001/slider/expansion-ui`:
  6588 assertions/12 profiles PASS, all20 cards/14 expansion tracks, discounts,
  caps,7 paid slots and actual reload (expansion-ui.txt, receipt and screenshots).
- `node tests/behavioral/lab-expansion.cjs index.html`:2465 PASS (lab-core.json).
- `node tests/behavioral/lab-motes-offline.cjs`: yielding/shared12h limit,
  failure/retry/recovery and exact single60-Mote debit PASS (offline.json).
- `node tests/behavioral/run.cjs --web-root mobile/www --scenario lab-ui-regression`:
  19 existing cases PASS,18949 counted assertions plus persistence proofs
  (existing-ui.txt). Contracts, chronology, conservation, saves/backup/recovery/
  reset, Inquiry, durations, effects, hierarchy/order and navigation preserved.
- Same runner with `lab-motes-native` / `lab-motes-reduced-motion`: each6
  mobile/enlarged-text profiles PASS (native.txt/reduced.txt and native/ views).
  Native Begin/touch/tab order, slider AX, Space queue, exact60 live purchase,
  actual timer progression at zero money and save/recovery/focus proofs retained.
- Same runner with `p1-05-control-regressions`: PASS (accessibility.txt).
  State/focus/disabled-repeat/contrast checks preserved. Badge contrast7.51:1,
  selected speed-queue contrast10.10:1. Buy is an action without aria-pressed;
  its accessible name announces selected multiplier and price. Same runner with
  `r3-destinations` / `r3-save-reload`: PASS (r3.txt/r3-reload.txt).
- Real task context and `node scripts/ci/validate_source.cjs`: PASS
  (context.txt/source-validation.txt). Complete diff reviewed for scope and
  removals; gameplay/price/save assertions retained, no tests/gates weakened.

## Corrections and local delivery

An intermediate focused check caught purchase scroll shifting when focus moved
from Buy to slider; the anchor now uses the same Study's pre-purchase slider
position. Native unchanged-tier thumb taps initially left focus on the prior
queue button; explicit focus at gesture start fixes attachment through ticks.
Automatic speed purchase during drag can reorder cards; render-blur suppression
and causal coverage prevent intermediate target commits. Obsolete select popup
Escape/combobox/option expectations were adapted to range input and release.
No known unresolved task-introduced scoped failure remains on the final source.

mobile/www refreshed from current source/fonts/branding; all15 files match both
staging and HTTP (preview-assets.json). Playable preview open on Lab at
http://127.0.0.1:4174/index.html. The complete loaded script matches the production
script (loaded-preview.json). Screenshots were visually reviewed for names,
badges, grouped controls, Current/Next, touch targets and enlarged text.

Local candidate only. Final combined suite/required CI, inherited Prism deadline/
standard Windows dump-DOM/POSIX tooling and Android/device/exact WebView60/
TalkBack acceptance remain pending. Modern Chrome does not prove Android
acceptance. No GitHub/push, APK build/release, signing change or archive action.
Next: user reviews preview, then RIFT_HINT_LAYOUT_001 from the saved checkpoint.
