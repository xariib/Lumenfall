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

Next: publish the focus-name repair on the same branch and pass all required CI
on that head. Main/APK remain unchanged. Physical Android, exact WebView60 and
TalkBack remain unverified. Keep the feature open; do not archive it.
