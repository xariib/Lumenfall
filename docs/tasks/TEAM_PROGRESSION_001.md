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

17 November checkpoint: current draft [PR58](https://github.com/xariib/Lumenfall/pull/58),
branch feature/team-progression-work at C:/lf-team; main remains ba879406.
Pushed checkpoints e32656df and51966f91. No other feature edits or agents used.
Supplied save is transcribed into tests/behavioral/fixtures/team-progression-user-save.json;
no real player app/save was touched. All balances/work/history retained, including
an idempotent100-Comet retirement refund (20→120 for the supplied save).

Focused feature suite passes1,144+ checks/seven controls. Required Support and
paid90-day work checks pass; Forge9,404/25 controls, Tree5,811/28, Lab2,841/ten,
Comet12,884 and Prism state checks pass at their recorded candidate hashes.
Mobile467 checks includes twelve new profiles320/390/430px,100/200% text,both
motion settings, actual input, six-Wisp fit and stable disclosure/focus/scroll.
Screenshots inspected. Browser Brave/Chrome157.0.8103.79; Node24.22.1. Actual
Node8.3/V8 6.0 Forge, Lab, Tree, Comet and permanent-progression checks pass locally.
Self/automated verification only. [All exact receipts/first failures](../qa/team-progression-001/README.md).

Announced scope correction: shared growth is direct damage only. Gale/Thorn
resource abilities keep their original curve and upgrade factors, preserving
existing Lumen/Shard pacing and Workshop budgets. Independent resource oracle
and Workshop pacing pass. Current passive shares: Ember44%,Stone31%,Tide15%,Gale10%;
equal developed Titan below20%. No dynamic share cap or paid-upgrade removal.

Long-window checks exposed dropped automation clock across Push/Farm/Push.
Keep exact timers through Farm; new full8h whole/one-second/cold60s gate proves
3 retreats,3 retries,722 kills,28,800 taps andzero automatic Ascends/Prisms.
HUD stored-epoch sampling correction passes3,134 checks/eight causal controls
with original accuracy bounds. One native-epoch-quantum Support charge-bar
saturation is normalized only at returned endpoints while recast still blocks;
no cast deadline or combat event moves. Broader final-source reruns remain open.

First PR CI failures and raw/hash-bound logs are retained. Updating obsolete
Auto-Ascend/repeat/catalog assertions to manual gates and paid transactions.
No workflow gates waived/deleted. Retired trillion-reset arithmetic stress tests
retain original entry conditions through an explicitly historical-only adapter
and immutable released-policy gzip; actual manual game is separately mandatory.
Archives and original receipts remain unchanged. Optional pre-PR42 cap script
is an older expectation, not a demonstrated new regression. Full regression and
browser drivers still need current-source acceptance; do not merge on partial PASS.

Next: finish long-window/frozen comparisons and all required PR CI gates,
review complete diff, integrate serially, rerun integrated gates, build signed
APK and verify save upgrade/updater/retail/public assets. Phone, exact WebView60
DOM, TalkBack and human pacing remain unobserved. Keep feature/chat open;
no archive or completion claim before delivery/required observed acceptance.

Next checkpoint: f1820c2e pushed. Product source6773532a passes remote Forge,
Lab (both jobs), Comet, Wisp scroll (Linux/Windows) and isolated offline1/191.
Main stops on obsolete stationary-shop Auto-Ascend lookup; Tree stops on sampled
repeat eligibility and repeat-ROI assumptions; shared standalone stops on old
Encyclopedia wording; permanent lane had an initial Browser.getVersion timeout.
All first failures/raw logs retained. Local unmodified191-case runner is now
using the existing CDP-pipe option (dump-dom stalls on this Windows executor).
It exposes obsolete Auto/Comet/Prism scenarios and one real new layout defect.

Current continuation: replace obsolete assertions with manual/new-record
transactions; keep native input, actual reload/recovery/visibility, negative
controls and complete paid-state comparison. New contract88 checks and native
touch/keyboard scenarios pass; cold-resume mismatch was object-key order only,
so structural comparison retains all fields/array order/numbers exactly.
Tree economy14,078/six controls, numerical Prisms341,654/seven controls and
actual V8 6.0 reward/save3,277 checks pass on source6773532a. Retired numerical
cycle suites all pass with unchanged frozen transcripts. Comet unlocks12 cases
now retain pending Trials through offline work and require explicit manual
record choices; full feature retirement suite replaces obsolete unlock gates.

Actual layout regression: base-DPS/Support caption could wrap at changing
values and shift Empower. Sourcea4dc5c83 puts these on separate stable lines;
all12 original card-layout profiles passed their assertions, but that local
attempt failed browser teardown. Keep its receipt as failure, rerun unchanged.
Update Android upgrade checks for the additional exact100-Comet receipt.
The HP11 natural numerical witness now explicitly pins only its historical
Power operand; original huge quotient cases/controls stay unchanged. Current
unmodified shared damage and actual Farm throughput have mandatory coverage.

Next concrete action: finish full-run findings, rerun changed scenarios and
original layout gate, push coherent test/evidence checkpoint, obtain all required
PR and integrated-main gates, then signed Android/native/public delivery.
