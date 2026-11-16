# Support duration and earned uptime

Implementation and accepted requirements: [task](../../tasks/SUPPORT_DURATION_001.md).
Baseline main `1a83b5ba`; candidate HTML SHA256
`0c6861fec8a7fa7f0d9281cceeaf0c5a31f3eb933b5b31ac2075e360b3bea65f`.

**In progress, not released.** Node24.22.1 / Chrome157.0.8103.78 on Windows.
Core/purchase tests execute the full production IIFE with only presentation,
timers and storage-fault injection controlled. Mobile tests use real Chromium
native touch, price refresh, save/reload and production DOM.

- [Baseline](baseline.json): unchanged Support test 1,970/four controls PASS.
- [Duration/pacing](local/support-duration.json): 3,331/four causal controls PASS.
  A real funded queue with continuous paid8x completes level2 at90 days;
  minimum full track450 days. Source-specific early gaps and late uptime,
  cast-time entitlements, current damage display formula, live/offline and
  split-step Support state, saves/recovery and exact payments covered.
- [New mobile UI](local/lab-speed-controls.json): 206 checks/12 profiles PASS.
  [Tide at earned3.6s](browser-support/tide-earned-duration-390.png).
- [Existing access UI retry](access-retry.json): 1,082 checks/12 profiles PASS.
- Existing local results under `local/`: Support recast1,994; Lab expansion2,781;
  boundary2,346; stress; long-tail353; Wisp contribution8,099; Swift; Forge/Lab
  pacing568; precision calibration3,134 PASS. Where applicable controls retained.

First failures and disposition:

- Sandbox browser did not reach application-ready. Outside-sandbox run of the
  same product passed; this is an environment limitation, not a proven root cause.
- Calibration's old one-second near-regeneration fixture advanced Rift120→121
  under the stronger accepted duration. New boundary is the independent
  1,266,500×(1+0.30×3/6)/0.006 minus0.5 HP. All original HP/precision assertions
  retained, passing. Old stderr retained in `local/`.
- Offline historical comparison caught `supportduration:false` as an additional
  legacy OFF-intent key. Explicit new0/OFF/default assertions added before its
  historical full-field comparison. Rerun pending at this checkpoint.
- Local `lab-expansion-legacy` invocation used Node24 and correctly rejected
  that runtime. Actual V8 6.0 remains required in existing CI; no assertion removed.
- Initial new test fixtures used an invalid1.75 saved source strength, assumed
  rounding55,542,858×0.56 upward instead of nearest, omitted the existing10-tier
  collection bonus and multiplied fractional epoch steps rather than reading
  actual recast deadlines. Fixtures corrected; production math unchanged.

Full regression, required CI, integration and Android build/upgrade/publication
remain pending. Self-review only. Physical phone, exact WebView60 DOM and
TalkBack are unverified. Alternating two buffs can cover time earlier at reduced
strength; the90-day target covers each source and the full simultaneous bonus.
