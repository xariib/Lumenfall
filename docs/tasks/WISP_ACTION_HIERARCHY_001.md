# WISP_ACTION_HIERARCHY_001 — compact Wisp cards

Owner: this feature chat. Setup requested: Work / GPT-6.1 Sol High; actual client
model selection is not changed by repository code.

## Requirements and revised direction

Original: make the next Wisp action clear, without hiding upgrades, changing
prices or touching saves. Include UI, code, tests and a PR in one focused chat.
20 October correction: “Wisp kortet skal være meget mere simpelt, men have de
rigtige oplysninger med. Prøv at finde inspiration fra dribbble.com”. The user
then approved choosing the design that best fits Lumenfall: “Gør det som passer
bedst i vores spil”.

Use one existing dark navy/gold/violet card, compact upgrade rows and direct
emphasis on an original purchase control. Do not restore the earlier duplicate
“Next action” summary. Preserve every unfinished upgrade, actual current/next
effect, every price, role contribution, requirements, Formation and automation.
No price/economy/purchase/save/Android identity changes. No merge or APK release.

Inspiration researched in this chat:
- [Tower of Heroes](https://dribbble.com/shots/27426988-Tower-of-Heroes-Pixel-Art-RPG-Mobile-Game-UI-Design): hierarchy, character identity and rarity.
- [Fantasy character/skills UI](https://dribbble.com/shots/26193034-Fantasy-Game-UI-Character-Skill-System): consistent character/upgrade presentation.
- [Mobile Idle Clicker](https://dribbble.com/shots/22759304-Mobile-Idle-Clicker-UI): genre reference.
These are inspiration, not copied assets or proof of production usability.

## Baseline and recovery

Live main `ff50c13c855459078f494fd27dabc5a93c273a4b`, product SHA256
`d4a55cde9135d078a6da16ff85ddee831129c631312c30c1ea3c90efa00372e5`.
Checked 20 October 2026. PR2 is audit documentation only; no product overlap.
The earlier remote `feat/wisp-action-hierarchy-001` still points at main.
Current isolated branch: `feat/wisp-card-compact-001`.

Workspace maintenance removed the earlier local candidate and evidence. A
Library recovery search did not find them. This candidate starts from newly
cloned live main, with fresh tests; earlier reported passes are not reused.
Read [rules](../../AGENTS.md), [bootstrap](../../PROJECT_BOOTSTRAP.txt),
[status](../PROJECT_STATE.md), [source index](../CONTEXT_INDEX.md),
[workflow](../project/FEATURE_WORKFLOW.md), [environment](../project/CODEX_START.md),
[limitations](../project/KNOWN_ISSUES.md), affected source and Wisp tests.

## Acceptance

- All eight Wisps retain identity, level, rarity, Power, Field/Bench, relevant
  contribution, Empower/Recruit, Rarity, Ability, Ultimate, Mastery and Resonate.
- Unfinished upgrades remain visible. Only existing perfected disclosures fold.
- One original available action receives a short “Next” cue: Recruit first,
  otherwise available Mastery, Ultimate, Rarity, Ability, then Empower. This is
  navigation priority, not an optimal investment claim or automatic spending.
- Full costs/effects and prerequisite explanations remain readable; insufficient
  resources remain red and purchase controls remain disabled when unavailable.
- Match baseline fixtures and measure card height reduction at 390 px / 100%
  text. No height target is satisfied by hiding information or shrinking text.
- 320/390/430 px, 100/150/200% text, normal/reduced motion; no horizontal clipping,
  44 px controls, stable focus/scroll and actual keyboard/touch purchasing.
- Rendering/highlighting preserve full state and both save slots. Protect all
  gameplay functions byte-for-byte; run relevant existing regression checks.
- Add focused regression coverage and retain required CI. Modern Chromium is
  not installed Android, exact WebView60, TalkBack or independent review.

## Checkpoint

Status: [PR3](https://github.com/xariib/Lumenfall/pull/3) is open. Compact cards
are implemented; the accessibility-name repair is locally verified and must pass
CI on its published head. Node 24.19.0 / Chrome for Testing Headless Shell
155.0.8059.84. Current product SHA256:
`5733c81744ac1dddff50639d710ea542c3a7eedcd30c0764d92a72a0096cafcd`.

Changes: scoped CSS and compact effect rows; remove the redundant Ability badge;
explicit Ultimate heading; one enabled original action receives a short text/gold
cue. Preserve every unfinished upgrade, requirements, prices, role/Formation/
automation, current/next effects, Mastery and Resonate. Full re-render anchoring
and exact wallet-refresh scroll remain. No new purchase route, timer or save
field. The [24-function byte comparison](../qa/wisp-action-hierarchy-001/preservation.json)
still matches main for all protected gameplay, price, purchase, save and
online/offline functions. All 24 matched card-height fixtures are unchanged by
the accessibility repair: unfinished cards remain 22.5–26.9% shorter at 390 px.

Automated [PR review](https://github.com/xariib/Lumenfall/pull/3#discussion_r4326057698)
found that render inserted the cue after accessible names were prepared. Reuse
`presentControlStates` immediately after highlighting, before callers restore
focus. The new assertion fails on the prior source before an affordability
refresh. Native keyboard/touch continuation observes the actual `focusin` name,
including Next and the Wisp identity; a causal removal control also fails the
intended assertion. This is automated review and self-verification, not physical
TalkBack or independent human acceptance. [Repair proof](../qa/wisp-action-hierarchy-001/focus-review.json).

Current-source local checks:
- Compact UI PASS 39,150 / 18 profiles; widths 320/390/430, text 100/150/200%,
  both motion settings. 72 original-handler native purchases and 36 immediate
  focus-return names, plus full state/both-slot preservation.
- Original layout PASS 24,888 / 12; original upgrades/persistence/completion
  PASS 12,912 / 12; unchanged scroll/focus PASS 3,277 / 312.
- Affordability PASS 26,844 / 12; both original causal controls caught.
- Both compact controls caught: disabled primary and stale accessible name,
  each with a distinct source hash and clean teardown. Syntax/source check PASS.
- [Manifest](../qa/wisp-action-hierarchy-001/checks.json) separates current checks
  from preceding-source results. [QA guide/screenshots](../qa/wisp-action-hierarchy-001/README.md).

Remote history: initial head `b6a10a9` exposed two QA compatibility issues;
[receipt](../qa/wisp-action-hierarchy-001/ci-test-compatibility.json) records the
same preserved assertions and fixes. At `7c4b4af`, Shared UI, Tree, Lab, Comet,
Forge and isolated offline passed; the main regression was still running when
the accessibility review repair was prepared. None of those runs proves the
new source. Current-head CI results and stable run links are recorded in PR3.

Publication approval: 20 October 2026, the user answered “Godkendt” to uploading
this reviewed feature to public `xariib/Lumenfall` and creating its PR. The
approval resolves the earlier automatic disclosure-review blocker and covers
necessary source, QA/workflow and evidence fixes. No merge, build or APK release.

Follow-up QA finding: focused replay of `p1-05-control-regressions` fails the
legacy whole-label expectation when Next is present. Preserve the exact base
Empower/Recruit assertion, full accessible identity/price/unit, native disabled,
geometry, observer-only state/saves/events and exact-price single purchase.
Separately assert funded cue/primary and exact complete visible/accessibility
labels. Local replay now passes in both CDP and the original unchanged harness
with pipe transport; both original selected/focus-return negative self-tests
still fail intentionally. [Receipt](../qa/wisp-action-hierarchy-001/control-label-compatibility.json).
Root product remains `5733c81744ac1dddff50639d710ea542c3a7eedcd30c0764d92a72a0096cafcd`.

The legacy-label correction was published at `4a75122`. The preceding incomplete
run was superseded so the full suite can run with the correct UI expectation.
Its retained log also identified the offline driver's original source-binding
guard: the independent one-second reference still named main's product hash.
Regenerate all four sequential 8-hour windows with the unchanged original
`offline-catchup.cjs --generate-swift-golden` oracle. Every reward and full-state
hash matches the previous reference exactly; only its source hash changes.
Both original offline UI/legacy DOM scenarios pass with unchanged assertions
and 210-second deadlines. [Source-binding proof](../qa/wisp-action-hierarchy-001/offline-source-binding.json).

All required CI must pass on the final PR head; live results and stable run links
are recorded in PR3. Previous-head successes are not final-head acceptance.
At `7e232ea`, all five focused workflows and isolated offline passed. Shared UI's
checkout delay resolved without cancellation or restart. The user approved
browser fallback on 20 October 2026; no browser restart action was needed.
Main/APK remain unchanged. Physical Android, exact WebView60 and TalkBack remain
unverified. Keep the feature open pending integration/device acceptance; do not
archive it.

Final local preflight: all 101 selected original scenarios pass on the
final product, including both offline UI cases and every default scenario from
loadout-memory-mobile through ascend-prisms-recovery. The original harness,
viewports, assertions and deadlines remain; DOM capture uses its existing pipe
transport. This supplements, and does not replace, full required final-head CI.

## Integration checkpoint — 21 October 2026

The user authorized PR #3 review/integration as a distinct step, followed by
Android acceptance on an installed build before this feature is complete.
[PR #3](https://github.com/xariib/Lumenfall/pull/3) was reviewed and merged
without conflict at main commit `7a498e5be2d060476c9442435768ea1db15d725d`.
Its final head `2980b56061275cf256ed0d8a5279bfd7adeac8e4` had all six relevant
PR workflows green; the one automated accessibility review thread was resolved.
This is self-review and automated review, not independent human review.

The [non-publishing Android build #15](https://github.com/xariib/Lumenfall/actions/runs/39548821573)
passed on that exact integration commit with `publish=false`. It produced
signed `com.lumenfall.app` 0.2.15 (versionCode 1000015, signing certificate
SHA-256 A9:1C:BF:34:27:D2:CE:B1:CD:BE:07:E5:22:5F:17:D4:71:B1:82:9E:52:F7:AB:66:49:7E:75:49:75:AD:3E:21),
APK SHA-256 `389504c033defec33235baf890e1d5338b54e7146da632a5c4faec55034fe13d`.
The API 31/Android 12 emulator with WebView 91 installed the APK as an in-place
upgrade from archived signed 0.1.158. UID/origin, both save slots, Wisp levels,
paid study and legacy purchase entitlements survived. Evidence is artifact
`signed-apk-39548821573` (ID 12322913245), with the upgrade receipt.
No release was published; the existing latest release remains 0.2.14.

[Exact-main full validation #19](https://github.com/xariib/Lumenfall/actions/runs/39548886678)
is running. The existing Android upgrade workflow does not inspect Wisp card UI,
so [follow-up PR #4](https://github.com/xariib/Lumenfall/pull/4) adds assertions
inside the installed Android WebView for all cards, complete prices/effects,
visible and accessible Next cue, and a trusted native touch purchase and focus.
It changes test code and a disposable synthetic emulator fixture only. Its CI
and subsequent non-publishing APK run are pending. This feature remains
**integrated, acceptance pending**. Physical phone, exact WebView60, TalkBack and
human pacing/performance remain unverified. Do not mark complete or archive.

Next action: review PR #4's final-head CI, integrate its test-only change, run
Build Android APK with `publish=false` on that commit, inspect its installed
Wisp receipt/screenshot and original upgrade preservation, then arrange the
remaining physical-device accessibility/visual acceptance before closeout.
