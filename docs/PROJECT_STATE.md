# Lumenfall — current delivery status

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

19 October 2026: [PRODUCT_BASELINE_AUDIT_001](tasks/PRODUCT_BASELINE_AUDIT_001.md)
reviews the released experience, separates verified defects from design findings
and device-acceptance gaps, and prioritizes focused improvements. No product
code or APK was changed for the audit. Its first proposed implementation task
is WISP_ACTION_HIERARCHY_001; no implementation is started by this status note.
