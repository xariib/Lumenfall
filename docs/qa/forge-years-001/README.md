# Forge years — baseline investigation

Source: main `b075cfba`, product SHA256
`3f9123285f3377740e3017246fa7b0a5f8cbad60cabc9e477be9c9aefdeffa80`.
Node24.22.1, Windows. No gameplay edits, Android build or release.

Reproduce from repository root:

```powershell
node scripts/codex/check_context.cjs --task docs/tasks/FORGE_YEARS_001.md
node tests/behavioral/forge-workshop-pacing.cjs index.html --negative
node tests/behavioral/endless-forge-lab-pacing.cjs index.html --negative
node scripts/qa/forge-years-audit.cjs index.html
```

Saved unchanged-source baseline: workshop480 assertions/four controls PASS;
endless Forge/Lab568 assertions/four controls PASS. Context/links/startup PASS.
`baseline-affordability.json.gz` contains the new audit's complete JSON stdout.

The active catalogue has20 short finite tracks (caps2–20), Masterwork(cap500)
and three endless Tempering tracks. In each synthetic mature fixed-depth
fixture, a shared14-day wallet buys all20 short tracks. This diagnostic grants
record10000 and mature economy/damage beforehand; it does not show a fresh
account reaches those records or earns these amounts in its first14 days.

The opposite extreme also needs attention if the user wants a finite finish:
all500 Masterwork ranks quote about4.20e71 Lumen and1.05e70 Shards, with existing
record gates. Currency-only completion is vastly longer than years at these
particular fixed incomes. Endless tracks have no completion point. Neither
fact establishes satisfying long-term progression for the full catalogue.

| Fixed farm Rift | Actual kills in60s | Battle / Arcane / Harvest ranks purchasable with separate14-day wallets |
| --- | ---: | --- |
|32|150|100 /91 /86|
|101|150|175 /166 /161|
|501|140|263 /254 /249|
|1001|120|289 /280 /275|
|2501|1|280 /270 /265|

Each wallet above starts ownership at zero; paid300-rank benefits are granted
to the earning fixture first. Rift2501's sparse one-minute sample is particularly
unsuitable for a sustained-income claim. Every forecast extrapolates24 productive
hours/day without reinvestment or changing depths. This is affordability evidence,
not a simulation of a multi-year player's account or proof of human pacing.

The baseline investigation is superseded by the user's finite-completion
clarification below. Existing tests alone did not establish a years target.

## Finite candidate after user clarification

Current product SHA256: `af692d7f75c9681a2f3f7118b1fa6cdc0b42311e1c780bb2a53138b45d2a168d`.
The user confirmed all Forge paths must be finite, with possible2–3year completion
and useful Lab growth through walls. [Decision](../../decisions/2026-11-17-finite-forge.md).

Finite core 385 assertions/four causal controls PASS: rational independent tail
quotes, real final manual/Max/queued payments, individual resource shortages,
write rollback, cap/above-cap ownership/effects, cold load, recovery, backup
and Ascend. Completed damage/critical Labs increase measured combat7.5x;
resource Labs100 increase measured kill payouts9x versus those Labs at0.
At actual boss Rift490 with all Forge capped, the no-damage-Lab fixture cannot
beat regeneration and kills0enemies in120s. Completed damage/critical Labs turn
that same fixture into sustained damage and17kills, ending Rift507, identically
live and offline. The first new wall-test fixture omitted capped foundations;
it correctly failed before the fixture was corrected to represent full Forge.
Original Forge9404/25controls, workshop480/four, earned Lab access538/four,
permanent progression4225, slot contract55, whole-game audit318/three and
early Wisp2400/five controls PASS. These are self-review/automated checks.

`reinvestment.json` records four real-purchase forecast cases. Reference Rift1001
finishes on day 994; all cases remain incomplete at14days. Economy Labs100
instead of500 and fixed Rift501 instead of1001 remain incomplete after1200days.
The growing farm501→1001/economy Labs100→500 case is23/24 complete at1200days.
Only the stated mature reference is calibrated to2–3productive years. No actual
fresh-account completion guarantee or global minimum is claimed.

Reproduce added checks:

```powershell
node tests/behavioral/finite-forge-years.cjs index.html --negative
node scripts/qa/finite-forge-reinvestment.cjs index.html --check
```

First local UI attempt used a nonexistent system Chrome path and failed before
any profile; retry uses verified installed test Chrome. An accidental Node24
invocation of the legacy-only Forge runner correctly rejected the runtime;
Actual Node8.3/V8 6.0 now passes 2,524 checks, including the new finite paths'
tail quotes, real final purchases/exact debits and retained historical levels.
Product
checks above were not altered for these setup errors. CI/mobile/Android results
remain pending; task remains open.

The first browser retry reached266checks then hit the unchanged CDP evaluation
deadline with a teardown timeout. Retained `mobile-rerun` receipt; cause unproven.
No existing deadline or assertion was relaxed. GitHub rejected the initial push containing a
workflow-file edit because its credential lacks `workflow` scope. That unpublished
commit was amended to keep workflows unchanged and run the new finite/pacing
checks through the already required `forge-workshop-pacing.cjs` entrypoint.

Subsequent mobile findings and dispositions:

- The independent cap-effect table still expected the former level300/4x
  endpoint; corrected to the explicit375/325/315 caps and4.75/4.25/4.15x effects.
- Reload attempted to use the page before its new navigation completed. The
  harness now requires its own `Page.loadEventFired`, retaining the existing
  10-second initialization and30-second CDP deadlines. A minimal native probe
  loaded both315 and historical10000 successfully; its separate browser teardown
  timed out, so that probe is not an overall passing acceptance result.
- The new final-card test originally demanded the entire shortened card stay
  visible at2x text. That conflicts with the existing stationary-purchase rule.
  It now checks exact scroll preservation (clamped only to the new document's
  physically available range), same-upgrade keyboard focus and full maxed/bonus
  semantics. Existing stationary-purchase assertions and controls stay intact.
- Initial forecast tail anchors retained one extra old-growth step at the
  boundary. Fixed so the first future rank immediately uses0.2%/2.5% growth;
  an independent boundary-ratio assertion covers all four paths. This replaces
  the preliminary1063-day result with994days. First300/50 prices remain unchanged.
- Forecast initial enemy HP now uses the actual Rift HP, instead of carrying the
  seed's partial enemy. The frozen baseline audit remains historical; especially
  its Rift2501 single kill is not evidence of sustainable income.

First exact-head CI at532cbaa5: Forge failed the stale cap-effect expectation;
pre-merge failed the32KiB startup budget (new shared rule plus an already large
older task). Superseded status entries were preserved verbatim in
[dated history](../../PROJECT_STATE_2026-11-17_HISTORY.md), making the required
older task29122bytes. Tree's Prism contract browser timed out after25seconds
with no DOM output or completed assertions; its full relevant raw payload is
retained in `first-tree-browser-failure.json.gz`. Cause unproven. No assertion,
runtime tolerance, gate or deadline was weakened. New exact-head CI is required.

Final local mobile: PASS 32,484 assertions across all12 width/text/motion profiles,
including all old controls and final finite-rank Enter purchases, exact wallets,
maxed bonus-only cards, retained above-cap effects, actual reload, no runtime
errors and clean browser exit. Full `mobile-receipt.json.gz` and two representative
PNGs retain exact-source evidence. Screenshots visually self-reviewed: native
gold maxed cards, readable bonuses at1x/2x, shortage prices red; keyboard focus
indicator retained. This is modern Chrome acceptance, not physical WebView60 DOM.

Final local aggregate `local-checks.json.gz` records source/runtime-bound results;
385 finite/four controls, original Forge9404/25 controls, workshop480/four plus
its finite/forecast subchecks, Lab access538/four, whole-game318/three,
permanent4225, slot55, early Wisp2400/five and actual V8 6.0 2524 PASS.
Self-review found no unintended gameplay, save, asset, native or workflow change.
The status history move retains the removed paragraphs verbatim. Signed build,
integrated CI and human/device acceptance remain pending.

## Required CI transport investigation

At head34de29ce, seven required workflows PASS, including Forge, Tree, Lab,
Comet, Wisp, permanent progression and shared UI. The isolated offline job also
PASS. Full pre-merge attempts1/2 both stopped at Lab boost Queue's first320px/
200% reduced-motion touch after four passing profiles:15-second CDP input
deadline, no completed functional assertion. Both full logs are retained in
`premerge-first-attempt.log.gz` and `premerge-second-attempt.log.gz`.

The unchanged standalone Lab boost suite passes locally:993checks/18profiles.
A narrowly scoped native-input harness correction now requires a surface
screenshot after the existing animation-frame wait, checks fresh hit-testing,
visibility and44px size, then sends the original touchStart/touchEnd. It retains
all original assertions, gestures, viewport cases, mutation and15-second protocol
deadline. The old animation-frame promise alone does not establish that the
compositor has presented a resized surface. Actual Chromium/platform cause
remains unproven until the Linux gate passes; no gameplay fix is inferred.

With the extra surface/hit checks, standalone positive PASS1083/18profiles;
the original next-lock mutation still fails its intended next3x functional
assertion. Pre-touch opening screenshots and gesture phase diagnostics are saved
when evidence is requested. Original receipts are retained in
`lab-boost-transport-investigation.json.gz`. Product SHA256 is unchanged.
PR60/61 are separate active work; PR61 does not edit this Lab gesture helper.

## Independent offline reference binding

Head44d07b87 passed the repaired Lab native-input step and all seven separate
required workflows. Full pre-merge then correctly rejected the old source hash
in `offline-swift-current-golden.json`. The binding update was initially missed;
the gate and its failure are retained (`premerge-binding-attempt.log.gz`).

The presentation-only replay helper initially rejected local byte hashes, so
the new feature helper compares the complete candidate state directly against
the immutable released source (`b075cfba`, SHA2563f912328…). It executes all four
eight-hour windows with independent one-second calls in both worlds, validates
the previously accepted kill/Ascend/Prism totals, and requires every saved field
and serialized endpoint hash to match exactly. All230,400calls PASS. The local
released-source hashes differ from the older stored runtime's hashes as well;
this feature does not change them. Exact platform cause was not established.

Only after that proof, the helper updates `sourceSha256`; every accepted phase,
count and endpoint hash in the existing golden file remains byte-for-byte
unchanged. No expected result was regenerated from a bulk transaction. Pinned
released source is stored separately as a gzip test fixture, never over product.
Reproduce: `node scripts/qa/finite-forge-reference.cjs index.html`.
`independent-paired-replay.json` retains exact hashes and runtime. This is a
preservation replay for the supplied legacy fixture, not a pacing playthrough.
The corrected binding requires a fresh exact-head CI run before integration.

## Isolated native viewport profiles

Atb87da914 all seven separate workflows PASS again. Full pre-merge repeats the
same320px/200% reduced-motion stall after four completed profiles, this time in
`Page.captureScreenshot` before native input. The surface-frame attempt did not
fully resolve the issue. Full log: `premerge-surface-attempt.log.gz`. The exact
Chromium cause remains unproven; no gameplay regression is inferred from it.

Boost and preset cases now use a fresh browser context/page for each existing
viewport/text/motion combination. The requested text size is set before initial
layout; every page still executes the complete production application, real
native gestures, paid-receipt checks, save/load, modal/keyboard/focus behavior,
44px/fit/affordability assertions and original causal control. All original cases
remain; they already reset their entire game fixture between profiles. Runtime
errors are checked before each context is closed and after the final case. The
same initialization/15-second protocol deadlines remain. Other Lab test modes
keep their existing page flow. Context lifecycle uses the documented
[Chrome DevTools Target API](https://chromedevtools.github.io/devtools-protocol/tot/Target/).

Local positive PASS1191checks, all18boost and18preset profiles, clean teardown;
the original next-lock mutation still fails at its intended next3x assertion.
`lab-boost-isolated-results.json.gz` retains both outcomes. These additional108
checks cover each fresh page's readiness, requested text size and runtime errors.
Product HTML and existing accepted offline outcomes are unchanged. New Linux CI
is required; integration and Android release remain pending.

## Tested integration

All eight required workflows PASS at2bdf4f03, including every original native
Lab profile, all190main behavioral scenarios and1isolated offline scenario.
The separate Lab workflow initially failed at Browser.getVersion with zero
assertions; its unchanged failed-job retry passes. Original startup log is
retained in `lab-startup-attempt.log.gz`. `pr-runs.json`, `pr-jobs.json` and
compressed full pre-merge job logs retain the exact-head outcomes and coverage.

PR59 merged as0adb60eb36a3be15ce152d6ffe416d5996b039c7. Both complete Git trees
arecf13935c16dd2dfa9f870d64777aed3304391978. Main was rechecked atb075cfba
immediately before integration; no review submissions/threads were present.
This is self-review plus automated validation, not independent review.
Nine exact integrated manual workflows are running. APK/native/public delivery
and unobserved human/device acceptance remain pending.

Integrated Tree run44089999690 attempt1 fails its positive Prism browser case:
Chrome25-second wall deadline, empty stdout, qa_count0 and no completed assertion.
All six causal cases completed and rejected their intended defects. Full job log
is `integrated-tree-first.log.gz`; artifact14330963960 SHA256
`e14bdccad493b024e46d5cf630ccdc5a8e0539e6f271564b72fe61c7763aae17`
was independently hash/ZIP-CRC checked. Its original text evidence is retained in
`integrated-tree-first-raw.json.gz`. Cause remains unproven. Failed job rerun
requested unchanged; no source, timeout or acceptance change. Other workflows
continue. The final release requires every exact integrated gate to pass.

Tree attempt2 PASS unchanged, including the formerly incomplete positive browser
case, native mobile matrix and actual V8 6.0. Eight exact integrated workflows
PASS; the main workflow has passed every focused step and is executing the full
190scenario suite. Its isolated offline scenario PASS. Main remains0adb60eb.

All nine integrated workflows PASS at0adb60eb. Full main log134062191935 proves
190/191cases and all190PASS; isolated log134062192501 proves1/191 and1PASS.
Both full logs are retained as gzip, with `integrated-jobs.json` and final
`integrated-runs.json`. Main was rechecked unchanged before signed Android
publishing run44099434281 was dispatched (run135). Native/public delivery pending.
