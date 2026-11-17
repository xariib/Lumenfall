# FORGE_YEARS_001 — long-term Forge progression

Status: investigation in progress; gameplay design clarification pending.
Owner: this feature chat. No subagents, chat creation or message tools used.

## Original requirement, 17 November 2026

> The forge upgrades should not be easy to max out after 1 2 weeks of playing,
> it should also take up to some years to finish the whole forge. There can be
> added more upgrades to do. Some of them with higher caps, some with lower caps,
> but the it should not be 1 2 weeks to finish all forge max.

Goal: a varied Forge with useful short and long upgrade paths, whose overall
development remains meaningful for years rather than one or two weeks.
Preserve all paid levels/effects, saves, recovery, unrelated mechanics and UI.

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

- Define whether a final completion point is wanted or some paths stay endless;
  the current code already has endless paths. Asked as a gameplay clarification,
  not an authorization request. Exact new caps/effects/costs remain undesigned.
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

No gameplay changes. Added this task, the read-only
`scripts/qa/forge-years-audit.cjs` and [baseline evidence](../qa/forge-years-001/README.md).
Node24.22.1: context PASS, original workshop480/four controls PASS, original
endless Forge/Lab568/four controls PASS. New actual-purchase audit completed.
All20 short finite tracks fit the synthetic shared14-day wallets; Masterwork500
costs about4.20e71 Lumen and1.05e70 Shards, while three tracks are endless.
The audit explicitly does not measure a fresh account's completion calendar.

Finite-versus-endless clarification remains unanswered; do not silently replace
previously accepted endless mechanics. Next: resolve that gameplay requirement,
document exact varied caps/effects/prices and multi-year calibration assumptions,
then implement with focused regression coverage. No PR/integration/APK yet.
