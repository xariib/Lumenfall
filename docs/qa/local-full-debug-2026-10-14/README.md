# Full local debugging — 14 October 2026

Status: LOCAL AUDIT SAVED; FULL ACCEPTANCE OPEN. User requested a full local debug.
Baseline: clean `86305555297281c7cab7b5af50d4a66011170e55`, `local/full-debug`.
Game SHA-256: `509b2dcb98f45207d4b9125cbf39f194adcb58e05690381d306352c733b0b050`.
Node24.19.0, Chrome151.0.7922.34; old-engine checks use the previously verified
Node8.3.0/V8 6.0 runtime. No agents, push, APK or release actions. The existing
Guidance gate attempted a read-only fetch of its missing baseline object; GitHub
returned Repository not found. No remote write occurred.

Raw evidence: repository `validation-evidence/full-debug-2026-10-14/`.
Source-bound [machine checkpoint](checkpoint.json) records commands, results,
versions, control failures, current test hashes and limitations.
Reproducible batch entrypoint: `node scripts/qa/full-local-debug.cjs core|legacy|ui|full|negative|refund-negative`.
Set `LUMENFALL_QA_CDP_CHROME` to the installed Chromium executable and
`LUMENFALL_QA_LEGACY_NODE` to the verified old-engine executable. The full Windows
run uses the existing optional `LUMENFALL_QA_DOM_TRANSPORT=pipe` adapter; this is
not a claim that the standard dump-DOM transport or remote CI passed.

## Findings and repairs under verification

- Early Wisp curve: strict frozen Forge catalog comparison still expected cap10
  for Arcane Calibration and Resource Conduction after the approved cap20 change.
  Updated exactly those expected caps; all other catalog fields remain exact.
  PASS2800 checks and five causal controls, including wrong-cap and changed-price
  controls that fail the catalog assertion specifically. Historical oracle intact.
- Resonate driver: unbounded Windows Chromium `--version` process prevented tests
  from starting. Read actual browser version over bounded CDP instead. Registered
  scenario now PASS under its unchanged150s deadline; gameplay untouched.
- Wisp upgrade display: older completion-focus assertion required the interactive
  summary. WISP_RARITY_SCROLL_001 deliberately uses a noninteractive same-card
  target to prevent repeated Enter folding. Require that exact card, tabindex and
  action identity; retain every purchase/debit/fold/save check. Registered rerun PASS.
- Tree mobile causal control removed only the old fallback call, leaving an empty
  `else` after the Wisp scroll repair. The first repair removed a complete branch,
  but another render-stage restoration correctly preserved the viewport. The final
  control targets the shared helper's anchor compensation, which all stages use.
  PASS26660/12 profiles, two controls fail their exact viewport assertions with
  identical fixtures, real input/save pairs and no runtime errors. The earlier
  syntax error/no-effect mutation were harness failures, not game behavior.
- Offline UI source guard: independent regeneration of four8h one-second windows
  matches every historical phase state hash, kill/Ascend/Prism total exactly.
  Update only the source stamp; retained gameplay oracle values are unchanged.
  Registered modern UI and legacy-DOM reruns PASS after that exact regeneration.
- Prism matrix: normal25s gate reproduced a timeout. An isolated longer diagnostic
  completed all6651 existing assertions in27.851s. This is diagnostic evidence,
  **not gate acceptance**. Profiling found repeated full-menu rendering. Isolated
  candidate experiments remove redundant Forge/Lab parsing; live source unchanged.
- Wisp-scroll90s and offline-core300s gates timed out in both the broad run and
  sequential isolated reruns. Full standalone offline assertions pass in359.673s
  (18 records), which does not satisfy the300s registered gate. Required timing
  acceptance remains failed; no deadline or assertion was relaxed.
- Rift native navigation: all four variants hit300s in the untraced broad run.
  A separate traced run continued through22 menu traversals and418 actual native
  gestures, still moving at299.534s. It had reached the third viewport's dense
  Forge list. This indicates matrix execution cost, not a fixed stopped step;
  trace adds protocol observations and is diagnostic, not isolated gate acceptance.
- POSIX tooling suite stops at a Windows symlink EPERM. No fixture or CI assertion
  was skipped or relaxed. Linux tooling acceptance remains unverified.
- Guidance comparison needs the exact historical baseline Git object. It is absent
  from this imported local history and its read-only fetch failed. The original
  gate remains failed; current-source full readability driver is separate coverage.

## Verified milestones so far

All eight legacy-engine suites pass. Source/context/APK-identity self-test and
all15 source/staged asset byte comparisons pass. Core batch24/26 before repairing
the stale cap expectation; its other failure is the Windows tooling limitation.
Prism, Lab, Forge, Comet, Wisp, shared-layout, collection-price and quest-attention
focused browser checks pass. The full baseline run finished all186 scenarios/
216 executions:175 scenarios/205 executions PASS,11 FAIL. Four failures now have
current-source registered PASS reruns (Resonate, Wisp completion focus, offline UI
and legacy DOM). Seven timing failures remain: Wisp scroll, offline core, four
Rift variants and Prism matrix. Sequential offline/Wisp/Prism reruns also fail
their original budgets; traced Rift diagnosis is recorded separately.
The full command remains failed; a union of targeted receipts is not a full CI PASS.

All22 workflow harness controls complete with their intended assertion/runtime
failures; the two runtime controls have exactly their expected error marker and
one intentional error, and ordinary assertion controls have no runtime errors.
All17 refund controls pass the workflow's exact failure-message and clean-teardown
checks. The 341654-assertion Prism numerical oracle and guarded startup also PASS.

Forge/Lab screenshots at320px with doubled text were visually inspected: no
horizontal clipping in the sampled purchase/queue/speed areas. This is self-review.
Modern desktop browser/V8 tests do not establish physical Android, native
WebView60, textZoom or TalkBack acceptance. No APK was built or signed.

Complete diff self-reviewed: five validation defects repaired, existing product
bytes/balance/save schema and all original assertion/deadline gates retained.
The helper now uses fresh evidence directories and rejects changed source/tests
as a passing run. Raw experiments remain outside tracked product files.

Next: restore the missing baseline/GitHub access and run the required Linux CI
gates, then investigate any remaining execution-cost failures on those bytes.
Physical Android/WebView60/textZoom/TalkBack acceptance is still needed for release.
Keep [the task](../../tasks/LOCAL_FULL_DEBUG_001.md) open; this is local evidence,
not completed integrated/released acceptance or proof of zero unknown bugs.
