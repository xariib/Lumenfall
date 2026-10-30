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

## Clock checkpoint

The original eight-hour OFF comparison additionally exposed Native-clock phase
drift (full Auto-Tap phase0.000010229647ms versus split0ms), then a charge-bar
endpoint mismatch. Use the already-established exact binary scheduler whenever
Push natural charge is capped (Swift Recovery10+, including legacy overcap),
both at window start and after an in-window purchase. Existing low-charge
historical comparisons retain their original clock; no tolerance is changed.
The two existing activation sites remain intact. No save field or new clock
implementation is added. Exploratory offset-rebasing changes were discarded.

Current source SHA256:
`c8ce629318d3dbee4e39a5cb67856fab50b4f7e8c11ed3ce79b010d65e3e26e5`.
[Original OFF state comparison](../qa/tap-early-balance-001/offline-off.json)
PASS in33.17 seconds: full8h versus28,800 one-second calls, every original
state comparison/tolerance retained;1,150 new kills, Motes2,956,466.
Current focused44/three controls, Forge9,341/25, pacing221/five and
Mote/timed-boost1,480/three PASS. Full18-case parallel regression and boss
calibration are running; remote gates will run on this corrected source.

The calibration observer originally concatenated exact Amount-string durations
with `+=`. Convert each finite physical interval to Number before integrating
the observation; retain the2e-10 elapsed-time assertion and every damage bound
and causal control. This is test observation support for the existing exact
clock representation, not a gameplay formula or acceptance-tolerance change.

## Latest continuation — long-absence resume

Scope the additional capped-charge activation to Push runs that cannot Auto
Ascend; ordinary Auto-Ascend keeps its existing exact-clock activation policy.
Its run resets already bound the Native phase history. This preserves the
established cycle-batching path and avoids unnecessarily changing that path.

Longer-absence processing exposed a stale volatile automation cache across the
60h Lab-only tail after the12h combat cap. Clear only that cache on entry to
Study-only advancement; retain saved exact bases and combat phases. A real
123ms combat →60h research-only →877ms combat test preserves the saved basis
and yields exactly one Auto-Tap. Restoring the stale cache fails its control.

Focused50/four controls, Support1,950/four (including exact-basis shape and
self-consistency), Forge9,341/25, workshop468/four and pacing221/five PASS.
Support partition comparison now observes exact elapsed histories in physical
milliseconds with the original numeric tolerance; save/load/backup still
require original bits. This aligns the existing offline oracle's documented
allowance for distinct valid timer bases; no gameplay phase check is removed.
Calibration3,134/seven controls PASS on prior source `c8ce6293` in290.73s;
its scenarios have no Study-only gap and cannot Auto Ascend. Current full
original18-case offline regression is running on:
`0336072c2235de0636b9d0d78b111f6a91445933b31a2a2793b5089aceb5012d`.
Next: finish that regression, all seven final-head CI workflows, integration
and signed Android test build. Physical phone/human pacing remain unverified.

## Damage ledger and final reference binding

The final Tree compatibility check caught a second flat-base literal in the
Wisp damage ledger. Raise its Guardian base5→20; focused53/five controls now
also verify the ledger agrees with authoritative DPS and reject the old base.
Modern and actual Windows Node8.3.0/V8 6.0 contribution contracts PASS:
8,099 checks, seven modern controls and25,968 historical preservation checks.
That frozen comparison applies the approved base20 and retains its old clock
activation policy, keeping every historical summary field including iterations.
The archived HTML remains unchanged.

Regenerated all four8h one-second reference windows with the provided generator
on `c64f98d32b39d3060022192a4653b906d7845cca134a58a61f0437b1cebd6653`.
Original reference retained in `../qa/tap-early-balance-001/previous-offline-golden.json`.
This renews the unchanged required source-binding gate; no hand-edited outcomes.
Prior final-source timing CI passed all18 original offline cases in131.29s,
under its300s deadline; local duplicate passed in350.40s (not deadline acceptance).
Next: final-head CI/integration/signed Android test build; no further code change
is currently planned. Self-review and automated checks; no independent reviewer.
Physical phone and human pacing acceptance are unverified. No new binding rule.
