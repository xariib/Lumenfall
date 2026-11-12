# Rift theme redesign evidence

Feature: [RIFT_THEME_REDESIGN_001](../../tasks/RIFT_THEME_REDESIGN_001.md).
Product candidate `f1c3c56ade415e25239f53442706014cae4d4cb35defe05f97be17549d7bf83d`.

- `quick.json`: six main themes, 230 encounters each, appearance retirement,
  save/backup/reload/Ascend, touch, layout and preserved attack/navigation checks.
- `independent-replay.json`: baseline main `6b990b70`; exact complete-state and
  reward parity across four eight-hour windows, each replayed second by second
  on both sources. The original endpoint hashes are unchanged.
- `existing-parity.json`: existing chronological online/offline checks.
- `theme-*.png`: visually inspected 390px previews, original boss/Wisp artwork.
- `collection.png`: main theme previews and selection UI.

Local browser execution required outside-sandbox access after Chromium startup
was blocked. Node24.22.1; browser path/version is retained in the raw receipts.
Baseline 122-check visual test ran on root PR42 `6bd4b293`, which has the same
Rift visuals as main. Gameplay parity instead uses exact main source from Git.
Full mobile/text/motion suite passes (`visual.json`, 1,375 checks, 12 profiles).
Existing cosmetics pass (`cosmetics.json`, 170 samples); `320-large-text.png`
shows the retained legacy Comet decorations, theme label and contained enemy.
Both causal controls reject their intended defect (`negative-fit.json`,
`negative-dot.json`); `local-summary.json` records all five successful outcomes.
Native Rift contract also passes; raw driver results remain under local
`validation-evidence/rift-redesign/status` until final evidence collection.
`layout-summary.json` records the corrected single-scene contract across15
fresh/dense/boss viewport fixtures and the rejected collapse control. Those
cases use the existing CDP transport on Windows; CI retains its original driver.

Android candidate build43218948236 passes on0501ecdb: version0.2.109/1000109,
established signing, upgrade/save retention, installed theme touch/appearance,
in-app updater and retail-image launch. `android-candidate/` retains identity,
hash, local exact-asset verification, receipts and the inspected installed image.
This candidate is unpublished; integrated-source delivery remains pending.

First Tree CI attempt timed out before both Prism contract/save-reload tests
produced any DOM/QA result. `tree-first-failure/` retains raw diagnostics. The
same-source rerun passed with original deadlines unchanged. Main premerge then
failed the obsolete six-region-landmark expectation; the explicitly requested
single-background contract now replaces that assertion while retaining all
other layout checks. Required CI restarts after this test-only correction.
This is self/automated verification, not independent or physical-phone acceptance.

The second Tree attempt on be4ccf99 also timed out at browser startup, including
`--version`; the contract emitted no DOM/QA result. Its other eight Prism cases
and mobile/V8 checks passed. `tree-second-failure/` retains raw diagnostics.
The unchanged-source retry passed the affected Prism step; final job pending.

Main subsequently integrated PR42 at dc78daad. `integrated-replay.json` compares
the combined Rift product to that exact new main: every complete saved state,
reward and original canonical endpoint still matches across four eight-hour
one-second replays. Combined product SHA256 is
`fe7614f268b02f8b4b5050ce653b997b3e32f1343c5685e8733cdfd562682cc1`.
The prior Android candidate remains historical evidence for the earlier source;
final combined-source CI and signed Android acceptance are required.

Final self-review corrected one stale Collection & Journal encyclopedia
paragraph advertising the retired controls. The visual test now checks the
rendered guide as well. final-quick.json passes117 assertions on product
ce51bc14e82c41929483c6483684add0390690d92d181c8aa35a91336aad0ac8.
This changes help text only. final-replay.json again passes every complete state,
reward and canonical endpoint before source rebinding. Fresh exact-commit CI
and the final signed APK remain required.
