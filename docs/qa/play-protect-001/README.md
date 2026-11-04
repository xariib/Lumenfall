# Play Protect investigation — 4 November 2026

The user supplied a Danish Google Play Protect "harmful app blocked" screenshot
while downloading Lumenfall, with Android0.2.91 shown behind it. This establishes
a reported harmful-app classification, not its cause. The phone's downloaded
file was not extracted. The user believes the last clean install preceded the
in-app updater and explicitly requested installation testing.

## Artifact audit

Fresh anonymous GitHub downloads of0.2.69,0.2.75 and0.2.91 all verify under the
established certificate A9:1C:BF:34:27:D2:CE:B1:CD:BE:07:E5:22:5F:17:D4:71:B1:82:9E:52:F7:AB:66:49:7E:75:49:75:AD:3E:21.
They all target Android34/min22 and are debuggable. Only REQUEST_INSTALL_PACKAGES
was added to the permission set at0.2.75. Other permissions are INTERNET and
com.lumenfall.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION. No SMS, contacts,
location, accessibility or notification-reader access is declared.

0.2.91 matches its recorded public SHA256
de20f5c40eafb2ebd17a98022a3563a18f82d732b5a1c0913dfb831a7e45512d.
Packaged HTML, fonts and branding match the released source. Hashes and signing
checks establish provenance, not absence of vulnerabilities or Google clearance.

The dependency audit found Capacitor Android6.2.1 affected by
[CVE-2026-103922](https://github.com/advisories/GHSA-rvm3-566m-v7fv).
The internal HTTP proxy could serve remote documents at the app's trusted origin.
The source does not render remote user-provided links, but the affected runtime
must still be patched. Google has not identified this CVE as its detection reason.

## Remediation and verification boundaries

- Capacitor Android/core/CLI6.2.2 includes the vendor patch within the existing
  runtime major. No gameplay HTML/save changes or package/key rotation.
- Assets4 and patched tar7 remove high/critical build dependency findings.
  The CLI adapter bridges tar7's named exports to Capacitor6's default import;
  original unadapted generation failed and was corrected, not ignored.
- Eight moderate development-only findings remain in glob/minimatch and
  UUID/Xcode dependency chains. See the original/fixed npm audit JSON files.
- Public artifacts now use assembleRelease, with debuggable=false checked from
  the actual binary manifest. Unexpected permissions, exports, remote origins,
  cleartext/mixed content, instrumentation or nested APK/key files are rejected.
- Existing upgrade/save/updater assertions are preserved. Separate same-signer
  androidTest instrumentation enables inspection only in a disposable CI process.
  The runner is never included in the game or uploaded as a public artifact.
  Final acceptance removes it, starts the exact production APK normally, and
  checks private-data/debugger protections and installed-byte identity.
- Static checks and emulator acceptance deliberately report Play Protect as
  NOT_TESTED. They cannot substitute for Google's verdict on a Play-certified
  device. Do not call the warning fixed based on those checks alone.

## Verified candidate and integration

[PR39](https://github.com/xariib/Lumenfall/pull/39) merged at12551152. Source
4982932a, tested PR merge90f4ef3b and integration share the exact tree
0a013eeb71cf6127ce9e031764b20bcd0a656a7e. Seven required PR workflows PASS, including
190 main behavioral cases, the separate offline case, and browser runtime smoke.
The shared history snapshot fixes the pre-existing startup-size failure while
preserving the32KiB limit and all26 required task contexts.

Signed Android0.2.95 /1000095 has SHA256
3f95ee3e46d28ae160a04f9328f905abeaf86606e2caf617bbfba1c5cb6d587e.
[Build ZIP](https://github.com/xariib/Lumenfall/actions/runs/41910258484/artifacts/13363262337)
contains Lumenfall.apk. It is a review candidate, not the stable update feed.
The established signing certificate, package, origin and source assets verify.

- [CI receipt](candidate-1000095/ci.json) and
  [complete premerge job results](candidate-1000095/premerge-jobs.json).
- [Exact-APK save upgrade](candidate-1000095/emulator-upgrade.json): UID, both
  save slots, progression, paid work and legacy entitlements retained.
- [Updater receipt](candidate-1000095/in-app-updater.json): a lower-version
  fixture built from the same updater source downloaded/installed public0.2.91.
  Permission refusal, cancellation, restart and tamper rejection passed. The
  final candidate was restored; this does not prove its browser-install scan.
- [Retail Android acceptance](candidate-1000095/production-runtime.json) and
  [visible normal-launch screenshot](candidate-1000095/production-normal-launch.png):
  exact installed bytes, game controls visible, no test runner, no debugger socket,
  run-as rejected. ADB installation is not a Google Play Protect verdict.
- [Local re-verification](candidate-1000095/local-verification.json),
  [static security checks](candidate-1000095/security.json), and
  [dependency audit](candidate-1000095/dependency-audit.json).

Native attempt1 missed the offline recap dialog despite crediting the simulated
absence. The unchanged check passed on attempt2; its cause remains unestablished.
Failure diagnostics are retained locally and in run41910258484's failed artifact.
No assertion was removed or relaxed. Self-review/automated validation only.

## User phone scan

The user supplied screenshot19583.jpg after receiving the0.2.95 ZIP link. It shows
Google Play Protect's green "Denne app ser sikker ud" ("This app looks safe") and
"Du kan fortsætte installationen" ("You can continue the installation"). This is
positive scan evidence for the displayed Lumenfall APK, not proof of completed
installation or a guarantee for future builds/devices.

No version or hash is visible. A background APK row shows7.10MB; the verified
candidate is5,161,721 bytes. That row may refer to another file, so do not infer
that the wrong APK was scanned. The user subsequently confirmed "Yes from zip",
attributing the scan to the supplied0.2.95 candidate. This is user-confirmed
attribution, not an independently measured phone-side APK hash.
[Observation record](phone-scan-2026-11-04.json). The original image
remains in the user's attachments; only the relevant text/hash is recorded here.
Historical CI receipts remain NOT_TESTED because those jobs did not perform a
Google scan. Stable promotion of those exact bytes is now in progress.

## Remaining external work

The dedicated local BlueStacks test phone is obscured by an existing Windows
Firewall prompt for adb.exe; package queries also return "error: closed". The
user cannot access the computer to dismiss the prompt. No successful local install is claimed and
no unrelated emulator was touched. Local browser automation is disabled in Work
settings; inventory confirms no alternate browser connection. The web tool could
not access the public hash report either. No VirusTotal upload or Google appeal
has been submitted. The user's positive phone scan and candidate confirmation
are recorded above. Hosted-emulator acceptance is separate.

No appeal is needed for the current positive result. If a future confirmed
candidate is flagged again, use the official
[appeal form](https://support.google.com/googleplay/android-developer/contact/protectappeals)
with the VirusTotal-uploaded candidate hash, package com.lumenfall.app and a
factual remediation explanation. Do not represent the old vulnerable0.2.91 as
safe solely because it has the expected signature. Google's classification is
external and cannot be guaranteed never to change. The factual
[review draft](candidate-1000095/google-review.txt) is prepared but not submitted.
Preserve the exact candidate for review/promotion; identify any rebuilt APK by
its own hash. The stable update feed remains0.2.91 until the required integrated
release gates and exact-artifact promotion finish.
