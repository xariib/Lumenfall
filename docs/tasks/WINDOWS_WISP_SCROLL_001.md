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

Status: fix implemented; validation in progress. Node 24.19.0 and installed Brave on Windows; raw evidence
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

Checks so far: source/context/syntax/diff checks pass. Race replay passes all
twelve profiles; removing the setup wait fails the original assertion. Anchor,
repaired focus and periodic controls fail their intended position/focus checks.
The pre-optimization diagnostic completes 3277 checks in 116s; this exceeds the
unchanged runner deadline and is not accepted as a full scenario pass.

Next: finish the complete Windows scenario with paint barriers, verify both
setup controls, save receipts, review/integrate through CI. Review
[workflow](../project/FEATURE_WORKFLOW.md).
