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
- Build/sign/verify through the established Android workflow; integrate the exact
  tested source and publish its accepted APK after the existing release gate.

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

Runner follow-up: PR head `a408644e` keeps its in-progress game gates. Its native
run41349586993 attempt1 lost the emulator during the original upgrade; attempt2
never booted: userdata needed7372.80MB but the runner had3882.82MB free. No OOM
is claimed (kernel/memory evidence does not show one). Test the necessary
`disk-size: 2G` runner configuration on `ci/in-app-updates-runner-001`; product,
Android API31/WebView, memory, deadlines and assertions remain unchanged.
Integrate that CI-only follow-up with this feature after its acceptance, then
run required integrated-commit validation before publishing.

The2G configuration booted and passed the original upgrade in run41351743310
(source3d9c0f5), then exposed a real late-cancel race: native download finished
while the WebView was busy, and its queued completion opened Settings after the
Cancel click. Fix: latch the player's cancel intent synchronously in JavaScript
and check it before automatic installer handoff; retain an already verified APK
for an explicit later Install action. Ignore further progress events after that
intent. Add a foreground late-completion regression as well as the separate
background-completion check. Native receipts distinguish an interrupted transfer
from a verified APK retained after cancellation. System button matching accepts
Android's Update/Install capitalization while retaining enabled/clickable checks.
Controller, production browser and source checks pass after the fix; repeat the
paired preservation proof and run PR/manual/native acceptance on the fixed head.

Fixed-source paired replay PASS again (115200 calls per source, four complete
states identical). Both the PR and manual final-commit runs now include the2G
runner configuration and cancellation fix. Delivery will fast-forward unchanged
main to the exact tested commit after all required checks pass, then promote the
accepted signed APK with the existing source/version/signing/asset/upgrade gates.
This preserves the tested bytes rather than rebuilding another version solely
for publication. Record the public checksum and final receipt after publishing.

Fixed production head `dab66944` is in PR33 and manual validation. Native
run41352689970 compiled, passed the original upgrade, then hit the existing
300s updater deadline with no stage diagnostics. Keep PR/game checks running on
that production code; instrument the native driver with stage logs, continuous
logcat and deadline UI/activity/screenshot capture on the CI follow-up branch.
No product code, assertions or deadline change for this diagnostic run. Run the
final required source-bound checks after native acceptance is resolved.

Diagnostic run41353728531/source1a672094 passed cancellation (including the
queued completion), permission refusal, cold restart and actual tampering
rejection. Installer staging failed with a real provider-identity error:
`com.lumenfall.app.updates` was served by the directly registered shared
FileProvider class for `com.lumenfall.app.fileprovider`. Add a dedicated
`UpdateFileProvider` subclass/component and keep its narrow cache path, grant
and non-exported policy unchanged. Generated-project regression now starts with
Capacitor's provider and requires distinct classes/authorities. Native acceptance
must wait for `PackageInstallerActivity` before cancelling/approving, so a staging
error dialog can never be mistaken for a valid installer confirmation.
Relevant workflow: [feature workflow](../project/FEATURE_WORKFLOW.md).
