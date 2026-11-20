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

## Current checkpoint — continuous touch targets

Implementation complete; validation and public delivery remain in progress.
Main remains f998d308/public0.2.148. Worktree C:/lf-wisp-cards, PR65,
branch feature/wisp-card-redesign-001. No other checkout or PR63 changed.
Current product SHA256
b24494d6f4a4833c83922467e141454174efb9cbe4866e8d9e5ef7ebc45c805e.

Prior candidate e0265be2/09a523bc passed eight workflows and all targeted
pre-merge steps. The full main group executed all190planned cases/220profile
executions:187unique cases passed, three failed; isolated offline case passed.
Failures/fixes:
- formation-collapse: native Field input raced the composited scroll surface.
  The driver now presents the surface, asserts native hit/44px geometry, then
  delivers real touch and observes its next frame. Original state/focus/purity
  assertions and90s/15s limits remain. All457checks/12profiles PASS locally.
  Failure output now includes valid JSON alongside stderr rather than hiding
  the actual assertion behind an empty-driver-JSON message.
- p2-02a-core-qol: the fixture entered Manage for an individual queue, then
  measured hidden global controls. It now returns with actual closeWisp before
  the original roster geometry checks; the full original case PASS locally.
- formation-autosave-native: Field/Bench44px shrank below44px during panelIn.
  Scoped Wisp controls now use45px, retaining44px through scale(.995). Original
  native autosave acceptance PASS. Roster cards remain about176px vs288–292px
  before redesign. No touch threshold, purchase assertion or scenario weakened.

Current focused matrix1182checks/12profiles PASS (320/390/430px,100/200percent,
both motion preferences): all8 Manage/Back routes, actual purchases, exact state/
both slots/back offsets, all text/controls fit, ability gold and hint deep links.
A real paused entrance is measured at frame zero. Reverting only Field/Bench
minimums to44px fails the original44px geometry assertion at43.78px, cleanly.
The original native-input guard control still fails its intended Space assertion.
The required existing compact driver runs both positive matrix and these two
causal controls after its unchanged original assertions; full local parent run
is in progress, required CI must verify its receipt.

Guide/mobile889checks/72cases/12profiles PASS. Global Formation hints return to
roster before focusing; no hint purchase or save mutation. The original one-second
reference was regenerated: four historical plus four current8h windows, current
whole-window comparison, all non-HP fields exact and HP within unchanged two-ULP
bound.636 protected functions/catalogs/core unchanged from148;8 presentation
functions and3 view helpers differ. Shared fixtures SHA256
3f7ca9f5c74034cd42ac242385f62d94776feb5e26e98be7f7059baadaeae8f2 unchanged.

Earlier actual issues (role wrapping, live header/Auto-Empower movement,
disabled Empower fallback, completed Rarity border, global hint visibility) are
fixed. Wisp native driver uses established automation/shared-memory flags and
Runtime/DOM initialization; original15s/90s/300ms limits remain. No workflow,
Android product code/signing, save schema, balance, catalog or asset changed.

Private149 build44715402119 passes native all8 Manage/Back and Ability purchase,
five-Wisp migration, cold-save upgrade, updater and retail launch. It is the old
7fe93b01/8927afb9 candidate, not final release acceptance; public remains148.
[Private identity](../qa/wisp-card-redesign-001/private-149/identity.txt),
[current preservation](../qa/wisp-card-redesign-001/local/preservation.json),
[chronological development/failure history](../qa/wisp-card-redesign-001/DEVELOPMENT_HISTORY.md).
Actual Dribbble images and mobile/Android screenshots visually self-reviewed;
no copied artwork, independent human review or new binding rule.

Next: publish touch/fixture fixes; exact-head nine workflows and190+1cases;
merge PR65 with expected head; all nine on exact main; signed public APK/update;
anonymous feed/byte verification and final GitHub status/evidence. Physical phone,
exact WebView60 DOM, TalkBack, human design/pacing and Google harmful-app verdict
remain unobserved. Keep open; do not archive or ask renewed permission.
