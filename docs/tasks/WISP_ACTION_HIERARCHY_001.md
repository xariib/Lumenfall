# WISP_ACTION_HIERARCHY_001 — compact Wisp cards

Status: integrated; installed emulator acceptance passed; physical-device
acceptance pending. This is the 20–21 October feature checkpoint. Later approved
card disclosures and the current release are tracked in
[WORKSHOP_CARD_CLARITY_001](WORKSHOP_CARD_CLARITY_001.md).
The [complete earlier checkpoint](WISP_ACTION_HIERARCHY_001_HISTORY_2026-10-26.md)
is preserved byte-for-byte; it was compacted because this active startup plus
shared context exceeded the existing 32 KiB limit during PR #13 validation.
No test, source behavior or acceptance gate is changed by this compaction.

## Original requirements and implementation

The user asked for simpler Wisp cards with correct information and approved the
design best suited to Lumenfall. Retain all eight identities, level, rarity,
Power, Field/Bench, contribution, Empower/Recruit, Rarity, Ability, Ultimate,
Mastery and Resonate, including every price, current/next effect, gate,
Formation and automation. No economy, save or Android-identity change.

The original 20 October scope kept unfinished upgrades visible and folded
perfected ones. The later Workshop requirement now explicitly simplifies cards
further with native Upgrades disclosures; use that task for current behavior.
One original affordable purchase receives a short Next cue, in priority order:
Recruit, otherwise Mastery, Ultimate, Rarity, Ability, Empower. This is navigation
priority, not an optimal-investment claim or automatic spending. Keep red
insufficient resources, native disabled controls, exact prices and readable gates.
No duplicate Next-action panel or redundant Ability badge.

Use the existing navy/gold/violet card, compact effect rows, 44 px controls,
320/390/430 px widths, 100/150/200% text and both motion preferences. Preserve
full state/both saves, native purchases and exact focus/scroll. Modern Chromium
does not establish physical Android, exact WebView60 or TalkBack acceptance.
The researched Dribbble references, original baseline/recovery and full local
and remote chronology remain in the historical checkpoint.

## Source, review and browser evidence

Original main was `ff50c13c855459078f494fd27dabc5a93c273a4b`, product SHA-256
`d4a55cde9135d078a6da16ff85ddee831129c631312c30c1ea3c90efa00372e5`.
The final compact source was
`5733c81744ac1dddff50639d710ea542c3a7eedcd30c0764d92a72a0096cafcd`.
The [24-function preservation comparison](../qa/wisp-action-hierarchy-001/preservation.json)
matched protected gameplay, prices, purchases, saves and online/offline code.
Matched unfinished card heights were 22.5–26.9% shorter at 390 px.

The automated [PR accessibility review](https://github.com/xariib/Lumenfall/pull/3#discussion_r4326057698)
found Next cues inserted after accessible names were prepared. Calling
presentControlStates after highlighting and before focus restoration fixed it.
Native focusin observes the current Next/Wisp name immediately; causal removal
controls catch stale names and wrong primary actions. This was automated review
and self-verification, not independent human or TalkBack acceptance.
[Focus proof](../qa/wisp-action-hierarchy-001/focus-review.json).

Historical exact-source local checks: compact 39,150/18 profiles; original
layout 24,888/12; upgrades/persistence/completion 12,912/12; scroll/focus
3,277/312; affordability 26,844/12 with original negative controls. All 101
selected original scenarios passed, including both offline UI cases with their
original 210-second deadlines. The source-bound independent four-window oracle
retained every full-state/reward digest after regeneration.
[Manifest](../qa/wisp-action-hierarchy-001/checks.json),
[QA/screenshots](../qa/wisp-action-hierarchy-001/README.md),
[label compatibility](../qa/wisp-action-hierarchy-001/control-label-compatibility.json),
[source binding](../qa/wisp-action-hierarchy-001/offline-source-binding.json).

## Integration and installed Android — 21 October 2026

The user approved public upload/PR on 20 October and separately authorized
review/integration followed by installed Android acceptance. Initial no-merge/
no-release scope was superseded for those later steps; no APK was published
by this feature. Other features subsequently published newer versions.

[PR #3](https://github.com/xariib/Lumenfall/pull/3) final head
`2980b56061275cf256ed0d8a5279bfd7adeac8e4` passed all six relevant workflows
and merged without conflict at `7a498e5be2d060476c9442435768ea1db15d725d`.
The automated accessibility thread was resolved.
[Exact-main validation #19](https://github.com/xariib/Lumenfall/actions/runs/39548886678)
passed. [PR #4](https://github.com/xariib/Lumenfall/pull/4) changed only the
installed Android test driver and synthetic fixture, passed all six final-head
workflows and branch native #20, then merged at
`4a3085067797b292b32c179e4e4bbb8e33b640d1`. Product HTML stayed byte-identical
to PR #3 integration.

[Integrated Android #21](https://github.com/xariib/Lumenfall/actions/runs/39559404175)
passed on that exact merge with publish=false: com.lumenfall.app 0.2.21,
versionCode1000021; APK SHA-256
`5141f8e54290a18854b125677f2f144690d055e06a0c07f95762b6d33d36a026`.
Artifact signed-apk-39559404175 (12326779780) contains APK, receipt, UI diagnostic
and screenshot. The established certificate was retained. Android12/API31 with
WebView91 upgraded archived signed0.1.158 in place: UID/origin, both saves,
progression, paid study and legacy entitlements survived. All eight cards fit
at 320 px with complete prices/effects and one current accessible Next cue.
A trusted Android touch bought one Ember Ability level, 10→11, with refreshed
prices and correct focus/name. The complete Ember screenshot was inspected.
Earlier nonpublishing native #15 and its receipts remain in the historical file.

Physical phone, exact WebView60 DOM, TalkBack and human visual/pacing/performance
remain unverified. Do not claim those passes or archive this acceptance work.
Current builds must validate their own source; these historical results do not
prove later product versions.
