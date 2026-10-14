# Simpler Wisp cards

14 October 2026. One goal: clear, compact Wisp cards. Earlier user decisions:
remove Raw damage/Party preview, box Wisp levels, use Upgrade Ability/Rewards.
Preserve these and Best now Formation. [History](../qa/wisp-card-simplicity-001/README.md).

Latest user: “The ability is called Nova burst on Ember wisp, then its saying
overcharge core and upgrade ability? isnt it a little clutter”. Show one ability
name; remove the secondary Module identity from cards. Put Upgrades0/20 beside
the ability name and keep the existing effect, purchase label and both prices
below. Shorten descriptions that repeat upgrade information. The level is upgrade
count, not an assertion that the base ability starts locked. Internal catalog/
Module save identities remain. No effects, balance, prices, caps or save changes.

Baseline45fb848/source9f382d3f; local/full-debug tracked clean, untracked
validation-evidence/ preserved. Reuse isolated codex/wisp-card-simplicity at
C:/Users/xarib/AppData/Local/Temp/lumenfall-wisp-card-simplicity.
Prior source-bound checks: [labels](../qa/wisp-card-simplicity-001/labels/README.md).

Acceptance: all8 Wisps have one ability identity with correct upgrade progress;
no secondary Core/Lens/Catalyst/Focus names. Keep exact purchases/focus/scroll,
completed folding and [unfinished visibility](WISP_UPGRADE_DISPLAY_001.md).
Check320/390/430px,100/200% text/motion,44px controls, layout/upgrades/scroll and
related role/text checks. Keep causal negative coverage after changed text.
Source/context/preservation/diff review; integrate serially and verify preview.

Status: ONE-NAME REVISION VERIFIED, source43e158bb.
[Evidence](../qa/wisp-card-simplicity-001/one-name/README.md):layout16,920/12,
upgrades12,912/12, scroll3229, hierarchy/roles/text253 and causal negative PASS.
Source/context/byte preservation/V8 PASS; screenshots reviewed. Integrated55acf1a
on local/full-debug; all15 source/staged/HTTP assets match4174 ([receipt](../qa/wisp-card-simplicity-001/one-name/preview.json)).
App opening queued, reload unclaimed. Next: user review/final acceptance.
Self-review only. User/final combined CI/GitHub/main
and Android/WebView60/textZoom/TalkBack/device acceptance remain OPEN.
Local-only mandate; no remote/APK/release/archive. Keep chat open.
