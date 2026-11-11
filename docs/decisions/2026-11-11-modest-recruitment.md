# Modest recruitment easing — 11 November 2026

During the exploit/balance audit, the user clarified: "Make recruitment gates
a little easier not much." This supersedes the proposed target of all eight
recruits by weeks 3–4 for the measured six-active-minutes/day policy. That target
was not accepted as a requirement for this change.

The announced implementation lowers each later Wisp's completed Wisp Ascendancy
requirement by one level: Gale 18→17, Thorn 24→23, Void 30→29, Aurora 35→34,
Titan 48→47. Rift thresholds remain 15/35/55/75/100. Early recruits, purchase
prices, Lab durations, rarity/Ultimate/Mastery goals and earned entitlements
remain unchanged. This is a small gate adjustment, not a promise of a particular
calendar unlock date; actual benefit depends on research funding and speed.

Boundary, real-purchase and save-retention regressions are in
`tests/behavioral/modest-recruitment.cjs`. Existing progression and Tree boundary
oracles use the new accepted gates. The original campaign receipts are retained
with their source hashes; new measurements must be identified separately.

Delivery status: [EXPLOIT_BALANCE_HUNT_001](../tasks/EXPLOIT_BALANCE_HUNT_001.md).
