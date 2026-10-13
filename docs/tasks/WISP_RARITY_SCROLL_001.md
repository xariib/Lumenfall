# WISP_RARITY_SCROLL_001

13 October 2026. Owner: this feature chat. LOCAL IMPLEMENTATION VERIFIED.
Final combined validation and Android acceptance DEFERRED; leave this chat OPEN.

## Original requirements and baseline
Fix page movement after Rarity Up, especially when the next upgrade is
unaffordable. Preserve scroll and same-card focus through purchase and periodic
refresh. Test touch/keyboard, affordable/unaffordable following upgrade, capped
state and repeated input. Preserve costs, effects, rewards, paid value and saves.
No balance, progression or save-schema change. No remote push, APK or signing.

Started from clean `local/full-debug` HEAD `86f5779`, accepted local checkpoint;
retained LAB_AFFORDABLE_ALERT_001. Read [queue](LOCAL_IMPROVEMENTS_PLAN_001.md),
[state](../PROJECT_STATE.md), [startup](../project/CODEX_START.md) and
[workflow](../project/FEATURE_WORKFLOW.md). No overlapping dirty changes, chats or
agents. Reproduction on exact baseline: touch purchase scroll1975 →704; focus
Stone →Ember because the generic disabled-control fallback picked another card.

## Implementation and decisions
Same-card enabled rarity button retains focus; an unavailable/capped upgrade
returns focus to that card's progression heading. Preserve exact main scroll and
DOM-only identity across full rendering and affordability refreshes. Explicit
focus capture supports touch WebViews that do not focus buttons on activation.
Repeated disabled pointer input keeps that fallback focused.
No gameplay decision or new binding rule was needed. Purchase/save logic untouched.

Changed: root index.html; tests/behavioral/wisp-rarity-scroll.cjs, run.cjs and
scenarios.json; this task, queue, project state and docs/qa/wisp-rarity-scroll-001.
Ignored mobile/www refreshed from current source/fonts/branding.

## Original rarity checkpoint checks and continuation
[Commands, versions and raw evidence](../qa/wisp-rarity-scroll-001/README.md).
Source hash `41a2b753db052ea22c8be3ade5002251399a188014cb5cc6c9d42a3361404b83`.
Node24.19.0 / Chrome151.0.7922.34. Focused1573/72 cases PASS and both causal
controls fail correctly. Registered scenario PASS. Existing Wisp8099, curve2798,
Support1594, Lab166, quest1081, navigation443, Wisp formula and real save reload
PASS. Source/context/identity self-test and diff checks PASS. Complete diff
self-reviewed for scope/removals; no independent review claimed.

Local checkpoint recorded in Git on `local/full-debug`; exact commit available
from `git log -1` for this task's commit. Live preview source/fonts/branding match
root bytes at http://127.0.0.1:4174/index.html; browser-panel opening queued.

Final acceptance pending: full-suite/Prism-contract deadline, previous standard
Windows dump-DOM transport limitation, remote CI/integration and Android/device/
WebView60/TalkBack. Browser results do not prove Android acceptance. No new
unrelated gameplay finding; no release/signing/remote actions. Keep task open.
Next: user reviews preview; continue FORMATION_COLLAPSE_001 from this saved local
checkpoint. Eventual final validation and device acceptance remain separate work.

## User correction — Empower
User: “Also when pressing empower and its not affordable it scrolls away, nothing
should do that”. Continued from clean ddb709d on local/full-debug. Empower
reproduced scroll1504 →697, Stone →Ember focus. Shared the exact-scroll/same-card
helper across all Wisp-card actions, including disabled touches starting outside
the card and noninteractive fallbacks for fully perfected cards. No purchase,
balance, reward, paid-value or save logic changed.

[Follow-up commands and evidence](../qa/wisp-rarity-scroll-001/actions-README.md).
Current source28e2ffeb. Registered2797 checks/168 cases PASS, including all original
rarity cases,48 Empower and48 Module/Ultimate/perfected-card cases. Both causal
controls fail correctly. Existing Wisp8099, curve2798, Support1594, Lab166,
quest1081, navigation443, formulas and real reload PASS on current source.
Source/context/diff review and exact live preview assets verified. Extra changed
files: existing product/test/task/state/queue and actions-* evidence. Self-review
only. Local checkpoint committed on local/full-debug; latest feature commit is
the continuation baseline. Required full/transport/Android acceptance stays OPEN.
Next: refresh/review preview, then task3 can continue from this local checkpoint.

## Second user correction — live preview
User still reported unaffordable Empower jumping. Started clean ac7ca7c. Both
open tabs initially ran the older rarity-only script. Refreshed both, then a
longer live check found a second problem: scroll884 stayed fixed while Ember's
button shifted from285.890625 to262.390625. Earlier scroll-only acceptance was
incomplete. A production-DOM baseline reproduces19.5px movement during a full
background Wisp refresh.

Compensate for changed layout above the same action during passive full/role
updates. Use layout offsets to exclude reward pulses; retain original exact-scroll
purchase checks and capped fallbacks. Purchase/save/balance code unchanged except
explicit UI-render mode arguments. No tests weakened.
[Final commands and evidence](../qa/wisp-rarity-scroll-001/role-README.md).
Source2fa40008:3229 registered assertions, all168 prior cases plus144 refresh
transitions with mouse/touch/Enter PASS. Three causal controls fail as expected.
Existing Wisp8099/curve2798/Support1594/Lab166/quest1081/navigation443, formulas
and actual reload PASS. Both already-open preview tabs were reloaded and their
complete scripts hash-match current source; source/assets staged and HTTP-verified.
Self-review only; final full/Prism/transport/Android acceptance remains OPEN.
Verified implementation checkpoint: `9ad4b6f` on `local/full-debug`.
No remote/APK/signing actions. See the current handoff below for remaining work.

## Saved local handoff and deferred combined acceptance

User decision: save this verified local implementation, record outstanding checks,
leave this chat open, and handle final combined validation and Android acceptance
after the improvements. This supersedes any earlier suggestion to wait for those
release checks before continuing the local improvement queue.

Implementation is saved in commit `9ad4b6f4d6e80416324152bd1c7ac22bd1465eb5` on
`local/full-debug`, source SHA-256
`2fa400081743625d1f4cc6bda176ca299615950d38739d839098d6e12742764c`.
[Source-bound commands and receipts](../qa/wisp-rarity-scroll-001/role-README.md)
record 3,229 focused assertions and the relevant preservation checks passing.
This documentation checkpoint changes no product or test code.

Failure assessment: **no known unresolved failure introduced by this task remains
in the verified implementation**. An intermediate anchoring variant introduced
a repeated-affordable-rarity scroll regression; the original assertion caught it
and it was fixed before 9ad4b6f. Earlier iterations also missed the background
visible-position defect, which was reproduced and corrected. Expected failures
of the three causal mutations demonstrate coverage; they are not final-source
failures. This scoped evidence does not certify unrun combined or Android checks.

| Remaining check | Status and next action after the improvements |
| --- | --- |
| Final combined source, complete behavioral suite and applicable CI gates | Not run on the final combination. Run against its exact checkpoint/assets, retaining all gates. |
| Prism-contract completion deadline | Inherited unresolved limitation, recorded before this task. Diagnose/recheck in combined validation; do not raise deadlines merely to pass. |
| Standard Windows dump-DOM transport | Inherited timeout limitation. Recheck/resolve the standard transport; saved CDP adapter results are alternative evidence, not a standard-gate PASS. |
| Android app/device acceptance | Not performed here. Later verify the combined app/assets, package/signing identity, installed device behavior, WebView60 and accessibility/TalkBack. Browser PASS does not establish these. |
| Remote integration/CI and release delivery | Not performed in this local-only task. Handle only within the later combined delivery authorization; no APK release or new signing key is authorized here. |

At this handoff, FORMATION_COLLAPSE_001 has uncommitted product/test work in the
same checkout. It was not modified, staged or included in this task's verification.
Continue from the latest accepted improvement checkpoint, preserving those edits;
recheck the Wisp regressions on the eventual final combined source. No known
remaining Wisp-specific fix is identified in 9ad4b6f. Keep this chat open; do not
archive it. Final combined validation and Android acceptance remain deferred.
