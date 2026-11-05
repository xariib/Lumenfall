# Perfect debug — 5 November 2026

Original request: "Run perfect debug".
Owner: this task's single agent; no delegation.
Goal: run existing broad debug checks on current main, investigate reproducible
failures, preserve acceptance thresholds and document exact outcomes.

Baseline: ab7aa2dd2a4bc63f8079fbd1b63a1ec9372d4805 (main).
Branch/worktree: debug/perfect-debug-20261105, perfect-debug-20261105.
Preserve gameplay, saves, paid work, balance, assets and Android identity.
No new APK is required for a diagnostic-only run.

Acceptance: source/context checks, existing core checks and full behavioral
suite, with failures classified from evidence rather than hidden or waived.
Use Node 24.19.0; local Chromium-based Brave, pipe DOM transport on Windows.
Evidence: validation-evidence/perfect-debug-20261105/ (local raw receipts).
Known limitations: POSIX tooling fixtures require Linux; modern browser results
do not establish physical-phone, WebView60 or TalkBack acceptance.

Status: diagnostic run finished; limitations below remain open. Product and
test code unchanged. [Final report](../qa/perfect-debug-20261105/README.md) and
[CI receipt](../qa/perfect-debug-20261105/validation.json).
[Debug PR40](https://github.com/xariib/Lumenfall/pull/40) pins the original test
head 2c2e0f3 and merge 68e649a. Source SHA-256:
1173423bdb0d899616bd3a77b4f3931d8bcde5f5b67d90209f27a1b01f2e65e4.

Local source/context/APK identity pass. Nine standalone tooling suites pass;
the updater suites required the installed JDK on PATH. The combined tooling
suite fails its POSIX permission assertion on Windows (0666 versus 0644).
The local broad batches were explicitly interrupted and are not full passes.
Three native UI deadline failures and one Wisp periodic-layout assertion were
retained. The complete Wisp rerun and geometry probe reached the original
90-second deadline. Three subsequent original --role-only runs pass 493 checks
each across twelve profiles. The intermittent assertion is not explained or
waived; no gameplay defect has been confirmed from these local observations.

Seven Linux workflows pass: Lab, Forge, Tree, Comet/Deeds, permanent progression,
shared UI and pre-merge. All 190 main cases, the isolated eight-hour offline
case, negative controls and runtime smoke pass. Wisp rarity scroll passes in
the complete Linux run. The pre-merge job's
first attempt failed at Browser.getVersion before any UI assertion. Its retry
passed startup and completed successfully. See source-bound CI receipt above.

Cleanup: native PowerShell deletion was rejected with the exact reason
"blocked by policy"; no more specific reason was supplied. No workaround was
attempted. Seven task-owned temporary roots remain; exact paths and provenance
are in validation-evidence/perfect-debug-20261105/cleanup-blocked.txt.

Follow-up, 5 November: the intermittent Windows assertion is resolved by
[WINDOWS_WISP_SCROLL_001](WINDOWS_WISP_SCROLL_001.md), PR41/main 87e58545.
The controlled reflow raced the tab entrance animation. A bounded setup wait
and frame barriers fix the test; Windows/Linux pass 3,277 original Wisp checks,
five controls and all eight workflows. Gameplay bytes and thresholds unchanged.
[Follow-up evidence](../qa/windows-wisp-scroll-001/README.md).

Next for this original diagnostic's remaining cleanup: remove its seven owned
scratch roots when supported cleanup is available. The follow-up's two roots
are recorded separately. No APK rebuild/publication or physical acceptance
claimed. Automated checks and self-review only.
