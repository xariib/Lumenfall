# Forge years — baseline investigation

Source: main `b075cfba`, product SHA256
`3f9123285f3377740e3017246fa7b0a5f8cbad60cabc9e477be9c9aefdeffa80`.
Node24.22.1, Windows. No gameplay edits, Android build or release.

Reproduce from repository root:

```powershell
node scripts/codex/check_context.cjs --task docs/tasks/FORGE_YEARS_001.md
node tests/behavioral/forge-workshop-pacing.cjs index.html --negative
node tests/behavioral/endless-forge-lab-pacing.cjs index.html --negative
node scripts/qa/forge-years-audit.cjs index.html
```

Saved unchanged-source baseline: workshop480 assertions/four controls PASS;
endless Forge/Lab568 assertions/four controls PASS. Context/links/startup PASS.
`baseline-affordability.json.gz` contains the new audit's complete JSON stdout.

The active catalogue has20 short finite tracks (caps2–20), Masterwork(cap500)
and three endless Tempering tracks. In each synthetic mature fixed-depth
fixture, a shared14-day wallet buys all20 short tracks. This diagnostic grants
record10000 and mature economy/damage beforehand; it does not show a fresh
account reaches those records or earns these amounts in its first14 days.

The opposite extreme also needs attention if the user wants a finite finish:
all500 Masterwork ranks quote about4.20e71 Lumen and1.05e70 Shards, with existing
record gates. Currency-only completion is vastly longer than years at these
particular fixed incomes. Endless tracks have no completion point. Neither
fact establishes satisfying long-term progression for the full catalogue.

| Fixed farm Rift | Actual kills in60s | Battle / Arcane / Harvest ranks purchasable with separate14-day wallets |
| --- | ---: | --- |
|32|150|100 /91 /86|
|101|150|175 /166 /161|
|501|140|263 /254 /249|
|1001|120|289 /280 /275|
|2501|1|280 /270 /265|

Each wallet above starts ownership at zero; paid300-rank benefits are granted
to the earning fixture first. Rift2501's sparse one-minute sample is particularly
unsuitable for a sustained-income claim. Every forecast extrapolates24 productive
hours/day without reinvestment or changing depths. This is affordability evidence,
not a simulation of a multi-year player's account or proof of human pacing.

Next: resolve finite completion versus retained endless tracks; specify a varied
catalogue and calibrate meaningful longer progression with changing account
power/income. Existing tests alone cannot establish the new years requirement.

## Finite candidate after user clarification

Product SHA256:`53ab7e3d82db877fd637da95604854f0f86880136ea477fab14fb80cbd5f621b`.
The user confirmed all Forge paths must be finite, with possible2–3year completion
and useful Lab growth through walls. [Decision](../../decisions/2026-11-17-finite-forge.md).

Finite core373assertions/four causal controls PASS: rational independent tail
quotes, real final manual/Max/queued payments, individual resource shortages,
write rollback, cap/above-cap ownership/effects, cold load, recovery, backup
and Ascend. Completed damage/critical Labs increase measured combat7.5x;
resource Labs100 increase measured kill payouts9x versus those Labs at0.
Original Forge9404/25controls, workshop480/four, earned Lab access538/four,
permanent progression4225, slot contract55, whole-game audit318/three and
early Wisp2400/five controls PASS. These are self-review/automated checks.

`reinvestment.json` records four real-purchase forecast cases. Reference1001
finishes on day1063; all cases remain incomplete at14days. Economy Labs100
instead of500 and fixed Rift501 instead of1001 remain incomplete after1200days.
The growing farm501→1001/economy Labs100→500 case is23/24 complete at1200days.
Only the stated mature reference is calibrated to2–3productive years. No actual
fresh-account completion guarantee or global minimum is claimed.

Reproduce added checks:

```powershell
node tests/behavioral/finite-forge-years.cjs index.html --negative
node scripts/qa/finite-forge-reinvestment.cjs index.html --check
```

First local UI attempt used a nonexistent system Chrome path and failed before
any profile; retry uses verified installed test Chrome. An accidental Node24
invocation of the legacy-only Forge runner correctly rejected the runtime;
actual V8 acceptance still requires the existing dedicated V8 lane. Product
checks above were not altered for these setup errors. CI/mobile/Android results
remain pending; task remains open.

The first browser retry reached266checks then hit the unchanged CDP evaluation
deadline with a teardown timeout. Retained `mobile-rerun` receipt; cause unproven.
No timeout/assertion was relaxed. GitHub rejected the initial push containing a
workflow-file edit because its credential lacks `workflow` scope. That unpublished
commit was amended to keep workflows unchanged and run the new finite/pacing
checks through the already required `forge-workshop-pacing.cjs` entrypoint.
