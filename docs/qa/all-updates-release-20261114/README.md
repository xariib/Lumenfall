# Combined APK continuation checkpoint — not yet released

Task: [ALL_UPDATES_RELEASE_20261114](../../tasks/ALL_UPDATES_RELEASE_20261114.md).
Validated game source: a3d125a57fa2b5e54419e2a8774c63f356204518, product SHA256
c921c7bb3d062de17e23ad1e9fc3cc9050aa0425d661d13bc9a6987f3fef5543.
PR53 combines missing PR50 Bond display with released0.2.117 Lab/currency/Deeds
and all prior improvements. Main is nowa3d125a5; public APK remains0.2.117 until
the current0.2.119 publishing run finishes.

All sixteen validation workflows passed. Manual full CI passed on its
first attempt. PR full attempt1 passed219 scenarios and failed only the first
Wisp setup check (original300ms ceiling, no profile completed). Attempt2 stopped
after16 passing Lab profiles/289 checks at a15s CDP touch-command deadline.
Attempt3 passed unchanged. Complete metadata/logs for both failed attempts
and the separate first Wisp causal setup failure are retained here.

Signed nonpublishing candidate0.2.118/run43639919453 passed identity/assets,
installed Bond/Deeds, save upgrade and real updater. Its first retail launch
inspection failed: screenshot shows the game, but UIAutomator could not obtain
idle/root state and retained only earlier startup XML. This is not a retail
gate pass. All36 original diagnostic files and a hash manifest are retained in
native-first-failure-43639919453/. Unchanged attempt2 passed. The downloaded
signed artifact matches exact source/assets, identity, all native/save/updater
receipts and the installed Bond catalogue. [Verification](android-candidate/verification.json).
Rift/Bond, Deeds and retail screenshots were visually inspected (self-review).
The candidate remains nonpublic; all source/native validation is passed.

Main is now the exact tested a3d125a5; PR50 and PR53 are merged. Public signed
Android run43646924641 is in progress. Do not advance main during publication.
Canonical fresh per-job REST logs and totals are in ci-log-summary.json:
both main suites report190 named scenarios plus viewport runs; isolated jobs1.
Earlier generic run-level CLI log captures are incomplete-archive diagnostics;
the cause of the discrepancy was not investigated.

No source, assertion, deadline or workflow change, and no source failure is
waived. Causes remain unproven. Physical-phone, exact WebView60 DOM, TalkBack,
human pacing/design and independent review remain unverified. Self-review only.

Resume in the same worktree. Validation ref release/all-updates-20261114 stays
fixed at a3d125a5; this documentation checkpoint is on its separate -evidence
branch. Do not restart already passing workflows or modify other worktrees.
Readiness/integration/public dispatch are complete. Monitor43646924641,
then verify the actual public APK and save final evidence/status. Do not push
main documentation during publication: the build requires exact main SHA.

Checkpoint helper snapshots are gzip files under checkpoint-helpers/. Extract
to the corresponding validation-evidence filenames when needed and adapt the
local gh executable path on another computer. They contain no credentials.
Canonical CI, signing and acceptance remain the unchanged repository workflows.
