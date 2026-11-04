# Lumenfall — current delivery status

4 November: [Play Protect investigation/PR39](tasks/PLAY_PROTECT_001.md) integrated
at12551152 (tested source4982932a; identical trees). Patched Capacitor6.2.2 and
production APK/debugger protections. Signed0.2.95, seven CI gates,190+1 cases,
save upgrade, updater and retail Android visible-launch checks PASS.
[Evidence and review draft](qa/play-protect-001/README.md). A user phone screenshot
now shows Google's "This app looks safe" result; the user confirms it came from
the0.2.95 ZIP. Exact-file stable promotion is in progress, awaiting the required
integrated-main release gates. No appeal needed for this positive result; the
regular update feed remains0.2.91 until promotion completes.

4 November: [All pending updates/PR38](tasks/ALL_UPDATES_RELEASE_20261104.md)
released as [Android0.2.91](https://github.com/xariib/Lumenfall/releases/tag/android-1000091),
source237fa928. Includes PR36 Rift health/navigation/layout and PR37 reduced
rendering/background work plus the native updater race fix. Seven PR/six release
gates,190+1 scenarios, signed upgrade/updater and public bytes/feed PASS.
[Receipt](qa/all-updates-release-20261104/release.json). Phone battery/thermal,
exact WebView60, TalkBack and human review remain open.

4 November: [Rift visuals/PR35](tasks/RIFT_VISUAL_UNLOCKS_001.md) released as
Android0.2.82, source278bb669: backgrounds, Wisp/enemy looks, clearer attacks and
gold dot. Seven gates, full regression, signed upgrade/public bytes PASS.
[Receipt](qa/rift-visual-unlocks-001/release.json); phone/human review open.

4 November: [Lab timers/PR34](tasks/LAB_TIMER_LAYOUT_001.md): merged57fd7ab3;
seven gates/190+1 and signed0.2.76 PASS. Included in0.2.82 above; phone review open.

2 November: [In-app updates/PR 33](tasks/IN_APP_UPDATES_001.md) released as
[Android 0.2.75](https://github.com/xariib/Lumenfall/releases/tag/android-1000075),
source e13c7669. Automatic checks, verified downloads and Android approval. Seven
exact-source gates/190+1, signed upgrade, actual updater/tamper/cancel tests and
anonymous exact-byte downloads PASS. [Receipt](qa/in-app-updates-001/release.json).
Both saves/paid work retained; phone/WebView 60/TalkBack/human review remain open.

31 October: [All updates](tasks/ALL_UPDATES_RELEASE_20261031.md) published as
[Android0.2.69](https://github.com/xariib/Lumenfall/releases/tag/android-1000069).
Seven gates/190+1, signed upgrade and public bytes PASS.
[Receipt](qa/all-updates-release-20261031/release.json); device/human review open.

[Earlier delivery records and evidence](PROJECT_STATE_2026-11-04_HISTORY.md)
retain the complete 16–31 October history, original requirements and limitations.

Physical-phone, exact WebView60 DOM, TalkBack and human pacing/performance acceptance
remain unverified. The available emulator test uses archived signed158 and synthetic
saves; no particular old version is required on the user's phone. Historical
pre-import Git objects unavailable404 remain a limitation. [Known issues](project/KNOWN_ISSUES.md).
