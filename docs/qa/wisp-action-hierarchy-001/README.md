# Compact Wisp card acceptance

Final product SHA256:
`12e264dbf5ea7cdb29c652a81172b5f38c9111fa0d5e997ad8c6bec3a7c34612`.
Baseline main: `ff50c13c855459078f494fd27dabc5a93c273a4b`.
Node 24.19.0; actual Chrome for Testing Headless Shell 155.0.8059.84.
See the [task](../../tasks/WISP_ACTION_HIERARCHY_001.md).

## Design and matched measurements

One navy/gold/violet surface, compact Rarity/Ability rows, visible current → next
effects with separately named accessible groups, an explicit Ultimate heading,
and an original enabled purchase carrying a short “Next” cue. No extra summary,
duplicate Ability badge, new popup or purchase route. Existing unfinished
upgrades remain expanded and perfected upgrades keep their original disclosure.
The same portraits, names, roles, level/cap values, prices, requirements, role
contributions, Formation, automation, Mastery and Resonate remain available.

[Before](before-390.png), [after](after-390.png), and
[funded action](ready-390.png) at 390 px. [200% text at 320 px](text200-320.png)
wraps naturally and allows vertical scrolling. Screenshots are synthetic browser
fixtures; they are not the user's save or an installed Android build.

[Matched heights](height-comparison.json): at 390 px / normal text, unfinished
cards are 22.5–26.9% shorter across all eight Wisps and the two unfinished
fixtures. Perfected cards are 19.3–21.1% shorter with their information open.
Fresh Ember is 719.3 → 526.1 px. These measurements do not imply faster play or
device performance. Existing requirements and role text retain their original
font sizes; compaction comes from arrangement, spacing and less repetition.

## Tests and preservation

[Browser receipt](browser.json): 18 width/text/motion profiles, 38,394 checks.
Widths 320/390/430 px; root text 100/150/200%; normal and reduced motion. This
runs the retained card layout/preservation suite plus live resource transitions,
priority cases, a single enabled primary, readable naming, correct prices,
44 px targets and actual native keyboard/touch purchases through original
handlers. Full game state and both save slots remain unchanged by viewing and
highlighting. Current/Next visual labels become accessible group names; their
exact effect values remain tested. The redundant Ability-badge assertions were
updated to require its intentional absence and retain ability name, level/cap,
current/next effects, controls, pricing and accessibility assertions.

[Defect control](negative-control.json): intentionally advertising a disabled
purchase fails the exact “unfunded card has no suggested purchase” assertion.
The failure must have a different source hash and clean teardown. CI retains all
existing gates and adds this positive/negative compact-card gate.

[Preservation proof](preservation.json): 24 selected gameplay function ranges
compare byte-for-byte with baseline, covering state creation/acceptance/loading/
saving, prices and plans, all Wisp purchases, Wisp Power, Ascend, automation and
authoritative online/offline simulation. Changed code is presentation only.
Additional receipts are summarized with exact source hashes in the check
manifest. Self-review and automation only; no independent review is claimed.

Corrections during implementation: the initial large-text Next/Empower layout
could overflow at 320 px; grouping the cue inside the existing label fixes it.
The primary border now updates without the old border transition interpolating
its live availability color. At large text, the header lets Bench/Field wrap
instead of breaking role names into fragments. Final browser profiles cover all.

## Reproduction

```bash
export LUMENFALL_QA_CDP_CHROME=/path/to/chrome-headless-shell
node tests/behavioral/wisp-upgrades.cjs --chrome "$LUMENFALL_QA_CDP_CHROME" --compact --evidence validation-evidence/wisp-compact
node tests/behavioral/wisp-upgrades.cjs --chrome "$LUMENFALL_QA_CDP_CHROME" --card-layout --evidence validation-evidence/wisp-layout
node tests/behavioral/wisp-upgrades.cjs --chrome "$LUMENFALL_QA_CDP_CHROME" --evidence validation-evidence/wisp-original
node tests/behavioral/wisp-rarity-scroll.cjs index.html
node tests/behavioral/upgrade-affordability.cjs index.html validation-evidence/wisp-affordability --negative
node tests/behavioral/formation-collapse.cjs index.html validation-evidence/formation-collapse
node tests/behavioral/formation-best-now.cjs index.html validation-evidence/formation
node scripts/codex/check_context.cjs --task docs/tasks/WISP_ACTION_HIERARCHY_001.md
node scripts/ci/validate_source.cjs
```

## Remaining delivery

On 20 October 2026, the user explicitly approved upload of this reviewed revision
to public `xariib/Lumenfall` and creation of the focused PR (“Godkendt”). This
resolves the earlier automatic disclosure-review blocker. Publish the feature
branch and PR, then pass all required CI; remote results will be recorded in the
PR. Main, merging and APK publication are outside this delivery step. Keep the
feature open: physical Android, exact WebView60 and TalkBack acceptance remain
unverified.
