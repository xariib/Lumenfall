# RIFT_HINT_READABILITY_002 — readable Farm Lab advice

Owner: this feature chat. Status: implemented; browser regression acceptance in progress.

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
The setup script downloaded Chrome but apt installation failed due unavailable
setgroups/setuid operations. A fully unpacked Chrome 156.0.8078.47 starts its
version probe; both baseline and candidate browser attempts then fail before
profiles because this sandbox rejects Chrome's singleton socket creation
(`Operation not permitted`, followed by ECONNRESET). This is not a product
failure or browser PASS. Use GitHub CI's browser environment.

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

## Published checkpoint — 24 October 2026

[PR #7](https://github.com/xariib/Lumenfall/pull/7) is open for review.
Implementation `8016a1f528c50add6459095180964f570c6a6c7b`, followed by
heading-first initial focus `eb589c12835c480ac2230c2f703068e14ba9d0c6`.
Published tree `aab3c75c5ab3e8e3e76d47342a5a23e1710d3478` exactly matched
the local tree. Product SHA-256 is
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

Next: publish the QA correction/evidence, run all required final-head CI and
inspect mobile screenshots/causal controls. Integrate only after those gates;
then repeat non-publishing installed acceptance on exact main. Physical phone,
exact WebView60, TalkBack and human visual/pacing acceptance stay open.
No new binding project rule and no APK release.

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
Next: inspect the corrected 18-profile matrix and both causal controls,
complete all final-head CI/review, integrate, then run non-publishing Android
acceptance on the exact integrated product. Physical/human gaps remain open.
