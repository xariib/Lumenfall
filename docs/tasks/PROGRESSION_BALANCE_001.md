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

## Integration checkpoint

[PR #69](https://github.com/xariib/Lumenfall/pull/69) opened at `982ff526`.
The first [Lab run](https://github.com/xariib/Lumenfall/actions/runs/45076908821)
found a funded foundation study rejected in the new price range. Exact debit
previously converted the small fractional remainder back
to a rounded Number. Payment verification rejected the result. Currency
debits, subsequent credits, and cold-loaded wallets now keep canonical
decimal storage when the Number conversion would lose value. The focused
purchase exercises the actual displayed cost and retains the exact
fractional remainder. The existing Farm stress corpus passes all 2,484
valid profiles with zero unavailable funded purchases.
The repaired source SHA-256 is
`f6496a778013fc290b91f7dc2713464fe4a2e0fd734afb88561853770421b6c4`.
The Workshop totals, matched boss pacing, earned Mastery purchases, and four
canonical offline endpoints still match the earlier balance candidate.
The Wisp Chromium suite passed all 901 checks again.

The first [main PR workflow](https://github.com/xariib/Lumenfall/actions/runs/45076908912)
failed the existing `EXPLOIT_BALANCE_HUNT_001` context check. The same 32 KiB
failure reproduces on untouched main `42c9cdf5`. [PR #68](https://github.com/xariib/Lumenfall/pull/68)
contains the user-authorized startup correction and passes this check.
This feature relies on that separate PR for its integrated context gate.

The full 24-hour fresh campaign from this feature's first candidate matched
every recorded effect of 0.2.153, including Rift 140, 11 manual Ascends,
and 114 paid Forge actions. A [private Android build](https://github.com/xariib/Lumenfall/actions/runs/45076961913)
passed on the first candidate. A [revised signed candidate](https://github.com/xariib/Lumenfall/actions/runs/45077952935)
passed the in-place upgrade, both saves, paid studies, updater and retail
launch. The packaged game matches the repaired source hash. Attempt 1 hit
HTTP 403 fetching release metadata. Attempt 2 passed.

PR #68 reached main at `582ddaa7`. The combined feature tree passes the
startup budget and isolated offline catch-up. Its first pre-merge attempt
reached the Workshop and milestone boss replay, then stopped at a guidance
fixture that used the old Mastery prices. The fixture now exercises the same
exact and one-unit-short boundaries using the current quote. All 191 checks,
including negative controls, pass on the candidate and the baseline. Game
source and signed APK bytes are unaffected by the fixture correction.
The stateful browser suite's independent Ultimate price assertions now use
the rebalanced Ember and Titan prices and the total across all eight Wisps.

Next: finish the corrected PR workflows, then integrate this feature and
pass the main-commit checks. Public release and final Android acceptance
are pending.
