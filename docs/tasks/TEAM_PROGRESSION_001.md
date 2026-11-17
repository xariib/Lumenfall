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

17 November continuation: draft [PR58](https://github.com/xariib/Lumenfall/pull/58),
branch feature/team-progression-work, worktree C:/lf-team. Pushed e32656df,
51966f91,f1820c2e,ae14bfd7. Main remains ba879406; root historical checkout untouched.
All exact earlier milestones and initial failures are retained in
[QA history](../qa/team-progression-001/README.md), including hash-bound CI logs.

Implementation is complete as a candidate:6s initial Support recast with unchanged
90-day earliest sustained per-source work; shared direct-damage growth; original
utility currency curve; matching passive DPS and separate base/Support/ability
readouts; manual higher-record resets and once-only100-Comet owner refund.
Supplied save fixture preserves balances, work, boosts, roster, levels, history
and recovery;20 Comets becomes120 once. No real player save/app was modified.
Current supplied shares are Ember44%,Stone31%,Tide15%,Gale10%. Equal development
gives Titan about25% in a legal five-member party and20% with six. The earlier
below20% figure compares all eight owned Wisps. These are explicit tested
configurations, not universal share caps. Actual future recruitment/fielding
also leaves the new Titan below1% of the supplied developed roster's damage.

Sourcea4dc5c83 atae14bfd7 passed remote Forge,Tree,Lab (both jobs),Comet,
permanent progression,Wisp scroll (Linux/Windows),shared UI and isolated offline.
Main CI stopped at a stale Auto-Ascend card reference in Workshop clarity; this
is now changed to an available permanent investment. No workflow gates weakened.
Other obsolete repeat/automatic/shop tests now assert manual records, no automatic
payments, original prices, rollback, paid work, exact timers and recovery. Dormant
trillion-reset math retains original operands through an explicitly historical
adapter and immutable released-policy gzip; actual manual game stays mandatory.

Current source081f82c0 adds legacy word-wrap fallback to the two new damage
styles. Node24.22.1 focused suite passes1,170/seven controls. Tree economy14,078/
six controls, numerical Prisms341,654/seven controls and actual V8 6.0 reward/save
3,277 checks pass at their recorded hashes; previous full Node8.3(V8 6.0) lanes
also pass remotely. Offline12h migration/transaction suite passes34 records.
Four independently generated8h one-second windows have722/618/1161/678 kills,
zero Ascends/Prisms. Their complete-state hashes are unchanged by the CSS-only
fallback and bound to current source in offline-swift-current-golden.json.

The new caption originally wrapped and shifted Empower; separate stable base
and Support lines fix the unchanged original12-profile assertions. Those body
assertions passed locally and in the main CI step; one local run failed graceful
browser teardown, retained as failure. New native manual touch/keyboard and88
contract checks pass. Cold-resume structural comparison now ignores object-key
order only, preserving all fields, array order and exact numbers. Natural HP11
quotient witnesses pin only their historical Power operand; current unmodified
damage and actual Farm throughput have separate mandatory coverage.

Local diagnostic main run stopped at80 emitted records due Windows profile
cleanup EPERM; this is not full190-case acceptance. Its initial failures/raw
artifacts are compressed with hashes. Existing CDP-pipe transport only; Linux
default CI remains authoritative. A remaining-scenarios diagnostic is running
under validation-evidence/remaining-browser. Targeted results/first transport
failures are retained, including a successful causal readiness retry. No source
or acceptance assumptions may be changed just to make a check pass.

Next: publish current compatibility/golden/obsolete-reference checkpoint, obtain
all required PR gates, finish discovered actual regressions, review complete diff,
integrate serially and rerun integrated gates. Then build/publish established signed
Android APK; verify save upgrade/updater/retail and anonymous public assets/feed.
Phone, exact WebView60 DOM,TalkBack and human pacing are unobserved; retain that
limitation and keep owner chat open. No archive/completion claim before delivery.

Current continuation: source remains081f82c0. Legal-party feature coverage now1,228/seven controls; funded Workshop clarity1,264/36 profiles and offline-policy UI PASS. Latest specialist gates all pass; premerge stopped on now-fixed funded Astral card. Browser save/control/formation tests now explicitly assert retirement/refunds and manual boundary resets. Local positive bodies with failed teardown remain failures. Next push this coherent checkpoint and obtain complete Linux CI before merging.

Remaining diagnostic completed116 scenarios with initial failures retained in compressed, hash-bound receipts. Corrected actual manual record fixture and paid owner receipt; final endgame currency utility and1h Farm parity PASS. Farm exercises2 retries,237 paid purchases,116 kills,zero Ascends, exact reference/split and three causal controls; duplicate transaction is rejected with whole-state rollback. Wisp resource reward oracle uses independent original130/680 base curves, separated from new damage. Manual timer/cadence, partial reconstruction, actual keyboard controls and backup restore bodies pass; some Windows browser-close failures remain failures. Product unchanged081f82c0.
