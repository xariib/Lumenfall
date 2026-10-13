# LAB_SPEED_CONTROLS_001

13 October 2026. Owner: this feature chat, sequential local work, no delegation.
Goal: compact Lab speed controls beside Study Queue, with direct multiplier and
speed queue choice; clearly distinguish immediate paid acceleration and queued
settings. Show costs before spending and prevent accidental/double spending.
Preserve tiers/prices/work/queue/saves/offline simulation and all other features.

Baseline: clean `local/full-debug`, HEAD `678ccd7` (accepted Formation checkpoint).
See [queue](LOCAL_IMPROVEMENTS_PLAN_001.md), [state](../PROJECT_STATE.md),
[workflow](../project/FEATURE_WORKFLOW.md). No concurrent dirty product work.
Code inspection: all speed tiers and queued preferences are behind a separate
Speed up disclosure. Reproduce in a real browser before editing product code.

Acceptance: inline tier selection, explicit priced Buy now and separate speed
queue toggle; selected/current speed clear; affordability and repeated input
safe; queue target changes, saved preferences and online/offline parity retained;
native keyboard/touch, 320–430px widths, 200% text, stable scroll/focus through
renders/purchases/completion. Existing relevant Lab and preservation checks.
Update source-bound evidence/task/state, self-review complete diff, commit local
checkpoint, refresh mobile/www source/fonts/branding and show playable preview.

Status: LOCAL IMPLEMENTATION VERIFIED; combined/release/device acceptance pending. No APK/signing/remote work. Inherited combined-suite/Prism
deadline/standard Windows dump-DOM issues and Android/WebView60/TalkBack/device
acceptance remain pending; browser checks cannot prove Android acceptance.
Baseline browser reproduced hidden speed controls and queue choice at source
0bf0505f; Lab core2465/offline transactions passed before product changes.
Implementation replaces the disclosure with one inline row (wraps on narrow
screens): Study Queue, native tier/price select, explicit priced Buy now, separate
Queue speed. Selected target shares the existing persisted queue preference.
Selecting with queue OFF never pays; ON explicitly queues that target, including
current work and offline. Immediate purchase uses unchanged applySpeedTier;
scheduler, work, tiers, discounts, balance and save schema are unchanged.
Paid/Covered labels distinguish already purchased speed. Attached native select,
updated option prices, one-time listeners and same-card focus/scroll survive
renders; idle actions stay disabled without a misleading Completed warning.

Final source SHA-256: `639b5426080744f43b3e3fb614bf3b40d253cb0db1a5b6cae04c45cb63f066b3`.
Files: index.html; tests/behavioral/lab-speed-controls.cjs (registered in run.cjs /
scenarios.json); existing Lab UI/native, expansion UI, accessibility, layout,
Inquiry, R3, duration and runner checks adapted from disclosure to direct controls;
this task, project state, local queue and [source-bound evidence](../qa/lab-speed-controls-001/README.md).
No unrelated product edit observed. During work, Formation owner saved docs-only
checkpoint e3fc6c8; its OPEN/deferred acceptance decision is preserved. Product
baseline bytes stayed unchanged. This local commit builds on e3fc6c8. Self-review only.

Node24.19.0 / Chrome151.0.7922.34. PASS: focused890/12 profiles; both causal
mutations rejected; expansion UI6588/12 profiles including actual reload;
Lab core2465; offline transaction/retry/shared12h checks; existing19 Lab/Inquiry/
duration/identity/navigation scenarios18949 assertions plus persistence cases;
native/reduced Lab each6 profiles including real live timers; Lab alert166,
Wisp scroll3229 and Formation529/12 profiles. Context/source/diff checks PASS.
Original gameplay and preservation assertions retained; obsolete disclosure/
Close/Escape expectations replaced by direct accessibility/tab order coverage.
Windows normal-motion tests now explicitly request no-preference rather than
inheriting the OS reduce preference; no assertions/gates weakened.
Screenshot QA caught and fixed stale Catalysis option prices before acceptance.
Sandboxed Chromium exited before readiness; scoped browser checks succeeded
outside the sandbox with normal clean teardown. No scoped failure remains.

mobile/www refreshed from source/fonts/branding; all15 files byte-verified in
staging and HTTP. Playable preview open on Lab at http://127.0.0.1:4174/index.html.
Complete loaded game script SHA-256 matches source (see loaded-preview.json).
Local coherent checkpoint: commit containing this task/evidence on
`local/full-debug` (resolve with git log -1 -- docs/tasks/LAB_SPEED_CONTROLS_001.md).
User-authorized local delivery overrides the usual remote delivery requirement;
no GitHub connection/push, APK build/release, signing or archive action.

Next: user reviews playable preview; continue RIFT_HINT_LAYOUT_001 from this
checkpoint. Keep this feature open for final combined checks and Android/device,
exact WebView60/TalkBack acceptance. Inherited full-suite/Prism/Windows transport
limitations remain pending, and browser PASS does not prove Android acceptance.
