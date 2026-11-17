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

Continuation after5a1b860e: main CI44001935592 attempt1 failed an actual Lab slot touch assertion after six profiles, despite identical product/test previously passing. Cause unproven. First receipt/logs preserved with attempt1 copy; unchanged full main retry attempt2 is running (job133770320549), isolated offline PASS. No deadlines/assertions/input handling changed. Local next-stage Guidance readability with original-width fault controls also PASS. Merge guard helper now pins5a1b860e; wait all eight current PR gates before using it.

Main CI44001935592 attempt2 passed the prior touch failure unchanged, then reached all positive clock suites and13/14 causal controls. The Farm canonical-clock fix made the captured old fallback-owner defect unreachable. The historical transition variant now explicitly freezes its original Push-only clock operand as well as its original rate/Power operands; unmodified current clock remains in the other variant and mandatory actual manual/Farm suites. Original saved input and concrete Canonical timer deadline mismatch assertion retained. Positive pair and full14 controls PASS. Compact Wisp UI43,290/18 profiles and independent funding3,360 cases PASS. No production code or workflow changed; next complete PR/integrated gates and publish from main.

Latest pushed head:ed3e03f07efa19472aa2a5c59acad60cdceb72b8; main PR workflow44005927188. The fourteen-control repair is test-only; actual product remains081f82c0. Merge helper is updated to this exact head and all eight PR gates remain required. All earlier failures, including5a1 main attempts1/2 and Forge startup attempt1 plus its unchanged passing retry, are committed. Candidate Android129 remains verified but unpublished; integrated/public delivery still pending.

Current ed3 PR main44005927188 attempt1 failed CDP Input.dispatchTouchEvent after four passing boost profiles; raw attempt1 evidence preserved. Local unchanged exact boost test then PASS993/18 profiles. Unchanged remote attempt2 runs as job133786234808; isolated offline PASS. All seven specialist workflows currently PASS (permanent startup timeout retained with unchanged passing retry). No product/input/deadline changes made for protocol failures.

Remaining main negative sweep:22 scenarios all exit nonzero; preserve distinction between causal reports and transport/setup failures. One pre-existing stale identity-value mutation anchor was confirmed on baselineba879406: Formation now also includes Battle Tempering. Updated only that negative mutation to remove the intended completed Lab factor while retaining Battle Tempering (older source fallback retained). It now emits valid QA FAIL at original exact old Formation factors assertion, zero runtime errors. Matching actual positive UI PASS across320/390/430 at100/200% text. No product/workflow changed. Diagnostic setup failure and repaired pair retained.

Two remote boost-queue runs stopped at CDP Input.dispatchTouchEvent on the first touch of a new profile, after4 or16 passing profiles. Original raw failures are preserved; game cause unproven. Lab native client now awaits Runtime.enable and DOM.enable before gestures, matching existing CODEX_START setup guidance. This changes test-client initialization only: same native input,15s protocol deadline, assertions/profiles and product. Local positive993/18 and next-lock control fail at original intended assertion with normal teardown. Required remote full gate remains open until passing.

Final source review found that deleting the retired Auto-Ascend advice branch accidentally attached Farm return guidance to the preceding Lab conditional. Restored its independent condition; Farm cannot earn a new Prism record, while Sigil farming remains useful. Focused guidance191 checks/two controls and actual feature1,228 checks/seven controls PASS. Product SHA256 is now3f9123285f3377740e3017246fa7b0a5f8cbad60cabc9e477be9c9aefdeffa80. Prior candidate129 remains evidence for its081f source only; final signed main build must contain the new source. All specialist6040 workflows passed, including Wisp on both OS; full main/shared were still running before this necessary fix. Older Linux Wisp negative anchor setup timed out before its first reflow; focus/periodic controls reached original assertions. Raw reports retained, original300ms ceiling unchanged. Next: push fix, require all current PR/integrated gates, publish and verify signed main APK.
