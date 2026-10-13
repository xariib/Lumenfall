# Swift review fixes — 12 October

Current Swift source348c780c8c8193cc78dc58183d076e354c33e2e8459dcca13866f3a028d7d644.
Independent core21 groups/110 boundaries/15 actual causal controls PASS.

Oversized receipt/audit credit is rejected unless issued refund plus explicitly
matching wallet-transfer proofs can fund it. Exact payment may legitimately move
an unrepresentable residual numeric wallet into the ledger; that transfer now
has its own bounded hexadecimal proof in both receipt/audit. Rejecting all credit
above the original refund would destroy legitimate moved-wallet value. Tests
cover both exact transfers/spending and corrupt matching proofs selecting recovery.

The Study clock memo keeps one origin across100ms foreground calls, including
canonical autosaves and paid mutation copies. Restored/replaced states or clock
discontinuities reset the origin. Independent remaining−elapsed×speed equality
holds across600 calls and twelve autosaves, with existing paid-work/Ascend
and strict replay checks retained. No fields/tolerances or historical scheduler
were removed from preservation tests.

The caller-origin repair also makes the old iterative-charge restoration control
pass the historical four-hour example. Its assertion and deadline stay intact.
The charge control now halves only projected charge and is caught by a new
independent1s natural-work/external-grant oracle. It is an actual causal assertion
failure, not a stale mutation that passes after another root-cause fix.

Core receipt attached. Final six CI lanes, integration and native acceptance
remain pending. Earlier source-specific PASS/FAIL and browser transport timeouts
remain preserved; no current Android acceptance is claimed.
