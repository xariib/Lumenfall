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

Initial Windows dump-DOM duration run timed out without a QA result. Using the
existing CDP transport/native driver for deterministic local acceptance; not a
game failure or permission blocker. Full regression and CI remain pending.

Status: implemented, acceptance/integration pending. Next: finish existing Lab
regressions, publish the reviewed change, verify CI/integration and app delivery.
Phone/WebView60/TalkBack/human acceptance remains unverified. No archive.

References: [Lab controls](LAB_SLOTS_QUEUE_SPEEDUP_001.md),
[Speed Up design](LAB_SPEED_DESIGN_001.md),
[feature workflow](../project/FEATURE_WORKFLOW.md).
