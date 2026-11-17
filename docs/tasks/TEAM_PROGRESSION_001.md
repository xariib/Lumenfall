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

17 November checkpoint: draft [PR58](https://github.com/xariib/Lumenfall/pull/58),
feature head c89be93158196e911a6f5839da053d47499190f9, worktree C:/lf-team.
Main remains ba879406. Root historical checkout untouched; no overlapping PRs.
Final product SHA256:
3f9123285f3377740e3017246fa7b0a5f8cbad60cabc9e477be9c9aefdeffa80.
Earlier checkpoints are preserved verbatim in [QA history](../qa/team-progression-001/README.md).

Implemented: six-second initial Support recast, unchanged paid90-day earliest
sustained per-source work; shared direct-damage growth with original Gale/Thorn
resource economy; matching current DPS and separate base/Support/ability
readouts; manual higher-record resets and once-only100-Comet owner refund.
The final review also restored independent Farm-to-Push guidance after removing
the retired Auto-Ascend advice branch. Sigil farming remains available.

Final-source checks: feature1,228/seven controls; full8h partition30,466;
Support/paid research3,319; guidance191/two controls; actual V8 6.0 Comet and
permanent vectors1,267. Earlier numerical/mobile/affordability receipts retain
their exact hashes. Supplied save keeps paid work, balances and roster, with
20→120 Comets once. Passive shares44/31/15/10% Ember/Stone/Tide/Gale.
Equal development Titan approximately25% of five,20% of six; these are tested
configurations, not universal share caps. No actual player save/app modified.

Current full PR and eight workflow gates are running. Isolated offline PASS.
First failures remain saved; unchanged failed-job retries retain deadlines,
assertions and causal controls. Wisp Linux startup Browser.getVersion timeout
then unchanged retry PASS; Lab touch protocol timeout after seven profiles
requires its unchanged retry result. No infrastructure root cause is claimed.

Continuation: all seven specialist workflows now PASS, including both unchanged
failed-job retries. Full main reached the independent offline source-binding
gate and correctly rejected the earlier081f hash after the guidance-only edit.
Canonical one-second replay regenerated all four windows against3f91; every
complete saved-state hash and all rewards exactly match the prior reference.
Only its sourceSha256 line changes. Full current-head gate remains required.

Signed candidate0.2.129/build43999391752 passed both-save upgrade, paid work,
100-Comet refund, updater install, retail Android12 launch and assets. It
contains earlier081f source and is unpublished; final delivery requires a new
signed build from validated integrated main. Established package/cert retained.

Next: finish all eight current PR gates, merge exact checked c89 head after
self-review, dispatch nine exact integrated-main workflows, publish signed APK,
verify native receipts and anonymous public bytes/assets/feed, and save final
status/evidence in GitHub. Keep task/chat open: physical phone, exact WebView60
DOM, TalkBack, independent review and human pacing remain unobserved. Do not
claim archive or human acceptance. No permission prompts, agents or new chats.
