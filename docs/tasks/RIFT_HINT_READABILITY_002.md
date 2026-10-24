# RIFT_HINT_READABILITY_002 — readable Farm Lab advice

Owner: this feature chat. Status: integrated; exact-main Android acceptance blocked by unavailable execution environment.

## Approved scope and baseline

The user approved the proposed slice with “Ja”: short Farm hint summary,
readable details containing the full current advice, price or resource
shortfalls and navigation to Lab. Keep the combat area's position and all
gameplay, prices, saves, progression, automation and Android identity.
No APK release. Work / GPT-6.1 Sol / High recommended.

Baseline: `main` `8dabca95c379af3e87ff1a03c0f8c615ebf36735`.
PR #6 is merged and its installed-emulator acceptance passed; only PR #2
(documentation audit) is open, with no open issues or overlapping product PR.
Isolated branch: `feat/rift-hint-readability-002`.
See [current state](../PROJECT_STATE.md), [original guidance](MIDGAME_FARM_GUIDANCE_001.md),
[previous acceptance](MIDGAME_FARM_ACCEPT_001.md), and
[workflow](../project/FEATURE_WORKFLOW.md).

The current 44 px scroll window exposes a small portion of the Lab quote at
200% text. Preserve the 46 px reservation and existing Show/Hide preference.
Only the developing Farm Lab option receives the details interaction; early,
Push and late guidance retain their existing behavior. Use the established
overlay focus lifecycle, Close/Escape and an explicit Go to Lab action.

## Acceptance

- At 320/390/430 px, 100/150/200% text and both motion settings, a readable
  summary opens wrapped full advice without horizontal clipping. No font
  reduction; dialog can scroll vertically when needed. Actions at least 44 px.
- Full current price/effect, both red shortfalls, active paid work and occupied
  slots remain available. Refresh while open; never offer a stale destination.
- Trusted keyboard/touch opening, focus containment, Escape/Close restoration,
  and navigation to the existing focused Lab card. Background combat geometry
  remains stable across opening, closing and hiding hints.
- Viewing/navigating preserves complete game state and saved bytes. Preserve
  original purchase, paid-work, save, offline, early and late guidance checks.
- Add focused regression and causal controls; run required CI and review full
  diff. Record actual browser and installed Android evidence separately.
  Physical phone, exact WebView60, TalkBack and human pacing stay unverified
  until directly checked. Open PR is not completion.

## Baseline checks and checkpoint

Node 24.19.0: original midgame source contract PASS 24 assertions including
inverse; original late guidance PASS 186 assertions including controls after
materializing its existing fixture from sparse checkout. The initial late
check failed only because that fixture was absent, not because of product code.
Local baseline/candidate Chrome 156.0.8078.47 probes were blocked before
profiles by rejected singleton-socket creation (EPERM/ECONNRESET); apt setup
also lacked setuid/setgroups. No local browser PASS is claimed. CI provides
browser acceptance.

Implementation: short `Lab hint` summary opens full current quote, red
shortfalls, running work or occupied slots through the existing overlay
lifecycle. Go to Lab recomputes the current goal and navigates without buying.
Live refresh updates text in place and closes obsolete advice. Early/Push/late
guidance and the fixed 46/44 px reservation are unchanged.

Candidate Node checks: source syntax/lifecycle validation PASS; actual task
context PASS (29 entrypoints, 50 links); original midgame 24, late guidance
186, Lab 2,677 (with original negative controls), progression 235 PASS.
Edited QA files pass Node syntax and diff whitespace. The browser matrix now
checks 18 profiles, complete quotes, native keyboard/touch, focus containment/
return, red/live shortfalls, paid running work, occupied slots, unchanged
state/save and stable combat geometry. Two causal controls remove dialog
opening and live refresh. Installed Android QA now touches the summary,
checks full dialog content and touches its original Lab destination.
The browser/native execution checkpoint below supersedes that initial status.

## Initial published checkpoint — 24 October 2026

[PR #7](https://github.com/xariib/Lumenfall/pull/7) was initially opened for review.
Implementation `8016a1f528c50add6459095180964f570c6a6c7b`, followed by
heading-first initial focus `eb589c12835c480ac2230c2f703068e14ba9d0c6`.
Product SHA-256 was
`05f6516d88c9620bc080986ae3248d3e4888f9a5a448903ee0c0b5cdb0e602bd`.
[Evidence/reproduction](../qa/rift-hint-readability-002/README.md) includes
source comparison (565/567 original functions byte-identical; only
`renderRiftObjective`/`init` changed, four presentation helpers added), local
results, first browser failure and installed Android test summary.

[Full run 40033985420](https://github.com/xariib/Lumenfall/actions/runs/40033985420)
passed its original isolated offline job and arithmetic/automation steps, then
failed the new keyboard Go to Lab assertion on the first 320 px profile.
The failure screenshot retained a focused native button and open dialog.
The shared Guidance `key()` helper sent `rawKeyDown` without the Enter
character event; that is sufficient for the old custom keydown handlers but
does not activate a native HTML button. Existing Wisp drivers use the complete
`keyDown`/carriage-return/`keyUp` sequence. The QA correction adds that native
sequence only for the new button, explicitly asserts its prior focus and
retains the original destination/state/save assertions. Actual text Range
bounds now verify the entire summary, rather than its containing box.
No product code changed for this correction. The first run remains a failure;
its [raw artifact](https://github.com/xariib/Lumenfall/actions/runs/40033985420/artifacts/12536641256)
and [failure receipt](../qa/rift-hint-readability-002/first-browser-failure.json)
are preserved. Initial run 40033845508 was superseded/cancelled by the focus
commit; it is not counted as acceptance. Automated review on `eb589c1`
completed with no findings; no independent human review is claimed.

[Android run #26](https://github.com/xariib/Lumenfall/actions/runs/40034260929)
**PASS** on exact product/head `eb589c1` with `publish=false`. The signed
in-place upgrade on the disposable Android emulator preserved identity,
both slots, paid progression/work and legacy entitlements.
Installed native touch opened the full quote and then reached the
visible, focused original Wisp Ascendancy card. The existing eight-Wisp and
purchase/focus check also passed. Exact packaged source/identity and upgrade
receipt gates passed; release was skipped. This is emulator acceptance,
not a physical-phone/WebView60/TalkBack or enlarged native text claim.
The detailed emulator receipt upload was rejected by automatic approval
review because it contained environment and APK metadata. The repository
keeps only a minimal test summary and the public workflow reference;
no UID, detailed device configuration or APK metadata is exported here.


## 200% summary correction

Safe-area candidate `9927243f7f716d7bb7fff59a1582ebe66b978b59`
passed [non-publishing Android #27](https://github.com/xariib/Lumenfall/actions/runs/40035607792)
and automated code review without findings. This native result is for those
bytes, not acceptance of subsequent CSS. [Full CI 40035527105](https://github.com/xariib/Lumenfall/actions/runs/40035527105)
passed isolated offline, arithmetic and automation, and the first four mobile
profiles including complete keyboard navigation. At 320 px / 200% text,
the summary failed the strict no-nested-scroll/readable-text check. The
[raw artifact](https://github.com/xariib/Lumenfall/actions/runs/40035527105/artifacts/12537396153)
retains the failure. The enlarged arrow's inherited normal line box plus
vertical padding can exceed the fixed 44 px window. The correction keeps
the same fonts, zeroes summary-only vertical padding, fixes its height to
44 px and sets the decorative arrow's line-height to 1. It changes neither
the reserved slot nor other hints. Failure measurements are now recorded
before assertions. No assertion is relaxed and no overflow is hidden.

To shorten feedback on this focused UI correction, the unchanged asset
staging and Farm mobile acceptance steps run directly after source validation,
before the longer numerical/automation checks. All original gates and
controls remain present. The numerical/browser helpers use their own temp
stages, so the original staged production input stays intact.

Corrected product SHA-256:
`8d957895a5e82bf8a6b4f78abc6affea8e796171a228e8b185c3261b61cceb83`.

## Corrected mobile acceptance

Head `5b2d1a6250c044ab09b5d7f3f229bca0d5631dad`, tree
`b3b3b3496c65b6b28d369a071c35f910907e3b9b`, matched the complete local
published tree. [Full run 40036520804](https://github.com/xariib/Lumenfall/actions/runs/40036520804)
passed the corrected **18/18** profile matrix and **both** exact causal
controls, including clean browser teardown and no unrelated runtime errors.
The 200% summary now passes actual text Range bounds and no nested scrolling;
full quote, red/live shortfalls, paid running work, occupied slots, keyboard,
native touch, focus restoration, state/save equality and stable geometry pass.
No font, assertion or fixture requirement was relaxed.

The same run's original isolated offline job passed. All five other relevant
scoped workflows (Lab, Shared UI, Tree, Forge and Comet/Deeds) passed, and
automated review on exact `5b2d1a6` completed without findings. Two separate
Prism workflows skipped by their unchanged path filters; the full run's exact
Prism numerical/causal step passed. Full regression remains in progress.
[Non-publishing Android #28](https://github.com/xariib/Lumenfall/actions/runs/40037849254)
passed on exact product/head `5b2d1a6`. Both saves, paid work, legacy
entitlements, Wisp touch and the native summary/details/Lab destination
passed. No release was published. No integration is claimed yet.

## Independent offline reference correction

The full stateful run later reported `offline-catchup-ui` and
`offline-catchup-legacy-dom` failures before those drivers started a browser:
their unchanged source-binding guard still named the earlier `bbbc27b1`
product. The reference update was missed during the HTML change. This is a
required gate and is not waived because the UI slice preserves mechanics.

Executed `node tests/behavioral/offline-catchup.cjs --generate-swift-golden`
against exact final `8d957895` source. The original archived oracle input
was materialized with its pinned original Git blob verified byte-for-byte.
All four independent sequential eight-hour windows retained identical kills,
Ascends, Prisms and complete state SHA-256 values. Only `sourceSha256`
changes in `offline-swift-current-golden.json`.
[Regeneration proof](../qa/rift-hint-readability-002/offline-source-binding.json).
The unchanged source-bound engine probe also passed on Node 24.19.0 (369
batches); this does not establish Chrome60 engine or Android DOM acceptance.

The same existing source-binding requirement is now checked just after CI
source validation, before the long gates. Both original offline browser
cases, their guards, all state/reward assertions and deadlines remain intact.
No product file changes for this correction. The current full run continues
to retain its actual failures; it cannot count as passing acceptance.

The environment restart removed the prior checkout's external Git metadata.
Reattached this worktree to an independent clone of exact `5b2d1a6` under
the current workspace; its tree matched `b3b3b349` and all working changes
were retained. This recovery does not restore archive code over the product.


## Full-suite layout contract correction

Run [40040519633 attempt 1](https://github.com/xariib/Lumenfall/actions/runs/40040519633/attempts/1)
passed both original source-bound offline browser cases. Later, all five
viewports in each of `layout-dense`, `layout-boss` and
`layout-accessibility-states` failed `.objective-copy small within viewport`
after entering Farm. The old observer still required the intentionally moved
inline quote; updating this contract was missed.

`layout.js` now opens the real Farm dialog and checks its visible full title/quote,
font minimum, wrapping, exact accessible content, Close/focus return and
unchanged complete state, saved bytes and Guardian Tap geometry. Every other
hint retains its original visible-inline-quote check. No test case, font
minimum, viewport or gameplay assertion is removed. These original layout
cases also run early, before long numerical checks, and remain in the full suite.

The same run separately reported one phase-sensitive Rift animation overflow:
`enemy-stage` scroll height 131 vs client 129 with active Void VFX. This fixture
does not use the Farm Lab summary; relevant combat CSS/functions/driver are
unchanged. Exact same product/driver passed that scenario in run 40036520804.
Cause is not established as a test-only defect; preserve the failure and
require final full CI without changing that gate.
[Animation receipt](../qa/rift-hint-readability-002/rift-animation-failure.json).
No product changes: SHA-256 remains `8d957895a5e82bf8a6b4f78abc6affea8e796171a228e8b185c3261b61cceb83`.

## Integrated checkpoint — 24 October 2026

[PR #7](https://github.com/xariib/Lumenfall/pull/7) merged at
`88d9bdd33dafb4d075f8b86254ef050ade99e32d`. Its tree `49607bab6b98196945d689dad611edae6cb3935c`
exactly matches validated head `0d7937ae39d77543270ec5ce154c34ce83d991b6`.
[Final CI](https://github.com/xariib/Lumenfall/actions/runs/40046062655) PASS:
both full jobs, all original layout/offline cases and runtime smoke.
All five companion workflows PASS; automated code review on exact head
completed without findings. No independent human review is claimed.
[Compact final receipt](../qa/rift-hint-readability-002/ci-final-summary.json).

Candidate Android #28 passed on identical `8d957895` product, including both
saves, paid work, entitlements and native summary/details/Lab navigation.
Exact-main installed acceptance is NOT complete: the execution/browser
environment became unavailable, with no manual-dispatch capability in the
GitHub connector. No integrated Android build was started. No APK release.

Next required action: restore the environment, verify current main still has
the accepted product/build/driver, and run the existing Android workflow on
main with `publish=false`. Inspect its installed save/identity and native
hint receipts, then update this task and shared status. The post-status-edit
Node context command also remains to be rerun; final documentation links and
UTF-8 budget were checked against the published tree without local execution.

The unchanged animation gate passed in final CI; the intermittent finding is
not claimed fixed. [Next proposed task](RIFT_VFX_OVERFLOW_001.md) is not approved
or implemented. Physical phone, exact WebView60, TalkBack and human visual/pacing
acceptance remain open. Keep this task/chat open. No new binding project rule.
