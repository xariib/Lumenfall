# Rift screen fixes — evidence

Task: [RIFT_SCREEN_FIXES_001](../../tasks/RIFT_SCREEN_FIXES_001.md).
[PR60](https://github.com/xariib/Lumenfall/pull/60) is merged into main12122b80.
[Android0.2.136](https://github.com/xariib/Lumenfall/releases/tag/android-1000136)
is published and verified. Duplicate PR full-suite rerun remains pending;
physical/human acceptance remains open. Self-review and automation only.

The change removes the Rift hint strip/dialog and redundant Settings toggle,
puts Farm left/Push right in visual and keyboard order, and keeps original
enemies above an opaque arena center. Original ring/artwork, paid Trail/Crest,
Workshop advice, combat, saves and newer main's finite Forge work are retained.

## Current integrated and published source

- Commit:12122b805b4dd7ad28fef5f26dad94e8a5a8c3df.
- HTML SHA256:0c374c2d103ca8bdad11ee035743d064771a576d7794599b527fcf4a21c1a60a.
- Newer baseline:0adb60eb/PR59; initial baseline:b075cfba.
- Candidate and PR merge-preview tree:5fff90d24b8ff41ffb86a70fea151d5632ab427a.
- APK SHA256:aac1b427e9f573320a968fd3d6b616da5edb6bae4f4bf643ffddb4bdbde41e0e,
  5,163,041bytes, packagecom.lumenfall.app, versionCode1000136.
- Source field z-1 inside isolated z1 visuals; Trail auto/0, original ring z1,
  enemy z2. All61 original SVG symbols, fonts, branding and native files retained.

## Current acceptance

- `integration.json`: lease-checked main fast-forward after six required manual
  workflows passed on the identical SHA. Their actual ref was the feature
  branch. Previous main publication finished before this ref update. Existing
  release-ci-gate and publisher main-stability check remain unchanged.
- `source-review.json`:61 symbols,29 creature definitions, six rings, unchanged
  native/fonts/branding and both byte-exact status snapshots. Newer-main canonical
  history path retained; original full b075 state kept as
  `docs/PROJECT_STATE_2026-11-17_RIFT_BASELINE.md`.
- `combined-paired-replay.json`: four paired8h windows/115,200 one-second calls
  per source against newer main0adb60eb. Every saved field/reward matches. Old
  VM and browser references retain their distinct original endpoint hashes;
  upstream Forge replay binds its accepted baseline to newer main. Only current
  browser HTML binding changes; no reference endpoint is regenerated.
- `combined-matrix/`:666 checks,18 profiles,24,840 encounter/theme samples, six
  themes, both motion modes, touch/keyboard/save/reload/geometry and five rejected
  controls. Original screenshots286–288 compare with actual current-source
  Fractured Serpent/Effigy/Behemoth PNGs; images self-reviewed.
- `ci/validation.json` and compressed job logs: six required release workflows
  PASS, including190 main scenarios and isolated offline coverage. Seven focused
  PR workflows PASS; unchanged full PR rerun44091395146 remains pending. Its
  earlier native disclosure failure is retained separately and the retry passed
  that step. Node24.19.0/Chrome157.0.8103.78; actual legacy V8 JavaScript checks
  pass, without claiming an exact WebView60 DOM observation.
- `android-candidate-134/`: unpublished combined-source candidate PASS identity,
  assets/save/paid work/updater/retail/frame review.
- `android-release/`: actual published136 PASS stable signing identity, exact
  packaged assets, retained UID/both saves/paid work/legacy cosmetics, installed
  Rift controls/layers/native Workshop→Lab, real updater/system install and
  retail Android12 launch with no debugger/instrumentation.
- `android-release/visual-review.json`: all three actual published frames
  inspected; no hint strip, Farm left, original ring/enemy visible, landscape
  outside center and paid cosmetic retained.
- `android-release/public-verification.json`: anonymous versioned and latest APK
  URLs both match the signed artifact, release feed/commit and exact public
  identity/assets/security/dependency/upgrade/updater metadata. Verified14:28:18UTC
  through [build44101297138](https://github.com/xariib/Lumenfall/actions/runs/44101297138).

## Historical evidence and retained failures

Earlier-source receipts below are not current-source acceptance. All originals
remain in GitHub; no failed/incomplete attempt is counted as a pass.

- Initial HTML05ae/Android131 passed functional checks but visual review found
  fresh retail ring missing. Separate SVG backing corrected it. Android132 first
  accessibility capture omitted game controls; unchanged retry passed. Field z0
  then covered paid Trail; z-1 correction and a fifth control preserve it.
- `final-matrix/` and `android-candidate-133/` are pre-main-merge HTML42ab evidence.
  `formula-followup-production-proof.json` binds test-only fc706870 to those same
  product bytes. Current combined evidence uses0c374c2d above.
- `formula-stale-hint-failure.json`: both a882 full suites had one assertion
  expecting boss text in the removed hint bar. Corrected UI bridge/assertion
  checks hint removal and retained Encyclopedia boss wording; all numerical
  Wisp/boss assertions remain. Current mandatory full suite passes.
- `combined-pr-wisp-first-failure.json` and its raw CI log retain the first
  current PR disclosure-touch failure. The identical source passed the prepared
  whole step; unchanged PR retry passed it and still needs full completion.
- `wisp-combined-first-failure/`, earlier Wisp folders and Lab failure JSON retain
  300ms setup/CDP input failures and passing unchanged retries. No deadlines or
  assertions changed. Newer-main Lab surface/profile fixes are retained exactly.
- `reload-first-failure.json`: new test reload race fixed with a per-document
  token. Old cast-text Push→Farm expectation now follows requested Farm→Push.
- Browser timeout receipts and `formula-windows-incomplete.json` produced no QA
  result; no pass claimed. Baseline quick probe stopped at old Workshop active
  dot. `windows-contract-baseline-diagnostic.json` shows the same reduced-motion
  charge-duration rejection on baseline and candidate; charge CSS unchanged.
- `first-premerge-budget-failure.txt`: original startup exceeded32KiB by58bytes.
  Full prior state and newer-main history are preserved byte-for-byte; gate kept.

Physical phone, exact WebView60 DOM, TalkBack, Play Protect and human acceptance
remain unverified. All app/browser states used for acceptance are disposable
synthetic fixtures, not the user's actual save. Keep the task/chat open.
