# Comet Commands and Deeds — proposal for review

**Status: unaccepted design proposal. Nothing in this document has been implemented.**
The next feature begins only after the accepted Tree change is integrated into
development. Main and APK publication remain held. This document proposes five
new purchase types beside the unchanged Auto-Ascend purchase; the mandate's
twenty-type target applies to Lab, Forge and Tree, not Comets.

## 1. Evidence and design boundary

The read-only inventory uses published PR106 head
`3c931a26bbcf7b009dee03e7411ed41faeb971f8`, development base
`2d01049393e3bb45a90d80e07af52ae0484b0ec5`. GitHub reported the PR open/draft;
the local checkout had the same HEAD plus the owner's pending Tree/UI edits.
The proposal deliberately reads `git show <published-head>:index.html`, not those
uncommitted edits. Product SHA256 is
`4e4707afca6672ea46aad03ebd05cd7341ad61d7316a9636fed6172dbfed96ef`
(618,571 bytes); the observed working file was `17d4ff66…`.
Read-only arithmetic/inventory clock: **2026-10-10 21:08:20 UTC**. The final Tree
merge/source must be checked again before implementation; this is not a claim
that Tree has already merged or that these observations cover a later source.

The user mandate is [ORIGINAL_MANDATE.md](https://github.com/karahaNx/Lumenfall/blob/3c931a26bbcf7b009dee03e7411ed41faeb971f8/docs/qa/progression-expansion-001/ORIGINAL_MANDATE.md).
It calls for special Comet purchases combining one-time ability unlocks and
permanent levels, coherent Deeds, retained Auto-Ascend, and explicit preservation
of paid value. Here, **one-time unlock means one permanent purchase of a reusable,
player-triggered command**. It does not mean a consumable bought again with
Comets each time.

### Current facts that constrain the proposal

| Current behavior | Consequence for this design |
|---|---|
| SHOP contains Auto-Ascend100, Trials140, Trail50, Crest160. | Preserve Auto-Ascend100; retire the other three purchase rows with exactly350 Comets of documented original prices. |
| The23 current Deeds pay683 Comets in total. | Keep every old ID, check, threshold, reward and earned flag. New Comet achievements are additive. |
| Current normalization copies owned flags through SHOP, and achieved flags through ACHIEVEMENTS. | Removing catalog entries without a separate recognized entitlement set would delete old ownership on load. |
| Trial normalization and cosmetic equipment depend on the old ownership flags. | Move those dependencies to an explicit non-shop entitlement helper before retiring rows. |
| Quest Refresh requires Auto-Ascend and Trials, or Auto-Ascend and all three historical Rest Stop purchases. | Both old positive eligibility routes must remain. Add a route for new players. |
| Existing F26 already owns separate140/160 Comet hour-refund claims. | Never confuse its offline24/offline48 claims with the equally priced Trials/Crest purchases. |
| Shop purchase and Quest Refresh currently subtract before calling saveState, ignore its result, and lack exact-debit checks. Deeds mark earned before adding Comets. | Their Comet transaction/reward paths need focused repair; a catalog replacement alone would retain these failure modes. These are code observations, not newly executed fault-test results. |

Primary anchors: [SHOP/Trials](https://github.com/karahaNx/Lumenfall/blob/3c931a26bbcf7b009dee03e7411ed41faeb971f8/index.html#L3664),
[Deeds](https://github.com/karahaNx/Lumenfall/blob/3c931a26bbcf7b009dee03e7411ed41faeb971f8/index.html#L3529),
[normalization](https://github.com/karahaNx/Lumenfall/blob/3c931a26bbcf7b009dee03e7411ed41faeb971f8/index.html#L4266),
[Quest Refresh](https://github.com/karahaNx/Lumenfall/blob/3c931a26bbcf7b009dee03e7411ed41faeb971f8/index.html#L3805),
[F26 ledger](https://github.com/karahaNx/Lumenfall/blob/3c931a26bbcf7b009dee03e7411ed41faeb971f8/index.html#L3998),
[shop handler](https://github.com/karahaNx/Lumenfall/blob/3c931a26bbcf7b009dee03e7411ed41faeb971f8/index.html#L6338),
[Deed award handler](https://github.com/karahaNx/Lumenfall/blob/3c931a26bbcf7b009dee03e7411ed41faeb971f8/index.html#L5618).

## 2. Proposed catalog

All prices below are **Comets**, exact integer arrays in purchase order. Single
purchases only; no bulk, queue or automatic Comet spending. The new IDs start
unowned/level0 in existing saves. Named Deeds refer to sticky earned flags.

| ID / name | Unlock | Cap | Exact prices | Effect |
|---|---|---:|---|---|
| `autoascend` / Auto-Ascend Ritual | Existing eligibility, unchanged | 1 |100| Existing ownership, initial target selection, enabled state, subsequent target/toggle and live/offline automation unchanged. |
| `meteor` / Meteor Strike | Existing `d25` Deed | 1 |100| Spend1 command charge for one bounded strike against the current living enemy. At most one Meteor per saved encounter. Base maximum20% of enemy max HP, additionally limited by current Active Wisp power. |
| `starcall` / Luminous Call | Existing `d50` Deed | 1 |140| Spend1 charge to make the current ordinary, living nonboss Luminous. Preserve its HP and the natural Luminous accumulator. No damage, new enemy, immediate payout or queued summon. |
| `cometreservoir` / Orbital Reserve | New `comet_first_command` Deed and either command owned | 2 |60,120| Increase command capacity from1 to2 to3. Buying capacity does not refill it. |
| `cometcycle` / Orbital Engine | Existing `d100` plus new `comet_first_recharge`, and either command owned | 3 |80,140,220| Increase future kill-work per genuine defeat:20→25→32→40 units. A charge requires4000 units:200→160→125→100 defeats from empty progress. |
| `meteorcore` / Meteor Core | Existing `d50`, new `comet_boss_strike`, and Meteor owned | 4 |45,75,120,180| Raise Meteor's enemy-HP ceiling20→25→30→35→40%. Keep its power ceiling and once-per-encounter limit unchanged. |

The five new types cost1,280 Comets fully purchased; Auto-Ascend makes the full
catalog1,380. There are two command unlocks and nine permanent improvement levels.
No new currency exchange or permanent ordinary damage/yield/work/Prism multiplier
is proposed. Lab, Forge and Tree formulas and ownership remain authoritative.

Comet ownership is a distinct resource/action family. Forge's Luminous Tracking
continues to control the **natural future encounter frequency**; Call changes one
already present encounter by explicit player choice. It never changes that
frequency function. This is intentional tactical adjacency, not another copy of
Tracking's `+.005` per-level operand. Root should accept that distinction before
implementation.

## 3. Command supply and operating state

Use a shared integer charge count, capacity1–3, and `cometWork` in0–3999 units.
The first successful purchase of either command grants exactly one initial
charge. Purchasing the second command, an improvement, loading, migration,
Ascend and elapsed time alone grant none. Determine that first purchase from
pre-transaction ownership of both commands; never refill through normalization.

Each **actual defeated enemy** contributes20/25/32/40 units according to Engine
rank when the player owns a command and the bank is below capacity. This includes
normal, Luminous and boss kills, and manual, Auto-Tap, Wisp ability, passive,
Spillway, Farm-batch and offline kills. Counting a Call-marked enemy is correct:
Call changes one existing encounter and does not create an additional kill.
Use actual event/batch counts, never the difference of lifetime `totalKills`,
which may stop incrementing at huge accepted Numbers.

Consume4000 units per earned charge. If the bank reaches capacity, stop progress
at0; there is no hidden reserve behind a full bank. Carry charges and partial
work across Ascend unchanged. Engine purchases affect only future kill-work;
an existing3970 units stays3970 after purchase. Reserve purchases retain both
the existing charge count and partial work. No charge work runs before first
ownership and no historical kills are retrospectively counted.

Batch arithmetic can be bounded without multiplying an unsafe kill count:
compute the at-most600 defeats needed to fill all remaining slots at the current
rank. If the actual batch count reaches that small threshold, set the bank full
and work0. Otherwise the multiplication is small and exact. Do not introduce
new scheduler wakeups or run one JavaScript iteration per offline kill.

Minimal proposed operating fields are command ownership, three raw improvement
levels, charges/work, two current-enemy booleans (`meteorUsed`, `cometCalled`), and
four bounded lifetime Comet-event facts for new Deeds. The existing
`enemyIsLuminous` stores Call's actual encounter effect; `cometCalled` only proves
the new Deed event. Preserve enemy booleans when restoring the same saved enemy,
including HP-ratio reconstruction, and clear them only when a new encounter
actually replaces it. Loading must not make the same enemy available for a
second Meteor.

## 4. Meteor: exact effect, power source and wall boundary

At the accepted click, snapshot enemy max HP `H`, current HP `h`, effective Core
rank `r`, and `P = passiveWispDpsAt(currentDepth)` **without a temporary Support
buff**. Proposed damage is:

`D = min(floor(H × (20 + 5r) / 100), floor(12 × P))`.

Use max HP for the percentage and current HP only for actual loss/lethality.
This keeps the action's advertised size stable as the enemy is damaged. It is
not a fraction of current HP that asymptotically prevents a finishing hit.
No minimum-one damage is invented: if `D` is zero, invalid, nonfinite or cannot
reduce represented current HP, the action is unavailable and spends nothing.
For safe integer H, calculate the percent floor with quotient/remainder integer
arithmetic; avoid a new `H × percent` overflow/rounding boundary. A large-value
branch can compare the power ceiling before multiplying; it must return a finite
observable hit, never Infinity or a fabricated percentage.

The12×P ceiling is a fixed snapshot attack coefficient, **not twelve seconds of
simulation**. It advances no timer, study, Wisp charge, purchase queue or offline
window. P includes only the current canonical passive power of actually Active,
recruited Wisps: their existing paid power/rarity/role contributions and the
existing general/contextual Formation/Lab/legacy factors. Those operands are
applied once through the existing helper, not reconstructed or multiplied again.
A Support Wisp's own passive power can contribute as usual; its temporary cast
buff does not multiply Meteor. Empty/zero-power Formation means no usable hit.

Meteor is a **Comet** damage source. It is neither a Guardian tap nor a Wisp
ability. Consequently it does not gain Guardian's Mark/Seal, Fractured Core/Key,
Arcane Calibration, Guardian Cadence, Kindling tap bonuses, Wisp Ultimate/Module
cast factors or temporary Support multipliers as an additional hit factor. It
does not increment taps, grant Tap Conduit/Sustained Channel/Relay charge, produce
Gale/Thorn cast resources or invoke Forge Spillway. A real boss kill still runs
the ordinary boss reward and Victory Charge path. Normal regeneration continues
at the existing trait/Vanguard/Cauterize rate.

The published source has **no armour, shield or Deep Freeze combat system**.
Its boss catalog is Regrowth (0.9% max HP/s), Fractured Core (0.5%, Wisp ability
bonus) and Guardian's Mark (0.6%, tap bonus). Do not invent armour/freeze acceptance
claims or import archived mechanics. Re-read the accepted Tree source; if those
mechanics actually appear there, this source classification needs explicit
revision before coding.
Sources: [boss traits](https://github.com/karahaNx/Lumenfall/blob/3c931a26bbcf7b009dee03e7411ed41faeb971f8/index.html#L4620),
[passive/tap power](https://github.com/karahaNx/Lumenfall/blob/3c931a26bbcf7b009dee03e7411ed41faeb971f8/index.html#L5026),
[Wisp casts](https://github.com/karahaNx/Lumenfall/blob/3c931a26bbcf7b009dee03e7411ed41faeb971f8/index.html#L5193).

### Independent bounded examples

| H / current HP / unbuffed P | Base Meteor | Core4 Meteor | Implication |
|---|---:|---:|---|
|1000 /1000 /50|200|400| Leaves800/600 HP. Fractured Core, Guardian's Mark or a1.55 Support buff does not change these numbers. |
|1000 /350 /50|200|400| Base leaves150. Core4 can finish through the canonical kill path; actual removed HP is350, and unused50 creates no Spillway. |
|10000 /10000 /100|1200|1200| Power ceiling binds both ranks. The current/next preview must honestly show no immediate damage increase from another Core rank here. |
|10000 /10000 /500|2000|4000| The party supports the full percentage improvement. |
|10^18 /10^18 /10^6|12000000|12000000| Only0.0000000012% of max HP. With illustrative unmodified Regrowth, regen is9×10^15 HP/s; this command cannot bypass that wall. |
|1000 /1000 /0|0|0| Unavailable, zero charge debit. |

The saved once-per-enemy guard means three banked charges still permit **one**
Meteor on an untouched boss. Even when power is sufficient, the40% ceiling leaves
at least60% HP. The power ceiling prevents a weak party taking an arbitrary fixed
fraction from an extreme boss. It can help finish an already damaged boss; it
does not promise a boss kill or increase the controller's sustainable DPS.
Do not include hypothetical future manual commands in offline retreat or Forge
automatic boss-assessment bounds. No real-time pacing/playtest is inferred from
these arithmetic examples.

Quiet Guardian treats an accepted Meteor as a manual attack, even if nonlethal.
Its Trial failure, charge debit, used flag and damage commit together. A disabled
click or failed primary write changes none of them. Call is nondamaging and does
not fail Quiet Guardian. Neither command recruits, benches or fields Wisps, so
Single Star retains its existing rule.

## 5. Luminous Call: encounter conversion and actual reward

Allow Call only with ownership, one available charge, a living finite current
enemy, a nonboss depth, `enemyIsLuminous === false`, a foreground active game,
and no reset/reload/offline/resume transaction or already-ready Auto-Ascend
boundary. Revalidate the plan on activation. An already Luminous enemy, boss,
dead enemy or blocked lifecycle spends nothing.

The single transaction debits one charge, sets `enemyIsLuminous=true` and
`cometCalled=true`, and commits. HP/max HP, enemy depth, `luminousAccum`, lifetime
kills, rewards, Wisp charge and clocks are unchanged. There is no queued request
and no activation while offline. This avoids consuming a queued request on the
temporary next enemy that the current kill tail spawns before Auto-Ascend.

The next real kill uses exactly the existing reward path, including completed
Luminous Sense, Dawnpriest reward effects, Support Mote effects, Luminous
Distillation and their current rounding order. In particular, the existing
Mote expression is `max(1, round(motesDropFor(depth) × (1+supportMoteBonus())))`;
do not substitute a fixed literal bounty, omit retained paid factors, pay at
conversion or multiply the drop again. Existing offline reward-scale semantics
also remain. The marked enemy can be killed after reload or during later
offline processing exactly once. Merely leaving the encounter by an explicit
mode change or Ascend abandons that already-applied effect; there is no automatic
refund/requeue that could duplicate it. The UI should explain that Call affects
**this enemy**.

All future natural spawns retain their original accumulator/chance sequence;
Call does not consume or advance a natural threshold. Ordinary saved-enemy and
Farm batch handling already distinguish the current Luminous enemy from later
natural crossings. Preserve that distinction and clear `cometCalled` after the
first real kill/replacement, including a multi-kill batch. Sources:
[spawn/restore](https://github.com/karahaNx/Lumenfall/blob/3c931a26bbcf7b009dee03e7411ed41faeb971f8/index.html#L5310),
[Mote reward](https://github.com/karahaNx/Lumenfall/blob/3c931a26bbcf7b009dee03e7411ed41faeb971f8/index.html#L5466),
[Farm batch](https://github.com/karahaNx/Lumenfall/blob/3c931a26bbcf7b009dee03e7411ed41faeb971f8/index.html#L8773).

At most one additional Luminous encounter is available per200/160/125/100 real
defeats, plus previously banked charges. That is a ceiling, not an automatic
encounter-rate increase: each conversion needs player input, an ordinary target,
and competes with Meteor. A fully banked3-charge start and2000 subsequent kills
permit at most23 Calls at Engine3, even with immediate player use. Unattended
play fills at most the bank and casts none. Plain source quotes at R49/R99/R249
are7/13/32 Motes in the early/mid fixture and9/16/39 in the mature fixture,
**before optional Support Mote additions**. Those quotes show why preserving the
actual reward helper matters; they are not universal hard-coded Call rewards.

## 6. Additive Comet Deeds and existing unlock preservation

**All23 old Deeds remain byte-equivalent in eligibility/reward meaning.** In
particular, Auto-Tap remains the existing12-Ascend `autotap` Deed; Auto-Empower
remains `labmaster` at20 levels in the original five Forge IDs; `labqueue` keeps
its original60-level scope. The old eight-Study counters, five-foundation-Study
condition, five-member Formation goal, aura unlock flags and683-Comet pool stay.
Do not silently broaden these checks to all60 workshop tracks or reinterpret an
earned flag as a new requirement. The known concentration of future old Forge
Deed progress in Swift Recovery is not changed by this proposal.

Add four bounded, event-proven Deeds:

| New ID / display name | Genuine event required | Reward | New unlock |
|---|---|---:|---|
| `comet_first_command` / First Command | First successfully committed Meteor or Call; no disabled/rolled-back attempt |5C| Orbital Reserve |
| `comet_first_recharge` / Returning Orbit | First charge actually earned from4000 kill-work; exclude initial purchase charge |10C| Orbital Engine, also requiring existing d100 |
| `comet_boss_strike` / Falling Star | First committed Meteor that removes positive HP from a boss |15C| Meteor Core, also requiring Meteor and existing d50 |
| `comet_called_kill` / Called Light | First genuine defeat of a Call-marked Luminous enemy; natural Luminous kills do not qualify |20C| New Quest Refresh entitlement when Auto-Ascend is owned |

These add50 one-time Comets: the combined maximum is733, with the original683
retained. Four saved boolean event facts suffice; no unsafe growing usage counter
or replay of historical taps/kills is needed. Record the facts inside the actual
command/kill transaction and award through the common one-time reward logic.
The event facts are zero in migration; old Trials/marks/cosmetics do not imply a
new command was used. Earned new flags remain sticky through Ascend/reload.

Quest Refresh becomes `Auto-Ascend AND (legacy Trials entitlement OR historical
complete Rest Stop entitlement OR earned Called Light)`. Preserve its25-Comet
price, deterministic candidate selection, progress/claimed exclusions and
anti-arbitrage rule. It is a player-requested operation; the new entitlement
never refreshes or claims automatically. Existing owners retain access even
without earning any new Deed.

For newly earned Deeds, separate **earned/unlocked** from **reward credited**:
record a bounded pending claim keyed by known Deed ID if the Comet deposit is
unrepresentable. A huge wallet must not erase a newly earned unlock or silently
consume its reward. On migration, already-earned old flags are treated as legacy
settled; do not pay683 again or guess that a historical credit was lost. Existing
unearned old Deeds still award exactly their original reward when truly earned.

## 7. Retirement compensation and one authoritative paid-value ledger

Proposed policy: remove the Trials/Trail/Crest **purchase rows**, retain every
owned legacy feature, and refund each original price once in Comets. This is
**intentional retirement compensation while retaining legacy entitlements**.
It gives old owners spendable value in the replacement catalog as well as their
old cosmetic/challenge access; it is not an economically neutral exchange.
There is no free conversion to new command ownership or levels on top of the
refund. Repeated credit of a receipt, or both free new levels and its full refund,
would be an implementation error.

| Retired raw ID | Original price / refund | Retained entitlement outside the shop |
|---|---:|---|
| `comettrials` |140C| Both Trial types, free starts/retries/cancellation, pending and active Trial, outcomes/marks, and old Quest Refresh eligibility. |
| `rifttrail` |50C| Owned optional Trail and current equipped state. |
| `starfallcrest` |160C| Owned optional Crest and current equipped state. |

Keep those three owned IDs in a recognized **non-shop ledger**, never as hidden
new purchasable entries. Use one authoritative entitlement helper in Trial
normalization/start/cancel, cosmetic normalization/toggles/rendering and Rest
Stop eligibility. Display owned legacy controls in the collection/journal area;
do not return read-only legacy purchase cards to the new shop. Preserve known
Trial marks even when they are present without a valid ownership flag, matching
the old normalizer's independent mark retention.

Recommended migration is explicit schema2→3, after existing0→1→2 migrations.
This is a proposal requiring root acceptance: a new schema prevents an older
schema2 reader silently dropping the refund receipt/new paid levels and later
allowing duplicate compensation. Keep package/save-slot/backup-prefix identity.
Schema3 contains a policy-tagged `cometRetirement` object with three known-ID
ownership booleans and three paid booleans. Refund amounts are fixed by this
policy, not caller-supplied prices. Nonowners have no payable claim. A schema3
receipt that is missing, has a different policy, inconsistent ownership/paid
data or invalid types must not be silently recreated from empty defaults.
Reject it through the established recovery/preservation path instead of granting
again or overwriting raw storage.

Migration reads strict-true recognized old ownership before filtering SHOP.
It constructs the ledger once, preserving the entire unrelated save and paid
work. A repeated current-schema normalization validates the receipt; it does
not re-run old-ownership refund detection. Preserve F26 `offline12hRefund` and
the rememberbulk/offline24/offline48 historical ledger as separate records.

Settle existing F26 claims first, then the new policy in fixed order
Trials140 → Trail50 → Crest160, then pending Deed rewards. A deposit amount A
is creditable only if `next=wallet+A` is finite, `next-wallet===A`, and
`next-A===wallet`. Otherwise retain that item as an unpaid claim in its original
currency, without rounding the wallet or marking it paid. Retry only through
canonical transactions after spending/other valid state changes. UI may show
pending compensation in purchase history, not as extra deficit text beside shop
prices.

Independent Number examples, in that exact order:

| Starting Comets | Actually creditable now | Pending |
|---|---:|---:|
|0|350|0|
|2^54|300 (Trials140 + Crest160)|50 (the attempted Trail credit represents52 at this endpoint, so reject it)|
|2^55|160 (Crest)|190|
|10^30|0|350|

Do not cap a valid huge wallet to MAX_SAFE_INTEGER, split a claim into invented
refund pieces or convert it into another currency. Receipts/wallet must commit
together. Backup restore deliberately restores the chosen backup's endpoint;
it does not add its refund to today's wallet. Repeated migration of the same
historical backup gives the same endpoint, not a cumulative cross-backup award.

## 8. Transaction, lifecycle and numeric contract

Use one real outer transaction for each manual purchase, command, Quest Refresh
and manual reward claim. Revalidate current ownership/unlock/cap/cost/target at
the accepted action; reject forged IDs/quantities. For an integer price C,
require finite wallet, wallet≥C, finite nonnegative result, exactly represented
`wallet-result===C`, and `result+C===wallet`. Raw paid-level increment and command
charge decrement must also be exact. Large balances are not automatically
invalid:100C is payable from10^16, whereas100C at10^30 is not;45C at2^54 is not.
Keep capped/overcap ownership and show bounded effects, with no additional debit.

Stage all affected fields before writing. A primary failure restores original
live state and transient run identity; an immediate retry starts from that exact
endpoint. If primary commits and recovery fails, retain the primary endpoint,
report the failure through the existing persistence state and never roll back
the committed purchase/command/refund. The current `saveState` assigns its
canonical state only after primary succeeds, so a documented/tested identity
guard can distinguish these outcomes. Source:
[saveState](https://github.com/karahaNx/Lumenfall/blob/3c931a26bbcf7b009dee03e7411ed41faeb971f8/index.html#L4466).

Meteor can kill and Auto-Ascend in one action. Do **not** wrap public
`dealDamage→defeatEnemy→doAscend` in another paid transaction: the nested Ascend
save could commit before the outer save fails. Use the existing mutation-only
canonical simulation kill/Ascend helpers with live reward semantics, explicit
`allowSpill=false`, no elapsed simulation, and one outer command commit. Include
charge debit, enemy used flag, Quiet Trial failure, kill rewards, boss Victory
Charge, kill-work, Deed facts/claims, canonical Prism payout/benchmark, reset and
new enemy in that endpoint. Restore the transient run token on primary failure.
Re-read state after committing; it may be replaced by canonicalization.

For ordinary kills, insert charge-work and the Call-kill event at the actual kill
boundary before its possible Ascend. Simulation already owns its outer commit;
never save separately from a batched/offline kill. The direct and fast Farm paths
must count every real kill once, clear per-enemy flags correctly, and preserve
all existing reward multipliers. **Zero new ownership/facts must preserve the
old mathematical and chronological path**, aside from intentional schema fields
and an independently identified compensation/Deed receipt.

Actions are unavailable while offline processing/resume/reset/reload owns state.
They never change `autoAscendEnabled`, its stored target, Push/Farm preference or
eligibility. Leave the internal threshold N/cleared N−1 interpretation unchanged.
An accepted Meteor kill can trigger the same existing Auto-Ascend as another
legitimate kill; ownership/target/toggle and its payout kernel are not replaced.
Huge `ascendCount` and `totalKills` require object/event identity, not `++` equality.

Recognized legacy raw levels, paid running Study work/speed snapshots and prior
refund ledgers are outside Comet repricing. Malformed new fields follow explicit
normalization rules without synthesizing purchases. Refund/reward-ledger
corruption must fail safely rather than grant currency; unrelated malformed
optional presentation fields should not delete valid paid records.

Comet credit callers also include daily login and quest claims. Preserve their
existing date/claim semantics and reward amounts. Proposed exact handling is one
`cometDailyDueExact` unsigned decimal string, initially `"0"` in migration.
On a newly accepted existing login/quest award, add its fixed Comet amount to
this debt with decimal arithmetic and commit the existing day/claimed marker
with it. Do not reconstruct debt from historical claimed flags or append an
unbounded list of days. This aggregate records **Comets already earned**, not a
new source of currency. Require canonical digits/no sign/no exponent and at most
1024 digits; an invalid current-schema record is rejected/preserved, never
truncated or reset. This structural bound exceeds any debt producible by the
current finite-date, fixed-reward game and keeps malformed imports bounded.

After F26, retirement and Deed claims, first try the entire daily debt if it is
a safe integer and the exact reversible deposit succeeds. Otherwise make one
bounded pass over powers of two from2^52 down to1: for each amount no greater
than the remaining exact debt, credit it only if the same reversible-Number
check succeeds, and subtract precisely that amount from the decimal string.
At most53 such in-memory candidates are considered per canonical transaction;
the primary write still occurs once. Any remainder stays due across date reset,
Ascend and backup. For example,5C due at a2^54 wallet can credit4 and retain1;
50C due there can credit48 and retain2. This partial settlement applies to the
daily aggregate only; the original140/50/160 compensation items and fixed Deed
claims stay indivisible as specified above. No rounding, implicit forgiveness,
second reward or negative debt is allowed. Very large wallets may remain unable
to receive even a safe chunk, in which case all due value remains recorded.

This daily accounting extension and its save field are part of the proposed
Comet scope for root review; they are not a claim that current daily payments
are already safe. They must retain Quest Refresh's25C debit and original
anti-arbitrage condition, including all inherited-progress cases.

## 9. Economy observations and deliberate tradeoffs

The reproducible `inventory-economy.cjs` loads the complete published production
IIFE with its published harness, canonicalizes the frozen **public** fixtures,
and reads selected fields only. No private save or proposed command is executed.

| Public fixture | Record Rift | Raw → canonical Comets | Meaning |
|---|---:|---:|---|
| parity-early-simple |5|0→0| New commands remain locked. |
| mid-game |17|55→55| No invented refund or new command access. |
| mature-high-power |120|850→1150| Existing F26 supplies300; Auto-Ascend is already owned. This fixture does not own Trials/Trail/Crest, so proposed retirement compensation is0. |

A hypothetical fully eligible owner of all three retired purchases with zero
wallet receives350C compensation once. Meteor100 + Call140 + Reserve rank1 at60
+ Core rank1 at45 costs345, leaving5 of that compensation principal. The
Core/Reserve Deeds must first be earned; at a normal wallet their First Command
and Falling Star rewards add at least20C, making the actual balance at least25C
before other rewards. This is an affordability sequence, not an automatic grant.

With the original683 Deed Comets, one can afford Auto100 + both commands240 +
both Reserve ranks180 + Engine rank1 at80 + Core rank1 at45 =645, leaving38 once
counting only the original pool. Earning the required first-command/recharge/boss
Deeds adds30C, so a normal-wallet sequence from that principal leaves at least68C
before Called Light or other income. The four new Deeds add50 in total,
not a second copy of old earned rewards. All capped purchases total1380; even
the combined733 Deed pool alone does not exhaust the catalog.

Existing login rewards total126C per completed seven-day reward cycle, plus3P
on its last reward. Existing three distinct daily quest rewards have a theoretical
28–63C range from the reward table; actual date selection, eligibility, completion
and claims are not guaranteed. These remain unchanged. No “days to unlock” or
organic progression claim is derived from these bounds. Source:
[quest/login tables](https://github.com/karahaNx/Lumenfall/blob/3c931a26bbcf7b009dee03e7411ed41faeb971f8/index.html#L3685).

Tradeoffs needing explicit root acceptance are the full350C compensation while
retaining old features; the additional50C event-Deed pool; the12×unbuffed-power
Meteor ceiling; the finite manual Luminous conversion next to natural Tracking;
and schema3 plus exact pending-credit accounting. There is no hidden daily cap,
real-time cooldown, charge refill on Ascend, automated casting or extra Comet
income multiplier in the proposal.

## 10. Focused implementation and acceptance plan

Before editing, verify the accepted Tree merge/source, draft one concise feature
task and freeze the above decisions, especially pending daily Comet credit.
Keep the long design/evidence out of the already tight startup context budget.
Implementation remains one separate feature branch and PR into development.

| Area | Meaningful required coverage |
|---|---|
| Catalog/prices | Every ID0/1/cap/cap+1; exact ladder and total; old Auto100 behavior; independent unlocked/locked, insufficient/exact/huge wallet and stale-plan checks; no bulk/queue. |
| Meteor | Max/current HP distinction, percent integer boundaries, P ceiling, zero power, every actual boss trait, temporary Support both on/off, paid raw legacy operands once, no tap/cast/Spillway hooks; one saved encounter limit; normal/boss/Luminous kill; Quiet and Single Star; failed primary, recovery-only failure, reload and restored backup. |
| Call | Boss/already-Luminous/dead/offline-pending/ready-Auto refusal; exact charge debit; identical natural accumulator immediately and on later spawn sequence; actual full Mote and Lab reward factors; current-enemy Farm batch, reload/offline first kill, no payout at conversion, no repeat/refund on abandonment. |
| Kill-work | Manual tap, automatic tap, each damaging Wisp kind, passive, Spillway, normal/boss/Luminous, real Call kill and Meteor kill; long Farm batches and different chunk sizes; full-bank saturation and partial remainder; no retroactive progress; all phases across Ascend, including unsafe lifetime counters. |
| Deeds | All23 historical checks/rewards/unlocks unchanged; all four new genuine-event positives and false-event negatives; primary rollback versus committed recovery failure; sticky flags and exact pending credit; no migration/reload reaward. |
| Retirement | Every subset of three purchases; all current/legacy formats, running/pending/failed Trials, equipped cosmetics/marks, old/new Quest Refresh routes; simultaneous F26 and350 refunds; exact Number boundaries; corrupted receipt; primary/recovery/backup/repeated load/Ascend/offline/reset. |
| Economy/parity | Independent price/damage/work oracle; representative zero/new/combined Lab–Forge–Tree ownership; untouched old Prism/Swift oracle; live/manual/Auto/offline split/yielded/8h and batch256/31; finite conservative boss bounds. |
| UI/runtime | Actual all-row purchase/action/native previews and independently red-only Comet price;320/390/430 × normal/200% root font × normal/reduced motion;44px targets, keyboard/touch, stable focus and real scrolling; legacy collection controls and new Deed text. Actual V8 6.0 full-IIFE execution, not just modern syntax parsing. |

Causal negatives should revert a real effect/guard: constant price, free huge-
wallet purchase, lost primary rollback, rollback after primary commit, repeated
refund, deleted legacy entitlement, accidental Auto target/toggle reset, missing
enemy-used flag, Wisp/Guardian multiplier applied to Meteor, missing power ceiling,
Call advancing the natural accumulator, duplicate batched Call reward, work
counting raw lifetime deltas and Deed reward replay. A harness error is not a
successful negative control.

All current full behavioral/negative, Lab, Forge, Tree, source/tooling/context and
browser gates remain required on the exact new candidate. Preserve original
failures and test/source/fixture hashes. No existing test gate is weakened to
accept the proposal. Device/native WebView/TalkBack and signed APK requirements
remain separately reported; this read-only design supplies none of that evidence.

## Reproduction and current deliverables

Run `node /workspace/scratch/0848c4e4f365/comet-work/inventory-economy.cjs`.
It reads the pinned Git objects and writes `inventory-economy.json` beside itself.
That file records source/fixture/harness/Node identities, the23 original Deeds,
public affordability snapshots, complete proposed prices and independent Number,
damage and kill-work arithmetic. The proposal does not claim that a new command,
migration or transaction has passed a production test. No repository, fixture,
remote, main or APK was changed for this task.
