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

Status: in progress. Product unchanged.
Next: run core and full behavioral suites; investigate each failed check.
