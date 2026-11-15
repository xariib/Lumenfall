# Mobile menu corrections and remembered scroll positions

Status: validating source37ca26df / productf7008f0e; main remains8747ee60.
14/16 workflows and signed0.2.126 candidate passed; full suites active.
Owner: current feature chat; no delegation/messages. No public update yet.

User request (14 November 2026, two phone screenshots): remove the theme text
and Formation Bond names from Rift; remove Deeds' milestone dropdown; show
currency names in the top bar; shrink Lab cards with Queue icon left, smaller
progress/timer between controls, Speed Up icon right; remember every menu's
scroll position when leaving and returning, including the bottom.

Baseline: main8747ee60 / Android0.2.119, isolated branch
fix/mobile-menu-corrections-001 in validation-evidence/menu. Root attachments
and all other feature worktrees untouched. Open overlapping PR54 (currency
names) and PR55 (advancing Deeds bars, approved existing targets/increasing
rewards) incorporated with ancestry; retained their original evidence/requirements.
Their historical status does not prove this combined version passes.

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

## Current continuation — 15 November 2026

Source `37ca26dfaf4668b1950e789ed1d191649ee4b9a2` is published on
fix/mobile-menu-corrections-001, [PR56](https://github.com/xariib/Lumenfall/pull/56).
Local evidence/mobile-menu-corrections-001 may advance with docs only while this
validated ref stays fixed. Main remains8747ee6043bac911420649ae7088398b38a8989a.
Existing PR54 e14f7508 and PR55 f1921bbf remain unchanged/included ancestors.
Android candidate [43706308245](https://github.com/xariib/Lumenfall/actions/runs/43706308245)
and all8 manual +8 PR workflows use37ca26df; only full suites remain active.
No public APK yet.

Product SHA256 remains
`f7008f0e1b7d09af02552e0325446a53d5fd40a91639e4ddc64d9410eb973c51`.
Index changes: named responsive HUD; hidden Rift captions/Bond summary; remove
Deed history; compact accessible Lab icons/timer; per-panel offset/bottom memory.
Includes100vh fallback before100dvh for older WebViews; immediate restoration
repeats on panel animationend and cancels on new input/navigation. Only direct
navigation requests deferred restoration; intentional shortcut/hint targets remain.
Session scroll memory does not change saved game state. Full diff self-reviewed.

Node24.22.1/Chromium157.0.8103.79 local PASS: modern selection/menu740 checks
(18+12profiles), unsupported-dvh398/12 and actual CDP touch398/12; core415;
original clarity417+native99; original Lab slots488/18 and Deeds688/18; currency
visual16profiles; six themes/controls, two Rift native suites, dense/boss five
viewport profiles, Workshop/navigation and Formation12profiles. Final enlarged
Lab screenshot has no title/badge overlap. Reset/fallback/entry-layout causal
controls fail their intended assertions. Context/source/whitespace pass.
Four paired8h replay endpoints (115,200 separate1s calls/source) match complete
state/rewards against released6fd9e44f except independently enumerated approved
PR55 +450 Comets per endpoint; golden hash rebound only after comparison.

All historical failures/receipts remain under
[QA](../qa/mobile-menu-corrections-001/README.md); the full prior task text is
[retained byte-for-byte](../qa/mobile-menu-corrections-001/task-history-before-live-observer.txt).
Key findings, not waivers:
- Earlier test expectations read removed Deed history and ignored the native
  Farm fixture's maxDepthEver30 despite retained earned1000 flags. Expectations
  now verify original earned receipts/pending credit and next30/2500 bar exactly.
- Candidate0.2.122 reported scroll0/0 everywhere; rejected as vacuous. Native
  checks/verifiers now require positive range/offset and correct active panel.
- Source3130e62d's real native Wisps bottom failed. Entry-layout reproduction
  catches it; f700 restoration passes all5 actual native bottoms on313bdd47:
  Wisps5601, Forge5989, Lab3340→3324/new bottom, Ascend4780, Deeds5958.
  Six currency names, both save slots/paid work, actual updater also PASS.
- Native43695984950 attempts1/2 failed final stock UIAutomator idle capture;
  original logs and both37-file artifacts are retained separately. Screenshots
  show combat, but self-review does not replace retail acceptance. Linux Wisp
  touch timeout101checks/16profiles passed an unchanged failed-job retry; cause
  remains unproven. Source313bdd47 had14/16 workflows passed when superseded.

62126af7 changes only tests/docs after the verified product. LiveUiSnapshot.java
builds a shell-only observer outside the APK and uses Android31's same UiAutomation
bridge/XML dumper without demanding globally idle combat. It deletes stale XML,
keeps120s launch deadline and requires both enabled/clickable/on-screen Wisps and
Rift controls. Negative stale/loading/other-package/disabled/clipped fixtures pass.
Retail OS, non-debuggable APK, absent WebView socket/app instrumentation, private
storage rejection and exact installed bytes gates remain. Original game/workflow
bytes unchanged. Actual observer compilation/retail acceptance still pending CI.

The earlier oversized shared state was preserved exactly in
PROJECT_STATE_2026-11-14_HISTORY.md before compacting current status; all task
startup budgets pass without weakening the guard. No new binding rules.

Next: verify62126af7 signed candidate including live retail XML and actual
nonzero scroll ranges; require all16 workflows/jobs and both full190+isolated1
scenario receipts. Preserve first failures before diagnosis/retry. Helpers under
validation-evidence/ are frozen in QA as delivery-helper/verify-candidate/
verify-public-release.cjs.txt. Then readiness, recheck main/PR54/55 overlap,
fast-forward exact source to main, publish signed APK, verify anonymous exact
version/latest bytes/feed, save final evidence/docs on main. No ref advancement
during builds. Physical-phone/WebView60/TalkBack/human acceptance stays open;
no archive until verified. Do not call a local candidate/open PR completion.

62126af7 candidate43698948404 /0.2.125 now passes signing/assets, real upgrade,
both saves/paid work, actual updater and retail launch. Independent downloaded
artifact verification PASS (APKsha d9b1f483f34cdc145e2d1dfe1484a8e45002377e00db30f8233b6217f35d255d).
Live retail XML confirms actual enabled/on-screen Wisps and Rift controls on a
non-debuggable Android12 user image; no app instrumentation/debugger socket.
All5 actual positive menu ranges restore bottom; all6 names fit. Only final full
PR/manual suites and Wisp failed-job retry remain. Original Wisp focus mutation
failed after1 check at setup's300ms layout deadline, before intended assertion;
PR and Windows copies pass, original artifact/log retained, unchanged retry active.
No product/test deadline changes. Next: all16 readiness and full logs, then delivery.

Wisp43698927035 unchanged failed-job retry PASS;14/16 workflows passed.
Only the two full premerge runs remain before readiness/integration/public build.

## Reduced-motion native fixture follow-up

62126af7 full PR43698889007/manual43698909497 both finish with exactly two
failures: rift-status-reduced-motion and rift-status-stacking-reduced-motion.
All other scenarios and isolated offline jobs pass. Full original logs saved.
Unchanged local trace reproduces after15.163s, dense state's Forge navigation:
fixture scrollIntoView reveals the subsection header while entry restoration can
still run, then its native touch misses and locate sees no rendered Forge controls.
Physical user scrolling cancels that restoration on touchstart; this artificial
header reveal does not. Precise inter-event timing is not separately instrumented.

Scoped test-only correction waits for the entered panel's animation/next frames
BEFORE that existing programmatic header reveal. It adds an explicit selected-
subtab/active-panel check; a missing control now reports active menu/offset rather
than a TypeError. First Rift entry-frame measurement, native last-control swipes,
all original assertions and300s scenario/15s command deadlines remain. An initial
new diagnostic wrongly checked a CSS class instead of aria-selected; corrected,
with its failed local receipt retained. Corrected reduced-motion local run passes
all3profiles/12states in101.145s. Three remaining variants are running. Product
f7008f0e unchanged; candidate0.2.125 remains proof of product, not new source CI.
Next: finish these focused variants, commit/push fixture-only correction, repeat
required exact-source workflows/candidate, then integrate/public delivery. No gate
is waived and no public APK yet; original full failures stay historical.

All4 native variants now PASS, each3profiles/12states: normal104.519s, reduced101.145s,
stacked normal104.087s, stacked reduced102.317s. Product remainsf7008f0e. Full diff
self-reviewed; final fixture-only source is ready to publish for exact-source CI.

37ca26df candidate43706308245 /0.2.126 PASS, independently downloaded/verified:
APKsha ec9d65b53224375bb4e90465bf8c374f680e5bdd8f6b2e353e39fb169dfc953f.
All exact assets/identity, both saves/paid work, real updater,5 positive remembered
menu bottoms,6 names and live retail XML/security gates PASS again.14/16 workflows
PASS; both isolated offline jobs PASS. Only PR43706290303/manual43706287783 full
suites remain. Save/verify exact190 main +1 isolated scenario logs for both events
before readiness/integration/publication; no tests, assertions or deadlines waived.
