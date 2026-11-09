# Full debug and exponential Rift progression

Original request: “Full debug. Look for exploits. The game curve should be exponential.”
The user then asked to make the update available in-game.
Baseline main `32fb31be350003565351f8ead63ee0e53baf2d32`.
Isolated branch and worktree `fix/full-debug-exponential-001`.

Scope is game regression testing, reproducible economy exploits, and Rift HP
and depth-scaled Lumen/Shard income. Preserve saves, paid upgrades, the
twelve-hour combat cap, and the existing sixty-second Luminous Mote interval.
Prism awards retain their separately approved rules.

## Findings and changes

- The old Rift exponent was logarithmic between Rift 100 and 1,000. Use
  fixed growth within bands ending at 100, 150, 200, 250, 375, 500, 750,
  and 1,000.
  Match the previous curve at these boundaries and preserve the existing
  post-1,000 rate. This keeps the existing early game and late tail, and
  lowers the targets and rewards between the anchors. The legacy numeric
  fallback applies only above Rift one billion.
- A wall-clock rollback replayed the final minute of a paid 3× Lab boost.
  The baseline credited 180 seconds of work again instead of 60. An
  in-session forward jump also bypassed the manual Luminous Mote cooldown.
  Foreground gameplay now advances timed effects with the monotonic clock,
  and saves retain the settled endpoint to prevent replay after a cold load.
  Daily dates and time away from the game still use the device calendar.
- Android credited the offline test window and preserved both saves, but
  the recap stayed hidden. A committed recap could be discarded when an
  intro was interrupted or finished in the background. Retain committed
  results across visibility changes and present them once on return.

## Acceptance and checkpoint

Verify the growth rates, boss and reward rules, old enemy HP migration,
timed effect boundaries, negative controls, existing regression groups and
required CI. Measure pacing separately from Android and human acceptance.

[PR #45](https://github.com/xariib/Lumenfall/pull/45) merged at
`ada037deed133dc4b088e905c48ebb0ba6adf841` with the tested PR tree.
The first candidate passed the signed Android upgrade, save-retention and
retail launch workflow. Its wider bands also exposed an eight-hour
Auto-Ascend-OFF replay mismatch in the final Wisp charge. Narrower bands
preserve more of the previous deep-Rift economy and pass the original
focused whole-window versus one-second comparison, including its strict HP
and charge assertions. Keep the full regression and the emulator check
required for the revised candidate. The isolated offline workflow passed
the revised bands at their existing assertion thresholds.

Node 24.19.0 replayed four independent eight-hour windows at one-second
intervals on both the baseline and final product bytes. Every reward total
and all four endpoint hashes match on this Windows runtime. The Windows
hashes differ from the archived canonical hashes for both versions, so the
canonical vectors were retained and only their source binding changed.
The historical PR15 Auto Ascend check retains its exact frozen endpoints
under the original curve. The current curve also passes the live versus
offline endpoint comparison at the full reward rate. The mature clock-stall
control retains its original curve inputs, while the current curve runs
every positive endpoint and strict remaining-HP assertion.

The timed Lab UI fixture now expires test boosts on the same gameplay
clock the app uses. Its original 1,182 assertions passed across all 12
profiles. Android 0.2.103 passed the native upgrade, recap, and retail
launch checks with the exact game assets in this PR.
[Signed Android test build](https://github.com/xariib/Lumenfall/actions/runs/42607998638).

The initial full Linux run passed 187 of 190 scenarios. The two remaining Forge
Queue checks now verify the exact settled timestamp in addition to the
unchanged economy and single save. The mature manual-purchase fixture now
clears Rift 130 before Ascending, so it can make the original 60-second
purchase before its first reset. The queue fixture still covers the
earlier Auto Ascend. All three corrected scenarios passed locally with
the same product bytes.

## Android release

The [final PR regression](https://github.com/xariib/Lumenfall/actions/runs/42622976160)
and [integrated regression](https://github.com/xariib/Lumenfall/actions/runs/42631360621)
both passed all 190 main scenarios, isolated offline catch-up and browser
smoke. The other five release checks also passed on the integrated commit.
[Comet](https://github.com/xariib/Lumenfall/actions/runs/42631359935),
[Forge](https://github.com/xariib/Lumenfall/actions/runs/42631360300),
[Lab](https://github.com/xariib/Lumenfall/actions/runs/42631361326),
[shared UI](https://github.com/xariib/Lumenfall/actions/runs/42631361032),
[Tree](https://github.com/xariib/Lumenfall/actions/runs/42631360906).

The [publishing workflow](https://github.com/xariib/Lumenfall/actions/runs/42642718620)
verified the installed game, offline recap, both save slots, paid progression
and retail launch before publishing
[Android 0.2.104](https://github.com/xariib/Lumenfall/releases/tag/android-1000104).
The APK is 5,162,993 bytes with package `com.lumenfall.app`, version code
`1000104` and the established signing certificate. The anonymous public
feed, versioned download and latest download matched the tested APK and its
SHA-256 `776ebf190673b4f90e542bc2ebf92abad315cee7b434914ad4dde1e9690a9c3d`.
The in-game path is **Settings → App updates → Check again → Download & install**.

The follow-up Android emulator test discovered and installed public version
`1000104`, reopened the game from Android's **Open** button and retained both
save slots. Its separate, unpublished 0.2.105 build timed out waiting for game
controls on a retail emulator. The exact published 0.2.104 APK passed that
retail launch check. [Follow-up run](https://github.com/xariib/Lumenfall/actions/runs/42644201970) ·
[Updater receipt](https://github.com/xariib/Lumenfall/actions/runs/42644201970/artifacts/13686594225) ·
[Published APK retail receipt](https://github.com/xariib/Lumenfall/actions/runs/42642718620/artifacts/13685843888).

Release delivery is complete. Physical-phone testing, Play Protect
classification, exact WebView 60, TalkBack and human pacing remain separate
acceptance checks.
