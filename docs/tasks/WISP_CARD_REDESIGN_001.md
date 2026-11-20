# WISP_CARD_REDESIGN_001 — character cards without nested expanders

Status: in progress. Owner: this chat; no delegation or new chats.

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

## Current checkpoint

Research completed; three primary images inspected. Baseline checkout and PR63
overlap checked. No product edits yet. Next: implement the flat card/management
interaction, preview actual mobile layouts, preserve all transactions and
navigation, then validate and deliver within this scope. Physical phone,
TalkBack, exact WebView60 DOM and human design acceptance remain unobserved.
No new binding project rule is proposed.

20 November10:33 checkpoint: implemented portrait-led roster, short names,
level/rarity/DPS and Empower/Manage; one flat management view, no Wisp-tab
accordions. Bonds moved below roster as a static section; compact Formation
controls retain presets, all Active identities and pending rebuild status.
Source e378f552f2b09cfd96bc0166e761ece713b8b1185aa9f3afcc79474495a4330a.
Current browser matrix1152checks/12profiles PASS (320/390/430px,100/200percent
text, both motion settings), real keyboard/touch purchases, exact state/scroll/
saves/navigation and hint deep links. Native navigation guard removal fails
Space input-time refresh as intended; original guard PASS. Comparison to released
148 protects636 unchanged functions and all catalogs/non-function core code;
only8 presentation functions plus3 view helpers differ. This is scope-specific
evidence, not a new permanent global mechanics freeze.
Next: reconcile existing tests from disclosures to explicit Manage navigation
without dropping purchase/persistence/cap/focus checks; source-bound offline
reference and required CI/native/integration/APK delivery remain pending.
Current local candidate is not delivery; public remains0.2.148.
