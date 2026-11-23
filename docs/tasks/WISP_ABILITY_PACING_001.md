# WISP_ABILITY_PACING_001

Status: baseline reproduced, gameplay direction pending. Owner is this feature chat.

## Requirement and baseline

User feedback on 23 November 2026: “Abilities is very easy to max out”.
The goal is to make maxing Wisp abilities a meaningful progression milestone.
The [earlier pacing request](WISP_GAMEPLAY_PACING_001.md) specifically asked that
later Wisps take time to develop their abilities after recruitment.

Baseline is `5439b1e6` on `origin/main`, with game source SHA-256
`d5713fe364cebcf20497e56eb5cf9c253499bb7427cb8cf36b8ac7b83774eb66` from
[Android 0.2.169 delivery](MENU_CLEANUP_001.md). The original checkout is on
older Forge/Lab work. This task uses `C:/lf-wisp-ability-pacing` on
`analysis/wisp-ability-pacing-001`. Open PR #72 concerns Ascension Tree pacing
and touches the shared game file. Recheck its integration before changing the
game. PR #63 is separate Google Play work. Branch pushes under this name do
not match the reviewed workflow triggers. Android builds use manual dispatch.

## Observed purchase behavior

The 20 Module levels use Lumen and Shards. Each adds five percentage points to
its listed effect. Ember and Tide have no Module requirements beyond recruitment.
The others gain a five-Rift and two-level Wisp Ascendancy requirement at the
start of each four-level band. This is a shared record and a shared Lab study.
A wallet can buy all remaining levels as soon as it meets the last band's gate.

| Wisp | Rift record for level 20 | Wisp Ascendancy for level 20 | Total Lumen from 0 to 20 | Total Shards from 0 to 20 |
| --- | ---: | ---: | ---: | ---: |
| Ember | Recruited | — | 385,336 | 38,534 |
| Tide | Recruited | — | 2,312,015 | 231,201 |
| Stone | 30 | 9 | 13,872,085 | 1,387,208 |
| Gale | 35 | 25 | 90,984,821,117 | 9,098,482,111 |
| Thorn | 55 | 31 | 1,526,472,142,775 | 152,647,214,278 |
| Void | 75 | 37 | 25,609,953,027,723 | 2,560,995,302,773 |
| Aurora | 95 | 42 | 268,539,821,034,214 | 26,853,982,103,420 |
| Titan | 120 | 55 | 120,939,583,786,400,074 | 12,093,958,378,640,009 |

Node 24.22.1. In the existing Forge VM harness, expose `moduleCost`,
`getWispModulePlan`, and `buyModule`. Use a fresh state for each Wisp with that
Wisp recruited at level 1 and no Module Fabrication discount. Sum the 20
production quotes with the exact Amount library. Seed the final band's Rift
record and completed Lab level, and fund the wallet with exactly those sums.
Call the real purchase handler until it refuses. All eight runs bought 20
levels and ended with both currencies zero. This is a purchase boundary test
with seeded funds and requirements. Calendar and active play time were not
measured. Existing baseline command
`node tests/behavioral/wisp-gameplay-pacing.cjs index.html --negative` passed
419 checks and all six negative controls on the stated source.

Ultimate is a separate purchase. It requires ability level 15, Mythic rarity,
Rift 120, 50 Ascends, Arcane Calibration 10 and Wisp Ascendancy 92 for Ember
through 176 for Titan, with a separate Sigil cost. Mastery currently requires
level 20 plus the Ultimate and its own prerequisites.

## Decision and acceptance

The first gameplay choice is whether to pace the existing cap of 20 for future
purchases or add progression for already-maxed abilities. If the cap stays at
20, keep the level-15 route to Ultimate and tune the final five levels against
measured progression. If new ranks are requested, decide their effects and cost
curve and keep existing Ultimate, Mastery and paid rewards valid. Owned levels
and all current paid progression stay intact in either design.

After direction is set, measure time or Rift milestones from representative
fresh and developed saves. Verify boundaries and exact payment through the real
button and purchase handler, lock explanations and live affordability, maxed
presentation, save and paid-progression preservation, achievements, and relevant
full regression and Android acceptance. Product changes and acceptance remain
open. Next action is to resolve the cap choice and calibrate the candidate.
