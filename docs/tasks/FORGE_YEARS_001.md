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
[PR59](https://github.com/xariib/Lumenfall/pull/59) merged tested head `2bdf4f03`
as `0adb60eb36a3be15ce152d6ffe416d5996b039c7`. The complete integrated tree
`cf13935c16dd2dfa9f870d64777aed3304391978` equals the tested feature tree.
All eight required PR workflows PASS; full coverage is190main +1isolated offline.
All nine exact integrated workflows are running. No APK yet; self-review only.
Standing authorization applies. Human/device acceptance remains open.

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

At34de29ce seven required workflows and isolated offline PASS. Full pre-merge
attempts1/2 repeat the same15-second native Lab Boost touch deadline after four
passing viewport cases. Both logs are saved. Unchanged standalone suite passes
993checks/18profiles. The gesture helper now requires actual surface capture
plus fresh independent visibility/hit/44px checks before its original touch;
original functional assertions, viewports, mutation and deadline stay. Corrected
standalone PASS1083/18 and original next-lock causal assertion still rejects the
defect. Product unchanged; new Linux CI is required before integration. Cause
remains unproven. Separate PR60/61 own other UI changes; no gesture-helper overlap.

At44d07b87, the repaired Lab gesture and all seven separate workflows PASS.
Full pre-merge reached its source-binding guard and found that the old golden
file still named the released HTML hash. Corrected only after a paired exact
replay: immutable b075cfba source versus candidate, all four eight-hour windows,
230,400 independent one-second calls, every saved field and serialized endpoint
equal. Existing accepted golden counts/hashes are untouched; only sourceSha256
is rebound. `scripts/qa/finite-forge-reference.cjs`, its separate compressed
baseline fixture, and `independent-paired-replay.json` preserve the proof.
The earlier presentation-only replay rejected local byte hashes even for the
released source; no runtime/platform cause is claimed. New exact-head CI pending.

Atb87da914 seven separate workflows PASS, but the same320px/200% Lab profile
stalls during surface capture, before any touch. The first frame barrier was
insufficient. Native Boost/preset profiles now start in fresh browser contexts
with the requested text size applied before initial layout. All18boost and
18preset cases, gestures, functional assertions, causal control, runtime-error
coverage and original deadlines remain. Standalone PASS1191checks with clean
teardown; original next-lock defect is still rejected by its functional assertion.
Product/source binding unchanged. Actual platform cause remains unproven.
`premerge-surface-attempt.log.gz` and `lab-boost-isolated-results.json.gz` retain
the evidence. Main was rechecked atb075cfba; no integration/APK yet.

Head2bdf4f03 passes all required Linux workflows, including the formerly stalled
native Lab profiles and all190main/1isolated behavioral scenarios. Lab workflow
attempt1 stopped at Browser.getVersion before loading the game (zero assertions);
unchanged failed-job retry PASS. Original log is retained. PR reviews/threads
were empty; main was stillb075cfba before the serialized merge. Nine exact-main
manual runs were dispatched; `pr-runs.json`, `pr-jobs.json` and compressed job
logs retain the completed PR proof. Gameplay/source binding remains unchanged.

Exact integrated main is0adb60eb. Nine runs are recorded in `integrated-runs.json`:
premerge44089952825, Comet44089970874, Forge44089980763, Lab44089987713,
shared44089993593, Tree44089999690, permanent44090005249, Wisp44090013129,
migration44090020744. Tree attempt1 has no completed positive browser result:
25-second timeout, qa_count0/empty stdout; all six causal cases complete. Full
log and hash/CRC-verified original text artifact are retained in QA. Unchanged
failed-job rerun requested. No source/deadline/acceptance change. Other integrated
workflows continue. Delivery checkpoint branch is `docs/forge-years-delivery`;
keep its documentation separate during exact-source validation/publication,
then reconcile any concurrent integration before publishing the final receipt.

Integrated Tree attempt2 PASS unchanged, including the previously incomplete
browser case, native mobile matrix and actual V8 6.0. Eight integrated workflows
now PASS. The remaining full run44089952825 has passed every focused step and
is executing190stateful scenarios; its isolated offline case already PASS.
Main was rechecked at0adb60eb. Source remainsaf692d7f; no APK/build dispatched yet.

All nine exact integrated workflows now PASS. Full logs retain190main scenarios
and1isolated offline scenario. Main was rechecked unchanged at0adb60eb before
dispatching signed Android publishing run44099434281 (run135). Build/native/
public verification is pending. `integrated-jobs.json`, `integrated-runs.json`
and compressed full job logs retain final exact-source CI evidence.

Next: complete nine exact integrated workflows, resolve any findings, build and
publish the signed Android update, verify native/public receipts, then save the
delivery checkpoint in GitHub. Keep this task open for missing
acceptance; physical phone, exact WebView60 DOM, TalkBack and human pacing
remain unobserved. Original baseline/evidence is preserved in the linked QA.

Unrelated finding for later copy maintenance: the encyclopedia's Modules &
Ultimates paragraph still mentions the superseded1/1.5s Support durations.
This feature changes only its Masterwork reference; Support mechanics stay.
