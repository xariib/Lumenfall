# Ascension Tree pacing

## Requirement and playtest

On 10 November 2026, the player reported maxing every Ascension Tree upgrade
except Swift Ascension after about an hour of Prism farming. They reported
Swift Ascension at level 139 and said further levels were still quick to buy.
They require that one hour of Ascensions cannot finish the Tree.

The player then reported more than 70 Auto-Ascensions in 35 seconds with the
target set to 29. Their screenshot shows the Welcome Back recap with 492
Auto-Ascensions and an away time displayed as 4 minutes. The game truncates
that display to whole minutes. A separate on-screen Auto Ascend banner shows
432 Prisms for six Ascensions. It is the live aggregation banner, so the
screenshot gives no offline Prism total. Starting ranks, wallet, build, and
total Prism earnings during the original hour remain unconfirmed.

## Verified baseline

GitHub main at `721ccbbcdf3dac6d12710b721c6870f32ed9e2d4` contains
the released Android 0.2.104 product source. The existing Tree has 20 active
tracks, all capped in current code. Swift caps at 250. The 19 other tracks
cost 10,221 Prisms from zero, including the 200-Prism Swift Charter, and all
Rift-based Tree unlocks are available by Rift 100.

Swift Charter changes future Swift prices from level 10 to six times the
current Swift level. At level 139 the next rank costs 834 Prisms. With Swift
139, no historical Lab Prism bonus and a previously rewarded Rift, actual
reward previews yield 44, 115 and 183 Prisms per repeat at cleared Rifts 15,
100 and 250. These are payout examples. Elapsed time depends on the starting
save and achievable Ascend cycles.

The [original Tree design](../qa/tree-expansion-001/DESIGN.md) supplies
historical prices and effect contracts. Its description of Swift predates
the current default cap.

## Rift 29 repeat farming

The visible target 29 means Ascend after clearing Rift 29. The legacy save
field stores 30 for that setting. Auto-Ascend can reset as soon as the clear
is eligible. At Swift 139, with the Rift already rewarded and no historical
Lab Prism bonus, production previews pay 62 Prisms per repeat. Seventy such
cycles pay 4,340 Prisms. At exactly 70 cycles per 35 seconds, that projects
to 446,400 Prisms per hour with fixed Swift.

A synthetic save on the exact main source, using the existing
`tests/behavioral/forge-expansion-harness.cjs` and actual simulation, achieved:

| Route | Time | Ascensions | Prisms credited |
| --- | ---: | ---: | ---: |
| Live | 35 s | 71 | 4,402 |
| Offline | 35 s | 71 | 4,402 |
| Offline | 240 s | 483 | 29,946 |
| Offline | 3,600 s | 7,240 | 448,880 |

Each result matched the simulation receipt count and total to the actual
wallet credit. The fixture starts at Rift 30 with record Rift 250 and
rewarded benchmark 249, target 29, Swift 139 and Swift Charter. Echoing Rest
6 gives full offline rate. Familiar Paths 5, Roster Recall 4 and Veteran
Recruits 5 support rebuilding. Ember, Tide and Stone start at level 300.
Masterwork Tempering is 20, Wisp Ascendancy 100, and Ember has Mythic rarity,
ability module 20, Ultimate and Mastery 34. This is a synthetic throughput
check. The user's roster, ranks and wallet have not been replayed.

## Requested fix and balance choice

The player asked to fix the reproduced rapid Rift 29 loop. The earlier
[unrestricted Ascend decision](../qa/endless-progression-001/REQUIREMENTS.md)
kept resets available with no minimum run time. The
[protected repeat payout](../qa/prism-earning-001/DESIGN.md) pays the full
purchased bonus on every qualifying repeat. The reproduced run follows both
policies, so addressing it requires choosing how the rules should change.

- **Pace repeat Prism payouts.** First and new-record Ascensions pay
  immediately. An Ascension at or below the previously rewarded Rift pays
  its normal Prisms only if 60 seconds of game time have passed since the
  last Prism payout. Manual and Auto-Ascend share this window in live and
  offline play. Resets can still happen between payouts. Ascension Dust
  follows the Prisms actually credited.
- **Pace repeat resets.** First and new-record Ascensions remain available
  immediately. An Ascension at or below the previously rewarded Rift
  requires at least 60 seconds of game time since the last Ascension.
  The same rule applies to manual and automatic resets in live and offline
  play. Each allowed reset pays its existing rewards.

Either 60-second rule gives 60 paid Rift 29 repeats in a steady-state hour.
At the synthetic fixture's 62 Prisms per payout, that is 3,720 Prisms,
compared with the measured 448,880. The time window is a proposal. The
late Tree design remains a separate choice within this task.

Next, settle the rule and verify the exact boundary, first and new-record
payouts, old-save defaults, backup and rollback, manual and automatic
interleaving, and split and batched offline windows. Reuse the authoritative
game clock and make availability visible before the player Ascends.

## Acceptance and open decision

- Define a meaningful Tree purchase as one with a distinct benefit to
  progression or rebuilding after Ascend. Test a productive one-hour farm
  from a representative established save and verify that meaningful Tree
  purchases still remain after Swift reinvestment and other Prism spending.
- Measure wallet, Ascend count, Rift, earned Prisms, purchased ranks, remaining
  purchase opportunities and the relevant later progression milestones.
  Include the reproduced Rift 29 loop and deeper pushes. Use the 7,240
  repeats and 448,880 Prisms credited in the existing one-hour fixture as a
  measured comparison point.
- Retain paid levels and effects on existing saves. Verify real Tree
  purchases, migration and recovery, Prism affordability, and manual and
  automatic Ascend behavior across live and offline play.

Status is baseline verified and the rapid repeat fix is requested. Choose the
repeat rule above before implementation. The longer-term Tree decision is
whether it should have a longer finite progression or continue with meaningful
purchases indefinitely.

This checkpoint is isolated on `feature/ascension-tree-pacing-001`. The
local Forge and Lab continuation modifies separate gameplay paths. No balance
change has been selected.

## Baseline checks

Node 24.22.1, source SHA-256
`9615f6f66c2d4dfd5081235bf9cc1d4e211fd16d9b953c575dd26385b046a015`.
The existing Tree core suite passed 5,924 checks on exact main. A read-only
probe of the same product source inspected the catalogue and actual prices
and payout previews.
