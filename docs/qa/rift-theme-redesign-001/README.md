# Rift theme redesign evidence

Feature: [RIFT_THEME_REDESIGN_001](../../tasks/RIFT_THEME_REDESIGN_001.md).
Product candidate `f1c3c56ade415e25239f53442706014cae4d4cb35defe05f97be17549d7bf83d`.

- `quick.json`: six main themes, 230 encounters each, appearance retirement,
  save/backup/reload/Ascend, touch, layout and preserved attack/navigation checks.
- `independent-replay.json`: baseline main `6b990b70`; exact complete-state and
  reward parity across four eight-hour windows, each replayed second by second
  on both sources. The original endpoint hashes are unchanged.
- `existing-parity.json`: existing chronological online/offline checks.
- `theme-*.png`: visually inspected 390px previews, original boss/Wisp artwork.
- `collection.png`: main theme previews and selection UI.

Local browser execution required outside-sandbox access after Chromium startup
was blocked. Node24.22.1; browser path/version is retained in the raw receipts.
Baseline 122-check visual test ran on root PR42 `6bd4b293`, which has the same
Rift visuals as main. Gameplay parity instead uses exact main source from Git.
Full mobile/text/motion suite, remote required checks and Android are pending.
This is self/automated verification, not independent or physical-phone acceptance.
