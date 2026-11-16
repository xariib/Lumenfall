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

17 November checkpoint: product implementation and focused migration/behavior
suite PASS1,144 checks/seven causal controls. Supplied save was transcribed into
`tests/behavioral/fixtures/team-progression-user-save.json` (not loaded into any
real player app). All protected supplied fields, work, boosts and clocks retained;
100-Comet refund is idempotent, including wide balances and corrupt-primary recovery.
Rift/Wisp DPS sums actual contextual passive damage; supplied shares are
Ember44%, Stone31%, Tide15%, Gale10%. Equal developed Titan stays below20%.
Required Support entrypoint PASS1,958 plus paid research checks/controls; required
power entrypoint also runs the new full feature tests. Existing mobile contribution
checks plus new feature cases PASS455 across12 original +12 new profiles:
320/390/430px,100/200% text,both motion modes, six-Wisp fit, touch/keyboard,
same displayed DPS, details purity/focus/scroll, real manual Ascend and refund
reload. Screenshots visually inspected. Browser Chrome157.0.8103.79 via Brave.

First broader run retained under QA/regressions. Intentional-policy expectation
failures remain in legacy Auto-Ascend/repeat/refund/scaling suites. Most unrelated
core/paid Lab tests pass. Optional old `forge-lab-caps.cjs` also expects pre-PR42
caps and catalog (baseline verification required before calling it a new failure).
No gate is waived. Newly exposed HUD calibration defect: normalized reference
cycles miss saved-epoch rounding at Relay/natural-fill ties (about0.6% first-Wisp
rate error). Fixed reference to physical seconds and stored epoch precision;
more precise sample4096 cycles for different Support/natural cycles. The actual
cast-rate tolerance remains unchanged. Final calibration rerun is active.

Changed so far: root product, Support/current-power/calibration/mobile tests,
new feature tests and user fixture, task/QA. No workflows, native/signing,
branding/fonts or historical originals edited. Main remainsba879406; no PR/build
or release has been created yet. New main integration must recheck overlap.

Next: finish calibration and update affected
current expectations explicitly, retain historical fixtures unchanged. Then
validate PR/integrated main, build/publish signed APK and verify native/public
assets. Physical phone, exact WebView60 DOM, TalkBack and human pacing require
observed acceptance and remain unverified until then. No archiving while open.
