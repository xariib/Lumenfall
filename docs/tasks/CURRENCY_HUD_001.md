# CURRENCY_HUD_001 — consistent top currency display

14 November 2026. Owner: this feature chat, no subagents.
Status: implementation integrated; signed preview verified; combined public
release and physical/human acceptance remain open. Do not archive.

## Original request and scope

User: “I want the currency menu at the top to be like the rift style on all
the others menu aswell. So it's showing the icon and then how much currency
right of icon. They should have same size and style like the rift screen everywhere.”

Use one Rift-style top display across Rift, Wisps, Forge, Lab, Ascend and Deeds:
icon followed by amount, matching size/colors/borders/shadows. Keep currency
names accessible and preserve all six wallets, formatting/live refresh,
purchases, saves/recovery, gameplay, mobile focus and navigation. No balance,
cap, schema, reward or binding-rule change.

Read [startup](../../PROJECT_BOOTSTRAP.txt), [state](../PROJECT_STATE.md),
CODEX_START, CONTEXT_INDEX and [workflow](../project/FEATURE_WORKFLOW.md).
Baseline main858d713f (Android0.2.111); isolated branch
`feature/currency-hud-001`, worktree `validation-evidence/currency-hud`.
Other feature worktrees and root attachments were left untouched.

## Implementation and integration

PR49 merged by fast-forward to exact tested
`7f149b895c9f90656bbb81766249665ed1f426fc`.
Currency product changes are CSS-only in `index.html`: shared24px chips
(20px on short screens),11px icons,10px amounts, original Rift gradients,
padding, borders and shadows. Names stay in visually clipped spans; amounts
remain visible to their right. All inline product JavaScript at7f149b89 is
byte-identical to baseline. Its HTML SHA256 is
`029b81994baeff862fc3b4038638c210b04ff8ab3bd330d9c64b40bdc3ec678d`.

`tests/behavioral/visual-audit.cjs` now measures all six currencies/screens at
844px/600px heights, matching geometry/styles, zero/large/exponential live
balances, unclipped amounts and actual browser accessibility names. The existing
workflow runs it; no gate/assertion/deadline was weakened. Four paired eight-hour
one-second replays preserved every save field, reward and original endpoint;
only the golden full-source binding was updated after that replay.

Changed files: product CSS, existing visual gate,
`tests/behavioral/offline-swift-current-golden.json`, this task, shared status and
[QA evidence](../qa/currency-hud-001/README.md). Recent release summaries were
compacted with full records still linked to satisfy the unchanged32KiB budget.

## Verified original currency source

- Local visual matrix:1,776 assertions/16 width/text/motion profiles; screenshots
  self-reviewed. Node24.22.1, Brave157.1.99.57.
- All eight applicable PR and six manual release workflows passed at7f149b89.
  Both broad runs passed220 browser executions/190 scenarios plus separate
  isolated offline jobs. Broad CI Node24.19.0/Chrome157.0.8103.50.
  [Exact candidate receipt](../qa/currency-hud-001/candidate-readiness.json),
  [release gates](../qa/currency-hud-001/release-readiness.json),
  scenario summaries and [replay](../qa/currency-hud-001/replay.json).
- Signed Android0.2.112/run43578599508 finally passed all original native
  checks on attempt3/job132411866541: package/key/assets/security, upgrade,
  both saves/paid work, updater and normal retail-image launch without debugger
  or app test instrumentation. All six currency names appear in its Android XML.
  Package `com.lumenfall.app`, established certificate retained.
  [Preview verification](../qa/currency-hud-001/initial-preview-verification.json),
  [native workflow](../qa/currency-hud-001/initial-native-success.json),
  and `initial-native-pass/` retain exact APK/hash/source receipts.
- [Signed preview ZIP](https://github.com/xariib/Lumenfall/actions/runs/43578599508/artifacts/14108489985)
  is delivered but unpublished; public latest was still0.2.111 at last check.
  Do not publish this obsolete source over later integrated work.

## Earlier failures and diagnostic disposition

Initial startup-size, Wisp300ms setup and offline300s timeout evidence remains
in `first-ci-failures.json`; later required checks passed without weakened
limits. Initial native attempts1/2 showed a running game but incomplete Android
accessibility dumps/null-root/idle errors. Complete raw artifacts are retained
in `android-first-failure/` and `android-second-failure/` (lossless log compression
and original hashes). Their cause remains unproven, despite the later pass.

Feature-only c737fd3e added a failure-only comparison with pinned released0.2.111.
Its first diagnostic build43581066569 stopped earlier on updater metadata
without `tag_name`; HTTP/body were not recorded, so its cause is unknown.
An unchanged retry passed every original native assertion on unpublished0.2.114;
therefore its failure-only baseline comparison DID NOT execute. There is no
comparison result against0.2.111. [Diagnostic acceptance](../qa/currency-hud-001/diagnostic-success-summary.json)
and `native-diagnostic-pass/` retain the real XML/screenshot/identity/receipts.
The temporary native helper was restored byte-for-byte to7f149b89; no permanent
test, workflow or native-app change resulted from that experiment.

## Current combined release dependency

Main subsequently integrated separately owned [progressive Deeds](DEEDS_PROGRESSIVE_001.md).
Preserve that work; no ownership or acceptance of it is claimed here. The earlier
combined main e67c984f retained every currency CSS rule and regression byte,
and its Shared UI43583796446/job132413902212 passed all1,776 assertions/16 profiles
at product SHA256d58a8edc12f0ed340b8fbb1126bb3eb139bfbe328119743201deb3e7bdc3c7fc.
[Combined source](../qa/currency-hud-001/combined-currency-source.json) and
[actual CI proof](../qa/currency-hud-001/combined-currency-acceptance.json).

Main then advanced to final Deeds details/focus fix
`5040ea14053e9decd7935a72c31af801e87d7860`. This worktree merged that exact main
at936ece57; its product/native/tests/workflows match5040ea14 exactly. Changes
relative to that main are currency delivery documentation/evidence only.
The Deeds owner is already running the current exact-main release pipeline.
Follow that existing delivery and avoid competing builds/publication. Earlier
e67c984f acceptance does not substitute for later-source required gates.

Next concrete action: inspect current main's existing workflows/native build
and combined publication; independently verify the published versioned/latest
APK, source, signing/assets/feed and retained currency layout, then save final
currency delivery docs on current main AFTER publication. Do not rewind main,
publish an obsolete APK, overwrite another feature or weaken any guard.

Physical-phone, exact WebView60 DOM, TalkBack, human design acceptance and
independent review remain unverified. Self/automated review only. Keep task open
and do not archive while required acceptance is outstanding.

[Byte-preserved full earlier checkpoint](../qa/currency-hud-001/task-before-combined-checkpoint.txt)
retains all original milestones, intermediate versions, failure details and
superseded next actions. This compaction preserves evidence and startup budget.
