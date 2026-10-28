# Game verification and signed APK release — 28 October 2026

## Scope and authorization

User request: check the game, then publish an APK release to GitHub. The user
explicitly authorizes necessary Git/GitHub writes and publication in this task.
Owner: this game-check/release chat. One goal: verify and release the latest
accepted integrated game. No unrelated design, balance or save-schema changes.

## Baseline and preservation

Initial main: `35c52202b316ea393d3a95f69c23ceb4906e6694`.
Public APK: Android 0.2.48, tag `android-1000048`, source `0f2445e3`.
Open PR17 carries the already approved Lab queue/Speed Up change. PR2 is a
historical documentation-only audit and remains outside this delivery.
PR17 head `f305ee3326b0076c123194e38a0d9c43e9b9127a` passed all seven relevant
PR workflows, including both full jobs (189 main scenarios plus isolated offline),
runtime smoke and focused mobile/negative controls. Self-review found no
release-blocking change; this is not independent review.
PR17 merged with an expected-head lease at `bdb341eeba6f781850f8e34693138c6251657de5`.
Integrated product/tests/mobile/workflows are identical to that tested head.
Product SHA256: `5ce88b6ce6f874935fd65e6182acab01069d0eaa61dab2ec904ec0c18419cc7f`.

Preserve package `com.lumenfall.app`, established signing certificate, assets,
origin/UID, both save slots, paid work/boosts, legacy purchases, progression,
chronological online/offline behavior, automation and all existing test gates.

## Acceptance and evidence

- Review release delta and preservation-sensitive code/test changes.
- Run source/context/identity tooling and targeted current-source regressions.
- Run all seven relevant workflows on the exact integrated main commit. Require
  both full regression jobs and all applicable steps to pass before publishing.
- Build using the existing signed Android workflow with `publish=true` only
  after those gates pass. Require package/version/signature, packaged assets,
  installed emulator upgrade and exact-APK receipt gates.
- Verify public latest release, APK/checksum/commit and packaged source.
- Save exact run/commit/release evidence and update project status on GitHub.

Fresh local checks on integrated product: source validation PASS; queue continuity
64 checks PASS; APK identity negative self-test PASS (Node24.22.1).
Tooling, Lab2676/negative controls, paid boosts1480, pacing221/five controls,
Ascend feedback78/four controls and permanent offline214 also PASS.
Prior candidate Android run40586397665 attempt2 passed native upgrade acceptance
for identical product bytes, but is not a substitute for this release's APK gate.
PR validation: https://github.com/xariib/Lumenfall/actions/runs/40594218959

## Status and next action

Released and verified; physical/human acceptance remains open.
[Android0.2.51](https://github.com/xariib/Lumenfall/releases/tag/android-1000051),
versionCode1000051, source `d3420c1526bec40e07b3bda8f5af1109c89c5b94`.
Product bytes still match the reviewed/tested PR17 head. No additional product,
test, deadline, signing or workflow change was made in this delivery task.

[All seven exact-source workflows](../qa/game-check-apk-release-001/ci-final.json)
PASS, including both complete jobs (189+1 scenarios), causal controls and guarded
runtime smoke. [Android run51](https://github.com/xariib/Lumenfall/actions/runs/40647708530)
PASS on attempt1: package/version/signer/assets, actual installed API31/WebView91
upgrade from signed158, both saves, paid work, UID/origin, legacy purchases and
native Wisp purchase/Farm-to-Lab navigation. This uses synthetic saves.

[Public download verification](../qa/game-check-apk-release-001/download-verification.json)
PASS: anonymous stable link HTTP200, 7,062,776 bytes, all15 packaged assets match,
original certificate extracted, actual tag/commit and exact native APK receipt
match. APK SHA256 `9d64651cbb35477d0dcd1a9bffd8e0fbb56bca3b48e58c47b33a01a7b86e736b`.
[Complete release evidence](../qa/game-check-apk-release-001/release.json).

Retained failures: run40640183538 hit the unchanged startup32KiB limit
(20648+12299=32947). Historical PROJECT_STATE summaries were condensed with
task/evidence links and Git history retained; all22 workflow/task contexts pass.
Then Chrome startup failed before assertions in the full job and Lab speed job
(`Browser.getVersion`, checks0; Lab also hung during browser-close teardown).
Only affected jobs were rerun on identical source. Both pass on attempt2;
no assertion, deadline or gate was weakened. Details are in the CI/release JSON.

Self-review and automated checks found no new product release blocker; no
independent review is claimed. Two P2 enforcement observations are recorded in
the release JSON: main is unprotected, and the release gate names six workflows
while this delivery manually required all seven. Neither setting was changed.

Next: install as an update without uninstalling, with a Settings backup first.
Physical phone, exact WebView60 DOM, TalkBack and human pacing/performance remain
unverified. Keep those acceptance items open; do not archive as fully accepted.
No subagents or unrelated product edits used.
