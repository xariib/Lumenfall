# RIFT_NAVIGATION_001 — direct Rift navigation

Status: integrated; automated CI and installed-emulator acceptance PASS.
Physical-phone/WebView60/TalkBack acceptance remains open. Owner: this feature chat.
Baseline: main `41566c97`; branch `feature/rift-navigation-001`.

User request (30 October 2026): add left/right buttons beside “Rift xx”
for one-step navigation and a button for ten Rifts back; remove the disliked
“Choose farming Rift” box shown in the attached phone screenshot.

Scope: replace the picker with immediate main-screen controls. Retain Farm/Push
and saved Push depth, manual Farm intent, persistence/rollback and all rewards.
Existing farming excludes bosses: arrows skip boss Rifts, and forward from the
highest cleared Rift resumes Push. Back ten targets current depth minus ten,
clamps at one and skips a boss downward. No balance or save-schema changes.

Acceptance: direct controls and no picker; bounds, boss transitions, Push return,
manual intent, reload and storage failure coverage; mobile touch/layout and
existing Farm regressions; required CI/integration and Android acceptance.

Overlap: open PR29 changes taps and a Mote-clock boundary in index.html; keep
this isolated and reassess at integration. No changes to its checkout.

Implementation: direct −10 / previous / next controls beside the Rift number;
Farm enters immediately and no chooser markup, logic or chevron remains. Forward
returns to saved Push; existing transactional saves and manual intent are reused.
Updated accessibility, layout, mobile touch and visual-audit expectations only
where the removed picker was required. New navigation regression runs through
the existing progression-pacing CI entrypoint. GitHub rejected a workflow-file
edit because the available OAuth token lacks workflow scope; no workflow change
is needed to run the additional checks in that existing entrypoint.

Changed files: product `index.html`; regression drivers `rift-navigation.cjs`,
`progression-pacing.cjs`, `rift-status.cjs`, `accessibility.js`, `layout.js`,
`permanent-progression-ui.cjs`, `visual-audit.cjs` and the golden source binding
under `tests/behavioral/`; native acceptance `scripts/ci/android-upgrade.cjs`;
this task, project status and `docs/qa/rift-navigation-001/` receipts.

Local Node24.20 checks: navigation101, pacing322/five controls (221 existing), Farm
recap353/old-recap control, source syntax/contracts and context PASS. Independent
four 8h one-second windows reproduced every previous result/state hash; only
their source binding changed. [Receipts](../qa/rift-navigation-001/core.json).
Initial mobile touch434 checks/18 profiles PASS (Brave156, widths320/390/430,
100/150/200% text, both motion preferences). Screenshots visually inspected.
Final-source Chrome156 mobile rerun PASS,434 checks/18 profiles.
Windows DOM layout launch/teardown timeouts are recorded separately from passing
layout assertions (all five viewports passed assertions; first two process exits
failed shutdown). Linux CI remains required. No physical phone, exact WebView60
or TalkBack acceptance claimed.

[PR30](https://github.com/xariib/Lumenfall/pull/30), initial head500ea828:
six focused workflows and isolated offline PASS. Full pre-merge run41113142119
failed its guidance case: on320×640 at200% text the new heading caused a2px
party/boost overlap. The historical leading-word failure in that gate was an
expected causal control, initially misread in chat as the cause. Its assertions
remain unchanged. Remove the4px heading gap only below680px height; the exact
five-sample case and complete guidance baseline/inverses now PASS locally.
[Fixed guidance receipt](../qa/rift-navigation-001/guidance-fixed.json).
Regenerated the independent golden windows again; all four state hashes match.

Android acceptance now also uses actual adb taps for previous/next/−10, clamping
at Rift1, no popup, manual intent and saved Push return in the existing disposable
emulator fixture. Signed test build
[run41116377937](https://github.com/xariib/Lumenfall/actions/runs/41116377937)
PASS on head0a315df6: Android0.2.60/code1000060, API31/WebView91.0.4472.114.
Native sequence25→24→14→15→14→4→1, boundary controls and Push26 PASS.
UID/origin, both saves, paid work and legacy purchases retained. Original signing
fingerprint and packaged source/assets verified again locally. APK SHA256
`ea8b9059b6a5add17613061ff7c12e0cb2c27f2accf30119ffc0f17fb122849a`.
[Initial native receipt](../qa/rift-navigation-001/android-initial.json).
No physical-phone, exact WebView60 or TalkBack acceptance claimed.

Head0a315df6: six focused workflows and isolated offline PASS (the first focused
browser launch timed out before any check; unchanged retry PASS). Pre-merge
run41116328546 stopped at an existing task's startup budget: the new shared
status entry put RIFT_HINT_READABILITY_002 at32952 bytes. Shortened historical
status summaries while retaining their task/evidence links; unchanged32KiB gate
now passes all31 workflow task contexts. Product bytes and signed APK unchanged.
[Budget failure](../qa/rift-navigation-001/ci-budget-failure.txt).

The complete16-profile guidance run additionally exposed a safe-inset/200%-text
overlap at360×640 on that earlier layout. Restore a44px heading on short screens:
−10 occupies its own column, arrows surround the number and Push/Farm share the
right column. All five buttons retain44px targets; redundant Farm-depth text is
hidden only there and the complete Rift/zone name remains accessible. Taller
screens retain the two-row layout. Compact Rift formatting prevents wide labels.
Full16 profiles/160 samples PASS, all18 midgame profiles PASS, complete immutable
baseline/copy/layout inverses PASS, unchanged four golden state hashes PASS.
[Full guidance receipt](../qa/rift-navigation-001/guidance-complete.json).
Final product SHA256: `2c2db6f01dfe3c277a332de4fd4b84f250a0e25eb5ee730275558356c9331d36`.
The0.2.60 test APK above predates this compact refinement.
Final compact build[run41119805999](https://github.com/xariib/Lumenfall/actions/runs/41119805999)
produced signed Android0.2.62/code1000062 on head86414d5c. Original identity,
exact packaged source/assets, both saves/paid work and native25→24→14→15→14→4→1
then Push26 PASS. [Receipt](../qa/rift-navigation-001/android-test.json).
APK SHA256 `8b12e14d101f2b7a38e9b4a383bdf19e0888eadcaac40d17c437566a9e21113c`.
Attempt1 stopped in the existing offline-recap startup check before navigation;
the unchanged retry passed all native assertions. [Failure](../qa/rift-navigation-001/android-recap-failure.json).

Full pre-merge run41119815206 completed with four failed scenarios, all reporting
"native Tab reaches rift-back-one": rift-status-mobile/reduced-motion and both
stacking variants. The driver enumerated the correct new DOM order but still
focused Push before traversing it. Start at the first enabled control instead;
retain every forward/backward Tab assertion and add a nonempty-order assertion.
This corrects an expectation invalidated by the requested buttons; no game code,
assertion coverage or limits change. [Failure](../qa/rift-navigation-001/ci-keyboard-failure.txt).
All four local native reruns PASS across12 mobile profiles, retaining every
forward/backward focus assertion, scrolling, hint causality, reload and clean
shutdown check. [Receipt](../qa/rift-navigation-001/keyboard-fixed.json).
Final CI PASS on test/documentation head802ffc9e; app bytes remain2c2db6f0
and the verified signed APK0.2.62 is unchanged.

PR30 merged at `90c20a265cb3e0f8ed631f64215ec0aec2886204` after all nine required
jobs across seven workflows passed. The complete main189 scenarios and isolated
offline1 PASS. Actual CI checkout be1fabf6, head802ffc9e and integrated90c20a26
have identical tree `f96d40a685b652e104f5f9af5a5a2f4abc65c1a7`.
[Final CI/tree receipt](../qa/rift-navigation-001/ci-final.json).
Native run41119805999 attempt2 PASS on the same application bytes; only tests
and documentation changed after that APK was built. Local signed test APK is
`../builds/Lumenfall-0.2.62.apk`. No public release was created in this feature task.
Self-review and automated checks were performed; there was no independent reviewer.

The final receipt checkpoint changes documentation only; application/test blobs
retain the tested identity. All31 workflow startup contexts are checked again.
Next: physical-phone installation and visual/control feedback on the signed
test APK; record that acceptance here. Exact WebView60 and TalkBack remain open.
Keep the owner chat open until required human/device acceptance is recorded.
Workflow: [feature workflow](../project/FEATURE_WORKFLOW.md).
