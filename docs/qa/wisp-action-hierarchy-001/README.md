# Compact Wisp card acceptance

Final product SHA256:
`5733c81744ac1dddff50639d710ea542c3a7eedcd30c0764d92a72a0096cafcd`.
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

[Browser receipt](browser.json): 18 width/text/motion profiles, 39,150 checks.
Widths 320/390/430 px; root text 100/150/200%; normal and reduced motion. This
runs the retained card layout/preservation suite plus live resource transitions,
priority cases, a single enabled primary, readable naming, correct prices,
44 px targets and actual native keyboard/touch purchases through original
handlers, including 72 real purchases and 36 immediate focus returns. The
[automated-review repair](focus-review.json) catches a stale Next accessible name
before any affordability refresh; native focusin observes the correct name
before it can be announced. Full game state and both save slots remain unchanged by viewing and
highlighting. Current/Next visual labels become accessible group names; their
exact effect values remain tested. The redundant Ability-badge assertions were
updated to require its intentional absence and retain ability name, level/cap,
current/next effects, controls, pricing and accessibility assertions.

[Defect control](negative-control.json): intentionally advertising a disabled
purchase fails the exact “unfunded card has no suggested purchase” assertion.
The failure must have a different source hash and clean teardown. CI retains all
existing gates and adds the positive compact-card gate plus both disabled-primary
and stale-name causal controls.

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

[PR3](https://github.com/xariib/Lumenfall/pull/3) is published following the user's
explicit approval on 20 October 2026 (“Godkendt”). The initial remote pass found
two QA fixture compatibility issues: an obsolete header inverse and an exact
full-label expectation that omitted the approved Next cue. The
[repair receipt](ci-test-compatibility.json) records both findings and unchanged
acceptance assertions. Shared UI now passes 6,985 positive checks / 12 profiles
and all three causal controls; Tree mobile passes 26,756 checks / 12 profiles.
The subsequent [accessible-name repair](focus-review.json) finalizes names
before focus restoration. All 24 matched height fixtures remain identical; the
current screenshots and browser/scroll/affordability receipts use the final
source hash above. The manifest retains older core results under their original
source hash. All required CI must pass on the current PR head; results and run
links are recorded in PR3.

Main, merging and APK publication are outside this delivery step. Keep the
feature open: physical Android, exact WebView60 and TalkBack acceptance remain
unverified.

The subsequent [legacy control-label correction](control-label-compatibility.json)
retains the original exact base action, price, native eligibility, geometry and
save assertions while separately checking the approved Next cue. Focused replay
passes in the original harness; both selected/focus-return self-tests still
produce their intended failures. Production source is unchanged.
