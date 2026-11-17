# Rift screen controls and enemy visibility

17 November 2026. Owner: this feature chat. Status: in progress; final full CI
pending. Self-review and automated checks only. No independent review claimed.

INTEGRATED into main12122b805b4dd7ad28fef5f26dad94e8a5a8c3df by lease-checked
fast-forward from0adb60eb, after all six required release-ci-gate workflows
passed on that exact SHA. Prepared full44091457972 proves190 main scenarios
plus isolated offline PASS; Chrome157.0.8103.78/Node24.19.0. Actual ref for the
prepared dispatches was the feature branch; source/tree are identical now on
main. Older main build44099434281 completed its publication before ref update.
New publish=true build44101297138 targets integrated main12122b80. Keep main
unchanged for the existing publisher guard; this chat's final docs stay on the
QA branch until publication. PR rerun44091395146 passed its earlier failed
touch step and is finishing remaining checks; it MUST pass before completion.
Acceptance is not reduced: parallelize this duplicate run with the required
published Android build, then verify exact public APK/assets/feed and preserve
final status. No release is claimed yet. Physical/human acceptance stays open.

CURRENT COMBINED SOURCE:0c374c2d103ca8bdad11ee035743d064771a576d7794599b527fcf4a21c1a60a.
Merged newer main0adb60eb/PR59 without a product conflict. Finite Forge and
Lab surface-synchronization/isolated-profile tests are retained exactly.
Four paired8h replays against that newer main PASS every saved field/reward;
only the combined HTML oracle binding changed, all original endpoints retained.
The upstream canonical status-history file remains byte-identical; this task's
complete b075 pre-feature snapshot is now`PROJECT_STATE_2026-11-17_RIFT_BASELINE.md`.
All42ab/browser/Android133 evidence below is historical. Required combined-source
CI and signed Android acceptance must pass before integration/publication.

Combined branch head12122b805b4dd7ad28fef5f26dad94e8a5a8c3df is pushed.
PR full44091395146 and prepared full44091457972 have passed the early corrected
formula/666-check Rift matrix/five controls. Prepared Comet44091463570,
Forge44091468619, Lab44091472947, Shared44091477819 and Tree44091482012 run
on this exact combined commit. Signed unpublished Android candidate44091481550
PASS: signed Android0.2.134, package/version/certificate, assets, save upgrade,
actual updater and retail launch. APK SHA256
f91a840e08d78585f2b71da213610c4f7f5f4616f4f5ea6449568fae4b04cab7.
All three actual frames self-reviewed: hints removed, correct mode order,
ring/enemy center clear and paid cosmetic retained. Source-review12122b80 verifies61 original symbols, unchanged
native/fonts/branding and both snapshots; its JSON update is local for final
delivery. No integration/publication yet. Keep old source42ab checks historical.

Latest combined checkpoint:13 focused workflows and Android134 PASS; prepared
full44091457972 is continuing. PR full44091395146 first attempt failed at
team-progression-ui.cjs:19 (“real touch opens damage details”); the prepared
same-source run passed that entire step. Cause unproven; raw log/metadata are
retained and unchanged PR job retry134084435082 is running. Assertions and
deadlines remain unchanged. Combined matrix receipt confirms666 checks/five
controls and screenshots286–288 are self-reviewed. No product/test source edit
after12122b80. A docs-only QA checkpoint branch preserves these artifacts
without advancing the feature's CI ref; keep feature branch at12122b80 until
all required checks pass. After public APK verification, incorporate checkpoint
docs with final evidence/status. Recheck current main and active main Android
publication before serial integration; do not overwrite or interrupt others.

Evidence branch: `checkpoint/rift-screen-fixes-001-12122b80-qa` (docs only,
parent12122b80). The source branch `fix/rift-screen-fixes-001` stays at12122b80
for all CI and any code integration. Worktree may be on the evidence branch;
use explicit12122b80 SHA for status/publication checks. After APK publication,
fast-forward the local source branch to the evidence branch, add final docs,
and integrate only those docs after rechecking actual main. Never publish a
different app source merely because the current worktree HEAD is a QA commit.

## Historical pre-merge checkpoint

Current follow-up: fc7068706ee42d8426bc92abbc5ad46f69372556, with unchanged
HTML42ab3e34. Early PR CI now PASS for corrected Wisp formula/Encyclopedia
assertions and the666-check Rift matrix/five controls. Full PR44087287979 and
prepared full44087341618 remain running. Other prepared gates:44087347242
Comet,44087351567 Forge,44087356067 Lab,44087361381 Shared,44087365716 Tree.
These replace the failed a882 full gates below. No new Android candidate is
needed for a test-only follow-up; final integrated publish build remains
required. Signed133 source bytes equal current HTML/fonts/branding/native files.
Do not integrate until exact follow-up commit gates pass. Main wasb075cfba;
recheck main and merge-preview tree before any lease-checked integration.

Integration checkpoint: main moved to0adb60eb36a3be15ce152d6ffe416d5996b039c7
through PR59 (finite Forge and Lab presented-surface input fixes). Do not move
main back to b075 or fc706870. Preserve the complete current Rift QA checkpoint,
merge newer main, retain both concurrently created status-history snapshots
under distinct paths, and resolve only actual overlaps. Rebind the combined
HTML oracle only after paired preservation replays against the new main.
Then run all required checks and signed Android acceptance on combined bytes.
All existing source42ab/android133 evidence becomes pre-merge historical.

## Requirements and scope

User: “Remove the bar with hints on the rift screen. Switch farm and push
buttons position with each other. On rift screen the enemies sometimes are
behind the background.” Original phone screenshots are retained as
`docs/qa/rift-screen-fixes-001/reported-rift-286.jpg`,287.jpg and288.jpg.

Remove the Rift hint strip and redundant Settings toggle; put Farm left and
Push right in visual/DOM/keyboard order; keep enemies above scene/theme fills.
Preserve combat, all original artwork and six themes, Workshop advice, mode
actions, navigation, accessibility, paid cosmetics, progression and both saves.
No economy, balance, save-schema, signing-identity or new binding-rule changes.

Acceptance: removed controls expose no rendered/focusable strip or reserved gap;
Farm/Push retain actions and >=44px targets; attack region >=120px; all themes,
encounters, bosses/Luminous/hit states and both motion modes remain usable at
320/390/430px and enlarged text. Required CI, signed Android save upgrade,
actual updater, normal retail launch and public package/assets/feed must pass.
Physical phone, exact WebView60 DOM, TalkBack and human acceptance remain open
until observed, so this task/chat must not be archived.

## Baseline and current candidate

Baseline main: b075cfbac508096c240d3cba8885384235e4a210.
Isolated branch: `fix/rift-screen-fixes-001`, worktree `C:/lf-rift-screen-fixes`.
Original checkout and other worktrees untouched. [PR60](https://github.com/xariib/Lumenfall/pull/60).
Read startup/state/workflow and original [theme](RIFT_THEME_REDESIGN_001.md),
[combat layout](RIFT_COMBAT_LAYOUT_001.md) and
[menu](MOBILE_MENU_CORRECTIONS_001.md) requirements before editing.

Product verification commit: a882428349d8a412b2f3fa47108a104693a1aaaf.
Its full suites exposed one remaining stale hint-bar expectation in
`wisp-formula-contract`. The follow-up changes only the test bridge/assertion
and documentation: check hint removal and keep boss-trait wording in the
Encyclopedia, retaining every numerical boss/Wisp formula assertion. No HTML
or production JavaScript bytes changed. New exact-commit CI is required.
HTML SHA256:42ab3e344543b39ec938f82536f9e067b188f9c7995f4e1fede00637f081acad.
Main last checked atb075cfba; overlapping PR59/61/62 are excluded.
PR merge preview and candidate both have tree
e8c19a6e749f139684edaeb19b3a14782f4398b3. Recheck main immediately before
lease-checked serial integration; preserve/revalidate newer work if main moved.
No integration or public release yet.

## Implementation and affected files

`index.html`: remove hint strip/dialog, Settings toggle and their presentation
preferences/rendering/listeners. Keep pure objective quote logic and Workshop
power advice. The obsolete device-only preference remains inert; no migration.
Farm precedes Push in the actual DOM; combat handlers are unchanged.

Use an isolated explicit z1 enemy-visuals layer. Its separate opaque SVG field
at z-1 masks landscape silhouettes; existing legacy Comet Trail at auto/0,
original ring at z1 and enemy at z2 remain above it. Separate SVGs retain the
original ring definitions. All61 original SVG symbols, including29 creature
symbols and six rings, are byte-identical; fonts/branding/mobile files unchanged.

Focused regression: `tests/behavioral/rift-screen-fixes.cjs` uses established
native CDP input/render/save transport,18 viewport/text-size/motion profiles,
six themes,230 encounters per theme/profile, reload and paid Trail fixture.
Five causal controls restore hints, reverse modes, lower enemy under ring,
make the field transparent, or raise field over Trail. Current-source focused
  CI passes (666 checks and five rejected controls). Existing hint-specific checks now verify removal; unrelated checks,
assertions and deadlines remain. Updated layout/status/mobile/endless/cast-text
probes, Android acceptance, source contract and former guidance entrypoints.
Pre-merge runs the focused matrix first instead of the retired hint-dialog gate.

`tests/behavioral/rift-screen-parity.cjs` pairs four8h one-second replays against
released main and compares every saved field/reward. Only the HTML source hash
in the existing browser oracle changes; original endpoint hashes remain.
`docs/PROJECT_STATE_2026-11-17_HISTORY.md` preserves the complete prior status
byte-for-byte; compacted active older status to fix an existing58-byte context
overrun without changing the32KiB gate. No archived original was edited.

## Verification and evidence

[Evidence index](../qa/rift-screen-fixes-001/README.md), raw receipts/screenshots
and compressed CI logs are retained under`docs/qa/rift-screen-fixes-001/`.

- Node24.22.1/Chromium157 locally; full CI pins Node24.19.0; Android Node22.
- Source syntax/unique IDs/lifecycle guards, task context and diff whitespace
  checks PASS. Complete source diff self-reviewed; all61 original SVG symbols,
  native files/fonts/branding and prior status snapshot compared byte-for-byte.
- Four paired8h windows,115,200 one-second calls per source: every saved field
  and reward matches baseline. `trail-layer-only-proof.json` proves final
  production JavaScript is byte-identical to that replay's candidate.
- Earlier e210 source passed558 checks/18 profiles/24,840 encounter-theme
  samples and four controls. Final42ab source adds paid Trail layering and a
  fifth control; its focused matrix/controls pass in current PR CI.
- Final-source unpublished signed Android0.2.133, run44077735744: PASS identity,
  packaged assets, save upgrade/both slots/paid entitlements, installed Rift
  controls/layers, native Workshop→Lab, actual updater and retail Android12
  launch without debugger/instrumentation. APK SHA256
  b061f48a3859fd1c23c73f6b49d501e2ac6b7315deb34d09b5134150adc889b7.
  Self-reviewed all three actual frames: no hints, Farm left/Push right,
  visible original ring/enemy, landscape outside center and paid cosmetic kept.
  See`android-candidate-133/`; this is emulator acceptance, not physical-device.
- Eight applicable PR workflows on a882: seven PASS; broad44076809305 failed
  only the stale `wisp-formula-contract` hint expectation after completing all
  main scenarios. The correction preserves actual boss-trait Encyclopedia text.
  Prism-only workflows are skipped by existing conditions.
- Six prepared same-SHA workflow_dispatch gates:44077714868 full (same stale assertion failure),
  44077719366 Comet,44077723702 Forge,44077728141 Lab,44077732074 Shared,
  44077735978 Tree (five PASS). These run on the feature ref, not main; integration
  must retain the exact validated SHA or rerun on the changed integrated SHA.

## Retained failures and corrections

No failed/incomplete attempt is counted as a pass. No test or deadline was
weakened to resolve these results. Earlier-source receipts are historical.

- Initial baseline visual quick test stopped at existing Workshop active-dot
  assertion after43 checks. Edge failed before CDP context. Local expanded/last
  Trail quick attempts timed out at browser setup/network-service crash; use
  passing exact-source Linux CI for those checks.
- Initial hint-removal candidate0.2.131 passed functional Android checks, but
  fresh retail screenshot lacked its ring. Separate SVG field corrected this.
- Separate-field0.2.132 initially failed retail accessibility capture despite
  visible game frames; an unchanged-source retry passed. Final0.2.133 independently
  passes. Cause of the earlier omitted accessibility tree remains unproven.
- Full review caught z0 field covering the paid legacy Trail; corrected to z-1
  and added a fifth causal control plus valid settled-entitlement save fixture.
- New test's initial reload race fixed with a per-document token; cast-text
  test's old Push→Farm expectation corrected to requested Farm→Push while
  retaining native keyboard and visible-focus assertions.
- Superseded Wisp attempts failed existing300ms setup waits; unchanged retries
  passed. Superseded prepared full-suite attempts hit a Lab slot touch assertion,
  then a different CDP touch deadline after that assertion passed. Failures
  retained; current-source full gates must independently pass.
- Separate baseline harness finding: Windows reduced-motion dump-DOM charge
  assertion rejects BOTH main and candidate because existing global CSS reports
  transition-property none/duration0.001ms rather than exactly0s. Charge CSS and
  assertion unchanged. Diagnostic retained for a separate harness task.

## Next concrete action

Run all required gates on the test-only follow-up. Once they pass, recheck main/merge-preview and
lease-fast-forward the exact validated candidate without other branch changes.
Verify PR60 merged, dispatch signed build on main with publish=true, inspect
its actual frames and verify anonymous versioned/latest APK, identity, assets,
metadata and feed. Preserve final raw evidence and task/current status in
GitHub with a docs-only descendant after publication. Do not move main during
the publish build. Keep physical-phone/WebView60/TalkBack/human acceptance open;
do not archive the chat. No permission prompts, new chats or delegation.
