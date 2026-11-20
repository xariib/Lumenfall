# WISP_CARD_REDESIGN_001 — character cards without nested expanders

Status: published0.2.150; external acceptance pending. Owner: this chat.

## User correction — 20 November 2026

"Look at dribbble for some good game cards, i don't like the wisp game cards
right now, too much information, to much expanding menus which I don't like."
This supersedes the prior Wisp-card disclosure design. Follow through on a
concrete simpler UI; preserve the delivered gameplay changes and player saves.

## Baseline and scope

Main f998d30800a841d1800867971de62ef07527e8c0, public Android0.2.148,
product SHA25639199dfe5160773e0fb1300878b4119183a7a6e071871135699982b284759bd4.
Isolated branch feature/wisp-card-redesign-001 at C:/lf-wisp-cards. Original root
checkout is an older feature; do not edit or reset it. Prior C:/lf-gameplay
outputs remain untouched. Only open PR63 is separate Google Play preparation;
no overlapping Wisp UI work found. No gameplay, balance, save-schema or native
identity change is authorized by this visual redesign.

Read [current delivery](WISP_GAMEPLAY_PACING_001.md),
[earlier card requirements](WISP_CARD_SIMPLICITY_001.md),
[action hierarchy](WISP_ACTION_HIERARCHY_001.md),
[startup](../project/CODEX_START.md) and [workflow](../project/FEATURE_WORKFLOW.md).
The released card has separate Damage details, Upgrades and How it works
expanders, with288–292px default height at320px and much denser expanded cards.
The user's correction rejects this interaction, not the underlying upgrades.

## Research and design direction

Visually inspected the actual Dribbble images for:

- [UI Gaming Cards — Mohamed Mustafa](https://dribbble.com/shots/14286232-UI-Gaming-Cards): character-led hierarchy and restrained identity/stats.
- [Game Character Illustrations — Smashing Stocks](https://dribbble.com/shots/25442101-Game-Character-Illustrations): distinct portraits and consistent short metadata.
- [Kitties — Vlada Savchenko](https://dribbble.com/shots/20884259-Kitties-Cute-Card-game): glanceable character/rarity/ability framing.

Use these as layout inspiration only; retain original Lumenfall SVG art and
navy/gold/violet identity. No copied reference artwork, gacha or new mechanics.
Use compact portrait-led roster cards with name/level/rarity/DPS, clear
Empower/Recruit and Field/Bench controls. One focused management view exposes
the existing upgrades and explanations in a flat layout, without card
accordions or nested disclosure navigation. Preserve explicit prices/effects,
prerequisite explanations, red missing currencies and disabled purchases.

## Acceptance and validation

No details/summary expanders inside Wisp cards. Less visible roster information
and materially shorter cards than the released baseline at normal mobile text.
All eight identities, purchases, gates, ability/rarity/Ultimate/Mastery/Resonate,
Auto-Empower, Formation, contribution/damage information and paid progression
remain reachable. Completed abilities keep gold without arrow/Maxed text;
Empower stays Empower. No transient activation highlight. Preserve keyboard
focus,44px touch controls, scroll/back navigation, live updates,320/390/430px
and enlarged-text layouts, WebView60-compatible behavior and save recovery.

Capture before/after screenshots and focused UI/native interaction evidence.
Keep existing purchase/persistence assertions; reconcile only intentionally
superseded layout/navigation assertions. Compare protected gameplay code and
source-bound offline reference, run relevant existing checks/required CI,
review the complete diff, and follow integrated Android/update delivery checks
if shipping the app change. Self-review is not independent human review.

## Delivered — 20 November 2026

Status: integrated and published0.2.150; physical-device/Google/human acceptance
remains open. No archive or independent-review claim. No new binding rule.

[PR65](https://github.com/xariib/Lumenfall/pull/65) merged at
c455dbf3d4ad03942fb5c593562e561ecb80387b from2978e56f2141bf92458c21c98f01ecc5593c68dd.
The integrated tree exactly matches the tested candidate. Final product SHA256
b24494d6f4a4833c83922467e141454174efb9cbe4866e8d9e5ef7ebc45c805e.
No gameplay, balance, save schema, original artwork, Android product code or
workflow definition changed. Other checkouts and Google Play PR63 untouched.

Roster cards are176px at320px normal text, versus288–292px before. Original
portraits lead short name/role/level/rarity/DPS, Field/Bench, Empower/Recruit and
Manage. One selected Wisp gets a flat management screen; Back/Escape restores
roster/focus/exact scroll. All Wisp-tab details/summary expanders are removed.
Ability explanations and all existing rarity/ability/Ultimate/Mastery/Resonate,
Auto-Empower, Formation, damage information and purchases remain reachable.
Gold completed states, missing-resource red, disabled prices and native input
remain. Scoped45px controls retain44px through the existing entrance animation.

Both candidate and exact integrated main pass all nine workflows. Main acceptance
is190 unique cases/220profile executions plus1 separate isolated offline case.
[Integrated workflow IDs/logs](../qa/wisp-card-redesign-001/integrated-validation.json),
[actual main coverage](../qa/wisp-card-redesign-001/local/integrated-main-coverage.json).
Local compact42570checks/18profiles plus redesign1182/12 and two causal controls
PASS. Formation457/12, guidance889/72cases/12profiles PASS. All636 protected
functions and catalogs match148; independent four historical and four current
one-second8h windows plus whole-window reference PASS. Shared fixtures SHA256
3f7ca9f5c74034cd42ac242385f62d94776feb5e26e98be7f7059baadaeae8f2 unchanged.
Local Node24.22.1/Brave158, CI Node24.19.0 (Tree20), Android build Node22.

[Android0.2.150](https://github.com/xariib/Lumenfall/releases/tag/android-1000150),
versionCode1000150, build44755733048, integrated sourcec455dbf3. APK SHA256
bc18ef4bcc3e640818412ac1a69a24ec53fccfa507c02727573231e6b35123b0.
Stable package com.lumenfall.app, https://localhost and established certificate
A9:1C:BF:34:27:D2:CE:B1:CD:BE:07:E5:22:5F:17:D4:71:B1:82:9E:52:F7:AB:66:49:7E:75:49:75:AD:3E:21.
Native Android12/WebView91 all8 Manage/Back routes, actual Ability10→11 purchase,
visible prices/effects,176px cards, UID/both save slots/paid progress/cold restart,
five-Wisp migration/refund120 once, updater system-approved install/Open and normal
retail user-image launch PASS. Static security/dependency gates PASS; final APK
is not debuggable and exposes no WebView debugger/test instrumentation.
Anonymous latest/tag APK bytes, all14 packaged assets, feed and public metadata
match the tested build. [Public receipt](../qa/wisp-card-redesign-001/android-release/public-verification.json).

[Development/failure history](../qa/wisp-card-redesign-001/DEVELOPMENT_HISTORY.md)
retains original regressions and startup timeouts. Observed role clipping, moving
controls, disabled-action navigation, completed border, hint visibility and
entrance target issues were fixed. Native test coordinates now wait for the tab's
actual animationend scroll restoration; original assertions/deadlines remain.
Browser startup/context timeouts reran unchanged; failures were not accepted as
causal controls. Private149 is earlier-source evidence only, superseded by150.
[Self-review](../qa/wisp-card-redesign-001/SELF_REVIEW.md),
[evidence index](../qa/wisp-card-redesign-001/README.md).

Next external acceptance: actual phone install/update and Google Play Protect
verdict, exact WebView60 DOM/TalkBack, user design preference and real pacing.
Google classification remains NOT_TESTED; signing/security/retail checks do not
prove the reported harmful-app warning cleared. No store/account/review action
or security-warning bypass. Keep task/chat open; no questions or renewed permission.
