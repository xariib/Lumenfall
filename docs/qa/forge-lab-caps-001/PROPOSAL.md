# High-cap options for decision

14 October 2026. **Proposal only: no balance change implemented or selected.**
Live baseline `27f433d` on `local/full-debug`, source SHA-256
`f8f787fd4a520ec277b350f40c6caeefa519c48cb55ddeb9bbe486e4cd0200b6`.
Full [40-entry catalog](CATALOG.md), [source-bound measurements](catalog.json)
and [reproduction/verification](README.md). These are deterministic formula/work
measurements; campaign time to afford a cap has not been measured.

## Current behavior

All 20 active Forge tracks have caps between 2 and 10. Fifteen active Lab
projects have caps between 2 and 10. The five Lab foundations Wisp Ascendancy,
Guardian's Mastery, Shard Attunement, Lumen Wellspring and Luminous Sense have
**no numeric cap**. A finite cap on those foundations would lower an existing
unlimited ceiling; it is not included in these extension proposals.

Increasing a cap alone preserves every existing purchase below it, but affects
new rewards/combat once additional levels are bought. Current over-cap raw save
levels are preserved and effects of capped IDs are limited to their published
cap. Raising that cap also raises the effective value of retained over-cap raw
levels; the proposal preserves those levels rather than erasing paid history.

## Options

| Choice | Arcane Calibration | Resource Conduction | Boss Survey | Luminous Distillation | Other entries |
|---|---:|---:|---:|---:|---|
| A — recommended focused extension | 20 | 20 | 20 | 20 | Keep current rules/caps |
| B — longer-term Forge extension | 50 | 50 | 20 | 20 | Keep current rules/caps |
| C — retain current catalog | 10 | 10 | 10 | 10 | Keep current rules/caps |

The user may choose a subset or specify other named numeric caps. No selection
is inferred from the original comment. Both extension choices retain unlocks,
per-level effects, growth curves, Lab base work, speed tiers, current discounts,
12-hour productive offline cap and all other catalog entries. No old level is
removed or repriced. No refund is needed for an upward cap change; existing
refund/value records must remain intact and idempotent.

## Recommended cap 20: effects and costs

Final cost is the single purchase earning level 20, at raw level 19.
Prices are neutral, before Lab Procurement. L = Lumen, S = Shards.

| Entry / ID | Current cap 10 effect | Proposed cap 20 effect | Relative endpoint improvement | Final cost | Additional cost from level 10 to 20 |
|---|---|---|---:|---|---|
| Arcane Calibration / arcanecal | ×1.30 damaging ability source factor | ×1.60 | +23.1% source damage | 113,336,796 L + 906,695 S | Bulk: 299,482,676 L + 2,395,862 S |
| Resource Conduction / conduction | ×1.40 native Gale Shards/Thorn Lumen source factor | ×1.80 | +28.6% native cast resources | 680,020,774 L + 2,115,621 S | Bulk: 1,796,896,056 L + 5,590,344 S |
| Boss Survey / bossledger | ×1.50 boss Lumen/Shards | ×2.00 | +33.3% boss Lumen/Shards | 57,866,911 L + 2,066,675 S | Sum of starts: 161,042,050 L + 5,751,501 S |
| Luminous Distillation / luminousdistill | ×2.00 Luminous Lumen/Shards | ×3.00 | +50% Luminous Lumen/Shards | 103,333,770 L + 3,306,681 S | Sum of starts: 287,575,087 L + 9,202,403 S |

Arcane applies to damaging abilities and owned Resonant Edge Support hits,
not passive/Tap damage. Conduction affects native cast rewards, with their
existing rounding/conversion/overkill rules retained; not ordinary kill rewards.
Boss Survey does not affect ordinary kills or ability drops. Luminous
Distillation does not affect bosses or encounter chance. Neither Lab extension
changes Motes, Sigils or Prisms. More income may shorten other material waits;
no whole-game pacing claim or automatic rebalance follows from these endpoints.

Forge purchases are immediate when funded, and the extra material competes with
Wisp Empower/Modules and other upgrades. The cost curve remains 1.6× per level
for these Forge entries; their overall DPS impact depends on the player's party.

Lab costs grow 1.55× and work 1.45× per level. Timed projects must complete each
level sequentially; speed costs recur for every new level. Final cap-20 work:

| Lab project | Neutral final level at 1× | Neutral at paid 8× | Optimized final at 8× | Optimized level 10→20 work at 8× |
|---|---:|---:|---:|---:|
| Boss Survey | 9.70 days | 29.10 hours | 14.26 hours | 1.87 days |
| Luminous Distillation | 12.93 days | 38.80 hours | 19.01 hours | 2.49 days |

Optimized means already-earned Procurement10, Catalysis10, Focused Apparatus5,
Balanced Curriculum3 with ten counted subjects, Expanded Apparatus2, and no
other active projects at each start: prices 80%, work 49%, then paid 8×.
Each new level pays 379 Motes for 8× under Catalysis10 (473 without Catalysis);
ten extra levels cost 3,790 Motes per project. These timings exclude acquiring
helpers, currencies and Motes, and require accumulated productive time; one
unattended absence cannot exceed the existing 12-hour catch-up cap. Running
both projects can change the unused-slot snapshot, making a stated best-case
single-project estimate unattainable for both simultaneously. Already-paid
remaining/total work and speed are never recalculated.

## Option B: Forge 50, Lab 20

The same two Forge effects extend to ×2.50 Arcane (+92.3% versus cap10) and
×3.00 Conduction (+114.3% versus cap10). Existing curves give approximately:

| Forge entry | Final level-50 cost | Bulk level 10→50 cost |
|---|---|---|
| Arcane Calibration | 150.65 trillion L + 1.205 trillion S | 401.73 trillion L + 3.214 trillion S |
| Resource Conduction | 903.90 trillion L + 2.812 trillion S | 2.410 quadrillion L + 7.499 trillion S |

These projections remain finite and within the safe-integer range for the
quoted totals, but affordability/reach time is not established. They offer
much later resource sinks and stronger damaging abilities/resource casts;
they do not make these purchases free or guarantee a good campaign endpoint.
Independent BigInt diagnostics find existing one-unit geometric rounding
differences in the original Forge price path at levels ≤10. At cap50, newly
reachable queries can differ by up to 2 L/S units for Arcane or 7 for Conduction
from the rational curve. No existing quote/value is changed by this review.
If B is selected, new reachable quotes need explicit numerical regression
coverage and exact curve handling while preserving all previously payable
quotes. Cap20 extrapolations show no new rational-curve discrepancies beyond
the existing ≤10 queries. The baseline finding stays recorded separately.

## Why not raise every cap, or use Lab 50/100

- Lab50: even the final level alone needs about **113 years for Boss Survey**
  or **150 years for Luminous Distillation** at maximum work reductions and 8×.
  Completing all levels 10→50 takes about 364/485 productive years respectively.
  A playable cap50 would require a separate, explicit work-curve change.
- Forge100: these two final prices remain finite but exceed safe integer
  precision (roughly 2.42×10²⁴/1.45×10²⁵ L). Finite arithmetic alone does not
  establish reliable whole-currency purchases. Not a recommended scope here.
- Swift Recovery has an explicit approved cap10/refund/minimum-cycle contract.
  Keep it. Luminous Tracking already has a 35% encounter ceiling; levels above
  a useful chance can become a no-effect purchase depending on Rift depth.
- Charge grants, Support strength, boss regeneration, Resonate uses and
  resource conversions require their own combat/policy/chronology analysis.
  For example, extending Cauterize's current 2%-per-level formula beyond50
  makes the regeneration multiplier negative.
- Procurement/Catalysis/refinement discounts, Measured Inquiry, Curriculum,
  Focused Apparatus, Capacity and Resonance Efficiency encode percentage,
  capacity or minimum-price rules. A blanket cap increase can erase work or
  prices, exceed preserved slot limits, or make the Resonate price negative.
  Their current caps and rules stay in all proposals.

## Decision and subsequent verification

**Required next action: user chooses A, B, C or an explicit named subset/caps.**
This requirement comes directly from TASK 7. No cap implementation before that
choice. The selected implementation must cover cap/bulk/queue boundaries,
old/raw over-cap saves, retained paid active work/speed, primary/recovery/backup,
existing refund receipts, actual manual/queued purchases, live/offline chronology,
finite and exactly payable prices/effects, reward-only boundaries and mobile UI.
Final combined CI and Android/device/WebView60 acceptance remain separate.
