# Support duration and earned uptime

Implementation and accepted requirements: [task](../../tasks/SUPPORT_DURATION_001.md).
Baseline main `1a83b5ba`; candidate HTML SHA256
`0c6861fec8a7fa7f0d9281cceeaf0c5a31f3eb933b5b31ac2075e360b3bea65f`
initially; current source
`fc407785579ce6f0505f492aabe1d98ba68e53e8196f86a030c9046c39c5539c`.
Each result embeds its exact source hash; early receipts remain historical.

**Released as Android0.2.128; physical/human acceptance open.**
Node24.22.1 / Chrome157.0.8103.78 on Windows; Node24.19.0 / Chrome157.0.8103.50
in required CI, plus actual V8 6.0 in established legacy lanes.
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
  historical full-field comparison. Current PR offline rerun passes.
- Local `lab-expansion-legacy` invocation used Node24 and correctly rejected
  that runtime. Actual V8 6.0 remains required in existing CI; no assertion removed.
- Initial new test fixtures used an invalid1.75 saved source strength, assumed
  rounding55,542,858×0.56 upward instead of nearest, omitted the existing10-tier
  collection bonus and multiplied fractional epoch steps rather than reading
  actual recast deadlines. Fixtures corrected; production math unchanged.

Full PR/integrated regression, required CI and Android/public delivery pass.
Self-review only. Physical phone, exact WebView60 DOM and
TalkBack are unverified. Alternating two buffs can cover time earlier at reduced
strength; the90-day target covers each source and the full simultaneous bonus.

PR57's first CI failures and subsequent fixes are in the
[continuation task](../../tasks/SUPPORT_DURATION_001.md)
and [failure excerpts](first-ci-failures.json). Current-source Support/Lab checks
and28,408 historical preservation assertions pass. The independent golden was
[regenerated from four complete one-second caller windows](independent-one-second.json),
with exact increased rewards pinned for the accepted longer buffs. Previous
released outcomes remain in Git history. Initial full Windows browser attempt
has failures/timeouts and an EPERM cleanup exit; final PR Linux CI passes.

Corrected-source checks: [all Lab mobile purchases](lab-expanded-mobile.json)
7,044 PASS, [combined required access/Support UI](access-required-combined.json)
1,286 PASS, [six focused browser cases](focused-browser.json) PASS. Visually
inspected [new Lab card](browser-access/support-endurance-390.png); current and
next durations, long work, both red missing prices and five-group ordering fit.

[Second CI](second-ci-failures.json): six active workflows plus isolated offline
PASS; Forge preservation caught the remaining additive default field. Explicit
zero/OFF assertions fix it,479 checks PASS. Auto-Ascend feedback435 checks PASS
with current live/offline parity and exact archived PR15 mechanics/hashes.
[Boost-queue UI reproduction](boost-queue-ui.json):993 checks/all18 profiles PASS;
[intended next-lock defect](boost-next-lock-control.json) remains caught. The
remote CDP input timeout is retained without asserting an unproven root cause.

Later core verification: [all16 suites PASS](later-core-summary.json), including
the original precise clock activation witness and [all14 causal defects](clock-controls.json).
The captured frame-clock probe now explicitly checks its
[unmodified historical input](frame-clock-captured-positive.json) before its
[same-input clock mutation](frame-clock-captured-negative.json); ordinary current
3s live/offline/cold-frame checks remain unchanged. No bounds or expected failure
messages relaxed. Source product remainsfc407785…5539c. Tree's first input timeout
is retained in `third-ci-tree-input-detail.json.gz`; unchanged retry passes.

All eight active PR workflows pass onbc6329af. The two branch-specific Prism
workflows skip intentionally. [Complete pre-merge receipt](remote/passed-43868722738.json)
includes raw compressed logs:190 main deterministic scenarios plus1 original
isolated offline scenario PASS. Integrated atf16ffd9b4319ff64fe3ecfb28ddc07a881620ec8;
merge tree exactly matches the passing head. All nine exact-main validations
PASS ([status](remote/status-f16ffd9b.json)), including
[pre-merge43878436458](remote/passed-43878436458.json):190 main +1 isolated
offline scenarios. The integrated Lab job's first zero-check Browser.getVersion
timeout is [preserved](remote/failed-43878448789.json); its
[unchanged failed-job retry passes](remote/passed-43878448789.json).

Signed [Android0.2.128](https://github.com/xariib/Lumenfall/releases/tag/android-1000128),
versionCode1000128, built/published by43888872736 fromf16ffd9b.
[Public verification](android-release/public-verification.json) PASS: both
anonymous APK URLs, latest feed, exact public metadata, package/signing identity
and all product assets. APK SHA256
`3789ccc679687c9786a4705a9eabb33a0de8566cc4ee5ba73944de0dc9e37d06`.
[Save-preserving signed upgrade](android-release/emulator-upgrade.json),
[actual updater](android-release/in-app-updater.json) and
[retail production launch](android-release/production-runtime.json) PASS.
[Screenshot](android-release/production-normal-launch.png) visually inspected.
Compressed native logs, receipts, source identity and complete build log are
preserved. Physical-phone/WebView60/TalkBack/human pacing remain unverified;
the owner chat remains open for those checks. No independent review claimed.
