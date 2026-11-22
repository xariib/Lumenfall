# Workshop completion and Wisp Mastery simulation

The user asks how long it takes to finish every Forge and Lab upgrade, and
whether Rift progress can continue with Wisp Mastery as the remaining focus.
This is a read-only simulation of Android 0.2.153 on `87e24896` in an isolated
worktree. The Play candidate is separate. The analysis uses the released
catalogues, purchase gates and engine with explicit starting accounts.

Measure the paid Workshop times under stated farming and Laboratory speed
assumptions, check whether the entire Workshop can open before investing in
Mastery, and test the currency and combat loop after completion. Distinguish
fresh-account evidence, mature forecasts, work bounds, and seeded combat runs.

Sources include the [Forge balance](FORGE_YEARS_001.md),
[short Forge pacing and Mastery tail](FORGE_PROGRESS_AND_ANDROID_BACK_001.md),
and [earned Support timing](TEAM_PROGRESSION_001.md).

## Result

The [report and per-track results](../qa/workshop-mastery-simulation-001/README.md)
record full paid Lab schedules, shared-budget Workshop forecasts, the fresh
replay, and actual Mastery purchases and combat. All 24 Labs finish on day
1,102 at fully funded 8×, or day 8,809 at 1×, in the schedule with the Rift
and Ascension requirements already met. The deep Rift 60,001 benchmark
finishes its remaining Forge on day 1 and Lab on day 974. That seed already has
Ember Mastery 2,490, Wisp Ascendancy 500, Masterwork 498 and Swift Ascension 250.

The last Masterwork gate is Rift 5,020. The automatic zero-Mastery replay
finished its 30-minute run at Rift 3,816 even with granted Workshop upgrades.
The actual Mastery 2,001 experiment earned enough Sigils but needed another
2,015,422 Prisms to fund the purchase. A real purchase from a seeded reserve
improved the replay at the same starting Rift. The fresh-account completion
date remains unmeasured beyond the recorded 24-hour run and conditional
forecasts.

The simulation was executed with Node 24.22.1 against source SHA-256
`711f8e4bf5b04ec17ee52bace271e617ddb67bc59fa6c896a3fff88702a7421f`.
Lab slot contract passed 55 checks, calibrated Wisp and Mastery boundaries
passed 2,609, and finite Forge passed 385. The deliverable is the analysis,
driver and recorded results.
