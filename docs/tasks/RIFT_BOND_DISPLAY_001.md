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
