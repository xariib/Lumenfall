# Rift formation bond display

14 November 2026. Owner: this feature chat. Status: in progress.

## Requirement and scope

User: "On rift screen the formation bond names, their boost should not be shown,
it should only be shown in the wisp menu".

Keep active bond names and Wisp partner markings on Rift. Remove the separate
bond boost list, including its accessible descriptions. Preserve full Formation
Bond effects in the Wisp menu, actual bonuses, purchases, saves and progression.
No balance, schema or binding-rule change.

## Baseline and acceptance

Main `858d713f` (Android 0.2.111), isolated branch `fix/rift-bond-display-001`,
worktree `validation-evidence/rift-bond-display`. No open PRs were returned by
the live GitHub query. Other worktrees and root attachments remain untouched.
Read [startup](../../PROJECT_BOOTSTRAP.txt), [state](../PROJECT_STATE.md),
[workflow](../project/FEATURE_WORKFLOW.md), CODEX_START and CONTEXT_INDEX.

Acceptance: Rift names and partner markings remain; no Rift bond boost rows;
full Wisp menu effects remain through formation changes and zero-level members;
focused core/browser tests and required CI pass; integrated source and required
Android acceptance are recorded. Physical-phone, exact WebView60 and TalkBack
acceptance remain unverified until observed. Self-review is not independent review.

## Checkpoint

Baseline code renders a distinct `rift-bond-effects` list from active bonds.
Relevant tests currently require that list; update them to assert the requested
absence while retaining partner identity, full Wisp details and mechanics checks.
Implemented: removed only the Rift boost-list markup, renderer and dedicated
CSS; retained summary names, partner marks and Wisp effects. Updated existing
Rift and Formation tests and guidance geometry snapshots for that contract.

Local checks (Node 24.22.1, Chromium 157.0.8103.79): source validation; baseline
and changed bond mechanics (eight cases/six negative controls); Rift contract;
full Bond descriptions; 12 Formation mobile profiles (320/390/430px, normal/2x
text, normal/reduced motion), touch/keyboard and clean teardown: PASS.
Windows sandbox initially prevented Chromium startup; outside-sandbox retry
passed. The generic offline generator retains stale pre-PR42 expected totals
and failed after producing the current canonical totals. The existing paired
`rift-theme-parity.cjs --write` passed all four eight-hour one-second windows
against released source and canonical complete-state hashes. Only the current
reference's source SHA changed; no outcomes were rewritten.

Next: required CI, integration and Android delivery. Feature remains open.

[PR50](https://github.com/xariib/Lumenfall/pull/50) opened. The existing installed
Android upgrade check now records absence of Rift boosts, retained active names
and all eight full Wisp boost descriptions. Its synthetic fixture must exercise
at least one active Bond. This runs within the existing signed build acceptance.

First PR premerge (`43573388783`) failed its startup budget before product tests.
Baseline shared startup plus EXPLOIT_BALANCE_HUNT_001 already totals 33,030 bytes
(limit 32,768); adding this task's status increased that. Shortened the completed
Rift theme summary in PROJECT_STATE, retaining its evidence/limitations links.
No CI limit or acceptance assertion changed. Rerun required on the new commit.

## Superseded 75d24f52 checkpoint

Final candidate: `75d24f5273a5fc8b2ee8bef8f42b015884b813ba`; PR50.
Product SHA unchanged at `95a077ce05faf9e79f16f9851767eb6b2b99372a31191474da2fcfd80b9c48be`.
Both native Rift suites passed (six profiles/24 samples total), including the
old-boost-list negative control. Selected screenshots self-reviewed; no
independent review. Baseline/changed mechanics and 12 Formation profiles pass.

Eleven of fourteen applicable exact-source PR/dispatch workflows have passed;
both broad premerge runs are still active. Wisp Linux first failed its existing
300ms setup deadline, then passed an unchanged failed-job retry. Windows passed.
Tree dispatch `43574706416` first timed out (25s) before any QA result; even its
Chrome version query timed out. Original raw failure payloads and artifact ZIP
SHA256 are retained under `docs/qa/rift-bond-display-001/tree-first-failure`.
Its same-source retry is requested; no cause is established. Two Prism workflows
are inapplicable under their existing branch-only conditions. No gate weakened.

Next: monitor final-source CI with `validation-evidence/rift-bond-delivery.cjs`
(`status`, then `ready`); it verifies source, baseline, every applicable job and
PR before `promote` fast-forwards exact tested source and `publish` dispatches
the signed main build. `validation-evidence/verify-rift-bond-release.cjs` verifies
the successful build/native Bond receipt, exact anonymous APKs and public feed.
Save final receipts/status on GitHub after delivery. Main integration and Android
acceptance remain pending. Root/other feature worktrees remain untouched.

## Historical baseline compatibility correction

The broad PR/dispatch runs above failed the immutable Guidance baseline because
the new mobile absence assertion was also applied to that frozen old game.
Raw first failure is preserved under `guidance-first-failure`. Restored the old
Bond layout checks only when the existing exact-hash `legacyReadout` flag is
true; the current game and its mutations still require no boost rows. Historical
source/archives are unchanged. The complete Guidance gate now passes locally:
historical word-fragmentation failure, current five hints and Ascend-ready hint,
width/title/full-CSS negative controls, original fonts/assets and clean browser
exit. The product SHA and gameplay remain unchanged. Final-source CI must rerun.

Latest corrected candidate: `b062bff0e3cbffe031407e64bed6a96998429331`.
At 09:23 UTC, twelve of fourteen applicable workflows pass. Premerge PR
`43578985181` and dispatch `43578990935` remain active, with both isolated offline
jobs passing. Final-source Linux Wisp setup again missed its unchanged 300ms
deadline; the unchanged failed-job retry passed (Windows also passed). Raw
receipt is retained under `wisp-final-first-failure`. CI watcher session `33052`
runs `validation-evidence/wait-rift-ci.cjs` and exits on failure or all 14 passes.
Do not commit this delivery checkpoint while the exact-source gates/build are
running; save final status/evidence after publication. Next: `ready`, `promote`,
`publish` using this exact SHA, then verify the signed build/public bytes.

## Main advancement and combined validation

All fourteen applicable workflows passed on `b062bff0` (watch completed
10:13 UTC); no open review threads/reviews were returned. The protected main
comparison stopped integration before any main/publication mutation: actual
main advanced to `e67c984f7faf120818f5285175751586a1cf43cd` with currency and
progressive Deeds work. Preserve both features and their native Deeds assertions.
Their task records report candidate native upgrade/updater success, but final
retail/integrated acceptance remains pending. The currency owner has been
diagnosing the shared retail inspection helper; do not overwrite that work.

Next: merge current main into this isolated branch, resolve only shared status
and reference bindings, verify combined UI/mechanics/replay, and rerun required
exact-source CI. The prior fourteen passes are historical candidate evidence,
not acceptance for the combined source. No chat/message coordination authorized.
