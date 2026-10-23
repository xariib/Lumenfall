# RIFT_HINT_READABILITY_002 — readable Farm Lab advice

Owner: this feature chat. Status: implementation in progress.

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
These browser/native changes still need execution; no PASS claimed yet.

Next: publish draft PR, inspect required CI and fix any introduced regression,
then complete review and appropriate non-publishing Android acceptance if
workflow dispatch is available. No new binding project rule.
