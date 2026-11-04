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

Status: integrated; Google/device acceptance pending. PR39 merged at12551152;
tested source4982932a has the identical tree. User reports last clean install
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
closed. User cannot access the computer now to dismiss it; no security setting was changed.
Other emulator instances are excluded. No successful local installation claimed.

Next: obtain a fresh Google scan of the exact0.2.95 candidate. The user received
the build ZIP link for a phone test; no verdict has been reported. If still
flagged, the prepared review requires VirusTotal upload of the same APK and the
developer's email/submission authorization. Preserve the exact scanned bytes for
any later promotion; do not describe a rebuilt file as already scanned.

First native attempts:41905663980 failed CLI tar default-import compatibility;
fixed in0e8532bb. Run41905985978 built signed production0.2.93 and passed static
artifact/security checks, exact-APK old-save upgrade and actual updater tests
(including tamper/cancel/system approval). Final no-debug-socket check failed on
the userdebug Android image. Chromium documents that userdebug/eng images force
WebView debugging. The check is preserved and moved to a second retail
google_apis_playstore user image, which must report ro.debuggable=0. Explicitly
disable WebView debugging in the app config; never ship test instrumentation.
Run41907598257 (source0fe19168) built signed0.2.94; after an SDK download failure,
attempt2 passed all Android tests including retail OS debug/storage protections.
APK SHA256:5380e9f01071bd52232c0914a8a076217d2df91c10bda4833c475e35485a8e99.
Fresh artifact verification confirms signature, package, source assets and receipt
hashes. The retail screenshot captured the loading cover after10s, so strengthen
normal launch to wait for visible game controls through native accessibility,
without enabling debugging. Google remains NOT_TESTED.

Premerge41907607852 stopped at an existing RIFT_HINT_READABILITY_002 startup
document size violation; shared state history is preserved in a linked snapshot
and shortened to retain the32KiB limit unchanged. Locally that task now passes
at25125 bytes. No gameplay or acceptance assertions were removed. Required CI
and the strengthened Android launch check were rerun on the revised commit.
See [audit](../qa/play-protect-001/README.md).

Final candidate0.2.95 /1000095 from4982932a:
SHA256:3f95ee3e46d28ae160a04f9328f905abeaf86606e2caf617bbfba1c5cb6d587e.
Native run41910258484 attempt2 PASS: exact-APK in-place save upgrade, separately
built updater fixture (download/install public0.2.91), and visible game controls
on a retail Android user image with debugging/private-storage protections.
The candidate was restored after updater tests. Attempt1's offline recap dialog
did not appear after credited absence; the unchanged check passed on retry. Its
cause is not established and the failure remains recorded, not waived.

All seven PR workflows PASS, including premerge41910264639 with190 main cases,
the independent offline case and runtime smoke. Source4982932a, PR merge90f4ef3b,
and integration12551152 share tree0a013eeb71cf6127ce9e031764b20bcd0a656a7e.
Fresh local APK signature/identity/assets/hash checks PASS; retail screenshot
visibly shows the game. All26 premerge task-context checks PASS after preserving
the prior shared history. Self-review and automated checks only.

Durable [candidate receipts](../qa/play-protect-001/candidate-1000095/ci.json)
and [Google review draft](../qa/play-protect-001/candidate-1000095/google-review.txt)
are saved. No VirusTotal upload, Google appeal, stable APK promotion or physical
Google clearance is claimed. Task stays open; no archive action.

References: [updater requirements](IN_APP_UPDATES_001.md),
[release receipt](../qa/all-updates-release-20261104/release.json),
[Google guidance](https://developers.google.com/android/play-protect/warning-dev-guidance),
[appeal form](https://support.google.com/googleplay/android-developer/contact/protectappeals).
