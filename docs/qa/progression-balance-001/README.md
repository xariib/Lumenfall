# Workshop, Mastery and milestone bosses

This report compares Android 0.2.153 at main `42c9cdf5` with the balance
candidate. The game engine ran the combat, purchases, Ascend and Lab
completion. Developed saves for each scenario were seeded with the listed
prerequisites. The reported farming and purchases started with no wallets.
The tested game source shipped in
[Android 0.2.156](https://github.com/xariib/Lumenfall/releases/tag/android-1000156).

## Boss pacing

Every 500th Rift from Rift 1,000 has 50% more boss HP. Regeneration still
uses the boss trait's percentage of max HP. Enemies between milestone bosses
and all boss rewards use the existing values.

| Rift | Record on 0.2.153 after 1h Farm | Candidate record after 1h Farm | Candidate clear with a longer Farm |
| ---: | ---: | ---: | --- |
| 1,500 | 1,505 | 1,500 | 8h, reached 1,509 |
| 2,500 | 2,523 | 2,500 | 4h, reached 2,520 |

Both versions used the same starting saves and reinvested Farm proceeds in
the same order through the normal Forge and Wisp purchase actions. Each
attempt used 15 minutes of automatic Push after spending. Live and offline
Push agreed on the longer attempts. The encounters had different boss traits
and starting investment levels. Player choices and reserves can change the time.

[0.2.153 replay](pacing-baseline.json) · [candidate replay](pacing-candidate.json)

## Workshop and Mastery economy

- An established save replayed Rift 1 through 349 and earned 595 Sigils,
  enough to buy Ember's 400-Sigil Ultimate. A new-record Ascend paid 44
  Prisms, and the save bought Rank 1 Mastery for 29 Prisms and 37 Sigils.
  The baseline wallets fell short for both purchases. Unlock requirements
  still apply.
- The [late-Mastery combat replay](mastery.json) bought Rank 2,001 for
  449 Prisms and 1,959,547,893 Sigils out of 4,578 Prisms and 3,921,651,784
  Sigils gained in the test, with a zero starting wallet. At matched
  development the bought rank increased the 120-second endpoint by two Rifts.
- Luminous Sense Lv. 500 falls from about 5.69e69 to 1.07e22 Shards
  before discounts. It still takes 10 days of base work. The exact debit
  keeps a small fractional remainder through purchase and cold load.
  All 2,484 valid cases in the existing Farm-to-Lab boundary
  corpus passed.
- At Rift 10,001, a seeded account with Ember Mastery 388 and Wisp Ascendancy
  Lv. 176 finished all 24 Forge and all 24 Lab tracks on day **1,020**.
  The policy extrapolated actual Farm income to 12 productive hours per
  day and paid for boosts up to 8×. Forge finished on day 1 because of the
  starting development and high Farm tier. The same 0.2.153 account had
  19 Labs capped after 2,400 days. Its five foundation tracks stopped at
  levels 180–187. [Baseline forecast](workshop-baseline.json) ·
  [Candidate forecast](workshop-candidate.json)
- With funding granted and Lab starting at Lv. 0, the queued research took
  **1,125 days at 8×** or **8,993 days at 1×**. The earlier baseline schedule
  took 1,102 and 8,809 days. Individual durations are identical. The timings
  are queue outcomes with five slots earned during the run, a granted Rift
  record and 100 previous Ascends. They exclude the time to develop that
  save from a fresh start. [Funded schedule](funded-lab.json)

The [four paired offline windows](offline-replay.json) compared complete
states at one-second intervals on both builds. All four accepted hashes
matched. Chromium's existing Wisp UI suite passed 901 checks.

## Reproduce

```powershell
node -e "require('node:fs').writeFileSync('lumenfall-0253.html', require('node:child_process').execFileSync('git', ['show', '42c9cdf5:index.html'], {maxBuffer: 4000000}))"
node tests/behavioral/progression-balance.cjs lumenfall-0253.html --baseline
node tests/behavioral/progression-balance.cjs index.html
node scripts/qa/workshop-mastery-simulation.cjs mid-depth workshop-baseline.json lumenfall-0253.html
node scripts/qa/workshop-mastery-simulation.cjs mid-depth workshop-candidate.json
node scripts/qa/workshop-mastery-simulation.cjs funded-lab funded-lab.json
node scripts/qa/workshop-mastery-simulation.cjs mastery mastery.json
```
