# Rift screen controls and enemy visibility

17 November2026. Owner: this feature chat. **Integrated and Android0.2.136
published/verified; duplicate PR full-suite acceptance pending.** Physical/human
acceptance remains open. Self-review and automation only; no independent review.
Do not archive this chat while required acceptance remains unverified.

## Original requirements and scope

User: “Remove the bar with hints on the rift screen. Switch farm and push
buttons position with each other. On rift screen the enemies sometimes are
behind the background.” Original phone JPEGs of Rifts286–288 are retained under
`docs/qa/rift-screen-fixes-001/reported-rift-286.jpg`,287.jpg and288.jpg.

Remove the Rift hint strip and redundant Settings control, put Farm left and
Push right in visual/DOM/keyboard order, and keep enemies above scene/theme
fills. Preserve original artwork/six themes, combat, mode actions, Workshop
advice, navigation, accessibility, paid cosmetics, progression and both saves.
This feature introduces no economy, balance, save-schema, native dependency,
signing-identity or binding-rule change. Keep newer main's accepted Forge work.

Acceptance includes removed/focusable controls and reserved gap, unchanged mode
actions, >=44px mode controls, >=120px attack region, all encounters/themes,
boss/Luminous/hit states,320/390/430px, enlarged text and both motion modes.
Required CI and signed Android identity/assets/save upgrade/updater/retail launch
and anonymous public downloads/feed must pass. Physical phone, exact WebView60
DOM, TalkBack, Google Play Protect and human acceptance are not observed.

## Baseline, integration and release

Initial main: b075cfbac508096c240d3cba8885384235e4a210. Isolated source branch:
`fix/rift-screen-fixes-001`, worktree `C:/lf-rift-screen-fixes`. Original checkout,
its attachments and other feature worktrees were not changed. Read startup,
state/workflow and original [theme](RIFT_THEME_REDESIGN_001.md),
[combat](RIFT_COMBAT_LAYOUT_001.md) and
[menu](MOBILE_MENU_CORRECTIONS_001.md) requirements before editing.

Newer main0adb60eb36a3be15ce152d6ffe416d5996b039c7/PR59 merged during validation.
Retained its finite Forge progression, paid above-cap effects and presented-
surface/isolated-profile Lab tests exactly. Resolved only shared status/history
and HTML oracle overlaps; product merged without conflict.

[PR60](https://github.com/xariib/Lumenfall/pull/60) is merged. Main was advanced
by lease-checked fast-forward from0adb60eb to exact validated commit
**12122b805b4dd7ad28fef5f26dad94e8a5a8c3df**,14:16:23UTC. Candidate and PR
merge-preview tree both5fff90d24b8ff41ffb86a70fea151d5632ab427a. All six mandatory
release-ci-gate workflow_dispatch runs passed on this identical SHA before
integration; their actual ref was the feature branch. No gate was modified.
Previous main build44099434281 completed publication before this ref update.
The duplicate PR rerun continues; completion still requires that result.

Published [Android0.2.136](https://github.com/xariib/Lumenfall/releases/tag/android-1000136),
[build44101297138](https://github.com/xariib/Lumenfall/actions/runs/44101297138),
from main12122b80. HTML SHA256:
`0c374c2d103ca8bdad11ee035743d064771a576d7794599b527fcf4a21c1a60a`.
APK SHA256:`aac1b427e9f573320a968fd3d6b616da5edb6bae4f4bf643ffddb4bdbde41e0e`,
5,163,041bytes, versionCode1000136, package`com.lumenfall.app`.
Established signing certificate retained; exact identity is in the receipt.

## Implementation

`index.html`: remove hint strip/dialog, redundant Settings toggle and related
presentation preference/rendering/listeners. Keep pure objective quote logic and
Workshop power advice. The old device-only hint key stays inert; no migration.
Farm precedes Push in actual DOM; purchase/combat/save handlers are unchanged.

Explicit isolated enemy-visuals z1 contains a separate opaque SVG field at z-1.
Legacy Comet Trail auto/0, original theme ring z1 and enemy z2 stay above it.
The opaque center masks landscape silhouettes without changing original ring
definitions. All61 original SVG symbols, including29 creature definitions and
six rings, are byte-identical to newer main. Fonts/branding/native files unchanged.
Product diff against newer main is7 additions/150 removals, confined to this UI.

Supporting changes: new18-profile `rift-screen-fixes.cjs`, paired-replay helper,
updated retired-hint/order assertions in existing UI/native tests and source
contract. Corrected remaining Wisp formula test to check hint absence and
retained Fractured Core Encyclopedia text; every numerical formula assertion
stays intact. Run that case and the Rift matrix early in pre-merge CI. Existing
unrelated gates, assertions and deadlines remain; no acceptance was reduced.

Upstream canonical history`docs/PROJECT_STATE_2026-11-17_HISTORY.md` is retained
byte-for-byte. This task's complete pre-feature state snapshot is separately
preserved byte-for-byte as`docs/PROJECT_STATE_2026-11-17_RIFT_BASELINE.md`.
Active status compaction fixed an existing58-byte32KiB startup overrun without
changing the gate. Open rapid-repeat economy finding remains open and unrelated.

## Checks and durable evidence

[Evidence index](../qa/rift-screen-fixes-001/README.md), JSON/PNG receipts and
compressed raw logs live under`docs/qa/rift-screen-fixes-001/`.

- Source syntax/IDs/lifecycle guards, task context/links and diff against newer
  main PASS. Source/assets/snapshots compared byte-for-byte; full diff self-reviewed.
- Four paired8h windows against newer main0adb60eb,115,200 one-second calls per
  source: every saved field/reward matches. `combined-paired-replay.json` retains
  original VM endpoints and the original browser oracle values; only HTML binding
  changes. Upstream's independent Forge replay binds the immutable earlier VM
  reference to newer main. No archived reference was rewritten.
- Combined matrix:666 checks,18 profiles,24,840 encounter/theme samples, six
  themes, both motion modes and five rejected causal controls. Controls restore
  hints, reverse modes, lower enemy, make field transparent or cover paid Trail.
  Actual Fractured Serpent/Effigy/Behemoth screenshots self-reviewed against the
  user's JPEGs. Synthetic state matches species/region/theme, not the user's save.
- All six required release workflows PASS on12122b80: full44091457972,
  Comet44091463570, Forge44091468619, Lab44091472947, Shared44091477819,
  Tree44091482012. Full coverage:190 main scenarios plus isolated offline PASS.
  CI Node24.19.0/Chrome157.0.8103.78; local Node24.22.1/Chrome157; Android Node22.
  Legacy V8 JavaScript checks pass; exact WebView60 DOM is not observed.
- Seven focused PR workflows PASS. Full PR44091395146 first attempt failed an
  existing native Wisp disclosure touch assertion; identical-source prepared
  workflow passed the whole step. Unchanged retry134084435082 passed that step
  and is running the stateful suite. Final completion still waits for it.
- Signed Android134 candidate and published136 PASS identity/assets, retained
  UID/both saves/paid work/legacy cosmetics, actual updater/system install and
  normal Android12 retail launch without debugger/instrumentation. Three actual
  published frames self-reviewed: no hints, Farm left, original ring/enemy clear,
  landscape outside center and paid cosmetic retained.
- `android-release/public-verification.json`: anonymous versioned and latest APK
  downloads, release feed, exact commit/identity/assets/security/dependency and
  upgrade/updater metadata all PASS at14:28:18UTC. Artifact14337221478 digest
  `ae2af872888492681567ded13c38298f39dfaa933016d66a4c39ec470e05cab5`.

## Retained failures and limitations

No failed/incomplete attempt is counted as a pass; no deadline/assertion was
weakened. Earlier-source browser/Android receipts are explicitly historical.

- First opaque-field candidate131 lost its fresh retail ring; corrected by a
  separate SVG. Candidate132 first retail accessibility tree failed, then an
  unchanged retry passed. Candidates134 and published136 independently pass.
- Self-review caught field z0 covering paid Trail; corrected to z-1 with a fifth
  control and valid settled-entitlement fixture. Early reload race fixed with a
  per-document token; keyboard expectation follows requested Farm→Push order.
- A stale hint-bar expectation in wisp-formula-contract failed both earlier
  full suites. Updated only UI assertions/bridge, retaining all numerical checks
  and Encyclopedia boss text; current early/full required checks pass.
- Linux Wisp300ms setup waits and earlier Lab CDP touch calls failed transiently
  in retained attempts; unchanged retries pass. Newer-main Lab fixes are retained.
  Current PR native disclosure first failure remains recorded, cause unproven;
  its unchanged retry passed the step and still needs full-suite completion.
- Local Windows browser setup/dump-DOM timeouts produced no QA result; no pass
  claimed. Baseline quick test stopped at old Workshop active-dot assertion.
  Separate existing reduced-motion probe rejects both baseline and candidate
  for transition-property none/duration0.001ms instead of exactly0s. Charge CSS
  unchanged; diagnostic retained for a separate harness task.
- Physical phone, exact WebView60 DOM, TalkBack, Play Protect and human review
  remain unverified. Emulator/synthetic fixtures do not prove those acceptances.

## Continuation and next action

Source/main app commit stays12122b80; do not confuse it with QA/document commits.
Worktree is on docs-only`checkpoint/rift-screen-fixes-001-12122b80-qa`, currently
rooted at12122b80. Do not start another APK merely because QA HEAD differs.

Wait for unchanged full PR44091395146 to pass. Retain final raw logs/results.
Recheck actual main, preserve any newer work, and integrate QA/final status as a
docs-only descendant after publication. If main remains12122b80, fast-forward
the local source branch to the QA branch, then append final evidence/status and
push only the docs descendant to main. If main moved, merge/preserve it first
and verify the final diff adds no product changes. Keep the feature/chat open
for physical/human acceptance; do not archive. No permission prompts, other
chats, subagents or message tools were used. No new binding rules introduced.
