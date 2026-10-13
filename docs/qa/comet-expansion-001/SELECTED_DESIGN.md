# COMET_COMMANDS_001 — selected implementation contract

Status: design preparation only. Tree PR106 still requires terminal Full CI,
raw-evidence acceptance, development integration and fresh integrated tests.
Do not change the product for Comets before that sequence completes.

The current reviewed Tree source is commit
`768050d7cca586ea724e7ac677804a5ed7d6a3f5`, complete tree
`30213b2ae877ff64db08e3d06b087d040fe72ca2`, product SHA256
`ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3`.
Recheck the actual accepted development merge and source before implementation.
Main `67373faa531f0bb791c883210ee623320861e380`, PR102's draft status,
Android identity and all APK/release work remain held.

This contract selects the useful parts of [the original proposal](design-proposal.md),
narrows them through [the source review](root-design-review.md), and adopts
[the numerical closure](design-closure/README.md). The closure's model proofs
are design evidence, not an implemented Comet test pass. The original proposal,
review, observed baseline defects and numerical outputs stay immutable.

## 1. Scope and retained behavior

Deliver one independent improvement: replace three old Comet purchase rows
with two reusable manual command unlocks and three permanent improvement tracks;
retain Auto-Ascend. Repair the actual Comet purchase/Quest Refresh write-failure
and exact-debit defects, and preserve earned Deed reward value when a whole
integer credit cannot be represented. This requires an explicit schema2→3
migration, not silent deletion of ownership while filtering the new shop.

Lab, Forge and Tree effects, prices, paid raw values, overcaps, work queues,
ongoing Studies, saved Formation intent, currencies and Auto-Ascend keep their
existing owners. No new permanent ordinary damage/yield/Prism/work multiplier,
Comet bulk purchase, queue, auto-spending, currency conversion or scheduler.
Existing daily/login/quest income does not acquire a general-purpose debt ledger.

The requirement for twenty distinct active types applies to Lab, Forge and Tree.
The Comet catalog intentionally has six types, including Auto-Ascend.

## 2. Exact catalog

All prices are Comets and each activation purchases one level or one unlock.
Unlocks use sticky earned Deeds, not an unpersisted live threshold.

| ID / name | Unlock | Cap | Prices in order | Exclusive effect |
| --- | --- | ---: | --- | --- |
| `autoascend` / Auto-Ascend Ritual | Existing eligibility unchanged | 1 | 100 | Existing ownership, initial enabled state/target choice, subsequent toggle/target and live/offline automation |
| `meteor` / Meteor Strike | `d25` | 1 | 100 | Reusable manual bounded HP strike, one shared charge, once per saved encounter |
| `starcall` / Luminous Call | `d50` | 1 | 140 | Convert the current ordinary living nonboss to Luminous for one shared charge |
| `cometreservoir` / Orbital Reserve | `comet_first_command` and either command owned | 2 | 60, 120 | Capacity 1→2→3; no refill |
| `cometcycle` / Orbital Engine | `d100`, `comet_first_recharge`, either command owned | 3 | 80, 140, 220 | Work per real defeat 20→25→32→40; 4000 work earns one charge |
| `meteorcore` / Meteor Core | `d50`, `comet_boss_strike`, Meteor owned | 4 | 45, 75, 120, 180 | Max-HP strike ceiling 20→25→30→35→40%; power ceiling unchanged |

The five new types cost 1280C completely purchased; with Auto-Ascend, 1380C.
There are two command unlocks and nine improvement levels. No automatic purchase
of new entries during migration. Effects clamp raw improvement overcaps; a
valid raw nonnegative integer above a cap is retained and cannot buy further.

## 3. Charge bank and actual encounter ownership

The first successful purchase of either command grants exactly one charge.
Determine this from the pre-transaction ownership of both commands. A second
command purchase, any improvement, migration, load, Ascend or elapsed time grants
none. No initial charge is awarded because a deed or unrelated purchase exists.

Store integer charges in 0..capacity and integer work in 0..3999. A full bank
has work0. A real defeat contributes the effective Engine amount only when a
command is owned and there is room. Reaching capacity discards residual work;
there is no hidden bank. Buying capacity or speed keeps current charges/work.
In particular, 3970 work stays 3970 when Engine is purchased. Charges and work
survive Ascend unchanged. A recharge event means at least one charge actually
earned from real defeat work, not an initial grant or load.

Hook the actual manual defeat, mutation-only simulated defeat and Farm batch
defeat owners. All ordinary/Luminous/boss, tap/cast/passive/Auto-Tap/Spillway,
live/offline kills count. Never subtract lifetime totalKills snapshots: that
counter can be an accepted Number which no longer increments by one.

For batches, compute the small number of defeats needed to fill the remaining
slots (at most600 at base rate). Compare the actual batch count against that
threshold before multiplying. Saturating sets charges to capacity and work0;
the unsaturated multiplication is then small and exact. Add no per-kill loop,
callback boundary or new wakeup. Future manual command availability must not
enter sustainable DPS, boss retreat bounds or elapsed-window estimates.

Two booleans belong to the current saved enemy: `cometMeteorUsed` and
`cometCalled`. Clear them on every real enemy replacement, including the direct
Farm-batch replacement. Do not clear them on render, save, failed transaction,
or restoration of the same enemy with its existing HP-ratio reconstruction.
Capture a called kill before spawn clears its marker. A called enemy abandoned
by a mode change or Ascend grants no kill/event/refund or queued replacement.

## 4. Meteor numerical and combat contract

Use the exact finite binary64 values already in the game:
H=current enemy max HP, h=current enemy HP, P=`passiveWispDpsAt(currentDepth)`,
r=effective Core rank0..4. Require 0<h≤H and finite nonnegative P.

```
D* = min(floor(exact H × (4+r) / 20), floor(exact P × 12))
B  = greatest nonnegative integer Number ≤ D*
```

Safe results are exact; above the safe-integer range the selected result rounds
down to a representable integer. Use the private, bounded DataView quotient
kernel in the reviewed numerical candidate. Do not substitute ordinary native
multiplication/division, round an unsafe integer to nearest, reject merely
because the unused naive power product overflows, or add a product BigInt.

If h≤B, the plan is lethal, afterHP0 and actual loss h. Otherwise compute a
representable remainder at least h−B, correcting a too-large represented loss
with one `nextUp` as in the candidate. Require positive actual loss ≤B and the
reverse endpoint equality. If no positive represented loss fits, the command
is unavailable and spends nothing. This includes huge HP with a tiny budget.

Assign the planned HP directly inside the single staged command transaction.
Call canonical `simulationDefeatEnemy(policy, summary)` only for a truly lethal
plan. The existing discrete-damage helper treats residual HP≤1e−9 as defeated;
using it would violate this new strict ceiling. Keep that shared helper and its
existing callers unchanged. Do not advance the timestamp resolver or twelve
seconds of simulation. Twelve is a damage coefficient only.

The canonical P already includes the existing power of actually Active recruited
Wisps and their paid operands once. Support Wisps' own passive power may count;
a temporary Support cast buff does not multiply Meteor. There is no additional
Guardian tap, Fractured Core/Wisp cast, ability/module, temporary Support, charge,
tap counter, cast resource or Spillway factor. A real kill still gets canonical
Lumen, Shards, Motes/Sigils, boss Victory Charge, actual progression and any
newly reached Auto-Ascend once. Keep the existing boss Regrowth/Fractured Core/
Guardian's Mark mechanics; do not invent armour or freeze systems.

An accepted Meteor records firstCommand and, on a boss, bossStrike from an actual
positive HP debit. It marks Quiet Guardian as a manual-attack failure in the
same transaction. A refusal or failed primary write changes none of those fields.

## 5. Luminous Call and lifecycle

Call requires ownership, one charge, a finite living ordinary enemy and nonboss
current depth. It sets `enemyIsLuminous=true` and `cometCalled=true` without
changing HP/maxHP, depth, natural `luminousAccum`, rewards, Wisp charge or clocks.
It records firstCommand. It gives no immediate bounty or defeat and does not
fail Quiet Guardian. An already Luminous target or boss refuses for free.

The marked enemy's actual subsequent defeat supplies calledKill exactly once,
including a defeat after reload/offline and the first enemy of a Farm batch.
Use existing Luminous Sense, Dawnpriest, Support Motes, Distillation and current
rounding/reward-scale semantics through the actual defeat owner. Do not add a
second drop or replace the canonical Mote expression with a fixed bounty.

Both commands revalidate a read-only plan at activation and require a foreground
active game. Refuse while document.hidden, resetInProgress, reloadInProgress,
offlineCatchup, offlinePending, resumeFlowBusy, startupIntroPlaying or
persistenceBlocked. Refuse an already-ready Auto-Ascend boundary. An actual new
Meteor kill may legitimately reach the boundary and Auto-Ascend once.

## 6. Transaction ownership and Quest Refresh

Use one staged outer transaction for each shop buy, command and paid Refresh.
Plan only reads; it must not canonicalize or settle pending claims. Resolve
catalog IDs authoritatively; reject retired/unknown IDs and capped/locked entries.

A price C is payable only if W≥C, R=W−C is finite/nonnegative, W−R===C and
R+C===W. A new improvement level must also increment exactly. Do not accept a
zero-debit purchase at 1e30. After staging, capture the actual working state
immediately before save: a canonical kill/Auto-Ascend can replace that object.
Use the existing primary-commit identity rule. Primary failure restores the old
endpoint and old ascendRunToken; recovery-only failure keeps the committed new
primary endpoint. Catch unexpected mutation exceptions and restore the old
endpoint/token before propagating/reporting failure. No nested doAscend/save.
Render and emit success/Ascend effects only after the primary commit is known.

Existing paid Quest Refresh keeps its deterministic selection, eligibility,
cost=max(25, richest quest Comet reward), progress and no-positive-arbitrage rule.
Give it the same exact debit/primary rollback contract and a read-only plan used
by UI and action. Reject an unrepresentable refresh-counter increment. Old
Auto-Ascend+Trials and Auto-Ascend+all three Rest Stop historical purchases still
qualify. Add Auto-Ascend+earned `comet_called_kill` as the new-player route.

Legacy free Trial/cosmetic controls retain their behavior and route through the
new entitlement helper. Their UI relocation is not permission to delete them.

## 7. Explicit schema3 and old paid value

Add only the following bounded new state plus explicit new command owned flags:

```
cometUpgrades: {cometreservoir:0, cometcycle:0, meteorcore:0}
cometCharges: 0
cometWork: 0
cometMeteorUsed: false
cometCalled: false
cometEvents: {firstCommand:false, firstRecharge:false, bossStrike:false, calledKill:false}
cometClaims: {
  policy: 'comet-commands-001',
  retired: {comettrials:'absent', rifttrail:'absent', starfallcrest:'absent'},
  deeds: {}
}
```

`owned.meteor` and `owned.starcall` begin false. Levels live only in
cometUpgrades, not redundant boolean ownership. Retirement values are exactly
`absent`, `due` and `settled` (the numerical README's informal “none” means
absent; it was not a schema literal). Both due and settled retain the old benefit.
One snapshot-aware `cometHasLegacy(id,snapshot)` is the authority for old Trial
normalization/start, cosmetic normalization/equipment/rendering and Rest Stop.

Migration0→1→2 remains in its original order. New migration2→3 reads the old
strict-true purchased bits before SHOP filtering. It records their entitlements
and fixed due compensation, then retires those three old owned keys. Initialize
new commands/levels/work/charges/markers/events to zero or false. New event Deed
flags start false. Preserve all23 known old earned flags; they count as already
historically paid, without a retroactive683C claim. Previously unrecorded rounded
or lost rewards cannot be reconstructed safely from old flags.

The chosen retirement policy is a deliberate extra once-only compensation of
Trials140, Trail50 and Crest160, at most350C, while the old free Trial/cosmetic
features remain usable. This is an explicit balance allocation for catalog
retirement, not a claim that retaining the old features is currency-neutral.
Do not also grant new commands/levels. An old true purchase is honored even if
the old huge-wallet bug may have charged zero; history cannot prove otherwise.
Repeated load/import/Ascend never pays a settled retirement identity again.

Retain active/pending Trials, earned marks/results and equipped cosmetics. Marks
keep their existing normalization independently of current purchase entitlement.
Preserve F26's original policy, null value, raw price snapshots and paid bits
separately; its offline24/offline48 amounts are different claim identities.

For current schema3, all new blocks and required new paid fields must exist with
the specified types and closed key sets. Validate known raw nonnegative integer
levels, bounded charge/work, full-bank work0, four strict event booleans, two
strict encounter booleans and closed policy/retirement states. Preserve raw
overcaps while bounding effects. Validate event/marker ownership relations;
an active Call marker also requires its existing Luminous encounter. Earned
new event flags must have their actual stored event fact. Avoid source-global
state reads when validating another snapshot.

The deeds ledger contains only true pending IDs from the fixed27-item reward
policy; each pending ID must also have a sticky earned flag. Unknown keys/IDs,
wrong policy, false/nonboolean claim entries, orphan claims, or missing/malformed
current3 blocks throw `invalid-comet-claims` or `invalid-comet-state`. Do not
replace unknown paid data with an empty ledger or treat it as schema2 again.

Extend loadState's primary-preservation branch for these two errors. With a
valid recovery, use that endpoint but preserve the exact raw primary and block
persistence, with accurate Comet-history copy. With no valid recovery preserve
both original raw slots. Invalid backup imports preserve both slots and the
live endpoint. Keep ordinary corrupt-primary repair and unsupported-future
schema handling as their distinct existing cases. A valid explicit restore
uses the existing recovery/backup transaction contract.

## 8. Deeds and exact bounded claims

Keep all23 old IDs, checks, thresholds, rewards and sticky flags; total683C.
Auto-Tap remains12 Ascends, Auto-Empower20 original Forge levels, Lab queue60
original levels, Full Formation5. New catalog sizes cannot change those checks.
Remove asc5's obsolete advertised Eternal Momentum unlock only; retain its
actual predicate/reward/flags and historical paid Momentum benefit. Add current
command unlock copy to d25/d50/d100 without changing their checks/rewards.

| New Deed ID | Actual bounded event | Reward | Unlock relationship |
| --- | --- | ---: | --- |
| `comet_first_command` | A committed Meteor or Call | 5 | Orbital Reserve |
| `comet_first_recharge` | First charge earned from actual defeat work | 10 | Orbital Engine, also d100 |
| `comet_boss_strike` | A committed positive Meteor HP debit on a boss | 15 | Meteor Core, also d50 |
| `comet_called_kill` | Actual defeat of the marked called enemy | 20 | Quest Refresh, also Auto-Ascend ownership |

Use the four cometEvents facts in normal ACHIEVEMENTS.check functions and
existing applyAchievementChecks flow. Never infer them from old lifetime kills,
initial charge gifts or load. They survive Ascend. New rewards total50C.

Freeze an independent reward table and order: old23 then these four. Combined
with three retirements the new claim family has at most30 identities/1083C.
Do not derive refunds from future mutable prices or add general income debt.

For amount A, credit only if next=W+A is finite, next−W===A and next−A===W.
Credit and consume that identity together; otherwise preserve it due, with its
earned unlock active. Never split, combine or round claims to make them fit.

When a newly earned Deed completes, set flag and fixed claim together and
immediately attempt ONLY that new claim in the existing mutation owner. No
nested save and no sweep of old pending claims. This preserves normal immediate
rewards. Already earned checks never re-award or themselves retry the old claim.

At every existing canonicalization perform one pass: unchanged F26 first,
Trials140/Trail50/Crest160, then remaining pending Deeds in frozen order.
No hidden rescan loop. A later claim may make an earlier one payable on the
next canonicalization; numerical load idempotence is therefore not promised.
The invariant is retained exact wallet+due value and no replay of settled IDs.
Read-only UI plans do not invoke settlement.

A staged exact purchase may make a pending claim representable. Verify its
debit independently of the final net wallet change. For example, spending100
at2^54 can enable pending Trail50: the valid final net decrease is50. Both
1e30 and Number0.1 may retain small integer claims indefinitely;0.125 can
receive all1083C exactly. These are explicit representability limits.

Deed success copy must not promise an actual +N credit if that claim remains
pending. Prefer the same concise completion/name copy or an accurate pending
reward status. This is separate from the user's prohibition on extra price
warnings/deficit numbers. Existing price UI still shows costs only.

## 9. Economy and pacing limits

The old23 Deed pool is683C and the new four add50C. The resulting733C pool
alone is647C below the complete1380C catalog. This deliberately leaves later
levels as optional purchases funded by the existing repeatable quest/login
income; do not add another income multiplier or claim a measured days-to-max.

For an eligible old three-purchase owner,350C compensation can fund Meteor100,
Call140, Reserve1 at60 and Core1 at45, leaving5 of that principal. The actual
unlock events must occur first and add their original selected Deed rewards;
the migration itself gives no command or level. A683C principal can fund
Auto100, both commands240, both Reserve ranks180, Engine1 at80 and Core1 at45
for645C, leaving38 before the newly earned event rewards. These are fixed-price
affordability examples, not retrospective repayment of old spent Deeds.

The observed public early/mid fixtures have record5/17 and Comets0/55; neither
gets invented retirement value or early command access. The mature fixture's
850→1150 is the existing F26 refund, and it owns none of the newly retiring
three purchases. Preserve those distinctions in actual implementation tests.
Source and fixture identities are in inventory-economy.json; these observations
precede implementation and must not be described as new command playtests.

With room in the bank and charges continually used,2000 genuine defeats can
earn10/12/16/20 full charges at Engine ranks0/1/2/3. Without manual use, the
bank simply caps at1–3; no offline store of thousands of commands accumulates.
One Meteor per actual encounter and at most40% maxHP plus the canonical power
ceiling prevent three stored charges from becoming three strikes on one boss.
Call adds a chosen current Luminous encounter without modifying future natural
frequency, passive yield, the accumulator or the existing reward formula.

## 10. UI and acceptance work

Use a distinct `#comet-commands` section in the existing Rift `.card.stage`,
immediately after `.battle-row` and before the buff/Bond/stat details. It is a
sibling of `#enemy-stage`, never nested inside the attack button. The existing
enemy name, HP and trait provide the target context. Hide the section when no
command is owned. An owner sees both action rows; the unowned command links to
its purchase card in Deeds. Keep the six purchases in Deeds and put the retained
Trial Journal in its own stable sibling root there. Existing `#theme-list`
remains the Collection equipment surface. The section has intrinsic height,
wraps to one column at narrow/large text sizes and uses ordinary main scrolling;
it is not a fixed overlay. Bind this to the final source-bound UI plan.

Keep purchase and command actions separate, with visible current/next effects,
charges/work and honest
eligibility. All purchase and Refresh cost spans use the actual read-only plans:
each insufficient currency is red; affordable costs normal. Locked, capped or
otherwise unavailable actions do not miscolor affordable Comets. No deficit or
extra warning text beside prices. Preserve visible control position, focus,
44px targets, trusted touch/keyboard and reduced motion.

The pure numeric Meteor preview lives under `plan.meteor`; command-level
`available`/`reason` remain separate. A valid damage preview survives zero charges
or an offline lifecycle gate, while the actual command stays disabled. After an
accepted action, retain focus on its button if enabled; otherwise focus the
`#comet-commands` panel (`tabindex="-1"`, `preventScroll`) and restore the captured
viewport. Never transfer focus automatically to the other command. Passive
updates do not move focus. These two interface clarifications follow the final
read-only consistency review and take precedence over the UI plan's earlier
open-ended choice of a remaining action as a focus target.

Old Trial controls move to a stable Journal section for retained owners; their
draft target input must survive refresh. Old Trail/Crest definitions move out
of SHOP before cosmetic rendering stops finding them. Collection keeps those
controls and equipment for old owners; no old purchasable cards or free grants
to new players. Auto-Ascend controls retain native picker behavior.

Before implementation, finish the source-bound test/adapter map. Required
tests cover every row0/1/max/overcap, prices/gates/exact debit, all storage fault
boundaries, old/raw0/1/2/current3/future malformed states, F26+retirement+Deed
claims, live/manual/Auto-Ascend/offline/split/yielded chronology and no-new-command
baseline behavior. Preserve all original fixtures/scenario IDs and causal
negatives. Update exact schema/catalog assertions only where the declared
contract changed, retaining independent old23/683C and historical450C checks.

Use the numerical oracle against actual complete-IIFE game functions, with
fixed discriminatory counterexamples and actual Node8.3/V8 6.0 execution.
Exercise actual commands and canonical reward/Ascend callbacks; isolated helper
models do not substitute. Prove once-per-encounter and marked batch behavior,
no timer/charge/support extension, no manual-DPS estimate inflation, and primary
rollback/recovery commit including run-token identity.

Run actual320/390/430px × normal/200% root text × both motion preferences for
shop/cards/commands/Journal/Collection/Refresh and Auto-Ascend. Run every existing
Full/Lab/Forge/Tree mandatory lane plus a focused Comet lane on one final head.
Review raw artifacts and hashes, preserve any failures, then integrate only
into PR102's development branch and test the actual equal-tree merge.

Shared Wisp class-label/transient-toast large-text observations remain assigned
to the later common UI phase. Native Android/WebView60/textZoom/OS scaling,
TalkBack and installed APK acceptance stay explicitly untested until their
separate authorized final stage. No APK is built, signed or released here.
