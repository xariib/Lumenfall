# Timed Lab speed revision — 15 October 2026

IN PROGRESS. Pricing is a proposal awaiting the user's decision, not implemented
balance. Parent7598c86/local/full-debug; index.html SHA-256
084f29955540f8ecabbd34088a5e404c62f8f3d1d58cf74dddf0a4d93100a8ae.
Tracked source clean at startup; unrelated validation-evidence/ is untouched.
[Prior task checkpoint](previous-checkpoint.md) retains the accepted slider
history, exact source/checks and deferred final acceptance. user-before.png is
the new supplied screenshot, not an independent browser execution receipt.

## Accepted user changes

Simplify this Lab card, remove Buy now, replace speed payments per level with
8/12/24-hour boosts and a modest longer-duration discount. User confirmed in this
chat: each boost applies only to the selected project, across successive levels;
the timer counts continuously, including idle and offline time. User requested
a price proposal. Keep all existing1.5x–8x multipliers, name/level badge,
Current/Next effects and independent Study Queue. The new request explicitly
supersedes the old per-level charging rule; historical requirements are not a
mandate to retain that charging model in the new feature.

## Proposed pricing — NOT APPROVED

Use the current undiscounted speed-tier price as the8-hour package price.
The12-hour package is proportional minus5%;24 hours minus10%. Round the package
price up to whole Motes once, then apply existing Mote Catalysis using its current
whole-currency rounding. Prices below exclude Catalysis. Proposed numbers are
not established game balance or production behavior.

| Speed | 8h | 12h, 5% off | 24h, 10% off |
| --- | ---: | ---: | ---: |
| 1.5x | 14 | 20 | 38 |
| 2x | 26 | 38 | 71 |
| 3x | 60 | 86 | 162 |
| 4x | 110 | 157 | 297 |
| 5x | 176 | 251 | 476 |
| 6x | 258 | 368 | 697 |
| 7x | 357 | 509 | 964 |
| 8x | 473 | 675 | 1278 |

Exact formula before Catalysis:
ceil(round(6 * multiplier^2.1) * hours * (100-discount) / 800).
proposed-prices.json records the same integer arithmetic. Longer bundles reduce
the effective hourly price after whole-Mote rounding. This preserves familiar
entry prices and relative speed-tier curve, not the old per-level economy:
multiple early completions can now share one payment; long late-game levels
may need multiple timed packages. User pricing confirmation is required under
AGENTS.md: "clarify missing gameplay decisions before implementing."

## Implementation design after price decision

- Name and badge remain at top, Lab Queue at right. Speed target and duration
  are one grouped choice with visible total Mote price; no Buy now/per-level
  cost/speed queue boxes. One explicit activation starts the paid timer.
- During a boost, replace the activation action with multiplier and remaining
  time. Do not automatically renew, overlap or replace unexpired paid time.
  Slider/duration previews never spend; repeat activation cannot charge twice.
- Continue the same boost across this project's future starts while its deadline
  remains valid. Study Queue and its Lumen/Shard costs remain independent.
  Starting a new boost requires an eligible active project, as current paid speed
  does. A running timer continues during idle intervals after a completion.
- Preserve already purchased per-level active.speedMult as a separate paid floor.
  Timed speed affects effective progress only until expiry; never erase that
  legacy floor or retroactively change remainingSec/totalDurationSec. Keep old
  target preference where valid, but migrate old future auto-spending OFF without
  granting free timed hours. No player reset or refunds invented.
- Persist strict known-project boost deadlines and selected duration additively;
  preserve backup/recovery/Ascend/Reset contracts. Normalization must not spend or
  drop expired records before chronological offline replay has accounted for
  their past valid interval. Real-time expiry does not extend offline simulation
  beyond the existing shared cap.
- Add expiry as an authoritative boundary in live, Farm, push and Study-only
  scheduling and precise work anchors. Resolve actual progress at the old speed
  up to expiry, then use the remaining eligible speed. Idle/large absence still
  consume wall time. Keep transaction retry/yield behavior deterministic.
- Respect current red insufficient-resource amounts and disabled purchase rules;
  refresh quotes, timers and eligibility without moving focused controls.

## Baseline/checks and remaining work

Verified current source: speedTierCost gives14 Motes at1.5x; markup shows /level
and Buy now; studyMotesPlan/simulationBuyStudySpeeds debit on each eligible level.
Current snapshot reproduces the user's reported presentation/charging model.
Baseline node tests/behavioral/lab-expansion.cjs index.html PASS2675 (source above).
No timed feature or UI was implemented in the game yet. Prior checks do not prove
new timer correctness. Initial check_context failed the32KiB startup budget due
to shared state growth; compacted only this task and retained its prior text here.

Required new coverage: all tier/duration/Catalysis quotes, one-short/exact funds,
duplicate/rapid activation, active/capped/locked/idle behavior, final-only price
selection, expiry within/at completion, next-level carry before/after deadline,
legacy paid floors, cold load/backup/recovery/Reset/Ascend, strict invalid saves,
clock rollback/large absence, online/offline/split/yield/retry parity and shared
cap. Existing Lab, economy, save and affordability regressions stay relevant;
old per-level assertions must be updated only where the user changed that rule.
Touch/keyboard,320–430px,200% text, contrast and stable focus/scroll remain required.

Next: obtain price decision, implement, reproduce/fix failures, review full diff,
record exact source-bound checks, commit local checkpoint, refresh mobile/www
source/fonts/branding and show the playable game preview. No GitHub/push/APK/
signing or new chats/agents. Combined/main/CI and Android/device/WebView60/
TalkBack acceptance remain open. Product remains unchanged while prices await
confirmation; a design proposal is not implementation acceptance.
