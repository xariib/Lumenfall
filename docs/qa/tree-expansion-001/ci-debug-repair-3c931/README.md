# Second Tree CI debugging — 3c931a26

This package preserves the second candidate's actual failed browser evidence
and narrowly scoped repairs. It is not an acceptance or integration receipt.

Published head: `3c931a26bbcf7b009dee03e7411ed41faeb971f8`.
Development base: `2d01049393e3bb45a90d80e07af52ae0484b0ec5`.
GitHub synthetic merge: `a2561ca083c036df0b5ebe27e09939d0bd35c701`.
Its ordered parents are the development base then the published head, and its
entire tree is `d11120bc250a6ac90fac1f5e598042a5572e5650`.
Product SHA256: `4e4707afca6672ea46aad03ebd05cd7341ad61d7316a9636fed6172dbfed96ef`.
Frozen fixtures: `ab43604db1b5bce8b9990506f989676dfb0009cdcf2e514a8ccee9da166c8753`.

## Observed CI

| Workflow | Run / job | Result on 3c931 |
| --- | --- | --- |
| Full | 38085086718 / 114309817414 | FAILED after all182 scenarios:199 PASS/13 FAIL across212 rows. All22 workflow negatives, runtime guard and final smoke were skipped. [Complete failure audit](full/README.md). |
| Lab | 38085086808 / 114309817544 | All11 steps PASS; exact artifact and source audit in [lab/acceptance.json](lab/acceptance.json). |
| Forge | 38085086755 / 114309817228 | All13 steps PASS, including the previously failing17-case offline gate; [forge/acceptance.json](forge/acceptance.json). |
| Tree | 38085086726 / 114309817326 | FAILED focused Prism manual payout and funded Frontier mobile scroll/focus assertion; original raw evidence in `tree/`. |

Tree's other gates passed: core5,267/28 causal controls, offline7,691/4,
economy16,802/6, Prism state3,506, closeout540, actual Tree V8 6.0 checks2,862,
actual Prism V8 checks3,277 and existing Prism mobile468/all12 profiles.
The expanded Tree mobile suite stopped after1,029 checks in the first320px
normal-text/normal-motion profile; zero profiles completed. The corrected
document-start schema1 seed did execute, retained all seven historical paid
node values, defaulted17 new levels to zero, and refunded132P/307C exactly.
Those passed portions do not close the failed browser gates.

## Concrete corrections

`bridge.ascendManual` now temporarily clears and finally restores the QA
reload guard around the actual `doAscend(false)` call, matching the existing
scoped purchase/picker adapters. The earlier `feedbackSave` deliberately leaves
the test's ambient reload guard active. A full-product-IIFE witness reproduces
the original second manual payout as zero because the production primary-save
guard correctly refuses it. Corrected witnesses retain the independent Prism
oracle, actual paid handler/storage and restoration on refusal or exception.
Production save guards and the original browser assertions/negative mutations
are unchanged. See `prism-adapter/` for exact before/fixed evidence.

The first proposed summary correction preserved numeric scroll for focused
Tree controls. **The isolated browser diagnostic rejected that correction.**
On source17d4, Frontier's summary grew110.9375px: unchanged scroll moved the
focused button down by the same amount. Reverting that guard allowed browser
anchoring to change scroll by111px and hold the button within0.0625px of its
original viewport position. The old exact-numeric-scroll assertion therefore
measured the wrong presentation contract. Original receipts remain immutable.

The same diagnostic reached an actual Formation bug: Fielding Aurora as the
sixth member saved the correct party and retained focus, but the presentation
sort moved the focused button above the visible viewport. It failed after1,602
checks in the first320px/root16px profile; zero profiles completed. The focused
Prism suite passed all four positives and all five original causal controls.
See [the complete isolated diagnostic and interpretation](scroll-diagnostic-2bce/README.md).

The revised product captures and restores the active control's viewport top
around Tree list/summary and Wisp/preset rendering. It preserves the existing
native Auto-Ascend picker and numeric guard. The revised mobile oracle requires
focus, visibility/hit targets, viewport stability within1 CSS pixel and settled
frames, subject to the actual physical scroll bounds; numeric scroll remains
diagnostic data. Positive and narrowly mutated
summary/Formation cases use the same anchoring-disabled presentation to verify
the product correction causally, without test-side focus/scroll repair.

Current unaccepted product SHA256:
`ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3`.
Fresh Tree core5,267/28 and actual Node8.3/V8 6.0 checks2,862 pass on these exact
bytes, with empty stderr. Independent review found only presentation changes
and no further concrete defect; [raw checks and review](viewport-local/review.md).
The earlier `local/` package belongs to rejected17d4 and remains unchanged;
its Tree core5,267/28 and actual V8 checks2,862 never proved browser layout.
There is no installed local Chrome executable. The revised product still needs
all required workflows on its final PR head. The fourth isolated diagnostic
below now completes the actual browser matrix.

## Second isolated diagnostic and physical scroll bound

Run38087766620 on commitb7eaca0b executed this exact product with test22bf25b1.
It confirms stable Frontier purchase placement and the actual sixth-Wisp Field,
six-cap refusal, Bench and immediate re-Field flows. The summary positive and
strict causal mutant behave as required. Mobile then stops after2,061 checks
in the first320px/root16px profile: Farm's focused control moves from424px to
410px while scroll moves from32 to0. Keeping its old top would require
scrollTop=-14, outside the browser's physical minimum. The correct nearest
position is0; focus, visibility and hit targeting remain correct.

The next test preserves that boundary fixture. It requires the exact nearest
feasible scroll position and allows only the unavoidable displacement there.
Within the scroll range it still requires viewport stability within1px. Both
summary and Formation causal pairs explicitly require feasible targets and
retain the strict viewport assertion. Static replay of already-recorded
geometry is identified separately from actual browser execution.

The isolated third diagnostic commit is
`cd3e915b91ed2a41f0ada01543437600a2349a48`, whole tree
`22eb701ddbaece465ba962a2aed0c520f914bc3e`, with sole parentb7eaca0b.
It retains productccef4db4 and bridge8568cfb9; mobile test SHA256 is
`a8d8fa1d7a0b09ef0cbce0013bb168ef2a8ef36996f10c5fb58c2dc76dbaa6b1`.
This run completed four320px profiles and8,984 checks before the fifth profile's
schema1 reload hit CDP error-32000, "Inspected target navigated or closed".
Both strict viewport causal pairs passed. Ten of13 original Full attempts passed;
three downstream Wisp-debit assertions failed through the unscoped
formationTest.buy adapter. Focused Prism4/5 passed. [Complete third failure
evidence and limits](scroll-diagnostic-cd3e915b/README.md) retains every available
raw output and explicitly records that navigation also prevented a failure
screenshot/DOM. It does not reuse an earlier failure image.

The complete Full failure archive retains every original failed process,
assertion, DOM and all212 stateful rows. The failures span nine scenario IDs,
including five original layout viewports. All13 processes exited0 without a
timeout or runtime error but reported genuine QA failures. They all reach the
old manual-Ascend adapter with a synthetic reload guard still set. Independent
complete-IIFE witnesses support that common cause, while rerunning the exact
original browser scenarios remains mandatory. The complete stateful log is
preserved; the separate job log is explicitly only an available partial prefix.

## Fourth isolated diagnostic — complete targeted browser success

Run [38089706277](https://github.com/karahaNx/Lumenfall/actions/runs/38089706277),
job114323458107, is terminal SUCCESS on commit
`48c13f2d74b0bd6dc52cf79b0e0e97b89c8b2e5e`, sole parentcd3e915b and complete
tree`f7ebddde82ee7856220591128f0f00c7e0037a68`. Product remainsccef4db4.
Bridge SHA256 is
`e5abae8c0e7e1a422f1322049963438040be62f181967c9eb7fd40b5229f11dc`;
mobile SHA256 is
`45d8b66546b48318586eb1c045fe95cd373fd386601d17e4984a1eda4b3818ee`.

- Actual mobile:26,600 checks, all12 profiles, both strict causal pairs,
  all60 readiness phases and browser exit0. The exact navigation error recurred
  during390/root16/normal motion, legacy-seed-reload. The bounded read-only probe
  recorded it and then initialized; the real ready action ran once.
- All nine original failed Full scenario IDs, expanding to13 attempts, pass
  through the unchanged original runner and assertions. The three previously
  blocked Wisp purchases now complete. All process exits are0, with no outer
  stderr or timeout. This subset does not replace the full182-scenario gate.
- Focused Prism: all four original positives and five causal negatives pass.

The Wisp adapter scopes and finally restores the QA reload flag around the real
buySpirit, with no product save-guard change. [Fifteen bounded local records](formation-adapter/README.md)
verify13 purchase records and two read-only probes of an unused Comet helper;
the three original failed purchase boundaries spend exactly60/70,000/60 Lumen.
Primary failure rolls back and recovery-only failure retains the primary commit.
The unused Comet adapter has no existing caller and remains unchanged.

Tree's generated readiness helper retries only the exact observed protocol
response during its read-only initialized probe. A shared10s deadline covers
the probe and the single ready action; other errors propagate. It never retries
input, purchase, navigate or reload actions. [Readiness proof and independent
review](readiness-repair/README.md) record15 bounded synthetic cases and three
causal controls. The shared Prism driver and instrumented game HTML remain
byte-identical; the subsequent browser run supplies actual runtime evidence.

[The targeted success evidence](scroll-diagnostic-48c13f2d/README.md) binds the
11,856,883-byte artifact11683956884 to SHA256
`c66538e734394dba9cb02f102d5f0657cd05c51f568a9c15d636bdb21ab3fb88`.
Its scope is the isolated diagnostic. Full/Lab/Forge/Tree acceptance on the next
coherent PR106 head is still required before development integration.

The original `repair-review.json` and `local/` entries describe the earlier17d4
proposal at their actual timestamps; they are retained as history and are not
the review of this final viewport correction. `viewport-local/`, the new
adapter/readiness proofs and the fourth diagnostic bind the current sources.

[Final publication preflight](viewport-repair-review.json) rechecks the exact
product, both active adapters, frozen fixtures, original workflows, all stored
and decompressed bytes in the two latest evidence packages, source/context
validation and 40 local documentation links. It accepts publication for the
required CI; it does not accept integration.

Two incidental large-text observations are retained for the planned shared UI
phase: a Wisp class label appears crowded by the Bench control in one earlier
Formation image, and the transient last-Wisp toast has tight line spacing in
some final 200% profiles. Neither has a baseline-browser comparison establishing
a new regression. The current Tree/Formation focused-control assertions pass;
these observations are not presented as complete large-text UI acceptance.

All four required Full/Lab/Forge/Tree workflows must pass on the corrected
published head. Verify every required scenario/control, raw artifact, complete
merge tree and ordered parents before development integration. Main remains
`67373faa531f0bb791c883210ee623320861e380`; PR102 remains draft at2d010493.
No APK, native device, exact WebView60, OS text scaling or TalkBack result is
claimed. CSS root16/32px and actual Node8.3/V8 6.0 have their separate recorded
scope. Historical evidence is immutable; new files are synthetic test data.
