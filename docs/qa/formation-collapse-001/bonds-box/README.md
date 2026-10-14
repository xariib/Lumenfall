# Contribution removal and Bonds card revision

14 October 2026. User explicitly replaces the earlier collapse request: remove
the Formation contribution panel fully and make Formation Bonds & guidance a
box like that panel. Scope is the named aggregate panel; individual Wisp readouts,
Bond mechanics, purchases, balance and saves remain. Earlier requirements and
deferred acceptance are preserved in [prior task checkpoint](prior-task-checkpoint.md).

Baseline HEAD89337a5, sourcef3321623; [browser reproduction](baseline/results.json)
confirms Contribution still exists and Bonds guidance lacks a card wrapper.
Candidate SHA-256:
`db2f6dbaad6cd8d894ea896b3c18aa353dbc70d37f79606a46e16206493e4efa`.
Node24.19.0, Chrome151.0.7922.34. Self-review only.

The change removes the panel markup/styles/handler, cached obsolete element and
aggregate HTML renderer. The existing report and per-Wisp renderer remain active;
its guard uses spirit-list. Existing native Bonds details/summary now uses a
card wrapper and the old panel's padded bordered/background/rounded control.
Expand/Collapse labels are visual; native disclosure supplies accessible state.
Expanded content and collapsed choice/focus survive rendering. Encyclopedia text
now points to current Wisp readouts and Bonds guidance rather than the removed UI.

UI assertions for the explicitly removed panel are replaced with absence, boxed
Bonds and native disclosure assertions. No numerical/preservation test or CI gate
is removed. Full-run Formation registration remains; original receipts are frozen.

| Command / check | Result |
| --- | --- |
| `node tests/behavioral/formation-collapse.cjs index.html docs/qa/formation-collapse-001/bonds-box/browser` | [PASS541/12](browser/results.json) |
| registered runner `--web-root mobile/www --scenario formation-collapse` | [PASS541/12](registered.txt), unchanged90s gate |
| same runner `--scenario formation-bonds-mobile` | [PASS12 existing profiles](bonds-existing.txt) |
| same driver with `--mutate-choice` | [Expected forced-close assertion](choice-control/failure.json) |
| `node tests/behavioral/wisp-contribution-core.cjs index.html --negative --preservation` | [PASS8099/preservation8592](wisp-core.json) |
| `node tests/behavioral/wisp-contribution-mobile.cjs index.html docs/qa/formation-collapse-001/bonds-box/wisp-mobile` | [PASS151/12](wisp-mobile/results.json) |
| `node tests/behavioral/wisp-rarity-scroll.cjs index.html` | [PASS3229](wisp-scroll.json) |
| `node tests/behavioral/formation-bonds.cjs` | [PASS8/6 controls](formation-core.json) |
| saved run-existing adapter: `formation-autosave-contract` | [PASS133](formation-autosave.json) |
| same adapter: `nav-workshop-contract` | [PASS415](navigation.json) |
| same adapter: `r3-save-reload` | [PASS actual reload](save-reload.json) |
| context with actual task; source validation | [context](context.txt), [source PASS](source-validation.txt) |
| current root/staged/HTTP source/fonts/branding | [PASS15 exact assets](preview-assets.json) |
| complete641855-character script in the existing live preview | [Exact loaded match](loaded-preview.json) |

541 matrix checks cover320/390/430px,100%/200% text, normal/reduced motion,
Enter/Space/touch, closed/open states, focus/identity through full/role/live-timer
renders, tab return, active Bond class changes after Bench/Field and unchanged
save state for disclosure/render. Screens at normal/large text visually reviewed.
Initial test adaptation incorrectly used bounding rectangles for closed native
details content and expected Bond text to change rather than active classes.
The driver now checks actual visibility and markup/class changes; no product
regression found. [Adaptation diagnostic](browser/failure.json) is retained.

The initial context check exceeded32KiB after accumulated project/task history.
Earlier task bytes are preserved separately and current task shortened; threshold
unchanged. Unrelated untracked validation/Wisp-simplicity work was preserved.
No subagents, push, build/sign/release or archive action.

Playable preview4174 reloaded on Wisps with existing progress intact; collapsed
and expanded native accessibility states inspected. [Collapsed preview](preview-collapsed.png),
[expanded preview](preview-expanded.png). Full combined/required CI and inherited
deadlines/Guidance/transport/tooling issues remain open. Android/device/exact60/
textZoom/TalkBack acceptance is deferred as instructed; browser checks do not prove
it. Chat remains OPEN. Next: user reviews updated preview, later combined acceptance.
