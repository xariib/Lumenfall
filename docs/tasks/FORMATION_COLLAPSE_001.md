# FORMATION_COLLAPSE_001

14 October 2026 user correction: fully remove the Formation contribution panel
and make Formation Bonds & guidance a box like the former Contribution card.
This supersedes the earlier request to collapse Contribution. Preserve the
existing Bonds disclosure, all gameplay/calculations, per-Wisp readouts and saves.
Keep the chat OPEN; final combined validation/Android acceptance comes later.

Baseline: local/full-debug HEAD89337a5; source SHA-256
f3321623ea6189502d56f4030df18c350f89e021727fe94dd92fe3213d2c4b7a.
Product tracked files clean on entry; unrelated validation-evidence untracked.
Later WISP_CARD_SIMPLICITY_001 untracked docs/evidence preserved, not staged here.
No agents, remote, APK, signing or archive actions.
[Queue](LOCAL_IMPROVEMENTS_PLAN_001.md), [state](../PROJECT_STATE.md),
[earlier decisions/checkpoint](../qa/formation-collapse-001/bonds-box/prior-task-checkpoint.md).

Implementation: remove Contribution markup, CSS, event handler and aggregate
rendered HTML. Keep report calculations and individual Wisp readout refreshes.
Reuse stable native details/summary for Bonds, with matching card/inner border,
background, rounded corners and Expand/Collapse text. Default closed; keyboard/
touch and choice/focus survive role/full/periodic renders and formation changes.
Update the Encyclopedia entry pointing to the removed panel.
Tests replace only superseded Contribution UI expectations; core preservation,
per-Wisp input/readout/contrast/fit checks and registered full-run gate retained.

Status: local candidate verified; final combined/native acceptance pending.
Source SHA-256 db2f6dbaad6cd8d894ea896b3c18aa353dbc70d37f79606a46e16206493e4efa.
Files: index.html; formation-collapse.cjs and wisp-contribution-mobile.cjs under
 tests/behavioral; this task, project state and local evidence. Current source/
fonts/branding staged in ignored mobile/www and preview4174 refreshed on Wisps.
[Evidence/commands/screens](../qa/formation-collapse-001/bonds-box/README.md).
Node24.19.0/Chrome151.0.7922.34; mobile541/12, core8099+preservation8592,
Wisp mobile151/12, scroll3229, Formation8/6 controls/autosave133, navigation415,
real save/reload and source validation PASS. Reset-choice control fails as expected.
Self-review only. No known task-introduced product failure in scoped checks.

Remaining: final exact combined full behavioral/required CI gates; rerun this
revised Formation gate, Wisp/core/mobile, autosave/save/recovery/navigation and
all other affected improvements on final bytes. Resolve or disposition inherited
Prism/Wisp/Rift/offline deadlines, missing Guidance baseline, Windows dump-DOM/
POSIX tooling limitations without weakening assertions. Refresh/verify final
mobile assets; later authorized Android build/package/version/existing signing,
installed-device touch/keyboard/textZoom/WebView60/TalkBack acceptance and remote
integration/release evidence. Browser PASS does not establish Android acceptance.

Next: user reviews the revised preview; continue improvements in their owner
chats, then return to final combined acceptance. Keep this chat unarchived.
