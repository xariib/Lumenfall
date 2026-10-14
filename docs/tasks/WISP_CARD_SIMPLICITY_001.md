# Simpler Wisp cards

14 October 2026. Original: “I dont like the view of Wisp cards, it should be
more simple.” Ember screenshot was a visual reference. Initial local milestone
49403e2, source3ebf0632, is preserved in [prior evidence](../qa/wisp-card-simplicity-001/README.md).

Latest user correction: “Is wisp power and raw damage not the same, maybe we just
can remove the raw damage and party preview. Also try to make it more simple.
The lvl of a wisp, should be inside a little box.” This supersedes the initial
requirement to retain those two readouts. Remove them from all Wisp cards; retain
Wisp Power, role-specific effects/rewards and enabled Bonds. Box the level; use
the ability name as the unfinished section heading instead of Upgrades/Ability.
Update corresponding help text.

Verified distinction: wispPower is level/rarity power; wispRoleSnapshot.rawDps
adds passive bonuses, averaged ability damage and attributable Auto-Tap. Display
removal does not change either calculation.

Baseline:49403e2 on local/full-debug, source3ebf0632; tracked checkout clean.
Existing untracked validation-evidence/ retained. Reuse isolated branch
codex/wisp-card-simplicity at C:/Users/xarib/AppData/Local/Temp/lumenfall-wisp-card-simplicity.
No concurrent tracked edits observed. Local-only development mandate persists;
GitHub/main, combined CI and Android release acceptance remain pending.

Acceptance: neither removed row on any card; boxed levels match saved levels;
no empty readout spacing; other stats/actions/prices/effects remain. Preserve
[unfinished upgrade visibility](WISP_UPGRADE_DISPLAY_001.md), completed folding,
exact purchases/progression/saves and focus/scroll. Check all8 Wisps,320/390/430px,
100/200% text, motion settings and44px controls; existing upgrade, scroll, role/
core, Formation and navigation checks. Source/context/diff review. No gameplay,
balance/save changes, new rules or remote/APK/release/archive actions.

Status: LOCAL REVISION VERIFIED, source35846c8f.
[Revision evidence](../qa/wisp-card-simplicity-001/revision/README.md):layout15,960/12,
upgrades12,912/12, scroll3229, core8099/role UI163, Formation541/12, hierarchy/
role/nav/controls PASS. Source/context/byte preservation/V8 syntax PASS.
Screens reviewed; Ember390px480→379px. Integrated9da5370 on local/full-debug;
all15 source/staged/HTTP assets match4174 ([receipt](../qa/wisp-card-simplicity-001/revision/preview.json)).
App opening queued; actual reload unclaimed. Next: user review/final acceptance.
Self-review only. Final combined CI/GitHub/main and Android/WebView60/native
textZoom/TalkBack/device acceptance remain OPEN; keep this chat open.
