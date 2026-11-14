# Rift bond display evidence

Task: [RIFT_BOND_DISPLAY_001](../../tasks/RIFT_BOND_DISPLAY_001.md).
Product SHA256: `95a077ce05faf9e79f16f9851767eb6b2b99372a31191474da2fcfd80b9c48be`.

- `bond-core.json`: eight passing mechanics/save/parity cases and six correctly
  rejected gameplay defect controls.
- `offline-paired-replay.json`: all complete saved states and rewards match
  released source over four eight-hour one-second replay windows (115,200 calls
  per source); original canonical endpoint hashes retained.
- `mobile-results.json` and the two `rift-status-*.log` receipts: native Rift
  layout/input in normal and reduced motion, fresh/dense/Boss states, mobile
  widths, safe areas, hints and navigation. Both browser processes exit cleanly.
- `boost-list-control.log`: new contract rejects the original released boost
  list for the intended absence assertion. The original source passed the old
  contract before implementation.
- Selected `screenshots/360x640-safe0-no-preference-dense*.png`: self-reviewed
  Rift names without boost rows and preserved Wisp navigation. Full Wisp effect
  text also passed the existing description contract and 12 native Formation
  profiles (320/390/430px, normal/2x text, normal/reduced motion).

Local Node 24.22.1, Chromium 157.0.8103.79. The restricted Windows browser failed
to launch; outside-sandbox runs passed. The older generic replay generator has
stale expected totals; the existing paired replay passed current canonical
totals. First premerge run [43573388783](https://github.com/xariib/Lumenfall/actions/runs/43573388783)
failed the startup text budget before product checks. Main already exceeded
that task budget; the completed status summary was compacted, preserving its
task/evidence/limitations links. The unchanged 32 KiB gate now passes locally
for every task referenced by the workflows. CI/integration/Android pending.

Modern browser and synthetic emulator evidence do not establish physical-phone,
exact WebView60, TalkBack or human acceptance. Self-review only.
