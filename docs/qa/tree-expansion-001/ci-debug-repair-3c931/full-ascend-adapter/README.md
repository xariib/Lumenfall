# Full 3c failures: independent Ascend-adapter root-cause audit

## Conclusion

All **13 reported first failures across nine scenario IDs** have the same reproduced cause: the old `ascendManual` QA helper invokes the now-transactional production `doAscend` while the QA reload flag blocks saves. The production transaction correctly rolls back. The helper returns a zero-gain observation without checking the false Ascend return, and the scenario continues with the old run still active.

There is **no evidence in these witnesses of a new Tree effect or changed default causing these assertions**. All 17 new Tree node IDs and `treeTrainingProgress` were explicitly checked at zero in the exact original scenario seeds. The corresponding state predicates all become true when only the existing fixed adapter is substituted, on both the published product and the current viewport candidate.

This is state-boundary causality, **not a full scenario or UI PASS**. Root owns the upcoming actual browser diagnostic for all nine IDs / thirteen rows. No repository test assertion, product file, staged file or remote state was edited here.

## Source and evidence binding

- Published head: `3c931a26bbcf7b009dee03e7411ed41faeb971f8`; tree `d11120bc250a6ac90fac1f5e598042a5572e5650`.
- Failed full CI: run `38085086718`, synthetic merge `a2561ca083c036df0b5ebe27e09939d0bd35c701`, product `4e4707afca6672ea46aad03ebd05cd7341ad61d7316a9636fed6172dbfed96ef`.
- Original bridge: `3a7e96895d982f005ed075334c5159b8a5e00c138475f1bc4e34b1790e978c3c`.
- Fixed bridge: `8568cfb994b0a6c4c1c2bded8f2946a6489b18591992e58d534f483f5cb287c1`.
- Current viewport product also witnessed: `ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3`.
- Complete-IIFE harness, unmodified copy from published head: `bcf080ce494ee1a2df450241dbd6a087fb6880239c3d2e711d1d2116f4ce3463`.

The witness executes original seed functions from the published scenario modules. The exact original and fixed adapter member functions, `setState`, `feedbackSave` and `freeze` are extracted from their source bytes and injected as observer accessors into the complete IIFE; no production handler is replaced except a transparent return observer that calls the original `doAscend`. Browser rendering is the existing harness's neutral adapter. Both versions restore the prior reload flag, where applicable, as the real functions specify.

Each of the 13 raw archived DOM files was rehashed against `failed-scenario-analysis.json`; all non-layout DOMs contain the exact original Ascend adapter. The five outer layout result pages contain their reported failure rather than the inner instrumented application. Process metadata reports exit 0, no timeout and no runtime errors for all rows. `matrix.json` binds every row to raw DOM/process evidence and precise source anchors.

## Shared chain

The relevant published anchors are `bridge.js:564` (`ascendManual`), `bridge.js:923` (`freeze`), `bridge.js:497` (`feedbackSave`), and product `saveState` (4466), `forgeCommitPaidMutation` (4719), `doAscend` (6589).

`freeze` sets `reloadInProgress=true`. `saveState` returns before writing when that flag is true. `forgeCommitPaidMutation` consequently restores its base state; `doAscend` restores its transient run token and returns false. Old `ascendManual` ignores that return and reports gain 0. This is the expected production protection against a failed/unavailable save; weakening it would reintroduce the already-fixed purchase/Ascend mutation leak.

The fixed adapter temporarily sets only the QA reload flag false around the real `doAscend` and restores the previous flag in `finally`. The actual transaction can then commit primary and recovery. It does not alter reward/reset rules, or bypass primary-write failure handling.

## Root-cause matrix

| Scenario IDs / failed rows | Exact source route | Old-adapter observation | Fixed-adapter observation |
|---|---|---|---|
| `inquiry-save-reload`, `inquiry-backup-restore`, `inquiry-recovery` — 3 | `runner` inquiry branch freezes; `runInquiryPersistence` has already passed its saved-work comparisons, then sets Rift16 and calls `b.ascendManual` before `existing Ascension currency reset unchanged` | Lumen remains **1e9**; old run remains active | Lumen **0**, Shards remain **1e9**; paid Study records preserved by the actual reset |
| `support-stacking` — 1 | Explicit runner freeze; `runSupportStacking` seeds/casts Tide+Aurora, selects Ember and calls manual Ascend | Both identified support records remain | `supportBuffs=null`, `buffUntil=0`, `buffMult=1` |
| `rift-status-contract` — 1 | Explicit runner freeze; `riftStatusWorst` enumerates the original five-member formation, then manual Ascend | Party `[ember,void,tide,aurora,stone]` and four active Bonds remain | Active party `[ember]`, pending ordered intent, **0 active Bonds** |
| `p2-07a-formation-reconstruction` — 1 | Explicit runner freeze; first original `p207Seed` target `[stone,ember,tide]`, then manual Ascend | Exactly the reported unchanged `[stone,ember,tide]` | `[ember]`, with original reconstruction intent retained |
| `p2-07a-chronology` — 1 | Explicit runner freeze; original `[tide,stone]` seed; manual Ascend precedes the 0.999-second check | **0 early purchases**, but Tide remains **level10**, so the conjunction fails | At .999s: **0 purchases, Tide0**; next .001s: **1 purchase, Tide1** |
| `layout-p2-07a-reconstruction` — 5 | Explicit runner freeze; original `[void,tide,stone,gale,thorn]` seed; manual Ascend before rendering | No pending reconstruction and no temporary-Ember condition, so the requested explanation is absent | Pending original five-member intent plus temporary Ember; the exact state condition for the explanation is true |
| `ascend-prisms-contract` — 1 | First `check(16,15,0,0)` succeeds; its `feedbackSave()` leaves reload true; second `check(16,15,1,0)` reaches old manual adapter | First payout **2**, second preview **2** but actual gain **0** | Both actual payouts **2** and second transaction commits normally |

The layout viewports are the five original rows: 360×800, 360×780, 390×844, 412×915, and 360×640 with 24px top/bottom safe insets. They failed the same explanation assertion. The VM does not simulate those viewports or claim their later geometry assertions pass.

### Why these are not intentional new Tree effects

The original seeds use `freshStateSnapshot()` and add only their listed legacy state. The witnesses explicitly assert all new Tree IDs equal zero, including Lumen Inheritance, Lasting Blessings, Roster Recall, Veteran Recruits, Charge Memory, Unbroken Rhythm, Familiar Paths, Sixth Companion, Steady Instruction, Frontier Record and Ascension Dust. Thus they neither retain Lumen/support, recruit a party on reset, preserve old charge/timer phases, add a sixth slot, accelerate Empower nor add Prism bonuses.

The chronology failure text is particularly misleading without inspecting both terms: the pre-existing assertion checks `empowers===0 && tide===0`. The old adapter satisfies the first term. The failed reset leaves an already-recruited level10 Tide; the timer itself still waits until one second. No cadence change or loosened timing assertion is warranted by this failure.

The Prism entry path differs from the other scenarios. `uiMeasurementPause(true)` merely pauses the test timer flag; it is **feedbackSave's unconditional final reload flag**, after the first successful check, that blocks the next old-helper call. The witness preserves this two-check order instead of artificially freezing the first Prism case.

## Run and limits

Final command: `node witness.cjs > witness.stdout.json 2> witness.stderr.txt`, from this directory; Node v24.19.0 / V8 13.6.233.17-node.51; **exit 0, empty stderr**. There are **28 VM records**: seven boundary families × old/fixed adapter × published/current product. In all blocked old-helper boundaries, the real `doAscend` returns false, gain is zero and there are zero successful writes. Every corresponding fixed-helper boundary returns true, commits two writes and satisfies the specific original state predicate. The Prism family's first successful call is recorded separately from its blocked second call.

`witnesses.json` contains complete synthetic seed/before/after states, real handler returns, write identities, the chronology substeps and all 13 raw DOM provenance records. `receipt.json` is the compact execution result. `exact-adapter-hooks.js` preserves the exact compared function bytes. `draft-probe/` preserves a local diagnostic-driver mistake: it initially compared a post-reset Prism preview with the pre-reset quote. The final driver captures that preview before Ascend, as the original browser scenario does; no repository assertion changed.

The remaining requirement is the planned actual browser run through the full scenarios, including persistence phases, all downstream assertions and five layout viewports. This audit found no separate explanation for any of the thirteen reported first failures, but does not certify unseen later assertions. Original Comet preparation and viewport evidence remain frozen and untouched.
