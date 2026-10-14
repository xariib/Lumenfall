# Clear upgrade button labels

14 October 2026. User finds “Upgrade Module” unclear and suggests Upgrade Ability.
Damage roles now say **Upgrade Ability**; Shard/Lumen/Mote roles say **Upgrade
Rewards**. Help and the tutorial connect those labels to the permanent Module
track; the displayed effects still identify the exact improvement.

Baseline6c81b01/sourcee655c775. Final source SHA256:
`9f382d3fde54263098bfdbcd2e79227dadeb8941b54c9459d57c6d4c55a8caba`.
Integratedb7233dc on local/full-debug. [Preview receipt](preview.json) verifies
all15 source/staged/HTTP assets at4174. App opening queued; actual reload unclaimed.
[Byte preservation](preservation.json): five display-label fields, the rendered
button text and two help entries are the only product changes. Effects, levels,
caps, prices, purchase code, saves and the latest Best now Formation are unchanged.

- [Registered layout](layout.txt):16,344 checks/12 profiles PASS. All8 Wisps,
  correct visible/accessibility labels, both prices, retained effects, normal/
  200% text at320/390/430px, normal/reduced motion,44px controls/no clipping.
- [Existing upgrades](upgrades/wisp-upgrades-result.json):12,912/12 PASS,
  eligibility/prerequisites/final purchases/completed folding/focus and saves.
- [Source](source.txt), context/whitespace and [V8 6.0 parsing](legacy-syntax.json)
  PASS. Node24.19.0, Chromium151.0.7922.34. Normal and320px/200% screenshots reviewed.

Self-review/automated checks only. Wording-only follow-up; prior full card/scroll/
core/Formation receipts remain in [the revision checkpoint](../revision/README.md).
Local development milestone. Full combined CI/GitHub/main and Android/WebView60/
textZoom/TalkBack/device acceptance remain OPEN. No APK/remote/release/archive.
