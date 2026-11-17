# Rift screen fixes — evidence

Task: [RIFT_SCREEN_FIXES_001](../../tasks/RIFT_SCREEN_FIXES_001.md).
Baseline mainb075cfba; [PR60](https://github.com/xariib/Lumenfall/pull/60).
Status: final-source CI and signed Android rendering acceptance pending.
Self-review and automation only; no independent review claimed.

The three requested changes remove Rift hints, put Farm left/Push right, and
prevent landscape silhouettes from showing through the enemy arena. Original
theme/species art, combat, prices, progression and saves are retained.

Current HTML SHA256:
e210529dca00e0e32c13a3910a14f79b5df8197685cd323802817cd55b6011a6.
The field has its own SVG at z0, the original ring at z1 and enemy at z2.

- `paired-replay.json`: four paired8h windows/115,200 one-second calls per
  source. Every saved state/reward matches released main. VM reference and
  original browser oracle are distinct existing receipts; each keeps its own
  endpoint hashes. Only the current HTML binding changes.
- `layer-only-proof.json`: every production JavaScript byte in the revised
  separate-SVG product matches the full paired replay's source. Its changes
  are confined to SVG/CSS layering; original browser endpoints stay unchanged.
- `full-mobile-matrix.json`: first field candidate,558 checks,18 profiles and
  24,840 encounter/theme samples. Final separate-field receipt follows below.
- `final-quick.json` and four `negative-*.json`: initial31 checks/four controls,
  all controls rejected at intended assertions with clean browser teardown.
- `baseline.png` and `radiant-rift-286/287/288.png`: before/initial correction,
  synthetic state matching the supplied enemy species. Screenshots self-reviewed.
- `reload-first-failure.json`: new test's initial reload race, corrected by a
  per-document token before accepting initialization.
- `browser-timeout.json`: incomplete local expanded attempt; no PASS claimed.
- `first-premerge-budget-failure.txt`: existing Forge/Lab startup32826 bytes,
  58 above the unchanged32KiB limit. Full prior status preserved byte-for-byte
  in `docs/PROJECT_STATE_2026-11-17_HISTORY.md`; active index compacted.
- `android-first-candidate/`: signed0.2.131/build44064059604 passed functional
  identity/assets, save upgrade, actual updater and retail launch. Visual review
  then found the fresh retail ring absent; retain that failure. Upgraded app
  screenshot has its ring. Cause unproven. This prompted separate SVG layering
  and a second settled retail screenshot; this first candidate is unpublished.

Local runtime: Node24.22.1/Chromium157. CI uses each workflow's pinned runtime.
Physical phone, exact WebView60 DOM, TalkBack and human acceptance remain open.
Required acceptance stays open until final-source CI and Android review pass.
