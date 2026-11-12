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

Published [PR48](https://github.com/xariib/Lumenfall/pull/48). Prior prepared head
1b0b61a7186e62b9515384e06ab95cefc34b9da9 includes main
5656cf854b06f7034313dd02ef700c911a2aa701. PR42 integrated and published Android
0.2.110 during this task; both its gameplay and delivery receipt are preserved.
Only status documentation and the replay source binding conflicted. Product
code merged cleanly; no historical files were removed. Game/test/native/workflow
bytes are identical to previously checked combined head c771cffe.

Combined product SHA256:
fe7614f268b02f8b4b5050ce653b997b3e32f1343c5685e8733cdfd562682cc1.
Independent replay against dc78daad (same game as5656cf85) matches every saved
field/reward/canonical endpoint across four eight-hour one-second replays.
Combined visual1375 assertions/16560 encounter samples, native Rift status,
Forge/Lab528 checks and source/lifecycle/context validation pass. Receipts:
integrated-replay.json, combined-visual.json, combined-local-summary.json and
combined-forge-lab.json in the [evidence directory](../qa/rift-theme-redesign-001/README.md).

Historical CI findings: initial premerge failed the retired six-region-landmark
expectation. The test now checks the requested single full-stage scene while
retaining all other layout/region/boss checks. Fresh/dense/boss15 viewports and
the collapse control pass. Two initial Tree runs timed out before any DOM/QA
result; even Chrome --version timed out. Raw diagnostics are retained under
tree-first-failure/ and tree-second-failure/. Both same-source reruns passed with
unchanged deadlines. Later combined-source Tree PR/release checks also passed.
Earlier runs were superseded when main's game and then delivery receipt moved;
no assertion/deadline was weakened.

Signed historical candidate build43218948236 on0501ecdb passed as0.2.109:
established signing, exact assets, both save slots/paid work, installed Rift
themes, updater and retail Android launch. It is unpublished and predates the
Forge/Lab integration; final combined-source signed Android acceptance is needed.

Prior exact-head PR checks and six workflow-dispatch gates are running.
Release runs: premerge43230026842, Comet43230034911, Forge43230043430,
Lab43230051257, Shared43230058747, Tree43230066808.
PR premerge43229959537, Shared43229960087, Tree43229959554; the other PR runs
are discoverable by the final head. Main's prior Android publication43226530073
completed successfully. No independent review or physical-device claim.

Final self-review found the Collection & Journal encyclopedia paragraph still
advertised the retired pack selectors and Live/Still control. Corrected that
single paragraph and extended the visual test to inspect its rendered card.
Quick117 assertions pass on final product SHA256
ce51bc14e82c41929483c6483684add0390690d92d181c8aa35a91336aad0ac8
(final-quick.json); geometry, game functions and save schema are unchanged.
The independent replay again matched all four complete saved states, rewards
and original canonical endpoints before rebinding (final-replay.json). Restart
the required checks on this corrected commit. The earlier visual matrices
remain layout evidence, not a claim that final-source CI has already passed.

Next: publish the guide correction and finish all PR and six workflow-dispatch
gates on that exact head. Recheck main and active
Android publication, then advance main by normal fast-forward to the tested
descendant with no source/test changes. Verify PR48 merged. Publish Android
through the existing integrated-CI gate and verify public APK/feed/assets.
If main moves, reassess before promotion. Connector lacks workflow dispatch;
the installed GitHub CLI provides it. Save final evidence and status in GitHub.
Keep this task open for unverified physical-phone/WebView60 DOM/TalkBack and
human design acceptance. Do not archive or claim complete while these remain.
