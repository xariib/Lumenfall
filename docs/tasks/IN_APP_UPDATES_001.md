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
PASS (10 checks including negative control), Node v24.20.0.

Implemented: native trust policy/plugin, generated-project installer hook,
Settings controller, automatic/manual checks, cancellable bounded download,
checksum/identity verification, private APK storage, permission/installer return,
save-before-install and verified retry across ordinary restarts. APKs use a
private cache directory excluded from Android backups; system cache eviction
requires a fresh download. Interrupted partial files are discarded on next start.
README documents the flow.
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
Upload initially rejected by GitHub because the saved OAuth login lacked workflow
scope. User authorized it and GitHub device consent is now confirmed. Native
temporary filenames retain the APK suffix for parser compatibility; emulator
permission assertions inspect the resumed activity rather than its history.
PR: [33](https://github.com/xariib/Lumenfall/pull/33), first source `469b9798`.
First signed build [41348499741](https://github.com/xariib/Lumenfall/actions/runs/41348499741):
compilation/signing/assets and original installed upgrade PASS (Android0.2.70,
API31/WebView91, both saves/UID/origin/paid work retained). Actual updater
discovery, cancellation, download/signature validation and permission handoff
worked; the test timed out because Android names the resumed screen
`ManageAppExternalSourcesActivity`. Fix that test matcher, its binary-buffer
limit and add UI failure diagnostics. Product code needs no change for this.

First pre-merge run41348501135 failed the mandatory source-hash binding for the
offline reference, after the isolated offline job passed. Use the established
paired one-second replay against released0f72b061: assert all complete endpoint
states and reward triples remain equal, then update only the golden source hash.
Preserve its canonical vectors and the existing provenance limitation; the old
pre-Tap generator remains unchanged. Initial unchanged-generator trials reproduce
the known outdated hardcoded reward failure; they do not establish a game defect.

Paired replay PASS on Node24.19.0: 115200 one-second calls per source, all four
complete endpoint states identical; all accepted reward triples retained. Only
the canonical source binding changes to `d28e2bc4…`; canonical vectors and the
known upstream full-hash provenance limitation remain unchanged. Reproducer:
`node tests/behavioral/app-update-preservation.cjs 0f72b061 --write`.
[Replay](../qa/in-app-updates-001/independent-replay.json),
[first CI failure](../qa/in-app-updates-001/first-ci-attempt.json),
[original installed-upgrade PASS](../qa/in-app-updates-001/first-installed-upgrade.json).

Next: push test/binding fixes, rerun all PR/native gates, integrate and publish.
No APK published yet; original failed runs remain recorded as failures.
Relevant workflow: [feature workflow](../project/FEATURE_WORKFLOW.md).
