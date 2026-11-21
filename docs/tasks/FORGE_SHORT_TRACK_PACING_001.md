# Forge short-track pacing

21 November 2026. Owner is this feature chat. Player report from the Android
0.2.150 release period:

> I just played 1 day, already maxed arcane calibration, swift recovery. Seems
> like the forge can be maxed out with the low cap upgrades in 1 2 days of hard
> playing.

Investigate how quickly the short Forge tracks can finish and identify how to
preserve meaningful choices beyond the first two days. The earlier [Forge years
decision](FORGE_YEARS_001.md) calls for finite tracks with varied caps, Lab work
that helps through later walls, and roughly two to three years for the entire
Forge. Its mature forecast measured whole-Forge completion. The current report
concerns the time when most short tracks stop offering choices.

Baseline `619bc16e`, the documentation head for Android0.2.150 source `c455dbf3`.
Isolated worktree `C:/lf-forge-short`. PR63 covers separate Play distribution.
The current wallet, record, play schedule and starting progress of the reported
account are unknown. Compare actual prices and buys against explicit fixtures.

The [Swift Recovery decision](SWIFT_CURRENT_001.md) protects the 10-rank
effective cap, 3.33s natural cycle floor, historical refund and prices.
[Arcane Calibration's earlier cap decision](FORGE_LAB_CAPS_001.md) sets 20 ranks.
Arcane Calibration also feeds Wisp rarity and Ultimate requirements, so a change
to access must account for those milestones. Existing paid ranks and effects
must survive any pacing change. No cap or price decision made in this audit.

## Verified on Android0.2.150 source

The signed release's HTML SHA256 is
`b24494d6f4a4833c83922467e141454174efb9cbe4866e8d9e5ef7ebc45c805e`.
Current Forge has 20 active paths capped at 2 to 20 and four long investments.
Swift Recovery starts at Rift 1 and costs 4,317 Shards for ten individual buys.
Arcane Calibration unlocks at Rift 12 and costs 302,206,467 Lumen and 2,417,661
Shards for twenty. Neither path has an unlock between its first and last ranks.
The short tracks together cost 5,346,930,370 Lumen and 66,653,140 Shards.

Measured using the production offline combat engine and one-level purchase
handler. Each snapshot starts the farm window with zero Lumen, Shards and short
Forge ranks. Auto-purchases are off. All buys share a wallet and the audit checks
each rank and both debits. The snapshots already have the stated Rift record.

| Farm Rift | Record | Measured time | Short tracks completed |
| --- | --- | --- | --- |
| 16 | 17 | 1 hour | 1 of 20. Swift Recovery 10/10, Arcane Calibration 3/20. |
| 51 | 120 | 8 hours | 4 of 20, including both reported tracks. |
| 95 | 120 | 30 minutes | 20 of 20. The wallet earned 6.75B Lumen and 137.0M Shards. |
| 95 | 120 | 8 hours | 20 of 20. |
| 119 | 120 | 8 hours | 20 of 20. |

This reproduces the affordability problem with the existing established-account
fixtures. Rift 120 access, the fixture's 14 Ascends, preexisting Wisps, Labs and
historical buffs are starting conditions. The comparison does not establish
when a new account reaches that profile or what was in the reported save.
The prior multi-year forecast includes four expensive long tracks and did not
catch the loss of 20 shorter upgrade paths. Both results can hold together.

Reproduce with `node scripts/qa/forge-short-track-audit.cjs` from the repo root.
[Exact costs, shared wallets and actual purchases](../qa/forge-short-track-pacing-001/baseline.json).

## Next balance decision

Use each track's early ranks for its immediate benefit and reserve later ranks
for visible Rift or related completed Lab milestones. Keep qualifying Arcane
Calibration ranks available by the existing Wisp rarity and Ultimate milestones
(up to rank 10). Keep Swift Recovery's rank cap and natural cycle floor, and carry
all paid levels forward without charging for them again. Choose the milestones
against both active early play and established farming profiles before shipping.
The exact timing for individual tracks is still open. Keep the two-to-three-year
whole-Forge benchmark and add a distinct check for when short tracks run out.
Audit only. No product or APK change, and no independent review.
