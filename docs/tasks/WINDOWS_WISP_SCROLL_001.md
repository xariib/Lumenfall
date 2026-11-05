# Windows Wisp scroll assertion

Request (5 November 2026): fix the intermittent Windows Wisp-scroll assertion
left open by [perfect debug](PERFECT_DEBUG_20261105.md), preserving gameplay.
Owner: this task, single agent. Scope: reproduce, repair the responsible test
or production code, retain scroll/focus/payment assertions and causal controls,
validate and integrate. No Android release for a test-only fix.

Baseline: main 6891b9cb; isolated branch fix/windows-wisp-scroll-001 and matching
worktree. Product SHA-256:
1173423bdb0d899616bd3a77b4f3931d8bcde5f5b67d90209f27a1b01f2e65e4.
Original failure: wisp-rarity-scroll, check 4, "periodic reflow keeps focused
action screen position". Three role-only reruns passed; full reruns exceeded
the unchanged 90-second limit. See [original evidence](../qa/perfect-debug-20261105/README.md).

Acceptance: capture the failure's geometry/cause; focused Windows reproduction
and regression pass across all twelve profiles; complete Wisp scenario passes
the existing deadline; causal anchor/focus/periodic mutations still fail for
their intended assertions; relevant CI passes and changes integrate into main.
Preserve original one-pixel tolerances, input/save/payment checks and game bytes.

Status: fix implemented; final CI pending. Node 24.19.0 and installed Brave on Windows; raw evidence
under validation-evidence/windows-wisp-scroll-001/. Disposable scratch roots
stay beneath its owned scratch directory and are cleaned after browser exit.
Modern browser checks do not establish physical Android/WebView60/TalkBack.

Cause: the first controlled reflow sampled the tab's panelIn animation at
different frames. Pausing at frame zero and finishing between reads reproduces
check 4: 433.8865px to 425.6719px, despite correct 90px scroll compensation and
Stone focus. Wait for the animation and stable painted geometry before setup
measurements; retain the existing 300ms setup and 90s scenario deadlines.

Changes: wisp-rarity-scroll.cjs waits before the controlled reflow and records
geometry on success/failure. Fixed input/render sleeps use a browser paint
barrier. The old focus mutation became inert after generic focus preservation;
it now removes the actual Wisp focus-restoration call. New setup-race regression
replays the real CSS animation, with removed-wait and removed-animation-check
controls. A Windows/Linux workflow retains the complete original scenario and
all three production scroll/focus controls. No product file changes.

Checks: source/context/syntax/diff pass. Race replay passes all twelve profiles;
removing the wait or animation check fails the original assertion. Anchor,
repaired focus and periodic controls fail the intended checks 4, 5, 7. Complete
isolated Windows run passes 3,277 checks in 77.743s under the original 90s deadline.
Dedicated Windows/Linux CI passes full scenario and all five controls at
ff790151. [Evidence](../qa/windows-wisp-scroll-001/README.md),
[PR41](https://github.com/xariib/Lumenfall/pull/41). Seven of eight workflows pass;
only pre-merge run 41994218460/job 127133377007 remains in progress. The isolated
offline job passes. Tree's first attempt produced no QA result within its
unchanged 25s browser deadline; the identical-source failed-job retry passes.
Automated PR review completed with no findings. Evidence checkpoint branch:
docs/windows-wisp-scroll-evidence; code remains ff790151, test merge eb9698e6,
tree 1c428da02165dd95d4972597082dc9f3d7ae1dc1. Main remains 6891b9cb.

Temporary scratch cleanup was rejected before execution: "blocked by policy",
without a more specific reason. No alternate deletion route attempted. Exact
remaining scratch and web-staging paths and provenance are in the evidence.

Next: finish broader CI, integrate PR41, verify integrated tree and save final
status. No APK or gameplay change. Review [workflow](../project/FEATURE_WORKFLOW.md).
