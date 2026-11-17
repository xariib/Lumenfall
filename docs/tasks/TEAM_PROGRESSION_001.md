# TEAM_PROGRESSION_001 — meaningful Wisp investment and manual progression

Status: in progress. Owner: this feature chat, 16 November 2026. No agents,
other chats or message tools used. Standing authorization explicitly repeated:
finish the whole task without permission prompts while the user sleeps.

## Original requirements

User supplied a schema6 save: Ember290, Stone245, Tide214, Gale179; Epic, all
four Modules20, Charge10, Support Endurance0; rewarded clear279, record280,
9,045 Ascends,331,512 Prisms and20 Comets, Auto-Ascend owned but OFF.
Tide appears to have only about0.5s downtime. Nearly permanent damage buffs
must be difficult to earn. Wisp-menu Ember209.65M Power differs from Rift's
3.61B /4.69B with Tide. Make damage clean and understandable; improve scaling
so Support/utility Wisps deal useful damage and later Titan cannot make the
rest of the team irrelevant. Remodel Ascend: first clear15, subsequent rewards
require a higher Rift than the previous rewarded clear. Remove Auto-Ascend;
players manually Ascend and buy Tree upgrades. Preserve existing progress.

One goal: deliver coordinated Support timing, shared Wisp growth, consistent
damage presentation and manual forward-only Ascension, including migration,
regression checks, integration and signed Android delivery.

## Baseline and preservation

Current main`ba879406` (released Android0.2.128). Root checkout is historical
PR42 and untouched. Isolated worktree`C:/lf-team`, branch
`feature/team-progression-work`. No open PRs at startup. Earlier attempt at a
long worktree path failed during checkout; no product edits occurred there.
Root git core.longpaths enabled to support existing tracked evidence paths.

Read root rules/bootstrap/state, [workflow](../project/FEATURE_WORKFLOW.md),
[environment](../project/CODEX_START.md), [context](../CONTEXT_INDEX.md),
[previous Support requirements](SUPPORT_DURATION_001.md), current product and
relevant CI triggers. Required PR workflows run on pull_request; signed build
is workflow_dispatch and publication checks integrated-main gates.

Preserve all balances, paid work/levels, recruitment entitlements, Rarity,
Modules, Ultimates, Mastery, Tree/Forge/Lab, quests, Deeds, Bonds, automation
other than explicitly removed Auto-Ascend, both save slots/recovery, chronological
simulation/live-offline parity, mobile accessibility, WebView60 and signing.

Baseline Support/recast/paid90-day research and early-Wisp power suites PASS;
source-bound receipts: [QA](../qa/team-progression-001/README.md).
Node24.22.1. CI full runner pins24.19.0; browser availability being verified.

## Implementation decisions announced before edits

- Support stays3s base. Independent recast minimum6s without Endurance, giving
  at least3s downtime even at Charge10 or with unlimited external charge.
  Endurance keeps its earned45-day/level best-case work, price/access/cap;
  first two levels each lower this floor1.2s (6→4.8→3.6). Duration still adds
  .3s/level (up to6s). Earliest sustained per-source uptime remains90 dedicated
  research days at8x/all discounts, with sufficient Charge. Existing active
  cast deadlines/strength remain snapshots, not rewritten on import/completion.
- Shared level-growth replaces Ember/Stone-only late bonus; modest explicit
  Wisp strengths replace unbounded late-unlock base multipliers. Assess exact
  curve against user state, early game and equal-investment later rosters.
- Same current passive DPS on Rift and Wisp cards; base DPS/Support and ability
  per-cast damage labeled separately. Keep raw Power available in details.
- Ascend first requires clear15; afterward clear at least rewarded benchmark+1.
  Same/lower-depth preview gives0 and cannot reset or earn anything. Existing
  Prism formula and bought multipliers remain for eligible new records.
- Retire Auto-Ascend shop/UI/actions/live/offline resets. Preserve earned
  history and refund100 Comets exactly once for owners using a durable receipt.
  New saves receive no refund; reload/import/recovery cannot pay twice.

These are gameplay implementation rules within the user's explicit scope,
not new workflow restrictions or approval stages. Prior fixed-repeat earning
requirements are superseded only where the user requested forward-only Ascend.

## Acceptance and next action

Focused independent math, real casts/deadlines/charge bypass tests; user's
progressed roster and equal-investment early/late rosters; exact DPS matching
and mobile layout/input; monotonic ascension gates including Farm return depth,
rollback and offline non-ascension; migration/refund/round trips/recovery;
unrelated progression/paid work preservation and existing relevant CI gates.
Review full diff and save first failures honestly. Required failures remain
open; never weaken gates or call self-review independent review.

17 November current checkpoint: draft [PR58](https://github.com/xariib/Lumenfall/pull/58),
branch feature/team-progression-work, worktree C:/lf-team. Main remains ba879406;
root historical checkout untouched. Product SHA256
081f82c0d62a4c679f94fd512db423737489a0e394438e92113bcd3853f1c502.
Detailed earlier checkpoints, failures and hash-bound receipts are preserved in
[QA history](../qa/team-progression-001/README.md).

Candidate implements six-second initial Support recast with unchanged90-day
earliest sustained per-source work; shared direct-damage growth with original
Gale/Thorn resource economy; matching passive DPS and separate base/Support/
ability readouts; manual higher-record resets and once-only100-Comet owner
refund. Supplied save retains all balances, paid work/boosts, roster, history and
recovery;20 Comets becomes120 once. No real player save/app was modified.
Supplied passive shares: Ember44%,Stone31%,Tide15%,Gale10%. Equal development
gives Titan about25% of a legal five-member party and20% with six. These are
tested configurations, not universal share caps; actual new paid Titan recruit
is positive but below1% of the supplied developed roster.

Current product verification:1,228 feature checks/seven causal controls;
26,844 Wisp affordability checks/12 profiles/two controls;6,228 all-resource
price checks/12 profiles/four controls; all17 exact main-workflow refund
controls. Actual V8 6.0 reward/save checks3,277 and other recorded legacy lanes
pass. Four independent8h one-second windows have722/618/1161/678 kills with
zero automatic Ascends/Prisms. Native offline UI variants retain complete
cold/resume/cancel/restart/failure/retry/daily rollover checks with normal close.
One-hour Farm parity:2 retries,237 purchases,116 kills,0 Ascends; exact
reference/split plus three causal controls, including duplicate transaction
whole-state rollback. Paid Lab milestones244/five controls PASS.

Previous main CI1320 stopped on obsolete0-times automatic recap copy; updated
assertions require actual8h resource recap and absence of Auto Ascend. Both
native variants PASS. Main CI485d4dcc/43999092361 then passed startup UI,
tooling and all endless numerical commands but failed its last mobile command:
the fixture changed ownership while retaining an incompatible no-owner refund
receipt. Production validator correctly rejected it. Corrected paid-owner
fixture now passes889 checks/72 cases/12 profiles. Quest focus/notification
checks1,225/12 profiles PASS. All seven specialist workflows at485d4dcc PASS.
First failures and browser startup/teardown failures remain honestly retained.

Historical trillion-reset and14,400-ledger-normalization stress retains explicit
test-only old-policy operands/readiness, never acceptance of current automatic
gameplay. Mandatory current manual/clock/save/Support checks run unmodified
production. No workflows, deadlines, original numeric tolerances or gates waived.

Signed candidate build43999391752, publication disabled, PASS: established
package/certificate, both-save upgrade, paid progression,100-Comet refund,
actual updater install, normal retail Android12 launch and exact bundled assets.
Candidate0.2.129 SHA256
2967f5adcdf9464998ea6f83d73904405e559d39cb4f923d5f245424e085cc9c.
Native installed Wisp screenshot visually inspected: clear current/base DPS and
Support lines. This candidate is not public/integrated delivery. Self-review
only; physical-phone, exact WebView60 DOM,TalkBack and human pacing unobserved.

Next: push current test-only fixture correction, obtain all eight current PR
workflow gates, review final diff and merge exact checked head serially. Dispatch
nine existing integrated-main workflows. Build/publish a new signed APK from
that main SHA, verify actual native receipts and anonymous public APK/assets/feed,
then save final status/evidence in GitHub. Keep owner chat open for unobserved
human/device acceptance; no archive/completion claim before delivery.
