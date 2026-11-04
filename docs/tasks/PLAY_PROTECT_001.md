# PLAY_PROTECT_001 — investigate Google warning and harden APK delivery

Original request (4 November 2026): "I don't want this to happen again ever!
Also if the Google scan can be fixed aswell I would like that too". User supplied
a screenshot of Google Play Protect's Danish harmful-app block for Lumenfall;
the page behind it lists 0.2.91. Exact downloaded phone bytes are not yet available.

Goal: investigate the reported verdict, correct verified release weaknesses,
preserve saves/updater/signing, and prepare a supported classification appeal.
Google controls its verdict; no guarantee of never being flagged is possible.

Baseline: main a4a379c9; release 0.2.91 from 237fa928; isolated branch
fix/play-protect-001. No other feature files will be overwritten.

Confirmed released APK SHA256:
de20f5c40eafb2ebd17a98022a3563a18f82d732b5a1c0913dfb831a7e45512d.
Local Android aapt inspection confirms debuggable=true, target SDK34, and only
INTERNET, REQUEST_INSTALL_PACKAGES, and the app's signature-protected AndroidX
receiver permission. Build workflow publishes assembleDebug output. These are
observations, not proof of the Play Protect trigger. Updater restricts downloads
to official HTTPS assets and verifies hash, package, version and established cert.

Scope/acceptance:
- Audit exact public APK, signature, manifest, packaged source and dependencies.
- Build non-debuggable production APK; reject unsafe manifest/config drift.
- Retain existing native save/upgrade/updater assertions on exact shipped bytes;
  any test-only inspection mechanism must stay outside the production APK.
- Preserve package com.lumenfall.app, signing certificate, both saves, gameplay,
  update verification and Android user approval; do not bypass Play Protect.
- Prepare exact-hash appeal evidence. Google clearance requires an actual fresh
  Google/phone result; CI/security lint cannot substitute for that result.
- Validate, integrate and retain durable evidence; publish only with honest
  status. Do not claim the warning fixed without device/classification evidence.

Status: investigation/implementation in progress. User reports last clean install
was probably before updater and requests actual installation testing. Local browser automation reports "Local browser use
is disabled in Work settings", so VirusTotal/appeal UI cannot currently be used.
Google's appeal form requires contact email, package, VirusTotal-uploaded APK
SHA256 and supporting explanation. No upload or appeal has been submitted.

Audit: lockfile used Capacitor6.2.1, affected by critical CVE-2026-103922 /
GHSA-rvm3-566m-v7fv. Patched runtime/core/CLI to6.2.2. Assets4.0.0 and tar7.5.22
remove high/critical build-tool advisories; runtime audit has zero findings.
Eight moderate development-tool dependency findings remain (glob/minimatch and
UUID/Xcode dependency chains); these are not packaged Android runtime libraries.
Original/fixed audit JSON is in docs/qa/play-protect-001. Actual Google trigger
remains unknown. Pre-updater0.2.69 is also debuggable; debug status is not new.

Implementation: production release build, separate signed androidTest runner for
existing exact-APK native tests, final normal-launch/no-debug inspection, static
APK permission/export/config guard and high/critical dependency audit gate.
Gameplay index.html is untouched. Production APK never contains the test runner.
Focused negative security tests/context/syntax/diff checks PASS locally.

Local emulator127.0.0.1:5575 (dedicated Lumenfall Test Phone) is blocked by an
existing Windows Firewall prompt for adb.exe; package commands return error:
closed. User asked to dismiss it with Cancel; no security setting was changed.
Other emulator instances are excluded. No successful local installation claimed.

Next: native build/existing CI gates, inspect production APK and normal launch,
actual local installation comparison when available, exact-hash appeal package.

References: [updater requirements](IN_APP_UPDATES_001.md),
[release receipt](../qa/all-updates-release-20261104/release.json),
[Google guidance](https://developers.google.com/android/play-protect/warning-dev-guidance),
[appeal form](https://support.google.com/googleplay/android-developer/contact/protectappeals).
