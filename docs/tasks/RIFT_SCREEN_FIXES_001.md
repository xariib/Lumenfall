# Rift screen controls and enemy visibility

17 November 2026. Owner: this feature chat. Status: in progress.

CURRENT CANDIDATE: HTML42ab3e344543b39ec938f82536f9e067b188f9c7995f4e1fede00637f081acad.
Prior1fcad22d is superseded; do not integrate that earlier candidate. Final
review found field z0 could cover the original Comet Trail at auto/0. The field
is now z-1 inside the explicit isolated z1 visuals; legacy Trail0, theme1 and
enemy2 remain above it. This preserves an existing cosmetic, not a new effect.
Added a visible legacy Trail fixture and a fifth causal control restoring the
bad field z0. Game JavaScript remains byte-identical to the full paired replay;
only CSS/SVG layering and the HTML oracle binding change. Local quick attempt
stopped before any checks at CDP browser-context creation, with a Chrome network
service crash. Use required Linux CI/new signed Android acceptance on this
candidate. All old run IDs/acceptance below remain historical to their source.

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
Focused check:31 assertions plus all four causal controls PASS, with clean
browser exits. Full mobile matrix:558 assertions/18 profiles/24,840 encounter-theme
samples PASS. The separate original offline job also PASS on0eb05b8b.

Signed unpublished Android0.2.131/build44064059604 passes identity/assets, both
save slots/paid work, actual updater and retail launch. Downloaded APK and all
packaged assets independently verified. Visual self-review found a regression:
the first retail launch screenshot lacks the theme ring behind the new root-SVG
circle, while upgraded-app Starlight/Ember images retain it. Cause not proven;
functional build PASS is not visual acceptance. Preserve the first screenshot.

Correction: give the opaque field its own SVG at z0, the unchanged aura SVG z1
and the enemy z2 inside isolated visuals. Add a second settled retail screenshot
and assert this explicit layer order in browser/native tests. All production
JavaScript bytes are identical to the full paired-replay source; save/reward
oracle endpoints are preserved while rebinding only the HTML hash. Repeat
affected browser/Android checks and final-source CI before integration/release.
Current overlapping PR59 and PR61 both touch index.html; they are separate work.
Main was stillb075cfba at the latest integration check; recheck before main update.

8371fc6f HTML e210529dca00e0e32c13a3910a14f79b5df8197685cd323802817cd55b6011a6:
revised full18-profile matrix558/four controls PASS. Android132/build44066560998
passed upgrade/updater; both retail frames visibly retain ring and enemy. The
retail accessibility XML omitted the game tree, failing the unchanged launch
gate despite visible live combat; diagnostics retained, same-source retry running.
Wisp Linux first attempt failed its existing300ms settling deadline; unchanged
retry passed Linux/Windows. Cause unproven; no deadline/assertion changed.
Broad CI then caught rift-cast-text.cjs's old Push→Farm Tab expectation. Update
the test to Farm→Push, preserving native input and visible focus assertions.
This changes no product bytes. Repeat required final-source CI before integration.

## Superseded checkpoint — before the Comet Trail correction

Continuation checkpoint: branch head1fcad22d9be1ec2a494e6b81e6c1951e9342cc21;
product remains e210529dca00e0e32c13a3910a14f79b5df8197685cd323802817cd55b6011a6.
Main stillb075cfba; PR60 open. Current native run44066560998 attempt2 reruns the
unchanged build at8371fc6f; first-retail failure screenshots/XML are retained in
QA and show the corrected ring. Current CI for1fcad22d must finish before serial
integration. No merge/public release yet. Local retained cast-text check is
running with web-root`.` (initial local invocation incorrectly passed index.html
instead of a directory; it failed before browser startup and changed no code).
Uncommitted QA/task updates belong to this chat; do not discard them. Next:
inspect final CI/native results, preserve first failures/retries, resolve any
remaining assertions, integrate unchanged validated bytes after rechecking main,
run integrated release gates and publish/verify the signed APK. Keep task open
for physical-phone/WebView60/TalkBack/human acceptance. No permission prompts,
new chats, delegation or messages to other agents were used.

Latest local checkpoint: Android132 run44066560998 retry PASS; downloaded APK
a421d9ad08a83415bcb177e28c5cbc8ef976602e296fd8e1480f0d8abdcf60f6, exact packaged
assets verified and both retail frames visually show the ring/enemy correctly.
Native hit-layer probe PASS26 assertions/two motion profiles while the actual
90ms hit class is active. Retained cast-text keyboard check PASS12 profiles.
On1fcad22d, seven of eight PR workflows PASS; broad44069208627 is running its
stateful suite. Five of six prepared release workflows PASS; broad44071191261
is retrying unchanged after a Lab-slot touch assertion. The same source passed
that step in PR validation; first failure is retained in QA. Prepared run IDs
are saved in validation-evidence/release-gates-dispatched.json.

Unrelated baseline finding: Windows reduced-motion rift-status-contract reports
"charge animation does not animate layout width" for BOTH b075cfba and candidate.
Diagnostic shows transition-property:none and duration1e-06s from existing global
reduced-motion CSS; the old assertion expects exactly0s. No charge styling or
assertion was changed. Keep the evidence for a separate harness task. Current
native-input matrix/hit checks pass both motion modes; do not claim a passing
Windows dump-DOM contract. See QA/windows-contract-baseline-diagnostic.json.

Next after both broad runs PASS: recheck main and PR merge-preview tree. If main
remains b075cfba, integrate the exact validated1fcad22d commit by lease-checked
fast-forward, verify PR60 is merged, then publish build-android.yml on main with
publish=true. The six prepared dispatches validate that identical commit; report
their actual feature-branch ref honestly. If main moved, preserve new work and
revalidate the combined version. Public verifier prepared at
validation-evidence/verify-rift-release.cjs RUN_ID COMMIT; it downloads/verifies
anonymous versioned/latest APK, exact metadata/assets/feed and saves evidence.
Only after publication push docs-only final evidence/status; physical review
remains open, so do not archive this chat. Root checkout remains untouched.

Next: publish this checkpoint, run required remote CI, resolve all regressions,
integrate serially with any newer main work, then signed Android acceptance and
publication. Until required checks/build pass this remains open. Self-review only.
