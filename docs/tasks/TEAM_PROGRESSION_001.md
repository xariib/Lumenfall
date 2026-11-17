# TEAM_PROGRESSION_001 — meaningful Wisp investment and manual progression

Status: integrated; signed release and human/device acceptance pending. Owner: this feature chat, 16 November 2026. No agents,
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

17 November checkpoint: [PR58](https://github.com/xariib/Lumenfall/pull/58)
merged as`52fae53d5c9615e92e65acd99e34aa8eacb6c2e1`.
Checked feature head`0f56d555b7114013d0fa1a8e54a1c0a3093168d7`.
All eight exact-head PR workflows PASS. Main run44026327144 proves190 main
and1 isolated offline scenarios in the actual raw logs; merge guard verified
both counts. [Integration receipt](../qa/team-progression-001/integration.json).
Final product SHA256:
3f9123285f3377740e3017246fa7b0a5f8cbad60cabc9e477be9c9aefdeffa80.

All nine existing integrated-main workflows were dispatched at52fae53d and are
running. Main must remain at this exact source until signed publication/native/
anonymous public verification finish. This delivery/team-progression-001-evidence
branch saves continuation and evidence without changing the release source.
No product/test changes after the checked feature head; post-release integration
of the final delivery documents will be documentation only.

Eight of nine integrated workflows now PASS, including migration and both-OS
Wisp after its unchanged retry. Integrated main44034487772 attempt1 hit native
boost Input.dispatchTouchEvent after16 passing profiles, target opener at
(382,445.984375); original raw failure saved. Unchanged failed-job attempt2 is
running. Same52fa source; no deadline/assertion/gate changes. Build/publication
still blocked until the complete main190 + isolated1 acceptance is green.

Integrated main attempt2 passed the prior boost lane unchanged, then failed
new Wisp UI assertion "real touch opens damage details" at check269, after
the original12 profiles and initial matching-DPS checks. Artifact14307694021
failure/last observation/context images are preserved under remote/main-52fa-
attempt2-wisp with ZIP CRC/size verification. Original unchanged local replay
then PASS467, including all12 new Team profiles; cause remains unproven.
Unchanged integrated main attempt3 is running. No touch/assertion/product edit.

Implemented: six-second initial Support recast, unchanged paid90-day earliest
sustained per-source work; shared direct-damage growth with original Gale/Thorn
resource economy; matching current DPS and separate base/Support/ability
readouts; manual higher-record resets and once-only100-Comet owner refund.
Supplied save keeps balances, paid work/boosts, roster and history;20→120 Comets
once. Passive shares44/31/15/10% Ember/Stone/Tide/Gale. Equal-development Titan
approximately25% of five/20% of six; tested configurations, not universal caps.
No actual player save/app was modified.

Final-source focused checks: feature1,228/seven controls; full8h partition30,466;
Support/paid research3,319; guidance191/two controls; actual V8 6.0 Comet and
permanent vectors1,267. Canonical four8h windows preserve complete saved-state
hashes and722/618/1161/678 kills with zero automatic Ascends/Prisms. Native
Comet normal/reduced and offline normal/legacy pass with original assertions.
Older Ritual helper is explicit historical code only. Offline driver waits for
the prior return to finish before observing a new failure's intro callback.
Raw first failures and unchanged retries remain saved. Runtime/DOM and painted
coordinates did not eliminate every observed native protocol timeout; no root
cause claim. No workflow, deadline or numeric tolerance was waived.

Signed candidate0.2.129/build43999391752 passed save upgrade, refund100, actual
updater, retail Android12 launch and assets at earlier081f source; unpublished.
It is not final delivery. New signed main build/public verification still needed.
Self-review only; physical phone, exact WebView60 DOM, TalkBack and human pacing
unobserved. Task/chat remains open, unarchived.

Next: obtain all nine52fa integrated workflow passes, build/publish signed APK
with existing build-android publish:true, verify actual version/package/cert,
both saves/paid work/refund, updater/retail launch and anonymous APK/assets/feed.
Inspect final installed screenshots; save final Task/PROJECT_STATE/evidence to
GitHub with a docs-only commit after release. No permission prompts, agents,
message tools or new chats. Keep human/device acceptance explicitly open.
