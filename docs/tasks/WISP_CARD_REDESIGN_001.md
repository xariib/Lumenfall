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
overlap checked. Implementation and checks are described below. Physical phone,
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

20 November11:01 checkpoint: final product8927afb9dac6104e54d57863cb7c4ea66e06439e67e39f850cebee4b36e988f8.
The focused matrix1152checks/12profiles passes on these bytes, as does the old
compact suite42570checks/18profiles. The native navigation guard control fails
the intended Space input-time-refresh assertion with clean teardown. Source
syntax/IDs and636-function/core preservation pass. The independent one-second
offline replay reproduces all four historical VM windows, agrees with original
browser rewards, and verifies current whole-window save endpoints against four
independent8h replays; every non-HP field exact and HP within original two-ULP
bound. Rebound only current golden source digest; historical fixtures unchanged.

Existing tests now explicitly visit each Wisp with Manage rather than assigning
details.open. Kept original prices, caps, native transactions, exact full-state/
both-slot, focus, one-pixel scroll,44px, color/contrast, runtime-error and timing
checks. Role/formation tests pass758/433checks across12profiles; Resonate passes
12profiles. Those three receipts were663d0898 before the final focus fix; final
integrated CI must rerun them. Native purchase/scroll suite3277checks passes on
8927afb9. Original embedded four layout cases and corrected p2-02b-wisp-hierarchy,
bond-text-contract and wisp-upgrade-display pass. An initial invocation used an
unknown scenario name; corrected names pass, no scenario removed. Old tests
found actual role clipping, Auto-Empower/header movement and disabled Empower
fallback navigation: fixed in product, preserving checks. No deadline relaxed.

Android acceptance now uses real centered trusted Manage/Back touches for all
eight Wisps, records selected visible upgrade geometry/effects, then natively
reopens Ember and performs the original real Ability purchase. Explanation is
static and must remain visible after purchase. Receipt guard requires all eight
native visits and returns; tooling positive/missing-visit controls pass.
Installed APK verification is pending, not inferred from browser results.

Changed areas: targeted index.html presentation; existing behavioral navigation
fixtures; new focused matrix/core preservation evidence; current offline binding;
Android navigation acceptance/receipt guard and its tooling controls; existing
existing required compact Wisp driver adds positive matrix and causal navigation negative control.
Shared fixtures hash3f7ca9f5c74034cd42ac242385f62d94776feb5e26e98be7f7059baadaeae8f2
unchanged. Full product diff self-reviewed; no independent human review claimed.
Next: publish checkpoint, PR and required CI; fix any failures, integrate exact
head, rerun integrated gates, deliver signed APK/update and retain limitations.

The local OAuth credential lacks workflow scope; an attempted workflow edit
was rejected on push. Kept the workflow byte-identical and attached the focused
positive/negative checks to its existing compact-card driver instead. No gate
was bypassed; the unpublished local commit was amended before publication.

20 November11:09: PR65 at7fe93b01. Private signed build44715402119 passes all
Android upgrade/updater/retail/native checks; no public release from this run.
PR Windows/Linux scroll, Lab, Comet, Tree, migration and isolated offline pass.
Pre-merge stopped at a chronology setup that had not entered Manage; permanent
UI lacked closeWisp in its secondary bridge; shared glyph gate still expected
full roster names and mutated superseded CSS. Fixed setups, kept assertions,
and proved new grid collision control fails its intended glyph intersection.
Shared layout6985checks/12profiles and all three causal CSS controls pass at8927.
Permanent506checks/18profiles and chronology pass after setup repair; pending
formation layout, accessibility control and reconstruction cases pass as well.

Serial affordability26832checks/12profiles and original red/stale-Resonate
controls pass at8927. The first parallel local attempt reached its unchanged
240s deadline without receipt; the serial rerun resolved it. Upgrade-state checks
found a real CSS specificity regression: the new first-section divider override
removed completed Rarity's top gold border. Restricted it to non-completed
sections; all15348upgrade-state checks/6profiles pass on final product
4ccf543feabfa1a927138af59b8bb0d17b5fda456ad02c7fd797c4ad473ad7a3.
Independent four historical/four current one-second windows and whole-window
comparison regenerated PASS for4ccf;636 protected functions/core still exact.
Earlier failed runs/receipts retained. Next: push repaired acceptance fixtures and
gold border, complete exact-head CI, integrate, exact-main9gates/public APK.
