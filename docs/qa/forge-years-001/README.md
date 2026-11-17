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
