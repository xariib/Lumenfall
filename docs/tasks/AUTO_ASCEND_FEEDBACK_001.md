# AUTO_ASCEND_FEEDBACK_001 — readable rapid Ascend rewards

Status: in progress. Baseline: main `cc03df4972808666436eb0386515d20e88d04255`.
Branch: `fix/auto-ascend-feedback-001`. Owner: this feature chat.

## Requirement and verified scope

27 October 2026: the player supplied videos showing Rift32 → Rift551 in about
two seconds after Push, and rapid Auto Ascend repeatedly interrupting its Prism
message. Initially requested analysis only, then authorized implementation after
[PR #15](https://github.com/xariib/Lumenfall/pull/15) integrated. Skip already
fixed work. Preserve existing saves, purchased work, automation and earnings.

[Pacing](PROGRESSION_PACING_001.md) already changes Masterwork to additive,
Rift-gated Power, limits passive Farm and Gale/Thorn resource inputs, and preserves
manual Farm intent. Do not duplicate or retune those changes. Legacy wealth and
levels are intentionally retained, so rapid return through early Rifts alone
does not establish another combat defect. Check actual current-code transactions.

Remaining verified defect: `showAscendFlash` destroys/recreates the notification
on every event, restarting its 480ms blurred entry; `tick` displays only the last
gain even when multiple Ascends committed. Presentation must observe all committed
gains, including compressed `ascendGainRuns`, without modifying simulation.

## Acceptance and implementation direction

- One stable compact Auto Ascend summary above navigation; combine rapid events
  and update totals at most once per second without restarting an animation.
- Show complete committed Prism gains and Ascension counts; compressed batches
  must not expand into per-run UI work. Keep currency arithmetic through Amount.
- Retain readable manual Ascend feedback; rapid automatic events cannot replace
  it before its reading interval ends. Respect reduced motion.
- No stale live feedback after backgrounding, reset or backup restore. Offline
  earnings continue to use the offline recap; do not replay notifications.
- Preserve all gameplay/save code, reward rules, PR15 balance and purchases.
  Compare actual old/new Push/Auto Ascend endpoints and exact payouts, failed
  persistence, and live/offline chronology with paid work.
- Add causal tests for animation restart and last-gain-only defects; run required
  CI gates and renew the independent offline reference binding without changing
  historical expected outcomes. Review complete diff before PR/integration.

Sources: [rules](../../AGENTS.md), [workflow](../project/FEATURE_WORKFLOW.md),
[checks](../project/CODEX_START.md), [current status](../PROJECT_STATE.md),
root `index.html`, `tests/behavioral/forge-expansion-harness.cjs` and
`tests/behavioral/generate-offline-swift-golden.cjs`.

## Checkpoint

PR15 merged at `96af28bd`; main adds its evidence-only follow-up `cc03df49`.
Open PR2 is an unrelated documentation audit; no overlapping open product PR
was found. Android build is manual and publication defaults false. No APK release
is requested in this task. App/device/human pacing acceptance remains separate.

Implemented: one stationary auto summary above navigation, exact gain/count
aggregation from literal and compressed committed receipts, one-second text
coalescing and three-second inactivity cleanup. Manual feedback has 2.5 seconds
to read before leaving; automatic receipts wait until it closes. Reduced motion
removes entry/exit animations. Background/reset/restore clear pending UI work.

[Local evidence](../qa/auto-ascend-feedback-001/local.json): 78 feedback checks,
including four causal controls; 221 PR15 pacing checks; Farm recap controls;
1,036 live/offline checks; tooling and source/context validation PASS.
Independent one-second offline windows retain all four original kill/Ascend/
Prism counts AND endpoint hashes; only their current source binding changes.
[Baseline endpoints](../qa/auto-ascend-feedback-001/baseline.json) were measured
from the exact PR15 source before comparison; every complete saved endpoint is
unchanged, including failed paid Ascend and both-slot reloads.

The maximum-investment synthetic Auto Ascend fixture still produces extreme
throughput. That is a preservation stress case, not an earned-fund campaign or
the player's supplied save. PR15 deliberately retains bought levels and old
wealth; this presentation correction adds no gameplay cap, delay, payout change
or wealth clawback. Do not claim old saves now follow fresh-account pacing.
No separate Push calculation/payout duplication defect was established. The
fresh-account campaign and remaining human pacing limits stay with PR15.

Local Node24.22.1 checks pass. Browser156 was extracted after system package
installation failed, but its application process cannot start because UNIX
sockets are denied. No product test ran in that browser. CI pins Node24.19.0;
the new native-browser check covers 320/390/430px, normal/double text, both
motion preferences, real timers, full committed live tick and actual background.

[PR #16](https://github.com/xariib/Lumenfall/pull/16) opened at `8edab0ed`.
Its first native browser check PASS: 94 checks/12 profiles in Chrome155,
including actual live-tick gain/count equality and background cleanup. Pre-merge
run `40536744321` then failed at the existing extracted `startup-order.cjs`
fixture: its sandbox did not supply the new presentation cleanup dependency.
Add that external dependency to the isolated fixture and assert one background
cleanup; retain every original startup assertion. No product change is needed.

Fixture correction `57736e19` passes the full startup/input check; its native
Auto Ascend profiles and complete isolated offline job also pass. The full job
then stopped before Farm browser acceptance: shared startup plus the unchanged
RIFT_HINT_READABILITY_002 task is 32,995 bytes, above its existing 32,768 limit.
This is reproducible on PR15's evidence-only main `cc03df49` as well. Compact the
historical MIDGAME_FARM_ACCEPT status paragraph, retaining full evidence in its
linked task and preserving the budget gate. Validate every task named by CI.

[Budget receipt](../qa/auto-ascend-feedback-001/context-budget.json): all 20 CI
task entrypoints now PASS; the former 32,995-byte entrypoint is 32,020 bytes.
The [normal](../qa/auto-ascend-feedback-001/auto-normal.png) and
[large-text/reduced-motion](../qa/auto-ascend-feedback-001/auto-large.png)
screenshots were inspected from the initial browser run; the product hash is
unchanged by both follow-up corrections. Background/restore cleanup is covered
by the current browser/source checks; phone acceptance remains unverified.

Next: publish that documentation correction, finish all seven CI workflows,
integrate serially and save exact-source receipts. No independent review exists.
