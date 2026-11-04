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

## Remaining external work

The dedicated local BlueStacks test phone is obscured by an existing Windows
Firewall prompt for adb.exe; package queries also return "error: closed". The
user was asked to dismiss the prompt. No successful local install is claimed and
no unrelated emulator was touched. Local browser automation is disabled in Work
settings. No VirusTotal upload or Google appeal has been submitted.

After verifying the corrected candidate, obtain a fresh Google scan on its exact
hash. If still flagged, use the official
[appeal form](https://support.google.com/googleplay/android-developer/contact/protectappeals)
with the VirusTotal-uploaded candidate hash, package com.lumenfall.app and a
factual remediation explanation. Do not represent the old vulnerable0.2.91 as
safe solely because it has the expected signature. Google's classification is
external and cannot be guaranteed never to change.
