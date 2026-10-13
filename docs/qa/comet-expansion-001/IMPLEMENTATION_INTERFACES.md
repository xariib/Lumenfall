# Comet implementation interfaces — preparation

This file freezes names for parallel work after Tree integration. No production
or test implementation is present yet. SELECTED_DESIGN.md owns behavior; the
numeric closure and UI plan own their detailed evidence and presentation paths.

## Production functions to observe in complete-IIFE tests

| Function | Contract |
| --- | --- |
| `cometUpgradeLevel(id,snapshot)` | Bounded effective level, optional snapshot; raw value stays in cometUpgrades |
| `cometCapacity(snapshot)` | 1 + effective Reserve level |
| `cometWorkPerKill(snapshot)` | [20,25,32,40] at effective Engine rank |
| `cometHasLegacy(id,snapshot)` | Recognized due/settled retirement entitlement; no old-owned fallback |
| `getCometBuyPlan(item)` | Resolve canonical SHOP item by ID; accepts item or ID; pure price/unlock/cap/exact-debit plan |
| `buyShopItem(item)` | Existing public owner; selected staged purchase, boolean result |
| `cometMeteorBudget(H,P,rank)` | Reviewed exact/directed pure budget kernel |
| `cometMeteorHpPlan(H,h,P,rank)` | Reviewed pure HP plan; fields available, reason when unavailable, budget, damage, hpAfter, lethal |
| `getCometCommandPlan(id)` | Pure current-state/lifecycle/ownership/charge/encounter plan, plus Meteor HP plan |
| `activateCometCommand(id)` | Recompute live plan, one staged outer transaction, boolean committed result |
| `cometRecordDefeats(count,called)` | Actual existing defeat-owner hook; bank saturation and bounded event facts only, no save |
| `getDailyQuestRefreshPlan(id)` | Pure canonical eligibility, cost, exact-debit, replacement and exact-count plan |
| `refreshDailyQuest(id)` | Existing public owner; unchanged deterministic selection with exact transaction |
| `settleCometClaims(snapshot)` | One ordered retired+pending-Deed pass after existing F26 owner |
| `cometCommitMutation(apply)` | One staging owner; rollback primary failure and run token, retain primary on recovery failure |
| `renderCometCommands()` | Stable mounted command buttons; update text/properties; no settlement/action side effects |
| `renderCometJournal()` | Separate native Trial root and fixed-claim information, no obsolete purchase rows |

The buy plan includes `item`, `id`, `level`, `cap`, `cost`, `owned`, `maxed`,
`unlocked`, `affordable`, `available` and `reason`. `affordable` means currency
coverage only; `available` also requires exact debit, eligibility and an open
mutation lifecycle. Colors compare the actual quote against wallet coverage.
Unknown IDs return unavailable without a usable item. Cap reason is `cap`, a
missing Deed/ownership gate is `locked`, short currency is `funds`, a numerically
unrepresentable or lifecycle-blocked action is `unavailable`, and a payable
action is `available`. Do not expose these implementation labels as copy.

The command plan includes `id`, `owned`, `available`, `reason`, current charges,
`cost:1`, and the current target. Meteor additionally exposes its actual numeric
plan as `plan.meteor = cometMeteorHpPlan(...)` when the target is valid, even if
a different availability gate blocks use. Keep `plan.meteor.available` and
`plan.meteor.reason` separate from the overall `plan.available` and `plan.reason`.
With a valid numeric target but zero charges or active offline catch-up, the
numeric plan remains available and the overall command is unavailable.
UI displays its actual planned damage. One-time use and lifecycle are not part
of the pure numeric helper. No test should infer action success from a preview.

Preserve the prototype's numeric output shape exactly after renaming its private
functions with the Comet prefix. The independent BigInt oracle remains a modern
test-only tool and never enters product source or actual Node8 driver.

## Stable DOM observations

Use the exact selectors in ui-plan/PLAN.md: six existing data-shop IDs plus
data-comet-card/level/effect/next; Rift #comet-commands with stable native
data-comet-command buttons and data-comet-preview/status; separate
#comet-journal containing #legacy-comet-trials and #comet-claim-history;
data-deed and data-deed-credit-state; existing #theme-list equipment selectors;
data-quest-slot for Refresh identity; unchanged Auto-Ascend controls.

Each legacy Trial card is a direct child of #legacy-comet-trials, the actual
root passed to replaceControlMarkup. Keep its native input node and draft.
Capture shop/Journal focused viewport before renderAchievements changes any
preceding content. Capture command viewport before updateBattleFast changes
enemy context above it. Stable command buttons update in place and stay outside
the Guardian attack button. On an accepted interaction, keep focus on the
activated button if it remains enabled. If it becomes disabled, focus
`#comet-commands` with `tabindex="-1"` and `preventScroll`, then restore its
captured viewport. Never automatically move focus to the other command: repeated
Enter input must not activate a different action. Passive polling moves no focus
and must not repeatedly announce feedback. Tests observe the actual product
transition without repairing focus or scroll.

Current schema3 treats retired IDs still present in owned as inconsistent paid
data; migration2→3 removes those keys after recording the strict-true entitlements.
Do not use a current3 fixture with an old-owned flag as a substitute for an actual
old-save migration. New raw command bits must be explicit booleans in fresh3 and
the migrated endpoint. Preserve original Auto-Ascend normalization semantics.

Old adapters may change only documented schema/catalog/entitlement/presentation
expectations, preserving independent historical subsets and all existing gates.
Tests must use real command/defeat/earned-event paths for new Deed acceptance;
direct state setup is only fixture preparation, not proof that an event occurs.
