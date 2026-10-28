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
Prior candidate Android run40586397665 attempt2 passed native upgrade acceptance
for identical product bytes, but is not a substitute for this release's APK gate.
PR validation: https://github.com/xariib/Lumenfall/actions/runs/40594218959

## Status and next action

Integrated; release validation in progress. Run seven exact-main workflows,
then publish and verify the signed APK. Keep this task open if a required gate
fails or is blocked. Physical phone, exact WebView60 DOM, TalkBack and human
pacing/performance acceptance remain unverified; emulator/browser tests do not
claim those results. No subagents or unrelated product edits used.
