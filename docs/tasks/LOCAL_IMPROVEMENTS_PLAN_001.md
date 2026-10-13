# Local improvement queue

13 October 2026. User requests one improvement per chat and a strict continuation
guide. This task records requirements and the sequence; it does not implement
the seven product changes or create feature chats.

Baseline: local/full-debug commit dff2f50; index.html SHA-256
b3eca6661042a7245100d9dcd0a6fbbb2e38a01e99b305102b5307abb52db7a9.
The local preview serves mobile/www on http://127.0.0.1:4174/index.html.
GitHub access is blocked. Work stays local; no connector is required.

Read [current status](../PROJECT_STATE.md) and
[open debugging task](LOCAL_FULL_DEBUG_001.md). The unresolved Prism contract
deadline, Windows symlink tooling limitation and missing final full-source/
Android acceptance remain open. These are not caused by this planning task.

## Sequence and acceptance

1. **LAB_AFFORDABLE_ALERT_001**: User reports an empty Lab slot shows a
   notification even when nothing can be purchased. Show attention only when
   capacity is available AND an eligible project can actually be started with
   available currency under existing purchase rules. Cover unaffordable,
   affordable, locked, capped, full and currency/capacity transitions; reconcile
   queued projects with the existing scheduler without changing it.
2. **WISP_RARITY_SCROLL_001**: User reports Rarity Up shifts the page, especially
   when the following upgrade is unaffordable. Preserve scroll and same-card
   focus through purchase and subsequent refresh. Test touch and keyboard,
   affordable and unaffordable following upgrades, capped state, repeat input,
   and preserved price/reward/save behavior.
3. **FORMATION_COLLAPSE_001**: Formation contribution should not always be open.
   Default to collapsed, provide an accessible toggle and preserve the user's
   chosen expanded state through periodic rendering. Keep calculations intact.
   Do not invent cross-session/save-schema persistence without a requirement.
4. **LAB_SPEED_CONTROLS_001**: User dislikes the speed panel appearance and
   repeated open/select/queue clicks. Put compact speed controls beside the
   Queue on/off control, with direct multiplier and queue choice. Preserve the
   distinction between immediate paid acceleration and queued speed targets;
   clearly show costs before spending and prevent accidental/double spending.
   Check selected state, affordability, scheduling, offline parity, saved queue
   preferences, mobile touch targets, large text and focus/scroll stability.
5. **RIFT_HINT_LAYOUT_001**: Make Show hints/Hide hints narrower with inset edges
   and a better background/fade transition around the enemy box, between the
   currency area and enemy display. Preserve readability, contrast, touch
   target, keyboard access, hints behavior and stable layout.
6. **RIFT_THEME_LABEL_001**: User does not understand Starlight on the enemy
   screen. Verified source: RIFT_THEMES default.name is Starlight and
   applyRiftTheme writes activeRiftTheme().name to rift-cosmetic-name. It is the
   selected appearance, not combat stats/currency or the Starlight Affinity Tree
   upgrade. Make the label's cosmetic meaning clear with compact wording such
   as Theme: Starlight. Preserve all selectable/unlocked themes and cosmetics.
7. **FORGE_LAB_CAPS_001**: User says some Forge upgrades and Lab projects may
   have very high caps. This is a preference, not specified values. Inspect
   current caps/prices/effects, propose named upgrades/projects and numeric caps
   with pacing/cost/effect implications, and obtain the missing balance decision
   before changing caps. Preserve old paid value, refunds, save compatibility,
   finite arithmetic and online/offline parity; cover accepted migrations.

Lab speed appearance and interaction are one cohesive improvement. The two Rift
observations remain separate tasks. No blanket rebalance is authorized.

## Sequential local handoff

Use the same nested Lumenfall folder. Only one owner edits it at a time.
Each feature chat starts from the previous accepted local checkpoint, reads
AGENTS.md/bootstrap/state and its task, and verifies branch, HEAD and status.
Create the named task document on entry and run check_context with its path.
Keep unrelated findings in this queue or the debugging task.

For each task: reproduce, implement, add focused behavior coverage where needed,
run relevant existing gates, inspect the complete diff, update task/state,
checkpoint locally, stage current source/assets in mobile/www and show the
preview. Do not overwrite dirty changes, weaken tests, reset progress, silently
change balance or use archive code as the product. Concurrent work requires
isolated worktrees and serial integration; it is not requested here.

Each handoff records feature ID, commit/branch, source hash, files, exact checks,
limitations and next action. Local implementation/preview acceptance is a
milestone, not a completed Android release. Keep remote/final release acceptance
pending while unavailable; no APK/signing/remote work is part of this plan.

Status: [LAB_AFFORDABLE_ALERT_001](LAB_AFFORDABLE_ALERT_001.md) local implementation,
focused checks and preview verified on `local/full-debug`; release/device and
standard transport acceptance pending. [WISP_RARITY_SCROLL_001](WISP_RARITY_SCROLL_001.md) local implementation and
focused preservation checks verified, including the Empower/all-Wisp-action
follow-up from ddb709d and visible-action/background-refresh correction from
ac7ca7c. Existing preview tabs reloaded and exact current script verified;
final/device acceptance pending. [FORMATION_COLLAPSE_001](FORMATION_COLLAPSE_001.md)
local implementation and focused browser/core checks verified; default collapsed
and current choice/focus retained, calculations/saves unchanged. Final/device
acceptance pending. [LAB_SPEED_CONTROLS_001](LAB_SPEED_CONTROLS_001.md) locally
verified: inline speed/price, immediate purchase and separate queue choice; scoped
preservation and native checks PASS, final/device acceptance pending.
Tasks5–7 implementation NOT STARTED.
Next action: user reviews the current preview, then starts RIFT_HINT_LAYOUT_001
using the saved guide and latest local checkpoint. No chat created automatically.
