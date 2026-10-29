# Earned Lab expansion challenges

Continuation of [long-term Lab pacing](LAB_LONG_DURATION_001.md), same owner,
branch and [PR23](https://github.com/xariib/Lumenfall/pull/23). No delegation.

## User correction

"Lab til extra slot skal ikke være noget der bare kan opnås med hurtige 2
levels, der skal være nogle udfordringer indtil man kan unlock flere lab slots."

Extra slots must require substantial progression rather than two quick levels.
This supersedes the earlier exception keeping Expanded Apparatus short.

## Concrete policy

Base slots still unlock through Rift1/15/60. The two expansions are separate,
progressively harder challenges; their combined conditions cannot be bought
with a rich wallet or bypassed by8x speed:

| Expansion | Rift record | Ascends | Completed Lab levels | Different studies | Nominal research |
| --- | ---: | ---: | ---: | ---: | ---: |
| I (fourth slot) |150|25|60|6|15days|
| II (fifth slot) |300|100|150|10|100days|

All four milestones are required before a new rank starts. Count completed
levels in current research excluding Apparatus and retired identities. The
earned work reductions and existing1.5–8x boosts still apply; even the theoretical
maximum reductions leave at least25.2h /7days per expansion at8x. A new player
has fewer free slots during expansion, making actual earliest work slower.

Show current/required progress on the research card and locked slots. Refresh
eligibility as milestones are earned. Queue cannot bypass requirements or pay
before eligibility. Keep the five-slot cap and existing prices.

Preserve already-earned slots and paid active/paused Apparatus work, including
its old timer and speed. Already-paid work can finish/resume without new goals;
its next unpaid rank needs the new challenge. No new save fields or reset.

## Baseline and acceptance

Baseline candidate source5c1bd9c0, remote562e4f59: all seven required workflows
now PASS. Baseline slot contract54 and queue continuity64 PASS locally.
Main remainsd9a341e2; PR22 is separate and untouched. This work supersedes
timing acceptance for Apparatus, while preserving its paid-work contracts.

Verify each threshold independently, rich-wallet rejection, delayed slot grant,
queue and exact payment, minimum work at8x, live/offline/split agreement, reload,
backup/recovery/Ascend, old paid resume, and mobile/accessible progress states.
Keep existing checks and causal controls. Source changes require actually
regenerating the independent one-second source binding again.

## Implementation checkpoint

Source SHA256 `ba7acc19f7e5fd55236546d25dead7d84c461ddcda66ef65fc372f7e3adfaefb`.
Implemented in `index.html`: pure challenge quotes, gated manual/queued starts,
15/100-day rank work, visible in-place checklist/locked-slot progress. The
affordability refresh uses the selected slot, including replacement of paid work
in a full Lab. Earned slots and old paid active/paused receipts remain unchanged.

Repeated Ascend batching previously crossed the new counter goal without
starting the queue at its exact timestamp (0.549491s split discrepancy in the
reproducer). Cap batching before that unlock cycle; normal simulation then
resolves it. Both ranks now agree across live, split and offline windows. A
causal control removing this guard detects the original timing discrepancy.

New core238 assertions/five causal controls and mobile290 assertions/12 profiles
PASS. The four-window independent one-second oracle was actually regenerated;
all four endpoint hashes, kills, Ascends and Prisms match the preceding binding.
Only its source identity changes. [Evidence](../qa/lab-slot-challenges-001/README.md).

Status: local candidate; existing regressions and publication to PR23 in progress.
Next: finish focused checks, publish exact tree, inspect required CI and integrate
only after all gates pass. Android dispatch remains unavailable in this session;
no release is claimed. Physical phone/WebView60/TalkBack/human pacing remain open.
