# Consistent Lab countdown layout

User request (4 November 2026): fix the supplied mobile screenshot's Lab timers,
which alternate between one and two lines. Use one consistent, attractive size.
Owner: this chat; no subagents. Scope: running Lab countdown presentation only.

Baseline: origin/main 2ca3d3be, clean source checkout. Isolated worktree/branch:
lab-timer-layout-001 / fix/lab-timer-layout-001. Open PR search found no overlapping
Lab implementation. Existing wrapping comes from auto-height progress tracks and
an unrestricted label containing duration, "remaining" and the multiplier.

Plan: full-width fixed-height progress track, single-line compact clock with days
and seconds, tabular digits and consistent font size. Queue and Speed Up follow
below. Preserve full spoken duration in the progress bar's accessible value.
Preserve paid work, boosts, queues, timing, saves and all other game mechanics.
No new binding rules or save migration.

Acceptance: short/hour/day timers retain equal height/font size with no wrap or
clipping at 320/390/430px and 100/150/200% text; seconds and boost speed update;
existing timing, queue, modal and keyboard checks pass. Inspect actual screenshots.

Implementation: index.html uses a 44px full-width timer, 0.8125rem tabular digits,
and a compact day/HH:MM:SS or MM:SS label. Full wording remains in aria-valuetext.
Existing test expectations follow the new visible format; simulation assertions
are retained. Slot matrix now checks the three supplied countdown lengths.

Checks: Node24.20.0 / Chromium156.0.8078.80, mobile matrix PASS488 checks across
18 profiles (320/390/430px,100/150/200% text, both motion modes). The same layout
assertion fails on unchanged main, reproducing the reported defect. Actual390px
and320px/200% screenshots visually inspected. Source validation and diff check PASS.
[Mobile receipt](../qa/lab-timer-layout-001/mobile.json),
[baseline failure](../qa/lab-timer-layout-001/baseline.json),
[preview](../qa/lab-timer-layout-001/timers-390-100.png).
Additional longest-duration check PASS at320px/200% text:100-day,15-day and
99-day/1.5x timers retain44px height and fit without clipping (maximum252px label
inside272px track). [Receipt](../qa/lab-timer-layout-001/max-duration.json).

Initial Windows dump-DOM duration run timed out without a QA result. Using the
existing CDP transport/native driver for deterministic local acceptance; not a
game failure or permission blocker. A standalone CDP run completed all92 duration
assertions but hit its existing browser-close deadline; likewise the320px standalone
Lab run hit browser-close while390/430 passed. No harness deadline was changed.
The existing native regression driver subsequently passed all22 scenarios, including
both duration modes,22 boundaries, two causal controls, queues, paid boosts,
reload/recovery and navigation, with clean process teardown. Native Lab input also
passed1212 UI checks across6 profiles with clean teardown.
[Regression receipt](../qa/lab-timer-layout-001/regression.json),
[native receipt](../qa/lab-timer-layout-001/native.json.gz).

Pinned Node24.19.0 paired offline replay PASS: all four complete states and reward
triples match accepted main2ca3d3be after115200 independent one-second calls per
source. Only the oracle source binding changed; accepted canonical vectors and
the pre-existing platform/full-hash qualification are retained unchanged.
[Replay receipt](../qa/lab-timer-layout-001/replay.json). Product SHA256:
ebcbbda4c64e7fdb356ff1fa67c36ebb38128352f2f62135a7eb079eb69b07cf.

[PR34](https://github.com/xariib/Lumenfall/pull/34), implementation e795dce59059.
[Non-publishing signed Android test build](https://github.com/xariib/Lumenfall/actions/runs/41819353920)
PASS on those product bytes: Android0.2.76/code1000076, established certificate,
package com.lumenfall.app, origin https://localhost. Installed Android12/API31/
WebView91 upgrade retains UID, both saves, paid work and legacy entitlements;
native updater download/cancel/restart/tamper/system-install checks PASS.
Downloaded artifact digest matches GitHub; APK digest, all15 packaged assets and
source-bound native receipts independently checked locally.
[APK verification](../qa/lab-timer-layout-001/android.json),
[upgrade](../qa/lab-timer-layout-001/android-upgrade.json),
[updater](../qa/lab-timer-layout-001/android-updater.json).
APK: ../builds/lab-timer-layout-001/verified/Lumenfall.apk outside the repository.
No public release. Physical phone, exact WebView60 and TalkBack are not claimed.

Prior CI head da76c317ad81249f60e32942bba7859ceb37ffa8 has the same product bytes
and tree ac394460506184cee5ef3598b55a501973b39803 as reviewed local commit e27e729.
Git push/ref operations encountered GitHub server errors; Git Data blobs/tree/
commit plus a non-force REST ref update saved the exact tree. Local branch was
aligned only after verifying identical trees. Prior runs: pre-merge41820146342,
Lab41820146328, Forge41820146304, Tree41820146270, Comet41820146267,
shared UI41820146337, permanent41820146284. Pre-merge stopped at the startup
context gate for RIFT_HINT_READABILITY_002, after the preceding product checks
passed. Baseline main2ca3d3be was already33049 bytes against the unchanged32768
limit; the new status entry added to it. Condensed historical PROJECT_STATE
summaries while preserving links/requirements/evidence; all32 CI task contexts
now PASS, largest32585 bytes. No test/checker/budget change.
[Failure](../qa/lab-timer-layout-001/ci-context-failure.txt),
[all task contexts](../qa/lab-timer-layout-001/context-gates.json).
Final CI head8577aa8767ce6d73fcfcc9794df826512afdc596 PASS: all seven workflows,
nine jobs,190 main +1 isolated behavioral scenarios and mobile runtime smoke.
Node24.19.0. [CI receipt](../qa/lab-timer-layout-001/ci-final.json),
[behavioral console](../qa/lab-timer-layout-001/ci-behavioral.txt),
[isolated log](../qa/lab-timer-layout-001/ci-isolated.log.gz).
PR34 merged57fd7ab365364c74b0e8061bd0b886577880cf59. Integrated tree
80fd7e4e7210c1a3d0f2871a511d91518e356022 exactly matches tested head; product
hash remains identical to the verified signed APK. Follow-up contains only
documentation/evidence, with all32 task contexts checked again.
Self-review/automation only.

An interrupted whole-repository test staging copy remains at the local temporary
folder lumenfall-behavioral-4QuuI1. Automatic approval review rejected its verified
scoped cleanup with only "blocked by policy". Product work is unaffected.

Status: integrated; local, CI and signed emulator upgrade/updater acceptance PASS.
Preview/test APK delivered; no public release. Next: physical phone, exact
WebView60 and TalkBack/human review when available. Those remain unverified;
the chat stays open and is not archived.

References: [Lab controls](LAB_SLOTS_QUEUE_SPEEDUP_001.md),
[Speed Up design](LAB_SPEED_DESIGN_001.md),
[feature workflow](../project/FEATURE_WORKFLOW.md).
