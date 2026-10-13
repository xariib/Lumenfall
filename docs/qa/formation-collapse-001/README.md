# Formation collapse local evidence

13 October 2026, Node24.19.0, Chrome151.0.7922.34. Self-review only.
Source `0bf0505ff61cedb0dc014a62adaa849a780388e3e8c611715bd6697dd3c2c077`;
baseline clean `local/full-debug` at9ad4b6f, source2fa40008.

The [baseline](baseline/results.json) reproduces an always-visible contribution
summary with no disclosure. The change adds a stable native button with a clear
Expand/Collapse label, aria-expanded and aria-controls. Hidden content remains
current; rendering updates only the panel, preserving the button, choice and
focus. State is session-only and resets to collapsed on page reload. All report
operands, prices, rewards, saves, paid value and per-Wisp readouts remain intact.

| Check | Evidence/result |
| --- | --- |
| `node scripts/codex/check_context.cjs --task docs/tasks/FORMATION_COLLAPSE_001.md` | [PASS](context.txt) |
| `node scripts/ci/validate_source.cjs` | [PASS](source-validation.txt) |
| `node tests/behavioral/run.cjs --web-root mobile/www --scenario formation-collapse --raw-artifacts docs/qa/formation-collapse-001/registered` | [PASS529/12](registered.txt), [matrix](registered/formation-collapse/results.json) |
| `node tests/behavioral/formation-collapse.cjs index.html docs/qa/formation-collapse-001/choice-control --mutate-choice` | [Expected failure](choice-control/failure.json): refresh resets expanded choice |
| `node tests/behavioral/wisp-contribution-core.cjs index.html --negative --preservation` | [PASS8099 + preservation8592/40 replays](wisp-core.json) |
| `node tests/behavioral/wisp-contribution-mobile.cjs index.html docs/qa/formation-collapse-001/existing-mobile` | [PASS151/12](existing-mobile/results.json), all prior assertions retained |
| `node tests/behavioral/wisp-rarity-scroll.cjs index.html` | [PASS3229](wisp-scroll.json), including background refresh anchors |
| `node tests/behavioral/formation-bonds.cjs` | [PASS8/6 controls](formation-bonds.json), final source |
| saved run-existing adapter, `nav-workshop-contract` | [PASS443](navigation.json) |
| same adapter, `formation-autosave-contract` | [PASS133/3 controls](formation-contract.json) |
| same adapter, `formation-autosave-save-reload` | [PASS](formation-save-reload.json) |
| same adapter, `r3-save-reload` | [PASS real reload](save-reload.json) |
| source/fonts/branding staged and served byte comparison | [PASS](preview-assets.json) |
| complete live preview main script631227 characters | [Exact match](loaded-preview.json), [screenshot](preview.png) |

Focused matrix:320/390/430px,100%/200% text, normal/reduced motion; actual Enter,
Space and touch. Both choices survive role/full render, Bench/Field, tab return
and actual periodic ticks; toggle identity/focus remains. Rendering/toggling is
save-pure; party changes update aggregate and individual contribution. Toggle
fits each viewport and meets44px targets. Page reload defaults collapsed.
Screenshots reviewed at normal/doubled text. Tests use isolated temporary
profiles; no fixture or purchase was applied to the user's live preview.

The initial sandbox browser launch was blocked and passes outside the sandbox;
[diagnostic](sandbox-browser-diagnostic.json). An early layout check measured
the tab-entry scale animation before it settled; [diagnostic](layout-timing-diagnostic.json).
The driver now awaits animation completion without loosening assertions. An
initial adapter invocation used an unknown scenario name; [diagnostic](unknown-scenario-diagnostic.json).
The actual registered Formation contracts pass. No product failures remain in
this feature's focused checks; no tests/gates were weakened.

Full-suite/Prism deadline, Windows standard dump-DOM transport, remote
integration and Android/device/exact WebView60/TalkBack acceptance remain open.
Modern browser PASS does not establish Android acceptance. No remote push,
APK build/release, signing change or archive. Next: user reviews the open local
preview; next queued improvement is LAB_SPEED_CONTROLS_001.
