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
