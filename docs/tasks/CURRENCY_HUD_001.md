# CURRENCY_HUD_001 — consistent top currency display

14 November 2026. Owner: this feature chat. Status: integrated; Android
normal-launch acceptance and publication pending.

## Request and scope

User: “I want the currency menu at the top to be like the rift style on all
the others menu aswell. So it's showing the icon and then how much currency
right of icon. They should have same size and style like the rift screen everywhere.”

Use the Rift currency chip dimensions and appearance in every menu, with the
icon followed by its amount. Retain currency names for assistive technology.
Preserve six wallets, number formatting, live refresh, purchases, saves, game
mechanics, settings and navigation. No save migration or new binding rules.

## Baseline and acceptance

Baseline: main `858d713f` (Android 0.2.111); isolated branch
`feature/currency-hud-001`, worktree `validation-evidence/currency-hud`.
Root Forge/Lab and Rift-theme checkouts are untouched. No open PRs observed.
Read [startup](../../PROJECT_BOOTSTRAP.txt), [state](../PROJECT_STATE.md),
[workflow](../project/FEATURE_WORKFLOW.md), CODEX_START, CONTEXT_INDEX and relevant
Shared UI requirements. Existing currency markup and live-update functions are
shared; CSS overrides give Rift 24px/20px inline chips and other tabs 34px/30px
two-row chips. Visible labels remain in current Rift markup.

Acceptance: all six currencies use matching inline icon/amount appearance across
Rift, Wisps, Forge, Lab, Ascend and Deeds; match at normal and short heights,
narrow widths, enlarged text and reduced motion. Names remain accessible;
values update and full amounts fit. Existing relevant gates, integrated-source
CI and signed Android delivery must pass. Physical-phone, exact WebView60 and
TalkBack/human acceptance must be reported separately if unavailable.

## Checks and next action

Workflow triggers reviewed: PRs run premerge and UI checks; Android publication
is explicit dispatch and requires six successful integrated-source workflows.
Implementation: shared CSS uses the original Rift 24px/20px chips, 11px icons,
10px amounts, colors/borders/shadows and a consistent header background. Labels
remain in the DOM, visually clipped for icon/amount-only presentation. The
existing visual gate now checks all destinations at both heights, live zero,
large and exponential wallets, unclipped amounts and the actual AX tree.

Changed: `index.html` (CSS only), `tests/behavioral/visual-audit.cjs`, this task
and [evidence](../qa/currency-hud-001/README.md). Inline product scripts are
byte-identical to baseline; gameplay and save code are unchanged. No workflow
or gate was weakened. Screenshot inspection is self-review, not independent review.

Local Node 24.22.1: source/lifecycle/ID validation, task context and whitespace
checks pass. Final browser matrix passed 1,776 checks/16 profiles, including
explicit original chip/icon/font dimension assertions. Baseline
failed the new label-free visual contract. Test development initially assumed
identical native/exact Shard formatting and case-sensitive AX labels; corrected
the fixture expectations, retaining existing formatting and CSS text-transform.

Concurrent Lab simplification and Rift bond display worktrees appeared after
startup; they are untouched. Check current main before integration and preserve
their scoped changes. The connector lacks workflow dispatch/download; GitHub
CLI supplies those operations. Sandbox network restrictions initially made CLI
auth appear invalid; outside-sandbox auth succeeds without credential changes.

Next: publish this focused branch/PR, pass all required CI, serialize main
integration against other features, run integrated release gates and deliver
the signed APK. Keep open while required device/human acceptance is unverified.

## PR49 checkpoint

[PR49](https://github.com/xariib/Lumenfall/pull/49) opened at `e9c9dc07`.
Six applicable workflows passed; premerge failed its startup-size check, isolated
offline timed out before JSON at300s, and both Wisp causal jobs timed out during
their unchanged300ms setup. [First failures](../qa/currency-hud-001/first-ci-failures.json)
retain raw excerpts. The largest task already exceeded32KiB on baseline;
compact the two recent release summaries in PROJECT_STATE while retaining their
full linked task/evidence records. Exploit startup now32551 bytes; no limit changed.

The existing paired replay passed all four eight-hour one-second phases against
`dc78daad`, preserving every save field, reward and original endpoint. Rebound
only its source SHA256 in `offline-swift-current-golden.json`; canonical outcomes
are unchanged. [Replay receipt](../qa/currency-hud-001/replay.json).
Local Wisp anchor-negative settled within its original300ms ceiling and failed
the intended screen-position assertion; no deadline, test or product JS changed.
Next: rerun exact-source CI after these documentation/reference corrections;
investigate any repeated required failure before integration.

## Integrated acceptance and Android checkpoint

PR49 merged by fast-forward to exact tested source `7f149b895c9f90656bbb81766249665ed1f426fc`.
All eight applicable PR workflows and six manual release workflows passed.
Both full jobs passed220 browser executions/190 deterministic scenarios plus
separate isolated offline jobs. [Candidate readiness](../qa/currency-hud-001/candidate-readiness.json)
and [integrated gates](../qa/currency-hud-001/release-readiness.json) retain job/step receipts;
scenario summaries retain the original output. No test/deadline was weakened.
Local Brave157.1.99.57/Node24.22.1; broad CI Node24.19.0/Chrome157.0.8103.50.

Unpublished signed candidate [43578599508](https://github.com/xariib/Lumenfall/actions/runs/43578599508)
builds the same exact commit. Build, identity/assets/security, signed upgrade,
save retention and in-app updater passed. Its first retail-image normal-launch
check failed: UIAutomator reported null-root/idle errors, and its dump exposed
only background/toast although the retained screenshot shows a visibly running
game with the new currency HUD. Cause is unproven; this is not a passing check.
Complete raw [first-failure evidence](../qa/currency-hud-001/android-first-failure/files.json)
and workflow/artifact receipts are retained. Same-source failed-job retry was
requested with unchanged checks and deadlines; it must pass before publication.

The candidate build runs in parallel without publication. If it passes, reuse
its immutable signed artifact after rechecking exact integrated main and running
the existing `release-ci-gate.cjs` and `android-release-version.cjs --check-published`
guards, native upgrade/updater/retail receipts and exact packaged bytes. This
avoids a second build while preserving every publication gate. No workflow changed.
Next: inspect the unchanged retry, publish only after all required guards pass,
verify anonymous versioned/latest bytes and update this record. Physical-phone,
exact WebView60/TalkBack/human acceptance remain open; do not archive.
