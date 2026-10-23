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
