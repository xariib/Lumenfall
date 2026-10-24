# RIFT_VFX_OVERFLOW_001 — investigate transient Rift effect overflow

Status: proposed, not approved; no implementation started.
One goal: determine and correct the cause of the phase-sensitive Rift layout
failure without changing combat geometry, readable content, gameplay or saves.

## Observed evidence

[Readable hint task](RIFT_HINT_READABILITY_002.md),
[synthetic failure receipt](../qa/rift-hint-readability-002/rift-animation-failure.json).
On `42390366c03c98a3e7fe7803d3dc748975662f70`, product SHA-256
`8d957895a5e82bf8a6b4f78abc6affea8e796171a228e8b185c3261b61cceb83`,
[full run 40040519633](https://github.com/xariib/Lumenfall/actions/runs/40040519633)
failed `rift-status-stacking-mobile`: 360x640, 24 px safe insets, normal motion,
Boss fixture. `enemy-stage` scroll height was 131 vs client 129 with active
Void VFX extending below its box. Browser teardown was clean.
The exact same product/driver passed the scenario in run 40036520804.
Relevant combat CSS/functions/driver are unchanged, and this Boss fixture does
not use the Farm Lab hint. Cause is not established as a test-only defect.

## Proposed investigation and acceptance

- Reproduce on the current candidate and original main
  `8dabca95c379af3e87ff1a03c0f8c615ebf36735` with exact source hashes.
  Inspect full animation phases and the measured content; distinguish decorative
  effect bounds from any actual text, target or layout clipping.
- Establish the intended bounds from existing requirements before choosing a fix.
  Preserve Guardian Tap minimum size, normal/reduced motion, Formation effects,
  all original mobile viewports and the complete native navigation checks.
- Keep the existing failure and regression gate. Do not raise tolerances, skip
  cases, disable effects or remove assertions merely to obtain a pass.
  Add a causal negative and repeatable phase coverage for the actual cause.
- Preserve complete state/save, combat behavior, prices, assets and Android
  identity. No APK release is authorized by this proposal.

Approval and baseline investigation are the next action. Physical phone,
WebView60, TalkBack and human pacing acceptance remain separate open gaps in
the hint task; this proposal does not close them.
