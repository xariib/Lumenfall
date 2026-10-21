# Lumenfall — current delivery status

21 October 2026: [WISP_ACTION_HIERARCHY_001](tasks/WISP_ACTION_HIERARCHY_001.md)
was integrated through [PR #3](https://github.com/xariib/Lumenfall/pull/3)
at `7a498e5be2d060476c9442435768ea1db15d725d`; all six relevant PR
workflows and [exact-main full validation](https://github.com/xariib/Lumenfall/actions/runs/39548886678)
passed. [PR #4](https://github.com/xariib/Lumenfall/pull/4) added installed
Android Wisp UI acceptance to the test driver only, passed all six final-head
workflows, and merged at `4a3085067797b292b32c179e4e4bbb8e33b640d1`.
The [non-publishing integrated Android run #21](https://github.com/xariib/Lumenfall/actions/runs/39559404175)
built signed 0.2.21 and passed an in-place installed upgrade on Android 12/
API31/WebView91: both saves, UID/origin, paid progression and legacy entitlements
survived. All eight Wisp cards fit at 320 px with their prices/effects and
accessible Next cue; an Android touch purchased one Ember Ability level and
returned focus with its refreshed name. APK SHA-256 is
`5141f8e54290a18854b125677f2f144690d055e06a0c07f95762b6d33d36a026`,
artifact `signed-apk-39559404175`. No new release has been published.
**Integrated and installed-emulator accepted; physical phone, exact WebView60,
TalkBack and human visual/pacing acceptance remain open. Do not mark complete.**

16 October 2026: combined endless-progression game released in xariib/Lumenfall as
[Android 0.2.14](https://github.com/xariib/Lumenfall/releases/tag/android-1000014), versionCode1000014.
[Download latest APK](https://github.com/xariib/Lumenfall/releases/latest/download/Lumenfall.apk); existing players install as an update without
uninstalling. [Completed migration](tasks/REPOSITORY_MIGRATION_001.md) and
[final identity/save/download evidence](qa/repository-migration-001/release/).

Released source: de1338cd40cca13a765cc42181a7f856d8711d6b, from selected codex/endless-progression8f46153.
Both selected history and original destinationeba021e preserved; PR1 merged.
All six exact-main required workflows and both Full jobs pass. Android12/API31/
WebView91 actual cold-save/in-place installed upgrade verifies original package,
certificate, origin/UID, BOTH slots, progression, paid work and legacy entitlements.
Anonymous stable download returns the exact verified signed APK bytes.

Current features include endless progression, permanent Wisp Mastery, late upgrade
guidance, affordability feedback, Formation controls and Wisp progression UI,
Forge/Lab/Tree/Comet/save/offline systems. Migration adds two proven CSS fixes and
pure Amount arithmetic performance changes; all other product JS/config/assets
match selected8f. Product SHA256d4a55cde9135d078a6da16ff85ddee831129c631312c30c1ea3c90efa00372e5.
[Preservation proof](qa/repository-migration-001/product-preservation.json).

Original requirements and earlier evidence remain in [Endless task](tasks/ENDLESS_PROGRESSION_001.md),
[requirements](qa/endless-progression-001/REQUIREMENTS.md),
[late guidance](qa/endless-progression-001/LATE_GUIDANCE.md) and
[pre-migration status snapshot](project/PROJECT_STATE_BEFORE_MIGRATION_2026-10-16.md).
Their pre-release statuses are historical; the migration task records this delivery.
Other chats/worktrees remain untouched. Self-review/automated validation only.

Physical-phone, exact WebView60 DOM, TalkBack and human pacing/performance acceptance
remain unverified. The available emulator test uses archived signed158 and synthetic
saves; no particular old version is required on the user's phone. Historical
pre-import Git objects unavailable404 remain a limitation. [Known issues](project/KNOWN_ISSUES.md).
