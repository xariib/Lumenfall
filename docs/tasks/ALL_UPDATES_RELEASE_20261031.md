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

Status: validation running on baseline; public release pending. Workflow
triggers and release/version/signing gates reviewed unchanged. Other worktrees
and their uncommitted work are untouched. Record final run IDs, version and
hashes in docs/qa/all-updates-release-20261031/release.json after publication.
Local source validation, APK identity verifier self-test and task/context PASS
on Node24.20.0. No product/test/workflow changes from prior accepted head8e4ec15e.
Exact-main workflow runs: pre-merge41175561349, Comet41175563280,
Forge41175565046, Lab41175567111, shared UI41175568873, Tree41175570632,
permanent41175572390. Lab, Comet, UI, Tree and permanent PASS; isolated offline
job124462274094 PASS. Main/Forge remain running; no observed failures.
Release notes prepared at ../builds/all-updates-release-20261031/release-notes.txt
(outside repository); they cover PR28–32 and preserve open device acceptance.
Next: await seven workflows, inspect failures if any, then dispatch publishing
Android build on unchanged main and verify its public APK and receipts.
