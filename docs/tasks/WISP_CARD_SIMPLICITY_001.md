# Simpler Wisp cards

14 October 2026. One goal: clear compact cards. Preserve earlier user decisions:
no Raw damage/Party preview, boxed Wisp levels, one ability name with upgrade
count, clear purchase labels. [History](../qa/wisp-card-simplicity-001/README.md).

Latest user: “MAke a little boks like the lvl box left side of the Ability, so
its easy to see its an ability. I dont understand the upgrade rewards here at
gale dancer?” Gale screenshot shows unrecruited0/20 and Recruit first.
Add an Ability badge matching the level box immediately left of each ability
name. Replace generic Upgrade Rewards with Upgrade Shards (Gale), Upgrade Lumen
(Thorn), Upgrade Motes (Tide/Aurora); retain Upgrade Ability for damage roles.
Update help/tutorial. Verified moduleMult=1+level*0.05 and abilityRewardRaw:
Gale levels raise Shards per cast, not its hit; recruiting remains required.

Baselinee9db86e/source43e158bb; tracked local/full-debug clean, untracked
validation-evidence/ retained. Reuse isolated codex/wisp-card-simplicity at
C:/Users/xarib/AppData/Local/Temp/lumenfall-wisp-card-simplicity.
No concurrent tracked edits observed. No effects, prices, caps, purchases,
progression/save or Formation changes. No new rules.

Acceptance: all8 badges boxed and left of ability names; role-specific labels/
accessible names, all prices/effects and eligibility correct. All8 Wisps at
320/390/430px,100/200% text/motion;44px controls, no clipping. Existing layout/
upgrades and source/context/preservation/diff review. Preserve
[unfinished visibility](WISP_UPGRADE_DISPLAY_001.md), folding and focus/scroll.

Status: BADGE/REWARD REVISION VERIFIED, sourcedfa26453.
[Evidence](../qa/wisp-card-simplicity-001/ability-badge/README.md):layout18,072/12,
upgrades12,912/12, scroll3229, source/context/preservation/V8 PASS. Gale normal/
200% screens reviewed. Next: serial integration and exact preview4174 receipts.
Prior checks remain saved. Self-review only. User/final CI/GitHub/main and Android/
WebView60/textZoom/TalkBack/device acceptance OPEN. Local-only mandate;
no remote/APK/release/archive. Keep this chat open.
