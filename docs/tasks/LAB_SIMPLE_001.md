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

Current continuation — accepted-main integration, 14 November2026:

PR51, branch feature/lab-simple-001, worktree validation-evidence/lab-simple.
Main advanced first to currency7f149b89, then to Progressive Deeds/PR52 at
e67c984f7faf120818f5285175751586a1cf43cd. Both accepted changes are preserved.
Product merged cleanly. Resolved shared status, source-binding JSON and the
browser driver's option line, preserving both --simple and --deeds plus the
accepted Deeds checks automatically run after --clarity. No test gate weakened.

Current HTML SHA256:
a77593c4195844edbcf45403636d816ab6ded76fb4379145aa04e207af930c6e.
Fresh paired replay against exacte67c984f passed four8h windows per source,
115200 independent one-second calls per source. Full saved states, rewards and
all original canonical endpoint hashes match; only source binding changed.
replay-deeds.json and combined-source.json hold exact provenance. The wrapper
replay-with-evidence.cjs runs the existing replay unchanged except its receipt
destination, preserving prior QA. No balance, mechanics or save/schema changes.

Current-source local checks PASS: selection344/18 profiles; slots488/18;
clarity plus inherited progressive-Deeds checks1070; Deeds core313/17 series,
72 identities/1983 fixed Comets; all39 workflow task contexts; source syntax,
IDs/lifecycle and whitespace. Current previews/receipts bind a77593c4.

Earlier source b6860e30/af371f2e has a verified signed non-publishing Android
candidate: run43583498617, version0.2.115/code1000115. Original package/certificate,
all15 packaged assets, upgrade/both saves/paid work, updater and retail normal
launch PASS; native screenshot inspected. android-candidate/ retains exact
receipts; APK under local validation-evidence/android-lab-43583498617. It predates
the accepted Deeds merge and is historical Lab evidence, not final app delivery.

Earlier-source CI evidence stays qualified: initial48f96606 PR stateful suite
passed220 executions/190 scenarios. Its manual run had one Wisp300ms setup
timeout; all other cases passed. af371f2e Tree PR/manual first attempts timed
out before Chrome --version/contract produced DOM or any QA result; unchanged
retries passed. Its first boost-queue PR job timed out on native touch after
16 profiles; unchanged retry passed that stage. Raw reports are saved. Never
infer cause from retries or widen original deadlines to claim acceptance.

Next: finish/publish this accepted-main merge and run required PR and manual
release checks on the exact new head. Existing older-head runs are historical,
not final acceptance; launch IDs are retained. Before promotion verify main
is still e67c984f and no conflicting Android publication is active. Use normal
expected-SHA fast-forward only after required checks PASS. If main moves,
preserve and integrate its accepted changes. PR50 bond display remains separate.
Do not relaunch duplicates. Local release-lab-simple.cjs reads the baseline
from combined-source.json; supports exact-head dispatch/check/build/collect.
Collector verifies packaged bytes against the requested Git commit, allowing
historical candidate inspection while the worktree advances.

Final signed/main publication and public APK/feed verification remain open.
Physical-phone/exact WebView60 DOM/TalkBack/human design acceptance remain
unverified. Self-review/automation only; no independent reviewer or subagents.
Save final status and receipts in GitHub. Keep the task/chat open; do not archive
or claim complete while required acceptance remains missing.
