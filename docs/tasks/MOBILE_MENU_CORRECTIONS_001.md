# Mobile menu corrections and remembered scroll positions

Status: delivered Android 0.2.127; physical-phone/WebView60/TalkBack/human acceptance pending.
Owner: current feature chat; no delegation/messages. Keep open; no archive.

User request (14 November 2026, two phone screenshots): remove the theme text
and Formation Bond names from Rift; remove Deeds' milestone dropdown; show
currency names in the top bar; shrink Lab cards with Queue icon left, smaller
progress/timer between controls, Speed Up icon right; remember every menu's
scroll position when leaving and returning, including the bottom.

Baseline: main8747ee60 / Android0.2.119, isolated branch
fix/mobile-menu-corrections-001 in validation-evidence/menu. Root attachments
and all other feature worktrees untouched. Then-open PR54 (currency
names) and PR55 (advancing Deeds bars, approved existing targets/increasing
rewards) incorporated with ancestry; retained their original evidence/requirements.
The combined version has its own verified acceptance below.

Scope: requested presentation/navigation and necessary tests/delivery. Preserve
theme selection/art, Wisp Bond information and mechanics/partner marks, existing
Deed thresholds/unlocks and approved PR55 rewards, Lab paid work/queues/boosts,
all currencies, saves/recovery, chronology, automation and accessibility.
No additional balance/schema/cap or binding-rule change. Scroll memory is UI
session state, separate for Wisps, Forge, Lab, Ascend and Deeds; Rift remains
the deliberately fixed battle viewport. Restore after rendering; clamp naturally
if content shrinks. A remembered bottom stays at bottom when content grows.

Observed baseline defects: explicit main.scrollTop=0 in activateTab; Lab progress
panel reserves two52px rows/min-height96px; visible Rift captions/Bond summary;
completed milestones rendered as native history details. Existing PR54/55 tests
cover their corrections; new acceptance must reflect the user removing history.

Acceptance: 320/390/430px, normal/enlarged text and reduced motion; visible named
currencies; no visible Rift caption/Bond names or Deed milestone disclosure;
one live Deed bar; compact Lab ordering and >=44px action targets; Queue and
Speed Up work; independent menu offsets/bottom restored through repeated visits,
Workshop subsection switches and passive refresh; no save mutation from navigation.
Existing source, focused core/UI, paired save replay, required PR/integrated CI,
signed Android identity/assets, save upgrade/updater/retail and public feed checks.
Self-review only. Physical-phone/WebView60/TalkBack/human acceptance stays open.

References: [workflow](../project/FEATURE_WORKFLOW.md),
[currency](CURRENCY_HUD_001.md), [Deeds](DEEDS_PROGRESSIVE_001.md),
[Lab](LAB_SIMPLE_001.md), [Bonds](RIFT_BOND_DISPLAY_001.md).

## Verified delivery — 15 November 2026

[Android 0.2.127](https://github.com/xariib/Lumenfall/releases/tag/android-1000127) / code1000127, source
[37ca26df](https://github.com/xariib/Lumenfall/commit/37ca26dfaf4668b1950e789ed1d191649ee4b9a2), delivered through merged PR54/55/56.
[Download APK](https://github.com/xariib/Lumenfall/releases/download/android-1000127/Lumenfall.apk). Main was fast-forwarded from8747ee60 to
this exact validated source; final documentation/evidence adds no product changes.
Public build [43714270831](https://github.com/xariib/Lumenfall/actions/runs/43714270831) passed every gate. Package com.lumenfall.app
and established signing identity retained; both save slots, paid Lab work, legacy
credits and actual system-approved updater verified. Retail Android12 user image
has normal enabled controls, no app instrumentation/debugger socket and rejected
private run-as. Screenshots self-reviewed; no independent review claimed.

Product SHA256: f7008f0e1b7d09af02552e0325446a53d5fd40a91639e4ddc64d9410eb973c51.
APK SHA256: d334cfd038d2e9062fc249aa75bddd4de30e06d20de2ea618d1aa791dfb78f23 (5163360 bytes).
Anonymous versioned/latest APK bytes and public metadata/feed verified at2026-11-15T12:42:08.796Z.
[Public receipt](../qa/mobile-menu-corrections-001/android-release/public-verification.json).

All16 exact-source PR/manual workflows and every job PASS. Both full suites
(PR43706290303/manual43706287783) prove190 main scenarios plus1 isolated offline
scenario each. Four complete job logs are retained with hashes in
[CI summary](../qa/mobile-menu-corrections-001/ci-log-summary.json).
Signed candidate0.2.126/43706308245 also passed; it is not the public release.
Actual installed positive-range remembered bottoms: Wisps 5601→5601/5601; Forge 5989→5989/5989; Lab 3340→3340/3340; Ascend 4780→4780/4780; Deeds 5958→5958/5958.
All6 currency names visible and fit; no Rift captions/Deed history. Native fixtures
are synthetic; real Android navigation and actual offsets, not a physical phone.

Focused product checks:740 modern selection/menu,398 legacy viewport/12profiles,
398 actual-touch/12profiles; core415; original clarity417+native99; Lab slots488/18
and Deeds688/18. All4 original native Rift variants pass3profiles/12states each.
Currency visual16profiles, all6 cosmetics, dense/boss layouts, Workshop/navigation
and Formation checks pass. Reset/fallback/entry-settling causal controls catch
their intended defects. Node24.22.1/Chromium157.0.8103.79 locally; CI Node24.19.0.
Four paired8h replay endpoints (115,200 separate1s calls/source) preserve every
full-state field except independently specified approved PR55 +450 Comets/endpoint.
The golden source hash was rebound only after that complete comparison.

## Changed files and retained findings

- index.html
- scripts/ci/android-upgrade.cjs
- scripts/ci/verify_android_release_runtime.cjs
- scripts/lib/android-live-ui.cjs
- scripts/qa/check-mobile-menu-corrections.cjs
- scripts/qa/verify-deeds-reward-replay.cjs
- tests/android/LiveUiSnapshot.java
- tests/behavioral/comet-expansion-numerical.cjs
- tests/behavioral/comet-expansion-v8.cjs
- tests/behavioral/deeds-progressive-ui.cjs
- tests/behavioral/deeds-progressive.cjs
- tests/behavioral/formation-bonds-ui.cjs
- tests/behavioral/lab-simple-ui.cjs
- tests/behavioral/lab-slots-speed-menu-ui.cjs
- tests/behavioral/lab-speed-controls.cjs
- tests/behavioral/layout.js
- tests/behavioral/legacy-automation-deeds-reference.cjs
- tests/behavioral/mobile-menu-corrections-ui.cjs
- tests/behavioral/offline-catchup.cjs
- tests/behavioral/offline-swift-current-golden.json
- tests/behavioral/rift-cosmetics.cjs
- tests/behavioral/rift-status.cjs
- tests/behavioral/rift-status.js
- tests/behavioral/runner.js
- tests/behavioral/upgrade-clarity.js
- tests/behavioral/visual-audit.cjs
- tests/tooling/apk-security.cjs

Full diff self-reviewed for removals/scope; no workflow or native app configuration
change. Original requirements and all historical failures remain in
[QA](../qa/mobile-menu-corrections-001/README.md) and the
[previous checkpoint](../qa/mobile-menu-corrections-001/task-history-before-public-delivery.md.gz).
Old0.2.122 scroll0/0 receipts were explicitly rejected. Positive ranges required
the100vh fallback; remembered bottoms required post-entry restoration canceled
on new input. Stock retail global-idle capture was replaced by the same shell
accessibility bridge reading live controls, with stronger control assertions and
all production-security checks/deadlines preserved. Reduced-motion fixture header
reveal waits for entry before its artificial scroll; native gestures/first Rift
frame/300s and15s deadlines remain. First failures, false diagnostic and unchanged
passing Wisp retries are retained. Initial post-push PR closure assertion saw
GitHub asynchronous lag; all3 actual merges confirmed before public dispatch.
No acceptance gate was waived. Shared status history remains preserved exactly.

## Next action and open acceptance

Software delivery and automated acceptance are verified. Install the public APK
as an update and obtain physical-phone review of all6 requested corrections.
Exact WebView60 DOM, TalkBack and human acceptance remain unverified. Keep this
feature/chat open; do not archive until those required checks are recorded.
No new binding rules. Delivery helpers and original logs/receipts are frozen in QA.

Final documentation checks: affected task links/startup budgets and all39 workflow
task contexts PASS; [saved results](../qa/mobile-menu-corrections-001/final-workflow-context-checks.json).
Complete diff reviewed; documentation/evidence only follows the released source.
