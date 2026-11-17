# TEAM_PROGRESSION_001 — meaningful Wisp investment and manual progression

Status: integrated and publicly released; human/device acceptance open. Owner: this feature chat, 16 November 2026. No agents,
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

Pre-existing separate finding: the unchanged Modules & Ultimates encyclopedia
duration sentence still quotes old1s/1.5s. Current Wisp/Lab descriptions and
runtime use3s–6s. [Recorded help-copy follow-up](SUPPORT_HELP_COPY_001.md);
this feature does not claim a complete legacy-help audit.

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

17 November delivery checkpoint: [PR58](https://github.com/xariib/Lumenfall/pull/58) integrated as
`52fae53d5c9615e92e65acd99e34aa8eacb6c2e1`; checked feature head`0f56d555b7114013d0fa1a8e54a1c0a3093168d7`.
Public [Android 0.2.130](https://github.com/xariib/Lumenfall/releases/tag/android-1000130), code1000130,
[APK](https://github.com/xariib/Lumenfall/releases/download/android-1000130/Lumenfall.apk).
APK SHA256:`ef7572b5f94d8547a25ced5c2a5b806b26f7c016ad64874660d956130e346033`.
Final product SHA256:
3f9123285f3377740e3017246fa7b0a5f8cbad60cabc9e477be9c9aefdeffa80.

Eight exact-head PR gates and nine exact integrated-main workflows PASS.
Full main/isolated coverage is retained in [delivery receipt](../qa/team-progression-001/delivery.json)
and source-bound raw logs. Final-source focused checks:1,228 feature/seven
controls;30,466 offline partition;3,319 Support/paid research;191 guidance/two
controls; actual V8 6.0 Comet/permanent1,267. Original failures and unchanged
passing retries remain saved. No workflow, deadline, numeric tolerance or
acceptance gate was weakened. Full diff self-reviewed; no independent review.

Released: manual strictly higher-record Ascension, Auto-Ascend removed and
100-Comet owner refund once; shared direct-damage growth with original utility
resource economy; matching current DPS with separate base/Support/ability
readouts; initial3s Support/6s recast. Paid Endurance remains earliest90-day
per-source sustained uptime at continuous8x/all reductions. Supplied save
keeps balances, paid work/boosts, roster and history;20→120 Comets once.
Supplied passive shares44/31/15/10% Ember/Stone/Tide/Gale; equal-development
Titan about25% of five/20% of six. These are tested rosters, not universal caps.

Signed build[44048063909](https://github.com/xariib/Lumenfall/actions/runs/44048063909) PASS: established
com.lumenfall.app/signing certificate, both-save upgrade, paid work, refund100,
actual updater system installation, normal retail Android12 launch and exact
bundled assets. Anonymous versioned/latest APK bytes, release feed and public
metadata match. Installed Wisp/normal-launch screenshots visually self-reviewed
PASS: matching DPS/base/Support lines and visible game/navigation.
[Public/native evidence](../qa/team-progression-001/android-release/public-verification.json).
No actual player save/app was modified. Candidate129 remains earlier evidence.

Status: integrated and publicly released; human/device acceptance remains open.
Physical phone, exact WebView60 DOM, TalkBack and human pacing unobserved;
self-review only. Owner chat/task remains open and unarchived. Next concrete
action: observe the player's normal signed update and assess the revised
damage presentation and long-term pacing on their device. No permission
prompts, new chats, subagents or message tools used.
