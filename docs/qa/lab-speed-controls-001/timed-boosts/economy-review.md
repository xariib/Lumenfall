# Timed boost balance — 15 October 2026

The user rejected the first cheap proposal, then delegated numerical tuning:
“Find a good balance between motes earning and speedup cost”. The intermediate
1500-Mote proposal was superseded by this calibrated local candidate.
No further price approval is pending. Release/device acceptance remains open.

## Implemented prices

| Speed | 8h | 12h,5% off | 24h,10% off |
| --- | ---: | ---: | ---: |
| 1.5x | 800 | 1140 | 2160 |
| 2x | 1500 | 2138 | 4050 |
| 3x | 3500 | 4988 | 9450 |
| 4x | 6500 | 9263 | 17550 |
| 5x | 10000 | 14250 | 27000 |
| 6x | 15000 | 21375 | 40500 |
| 7x | 20500 | 29213 | 55350 |
| 8x | 27500 | 39188 | 74250 |

Each package rounds up once before the existing Catalysis discount (up to20%).
Target: about4–5 hours of ordinary midgame Luminous income buys8h at1.5x;
higher speeds require substantially more saving. The largest tier costs about
34 times the base tier and performs16 times its extra work per hour (7x versus
0.5x extra base work), keeping stronger acceleration progressively expensive.

Luminous Mote payouts now require an actual eligible kill with a global60s
cooldown. There is no passive payout, banked idle award or reset on changing
Rift/Ascend. Depth, Luminous Sense, Dawnpriest and Active Amplifier bonuses still
set the qualifying reward. Existing balances and other currencies remain intact.

## Production-logic measurements

Run node docs/qa/lab-speed-controls-001/timed-boosts/economy-review.cjs.
[economy-review.json](economy-review.json) records the pre-change source084f2995;
[economy-candidate.json](economy-candidate.json) records the candidate hash and
60/600/3600-second observations. Synthetic fixtures are not player telemetry.
Exclude one warmup kill to spawn canonical HP; fixtures may contain artificial
1-HP enemies. Automation/spending were disabled; combat abilities remained.

| Fixture | Rift | Baseline Motes/minute | Candidate Motes/10min | Candidate Motes/hour |
| --- | ---: | ---: | ---: | ---: |
| mid-game | 17 | 39 | 30 | 174 |
| farm-mode | 3 | 199 | 10 | 60 |
| parity-medium-farm, stress | 89 | 9477 | 270 | 1620 |
| mature-high-power, stress | 95 | 4671 | 270 | 1620 |

The midgame hourly observation gives800/174=4.60 hours (about4h36m) to fund8h1.5x.
Higher depth/purchased rewards deliberately make entry boosts easier later.
Stress fixtures must not be called typical players. Cooldown cuts the extreme
speed-of-kills multiplier while preserving the value of purchased reward bonuses.

Field Notes still gives up to20 Motes per other earned Study completion. Starts
consume Lumen/Shards and work grows with levels; it is not limited by this kill
cooldown. Ascension Dust still grants up to50 Motes per Ascend based on Prisms
actually earned. This choice preserves purchased benefits; extreme completion/
Ascend farming needs separate long-term play telemetry. No new reward caps or
cuts were silently imposed. Daily Quests, Deeds and login rewards stay unchanged.

The first14-Mote8h proposal (proposed-prices.json) was cheaper than one observed
baseline minute in every fixture. The intermediate1500 proposal implied at least
8h20m at the midgame theoretical180/hour limit;800 meets the delegated4–5h target.
None of these synthetic calculations proves universal player satisfaction.

## Regression boundaries

Exact core/browser checks cover quoted/debited amounts, all durations/tiers,
Catalysis rounding, duplicate protection, legacy migration, expiry/carry,
Luminous chronology, unscaled Mote policy, online/offline/split/yield/retry,
recovery/backup/Reset/Ascend and the shared productive cap. All kills, Luminous
counts, Lumen/Shards, Field Notes and existing paid floors remain protected.
See final verification receipts in this directory. No APK/signing/remote work.
