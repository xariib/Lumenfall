# PERMANENT_PROGRESSION_UI_001

Status: recovery and implementation in progress; not integrated; no APK release.
Baseline main: 73f4e3f17504cba50276a17c374d7c4c78a5f7f5 (Android 0.2.43).

The user explicitly approved source upload to the public xariib/Lumenfall repository and creation of a PR on 27 October 2026: "Godkendt", responding to the exact upload/PR permission question. Prior automatic-review upload refusals are superseded by this explicit user approval.

Scope: remove Wisp upgrade disclosures; keep upgrades visible until their paths are maxed/gold. Rift-locked upgrades show Unlocks at Rift XX without prices. Five compact Lab rows select research without Change buttons; separate slot-owned timed Speed Up. Choose earlier cleared non-boss Rifts to farm without Ascending, including a 12-Rift-back shortcut, while retaining Push frontier and saves. Fixed Forge multipliers buy exactly the selected number or nothing; Max may buy a remainder. Retire Comet commands in favor of permanent Wisp-strengthening investments, with once-only exact refunds for former command purchases.

The prior local candidate ec469758/product 9dfb3b38 and its 149220-byte patch disappeared in a workspace reset before this approval. That commit was never uploaded and cannot be fetched from GitHub. Library lookup did not recover the patch. Reconstruct from the verified baseline and the visible implementation history; rerun acceptance on the new exact source. Do not label prior test results as current proof or claim byte-identical recovery without matching hashes.

Prior design: Astral Core at Rift250/750Comets, Astral Echo Rift500/1250, Astral Convergence Rift1000/2000; ten permanent levels per path, costs grow20% per level. Per-rank factors1.25/1.3/1.25. Schema6 protects paid levels; preserve immutable old ownership/levels and refund original known prices once, retaining unrepresentable credits pending. Auto-Ascend remains100Comets. No tournament or mission-box system was authorized or invented.

Preserve original assets, other economy/progression, paid research and deadlines, offline chronology, Auto-Ascend, both saves, recovery, package and certificate. No transient touch glows. No subagents. Follow root AGENTS.md and mandatory CI. Original Comet/disclosure and partial-batch tests encode superseded behavior and need requirement-sensitive updates, retaining relevant migration/arithmetic/rollback/chronology coverage. Full CI and Android acceptance are pending. Do not merge failed gates or publish an APK in this scope.

Next: recover source/test candidate, validate it, publish source and evidence to this branch, create the authorized PR, resolve regression results before integration. Keep work open until acceptance is evidenced.

## Recovered candidate — 27 October 2026

Source SHA-256: 5956cc78a67d0f414bf1fa3ea41592727ff21e8a877f98fd3eb35cd2261b861c. This reconstruction follows the approved behavior but is not byte-identical to the lost candidate. New acceptance: 3,736 core checks, 208 offline checks, 9,335 Forge assertions and 25 negative controls, 2,676 Lab checks and 10 negative controls, 13,416 price-cache checks, 228 existing slot checks, 416 browser checks across 18 profiles. Browser controls use actual touch/keyboard at320/390/430px,100/150/200%text and normal/reduced motion. No browser runtime errors. Relevant screenshots are retained.

The first large-file upload was found to be truncated in transport before any PR or main integration. It was replaced using bounded Base64 chunks; the uploaded Git blob is verified to exactly equal local eb839d25f280804dfb550036ad9f24916199b532. Corrected branch commit ec7a41638cda22d303576241a812d0cec1bd1d38. Only the isolated feature branch was affected. Future writes use exact blob verification.

[Current receipts](../qa/permanent-progression-ui-001/candidate.json). The focused tests are not full CI acceptance. Old command/disclosure/partial-batch tests still need requirements-aware adaptation. The original Forge suite retains its full price/effect/debit, persistence and negative-control checks, now requiring fixed batches to buy exactly or refuse. All original workflow gates remain enabled. No merge or APK release until required checks pass.

## Regression continuation checkpoint

PR: https://github.com/xariib/Lumenfall/pull/14 (draft). Original focused progression CI and Shared UI CI passed on ba2390dd. Main is unchanged. Current source363cbbbfebb5d9dae347994475c684b99a695c423cd5c91d1ee800a5338db82d adds preservation of a pre-retirement already-called enemy's earned objective and visible native Speed Up focus. Original numerical Comet suite retains over1,097,000 assertions and8 controls; current core retains over12,000 checks plus11 semantic mutants. Existing Forge/Lab cap preservation, exact wide Comet payments and legacy Trials pass. Clarity browser acceptance passes524 checks across18 profiles after replacing obsolete disclosure expectations with direct enabled action focus.

Work remains open: adapt legacy active-command/Refresh browser, offline and V8 suites to permanent investments while preserving original migration, recovery-warning reversion, native input and rollback controls. Finish remaining Lab native speed/editor tests and original CI. The working test edits in this checkpoint are in progress; they are not a claim of full acceptance. Regenerate the independent offline golden on the final frozen source and rerun all required gates before integration. No APK is authorized here.
