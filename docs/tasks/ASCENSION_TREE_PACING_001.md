# Ascension Tree pacing

## Requirement and playtest

On 10 November 2026, the player reported maxing every Ascension Tree upgrade
except Swift Ascension after about an hour of Prism farming. They reported
Swift Ascension at level 139 and said further levels were still quick to buy.
They require that one hour of Ascensions cannot finish the Tree.

The report establishes the player's experience. Starting Tree ranks and
wallet, cleared Rift, Ascend count, build, and Prism earnings during that
hour are unconfirmed.

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

## Acceptance and open decision

- Define a meaningful Tree purchase as one with a distinct benefit to
  progression or rebuilding after Ascend. Test a productive one-hour farm
  from a representative established save and verify that meaningful Tree
  purchases still remain after Swift reinvestment and other Prism spending.
- Measure wallet, Ascend count, Rift, earned Prisms, purchased ranks, remaining
  purchase opportunities and the relevant later progression milestones.
  Check rapid repeat farming and deeper pushes.
- Retain paid levels and effects on existing saves. Verify real Tree
  purchases, migration and recovery, Prism affordability, and manual and
  automatic Ascend behavior across live and offline play.

Status is baseline verified, awaiting the late Tree pacing decision. Decide
whether the Tree should have a longer finite progression or continue with
meaningful purchases indefinitely. Then calibrate and test the chosen pacing
against the reported farm or a labeled representative save.

This checkpoint is isolated on `feature/ascension-tree-pacing-001`. The
local Forge and Lab continuation modifies separate gameplay paths. No balance
change has been selected.

## Baseline checks

Node 24.22.1, source SHA-256
`9615f6f66c2d4dfd5081235bf9cc1d4e211fd16d9b953c575dd26385b046a015`.
The existing Tree core suite passed 5,924 checks on exact main. A read-only
probe of the same product source inspected the catalogue and actual prices
and payout previews.
