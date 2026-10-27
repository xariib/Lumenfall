# PERMANENT_PROGRESSION_RELEASE_001

Goal: deliver an installable Android update containing the changes integrated
through [PR14](https://github.com/xariib/Lumenfall/pull/14).

The user requested the remaining work on 27 October 2026: "Hvad mangler du at
gøre, udfør det" after integration and the outstanding APK/phone test were
reported. This delivery includes the signed APK and GitHub release needed for
phone testing. It supersedes the earlier implementation-only hold on APK
publication. No further gameplay change is included.

Requirements: [permanent progression](PERMANENT_PROGRESSION_UI_001.md).
Preserve saves, paid progression, package com.lumenfall.app, established signer,
assets and existing validation gates. Update release copy to describe visible
upgrades and permanent Astral investments rather than retired commands or
upgrade disclosures. Keep README concise.

Delivery steps:

1. Freeze the integrated source and accurate release copy on main.
2. Run the existing mandatory workflows on that exact main commit. Include the
   complete behavioral and isolated offline jobs; do not bypass the release gate.
3. Run Build Android APK on main with publication enabled. Its existing signing,
   packaged-source and installed-upgrade checks must pass before publication.
4. Verify the published APK, version, checksum and packaged source using the
   actual downloadable bytes. Provide the direct download link.

Physical-phone interaction, exact WebView60 DOM, TalkBack and human pacing need
device acceptance. Do not mark those complete from browser or emulator results.
The user can install the delivered APK over the existing app without
uninstalling, then test visible upgrades, Lab selection/Speed Up, earlier Rift
farming and saved progression.

Current delivery and automated validation are tracked by GitHub Actions and the
repository's Releases page. Keep this task open until the APK is available and
the remaining device acceptance is recorded.
