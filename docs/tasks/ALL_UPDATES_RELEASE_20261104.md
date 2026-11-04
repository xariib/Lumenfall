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

Status18:20UTC: final candidate237fa928 is pushed in PR38; seven PR and six
release workflows are running. Signed build41885250652 is Android0.2.91.
The complete corrected local Guidance driver PASS:16 profiles/160 samples,
identical compared states, unchanged geometry assertions/causal controls,
zero runtime errors and clean browser exit. Both remote isolated offline jobs,
Lab/Comet/progression pass. Main and public latest remain67a9b580/0.2.82.

Next: finish exact-head full CI/native acceptance, fast-forward integration,
publish the verified signed artifact, verify public bytes and updater discovery.
Earlier candidate/checkpoint history follows; it is not a publication claim.

Temporary ownership: ignored validation-evidence/all-updates-release-20261104
and mobile/www in this isolated checkout hold disposable scripts/staging/tests.
Durable evidence belongs in docs/qa/all-updates-release-20261104. Preserve this
worktree and final build deliverables; clean task-owned staging after completion.

Combined candidate: 388030c6f9994a0c84aa83c153510d94b9ca0081, PR38.
Source SHA2561173423bdb0d899616bd3a77b4f3931d8bcde5f5b67d90209f27a1b01f2e65e4.
The original historical source failed the new aria-describedby/layout assertion
before reaching its intended Guidance failure. The driver now selects the exact
original HP/formation assertion only for that immutable baseline SHA; current
candidate and all causal mutations retain the new layout/accessibility checks.
No product change was needed. Combined script-scope proof compares against PR37
and restores exactly four requested navigation removals; all other JavaScript
and all accepted independent offline outcomes/hashes remain unchanged.

Local Node24.20/Chromium156: source/context,88 navigation checks, updater controller,
37 native trust-policy checks, production Java completion-order/causal tests,
47 combined lifecycle checks and updater browser layouts at320px/200% and390px
PASS. Java was initially absent from PATH; using the existing task-local JDK17
resolved it. The initial Guidance reproduction also reported Windows browser
teardown timeout; Linux CI remains required for the complete historical probe.
Self-review/automation only. Signed build41875211866 is version0.2.90 and pending.
Six release-dispatch workflows run the same immutable candidate in parallel with
PR validation; fast-forward integration must retain that exact commit and all
publication gates must pass. Public release is not yet claimed.
Next: monitor PR38 and release CI/native build; fix any failure, then integrate
the verified commit and publish its exact signed artifact/checksum as latest.

Native milestone: signed Android0.2.90/build41875211866 PASS. APK7102619bytes,
SHA256cfc94a3b853439d44d40d37d14f706f391ba6b4bcf39766e7168172844ae14fe.
Package/signing, exact production assets, origin, both save slots/UID/paid work,
real previous/next navigation and appearance selection PASS. Native updater
checks cancel, source permission refusal, verified restart, tamper rejection,
Android installer cancellation and approved installation of official0.2.82 PASS.
That fixture uses candidate updater code with a lower test version; it does not
claim physical-phone acceptance or an actual0.2.82→0.2.90 updater run.
Downloaded artifact ZIP digest verified; local exact-APK asset/upgrade checks PASS.
Native receipts/screenshots/logs copied under ../qa/all-updates-release-20261104/native/.
Remaining: full browser release gates, integration, publication and public feed checks.

Cleanup of this checkout's mobile/www was rejected by exec_command with exactly
"blocked by policy" and no specific reason. Read-only verification confirms the
exact task-owned path,15 source-identical disposable assets and no links/.git or
deliverables. No supported escalation exists; no alternate deletion route used.
Exact path and evidence: ../qa/all-updates-release-20261104/cleanup.json.

Both full CI runs pass the repaired historical Guidance gate. Several focused
jobs show every step, including Complete job, succeeded while run/job conclusion
remains null/in_progress. Publication still requires actual success conclusions.
GitHub's Actions/Pages incident on4Nov reported delayed job statuses and was
marked resolved17:01UTC: https://www.githubstatus.com/incidents/xr3myzj7ms51 .
The cause of these specific stale statuses is unconfirmed. A normal rerun of
completed Shared UI job126732648435 returned403 already-running; normal and
documented force-cancel endpoints both returned409 not-in-progress. No action
was accepted and no rerun started. Attempt-specific, uncached and current-API
version reads still return null conclusions. Receipts and completed logs are in
status-diagnostics/ and stale-ui-status.json under this task evidence.

17:43UTC checkpoint: both full jobs are in the190-scenario regression suite.
Main remains67a9b580 and public latest remains0.2.82. Candidate388030c6 and signed
0.2.90 remain unchanged. Finish both full suites and obtain actual successful
workflow conclusions before integration/publication; never infer overall PASS
from stale incomplete metadata. A separate docs checkpoint preserves current
evidence without moving the tested PR38 head.

17:45UTC: delayed GitHub statuses recovered without any accepted cancellation
or rerun. All focused PR/release workflows now report success. Only full PR
41875209044 and full release41875873731 are running their190-scenario suites.
The signed0.2.90 candidate and tested source remain unchanged.

18:04UTC: release full run41875873731 failed only rift-guidance-mobile in the
190-scenario positive suite: Farm HP x228.390625→215.1875, width59.40625→72.609375,
right edge unchanged. The driver independently advances combat120ms before
normal/long and text-size comparisons, so natural-width HP can differ with live
damage/kill timing. Failed raw results/log and verified artifact digest are in
../qa/all-updates-release-20261104/guidance-comparison/. Publication remains held.
The driver now reuses the first post-live state per viewport/motion/fixture,
retaining every live warm-up, geometry/readability/input/save assertion and
negative control. It additionally requires identical HP text and complete state
hashes before comparing hint length or text size. Product bytes are unchanged.
Full local mobile comparison and all exact-head remote gates must pass before
integration; a new signed build will bind the final test/source commit.
PR full41875209044 independently failed the same Farm HP comparison (second
profile,20 samples); no other positive regression failed in either full run.
Local corrected driver has passed the smallest normal/200%-text comparisons;
remaining profiles continue while the exact-head remote validation restarts.
