# TAP_EARLY_BALANCE_001 — useful opening taps, Wisp-led progression

Status: integrated; signed Android 0.2.64 test APK accepted by automated
checks. Physical-phone and human pacing acceptance remain open. Owner: this
feature chat. Original baseline: main41566c97; integration baseline: main 1f316cc5. Feature branch balance/tap-early-001.

## Original requirement — 30 October 2026

“Tap dmg er meget meget lav, den skal være god i starten, så man kan komme
videre i spillet, dog skal det ikke være den fuld primær dmg source.”

Make taps useful at the start without making them the main ongoing damage source.

## Delivered behavior

Guardian Tap starts at 20 damage instead of 5, plus the unchanged 2% of general
Active-party passive power. Manual/Auto-Tap, the damage ledger and encyclopedia
agree. Purchased tap multipliers, Kindling, Support, Mark/Cadence, manual input
limits and one-Hz Auto-Tap remain intact. Wisp damage, prices, enemy curves and
save schema are unchanged.

The fresh 69-HP enemy takes 4 rapid taps instead of 14. With the same earned-resource
three-taps/second policy, Rift 10 takes 18.67s instead of 54s. An early
Ember 25/Tide 10/Stone 5 party assigns 29.32% of passive-plus-manual damage to taps;
abilities add further Wisp damage. In the retained developed-save reference,
four consecutive 8h windows gain only 2.53/2.53/2.62/2.83% more clears. These are
synthetic comparisons, not human pacing acceptance.

Necessary timing fixes preserve whole/split offline behavior: discrete and
batched Mote payouts use the same saved millisecond deadline; capped-charge
Push without active Auto Ascend uses the existing exact scheduler; research-only
absences rebuild volatile timer caches without advancing saved combat phases.
All four one-second reference windows were regenerated with the existing
generator; the previous reference is preserved. Historical counterfactuals
retain their original clock policy and every original summary assertion.
Comet whole/split observations validate optional exact bases and compare physical
timer phases with the original tolerance. Exact cold-load retention, resumed
automation and two corrupt-basis/phase-drift controls pass.

## Verification and delivery

[PR #29](https://github.com/xariib/Lumenfall/pull/29) merged at 941538d0842b55f3486aeba55017395136d3dbc5.
Tested merge fb94bb4bf03a9e4bf9acdeb3517ee8d32b23d9fa; identical tree 82a8f2f3e273a76b7489f33bd76eeab30acd49ca.
Production SHA256: 3f659a45352fbc14b638903a8b45f6bbb79d1ee8360fb4a9b4962655c288c002.

All seven required workflows PASS, including 190 main scenarios,
1 isolated offline scenario covering 18 original cases, and runtime smoke.
Focused 53 checks/5 defect controls, modern/actual V8 6.0
contribution 8,099 checks, and 25,968 preservation checks PASS. The one automated
old-head review finding was fixed and resolved. Self-review and automated
validation only; no independent final-head review.

Signed 0.2.64, versionCode 1000064, package com.lumenfall.app.
APK SHA256: ded90a16bc67f78c83d51ce8bbe26af2a4d19cd0206a8c46e96d909cc2812369. All 15 packaged assets match;
the installed API 31/WebView 91 upgrade retains UID/origin, both saves, paid work
and legacy entitlements. APK built from 1fb827eaaa95565e015b84426a2b49984b4ffe9d; every packaged
asset and complete app source match the integrated feature, including upstream
Rift navigation from PR30. Test build only; no public release.

[Delivery receipt](../qa/tap-early-balance-001/delivery.json),
[CI details](../qa/tap-early-balance-001/ci-final.json),
[Android receipt](../qa/tap-early-balance-001/android.json),
[balance/reference evidence](../qa/tap-early-balance-001/reference-comparison.json).
Earlier checkpoints/failures are preserved in the
[immutable pre-delivery task](https://github.com/xariib/Lumenfall/blob/1fb827eaaa95565e015b84426a2b49984b4ffe9d/docs/tasks/TAP_EARLY_BALANCE_001.md).

Next: physical-phone pacing, exact WebView 60 DOM and TalkBack acceptance.
Keep the feature/chat open; do not archive while those checks are unverified.
No new binding project rule. [Current status](../PROJECT_STATE.md).
