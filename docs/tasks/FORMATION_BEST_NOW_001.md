# Formation Best now field action

14 October 2026. User asks for an action to field/equip Wisps for the Bonds
marked Best now. Clarification: require all Wisps needed by the recommended
formation, not all eight in the collection. Preserve balance, paid value and
saves; no automatic recruitment/purchase or new save fields.

Baseline: clean tracked local/full-debug HEADbf36593, source35846c8f.
Unrelated untracked validation-evidence preserved. Read current
[state](../PROJECT_STATE.md) and [earlier Formation UI](FORMATION_COLLAPSE_001.md).
One owner; no agents/chats/remote/APK/signing/archive.

Implementation: derive unique members from existing currentFormationFocus Bonds. One
Field Best now action previews the team, missing recruits and current preset
autosave destination. Require all needed members above Lv.0, check capacity,
retain recruited current extras where slots permit, and reuse existing Formation
commit/save/trial validation. Revalidate at click time; disabled missing/already
fielded states cannot partially recruit/equip/spend. Refresh focus remains stable.

Acceptance: Push/Farm/Boss; every missing member;5/6 slots; already-active and
repeated inputs; context/roster transitions; selected/custom preset, rebuild,
trial rules; exact paid/state/save preservation and real reload. Native touch,
Enter/Space, mobile320/390/430 and200% text, current Bonds/disclosure and
Wisp-scroll regressions. Source/context/diff review, local checkpoint and exact
current mobile asset preview. Modern browser is not Android acceptance.

Status: LOCAL IMPLEMENTATION VERIFIED; no known task-introduced product failure
in scoped checks. [Evidence and exact commands](../qa/formation-best-now-001/README.md).
Source e655c7759976b662b2c62ac7af6bbdb3fb70eecf57934978c0265c261c0ad70e.
Node24.19.0/Chrome151.0.7922.34; core1408/4 controls, browser1299/108,
Formation541/12/native Bonds12, core8099/preservation8592, Wisp mobile163/
scroll3229, autosave133/nav415, source/context/diff PASS. Self-review only.
Changed index.html, two new Best now tests, reusable Formation harness bridge,
runner/scenario registration, this task/state/evidence. Current source/fonts/
branding staged in mobile/www and exact HTTP/loaded-script preview verified.
No fixture/purchase/field operation on the user's save; unrelated work preserved.

Next: user reviews the open Bonds preview. After improvements, rerun exact final
combined suite/required CI and affected regressions; resolve or disposition
inherited deadlines/Guidance/Windows transport/tooling. Later authorized Android
build/package/version/existing signing/assets and installed-device/WebView60/
textZoom/TalkBack acceptance remain pending. Browser PASS is not Android
acceptance. Save later integration/release evidence; keep this chat OPEN.
