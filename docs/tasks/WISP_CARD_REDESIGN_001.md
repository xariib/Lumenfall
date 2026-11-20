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

## Current checkpoint — 20 November12:16

Implementation complete; required validation/delivery still in progress. Main
remains f998d308/public0.2.148. Worktree C:/lf-wisp-cards, branch
feature/wisp-card-redesign-001, PR65. No other checkout or PR63 changed.
Prior candidate b9346225 passed eight workflows; pre-merge reached
Endless mobile guidance and found its test reading roster help while management
was open. The test now installs navigation fixtures on the roster, enters Manage
explicitly for upgrade inspection/native purchases, and returns for guide checks.
All889checks/72cases/12profiles pass, retaining prices, gates, actual keyboard
spend, focus, text fit and exact complete-state/both-save purity.

Also fixed a real route: a global Formation hint from an existing Wisp manager
now returns to the roster before focusing its target. Focused regression proves
the Formation target is visible and both saves/state stay exact. Quick53checks
PASS; original input guard control fails its intended Space assertion, cleanly.
Full current matrix1176checks/12profiles PASS. No threshold/deadline or
required scenario removed. Product SHA256
09a523bcbeb816e33f1552e80f5926c6b124ff1b513bd75940290f1c96ffc6a0.
Independent four historical and four current one-second8h replays plus current
whole-window comparison regenerated PASS.636 protected functions/catalogs/core
remain unchanged from148;8 presentation functions and3 helpers differ.

The roster remains175px at320px normal text; preset minimum45px retains44px
through its scale(.995) entrance. All Wisp expanders are removed. Existing
purchase/cap/prerequisite/red/gold/persistence/accessibility assertions remain.
Earlier actual issues (role wrapping, live header/Auto-Empower movement,
disabled Empower fallback and completed Rarity border) were fixed in product.
Wisp native driver uses established automation/shared-memory flags and explicit
Runtime/DOM agents, with stderr diagnostics; original15s/90s/300ms limits kept.
Windows/Linux scroll and all causal controls pass. Shared fixture SHA256
3f7ca9f5c74034cd42ac242385f62d94776feb5e26e98be7f7059baadaeae8f2 unchanged.

Private signed Android149 build44715402119 passes native Manage/Back for all8,
real Ability purchase, five-Wisp migration, cold save upgrade, updater and retail
launch. It is7fe93b01/8927afb9 before the later border/preset/hint fixes, not final
acceptance or a public release. [Private evidence](../qa/wisp-card-redesign-001/private-149/identity.txt).
[Local evidence](../qa/wisp-card-redesign-001/local/preservation.json),
[CI chronology and failure history](../qa/wisp-card-redesign-001/DEVELOPMENT_HISTORY.md).
Actual Dribbble images and mobile/Android screenshots were visually self-reviewed;
no copied reference artwork, independent human review or new binding rule.

Next: publish current fixture/hint fix, complete exact-head nine workflows and
190+1 cases, integrate PR65 with expected head, dispatch all nine on exact main,
then signed public APK/update and anonymous feed/byte verification. Save final
evidence/status in GitHub. Physical phone, exact WebView60 DOM, TalkBack, human
design/pacing acceptance and Google harmful-app verdict remain unobserved.
Do not archive or claim full external acceptance; no questions/renewed permission.
