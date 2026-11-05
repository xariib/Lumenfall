# Pending-work synchronization — 5 November 2026

The user requested publication of work missing from main or the current app.
Baseline main was `ad49e21366e750f10835e24fd6c43a1cd3c58c12`; stable Android
was0.2.95 (`android-1000095`). Both local Git repositories and all22 original
worktrees were checked, followed by the remote branch inventory and open PRs.

Recovered355 previously untracked QA files,108,206,781 bytes, from Forge pacing,
Lab duration, Lab timer layout, Rift combat layout and Rift navigation. Each
original worktree now has an evidence commit included in the integration history.
[The manifest](local-evidence-manifest.json) records original heads, commits,
paths, lengths and SHA256 values. Their bytes were checked after integration.
Historical failures, partial outputs and pending results are retained as evidence
of their original sources; they are not new passing results for current main.

Rift combat's original local task edit is also preserved as an
[exact snapshot](rift-combat-local-task-checkpoint.txt). Its integrated task
labels that checkpoint as historical and retains the subsequent release status.
The historical queued mobile-power run report was recovered with the same
qualification. Documentation checkpoint branches were integrated while keeping
newer release/task status in conflicts. The old PR2 audit is now integrated and
explicitly identifies Android0.2.14/19 October as its baseline.

Four original local Git histories are additionally published under
`archive/pre-sync-20261105/`. Three are patch-equivalent to integrated commits;
the fourth is an older combined candidate. Its task and focused receipt are
preserved in `historical-all-pending-updates/`. Current product code and later
acceptance take precedence. [Branch dispositions](branch-disposition.json)
also identify already-published retired build/diagnostic branches and temporary
validation merge refs; these do not represent outstanding app features.

Verification: all355 file hashes and Git payloads, four task context/link checks,
source validation and whitespace checks. Product paths `index.html`, `fonts/`,
`branding/` and `mobile/` match Android0.2.95 exactly. Outside documentation and
the recovered `lab-mobile-evidence/` directory, this integration changes no
runtime, test, script or CI file relative to baseline main. A new signed APK
would therefore contain no app changes and was not needed. Existing device/
TalkBack/WebView60/human acceptance limitations remain in current project status.

No cleanup of old task folders was attempted during this synchronization;
historical cleanup-rejection statements describe the earlier attempts only.
The new synchronization worktree contains the reviewable integrated result.
