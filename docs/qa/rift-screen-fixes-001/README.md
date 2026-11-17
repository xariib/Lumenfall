# Rift screen fixes — evidence

Task: [RIFT_SCREEN_FIXES_001](../../tasks/RIFT_SCREEN_FIXES_001.md).
Baseline mainb075cfba; [PR60](https://github.com/xariib/Lumenfall/pull/60).
Status: combined-source CI and signed Android rendering acceptance pending.
Self-review and automation only; no independent review claimed.

The three requested changes remove Rift hints, put Farm left/Push right, and
prevent landscape silhouettes from showing through the enemy arena. Original
theme/species art, combat, prices, progression and saves are retained.

Current HTML SHA256:
0c374c2d103ca8bdad11ee035743d064771a576d7794599b527fcf4a21c1a60a.
Newer main0adb60eb/PR59 was merged while retaining its complete finite Forge
and Lab presented-surface/isolated-profile fixes. `combined-paired-replay.json`
passes four8h windows against that newer main, comparing every saved field and
reward and retaining all immutable endpoint hashes. Combined CI/Android must
pass; all42ab/browser/Android133 receipts below are pre-merge historical.
The Rift field remains at z-1 inside isolated visuals,
legacy Comet Trail at auto/0, original ring at z1 and enemy at z2. Earlier
e210529d receipts below are historical, before the paid Trail correction.
The focused current-source check passed666 checks and five causal controls.
Signed Android133/run44077735744 passed all functional and screenshot checks.
The test-only follow-up fc706870 retains identical product bytes, fixes the
last stale hint expectation in wisp-formula-contract and runs it early in CI;
that early scenario/matrix/controls passed. New full exact-commit gates run
under44087287979 (PR) and44087341618 (prepared release validation).

- `paired-replay.json`: four paired8h windows/115,200 one-second calls per
  source. Every saved state/reward matches released main. VM reference and
  original browser oracle are distinct existing receipts; each keeps its own
  endpoint hashes. Only the current HTML binding changes.
- `layer-only-proof.json`: every production JavaScript byte in the revised
  separate-SVG product matches the full paired replay's source. Its changes
  are confined to SVG/CSS layering; original browser endpoints stay unchanged.
- `trail-layer-only-proof.json`: the current42ab3e34 source also retains every
  production JavaScript byte from the paired replay. `source-review.json`
  verifies all61 original SVG symbols, fonts, branding and native files.
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
  in `docs/PROJECT_STATE_2026-11-17_RIFT_BASELINE.md`; active index compacted.
- `android-first-candidate/`: signed0.2.131/build44064059604 passed functional
  identity/assets, save upgrade, actual updater and retail launch. Visual review
  then found the fresh retail ring absent; retain that failure. Upgraded app
  screenshot has its ring. Cause unproven. This prompted separate SVG layering
  and a second settled retail screenshot; this first candidate is unpublished.
- `android-second-attempt/`: unchanged0.2.132 initially failed live retail
  accessibility; `android-candidate-132/` retains the passing unchanged-source
  retry. Its z0 field still precedes the final Comet Trail correction.
- `prepared-lab-first-failure.json` and `prepared-lab-second-failure.json`:
  superseded e210 source had two different native-input failures. No assertion
  or deadline was weakened. Current-source gates must pass independently.
- `windows-contract-baseline-diagnostic.json`: the existing reduced-motion
  dump-DOM probe rejects both baseline and candidate when global CSS reports
  transition-property none with0.001ms duration. No charge CSS was changed;
  this is an open, separate baseline harness finding.
- `final-matrix/`:666 checks,18 profiles,24,840 encounter/theme samples and
  five rejected controls on HTML42ab3e34. Actual screenshots of Rifts286–288
  self-reviewed alongside the user's original JPEGs; all three enemies clear.
- `formula-stale-hint-failure.json` and `ci/validation-a8824283.json`: both
  a882 full suites completed with one stale assertion expecting the removed
  objective. The test-only correction retains all numerical Wisp/boss checks
  and verifies retained boss-trait text in the Encyclopedia. Final CI required.
- `wisp-fc-first-failure/`: unchanged Linux causal control hit the existing
  300ms setup-settling deadline; Windows passed. Same-source Linux retry passed.

Local runtime: Node24.22.1/Chromium157. CI uses each workflow's pinned runtime.
Physical phone, exact WebView60 DOM, TalkBack and human acceptance remain open.
Required acceptance stays open until final-source CI and Android review pass.
