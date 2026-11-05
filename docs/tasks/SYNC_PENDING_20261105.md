# Pending repository work — 5 November 2026

User request: "Is there anything which is not pushed to main or new version,
if there is then do it."

Goal: audit both local repositories, their feature worktrees, remote branches
and open PRs; publish missing coherent work and verify whether a new APK is needed.
Owner: this task chat. Branch/worktree: maintenance/sync-pending-20261105 /
sync-pending-20261105. Baseline main: ad49e21366e750f10835e24fd6c43a1cd3c58c12.

Acceptance: preserve current product, saves and release identity; save previously
local evidence with its original provenance; integrate relevant missing documents;
retain historical/superseded candidates without restoring old product snapshots;
pass context, diff and source-preservation checks; push and verify remote main.

Initial findings: all tracked app files are clean in every worktree. Main and
Android 0.2.95 have identical index.html, fonts, branding and mobile trees. Changes
since that release affect Wisp test tooling/workflow and documentation only.
Five feature worktrees retain 355 untracked QA files (about 108 MB uncompressed)
and Rift combat has one historical task checkpoint edit. PR2 is a documentation
audit of the 19 October product, never integrated. Several superseded checkpoints
and equivalent imported commits remain outside main's ancestry.

Scope: evidence/documentation synchronization only. Historical failures and
pending statuses describe their original sources, not new acceptance results.
No new APK is needed unless the audit finds app changes absent from 0.2.95.
Physical-phone, exact WebView60, TalkBack and human acceptance remain as recorded
in [current project status](../PROJECT_STATE.md).

Status: integrated locally, final remote push/verification pending. Recovered
all355 QA files and the Rift task edit; merged five evidence commits, historical
PR2 and the documentation checkpoint branches. Four superseded/equivalent local
Git histories are also published as archive/pre-sync-20261105 branches. Retired
diagnostic/build branches remain historical; no unintegrated app feature found.

Checks: four task context/link/startup-budget checks PASS; source validation PASS;
git diff --check PASS; all355 SHA256 values match; app paths match0.2.95. No
runtime, test, script or CI change relative to the initial main. See the
[evidence and dispositions](../qa/sync-pending-20261105/README.md).

Next: push the verified fast-forward result to main, refresh local canonical main
and verify remote head, original worktree cleanliness and PR2 merged status.
No new binding rule or gameplay decision. No additional APK is needed.
