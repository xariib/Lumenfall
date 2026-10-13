# FORMATION_COLLAPSE_001

13 October 2026. Scope: default Formation contribution to collapsed with a
clear accessible expand/collapse control. Preserve the current choice through
periodic/full renders and formation changes, and preserve all calculations.
Test both states, mobile widths, large text, keyboard and touch.

Baseline: clean `local/full-debug`, HEAD `9ad4b6f4d6e80416324152bd1c7ac22bd1465eb5`,
source SHA-256 `2fa400081743625d1f4cc6bda176ca299615950d38739d839098d6e12742764c`.
Latest accepted local Wisp checkpoint retained. Sequential ownership; no agents.
See [queue](LOCAL_IMPROVEMENTS_PLAN_001.md), [state](../PROJECT_STATE.md) and
[workflow](../project/FEATURE_WORKFLOW.md).

Status: locally implemented and verified; final/device acceptance pending.
Baseline browser reproduced the always-visible summary with no toggle.
Use session-only DOM disclosure state; no save-schema/cross-session persistence is requested.
Preserve report calculations, per-Wisp readouts, paid value and saved progress.

Acceptance: default collapsed; native keyboard/touch button with expanded state
and controlled panel; both choices and toggle focus survive renderAll,
renderWispRoles, tab changes and party changes; content stays current in both
states. Relevant source/core/browser checks pass; stage current source/fonts/
branding and show local preview; self-review and coherent local commit.

Known limitations: inherited full-suite/Prism deadline and Windows standard
dump-DOM transport issues, Android/WebView60/TalkBack/device acceptance remain
open. No remote, APK release, signing or archive action authorized here.
Implementation: stable native button, aria-expanded/aria-controls and hidden panel.
Only panel content is refreshed, preserving disclosure choice/focus. Calculations
still run and refresh while collapsed. No game-state fields or balance changes.
Existing expanded-readout mobile test now opens the panel; every assertion retained.
The new Formation scenario is registered in the existing full behavioral runner.

Final source SHA-256:
`0bf0505ff61cedb0dc014a62adaa849a780388e3e8c611715bd6697dd3c2c077`.
Files: index.html; tests/behavioral/formation-collapse.cjs, run.cjs,
scenarios.json, wisp-contribution-mobile.cjs; this task, project state, queue;
[source-bound results and screenshots](../qa/formation-collapse-001/README.md).
Ignored mobile/www refreshed from current source/fonts/branding; HTTP bytes and
complete loaded preview script verified. Preview remains open on Wisps.
Node24.19.0/Chrome151.0.7922.34. Source validation/context/diff checks PASS;
native529/12 profiles with live timers, causal reset control, core8099, mobile151,
scroll3229, Formation133/save-reload, navigation443 and actual reload PASS.
Self-review only, no independent review claimed.

During testing, other owners saved docs-only commits57bbd38/b331cef. Their Lab/
Wisp status and decisions are preserved; product bytes did not change. Final
checkpoint builds onb331cef. No concurrent overlapping product edit observed.
Verified implementation checkpoint: `678ccd7` on `local/full-debug`.
Final full-suite/remote/Android acceptance stays open; no APK/signing/release.
Next: user reviews playable local preview, then proceeds to LAB_SPEED_CONTROLS_001
from this accepted local checkpoint. Feature stays open for combined acceptance.

## Saved local handoff and deferred combined acceptance

13 October 2026 user follow-up: save the verified implementation, clearly record
remaining checks, confirm task-introduced failure status, and leave this chat
OPEN. Final combined validation and Android acceptance will be handled after
the improvements. This documentation checkpoint preserves implementation678ccd7
and its exact source/evidence; it changes no product or tests.

Failure attribution: no product regression or unresolved task-introduced failure
was demonstrated in the scoped checks on678ccd7. The sandbox launch restriction,
unsettled tab-animation measurement and unknown-scenario invocation were test/
environment diagnostics, corrected before local delivery. The deliberately reset
disclosure mutation fails as expected and is not present in the product.
Inherited Prism deadline, standard Windows dump-DOM transport and tooling
limitations were already open; their causes are not attributed to this change.
Untested final combined/native paths remain unknown, not claimed PASS.

Remaining checks, deferred until the improvements are finished:

- Validate the exact final combined source with the full behavioral suite and
  relevant required gates in `.github/workflows/pre-merge-validation.yml`.
  Rerun Formation collapse529, contribution core/mobile and Wisp scroll3229,
  Formation autosave/save/recovery and navigation checks on those final bytes.
- Resolve or explicitly disposition inherited Prism-contract deadline, Windows
  dump-DOM transport and POSIX symlink/tooling limitations without weakening
  assertions; record exact environment and results. Existing CDP receipts remain
  scoped browser evidence, not a replacement claim for unrun full gates.
- Refresh mobile/www from the final source/assets and verify exact staged bytes.
  When Android work is subsequently authorized, verify built package/version,
  existing signing identity/assets and installed-device behavior, including
  collapsed/expanded states, formation changes, periodic refresh, touch/keyboard,
  large text, exact WebView60 compatibility and TalkBack accessibility.
- Save final combined evidence and any later authorized remote integration/
  release delivery status. Current work remains local; no APK/signing/remote
  action follows from this documentation request.

Next action: continue the queued improvements from the verified local checkpoint;
return to these checks after the final improvement. Keep this chat open and
unarchived until the later acceptance decision.
