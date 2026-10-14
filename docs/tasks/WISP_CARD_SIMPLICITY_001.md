# Simpler Wisp cards

14 October 2026. Goal: clear, compact cards. Original request: simplify Ember’s
card. Follow-up: remove Raw damage/Party preview and box Wisp level. Those changes
are locally verified; retain them and the latest Best now Formation improvement.
[Initial evidence](../qa/wisp-card-simplicity-001/README.md),
[revision requirements/results](../qa/wisp-card-simplicity-001/revision/README.md).

Latest user: “The Upgrade Module should maybe be upgrade ability or something
like that, right now it hard to guess what upgrade module means”.
Use Upgrade Ability for Burst/Breaker damage and Upgrade Rewards for Gale/Thorn
resources and Amplifier Motes. Help/tutorial link these labels to permanent
Modules. No change to effects, prices, caps, saves, purchase/focus behavior or
[unfinished upgrade visibility](WISP_UPGRADE_DISPLAY_001.md). No new rules.

Baseline6c81b01 on local/full-debug, sourcee655c775; tracked checkout clean.
Untracked validation-evidence/ retained. Isolated codex/wisp-card-simplicity in
C:/Users/xarib/AppData/Local/Temp/lumenfall-wisp-card-simplicity updated to baseline.
Prior mobile/upgrades/scroll/core/Formation checks are saved in linked receipts.

Acceptance: correct labels for all8 Wisps and accessible purchase names; both
prices/effects visible; normal/200% text at320/390/430px;44px controls; no overflow.
Existing layout/upgrades checks, source/context/byte preservation/diff review;
verify exact staged/HTTP preview after serial local integration.

Status: LABEL REVISION VERIFIED, source9f382d3f. [Evidence](../qa/wisp-card-simplicity-001/labels/README.md):
layout16,344/12, upgrades12,912/12, source/context/byte preservation/V8 PASS.
Screens reviewed. Next: integrate and verify preview4174. Self-review only.
Local development mandate persists; user review,
full combined CI/GitHub/main and Android/WebView60/textZoom/TalkBack/device
acceptance remain OPEN. No remote/APK/release/archive; keep chat open.
