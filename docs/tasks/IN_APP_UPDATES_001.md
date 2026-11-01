# IN_APP_UPDATES_001 — signed APK updates inside the app

Original request (1 November 2026): “Is it possible to make an auto update
inside the app, so it downloads the apk and installs it. If it's possible,
make it the best way possible.”

Goal: discover official stable releases, download and verify the APK inside
Lumenfall, then open Android's user-approved installation without losing saves.
Owner: this feature chat. Baseline: released 0.2.69, main 0f72b061.

Status (2 November, Copenhagen): **integrated and publicly released as 0.2.75**.
[PR 33](https://github.com/xariib/Lumenfall/pull/33) merged by fast-forward to the
exact tested source `e13c766921230edc694e3a71d19b0255bce15749`.
[Release/APK](https://github.com/xariib/Lumenfall/releases/tag/android-1000075).
[Complete source-bound receipt](../qa/in-app-updates-001/release.json).

## Implemented and preserved

- Native checks at startup/foreground, throttled to six hours, plus Check for
  updates/Check again in Settings. Browser/iOS remain usable without this plugin.
- The player starts Download & install; progress/cancel/retry are available.
  Stable official GitHub APK/checksum assets only, bounded HTTPS redirects,
  size/storage/time limits, no caller-supplied URL or extra hosting/account.
- Verify SHA256, bytes, package, strictly newer version, SDK compatibility and
  established signing identity before installation, including a second check
  after cached-file retention. A dedicated UpdateFileProvider grants only the
  private update cache. APKs are excluded from Android backup; cache eviction
  requires another download. Interrupted partial files are discarded.
- Save real elapsed progress before Android handoff; refuse handoff on failed
  save. Permission refusal and installer cancellation retain a verified retry.
  Late Cancel intent stops automatic handoff even if native completion is queued.
  Background completion waits for an explicit later Install action.
- Android keeps source-permission/final-install approval. Install 0.2.75 once over
  the existing app; future versions use Settings → App updates. Never uninstall
  to update. README explains the flow.
- No gameplay, balance, caps, save schema, original provider, signing identity,
  package com.lumenfall.app or https://localhost origin change. Both save slots,
  paid work, legacy entitlements and existing UI flows are retained.

Product: index.html and mobile/native/*.java. Generated project hook:
scripts/ci/install_android_updater.cjs. Existing Android workflow builds/signs/
verifies the APK and runs real disposable-emulator update acceptance. Focused
controller, browser, policy, generation, negative-control and preservation tests
are in tests/behavioral/ and tests/tooling/ with app-update prefixes.

## Acceptance and publication

All seven PR workflows and all seven manual exact-commit workflows PASS, including
both full pre-merge jobs, main 190 scenarios and isolated offline 1. Existing gates,
assertions and deadlines were preserved. [CI](../qa/in-app-updates-001/ci-final.json).
[Compressed complete log](../qa/in-app-updates-001/full-validation.log.gz).

Policy: 37 rejection/assertion checks, generated provider/permission/registration
checks, production controller and late-cancel causal control PASS. Browser PASS
at 320px/200% text and 390px; existing Save Backup: 12 profiles and destinations PASS.
Paired independent replay: 115200 one-second calls per source, all four complete
states/reward triples equal 0f72b061. Only the golden source binding changed;
canonical vectors and the pre-existing unreproduced full-hash qualification stay.
[Replay](../qa/in-app-updates-001/independent-replay.json). The historical pre-Tap
hardcoded generator was preserved; its known failure is not an updater regression.

[Signed Android run 41354746788](https://github.com/xariib/Lumenfall/actions/runs/41354746788)
PASS: package/version/signature/assets, original 158→75 upgrade (same UID/origin,
both saves, paid work/legacy credits), plus actual official APK download,
cancellation, permission refusal, cold restart, tampered-cache rejection,
installer cancellation and system-approved update. The disposable probe uses a
same-source/key older version; the final 75 candidate is restored afterward.
[Original upgrade](../qa/in-app-updates-001/native-upgrade.json),
[updater](../qa/in-app-updates-001/native-updater.json).
Android 12/API 31/WebView 91; CI native Node 22/JDK 17, full tests Node 24.19.0.

Published the exact accepted signed CI artifact through an atomic draft promotion
after the established release-ci-gate and continuing-version gate passed. Local
aapt/apksigner, source assets, receipt binding and server upload digests PASS.
Both anonymous exact-tag and latest downloads/checksum PASS and match tested bytes.
[Artifact](../qa/in-app-updates-001/artifact-verification.json),
[public download](../qa/in-app-updates-001/public-verification.json).
APK SHA256: a779c1fb690c99bd53760e6da5d7624238991967555bffa4b46aec68e6a60cd8.

## Earlier findings retained

- First run 41348499741 passed original upgrade but timed out on an incomplete
  permission-screen matcher. [Original failure](../qa/in-app-updates-001/first-ci-attempt.json).
- Run 41349586993 lost an emulator, then lacked disk to boot its retry. Explicit
  2G userdata fixed the resource issue; no OOM or relaxed test is claimed.
- Run 41351743310 exposed the real queued-completion/Cancel race. Synchronous cancel
  intent and a causal regression fixed it. [Evidence](../qa/in-app-updates-001/cancel-fix-local-checks.json).
- Diagnostic 41353728531 passed earlier updater stages, then exposed shared
  FileProvider-class authority confusion. A dedicated subclass fixed installer
  access; acceptance now requires the real PackageInstallerActivity confirmation.
  Failed-source history/raw links remain in Git history and those workflow runs.

Self-review/automated tests only; initial automatic review on 469b9798 had no
findings and is not claimed as final independent review. Physical-phone, exact
WebView 60, TalkBack and human visual/pacing acceptance remain open. No chat was
archived. Next: install the released APK over the existing app and perform those
physical-device checks; source/build/public-delivery acceptance above is complete.
