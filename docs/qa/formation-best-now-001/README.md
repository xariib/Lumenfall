# Field Best now local evidence

14 October 2026. User asks to field the Wisps for Bonds marked Best now.
Explicit answer: require all Wisps needed by that recommendation, not all eight.
Baseline clean tracked bf36593/local-full-debug, source35846c8f; unrelated
untracked validation-evidence preserved. [Baseline browser](baseline/results.json)
confirms Best now labels exist without a field action.

Candidate source SHA-256:
`e655c7759976b662b2c62ac7af6bbdb3fb70eecf57934978c0265c261c0ad70e`.
Node24.19.0/Chrome151.0.7922.34; self-review only.

One stable native button fields the unique members of currentFormationFocus's
existing mode-based recommendations. Push needs Ember/Void/Gale/Thorn/Tide;
Farm needs Tide/Aurora/Gale/Thorn/Stone; Boss needs Ember/Void/Stone/Titan.
Current recruited extras are retained in their existing order where5/6 capacity
permits. The preview names the full team and selected preset autosave destination.
It does not claim to optimize levels/power or change Best now selection logic.

All required members must have a paid/recruited level above0. Missing recruits,
insufficient slots and already-fielded targets deny the whole action. The handler
recomputes the plan on every click; no partial application/recruit/purchase or
currency spending. Existing Formation commit/rebuild/trial/save validation is
used inside the existing transactional save helper; primary-save failure rolls
back. No save fields, balance/caps or offline/automation changes. Existing preset
edits remain selected-destination autosave, not automatic mode/preset switching.

ARIA-disabled retains keyboard focus on the same button after a successful
selection or denial; handler enforces the gate for native or direct invocation.
Descriptions explain current team, missing recruits or already-fielded state.
The native Bonds disclosure and simplified Wisp cards are retained.

| Check / command | Result |
| --- | --- |
| `node tests/behavioral/formation-best-now-core.cjs mobile/www/index.html` | [PASS1408/4 controls](core.json) |
| registered runner `--web-root mobile/www --scenario formation-best-now-core` | [PASS](registered-core.txt) |
| registered runner `--web-root mobile/www --scenario formation-best-now --raw-artifacts docs/qa/formation-best-now-001/registered` | [PASS1299/108 cases](registered.txt), [matrix](registered/formation-best-now/results.json) |
| registered runner `--scenario formation-collapse` | [PASS541/12](disclosure.txt) |
| registered runner `--scenario formation-bonds-mobile` | [PASS12 existing profiles](existing.txt) |
| `node tests/behavioral/formation-bonds.cjs` | [PASS8/6 controls](formation-core.json) |
| `node tests/behavioral/wisp-contribution-core.cjs index.html --negative --preservation` | [PASS8099/preservation8592](wisp-core.json) |
| `node tests/behavioral/wisp-contribution-mobile.cjs index.html docs/qa/formation-best-now-001/wisp-mobile` | [PASS163/12](wisp-mobile/results.json) |
| `node tests/behavioral/wisp-rarity-scroll.cjs index.html` | [PASS3229](wisp-scroll.json) |
| saved existing adapter: `formation-autosave-contract` | [PASS133](autosave.json) |
| same adapter: `nav-workshop-contract` | [PASS415](navigation.json) |
| actual-task context and source validation | [context](context.txt), [source PASS](source-validation.txt) |
| all15 root/staged/HTTP assets | [Exact match](preview-assets.json) |
| complete643897-character script loaded in existing preview | [Exact match](loaded-preview.json), [screen](preview.png) |

Core exercises Push/Farm/Boss,5/6 slots and every selected/custom preset. Each
missing required Wisp refuses without changing complete state; unrelated missing
Wisps do not gate. Successful changes affect only party/selected preset/rebuild/
save timestamp; currencies, levels, ability charge, buffs, paid upgrades, queues,
other presets and unrelated fields compare exactly. Repeats are inert; actual
saved-state reload, primary failure rollback, pending rebuild and Single Star's
existing party rule are covered. Controls undo recruitment, require all eight,
omit preset autosave and omit the trial party rule; all are rejected.

Browser matrix:3 contexts ×320/390/430px ×100/200% text ×normal/reduced motion ×
Enter/Space/touch =108 cases. It checks44px targets, current labels/team/destination,
native full equip, exact state, repeat input, focus/identity across rendering,
blocked/stale-handler refusal, saved bytes, actual page reload and live interval.
Screens at normal/doubled text visually reviewed. Isolated profiles only; no
fixtures, currency spending or field action applied to the user's live save.

One early target measurement caught the tail of an existing press transition;
[diagnostic](native-timing-diagnostic.json). The test now waits for the button's
animations to settle before static target measurement, keeping44px/assertions/
90s deadline unchanged. Early core trial fixtures lacked valid existing legacy
claim/Ascend metadata; corrected fixtures use accepted current save state. No
product failure remains in these scoped checks. No existing assertion/gate removed.

Local preview4174 is open on expanded Bonds, showing the gated action and missing
recruits in the existing game. Source/fonts/branding refreshed in ignored
mobile/www. Unrelated work preserved. No remote/APK/signing/archive actions.
Chat OPEN; user review and final exact combined/required CI, inherited deadlines/
Guidance/Windows transport/tooling and Android/device/WebView60/textZoom/TalkBack
acceptance remain pending. Modern browser checks do not establish Android acceptance.
