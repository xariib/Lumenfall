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
  Original native Rift check PASS, including short/safe-area profiles. Missing-dot
  and oversized-enemy controls both reject their intended defect and exit cleanly.
  Remote CI and Android acceptance pending. Browser reports Chrome157.0.8103.50.

Git push found a stale credential-helper path; a command-local override uses the
installed GitHub CLI without altering user configuration. The credential lacks
workflow scope. The new negative control therefore runs in the already-required
visual test entrypoint, with no workflow edits or permission changes. The initial
unpublished commit was amended before the first successful push; published
history was not rewritten.

Self-review only. Physical phone, exact WebView60 and TalkBack are unverified.
No gameplay, progression, balance, prices or paid-value changes. Historical art
definitions remain inert; keeping them avoids unrelated asset/catalog churn.

## Continuation

Published [PR48](https://github.com/xariib/Lumenfall/pull/48), head
`0501ecdb87ed62c90d010ca7a91fe0521df6e663`. All local suites passed. Full raw local
suite is under ignored `validation-evidence/rift-redesign`; added final receipts
are staged for the delivery documentation checkpoint, not yet committed.
PR workflows started (premerge43218861215, Shared43218860869, Forge43218860620,
Lab43218860849, Tree43218861133, Comet43218861183, progression43218860846,
Wisp43218860587). Progression passes; other applicable runs are pending/running.
Prism-only conditional workflows are skipped by their existing triggers.
Signed candidate [build43218948236](https://github.com/xariib/Lumenfall/actions/runs/43218948236)
PASS on the exact PR head with publish=false: stable signing/assets, in-place
upgrade and both saves, installed Rift appearance/touch assertions, in-app updater
and retail-image normal production launch. No release or merge yet.

First CI: Shared UI, Forge, Lab, Comet, progression, Wisp and isolated offline
PASS. Tree's first attempt failed two browser transport deadlines (25s, no DOM
output/QA result; even Chrome --version timed out). All seven later Prism cases
passed. Original failure evidence is retained; same-source job rerun requested.
The Tree retry PASS on the same0501ecdb source with unchanged test deadlines.
Main validation reached the old layout contract and failed its requirement for
six regional landmarks. That expectation contradicts the requested single-scene
design; `layout.js` now verifies one visible consistent full-Rift background,
preserving all region-label, boss-trait, touch, geometry, state and Farm checks.
Product bytes remain unchanged. Adjusted fresh/dense/boss layouts PASS on all15
viewports via the existing Windows CDP transport; the collapse control is still
rejected. Final local receipts, initial failure evidence and signed Android
candidate evidence are saved with this test correction. Android candidate is
0.2.109 /1000109; its exact packaged assets also pass local byte verification.
All initial applicable PR workflows passed except main validation's obsolete
regional-background assertion. Restart all required CI on the new test/doc commit.

Next: monitor these runs/review threads, fix any required findings, recheck main
and PR42 overlap, merge only after acceptance, dispatch six integrated-main gates,
then deliver a verified signed APK/public update. Existing GitHub connector cannot
dispatch workflows; CLI at root `validation-evidence/github-cli/bin/gh.exe` does.
Keep this task open until required acceptance is verified.
[Evidence](../qa/rift-theme-redesign-001/README.md).
