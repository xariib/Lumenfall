# Upgrade affordability — local evidence

14 October 2026. Baseline `a4f82f4`, source `e110f182`; candidate SHA-256
`084f29955540f8ecabbd34088a5e404c62f8f3d1d58cf74dddf0a4d93100a8ae`.
Node24.19.0, Chromium151.0.7922.34 on Windows. Self-review only.

Wisp Empower/Recruit, Rarity Up, ability upgrades and Ultimate prices now use
the same independent currency affordability colors as Forge, Lab, Tree and
Comet prices. Resonate keeps its existing text price and gains both shared
coloring and live native disabled-state refresh. A Lumen shortage does not turn
an affordable Shard amount red, and vice versa. Prices, purchase handlers,
caps, progression, saves, queues and refund-aware purchasing rules are retained.
The checkpoint's normalization check proves all product bytes outside three
presentation functions and one font-size rule equal the baseline.

Verified checks on this candidate:

- New `upgrade-affordability.cjs`:26,844 assertions,12 profiles, all8 Wisps,
  five actions each, initial/refresh/re-render, exact funding, each resource
  independently one short, wallet loss, native disabled clicks, full state/save
  preservation, focus, mobile control fit, prerequisite and cap guards.
  Widths320/390/430, text100/200%, normal/reduced motion.
- Original source fails on the actual computed Empower price color.
  Two causal controls fail at the expected color/Resonate eligibility assertion.
- Existing `collection-price-ui.cjs --negative`:5,808 assertions/12 profiles,
  three controls rejected; Forge/Lab/Tree/Comets, real paid touch and both saves.
- Wisp upgrades12,912/12; card layout21,528/12; scroll/focus3,229 assertions;
  Lab speed1,118/12 profiles, including purchases and speed queue retention.
- Wisp core8,099 assertions, seven controls and preservation8,592 PASS.
  Same core/preservation pass on Node8.3.0 / actual V8 6.0.286.52. This is
  legacy JavaScript acceptance, not an Android device claim.
- Resonate existing browser suite passes all12 profiles plus Ascend/save checks
  on both original and candidate after a test-only animation wait. Without
  that wait, both sources fail the44px check while the entry animation scales
  the button to43.83px. Strict size assertions remain unchanged; diagnostics
  now report dimensions. No game animation or touch target was changed.
- Source syntax/lifecycle validation, task context and whitespace PASS.

Machine results and selected normal/200% screenshots are saved alongside this
file. Screens were visually inspected. The clipped decorative card glow is
excluded from control-fit measurement; actual button/price text is checked.
Full original raw receipts remain under
`validation-evidence/upgrade-affordability-worktree/validation-evidence/upgrade-affordability/`.
The new test is added to the existing pre-merge currency acceptance CI step.

Reproduce with the repository's configured Chromium executable in
`LUMENFALL_QA_CDP_CHROME`:

```sh
node tests/behavioral/upgrade-affordability.cjs index.html validation-evidence/upgrade-affordability --negative
node tests/behavioral/collection-price-ui.cjs index.html validation-evidence/collection-price --negative
node tests/behavioral/wisp-upgrades.cjs --source index.html
node tests/behavioral/wisp-upgrades.cjs --source index.html --card-layout
node tests/behavioral/wisp-rarity-scroll.cjs index.html
node tests/behavioral/lab-speed-controls.cjs index.html
node tests/behavioral/resonate-clarity.cjs --source index.html
node tests/behavioral/wisp-contribution-core.cjs index.html --negative --preservation
node scripts/ci/validate_source.cjs
node scripts/codex/check_context.cjs --task docs/tasks/UPGRADE_AFFORDABILITY_001.md
```

Local integration/preview receipt and the final test-driver run are pending.
Main/GitHub/combined CI and Android/device/WebView60/textZoom/TalkBack acceptance
remain OPEN with the inherited debugging limitations. No push, APK, signing,
release or archive action is part of this local milestone.
