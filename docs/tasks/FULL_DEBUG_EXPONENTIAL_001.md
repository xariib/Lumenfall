# Full debug and exponential Rift progression

Original request: “Full debug. Look for exploits. The game curve should be exponential.”
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

[PR #45](https://github.com/xariib/Lumenfall/pull/45) is in validation.
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
offline endpoint comparison at the full reward rate.

The timed Lab UI fixture now expires test boosts on the same gameplay
clock the app uses. Its original 1,182 assertions passed across all 12
profiles. Android 0.2.103 passed the native upgrade, recap, and retail
launch checks with the exact game assets in this PR.
[Signed Android test build](https://github.com/xariib/Lumenfall/actions/runs/42607998638).
