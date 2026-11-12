# Rift background and theme redesign

12 November 2026. Owner: this feature chat. Status: in progress.

## Request and scope

User: “remove the live and still backgrounds. Wisp and enemy theme packs thats
being unlocked over time. I don't like the design of the new ones. Just make a
new background for the rift and then make the themes more visible and cooler,
the enemy should fit inside the circle there is with every theme q player choose”.

User confirmed: “Yes—remove the unlockable packs and keep the main themes”.
Remove the separate unlockable background/Wisp/enemy packs, use one new Rift
background, retain and improve the six main Rift themes.
Preserve the original Wisp/enemy identities and all gameplay, Deeds, main-theme
unlock conditions, legacy cosmetics, paid value and save/recovery data.
Retired appearance preferences must load safely without equipping retired art.
No new binding rule or gameplay/balance change.

## Baseline and isolation

Main `6b990b70ccfdd62049ca10172b0c770ae808a6bc`; branch
`feature/rift-theme-redesign-001`, worktree `validation-evidence/rift-theme`.
Root checkout is PR42's unrelated Forge/Lab candidate `6bd4b293`; leave it and
its untracked QA/attachments untouched. Only open PR observed: PR42; shared
product/status integration must be rechecked before merging this feature.
Read [startup](../../PROJECT_BOOTSTRAP.txt), [state](../PROJECT_STATE.md),
[workflow](../project/FEATURE_WORKFLOW.md), CODEX_START and CONTEXT_INDEX.
Original [visual unlocks](RIFT_VISUAL_UNLOCKS_001.md) and
[theme label contract](RIFT_THEME_LABEL_001.md) reviewed.

Observed: background/character packs are independent of six main themes.
Enemy glyph and aura use different dimensions, allowing circle overflow.
Baseline browser check initially failed before assertions because sandbox
prevented Chromium startup (exit 3221225506); outside-sandbox retry pending.
Windows long paths initially prevented checkout; retry with per-command
`core.longpaths=true` succeeded without changing repository configuration.

## Acceptance

- One cohesive new decorative Rift background; no Live/Still or pack controls.
- Six recognizable, stronger theme treatments; existing unlocks and selection.
- Every original enemy and boss fits within the selected theme's circular frame
  at mobile sizes and enlarged text, with safe animation/reduced-motion bounds.
- HP, names, navigation, Wisp attacks, boss panels, touch/keyboard focus and
  legacy Comet cosmetics remain accessible and functional.
- Old saves with retired packs retain progression, both slots, backup/recovery
  and Ascend behavior; cosmetic changes do not change simulation or rewards.
- Focused regression checks, retained applicable visual assertions, full required
  CI, integrated-source checks and signed Android upgrade/release verification.
- Visually inspect screenshots. Record physical-phone/WebView60/TalkBack limits;
  automated/self review is not independent or human design acceptance.

## Implementation and checks

Candidate product SHA256 `f1c3c56ade415e25239f53442706014cae4d4cb35defe05f97be17549d7bf83d`.
Removed the pack selectors, Live/Still control and active pack rendering.
One static vector scene now fills the Rift, with theme-colored lighting. Six
redrawn circular seals share the enemy's centered SVG coordinate system; original
enemies and their boss regalia fit inside it. Collection shows real ring previews,
including locked themes with their unchanged requirements. Main-theme unlocks,
original characters, Comet decorations, attack effects and gold navigation dot
remain. Old `riftLook` values round-trip as inert legacy data; no schema change.

Changed: `index.html`, visual/cosmetic tests, native installed-appearance assertions,
independent replay test/reference binding and task/evidence. Existing workflows
are unchanged; the visual test entrypoint runs its added containment control.
Assertions for the explicitly removed selections were replaced with absence and
legacy-save preservation checks. Original navigation, attacks, touch, motion,
layout and save checks remain; added an oversized-enemy causal control.

Node24.22.1 / locally installed Brave Chromium:
- Existing baseline visual quick check: 122 assertions PASS on root PR42
  `6bd4b293` (its Rift visuals match main; not a main gameplay baseline).
- New quick visual check: 115 assertions PASS, six themes x 230 encounters,
  both save slots, reload, backup, Ascend, retired preferences, native touch,
  layout, original attacks and navigation. Screenshots visually reviewed.
- Paired independent replay: 115,200 one-second calls per source; all four
  complete saved states, rewards and canonical hashes exactly match main.
  Only the reference's source binding changed after verified replay.
- Existing chronological `endless-parity.cjs`, source syntax/IDs/lifecycle,
  actual task-context budget and whitespace checks PASS.
- Full twelve-profile visual suite PASS: 1,375 assertions and 16,560 encounter/
  theme/profile samples. Existing cosmetics PASS: 170 samples, caption contrast,
  legacy decorations, keyboard/touch, reload, backup/recovery and negative controls.
  Original native Rift check and negative controls are running. Remote CI and
  Android acceptance pending. Browser reports Chrome157.0.8103.50.

Git push found a stale credential-helper path; a command-local override uses the
installed GitHub CLI without altering user configuration. The credential lacks
workflow scope. The new negative control therefore runs in the already-required
visual test entrypoint, with no workflow edits or permission changes. The initial
unpublished commit will be amended; no published history is being rewritten.

Self-review only. Physical phone, exact WebView60 and TalkBack are unverified.
No gameplay, progression, balance, prices or paid-value changes. Historical art
definitions remain inert; keeping them avoids unrelated asset/catalog churn.

## Continuation

Next: finish local suites and save receipts, publish the isolated branch/PR, fix
any required CI findings, recheck main/PR42 overlap before integration, then
complete integrated validation and the signed Android delivery. Keep this task
open until required acceptance is verified. [Evidence](../qa/rift-theme-redesign-001/README.md).
