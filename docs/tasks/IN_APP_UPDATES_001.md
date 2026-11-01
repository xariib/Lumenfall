# IN_APP_UPDATES_001 — signed APK updates inside the app

Original request (1 November 2026): “Is it possible to make an auto update
inside the app, so it downloads the apk and installs it. If it's possible,
make it the best way possible.”

Goal: discover official stable releases, download and verify the APK inside
Lumenfall, then open Android's user-approved installation without losing saves.

Owner: this feature chat. Baseline: origin/main `0f72b061`, released Android
0.2.69. Isolated branch/worktree: `feature/in-app-updates-001` /
`in-app-updates-001`. Open PR2 is an unrelated documentation audit.

Preserve gameplay, both save slots, paid work, package, signing certificate,
localhost origin, WebView60 and all existing CI gates. No save schema change.

Acceptance:
- Automatic throttled checks plus a manual Settings check; browser stays usable.
- Stable official releases only; bounded HTTPS downloads with progress/cancel.
- Verify checksum, byte size, package, newer version, device SDK and pinned
  signing identity before opening the installer. No caller-supplied APK URL.
- Explain/handle Android install-source permission, refusal and retry.
- Save progress before installer handoff; retain verified download across restart.
- Regression tests, generated-native build, existing gates and installed upgrade.
- Integrate and publish signed APK using the established release workflow.

Implementation decision: automatically check at startup/foreground, at most once
per six hours. Download starts on “Download & install” so mobile data and restart
remain under the player's control. Android retains final install approval.
Use existing GitHub release tag/APK/checksum assets; no new hosting or account.

Baseline checks: source validation PASS (2 scripts,16 IDs); native recap fixture
PASS (10 checks including negative control), Node v24.13.1.

Implemented: native trust policy/plugin, generated-project installer hook,
Settings controller, automatic/manual checks, cancellable bounded download,
checksum/identity verification, private APK storage, permission/installer return,
save-before-install and persistent verified retry. README documents the flow.
Existing build workflow adds a same-source, same-key older-version disposable
fixture to exercise an actual public APK download and system-approved update.

Checks: native policy PASS (37 assertions/rejection controls, including throttling,
clock rollback and version invalidation); generated-native
registration/permission/provider/overwrite checks PASS; production controller
PASS (browser fallback, auto/manual checks, progress/cancel/retry, save failure,
offline retention, background completion); source syntax/contract PASS; actual
task context PASS. Chromium destinations scenario PASS, Save Backup UI PASS
(12 profiles). Production updater browser PASS (320px,200% text,390px;
native boundary mocked), screenshots visually checked. Node24.20.0/JDK17.0.18,
Chrome156.0.8078.80. Actual native installation remains unverified until CI.
Local Gradle blocked by Java loopback connection; use Linux build CI for native
compilation and installed acceptance. No tests or signing gates were relaxed.

Status: in progress; remote CI, native acceptance, integration/release pending.
Upload initially rejected by GitHub because the saved OAuth login has repo but
not workflow scope. User explicitly authorized workflow access; device consent
is pending. No APK is published and no remote source is changed yet.
Next: after device consent, push the feature, run PR gates and signed Android CI.
Relevant workflow: [feature workflow](../project/FEATURE_WORKFLOW.md).
