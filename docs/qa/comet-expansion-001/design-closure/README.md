# Comet numerical and settlement closure

**Design closure only; no Comet product implementation or feature acceptance.**

The recommended contracts below match root's explicit choices during this
review: exact safe results; downward representable Meteor budgets otherwise;
an actual positive HP reduction within that budget or a free refusal; and one
ordered claim pass at each documented canonicalization. No generic number
system, global daily debt, scheduler change or modification of an existing
combat helper is proposed.

## Inputs and actual work

The read-only source is `Lumenfall-tree/index.html`, SHA256
`ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3`.
Local HEAD was `768050d7cca586ea724e7ac677804a5ed7d6a3f5`, tree
`30213b2ae877ff64db08e3d06b087d040fe72ca2`, and source Git blob
`2e6485650f2b5a5d5105ee14e3c19a9b7419f6c7`; the source had no local diff.
Root separately owns the GitHub publication/required-CI audit. This closure did
not issue remote mutations or independently certify the eventual Tree merge.

The inputs are [the original proposal](../design-proposal.md) and
[root's narrower design review](../root-design-review.md). Their hashes, the
source identity, trusted UTC timestamps and actual commands are recorded in
[execution.json](execution.json). The source is reconstructible from the
[published Tree candidate](https://github.com/karahaNx/Lumenfall/blob/768050d7cca586ea724e7ac677804a5ed7d6a3f5/index.html).
No complete product HTML or private save is duplicated in this folder.

Actual execution used Node **v24.19.0**. The candidate uses ES2017
`Number`/`DataView` operations and runs with `BigInt` unavailable; the independent
oracle uses Node20+ `BigInt` only in the proof. **No actual Node8/browser run of
this future Meteor implementation is claimed.** Such a run belongs to the
future implementation's required gates. The existing Tree Node8 gate tests
Tree, not these unintegrated candidate functions.

| Executed proof | Recorded result |
| --- | --- |
| Meteor budget | 35,110 vectors, all finite binary64 exponent fields and all five ranks |
| Meteor represented HP plan | 6,048 vectors, including 15 named examples and 13 invalid-input cases |
| Meteor assertions | 156,704; six discriminating arithmetic counterexamples |
| Known-claim credit | 87,488 vectors across 5,468 distinct wallets |
| Exact purchase debit | 54,680 vectors on the same wallet family |
| Ledger settlement | 46 ordered canonical passes plus five immediate-new-award examples; 142,967 total ledger assertions |
| Source-derived old amounts | 23 old Deeds = 683C; retirement amounts = 350C, exactly as frozen independent literals |
| Complete new claim family | 30 possible claims, at most 1,083C |

These are design-prototype/model assertions, not additional gameplay gates.
The only original source functions evaluated in isolation were the unchanged
F26 settlement helper and the discrete-hit branch witness described below.

## 1. Exact Meteor contract

Let `H` be the current enemy's finite positive maximum HP, `h` its finite
positive current HP with `h <= H`, `r` the effective integer Core rank 0..4,
and `P` the finite nonnegative result of the original
`passiveWispDpsAt(currentDepth)`. Each input means the **exact binary64 value
already held by the game**, not an intended decimal value before earlier
rounding. A nonfinite `P`, including an overflow in the existing power helper,
is an unavailable command. This proposal does not repair or reconstruct that
helper's prior arithmetic.

First define the mathematical integer:

```
D* = min(floor(H × (4+r) / 20), floor(12 × P))
```

Define the command budget `B` as the **greatest nonnegative representable integer
Number no greater than `D*`**. When `D* <= Number.MAX_SAFE_INTEGER`, `B = D*`
exactly. Above that limit, a Number cannot represent every possible `D*`; this
rule chooses the next representable integer below it rather than overstating
the ceiling. The loss from that conversion is less than one local Number step.
The current enemy's represented HP loss can be smaller again, as specified next.

Do not reject a valid finite budget just because a naive intermediate `12*P`
would overflow: the other ceiling can still make the selected result finite.
For finite `H`, the HP ceiling is at most `0.4H`, so the selected `B` is always
finite. Zero budget means unavailable and no charge/used/event mutation.

### A bounded implementation without product BigInt

[meteor-candidate.cjs](meteor-candidate.cjs) contains the complete pure candidate.
Its private quotient kernel is only for these two fixed Meteor factors.

Decode positive `x` with `DataView` into `x = M × 2^E`, normalizing `M` into
`[2^52, 2^53)`. A subnormal requires at most 52 left shifts. For the HP factor,
use numerator `4+r`, denominator 20, and no exponent offset. For power, use
numerator 12, denominator 16 and exponent offset +4; this is exactly ×12.

The quotient/remainder of `M × numerator / denominator` is computed in base
`2^26` limbs. No operation forms the unsafe whole integer `M × numerator`.
Every integer intermediate stays below `2^53`; the quotient itself also fits
because each pre-offset ratio is at most 3/4. If necessary, shift the quotient
and its small remainder together until the quotient has 53 significant bits;
this takes at most three more shifts. Each operand then has a normalized
leading quotient `q` and exponent `e`.

Compare the two normalized `e`, then `q`, before converting either to a Number
at its final magnitude. Equal `q/e` produces the same directed output even when
the discarded remainders differ. This is sufficient because flooring and the
downward conversion are monotone, so they commute with taking the minimum.

For the selected pair:

```
e < -52        => B = 0
-52 <= e < 0   => B = floor(q × 2^e)
e >= 0         => B = q × 2^e
```

For negative `e`, the discarded remainder is smaller than one binary grid step
and cannot cross the next integer. For nonnegative `e`, the last expression is
the greatest representable Number below the exact scaled value, hence also
below its integer floor. The selected exponent is bounded by the finite HP
ceiling; neither overflow nor a product BigInt fallback is needed. The only
power operation constructs an exact binary power in the normal finite range.

This is fixed, short work per plan, not an offline loop, per-HP iteration,
persisted numeric representation or currency helper.

## 2. The actual represented HP debit

Budget calculation and HP subtraction are separate. Even exact integer `B`
does not make `h-B` an exact floating subtraction in every state.

If `h <= B`, the plan is genuinely lethal: actual removed HP is exactly `h`,
after-HP is zero, and the unused budget is discarded. This permits a fractional
finishing hit without inventing damage or Spillway. If `0 < B < h`, compute:

```
after = h - B
if (h - after > B) after = nextUp(after)
actual = h - after
```

Accept only if `0 <= after < h`, `0 < actual <= B` and `h-actual === after`.
Otherwise refuse without spending or marking the enemy. `nextUp` uses the
adjacent positive binary64 bit pattern through `DataView`; no epsilon or
guess about decimal digits is involved. One upward step is sufficient.

Why the comparisons are reliable: if `B >= h/2`, `h-B` is exact because the
two operands differ by at most a factor of two. If `B < h/2`, the rounded
remainder is at least `h/2`, so `h-after` is exact instead. Thus any excessive
represented loss is detected. Raising the remainder by one adjacent Number
selects the least representable remainder at or above the exact mathematical
`h-B`. If that value is `h`, no positive representable loss fits the budget.
The oracle independently finds this remainder by a binary search of positive
float bit patterns, rather than reusing the candidate's subtraction correction.

### Do not inherit the shared discrete-hit epsilon for a new strict ceiling

Current source `simulationDealDiscreteDamage` considers `enemyHp <= 1e-9` a
death. With `H=5`, `h=1+5e-10`, `P=1`, `r=0`, the exact Meteor budget is 1.
The subtraction leaves the positive Number `5.000000413701855e-10`. The original
helper returns true and invokes its defeat callback anyway. This branch was
executed from the original source with `allowSpill=false`; only its defeat
callback was replaced by an observer. The receipt explicitly does **not** claim
that this isolated witness executed real rewards or an actual Comet command.

The new command should assign the planned HP inside its own staged mutation.
For a nonlethal plan, stop there; do not invoke the existing discrete helper.
For a genuinely lethal plan only, invoke the existing mutation-only
`simulationDefeatEnemy` with the canonical live policy/summary. Do not change
the existing shared epsilon, passive combat, tap/cast paths or scheduler.
The ordinary next simulation tick may still run its existing rules.

The new command must not call the timestamp resolver or advance twelve seconds:
the coefficient 12 is damage, not time. There is no callback, queue, Wisp charge,
Support duration, regen interval or hypothetical future manual-DPS contribution
to add. Ordinary kill rewards/Victory Charge and a newly reached Auto-Ascend
boundary remain the chosen canonical defeat path's responsibility.

### Concrete numerical cases

`MAX` below means `Number.MAX_VALUE`; powers of two are written symbolically to
avoid confusing JavaScript's shortest decimal display with the exact integer.
The raw receipt also records bit patterns and exact integer oracle outputs.

| Inputs `(H,h,P,r)` | Correct result | Incorrect shortcut exposed |
| --- | --- | --- |
| `(1000,1000,50,0)` | `B=200`, after-HP800 | Ordinary base case |
| `(1000,350,50,4)` | `B=400`, actual350, lethal | No extra50 or Spillway |
| `(10000,10000,100,4)` | `B=1200`, after-HP8800 | Core can correctly be power-limited |
| `(5,5,Number(1/12),0)` | `B=0`, refuse | The stored `P` lies below exact1/12; native `12*P` rounds up to1 |
| `(5,5,0.08333333333333334,0)` | `B=1`, after-HP4 | The immediately higher `P` crosses the true floor |
| `(2^56,2^56,MAX,0)` | `D*=14411518807585587`; `B=14411518807585586`; actual loss14411518807585584 | Converting `D*` to nearest Number gives14411518807585588, above the limit |
| `(2^54,2^54,0.25,0)` | `B=3`, actual loss2 | Naive subtraction removes4 |
| `(2^54,2^54,0.1,0)` | `B=1`, free refusal | No positive representable HP decrease fits |
| `(5,1+5e-10,1,0)` | Nonlethal positive remainder | Shared `1e-9` death threshold would exceed the new ceiling |
| `(1000,1000,MAX,0)` | `B=200` | `12*P` overflows, but selected budget is finite |
| `(MAX,MAX,MAX,4)` | Finite `B=7.190772539449262e307` | Both naive products overflow |
| `(MAX,MAX,1,4)` | `B=12`, free refusal | Positive nominal damage does not move represented HP |

Even **safe integer H** does not justify ordinary reordered multiplication:
with `H=9007199254740991` and `r=3`, both `floor((H/20)*7)` and
`floor((H*7)/20)` return `3152519739159347`. The exact floor is
`3152519739159346`. The fixed quotient kernel is needed before the first
unsafe max-HP state appears.

## 3. Bounded known-claim settlement

The unchanged 23 Deed rewards sum to683C; the proposed four new rewards sum
to50C; Trials140, Trail50 and Crest160 sum to350C. Thus there are at most30
known claims and **1,083C** in this new family. The amounts and order in
[ledger-proof.json](ledger-proof.json) are checked against independent hard-coded
policy literals and the actual original catalogs. Existing F26 is separate;
its original 140/160C refund amounts and Prism-price snapshots are not part of
this bound or the three retirement identities.

Preserve the reviewed schema/entitlement contract: three closed retirement
states (none, due, settled), sticky earned Deed flags, and pending known Deed
IDs with fixed policy amounts. Old earned flags initialize no retroactive
claim. Unknown IDs, an orphan due record or a missing/malformed current-schema
ledger must not be replaced by an empty one. This arithmetic model does not
implement that validator or prove real migration fault handling.

For a pending claim of fixed amount `A`, attempt exactly one whole credit:

```
next = W + A
finite(next) && next-W === A && next-A === W
```

On success, update wallet and mark only that known claim settled in the same
endpoint. On failure, leave both unchanged. The two reverse checks prevent
swallowing either the reward or a small existing fractional wallet. With
nonnegative operands, one subtraction satisfies the factor-of-two exactness
condition; the independent dyadic oracle verifies the true mathematical sum,
not merely another copy of these reverse conditions.

**Preserve immediate ordinary Deed rewards.** When a previously unearned Deed
genuinely completes, set its sticky earned flag and fixed claim together, then
immediately attempt just that newly added claim with the same exact guard. If
it fits, credit and clear it immediately; otherwise retain it due while the
unlock is already active. This uses the existing mutation/outer transaction
owner and introduces no nested save or ordinary reward delay.

That new-Deed event does not sweep old pending claims. At a synthetic wallet0
with an older3C claim already pending, earning a new5C Deed changes the wallet
to5 and leaves the old3 pending; the next canonical pass changes it to8. A
repeated check of the already earned Deed does not re-award or retry that claim.
Five targeted vectors cover ordinary immediate payment, the rounded3C case,
the huge-wallet Auto-Tap unlock, no old-claim sweep and an immediate new50C award
making an earlier retirement140 payable only at the next canonicalization.

At each documented canonicalization, retain this **single pass**:

1. Existing F26 helper, unchanged.
2. Trials140, Trail50, Crest160.
3. Pending Deeds in the frozen original order, then the four new IDs in order.

Do not aggregate claims or split amounts to manufacture a representable deposit.
At `W=2^54`, Trail50 and Returning Orbit10 both fail separately, although a
combined60 would fit. That combined payment is deliberately not this policy.
Do not make read-only price previews an extra settlement owner.

| Starting wallet; all retirement claims due | Credited on first pass | Still due |
| --- | --- | --- |
| 0 |350|0|
| `2^54` |300: Trials140+Crest160|Trail50|
| `2^55` |160: Crest|Trials140+Trail50=190|
| `1e30` |0|350|

The entire new family remains due at `1e30`. A fractional wallet can also block
whole integer deposits: all30 claims fit at0.125, but none fit at the exact
Number0.1 under this policy. Preserve that wallet and the due IDs. The bounded
ledger is retained value, not a guarantee that every accepted wallet can spend
or receive every small integer today. Daily/login/quest-income accounting is
explicitly outside this closure.

### Single pass does not mean the whole load is a numerical fixed point

Start with `W=2^54-10 = 18014398509481974` and all350C retirement claims due.

| Pass | Ordered outcome | End wallet | Due |
| --- | --- | ---: | ---: |
| 1 | Trials140 cannot fit; Trail50 fits; Crest160 fits |18014398509482184|140|
| 2 | Previously due Trials140 now fits |18014398509482324|0|
| 3 | No unsettled identity remains |18014398509482324|0|

Every deposit and the complete `wallet + knownDue` sum are exact. No settled
claim is replayed. The only incorrect assertion would be demanding pass1 and
pass2 have identical wallets. The unchanged actual F26 helper shows the same
cross-family effect: its140 can fail first at `2^54-10`, the later Trail50
can move the wallet to a grid where F26's140 fits on the next canonicalization.
Do not add hidden rescan loops or change F26 to force a fixed point.

### Exact spend first; settlement may alter the final net debit

For price `C`, validate the actual staged subtraction independently:

```
W and C finite; W >= C
R = W-C; R >= 0; finite(R)
W-R === C && R+C === W
```

Then execute the existing owning save/canonicalization. Starting at `W=2^54`
with only Trail50 due:

| Exact price | Wallet immediately after debit | Canonical credit | Final wallet | Net decrease |
| ---: | ---: | ---: | ---: | ---: |
|60|18014398509481924|50|18014398509481974|10|
|100|18014398509481884|50|18014398509481934|50|

Both prices are paid exactly. Both claim IDs are consumed once. The correct
final equation is `before - price + exact credited claims`, not always
`before - price`. Debit and credit feasibility also need not be symmetric
at exponent boundaries:140 can be subtracted exactly from `2^55` even though
140 cannot be added there.

The owning transaction must stage the price, purchased/earned fields, claim
changes and, for a command, charge/encounter/HP/kill effects together. If a
canonical kill or Ascend replaces the staged state object, capture the actual
working object immediately before `saveState`; do not infer primary success
from an earlier clone's identity. Current `saveState` replaces live state after
the primary write and before recovery. Roll back the previous endpoint and
run token only when primary did not commit. Recovery-only failure keeps the
committed canonical endpoint. Re-read live state after save; do not emit UI
success from a stale staged object.

The proof includes modeled primary-failure/retry/recovery endpoints for both
spend examples. Those models explain the required invariants; they do not
replace actual failure injection into the future command/shop/Refresh handlers.

## 4. Independent oracle and implementation acceptance boundary

[exact-oracle.cjs](exact-oracle.cjs) decodes the input with Node Buffer/BigInt
bit operations. It computes the exact rational percentage and power floors,
converts the integer downward, and independently searches ordered positive
float bit patterns for the least feasible remaining HP. It does not import the
candidate's mantissa division or next-Up correction. The candidate is run in
another VM without BigInt capability. Fixed counterexamples distinguish naive
overflow, multiplication/division floor rounding, rounded fractional-power
products, nearest integer conversion and excessive represented HP subtraction.

The ledger oracle computes exact dyadic sums/differences and independently
checks representability. It checks conservation on each pass, sticky earned
flags, unique known claim consumption, a finite pending set, deferred huge and
fractional wallets, both spend/settle examples, the five single-new-award cases
and the unchanged F26 interaction.

Before eventual Comet acceptance, these vectors should be exercised through
the actual implementation and full IIFE on the supported Node8/V8 path. Add
real lifecycle/charge refusal, primary/recovery faults, same-encounter reload,
canonical kill/Auto-Ascend, Call/batch replacement and old-zero-ownership
regressions under the accepted feature plan. Check that existing Support,
Guardian/Wisp modifiers enter only through their specified canonical operand,
and that no timing, callback count or offline sustainable-DPS estimate changes
because a hypothetical manual command exists. This closure deliberately does
not run or claim those not-yet-implemented gates.

### Reproduce these design proofs

Use Node20+ and the pinned ccef source. Supply a UTC timestamp obtained from the
trusted clock for the new execution; do not use the executor's advanced clock.

```
node prove-meteor.cjs /absolute/path/to/pinned-index.html 'YYYY-MM-DD HH:MM:SS UTC'
node prove-ledger.cjs /absolute/path/to/pinned-index.html 'YYYY-MM-DD HH:MM:SS UTC'
```

The complete raw outputs are [meteor-proof.json](meteor-proof.json) and
[ledger-proof.json](ledger-proof.json). Both stderr files are empty. The frozen
manifest binds every helper/receipt/document by original bytes and SHA256.
No repository edits, commits, staging, remote calls, private saves, APK work or
additional game/browser tests were performed for this closure.
