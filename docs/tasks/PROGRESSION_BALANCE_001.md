# PROGRESSION_BALANCE_001 — Workshop, Mastery and boss pacing

Status: in progress on `feature/progression-balance-001`.
Baseline: main `42c9cdf5b5590b3f8fa51c6a9e803ff03a3bdbd1`, Android
0.2.153. Owner: the current Workshop simulation and balance chat.

The user asked to fix bottlenecks and errors found in the
[Workshop and Mastery simulation](../qa/workshop-mastery-simulation-001/README.md).
Finishing every upgrade can take years. At some stages, one hour farming and
a small upgrade should be insufficient to clear the boss.

## Acceptance

- Reproduce the Workshop and Mastery funding bottlenecks and verify affordable
  late advancement with gameplay currency in representative scenarios.
- Use the same starting state and spending policy to replay selected bosses.
  Verify resistance to a one-hour Farm visit and a clear after more farming
  and investment. Keep regular boss progression and onboarding accessible.
- Preserve earned upgrades, already paid Lab work, save recovery, rewards,
  caps, chronological online/offline combat and the established Android identity.
- Run focused regressions and the required integration and Android checks
  from the [feature workflow](../project/FEATURE_WORKFLOW.md).

Separate active work includes the startup documentation PR #68 and Google
Play readiness PR #63. This feature uses an isolated worktree at
`C:/lf-progression-balance`.

## Candidate and checks

- Five purchasable foundation studies keep their prior price through the
  purchase of Lv. 101. Later prices grow 2.5% per rank. Work duration and
  paid work are unaffected.
- Ultimate prices run from 400 to 2,400 Sigils. Mastery charges the rounded-up
  base Prism curve at the required Rift and the base rewards of the two bosses
  immediately before that gate. Existing prerequisites and effects remain.
- Bosses at Rift 1,000 and every 500 Rifts thereafter have 50% more HP.
  Percentage damage already dealt is retained on load. Trait rates, rewards,
  and intervening encounters retain their prior rules.
- [Reproducible comparisons and outputs](../qa/progression-balance-001/README.md)
  cover earned Ultimate and Mastery purchases, late Mastery, matching Farm
  budgets, the timed Lab cap, and complete Workshop forecasting. Four paired
  eight-hour offline windows kept every endpoint state and all canonical
  hashes. The current golden source binding reflects that replay.
- Focused Lab, Forge, economy, progression, curve, and adversarial tests pass.
  The existing Chromium Wisp purchase and guidance suite passed 901 checks.
  Self-review and automated checks only.
- The existing Rift curve CI check runs the new production replay. Repository
  credentials refused an optional workflow-file edit because they lack the
  OAuth workflow scope. The existing CI workflow is sufficient.

Next: review the final diff, open the candidate PR and check all required PR
workflows before integration. Signed release and Android acceptance are pending.
