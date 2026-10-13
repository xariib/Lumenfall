# Independent Comet design review for root

**Status: recommendations only; no Comet implementation, test run or acceptance.**
This is a subagent peer review of the frozen proposal and existing baseline
witnesses. Tree remains the current debugging/integration task. Recheck its
actual accepted development merge before implementing this separate feature.

## 1. Recommendation and scope

**Accept the narrower accounting scope.** A fixed ledger for newly earned or
already recorded unpaid Deed rewards, the three retirement claims, and exact
transactional Comet purchases/Quest Refresh is sufficient for the proposed
feature. The global `cometDailyDueExact` field, 1024-digit arithmetic and
power-of-two partial settlement in proposal section 8 are not necessary for
those bounded claims. Leave that daily/login/quest-claim accounting redesign out
of this feature.

This conclusion has a precise limit: it preserves every recognized earned flag,
entitlement, raw wallet and recorded pending claim. It cannot reconstruct an
unrecorded historical shortfall. Nor should this limited change be advertised as
making every existing Comet income path exact. Daily/login award date semantics
and amounts remain outside the proposed ledger scope. The supplied witnesses
exercise paid Quest Refresh, not a complete daily-income accounting rewrite.

The mandate requires replacement Comet abilities and permanent levels, retained
Auto-Ascend, explicit legacy mapping and preservation. It does not impose twenty
Comet purchase types or a global currency-ledger refactor. Five new types beside
Auto-Ascend are a coherent scope. The broad twenty-type requirement belongs to
Lab, Forge and Tree. [Mandate](../Lumenfall-tree/docs/qa/progression-expansion-001/ORIGINAL_MANDATE.md)

### Evidence actually reviewed

The product baseline is published commit
`3c931a26bbcf7b009dee03e7411ed41faeb971f8`, complete tree
`d11120bc250a6ac90fac1f5e598042a5572e5650`, source SHA256
`4e4707afca6672ea46aad03ebd05cd7341ad61d7316a9636fed6172dbfed96ef`.
The proposal's earlier `17d4ff66` working-file observation is historical; it is
not the current Tree viewport candidate and not this review's product source.
Input hashes and review clock are in
[root-design-review.identity.json](root-design-review.identity.json).

The existing [witness package](baseline-witnesses/README.md) records thirty
actual-handler cases: fourteen defect witnesses and sixteen controls. This
review did not execute them again. In particular:

| Observed existing behavior | Necessary consequence |
| --- | --- |
| All four original shop handlers leak live ownership/debit after a failed primary save, and grant ownership for represented debit zero at `1e30`. | Stage the retained Auto-Ascend purchase and new paid rows; do not preserve these payment defects as intended gameplay. |
| Quest Refresh spends 50→25, changes the quest and increments its counter despite zero successful writes; at `1e30` it refreshes for represented debit zero. | Repair the actual 25C handler, preserving its existing candidate-selection and entitlement behavior. |
| `tap100` nominal 3C credits 4C at `1e16`, zero at `1e30`, and the earned flag survives reload. | Mark a future achievement earned independently of whether its exact fixed reward can enter the wallet. |
| `autotap` and `labmaster` flags survive while their 25C/30C credits vanish at `1e30`. | Never revoke those automation unlocks to compensate for payment uncertainty. |
| Recovery-only failures preserve the successfully written primary endpoint. | Keep that behavior; a generic rollback on every false save return would be wrong. |

Direct records inspected include
[Auto-Ascend primary failure](baseline-witnesses/shop-autoascend-primary.json),
[oversized Auto-Ascend wallet](baseline-witnesses/shop-autoascend-huge.json),
[Quest Refresh primary failure](baseline-witnesses/quest-refresh-primary.json),
[oversized Refresh wallet](baseline-witnesses/quest-refresh-huge.json),
[rounded Deed credit](baseline-witnesses/deed-tap100-rounded.json), and
[earned Auto-Tap with unpaid credit](baseline-witnesses/deed-autotap-huge.json).

## 2. Minimal correct entitlement and pending-credit model

### One schema boundary; one authoritative owner for each old entitlement

I recommend the proposed explicit schema 2→3 transition. This is justified by
real existing normalization: `normalizeCurrentSave` copies ownership through
`SHOP` and achievements through `ACHIEVEMENTS`. An older reader can drop unknown
new paid fields or a compensation receipt; if old ownership survives without
the paid receipt, a later migration could compensate again. If ownership moves
entirely into an unknown ledger, the old reader can instead erase the benefit.
Use the existing future-schema preservation/recovery mechanism to avoid either
downgrade outcome. Keep save slots, package identity and backup prefix unchanged.
Source anchors: `normalizeCurrentSave` around 4266–4277,
`migratePersistedState` 4055 in the archived product.

Run existing 0→1→2 migrations first, then create the new policy exactly once.
Read strict-true `owned.comettrials`, `owned.rifttrail` and
`owned.starfallcrest` before the new shop filter removes those IDs. Strict true
matches the current accepted ownership contract; no truthy-string entitlement
needs to be invented. Do not create new commands, levels, charge or command
Deeds from retired ownership.

For each retired ID, the ledger needs only the equivalent of:

| Claim state | Old entitlement active? | Compensation due? |
| --- | --- | --- |
| None | No | No |
| Due | Yes | Its exact fixed original price |
| Settled | Yes | No |

Three closed states per known ID are sufficient; validated ownership/paid
booleans are an equivalent representation. Define the nonowner state explicitly
so it cannot appear as an unpaid zero-value claim. One snapshot-aware entitlement
helper must read this authority for Trial normalization/start/cancel, cosmetic
normalization/toggles/rendering and Rest Stop eligibility. Avoid two independent
mutable ownership maps whose disagreement can resurrect a paid claim.

Keep old Trials/marks/results and equipped cosmetics. `normalizeCometTrials`
currently preserves known marks independently of ownership; preserve that
behavior too. Old controls should remain accessible in the collection/journal,
without bringing retired purchase cards back into the new shop. Preserve both
old Refresh eligibility routes, including all three original Rest Stop flags.
Sources: `normalizeCometTrials` 5646, `queueCometTrial` 5678,
`restStopComplete` 3805; [original entitlement observations](baseline-witnesses/catalog-and-entitlements.json).

### Deeds: earned is separate from reward due

Keep `achieved` as the sticky unlock authority. Add a bounded set of pending
known Deed IDs. Its amounts come from a fixed reward table associated with the
ledger policy, not caller-supplied amounts or a future mutable price lookup.
The 23 original rewards total 683C; the four proposed rewards total 50C. There
can be at most 27 Deed claims and three retirement claims, with at most
**1,083C** in this new bounded claim family. No decimal-string debt is needed.
The existing F26 ledger remains separate from this bound.

On migration, preserve all existing earned flags and initialize no retroactive
Deed claims. Treat an already earned old Deed as historically settled for the
new accounting policy. This is an explicit migration convention, not proof
that its historical credit was exact. The existing data cannot distinguish a
legitimately paid old flag from the swallowed/rounded witness. Replaying every
earned reward would overpay valid saves; clawing back or clearing flags would
also destroy valid value.

When an unearned old or new Deed actually becomes earned after migration, set
the earned flag and its fixed pending claim in the same owning mutation. Apply
its unlock immediately. Clear only the pending claim after an exact credit;
never clear the earned flag because the wallet cannot receive it. Retrying a
pending claim does not re-run the eligibility/event requirement or emit another
new-Deed completion.

The four proposed new event facts can be the four new achieved entries
themselves if a narrow award helper is called only at genuine command/recharge/
kill boundaries. Four separate bounded event booleans are also workable if the
existing predicate pipeline needs them. They must not be inferred from old
lifetime counters, Trials or ownership. This is an optional storage simplification,
not a reason to refactor every old achievement predicate.

Current-schema ledgers must be present and validated. A missing/wrong policy,
unknown pending ID, nonboolean/nonenumerated state or an orphan pending claim
must not silently turn into an empty ledger or a fresh refund. Use existing
preservation/recovery handling. Fresh schema-3 state and the explicit migration
are the two places allowed to initialize an empty ledger.

### Settlement and conservation

Preserve the existing F26 receipt, including a valid `null`, original Prism-price
snapshots and paid bits. Do not reconstruct it from historical ownership during
2→3 migration. Equal numbers do not make F26's 140/160C purchases the same as
Trials/Crest. Settle its existing claims through its existing helper first.
Then try Trials140, Trail50, Crest160, then pending Deeds in one frozen ID order.
Do not combine or subdivide fixed claims merely to make a different floating
deposit possible.

A claim of amount A settles only when wallet+A is finite and both represented
differences are exact and reversible: `next−wallet=A` and `next−A=wallet`.
Otherwise both wallet and due status stay unchanged. At `1e30`, all 350C can
remain due indefinitely; that is retained value, not a promise of immediate
spendability. Do not cap the wallet, round it, convert the claim or falsely mark
it settled. The proposal's indivisible examples at 2^54 and 2^55 are compatible
with this model and the existing F26 approach. Source: `settleOffline12hRefund`
4014; [proposal section 7](design-proposal.md#7-retirement-compensation-and-one-authoritative-paid-value-ledger).

Ledger transitions and wallet changes must belong to the same persisted
endpoint. Repeated normalization cannot pay a settled item again. A backup
restore selects that backup's endpoint; it must not add backup compensation to
the current wallet. A failed primary leaves the previous live/stored endpoint;
recovery failure after a successful primary keeps the new endpoint. Ordinary
simulation continues to use its existing outer save owner, without one save per
kill or achievement.

One accounting detail needs to be explicit in the final tests: spending can
make an old claim newly representable, and canonical save may settle it.
**Net wallet movement is therefore not always just minus the purchase price.**
Prove the exact debit on the staged subtraction and separately prove every
credited claim; final wallet equals prior wallet minus that price plus those
exact credits. Cost previews must remain read-only. Do not alter existing F26
settlement merely to force a simplistic net-debit assertion to pass.

## 3. Compensation and prices

The proposed price arrays are closed, finite and internally consistent:

| Purchase | Price sum | Rank effects |
| --- | ---: | --- |
| Auto-Ascend | 100C, unchanged | Existing ritual behavior |
| Meteor | 100C | Permanent command unlock |
| Call | 140C | Permanent command unlock |
| Reserve | 60+120 = 180C | Command capacity 1→2→3 |
| Engine | 80+140+220 = 440C | Future kill-work 20→25→32→40 |
| Core | 45+75+120+180 = 420C | Meteor HP ceiling 20→25→30→35→40% |

The five new types cost 1,280C; with Auto-Ascend the total is 1,380C. Their
prerequisites do not create an obvious dependency cycle: the first owned command
supplies its initial charge, first real use unlocks Reserve, a real subsequent
recharge unlocks Engine subject to d100, and a real boss strike unlocks Core
subject to d50. Original Deed flags, not reinterpreted displayed Rift thresholds,
must drive those old gates. No new daily cap, automatic spending or bulk Comet
purchase is needed. [Catalog and arithmetic proposal](design-proposal.md#2-proposed-catalog)

**350C plus retained old features is deliberate additional retirement
compensation.** It is not a neutral conversion, and not something that follows
automatically from the no-loss requirement. Root should record that balance
decision explicitly: each owned original purchase yields its fixed amount
once, while its legacy feature remains; there is no additional free replacement
command/level. The no-double-grant invariant is then one compensation payment
per recognized original entitlement, not an assertion that the player retains
only one economic benefit. Do not retroactively strip ownership merely because
the baseline oversized-wallet bug means it cannot prove an exact old debit.

These prices are a coherent starting catalog, not measured live pacing. The
existing public-fixture arithmetic does not prove how often players choose the
commands or that Core is valuable at every boss. The current/next UI must show
the actual effect on the current target when the 12×power ceiling binds; buying
Core can correctly give no immediate damage increase in that situation.

Repair the retained Auto-Ascend100 purchase along with new rows. Its successful
initialization remains the existing ON/target-selection behavior, and an
unsuccessful primary must not leak that initialization. Preserve already owned
target/toggle values. Quest Refresh keeps its exact 25C cost and deterministic
selection, with one staged owner for cost, quest ID and refresh counter. This
fix is directly supported by the witnesses and does not require rewriting daily
login or quest-reward accounting.

## 4. Meteor and Call are distinct, with a few contracts still to close

### Mechanic ownership

The proposed family is mechanically distinct from ordinary Forge/Lab/Tree
multipliers. Reserve and Engine affect only a shared Comet command bank; Core
affects only Meteor. Meteor is a finite manual action, not a tap or Wisp cast.
Using canonical passive party power as one input does not sell that passive
power again, provided all existing paid operands enter once and no second
Guardian/Wisp/Support factor is added.

Call has intentional adjacency to Forge Luminous Tracking, but a different
operation: it converts this living ordinary enemy by player choice, competes
with Meteor for a bounded charge and leaves natural spawn chance/accumulator
unchanged. It must remain nondamaging, nonqueued and nonautomatic. Root can
accept that distinction under the exclusivity mandate; it should not describe
Call as another purchasable natural-frequency bonus. Do not promise identical
whole future runs: additional legitimate rewards can change later purchases.
The direct Call operation itself must not advance the natural sequence.

### Meteor numerical contract is not completely closed yet

For safe integer max HP, the proposal is precise:
`min(floor(H×(20+5r)/100), floor(12×P))`, using quotient/remainder for the percent.
`passiveWispDpsAt(depth)` really is unbuffed in the reviewed source; `idleDps`
adds the temporary Support multiplier separately. No substitute power helper
is needed. Source: `passiveWispDpsAt` 5052, `idleDps` 5056.

The proposal still leaves a large-value branch as prose. Current normalization
accepts finite max HP beyond safe integers and can accept fractional HP. Before
implementation, freeze how the percentage floor, power ceiling, overflow and
represented positive HP loss work for those states. The normal formula's
intermediate `H×percent` can overflow despite a finite intended fractional hit.
Do not claim exact percentage-floor behavior from an unspecified reordered
floating expression. This is a concrete missing new-effect contract, not a
request for a general big-number engine or new currency representation.

Keep the advertised max-HP ceiling, not a fraction of current HP; require actual
represented positive damage, and refuse without a charge debit when no valid
hit exists. Unused overkill must not enter Forge Spillway. The 12×P coefficient
is a damage snapshot, never simulated elapsed time. Hypothetical future manual
commands must not improve automatic sustainable-DPS or boss-retreat bounds.

### Shared lifecycle and encounter contract

Apply the proposal's already-ready Auto-Ascend refusal to **both** commands.
An existing ready boundary must not let the input consume the outgoing run's
enemy; a legitimate Meteor kill may itself make Auto-Ascend ready and then run
the unchanged canonical Ascend. Preserve the existing target N / cleared N−1
interpretation, ownership, enabled flag and mode intent.

Use one outer staged transaction with the mutation-only discrete-hit/defeat/
Ascend path. Never nest public `dealDamage→defeatEnemy→doAscend` inside another
paid save. Explicitly pass `allowSpill=false`; the current helper defaults to
the existing spill behavior when omitted. Do not call the whole timestamp
resolver just to apply one hit, because it also executes due abilities, queues
and studies. Quiet Guardian failure, charge debit, used flag, actual damage,
new event Deeds, legitimate kill rewards and possible Ascend are one endpoint;
restore `ascendRunToken` if its primary fails. The recovery-only case retains
the committed endpoint. Sources: `simulationDealDiscreteDamage` 8912,
`simulationDefeatEnemy` 8729, `simulationApplyAutoAscend` 8716,
`forgeCommitPaidMutation` 4719, `doAscend` 6589.

Preserve `meteorUsed` and `cometCalled` only with the same restored encounter,
including HP-ratio reconstruction. Clear them whenever an actual replacement
enemy is created, including the direct Farm batch assignment that bypasses
`spawnEnemy`. Do not clear them on render, ordinary save/reload or a failed
transaction. Use the existing transient run token across Ascend, not a
comparison of unsafe lifetime counters. Call abandonment by an explicit new
encounter gives no charge refund/requeue.

## 5. Kill-work and event order

The bounded supply model is sound: charge count 0..capacity, work 0..3999,
4000 units per recharge, no work before ownership, no refill on load/Ascend,
and zero hidden remainder when full. First command purchase gives one charge;
the second unlock and every improvement preserve the existing bank and work.
Engine changes only future work. Source-derived sample rewards are not fixed
Call bounties: reuse the canonical Luminous reward path and current rounding.

Use real event counts at manual defeat, simulation defeat and Farm batch. Those
are the three actual `totalKills` mutation sites in the baseline; the counter
delta is not a reliable event count at huge accepted values. Bounded saturation
can stop after at most the work needed to fill three slots (at most 600 defeats
from empty at rank zero). `fastForwardedKills` is already part of the batch
count, not another reward input. No new wakeup cadence or per-kill offline loop
is needed. [Existing hook map](baseline-witnesses/README.md#existing-hooks-for-a-later-atomic-command)

Capture a Call-marked first enemy before its replacement. A batch of many kills
can earn Called Light once from that initial enemy, without marking later
natural Luminous enemies as called. Credit work and event facts at the genuine
kill boundary before possible Ascend; never award them again from the final
offline summary. The full offline transaction already owns persistence.

The manual and simulation defeat tails have different existing achievement
positions around Auto-Ascend. Use one chosen canonical path for the new command
and record each new fact once; do not call both tails. Existing old-path
mathematics and chronology remain unchanged at zero new command ownership,
apart from the explicit ledger/migration/reward repair. A future whole-window
regression is required by the existing mandate, but none was run for this review.

## 6. Decisions to freeze before the next feature

| Decision | Review recommendation |
| --- | --- |
| Daily/login debt refactor | Exclude it. State the narrower accounting guarantee clearly. |
| Legacy compensation | Explicitly adopt or revise the intentional 350C maximum while retaining all three old entitlements; never grant free new levels as well. |
| Save and claim policy | Schema 3; fixed known-ID ledger; preserve all old earned flags as historically settled, record new unpaid rewards, keep F26 separate and unchanged. |
| Catalog | Accept the five-type structure and closed prices as the initial design, subject to later measured pacing and actual UI tests. |
| Command ownership | Accept current-enemy Call as the intentional adjacency to natural Tracking; keep manual-only casting and the shared bounded bank. |
| Remaining exact behavior | Close Meteor's unsafe/fractional-HP branch and apply shared ready-boundary refusal; freeze the transaction/encounter rules above. |

Retirement intentionally changes active tests that expect the three retired IDs
to remain purchasable. Preserve their original frozen baselines, and replace
only those obsolete acceptance expectations with actual retired-purchase refusal
plus explicit old-entitlement/compensation preservation. Do not hide that
intentional change by weakening Auto-Ascend, Trial, save or numerical assertions.

## 7. Separate shared-UI follow-up, outside Comet economics

Root reported an apparent overlap in the third diagnostic's
`mobile/tree-six-320-2-reduce.png` at width 320 / root font 32: Ember's
`.class-tag` (`Starcaller · Burst`) appears beneath the Bench button. Root viewed
the image; no geometric overlap measurement has been supplied. The noted
`treefit` selector covers `.name`, not `.class-tag`, so no class-label-fit PASS
can be inferred from that selector. Record this for the later shared UI phase;
it is not a confirmed measured overlap or a reason to expand this Comet economy
scope. No image or product was altered by this review.

No repository files, source code, tests, staging or remote state were changed.
No new witness, arithmetic sweep, browser run or gameplay execution was performed.
Native Android/WebView integration and TalkBack acceptance remain separate.
