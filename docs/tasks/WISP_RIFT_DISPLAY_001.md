# WISP_RIFT_DISPLAY_001

This feature chat owns the task. Android 0.2.153 is published and verified on
the emulator. Physical device acceptance remains open. Baseline `3cd15943`
was Android 0.2.152. Branch `fix/wisp-rift-display-001` in
`C:/lf-wisp-rift-display`. PR63 is the separate Play candidate and has no
product HTML changes.

User request: Tide's Boost bar should follow the actual ability cooldown
instead of sitting full while recast waits. Rift's total Wisp damage/sec
should show the current boosted damage displayed on the Wisp cards. Give
Formation & Bonds a dedicated tab in Wisps, like Forge and Lab in Workshop.

Acceptance: the Support meter follows the longer of remaining charge and recast
and returns to ready when both permit it. The Rift total reflects current
passive damage, including active Support. Keep the boss's sustained estimate,
combat timing, save fields, formation actions, and Wisp upgrades and navigation
working. Verify mobile and keyboard access and existing CI/Android gates.

References: [Support and DPS](TEAM_PROGRESSION_001.md),
[Wisp menu](WISP_CARD_REDESIGN_001.md), [latest release](../PROJECT_STATE.md).

## Candidate checkpoint

The bar combines existing charge with time remaining on each Support recast.
The Rift total and individual cards share the same Support snapshot on each
combat refresh. The existing boss estimate, ability scheduler and saves retain
their original calculations and timing. Wisps opens to Roster and has a separate
Formation & Bonds tab with presets, Auto-Empower All and Field Best now. The
late-power shortcut opens that tab directly. Manage keeps its existing return.

Changed `index.html` and focused Rift, navigation and Formation scenario
fixtures. Source validation and context check passed. The baseline Windows
Brave dump-DOM runs did not return a QA result. Native Chromium runs are used
alongside GitHub Linux CI. In the candidate, the original preset/field touch
and focus checks passed on six profiles. A touch-target sizing issue from the
move was corrected. The existing Support core/recast check passed 2,048 checks
and the paired offline check passed 30,498 checks on the initial UI candidate.

On the initial [PR67](https://github.com/xariib/Lumenfall/pull/67) candidate
`db35d667`, Rift status, Wisp formulas, menu navigation and Wisp hierarchy
passed through the Chromium CDP runner. Formation passed 505 checks on 12
profiles, Wisp management passed 1,182 checks on 12 profiles, and the native
Bonds suite passed. Concurrent Windows Chrome shutdown produced valid PASS
DOM with a nonzero teardown exit on three suites. Serial retries passed.

Screenshot review found the sticky tab strip could cover a control positioned
at the top of a scrolled panel. The final layout reserves space above the
scrolling content. Native touch and accessibility coverage now asserts this
separation. Final-source checks and Android delivery are pending.

Final product SHA-256 `711f8e4bf5b04ec17ee52bace271e617ddb67bc59fa6c896a3fff88702a7421f`
passed the Rift status and navigation contracts, Formation 517/12, Wisp Manage
1182/12, Best now 1299/108, Wisp contribution 758 checks including Support
research, native autosave, and 2048 recast plus 30498 offline checks. The
released baseline failed the new live-total assertion. Separate old-meter
and old-total controls each failed their intended assertion.

[First final-layout pre-merge run](https://github.com/xariib/Lumenfall/actions/runs/45056785657)
passed isolated offline catch-up and found one R3 fixture still expecting the
main Wisps button to label the roster directly. The corrected fixture checks
both Wisp subtab relationships, retaining the existing destination, focus,
and persistence assertions. `r3-destinations` passed locally. Product bytes
are identical to the locally validated final layout.

[Next pre-merge run](https://github.com/xariib/Lumenfall/actions/runs/45057913082)
passed the R3 check and isolated catch-up, then reached the independent offline
source-binding gate. The existing paired replay driver ran each version for
four eight-hour windows in one-second steps. The 230,400 one-second calls
produced equal rewards and identical complete saved states, and all four state
hashes matched the canonical reference. Only the golden source SHA changed.
[Replay receipt](../qa/wisp-rift-display-001/independent-offline-replay.json).

## Integrated release

[PR67](https://github.com/xariib/Lumenfall/pull/67) merged candidate
`ca404cb422415b2bdf6cb1b157dd93f6d2a1ebaa` as
`531737e2a85f17f07b4e8678c4b228d38086fdc4`. Both trees are
`52b934e3542d340e5f7877ae8dbb1abaed1b5404`. All eight applicable PR workflows
and all nine exact-main workflows passed. Full stateful and isolated offline
jobs are recorded in the [integrated run](https://github.com/xariib/Lumenfall/actions/runs/45064531555).
The PR's Linux Wisp-scroll retry passed after a Chrome touch protocol timeout
following 3,058 checks at the same source. Review used self-review and automated
checks.

[Android 0.2.153](https://github.com/xariib/Lumenfall/releases/tag/android-1000153)
shipped from [build 45069859079](https://github.com/xariib/Lumenfall/actions/runs/45069859079),
attempt 3. Attempt 1 passed the in-place signed upgrade, then the official
release metadata request returned HTTP 403 with the anonymous GitHub quota
exhausted. Attempt 2 was canceled during emulator acceptance. GitHub did not
record a reason in the job log. Attempt 3 passed the signed upgrade, retained
both saves and paid progress, verified the in-app updater and installer Open,
and passed normal launch on retail Android 12. Anonymous latest and versioned
APK downloads match the build digest and packaged source. The established
package and signing certificate were verified.
[Release verification](../qa/wisp-rift-display-001/android-0.2.153-verification.json).

Next acceptance is physical-phone verification, including TalkBack and the
exact WebView60 DOM where available. Keep the task and owner chat open for
that acceptance.
