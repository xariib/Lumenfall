# TAP_EARLY_BALANCE_001 — useful opening taps, Wisp-led progression

Status: implementation in progress. Owner: this feature chat.
Baseline: `main` 41566c97; branch `balance/tap-early-001`, isolated worktree
`tap-early-balance-001`. No overlapping gameplay PR found (only docs PR2).

## Original requirement — 30 October 2026

“Tap dmg er meget meget lav, den skal være god i starten, så man kan komme
videre i spillet, dog skal det ikke være den fuld primær dmg source.”

Make taps useful at the start so players can progress, without making taps
the main ongoing damage source. Scope: Guardian Tap base, its in-game help,
focused regression coverage and required validation/delivery.

## Balance decision and acceptance

Raise flat base damage from 5 to 20; retain the 2% contribution from general
Active-party passive power. Preserve all purchased multipliers, Bonds, Support,
Guardian's Mark, Cadence, manual input limits and one-hit-per-second Auto-Tap.
No save schema, currency, enemy, price or Wisp damage changes.

- Fresh Rift1 enemy (69 HP) takes four taps instead of fourteen.
- Real early encounters/purchases advance faster with the same input policy.
- With Ember25/Tide10/Stone5, three taps/second contribute under one third of
  combined passive and manual DPS (abilities additionally favour Wisps).
- Uninvested taps approach the unchanged 2% of party power as Wisps grow;
  existing dedicated tap investment remains effective, with no new hard cap.
- Manual and Auto-Tap share damage, multipliers and chronological simulation;
  saves, both slots, backups and existing progress remain valid.
- Focused balance, Forge/tap/Support regressions and required CI pass before
  integration. Build the integrated Android candidate and record limitations.

## Baseline checks

Node24.20.0: Forge core PASS, 9,341 assertions; early Wisp curve PASS, 2,802.
Baseline source SHA256:
`3e2b6da487f39007cb1edf1191d33920d977f268f70341efdff6a64e2bfc0630`.
Fresh tap5.02, passive1; Rift1 HP69. Ember25/Tide10/Stone5 passive220.7,
tap11.7675 including Kindling. No baseline failure in these checks.

Sources: [current status](../PROJECT_STATE.md),
[workflow](../project/FEATURE_WORKFLOW.md),
[earlier pacing](PROGRESSION_PACING_001.md).

## Continuation

Implemented base20 with unchanged 2% scaling and updated in-game help. Two
independent numerical expectations in the browser suite and two fixed Ember1
Cadence expectations intentionally now use base20; no assertions removed.
Added a whole-game balance regression to the existing required main behavioral
suite. The GitHub OAuth connection lacks workflow-edit scope; no workflow
change is needed or included.

[Focused results](../qa/tap-early-balance-001/core.json): 36 checks/two causal
controls PASS. First kill14→4 taps. Under an identical 3-taps/sec, earned-resource
180-second purchase policy, Rift3 takes9→2.67 seconds; Rift10 takes54→18.67;
record Rift14→22. This synthetic policy is comparative evidence, not human
pacing acceptance. Ember25/Tide10/Stone5 manual share29.32%; later sample18.12%
then7.00%, excluding abilities. Support/Mark/Cadence manual/live/offline hit
stacking, existing save/cold load, backup and primary-failure recovery PASS.

Node24.20.0: source/context PASS; Forge core9,341 assertions/25 causal controls,
early Wisp curve2,802/five controls, Support1,930/four controls,
progression pacing221/five controls PASS. Raw JSON in the linked evidence folder.
Calibration3,134 checks/seven causal controls PASS;
required remote CI/integration/APK pending.
Candidate source SHA256:
`45a8261ce7b3214cca98a09846482ffa313d2e743c0b0ef5bd8db64523623aa4`.

PR: [#29](https://github.com/xariib/Lumenfall/pull/29). Initial native adapter
trial exposed an uppercase result status; corrected to the runner's lowercase
`pass` contract. Local Brave dump-DOM formula test timed out after25 seconds
with no DOM/stderr/result; remote Linux browser acceptance is pending. No
gameplay failure is inferred from that empty local browser result.

## Regression checkpoint — cooldown representation

Initial CI at `afe5e73f` exposed three more old-base expectations (Forge
enhancement scope, Kindling and Lab long-tail damage). They now retain their
original assertions with base20. The historical offline counterfactual now
explicitly restores the frozen tap function alongside its other old balance
inputs; actual-current whole/split/cap comparisons remain unchanged.

The full8h Swift-OFF oracle exposed a real payout inconsistency: whole-window
Motes2,955,937 versus one-second2,956,466, with identical386,296 kills. Discrete
defeats used exact binary clock comparisons against a rounded saved epoch
deadline, whereas batched defeats used epoch milliseconds. At the same
represented boundary, only the discrete route could reject an eligible payout.
Both now use the saved millisecond representation, with no epsilon, cooldown
duration or payout-value change. The same8h diagnostic yields2,956,466 on both
routes. Added a real binary-clock rounding reproducer and a third causal
control restoring the mixed comparison; focused44 checks/three controls PASS.

Current source SHA256:
`5e2aa06dd67b8082b9f8e1940d96ab8c2e859b2d31f8e8b0aae889d1bf16f788`.
Current Forge9,341/25 controls, workshop468/four, Bonds8 cases/six,
Lab long-tail353/four and timed-boost/cooldown1,480/three controls PASS.
Earlier initial-tap-only evidence remains source-labelled above.
Full original sequential offline regression is running before integration.
Local native Lab speed/focus also passes1,182 checks across12 profiles; the
initial CI startup timeout happened before Browser.getVersion/any game check.

Next: finish the unchanged full offline regression and all seven required PR
workflows on the corrected version; then integrate and build Android.
Physical phone and human pacing acceptance are unverified. No new binding rule.
