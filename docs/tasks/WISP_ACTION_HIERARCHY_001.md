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

Status: compact revision implemented and locally reviewed on Node 24.19.0 /
Chrome for Testing Headless Shell 155.0.8059.84. Final product SHA256:
`12e264dbf5ea7cdb29c652a81172b5f38c9111fa0d5e997ad8c6bec3a7c34612`.

Changes: scoped CSS, effect-row markup, removal of redundant Ability badge,
explicit Ultimate heading, direct text/gold cue on one existing enabled action,
and live refresh. No extra summary, new purchase route, new timer or save field.
Existing full re-render focus/anchor handling remains; wallet refresh preserves
exact numeric scroll when a live cue wraps. All price/eligibility/purchase/save/
simulation functions remain unchanged. See [evidence](../qa/wisp-action-hierarchy-001/README.md),
[check manifest](../qa/wisp-action-hierarchy-001/checks.json) and
[24-function preservation proof](../qa/wisp-action-hierarchy-001/preservation.json).

Exact-source local results:
- Compact UI: PASS 38,394 assertions / 18 profiles; normal/reduced motion and
  100/150/200% text at 320/390/430 px; native keyboard/touch purchases.
- Original card layout: PASS 24,888 / 12 profiles. Original upgrade/persistence/
  completion suite: PASS 12,912 / 12 profiles. Only badge-appearance assertions
  were revised for the intentional removal; semantic coverage remains.
- Primary-action defect control fails at the intended unfunded-purchase
  assertion, with a distinct mutated source hash and clean teardown.
- Existing scroll/focus: PASS 3,277 / 312 profiles. Upgrade affordability: PASS
  26,844 / 12 profiles, with both causal defect controls caught.
- Prices PASS 13,416; Wisp contribution/preservation PASS 8,099; progression
  PASS 235; Formation collapse PASS 541; Best now PASS 1,299; native autosave
  PASS 6 profiles. Source validation, context check and APK identity self-test
  PASS. Full remote CI has not run.
- Matched 390 px / normal-text fixtures: unfinished cards 22.5–26.9% shorter;
  perfected cards with information open 19.3–21.1% shorter. Fresh Ember
  719.3 → 526.1 px. Requirements/role text keep their original font sizes.
  Self-reviewed screenshots show natural header wrapping at large text.

Publication approval: on 20 October 2026, the user answered “Godkendt” to the
explicit request to upload this reviewed revision to public `xariib/Lumenfall`
and create its PR. This resolves the earlier automatic disclosure-review blocker.
The approval covers source, tests, workflow and evidence publication; it does not
request a merge, Android build or APK release.

Next: publish the isolated feature branch and focused PR, then run all required
CI and inspect its artifacts. Remote CI results will be recorded in the PR.
Main and APK remain unchanged. Physical Android, exact WebView60 and TalkBack
remain unverified; the feature is open and must not be archived.
