# Comet baseline witnesses — published 3c931 / 4e4707

Status: **known baseline defects reproduced; preparation only**. No Comet feature, migration, handler repair or new feature branch was implemented. These are bounded Node diagnostics against the published product, not a product-acceptance PASS.

## Identity and method

Source commit: `3c931a26bbcf7b009dee03e7411ed41faeb971f8`; tree: `d11120bc250a6ac90fac1f5e598042a5572e5650`. Archived `source-3c931.html`: 618,571 bytes, SHA-256 `4e4707afca6672ea46aad03ebd05cd7341ad61d7316a9636fed6172dbfed96ef`. The source came from the exact local Git object for that published commit, not the current uncommitted viewport candidate.

The existing complete-IIFE Tree harness is archived unchanged, SHA-256 `bcf080ce494ee1a2df450241dbd6a087fb6880239c3d2e711d1d2116f4ce3463`. Additive `observer-hooks.js` exposes the original shop/quest handlers and wraps the harness's storage adapter to record **attempted** writes, including thrown writes. No production handler body was replaced. The observed input's separate SHA is in `receipt.json`; presentation, clocks and storage remain the pre-existing harness adapters. No browser or Android behavior was tested.

`node witnesses.cjs > witnesses.stdout.json 2> witnesses.stderr.txt` exited **0** under Node **v24.19.0**, V8 **13.6.233.17-node.51**, with empty stderr. The script executes **30 actual-handler cases**, plus five direct eligibility and five legacy-entitlement observations. Fourteen cases witness defects; the remaining sixteen are ordinary, insufficient-wallet or recovery-only controls. These are not mutation-negative controls and are not counted as such.

Every case references its original generated seed and exact accepted/live/primary/recovery endpoint bytes in content-addressed `blobs/`. All saves are synthetic. Purchase attempts, successful writes, backup export attempts and retry attempts are separate operations. Actual backup export uses `currentSaveBackup`, which itself calls `saveState`; its additional writes are never included in the purchase count. Raw backup codes and their decoded endpoints are preserved. `acceptance.json` and `manifest.json` bind original outputs, test/harness/source hashes, actual command, exit code and clock-tool UTC observations.

## Reproduced results

### All four Comet shop rows

| Item | Quoted price | Primary-failure seed → live balance | Actual result |
|---|---:|---:|---|
| `autoascend` | 100 | 107 → 7 | `true`, live ownership granted |
| `comettrials` | 140 | 147 → 7 | `true`, live ownership granted |
| `rifttrail` | 50 | 57 → 7 | `true`, live ownership granted |
| `starfallcrest` | 160 | 167 → 7 | `true`, live ownership granted |

For each primary-failure case, the purchase attempts primary once, never attempts recovery, and records **zero successful writes**. Both stored slots retain the seed. Cold reload restores the old wallet and unowned row. Same-session retry returns `false` because the leaked ownership is already true; cold-reload retry performs the legitimate original purchase and exact debit.

The Auto-Ascend case also witnesses the original purchase initialization: live OFF/target 43 becomes ON/target 30 for the seed's reached Rift 30. The failed primary leaves cold storage OFF/43. This is evidence of the purchase's non-atomic state change, not a proposal to change Auto-Ascend initialization or its saved target semantics.

While primary still throws, actual backup export makes another failed primary attempt but encodes the changed live ownership/wallet. That backup differs from the committed cold-load endpoint. This behavior is recorded separately in every primary-failure case.

At an accepted wallet of `1e30`, all four original handlers return `true`, persist ownership in primary and recovery and retain it on cold reload, with **represented debit 0**. Normal funded cases debit exactly the quoted amount. One-Comet-short cases refuse without a mutation or storage attempt. Recovery-only failures attempt both slots, successfully update primary once and preserve that committed paid endpoint on cold reload; recovery remains the old snapshot. A future repair must retain that primary-committed behavior.

### Quest Refresh

The seed is entitled through Auto-Ascend + Comet Trials and has unclaimed quests `q_tap_small`, `q_kill_small`, `q_empower`, date `2026-10-10`, count 0 and 50 Comets. The actual quote is 25.

With primary throwing, `refreshDailyQuest('q_tap_small')` returns `true`, spends 50 → 25, replaces the first quest with `q_tap_big` and increments the saved refresh counter 0 → 1 in live state. It attempts primary once, recovery zero times, and makes zero successful writes. Cold load retains 50 Comets, the original quest and counter 0. Actual backup export encodes the leaked new endpoint. Retrying the original quest ID in the leaked session returns false because that ID was removed; cold reload retries the legitimate change successfully.

At `1e30`, the replacement and counter increment are committed with **zero represented debit**. Ordinary funded, one-short and recovery-only controls behave as recorded above for shop purchases. No randomness was added: replacement selection remains the existing date/counter/slot calculation.

### Deed Comet rewards and sticky unlocks

`applyAchievementChecks()` performs **no storage writes itself**. The witness therefore records that call, a separate actual `saveState`, and cold reload/recheck.

| Isolated Deed | Initial Comets | Nominal reward | Actual represented credit | Persisted result |
|---|---:|---:|---:|---|
| `tap100` | 0 | 3 | 3 | Earned once; ordinary control |
| `tap100` | `1e16` | 3 | **4** | Earned flag and over-credit persist |
| `tap100` | `1e30` | 3 | **0** | Earned flag persists; recheck returns no reward |
| `autotap` | `1e30` | 25 | **0** | Auto-Tap earned flag persists |
| `labmaster` | `1e30` | 30 | **0** | Auto-Empower earned flag persists |

The future design must preserve these existing earned flags. A reward repair cannot revoke the automation unlock just because its associated Comet addition was unrepresentable. This witness does not establish which historical players lost or over-received rewards: the current save has no per-Deed settlement ledger, so a blanket replay of already-earned rewards would duplicate legitimate past payments.

## Original catalogue, gates and entitlements

`catalog-and-entitlements.json` independently checks the exact original **23 IDs and rewards, total 683 Comets**, against runtime catalogue definitions. It also preserves original Trial IDs `quiet` and `single` and their rules/marks. Direct original predicates give:

- Auto-Tap: 11 Ascends false, 12 true.
- Auto-Empower: 19 original Forge levels false, 20 true; adding only a new Forge track and Tree track does not satisfy it.
- The five counted Forge IDs remain `focus`, `sense`, `formation`, `resolve`, `charge`. Original eight Study IDs and five foundation IDs are stored separately in the same receipt.
- Quest Refresh: Auto alone false; Auto + Trials true; Auto + all three `rememberbulk/offline24/offline48` legacy flags true; only two flags false; Trials without Auto false.

The following are **read-only source observations, not extra runtime migration witnesses**:

- `normalizeCurrentSave` (4129; ownership/Deed loops around 4267) copies earned/owned flags by the current ACHIEVEMENTS/SHOP catalogues. Merely removing a row from SHOP would discard its current owned flag on canonicalization. The non-shop legacy whitelist currently contains only `rememberbulk`, `offline24`, `offline48`; it does not yet preserve Trials/Trail/Crest.
- `normalizeCometTrials` (5646) requires Trials ownership for pending/active Trial records. Current cosmetic selections require owned Trail/Crest. All these saved entitlements need an explicit preservation path before retiring the shop rows.
- The prior proposal's possible 140 + 50 + 160 = **350 Comet retirement compensation** is not implemented or newly approved here. It is separate from F26's old `offline24` 140 and `offline48` 160 refunds. Equal price numbers do not identify the same purchase. Keep F26 `offline12hRefund`, its original exact Prism-price list, pending claims and `cometsPaid`/`prismsPaid` bits intact; `settleOffline12hRefund` (4014) already defers unrepresentable deposits rather than rounding them away.
- Existing owned flags do not prove an exact historical debit: the reproduced oversized-wallet hole demonstrates why. No retroactive ownership removal or automatic clawback is justified by these diagnostics.

## Existing hooks for a later atomic command

This section is a **code-path map only**. No Meteor, Orbital work counter, command wrapper or nested-failure mutant was implemented or executed.

| Existing hook in archived source | Relevant behavior |
|---|---|
| `simulationDealDiscreteDamage` (8912) | Existing mutation-only discrete hit; delegates an actual defeat and returns whether it killed. Its fourth `allowSpill` argument must explicitly be `false` if a new command does not own Forge Spillway. Omitting it inherits the existing spill behavior. |
| `simulationDefeatEnemy` (8729) | Canonical rewards, Luminous/Boss credit, total/daily kills, Forge boss victory, Farm/Push spawn, Deed check and mutation-only Auto-Ascend. No primary/recovery write. |
| `simulationApplyAutoAscend` (8716) | Applies original ready predicate, calls `applyAscendMutation`, records actual reward summary, canonicalizes in memory and checks Deeds. No storage write. |
| `applyAscendMutation` (6523) | Performs old Trial completion/reset/pending start, party/paid-Tree reset effects and changes `ascendRunToken`. Does not save itself. |
| `forgeCommitPaidMutation` (4719) | Existing outer staged-state owner. It distinguishes a failed primary from committed-primary/recovery-failed by state identity after `saveState`. Its generic rollback covers saved state, not a caller's separately changed transient run token. |
| `doAscend` (6589) | Actual manual wrapper has the required explicit old-token restoration on failed primary; this is a reference for token rollback semantics. It saves, so it is unsuitable as an inner action of another paid transaction. |

The exact unsafe nesting to avoid is `outer staged command → dealDamage → defeatEnemy → checkAutoAscend → doAscend → inner forgeCommitPaidMutation → saveState`. An inner primary commit could already persist the outer command's working endpoint before the outer transaction finishes. If a subsequent outer write fails, an apparent outer rollback cannot erase that earlier committed endpoint. Manual `defeatEnemy` also performs visual feedback before such an outer commit. Prefer the existing mutation-only simulation hit/defeat/Ascend path inside one future transaction, then feedback after primary ownership. Snapshot and restore the transient run token on failed primary, but do not roll back primary-committed/recovery-failed state. The already-accepted Auto-Ascend predicate and target are not to be redesigned.

There is a real ordering distinction to preserve deliberately: manual `defeatEnemy` checks Auto-Ascend before its normal trailing Deed check, while simulation defeat records Deeds before mutation-only Auto-Ascend and again after reset. Do not combine both paths and accidentally award or resolve events twice. Quiet Guardian's existing manual-damage policy is recorded by `recordCometManualAttack` (5672); any proposed damaging command needs an explicit Trial rule before implementation.

### Chronology, Farm and offline accounting

Only three authoritative runtime sites increase `state.totalKills` in this source: manual `defeatEnemy` (5483), `simulationDefeatEnemy` (8758), and `simulationBatchFarmKills` (8815). A later finite kill-work resource must consume the actual event count at those sites, including kills immediately followed by Auto-Ascend. It must not infer work from a before/after lifetime counter delta: large accepted counters can stop representing increments.

`simulationBatchFarmKills(count,policy,summary)` (8774) awards **count** actual kills, determines Luminous crossings, advances the natural accumulator and updates the pending enemy. `fastForwardedKills += count-1` is diagnostic work avoidance, already contained in the total kill count. Adding it again would double-count. A capped work resource can compare the incoming count with its finite remaining threshold before multiplication; it must not create an unbounded per-kill loop or trust huge `count * rate` arithmetic. This is a design constraint, not implemented logic.

`simulationApplyFarmPassive` (8828) uses the exact represented damage/HP decomposition and delegates its count once. `simulationApplyPushPassive` (8902) resolves the actual ending enemy. Neither is a shortcut for an intended one-target tactical command.

`advanceAuthoritativeTime` (9130) owns the same event clock for live and resumable processing. The source's defined ordering is passive damage/death and ready Auto-Ascend; Support expiry; Active-party Wisp abilities; Auto-Tap; Auto-Empower; Forge queues; Study completion/paid starts/speed; Boss retry/retreat. `simulationResolveTimestamp` (9030) can execute all those due events, so invoking it merely to apply a new single hit would introduce extra gameplay ordering. Define the new manual input boundary first; retain existing equal-timestamp semantics.

`offlineProgressSteps` (9784) uses the same resumable engine and then processes real foreground time spent during catch-up. `applyOfflineProgress` (9833) owns a whole-window working/base state transaction, blocks ordinary saves while pending and commits the final endpoint once. Any future kill-work field must survive every yielded/canonical/Ascend path and must not be awarded again from the final summary. A command must not interleave into pending catch-up or create an intermediate save inside it. The existing 256-event/8-ms yielding controls and all accepted offline oracle expectations remain mandatory.

## Limits

These witnesses cover accepted synthetic schema-2 states, the exact four original shop handlers, one deterministic eligible Quest Refresh slot, specified finite oversized balances, actual save faults/reloads/backups and isolated Deed predicates. They do not test malformed saves, every representational boundary, full UI, physical Android, a future migration or a new command. No new baseline fault was inferred solely from source inspection; observed defects and code-path design risks are labelled separately.

All output is new scratch material. The earlier viewport evidence remains untouched. No repository/product/test/staging/remote operation was performed.
