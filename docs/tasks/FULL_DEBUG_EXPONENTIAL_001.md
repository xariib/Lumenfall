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
  fixed growth within bands ending at 100, 150, 250, 500, and 1,000.
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

## Acceptance and checkpoint

Verify the growth rates, boss and reward rules, old enemy HP migration,
timed effect boundaries, negative controls, existing regression groups and
required CI. Measure pacing separately from Android and human acceptance.
Product candidate and focused tests in progress.
