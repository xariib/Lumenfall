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

Combined-source continuation — 14 November 2026:

[PR51](https://github.com/xariib/Lumenfall/pull/51), branch feature/lab-simple-001,
worktree validation-evidence/lab-simple. Initial published source07f9807f
passed all focused PR/release workflows; its two full stateful suites were
still running when main advanced. Those results are historical evidence,
not final acceptance of the combined page. Earlier launch IDs are retained in
prior-source-release-launch.json. No APK for the Lab has been published.

Accepted main7f149b895c9f90656bbb81766249665ed1f426fc (currency header/PR49)
merged into this feature. Product merged cleanly; resolved only shared status
and the full-page oracle source binding. Combined HTML SHA256:
af371f2e9d149826266309f1d3f587f8e2f2cf4014c5fc0c32989c12232c87c6.
Every script byte equals the verified Lab candidate48f96606, and the incoming
currency scripts equal original baselinece51bc14. Complete progression inputs
and canonical vectors are unchanged; combined-source.json records this proof.
Only the full-page source binding changed. No gameplay/balance/schema change.

Combined native-browser selection344/18 profiles, slots488/18 and currency
layout1776/16 PASS; all39 task contexts and syntax/IDs/lifecycle/whitespace PASS.
Current simple/slots receipts and previews bind the combined page. Other local
receipts and saved CI logs retain their actual earlier source/version. Actual
V8 6.0 checks580 passed on the identical script bytes. No gate/deadline weakened.

Prior CI findings: permanent-progression UI needed the new confirmation step;
its original paid-work/boost assertions remain. Shared startup was condensed
with all evidence links retained. Wisp PR Linux attempts timed out before
Browser.getVersion and at its unchanged300ms negative-control setup ceiling;
raw receipts are saved. The third unchanged PR attempt and manual Wisp passed
both platforms. Do not infer a root cause from passing retries.

Next: commit/publish the combined merge, run required PR and manual release
workflows on that exact head, and collect final source-bound results. Before
promotion recheck main and active builds; use a normal expected-SHA fast-forward
only if its accepted baseline is still current. If main moves, preserve and
integrate its accepted changes. Other active UI PRs50/52 remain separate.
No subagents or chat messages used; do not overwrite other worktrees.

The currency owner has a separate queued Android diagnostic run43581066569
(0.2.114, branch c737fd3e). Its native acceptance helper is unmerged; do not
import an unverified candidate or claim its acceptance for this Lab source.
Build/publish our signed APK only after required exact-source CI and the shared
release path pass. Local helper validation-evidence/release-lab-simple.cjs
supports check/build/collect; update its candidate guard to the accepted main
baseline before dispatch. Do not launch duplicate workflows. Save all final
status/evidence in GitHub. Physical-phone/WebView60/TalkBack/human review remain
unverified; keep this task/chat open and do not archive or claim complete.
