# Endless Forge and earned Lab access evidence

12 November release continuation: `release-20261112/` records checks against
current main6b990b70/Android0.2.107. Candidate source `af207697` preserves all
complete paired replay states and canonical hashes. `focused.json` records
15 passing suites; `lab-access-summary.json` records the fresh890-check native
mobile pass. These supersede the older source-specific receipts for this release.
PR46 remains closed and excluded. Android/CI delivery continues in the task.

Baseline `a75763d3`, Android 0.2.95. Windows PowerShell, Node 24.20.0,
Chromium 157.0.8103.39 (Brave). Receipts report the bytes actually read locally;
Git canonical LF and Windows checkout line endings can have different hashes.

- `baseline-forge.json` and `baseline-lab.json`: unchanged integrated source.
- `core.json`: new requirements, real transactions, 5/8-hour farm budgets and
  repeated spending with the same budget plus the remaining balance.
- `mobile-access.json`: eight Lab gates, 12 mobile/text/motion profiles and
  trusted touch after the prerequisites are earned.
- `independent-replay.json`: original and candidate match every saved field and
  all canonical hashes across four eight-hour windows of one-second calls.
- `current-main-replay.json`: local continuation against `721ccbbc`. The combined
  candidate preserves all four full states and canonical hashes. The earlier
  replay receipt is retained for the original PR head.

Reproduce from the repository root:

```text
node tests/behavioral/endless-forge-lab-pacing.cjs index.html --negative
node tests/behavioral/lab-speed-controls.cjs index.html --access
node tests/behavioral/forge-workshop-pacing.cjs index.html --negative
node tests/behavioral/lab-longtail.cjs index.html --negative
node docs/qa/endless-forge-lab-pacing-002/independent-replay.cjs --base 721ccbbcdf3dac6d12710b721c6870f32ed9e2d4 --receipt validation-evidence/forge-lab-replay.json
```

Synthetic farming estimates and browser tests do not establish calendar pacing,
Android install acceptance or exact WebView 60 DOM behavior.

The concurrent Windows long-tail browser check completed all 326 assertions and
12 profiles, then reported `Browser close deadline`. It left two task-owned
directories with no running browser, worktree or reparse point:

- `C:\Users\CustomCodings\AppData\Local\Temp\lumenfall-ui-regressions-NWbTgM`
- `C:\Users\CustomCodings\AppData\Local\Temp\lumenfall-ui-regression-browser-q3b4UK`

Verified both exact paths and task provenance. The tool rejected the native
PowerShell `Remove-Item -LiteralPath ... -Recurse` call before execution with
`CreateProcess ... rejected: blocked by policy`. Both remain. The earlier
combined staging/cleanup command was also rejected before creating its stage.
