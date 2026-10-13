# Local debugging evidence — 13 October 2026

See [task and remaining gates](../../tasks/LOCAL_FULL_DEBUG_001.md).
Current product SHA-256:
`b3eca6661042a7245100d9dcd0a6fbbb2e38a01e99b305102b5307abb52db7a9`.

- `ascend-before.json` and `quest-before.json`: original defects fail actual
  browser assertions on imported source42b180ad.
- `ui-reported-after-v4.json`: current source, 1081 checks, 12 profiles and
  ordinary/Rest Stop layouts; 144 touch/keyboard claims with preservation checks.
- `attention-control.json` and `quest-control.json`: each fix undone independently
  in actual source; exact assertion failure, changed source hash, normal teardown.
- `offline-golden-current.json`: four independent one-second eight-hour windows;
  phase gameplay-state hashes are identical to the previous source's reference.
- `core-current-summary.json`: current source, 17 passing suites; POSIX symlink
  tooling is unsupported by this Windows session. Raw outputs are in workspace
  `work/full-debug/baseline-current/` outside the repository.
- `v8-current-summary.json`: all eight current-source V8 6.0 suites pass. Runtime
  Node8.3.0 win-x64/node.exe matches official SHA-256
  `540f9911360e0a5b6e29a072f5e73bdb61666a9014cd5d1845b312c43103d442`.
- `comet-current-summary.json`: original assertions,12738 checks/12 profiles/
  ten causal controls PASS after proper browser automation/Runtime/DOM setup.
- `rift-current-summary.json`: all four previously failing native touch variants
  PASS on current source after the same initialization repair. Game scroll code
  is unchanged. Full raw receipts remain at the recorded workspace paths.

Source-linked raw full/browser/scoped logs and unsuccessful diagnostics remain
outside the repository under workspace `work/full-debug/`. No failed check was
waived; final full/scoped and native acceptance remain open. No independent
human review or physical Android acceptance is claimed.
