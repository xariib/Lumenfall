# All updates GitHub release — 31 October 2026

User request: “Release a new version on github with all the new features/updates”.
Scope: publish the current integrated game as a signed Android GitHub release,
with meaningful release notes and durable validation/download evidence.
Owner: current release chat; no delegation. No gameplay or workflow changes.

Baseline main: `6e42b9eb17c45c4568acdfb63ae01efd1bc3299d`.
Previous public release: Android 0.2.58, tag android-1000058, source532c87e5.
Isolated checkout: release-all-updates-20261031, detached at baseline.
All feature PRs28–32 are integrated; only unrelated documentation PR2 is open.
Includes continuous offline Lab and tougher automation Deeds, direct Rift
navigation, early tap balance, Auto-Ascend Ritual challenges and Lab Speed Up
duration/speed presets. Existing owners, saves, purchases and paid work retained.

Acceptance: all seven current validation workflows on exact integrated main,
including both complete pre-merge jobs; established Android publish workflow;
package/signing/assets/origin checks and exact-APK installed upgrade receipt;
anonymous public download hash equality; notes listing all changes since0.2.58.
Physical-phone, exact WebView60, TalkBack and human pacing/design checks remain
open and will be reported separately. Self-review/automation only.

Status: public release and automated delivery acceptance COMPLETE.
[Android0.2.69](https://github.com/xariib/Lumenfall/releases/tag/android-1000069),
code1000069, published from the exact baseline above with the established workflow.
Package com.lumenfall.app and signing certificate remain unchanged.
Workflow triggers, version logic, signing and acceptance gates were not changed.
Other worktrees and their uncommitted work are untouched.

All seven exact-main workflows/nine jobs PASS: pre-merge41175561349,
Comet41175563280, Forge41175565046, Lab41175567111, shared UI41175568873,
Tree41175570632 and permanent41175572390. Main job124462273920 passed190
scenarios and runtime smoke; isolated job124462274094 passed its original
offline scenario. Both job-log exports are preserved as compressed evidence.
Local source validation, APK identity verifier self-test and task/context PASS
on Node24.20.0. No product/test/workflow changes from prior accepted head8e4ec15e.

[Publishing build41179930345](https://github.com/xariib/Lumenfall/actions/runs/41179930345)
PASS, attempt1. The exact signed APK passed identity, all15 packaged source assets,
https://localhost origin and installed Android12/API31/WebView91 upgrade checks.
Both save slots, UID, progress, paid work and legacy purchases were retained.
The public release includes its checksum, source commit, assets, identity and
exact-APK upgrade receipts. Release notes list all PR28–32 changes since0.2.58.

Anonymous versioned and stable-latest downloads have identical7075322bytes,
SHA2567dc4ef4d882d8d44f6575566e982a5f4c1c635e5bbe3ee0e50f5c8fa09890811.
The downloaded APK's certificate was independently extracted and matched the
established fingerprint. Public production assets equal the source and build
receipt; exact downloaded bytes match the installed-upgrade receipt.
[Complete release evidence](../qa/all-updates-release-20261031/release.json)
and [release notes](../qa/all-updates-release-20261031/release-notes.txt).
Local APK and verification downloads: ../builds/all-updates-release-20261031/.

Only this task, shared release status and evidence were added/updated.
Self-review and automation only. Physical phone, exact WebView60, TalkBack and
human pacing/design acceptance remain open; their feature tasks are not closed
or archived. No new binding rules. No further release implementation remains.
Next: install the published APK as an update and record physical/human acceptance.
