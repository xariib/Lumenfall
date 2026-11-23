# WISP_ABILITY_PACING_001

Status: integrated and released in Android 0.2.171. Owner is this feature chat.

## Requirement and baseline

User feedback on 23 November 2026: “Abilities is very easy to max out”.
Follow-up: “Not newer levels but harder to obtain max lvl”.
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

## Selected pacing

Keep the cap at 20. Levels 16–17 require Epic rarity on that Wisp, levels
18–19 require Legendary, and level 20 requires Mythic. Apply a premium of
2×, 4×, 8×, 16×, and 32× respectively to both base prices before the existing
rounding and Module Fabrication discount. Existing Rift/Lab gates still apply.
Rarity connects each ability to progress on that Wisp. The currency premium
also raises the investment for a Wisp that has already reached Mythic. Ability
effects and levels 1–15 stay as before, including the path to Ultimate.
Mastery retains its prerequisites. Existing ranks and bonuses load as paid,
including Modules bought below the newly required rarity. No schema migration.

Replayed both game versions with exact prices and normal purchase handlers.
For all eight funded Wisps with the other requirements met, buying all available
abilities gave level 15 at Common through Rare, 17 at Epic, 19 at Legendary and
20 at Mythic. The full undiscounted currency cost rises by about 17.4×. Ember
goes from 385,336 Lumen and 38,534 Shards total to 6,706,471 Lumen and 670,647
Shards. Ember's final unlock follows Mythic at Rift 100, 40 Ascends, Wisp
Ascendancy 91 and Arcane Calibration 10. Titan's follows Mythic at Rift 150,
40 Ascends, Wisp Ascendancy 105 and Arcane Calibration 10. Both also require
the Mythic Wisp level and price. Adaptive Growth can discount the Wisp level
requirement. These are seeded boundary replays, with no calendar-time estimate.

## Verification and delivery

- `index.html` contains the pricing and prerequisite changes and reuses the
  same purchase markup for first render and live affordability. The glossary
  explains the new gates and directs players to the actual Ultimate requirements.
- `node tests/behavioral/wisp-gameplay-pacing.cjs index.html --negative` passed
  907 checks and eight negative controls, including all five purchase thresholds
  for every Wisp, both exact debits, cap enforcement, and old paid levels.
- `node tests/behavioral/full-game-audit.cjs index.html --negative` passed
  318 checks and three controls. `workshop-card-clarity.cjs` passed 440 checks
  plus its Deeds, purchase-pacing, and native recap checks.
- `node tests/behavioral/wisp-upgrades.cjs --chrome <chrome> --card-layout`
  passed 26,112 checks across 12 Chromium profiles. It verified lock text,
  accessible names, switching between locks/prices, live affordability,
  completed presentation, and the final purchase's native keyboard focus.
- `upgrade-affordability.cjs` passed 26,832 checks across 12 profiles. The
  stateful `p2-wisp-progression-pacing` scenario passed on staged game assets.
- All four independent eight-hour offline windows, each replayed one second
  at a time, reproduced the original canonical hashes and matched their
  released and candidate end states field for field. The source binding in
  `offline-swift-current-golden.json` is the only fixture change.
  [Offline replay evidence](../qa/wisp-ability-pacing-001/offline-replay.json).
- A standalone `endless-progression-core.cjs` run stops on the historical Gale
  recruitment test. The identical failure reproduces at `5439b1e6` before this
  change. The `--focus-f` invocation used in pre-merge CI passed 237 checks.

Local Node 24.22.1. Game source SHA-256
`94ff950c50fb7280287f2093e6f76f4fff8713dcdba7739e0fa421b5ea6ac1ca`.
Self-review and automated checks only. All eight workflows for
[PR #75](https://github.com/xariib/Lumenfall/pull/75) passed. Main advanced to
the exact tested merge commit `09b87e84f8b31d0f294dc4683d88982fb0ad4615` by
fast-forward. All nine dispatch workflows on that commit passed, including
188 stateful scenarios, isolated offline catch-up and runtime smoke. Three
initial Chromium startup timeouts passed on unchanged retries.
[Integrated validation](../qa/wisp-ability-pacing-001/integrated-validation.json).

The signed Android 12 [private build](https://github.com/xariib/Lumenfall/actions/runs/45211268132)
0.2.170 passed in-place upgrade, retention of both save slots and paid
progress, in-app update, installer Open and retail launch. Its game bytes
match the integrated candidate. SHA-256
`3d5c0d866fc87664f2b36d76636f3e3791ba7de545b41b4f00d746eed5f91859`.
The [publish run](https://github.com/xariib/Lumenfall/actions/runs/45229183408)
targets the integrated commit. Its first attempt reached the emulator updater
fixture and received HTTP 403 with zero GitHub API quota remaining while
fetching the official release metadata. The failure occurred before validating
the official in-app install. Failed native diagnostics artifact `14846717403`
contains `official-release-fetch.json`. The unchanged retry passed signed
in-place upgrade, both save slots and paid progress, in-app update including
tamper rejection and installer Open, retail launch and publication.

[Android 0.2.171](https://github.com/xariib/Lumenfall/releases/tag/android-1000171)
is current in the public update feed. Anonymous latest and versioned downloads
match APK SHA-256 `2803824abf0e31f326bf2d61c4f737c0a942d999eee112f3fbbe342904f94647`.
The APK retains package `com.lumenfall.app` and the established signer. The
packaged game matches the exact integrated source.
[Public verification](../qa/wisp-ability-pacing-001/android-public.json).
Required automated and emulator acceptance is complete. Actual player pacing,
physical-phone operation, exact WebView60 and TalkBack were not measured.
