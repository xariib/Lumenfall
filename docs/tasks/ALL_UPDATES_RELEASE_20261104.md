# All updates release — 4 November 2026

User request: “Now i need all the updates to be pushed to a new version and
github. Remember also possibility to update ingame”.

Owner: current release chat, no delegation. Goal: integrate all pending product
updates and publish a signed Android release discoverable by the in-game updater.
Baseline main: 67a9b580; published Android0.2.82 source278bb669.
Isolated worktree/branch: release-all-updates-20261104 /
release/all-updates-20261104. Other worktrees and uncommitted work are untouched.

Pending changes: PR36 Rift health/navigation/layout (429a89a5) and PR37 mobile
rendering/lifecycle optimization plus native updater completion ordering
(c67c4c2d). All other feature branch tips are already ancestors of main.
Preserve gameplay, saves, purchases, all previous updates, package and signing.
No new binding rule, balance or save-schema change.

Acceptance: combined source passes all seven validation workflows, both full
regression jobs, signed APK identity/assets and installed save-upgrade/updater
acceptance. Integrate verified source, run required exact-main release gates,
publish latest stable APK with its checksum and clear release notes, and verify
anonymous download bytes and updater discovery. Physical phone, battery/thermal,
exact WebView60, TalkBack and human review remain separate unverified checks.

Status: in progress. PR37 seven gates and native41862842909 now PASS. PR36 six
focused gates PASS; pre-merge41844392956 failed in historical Guidance baseline
acceptance (expected fragmentation cause, received null), requiring diagnosis.
Combine changes locally and retain original historical assertions. Only merge
conflict is the independent offline oracle source hash; original expected
state/reward values must remain unchanged and combined binding must be verified.

Next: repair historical harness compatibility, validate combined source, push
reviewable release branch and run CI/native acceptance before publication.

Temporary ownership: ignored validation-evidence/all-updates-release-20261104
and mobile/www in this isolated checkout hold disposable scripts/staging/tests.
Durable evidence belongs in docs/qa/all-updates-release-20261104. Preserve this
worktree and final build deliverables; clean task-owned staging after completion.
