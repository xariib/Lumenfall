# Simpler Lab layout and direct research selection

User request, 14 November 2026: simplify the Lab, integrate the timer,
Speed Up menu entry and Queue button; remove the separate Select research
button. Clicking a research card starts it immediately in an empty slot.
When replacing ongoing research, ask whether to start the selected research.

Owner: this chat, no agents. Scope: Lab presentation and selection only.
Baseline: origin/main 858d713f (Android 0.2.111); no open PRs returned by
the connected GitHub query. Isolated branch feature/lab-simple-001 at
validation-evidence/lab-simple. Other feature worktrees remain untouched.

Preserve all five slots/unlocks, prices and affordability colors, paid work,
slot boosts and both queues, research effects, chronological simulation,
offline behavior, saves/recovery and Android identity. No balance/schema change.

Acceptance: timer/Queue/Speed Up share one compact panel; research cards
are keyboard and touch operable without a separate Select research button;
empty-slot choices start directly; occupied-slot choices ask for confirmation;
Cancel/Escape never spend or replace work; confirmed switches preserve paid
work and slot boosts. Revalidate affordability when confirming. Verify narrow
mobile widths and enlarged text, focus return, menu behavior and existing Lab
regressions. Required CI and Android delivery remain open until verified.

References: [previous timer](LAB_TIMER_LAYOUT_001.md),
[slot contracts](LAB_SLOTS_QUEUE_SPEEDUP_001.md),
[speed controls](LAB_SPEED_CONTROLS_001.md),
[feature workflow](../project/FEATURE_WORKFLOW.md).

Implementation: one progress panel contains countdown and Queue/Speed Up;
native full-card buttons replace separate catalogue actions. Empty slots start
directly; occupied slots open a focus-trapped confirmation with live prices,
Cancel/Escape and a checked start transaction. Saved paid work resumes free.
No simulation, price, unlock, boost or save schema changes.

Baseline: context PASS; queue continuity 64, slot contracts 55 and original
mobile slot/menu matrix 488 PASS before edits. Restricted Chromium startup
failed; normal Chromium access outside the sandbox passes. Node24.22.1,
Chromium157.0.8103.79. Candidate receipts are in
[QA evidence](../qa/lab-simple-001/simple.json): direct selection344,
slot/menu488, card clarity524, expansion290 and access890 PASS. Original
queue64, boosts1480 and slot/card417 core checks also PASS. Full-source replay,
remaining Lab regressions, CI and Android acceptance still in progress.
Actual390px normal/enlarged screenshots inspected; layout remains within
320/390/430px at100/150/200% text and both motion settings.

Changed files: index.html; affected Lab browser expectations/new selection
scenario and transport option; pre-merge workflow; this task/QA receipts and
source binding after verified replay. Existing acceptance checks retained.
No new binding rules. Self-review and automated checks only. Status: open.
Next: finish local regressions/replay, publish branch/PR, pass required CI,
integrate serially against current main and verify signed Android delivery.
