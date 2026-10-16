# Endless progression — current measured results

Local candidate only; feature OPEN. Measured F baseline SHA256:
`4b052487793c768611ff39ba88872c0a3f4ea3aeaf217616e104bfd3eb34ac45`.
Current advice candidate9cdcd80c: [late pacing work](LATE_GUIDANCE.md).
No main integration, APK or release is claimed. Original scope and protections:
[requirements](REQUIREMENTS.md).

## Earned free-play pacing

Elapsed simulated days, using actual game purchases and progression without
resource grants or calendar unlocks. Every policy completed a fresh60-day run.
Focused play reserves spare Lab capacity after cheap work preparation; broad
play also develops secondary Lab paths. These are play policies, not game modes.

| Policy | Visits/day | Minutes/visit | All8 recruited | First Mythic | First Ultimate |
|---|---:|---:|---:|---:|---:|
| Focused regular |3|10|21.33|42.33|42.67|
| Broad regular |2|10|23.50|51.00|51.50|
| Broad regular |3|10|26.00|53.33|54.00|
| Casual |2|5|23.50|51.00|51.50|
| Frequent |6|10|24.33|51.67|52.33|
| Efficient policy |6|15|24.83|52.33|53.00|

Both regular primary policies meet the Day1 Tide/Stone/early-rarity/first-Ascend
audit. Casual five-minute visits first buy rarity at exactly24h; that boundary
is retained separately rather than presented as a primary Day1 pass.
Frozen60-day source/policy receipts are recorded in
[the calibration receipt](experiments/focus-f-plan.json).

Full roster means all8 Wisps have Mythic rarity, ability20 and Ultimate.
The focused three-visit policy reached this at125.67d; the broad two-visit
policy at133.50d. Both subsequently purchased further Mastery. Fixed145d/138d
snapshots and independent permanent-retention/purchase audits are in
[the mature receipt](experiments/applied-f-both-full.json).
Both unchanged campaigns completed180d. Their42,590 receipt/retention checks
pass; final snapshots and the separate late-policy controls are in
[the completed campaign receipt](experiments/applied-f-final-campaigns.json).

The first Ultimate spends about74.6% of the focused policy's saved Sigils and
64.5% for the two-visit policy after its earned discount. Later Ultimate purchases
also wait on Sigil farming after Lab eligibility in the focused policy.

## Walls and continued growth

The final180d conservative policies have closed record gaps of3.66d/4.99d,
but also unresolved record plateaus of30.33d/41.49d at their endpoints. The report
now includes open gaps so these outliers cannot disappear from the summary.
These are not presented as a late-wall target pass. Permanent development
continued, but an unchanged record alone does not show whether pushing was
actually blocked or the policy was choosing to save/farm.

The policies disabled empowerment while saving for more Lab levels after the
Mastery requirements were already met. Source-qualified choice controls found:

- From the focused day166 save, re-enabling empowerment pushed Rift9691→9794
  within one simulated hour, with Wisp Ascendancy unchanged. Holding it off did
  not break the record.
- From the two-visit day156 save, empowerment and an overnight Push reached
  Rift9340 from9058 within12h; one affordable Masterwork purchase reached9400.
  Wisp Ascendancy stayed178 in both cases.
- A separate continuation from the earned two-visit day138 checkpoint used
  two ten-minute visits daily, a60s low-Rift Prism-farming burst when needed,
  explicit Mastery purchases and normal pushing. Its record rose at every daily
  endpoint:9100/9160/9220/9280/9310/9370/9430. It made84 Mastery purchases.
  Independent BigInt accounting/retention checks56 and three exact defect
  controls pass. Already-running work completed normally; no grants, new timer,
  balance change or primary-run rebase was used.

These controls demonstrate available, useful alternatives to the conservative
Lab-saving policy. They do not establish that every play policy has the intended
wall duration. Human assessment of late pacing remains open.

The conservative two-visit policy has an early3d record plateau: it resets after
buying upgrades without first trying them. A [current-source7d control](experiments/applied-f-early-control.json)
tries60s before optional later manual Ascends and reduces that plateau to1.50d.
It reproduces the earlier E control state/history/purchases exactly. This is
player-policy evidence, not a cooldown or full-campaign acceptance. The original
plateau remains in the primary receipts; human pacing acceptance is not recorded.

Mastery is an explicit Prism/Sigil purchase, with10% compounded own Power per
rank and increasing Rift/Lab/Forge/Tree requirements. Existing upgrades survive
Ascend; Support strength, duration and recast are retained. Future Lab base work
is bounded at10d before earned reductions/speed; existing running work is kept.

## Executed checks and remaining limits

The F baseline passed220 browser executions/190 deterministic
scenarios,493 Mastery/mobile checks across12 profiles, strict warm/cold parity
and storage checks, price/requirement boundaries, migration/recovery, paid-value,
Formation, Support and deliberate defect controls. Actual V8 6.0.286.52 passed
143 engine and56 progression checks, including a rank10000 purchase.
Modern checks used Node24.19.0 and Chrome140.0.7339.207 on Windows.
Commands, raw receipts and hashes: [current checkpoint](experiments/applied-f-checkpoint.json).

The retained-development12h stress case completed in296s with other owned QA
workers stopped, longest slice281ms. Its state/summary exactly match the earlier
run;2195 accounting/comparison checks pass. This remains substantial desktop
catch-up cost and does not establish Android performance or responsiveness.

Required remote Linux CI remains open. The historical Guidance baseline Git
object is absent locally and cannot be fetched while repository access returns
404. Current-source Guidance browser checks passed separately. No JDK/SDK,
signing build, installed-save upgrade or physical device/TalkBack acceptance was
available. See [outstanding Android/human acceptance](DEVICE_ACCEPTANCE.md).
These limitations keep the feature open; simulation results are not human or
device acceptance, and self-review is not independent review.
