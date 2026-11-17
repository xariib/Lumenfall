# FORGE_YEARS_001 — long-term Forge progression

Status: implementation in progress; finite completion requirement confirmed.
Owner: this feature chat. No subagents, chat creation or message tools used.

## Original requirement, 17 November 2026

> The forge upgrades should not be easy to max out after 1 2 weeks of playing,
> it should also take up to some years to finish the whole forge. There can be
> added more upgrades to do. Some of them with higher caps, some with lower caps,
> but the it should not be 1 2 weeks to finish all forge max.

Goal: a varied Forge with useful short and long upgrade paths, whose overall
development remains meaningful for years rather than one or two weeks.
Preserve all paid levels/effects, saves, recovery, unrelated mechanics and UI.

User clarification, 17 November:
> It should be 2 3 years possibly to max out, there should not be any endless
> forge upgrades, when you come to a point where it feels like you can never go
> further, then its because there is some lab upgrades that could be needed or
> some to strengthen everything to go further

All Forge paths must be finite. Target possible completion in roughly2–3years;
Lab damage/economy research must provide meaningful help through later walls.
This supersedes the former endless Forge requirement. No new permission needed.

## Baseline and overlap

Fetched main `b075cfba` (Android 0.2.130 lineage). Isolated worktree
`C:/lf-forge-years`, branch `feature/forge-years-001`. Original checkout and
other feature worktrees untouched. GitHub open-PR search returned no results.
Read [current status](../PROJECT_STATE.md), [workflow](../project/FEATURE_WORKFLOW.md),
[Forge origin](FORGE_WORKSHOP_PACING_001.md),
[endless Forge delivery](ENDLESS_FORGE_LAB_PACING_002.md) and affected product/tests.

Verified code: three Tempering tracks are endless with +1 percentage point per
level and 10% price growth. Many utility tracks cap at 2–20. Existing tests
measure generous short fixed-depth farming; these do not establish a multi-year
whole-account completion horizon. Historical requirements used a several-month
target; this user's new years target supersedes it for this feature.

## Acceptance and design decision

- Every Forge path has an explicit finite cap and final maxed UI. Preserve
  above-cap historical levels and effects without allowing further purchases.
- Quantify 7/14-day and longer horizons with explicit account/farming assumptions,
  considering deeper records and reinvestment rather than claiming that a high
  cap or static price alone proves years of player progression.
- Preserve earned progress with regression coverage for affected purchases,
  queues, prices/effects, save/recovery, Ascend and online/offline behavior.
- Keep visible effects/costs, red insufficient amounts and disabled purchases.
- Relevant baseline/focused checks and required CI must pass; integrate and
  deliver Android evidence before claiming delivery. Human pacing remains an
  empirical limitation. Do not archive while acceptance remains open.

## Checkpoint / next action

Current product SHA256:
`af692d7f75c9681a2f3f7118b1fa6cdc0b42311e1c780bb2a53138b45d2a168d`.
[PR59](https://github.com/xariib/Lumenfall/pull/59); previous pushed head `532cbaa5`.
Latest source/test corrections pass local validation and are being published.
No integration or APK yet; self-review only. Standing authorization applies.

Implemented finite caps: Battle 375, Arcane 325, Harvest 315, Masterwork 500.
Tempering's first 300 prices and Masterwork's first 50 are unchanged; marginal
growth then becomes 0.2% and 2.5%, including the very first new rank. Other
caps/prices/effects, all Lab work and Masterwork record bands stay unchanged.
Above-cap historical paid effects/levels/queues/Deeds are retained. No schema
change, progress reset, new timer, or automatic grant in the game. Forge/help
text now explains finite caps and existing Labs as routes through later walls.

Node 24.22.1: finite core 385 assertions/four causal controls PASS; original
workshop 480/four plus its new finite/forecast subchecks PASS. Actual V8 6.0
passes 2,524 checks, including new tails and final/historical transactions.
Original Forge, whole-game, slot, permanent, Lab access and early-Wisp checks
pass; source-bound receipts and all initial failures are in
[evidence](../qa/forge-years-001/README.md).

The reinvesting mature reference finishes all 24 active paths on productive
day 994 (about 2.7 years). It grants record 10000, Wisps 10000 and mature Labs;
daily income extrapolates 60 actual offline seconds to 24 productive hours.
Lower research/farm and changing-income comparisons remain unfinished at 1200
days. This is not a fresh-account calendar guarantee. A real capped-Forge boss
at Rift 490 changes from 0 kills to 17 kills/ending Rift 507 with completed
damage/critical Labs, identically live and offline over 120 seconds.

First CI findings: stale mobile cap-effect expectations corrected; shared
startup budget fixed by preserving superseded status entries verbatim in
[history](../PROJECT_STATE_2026-11-17_HISTORY.md). Tree browser timed out with
no completed result; raw evidence retained, cause unproven. Workflow files
remain unchanged; the existing required Forge entrypoint runs new checks.
New mobile tests retain stationary scroll within the actual document range,
same-upgrade focus, maxed semantics and historical bonuses; reload waits for
its own navigation event. Full mobile PASS: 32,484 checks across12 profiles,
clean browser exit and visually self-reviewed maxed cards at1x/2x. New exact-head
CI remains pending. No original gate, deadline or assertion is weakened.

Next: finish full mobile/CI checks, resolve any findings, publish the coherent
checkpoint, integrate serially after all required gates pass, then run exact
integrated checks and signed Android delivery. Keep this task open for missing
acceptance; physical phone, exact WebView60 DOM, TalkBack and human pacing
remain unobserved. Original baseline/evidence is preserved in the linked QA.

Unrelated finding for later copy maintenance: the encyclopedia's Modules &
Ultimates paragraph still mentions the superseded1/1.5s Support durations.
This feature changes only its Masterwork reference; Support mechanics stay.
