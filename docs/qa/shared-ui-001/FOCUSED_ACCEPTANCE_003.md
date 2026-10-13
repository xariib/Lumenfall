# Shared UI — focused browser acceptance 003

The third diagnostic completed successfully on candidate
`b11567aac6a2d52145fe86c522b36fb559062cf9`, tree
`c9b173671946e4fecfeaffc3305813b9e75911c5`.
[Run 38111828759](https://github.com/karahaNx/Lumenfall/actions/runs/38111828759),
job114388807651, finished at 2026-10-11 04:34:41 UTC. This is focused browser
acceptance; the final PR's complete six-workflow regression and actual
development merge checks remain required before integration.

## Actual execution

| Variant | Checks reached | Complete profiles | Actual result |
| --- | ---: | ---: | --- |
| Candidate | 6,985 | 12 | PASS, driver exit0 |
| Exact brand-spacing reversion | 1,176 | 2 | Expected exit1: `brand-glyph-intersects-settings` |
| Exact Wisp-header reversion | 1,268 | 2 | Expected exit1: `wisp-glyph-intersects-toggle` |
| Exact toast-leading reversion | 1,699 | 2 | Expected exit1: `toast-adjacent-glyph-lines-intersect` |

Each inverse ran the same generated driver and stopped at its named original
geometry failure in the third profile. Every Chrome process exited0 without a
signal; no runtime, readiness, font or timeout failure substituted for a causal
control. The normal run covered320/390/430px, root16/root32 text and both motion
preferences using actual Chrome154.0.8037.97 with Node20.20.2.

All eight Wisps were measured in every normal profile. The saved normal result
contains84 native input records and24 last-chosen-Wisp refusals. Checks cover
actual Settings focus return, 44px targets, independent horizontal bounds,
per-axis ancestor clipping, visible card/main containment and text/control
overlap. Original live state, both raw save slots and write counts are compared
around refused and navigation actions. Toast geometry is recorded immediately
and after native layout settles.

Root directly viewed the three corresponding320px/root32 candidate PNGs and
all three inverse failure PNGs. The candidate wordmark stays clear of Settings;
the Wisp class and Bench occupy separate rows; the two toast lines remain
readable. Each exact inverse visibly restores its original overlap. The
independent audit below records the full numerical, native and image scope.

## Source and audit identities

Product SHA256:
`38eebcb93e4cdc2fbb1f9f67800f8cfb433005904389c0815641d26bbae00b6f`.
Focused test SHA256:
`a2d4346daa8da30d61ef39135cb22399fc7b9b3cce40da9813d70c1fbcdf058c`.
Actual generated driver SHA256:
`d7ae33bf404009191d0dbe726f9d7ed6b2fa9eaa633413174da4863b011f82f5`.
Normal receipt SHA256:
`9161f534942e0abdf82994e032fd0430dbe1308b0297083f2e866c117b0760ae`.

Original artifact11691069774 is61,535,025 bytes, SHA256
`d3cce420e3e195bfe2cd1f88f9c56abfa18a0b0cfefc552fb5d49c77c4b0a5fb`.
Its193 ZIP members were retained and verified against the API identity, CRC,
safe paths and exact extracted bytes. Original raw results, source archive,
process records and images are retained separately from this concise review.

The original raw package manifest is SHA256
`7f84345e2acdcd75b7ec394017d14205286ced7d3d1fb7efee6f15f87078ab07`.
Its CI audit verified all724 archived source bodies against the actual Git
commit, all6,443 tracked inputs across18 recorded snapshots, the complete
22,087-byte job log and all eight actual standalone command results. The
original six standalone commands are retained unchanged. The raw audit is
SHA256 `f42d9bb80eee24385a8bc61817f986b3e0c42d9e43e39155a37e69fe050010c8`;
the source audit is
`b5317a97b8e514593e628e5ccc16f399fc123ed6cc8fbb8877d0d02092e8d809`.

[Independent browser acceptance](diagnostic-003-review/acceptance.json) and
[scope/limits](diagnostic-003-review/README.md) are copied byte-for-byte from
the frozen review. Its manifest SHA256 is
`145054763900dd3c8e13a227210bee2ed040c6af5316465e959c80293cf6f7fd`;
the compact acceptance SHA256 is
`0dad02ad5c76492bd2743186352ed6d0e5a6f59dcf512927410ab3d8f427b4bc`.

That independent review verifies5,736 glyph measurements and1,536 actual
clipping-owner observations over192 immediate/settled Wisp observations.
All168 complete-state/raw-slot comparisons were equal, with zero save writes.
All72 normal PNGs and the three causal failure PNGs were directly viewed.
All118 PNG bodies are hash-bound (116 unique hashes); the other43 negative
prefix images are expressly not claimed as separately visually reviewed.
[Root's six-image comparison](root-visual-review-003.json) retains its exact
image hashes. Full details and causal geometry remain lossless gzip in the
closed review, with original and compressed hashes.


## Preserved failures and remaining gates

[Diagnostic001](DIAGNOSTIC_001.md) remains FAIL at113 checks/0 profiles/0
inversions; [diagnostic002](DIAGNOSTIC_002.md) remains FAIL at982 checks/2
profiles/0 inversions. Their transparent-linebox font-overhang false positives
and exact driver-only repairs are retained. Repair003 uses observed actual
clipping owners and preserves the0.5px tolerance and overlap checks. The
product was unchanged between all three diagnostic candidates.

The final PR must run all five original required workflows and the Shared UI
lane, including unchanged price5808/12/3,182 scenario IDs/212 attempts,
40 registered/22 mandatory negatives and frozen fixtures. Integration targets
only development behind draft PR102, followed by actual ordered-parent/tree
verification and13 fresh integrated checks.

Existing Recruit guidance clipping at enlarged text remains the separate F07
follow-up documented in [the acceptance plan](ACCEPTANCE.md); these three CSS
fixes do not establish acceptance of that separate behavior. Native installed
upgrade, exact WebView60/textZoom, physical Android and TalkBack remain open.
Main67373faa, PR102 draft and all APK/build/signing/release holds remain.
