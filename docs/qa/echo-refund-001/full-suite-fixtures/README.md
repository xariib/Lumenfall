# Local Full diagnostics, 12 October 2026

Product source: d90742bc1e9377e8a35ac8dc498f3a6d5509d2c05e71353f2c3df33d6e6f21f8.
Runtime: official Node20.20.2, Chromium151.0.7922.173, supported CDP pipe fallback.
These are local diagnostic observations, not native evidence or a passing Full gate.

The complete [older-fixture run](full-local-older-fixtures.txt) finished with
199 PASS and 13 failures out of212 observations. Its instrumented test bundle
was captured before the final historical Tree/upgrade fixture corrections;
product bytes stayed d90742bc. Corrected upgrade identity, effects, Tree contract
and all six Tree UI width/motion observations pass targeted checks retained here.
Only nonexistent historical audit markers were omitted from historical overcap
constructors; current fresh states and all recovery/value assertions remain.

The offline12h UI failure was missing required mobile/www staging. With the same
product bytes and fonts/branding staged, [the unchanged driver passes](offline-ui-fixed.txt).
Its18 new screenshots are retained separately in offline-ui-d90742bc/; accepted
historical screenshots were restored byte-for-byte rather than overwritten.

Rift status and [high-power parity](parity-high-isolated.txt) pass isolated runs
without a game change after their broad attempts produced no completed QA.
Ascend contract produced no completed QA in both the broad attempt and
[isolated attempt](ascend-contract-isolated.txt); the latter reports an8-second
Runtime.evaluate CDP deadline. This is a remaining local transport limitation,
not a passing contract or a causal control. No deadline/assertion was relaxed.

Boss retry failed its strict enemy-HP comparison in the broad run. An isolated
[current-source run passes](lifecycle-boss-current.txt); an isolated
[accepted-development baseline run fails](lifecycle-boss-baseline.txt) with the
same comparison. This establishes baseline sensitivity in this local setup,
not a proven new refund regression. No timing/tolerance/gameplay change follows.

Failed raw process/result metadata remains saved alongside these logs. Final
PR111 headcc03edba must pass all six exact-head CI lanes before development
integration. Accepted historical Full182/212/22 and its raw-log gaps retain
their original source/runtime identity; these attempts do not replace them.
