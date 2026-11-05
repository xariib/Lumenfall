# Windows Wisp scroll assertion

Request: fix the intermittent Windows assertion left open by the
[5 November debug run](../perfect-debug-20261105/README.md).
[Task](../../tasks/WINDOWS_WISP_SCROLL_001.md),
[PR41](https://github.com/xariib/Lumenfall/pull/41).
Tested head: ff79015171f4f79a6ab1032def5aa7786b35755a.
Baseline main: 6891b9cb4d61f6644a612a98d9d8153c465da57c.

The controlled reflow captured its baseline during the tab's 220ms panelIn
animation. Finishing that real animation between the before/after reads
reproduces the original check-4 failure: 433.8865px to 425.6719px. Stone focus
and the correct 90px scroll compensation remain intact. This is an observation
race in the test, not a demonstrated gameplay scroll defect.

The driver now waits for the entrance animation and stable painted geometry
before the baseline. Fixed sleeps after synchronous rendering/native input
use a browser frame barrier. The one-pixel assertions, 300ms setup limit,
90-second scenario deadline and every original input/payment/save check remain.
Success and failure receipts now include controlled-reflow geometry.

The original focus mutation had become inert because generic focus restoration
covered its indirect capture mutation; it now removes the actual Wisp focus
restoration call. No production source, mobile file, gameplay, save, balance or
asset changed. Product SHA-256 remains
1173423bdb0d899616bd3a77b4f3931d8bcde5f5b67d90209f27a1b01f2e65e4.

## Verification

- Windows Node24.19.0, Brave/Chromium156: complete original scenario passes
  **3277 checks**, 12 display profiles, in **77.743s / 90s**. Full receipt:
  [compressed raw JSON](windows-full.json.gz), [summary](local-validation.json).
- [Deterministic setup replay](setup-replay.json): all twelve profiles pass.
  Removing the wait or animation check fails the original position assertion
  at check4, with identical game bytes. Holding the animation for four frames
  also prevents unchanged initial geometry from being mistaken for completion.
- Anchor, focus and periodic-focus controls fail the intended assertions at
  checks4,5,7 respectively. [Exact failures](local-validation.json).
- [Windows and Linux CI](https://github.com/xariib/Lumenfall/actions/runs/41994218226)
  both pass the replay, both setup controls, all three production controls and
  complete scenario with the original 90-second deadline.
- Context, syntax and diff checks pass. Broader PR validation is pending.

Earlier concurrent Windows runs exceeded the unchanged 90-second deadline.
A diagnostic run before replacing sleeps completed all3277 checks in116s;
it is not accepted as a passing bounded scenario. The isolated final run above
is the accepted local result. No threshold was increased and no check removed.
Automated checks and self-review only. Modern browsers do not establish
physical Android, exact WebView60 or TalkBack acceptance. No APK required for
this test-only change.

## Temporary files

Native PowerShell scratch cleanup was rejected before execution with the exact
reason "blocked by policy"; no more specific reason was provided. No alternative
deletion route was attempted. Read-only audit verifies task provenance, no user
deliverables, no links/worktrees and no active browsers. Disposable roots remain:

```text
C:\Users\CustomCodings\Documents\ChatGPT\Lumenfall\windows-wisp-scroll-001\validation-evidence\windows-wisp-scroll-001\scratch
C:\Users\CustomCodings\Documents\ChatGPT\Lumenfall\windows-wisp-scroll-001\validation-evidence\windows-wisp-scroll-001\web
```

The rejected action targeted scratch; web is the separately owned staged app
copy. Raw diagnostics and the cleanup audit remain outside those roots under
validation-evidence/windows-wisp-scroll-001/. No cleanup success is claimed.
