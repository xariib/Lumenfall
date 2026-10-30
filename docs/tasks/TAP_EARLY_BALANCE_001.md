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

Next: finish calibration, publish PR, check all seven required workflows and
integrate only after gates pass; build the integrated Android candidate.
Physical phone and human pacing acceptance are unverified. No new binding rule.
