# Farm Lab hint readability — evidence

Approved scope and exact checkpoint: [task](../../tasks/RIFT_HINT_READABILITY_002.md).
No gameplay, price, save or package change; no release. Self-review and automated
checks are not independent human acceptance.

## Reproduce

Use Node 24.19.0 and Chrome/Chromium on PATH, with the normal repository fixtures:

```sh
node scripts/ci/validate_source.cjs
node scripts/codex/check_context.cjs --task docs/tasks/RIFT_HINT_READABILITY_002.md
node tests/behavioral/midgame-farm-guidance.cjs index.html --negative
node tests/behavioral/endless-guidance.cjs index.html --negative
node tests/behavioral/endless-progression-core.cjs index.html --focus-f
node tests/behavioral/lab-expansion.cjs index.html --negative
node tests/behavioral/forge-expansion.cjs index.html --negative
node tests/behavioral/endless-ascend-counters.cjs index.html
mkdir -p mobile/www
cp index.html mobile/www/index.html
cp -r fonts branding mobile/www/
node tests/behavioral/rift-guidance.cjs "$CHROME" mobile/www validation-evidence/midgame-farm-mobile --midgame-accept
```

`CHROME` is the absolute installed browser path. The two optional
`--mutate-hint-open` / `--mutate-hint-refresh` controls must fail at their
specific opening/refresh assertions; CI checks exact causes, source hashes,
empty runtime errors and clean browser teardown. Original Guidance and
full stateful/offline gates remain required and unchanged.

## Retained receipts

- [Local Node results](local-checks.json): bound to the preceding safe-area
  candidate SHA-256 `d3366466b7fc3a6eaee487e43a3975c990700de243e5844b39d17fb4a77db902`.
  The final correction changes only summary CSS and QA diagnostics; full
  final-source CI remains separately qualified in the task.
- [Source preservation](source-preservation.json): parse the production IIFE
  with Node 24's bundled Acorn; compare each original top-level function's exact
  source span against main `8dabca9`. Of 567, 565 remain byte-identical; only
  the renderer and event registration change. Full diff separately verifies
  the CSS/markup and absence of unrelated constant/asset changes.
- [Large-text failure](large-text-before-failure.json): the earlier 200%
  summary exceeded its fixed viewport after four successful profiles. The
  final CSS correction keeps all fonts and assertions; exact 18-profile and
  causal-control acceptance is recorded in the task.
- [Independent offline regeneration](offline-source-binding.json): the
  original `offline-catchup.cjs --generate-swift-golden` recomputes four
  sequential eight-hour windows using one-second advances. Every reward and
  complete-state hash matches the previous accepted reference. Only its
  source fingerprint changes. The original UI guards/assertions/deadlines
  remain; CI now also checks the same source binding early.
- [First browser failure](first-browser-failure.json): exact native-button
  input failure before the QA-only correction; not a passing matrix.
  [Full raw artifact](https://github.com/xariib/Lumenfall/actions/runs/40033985420/artifacts/12536641256)
  retains its screenshots/DOM and clean Chrome teardown. Source assertions,
  state preservation and the failing destination requirement are retained.
- [Installed candidate summary](android-candidate-summary.json): run #28 on
  exact final-product `5b2d1a6`, signed in-place upgrade, both slots and paid
  value retained, native summary/details/Lab navigation PASS. Only synthetic
  fixtures were used on the disposable emulator. [Workflow proof](android-run-28.jpg)
  and [installed dialog](installed-midgame-farm.png). Earlier run #26 remains
  historical evidence in the task and repository history.

The local browser could not create its singleton socket in this sandbox;
its pre-profile failures are environment evidence, not game failures or PASS.
Browser CI, installed emulator and physical phone/WebView60/TalkBack/human
acceptance are distinct. See task for latest runs and remaining gates.

## Full-suite contract correction

[Legacy failure](legacy-layout-failure.json): the original observer still expected
the deliberately moved Farm quote inline. It now opens and measures the real
visible complete dialog, checks accessible content, Close/focus, state/save and
unchanged combat geometry. All other inline hints retain their original checks.
The same cases run early and again in the full suite; no case is skipped.
[Animation failure](rift-animation-failure.json) is separately retained; the
unchanged phase-sensitive gate is not waived. See task for current full CI.

[18-profile summary](browser-matrix-summary.json) and inspected 200% text images:
[320 px summary](summary-320-text200.png), [320 px details](details-320-text200.png),
[390 px details](details-390-text200.png), [430 px shortfalls](shortfalls-430-text200.png).
These are qualified to run 40036520804 and identical final product bytes;
that full run was cancelled after offline-binding failures, not a full PASS.

## Integrated browser acceptance and remaining installed gate

[Final receipt](ci-final-summary.json): all six required workflows PASS on
`0d7937ae39d77543270ec5ce154c34ce83d991b6`; both full CI jobs and runtime smoke PASS.
The integrated commit `88d9bdd33dafb4d075f8b86254ef050ade99e32d` has exactly the same tree.
The 18-profile matrix, both causal controls and original layout cases pass.
Earlier failures remain failures in their receipts/history. The unchanged
animation gate also passes; its intermittent finding is not claimed fixed.
[Separate proposal](../../tasks/RIFT_VFX_OVERFLOW_001.md) is not approved.

Android #28 accepted the identical product on the disposable emulator.
Exact-main installed acceptance remains blocked by the unavailable
execution/browser environment; the connector cannot dispatch the manual
workflow. No integrated build or APK release was performed. Resume main
with `publish=false` after checking unchanged product/build/driver bytes.

The Node context check passed on 0d7937a before the final status edit.
Final UTF-8 startup is 32397 bytes, calculated by replacing the exact
previously checked PROJECT_STATE/task inputs; changed local link targets were
verified against the published tree. The post-edit Node command could not be
rerun without an execution environment and remains an explicit next check.
Physical phone/WebView60/TalkBack/human acceptance is still unverified.
