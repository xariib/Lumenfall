# Lumenfall — current delivery status

16 October 2026: [REPOSITORY_MIGRATION_001](tasks/REPOSITORY_MIGRATION_001.md)
is migrating the explicitly selected combined candidate8f46153 from
codex/endless-progression to xariib/Lumenfall. Signing/versioning/CI/native and
release verification are IN PROGRESS. No new release is claimed yet.
Qualified Android12/WebView91 preflight38900729111 passes actual old158 cold save,
install-r, original certificate/package/origin/UID, both slots, progression and
paid work/legacy entitlements. [Verified receipt](qa/repository-migration-001/qualified-native-upgrade.json).
Main is integrated at c9346ec; five scoped exact-main lanes passed. Full CI found
three stateful failures; focused fixes/diagnosis and new exact-main validation
are in progress. Publication remains pending.

The current game includes endless progression, permanent Wisp Mastery, late
upgrade guidance, affordability feedback, Formation controls, Wisp progression
UI and the previously combined Forge/Lab/Tree/Comet/save/offline work.
[Endless task](tasks/ENDLESS_PROGRESSION_001.md),
[continuation](qa/endless-progression-001/experiments/CONTINUATION.md),
[requirements](qa/endless-progression-001/REQUIREMENTS.md) and
[late guidance evidence](qa/endless-progression-001/LATE_GUIDANCE.md) retain
source-qualified results. Original product9cdcd80c is preserved in history. Migration adds native Comet scrolling and enlarged Wisp effect text wrapping CSS
fixes plus a pure Amount integer/parsing performance optimization. All other
production JS remains unchanged; full offline gate is byte-identical to selected
source and passes locally in237s. Current SHA256
d4a55cde9135d078a6da16ff85ddee831129c631312c30c1ea3c90efa00372e5.
[Exact preservation proof](qa/repository-migration-001/product-preservation.json).

Original signing identity has been [recovered and verified](qa/endless-progression-001/signing-recovery/README.md).
Package com.lumenfall.app and existing Capacitor/save identity must be preserved.
The old repository run counter cannot determine new Android versions by itself.

Inherited full G4 run:215PASS/five deadlines; isolated retries pass. Required
Linux CI, combined acceptance and Android installed-update/device/
WebView60/TalkBack/human acceptance remain open. Desktop evidence is not native
acceptance. Self-review only. Other feature chats/worktrees remain unchanged.

[Complete pre-migration status snapshot](project/PROJECT_STATE_BEFORE_MIGRATION_2026-10-16.md)
preserves all earlier milestones and their limitations verbatim.
See [known issues](project/KNOWN_ISSUES.md) and the feature task before continuing.
