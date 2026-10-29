# Complete-game and Workshop audit — evidence

Baseline: `595619f27b54eee351c5f3f2dfb0dd46a4ecd487` / Android 0.2.54.
Current scope/checkpoint: [task](../../tasks/FULL_GAME_WORKSHOP_AUDIT_001.md).

[Final CI](ci-final.json) binds seven PR gates and seven original integrated-main
gates, both full jobs, 189+1 scenarios and runtime smoke to the exact product.
[Android 0.2.55 delivery](release.json) binds the signed installed upgrade and
anonymous public bytes to `ecf88e35`. Native receipt, APK identity, all packaged
asset hashes, public certificate and download metadata are preserved alongside.
`release-adapter-selftest.json` and `release-adapter-workflow.yml.txt` preserve
the fail-closed one-task CI adapter; its workflow only exists on its QA branch.

`core.json` records production entry-point assertions and three causal controls.
`workshop-caps.json` inventories every active and historical Forge/Lab path,
price, effect, cap and optimistic timed-work bound.
`regular-report.json` / `efficient-report.json` record two full earned-currency
48-hour campaigns. Their endpoints/checkpoints and original hashed policy
sources are retained. Artificially rich transaction fixtures test edge cases;
they are separate from the earned-currency campaign evidence.

`offline-neutrality.json` compares every field at each of four independent
one-second 8-hour baseline/candidate endpoints. `offline-golden*.json` are local
Windows generator outputs, not replacements for the canonical Linux golden.
`regressions/summary.json` and per-command raw stdout/stderr record the broad
matrix and exact product/runtime identity. Any failure remains a failure.
`regressions/windows-full-suite.log.gz` preserves the additional aborted full
Windows/Brave attempt: nine PASS cases, then six 25-second browser deadlines,
each with zero completed QA. Complete original Linux CI is recorded separately.
Its manifest records raw/compressed hashes and a verified exact decompression;
compression preserves the original Windows line endings through Git storage.

Browser summaries and selected screenshots are in `browser/`. The original
65 MB shared-browser receipt is preserved as a roundtrip-verified 9 MB gzip in
local `validation-evidence/full-game-audit/shared-normal.json.gz`; its raw and
compressed hashes/lengths remain in `browser/shared-normal.json.manifest.json`.
CI reproduces and uploads the complete shared-browser evidence. The original
loadout browser-start EPIPE remains in the matrix; `loadout-browser.json` records
the successful full 1,171-check run with the installed browser configured.
Current claims are self-review/automated evidence. No claim of
physical-phone, exact WebView60 DOM, TalkBack or human pacing acceptance.
