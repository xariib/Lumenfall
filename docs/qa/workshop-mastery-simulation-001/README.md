# Forge, Lab, and Wisp Mastery in Android 0.2.153

The current Workshop has **24 purchasable Forge tracks and 24 purchasable Lab
tracks**. The modeled Lab schedule takes **1,102 days (3.02 years)** from zero
Lab levels at funded 8×. That scenario starts with the record and Ascensions
needed for the five-slot challenges and can pay every research price. It earns
all remaining research prerequisites and expands the Lab through the real
queue. Starting from a fresh save adds the rest of the progression path,
which can run in parallel with research once its gates are met.

| Scenario | Full Forge | Full Lab | Starting conditions |
| --- | ---: | ---: | --- |
| Funding available for every Lab start and boost | — | 1,102 days at 8× or 8,809 days at 1× | All Lab tracks Lv. 0, Rift 5,020 record, 100 Ascensions already earned |
| Legacy-equipped Forge benchmark | 994 productive days | Granted resource Labs | Rift 1,001 farm, Rift 10,000 record, two resource Labs at 500 and three legacy Forge tracks at 250 |
| Mature team with current purchases, farming Rift 1,001 at 24 productive hours/day | 21/24 after 2,400 days | 19/24 after 2,400 days | Rift 10,000 record granted, max-level Wisps, 100 Ascensions, Wisp Ascendancy 176, Arcane Calibration 10, paid 8× queued |
| Same Rift 1,001 team at 12 productive hours/day | 21/24 after 4,000 days | 19/24 after 4,000 days | Same seed, paid 8× queued |
| Same Rift 1,001 team at 1× and 24 productive hours/day | 21/24 after 5,500 days | 15/24 after 5,500 days | Same seed and no boost purchases |
| Late game, farming Rift 60,001 at 12 productive hours/day | Day 1 | Day 974 (2.67 years) | Starts with Ember Mastery 2,490, Wisp Ascendancy 500, Masterwork 498, Swift Ascension 250, 100 Ascensions, Arcane Calibration 10, max-level developed Wisps and zero starting farm wallets before Deed processing |

The fresh save reached **Rift 140 in 24 simulated hours**, with 11 manual
Ascensions and only Swift Recovery capped. This policy kept tapping once per
second and made frequent purchases and Rift decisions. The mature scenarios
hold the farm Rift and Wisp levels fixed, credit each day's wallet from a
60-second sample of production combat with the current bought ranks, buy
Forge levels using the real Max plan, and advance the standard Lab queue over
the full 24-hour research clock. They exclude the earlier journey to the seeded
record. [Fresh run](fresh-24h.json) · [Rift 1,001](continuous.json) ·
[12-hour case](halfday.json) · [1× case](unboosted.json) · [Deep run](deep.json) ·
[Legacy Forge reference](forge-reference.json).

## What sets the timeline

- **Research time.** Even with all reductions granted in each individual
  quote, the total workload needs at least **807.5 days at 8×** when spread
  over five slots. That is an optimistic work bound because every start gets
  the largest empty-slot discount in those quotes. Support Endurance alone
  takes at least **450 days** at 8×. The full funded schedule spent **331.8
  million Motes**. Keeping five occupied slots boosted costs **297,000 Motes
  per day** once Mote Catalysis is capped. The fifth slot requires a Rift 300
  record, 100 Ascensions, and 150 completed levels across 10 subjects before
  its paid research can start. [Lab work quotes](catalog.json) · [Funded runs](funded-lab.json).
- **Prices.** The last Luminous Sense level costs about **4.55 × 10⁶⁹ Shards**
  with the Procurement discount. Even the fully developed Rift 1,001 farm
  in the high-income sensitivity check made only about **6.79 × 10¹⁷ Shards
  per productive day**. The sensitivity check earned about **2.54 × 10⁶⁰**
  Shards per day at Rift 40,001 and **4.30 × 10⁷¹** at Rift 50,001, with
  a seeded roster that could already farm those Rifts. That difference in
  income explains why the deep Workshop benchmark can pay for the last ranks.
  [Farm income by Rift](farm.json).
- **Rift gates.** Masterwork 500 requires **Rift 5,020**. A generous zero-Mastery
  combat test granted capped Forge, Lab, Tree and Astral upgrades and put a
  fully developed team in Rift 1,001. It ended at **Rift 3,816 after 30 minutes**
  of automatic combat. At Rift 5,020, it killed **zero enemies in two minutes**
  and its sustained damage was **3.54% of boss regeneration**. This tests
  automatic combat on that team. [Mastery replay](mastery.json).

## When Mastery is the remaining purchase

The capped-Workshop fixture started at Rift 50,180 with Ember at Mastery 2,000
and empty Prism and Sigil wallets. In two minutes it reached Rift 50,218 and
earned **3,921,651,784 Sigils**. A real new-record Ascension added **4,578
Prisms**. Mastery 2,001 required **1,961,464,600 Sigils** and **2,020,000
Prisms**, so the purchase was blocked on Prisms.

Even the optimistic quote for cashing in each of 20 consecutive new clears as
a separate Ascension came to only **91,438 Prisms**, or **4.5%** of that rank's
price. Those quotes give each new clear its own reward and omit all rebuild
time. This measures new-record Ascension funding near Rift 50,200, with other
Prism sources and previous savings outside that quote.

With the missing Prisms supplied, the real purchase succeeded. The same
developed roster reached **Rift 50,236 versus Rift 50,234** in two minutes after
that one purchase. At this point each additional Mastery rank grants 10% own
Wisp Power and the same-class Rift HP rises about 8.46% across the 20-Rift rank
spacing. The tested Mastery purchase adds real pushing power. The measured
Prism income is the limiting factor for buying new ranks regularly.
[Mastery costs, earned currency, and comparison](mastery.json).

Fresh-account progress is measured through the first 24 hours. The deep
completion run starts with substantial Mastery already paid, and its clock
starts after the journey to that position.

## Reproduction

Run from the repository root on Node 24.22.1. The source SHA-256 is
`711f8e4bf5b04ec17ee52bace271e617ddb67bc59fa6c896a3fff88702a7421f`.

```sh
node scripts/qa/workshop-mastery-simulation.cjs all
node scripts/qa/forge-rift-300-campaign.cjs index.html 24 fresh-24h.json boss
node scripts/qa/finite-forge-reinvestment.cjs index.html
```

The source-backed Lab slot contract passed 55 checks, the Mastery and Wisp
requirement tests passed 2,609 checks, and the finite Forge check passed 385.

## Per-track results

Days count from the start of the specified benchmark. An em dash marks a track still open when the simulation stopped. The Rift 1,001 column uses the 2,400-day run with 24 productive combat hours per day, and the Rift 60,001 column uses 12 productive hours per day.

### Forge

| Upgrade | Cap | Final rank Rift | Rift 1,001 day | Rift 60,001 day |
| --- | ---: | ---: | ---: | ---: |
| Swift Recovery | 10 | 140 | 1 | 1 |
| Arcane Calibration | 20 | 450 | 1 | 1 |
| Resource Conduction | 20 | 550 | 1 | 1 |
| Luminous Tracking | 10 | 320 | 1 | 1 |
| Masterwork Tempering | 500 | 5020 | 209 | 1 |
| Cauterize | 10 | 275 | 1 | 1 |
| Fracture Key | 10 | 340 | 1 | 1 |
| Guardian Seal | 5 | 365 | 1 | 1 |
| Rift Spillway | 5 | 425 | 1 | 1 |
| Sustained Channel | 5 | 500 | 1 | 1 |
| Tap Conduit | 5 | 310 | 1 | 1 |
| Guardian Cadence | 5 | 350 | 1 | 1 |
| Resonance Relay | 5 | 400 | 1 | 1 |
| Resonant Edge | 5 | 480 | 1 | 1 |
| Victory Charge | 5 | 520 | 1 | 1 |
| Amplifier Trim | 5 | 600 | 1 | 1 |
| Dual Channel | 5 | 650 | 1 | 1 |
| Overflow Conduit | 5 | 750 | 1 | 1 |
| Resonance Cells | 2 | 500 | 1 | 1 |
| Resonance Cascade | 5 | 900 | 1 | 1 |
| Resonance Reclaim | 3 | 1100 | 1 | 1 |
| Battle Tempering | 375 | 100 | — | 1 |
| Arcane Tempering | 325 | 150 | — | 1 |
| Harvest Tempering | 315 | 200 | — | 1 |

### Lab

| Study | Cap | Funded 8× day | Rift 1,001 day | Rift 60,001 day |
| --- | ---: | ---: | ---: | ---: |
| Wisp Ascendancy | 500 | 1099 | — | Already capped |
| Guardian's Mastery | 500 | 1099 | — | 971 |
| Shard Attunement | 500 | 1098 | — | 971 |
| Lumen Wellspring | 500 | 1100 | — | 973 |
| Luminous Sense | 500 | 1102 | — | 974 |
| Measured Inquiry | 10 | 377 | 223 | 223 |
| Wisp Damage | 100 | 823 | 723 | 731 |
| Wisp Critical Chance | 100 | 844 | 745 | 755 |
| Wisp Critical Damage | 100 | 857 | 756 | 770 |
| Support Endurance | 10 | 927 | 807 | 830 |
| Expanded Apparatus | 2 | 32 | 15 | 15 |
| Research Procurement | 10 | 189 | 137 | 137 |
| Mote Catalysis | 10 | 297 | 212 | 212 |
| Focused Apparatus | 5 | 92 | 71 | 71 |
| Field Notes | 10 | 108 | 82 | 82 |
| Balanced Curriculum | 3 | 271 | 28 | 28 |
| Boss Survey | 20 | 411 | 353 | 353 |
| Luminous Distillation | 20 | 494 | 432 | 432 |
| Sigil Cartography | 5 | 141 | 110 | 110 |
| Rarity Appraisal | 10 | 115 | 84 | 84 |
| Module Fabrication | 10 | 214 | 157 | 157 |
| Ultimate Analysis | 10 | 337 | 263 | 263 |
| Resonance Efficiency | 5 | 51 | 42 | 42 |
| Adaptive Growth | 5 | 52 | 41 | 41 |
