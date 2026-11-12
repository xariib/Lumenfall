# Rift theme redesign evidence

Feature: [RIFT_THEME_REDESIGN_001](../../tasks/RIFT_THEME_REDESIGN_001.md).
[PR48](https://github.com/xariib/Lumenfall/pull/48) is merged at exact tested commit
`63c63b1a02a68545a1e95cd10d7828e3187f0672`.
Product SHA256: `ce51bc14e82c41929483c6483684add0390690d92d181c8aa35a91336aad0ac8`.

## Final-source acceptance

- `release-readiness.json`: all eight applicable PR workflows and six release
  workflows pass on the exact source. Existing conditional Prism triggers were
  inapplicable. Includes run URLs, commits and job/step outcomes.
- `final-pr-scenarios.txt`, `final-release-scenarios.txt`: each broad run passed
  220 browser executions across 190 deterministic scenarios, zero failures;
  each separate isolated offline job also passed.
- `final-visual.json`: 1,399 passing assertions across 12 profiles and 16,560
  encounter/theme/profile combinations. `final-fit-control.json` and
  `final-dot-control.json` reject their intended defect, with clean browser exit.
  `final-shared-log-excerpt.txt` records the exact Shared CI result.
- `final-quick.json`: 117 assertions, including the rendered Collection guide,
  removed controls, six main themes, original art and legacy-save preservation.
- `final-replay.json`: four eight-hour second-by-second comparisons with main
  `dc78daad` (same game as `5656cf85`); 115,200 calls per source. All complete
  saved states, rewards and original canonical endpoints match exactly.

Final Shared artifact 13953381841 from run 43235782089 reports ZIP SHA256
`22f7b7e0d26efbd08368b48121c295798696af204fb583d7917f8d547e7e8514`.
Selected raw receipts were downloaded before expiry. Node/browser versions are
in the receipts; local Node 24.22.1, full visual matrix Chrome 157.0.8103.50.

## Android delivery

Build [43247033269](https://github.com/xariib/Lumenfall/actions/runs/43247033269)
published integrated `63c63b1a`. `android-publication-dispatch.json` records the
request. First job 131282364141 failed native touch calibration with an input ANR
and DevTools 1006 after signing/exact-assets passed. System-app GPU stalls over
80 seconds and responsiveness warnings were also observed; cause is unproven.
`android-first-failure/` preserves raw logcat/state bytes (gzip), their hashes,
instrumentation failure and identity. Its source artifact 13958681266 reports
ZIP SHA256 `f1358ed10328dd81ab0466cae0bec2ed55aabf758dca7fa2d7b4c6625369f746`.
Unchanged-source retry 131289364039 passed native save upgrade, updater, retail
launch and publication. No check or deadline was relaxed; the retry does not
prove the first failure's cause.

[Android 0.2.111](https://github.com/xariib/Lumenfall/releases/tag/android-1000111)
is version code 1000111, package `com.lumenfall.app`, with the established certificate
recorded in `android-release/identity.txt`. APK SHA256:
`6bcef5120e943da897c246ceb0608a3e87bb296cd0a28379de56dff71405afac`.

- `android-workflow.json`: final successful job/steps and both artifacts. Signed
  artifact 13958074717 reports ZIP SHA256
  `75793f10a083467f49f3b2637b67e9e296b361f8169f671787deac9e0b43677f`.
- `android-release/`: exact downloaded identity, hash, assets, source commit,
  upgrade/updater/retail/security receipts and selected touch evidence. Both
  save slots, paid study/progress, UID, origin and Comet entitlements survived.
  `files.json` gives raw hashes; gzip files preserve native log bytes.
- `android-release/local-assets.json`: independently verified packaged game,
  fonts, branding and origin against the integrated checkout.
- `android-release/public-verification.json`: anonymous versioned/latest APKs
  match the tested APK byte for byte; checksum, commit and latest update feed
  match. Verified 12 November at 15:47 UTC.
- `android-release/installed-rift-looks.png` and `production-normal-launch.png`
  were visually inspected: one scene, contained original enemy, Ember/Starlight
  rings, readable controls. Retail launch has no WebView debugger or test runner.

## Earlier evidence and findings

These files are retained as historical evidence and do not replace the final
source receipts above:

- `quick.json`, `visual.json`, `independent-replay.json`, `integrated-replay.json`,
  `combined-visual.json`, `combined-local-summary.json`, `combined-forge-lab.json`:
  earlier candidates and main integration. Canonical replay endpoints unchanged.
- `cosmetics.json`: 170 samples, contrast, keyboard/touch, reduced motion,
  save/recovery, Comet decorations. `existing-parity.json` preserves the existing
  chronological check. `layout-summary.json` covers 15 fresh/dense/boss fixtures
  and the intended collapse failure. Final CI reran applicable checks.
- `theme-*.png`, `collection.png`, `320-large-text.png`: visually reviewed local
  theme/Collection previews; source provenance is in associated receipts.
- `android-candidate/`: unpublished signed 0.2.109 candidate 43218948236 on `0501ecdb`,
  predating the Forge/Lab integration. It passed native upgrade, updater and
  retail launch; it is not the final combined release.
- `tree-first-failure/`, `tree-second-failure/`: early browser startup timeouts,
  including Chrome `--version`, with no DOM/QA result. Both unchanged-source
  retries passed; final-source Tree checks passed. The initial premerge failure
  was an obsolete six-region-landmark assertion, corrected for the explicitly
  requested one-scene design while retaining other layout/region/boss checks.

Local Chromium startup required outside-sandbox execution. Baseline quick 122
ran on root PR42 `6bd4b293`, whose Rift visuals matched original main; exact main
sources were used for gameplay parity. This is self/automated verification.
Physical-phone, exact WebView60 DOM, TalkBack, Google Play Protect, independent
review and human design acceptance remain unverified. The task stays open and
is not archived.
