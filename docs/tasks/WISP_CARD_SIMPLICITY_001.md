# Simpler Wisp cards

14 October 2026. User: “I dont like the view of Wisp cards, it should be more
simple.” Attached Ember card shows stacked bordered panels, repeated headings,
vertical prices and tall locked actions. The image is a visual reference.

Goal: simplify the existing Wisp card hierarchy, panels and purchase layout.
Keep names, roles, levels, power, rarity, contribution readouts, ability effects,
Module progress, all actions/prices and prerequisite reasons available.
Preserve [unfinished upgrades visibility](WISP_UPGRADE_DISPLAY_001.md), exact
purchase rules, focus/scroll, saves, accessibility and completed-card folding.
No gameplay/balance/save changes or new binding rules.

Baseline: `89337a5` on `local/full-debug`; tracked checkout clean. Existing
untracked `validation-evidence/` is unrelated and preserved. Only one local
worktree is registered; no concurrent tracked edits observed. Continue the local
candidate described in [project status](../PROJECT_STATE.md) and the
[local improvement plan](LOCAL_IMPROVEMENTS_PLAN_001.md); GitHub access/combined
integration and release acceptance remain pending. No remote/APK action planned.

Acceptance: reduce nested boxes and repeated headings; show compact readable
prices beside actions with responsive wrapping. Unfinished tracks remain open.
Check 320/390/430px, normal/200% text and normal/reduced motion; touch targets at
least44px, no card overflow. Run existing Wisp upgrades/scroll/contribution and
navigation coverage, source/context validation. Review screenshots and full diff.
Stage exact source for the existing playable preview. Modern browser checks do
not establish Android/WebView60/textZoom/TalkBack/device acceptance.

Isolation: concurrent Formation UI edits appeared after the clean startup.
Implementation is isolated on `codex/wisp-card-simplicity` in
`C:/Users/xarib/AppData/Local/Temp/lumenfall-wisp-card-simplicity`, from `89337a5`.
Shared Formation/product/test edits remain untouched. Integrate serially only
after that owner commits; an isolated preview can be reviewed independently.

Status: LOCAL IMPLEMENTATION VERIFIED; delivery acceptance OPEN. Rebased onto
committed Formation `c16fc35` without conflicts. Final source `3ebf0632`.
[Evidence and exact source hashes](../qa/wisp-card-simplicity-001/README.md):
final layout17,592/12 profiles; combined upgrades12,912, scroll3,229, core8,099,
mobile151/12, Formation541/12, hierarchy/nav/controls PASS. Byte preservation,
source/context/whitespace and actual V8 6.0 parsing PASS. Node24.19.0/Chrome151.
Normal/200% screens reviewed; Ember390px635→480px. Self-review only.
Only accessible names changed after combined checks; final layout rechecks them.
Integrated locally at `57b99ce` on `local/full-debug`; all15 source/staged/HTTP
assets match4174 ([receipt](../qa/wisp-card-simplicity-001/final-preview.json)).
App opening queued; actual user-tab reload unclaimed. Next: user preview review,
then final combined acceptance. Full combined CI/GitHub/main and Android/
WebView60/textZoom/TalkBack/device acceptance remain pending. No remote/APK/archive.
