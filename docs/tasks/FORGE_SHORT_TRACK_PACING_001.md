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

## Rift 300 follow-up, 22 November 2026

> Do a simulation to rift 300 and see how much could be maxed out

Measure the Forge at first arrival and after actually beating the Rift 300 boss.
Use the same public Android0.2.150 engine, with real spending, combat and Lab
work. Run two fresh campaigns and a separate late-push comparison. The latter
starts at Rift 180 with five level-230 Mythic Wisps with ability level 15,
50 Ascends and strong completed Labs, including Wisp Ascendancy 100 and
Lumen/Shard Labs 50. It begins with zero Lumen, Shards and Forge ranks. The
starting power is granted for the comparison, so this run does not measure the
calendar time or resources to develop that account.

The developed account actually beat Rift 300. It finished the twentieth short
track at Rift 235, reached Rift 300 about 7.36 minutes into this late push, and
cleared it at 7.78 minutes. The four longer tracks were still incomplete.

| Forge track | Entering Rift 300 | After farming Rift 299 for 8 hours | Full cap |
| --- | ---: | ---: | ---: |
| Short tracks | 20 of 20 maxed | 20 of 20 maxed | 145 total ranks |
| Masterwork Tempering | 24 | 25 | 500 |
| Battle Tempering | 49 | 102 | 375 |
| Arcane Tempering | 39 | 53 | 325 |
| Harvest Tempering | 34 | 34 | 315 |

The follow-up farm run spent in Forge catalog order with the shared wallet, so
its ranks are one allocation. Masterwork rank 25 exhausts the available ranks
at Rift 300. The next rank requires Rift 320. The developed account owned 291 of
1,660 total Forge ranks at first arrival, or 17.5%, despite having maxed 20 of 24
tracks. It owned 359 ranks after the additional farm window. The depth rules
permit a sufficiently funded account to finish 23 of 24 tracks at this record.
Masterwork's 25 accessible ranks prevent full Forge completion at Rift 300,
regardless of currency. A replay reproduced the same developed-account wallet,
levels and purchases at each captured milestone and after farming.

Both fresh campaigns hit the 720-hour time bound with 20 tracks maxed. They
started with only Ember. Their recorded advancement and purchases follow the
stated strategies and time budget.

| Fresh strategy | Swift Recovery maxed | Arcane Calibration maxed | All 20 short tracks maxed | Highest Rift after 30 simulated days |
| --- | ---: | ---: | --- | ---: |
| Forge first | 2.34h | 20.92h | 41.54h, Rift 150 | 190 |
| Boss focus | 2.80h | 34.55h | 60.79h, Rift 160 | 210 |

The first campaign spent 672 of 720 hours farming with Wisp Ascendancy 19 at its
endpoint. The second spent 668 hours farming and finished with Wisp Ascendancy
33. Each generated one manual tap per simulated second throughout, since
neither earned Auto-Tap. These runs confirm the short-track completion but give
no fresh-account completion time for Rift 300. No gameplay or APK change.

Reproduce the developed run with `node scripts/qa/forge-rift-300-campaign.cjs
index.html 24 developed.json developed`, or the fresh runs with the same driver,
`720` hours and the `forge` or `boss` strategy. The former prioritizes short
purchases and leaves Lab speed at 1×. The latter invests more of the wallet in
long Forge upgrades, buys eligible Lab boosts, prioritizes critical Labs, and
continues manual tapping during boss fights. Both simulate continuous active
play and therefore represent aggressive play schedules.

Source-bound receipts for the [developed late push](../qa/forge-short-track-pacing-001/rift-300-developed.json),
[Forge-first fresh campaign](../qa/forge-short-track-pacing-001/rift-300-fresh-forge.json)
and [boss-focused fresh campaign](../qa/forge-short-track-pacing-001/rift-300-fresh-boss.json).
The Forge-first receipt predates removal of an ineffective one-hour boost probe
(the game only sells 8, 12 and 24 hours). The run never paid for any boost.
