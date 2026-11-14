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

Publication checkpoint: [PR51](https://github.com/xariib/Lumenfall/pull/51),
head4fb7732e026097d6a41e7a6a0d8067f79767301b; main858d713f.
Product SHA48f96606f3a69c3929701551e4c5492f98811fe769ffa3bb5fbaa0090ec0c30c.
All nine local Lab browser modes PASS (5037 positive assertions plus the
deliberate missing-confirmation failure). Final simple344/slot488 receipts
bind exact product48f96606; the others precede only equivalent CSS longhands.
Original22-scenario regression PASS after adding explicit confirmation checks
to r3-destinations; all original payment/queue/persistence assertions retained.
Replay full states/rewards/canonical vectors match; final CSS longhands preserve
identical complete script bytes. Source/context/whitespace and slot55 PASS.

First PR CI found permanent-progression-ui's immediate-switch expectation and
an oversized shared startup context. The native test now verifies the prompt
before confirming and preserves all original paid-boost/queue assertions;
local permanent488 PASS. Condensed PROJECT_STATE delivery summaries with
their evidence links/limitations retained. All39 workflow task contexts PASS,
largest checked hunt context32665/32768 bytes. Product bytes unchanged.

GitHub CLI's old credential helper path was unavailable; an invocation-scoped
working helper published code/tests. Its OAuth token lacks workflow scope;
the connected GitHub app published the reviewed test step. Local tree matches
remote4fb7732e. Required eight PR workflows are running; no merge/build/release.
Next: inspect PR51 exact-head CI; fix any failures without weakening gates;
integrate serially against current main, dispatch integrated checks, then build
and verify/publish the signed APK. Physical-phone/WebView60/TalkBack remain
unverified. Chat stays open; no archive attempted.
