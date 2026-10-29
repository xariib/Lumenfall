# Complete-game and Workshop audit — candidate evidence

Baseline: `595619f27b54eee351c5f3f2dfb0dd46a4ecd487` / Android 0.2.54.
Current scope/checkpoint: [task](../../tasks/FULL_GAME_WORKSHOP_AUDIT_001.md).

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

Browser receipts/screenshots are being collected into this directory after
completion. Current claims are self-review/automated evidence. No claim of
physical-phone, exact WebView60 DOM, TalkBack or human pacing acceptance.
