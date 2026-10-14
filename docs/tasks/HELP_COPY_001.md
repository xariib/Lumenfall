# Encyclopedia and How to Play accuracy

14 October 2026. User: “Please check the Encyclopedia and How to Play aswell,
and fix anything that does not make sense or match how the game works now.”

Goal: audit both in-game help surfaces against the current local game, correct
outdated/confusing descriptions, and fill material omissions needed to explain
existing features. No gameplay, balance, purchase, save or input-policy changes.

Baseline: `c834e16` on `local/full-debug`, product SHA-256
`b6b860e7bbc32ac35646d97db84008335dc4a7f2036516792ee6dca3003863b6`.
Tracked checkout clean; existing untracked `validation-evidence/` is preserved.
Continue this owner's sequential local work after [Fair Play](FAIR_PLAY_COPY_001.md).
Read [current status](../PROJECT_STATE.md), affected help/rendering code and
current feature requirements before editing. GitHub/main/combined release remain
pending under the existing local development mandate.

Acceptance: verify every displayed currency/Wisp/Bond/mechanic and tutorial
step against implemented formulas, unlocks and reset rules; use plain English and
current UI labels; preserve all help navigation/focus, game rules and player saves;
validate source/context and review the full diff. Use relevant existing Settings,
tutorial/accessibility and navigation regressions plus browser visual checks.
Save source-bound findings/evidence and stage the exact updated preview.
Modern Chromium checks do not establish Android/WebView60/TalkBack acceptance.

## Local checkpoint

Status: LOCAL IMPLEMENTATION VERIFIED; final delivery acceptance OPEN.
Source `f3321623ea6189502d56f4030df18c350f89e021727fe94dd92fe3213d2c4b7a`.
[Findings and receipts](../qa/help-copy-001/README.md) record the currency-source
corrections, current Forge/charge/role effects, Farm fresh-enemy behavior,
Ascend reset/preservation, Lab/speed queues, manual Tree purchases, Deed automation,
Comet commands, retained upgrade paths and save protection. Six tutorial pages;
29 mechanic entries plus all existing eight Wisps/eight Bonds/six currencies.
The prior Fair Play offline-rate card was also clarified after verifying that
new Lab rate purchases are retired, while previous bonuses remain.

Baseline large-text Wisp/header clipping reproduced; six small help CSS changes
fix wrapping and status layout. Full diff self-reviewed; all product bytes outside
four help arrays, two description helpers and those six CSS rules match baseline.
Gameplay, balances, saves, purchase logic, unrelated UI and assets are unchanged.
Only this owner is active; related local chats were idle/not loaded. No concurrent
tracked changes were overwritten; existing raw validation evidence is preserved.

Final checks: source/context/whitespace PASS; supplemental real-browser457/12
profiles/all51 Encyclopedia cards/six tutorial steps/owned effects/full state and
both exact save slots PASS. Existing control/accessibility, navigation and
Settings/save-backup12 profiles PASS on final staged bytes. Both scripts parse in
existing Node8.3.0/V8 6.0. Modern Node24.19.0 and Chrome151.0.7922.34. Representative
normal/large-text screenshots visually reviewed; self-review only.

Changed files: `index.html`, this task, the new PROJECT_STATE entry, and scoped QA
audit/inspection/results/logs/screenshots. Existing tests/gates are unchanged.
All15 source/staged/HTTP assets match http://127.0.0.1:4174/index.html. App opening
returned queued; no loaded/reloaded visible user-tab claim. Reload for new help.

No new binding rule, remote/APK/release action, other-chat message or delegation.
GitHub/main/full combined CI and Android/WebView60/native textZoom/TalkBack/device
acceptance remain pending under the existing local debug/release scope. Preserve
inherited deadline/missing-baseline/Windows-tooling limitations and final oracle
source-stamp requirements. Next: user review of Encyclopedia/How to Play, then
combined integration/release acceptance when available. Keep this chat open.
