# Rift screen controls and enemy visibility

17 November 2026. Owner: this feature chat. Status: in progress.

User requirements: “Remove the bar with hints on the rift screen. Switch farm
and push buttons position with each other. On rift screen the enemies sometimes
are behind the background.” Three supplied phone screenshots show Rifts286–288.

Goal: remove the Rift hint strip and its unused Settings toggle, put Farm on
the left and Push on the right, and keep every enemy visibly above the scene
and circular theme fill. Preserve Workshop advice, all six themes, original
enemy identities, navigation, combat, accessibility, economy and save data.
No gameplay, balance, save-schema or new binding-rule changes.

Baseline: main b075cfba; isolated branch fix/rift-screen-fixes-001 at
C:/lf-rift-screen-fixes. Root checkout and other worktrees untouched. GitHub
open-PR search returned none. Read current startup/state/workflow and original
[theme requirements](RIFT_THEME_REDESIGN_001.md),
[combat layout](RIFT_COMBAT_LAYOUT_001.md) and
[menu corrections](MOBILE_MENU_CORRECTIONS_001.md).

Acceptance: no rendered/focusable hint strip, reserved gap or redundant Settings
toggle; Farm left/Push right with matching DOM/keyboard order and unchanged
actions; enemies above all scene/theme backgrounds across all six themes,
species, boss/Luminous/hit states and both motion modes. Cover320/390/430px,
short screens and enlarged text; preserve >=44px controls and >=120px attack
target. Run focused regression/negative controls, existing affected tests,
source/context checks and required PR/integrated CI. Verify signed Android
upgrade/updater/retail launch and public APK/feed within standing authorization.
Physical phone/WebView60/TalkBack/human acceptance remain unverified until observed.

Baseline checks: Node24.22.1. Edge exits before CDP browser-context creation.
Installed test Chromium starts; original visual quick test fails after43 checks
at “active dot visible workshop”, before checking enemies. Evidence is under
validation-evidence/rift-baseline[-chrome]; do not claim a baseline pass.

Implementation: removed strip, hint dialog, Settings toggle and their listeners/
render preference code. Farm precedes Push in the actual DOM. The theme center
was translucent, allowing mountain silhouettes to show through around the
enemies; one opaque SVG circle beneath all six themes masks those silhouettes.
The enemy visuals now have an explicit isolated foreground layer. Original
enemy/ring art, combat handlers, progression and saved preference data remain.
No save migration is needed; the obsolete device-only hint preference is inert.

Tests: existing hint visibility/navigation assertions now check requested absence;
all unrelated combat/layout/keyboard/save checks remain. Workshop late-game
advice tests remain, and Android acceptance now verifies native Workshop/Lab
access instead of the retired Rift dialog. Historical guidance scripts retain
their original procedures for historical HTML, routing current HTML to the new
18-profile Rift check. CI replaces the retired dialog controls with four causal
controls: restored hints, reversed order, enemy below ring, transparent arena.

Initial candidate HTML SHA256:
05ae23ed969c5701d7685d6ad19d7a9c564d63595fcd5635e74196090a3b2bcf.
Focused390px/normal-motion check:30 assertions,1,380 enemy/theme samples PASS;
six-theme screenshots, including supplied286–288 species, self-reviewed.
Navigation88 and core guidance24/control PASS. Source syntax/IDs, task context
and diff whitespace PASS. Broader local browser runs timed out before a completed
result; no full browser acceptance claimed. A reload race in the new test was
corrected by waiting for the new document's initialization token. An initial VM
paired replay matched baseline/candidate but its endpoint used the other harness's
golden hash; the released task already retains the correct VM reference. The new
paired replay compares all fields to baseline and that separate reference while
preserving the browser oracle's endpoint hashes. The corrected full paired
replay PASS: four eight-hour windows,115,200 one-second calls per source,
every full saved state/reward equal. Only the browser oracle source binding
changed; every original expected browser endpoint remains unchanged.
[Receipt](../qa/rift-screen-fixes-001/paired-replay.json).

[PR60](https://github.com/xariib/Lumenfall/pull/60) published. Initial candidate
17add629 has eight applicable PR workflows running, two conditional Prism
workflows skipped, and signed unpublished Android build44064059604 running.
The GitHub App updated the required workflow; installed CLI handles dispatch.
Task remains in progress pending final-source CI, integration and Android release.

First final-source CI44064204939: isolated offline catch-up PASS; broad job stopped
at pre-existing startup budget32826 bytes (58 above32768) for the old Forge/Lab
task. The startup documents/product were already at that size on baseline.
Preserved the complete prior PROJECT_STATE byte-for-byte in the dated17 November
history and compacted older12 November status in the active index, retaining the
open economy finding and all source/evidence links. No threshold/gate changed.
Final focused check:31 assertions plus all four causal controls PASS, with clean
browser exits. Full18-profile run and Android candidate acceptance still running.

Next: publish this checkpoint, run required remote CI, resolve all regressions,
integrate serially with any newer main work, then signed Android acceptance and
publication. Until required checks/build pass this remains open. Self-review only.
