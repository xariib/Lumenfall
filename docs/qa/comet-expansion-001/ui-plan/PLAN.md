# Comet commands: UI and acceptance plan

**Scratch design preparation only.** No Comet product or test implementation, new gameplay test run, browser test, repository edit, staging or publication was performed for this plan. It follows root's selected catalog, schema3, bounded claim ledger and numerical contract. Those choices are not reopened here.

The provisional source is Tree candidate `768050d7cca586ea724e7ac677804a5ed7d6a3f5`, tree `30213b2ae877ff64db08e3d06b087d040fe72ca2`, product SHA256 `ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3`. Tree's mandatory Full workflow, actual development merge and subsequent integrated checks remain root's separate acceptance responsibility. Recheck the eventual accepted merge before Comet implementation. Main and APK work remain held.

The exact input hashes and clock are in [identity.json](identity.json). This plan reviews [SELECTED_DESIGN.md](../SELECTED_DESIGN.md), [the original proposal](../design-proposal.md), [the earlier source review](../root-design-review.md), the original mandate and the current identity matrix. The selected design takes precedence over the original proposal's unselected general income/debt proposal.

## 1. Selected mobile paths and layout ownership

### Rift: perform commands beside the target

Add `#comet-commands` **inside the existing Rift `.card.stage`, immediately after `.battle-row` and before `#buff-indicator`**. The current `.battle-row` contains the enemy attack button, HP and party. The new section is their sibling, never a descendant of `#enemy-stage`, which is itself a button. This placement keeps the target and its HP/trait context close to Meteor and Call, while the current Boost, Bond and damage summaries remain below.

Use intrinsic height and ordinary `main` scrolling. At narrow widths and doubled text, stack the two action rows; do not overlay the battlefield, fix the section to the viewport or squeeze it into the enemy button. Keep the section absent when neither command is owned. Once either is owned, show the bank and both rows; an unowned row links to its named purchase card in Deeds rather than containing a second purchase control. A permanent unlock already survives Ascend, so the panel remains mounted when an attack causes a real reset.

Each owned command has a stable native button, target-specific current preview and a concise availability explanation. Update its text and properties without replacing the focused button when the enemy, charge bank or eligibility changes. Meteor shows the **actual planned HP reduction** and whether it defeats this enemy, using the selected numerical plan. Its ceiling may be explained in the adjacent description; do not substitute the larger theoretical budget for the actual represented loss. Call says that it turns this ordinary enemy Luminous, with rewards earned on its defeat. There is no immediate reward promise.

The bank reads, for example, `1 / 2 charges` and `2,400 / 4,000 recharge work`, with work per defeat available in the explanation. At capacity show `Full`; work is actually zero. A command costs `1 charge`, not Comets. This is not a seventh HUD currency, and its cost does not use Comet purchase-price attributes. A small polite feedback region reports a committed action or meaningful refusal; HP polling and work ticks do not repeatedly announce messages.

### Deeds: six purchases, a separate Journal and the retained Collection

Keep the existing Deeds navigation. Under `Exclusive Comet Unlocks`, keep exactly this order in `#shop-list`:

| ID | Name | Buy price sequence, Comets | Visible current/next effect |
| --- | --- | --- | --- |
| `autoascend` | Auto-Ascend Ritual | 100 | Existing owned state and Open Ascend control |
| `meteor` | Meteor Strike | 100 | Unlock, one shared charge per command, once per encounter |
| `starcall` | Luminous Call | 140 | Unlock, one shared charge, ordinary living nonboss only |
| `cometreservoir` | Orbital Reserve | 60, 120 | Charge capacity 1→2→3; does not refill |
| `cometcycle` | Orbital Engine | 80, 140, 220 | Work per real defeat 20→25→32→40; 4,000 per charge |
| `meteorcore` | Meteor Core | 45, 75, 120, 180 | Maximum-HP ceiling 20→25→30→35→40%; the power ceiling still applies |

All six rows remain discoverable while locked. Show the exact sticky Deed requirement, ownership dependency, effective level/cap, current effect, next effect and next price. At cap there is no next purchase. Preserve valid raw overcaps in state, display their bounded effective result honestly and refuse another purchase. There are six types and twelve total purchases to buy everything, costing 1,380C including Auto-Ascend. Do not present improvement levels as additional catalog types.

After the shop add a separate `Comet Journal` heading and `#comet-journal` root. The retained Trials form belongs in `#legacy-comet-trials` inside that root, as a stable direct-child card. A separate fixed-claim history section explains compensation or earned rewards still due. Hide empty legacy-only content for new players. Do not leave the retired Trials row, a disabled old purchase card or a new price for that entitlement in the shop.

Rename the existing Cosmetics heading to `Collection`, retaining `#theme-list`. Keep existing aura selection and independent earned Trial marks. Show Trail/Crest equipment controls only for their retained owners, using non-shop legacy definitions. A nonowner must not see an obsolete `Unlock in Deeds` price or receive the cosmetic. Owners keep their equipped value through migration, reload, recovery, import and Ascend. No new top-level navigation or settings destination is required.

The Journal explains the selected deliberate policy plainly: the previous feature remains available and its fixed retirement compensation is credited once when representable. Do not imply removal of the benefit, automatic purchase of the new commands, or that all old Deed rewards are being granted again.

### Auto-Ascend and paid Refresh

Keep the actual target/toggle controls in `#auto-ascend-controls` on Ascend. The owned shop card continues to open those controls. On a successful first purchase, focus can move from the replaced buy button to that same card's `Open Ascend` control; subsequent toggling and target editing preserve the established native input behavior. Do not place a competing toggle in the command panel.

Paid Quest Refresh stays in the existing Daily Quests card. Its cost comes from the actual read-only Refresh plan, currently 25C under the existing quest table. Preserve the original deterministic replacement and all three selected eligibility routes. When the quest ID changes, retain focus at the same quest slot's replacement Refresh control if present. Otherwise move it to that slot's meaningful heading, not to the document body or an unrelated Claim action. This identity transition needs an explicit slot key, because the old `data-quest-refresh` ID correctly disappears.

## 2. Source map and the required integration seams

The locations below refer to the pinned `index.html`; function names remain the primary anchors as the implementation grows.

| Current owner / location | Required Comet change or preservation |
| --- | --- |
| Rift markup, line 2600; `#enemy-stage`, 2679; end of `.battle-row`, 2732 | Add the sibling command section at the selected boundary. No nested button or bubbling Guardian attack. |
| Deeds markup, 2785–2802 | Add the separate Journal root; preserve Daily Quests, Deeds, six-card shop and Collection navigation order. |
| `ACHIEVEMENTS`, 3529; `deedPresentation`, 3588 | Retain old23/683C, add four event rows and descriptions. `deedPresentation` currently dereferences `rows[a.id]`; appending checks alone would throw for new IDs. Update d25/d50/d100 unlock copy and remove only asc5's obsolete advertised unlock. |
| `SHOP`, 3664; `restStopComplete`, 3805 | Six current purchasable definitions, separate old entitlement definitions, selected Refresh routes. Resolve old ownership through the single snapshot-aware helper. |
| `dailyQuestRefreshCost` / candidates / `refreshDailyQuest`, 3813–3827 | Shared read-only plan and exact staged transaction. No general daily/quest credit ledger. |
| Migration/normalization/load/save, 4055–4466 | Explicit schema2→3; strict current3 blocks; keep original raw primary on the two new protected errors. UI warnings must identify Comet history accurately. |
| `purchasePriceMarkup`, 4607; price recoloring, 4611 | Use the same currency/amount attributes for every actual Comet buy and Refresh quote. Only shortage makes that amount red. |
| `autoAscendReady`, 5516; controls, 5558; `checkAutoAscend`, 5610 | Preserve current native target controls and correctly propagated save failure. Both manual commands refuse an already-ready boundary. |
| `applyAchievementChecks` / `checkAchievements`, 5618/5629 | Keep earned flags/unlocks sticky. Show completion/name or accurate pending credit, never a false `+N Comets` payout when the bilateral exact guard refused. |
| Trial normalization/queue/cancel/start/status, 5646–5708 | Preserve rules, pending/active/failed/result/mark semantics; replace entitlement lookup, not the rules. |
| `selectCometCosmetic`, 5715; `applyRiftTheme`, 5936 | Preserve retained equipment and separate aura/Trail/Crest composition. |
| `buyShopItem`, 6338; `doAscend`, 6589 | Plan-based purchases and the selected outer transaction. Read committed state afresh; command kill/Ascend may replace the staged object. No nested save. |
| `presentControlStates`, 6656; shop branch, 6746 | Current boolean-owned/fixed-cost assumptions do not represent multi-level rows. Read the same authoritative plan as render, live refresh and activation. Give command actions their own eligibility semantics. |
| `captureControlViewport`, 6770; `restoreControlViewport`, 6779; `replaceControlMarkup`, 6788 | Preserve actual focused-control position and native inputs. The special Trial preservation branch assumes a direct-child card; relocating it by nesting inside a generic shop row would break that assumption. |
| `cacheEls`, 6879; `updateBattleFast`, 7035 | Register new roots and update target/charge previews without rebuilding active native controls. Preserve existing Trial/Rift status. |
| `cometTrialControls`, 7870; `renderAchievements`, 7893; shop/Trial listeners, 7950–7969 | Separate the Trial renderer/listeners from `shop-list`; keep one form instance and its draft input node. Locked, affordable, cap and owned states all derive from real plans. |
| `renderCosmetics`, 7980; `SHOP.find`, 8003 | Move Trail/Crest display definitions before retiring SHOP entries. The current `def.name` access would otherwise dereference an absent definition. Preserve independent earned marks. |
| `forgeCurrencyDescription`, 6099; mechanic description, 6102; currencies, 8021; Encyclopedia mechanics, 8063 | Update Comet use, new commands, work and retained-owner language in both dynamic and static description paths. Leave unrelated currencies and combat owners intact. |
| `renderDaily`, 8137; Refresh markup, 8167 | Replace current icon-plus-number quote with the shared price markup and actual eligibility plan. Current daily controls are not in the final shop price-refresh root list. |
| `tick`, 9592; `checkAffordability`, 9667; shop branch, 9726 | Revalidate quotes/disabled state as wallet, Deeds, lifecycle and command state change. Read-only UI updates must not settle claims or spend resources. |

The new command buttons call their actual planned production owners. They do not call a test damage substitute, mutate an HP preview, trigger `doTap`, synthesize an ability, or directly invoke a manual Ascend wrapper.

## 3. Proposed stable selectors and test-facing observations

These are proposed interface names, not claims that the current game exposes them.

| Surface | Proposed selector / observation |
| --- | --- |
| Six purchases | Keep `[data-shop="id"]`; add `[data-comet-card="id"]`, `[data-comet-level]`, `[data-comet-effect]`, `[data-comet-next]` and the existing `[data-price-currency="comet"][data-price-amount]`. |
| Commands | `#comet-commands`, `#comet-charge-status`, `#comet-work-progress`; `[data-comet-command="meteor|starcall"]`, `[data-comet-preview="id"]`, `[data-comet-command-status="id"]`; unowned link `[data-comet-shop-link="id"]`. |
| Feedback | `#comet-command-feedback`, polite and updated on an actual action result, not on every tick. |
| Journal | `#comet-journal`, `#legacy-comet-trials`; retain `[data-comet-trial-card]`, `[data-trial-choice]`, `[data-trial-target]`, `[data-trial-queue]`, `[data-trial-cancel]`, `#comet-trial-help` exactly once. |
| Fixed claims | `#comet-claim-history`; `[data-comet-claim="retired:rifttrail"]` or `deed:<known-id>`, with explicit `data-claim-status="due|settled"` where the selected stored history actually supports it. Do not invent settled Deed history that the pending-only ledger does not store. |
| Deeds | `[data-deed="id"]` on the existing card; `[data-deed-requirement]`, `[data-deed-progress]`, and `[data-deed-credit-state]` for an earned but still due reward. Completion remains separate from credit status. |
| Collection | Keep `#theme-list`, existing aura selectors and `[data-comet-cosmetic="trail|crest"]`. |
| Refresh | Keep `[data-quest-refresh="id"]`; add a stable `data-quest-slot` wrapper to preserve the correct visual/action slot after replacement. |
| Auto-Ascend | Keep `[data-autoascend-open]` and current controls/target input IDs. |

The complete-IIFE harness may add read-only aliases for the actual catalog, effective levels, shop plan, command plan, Refresh plan, retained entitlement and fixed pending claims. Expose original state/save/load/backup/import, actual foreground flags and original simulation entry points for controlled fixtures. Do not stub a new helper to zero, silently fall back to old SHOP semantics, or replace the transaction under test.

Browser positives activate native DOM controls with trusted touch/keyboard. Storage fault injection wraps only the original primary/recovery write, restores in `finally`, and tests the actual action. Any observer wraps an original mutation function with unchanged arguments and return. If the QA harness deliberately leaves a reload flag raised, scope and restore that test-only flag around the relevant original action, retaining exception restoration; do not loosen production lifecycle guards. Re-read live state after every canonicalizing transaction.

## 4. Price, status, warning and feedback consistency

The initial renderer, `presentControlStates`, periodic affordability update and actual activation must all use the same pure plan. This prevents an enabled button quoting a stale price or an affordable capped row claiming insufficient Comets. A wallet of `1e30` can numerically exceed100 while being unable to pay100 exactly: the price stays normally colored, the action is unavailable and no purchase succeeds. Currency shortage alone colors that currency amount red. There are no deficit numbers or extra price warnings.

Command reasons explain the game condition: charging, already used on this enemy, an already Luminous enemy, a boss invalid for Call, or an unavailable current action. Do not expose floating-point implementation details in the normal flow. The selected protected-load failure uses the existing warning surface with accurate Comet-history wording, preserves the raw slots and blocks persistence/paid actions. It is different from ordinary insufficient funds or a normal reload.

Earned Deeds remain completed and unlock their dependent feature while their exact fixed claim is pending. Completion feedback must not announce uncredited currency. A later canonicalization may credit an earlier pending claim: show the actual updated wallet and pending status, without replaying the Deed completion. Read-only render/preview never performs settlement.

An exact purchase can enable a later claim credit during canonicalization. The final wallet equation is `before − exact price + actually credited claims`, not always `before − price`. A browser fixture must separately assert the exact debit, claim identities consumed and resulting wallet; it must not “fix” legitimate settlement by weakening the purchase oracle.

## 5. Actual browser acceptance matrix

Use **320, 390 and 430 CSS-pixel widths × 100% and 200% root text × both motion preferences: twelve profiles**. The current product has no explicit20px root; the current transport uses16px/32px. Retain that established base for this feature. If root deliberately selects a20px base later,100/200% must mean20/40px and the identity receipt must say so. Testing16/32 after a20px redesign would be80/160%, not the requested scale. CSS root scaling is not Android OS font scaling.

Across every profile, exercise the actual six-card shop, command panel, Journal/Collection, Refresh and Auto-Ascend path. Measure visible labels, descriptions, current/next effects, cost spans, status, native controls and their hit targets. Require no horizontal clipping/overflow, readable wrapping, accessible names, 44px targets, the existing contrast/focus contract and an unobscured hit-test center. Large text can require ordinary scrolling; all relevant content must remain reachable.

| Fixture family | Required actual action and independent assertion |
| --- | --- |
| Catalog, affordability, caps | Buy both commands and all nine improvement levels plus Auto-Ascend through controls: twelve exact purchases per profile. Assert the independently frozen prices, exact owned/level endpoint and effective preview at each rank. Use earned Deed flags for locks; maxDepth alone must not unlock a row. Check short/exact wallet color/state, all six capped rows, and zero/current/overcap imports in focused fixtures. |
| Initial bank and upgrades | First command purchase grants exactly one charge; second unlock grants none. Buying Reserve preserves charges/work while capacity grows. Buying Engine with3970work preserves3970. The next genuine defeat uses the new rate. Full-bank work stays0; reload/Ascend/time alone do not refill. Work is observed from actual defeat paths, never fabricated via a lifetime-kill counter delta. |
| Meteor | Trusted touch and keyboard activate a real ordinary and boss target. Check the selected numeric oracle's actual HP endpoint, one spent charge, current-enemy used flag and event Deeds. No Guardian tap/count, ability/cast charge, temporary Support factor or Spillway is caused. Same-encounter repeat refuses. A legitimate kill uses actual progression/rewards and may trigger one Auto-Ascend; a pre-ready Auto-Ascend refuses the command. |
| Luminous Call | Actual ordinary target conversion changes only the selected command fields and Luminous flag, with no immediate reward or kill. Existing Luminous/boss refuse. Save/reload preserves the marked same enemy. Its actual later kill gives canonical reward once and Called Light; abandonment gives neither. Include first marked Farm-batch kill in the engine suite, with UI state from the committed endpoint. |
| Deeds and pending value | Actual committed first command, actual recharge, boss strike and marked kill each earn only their named new Deed/reward. At a huge or fractional wallet, earned state/unlock remains true and the known claim remains due; no false `+N` credit toast. Purchase-enabled settlement is accounted separately. Existing23 Deed flags/rewards/thresholds remain unchanged. |
| Legacy migration and controls | Load schema2 through a one-shot document-start raw seed, then activate the retained Trial target/select/queue/cancel and Trail/Crest equipment. Confirm retired buy buttons/cards are absent. Type a target with actual input and change the native select with keyboard; unrelated live updates preserve the same focused input node and draft. Existing earned marks survive even without a current entitlement. |
| Recovery, import and exact transactions | Actual primary failure/refusal leaves both endpoint and resources unchanged; retry succeeds once; recovery-only failure keeps committed primary. Include a real command kill/Auto-Ascend and exact paid Refresh. Re-read state after each. Current3 malformed claims/state keep exact raw primary, valid recovery, persistence block and correct warning; invalid import keeps live endpoint and both slots. |
| Refresh and Auto-Ascend | Exercise all selected Refresh eligibility routes with unchanged deterministic replacement/no arbitrage. Check25C price, exact debit, claimed-slot refusal, unsafe counter refusal and stable slot focus. Buy Auto-Ascend for100C, open the real panel, edit the native target, toggle and trigger a real boundary; preserve prior target/on-off behavior through reload. |

To contain duplicate numerical work, run exhaustive binary64/claim vectors and every row's storage-fault variants in the focused complete-IIFE core/V8 suites. The browser matrix supplies actual input, DOM, viewport and representative transaction witnesses; it must not claim those pure sweeps merely from screenshots. Each semantic fault fixture should run at both normal and large text, with enough motion/width representatives to expose its actual UI surface. All twelve profiles still visit and exercise every new surface.

Use independently fixed migration witnesses for all eight subsets of the three retired entitlements, with focused ordinary/large-text browser representatives and exhaustive core coverage. Important exact pending examples are wallet0→350 credited;2^54→300 credited/50due;2^55→160 credited/190due;1e30→350due. F26's separate settlement runs first and can change these endpoints; its combined fixtures must use their actual independent oracle, not blindly reuse the standalone350 examples. Preserve old paid Lab/Forge/Tree levels, overcaps, queues, active Studies, snapshots, formation intent, currencies and Auto-Ascend.

## 6. Transport, focus and viewport proof

Reuse the existing CDP transport and complete product IIFE. Freeze automatic interval scheduling only for controlled test phases; enable the original native animation frames for layout settlement. Use explicit actual simulation for work and chronology. Capture original source/test/transport hashes, browser version, input events, runtime errors and storage bootstrap diagnostics.

Adopt the already established absolute readiness deadline: each probe is bounded by the remaining time; retry only the identified execution-context transition, never a real game error. Record readiness attempts and the expected bridge/fixture identity. A fixed number of blind probes or a30-second evaluation inside a10-second deadline is not a valid gate. One-shot document-start storage seeding is necessary for legacy migration, because writing an old save immediately before `Page.reload` can be overwritten by the old page's unload save.

For focused controls, record the viewport point before a real purchase/command/update and immediately afterward, then after two actual animation frames. Test helpers may scroll/focus to arrange the initial action only. They must not scroll the control back, focus it again or repair its position before the post-action assertion. Include native browser anchoring and a causal `overflow-anchor:none` setup as appropriate.

For a feasible restoration, require the focused control's visible top to stay within1px. The intended scroll is `afterScroll + afterTop − beforeTop`; clamp only to the actual `[0, scrollHeight − clientHeight]`. If a layout contraction would require negative scrolling, record the unavoidable movement and nearest feasible endpoint instead of demanding an impossible negative scroll. Do not turn this exception into a general large-drift allowance. Retain the same native input node while editing a legacy Trial or Auto-Ascend target.

Use exact source-anchored causal mutations, restore the original function/state/slots in `finally`, and retain the precise caught assertion with zero unrelated runtime errors. A mutant that only crashes on a missing helper is not a causal pass. Recommended focused browser controls are:

1. Live affordability ignores the new shop/Refresh plan: actual quote or enabled state becomes stale.
2. Journal refresh recreates a focused native Trial input: node/draft/focus witness fails.
3. Purchase or command UI ignores viewport restoration: state/debit still succeeds, immediate/settled visible-position assertion fails.
4. Retired cosmetic rendering uses SHOP definitions or entitlement is omitted: real retained-owner control/equipment assertion fails.
5. Pending Deed feedback falsely announces credited Comets: actual due claim and accessible feedback disagree.
6. Command activation uses its cached preview after target/charge/lifecycle changes: actual refusal/no-mutation oracle fails.
7. Command is nested/bound as a Guardian attack: actual totalTaps/Trial/cast counter assertion fails.
8. Paid Refresh or command reports success after a failed primary write: original state/slot/feedback/retry oracle fails.

The core suite separately owns numerical, canonical-kill, charge-work, same-encounter, migration/claim and run-token causal controls. Avoid duplicating every engine mutant into twelve browser profiles. Preserve all existing required negatives and their original expectations.

## 7. Existing tests and explicit adapter changes

Reuse the current eleven named `comet-unlocks-core.cjs` cases for old Trial ownership, target/cancel, full-run completion, manual/early-Ascend failure, Single Star recruitment/formation/reconstruction, legacy archive, active Trial/equipment recovery, Refresh routes, live/offline split chronology and atomic offline retry. Its old catalog assertion needs an explicit selected-contract update; its old entitlement assertions must become retained-history assertions without discarding the original behaviors. Keep the old exact70,000Lumen success fixtures and extreme-wallet rejection regression.

The old `comet-unlocks-mobile` and `comet-unlocks-reduced-motion` driver each exercise six width/text profiles and specific local font overrides. Move their Trial selectors to the real Journal and retain touch/keyboard, same-input, cosmetics, contrast and geometry assertions. These older local font overrides are not proof of the new whole-root twelve-profile matrix.

Retain the default scenarios and independent obligations including `upgrade-effects-and-deeds`, `p1-05-control-regressions`, `p2-endgame-currency-utility`, Auto-Ascend target/mobile/recovery/import scenarios, `ascend-prisms-contract`, save/backup/future-schema cases, formation autosave and the existing Full causal controls. Existing Lab, Forge, Tree, currency, Prism, identity, cosmetics, guard and smoke lanes remain required. Tests that extract a production kernel must include actual new dependencies rather than stub them away.

The separate adapter-impact inventory owns exact schema literals, historical683/450 expectations, dynamic Deed setters and combined F26/retirement fixture totals. In particular the Tree mobile old-owner fixture's307 becomes657 under its actual additional350 compensation, while the existing nonowner V8 fixture does not receive that350. Do not globally change every307 assertion. Re-read state after staged purchases, and preserve each original fixture byte where the contract does not change it.

Record raw PASS and FAIL outputs, exact process exits/timeouts/runtime errors, readiness traces, source/test/workflow and synthetic/actual-merge identities. Keep before/fixed witnesses for any adapter correction. Capture PNGs that actually show each new surface at both text scales and all widths/motion settings; use extra frames when one screen cannot show the shop or Journal/Collection. State the actual image inventory and measured coverage, not an invented expected check count. Mandatory acceptance requires the new focused Comet lane plus every existing lane on one final candidate and root review of the actual artifacts.

## 8. Selected-design review and boundaries

The complete selected contract has no confirmed contradiction with this UI choice, the six prices/caps, bounded claim family, retained benefits, exact transactions or current game ownership. Its owner for Meteor arithmetic is the separate numerical closure; UI consumes the actual plan and does not author another gameplay formula. `simulationDefeatEnemy` remains the canonical lethal owner, the ordinary discrete helper's epsilon rule stays unchanged, and the command does not manufacture elapsed time or enter sustained-DPS estimates.

Root should adopt the concrete Rift placement and separate Deeds Journal/Collection roots above, and freeze the proposed selector/plan API names when implementing. The existing root font base can remain16px; no global typography redesign is needed for this feature. If root chooses another base, the measured100/200% matrix changes with it.

Known shared-UI observations remain separate: the320px/32px Ember class label appeared close to/under the Bench area in prior Tree images, without a dedicated overlap measurement; a transient large-text toast also had a tight lower-card layout. The Tree fit selector did not include `.class-tag`, so neither observation is a demonstrated class-label or toast pass. This plan does not silently fix those unrelated surfaces or claim them accepted.

Browser emulation and actual V8 6.0 execution are useful distinct gates. Neither proves installed Android WebView behavior, OS text scaling, TalkBack, textZoom, native integration or an APK. Those remain explicitly untested until the separately authorized final platform stage. This scratch plan supplies no new Comet test PASS or feature acceptance.
