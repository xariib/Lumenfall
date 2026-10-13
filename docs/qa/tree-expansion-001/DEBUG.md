> Current acceptance, 10 October 2026: PR106 merged at `9f04aca7` after all four final-head workflows, raw audits and nine fresh merged-source checks passed. [Final receipt](https://github.com/karahaNx/Lumenfall/blob/f57a0b9db11ca69257a44ca7b55497896f3829bc/docs/qa/tree-expansion-001/ci-768050d7/README.md). Main/APK remain held; Comet is next.
>
> The debugging record below is historical and retained unchanged.

# Tree expansion — debugging checkpoint

This is an incomplete development candidate in draft PR106, not accepted
integration or a release. [First CI failures and adapter repairs](ci-debug-initial/README.md)
and [second CI browser failures](ci-debug-repair-3c931/README.md) are preserved.
Required final CI remains open. The user authorizes sequential work behind draft PR102 and
explicitly holds main and APK work. [Design](DESIGN.md) freezes all20 active
tracks, prices, unlocks, caps and transition rules.

## Source and preserved baseline

Verified development parent: `2d01049393e3bb45a90d80e07af52ae0484b0ec5`,
the accepted Forge PR105 merge. Main remains
`67373faa531f0bb791c883210ee623320861e380`.
Baseline game SHA256:
`05742431ab6bffefce09d0bebefa754190ed836cc51f4aeeb81e8a9d769419ac`.
Unchanged historical fixture SHA256:
`ab43604db1b5bce8b9990506f989676dfb0009cdcf2e514a8ccee9da166c8753`.
No complete private user save was introduced.

Baseline witnesses in `baseline-purchases/` reproduce failed-primary mutations
in Tree purchases, Wisp purchases and manual Ascend. Both manual and automatic
Empower could also accept a cost11 purchase from Lumen1e30 with represented
debit0. The candidate stages manual transactions and rejects nonrepresentable
paid debits/level increments. A primary success followed by a recovery failure
retains the committed primary endpoint. The existing delayed F26 refund is a
separate ledger event and remains covered.

The final read-only review found two related control-flow defects. Empower's
500ms refresh still used balance>=cost after initial rendering had adopted the
exact purchase plan; it could re-enable an Unavailable button. Shared state
presentation and the recruitment-ready hint had the same assumption. All now
use the authoritative plan. Also, manual-kill Auto-Ascend reported success even
when its newly transactional reset failed; it now propagates the actual result
so normal post-kill checks run after a rollback. The pre-correction game bytes
and finding are preserved in `refresh-defect/`. Actual mobile verification and
a focused failed-Auto-Ascend causal regression are required before acceptance.

Current corrected game SHA256:
`ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3`.
The isolated diagnostic2bce proved that the provisional numeric scroll guard
17d4 moved Frontier's focused button110.9375px, while browser anchoring without
that guard preserved its position within0.0625px. That correction is rejected;
the original exact-numeric-scroll assertion was not a valid viewport oracle.
The same diagnostic exposed a real sixth-Wisp Field visibility failure after
the active/reserve presentation sort. The revised product preserves actual
control viewport positions through Tree and Formation rendering while retaining
the existing Auto-Ascend native-picker guard. The test now retains all geometry
and requires visible, focused, stable controls with narrowly reverted product
calls as causal checks. Diagnosticb7eaca confirms stable Frontier and sixth-Wisp
Field/Bench/re-Field controls, then stops at an impossible Farm top requirement:
the old424px top would require scroll=-14; actual scroll0/top410 is the nearest
physical position. The next test retains this fixture and requires the nearest
feasible bound while keeping in-range and both causal-pair assertions strict.
Diagnosticcd3e915b then completes four320px profiles and both strict causal
pairs, but fails on a CDP readiness race during the fifth profile's reload.
The subsequent isolated diagnostic48c13f2d passes26,600 checks/all12 profiles,
both causal pairs and all60 bounded readiness phases; the exact observed
navigation response is caught only during a read-only initialization probe.
The scoped bridge reload-guard repair passed all four original Prism positive
flows and all five original causal controls in the same isolated browser run;
the production save guard is unchanged. [Original raw diagnostic](ci-debug-repair-3c931/scroll-diagnostic-2bce/README.md).

## Executed checks and failures

The complete required Full38085086718 run on published3c931 is terminal FAILED:
all182 scenarios ran, with199 PASS/13 FAIL across212 rows. Nine scenario IDs
failed, one at all five original layout viewports. All13 failed processes had
exit0, no timeout and no runtime error; their original QA assertions failed.
The22 workflow negative controls, final runtime guard and smoke were skipped.
[Complete raw failure audit](ci-debug-repair-3c931/full/README.md) preserves the
whole stateful log and labels the separately available job-log prefix partial.
Complete-IIFE witnesses identify the old QA manual-Ascend reload flag as their
common cause. The third diagnostic reruns all13 exact original browser attempts
with the scoped bridge correction. It passes10/13 and exposes three downstream
manual Wisp purchase-helper failures under the same synthetic reload guard.
The scoped Formation adapter then passes all13 original attempts in the fourth
diagnostic48c13f2d/run38089706277. The full required suite must still pass again
on the final published PR106 head. Lab and Forge passed on3c931/source4e and
must also rerun after the presentation edit.

All raw stdout/stderr and source/test identities for the first existing-suite
run and its rerun are under [existing-regression/](existing-regression/manifest.json).
Node runtime:24.19.0, V8:13.6.233.17-node.51.

| Candidate | Observed result | Explanation |
| --- | --- | --- |
| `b4343619242620a196651aafa6959abe37df875be8deefd6db3140f49c645c51` | Six existing commands passed; Lab core and Forge core stopped at negative-control source anchors | New timer/reset spelling moved the literal injection sites. Their positive sections passed; this was not accepted negative coverage. |
| `cccc78de6fb784cfb6f5d1013b4bddf8ec27ad360e926dd7249cd41999c2303f` | All eight existing commands passed | Product keeps the original zero-new timer-reset and run-identity blocks. Tests, assertions and frozen fixtures are unchanged. |
| `331a371fd697be2c4e712e249ab95b7098f7d77cf4e1994e2f72317ac0fef2fb` | Tree core5,243 assertions/27 caught negatives; economy16,802/6 caught negatives | Later UI/return-value corrections require a final run on the corrected source. Core fixture/API corrections and economy negative-label correction are retained separately; none is misreported as a product failure. |
| `4e4707afca6672ea46aad03ebd05cd7341ad61d7316a9636fed6172dbfed96ef` | All eight existing commands pass again; Tree core5,267/28, offline7,691/4 and actual V8 6.0 checks2,862 PASS | Includes actual failed-Auto-Ascend post-kill Deed/return/rollback/retry coverage. Mandatory full/browser CI remains pending. |
| `17d4ff66cc960f80200bbc7a640947d87bf1c8e2c216eea181761f036df5f806` | Local core5,267/28, actual V8 checks2,862, source/context PASS; actual diagnostic FAILED after1,602 mobile checks | Rejected numeric-scroll correction moves Frontier's visible position. Actual sixth-Field control is offscreen. Four focused Prism positives and five negatives pass. No completed Tree profile or200% result. |
| `ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3` | Source/context, fresh core5,267/28, actual V8 checks2,862 and fourth diagnostic26,600 mobile checks/all12 profiles PASS; all13 original Full failures and focused Prism4/5 pass | Restores actual focused-control viewport positions; native Auto-Ascend guard remains. [Local verification](ci-debug-repair-3c931/viewport-local/manifest.json) and [targeted browser evidence](ci-debug-repair-3c931/scroll-diagnostic-48c13f2d/README.md). All four required CI workflows on the coherent PR head remain mandatory. |

The all-eight existing rerun includes Lab core2,456/10 negatives, boundary2,344/5,
stress2,182, Prism state3,506, Forge core9,308/25, Forge calibration3,134/7,
tooling and APK-identity **self-test only**. No APK was built.

Independent economy coverage includes3,117 new rational Empower quotes,1,824
literal legacy quotes,363 oversized-price checks,243 Swift rows and720 canonical
Prism/Frontier previews. Actual mature fixed-depth reinvestment loops reach
Swift21 after1,541 old-price Ascends versus62 with Charter, and Swift50 after247
with Charter, including its200P fee. These are modeled actual-handler repeats,
not elapsed play time or a whole-campaign balance claim. Baseline raw data and
the chosen pacing rationale are under `baseline-economy/`.

## Final focused checks and required CI

The focused offline suite passed14 ending-passive/equal-time cases, existing
Support expiry, three Wall Wisdom boundaries, four six-party/two-Support boss
bounds, and six actual8h live/offline/split/yielded routes. Each long route
completed161 Auto-Ascends,19,962 kills and1,804P; Frontier paid15P first and0 on
repeats. Batches256/31 yielded421/3,478 callbacks and exactly equal persisted
endpoints. Primary-failure retry and recovery-only failure match clean results.
An initial invalid Support fixture was correctly normalized away; its funded
replacement and original failure are preserved, not counted as a product fix.

Actual Node8.3/V8 6.0 passed2,862 assertions:339 complete-IIFE instances,94
independently priced real-purchase cases and34 primary/recovery faults. Both
inline scripts parse. This does not execute Android integration or prove a
native WebView, physical device, OS text scaling or TalkBack result.

The prior local Chrome executable is no longer present. Two attempted local
mobile starts failed before gameplay (including ENOENT); those are environment
failures, not passing mobile tests. The draft PR must run real Chromium tests
on GitHub's installed browser. Inspect all required Full/Lab/Forge/Tree jobs,
182 default scenarios, all22 original causal negatives and mobile artifacts
before integration. The Full workflow now retains each negative's raw trace
and complete strict-loop log; no assertion or gate is removed.

Mobile acceptance covers320/390/430px, normal and200% CSS root font, both motion
preferences, real touch/keyboard/focus and44px targets. Root16/32px tests are not
native textZoom and fixed-px text may remain unchanged. Preserve actual failed
runs, accept only the final exact source, verify the merge tree/parents and
perform fresh integrated checks. Comet shop/Deeds remains the next independent
improvement. Final combined native acceptance and publication remain held.
