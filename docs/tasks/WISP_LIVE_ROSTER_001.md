# Wisp roster live refresh

The user approved the Wisp roster optimization on 23 November 2026 with
“Let's do it”. Ordinary combat should update live values and purchase controls
in place. Recruit unlocks and lineup changes must still appear. The user has
no spare phone. Run browser and Android emulator checks and leave physical
energy, thermal, and handling measurements pending.

Owner: this feature chat. Baseline: main `5c2406fb`, released Android 0.2.156
product `52871909`. Branch `feature/wisp-live-roster-001`, worktree
`C:/lf-wisp-live-roster`. The only open PR at startup was the separate Google
Play candidate. Status: implemented and browser-verified, integration pending.
No new binding rules.

The earlier Android 0.2.153 browser probe at Farm 21 saw six defeats and six
full replacements of all eight cards in five seconds. Re-measure on Android
0.2.156's source under the same fixture and retain the exact source hashes.
The [previous mobile power work](MOBILE_POWER_001.md) establishes the foreground
and background timing contract. [Wisp display](WISP_RIFT_DISPLAY_001.md) and
[Wisp cards](WISP_CARD_REDESIGN_001.md) establish the existing UI.

Acceptance:

- A steady Farm run retains card and control identity as enemies are defeated.
  Live values, wallet affordability and insufficient-price colors stay current.
- Keep recruitment by defeat/depth/research, upgrade depth information, paid
  and automated Empower, Formation, Wisp management, scroll, focus and touch.
- Compare equivalent real-browser workloads. Pass the existing lifecycle,
  controls, gameplay and integration gates, and Android emulator acceptance.
- Keep gameplay calculations, saves and offline progression intact.
  Publish only through the existing signed and validated Android release flow.

## Implementation and local evidence

`index.html` keeps existing cards through steady combat and wallet changes.
Full roster rendering still follows recruit and upgrade-depth transitions,
paid or automatic progression changes, and the original explicit UI actions.
The roster summary, price state, role rewards and Resonate help use the
existing UI refreshes and retain their DOM when their output is unchanged.
`tests/behavioral/mobile-power-browser.cjs` uses a steady Farm save whose
already-owned Wisps start with their normal recruitment entitlements. It
checks node identity, prices and colors, the recruit summary, defeat and
depth gates, Auto-Empower, and a real boss reclaim.

Node 24.22.1 and Brave/Chromium 158 on Windows, 390×844 at DPR 2, six defeats
in each five-second Farm 21 roster sample. The released baseline called the
roster renderer six times and disconnected all eight original cards. The
candidate called it zero times and kept all eight. Shell DOM mutations
fell from 3,673 to 941 and Chromium main-thread task time from 386 to 196 ms.
The 58-check candidate run passed, including hidden lifecycles. These are
browser workload measurements. [Browser receipts](../qa/wisp-live-roster-001).
The first deterministic Auto-Empower fixture lacked a due timer, and the
boss fixture lacked the burst needed to overcome regen. Both now exercise
the real gameplay paths. Local source contract and task context checks pass.
The released source fails the new card/button identity assertion as expected.

Next: open the PR, run the existing scroll, Android, and integration gates,
then record delivery.
