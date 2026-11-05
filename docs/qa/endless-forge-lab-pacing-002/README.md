# Endless Forge and earned Lab access evidence

Baseline `a75763d3`, Android 0.2.95. Windows PowerShell, Node 24.20.0,
Chromium 157.0.8103.39 (Brave). Receipts report the bytes actually read locally;
Git canonical LF and Windows checkout line endings can have different hashes.

- `baseline-forge.json` and `baseline-lab.json`: unchanged integrated source.
- `core.json`: new requirements, real transactions and 5/8-hour farm budgets.
- `mobile-access.json`: eight Lab gates, 12 mobile/text/motion profiles and
  trusted touch after the prerequisites are earned.

Reproduce from the repository root:

```text
node tests/behavioral/endless-forge-lab-pacing.cjs index.html --negative
node tests/behavioral/lab-speed-controls.cjs index.html --access
node tests/behavioral/forge-workshop-pacing.cjs index.html --negative
node tests/behavioral/lab-longtail.cjs index.html --negative
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
