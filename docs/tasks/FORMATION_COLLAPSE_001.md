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
Local coherent checkpoint: the commit containing this task/evidence on
`local/full-debug` (resolve with git log -1 -- docs/tasks/FORMATION_COLLAPSE_001.md).
Final full-suite/remote/Android acceptance stays open; no APK/signing/release.
Next: user reviews playable local preview, then proceeds to LAB_SPEED_CONTROLS_001
from this accepted local checkpoint. Feature stays open for combined acceptance.
